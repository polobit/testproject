#!/bin/bash

rm -r ../WebContent/flatfull/final-lib/min

mkdir ../WebContent/flatfull/final-lib/min

# js lib files
cat $(find ../WebContent/flatfull/final-lib/ -iname *.js ! -path ../WebContent/flatfull/final-lib/min/*.js | sort) >../WebContent/flatfull/final-lib/min/lib-all-min.js 

java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/final-lib/min/lib-all-min.js --type js -o  ../WebContent/flatfull/final-lib/min/lib-all-min.js
java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/final-lib/min/lib-all-min.js --type js -o  ../WebContent/flatfull/final-lib/min/lib-all-min-1.js
java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/final-lib/min/lib-all-min.js --type js -o  ../WebContent/flatfull/final-lib/min/lib-all-min-2.js

rm -r ../WebContent/flatfull/css/min/*.css

mkdir ../WebContent/flatfull/css/min/

## CSS files
cat ../WebContent/flatfull/css/final-lib/*.css > ../WebContent/flatfull/css/min/lib-all.css
cat ../WebContent/flatfull/css/final-lib/*.css > ../WebContent/flatfull/css/min/lib-all-new.css
cat ../WebContent/flatfull/css/core/*.css > ../WebContent/flatfull/css/min/core-all.css 
cat ../WebContent/flatfull/css/core/*.css > ../WebContent/flatfull/css/min/core-all-new.css 
cat ../WebContent/flatfull/css/misc/*.css > ../WebContent/flatfull/css/min/misc-all.css
cat ../WebContent/flatfull/css/misc/*.css > ../WebContent/flatfull/css/min/misc-all-new.css

## Combil all CSS for fast load
cat ../WebContent/flatfull/css/min/lib-all-new.css ../WebContent/flatfull/css/min/core-all-new.css ../WebContent/flatfull/css/min/misc-all-new.css > ../WebContent/flatfull/css/min/css-all-min.css


java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/lib-all.css --type css -o  ../WebContent/flatfull/css/min/lib-all.css --charset utf-8
java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/lib-all-new.css --type css -o  ../WebContent/flatfull/css/min/lib-all-new.css --charset utf-8

java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/core-all.css  --type css -o  ../WebContent/flatfull/css/min/core-all.css  --charset utf-8
java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/core-all-new.css  --type css -o  ../WebContent/flatfull/css/min/core-all-new.css  --charset utf-8

java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/misc-all.css --type css -o  ../WebContent/flatfull/css/min/misc-all.css  --charset utf-8
java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/misc-all-new.css --type css -o  ../WebContent/flatfull/css/min/misc-all-new.css  --charset utf-8

java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/css-all-min.css --type css -o  ../WebContent/flatfull/css/min/css-all-min.css  --charset utf-8
