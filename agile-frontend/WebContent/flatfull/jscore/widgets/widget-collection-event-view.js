var Widget_Collection_Events = Base_Collection_View.extend({

   events : {
   	  "click .install-custom-widget" : "addCustomWidgetClicked",
   },

   addCustomWidgetClicked : function(e){

   },
});


var Widget_Model_Events = Base_Model_View.extend({

   events : {
        "click #stripe_url" : "stripeUrl",
   	  "click .save-agile-widget" : "saveWidgetPrefs",
   	  "click .connect_shopify" : "connectShopify",
   	  "click .revoke-widget" : "revokeWidget"
   },

   stripeUrl: function(){
     var url = $('#stripe_url').attr('url');
     $('#stripe_url').attr('disabled', 'disabled');
     var scope = $("input:radio[name='scope']:checked").val();
     url += "&scope="+scope+"&return_url="+ encodeURIComponent(window.location.href);     
     window.location.assign(url);
   },

   revokeWidget : function(e){
   		e.preventDefault();
      	var ele = $(e.currentTarget);
      	
   		var widgetName = $(ele).closest("#widget-settings").attr("widget-name");
   		delete_widget(widgetName);
   		window.location.href = "#add-widget";
   },

   saveWidgetPrefs : function(e){
      e.preventDefault();
      var ele = $(e.currentTarget);

      var widgetName = $(ele).closest("#widget-settings").attr("widget-name");
      if(!widgetName){
      	  return;
      }
	  
	  // Checks whether all input fields are given
	  if (!isValidForm($(ele).closest("form"))){
		 return;
	  }

		var prefs = serializeForm($(ele).closest("form").attr("id"));
		console.log(prefs);

		if(widgetName == "Sip"){
			prefs["sip_publicid"] = "sip:" + prefs["sip_privateid"] + "@" + prefs["sip_realm"]; 
		}

		if($(ele).attr("disabled"))
			  return;

		$(ele).attr("disabled", "disabled").val("Saving...");

      if(widgetName != "TwilioIO"){
         // Saves the preferences into widget with name
         save_widget_prefs(widgetName, JSON.stringify(prefs), function(data){
            console.log(data);
            $(ele).removeAttr("disabled").val("Save");
         });
      }else{
         createAppSid(prefs, function(data){
               // Update prefs
               console.log(data);
               prefs["twilio_app_sid"] = data;
               // Saves the preferences into widget with name
               save_widget_prefs(widgetName, JSON.stringify(prefs), function(data){
                  console.log(data);
                  $(ele).removeAttr("disabled").val("Save");
               });
         });
      }

		
   },

   connectShopify : function(e){
   	  e.preventDefault();

      var shopName = $('#shop').val();
		if (shopName != ""){
			var domain = window.location.origin;
			window.location = "/scribe?service_type=shopify&url=shopify&isForAll="+isForAll+"&shop=" + shopName + "&domain=" + domain + "";
		}else{
			alert("Enter Shop name");
			$('#shop').focus();
			return false;
		}
   }

});