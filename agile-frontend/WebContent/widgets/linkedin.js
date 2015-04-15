/**
 * ===linkedin.js==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party JavaScript API provided. It interacts with the
 * application based on the function provided on agile_widgets.js (Third party
 * API)
 */
$(function()
{
	// LinkedIn widget name as global variable
	LINKEDIN_PLUGIN_NAME = "Linkedin";

	// LinkedIn update loading image declared as global
	LINKEDIN_UPDATE_LOAD_IMAGE = '<div id="status_load"><center><img  src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center></div>';

	// Current contact user name in LinkedIn profile
	Linkedin_current_profile_user_name = "";

	// Stores the initial update stream of the contact's LinkedIn profile
	Stream_Data = [];
	Experience_data = "";
	Shared_Connections = [];
	past_search_input = undefined;
	past_search_data = undefined;
	Search_details = {};
	linkedin_web_url = "";

	// Retrieves widget which is fetched using script API
	var linkedin_widget = agile_crm_get_widget(LINKEDIN_PLUGIN_NAME);

	console.log('In LinkedIn');
	console.log(linkedin_widget);
	// ID of the LinkedIn widget as global variable
	LinkedIn_Plugin_Id = linkedin_widget.id;

	/*
	 * Gets LinkedIn widget preferences, required to check whether to show setup
	 * button or to fetch details. If undefined - considering first time usage
	 * of widget, setupLinkedinOAuth is shown and returned
	 */
	if (linkedin_widget.prefs == undefined)
	{
		setupLinkedinOAuth();
		return;
	}

	// Global LinkedIn id
	Linkedin_id = "";

	// Get website URL for LinkedIn from contact to get profile based on it
	linkedin_web_url = agile_crm_get_contact_property_by_subtype('website', 'LINKEDIN');

	console.log(linkedin_web_url);

	if (linkedin_web_url)
	{
		// Get LinkedIn id from URL and show profile
		getLinkedinIdByUrl(linkedin_web_url, function(data)
		{
			Linkedin_id = data;
			showLinkedinProfile(Linkedin_id);
		});
	}
	else
	{
		// Shows all the matches in LinkedIn for the contact
		getLinkedinMatchingProfiles();
	}

	// Deletes LinkedIn profile on click of delete button in template
	$('#Linkedin_plugin_delete').die().live('click', function(event)
	{
		event.preventDefault();

		agile_crm_delete_contact_property_by_subtype('website', 'LINKEDIN', linkedin_web_url, function(data)
		{
			console.log("In linkedin delete callback");
			getLinkedinMatchingProfiles();
		});

	});

	// Sends a message to LinkedIn when clicked on send message button
	$('#linkedin_message').die().live('click', function(e)
	{
		e.preventDefault();
		sendLinkedInMessage(Linkedin_id);
	});

	// Sends an connect request to LinkedIn when clicked on connect button
	$('#linkedin_connect').die().live('click', function(e)
	{
		e.preventDefault();
		sendLinkedInAddRequest(Linkedin_id);
	});

	// ReShares a post in LinkedIn on click of share link
	$('.linkedin_share').die().live('click', function(e)
	{
		e.preventDefault();
		var share_id = $(this).attr("id");
		reSharePost(share_id, "optional", this);
	});

	// Retrieves work positions of a person
	$('#linkedin_experience').die().live('click', function(e)
	{
		e.preventDefault();

		if (Experience_data || Experience_data != "")
			return;

		getExperienceOfPerson(Linkedin_id);
	});

	// Retrieves shared connections between contact and agile user LinkedIn
	$('#linkedin_shared_connections').die().live('click', function(e)
	{
		e.preventDefault();

		if (Shared_Connections.length != 0)
			return;

		getLinkedInSharedConnections(Linkedin_id);
	});

	// on click of updates tab, retrieves network updates
	$('#linkedin_update_tab').die().live('click', function(e)
	{
		e.preventDefault();

		if (Stream_Data.length != 0)
			return;

		getFirstFiveLinkedInNetworkUpdates(Linkedin_id);
	});

	// On click of name link in results to modify, shows modify template
	$('.linkedin_modify_search').die().live('click', function(e)
	{
		e.preventDefault();

		Search_details['plugin_id'] = LinkedIn_Plugin_Id;

		$('#Linkedin').html(getTemplate('linkedin-modified-search', Search_details));
	});

	// On click of search button in modify, retrieves matches for search text
	$('#linkedin_search_btn').die().live('click', function(e)
	{
		e.preventDefault();

		getModifiedLinkedinMatchingProfiles();
	});

	// On click of close button in LinkedIn, show results for past search text
	$('#linkedin_search_close').die().live('click', function(e)
	{
		e.preventDefault();

		if (past_search_data)
			showLinkedinMatchingProfiles(past_search_data);
		else
			getLinkedinMatchingProfiles();
	});

	// On mouse enter of work position, show link to read more
	$('.experience_li').live('mouseenter', function(e)
	{
		$(this).find('.show-summary').show();
	});

	// On mouse leave of work position, hide link to read more
	$('.experience_li').live('mouseleave', function(e)
	{
		$(this).find('.show-summary').hide();
	});

	// On click of show more in work position, show whole summary
	$('.show-summary').die().live('click', function(e)
	{
		e.preventDefault();
		var href = $(this).attr("href");
		var id = $(this).attr('id');
		$('#' + id).text("Less");
		$(".summary-expand-" + id).hide();
		$(href).collapse('toggle');

		// on click of less, hide summary
		$(href).on("hidden", function()
		{
			$(".summary-expand-" + id).show();
			$('#' + id).text("More");
		});
	});

});

