var Widget_Collection_Events = Base_Collection_View.extend({

   events : {
   	  "click .install-custom-widget" : "addCustomWidgetClicked",
   },

   addCustomWidgetClicked : function(e){

   },
});

var Widget_Model_Events = Base_Model_View.extend({

  options : {
    saveCallback : function(e){            
      var widgetType = $('#widget-settings').attr('widget-type');
      if(widgetType == "CUSTOM"){  
        if(e){      
          showNotyPopUp("success" , "{{agile_lng_translate 'widgets' 'saved-success'}}", "bottomRight");
          window.location.href = "#add-widget";
        }else{
          showNotyPopUp("error" , "{{agile_lng_translate 'widgets' 'widgetname-exists'}}", "bottomRight");
        }
      }
    }
  },

  events : {
      "click #stripe_url" : "stripeUrl",
   	  "click .save-agile-widget" : "saveWidgetPrefs",
   	  "click .connect_shopify" : "connectShopify",
   	  "click .revoke-widget" : "revokeWidget",
      "change #script_type" : "scriptType",      
      "click #cancel_custom_widget" : "cancelWidget",
      "click .deleteWidget" : "deleteWidget"

   },

  deleteWidget : function(e){
     var ele = $(e.currentTarget);
    // Fetch widget name from the widget on which delete is clicked
    var widget_name = $(ele).attr('widget-name');
    var widgetNameDisplay = $(ele).attr('widget-displayname');

    // If not confirmed to delete, return
    var displayName;
    
    if(widgetNameDisplay){
      displayName = widgetNameDisplay;
    }else{
      displayName = widgetDisplayname[widget_name];
      if(!displayName){
        displayName = widget_name;
      } 
    }
    

    showAlertModal("Are you sure to delete " + displayName + "?", "confirm", function(){
      delete_widget(widget_name);

      if(widget_name == "Linkedin")
        $('#Linkedin-container').hide();
      
      if(widget_name == "Twilio")
        $('#Twilio-container').hide();
    },undefined, "Delete Widget");
  },

  scriptType: function(){
      var script_type = $('#script_type').val();
      if (script_type == "script"){
        $('#script_div').show();
        $('#url_div').hide();
        return;
      }

      if (script_type == "url"){
        $('#script_div').hide();
        $('#url_div').show();
      }
  },

  cancelWidget: function(){
    Backbone.history.navigate('add-widget', { trigger : true });
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
      location.reload();
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

		$(ele).attr("disabled", "disabled").val("{{agile_lng_translate 'others' 'saving'}}");

      if(widgetName != "TwilioIO"){
         // Saves the preferences into widget with name
         save_widget_prefs(widgetName, JSON.stringify(prefs), function(data){
            console.log(data);
            $(ele).removeAttr("disabled").val("{{agile_lng_translate 'modals' 'save'}}");
         });
      }else{
         createAppSid(prefs, function(data){
               // Update prefs
               console.log(data);
              prefs["twilio_app_sid"] = data;
              if (prefs["twilio_twimlet_url"] == "" || prefs["twilio_twimlet_url"] == "None"){
                prefs["twilio_twimlet_url"] = "";
              }
             // Saves the preferences into widget with name
             save_widget_prefs(widgetName, JSON.stringify(prefs), function(data){
                console.log(data);
                $(ele).removeAttr("disabled").val("{{agile_lng_translate 'modals' 'save'}}");
             });
         });
      }

		
   },

   connectShopify : function(e){
   	  e.preventDefault();

      var shopName = $('#shop').val();
		if (shopName != "" && !validateEmail(shopName)){
			var domain = window.location.origin;
			window.location = "/scribe?service_type=shopify&url=shopify&isForAll="+isForAll+"&shop=" + shopName + "&domain=" + domain + "";
		}else{
			showAlertModal("enter_shop_name", undefined, function(){
        $('#shop').focus();
      });
			return false;
		}
   }

});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}