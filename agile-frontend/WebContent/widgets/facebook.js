function showFacebookMatchingProfile(d){var a=agile_crm_get_contact_property("image");console.log("am in facebook show");queueGetRequest("widget_queue","/core/api/widgets/facebook/contacts/"+FACEBOOK_PLUGIN_ID+"?searchKey="+d,"json",function b(f){console.log("Facebook");if(f){f.searchString=SEARCH_STRING;console.log("data is:");console.log(f);var e=$("#"+FACEBOOK_PLUGIN_NAME).html(getTemplate("facebook-matching-profiles",f));$(".facebookImage").die().live("mouseover",function(){Facebook_id=$(this).attr("id");$(this).popover({placement:"left"});$(this).popover("show");$("#"+Facebook_id).die().live("click",function(i){i.preventDefault();console.log(Facebook_id);$(this).popover("hide");console.log("on click in search");var g="@"+Facebook_id;web_url=g;console.log(g);var h=[{name:"website",value:g,subtype:"FACEBOOK"}];if(!a){var j=$(this).attr("src");h.push({name:"image",value:j})}if(!agile_crm_get_contact_property("title")){}console.log(h);agile_crm_update_contact_properties(h);showFacebookProfile(Facebook_id)})})}else{facebookError(f.responseText)}},function c(e){facebookError(e.responseText)})}function facebookError(b){var a={};a.message=b;console.log("error ");$("#"+FACEBOOK_PLUGIN_NAME).html(getTemplate("facebook-error",a))}function getModifiedFacebookMatchingProfiles(){console.log("am in getModifiedFacebookMatchingProfiles");if(!isValidForm($("#facebook-search_form"))){return}$("#spinner-facebook-search").show();SEARCH_STRING=$("#facebook_keywords").val();showFacebookMatchingProfile(SEARCH_STRING)}function showFacebookProfile(c){console.log("am in facbook profile");queueGetRequest("widget_queue","/core/api/widgets/facebook/userProfile/"+FACEBOOK_PLUGIN_ID+"/"+c,"json",function a(e){console.log("Facebook");console.log(e);if(e){var d=agile_crm_get_contact_property("image");console.log(d);e.image=d;$("#Twitter_plugin_delete").show();var f=$("#"+FACEBOOK_PLUGIN_NAME).html(getTemplate("facebook-profile",e));$("#facebook_post_btn").die().live("click",function(){console.log("post on a wall");queueGetRequest("widget_queue","/core/api/widgets/facebook/postonwall/"+FACEBOOK_PLUGIN_ID+"/"+c+"/hai","json",function h(i){console.log("am at success")},function g(i){facebookError(i.responseText)})})}else{facebookError(e.responseText)}},function b(d){facebookError(d.responseText)})}function getUserNameOrUserID(a){var b=a.lastIndexOf("/");return a.substring(b+1)}$(function(){console.log("in facebook.js");FACEBOOK_PLUGIN_NAME="Facebook";FACEBOOK_PROFILE_LOAD_IMAGE='<center><img id="facebook_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';var c=agile_crm_get_widget(FACEBOOK_PLUGIN_NAME);FACEBOOK_PLUGIN_ID=c.id;console.log("plugin Id"+FACEBOOK_PLUGIN_ID);var d=agile_crm_get_contact_property("first_name");var i=agile_crm_get_contact_property("last_name");if(i==undefined||i==null){i=""}console.log("firstName:"+d+"lastname:"+i);SEARCH_STRING=d+" "+i;console.log("    SEARCH_STRING"+SEARCH_STRING);web_url=agile_crm_get_contact_property_by_subtype("website","FACEBOOK");console.log(web_url);if(web_url){console.log("profile attched"+web_url);var g=buildFacebookProfileURL(web_url);var h=getUserNameOrUserID(g);var e=h;console.log(e);if(isNaN(e)){console.log("In getID facebook");var b="https://graph.facebook.com/"+e;console.log(b);var a=$.parseJSON($.ajax({url:b,async:false,dataType:"json"}).responseText);console.log(a);if(typeof a.id!="undefined"){e=a.id;var f=[{name:"website",value:"@"+e,subtype:"FACEBOOK"}];console.log(f);agile_crm_update_contact_properties(f)}else{if(typeof a.error!="undefined"){facebookError("Facebook profile do not exist.("+g+")");return}}}showFacebookProfile(e)}else{console.log("no profile attached");showFacebookMatchingProfile(SEARCH_STRING)}$("#facebook_search_btn").die().live("click",function(j){j.preventDefault();getModifiedFacebookMatchingProfiles()});$(".facebook_modify_search").die().live("click",function(j){j.preventDefault();$("#"+FACEBOOK_PLUGIN_NAME).html(getTemplate("facebook-modified-search",{searchString:SEARCH_STRING}))});$("#facebook_search_close").die().live("click",function(j){j.preventDefault()});$("#Facebook_plugin_delete").die().live("click",function(j){j.preventDefault();web_url=agile_crm_get_contact_property_by_subtype("website","FACEBOOK");console.log("deleting facebook acct.",web_url);agile_crm_delete_contact_property_by_subtype("website","FACEBOOK",web_url,function(k){console.log("In facebook delete callback");showFacebookMatchingProfile()})})});