/**
 * Shows setup if user adds LinkedIn widget for the first time. Uses
 * ScribeServlet to create a client and get preferences and save it to the
 * widget.
 */
function setupLinkedinOAuth()
{
	$('#Linkedin').html(LINKEDIN_UPDATE_LOAD_IMAGE);

	// URL to return, after fetching token and secret key from LinkedIn
	var callbackURL = window.location.href;

	/*
	 * Creates a URL, which on click can connect to scribe using parameters sent
	 * and returns back to the profile based on return URL provided and saves
	 * widget preferences in widget based on plugin id
	 */
	var url = '/scribe?service=linkedin&return_url=' + encodeURIComponent(callbackURL) + '&plugin_id=' + encodeURIComponent(LinkedIn_Plugin_Id);

	// Shows a link button in the UI which connects to the above URL
	$('#Linkedin')
			.html(
					"<div class='widget_content' style='border-bottom:none;line-height: 160%;' >Build professional relationships with contacts and keep a tab on their business interests.<p style='margin: 10px 0px 5px 0px;' ><a class='btn' href=\"" + url + "\" style='text-decoration: none;'>Link Your LinkedIn</a></p></div>");
}

/**
 * Fetches matching profiles from LinkedIn based on PluginID and current contact
 * first name and last name
 */
function showLinkedinMatchingProfiles(data)
{
	var contact_image = agile_crm_get_contact_property("image");

	/*
	 * search and store string to show it in the search template for the first
	 * time, contact name is search string
	 */
	if (past_search_input)
		Search_details['keywords'] = past_search_input;
	else
	{
		var name = "";
		if (agile_crm_get_contact_property("first_name"))
			name = name + agile_crm_get_contact_property("first_name");
		if (agile_crm_get_contact_property("last_name"))
			name = name + " " + agile_crm_get_contact_property("last_name");
		Search_details['keywords'] = name.trim();
	}

	// If no matches found display message
	if (data.length == 0)
	{
		if (Search_details['keywords'] && Search_details['keywords'] != "")
			linkedinMainError(
					LINKEDIN_PLUGIN_NAME,
					"<p class='a-dotted' style='margin-bottom:0px;'>No matches found for <a href='#search' class='linkedin_modify_search'>" + Search_details['keywords'] + "</a></p>",
					true);
		else
			linkedinMainError(LINKEDIN_PLUGIN_NAME,
					"<p class='a-dotted' style='margin-bottom:0px;'>No matches found. <a href='#search' class='linkedin_modify_search'>Modify search</a></p>",
					true);
		return;
	}

	Search_details['search_results'] = data;

	// Show matching profiles in LinkedIn panel
	$('#Linkedin').html(getTemplate("linkedin-search-result", Search_details));

	/*
	 * Displays LinkedIn profile details on mouse hover of profile, and saves
	 * profile on click
	 */
	$(".linkedinImage").die().live('mouseover', function()
	{
		// Unique LinkedIn Id from widget
		Linkedin_id = $(this).attr('id');

		// Aligns details to left in the pop over
		$(this).popover({ placement : 'left' });

		/*
		 * Called show to overcome pop over bug (not showing pop over on mouse
		 * hover for first time)
		 */
		$(this).popover('show');

		// on click of any profile, save it to the contact
		$('#' + Linkedin_id).die().live('click', function(e)
		{
			e.preventDefault();

			// Hide pop over after clicking on any picture
			$(this).popover('hide');

			console.log('on click in search');

			// Web URL of LinkedIn for this profile
			var url = $(this).attr('url');

			linkedin_web_url = url;

			console.log('LinkedIn URL: ' + url);

			var propertiesArray = [
				{ "name" : "website", "value" : url, "subtype" : "LINKEDIN" }
			];

			if (!contact_image)
			{
				// check if contact has gravatar picture, if so add picture
				if ($(this).attr('is_gravatar_pic') == "false")
				{
					/*
					 * Get image link which can be used to save image for
					 * contact
					 */
					var linkedin_image = $(this).attr('src');
					propertiesArray.push({ "name" : "image", "value" : linkedin_image });
				}
			}

			/*
			 * If contact title is undefined, saves headline of the LinkedIn
			 * profile to the contact title
			 */
			if (!agile_crm_get_contact_property("title"))
			{
				var summary = $(this).attr("summary");
				propertiesArray.push({ "name" : "title", "value" : summary });
			}

			// Add all the properties to contact at once
			agile_crm_update_contact_properties(propertiesArray);

			// show profile by id
			showLinkedinProfile(Linkedin_id);

		});
	});

}

