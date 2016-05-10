cat js/*.js > min/gadget.js 
cat js/event-handler/*.js >> min/gadget.js 
java -jar ~/home/agile/Documents/agilecrm/util/yuicompressor-2.4.7.jar min/gadget.js -o min/gadget.min.js
