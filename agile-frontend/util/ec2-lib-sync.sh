#!/bin/sh

if [ "$2" = true ] ; then
	scp -i $EC2_PERMISSIONS ../WebContent/jscore/min/flatfull/js-all-min.js ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/app/$1/jscore/min/flatfull/
	scp -i $EC2_PERMISSIONS -r ../WebContent/tpl/min/precompiled/flatfull/ ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/app/$1/tpl/min/precompiled/
else
	echo "Beta update"
	scp -i $EC2_PERMISSIONS -r ../WebContent/jscore/min/flatfull/ ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/beta/$1/jscore/min/
	scp -i $EC2_PERMISSIONS -r ../WebContent/tpl/min/precompiled/flatfull/ ec2-user@ec2-54-210-171-176.compute-1.amazonaws.com:~/cdn/beta/$1/tpl/min/precompiled/
fi;

