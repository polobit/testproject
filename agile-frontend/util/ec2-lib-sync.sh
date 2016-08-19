#!/bin/sh

if [ "$2" = true ] ; then
	scp -i $EC2_PERMISSIONS -r ../WebContent/jscore/min/flatfull/ ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/app/$1/jscore/min/
	scp -i $EC2_PERMISSIONS -r ../WebContent/jscore/min/locales/ ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/app/$1/jscore/min/
	scp -i $EC2_PERMISSIONS -r ../WebContent/tpl/min/precompiled/flatfull/ ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/app/$1/tpl/min/precompiled/
	scp -i $EC2_PERMISSIONS -r ../WebContent/tpl/min/precompiled/locales/ ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/app/$1/tpl/min/precompiled/
	echo "Updated production version : $1"
else
	echo "Beta update - version: $1"
	scp -i $EC2_PERMISSIONS -r ../WebContent/jscore/min/flatfull/ ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/beta/$1/jscore/min/
	scp -i $EC2_PERMISSIONS -r ../WebContent/jscore/min/locales/ ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/beta/$1/jscore/min/
	scp -i $EC2_PERMISSIONS -r ../WebContent/tpl/min/precompiled/flatfull/ ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/beta/$1/tpl/min/precompiled/
	scp -i $EC2_PERMISSIONS -r ../WebContent/tpl/min/precompiled/locales/ ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/beta/$1/tpl/min/precompiled/locales/
fi;
