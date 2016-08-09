## Start Minification ##
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/$1/js-all-min-1.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/$1/js-all-min-1.js
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/$1/js-all-min-2.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/$1/js-all-min-2.js
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/$1/js-all-min-3.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/$1/js-all-min-3.js
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/$1/js-all-min-4.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/$1/js-all-min-4.js

# Helpcenter
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/$1/helpcenter-all-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/$1/helpcenter-all-min.js

# Socialsuite
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/$1/social-suite-all-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/$1/social-suite-all-min.js

# Tickets
java -jar yuicompressor-2.4.7.jar ../WebContent/jscore/min/locales/$1/tickets-min.js --line-break 10000 --type js -o  ../WebContent/jscore/min/locales/$1/tickets-min.js
##End of Minification ##