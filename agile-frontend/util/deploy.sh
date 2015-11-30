#!/bin/bash

#git pull origin yaswanth

#sh tpl.sh

#java -jar precompile.jar ../WebContent/tpl ../../../tmp/handlebars ../WebContent/tpl/min/precompiled


java -jar precompile.jar ../WebContent/flatfull/tpl ../../../tmp/handlebars ../WebContent/tpl/min/precompiled/flatfull


sh yui.sh

sh yui-flat-full.sh

sh tpl.sh

sh tpl-flatfull.sh

sh lib-minifier.sh

#sh ../../appengine-java-sdk-1.8.6/appengine-java-sdk-1.8.6/bin/appcfg.sh -A agilecrmbeta -V sandbox --enable_jar_classes update ../war

#sh ../../appengine-java-sdk-1.8.6/appengine-java-sdk-1.8.6/bin/appcfg.sh --oauth2 --enable_jar_classes update ../war

#echo Code synced Sandbox version | mail -s "Code synced - Sandbox version" developers@agilecrm.com qa@agilecrm.com
#git checkout Sandbox_master
#git merge yaswanth
#git push origin Sandbox_master
