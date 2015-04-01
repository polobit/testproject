#handlebars tpl/search.handlebars -f tpl/min/search.js
#handlebars tpl/getting-started.handlebars -f tpl/min/getting-started.js
handlebars tpl/*.handlebars -f tpl/min/tpl.js
#rm tpl/min/tpl.js
#cat tpl/min/*.js > tpl/min/tpl.js
