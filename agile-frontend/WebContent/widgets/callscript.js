$(function(){CallScript_PLUGIN_NAME="CallScript";CALLSCRIPT_LOGS_LOAD_IMAGE='<center><img id="logs_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';if(App_Widgets.Catalog_Widgets_View){var b=App_Widgets.Catalog_Widgets_View.collection.where({name:CallScript_PLUGIN_NAME})[0].toJSON()}else{var b=agile_crm_get_widget(CallScript_PLUGIN_NAME)}CallScript_Plugin_Id=b.id;if(b.prefs==undefined||b.prefs=="{}"){$("#CallScript").html("Welcome to CallScript");return}var a=JSON.parse(b.prefs);_agile_contact=agile_crm_get_contact();_agile_execute_callscriptrules(a.csrules)});function _agile_execute_callscriptrules(a){for(var b=0;b<a.length;b++){if(_agile_execute_callscriptrule(a[b])){console.log("condition applied");return}}$("#CallScript").html("No matching call script found.")}function _agile_execute_callscriptrule(d){var a=d.rules.length;for(var b=0;b<a;b++){var e=d.rules[b];if(!_agile_check_condition(e)){console.log("not matched: ");return false}}var c=replaceMergeFields(d.displaytext);$("#CallScript").html(c);return true}function replaceMergeFields(f){var l=f;var d=[];var g=/\{{(.*?)\}}/g;var e;while((e=g.exec(f))!=null){d.push(e[1])}var b=0;for(var c=0;c<d.length;c++){var a=_agile_contact.properties.length;for(var h=0;h<a;h++){if(_agile_contact.properties[h].name==d[c]){l=l.replace("{{"+d[c]+"}}",_agile_contact.properties[h].value);b++}}}while(b!=d.length){var e;while((e=g.exec(l))!=null){l=l.replace(e[0],"");b++}}return l}function _agile_check_condition(a){switch(a.LHS){case"tags":switch(a.CONDITION){case"EQUALS":return _agile_rules.tags_in(a);case"NOTEQUALS":return _agile_rules.tags_out(a)}break;case"tags_time":return _agile_rules.tags_time(a);case"created_time":return _agile_rules.contact_time(a);case"title":switch(a.CONDITION){case"EQUALS":return _agile_rules.contact_properties_in(a);case"NOTEQUALS":return _agile_rules.contact_properties_out(a)}break;case"company":switch(a.CONDITION){case"EQUALS":return _agile_rules.contact_properties_in(a);case"NOTEQUALS":return _agile_rules.contact_properties_out(a)}break;case"lead_score":switch(a.CONDITION){case"IS_LESS_THAN":return _agile_rules.max_score(a);case"IS_GREATER_THAN":return _agile_rules.min_score(a);case"EQUALS":return _agile_rules.score(a)}break;case"visitor":switch(a.CONDITION){case"KNOWN":return _agile_rules.is_known_visitor(a);case"UNKNOWN":return _agile_rules.is_unknown_visitor(a)}break;case"owner_id":switch(a.CONDITION){case"EQUALS":return _agile_rules.owner_is(a);case"NOTEQUALS":return _agile_rules.owner_is_not(a)}break;default:switch(a.CONDITION){case"EQUALS":return _agile_rules.contact_properties_in(a);case"NOTEQUALS":return _agile_rules.contact_properties_out(a);case"MATCHES":return _agile_rules.contact_properties_match(a);case"NOT_CONTAINS":return _agile_rules.contact_properties_doesnot_match(a);default:return _agile_rules.custom_time(a)}}}var _agile_rules={tags_in:function(c){if(c.RHS&&_agile_contact){var b=_agile_contact.tags.length;for(var a=0;a<b;a++){if(c.RHS===_agile_contact.tags[a]){return true}}}},tags_out:function(d){if(!_agile_contact){return true}if(_agile_contact&&d.RHS){var b=0;var c=_agile_contact.tags.length;for(var a=0;a<c;a++){if(_agile_contact.tags[a]!==d.RHS){b++}}if(b==c&&b!==0&&c!==0){return true}}},tags_time:function(a){if(a.RHS&&_agile_contact){var i=a.RHS;var c=a.nested_lhs;var h=a.nested_rhs;var e=_agile_contact.tagsWithTime.length;for(var d=0;d<e;d++){if(i==_agile_contact.tagsWithTime[d].tag){var b=new Date().getTime();var g=(_agile_contact.tagsWithTime[d].createdTime);var f=(b-g);if((a.nested_condition=="LAST"&&(0<=f&&f<=(c*86400000)))||(a.nested_condition=="AFTER"&&(c<=g)&&((g-c)>=86400000))||(a.nested_condition=="BEFORE"&&(c>=g))||(a.nested_condition=="EQUALS"&&(0<=(g-c)&&(g-c)<=86400000))||(a.nested_condition=="BETWEEN"&&(c<=g&&g<=h))){return true}}}}},min_score:function(a){if(_agile_contact&&a.RHS&&_agile_contact.lead_score>a.RHS){return true}},max_score:function(a){if(_agile_contact&&a.RHS&&_agile_contact.lead_score<a.RHS){return true}},score:function(a){if(_agile_contact&&a.RHS&&_agile_contact.lead_score==a.RHS){return true}},referrer_is:function(a){if(a.RHS==document.referrer){return true}},referrer_matches:function(b){var a=document.referrer;if(a.indexOf(b.RHS)!==-1){return true}},referrer_not_matches:function(b){var a=document.referrer;if(a.indexOf(b.RHS)==-1){return true}},referrer_is_not:function(a){if(a.RHS!==document.referrer){return true}},page_view_is:function(a){if(a.RHS===document.location.href){return true}},page_view_is_not:function(a){if(a.RHS!==document.location.href){return true}},page_view_not_matches:function(b){var a=document.location.href;if(a.indexOf(b.RHS)==-1){return true}},page_view_matches:function(b){var a=document.location.href;if(a.indexOf(b.RHS)!==-1){return true}},contact_properties_in:function(c){if(_agile_contact&&c.RHS){var a=_agile_contact.properties.length;for(var b=0;b<a;b++){if(c.LHS==_agile_contact.properties[b].name&&c.RHS==_agile_contact.properties[b].value){return true}}}},contact_properties_out:function(d){if(_agile_contact&&d.RHS){var a=0;var b=_agile_contact.properties.length;for(var c=0;c<b;c++){if(d.LHS==_agile_contact.properties[c].name&&d.RHS!=_agile_contact.properties[c].value){return true}if(d.LHS!==_agile_contact.properties[c].name){a++}}if(a==b&&a!=0&&b!=0){return true}}},contact_time:function(f){if(_agile_contact&&f.RHS){var e=new Date().getTime();var c=(_agile_contact.created_time*1000);var a=(e-c);var d=f.RHS;var b=f.RHS_NEW;if((f.CONDITION=="LAST"&&(0<=a&&a<=(d*86400000)))||(f.CONDITION=="AFTER"&&(d<=c)&&((c-d)>=86400000))||(f.CONDITION=="BEFORE"&&(d>=c))||(f.CONDITION=="ON"&&(0<=(c-d)&&(c-d)<=86400000))||(f.CONDITION=="BETWEEN"&&(d<=c&&c<=b))){return true}}},custom_time:function(i){if(_agile_contact&&i.RHS){var f=i.RHS;var e=i.RHS_NEW;var a=_agile_contact.properties.length;for(var d=0;d<a;d++){if(i.LHS==(_agile_contact.properties[d].name+"_time")){var h=new Date().getTime();var c=_agile_contact.properties[d].value*1000;var b=(h-c);if((i.CONDITION=="LAST"&&(0<=b&&b<=(f*86400000)))||(i.CONDITION=="AFTER"&&(f<=c)&&((c-f)>=86400000))||(i.CONDITION=="BEFORE"&&(f>=c))||(i.CONDITION=="ON"&&(0<=(c-f)&&(c-f)<=86400000))||(i.CONDITION=="BETWEEN"&&(f<=c&&c<=e))){return true}}}}},owner_is:function(a){if(_agile_contact&&a.RHS&&_agile_contact.owner.id.toString()==a.RHS){return true}},owner_is_not:function(a){if(_agile_contact&&a.RHS&&_agile_contact.owner.id.toString()!==a.RHS){return true}},contact_properties_match:function(c){if(_agile_contact&&c.RHS){var a=_agile_contact.properties.length;for(var b=0;b<a;b++){if((c.LHS==_agile_contact.properties[b].name)&&_agile_contact.properties[b].value&&(_agile_contact.properties[b].value.indexOf(c.RHS)!==-1)){return true}}}},contact_properties_doesnot_match:function(e){if(_agile_contact&&e.RHS){var c=_agile_contact.properties.length;var b=0;for(var d=0;d<c;d++){if((e.LHS==_agile_contact.properties[d].name)&&_agile_contact.properties[d].value&&(_agile_contact.properties[d].value.indexOf(e.RHS)==-1)){return true}if(e.LHS!==_agile_contact.properties[d].name){b++}}if(b==c&&c!=0&&b!=0){return true}}},is_cart_empty:function(b){try{return(_agile_shopify_cart.item_count==0)}catch(a){}return false},is_cart_not_empty:function(b){try{return(_agile_shopify_cart.item_count!=0)}catch(a){}return false},cart_has_item:function(c){try{for(var a=0;a<_agile_shopify_cart.items.length;a++){if(c.RHS==_agile_shopify_cart.items[a].title){return true}}return false}catch(b){}return false},cart_value_greater_than:function(b){try{return((_agile_shopify_cart.total_price/100)>=b.RHS)}catch(a){}return false},cart_value_less_than:function(b){try{return((_agile_shopify_cart.total_price/100)<=b.RHS)}catch(a){}return false},is_mobile:function(b){try{return(_agile_is_mobile_browser()&&b.RHS=="MOBILE")}catch(a){}},is_not_mobile:function(b){try{return(!_agile_is_mobile_browser()&&b.RHS=="MOBILE")}catch(a){}},is_known_visitor:function(a){if(typeof _agile_email=="string"&&typeof _agile_contact!=="undefined"){return true}},is_unknown_visitor:function(a){if(typeof _agile_email!=="string"||typeof _agile_contact=="undefined"){return true}},once:function(a){if(!agile_read_cookie("agile-callscriptrules_v2")){return true}if(_agile_callscriptrule_get_cookie("agile-callscriptrules_v2",a.callscriptrule_id)){return false}},once_per_session:function(a){if(!agile_read_cookie("agile-session-callscriptrules_v2")){return true}if(_agile_callscriptrule_get_cookie("agile-session-callscriptrules_v2",a.callscriptrule_id)){return false}},max_of:function(b){if(!agile_read_cookie("agile-maxof-callscriptrules_v2")){return true}var a=_agile_callscriptrule_get_cookie("agile-maxof-callscriptrules_v2",b.callscriptrule_id);if(!a){return true}return(b.RHS>a.count)},once_every:function(c){if(!agile_read_cookie("agile-every-callscriptrules_v2")){return true}var a=_agile_callscriptrule_get_cookie("agile-every-callscriptrules_v2",c.callscriptrule_id);if(!a){return true}var b=a.time+c.RHS*1000*60;return(new Date().getTime()>b)},country_is:function(a){return(a.RHS==a.callscriptrule_country)},country_is_not:function(a){return(a.RHS!=a.callscriptrule_country)},ua_is:function(a){return(window.navigator.userAgent==a.RHS)},ua_is_not:function(a){return(window.navigator.userAgent!==a.RHS)},ua_contains:function(a){return(window.navigator.userAgent.indexOf(a.RHS)!=-1)},ua_not_contains:function(a){return(window.navigator.userAgent.indexOf(a.RHS)==-1)},everytime:function(a){return true}};