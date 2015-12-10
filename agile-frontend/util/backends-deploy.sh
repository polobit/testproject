#!bin/bash

git checkout development

git checkout ../



git pull origin development

sh ../../appengine-java-sdk-1.8.6/appengine-java-sdk-1.8.6/bin/appcfg.sh --enable_jar_classes backends ../war update b1

#sh ../../appengine-java-sdk-1.8.6/appengine-java-sdk-1.8.6/bin/appcfg.sh --enable_jar_classes backends ../war update bulk

#sh ../../appengine-java-sdk-1.8.6/appengine-java-sdk-1.8.6/bin/appcfg.sh --enable_jar_classes backends ../war update normal

#sh ../../appengine-java-sdk-1.8.6/appengine-java-sdk-1.8.6/bin/appcfg.sh --enable_jar_classes backends ../war update b1-sandbox
