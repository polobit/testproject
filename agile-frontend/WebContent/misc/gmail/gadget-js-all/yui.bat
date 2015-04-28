type js\*.js > min\gadget.js 
type js\event-handler\*.js >> min\gadget.js
java -jar C:\SaiWorkSpace\agile-java-server\util\yuicompressor-2.4.7.jar min\gadget.js -o min\gadget.min.js
cd C:\SaiWorkSpace\agile-java-server\agile-frontend\WebContent\stats
type js\*.js > min\temp.js 
java -jar C:\SaiWorkSpace\agile-java-server\util\yuicompressor-2.4.7.jar min\temp.js -o min\agile-min.js
cd C:\SaiWorkSpace\agile-java-server\agile-frontend\WebContent\misc\gmail\gadget-js-all