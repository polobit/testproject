function setUpFreshbooksAuth(){$("#FreshBooks").html(FRESHBOOKS_LOGS_LOAD_IMAGE);$("#FreshBooks").html(getTemplate("freshbooks-login",{}));$("#freshbooks_save_token").die().live("click",function(b){b.preventDefault();if(!isValidForm($("#freshbooks_login_form"))){return}savefreshBooksPrefs()})}function savefreshBooksPrefs(){var b={};b.freshbooks_apiKey=$("#freshbooks_apiKey").val();b.freshbooks_url=$("#freshbooks_url").val();agile_crm_save_widget_prefs(FRESHBOOKS_PLUGIN_NAME,JSON.stringify(b),function(a){showFreshBooksClient()})}function showFreshBooksClient(){$("#FreshBooks").html(FRESHBOOKS_LOGS_LOAD_IMAGE);if(!Email){freshBooksError(FRESHBOOKS_PLUGIN_NAME,"Please provide email for this contact");return}queueGetRequest("widget_queue","/core/api/widgets/freshbooks/clients/"+FreshBooks_Plugin_id+"/"+Email,"json",function c(a){console.log("In FreshBooks clients");console.log(a);if(!a){return}$("#FreshBooks").html(getTemplate("freshbooks-profile",a));if(!a.client){return}if(isArray(a.client)){getInvoicesOfClient(a.client[0].client_id)}else{getInvoicesOfClient(a.client.client_id)}},function d(a){console.log("In FreshBooks clients error ");console.log(a);$("#freshbooks_invoice_load").remove();freshBooksError("FreshBooks",a.responseText)})}function getInvoicesOfClient(b){$.get("/core/api/widgets/freshbooks/invoices/"+FreshBooks_Plugin_id+"/"+b,function(d){var a=$(getTemplate("freshbooks-invoice",d));head.js(LIB_PATH+"lib/jquery.timeago.js",function(){$(".time-ago",a).timeago()});$("#freshbooks_invoice_panel").html(a)},"json").error(function(a){freshBooksError("freshbooks_invoice_panel",a.responseText)})}function addClientToFreshBooks(h,e){var f=agile_crm_get_contact_property("company");var g="/core/api/widgets/freshbooks/add/client/"+FreshBooks_Plugin_id+"/"+h+"/"+e+"/"+Email;g+="/"+f;$.get(g,function(a){console.log("In FreshBooks add client ");console.log(a);if(a.status=="ok"){showFreshBooksClient()}},"json").error(function(a){freshBooksError("FreshBooks",a.responseText)})}function freshBooksError(f,d){var e={};e.message=d;$("#"+f).html(getTemplate("freshbooks-error",e))}$(function(){FRESHBOOKS_PLUGIN_NAME="FreshBooks";FRESHBOOKS_LOGS_LOAD_IMAGE='<center><img id="freshbooks_invoice_load" src="img/ajax-loader-cursor.gif" style="margin-top: 14px;margin-bottom: 10px;"></img></center>';var d=agile_crm_get_widget(FRESHBOOKS_PLUGIN_NAME);console.log("In FreshBooks");console.log(d);FreshBooks_Plugin_id=d.id;Email=agile_crm_get_contact_property("email");console.log("Email: "+Email);if(d.prefs==undefined){setUpFreshbooksAuth();return}showFreshBooksClient();var f=agile_crm_get_contact_property("first_name");var e=agile_crm_get_contact_property("last_name");$("#freshbooks_add_client").die().live("click",function(a){a.preventDefault();addClientToFreshBooks(f,e,Email)})});