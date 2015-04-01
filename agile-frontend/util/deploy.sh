#!/bin/bash

#git pull origin yaswanth

#sh tpl.sh

java -jar precompile.jar /home/yaswanth/Documents/Work-Agile/Projects/AgileCRM-Modules/agile-frontend/WebContent/tpl /home/yaswanth/Documents/tmp/handlebars /home/yaswanth/Documents/Work-Agile/Projects/AgileCRM-Modules/agile-frontend/WebContent/tpl/min/precompiled

sh yui.sh

sh tpl.sh

#sh ../../appengine-java-sdk-1.8.6/appengine-java-sdk-1.8.6/bin/appcfg.sh -A agilecrmbeta -V sandbox --enable_jar_classes update ../war

#sh ../../appengine-java-sdk-1.8.6/appengine-java-sdk-1.8.6/bin/appcfg.sh --oauth2 --enable_jar_classes update ../war

#echo Code synced Sandbox version | mail -s "Code synced - Sandbox version" developers@agilecrm.com qa@agilecrm.com
#git checkout Sandbox_master
#git merge yaswanth
#git push origin Sandbox_master

