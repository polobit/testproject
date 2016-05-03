var Twilio_Caller_Url;var connection;window.onhashchange=hashchanged;function hashchanged(){}function setupTwilioOAuth(){$("#Twilio").html(TWILIO_LOGS_LOAD_IMAGE);console.log("In Twilio Auth");$("#Twilio").html('<div class="widget_content"><p style="border-bottom:none">Call your contacts directly using your Twilio account.</p><a id="twilio-connect-button" class="btn" href="https://www.twilio.com/authorize/CNf63bca035414be121d517a116066a5f8?state='+encodeURIComponent(window.location.href)+'" style="margin-bottom: 10px;">Link Your Twilio</a></div>')}function getOutgoingNumbers(b){queueGetRequest("widget_queue","/core/api/widgets/twilio/numbers/"+Twilio_Plugin_Id,"json",function(a){if(!a){return}console.log("In getting twilio numbers");console.log(a);if(b&&typeof(b)==="function"){b(a)}},function(a){$("#twilio_profile_load").remove();twilioError(Twilio_PLUGIN_NAME,a.responseText)})}function verifyNumberFromTwilio(d,c){$("#Twilio").html('<div class="widget_content">Verifying........</div>');$.getJSON("/core/api/widgets/twilio/verify/numbers/"+Twilio_Plugin_Id+"/"+d,function(a){console.log("Twilio verified_data "+a);if(!a){return}if(c&&typeof(c)==="function"){c(a)}}).error(function(a){var b=Math.floor((Math.random()*10)+1);setUpError(Twilio_PLUGIN_NAME,"widget-settings-error",a.responseText,window.location.protocol+"//"+window.location.host+"/#Twilio/twilio"+b)})}function checkTwilioNumbersAndGenerateToken(b){getOutgoingNumbers(function(a){console.log("Twilio outgoing numbers: "+a[0].PhoneNumber);if(!a[0].PhoneNumber){$("#Twilio").html(getTemplate("twilio-initial",{}));return}if(b.verification_status&&b.verification_status=="success"&&b.verified_number){checkTwilioPrefsAndGenerateToken(b,b.verified_number);return}checkTwilioPrefsAndGenerateToken(b,a[0].PhoneNumber)})}function checkTwilioPrefsAndGenerateToken(d,c){if(d.account_sid){if(!d.app_sid){createApplicationInTwilio(function(a){d.app_sid=a;agile_crm_save_widget_prefs(Twilio_PLUGIN_NAME,JSON.stringify(d),function(b){checkTwilioPrefsAndGenerateToken(d,c)})});return}showTwilioDetails(null,c)}}function createApplicationInTwilio(b){$.get("/core/api/widgets/twilio/appsid/"+Twilio_Plugin_Id,function(a){console.log("Twilio app_sid: "+a);if(b&&typeof(b)==="function"){b(a)}}).error(function(a){twilioError(Twilio_PLUGIN_NAME,a.responseText)})}function generateTokenInTwilio(d,c){$.get("/core/api/widgets/twilio/token/"+Twilio_Plugin_Id,function(a){console.log("Twilio generated token : "+a);if(c&&typeof(c)==="function"){c(a)}}).error(function(a){twilioError(Twilio_PLUGIN_NAME,a.responseText)})}function showTwilioDetails(d,f){console.log("In showTwilioDetails");$("#Twilio").html(TWILIO_LOGS_LOAD_IMAGE);if(Numbers.length==0){twilioError(Twilio_PLUGIN_NAME,"There is no phone number associated with this contact. <a href='#contact-edit'>Add phone number</a>");return}var e={};e.to=Numbers;$("#Twilio").html(getTemplate("twilio-profile",e));$("#twilio_note").hide();getTwilioLogs(Numbers[0].value);$("#contact_number").die().live("change",function(b){var a=$("#contact_number").val();getTwilioLogs(a)})}function getTwilioLogs(b){$("#twilio-logs-panel").html(TWILIO_LOGS_LOAD_IMAGE);$.get("/core/api/widgets/twilio/call/logs/"+Twilio_Plugin_Id+"/"+b,function(a){console.log("In Twilio logs ");console.log(a);var d=$(getTemplate("twilio-logs",JSON.parse(a)));$("#twilio-logs-panel").html(d);head.js(LIB_PATH+"lib/jquery.timeago.js",function(){$(".time-ago",d).timeago()});addLogsToTimeLine($.parseJSON(a));$("#record_sound_play").die().live("click",function(c){c.preventDefault();if(audio!=null){audio.pause();$(".icon-stop").addClass("icon-play");$(".icon-stop").removeClass("icon-stop")}var e="https://api.twilio.com"+$(this).attr("sound_url");console.log("Twilio sound URL: "+e);play_sound(e,"true");$(this).addClass("icon-stop");$(this).removeClass("icon-play")});$(".icon-stop").die().live("click",function(c){c.preventDefault();audio.pause();audio=null;$(this).addClass("icon-play");$(this).removeClass("icon-stop")})}).error(function(a){$("#logs_load").remove();twilioError("twilio-logs-panel",a.responseText)})}function setUpTwilio(d,f){var e=$("#contact_number").val();head.js("https://static.twilio.com/libs/twiliojs/1.1/twilio.min.js",function(){Twilio.Device.setup(d);Twilio.Device.ready(function(){console.log("ready");$("#twilio_call").show();if($("#Twilio").find(".widget_content").find("#dialpad_in_twilio").length==0){var a=$(getTemplate("twilioio-dialpad"),{});$("#Twilio").find(".widget_content").append(a)}if(Twilio_Caller_Url==window.location.href&&Twilio.Device.status()=="busy"){console.log("Twilio call is already connected");$("#twilio_hangup").show();$("#twilio_dialpad").show();$("#twilio_call").hide()}});Twilio.Device.connect(function(a){console.log("Twilio call is connected");console.log(a);console.log(a._status);if(a._status=="open"){Twilio_Caller_Url=window.location.href;To_Number=$("#contact_number").val();To_Name=getTwilioContactName();globalconnection=a;$("#twilio_hangup").show();$("#twilio_dialpad").show();$("#twilio_call").hide()}});Twilio.Device.disconnect(function(a){console.log("Twilio call is disconnected");console.log(a);if(a._status=="closed"){e=$("#contact_number").val();console.log("Twilio Number in disconect: "+e);getTwilioLogs(e);$("#twilio_note").show();$("#twilio_hangup").hide();$("#twilio_dialpad").hide();$("#dialpad_in_twilio").hide();$("#twilio_call").show();Twilio_Caller_Url=undefined;closeTwilioNoty()}});Twilio.Device.offline(function(){console.log("Twilio went offline")});Twilio.Device.incoming(function(a){console.log(a.parameters.From);console.log(a._status);a.accept();if(a._status=="open"){globalconnection=a;$("#twilio_hangup").show();$("#twilio_dialpad").show();$("#twilio_call").hide()}});Twilio.Device.cancel(function(a){console.log(a.parameters.From);$("#twilio_hangup").hide();$("#twilio_dialpad").hide();$("#dialpad_in_twilio").hide();$("#twilio_call").show()});Twilio.Device.presence(function(a){console.log(a.from);console.log(a.available)});Twilio.Device.error(function(a){console.log("Twilio error");console.log(a);$("#twilio_hangup").hide();$("#twilio_dialpad").hide();$("#dialpad_in_twilio").hide();$("#twilio_call").show()});registerClickEvents(f)})}function getTwilioContactName(){var f="";var d=agile_crm_get_contact_property("first_name");var e=agile_crm_get_contact_property("last_name");if(d){f=d+" "}if(e){f=f+e}return f}function registerClickEvents(f){var e;var d="false";$("#twilio_hangup").die().live("click",function(a){a.preventDefault();console.log("Twilio call hang up");e=$("#contact_number").val();console.log("Twilio Number in hang up: "+e);getTwilioLogs(e);Twilio.Device.disconnectAll();$("#twilio_hangup").hide();$("#twilio_dialpad").hide();$("#dialpad_in_twilio").hide();$("#twilio_call").show()});$("#twilio_dialpad").die().live("click",function(a){a.preventDefault();console.log("Twilio call dailpad");$("#dialpad_in_twilio").toggle()});$("#record_sound_play").die().live("click",function(a){a.preventDefault();var b="https://api.twilio.com"+$(this).attr("sound_url");console.log("Twilio sound URL: "+b);play_sound(b,"true")});$("#twilio_call").die().live("click",function(a){a.preventDefault();e=$("#contact_number").val();d="false";$("#twilio-record-modal").remove();var c={};c.to=e;c.name=getTwilioContactName();var b=$(getTemplate("twilio-record",c));$("#content").append(b);$("#twilio-record-modal").modal("show")});$(".enable-call").die().live("click",function(a){a.preventDefault();$("#twilio-record-modal").modal("hide");var b=$(this).attr("make_call");if(b=="no"){return}if($("#enable-record").is(":checked")){d="true"}console.log("In Twilio call: "+d);Twilio.Device.connect({from:f,PhoneNumber:e,record:d,Url:"https://agile-crm-cloud.appspot.com/backend/voice?record="+d})})}function getIncomingNumbers(b){$.get("/core/api/widgets/twilio/incoming/numbers/"+Twilio_Plugin_Id,function(a){if(b&&typeof(b)==="function"){b(a)}},"json").error(function(a){$("#twilio_profile_load").remove();twilioError(Twilio_PLUGIN_NAME,a.responseText)})}function twilioError(f,d){console.log("In Twilio error template");var e={};e.message=d;$("#"+f).html(getTemplate("twilio-error",e));$("#"+f).append('<a class="btn" id="delete-widget" widget-name="Twilio" style="margin-top: 5px;">Delete Widget</a>')}function addLogsToTimeLine(h){var g;for(var i=0;i<h.length;i++){if(h[i].call.Status=="no-answer"){g="Call unaswered - "+h[i].call.Duration+" s"}else{g="Duration "+h[i].call.Duration+" s"}var j=new Date(h[i].call.StartTime);var f={id:"twilio"+(h.length-i),name:g,body:j.toDateString()+" "+j.toLocaleTimeString(),title:"Call",created_time:Date.parse(h[i].call.StartTime)/1000,entity_type:"twilio"};add_entity_to_timeline(new BaseModel(f))}}$(function(){Twilio_PLUGIN_NAME="Twilio";TWILIO_LOGS_LOAD_IMAGE='<center><img id="logs_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';var d=agile_crm_get_widget(Twilio_PLUGIN_NAME);console.log("In Twilio");console.log(d);Numbers=agile_crm_get_contact_properties_list("phone");console.log(Numbers);Twilio_Plugin_Id=d.id;console.log("Plugin prefs in Twilio: "+d.prefs);if(d.prefs==undefined||d.prefs=="{}"){setupTwilioOAuth();return}var c=JSON.parse(d.prefs);console.log(c);twilioError(Twilio_PLUGIN_NAME,'Please delete this widget and add the new improved Twilio widget from the <a href="#add-widget" >widget settings page</a>.');$("#twilio_verify").die().live("click",function(a){a.preventDefault();if(!isValidForm($("#twilio_call_form"))){return}var b=$("#twilio_from").val();console.log("Twilio verify from number: "+b);verifyNumberFromTwilio(b,function(f){$("#Twilio").html(getTemplate("twilio-verify",f))})});$("#twilio_proceed").die().live("click",function(a){a.preventDefault();var b=agile_crm_get_widget_prefs(Twilio_PLUGIN_NAME);console.log("check_twilio_prefs : "+b);if(!b.verificaton_status||b.verificaton_status=="success"){checkTwilioNumbersAndGenerateToken(b)}else{if(check_prefs.verificaton_status=="failure"){$("#Twilio").html(getTemplate("twilio-initial",{}))}}})});