/**
 * Fetches LinkedIn matching profiles based on plugin id
 * 
 * @param callback
 *            callback to create template and show matching profiles
 */
function getLinkedinMatchingProfiles()
{
	// Shows loading image, until matches profiles are fetched
	$('#Linkedin').html(LINKEDIN_UPDATE_LOAD_IMAGE);

	// Gets contact id, to save social results of a particular id
	var contact_id = agile_crm_get_contact()['id'];

	/*
	 * Reads from cookie (local storage HTML5), since widgets are saved using
	 * local storage when matches are fetched for the first time on the contact
	 */
	var data = localStorage.getItem('Agile_linkedin_matches_' + contact_id);

	// If cookie is not available, fetches results from LinkedIn
	if (!data)
	{
		/*
		 * Sends request to url "core/api/widgets/match/" and Calls WidgetsAPI
		 * with contact id and plugin id as path parameters
		 */
		queueGetRequest("widget_queue", "/core/api/widgets/social/match/" + LinkedIn_Plugin_Id + "/" + contact_id, 'json', function(data)
		{
			if(islocalStorageHasSpace()){
				// Store social results in cookie of particular contact
				localStorage.setItem('Agile_linkedin_matches_' + contact_id, JSON.stringify(data));
			}
			// Shows LinkedIn matches in LinkedIn widget
			showLinkedinMatchingProfiles(data);
			

		}, function(data)
		{
			// Remove loading image on error
			$('#status_load').remove();

			// Shows error message if error occurs
			linkedinMainError(LINKEDIN_PLUGIN_NAME, data.responseText);
		});

	}
	else
		// Shows LinkedIn matches in LinkedIn widget
		showLinkedinMatchingProfiles(JSON.parse(data));
}

/**
 * Retrieves matching profile from LinkedIn for entered search text
 */
function getModifiedLinkedinMatchingProfiles()
{
	// Checks whether all input fields are given
	if (!isValidForm($("#linkedin-search_form")))
		return;

	// show loading spinner in search template until fetching results
	$('#spinner-linked-search').show();

	// store past search input as the entered data
	past_search_input = $('#linkedin_keywords').val();

	/*
	 * Sends POST request to URL
	 * "/core/api/widgets/social/modified/match/linkedin/" with widget id as
	 * path parameter and search form as form data
	 */
	$.post("/core/api/widgets/social/modified/match/linkedin/" + LinkedIn_Plugin_Id, $('#linkedin-search_form').serialize(), function(data)
	{
		// hides spinner after loading profiles
		$('#spinner-linked-search').hide();

		// Set past search data from the data retrieved
		past_search_data = data;

		// Show matching profiles
		showLinkedinMatchingProfiles(data);

	}, "json").error(function(data)
	{
		// Remove loading image on error
		$('#spinner-linked-search').remove();

		// Shows error message if error occurs
		linkedinMainError(LINKEDIN_PLUGIN_NAME, data.responseText);
	});
}

/**
 * Shows saved LinkedIn profile based on LinkedIn Id and widget Id
 * 
 * @param Linkedin_id
 *            Linkedin id to fetch profile from LinkedIn
 */
