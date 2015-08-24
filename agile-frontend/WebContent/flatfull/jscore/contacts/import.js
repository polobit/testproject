/**
 * Defines actions on events on imports contacts element, which does validation
 * on the import template, whether contact have first_name last_name which are
 * mandatory fields. If first naRme and last name are not specified or specified
 * same label for different fields then error message is shown and will not send
 * request to save.
 */
function initializeImportListeners(){

	$('#prefs-tabs-content #google-import').off();
    $('#prefs-tabs-content').on('click', '#google-import', function(e){
		
		// URL to return, after fetching token and secret key from LinkedIn
		var callbackURL = window.location.href + "/contacts";
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
	
	$('#prefs-tabs-content #google-import-prefs-delete').off();
	 $('#prefs-tabs-content').on('click', '#google-import-prefs-delete', function(e){
		e.preventDefault();
		var disabled = $(this).attr("disabled");
		if(disabled)
			return;
		
		$(this).attr("disabled", "disabled");
		
		$(this).after(getRandomLoadingImg());
		
		console.log(App_Widgets.contact_sync_google.model.destroy({success : function(){
			App_Widgets.contact_sync_google.model.clear();
			App_Widgets.contact_sync_google.render(true);
		}}));
	});

	$('#prefs-tabs-content #sync-type').off();
	$('#prefs-tabs-content').on('change', '#sync-type', function(e){
		e.preventDefault();
		var value = $(this).val();
		if(value == "AGILE_TO_CLIENT" || value == "TWO_WAY")
			{
				$("#sync_to_group_controlgroup").show();
				$("#my_contacts_sync_group").show();
				if(value == "AGILE_TO_CLIENT")
				{
					$("#sync_from_group_controlgroup").hide();
					return;
				}
				
				$("#sync_from_group_controlgroup").show();
			}
		else
			{
				$("#sync_from_group_controlgroup").show();
				$("#sync_to_group_controlgroup").hide();
				$("#my_contacts_sync_group").hide();
			}
		
	})
	
	$('#prefs-tabs-content .save-contact-prefs').off();
	$('#prefs-tabs-content').on('click', '.save-contact-prefs', function(e){
		e.preventDefault();
		var disabled = $(this).attr("disabled");
		if(disabled)
			return;
		
		if(!isValidForm("#google-contacts-import-form"))
			{
				return;
			};
				
		$(this).attr("disabled", "disabled");
		$(this).text("Syncing");
		
//	return;
		
		var syncPrefs = serializeForm("google-contacts-import-form");
		syncPrefs["inProgress"] = true;
		App_Widgets.setup_google_contacts.model.set(syncPrefs, {silent:true});
		var url = App_Widgets.setup_google_contacts.model.url;

		$(this).after(getRandomLoadingImg());
		App_Widgets.setup_google_contacts.model.url = url + "?sync=true"
		App_Widgets.setup_google_contacts.model.save({}, {success : function(data){
		
			App_Widgets.setup_google_contacts.render(true);
			App_Widgets.setup_google_contacts.model.url = url;	
				show_success_message_after_save_button("Sync Initiated", App_Widgets.setup_google_contacts.el);
				showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
			}});
		
	})
	
	$('#prefs-tabs-content #quickbook_sync_prefs').off();
	$('#prefs-tabs-content').on('click', '#quickbook_sync_prefs', function(e){
		e.preventDefault();
		var disable = $(this).attr('disabled');
		if(disable)
			return false;
		$(this).attr("disabled", "disabled");
		$(this).text("Syncing");
		
		var quickbookPrefs = serializeForm("quickbook-form");
		quickbookPrefs['inProgress'] = true;
		
		App_Widgets.quickbook_import_settings.model.set(quickbookPrefs, {silent:true});
		var url = App_Widgets.quickbook_import_settings.model.url;

		$(this).after(getRandomLoadingImg());
		App_Widgets.quickbook_import_settings.model.url = url + "?sync=true"
		App_Widgets.quickbook_import_settings.model.save({}, {success : function(data){
		
			App_Widgets.quickbook_import_settings.render(true);
			App_Widgets.quickbook_import_settings.model.url = url;	
				show_success_message_after_save_button("Sync Initiated", App_Widgets.quickbook_import_settings.el);
				showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
			}});
		
	});
	
	$('#prefs-tabs-content #xero_sync_prefs').off();
	$('#prefs-tabs-content').on('click', '#xero_sync_prefs', function(e){
		e.preventDefault();
		var disable = $(this).attr('disabled');
		if(disable)
			return false;
		$(this).attr("disabled", "disabled");
		$(this).text("Syncing");
		
		var xeroPrefs = serializeForm("quickbook-form");
		xeroPrefs['inProgress'] = true;
		
		App_Widgets.xero_import_settings.model.set(xeroPrefs, {silent:true});
		var url = App_Widgets.xero_import_settings.model.url;

		$(this).after(getRandomLoadingImg());
		App_Widgets.xero_import_settings.model.url = url + "?sync=true"
		App_Widgets.xero_import_settings.model.save({}, {success : function(data){
		
			App_Widgets.xero_import_settings.render(true);
			App_Widgets.xero_import_settings.model.url = url;	
				show_success_message_after_save_button("Sync Initiated", App_Widgets.xero_import_settings.el);
				showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
			}});
		
	});
	
	$('#prefs-tabs-content #freshbooks_sync_prefs').off();
	$('#prefs-tabs-content').on('click', '#freshbooks_sync_prefs', function(e){
					e.preventDefault();
					var disable = $(this).attr('disabled');
					if(disable)
						return false;
					$(this).attr("disabled", "disabled");
					$(this).text("Syncing");
					
					var freshbooks_prefs = serializeForm("freshbooks-form");
					freshbooks_prefs['inProgress'] = true;
					
					App_Widgets.freshbooks_import_settings.model.set(freshbooks_prefs, {silent:true});
					var url = App_Widgets.freshbooks_import_settings.model.url;

					$(this).after(getRandomLoadingImg());
					App_Widgets.freshbooks_import_settings.model.url = url + "?sync=true"
					App_Widgets.freshbooks_import_settings.model.save({}, {success : function(data){
					
						App_Widgets.freshbooks_import_settings.render(true);
						App_Widgets.freshbooks_import_settings.model.url = url;	
							show_success_message_after_save_button("Sync Initiated", App_Widgets.freshbooks_import_settings.el);
							showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
						}});
					
				});

	//oauth request for xero
$('#prefs-tabs-content #xeroconnect').off();
$('#prefs-tabs-content').on('click', '#xeroconnect', function(e){
	var callbackURL = window.location.href;
	console.log(callbackURL);

	// For every request of import, it will ask to grant access
	window.location = "/scribe?service=xero&return_url=" + encodeURIComponent(callbackURL);
	return false;
});

$('#prefs-tabs-content #sync-google-calendar').off();
$("#prefs-tabs-content").on('click', '#sync-google-calendar', function(e)
	{
		e.preventDefault();

		// URL to return, after fetching token and secret key from LinkedIn
		var callbackURL = window.location.href;

		// For every request of import, it will ask to grant access
		window.location = "/scribe?service=google_calendar&return_url=" + encodeURIComponent(callbackURL);
	});

	$('#prefs-tabs-content #sync-google-calendar-delete').off();
	$("#prefs-tabs-content").on('click', '#sync-google-calendar-delete', function(e)
	{
		e.preventDefault();

		var disabled = $(this).attr("disabled");
		if (disabled)
			return;

		$(this).attr("disabled", "disabled");

		$(this).after(getRandomLoadingImg());
		App_Widgets.calendar_sync_google.model.url = "/core/api/calendar-prefs"
		console.log(App_Widgets.calendar_sync_google.model.destroy({ success : function()
		{

			App_Widgets.calendar_sync_google.model.clear();
			App_Widgets.calendar_sync_google.model.url = "/core/api/calendar-prefs/get"
			App_Widgets.calendar_sync_google.render(true);
			erase_google_calendar_prefs_cookie();

		} }));
	});
	
}

function show_success_message_after_save_button(message, el)
{
	
	/*
	 * Appends success message to form
	 * actions block in form, if window
	 * option is not set for view
	 *
	 */
	$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px" class="text-success"><i>'+message+'</i></p></small></div>');
	$(".form-actions", el).append($save_info);
	$save_info.show().delay(3000).hide(1);	
		
}




//Compute the edit distance between the two given strings
function getEditDistance(a, b) {
  if(a.length === 0) return b.length; 
  if(b.length === 0) return a.length; 
 
  var matrix = [];
 
  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }
 
  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }
 
  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }
 
  return matrix[b.length][a.length];
};