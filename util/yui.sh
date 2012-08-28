#! /bin/bash

cd /Users/manohar/Documents/workspace/AgileCRM/war/
cat jscore/*.js controllers/*.js  util.js > /tmp/all.js

vars=$#;

if [ $vars -eq "1" ] ;
then 
	java -jar /Users/manohar/Documents/workspace/AgileCRM/util/yuicompressor-2.4.7.jar /tmp/all.js -o js-all-min.js
else
	cp /tmp/all.js js-all-min.js
fi