function showLinkedinProfile(Linkedin_id)
{
	// Shows loading image, until profile is fetched
	$('#Linkedin').html(LINKEDIN_UPDATE_LOAD_IMAGE);

	// Stores connected status of agile user with contact LinkedIn profile
	var linkedin_connected;

	// Calls WidgetsAPI class to get LinkedIn profile of contact
	$.get("/core/api/widgets/social/profile/" + LinkedIn_Plugin_Id + "/" + Linkedin_id, function(data)
	{
		if (!data)
			return;

		/*
		 * Sets the LinkedIn name of the profile to the global variable
		 */
		Linkedin_current_profile_user_name = data.name;

		/*
		 * Sets the LinkedIn connected status to the local variable
		 */
		linkedin_connected = data.is_connected;

		/*
		 * If picture is not available to user then show default picture
		 */
		if (data.picture == null)
		{
			data.picture = 'https://contactuswidget.appspot.com/images/pic.png';
		}

		/*
		 * Gets LinkedIn profile template and populate the fields with details
		 */
		$('#Linkedin').html(getTemplate("linkedin-profile", data));

		// If it has experience
		if (data.searchResult)
		{
			// Shows experience in LinkedIn
			showExperienceInLinkedIn(data.searchResult);
		}

	}, "json").error(function(data)
	{
		// Remove loading image on error
		$('#status_load').remove();

		/*
		 * Check if member does not share information for third party
		 * applications
		 */
		if (data.responseText == "Invalid member id {private}")
		{
			linkedinMainError(LINKEDIN_PLUGIN_NAME, "Member doesn't share his information for third party applications");
			return;
		}

		// Shows error message if error occurs
		linkedinMainError(LINKEDIN_PLUGIN_NAME, data.responseText);

	});

	registerEventsInLinkedIn(Linkedin_id, linkedin_connected, Stream_Data);
}

/**
 * Shows experience details in LinkedIn experience panel
 * 
 * @param data
 *            Experience data which has current and past positions
 */
function showExperienceInLinkedIn(data)
{
	var e1 = "";

	/*
	 * Check if data has three current positions or three past positions, if it
	 * doesn't has any data show work status as unavailable
	 */
	if ((!data.three_current_positions || data.three_current_positions.length == 0) && (!data.three_past_positions || data.three_past_positions.length == 0))
	{
		$('#linkedin_experience_panel').html('<div class="widget_content">Work status unavailable</div>');
		return;
	}
	Experience_data = data;

	if (data.three_current_positions)
	{
		e1 = e1.concat(getTemplate("linkedin-experience", data.three_current_positions));
	}

	if (data.three_past_positions)
	{
		e1 = e1.concat(getTemplate("linkedin-experience", data.three_past_positions));
	}

	// show work positions in panel
	$('#linkedin_experience_panel').html(e1);
}

/**
 * Registers events in LinkedIn profile panel
 * 
 * @param Linkedin_id
 *            LinkedIn unique Id
 * @param linkedin_connected
 *            {@link Boolean} whether Agile user and given profile are connected
 * @param Stream_Data
 *            First five network updates
 */
function registerEventsInLinkedIn(Linkedin_id, linkedin_connected, Stream_Data)
{
	// On click of see more link, more updates are retrieved
	$('.linkedin_stream').die().live('click', function(e)
	{
		e.preventDefault();

		/*
		 * Time of the last update is retrieved to get old updates before that
		 * time
		 */
		var end_time = $('ul#linkedin_social_stream').find('li#linkedin_status:last').attr('update_time');

		// It is undefined in case if person does not share his updates
		if (!end_time)
		{
			// Checks if person is already connected in LinkedIn to agile user
			if (linkedin_connected)
			{
				linkedinError("status-error-panel", "This person does not share his/her updates");
				return;
			}

			// If not connected, advice user to connect to see updates
			linkedinError("status-error-panel", "Member does not share his/her updates. Get connected");
			return;
		}

		// Loading image is shown until the updates are retrieved
		$('#spinner-status').show();

		var that = this;

		/*
		 * See more link is disabled until the updates are retrieved since there
		 * may be a chance of getting duplicate updates
		 */
		$(this).removeClass('twitter_stream');

		getAnyFiveNetworkUpdatesInLinkedIn(Linkedin_id, end_time, Stream_Data, that);
	});

	/*
	 * On click of less button, hides update stream and shows current update by
	 * toggling
	 */
	$('#linkedin_less').die().live('click', function(e)
	{
		e.preventDefault();

		// For the first time less attribute is false and will not enter if
		if ($(this).attr("less") == "true")
		{
			/*
			 * On click of see more, less attribute is made false and text on
			 * link is changed as see less and shows all the updates by toggling
			 */
			$(this).attr("less", "false");
			$(this).text("See Less..");
			$('#linkedin_current_activity').hide();
			$('#linkedin_refresh_stream').show();
			return;
		}

		/*
		 * On first click of see less, less attribute is made true and text will
		 * be changed as see more button
		 */
		$(this).attr("less", "true");
		$(this).text("See More..");
		$('#linkedin_current_activity').show();
		$('#linkedin_refresh_stream').hide();
	});

	/*
	 * On click of refresh icon in the LinkedIn panel, all the new updates are
	 * shown
	 */
	$('#linkedin_refresh_stream').die().live('click', function(e)
	{
		e.preventDefault();

		// Loading button is displayed until updates are shown
		$("#linkedin_social_stream").html(LINKEDIN_UPDATE_LOAD_IMAGE);

		// shows all recent updates in LinkedIn panel
		getAllRecentNetworkUpdatesInLinkedIn(Linkedin_id, Stream_Data);
	});
}
/**
 * Retrieves most recent five LinkedIn network updates
 * 
 * @param Linkedin_id
 *            LinkedIn unique Id
 */
