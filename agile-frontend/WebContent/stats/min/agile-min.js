function agile_setAccount(b,a){agile_id.set(b,a);agile_setEmailFromUrl()}function agile_setEmailFromUrl(){if(window.location.href.search("fwd=cd")!==-1){try{var a=decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]"+encodeURI("data").replace(/[\.\+\*]/g,"\\$&")+"(?:\\=([^&]*))?)?.*$","i"),"$1"));if(a){agile_guid.set_email(JSON.parse(a).email)}}catch(b){console.log(b.message)}}}function _agile_set_whitelist(a){window["agile-domain"]=a}function agile_allowedDomains(b){var a=agile_id.getURL()+"/allowed-domains?callback=?&id="+agile_id.get();agile_json(a,b)}function agile_getAllUsers(b){var a=agile_id.getURL()+"/users?callback=?&id="+agile_id.get();agile_json(a,b)}var _agile={set_account:function(b,a){agile_setAccount(b,a)},set_email:function(a){agile_setEmail(a)},track_page_view:function(a){agile_trackPageview(a)},set_tracking_domain:function(a){agile_trackingDomain(a)},create_contact:function(a,b){agile_createContact(a,b)},get_contact:function(a,b){agile_getContact(a,b)},delete_contact:function(a,b){agile_deleteContact(a,b)},add_tag:function(b,c,a){agile_addTag(b,c,a)},remove_tag:function(b,c,a){agile_removeTag(b,c,a)},add_score:function(b,c,a){agile_addScore(b,c,a)},subtract_score:function(b,c,a){agile_subtractScore(b,c,a)},add_note:function(b,c,a){agile_addNote(b,c,a)},set_property:function(b,c,a){agile_setProperty(b,c,a)},add_task:function(b,c,a){agile_addTask(b,c,a)},add_deal:function(b,c,a){agile_addDeal(b,c,a)},get_score:function(b,a){agile_getScore(b,a)},get_tags:function(b,a){agile_getTags(b,a)},get_notes:function(b,a){agile_getNotes(b,a)},get_tasks:function(b,a){agile_getTasks(b,a)},get_deals:function(b,a){agile_getDeals(b,a)},add_campaign:function(b,c,a){agile_addCampaign(b,c,a)},get_campaigns:function(b,a){agile_getCampaigns(b,a)},get_campaign_logs:function(b,a){agile_getCampaignlogs(b,a)},get_workflows:function(a){agile_getWorkflows(a)},get_pipelines:function(a){agile_getPipelines(a)},get_milestones:function(a){agile_getMilestones(a)},get_milestones_by_pipeline:function(a,b){agile_getMilestones_by_pipeline(a,b)},update_contact:function(b,c,a){agile_updateContact(b,c,a)},get_email:function(a){agile_getEmail(a)},create_company:function(a,b){agile_createCompany(a,b)},get_property:function(b,c,a){agile_getProperty(b,c,a)},remove_property:function(b,c,a){agile_removeProperty(b,c,a)},add_property:function(b,c,a){agile_setProperty(b,c,a)},web_rules:function(a){agile_webRules(a)},unsubscribe_campaign:function(b,c,a){agile_unsubscribeCampaign(b,c,a)},allowed_domains:function(a){agile_allowedDomains(a)},get_all_users:function(a){agile_getAllUsers(a)}};function agile_addCampaign(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contacts/add-campaign?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getCampaigns(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-campaigns?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_getCampaignlogs(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-campaign-logs?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_getWorkflows(b){var a=agile_id.getURL()+"/contacts/get-workflows?callback=?&id="+agile_id.get();agile_json(a,b)}function agile_unsubscribeCampaign(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contacts/unsubscribe-campaign?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_createContact(d,k){var h=[];for(var j in d){if(d.hasOwnProperty(j)&&j!="tags"){h.push(agile_propertyJSON(j,d[j]))}}var g=agile_read_cookie(agile_guid.cookie_original_ref);if(g){h.push(agile_propertyJSON("original_ref",g))}var a=agile_read_cookie("agile-tags");var f={};f.properties=h;if(d.tags){var m=d.tags;var e=m.trim().replace("/ /g"," ");e=e.replace("/, /g",",");f.tags=e.split(",");for(var c=0;c<f.tags.length;c++){f.tags[c]=f.tags[c].trim()}}if(a){agile_delete_cookie("agile-tags");var e=a.trim().replace("/ /g"," ");e=e.replace("/, /g",",");var b=e.split(",");if(f.tags){for(var c=0;c<b.length;c++){f.tags.push(b[c].trim())}}else{f.tags=[];for(var c=0;c<b.length;c++){f.tags.push(b[c].trim())}}}var l=agile_id.getURL()+"/contacts?callback=?&id="+agile_id.get()+"&contact="+encodeURIComponent(JSON.stringify(f));agile_json(l,k)}function agile_deleteContact(b,c){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contact/delete?callback=?&id="+agile_id.get()+"&email="+encodeURIComponent(b);agile_json(a,c)}function agile_getContact(b,d){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var c="email={0}".format(encodeURIComponent(b));var a=agile_id.getURL()+"/contact/email?callback=?&id="+agile_id.get()+"&"+c;agile_json(a,d)}function agile_updateContact(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contact/update?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_createCompany(e,f){var d=[];for(var c in e){if(e.hasOwnProperty(c)){d.push(agile_propertyJSON(c,e[c]))}}var b={};b.properties=d;var a=agile_id.getURL()+"/company?callback=?&id="+agile_id.get()+"&data="+encodeURIComponent(JSON.stringify(b));agile_json(a,f)}function agile_propertyJSON(a,d,c){var b={};if(c==undefined){switch(a){case"first_name":case"last_name":case"email":case"company":case"title":case"name":case"url":case"website":case"address":case"phone":case"original_ref":b.type="SYSTEM";break;default:b.type="CUSTOM";break}}else{b.type=c}b.name=a;b.value=d;return b}var agile_json_timer;function agile_json(a,c){if(!document.body){clearInterval(agile_json_timer);agile_json_timer=setInterval(function(){agile_json(a,c)},100);return}clearInterval(agile_json_timer);var b="json"+(Math.random()*100).toString().replace(/\./g,"");window[b]=function(d){if(d.error){if(c&&typeof(c.error)=="function"){c.error(d)}return}if(c&&typeof(c.success)=="function"){c.success(d)}if(c&&typeof(c)=="function"){c(d)}};document.getElementsByTagName("body")[0].appendChild((function(){var d=document.createElement("script");d.type="application/javascript";d.src=a.replace("callback=?","callback="+b);return d})())}String.prototype.format=function(){var a=arguments;return this.replace(/{(\d+)}/g,function(b,c){return typeof a[c]!="undefined"?a[c]:b})};function agile_addDeal(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="opportunity={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/opportunity?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getDeals(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-deals?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_setEmail(a){agile_guid.set_email(a)}function agile_getEmail(c){var b=agile_guid.get_email();var a=agile_id.getURL()+"/email?callback=?&id="+agile_id.get()+"&email="+encodeURIComponent(b);agile_json(a,c)}var _agile_synch_form_v3=function(){var h=document.getElementsByClassName("agile-button")[0];if(h){h.setAttribute("disabled","disabled")}var r=document.getElementById("agile-error-msg");if(r){var k=document.createElement("img");k.src="https://s3.amazonaws.com/PopupTemplates/form/spin.gif";r.appendChild(k)}var m=document.forms["agile-form"];var j=m._agile_redirect_url.value;var l={};var c={};var g=undefined;var q=[];var d={};var p=true;for(var n=0;n<m.length;n++){var a=m[n].getAttribute("name");var s=m[n].value;var f=m[n].getAttribute("id");var e=m[n].getAttribute("type");if((e=="radio"||e=="checkbox")&&!m[n].checked){continue}if(a&&s){d[f]=s;if("address, city, state, country, zip".indexOf(a)!=-1){c[a]=s}else{if(a=="tags"){if(g){g=g+","+s}else{g=s}}else{if(a=="note"){var o={};o.subject=m[n].parentNode.parentNode.getElementsByTagName("label")[0].innerHTML;o.description=s;q.push(o)}else{l[a]=s}}}}else{if(s){d[f]=s}}}c=JSON.stringify(c);if(c.length>2){l.address=c}if(g){l.tags=g}var b=l.email;if(b){_agile.set_email(b)}_agile.create_contact(l,{success:function(u){var t=u.id;var v=0;if(q.length>0){for(var i=0;i<q.length;i++){_agile.add_note(q[i],{success:function(w){v++;if(v==q.length){agile_formCallback(["",r],h,j,m,t,d,p)}},error:function(w){agile_formCallback(["Error in sending data",r],h,j,m)}})}}else{agile_formCallback(["",r],h,j,m,t,d,p)}},error:function(i){if(i.error.indexOf("Duplicate")!=-1){_agile.update_contact(l,{success:function(v){p=false;var u=v.id;var w=0;if(q.length>0){for(var t=0;t<q.length;t++){_agile.add_note(q[t],{success:function(x){w++;if(w==q.length){agile_formCallback(["",r],h,j,m,u,d,p)}},error:function(x){agile_formCallback(["Error in sending data",r],h,j,m)}})}}else{agile_formCallback(["",r],h,j,m,u,d,p)}},error:function(t){agile_formCallback(["Error in sending data",r],h,j,m)}})}else{agile_formCallback(["Error in sending data",r],h,j,m)}}})};var _agile_synch_form_v2=function(){var j=document.getElementsByClassName("agile-button")[0];if(j){j.setAttribute("disabled","disabled")}var u=document.getElementById("agile-error-msg");if(u){var l=document.createElement("img");l.src="https://s3.amazonaws.com/PopupTemplates/form/spin.gif";u.appendChild(l)}var o=document.getElementById("agile-form");var w=document.getElementById("agile-form-data").getAttribute("name").split(" ");var k=w[2];var c=w[1];var h=w[0];var v=h+" "+c+" "+k+" ";var p=document.getElementById("agile-form-data").getAttribute("name").replace(v,"");var m={};var b={};var g;var t=[];var d={};var s=true;for(var q=0;q<o.length;q++){var x=o[q].getAttribute("name");var n=o[q].value;var f=o[q].getAttribute("id");var e=o[q].getAttribute("type");if((e=="radio"||e=="checkbox")&&!o[q].checked){continue}if(x&&n){d[f]=n;if("address, city, state, country, zip".indexOf(x)!=-1){b[x]=n}else{if(x=="tags"){if(g){g=g+","+n}else{g=n}}else{if(x=="note"){var r={};r.subject=o[q].parentNode.parentNode.getElementsByTagName("label")[0].innerHTML;r.description=n;t.push(r)}else{m[x]=n}}}}else{if(n){d[f]=n}}}b=JSON.stringify(b);if(b.length>2){m.address=b}if(g){if(p){m.tags=g+","+p}else{m.tags=g}}else{if(p){m.tags=p}}var a=m.email;if(!(agile_id.get()&&agile_id.getNamespace())){_agile.set_account(c,h);_agile.track_page_view()}if(a){_agile.set_email(a)}_agile.create_contact(m,{success:function(z){var y=z.id;var A=0;if(t.length>0){for(var i=0;i<t.length;i++){_agile.add_note(t[i],{success:function(B){A++;if(A==t.length){agile_formCallback(["",u],j,k,o,y,d,s)}},error:function(B){agile_formCallback(["Error in sending data",u],j,k,o)}})}}else{agile_formCallback(["",u],j,k,o,y,d,s)}},error:function(i){if(i.error.indexOf("Duplicate")!=-1){_agile.update_contact(m,{success:function(A){s=false;var z=A.id;var B=0;if(t.length>0){for(var y=0;y<t.length;y++){_agile.add_note(t[y],{success:function(C){B++;if(B==t.length){agile_formCallback(["",u],j,k,o,z,d,s)}},error:function(C){agile_formCallback(["Error in sending data",u],j,k,o)}})}}else{agile_formCallback(["",u],j,k,o,z,d,s)}},error:function(y){agile_formCallback(["Error in sending data",u],j,k,o)}})}else{agile_formCallback(["Error in sending data",u],j,k,o)}}})};var _agile_synch_form=function(){var j=document.getElementsByClassName("agile-button")[0];if(j){j.setAttribute("disabled","disabled")}var r=document.getElementById("agile-error-msg");if(r){var l=document.createElement("img");l.src="https://s3.amazonaws.com/PopupTemplates/form/spin.gif";r.appendChild(l)}var o=document.getElementById("agile-form");var s=document.getElementById("agile-form-data");var k=s.getAttribute("agile-redirect-url");var c=s.getAttribute("agile-api");var h=s.getAttribute("agile-domain");var m={};var b={};var g;var d={};var q=true;for(var p=0;p<o.length;p++){var t=o[p].getAttribute("agile-field");var n=o[p].value;var f=o[p].getAttribute("id");var e=o[p].getAttribute("type");if((e=="radio"||e=="checkbox")&&!o[p].checked){continue}if(t&&n){d[f]=n;if("address, city, state, country, zip".indexOf(t)!=-1){b[t]=n}else{if(t=="tags"){if(g){g=g+","+n}else{g=n}}else{m[t]=n}}}else{if(n){d[f]=n}}}b=JSON.stringify(b);if(b.length>2){m.address=b}if(g){m.tags=g}var a=m.email;if(!(agile_id.get()&&agile_id.getNamespace())){_agile.set_account(c,h);_agile.track_page_view()}if(a){_agile.set_email(a)}_agile.create_contact(m,{success:function(u){var i=u.id;agile_formCallback(["",r],j,k,o,i,d,q)},error:function(i){if(i.error.indexOf("Duplicate")!=-1){_agile.update_contact(m,{success:function(v){q=false;var u=v.id;agile_formCallback(["",r],j,k,o,u,d,q)},error:function(u){agile_formCallback(["Error in sending data",r],j,k,o)}})}else{agile_formCallback(["Error in sending data",r],j,k,o)}}})};var agile_guid={init:function(){this.cookie_name="agile-crm-guid";this.cookie_email="agile-email";this.cookie_original_ref="agile-original-referrer";this.new_guid=false},random:function(){var a=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)};return(a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a())},get:function(){var a=agile_read_cookie(this.cookie_name);if(!a){a=this.generate()}return a},generate:function(){guid=this.random();agile_create_cookie(this.cookie_name,guid,365*5);this.set_original_referrer();this.new_guid=true;return guid},reset:function(){agile_create_cookie(this.cookie_name,"",-1)},set_email:function(a){var b=agile_read_cookie(this.cookie_email);if(!b||(b!=a)){this.email=a;if(b){this.reset();agile_session.reset()}agile_create_cookie(this.cookie_email,this.email,365*5)}},get_email:function(){if(this.email){return this.email}var a=agile_read_cookie(this.cookie_email);return a},set_original_referrer:function(){var a=document.referrer;if(a){agile_create_cookie(this.cookie_original_ref,a,365*5)}}};agile_guid.init();var agile_id={set:function(b,a){this.id=b;this.namespace=a},get:function(){return this.id},getURL:function(){if(!this.namespace||this.namespace=="localhost"){return"http://localhost:8888/core/js/api"}else{return"https://"+this.namespace+".agilecrm.com/core/js/api"}},getNamespace:function(){return this.namespace},setDomain:function(a){this.domain=a},getDomain:function(){return this.domain}};function agile_getPipelines(b){var a=agile_id.getURL()+"/milestone/get-pipelines?callback=?&id="+agile_id.get();agile_json(a,b)}function agile_getMilestones(b){var a=agile_id.getURL()+"/contact/get-milestones?callback=?&id="+agile_id.get();agile_json(a,b)}function agile_getMilestones_by_pipeline(b,c){var a=agile_id.getURL()+"/milestone/get-milestones?callback=?&id="+agile_id.get()+"&pipeline_id="+b;agile_json(a,c)}function agile_addNote(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contacts/add-note?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getNotes(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-notes?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_setProperty(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="data={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/contacts/add-property?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getProperty(c,d,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}if(!c){return}var a=agile_id.getURL()+"/contacts/get-property?callback=?&id="+agile_id.get()+"&name="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_removeProperty(c,d,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}if(!c){return}var a=agile_id.getURL()+"/contacts/remove-property?callback=?&id="+agile_id.get()+"&name="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_addScore(c,d,b){if(!c){return}if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/add-score?callback=?&id="+agile_id.get()+"&score="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_subtractScore(c,d,b){if(!c){return}if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/subtract-score?callback=?&id="+agile_id.get()+"&score="+c+"&email="+encodeURIComponent(b);agile_json(a,d)}function agile_getScore(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-score?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}var agile_session={init:function(){this.cookie_name="agile-crm-session_id";this.cookie_start_time="agile-crm-session_start_time";this.cookie_duration_secs=60*1000;this.new_session=false},random:function(){var a=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)};return(a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a())},get:function(){var b=agile_read_cookie(this.cookie_name);if(!b){return this.generate()}var a=agile_read_cookie(this.cookie_start_time);var c=new Date().getUTCSeconds();if((c<a)||(c>(a+this.cookie_duration_secs))){return this.generate()}return b},generate:function(){var a=this.random();agile_create_cookie(this.cookie_name,a,0);agile_create_cookie(this.cookie_start_time,new Date().getUTCSeconds(),0);this.new_session=true;return a},reset:function(){agile_create_cookie(this.cookie_name,"",-1);agile_create_cookie(this.cookie_start_time,"",-1)}};agile_session.init();function agile_addTag(c,e,b){if(!c){return}if(!b){if(!agile_guid.get_email()){agile_cookieTags(c,"add");return}else{b=agile_guid.get_email()}}var d="email={0}&tags={1}".format(encodeURIComponent(b),encodeURIComponent(c));var a=agile_id.getURL()+"/contacts/add-tags?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_removeTag(c,e,b){if(!c){return}if(!b){if(!agile_guid.get_email()){agile_cookieTags(c,"delete");return}else{b=agile_guid.get_email()}}var d="email={0}&tags={1}".format(encodeURIComponent(b),encodeURIComponent(c));var a=agile_id.getURL()+"/contacts/remove-tags?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getTags(e,c){if(!c){if(!agile_guid.get_email()){return}else{c=agile_guid.get_email()}}var b=agile_read_cookie("agile-tags");var d="email={0}&tags={1}".format(encodeURIComponent(c),encodeURIComponent(b));var a=agile_id.getURL()+"/contacts/get-tags?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_addTask(c,e,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var d="task={0}&email={1}".format(encodeURIComponent(JSON.stringify(c)),encodeURIComponent(b));var a=agile_id.getURL()+"/task?callback=?&id="+agile_id.get()+"&"+d;agile_json(a,e)}function agile_getTasks(c,b){if(!b){if(!agile_guid.get_email()){return}else{b=agile_guid.get_email()}}var a=agile_id.getURL()+"/contacts/get-tasks?callback=?&id="+agile_id.get()+"&"+"email={0}".format(encodeURIComponent(b));agile_json(a,c)}function agile_trackPageview(h){var d=agile_guid.get();var e=agile_session.get();var c=document.location.href;if(c!==undefined&&c!=null){c=encodeURIComponent(c)}else{c=""}var a=agile_id.get();var g="";if(agile_session.new_session){var f=document.referrer;if(f!==undefined&&f!=null&&f!="null"){f=encodeURIComponent(f)}else{f=""}g="guid={0}&sid={1}&url={2}&agile={3}&new=1&ref={4}".format(d,e,c,a,f)}else{g="guid={0}&sid={1}&url={2}&agile={3}".format(d,e,c,a)}if(agile_guid.get_email()){g+="&email="+encodeURIComponent(agile_guid.get_email())}var b="https://"+agile_id.getNamespace()+".agilecrm.com/stats?callback=?&"+g;agile_json(b,h)}function agile_trackingDomain(a){agile_id.setDomain(a)}function agile_removeCommonTags(d,c){var f=d.length;while(--f>=0){var e=c.length;while(--e>=0){if(d[f]&&d[f].trim()==c[e].trim()){d.splice(f,1);f=d.length}}}return d}function agile_cookieTags(b,g){var h=agile_read_cookie("agile-tags");if(!h){if(g=="add"){agile_create_cookie("agile-tags",b,5*365)}return}var e=h.split(",");var a=b.split(",");agile_delete_cookie("agile-tags");if(g=="delete"){var f=agile_removeCommonTags(e,a);if(f.length>0){agile_create_cookie("agile-tags",f.toString(),5*365)}}if(g=="add"){var d=agile_removeCommonTags(a,e);var c=d.length;while(--c>=0){e.push(d[c])}agile_create_cookie("agile-tags",e.toString(),5*365)}return}function agile_formCallback(g,c,a,i,f,d,h){if(!g[0]){if(f){var b=i.getElementsByTagName("legend")[0].innerHTML;var e=agile_id.getURL()+"/formsubmit?id="+agile_id.get()+"&contactid="+f+"&formname="+encodeURIComponent(b)+"&formdata="+encodeURIComponent(JSON.stringify(d))+"&new="+h;agile_json(e)}}else{if(g[1]){g[1].innerHTML=g[0]}}setTimeout(function(){if(g[1]){g[1].innerHTML=""}if(c){c.removeAttribute("disabled")}if(!i.getAttribute("action")||i.getAttribute("action")=="#"||i.getAttribute("action").indexOf("/formsubmit")!=-1){i.setAttribute("action",a)}console.log("<000000000000000000000000000000000>");console.log(i.getAttribute("action"));i.submit()},1500)}function _agile_load_form_fields(){var a=agile_read_cookie("agile-email");if(!a){return}_agile.get_contact(a,{success:function(f){if(f){var b={};var g=f.properties;for(var e=0;e<g.length;e++){b[g[e].name]=g[e].value}var d=document.getElementById("agile-form");for(var c=0;c<d.length;c++){if(b[d[c].name]){d[c].value=b[d[c].name]}}}},error:function(b){return}})}function agile_webRules(b){var a=agile_id.getURL()+"/web-rules?callback=?&id="+agile_id.get();agile_json(a,b)}function _agile_execute_web_rules(){_agile_require_js("https://s3.amazonaws.com/agilewebgrabbers/scripts/agile-webrules-min.js",function(){_agile_webrules()})}function _agile_require_js(d,c){var a=document.createElement("script");a.type="text/javascript";a.async=true;a.src=d;if((navigator.appVersion).indexOf("MSIE")>0){a.onreadystatechange=function(){if((!this.readyState||this.readyState==="loaded"||this.readyState==="complete")){c()}}}else{a.onload=function(){if((!this.readyState||this.readyState==="loaded"||this.readyState==="complete")){c()}}}var b=document.getElementsByTagName("head")[0];b.appendChild(a)}function agile_read_cookie(b){b=agile_id.get()+"-"+b;var e=b+"=";var a=document.cookie.split(";");for(var d=0;d<a.length;d++){var f=a[d];while(f.charAt(0)==" "){f=f.substring(1,f.length)}if(f.indexOf(e)==0){return unescape(f.substring(e.length,f.length))}}return null}function agile_create_cookie(c,e,f){c=agile_id.get()+"-"+c;if(f){var b=new Date();b.setTime(b.getTime()+(f*24*60*60*1000));var a="; expires="+b.toGMTString()}else{var a=""}var d="";if(agile_id.getDomain()){d=";domain="+agile_id.getDomain()}document.cookie=c+"="+escape(e)+a+"; path=/"+d}function agile_createCookieInAllAgileSubdomains(c,d,e){if(e){var b=new Date();b.setTime(b.getTime()+(e*24*60*60*1000));var a="; expires="+b.toGMTString()}else{var a=""}document.cookie=c+"="+escape(d)+a+"; path=/; domain=agilecrm.com"}function agile_delete_cookie(a){agile_create_cookie(a,"",-1)}function agile_enable_console_logging(){var a=false;if(typeof console==="undefined"||!a){console={log:function(){},error:function(){}}}if(typeof(console.log)==="undefined"||!a){console.log=function(){return 0}}if(typeof(console.error)==="undefined"||!a){console.error=function(){return 0}}};