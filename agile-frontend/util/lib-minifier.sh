#!/bin/bash

# js lib files
cat $(find ../WebContent/flatfull/final-lib/ -iname *.js ! -path ../WebContent/flatfull/final-lib/min/*.js | sort) >../WebContent/flatfull/final-lib/min/lib-all-min.js 

java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/final-lib/min/lib-all-min.js --type js -o  ../WebContent/flatfull/final-lib/min/lib-all-min.js


## CSS files
cat ../WebContent/flatfull/css/final-lib/*.css > ../WebContent/flatfull/css/min/lib-all.css
cat ../WebContent/flatfull/css/core/*.css > ../WebContent/flatfull/css/min/core-all.css 
cat ../WebContent/flatfull/css/misc/*.css > ../WebContent/flatfull/css/min/misc-all.css

java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/lib-all.css --type css -o  ../WebContent/flatfull/css/min/lib-all.css --charset utf-8

java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/core-all.css  --type css -o  ../WebContent/flatfull/css/min/core-all.css  --charset utf-8

java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/misc-all.css --type css -o  ../WebContent/flatfull/css/min/misc-all.css  --charset utf-8
