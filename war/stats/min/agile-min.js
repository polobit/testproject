function agile_setAccount(b,a){agile_id.set(b,a);agile_setEmailFromUrl()}function agile_setEmailFromUrl(){if(window.location.href.search("fwd=cd")!==-1){try{var a=decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]"+encodeURI("data").replace(/[\.\+\*]/g,"\\$&")+"(?:\\=([^&]*))?)?.*$","i"),"$1"));if(a){agile_guid.set_email(JSON.parse(a).email)}}catch(b){console.log(b.message)}}}var _agile={set_account:function(b,a){agile_setAccount(b,a)},set_email:function(a){agile_setEmail(a)},track_page_view:function(a){agile_trackPageview(a)},create_contact:function(a,b){agile_createContact(a,b)},get_contact:function(a,b){agile_getContact(a,b)},delete_contact:function(a,b){agile_deleteContact(a,b)},add_tag:function(b,c,a){agile_addTag(b,c,a)},remove_tag:function(b,c,a){agile_removeTag(b,c,a)},add_score:function(b,c,a){agile_addScore(b,c,a)},subtract_score:function(b,c,a){agile_subtractScore(b,c,a)},add_note:function(b,c,a){agile_addNote(b,c,a)},set_property:function(b,c,a){agile_setProperty(b,c,a)},add_task:function(b,c,a){agile_addTask(b,c,a)},add_deal:function(b,c,a){agile_addDeal(b,c,a)},get_score:function(b,a){agile_getScore(b,a)},get_tags:function(b,a){agile_getTags(b,a)},get_notes:function(b,a){agile_getNotes(b,a)},get_tasks:function(b,a){agile_getTasks(b,a)},get_deals:function(b,a){agile_getDeals(b,a)},add_campaign:function(b,c,a){agile_addCampaign(b,c,a)},get_campaigns:function(b,a){agile_getCampaigns(b,a)},get_campaign_logs:function(b,a){agile_getCampaignlogs(b,a)},get_workflows:function(a){agile_getWorkflows(a)},get_milestones:function(a){agile_getMilestones(a)},update_contact:function(b,c,a){agile_updateContact(b,c,a)},get_email:function(a){agile_getEmail(a)},create_company:function(a,b){agile_createCompany(a,b)},get_property:function(b,c,a){agile_getProperty(b,c,a)},remove_property:function(b,c,a){agile_removeProperty(b,c,a)},add_property:function(b,c,a){agile_setProperty(b,c,a)}};function agile_addCampaign(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contacts/add-campaign?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getCampaigns(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-campaigns?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_getCampaignlogs(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-campaign-logs?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_getWorkflows(b){var a=agile_id.getURL()+"/contacts/get-workflows?callback=?&id="+agile_id.get();agile_json(a,b)}function agile_createContact(a,g){var e=[];for(var f in a){if(a.hasOwnProperty(f)&&f!="tags"){e.push(agile_propertyJSON(f,a[f]))}}var d="original_ref";e.push(agile_propertyJSON(d,agile_read_cookie(agile_guid.cookie_original_ref)));var c={};c.properties=e;if(a.tags){var i=a.tags;var b=i.trim().replace("/ /g"," ");b=i.replace("/, /g",",");c.tags=b.split(",")}var h=agile_id.getURL()+"/contacts?callback=?&id="+agile_id.get()+"&contact="+encodeURIComponent(JSON.stringify(c));agile_json(h,g)}function agile_deleteContact(b,c){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contact/delete?callback=?&id="+agile_id.get()+"&email="+encodeURIComponent(b);agile_json(a,c)}function agile_getContact(b,d){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var c="email={0}".format(encodeURIComponent(b));var a=agile_id.getURL()+"/contact/email?callback=?&id="+agile_id.get()+"&"+c;agile_json(a,d)}function agile_updateContact(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contact/update?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_createCompany(e,f){var d=[];for(var c in e){if(e.hasOwnProperty(c)){d.push(agile_propertyJSON(c,e[c]))}}var b={};b.properties=d;var a=agile_id.getURL()+"/company?callback=?&id="+agile_id.get()+"&data="+encodeURIComponent(JSON.stringify(b));agile_json(a,f)}function agile_propertyJSON(a,d,c){var b={};if(c==undefined){b.type="SYSTEM"}else{b.type=c}b.name=a;b.value=d;return b}function agile_json(a,c){var b="json"+(Math.random()*100).toString().replace(/\./g,"");window[b]=function(d){if(d.error){if(c&&typeof(c.error)=="function"){c.error(d)}return}if(c&&typeof(c.success)=="function"){c.success(d)}if(c&&typeof(c)=="function"){c(d)}};document.getElementsByTagName("body")[0].appendChild((function(){var d=document.createElement("script");d.type="text/javascript";d.src=a.replace("callback=?","callback="+b);return d})())}String.prototype.format=function(){var a=arguments;return this.replace(/{(\d+)}/g,function(b,c){return typeof a[c]!="undefined"?a[c]:b})};function agile_addDeal(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="opportunity={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/opportunity?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getDeals(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-deals?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_setEmail(a){agile_guid.set_email(a)}function agile_getEmail(c){var b=agile_guid.get_email();var a=agile_id.getURL()+"/email?callback=?&id="+agile_id.get()+"&email="+encodeURIComponent(b);agile_json(a,c)}var agile_guid={init:function(){this.cookie_name="agile-crm-guid";this.cookie_email="agile-email";this.cookie_original_ref="agile-original-referrer";this.new_guid=false},random:function(){var a=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)};return(a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a())},get:function(){var a=agile_read_cookie(this.cookie_name);if(!a){a=this.generate()}return a},generate:function(){guid=this.random();agile_create_cookie(this.cookie_name,guid,365*5);this.set_original_referrer();this.new_guid=true;return guid},reset:function(){agile_create_cookie(this.cookie_name,"",-1)},set_email:function(a){var b=agile_read_cookie(this.cookie_email);if(!b||(b!=a)){this.email=a;if(b){this.reset();agile_session.reset()}agile_create_cookie(this.cookie_email,this.email,365*5)}},get_email:function(){if(this.email){return this.email}var a=agile_read_cookie(this.cookie_email);return a},set_original_referrer:function(){var a=document.referrer;agile_create_cookie(this.cookie_original_ref,a,365*5)}};agile_guid.init();var agile_id={set:function(b,a){this.id=b;this.namespace=a},get:function(){return this.id},getURL:function(){if(!this.namespace||this.namespace=="localhost"){return"http://localhost:8888/core/js/api"}else{return"https://"+this.namespace+".agilecrm.com/core/js/api"}},getNamespace:function(){return this.namespace}};function agile_getMilestones(b){var a=agile_id.getURL()+"/contact/get-milestones?callback=?&id="+agile_id.get();agile_json(a,b)}function agile_addNote(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contacts/add-note?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getNotes(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-notes?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_setProperty(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contacts/add-property?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getProperty(c,d,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}if(!c){return}var a=agile_id.getURL()+"/contacts/get-property?callback=?&id="+agile_id.get()+"&name="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_removeProperty(c,d,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}if(!c){return}var a=agile_id.getURL()+"/contacts/remove-property?callback=?&id="+agile_id.get()+"&name="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_addScore(c,d,b){if(!c){return}if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/add-score?callback=?&id="+agile_id.get()+"&score="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_subtractScore(c,d,b){if(!c){return}if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/subtract-score?callback=?&id="+agile_id.get()+"&score="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_getScore(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-score?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}var agile_session={init:function(){this.cookie_name="agile-crm-session_id";this.cookie_start_time="agile-crm-session_start_time";this.cookie_duration_secs=60*1000;this.new_session=false},random:function(){var a=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)};return(a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a())},get:function(){var b=agile_read_cookie(this.cookie_name);if(!b){return this.generate()}var a=agile_read_cookie(this.cookie_start_time);var c=new Date().getUTCSeconds();if((c<a)||(c>(a+this.cookie_duration_secs))){return this.generate()}return b},generate:function(){var a=this.random();agile_create_cookie(this.cookie_name,a,0);agile_create_cookie(this.cookie_start_time,new Date().getUTCSeconds(),0);this.new_session=true;return a},reset:function(){agile_create_cookie(this.cookie_name,"",-1);agile_create_cookie(this.cookie_start_time,"",-1)}};agile_session.init();function agile_addTag(c,e,b){if(!c){return}if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="email={0}&tags={1}".format(encodeURIComponent(b),encodeURIComponent(c));var a=agile_id.getURL()+"/contacts/add-tags?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_removeTag(c,e,b){if(!c){return}if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="email={0}&tags={1}".format(encodeURIComponent(b),encodeURIComponent(c));var a=agile_id.getURL()+"/contacts/remove-tags?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getTags(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-tags?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_addTask(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="task={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/task?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getTasks(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-tasks?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_trackPageview(h){var d=agile_guid.get();var e=agile_session.get();var c=document.location.href;if(c!==undefined&&c!=null){c=encodeURIComponent(c)}else{c=""}var a=agile_id.get();var g="";if(agile_session.new_session){var f=document.referrer;if(f!==undefined&&f!=null&&f!="null"){f=encodeURIComponent(f)}else{f=""}g="guid={0}&sid={1}&url={2}&agile={3}&new=1&ref={4}".format(d,e,c,a,f)}else{g="guid={0}&sid={1}&url={2}&agile={3}".format(d,e,c,a)}if(agile_guid.get_email()){g+="&email="+encodeURIComponent(agile_guid.get_email())}var b="https://"+agile_id.getNamespace()+".agilecrm.com/stats?callback=?&"+g;agile_json(b,h)}function agile_read_cookie(b){b=agile_id.get()+"-"+b;var e=b+"=";var a=document.cookie.split(";");for(var d=0;d<a.length;d++){var f=a[d];while(f.charAt(0)==" "){f=f.substring(1,f.length)}if(f.indexOf(e)==0){return unescape(f.substring(e.length,f.length))}}return null}function agile_create_cookie(c,d,e){c=agile_id.get()+"-"+c;if(e){var b=new Date();b.setTime(b.getTime()+(e*24*60*60*1000));var a="; expires="+b.toGMTString()}else{var a=""}document.cookie=c+"="+escape(d)+a+"; path=/"}function agile_enable_console_logging(){var a=false;if(typeof console==="undefined"||!a){console={log:function(){},error:function(){}}}if(typeof(console.log)==="undefined"||!a){console.log=function(){return 0}}if(typeof(console.error)==="undefined"||!a){console.error=function(){return 0}}};