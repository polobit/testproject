function agile_setAccount(b,a){agile_id.set(b,a);agile_setEmailFromUrl();agile_create_reference_domain_cookie()}function agile_setEmailFromUrl(){if(window.location.href.search("fwd=cd")!==-1){try{var a=decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]"+encodeURI("data").replace(/[\.\+\*]/g,"\\$&")+"(?:\\=([^&]*))?)?.*$","i"),"$1"));if(a){agile_guid.set_email(JSON.parse(a).email)}}catch(b){console.log(b.message)}}}function agile_allowedDomains(b){var a=agile_id.getURL()+"/allowed-domains?callback=?&id="+agile_id.get();agile_json(a,b)}var _agile={set_account:function(b,a){agile_setAccount(b,a)},set_email:function(a){agile_setEmail(a)},track_page_view:function(a){agile_trackPageview(a)},create_contact:function(a,b){agile_createContact(a,b)},get_contact:function(a,b){agile_getContact(a,b)},delete_contact:function(a,b){agile_deleteContact(a,b)},add_tag:function(a,b,c){agile_addTag(a,b,c)},remove_tag:function(a,b,c){agile_removeTag(a,b,c)},add_score:function(a,b,c){agile_addScore(a,b,c)},subtract_score:function(a,b,c){agile_subtractScore(a,b,c)},add_note:function(a,b,c){agile_addNote(a,b,c)},set_property:function(a,b,c){agile_setProperty(a,b,c)},add_task:function(a,b,c){agile_addTask(a,b,c)},add_deal:function(a,b,c){agile_addDeal(a,b,c)},get_score:function(b,a){agile_getScore(b,a)},get_tags:function(b,a){agile_getTags(b,a)},get_notes:function(b,a){agile_getNotes(b,a)},get_tasks:function(b,a){agile_getTasks(b,a)},get_deals:function(b,a){agile_getDeals(b,a)},add_campaign:function(a,b,c){agile_addCampaign(a,b,c)},get_campaigns:function(b,a){agile_getCampaigns(b,a)},get_campaign_logs:function(b,a){agile_getCampaignlogs(b,a)},get_workflows:function(a){agile_getWorkflows(a)},get_milestones:function(a){agile_getMilestones(a)},update_contact:function(a,b,c){agile_updateContact(a,b,c)},get_email:function(a){agile_getEmail(a)},create_company:function(a,b){agile_createCompany(a,b)},get_property:function(a,b,c){agile_getProperty(a,b,c)},remove_property:function(a,b,c){agile_removeProperty(a,b,c)},add_property:function(a,b,c){agile_setProperty(a,b,c)},web_rules:function(a){agile_webRules(a)},unsubscribe_campaign:function(a,b,c){agile_unsubscribeCampaign(a,b,c)},allowed_domains:function(a){agile_allowedDomains(a)}};function agile_addCampaign(d,a,c){if(!c){if(!agile_guid.get_email()){return}else{c=agile_guid.get_email()}}var e="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(d)),encodeURIComponent(c));var b=agile_id.getURL()+"/contacts/add-campaign?callback=?&id="+agile_id.get()+"&"+e;agile_json(b,a)}function agile_getCampaigns(b,a){if(!a){if(!agile_guid.get_email()){return}else{a=agile_guid.get_email()}}var c=agile_id.getURL()+"/contacts/get-campaigns?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(a));agile_json(c,b)}function agile_getCampaignlogs(b,a){if(!a){if(!agile_guid.get_email()){return}else{a=agile_guid.get_email()}}var c=agile_id.getURL()+"/contacts/get-campaign-logs?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(a));agile_json(c,b)}function agile_getWorkflows(b){var a=agile_id.getURL()+"/contacts/get-workflows?callback=?&id="+agile_id.get();agile_json(a,b)}function agile_unsubscribeCampaign(d,a,c){if(!c){if(!agile_guid.get_email()){return}else{c=agile_guid.get_email()}}var e="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(d)),encodeURIComponent(c));var b=agile_id.getURL()+"/contacts/unsubscribe-campaign?callback=?&id="+agile_id.get()+"&"+e;agile_json(b,a)}function agile_createContact(d,k){var h=[];for(var j in d){if(d.hasOwnProperty(j)&&j!="tags"){h.push(agile_propertyJSON(j,d[j]))}}var g=agile_read_cookie(agile_guid.cookie_original_ref);if(g){h.push(agile_propertyJSON("original_ref",g))}var a=agile_read_cookie("agile-tags");var f={};f.properties=h;if(d.tags){var m=d.tags;var e=m.trim().replace("/ /g"," ");e=e.replace("/, /g",",");f.tags=e.split(",");for(var c=0;c<f.tags.length;c++){f.tags[c]=f.tags[c].trim()}}if(a){agile_delete_cookie("agile-tags");var e=a.trim().replace("/ /g"," ");e=e.replace("/, /g",",");var b=e.split(",");if(f.tags){for(var c=0;c<b.length;c++){f.tags.push(b[c].trim())}}else{f.tags=[];for(var c=0;c<b.length;c++){f.tags.push(b[c].trim())}}}var l=agile_id.getURL()+"/contacts?callback=?&id="+agile_id.get()+"&contact="+encodeURIComponent(JSON.stringify(f));agile_json(l,k)}function agile_deleteContact(a,b){if(!a){if(!agile_guid.get_email()){return}else{a=agile_guid.get_email()}}var c=agile_id.getURL()+"/contact/delete?callback=?&id="+agile_id.get()+"&email="+encodeURIComponent(a);agile_json(c,b)}function agile_getContact(b,d){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var c="email={0}".format(encodeURIComponent(b));var a=agile_id.getURL()+"/contact/email?callback=?&id="+agile_id.get()+"&"+c;agile_json(a,d)}function agile_updateContact(d,a,c){if(!c){if(!agile_guid.get_email()){return}else{c=agile_guid.get_email()}}var e="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(d)),encodeURIComponent(c));var b=agile_id.getURL()+"/contact/update?callback=?&id="+agile_id.get()+"&"+e;agile_json(b,a)}function agile_createCompany(a,b){var f=[];for(var e in a){if(a.hasOwnProperty(e)){f.push(agile_propertyJSON(e,a[e]))}}var d={};d.properties=f;var c=agile_id.getURL()+"/company?callback=?&id="+agile_id.get()+"&data="+encodeURIComponent(JSON.stringify(d));agile_json(c,b)}function agile_propertyJSON(a,d,c){var b={};if(c==undefined){switch(a){case"first_name":case"last_name":case"email":case"company":case"title":case"name":case"url":case"website":case"address":case"phone":case"original_ref":b.type="SYSTEM";break;default:b.type="CUSTOM";break}}else{b.type=c}b.name=a;b.value=d;return b}var agile_json_timer;function agile_json(c,b){if(!document.body){clearInterval(agile_json_timer);agile_json_timer=setInterval(function(){agile_json(c,b)},100);return}clearInterval(agile_json_timer);var a="json"+(Math.random()*100).toString().replace(/\./g,"");window[a]=function(d){if(d.error){if(b&&typeof(b.error)=="function"){b.error(d)}return}if(b&&typeof(b.success)=="function"){b.success(d)}if(b&&typeof(b)=="function"){b(d)}};document.getElementsByTagName("body")[0].appendChild((function(){var d=document.createElement("script");d.type="application/javascript";d.src=c.replace("callback=?","callback="+a);return d})())}String.prototype.format=function(){var a=arguments;return this.replace(/{(\d+)}/g,function(b,c){return typeof a[c]!="undefined"?a[c]:b})};function agile_addDeal(d,a,c){if(!c){if(!agile_guid.get_email()){return}else{c=agile_guid.get_email()}}var e="opportunity={0}&email={1}".format(encodeURIComponent(JSON.stringify(d)),encodeURIComponent(c));var b=agile_id.getURL()+"/opportunity?callback=?&id="+agile_id.get()+"&"+e;agile_json(b,a)}function agile_getDeals(b,a){if(!a){if(!agile_guid.get_email()){return}else{a=agile_guid.get_email()}}var c=agile_id.getURL()+"/contacts/get-deals?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(a));agile_json(c,b)}function agile_setEmail(a){agile_guid.set_email(a)}function agile_getEmail(b){var a=agile_guid.get_email();var c=agile_id.getURL()+"/email?callback=?&id="+agile_id.get()+"&email="+encodeURIComponent(a);agile_json(c,b)}var _agile_synch_form_v2=function(){var g=document.getElementsByClassName("agile-button")[0];g.setAttribute("disabled","disabled");var m=document.getElementById("agile-error-msg");var k=document.getElementById("agile-form");var a=document.getElementById("agile-form-data").getAttribute("name").split(" ");var n={};var h=a[2];var e=a[1];var f=a[0];var b={};for(var c=0;c<k.length;c++){var l=k[c].getAttribute("name");var j=k[c].value;if(l&&j){if("address, city, state, country, zip".indexOf(l)!=-1){b[l]=j}else{n[l]=j}}}b=JSON.stringify(b);if(b.length>2){n.address=b}var d=n.email;if(!(agile_id.get()&&agile_id.getNamespace())){_agile.set_account(e,f);_agile.track_page_view()}if(d){_agile.set_email(d)}_agile.create_contact(n,{success:function(i){agile_formCallback(["",m],g,h)},error:function(o){if(o.error.indexOf("Duplicate")!=-1){var i=n.tags;if(i){delete n.tags}_agile.update_contact(n,{success:function(p){if(i){_agile.add_tag(i,{success:function(q){agile_formCallback(["",m],g,h)},error:function(q){agile_formCallback(["There was an error in sending data",m],g,h,q)}})}else{agile_formCallback(["",m],g,h)}},error:function(p){agile_formCallback(["There was an error in sending data",m],g,h,p)}})}else{agile_formCallback(["There was an error in sending data",m],g,h,o)}}})};var _agile_synch_form=function(){var g=document.getElementsByClassName("agile-button")[0];g.setAttribute("disabled","disabled");var m=document.getElementById("agile-error-msg");var k=document.getElementById("agile-form");var a=document.getElementById("agile-form-data");var n={};var h=a.getAttribute("agile-redirect-url");var e=a.getAttribute("agile-api");var f=a.getAttribute("agile-domain");var b={};for(var c=0;c<k.length;c++){var l=k[c].getAttribute("agile-field");var j=k[c].value;if(l&&j){if("address, city, state, country, zip".indexOf(l)!=-1){b[l]=j}else{n[l]=j}}}b=JSON.stringify(b);if(b.length>2){n.address=b}var d=n.email;if(!(agile_id.get()&&agile_id.getNamespace())){_agile.set_account(e,f);_agile.track_page_view()}if(d){_agile.set_email(d)}_agile.create_contact(n,{success:function(i){agile_formCallback(["",m],g,h)},error:function(o){if(o.error.indexOf("Duplicate")!=-1){var i=n.tags;if(i){delete n.tags}_agile.update_contact(n,{success:function(p){if(i){_agile.add_tag(i,{success:function(q){agile_formCallback(["",m],g,h)},error:function(q){agile_formCallback(["There was an error in sending data",m],g,h,q)}})}else{agile_formCallback(["",m],g,h)}},error:function(p){agile_formCallback(["There was an error in sending data",m],g,h,p)}})}else{agile_formCallback(["There was an error in sending data",m],g,h,o)}}})};var agile_guid={init:function(){this.cookie_name="agile-crm-guid";this.cookie_email="agile-email";this.cookie_original_ref="agile-original-referrer";this.new_guid=false},random:function(){var a=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)};return(a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a())},get:function(){var a=agile_read_cookie(this.cookie_name);if(!a){a=this.generate()}return a},generate:function(){guid=this.random();agile_create_cookie(this.cookie_name,guid,365*5);this.set_original_referrer();this.new_guid=true;return guid},reset:function(){agile_create_cookie(this.cookie_name,"",-1)},set_email:function(a){var b=agile_read_cookie(this.cookie_email);if(!b||(b!=a)){this.email=a;if(b){this.reset();agile_session.reset()}agile_create_cookie(this.cookie_email,this.email,365*5)}},get_email:function(){if(this.email){return this.email}var a=agile_read_cookie(this.cookie_email);return a},set_original_referrer:function(){var a=document.referrer;if(a){agile_create_cookie(this.cookie_original_ref,a,365*5)}}};agile_guid.init();var agile_id={set:function(b,a){this.id=b;this.namespace=a},get:function(){return this.id},getURL:function(){if(!this.namespace||this.namespace=="localhost"){return"http://localhost:8888/core/js/api"}else{return"https://"+this.namespace+".agilecrm.com/core/js/api"}},getNamespace:function(){return this.namespace}};function agile_getMilestones(b){var a=agile_id.getURL()+"/contact/get-milestones?callback=?&id="+agile_id.get();agile_json(a,b)}function agile_addNote(d,a,c){if(!c){if(!agile_guid.get_email()){return}else{c=agile_guid.get_email()}}var e="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(d)),encodeURIComponent(c));var b=agile_id.getURL()+"/contacts/add-note?callback=?&id="+agile_id.get()+"&"+e;agile_json(b,a)}function agile_getNotes(b,a){if(!a){if(!agile_guid.get_email()){return}else{a=agile_guid.get_email()}}var c=agile_id.getURL()+"/contacts/get-notes?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(a));agile_json(c,b)}function agile_setProperty(d,a,c){if(!c){if(!agile_guid.get_email()){return}else{c=agile_guid.get_email()}}var e="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(d)),encodeURIComponent(c));var b=agile_id.getURL()+"/contacts/add-property?callback=?&id="+agile_id.get()+"&"+e;agile_json(b,a)}function agile_getProperty(c,d,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}if(!c){return}var a=agile_id.getURL()+"/contacts/get-property?callback=?&id="+agile_id.get()+"&name="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_removeProperty(c,d,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}if(!c){return}var a=agile_id.getURL()+"/contacts/remove-property?callback=?&id="+agile_id.get()+"&name="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function getParameterByName(c){c=c.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b=new RegExp("[\\?&]"+c+"=([^&#]*)"),a=b.exec(location.search);return a==null?"":decodeURIComponent(a[1].replace(/\+/g," "))}function agile_create_reference_domain_cookie(){var c=getParameterByName("utm_source");var b=getParameterByName("utm_medium");var a=getParameterByName("utm_campaign");console.log("_utm_source ::"+c+"_utm_medium::"+b+"_utm_campaign::"+a);if(c&&b&&a){agile_createCookieInAllAgileSubdomains("_agile_utm_source",c,90);agile_createCookieInAllAgileSubdomains("_agile_utm_medium",b,90);agile_createCookieInAllAgileSubdomains("_agile_utm_campaign",a,90)}if(c=="affiliates"){var d=a;if(d){agile_createCookieInAllAgileSubdomains("agile_reference_domain",d,90);console.log("cookie created "+d)}else{d=""}}}function agile_addScore(c,d,b){if(!c){return}if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/add-score?callback=?&id="+agile_id.get()+"&score="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_subtractScore(c,d,b){if(!c){return}if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/subtract-score?callback=?&id="+agile_id.get()+"&score="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_getScore(b,a){if(!a){if(!agile_guid.get_email()){return}else{a=agile_guid.get_email()}}var c=agile_id.getURL()+"/contacts/get-score?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(a));agile_json(c,b)}var agile_session={init:function(){this.cookie_name="agile-crm-session_id";this.cookie_start_time="agile-crm-session_start_time";this.cookie_duration_secs=60*1000;this.new_session=false},random:function(){var a=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)};return(a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a())},get:function(){var a=agile_read_cookie(this.cookie_name);if(!a){return this.generate()}var c=agile_read_cookie(this.cookie_start_time);var b=new Date().getUTCSeconds();if((b<c)||(b>(c+this.cookie_duration_secs))){return this.generate()}return a},generate:function(){var a=this.random();agile_create_cookie(this.cookie_name,a,0);agile_create_cookie(this.cookie_start_time,new Date().getUTCSeconds(),0);this.new_session=true;return a},reset:function(){agile_create_cookie(this.cookie_name,"",-1);agile_create_cookie(this.cookie_start_time,"",-1)}};agile_session.init();function agile_addTag(d,a,c){if(!d){return}if(!c){if(!agile_guid.get_email()){agile_cookieTags(d,"add");return}else{c=agile_guid.get_email()}}var e="email={0}&tags={1}".format(encodeURIComponent(c),encodeURIComponent(d));var b=agile_id.getURL()+"/contacts/add-tags?callback=?&id="+agile_id.get()+"&"+e;agile_json(b,a)}function agile_removeTag(d,a,c){if(!d){return}if(!c){if(!agile_guid.get_email()){agile_cookieTags(d,"delete");return}else{c=agile_guid.get_email()}}var e="email={0}&tags={1}".format(encodeURIComponent(c),encodeURIComponent(d));var b=agile_id.getURL()+"/contacts/remove-tags?callback=?&id="+agile_id.get()+"&"+e;agile_json(b,a)}function agile_getTags(a,d){if(!d){if(!agile_guid.get_email()){return}else{d=agile_guid.get_email()}}var c=agile_read_cookie("agile-tags");var e="email={0}&tags={1}".format(encodeURIComponent(d),encodeURIComponent(c));var b=agile_id.getURL()+"/contacts/get-tags?callback=?&id="+agile_id.get()+"&"+e;agile_json(b,a)}function agile_addTask(d,a,c){if(!c){if(!agile_guid.get_email()){return}else{c=agile_guid.get_email()}}var e="task={0}&email={1}".format(encodeURIComponent(JSON.stringify(d)),encodeURIComponent(c));var b=agile_id.getURL()+"/task?callback=?&id="+agile_id.get()+"&"+e;agile_json(b,a)}function agile_getTasks(b,a){if(!a){if(!agile_guid.get_email()){return}else{a=agile_guid.get_email()}}var c=agile_id.getURL()+"/contacts/get-tasks?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(a));agile_json(c,b)}function agile_trackPageview(f){var b=agile_guid.get();var c=agile_session.get();var a=document.location.href;if(a!==undefined&&a!=null){a=encodeURIComponent(a)}else{a=""}var g=agile_id.get();var e="";if(agile_session.new_session){var d=document.referrer;if(d!==undefined&&d!=null&&d!="null"){d=encodeURIComponent(d)}else{d=""}e="guid={0}&sid={1}&url={2}&agile={3}&new=1&ref={4}".format(b,c,a,g,d)}else{e="guid={0}&sid={1}&url={2}&agile={3}".format(b,c,a,g)}if(agile_guid.get_email()){e+="&email="+encodeURIComponent(agile_guid.get_email())}var h="https://"+agile_id.getNamespace()+".agilecrm.com/stats?callback=?&"+e;agile_json(h,f)}function agile_removeCommonTags(d,c){var f=d.length;while(--f>=0){var e=c.length;while(--e>=0){if(d[f]&&d[f].trim()==c[e].trim()){d.splice(f,1);f=d.length}}}return d}function agile_cookieTags(h,e){var f=agile_read_cookie("agile-tags");if(!f){if(e=="add"){agile_create_cookie("agile-tags",h,5*365)}return}var c=f.split(",");var g=h.split(",");agile_delete_cookie("agile-tags");if(e=="delete"){var d=agile_removeCommonTags(c,g);if(d.length>0){agile_create_cookie("agile-tags",d.toString(),5*365)}}if(e=="add"){var b=agile_removeCommonTags(g,c);var a=b.length;while(--a>=0){c.push(b[a])}agile_create_cookie("agile-tags",c.toString(),5*365)}return}function agile_formCallback(b,c,a,d){if(d){console.log("AgileCRM form error "+d.error)}b[1].innerHTML=b[0];c.removeAttribute("disabled");setTimeout(function(){b[1].innerHTML="";window.location.replace(a)},1500)}function agile_webRules(b){var a=agile_id.getURL()+"/web-rules?callback=?&id="+agile_id.get();agile_json(a,b)}function _agile_execute_web_rules(){_agile_require_js("https://agilegrabbers.appspot.com/demo/agile-webrules-min.js",function(){_agile_webrules()})}function _agile_require_js(b,d){var a=document.getElementsByTagName("script")[0],c=document.createElement("script");c.onreadystatechange=function(){if(c.readyState==="loaded"||c.readyState==="complete"){c.onreadystatechange=null;d()}};c.onload=function(){d()};c.src=b;a.parentNode.insertBefore(c,a)}function agile_read_cookie(d){d=agile_id.get()+"-"+d;var f=d+"=";var b=document.cookie.split(";");for(var e=0;e<b.length;e++){var a=b[e];while(a.charAt(0)==" "){a=a.substring(1,a.length)}if(a.indexOf(f)==0){return unescape(a.substring(f.length,a.length))}}return null}function agile_create_cookie(d,f,a){d=agile_id.get()+"-"+d;if(a){var c=new Date();c.setTime(c.getTime()+(a*24*60*60*1000));var b="; expires="+c.toGMTString()}else{var b=""}var e="";var g=window.location.hostname.replace(/([a-zA-Z0-9]+.)/,"");if(g.length>5){e=";document=."+g}document.cookie=d+"="+escape(f)+b+"; path=/"+e}function agile_createCookieInAllAgileSubdomains(d,e,a){if(a){var c=new Date();c.setTime(c.getTime()+(a*24*60*60*1000));var b="; expires="+c.toGMTString()}else{var b=""}document.cookie=d+"="+escape(e)+b+"; path=/; domain=agilecrm.com"}function agile_delete_cookie(a){agile_create_cookie(a,"",-1)}function agile_enable_console_logging(){var a=false;if(typeof console==="undefined"||!a){console={log:function(){},error:function(){}}}if(typeof(console.log)==="undefined"||!a){console.log=function(){return 0}}if(typeof(console.error)==="undefined"||!a){console.error=function(){return 0}}};
