#!/bin/sh
sh sync-zip.sh
chmod 400 $EC2_PERMISSIONS
if [ "$2" = true ] ; then
	scp -i $EC2_PERMISSIONS -r agile-ec2-sync-temp/sync.zip ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/app/$1/
	ssh -i $EC2_PERMISSIONS ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com "unzip -o cdn/app/$1/sync.zip -d cdn/app/$1/"
	echo "Updated production version : $1"
else
	echo "Beta update - version: $1"
	scp -i $EC2_PERMISSIONS -r agile-ec2-sync-temp/sync.zip ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/beta/$1/
	ssh -i $EC2_PERMISSIONS ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com "unzip -o cdn/beta/$1/sync.zip -d cdn/beta/$1/"
fi;
#rm -r agile-ec2-sync-temp
