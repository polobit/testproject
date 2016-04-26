function setupClickDeskAuth(){$("#ClickDesk").html(CLICKDESK_UPDATE_LOAD_IMAGE);console.log("In ClickDesk Auth");$("#ClickDesk").html(getTemplate("clickdesk-login",{}));$("#save_clickdesk_prefs").die().live("click",function(a){a.preventDefault();if(!isValidForm($("#clickdesk_login_form"))){return}saveClickDeskPrefs()})}function saveClickDeskPrefs(){var a={};a.clickdesk_username=$("#clickdesk_username").val();a.clickdesk_api_key=$("#clickdesk_api_key").val();agile_crm_save_widget_prefs(CLICKDESK_PLUGIN_NAME,JSON.stringify(a),function(b){showClickDeskProfile()})}function showClickDeskProfile(){$("#ClickDesk").html(CLICKDESK_UPDATE_LOAD_IMAGE);if(!Email){clickDeskError(CLICKDESK_PLUGIN_NAME,"Please provide email for this contact");return}getChats(function(a){showChats(a)});Tickets_clicked=false;$("#clickdesk_tickets").die().live("click",function(a){a.preventDefault();if(Tickets_clicked){return}getClickDeskTickets(0,function(b){showClickDeskTickets(b)});Tickets_clicked=true})}function getChats(c){queueGetRequest("widget_queue","/core/api/widgets/clickdesk/chats/"+ClickDesk_Plugin_Id+"/"+Email+"/0","json",function b(d){if(!d){return}if(c&&typeof(c)==="function"){c(d)}registerClickEventsInChat(d)},function a(d){$("#chats_load").remove();clickDeskError("ClickDesk",d.responseText)})}function showChats(a){$("#ClickDesk").html(getTemplate("clickdesk-profile",a));if(a.length==0){$("#clickdesk_chats_panel").html('<li class="sub_header_li">No chats</li>');return}$("#clickdesk_chats_panel").html(getTemplate("clickdesk-chat-stream",a));head.js(LIB_PATH+"lib/jquery.timeago.js",function(){$(".time-ago",$("#clickdesk_chats_panel")).timeago()})}function registerClickEventsInChat(a){$("#clickdesk_chat_show").die().live("click",function(c){c.preventDefault();var b=JSON.parse($(this).attr("data-attr"));showChatModal(b)});$("#more_chats_link").die().live("click",function(b){b.preventDefault();if(!a.length>=5){clickDeskStreamError("clickdesk-chats-error-panel","No more chats");return}var c=$("#chats ul li").length;console.log("offset in more chats: "+c);getMoreChats(c,function(d){showMoreChats(d)})})}function showChatModal(a){$("#clickdesk_chat_showModal").remove();$("#content").append(getTemplate("clickdesk-show-chat",a));$(".time-ago",$("#clickdesk_chat_showModal")).timeago();$("#clickdesk_chat_showModal").modal("show")}function getMoreChats(a,b){$("#spinner-clickdesk-chats").show();$.get("/core/api/widgets/clickdesk/chats/"+ClickDesk_Plugin_Id+"/"+Email+"/"+a,function(c){if(b&&typeof(b)==="function"){b(c)}},"json").error(function(c){$("#spinner-clickdesk-chats").hide();clickDeskStreamError("clickdesk-chats-error-panel",c.responseText)})}function showMoreChats(a){$("#spinner-clickdesk-chats").hide();if(a.length==0){clickDeskStreamError("clickdesk-chats-error-panel","No more chats");return}$("#clickdesk_chats_panel").append(getTemplate("clickdesk-chat-stream",a));$(".time-ago",$("#clickdesk_chats_panel")).timeago()}function getClickDeskTickets(a,b){$("#clickdesk_tickets_panel").html(CLICKDESK_UPDATE_LOAD_IMAGE);$.get("/core/api/widgets/clickdesk/tickets/"+ClickDesk_Plugin_Id+"/"+Email+"/"+a,function(c){if(!c){return}if(b&&typeof(b)==="function"){b(c)}registerEventsInTickets(c)},"json").error(function(c){$("#chats_load").remove();if(a==0){Tickets_clicked=false}clickDeskError("clickdesk_tickets_panel",c.responseText)})}function showClickDeskTickets(a){if(a.length==0){$("#clickdesk_tickets_panel").html('<li class="sub_header_li">No tickets</li>');return}$("#clickdesk_tickets_panel").html(getTemplate("clickdesk-ticket-stream",a));head.js(LIB_PATH+"lib/jquery.timeago.js",function(){$(".time-ago",$("#clickdesk_tickets_panel")).timeago()})}function registerEventsInTickets(a){$("#clickdesk_ticket_show").die().live("click",function(b){b.preventDefault();var c=JSON.parse($(this).attr("data-attr"));showTicketModal(c)});$("#more_tickets_link").die().live("click",function(b){b.preventDefault();if(!a.length>=5){clickDeskStreamError("clickdesk-tickets-error-panel","No more tickets");return}var c=$("#c_tickets ul li").length;console.log("offset "+c);getMoreTickets(c,function(d){showMoreTickets(d)})})}function showTicketModal(a){$("#clickdesk_ticket_showModal").remove();$("#content").append(getTemplate("clickdesk-show-ticket",a));$(".time-ago",$("#clickdesk_ticket_showModal")).timeago();$("#clickdesk_ticket_showModal").modal("show")}function getMoreTickets(a,b){$("#spinner-clickdesk-tickets").show();$.get("/core/api/widgets/clickdesk/tickets/"+ClickDesk_Plugin_Id+"/"+Email+"/"+a,function(c){if(b&&typeof(b)==="function"){b(c)}},"json").error(function(c){$("#spinner-clickdesk-tickets").hide();clickDeskStreamError("clickdesk-tickets-error-panel",c.responseText)})}function showMoreTickets(a){$("#spinner-clickdesk-tickets").hide();if(a.length==0){clickDeskStreamError("clickdesk-tickets-error-panel","No more tickets");return}$("#clickdesk_tickets_panel").append(getTemplate("clickdesk-ticket-stream",a));$(".time-ago",$("#clickdesk_tickets_panel")).timeago()}function clickDeskError(c,b){var a={};a.message=b;$("#"+c).html(getTemplate("clickdesk-error",a))}function clickDeskStreamError(b,a){clickDeskError(b,a);$("#"+b).show();$("#"+b).fadeOut(10000)}$(function(){CLICKDESK_PLUGIN_NAME="ClickDesk";CLICKDESK_UPDATE_LOAD_IMAGE='<center><img id="chats_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';var a=agile_crm_get_widget(CLICKDESK_PLUGIN_NAME);console.log("In ClickDesk");console.log(a);ClickDesk_Plugin_Id=a.id;Email=agile_crm_get_contact_property("email");console.log("Email: "+Email);if(a.prefs==undefined){setupClickDeskAuth();return}showClickDeskProfile();$(".clickdesk_ticket_hover").live("mouseenter",function(b){$(this).find(".clickdesk_ticket_tab_link").show()});$(".clickdesk_ticket_hover").live("mouseleave",function(b){$(".clickdesk_ticket_tab_link").hide()});$(".clickdesk_chat_hover").live("mouseenter",function(b){$(this).find(".clickdesk_chat_tab_link").show()});$(".clickdesk_chat_hover").live("mouseleave",function(b){$(".clickdesk_chat_tab_link").hide()})});