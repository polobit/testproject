function showChargifyClient(){if(EmailList.length==0){chargifyError(CHARGIFY_PLUGIN_NAME,"Please provide email for this contact");return}var c=[];for(var a=0;a<EmailList.length;a++){c[a]=EmailList[a].value}console.log(c);queueGetRequest("widget_queue","core/api/widgets/chargify/clients/"+CHARGIFY_PLUGIN_ID+"/"+c,"json",function b(f){console.log(f);if(f){console.log(f);var e=$("#"+CHARGIFY_PLUGIN_NAME).html(getTemplate("chargify-profile",f));head.js(LIB_PATH+"lib/jquery.timeago.js",function(){$(".time-ago",e).timeago()})}else{chargifyError(CHARGIFY_PLUGIN_NAME,f.responseText)}},function d(e){console.log(e.responseText);if(e.responseText=="Customer not found"){$("#"+CHARGIFY_PLUGIN_NAME).html(getTemplate("chargify-profile-addcontact",{message:"agilecrm domain of doesn't contain any customers"}))}})}function chargifyError(b,a){var c={};c.message=a;console.log("error ");$("#"+b).html(getTemplate("chargify-error",c))}function addContactToChargify(b,a){$("#chargify_add_contact").attr("disabled",true);$.get("/core/api/widgets/chargify/add/customer/"+CHARGIFY_PLUGIN_ID+"/"+b+"/"+a+"/"+Email,function(c){console.log("In Chargify add contact ");console.log(c);if(c.Status="OK"){showChargifyClient()}else{chargifyError(CHARGIFY_PLUGIN_NAME,c)}$("#chargify_add_contact").removeAttr("disabled")})}$(function(){console.log("in Chargify.js");CHARGIFY_PLUGIN_NAME="Chargify";CHARGIFY_PROFILE_LOAD_IMAGE='<center><img id="chargify_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';var b=agile_crm_get_widget(CHARGIFY_PLUGIN_NAME);CHARGIFY_PLUGIN_ID=b.id;console.log("plugin Id"+CHARGIFY_PLUGIN_ID);Email=agile_crm_get_contact_property("email");EmailList=agile_crm_get_contact_properties_list("email");var a=agile_crm_get_contact_property("first_name");var c=agile_crm_get_contact_property("last_name");if(c==undefined||c==null){c==" "}showChargifyClient();$("#chargify_add_contact").die().live("click",function(d){d.preventDefault();addContactToChargify(a,c,Email)})});