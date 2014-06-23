$(function(){ZENDESK_PLUGIN_NAME="Zendesk";ZENDESK_UPDATE_LOAD_IMAGE='<center><img id="tickets_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';var a=agile_crm_get_widget(ZENDESK_PLUGIN_NAME);console.log("In Zendesk");console.log(a);Zendesk_Plugin_Id=a.id;Email=agile_crm_get_contact_property("email");console.log("Email: "+Email);if(a.prefs==undefined){setupZendeskAuth();return}showZendeskProfile();$("#add_ticket").die().live("click",function(b){b.preventDefault();addTicketToZendesk()});$(".zendesk_ticket_hover").live("mouseenter",function(b){$(this).find(".zendesk_tab_link").show()});$(".zendesk_ticket_hover").live("mouseleave",function(b){$(".zendesk_tab_link").hide()})});function setupZendeskAuth(){$("#Zendesk").html(ZENDESK_UPDATE_LOAD_IMAGE);console.log("In Zendesk Auth");$("#Zendesk").html(getTemplate("zendesk-login",{}));$("#save_prefs").die().live("click",function(a){a.preventDefault();if(!isValidForm($("#zendesk_login_form"))){return}saveZendeskPrefs()})}function saveZendeskPrefs(){var a={};a.zendesk_username=$("#zendesk_username").val();a.zendesk_password=$("#zendesk_password").val();a.zendesk_url=$("#zendesk_url").val();agile_crm_save_widget_prefs(ZENDESK_PLUGIN_NAME,JSON.stringify(a),function(b){showZendeskProfile()})}function showZendeskProfile(){$("#Zendesk").html(ZENDESK_UPDATE_LOAD_IMAGE);if(!Email){zendeskError(ZENDESK_PLUGIN_NAME,"Please provide email for this contact");return}getTicketsFromZendesk(function(a){console.log("zendesk profile : "+a);showTicketsInZendesk(a);registerClickEventsInZendesk()})}function getTicketsFromZendesk(c){queueGetRequest("widget_queue","/core/api/widgets/zendesk/profile/"+Zendesk_Plugin_Id+"/"+Email,"json",function b(d){if(c&&typeof(c)==="function"){c(d)}},function a(d){$("#tickets_load").remove();zendeskError(ZENDESK_PLUGIN_NAME,d.responseText)})}function showTicketsInZendesk(e){$("#Zendesk").html(getTemplate("zendesk-profile",e));var c;var b;try{c=JSON.parse(e.all_tickets);b=c.splice(0,5)}catch(d){b=e.all_tickets}var a=$(getTemplate("zendesk-ticket-stream",b));$("#all_tickets_panel").html(a);head.js(LIB_PATH+"lib/jquery.timeago.js",function(){$(".time-ago",a).timeago()});$("#more_tickets").die().live("click",function(f){f.preventDefault();if(!c){return}showMoreTickets(c.splice(0,5))})}function showMoreTickets(b){$("#spinner-tickets").show();if(b.length==0){$("#spinner-tickets").hide();zendeskStreamError("tickets-error-panel","No more tickets");return}var a=$(getTemplate("zendesk-ticket-stream",b));$("#all_tickets_panel").append(a);$("#spinner-tickets").hide();head.js(LIB_PATH+"lib/jquery.timeago.js",function(){$(".time-ago",a).timeago()})}function showTicketById(a,b){a.headline="Ticket "+b;a.desc_len=a.description.length>200;$("#zendesk_showModal").remove();$("#content").append(getTemplate("zendesk-ticket-show",a));$("#zendesk_showModal").modal("show")}function registerClickEventsInZendesk(){$("#ticket_update").die().live("click",function(a){a.preventDefault();var b=$(this).attr("update_id");updateTicketInZendesk(b)});$("#ticket_show").die().live("click",function(b){b.preventDefault();var a=JSON.parse($(this).attr("data-attr"));var c=$(this).attr("ticket_id");showTicketById(a,c)})}function addTicketToZendesk(){var a={};a.headline="Add Ticket";a.info="Add ticket in Zendesk";a.name=agile_crm_get_contact_property("first_name")+" "+agile_crm_get_contact_property("last_name");a.email=Email;$("#zendesk_messageModal").remove();var b=getTemplate("zendesk-message",a);$("#content").append(b);$("#zendesk_messageModal").modal("show");$("#send_request").click(function(c){c.preventDefault();if(!isValidForm($("#zendesk_messageForm"))){return}sendRequestToZendesk("/core/api/widgets/zendesk/add/"+Zendesk_Plugin_Id,"zendesk_messageForm","zendesk_messageModal","add-ticket-error-panel")})}function updateTicketInZendesk(b){var a={};a.headline="Update Ticket";a.info="Updates Ticket No "+b+" in Zendesk";a.id=b;$("#zendesk_messageModal").remove();var c=getTemplate("zendesk-message",a);$("#content").append(c);$("#zendesk_messageModal").modal("show");$("#send_request").click(function(d){d.preventDefault();if(!isValidForm($("#zendesk_messageForm"))){return}sendRequestToZendesk("/core/api/widgets/zendesk/update/"+Zendesk_Plugin_Id,"zendesk_messageForm","zendesk_messageModal","add-ticket-error-panel")})}function sendRequestToZendesk(c,d,a,b){$.post(c,$("#"+d).serialize(),function(e){$("#"+a).find("span.save-status").html("sent");setTimeout(function(){$("#"+a).modal("hide")},2000)}).error(function(e){$("#"+a).modal("hide");zendeskStreamError(b,e.responseText)})}function zendeskError(c,b){var a={};a.message=b;$("#"+c).html(getTemplate("zendesk-error",a))}function zendeskStreamError(b,a){zendeskError(b,a);$("#"+b).show();$("#"+b).fadeOut(10000)};