function getFirstFiveLinkedInNetworkUpdates(Linkedin_id)
{
	// Hide if current activity is present while retrieving updates
	$('.linkedin_current_activity', $('#Linkedin')).hide();

	// Loading button is displayed until updates are shown
	$("#linkedin_social_stream").html(LINKEDIN_UPDATE_LOAD_IMAGE);

	// Calls WidgetsAPI class to get the updates based on plugin id
	$.getJSON("/core/api/widgets/social/updates/index/" + LinkedIn_Plugin_Id + "/" + Linkedin_id + "/0/5",

	function(data)
	{
		// Remove loading button on success
		$('#status_load').remove();

		if (data && data.length != 0)
		{
			// Populates the template with the data
			$("#linkedin_social_stream").html(getTemplate("linkedin-update-stream", data));

			// Current update heading, refresh button is shown
			$('#linkedin_refresh_stream').show();

			// Sets the update stream into a local variable for this method
			Stream_Data = data;

			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".time-ago", $('#linkedin_social_stream')).timeago();
			});

			return;
		}

		$('.linkedin_current_activity', $('#Linkedin')).show();

	}).error(function(data)
	{
		// Remove loading button on error
		$('#status_load').remove();

		// Error message is displayed to user
		linkedinMainError("linkedin_social_stream", data.responseText);
	});
}

/**
 * Fetches all recent network updates and shows it in LinkedIn
 * 
 * @param Linkedin_id
 *            LinkedIn unique Id
 * @param Stream_Data
 *            First five network updates
 */
function getAllRecentNetworkUpdatesInLinkedIn(Linkedin_id, Stream_Data)
{
	// Calls WidgetsAPI class to get the updates based on plugin id
	$.getJSON("/core/api/widgets/social/updates/" + LinkedIn_Plugin_Id + "/" + Linkedin_id,

	function(data)
	{
		// Remove loading button on success
		$('#status_load').remove();

		// Populates the template with the data
		$("#linkedin_social_stream").html(getTemplate("linkedin-update-stream", data));

		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".time-ago", $('#linkedin_social_stream')).timeago();
		});

		// If no updates are available for person return
		if (data.length == 0)
		{
			// See Less is shown and see more is hidden
			$("#linkedin_stream").hide();
			$('#linkedin_less').show();
			return;
		}

		// See more,refresh buttons are shown and less is hidden
		$("#linkedin_stream").show();
		$('#linkedin_less').hide();

	}).error(function(data)
	{
		// Remove loading button on error
		$('#status_load').remove();

		if (Stream_Data)
		{
			/*
			 * Populates the template with the initial update stream on error
			 */
			$("#linkedin_social_stream").html(getTemplate("linkedin-update-stream", Stream_Data));
		}

		// Error message is displayed to user
		linkedinError("status-error-panel", data.responseText);
	});
}

/**
 * Fetches five network updates making end time as maximum time to fetch details
 * 
 * @param Linkedin_id
 *            LinkedIn unique Id
 * @param end_time
 *            Maximum time, 5 updates before this time are retrieved
 * @param Stream_Data
 *            First five network updates
 * @param element
 *            show more element
 */
