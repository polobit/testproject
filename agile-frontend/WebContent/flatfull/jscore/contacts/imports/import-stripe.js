$(function()
{
	$('body').on('click', '#stripe_import', function(e)
	{
		var callbackURL = window.location.origin + "/#sync/stripe-import";
		console.log(callbackURL);

		// For every request of import, it will ask to grant access
		window.location = "/scribe?service=stripe_import&return_url=" + encodeURIComponent(callbackURL);
		return false;
	});

	$('body').on('click', '#stripe-import-prefs-delete', function(e)
	{
		e.preventDefault();
		var disable = $(this).attr("disabled");
		if (disable)
			return;
		$(this).attr("disabled", "disabled");
		$(this).after(getRandomLoadingImg());
		console.log(App_Widgets.stripe_sync.model.destroy({ success : function()
		{
			App_Widgets.stripe_sync.model.clear();
			App_Widgets.stripe_sync.render(true);
		} }));

	});
	
	$('body').on('click', '#stripe_sync_prefs', function(e){
		e.preventDefault();
		var disabled = $(this).attr("disabled");
		if(disabled){
			return false;
		}else{
		$(this).attr("disabled", "disabled");
		$(this).text("Syncing");
		}

		
		var syncPrefs = serializeForm("stripe-prefs-form");
		syncPrefs["inProgress"] = true;
		App_Widgets.stripe_sync_setting.model.set(syncPrefs, {silent:true});
		var url = App_Widgets.stripe_sync_setting.model.url;

		$(this).after(getRandomLoadingImg());
		App_Widgets.stripe_sync_setting.model.url = url + "?sync=true"
		App_Widgets.stripe_sync_setting.model.save({}, {success : function(data){
		
			App_Widgets.stripe_sync_setting.render(true);
			App_Widgets.stripe_sync_setting.model.url = url;	
				show_success_message_after_save_button("Sync Initiated", App_Widgets.stripe_sync_setting.el);
				showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
			}});
		
	});

});
