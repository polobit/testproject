#!/bin/bash

cat ../WebContent/flatfull/jscore/backbone/*.js > ../WebContent/jscore/min/flatfull/js-all-min.js

cat $(find ../WebContent/flatfull/controllers ! -path ../WebContent/flatfull/controllers/app.js -name "*.js") >> ../WebContent/jscore/min/flatfull/js-all-min.js


## Not path is set to avoid duplicating backbone js files that is already included and min files that should not be include again jscore.
cat $(find ../WebContent/flatfull/jscore ! -path ../WebContent/flatfull/jscore/backbone/\*.js ! -path  ../WebContent/flatfull/jscore/min/*.js ! -path  ../WebContent/flatfull/jscore/min/flatfull/*.js -name "*.js") >> ../WebContent/jscore/min/flatfull/js-all-min.js

cat ../WebContent/flatfull/controllers/app.js >> ../WebContent/jscore/min/flatfull/js-all-min.js

cat ../WebContent/stats/js/*.js > ../WebContent/stats/min/agile-min.js

java -jar yuicompressor-2.4.7.jar ../WebContent/stats/min/agile-min.js --type js -o  ../WebContent/stats/min/agile-min.js

#java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/jscore/min/js-all-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/flatfull/js-all-min.js

#java -jar yuicompressor-2.4.7.jar ../WebContent/css/agilecrm.css --type css -o  ../WebContent/css/agilecrm.css

#java -jar yuicompressor-2.4.7.jar ../WebContent/tpl/min/precompiled/tpl.html --type css -o  ../WebContent/tpl/min/precompiled/tpl.html

find ../WebContent/flatfull/widgets/*.js -prune | while read f; do (echo "$f"; java -jar yuicompressor-2.4.7.jar "$f" --type js -o "$f"); done 

#find ../WebContent/tpl/min/precompiled/*.html -prune | while read htmlFile; do java -jar yuicompressor-2.4.7.jar "$htmlFile" --type css -o "$htmlFile"; done




##java -jar 

