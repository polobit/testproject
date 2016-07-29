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

## Webrules into templates
#cat ../WebContent/flatfull/jscore/web-rules/*.js > ../WebContent/jscore/min/flatfull/web-rules-min.js
#java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/flatfull/web-rules-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/flatfull/web-rules-min.js
#cat ../WebContent/jscore/min/flatfull/web-rules-min.js >> ../WebContent/tpl/min/precompiled/flatfull/web-rules.js

cat ../WebContent/flatfull/controllers/app.js >> ../WebContent/jscore/min/flatfull/js-all-min-4.js

cat ../WebContent/stats/js/*.js > ../WebContent/stats/min/agile-min.js

java -jar yuicompressor-2.4.7.jar ../WebContent/stats/min/agile-min.js --type js -o  ../WebContent/stats/min/agile-min.js

echo 'Minifying helpcenter files...'
cat ../WebContent/flatfull/jscore/backbone/*.js > ../WebContent/jscore/min/flatfull/helpcenter-all-min.js
cat $(find ../WebContent/helpcenter/controllers ! -path ../WebContent/helpcenter/controllers/app.js -name "knowledgebase-router.js") >> ../WebContent/jscore/min/flatfull/helpcenter-all-min.js
cat ../WebContent/flatfull/jscore/form/*.js ../WebContent/flatfull/jscore/handlebars/*.js >> ../WebContent/jscore/min/flatfull/helpcenter-all-min.js
cat ../WebContent/helpcenter/jscore/*.js >> ../WebContent/jscore/min/flatfull/helpcenter-all-min.js
cat ../WebContent/helpcenter/controllers/app.js >> ../WebContent/jscore/min/flatfull/helpcenter-all-min.js
#End of Helpcenter

#Localize
java -jar agilelocalize.jar ../WebContent/jscore/min/flatfull ../WebContent/jscore/min en,es

#Minify tickets
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/flatfull/tickets-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/flatfull/tickets-min.js

########################################### En Changes #######
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/en/js-all-min-1.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/en/js-all-min-1.js

java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/en/js-all-min-2.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/en/js-all-min-2.js

java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/en/js-all-min-3.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/en/js-all-min-3.js

java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/en/js-all-min-4.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/en/js-all-min-4.js

java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/en/helpcenter-all-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/en/helpcenter-all-min.js

#Minify socialsuite
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/en/social-suite-all-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/en/social-suite-all-min.js

#Minify tickets
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/en/tickets-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/en/tickets-min.js

########################################### En Changes #######
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/es/js-all-min-1.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/es/js-all-min-1.js

java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/es/js-all-min-2.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/es/js-all-min-2.js

java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/es/js-all-min-3.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/es/js-all-min-3.js

java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/es/js-all-min-4.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/es/js-all-min-4.js

java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/es/helpcenter-all-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/es/helpcenter-all-min.js

#Minify socialsuite
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/es/social-suite-all-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/es/social-suite-all-min.js

#Minify tickets
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/es/tickets-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/es/tickets-min.js

################################## End of En Changes #######