#!/bin/bash

#git pull origin yaswanth

#sh tpl.sh

#java -jar precompile.jar ../WebContent/tpl ../../../tmp/handlebars ../WebContent/tpl/min/precompiled

##Localization language support

## declare an array variable (Ex : ("en" "sp" "fn"))
declare -a agile_languages=("en" "es" "it" "ru" "fr")
rm agile-precompile.sh
echo "Preparing for precompilation for all languages"
## now loop through the above array
for i in "${agile_languages[@]}"
do
   echo "$i"
   # or do whatever with individual element of the array
   java -jar agilelocalize.jar ../WebContent/flatfull/tpl ../WebContent/tpl/localestmp "$i"
   java -jar agilelocalize.jar ../WebContent/helpcenter/helpcenter-tpl ../WebContent/tpl/localestmp "$i"

   ##precompilation
   mkdir ../WebContent/tpl/min/precompiled/locales
   mkdir ../WebContent/tpl/min/precompiled/locales/"$i"
   java -jar precompile.jar ../WebContent/tpl/localestmp/locales/"$i" ../../../tmp/handlebars ../WebContent/tpl/min/precompiled/locales/"$i"
   sh yui-flat-full.sh "$i"
   sh tpl-flatfull.sh "$i"
done


#java -jar precompile.jar ../WebContent/flatfull/tpl ../../../tmp/handlebars ../WebContent/tpl/min/precompiled/flatfull
java -jar precompile.jar ../WebContent/helpcenter/helpcenter-tpl ../../../tmp/handlebars ../WebContent/tpl/min/precompiled/flatfull
echo "Precompilation started"
sh agile-precompile.sh
echo "Precompilation completed"
rm agile-precompile.sh
#Delete locales
rm -r ../WebContent/tpl/localestmp
##End of localization support


#sh yui.sh

#sh tpl.sh

#sh tpl-flatfull.sh

#sh yui-flat-full.sh

sh lib-minifier.sh

#sh ../../appengine-java-sdk-1.8.6/appengine-java-sdk-1.8.6/bin/appcfg.sh -A agilecrmbeta -V sandbox --enable_jar_classes update ../war

#sh ../../appengine-java-sdk-1.8.6/appengine-java-sdk-1.8.6/bin/appcfg.sh --oauth2 --enable_jar_classes update ../war

#echo Code synced Sandbox version | mail -s "Code synced - Sandbox version" developers@agilecrm.com qa@agilecrm.com
#git checkout Sandbox_master
#git merge yaswanth
#git push origin Sandbox_master