function getAnyFiveNetworkUpdatesInLinkedIn(Linkedin_id, end_time, Stream_Data, element)
{
	/*
	 * Calls WidgetsAPI class to request for five more updates before the end
	 * time.The start time is from January 1st 2010
	 */
	$.getJSON("/core/api/widgets/social/updates/more/" + LinkedIn_Plugin_Id + "/" + Linkedin_id + "/0/5/1262304000/" + end_time,

	function(data)
	{
		// Removes loading button after fetching updates
		$('#spinner-status').hide();

		// See more link activated to get more updates
		$(element).addClass('linkedin_stream');

		// If no more updates available, less and refresh buttons are shown
		if (data.length == 0)
		{
			linkedinError("status-error-panel", "No more updates available");
			$('#linkedin_refresh_stream').show();

			/*
			 * If user have overall updates more than 3, less button is shown
			 */
			if (Stream_Data.length > 3)
			{
				$("#linkedin_stream").hide();
				$('#linkedin_less').show();
			}
			return;
		}

		/*
		 * Populate the template with update stream details and show in panel
		 */
		$("#linkedin_social_stream").append(getTemplate("linkedin-update-stream", data));

		$(".time-ago", $("#linkedin_social_stream")).timeago();

		// Current activity is hidden and refresh button is shown
		$('#linkedin_current_activity').hide();
		$('#linkedin_refresh_stream').show();

	}).error(function(data)
	{
		// Removes loading button if error occurs
		$('#spinner-status').hide();

		// Activates see more button
		$(element).addClass('linkedin_stream');

		// Error message is shown to the user
		linkedinError("status-error-panel", data.responseText);
	});
}

/**
 * Sends a connect request in LinkedIn based on plugin id and LinkedIn Id of the
 * profile set to the contact
 * 
 * @param Linkedin_id
 *            LinkedIn Id to send connect request
 */
function sendLinkedInAddRequest(Linkedin_id)
{
	/*
	 * Stores info in a JSON, to send it to the modal window when making a
	 * connect request
	 */
	var json = {};

	// Set headline of modal window as Connect
	json["headline"] = "Connect";

	// Information to be shown in the modal to the user
	json["info"] = "Connect to " + Linkedin_current_profile_user_name + " on Linkedin";

	// Default message to be sent while sending connect request to LinkedIn
	json["description"] = "I'd like to add you to my professional network on LinkedIn.";

	// If modal already exists remove to show a new one
	$('#linkedin_messageModal').remove();

	// Populate the modal template with the above json details in the form
	var message_form_modal = getTemplate("linkedin-message", json);

	// Append the form into the content
	$('#content').append(message_form_modal);

	$('#linkedin_messageModal').on('shown', function()
	{

		head.js(LIB_PATH + 'lib/bootstrap-limit.js', function()
		{
			$('.linkedin_connect_limit').limit({ maxChars : 275, counter : "#linkedin_counter" });

			$('#linkedin_messageModal').find('#link-connect').focus();
		});
	});

	// Shows the modal after filling with details
	$('#linkedin_messageModal').modal("show");

	// On click of send button in the modal, connect request is sent
	$('#send_linked_request').click(function(e)
	{
		e.preventDefault();

		// Checks whether all the input fields are filled
		if (!isValidForm($("#linkedin_messageForm")))
		{
			return;
		}

		$(this).text("Saving..");

		sendRequestToLinkedIn("/core/api/widgets/social/connect/" + LinkedIn_Plugin_Id + "/" + Linkedin_id, 'linkedin_messageForm', 'linkedin_messageModal');
	});
}

/**
 * Sends a message to the LinkedIn profile of the contact based on LinkedIn Id
 * of the profile set to the contact
 * 
 * @param Linkedin_id
 *            LinkedIn Id to send request
 */
function sendLinkedInMessage(Linkedin_id)
{
	/*
	 * Store info in a json, to send it to the modal window when making send
	 * message request
	 */
	var json = {};

	// Set headline of modal window as Send Message
	json["headline"] = "Send Message";

	// Information to be shown in the modal to the user while sending message
	json["info"] = "Send message to " + Linkedin_current_profile_user_name + " on LinkedIn";

	// If modal already exists remove to show a new one
	$('#linkedin_messageModal').remove();

	// Populate the modal template with the above json details in the form
	var message_form_modal = getTemplate("linkedin-message", json);

	// Append the form into the content
	$('#content').append(message_form_modal);

	// Shows the modal after filling with details
	$('#linkedin_messageModal').modal("show");

	// On click of send button in the modal, message request is sent
	$('#send_linked_request').click(function(e)
	{
		e.preventDefault();

		// Checks whether all the input fields are filled
		if (!isValidForm($("#linkedin_messageForm")))
		{
			return;
		}

		$(this).text("Saving..");

		sendRequestToLinkedIn("/core/api/widgets/social/message/" + LinkedIn_Plugin_Id + "/" + Linkedin_id, 'linkedin_messageForm', 'linkedin_messageModal');
	});

}

