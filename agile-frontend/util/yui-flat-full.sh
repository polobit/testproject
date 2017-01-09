rm ../WebContent/jscore/min/flatfull/*.js

cat ../WebContent/flatfull/jscore/backbone/*.js > ../WebContent/jscore/min/flatfull/js-all-min-1.js

cat $(find ../WebContent/flatfull/controllers ! -path ../WebContent/flatfull/controllers/app.js -name "*.js") >> ../WebContent/jscore/min/flatfull/js-all-min-1.js

# Add dependency files and prerequisites to js-all-min-1.js
cat $(find ../WebContent/flatfull/prereq -name "*.js") >> ../WebContent/jscore/min/flatfull/js-all-min-1.js

## Not path is set to avoid duplicating backbone js files that is already included and min files that should not be include again jscore.
find ../WebContent/flatfull/jscore ! -path ../WebContent/flatfull/jscore/backbone/\*.js ! -path  ../WebContent/flatfull/jscore/min/*.js \
	! -path  ../WebContent/flatfull/jscore/min/flatfull/\*.js \
	! -path  ../WebContent/flatfull/jscore/tickets/\*.js \
	! -path ../WebContent/flatfull/jscore/social-suite/\*.js -name "*.js" > js-file-list

# Push 75 files into each of js-all-min-1.js, js-all-min-2.js and js-all-min-3.js
# To add more files or change the number of files in every js-all-min, make appropriate changes here.
cat $(awk 'NR>=1 && NR<=75 {print}' js-file-list) > ../WebContent/jscore/min/flatfull/js-all-min-2.js
cat $(awk 'NR>=76 && NR<=150 {print}' js-file-list) > ../WebContent/jscore/min/flatfull/js-all-min-3.js
cat $(awk 'NR>=151 {print}' js-file-list) > ../WebContent/jscore/min/flatfull/js-all-min-4.js

rm js-file-list

# Portelts not required as it is first page.
# cat ../WebContent/flatfull/jscore/portlets/*.js > ../WebContent/jscore/min/flatfull/portlets-min.js

## Social suite into templates
cat ../WebContent/flatfull/jscore/social-suite/*.js > ../WebContent/jscore/min/flatfull/social-suite-all-min.js
#rm ../WebContent/tpl/min/precompiled/flatfull/temp.js

## Tickets module min file
cat ../WebContent/flatfull/jscore/tickets/base-model/*.js ../WebContent/flatfull/jscore/tickets/*.js > ../WebContent/jscore/min/flatfull/tickets-min.js

cat ../WebContent/flatfull/controllers/app.js >> ../WebContent/jscore/min/flatfull/js-all-min-4.js

# Stats
if [ -e ../WebContent/stats/min/agile-min.js ]; then
    rm ../WebContent/stats/min/agile-min.js
fi
cat $(find ../WebContent/stats/js ! -path ../WebContent/stats/js/agile-on-load.js -name "*.js") > ../WebContent/stats/min/agile-min.js
cat ../WebContent/stats/js/agile-on-load.js >> ../WebContent/stats/min/agile-min.js
#Minify
java -jar yuicompressor-2.4.7.jar ../WebContent/stats/min/agile-min.js --type js -o  ../WebContent/stats/min/agile-min.js
java -jar yuicompressor-2.4.7.jar ../WebContent/stats/agile-cloud-unmin.js --type js -o  ../WebContent/stats/min/agile-cloud.js
# End of stats

echo 'Minifying helpcenter files...'
cat ../WebContent/flatfull/jscore/backbone/*.js > ../WebContent/jscore/min/flatfull/helpcenter-all-min.js
cat $(find ../WebContent/helpcenter/controllers ! -path ../WebContent/helpcenter/controllers/app.js -name "knowledgebase-router.js") >> ../WebContent/jscore/min/flatfull/helpcenter-all-min.js
cat ../WebContent/flatfull/prereq/*.js ../WebContent/flatfull/jscore/form/*.js ../WebContent/flatfull/jscore/handlebars/*.js >> ../WebContent/jscore/min/flatfull/helpcenter-all-min.js
cat ../WebContent/helpcenter/jscore/*.js >> ../WebContent/jscore/min/flatfull/helpcenter-all-min.js
cat ../WebContent/helpcenter/controllers/app.js >> ../WebContent/jscore/min/flatfull/helpcenter-all-min.js
#End of Helpcenter

#email builder files
mkdir ../WebContent/misc/emailbuilder/build
if [ -e ../WebContent/misc/emailbuilder/build/emailbuilder.min.js ]; then
    rm ../WebContent/misc/emailbuilder/build/emailbuilder.min.js
fi
cat ../WebContent/misc/emailbuilder/js/*.js >> ../WebContent/misc/emailbuilder/build/emailbuilder.min.js
java -jar yuicompressor-2.4.7.jar ../WebContent/misc/emailbuilder/build/emailbuilder.min.js --type js -o  ../WebContent/misc/emailbuilder/build/emailbuilder.min.js

#Localize and Minify
if [ -n "$1" ]; then
    echo "not empty"
    java -jar agilelocalize.jar ../WebContent/jscore/min/flatfull ../WebContent/jscore/min $1
    sh yui-minifier.sh $1
else
    echo "empty"
    java -jar agilelocalize.jar ../WebContent/jscore/min/flatfull ../WebContent/jscore/min en
    sh yui-minifier.sh en
fi
