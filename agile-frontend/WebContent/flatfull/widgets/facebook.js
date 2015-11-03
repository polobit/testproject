function showFacebookMatchingProfile(contact_id, first_name)
{
	var contact_image = agile_crm_get_contact_property("image");
	/*
	 * if (!Email) { facebookError(FACEBOOK_PLUGIN_NAME, "Please provide email
	 * for this contact"); return; }
	 */
	console.log("am in facebook show")
	queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/facebook/contacts/" + FACEBOOK_PLUGIN_ID + "?searchKey=" + first_name, 'json', function success(data)
	{
		console.log('Facebook');
		// console.log(data)
		// If data is not defined return
		if (data)
		{
			data.searchString = SEARCH_STRING;
			// Fill Quickbooks widget template with Quickbooks clients data
			console.log("data is:")
			console.log(data);
			var template = $('#' + FACEBOOK_PLUGIN_NAME).html(getTemplate('facebook-matching-profiles', data));
            
            $("#widgets").off("mouseover", ".facebookImage");
			$("#widgets").on("mouseover", ".facebookImage", function(e)
			{
				// Unique Twitter Id from widget
				Facebook_id = $(this).attr('id');

				// Aligns details to left in the pop over
				$(this).popover({ placement : 'left', html: true });

				/*
				 * Called show to overcome pop over bug (not showing pop over on
				 * mouse hover for first time)
				 */
				$(this).popover('show');

				// on click of any profile, save it to the contact
                $('#' + Facebook_id).off('click');
				$('#' + Facebook_id).on('click', function(e)
				{
					e.preventDefault();

					console.log(Facebook_id);

					// Hide pop over after clicking on any picture
					$(this).popover('hide');

					console.log('on click in search');

					// Web url of twitter for this profile
					var url = "@" + Facebook_id;

					web_url = url;
					console.log(url);

					var propertiesArray = [
						{ "name" : "website", "value" : url, "subtype" : "FACEBOOK" }
					];
					if (!contact_image)
					{
						// Get image link which can be used to save image for
						// contact
						var facebook_image = $(this).attr('src');
						propertiesArray.push({ "name" : "image", "value" : facebook_image });
					}

					/*
					 * If contact title is undefined, saves headline of the
					 * Twitter profile to the contact title
					 */
					if (!agile_crm_get_contact_property("title"))
					{
						// var summary = $(this).attr("summary");
						// propertiesArray.push({ "name" : "title", "value" :
						// summary });
					}

					console.log(propertiesArray);

					agile_crm_update_contact_properties(propertiesArray);

					// show twitter profile by id
					showFacebookProfile(Facebook_id, contact_id);

				});
			});

		}
		else
		{
			facebookError(data.responseText);
		}

	}, function error(data)
	{

		facebookError(data.responseText);

	});

	/*
	 * Displays Twitter profile details on mouse hover and saves profile on
	 * click
	 */

}

/**
 * Shows Facebook error message in the div allocated with given id
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function facebookError(message)
{
	// build JSON with error message
	var error_json = {};
	error_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	console.log('error ');
	$('#' + FACEBOOK_PLUGIN_NAME).html(getTemplate('facebook-error', error_json));

}

function getModifiedFacebookMatchingProfiles(contact_id)
{
	console.log("am in getModifiedFacebookMatchingProfiles");
	// Checks whether all input fields are given
	if (!isValidForm($("#facebook-search_form")))
	{
		return;
	}

	// Shows loading image, until matches profiles are fetched
	$('#spinner-facebook-search').show();

	SEARCH_STRING = $('#facebook_keywords').val();

	showFacebookMatchingProfile(contact_id, SEARCH_STRING);

}

function showFacebookProfile(facebookid, contact_id)
{
	console.log("am in facbook profile");
	queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/facebook/userProfile/" + FACEBOOK_PLUGIN_ID + "/" + facebookid, 'json', function success(data)
	{
		console.log('Facebook');
		console.log(data)
		// If data is not defined return
		if (data)
		{
			var contact_image = agile_crm_get_contact_property("image");
			console.log(contact_image);
			data.image = contact_image;
			$('#Twitter_plugin_delete').show();
			var template = $('#' + FACEBOOK_PLUGIN_NAME).html(getTemplate('facebook-profile', data));
            
            $("#widgets").off("click", "#facebook_post_btn");
			$("#widgets").on("click", "#facebook_post_btn", function(e)
			{
				console.log("post on a wall")
				queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/facebook/postonwall/" + FACEBOOK_PLUGIN_ID + "/" + facebookid + "/" + "hai", 'json',
						function success(data)
						{
							console.log("am at success");
						}, function error(data)
						{
							facebookError(data.responseText);
						});
			});

		}
		else
		{
			facebookError(data.responseText);
		}

	}, function error(data)
	{

		facebookError(data.responseText);

	});
}

function getUserNameOrUserID(url) {
    var n = url.lastIndexOf("/");
    return url.substring(n+1);
}

/**
 * ===facebook.js==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party JavaScript API provided. It interacts with the
 * application based on the function provided on agile_widgets.js (Third
 * party API).
 */