/**
 * Sends post request to the given URL with the form data from form id and show
 * the sent status in modal
 * 
 * @param url
 * @param formId
 * @param modalId
 */
function sendRequestToLinkedIn(url, formId, modalId)
{
	/*
	 * Sends post request to given url and Calls LinkedInTwitterWidgetsAPI with
	 * LinkedIn plugin id and LinkedIn Id as path parameters and form as post
	 * data
	 */
	$.post(url, $('#' + formId).serialize(), function(data)
	{

		// On success, shows the status as sent
		//$('#' + modalId).find('span.save-status').html("sent");

		// Hides the modal after 2 seconds after the sent is shown
		setTimeout(function()
		{
			$('#' + modalId).modal("hide");
		}, 2000);

	}).error(function(data)
	{

		/*
		 * If error occurs while posting modal is removed and error message is
		 * shown
		 */
		$('#' + modalId).remove();

		// Error message is shown if error occurs
		linkedinError("linkedin-error-panel", data.responseText);
	});
}

/**
 * Reshares a post in LinkedIn on click of reshare link of particular share
 * shown in the update stream
 * 
 * @param share_id
 *            Id of the share item given by LinkedIn
 * @param message
 *            Message is optional in LinkedIn while sharing
 * @param element
 *            Share object which is to be shared
 */
function reSharePost(share_id, message, element)
{
	/*
	 * Sends get request to url "core/api/widgets/reshare/" and Calls WidgetsAPI
	 * with plugin id, LinkedIn id and message as path parameters
	 */
	$.get("/core/api/widgets/social/reshare/" + LinkedIn_Plugin_Id + "/" + share_id + "/" + message,

	function(data)
	{
		/*
		 * On success, the color of the reshare is shown green for that instance
		 * only
		 */
		$(element).css('color', 'green');

		/*
		 * Text is changed as shared, will be changed to reshare on refresh of
		 * profile
		 */
		$(element).text('Shared');

	}).error(function(data)
	{
		// Error message is shown when error occurs
		linkedinError("linkedin-error-panel", data.responseText);

	});
}

/**
 * If LinkedIn URL is provided for the contact, gets Linkedin Id of the profile
 * based on which LinkedIn profile of the contact is retrieved
 * 
 * @param linkedin_web_url
 *            URL provided saved for contact
 * @param callback
 *            Callback to be executed to get the profile
 */
function getLinkedinIdByUrl(linkedin_web_url, callback)
{

	// Store url in a json to post it
	var url_json = {};
	url_json['web_url'] = linkedin_web_url;

	/*
	 * Sends post request to URL "/core/api/widgets/social/getidbyurl/" by
	 * sending plugin id as path parameter and json as post data
	 */
	queuePostRequest("widget_queue", "/core/api/widgets/social/getidbyurl/" + LinkedIn_Plugin_Id, url_json, function(data)
	{
		// If LinkedIn id is undefined
		if (!data)
		{
			// Shows message that URL is invalid to the user
			alert("URL provided for linkedin is not valid ");

			// Shows LinkedIn matching profiles based on contact name
			getLinkedinMatchingProfiles();

			/*
			 * Delete the LinkedIn URL associated with contact as it is
			 * incorrect
			 */
			agile_crm_delete_contact_property_by_subtype('website', 'LINKEDIN', linkedin_web_url);

			return;
		}

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}

	}, function(data)
	{
		if (data.responseText.indexOf("Public profile URL is not correct") != -1)
		{
			// Shows error message to the user returned by LinkedIn
			alert("URL provided for linkedin is not valid " + data.responseText);

			/*
			 * Delete the LinkedIn URL associated with contact as it is
			 * incorrect
			 */
			agile_crm_delete_contact_property_by_subtype('website', 'LINKEDIN', linkedin_web_url);
			return;
		}

		linkedinMainError(LINKEDIN_PLUGIN_NAME, data.responseText);
	});
}

/**
 * Retrive experience of person (work positions from LinkedIn)
 * 
 * @param Linkedin_id
 */
