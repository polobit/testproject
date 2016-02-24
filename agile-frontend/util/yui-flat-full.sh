
cat ../WebContent/flatfull/jscore/backbone/*.js > ../WebContent/jscore/min/flatfull/js-all-min.js

cat $(find ../WebContent/flatfull/controllers ! -path ../WebContent/flatfull/controllers/app.js -name "*.js") >> ../WebContent/jscore/min/flatfull/js-all-min.js


## Not path is set to avoid duplicating backbone js files that is already included and min files that should not be include again jscore.
cat $(find ../WebContent/flatfull/jscore ! -path ../WebContent/flatfull/jscore/backbone/\*.js ! -path  ../WebContent/flatfull/jscore/min/*.js \
	! -path  ../WebContent/flatfull/jscore/min/flatfull/\*.js \
	! -path ../WebContent/flatfull/jscore/social-suite/\*.js -name "*.js" 
	) >> ../WebContent/jscore/min/flatfull/js-all-min.js

# Portelts not required as it is first page.
# cat ../WebContent/flatfull/jscore/portlets/*.js > ../WebContent/jscore/min/flatfull/portlets-min.js

## Social suite into templates
cat ../WebContent/flatfull/jscore/social-suite/*.js > ../WebContent/jscore/min/flatfull/social-suite-all-min.js
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/flatfull/social-suite-all-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/flatfull/social-suite-all-min.js
cat ../WebContent/tpl/min/precompiled/flatfull/socialsuite.js >  ../WebContent/tpl/min/precompiled/flatfull/socialsuite-all.js
cat ../WebContent/jscore/min/flatfull/social-suite-all-min.js >> ../WebContent/tpl/min/precompiled/flatfull/socialsuite-all.js
#rm ../WebContent/tpl/min/precompiled/flatfull/temp.js


## Webrules into templates
#cat ../WebContent/flatfull/jscore/web-rules/*.js > ../WebContent/jscore/min/flatfull/web-rules-min.js
#java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/flatfull/web-rules-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/flatfull/web-rules-min.js
#cat ../WebContent/jscore/min/flatfull/web-rules-min.js >> ../WebContent/tpl/min/precompiled/flatfull/web-rules.js

cat ../WebContent/flatfull/controllers/app.js >> ../WebContent/jscore/min/flatfull/js-all-min.js

cat ../WebContent/stats/js/*.js > ../WebContent/stats/min/agile-min.js

java -jar yuicompressor-2.4.7.jar ../WebContent/stats/min/agile-min.js --type js -o  ../WebContent/stats/min/agile-min.js


java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/flatfull/js-all-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/flatfull/js-all-min.js



#java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/flatfull/portlets-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/flatfull/portlets-min.js












#java -jar yuicompressor-2.4.7.jar ../WebContent/css/agilecrm.css --type css -o  ../WebContent/css/agilecrm.css


#cat ../WebContent/flatfull/css/misc/*.css > ../WebContent/flatfull/css/misc/min/agilecrm-misc.css

#java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/misc/min/agilecrm-misc.css --type css -o  ../WebContent/flatfull/css/misc/min/agilecrm-misc-min.css

#java -jar yuicompressor-2.4.7.jar ../WebContent/tpl/min/precompiled/tpl.html --type css -o  ../WebContent/tpl/min/precompiled/tpl.html

#find ../WebContent/flatfull/widgets/*.js -prune | while read f; do (echo "$f"; java -jar yuicompressor-2.4.7.jar "$f" --type js -o "$f"); done 

#find ../WebContent/tpl/min/precompiled/*.html -prune | while read htmlFile; do java -jar yuicompressor-2.4.7.jar "$htmlFile" --type css -o "$htmlFile"; done
