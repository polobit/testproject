$(function()
{
	$("#import_shopify").die().live('click', function(e)
			{
				var shopName = $('#shop').val();
				if(shopName == ""){
					alert("Enter Shop name");
					$('#shop').focus();
					return false;
				}
				var domain = window.location.origin;
		      
				e.preventDefault();
				window.location = "/scribe?service_type=shopify&url=sync&shop="+shopName+"&domain="+domain+"";
				
			});
	
			
	
			
			$("#shopify-setting").die().live('click',function(e){
				e.preventDefault();
				var disabled = $(this).attr("disabled");
				if(disabled){
					return false;
				}else{
				$(this).attr("disabled", "disabled");
				$(this).text("Syncing");
				}

				
				var syncPrefs = serializeForm("shopify-contact-import-form");
				syncPrefs["inProgress"] = true;
				App_Widgets.shopify_sync_setting.model.set(syncPrefs, {silent:true});
				var url = App_Widgets.shopify_sync_setting.model.url;

				$(this).after(getRandomLoadingImg());
				App_Widgets.shopify_sync_setting.model.url = url + "?sync=true"
				App_Widgets.shopify_sync_setting.model.save({}, {success : function(data){
				
					App_Widgets.shopify_sync_setting.render(true);
					App_Widgets.shopify_sync_setting.model.url = url;	
						show_success_message_after_save_button("Sync Initiated", App_Widgets.shopify_sync_setting.el);
						showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
					}});
				
			});
			

});