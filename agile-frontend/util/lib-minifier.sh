#!/bin/bash

rm -r ../WebContent/flatfull/final-lib/min

mkdir ../WebContent/flatfull/final-lib/min

# js lib files

cat $(find ../WebContent/flatfull/final-lib/final-lib-1 -iname *.js | sort) >../WebContent/flatfull/final-lib/min/lib-all-new-1.js 

cat $(find ../WebContent/flatfull/final-lib/final-lib-2 -iname *.js  | sort) >../WebContent/flatfull/final-lib/min/lib-all-new-2.js 

java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/final-lib/min/lib-all-new-1.js --type js -o  ../WebContent/flatfull/final-lib/min/lib-all-new-1.js
java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/final-lib/min/lib-all-new-2.js --type js -o  ../WebContent/flatfull/final-lib/min/lib-all-new-2.js
cp ../WebContent/flatfull/lib/backbone-min.js ../WebContent/flatfull/final-lib/min/
rm -r ../WebContent/flatfull/css/min/*.css

mkdir ../WebContent/flatfull/css/min

## CSS files
cat ../WebContent/flatfull/css/final-lib/*.css > ../WebContent/flatfull/css/min/lib-all.css
cat ../WebContent/flatfull/css/final-lib/*.css > ../WebContent/flatfull/css/min/lib-all-new.css
cat ../WebContent/flatfull/css/core/*.css > ../WebContent/flatfull/css/min/core-all.css 
cat ../WebContent/flatfull/css/core/*.css > ../WebContent/flatfull/css/min/core-all-new.css 
cat ../WebContent/flatfull/css/misc/*.css > ../WebContent/flatfull/css/min/misc-all.css
cat ../WebContent/flatfull/css/misc/*.css > ../WebContent/flatfull/css/min/misc-all-new.css

## New theme
mkdir ../WebContent/flatfull/css/material-theme/min
rm ../WebContent/flatfull/css/material-theme/min/agile-theme-15.css
#cat ../WebContent/flatfull/css/material-theme/icon/material-icons.css > ../WebContent/flatfull/css/material-theme/min/agile-theme-15.css
cat ../WebContent/flatfull/css/material-theme/css/style.css >> ../WebContent/flatfull/css/material-theme/min/agile-theme-15.css
cat ../WebContent/flatfull/css/material-theme/css/agile-theme.css >> ../WebContent/flatfull/css/material-theme/min/agile-theme-15.css
#lessc ../WebContent/flatfull/css/material-theme/css/agile-theme.less ../WebContent/flatfull/css/material-theme/css/agile-theme.css
lessc ../WebContent/flatfull/css/material-theme/css/dynamic-colors.less ../WebContent/flatfull/css/material-theme/css/dynamic-colors.css
cat ../WebContent/flatfull/css/material-theme/css/dynamic-colors.css >> ../WebContent/flatfull/css/material-theme/min/agile-theme-15.css
rm ../WebContent/flatfull/css/material-theme/css/dynamic-colors.css
## Combil all CSS for fast load
cat ../WebContent/flatfull/css/min/lib-all-new.css ../WebContent/flatfull/css/min/core-all-new.css ../WebContent/flatfull/css/min/misc-all-new.css > ../WebContent/flatfull/css/min/css-all-min.css

#emailbuilder files
cat ../WebContent/misc/emailbuilder/css/*.css >> ../WebContent/misc/emailbuilder/build/emailbuilder.min.css
java -jar yuicompressor-2.4.7.jar ../WebContent/misc/emailbuilder/build/emailbuilder.min.css --type css -o  ../WebContent/misc/emailbuilder/build/emailbuilder.min.css


java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/lib-all.css --type css -o  ../WebContent/flatfull/css/min/lib-all.css --charset utf-8
java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/lib-all-new.css --type css -o  ../WebContent/flatfull/css/min/lib-all-new.css --charset utf-8

java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/core-all.css  --type css -o  ../WebContent/flatfull/css/min/core-all.css  --charset utf-8
java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/core-all-new.css  --type css -o  ../WebContent/flatfull/css/min/core-all-new.css  --charset utf-8

java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/misc-all.css --type css -o  ../WebContent/flatfull/css/min/misc-all.css  --charset utf-8
java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/misc-all-new.css --type css -o  ../WebContent/flatfull/css/min/misc-all-new.css  --charset utf-8

java -jar yuicompressor-2.4.7.jar ../WebContent/flatfull/css/min/css-all-min.css --type css -o  ../WebContent/flatfull/css/min/css-all-min.css  --charset utf-8