function getExperienceOfPerson(Linkedin_id)
{

	// shows loading until positions are shown
	$('#linkedin_experience_panel').html(LINKEDIN_UPDATE_LOAD_IMAGE);

	// send get request to retrieve work positions
	$.get("/core/api/widgets/social/experience/" + LinkedIn_Plugin_Id + "/" + Linkedin_id, function(data)
	{
		// Shows data LinkedIn panel
		showExperienceInLinkedIn(data);

	}).error(function(data)
	{
		// Remove loading image on error
		$('#status_load').remove();

		// made undefined, so that i can be fetched again
		Experience_data = undefined;

		linkedinMainError("linkedin_experience_panel", data.responseText);
	});
}

/**
 * Retrieves shared connections from LinkedIn and shows it in LinkedIn panel
 * 
 * @param Linkedin_id
 */
function getLinkedInSharedConnections(Linkedin_id)
{

	$('#linkedin_shared_panel').html(LINKEDIN_UPDATE_LOAD_IMAGE);

	$.get("/core/api/widgets/social/shared/connections/" + LinkedIn_Plugin_Id + "/" + Linkedin_id, function(data)
	{
		var el = "<div style='padding:10px'>";

		// If no matches found display message
		if (data.length == 0)
		{
			$('#linkedin_shared_panel').html("<div style='padding: 10px;line-height:160%;'>" + "No shared connections</div>");
			return;
		}

		Shared_Connections = data;

		// If matches found, Iterates through each profile
		$.each(data, function(key, value)
		{
			// If contact picture is null, show default image
			if (value.picture == null)
			{
				value.picture = 'https://contactuswidget.appspot.com/images/pic.png';
			}

			// Calls to populate template with the search results
			el = el.concat(getTemplate("linkedin-shared", value));

		});

		el = el + "</div>";

		$('#linkedin_shared_panel').html(el);

		/*
		 * Displays LinkedIn profile details on mouse hover and saves profile on
		 * click
		 */
		$(".linkedinSharedImage").die().live('mouseover', function()
		{

			// Aligns details to left in the pop over
			$(this).popover({ placement : 'left' });

			/*
			 * Called show to overcome pop over bug (not showing pop over on
			 * mouse hover for first time)
			 */
			$(this).popover('show');

		});

	}).error(function(data)
	{
		// Remove loading image on error
		$('#status_load').remove();

		linkedinMainError("linkedin_shared_panel", data.responseText);
	});

}

/**
 * Regrants access to LinkedIn after the expiry of token
 * 
 * @param message
 *            {@link String} message to inform that their tokens are expired
 */
function grantAccessToLinkedIn(message)
{
	// Shows loading until setup is shown
	$('#Linkedin').html(LINKEDIN_UPDATE_LOAD_IMAGE);

	// URL to return, after fetching token and secret key from LinkedIn
	var callbackURL = window.location.href;

	/*
	 * Creates a URL, which on click can connect to scribe using parameters sent
	 * and returns back to the profile based on return URL provided and saves
	 * widget preferences in widget based on plugin id
	 */
	var url = '/scribe?service=linkedin&return_url=' + encodeURIComponent(callbackURL) + '&plugin_id=' + encodeURIComponent(LinkedIn_Plugin_Id);

	// Shows a link button in the UI which connects to the above URL
	$('#Linkedin')
			.html(
					"<div class='widget_content' style='border-bottom:none;line-height: 160%;' >" + message + "<p style='margin: 10px 0px 5px 0px;' ><a class='btn' href=\"" + url + "\" style='text-decoration: none;'>Regrant Access</a></p></div>");
}

/**
 * Shows LinkedIn error message in the div allocated with given id and fades it
 * out after 10 secs
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 * @param disable_check
 *            {@link Boolean} whether to check length of message while
 *            displaying error
 */
function linkedinError(id, error, disable_check)
{
	linkedinMainError(id, error, enable_check);
	$('#' + id).show();

	// Hides the modal after 2 seconds after the sent is shown
	$('#' + id).fadeOut(10000);

}

/**
 * Shows LinkedIn error message in the div allocated with given id
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 * @param disable_check
 *            {@link Boolean} whether to check length of message while
 *            displaying error
 */
function linkedinMainError(id, error, disable_check)
{
	// check if tokens are expired, if so show him to grant access again
	if (error == "Access granted to your linkedin account has expired.")
	{
		grantAccessToLinkedIn(error);
		return;
	}

	// build JSON with error message
	var error_json = {};
	error_json['message'] = error;
	error_json['disable_check'] = disable_check;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	$('#' + id).html(getTemplate('linkedin-error-panel', error_json));

}