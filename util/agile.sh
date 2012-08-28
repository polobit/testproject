#! /bin/bash

cd /Users/manohar/Documents/workspace/AgileCRM/war/
cat stats/*.js > /tmp/stats.js

vars=$#;

if [ $vars -eq "1" ] ;
then 
	java -jar /Users/manohar/Documents/workspace/AgileCRM/util/yuicompressor-2.4.7.jar /tmp/stats.js -o stats/min/agile-min.js
else
	cp /tmp/stats.js stats/min/agile-min.js
fi

#cd /Users/manohar/manohar/aws
#./scp-node.sh
