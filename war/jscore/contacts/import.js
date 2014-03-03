/**
 * Defines actions on events on imports contacts element, which does validation
 * on the import template, whether contact have first_name last_name which are
 * mandatory fields. If first naRme and last name are not specified or specified
 * same label for different fields then error message is shown and will not send
 * request to save.
 */
$(function()
{

	$('#google-import').die().live('click', function(e)
	{

		
		// URL to return, after fetching token and secret key from LinkedIn
		var callbackURL = window.location.href;
		console.log(callbackURL);

		// For every request of import, it will ask to grant access
		window.location = "/scribe?service=google&return_url=" + encodeURIComponent(callbackURL);

		// this code is used, if once permission is granted, we refresh the
		// tokens and import without asking for permission again and again
		
		// $.getJSON("/core/api/contactprefs/google", function(data)
		// {
		//		
		// console.log(data);
		// if (!data)
		// {
		// $("#google-delete-import").hide();
		// window.location = "/scribe?service=google&return_url=" +
		// encodeURIComponent(callbackURL);
		// return;
		// }
		//					
		// var url = '/scribe?service_type=google';
		// $("#google-delete-import").show();
		//		
		// $.post(url, function(data)
		// {
		// console.log("in success");
		// }).error(function(data)
		// {
		// console.log(data.responseText);
		// });
		//		
		// }).error(function(data)
		// {
		//					
		// });

	});
	
	$("#google-import-prefs-delete").die().live("click", function(e){
		e.preventDefault();
		var disabled = $(this).attr("disabled");
		if(disabled)
			return;
		
		$(this).attr("disabled", "disabled");
		
		$(this).after(LOADING_HTML);
		
		console.log(App_Settings.contact_sync_google.model.destroy({success : function(){
			App_Settings.contact_sync_google.model.clear();
			App_Settings.contact_sync_google.render(true);
		}}));
	});
	
	$("#sync-type").die().live('change', function(e){
		e.preventDefault();
		var value = $(this).val();
		if(value == "AGILE_TO_CLIENT" || value == "TWO_WAY")
			{
				$("#sync_to_group_controlgroup").show();
				$("#my_contacts_sync_group").show();
			}
		else
			{
				$("#sync_to_group_controlgroup").hide();
				$("#my_contacts_sync_group").hide();
			}
		
	})
	
	$(".save-contact-prefs").die().live('click', function(e){
		e.preventDefault();
		var disabled = $(this).attr("disabled");
		var sync = $(this).attr("sync");
		if(disabled)
			return;
		
		if(!isValidForm("#google-contacts-import-form"))
			{
				return;
			};
				
		$(this).attr("disabled", "disabled");
		
		$(this).after(LOADING_HTML);
		
		App_Settings.contact_sync_google.model.set(serializeForm("google-contacts-import-form"));
		
		var url = App_Settings.contact_sync_google.model.url;
		if(sync)
		{
			
			App_Settings.contact_sync_google.model.url = url + "?sync=true"
		}
		App_Settings.contact_sync_google.model.save({success : function(data){
				App_Settings.contact_sync_google.render(true);
				App_Settings.contact_sync_google.model.url = url;
			}});
	})

});
