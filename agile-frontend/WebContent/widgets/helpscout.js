function showHelpScoutMails(){$("#HelpScout").html(HELPSCOUT_UPDATE_LOAD_IMAGE);if(!Email){helpscoutError(HELPSCOUT_PLUGIN_NAME,"Please provide email for this contact");return}getMailsFromHelpScout(function(b){console.log("HelpScout profile : "+b);if(b.hasOwnProperty("message")){helpscoutError(HELPSCOUT_PLUGIN_NAME,b.message)}else{$("#HelpScout").html(getTemplate("helpscout-profile",b));customerId=b.id;showMailsInHelpScout(b.id)}})}function getMailsFromHelpScout(e){queueGetRequest("widget_queue","/core/api/widgets/helpscout/get/"+HelpScout_Plugin_Id+"/"+Email,"json",function f(a){if(e&&typeof(e)==="function"){e(a)}},function d(a){helpscoutError(HELPSCOUT_PLUGIN_NAME,a.responseText)})}function showMailsInHelpScout(f){$("#all_conv_panel").html(HELPSCOUT_UPDATE_LOAD_IMAGE);queueGetRequest("widget_queue","/core/api/widgets/helpscout/get/"+HelpScout_Plugin_Id+"/customer/"+f,"json",function e(a){$("#all_conv_panel").html(getTemplate("helpscout-conversation",a));head.js(LIB_PATH+"lib/jquery.timeago.js",function(){$(".time-ago").timeago()})},function d(a){helpscoutError(HELPSCOUT_PLUGIN_NAME,a.responseText)})}function addTicketToHelpScout(){$("#add_conv").toggle();$("#helpscout_loading").toggle();var f={};f.headline="Add Conversation to HelpScout";f.info="Add Conversation in HelpScout";f.customerId=customerId;f.email=Email;$("#helpscout_messageModal").remove();queueGetRequest("widget_queue","/core/api/widgets/helpscout/get/createform/"+HelpScout_Plugin_Id,"json",function e(b){if(b.hasOwnProperty("mailboxes")){f.mailboxes=b.mailboxes;f.assignees=b.assignees;console.log(f);var a=getTemplate("helpscout-message",f);$("#content").append(a);$("#helpscout_messageModal").modal("show");$("#helpscout_messageModal input[type='radio']").live("click",function(){$("#helpscout_messageModal label.btn").toggleClass("active")});$("#add_conv").toggle();$("#helpscout_loading").toggle()}},function d(a){$("#add_conv").toggle();$("#helpscout_loading").hide();$("#helpscout_error").show();setTimeout(function(){$("#helpscout_error").hide()},2000)});$("#helpscout_send_request").die().live("click",function(a){a.preventDefault();console.log("subbmitting the HelpScout form");if(!isValidForm($("#helpscout_messageForm"))){return}sendRequestToHelpScout("/core/api/widgets/helpscout/add/"+HelpScout_Plugin_Id,"helpscout_messageForm","helpscout_messageModal","add-conv-error-panel")})}function sendRequestToHelpScout(h,g,f,e){$.post(h,$("#"+g).serialize(),function(a){$("#"+f).find("span.save-status").html("sent");setTimeout(function(){$("#"+f).modal("hide");showMailsInHelpScout(customerId)},2000)}).error(function(a){$("#"+f).remove();helpscoutStreamError(e,a.responseText)})}function helpscoutError(e,f){var d={};d.message=f;$("#"+e).html(getTemplate("helpscout-error",d))}function helpscoutStreamError(c,d){helpscoutError(c,d);$("#"+c).show();$("#"+c).fadeOut(10000)}$(function(){HELPSCOUT_PLUGIN_NAME="HelpScout";HELPSCOUT_UPDATE_LOAD_IMAGE='<center><img id="conv_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';var b=agile_crm_get_widget(HELPSCOUT_PLUGIN_NAME);console.log("In HelpScout");console.log(b);HelpScout_Plugin_Id=b.id;Email=agile_crm_get_contact_property("email");console.log("Email: "+Email);customerId=0;showHelpScoutMails();$("#add_conv").die().live("click",function(a){a.preventDefault();addTicketToHelpScout()})});