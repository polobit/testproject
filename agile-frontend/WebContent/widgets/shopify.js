function showShopifyClient(d){console.log("calling show shopify client..");if(EmailList.length==0){shopifyError(Shopify_PLUGIN_NAME,"Please provide email for this contact");return}var a=[];for(var c=0;c<EmailList.length;c++){a[c]=EmailList[c].value}console.log(a);console.log("In show Shopify Client"+Shopify_Plugin_Id);queueGetRequest("widget_queue","/core/api/widgets/shopify/"+Shopify_Plugin_Id+"/"+a,"json",function e(h){console.log("In Shopify clients fetching data..");console.log(h);if(h){var f=agile_crm_get_contact_property("first_name")+" "+agile_crm_get_contact_property("last_name");var i=h;console.log("total spent "+i[0].customer.total_spent);h.unshift({name:f,id:i[0].customer.id,shop:d,total_spent:i[0].customer.total_spent,currency:i[0].currency});console.log("customer info "+f);console.log("final data "+h);var g=getTemplate("shopify-profile",h);console.log("libpath is"+LIB_PATH);console.log(g);head.js(LIB_PATH+"lib/jquery.timeago.js",function(){$(".time-ago",g).timeago()});$("#Shopify").html(g)}else{shopifyError(Shopify_PLUGIN_NAME,h.responseText)}},function b(g){console.log("In Shopify error ");console.log(g);console.log("error response "+g);$("#SHOPIFY_PROFILE_LOAD_IMAGE").remove();var f=g.responseText;if(f.indexOf("No Customer found")!=-1){console.log("No customer found");createContact(f)}else{shopifyError("Shopify",f)}})}function createContact(a){$("#"+Shopify_PLUGIN_NAME).html(getTemplate("shopify-profile-addcontact"))}function addContactToShopify(b){var a="https://"+b+"/admin/customers/new";window.open(a,"_blank")}function shopifyError(c,b){var a={};a.message=b;console.log("shopify error ");$("#"+c).html(getTemplate("shopify-error",a))}$(function(){Shopify_PLUGIN_NAME="Shopify";console.log(" welcome to shopify plugin..");SHOPIFY_PROFILE_LOAD_IMAGE='<center><img id="shopify_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';var d=agile_crm_get_widget(Shopify_PLUGIN_NAME);console.log("In Shopify");console.log("found widget "+d);Shopify_Plugin_Id=d.id;var c=JSON.parse(d.prefs);var e=c.shop;console.log("shop name"+e);console.log("showing shopify plugin id "+Shopify_Plugin_Id);Email=agile_crm_get_contact_property("email");console.log("email search found "+Email);EmailList=agile_crm_get_contact_properties_list("email");console.log("List of email in contact "+EmailList);var b=agile_crm_get_contact_property("first_name");var a=agile_crm_get_contact_property("last_name");console.log("found first name "+b);console.log("found last name"+a);if(a==undefined||a==null){a=" "}showShopifyClient(e);$("#shopify_add_contact").die().live("click",function(f){f.preventDefault();addContactToShopify(e)});$(".order").die().live("click",function(g){g.preventDefault();var f=$(this).attr("value");console.log("order id is "+f);$("#collapse-"+f).html(SHOPIFY_PROFILE_LOAD_IMAGE);$.ajax({url:"/core/api/widgets/shopify/items/"+Shopify_Plugin_Id+"/"+f,dataType:"json",success:function(h){console.log("success data"+h);console.log("in success order fetch.");$("#collapse-"+f).html(getTemplate("shopify-line-item",h));$("#SHOPIFY_PROFILE_LOAD_IMAGE").remove()},error:function(h){console.log("in item fetch error"+h);shopifyError(Shopify_PLUGIN_NAME,h);$("#SHOPIFY_PROFILE_LOAD_IMAGE").remove()}});if($("#collapse-"+f).hasClass("collapse")){$("#collapse-"+f).removeClass("collapse")}else{$("#collapse-"+f).addClass("collapse")}})});