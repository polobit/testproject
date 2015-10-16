/**
 * Defines actions on events on imports contacts element, which does validation
 * on the import template, whether contact have first_name last_name which are
 * mandatory fields. If first naRme and last name are not specified or specified
 * same label for different fields then error message is shown and will not send
 * request to save.
 */







function initializeImportListeners(){

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
	

	//oauth request for xero
$('#prefs-tabs-content #xeroconnect').off();
$('#prefs-tabs-content').on('click', '#xeroconnect', function(e){
	var callbackURL = window.location.href;
	console.log(callbackURL);

	// For every request of import, it will ask to grant access
	window.location = "/scribe?service=xero&return_url=" + encodeURIComponent(callbackURL);
	return false;
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