function startFacebookWidget(contact_id)
{
	console.log("in facebook.js")
	// Facebook widget name as a global variable
	FACEBOOK_PLUGIN_NAME = "Facebook";

	// Facebook profile loading image declared as global
	FACEBOOK_PROFILE_LOAD_IMAGE = '<center><img id="facebook_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	// Retrieves Facebook which is fetched using script API
	var facebook_widget = agile_crm_get_widget(FACEBOOK_PLUGIN_NAME);

	// ID of the Facebook widget as global variable
	FACEBOOK_PLUGIN_ID = facebook_widget.id;
	console.log("plugin Id" + FACEBOOK_PLUGIN_ID);

	// Email as global variable
	// Email = agile_crm_get_contact_property('email');
	var first_name = agile_crm_get_contact_property("first_name");
	var last_name = agile_crm_get_contact_property("last_name");

	// setting lastname to empty string if it is undefined
	if (last_name == undefined || last_name == null)
		last_name = '';

	console.log("firstName:" + first_name + "lastname:" + last_name);

	// search string as global varibale
	SEARCH_STRING = first_name + ' ' + last_name;
	console.log("    SEARCH_STRING" + SEARCH_STRING)

	web_url = agile_crm_get_contact_property_by_subtype('website', 'FACEBOOK');
	console.log(web_url);

	if (web_url)
	{
		// Get Twitter id from URL and show profile
		console.log("profile attched" + web_url)
		var fbProfileLink = buildFacebookProfileURL(web_url);
		var userNameOrId = getUserNameOrUserID(fbProfileLink);
		var fbUserId = userNameOrId;
		console.log(fbUserId);
		if(isNaN(fbUserId)) {//if not ID
			console.log("In getID facebook");
			var getURL = "https://graph.facebook.com/"+fbUserId;
			console.log(getURL);

			$.ajax({
    		            url: getURL,
    		            dataType: 'json',
    		            success : function(fbProfileDetails){
    		            	console.log(fbProfileDetails);
			
							if(typeof fbProfileDetails.id != 'undefined') {
								fbUserId = fbProfileDetails.id;				
								var propertiesArray = [{ "name" : "website", "value" : "@"+fbUserId, "subtype" : "FACEBOOK" }];
								console.log(propertiesArray);
								agile_crm_update_contact_properties(propertiesArray);
							} else {
								if(typeof fbProfileDetails.error != 'undefined') {
									facebookError("Facebook profile do not exist.("+fbProfileLink+")");
									return;
								}
							}
    		            }
    		        });
			
			
		}
		showFacebookProfile(fbUserId, contact_id);
	}
	else
	{
		// Shows all the matches in Twitter for the contact
		console.log("no profile attached")
		showFacebookMatchingProfile(contact_id, SEARCH_STRING);
	}

    $("#widgets").off("click", "#facebook_search_btn");
	$("#widgets").on("click", "#facebook_search_btn", function(e)
	{
		e.preventDefault();

		getModifiedFacebookMatchingProfiles(contact_id);
	});

    $("#widgets").off("click", ".facebook_modify_search");
	$("#widgets").on("click", ".facebook_modify_search", function(e)
	{
		e.preventDefault();

		// Twitter_search_details['plugin_id'] = Twitter_Plugin_Id;

		$('#' + FACEBOOK_PLUGIN_NAME).html(getTemplate('facebook-modified-search', { "searchString" : SEARCH_STRING }));
	});
    
    $("#widgets").off("click", "#facebook_search_close");
	$("#widgets").on("click", "#facebook_search_close", function(e)
	{
		e.preventDefault();

		/*
		 * if (search_data) showTwitterMatchingProfiles(search_data); else
		 * getTwitterMatchingProfiles();
		 */
	});
	
	// Deletes Twitter profile on click of delete button in template
    $("#widgets").off("click", "#Facebook_plugin_delete");
	$("#widgets").on("click", "#Facebook_plugin_delete", function(e)
	{
		e.preventDefault();
		web_url = agile_crm_get_contact_property_by_subtype('website', 'FACEBOOK');
		console.log('deleting facebook acct.',web_url);
		agile_crm_delete_contact_property_by_subtype('website', 'FACEBOOK', web_url, function(data)
		{
			console.log("In facebook delete callback");
			showFacebookMatchingProfile(contact_id);
		});

	});
}