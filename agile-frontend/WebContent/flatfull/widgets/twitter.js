/*
 * === twitter.js ==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party JavaScript API provided.It interacts with the
 * application based on the function provided on agile_widgets.js(Third party API)
 */

/**
 * Shows setup if user adds Twitter widget for the first time. Uses
 * ScribeServlet to create a client and get preferences and save it to the
 * widget.
 */
function setupTwitterOAuth()
{
	// Shows loading until set up is shown
	$('#Twitter', agile_crm_get_current_view()).html(TWITTER_UPDATE_LOAD_IMAGE);

	// URL to return, after fetching token and secret key from Twitter
	var callbackURL = window.location.href;

	/*
	 * Creates a URL, which on click can connect to scribe using parameters sent
	 * and returns back to the profile based on return URL provided and saves
	 * widget preferences in widget based on plugin id
	 */
	var url = '/scribe?service=twitter&return_url=' + encodeURIComponent(callbackURL) + '&plugin_id=' + encodeURIComponent(Twitter_Plugin_Id);

	// Shows a link button in the UI which connects to the above URL
	$('#Twitter', agile_crm_get_current_view())
			.html(
					"<div class='widget_content' style='border-bottom:none;line-height: 160%;' >" + "Engage with contacts in real time based on what they tweet." + "<p style='margin: 10px 0px 5px 0px;'>" + "<a class='btn' href=\"" + url + "\" style='text-decoration:none;'>" + "Link Your Twitter</a></p></div>");
}

/**
 * Fetches matching profiles from Twitter based on PluginID and current contact
 * first name and last name
 */
function showTwitterMatchingProfiles(data)
{
	var contact_image = agile_crm_get_contact_property("image");

	// search and store string to show it in the search template
	// for the first time, contact name is search string
	if (search_string)
		Twitter_search_details['keywords'] = search_string;
	else
	{
		var name = "";
		if (agile_crm_get_contact_property("first_name"))
			name = name + agile_crm_get_contact_property("first_name");
		if (agile_crm_get_contact_property("last_name"))
			name = name + " " + agile_crm_get_contact_property("last_name");
		Twitter_search_details['keywords'] = name.trim();
	}

	// If no matches found display message
	if (data.length == 0)
	{
		if (Twitter_search_details['keywords'] && Twitter_search_details['keywords'] != "")
			twitterMainError(
					TWITTER_PLUGIN_NAME,
					"<p class='m-b-none text-base'>No matches found for <a href='#' class='twitter_modify_search'>" + Twitter_search_details['keywords'] + "</a>",
					true);
		else
			twitterMainError(TWITTER_PLUGIN_NAME,
					"<p class='m-b-none text-base'>No matches found. <a href='#' class='twitter_modify_search'>Modify search</a>", true);
		return;
	}

	var el;
	if (Twitter_search_details['keywords'] && Twitter_search_details['keywords'] != "")
		el = "<div class='panel-body'><p class='text-base'>Search results for " + "<a href='#' class='twitter_modify_search'>" + Twitter_search_details['keywords'] + "</a></p>";
	else
		el = "<div class='panel-body'><p class='text-base'>Search results. " + "<a href='#' class='twitter_modify_search'>Modify search</a></p>";

	//el = el.concat(getTemplate("twitter-search-result", data));

	getTemplate('twitter-search-result', data, undefined, function(template_ui){
 		if(!template_ui)
    		return;
		el += template_ui; 
		el += "</div><div class='clearfix'></div>";

		// Show matching profiles in Twitter panel
		$('#Twitter', agile_crm_get_current_view()).html(el);

		/*
		 * Displays Twitter profile details on mouse hover and saves profile on
		 * click
		 */
		$(".twitterImage").off('mouseenter');
		$(".twitterImage").on('mouseenter', function()
		{
			// Unique Twitter Id from widget
			Twitter_id = $(this).attr('id');

			console.log(this);
			
			
			// Aligns details to left in the pop over
			$(this).popover({ placement : 'left',
				html : true
			});

			
			/*
			 * Called show to overcome pop over bug (not showing pop over on mouse
			 * hover for first time)
			 */
			$(this).popover('show');

			// on click of any profile, save it to the contact
			$('#' + Twitter_id).off('click');
			$('#' + Twitter_id).on('click', function(e)
			{
				e.preventDefault();

				// Hide pop over after clicking on any picture
				$(this).popover('hide');

				console.log('on click in search');

				// Web url of twitter for this profile
				var url = "@" + $(this).attr('screen_name');

				web_url = url;
				console.log(url);

				var propertiesArray = [
					{ "name" : "website", "value" : url, "subtype" : "TWITTER" }
				];
				if (!contact_image)
				{
					// Get image link which can be used to save image for contact
					var twitter_image = $(this).attr('src');
					propertiesArray.push({ "name" : "image", "value" : twitter_image });
				}

				/*
				 * If contact title is undefined, saves headline of the Twitter
				 * profile to the contact title
				 */
				if (!agile_crm_get_contact_property("title"))
				{
					var summary = $(this).attr("summary");
					propertiesArray.push({ "name" : "title", "value" : summary });
				}

				console.log(propertiesArray);

				agile_crm_update_contact_properties(propertiesArray);

				// show twitter profile by id
				showTwitterProfile(Twitter_id);

			});
		});
	}, null);
		

}

/**
 * Fetches Twitter matching profiles based on plugin id
 */
function getTwitterMatchingProfiles(contact_id)
{
	// Shows loading image, until matches profiles are fetched
	$('#Twitter', agile_crm_get_current_view()).html(TWITTER_UPDATE_LOAD_IMAGE);

	// Gets contact id, to save social results of a particular id
	var contact_id = agile_crm_get_contact()['id'];

	// Reads from cookie (local storage HTML5), since widgets are saved using
	// local
	// storage when matches are fetched for the first time on the contact
	var data = localStorage.getItem('Agile_twitter_matches_' + contact_id);

	// If cookie is not available fetch results from Twitter
	if (!data)
	{
		/*
		 * Sends request to url "core/api/widgets/social/match/" and Calls
		 * WidgetsAPI with contact id and plugin id as path parameters
		 */
		queueGetRequest("widget_queue_"+contact_id, "core/api/widgets/social/match/" + Twitter_Plugin_Id + "/" + contact_id, 'json', function success(data)
		{
			// Save social results in cookie of particular contact
			localStorage.setItem('Agile_twitter_matches_' + contact_id, JSON.stringify(data));

			showTwitterMatchingProfiles(data);

		}, function error(data)
		{
			// Remove loading image on error
			$('#tweet_load').remove();

			// Shows error message if error occurs
			twitterMainError(TWITTER_PLUGIN_NAME, data.responseText);
		});
	}
	else
		showTwitterMatchingProfiles(JSON.parse(data));
}

/**
 * Fetches Twitter matching profiles based on plugin id and search string
 */
function getModifiedTwitterMatchingProfiles()
{
	// Checks whether all input fields are given
	if (!isValidForm($("#twitter-search_form")))
	{
		return;
	}

	// Shows loading image, until matches profiles are fetched
	$('#spinner-twitter-search').show();

	search_string = $('#twitter_keywords').val();

	/*
	 * Sends request to url "core/api/widgets/social/match/twitter" and Calls
	 * WidgetsAPI with plugin id and search string as path parameters
	 */
	$.get("core/api/widgets/social/modified/match/twitter/" + Twitter_Plugin_Id + "/" + search_string, function(data)
	{
		$('#spinner-twitter-search').hide();

		search_data = data;
		showTwitterMatchingProfiles(data);

	}, "json").error(function(data)
	{
		// Remove loading image on error
		$('#spinner-twitter-search').remove();

		// Shows error message if error occurs
		twitterMainError(TWITTER_PLUGIN_NAME, data.responseText);
	});
}

/**
 * If Twitter URL is provided for the contact, gets Twitter Id of the profile
 * based on which Twitter profile of the contact is retrieved
 * 
 * 
 * @param web_url
 *            URL provided saved for contact
 * @param callback
 *            Callback to be executed to get the profile
 */
function getTwitterIdByUrl(web_url, callback, contact_id)
{
	var proper_web_url;

	console.log('Twitter given URL ' + web_url);

	getProperURL(web_url, function(data)
	{
		proper_web_url = data;
	});

	console.log('Twitter URL ' + proper_web_url);

	// Store url in a json to post it
	var url_json = {};
	url_json['web_url'] = proper_web_url;

	fetchTwitterIdFromUrl(url_json, function(data)
	{
		// If Twitter id is undefined
		if (!data)
		{
			// Shows message that URL is invalid to the user
			alert("URL provided for Twitter is not valid ");

			// Shows Twitter matching profiles based on contact name
			getTwitterMatchingProfiles(contact_id);

			// Delete the Twitter URL associated with contact as it is incorrect
			agile_crm_delete_contact_property_by_subtype('website', 'TWITTER', web_url);

			return;
		}

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);

	}, function(data)
	{
		var temp = "Sorry, that page doesn't exist!";
		console.log(data.responseText.substring(0, temp.length));
		if (data.responseText.substring(0, temp.length) === temp)
		{
			alert(data.responseText);

			console.log('Twitter URL ' + web_url);
			// Delete the Twitter URL associated with contact as it is incorrect
			agile_crm_delete_contact_property_by_subtype('website', 'TWITTER', web_url.toString());

			return;
		}

		twitterMainError(TWITTER_PLUGIN_NAME, data.responseText);
	}, contact_id);
}

/**
 * Forms Twitter profile URL from screen name
 * 
 * @param web_url
 *            Either screen name or publc profile URL
 * @param callback
 *            Callback function to be executed on success
 */
function getProperURL(web_url, callback)
{
	var proper_web_url;

	if (web_url.indexOf("https://twitter.com/") == -1 && web_url.indexOf("http://twitter.com/") == -1)
	{
		if (web_url.indexOf('@') == 0)
			proper_web_url = "https://twitter.com/" + web_url.substring(1);
		else
			proper_web_url = "https://twitter.com/" + web_url;
	}
	else if (web_url.indexOf("http://twitter.com/") != -1)
		proper_web_url = web_url.replace("http://twitter.com/", "https://twitter.com/");
	else
		proper_web_url = web_url;

	// If defined, execute the callback function
	if (callback && typeof (callback) === "function")
		callback(proper_web_url);
}

/**
 * Initializes an AJAX queue request to retrieve Twitter Id based on given
 * Twitter profile URL
 * 
 * <p>
 * Request is added to queue to make the requests from all the widgets
 * synchronous
 * </p>
 * 
 * @param url_json
 * @param successCallback
 * @param errorCallback
 */
function fetchTwitterIdFromUrl(url_json, successCallback, errorCallback, contact_id)
{
	/*
	 * Sends post request to URL "/core/api/widgets/social/getidbyurl/" bye
	 * sending plugin id as path parameter and json as post data
	 */
	queuePostRequest("widget_queue_"+contact_id, "/core/api/widgets/social/getidbyurl/" + Twitter_Plugin_Id, url_json, function(data)
	{
		// If defined, execute the callback function
		if (successCallback && typeof (successCallback) === "function")
			successCallback(data);

	}, function(data)
	{
		// If defined, execute the callback function
		if (errorCallback && typeof (errorCallback) === "function")
			errorCallback(data);
	});
}

/**
 * Shows saved Twitter profile based on Twitter Id and Plugin Id
 * 
 * @param Twitter_id
 *            Twitter id to fetch profile from Twitter
 */
function showTwitterProfile(Twitter_id)
{
	// Shows loading, until profile is fetched
	$('#Twitter', agile_crm_get_current_view()).html(TWITTER_UPDATE_LOAD_IMAGE);

	// Stores connected status of agile user with contact Twitter profile
	var twitter_connected;

	// Stores the initial update stream of the contact's Twitter profile
	var stream_data;

	// Calls WidgetsAPI class to get Twitter profile of contact
	$.get("/core/api/widgets/social/profile/" + Twitter_Plugin_Id + "/" + Twitter_id, function(data)
	{
		if (!data)
			return;

		// shows delete button in the Twitter panel
		$('#Twitter_plugin_delete').show();

		// Sets the Twitter name of the profile to the global variable
		Twitter_current_profile_user_name = data.name;
		Twitter_current_profile_screen_name = data.screen_name;

		// Sets the Twitter connected status to the local variable
		twitter_connected = data.is_connected;

		// Sets the latest update id of the contact's Twitter profile
		Twitter_current_update_id = data.current_update_id;

		// Gets Twitter profile template and populate the fields with details
		
		getTemplate('twitter-profile', data, undefined, function(template_ui){
	 		if(!template_ui)
	    		return;
			$('#Twitter', agile_crm_get_current_view()).html($(template_ui)); 
			// Checks if the agile user is following the contact's Twitter profile
			if (data.is_connected)
				// If following unFollow and compose tweet buttons are shown
				$('#twitter_unfollow').show();

			else
			{
				/*
				 * Checks if follow request is sent, if not sent follow button is
				 * shown
				 */
				if (!data.is_follow_request_sent)
					$('#twitter_follow').show();
				else
					/*
					 * If follow request sent, then button is disabled showing the
					 * text as follow request sent
					 */
					$('#twitter_follow').text("Follow Request Sent").attr("disabled", "disabled").show();
			}

			// If updates are available, show recent updates in Twitter profile
			if (data.updateStream && data.updateStream.length != 0)
			{
				// Current update heading and refresh button is shown
				$('#twitter_refresh_stream').show();

				// Sets the update stream into a local variable for this method
				stream_data = data.updateStream;

				

				getTemplate('twitter-update-stream', data.updateStream, undefined, function(template_ui){
			 		if(!template_ui)
			    		return;
			    	var element = $(template_ui);
			    	head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
					{
						$(".time-ago", element).timeago();
					});

					// Template is populated with update details and shown
					$('#twitter_social_stream').append(element);

					return;
					
				}, null);

					
			}

			// Current current update is shown
			$('#twitter_current_activity').show();
		}, '#Twitter', agile_crm_get_current_view());

			

	}, "json").error(function(data)
	{
		// Remove loading image on error
		$('#tweet_load').remove();

		twitterMainError(TWITTER_PLUGIN_NAME, data.responseText);

	});

	// Registers click events in Twitter profile
	registerClickEventsInTwitter(Twitter_id, twitter_connected, stream_data);
}

/**
 * Registers click events in Twitter profile panel
 * 
 * @param Twitter_id
 *            Twitter id to fetch profile from Twitter
 * @param twitter_connected
 *            {@link Boolean} whether agileuser is connected to given twitter id
 * @param stream_data
 *            First five network updates data
 */
function registerClickEventsInTwitter(Twitter_id, twitter_connected, stream_data)
{
	// On click of see more link, more updates are retrieved
    $("#widgets").off('click','.twitter_stream');
	$("#widgets").on('click','.twitter_stream', function(e)
	{

		e.preventDefault();

		/*
		 * Tweet Id of the last update is retrieved to get old updates before
		 * that Id
		 */
		var tweet_id = $('ul#twitter_social_stream').find('li#twitter_status:last').attr('status_id');

		console.log(tweet_id);

		if (!Twitter_current_update_id)
			return;

		// It is undefined in case if person does not share his updates
		if (!tweet_id)
		{
			// Checks if person is already following in Twitter to agile user
			if (twitter_connected)
			{
				tweetError("tweet-error-panel", "This member doesn't share his/her tweets");
				return;
			}

			/*
			 * If not following, advice user to follow him/her to see updates
			 * Error message is shown to the user
			 */
			tweetError("tweet-error-panel", "Member does not share his/her tweets. Follow him/her and try");
			return;
		}

		// Loading image is shown until the updates are retrieved
		$('#spinner-tweets').show();

		var that = this;

		/*
		 * See more link is disabled until the updates are retrieved since there
		 * may be a chance of getting duplicate updates
		 */
		$(this).removeClass('twitter_stream');

		// Retrieves five updates tweeted before the tweet id given
		anyFiveNetworkUpdates(Twitter_id, tweet_id, stream_data, that);

	});

	/*
	 * On click of less button, hides update stream and shows current update by
	 * toggling
	 */
    $("#widgets").off('click','#twitter_less');
	$("#widgets").on('click','#twitter_less', function(e)
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

			// If updates exists only hide current update
			if ($('ul#twitter_social_stream').find('div#twitter_update').length != 0)
			{
				$('#twitter_current_activity').hide();
			}

			/*
			 * On first click of see less, less attribute is made true and text
			 * will be changed as see more button
			 */
			$(this).text("Show Less..");
			$('#twitter_refresh_stream').show();
		}
		else
		{
			$(this).attr("less", "true");
			$(this).text("Show More..");
			$('#twitter_current_activity').show();
			$('#twitter_refresh_stream').hide();
		}
	});

	/*
	 * On click of refresh icon in the Twitter panel, all the new updates are
	 * shown
	 */
    $("#widgets").off('click','#twitter_refresh_stream');
	$("#widgets").on('click','#twitter_refresh_stream', function(e)
	{
		e.preventDefault();

		// Loading button is displayed until updates are shown
		$("#twitter_social_stream", agile_crm_get_current_view()).html(TWITTER_UPDATE_LOAD_IMAGE);

		// shows all recent network updates
		allNetworkUpdates(Twitter_id, stream_data);
	});
}

/**
 * Retrieves five updates tweeted before the tweet id given and appends the data
 * to Twitter tweet panel
 * 
 * @param Twitter_id
 *            Twitter unique Id
 * @param tweet_id
 *            Id of the tweet
 * @param stream_data
 *            First five network updates data
 * @param element
 *            Show more element
 */
function anyFiveNetworkUpdates(Twitter_id, tweet_id, stream_data, element)
{
	/*
	 * Calls WidgetsAPI class to request for five more updates tweeted before
	 * the tweet id of the last update
	 */
	$.getJSON("/core/api/widgets/social/updates/more/" + Twitter_Plugin_Id + "/" + Twitter_id + "/" + tweet_id + "/5",

	function(data)
	{
		// Removes loading button after fetching updates
		$('#spinner-tweets').hide();

		// See more link activated to get more updates
		$(element).addClass('twitter_stream');
		$('#twitter_refresh_stream').show();

		// If no more updates available, less and refresh buttons are shown
		if (data.length == 0)
		{
			tweetError("tweet-error-panel", "No more updates available");

			/*
			 * On click of more if no updates available and if user have initial
			 * updates more than 3 and then less button is shown
			 */
			if (stream_data.length > 3)
			{
				$("#twitter_stream").hide();
				$('#twitter_less').show();
			}
			return;
		}

		/*
		 * Populate the template with update stream details and show in panel
		 */
		

		getTemplate('twitter-update-stream', data, undefined, function(template_ui){
	 		if(!template_ui)
	    		return;
			$("#twitter_social_stream").append($(template_ui)); 
			$(".time-ago", $("#twitter_social_stream")).timeago();

			// Current activity is hidden
			$('#twitter_current_activity').hide();
		}, null);

			

	}).error(function(data)
	{
		// Removes loading button if error occurs
		$('#spinner-tweets').hide();

		// Activates see more button
		$(element).addClass('twitter_stream');

		// Error message is shown to the user
		tweetError("tweet-error-panel", data.responseText);
	});
}

/**
 * Retrive first five network updates and show it in tweets panel
 * 
 * @param Twitter_id
 *            Twitter unique Id
 */
function getFirstFiveNetworkUpdates(Twitter_id)
{
	/*
	 * Sends request to get five updates before current update when follow is
	 * clicked
	 */
	$.getJSON("/core/api/widgets/social/updates/more/" + Twitter_Plugin_Id + "/" + Twitter_id + "/" + Twitter_current_update_id + "/5",

	function(data)
	{
		// Populates the template with the data and shows refresh button


		getTemplate('twitter-update-stream', data, undefined, function(template_ui){
	 		if(!template_ui)
	    		return;
			$("#twitter_social_stream", agile_crm_get_current_view()).html($(template_ui)); 
			$('#twitter_current_activity').hide();
			$('#twitter_refresh_stream').show();

			$(".time-ago", $("#twitter_social_stream")).timeago();

			// Checks if stream available,
			if (data.length == 0)
			{
				// See Less is shown and see more is hidden
				$("#twitter_stream").hide();
				$('#twitter_current_activity').show();
				$('#twitter_less').show();
				return;
			}
		}, "#twitter_social_stream", agile_crm_get_current_view());
			

	}).error(function(data)
	{
		$('#twitter_refresh_stream').show();

		// Error message is shown if error occurs
		tweetError("twitter-error-panel", data.responseText);

	});
}

/**
 * Retrive all recent network updates and show it in tweets panel
 * 
 * @param Twitter_id
 *            Twitter unique Id
 * @param stream_data
 *            First five network updates data
 */
function allNetworkUpdates(Twitter_id, stream_data)
{
	// Calls WidgetsAPI class to get the updates based on plugin id
	$.getJSON("/core/api/widgets/social/updates/" + Twitter_Plugin_Id + "/" + Twitter_id,

	function(data)
	{
		// Remove loading button on success
		$('#tweet_load').remove();

		// Populates the template with the data
		

		getTemplate('twitter-update-stream', data, undefined, function(template_ui){
	 		if(!template_ui)
	    		return;
			$("#twitter_social_stream", agile_crm_get_current_view()).html($(template_ui)); 
			$(".time-ago", $("#twitter_social_stream")).timeago();

			// Checks if stream available,
			if (data.length == 0)
			{
				// See Less is shown and see more is hidden
				$("#twitter_stream").hide();
				$('#twitter_less').show();
				return;
			}

			// See more,refresh buttons are shown and less is hidden
			$("#twitter_stream").show();
			$('#twitter_less').hide();
			$('#twitter_current_activity').hide();
		}, "#twitter_social_stream", agile_crm_get_current_view());

			

	}).error(function(data)
	{
		// Remove loading button on error
		$('#tweet_load').remove();
		$("#twitter_stream").show();
		$('#twitter_less').hide();

		if (stream_data && stream_data.length != 0)
		{
			/*
			 * Populates the template with the initial update stream on error
			 */
			getTemplate('twitter-update-stream', stream_data, undefined, function(template_ui){
		 		if(!template_ui)
		    		return;
				$("#twitter_social_stream", agile_crm_get_current_view()).html($(template_ui)); 
			}, "#twitter_social_stream", agile_crm_get_current_view());
		}


		$(".time-ago", $("#twitter_social_stream")).timeago();

		// Error message is shown to the user
		tweetError("tweet-error-panel", data.responseText);

	});
}

/**
 * Sends a follow request in Twitter based on plugin id and Twitter Id of the
 * profile set to the contact
 * 
 * @param Twitter_id
 *            Twitter Id to send follow request
 */
function sendFollowRequest(Twitter_id)
{
	/*
	 * Sends post request to url "core/api/widgets/social/connect/" and Calls
	 * WidgetsAPI with plugin id and Twitter id as path parameters
	 */
	$
			.post("/core/api/widgets/social/connect/" + Twitter_Plugin_Id + "/" + Twitter_id, function(data)
			{
				// Checks whether data is true, followed successfully in Twitter
				if (data == "true")
				{
					/*
					 * Compose a new tweet and unfollow buttons are shown and
					 * follow hidden
					 */
					$('#twitter_follow').hide();
					$('#twitter_unfollow').show();
				}
				else
				{
					$('#twitter_follow').text("Follow Request Sent").attr("disabled", "disabled").show();
					return;
				}

				// If current activity is undefined, then no updates can be
				// retrieved
				if (!Twitter_current_update_id)
					return;

				// Show recent updates after following
				getFirstFiveNetworkUpdates(Twitter_id);

			})
			.error(
					function(data)
					{
						if (data.responseText.indexOf("401:Authentication credentials") != 0)
							data.responseText = "Only confirmed followers have access to " + Twitter_current_profile_user_name + " Tweets and complete profile. Click the \"Follow\" button to send a follow request.";

						// Error message is shown if error occurs
						tweetError("twitter-error-panel", data.responseText);
					});
}

/**
 * Sends unfollow request to unFollow the contact's Twitter profile in Twitter
 * based on plugin id and Twitter id *
 * 
 * @param Twitter_id
 *            Twitter Id to send unfollow request
 */
function sendUnfollowRequest(Twitter_id)
{
	/*
	 * Sends get request to url "core/api/widgets/social/connect/" and Calls
	 * WidgetsAPI with plugin id and Twitter id as path parameters
	 */
	$.get("/core/api/widgets/social/disconnect/" + Twitter_Plugin_Id + "/" + Twitter_id, function(data)
	{
		/*
		 * On success, unFollow, tweet and message buttons are hidden and follow
		 * shown
		 */
		$("#twitter_follow").show();
		$('#twitter_unfollow').hide();

	}).error(function(data)
	{
		// Error message is shown if error occurs
		tweetError("twitter-error-panel", data.responseText);
	});

}

/**
 * Sends a message to the Twitter profile of the contact based on Twitter Id of
 * the profile set to the contact
 * 
 * @param Twitter_id
 *            Twitter Id to send request
 */
function sendTwitterMessage(Twitter_id, message)
{
	/*
	 * Store info in a json, to send it to the modal window when making send
	 * message request
	 */
	var json = {};

	// Set headline of modal window as Send Message
	json["headline"] = "Direct Message";

	// Information to be shown in the modal to the user while sending message
	json["info"] = "Send message to " + Twitter_current_profile_user_name.toUpperCase() + " on Twitter";

	// If modal already exists remove to show a new one
	$('#twitter_messageModal').remove();

	// Populate the modal template with the above json details in the form
	
	getTemplate('twitter-message', json, undefined, function(template_ui){
 		if(!template_ui)
    		return;
    	var message_form_modal = $(template_ui);
    	// Append the form into the content
		$('#content').append(message_form_modal);

		$('#twitter_messageModal').off('shown');
		$('#twitter_messageModal').on('shown', function()
		{

			head.js(LIB_PATH + 'lib/bootstrap-limit.js', function()
			{
				$(".twit-message-limit").limit({ maxChars : 125, counter : "#twitter-counter" });
				$('#twitter_messageModal').find('#twit-message').focus();
			});
		});

		//

		// Shows the modal after filling with details
		$('#twitter_messageModal').modal("show");

		// On click of send button in the modal, message request is sent
		$('#send_request').click(function(e)
		{
			e.preventDefault();

			// Checks whether all the input fields are filled
			if (!isValidForm($("#twitter_messageForm")))
			{
				return;
			}

			$(this).text("Saving..");
			sendRequest("/core/api/widgets/social/message/" + Twitter_Plugin_Id + "/" + Twitter_id, "twitter_messageForm", "twitter_messageModal");

		});
		
	}, null);

		
}

/**
 * Tweets to the Twitter profile of the contact based on Twitter Id of the
 * profile set to the contact
 * 
 * @param Twitter_id
 *            Twitter Id to send tweet request
 */
function tweetInTwitter(Twitter_id)
{
	// Store info in a json, to send it to the modal window when making send
	// tweet request
	var json = {};

	// Set headline of modal window as Send Message
	json["headline"] = "Tweet";

	// Information to be shown in the modal to the user while sending message
	json["info"] = "Tweet to " + Twitter_current_profile_user_name.toUpperCase() + " on Twitter";

	json["description"] = "@" + Twitter_current_profile_screen_name;

	// If modal already exists remove to show a new one
	$('#twitter_messageModal').remove();

	// Populate the modal template with the above json details in the form
	getTemplate('twitter-message', json, undefined, function(template_ui){
 		if(!template_ui)
    		return;
    	var message_form_modal = $(template_ui);
    	// Append the form into the content
		$('#content').append(message_form_modal);

		$('#twitter_messageModal').off('shown');
		$('#twitter_messageModal').on('shown', function()
		{

			head.js(LIB_PATH + 'lib/bootstrap-limit.js', function()
			{
				$(".twit-tweet-limit").limit({ maxChars : 125, counter : "#twitter-counter" });
				$('#twitter_messageModal').find('#twit-tweet').focus();
			});
		});

		// Shows the modal after filling with details
		$('#twitter_messageModal').modal("show");

		// On click of send button in the modal, tweet request is sent
		$('#send_request').click(function(e)
		{
			e.preventDefault();

			// Checks whether all the input fields are filled
			if (!isValidForm($("#twitter_messageForm")))
			{
				return;
			}

			$(this).text("Saving..");
			sendRequest("/core/api/widgets/social/tweet/" + Twitter_Plugin_Id, "twitter_messageForm", "twitter_messageModal");

		});
		
	}, null);

		
}

/**
 * Sends post request to the given URL with the form data from form id and show
 * the sent status in modal
 * 
 * @param url
 * @param formId
 * @param modalId
 */
function sendRequest(url, formId, modalId)
{
	/*
	 * Sends post request to given url and Calls LinkedInTwitterWidgetsAPI with
	 * Twitter plugin id and Twitter Id as path parameters and form as post data
	 */
	$.post(url, $('#' + formId).serialize(),

	function(data)
	{

		// On success, shows the status as sent
		// $('#' + modalId).find('span.save-status').html("sent");

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
		tweetError("twitter-error-panel", data.responseText);
	});
}

/**
 * Retweets a post in Twitter on click of retweet link of particular tweet shown
 * in the update stream
 * 
 * 
 * @param share_id
 *            Id of the tweet on which retweet is clicked
 * @param message
 *            The message is optional while retweeting the tweet
 * @param element
 *            Tweet object which is to be Retweeted
 */
function retweetTheTweet(share_id, message, element)
{
	/*
	 * Sends get request to url "core/api/widgets/social/reshare/" and Calls
	 * WidgetsAPI with plugin id, Twitter id and message as path parameters
	 */
	$.get("/core/api/widgets/social/reshare/" + Twitter_Plugin_Id + "/" + share_id + "/" + message,

	function(data)
	{
		/*
		 * On success, the color of the reshare is shown green for that instance
		 * only
		 */
		$(element).css('color', 'green');

	}).error(function(data)
	{
		// Error message is shown when error occurs
		tweetError("tweet-error-panel", data.responseText);
	});
}

/**
 * Retrieves Twitter Ids of the followers of Twitter profile of contact based on
 * twitter id of the contact
 * 
 * @param Twitter_id
 *            Twitter Id to send tweet request
 * @param callback
 *            Callback to be executed to get the profiles
 */
function getFollowerIdsInTwitter(Twitter_id, callback)
{
	/*
	 * Sends get request to URL "/core/api/widgets/social/followers/" by sending
	 * plugin id and twitter id as path parameter
	 */
	$
			.getJSON("/core/api/widgets/social/followers/" + Twitter_Plugin_Id + "/" + Twitter_id, function(data)
			{
				// If data is undefined, return
				if (!data)
					return;

				// If defined, execute the callback function
				if (callback && typeof (callback) === "function")
				{
					callback(data);
				}

			})
			.error(
					function(data)
					{
						// Remove loading
						$('#tweet_load').remove();

						if (data.responseText.indexOf("401:Authentication credentials") != -1)
						{
							var message = "Only confirmed followers have access to " + Twitter_current_profile_user_name + " Tweets, Followers, Following and complete profile. Click the \"Follow\" button to send a follow request.";
							twitterMainError("twitter_follower_panel", message, true);
							$("#twitter_follower_panel").css("padding", "0px");
							return;
						}

						// Show the error message
						tweetError('follower-error-panel', data.responseText);

					});
}

/**
 * Retrieves Twitter Ids of persons whom contact twitter profile follows based
 * on twitter id of the contact
 * 
 * @param Twitter_id
 *            Twitter Id to send tweet request
 * @param callback
 *            Callback to be executed to get the profiles
 */
function getFollowingIdsInTwitter(Twitter_id, callback)
{
	/*
	 * Sends get request to URL "/core/api/widgets/social/followers/" by sending
	 * plugin id and twitter id as path parameter
	 */
	$
			.getJSON("/core/api/widgets/social/following/" + Twitter_Plugin_Id + "/" + Twitter_id, function(data)
			{
				// If data is undefined, return
				if (!data)
					return;

				// If defined, execute the callback function
				if (callback && typeof (callback) === "function")
					callback(data);

			})
			.error(
					function(data)
					{
						// Remove loading
						$('#tweet_load').remove();

						if (data.responseText.indexOf("401:Authentication credentials") != -1)
						{
							var message = "Only confirmed followers have access to " + Twitter_current_profile_user_name + " Tweets, Followers, Following and complete profile. Click the \"Follow\" button to send a follow request.";
							twitterMainError("twitter_following_panel", message, true);
							$("#twitter_following_panel").css("padding", "0px");
							return;
						}

						// Show the error message
						tweetError('following-error-panel', data.responseText);

					});
}

/**
 * Retrieves the Twitter profiles of followers or following based on the twitter
 * IDs provided
 * 
 * @param twitter_ids
 *            Array of IDs for which profiles are required
 * @param callback
 *            Callback to be executed to get the profiles
 */
function getListOfProfilesByIDsinTwitter(twitter_ids, callback, errorcallback)
{
	// Store the Twitter IDs provided as json to send it as post data
	var json = {};
	json["twitter_ids"] = JSON.stringify(twitter_ids);

	/*
	 * Sends post request to URL "/core/api/widgets/social/profile/list/" by
	 * sending plugin id as path parameter and array of twitter ids as post data
	 */
	$.post("/core/api/widgets/social/profile/list/" + Twitter_Plugin_Id, json, function(data)
	{
		// If data is undefined, return and remove loading
		if (!data)
		{
			$('#tweet_load').remove();
			return;
		}

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);

		// Accept the return type as json
	}, "json").error(function(data)
	{

		// If defined, execute the callback function
		if (errorcallback && typeof (errorcallback) === "function")
			errorcallback(data);

	});

}

/**
 * Shows Twitter error message in the div allocated with given id and fades it
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
function tweetError(id, error, disable_check)
{
	twitterMainError(id, error, disable_check);
	$('#' + id).show();

	// Hides the modal after 2 seconds after the sent is shown
	$('#' + id).fadeOut(10000);

}

/**
 * Shows Twitter error message in the div allocated with given id
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 * @param disable_check
 *            {@link Boolean} whether to check length of message while
 *            displaying error
 */
function twitterMainError(id, error, disable_check)
{
	// build JSON with error message
	var error_json = {};
	error_json['message'] = error;
	error_json['disable_check'] = disable_check;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	
	getTemplate('twitter-error-panel', error_json, undefined, function(template_ui){
 		if(!template_ui)
    		return;
		$('#' + id, agile_crm_get_current_view()).html($(template_ui)); 
	}, '#' + id, agile_crm_get_current_view());

}

function startTwitterWidget(contact_id){
	// Twitter widget name as a global variable
	TWITTER_PLUGIN_NAME = "Twitter";

	// Twitter update loading image declared as global
	TWITTER_UPDATE_LOAD_IMAGE = "<div id='tweet_load'><center><img  src=\'img/ajax-loader-cursor.gif\'" + "style'=margin-top: 10px;margin-bottom: 14px;'></img></center></div>";

	// Current contact user name in Twitter profile
	Twitter_current_profile_user_name = "";
	Twitter_current_update_id = "";
	Twitter_current_profile_screen_name = "";
	console.log(Twitter_follower_ids);
	console.log(Twitter_following_ids);
	var Twitter_follower_ids = undefined;
	var Twitter_following_ids = undefined;
	search_string = undefined;
	search_data = undefined;
	Twitter_search_details = {};
	web_url = "";

	// Global twitter id
	Twitter_id = "";

	// Retrieves widget which is fetched using script API
	var twitter_widget = agile_crm_get_widget(TWITTER_PLUGIN_NAME);

	console.log('In Twitter');
	console.log(Twitter_follower_ids);
	console.log(Twitter_following_ids);

	console.log(twitter_widget);

	// ID of the Twitter widget as global variable
	Twitter_Plugin_Id = twitter_widget.id;

	/*
	 * Gets Twitter widget preferences, required to check whether to show setup
	 * button or to fetch details. If undefined - considering first time usage
	 * of widget, setupTwitterOAuth is shown and returned
	 */
	if (twitter_widget.prefs == undefined)
	{
		setupTwitterOAuth();
		return;
	}

	// Get website URL for Twitter from contact to get profile based on it
	web_url = agile_crm_get_contact_property_by_subtype('website', 'TWITTER');
	console.log(web_url);

	// If Twitter URL exists for contact,
	if (web_url)
	{
		// Get Twitter id from URL and show profile
		getTwitterIdByUrl(web_url, function(data)
		{
			Twitter_id = data;
			showTwitterProfile(Twitter_id);
		}, contact_id);
	}
	else
	{
		// Shows all the matches in Twitter for the contact
		getTwitterMatchingProfiles(contact_id);
	}

	// Deletes Twitter profile on click of delete button in template
    $("#widgets").off('click','#Twitter_plugin_delete');
	$("#widgets").on('click','#Twitter_plugin_delete', function(e)
	{
		e.preventDefault();

		agile_crm_delete_contact_property_by_subtype('website', 'TWITTER', web_url, function(data)
		{
			console.log("In twitter delete callback");
			getTwitterMatchingProfiles(contact_id);
		});

	});

	// Sends a message to Twitter when clicked on send message button
    $("#widgets").off('click','#twitter_message');
	$("#widgets").on('click','#twitter_message', function(e)
	{
		e.preventDefault();
		sendTwitterMessage(Twitter_id);
	});

	// Sends an follow request to Twitter when clicked on follow button
    $("#widgets").off('click','#twitter_follow');
	$("#widgets").on('click','#twitter_follow', function(e)
	{
		e.preventDefault();

		// Checks whether it is disabled, if disabled no request is sent
		if ($(this).attr("disabled"))
			return;

		// Once if follow clicked, request sent and button is disabled
		sendFollowRequest(Twitter_id);
	});

	// Sends an UnFollow request to Twitter when clicked on UnFollow button
    $("#widgets").off('click','#twitter_unfollow');
	$("#widgets").on('click','#twitter_unfollow', function(e)
	{
		e.preventDefault();
		sendUnfollowRequest(Twitter_id);
	});

	// On mouse enter unfollow
    $("#widgets").off('mouseenter','#twitter_unfollow');
	$("#widgets").on('mouseenter','#twitter_unfollow', function(e)
	{
		$('#twitter_unfollow').text("Unfollow");
		$('#twitter_unfollow').addClass("btn-danger");
		$('#twitter_unfollow').removeClass("btn-primary");
	});

	// On mouse leave following
    $("#widgets").off('mouseleave','#twitter_unfollow');
	$("#widgets").on('mouseleave','#twitter_unfollow', function(e)
	{
		$('#twitter_unfollow').text("Following");
		$('#twitter_unfollow').addClass("btn-primary");
		$('#twitter_unfollow').removeClass("btn-danger");
	});

	// ReTweets a tweet in Twitter on click of ReTweet link
    $("#widgets").off('click','.twitter_retweet');
	$("#widgets").on('click','.twitter_retweet', function(e)
	{
		e.preventDefault();

		// Get the id of the tweet on which retweet is clicked
		var tweet_id = $(this).attr("id");
		console.log(tweet_id);

		// While retweet, the comment message is made optional
		retweetTheTweet(tweet_id, "optional", this);
	});

	// Sends a tweet to the contact Twitter profile
    $("#widgets").off('click','#twitter_tweet');
	$("#widgets").on('click','#twitter_tweet', function(e)
	{
		e.preventDefault();
		tweetInTwitter(Twitter_id);

	});

	// on click of name link to modify search, search template is shown
    $("#widgets").off('click','.twitter_modify_search');
	$("#widgets").on('click','.twitter_modify_search', function(e)
	{
		e.preventDefault();

		Twitter_search_details['plugin_id'] = Twitter_Plugin_Id;

		
		getTemplate('twitter-modified-search', Twitter_search_details, undefined, function(template_ui){
	 		if(!template_ui)
	    		return;
			$('#Twitter', agile_crm_get_current_view()).html($(template_ui)); 
		}, '#Twitter', agile_crm_get_current_view());
	});

	/*
	 * On click of search button in modify template, matching profiles are
	 * fetched
	 */
    $("#widgets").off('click','#twitter_search_btn');
	$("#widgets").on('click','#twitter_search_btn', function(e)
	{
		e.preventDefault();

		getModifiedTwitterMatchingProfiles();
	});

	/*
	 * On click of close, show past results with past searched data
	 */
    $("#widgets").off('click','#twitter_search_close');
	$("#widgets").on('click','#twitter_search_close', function(e)
	{
		e.preventDefault();

		if (search_data)
			showTwitterMatchingProfiles(search_data);
		else
			getTwitterMatchingProfiles(contact_id);
	});

	// On click of followers in twitter panel
    $("#widgets").off('click','#twitter_followers');
	$("#widgets").on('click','#twitter_followers', function(e1)
	{
		e1.preventDefault();

		if (Twitter_follower_ids && Twitter_follower_ids.length != 0)
			return;

		console.log("In twit folowers");
		console.log(Twitter_follower_ids);

		Twitter_follower_ids = [];

		// show loading in follower panel
		$('#twitter_follower_panel', agile_crm_get_current_view()).html(TWITTER_UPDATE_LOAD_IMAGE);

		// Retrieves the Twitter IDs of all the followers
		getFollowerIdsInTwitter(Twitter_id, function(data)
		{
			// Store array of IDs in a global variable
			Twitter_follower_ids = data;

			console.log(data);

			// If no followers, show info
			if (data.length == 0)
			{
				$('#twitter_follower_panel', agile_crm_get_current_view()).html(Twitter_current_profile_user_name + " doesn't have any followers yet");
				return;
			}

			// Get 20 from array and remove 20 from array
			var temp = Twitter_follower_ids.splice(0, 20);
			console.log(temp);

			// Get the Twitter profile for 20 Twitter IDs
			getListOfProfilesByIDsinTwitter(temp, function(result)
			{
				// Show matching profiles in Twitter panel
				
				getTemplate('twitter-follower-following', result, undefined, function(template_ui){
			 		if(!template_ui)
			    		return;
					$('#twitter_follower_panel', agile_crm_get_current_view()).html($(template_ui)); 
					$("#widgets").on('mouseover','.twitterImage', function(e1)
					{
						// Unique Twitter Id from widget
						var id = $(this).attr('id');

						// Aligns details to left in the pop over
						$('#' + id).popover({ placement : 'left',
							html : true
						});

						/*
						 * Called show to overcome pop over bug (not showing pop
						 * over on mouse hover for first time)
						 */
						$('#' + id).popover('show');
					});
				}, '#twitter_follower_panel', agile_crm_get_current_view());
				
					
			}, function(error)
			{
				Twitter_follower_ids = undefined;
				$('#tweet_load').remove();
				tweetError("follower-error-panel", error.responseText);
			});
		});
	});

    $("#widgets").off('click','#more_followers');
	$("#widgets").on('click','#more_followers', function(e2)
	{
		e2.preventDefault();

		if (!Twitter_follower_ids)
			return;

		$('#spinner-followers').show();

		console.log(Twitter_follower_ids);

		// Get 20 from array and remove 20 from array
		var temp = Twitter_follower_ids.splice(0, 20);
		console.log(temp);

		// Get the Twitter profile for 20 Twitter IDs
		getListOfProfilesByIDsinTwitter(temp, function(result)
		{

			$('#spinner-followers').hide();

			// Show matching profiles in Twitter panel
			
			getTemplate('twitter-follower-following', result, undefined, function(template_ui){
		 		if(!template_ui)
		    		return;
				$('#twitter_follower_panel').append($(template_ui)); 
			}, null);
		}, function(error)
		{
			$('#spinner-followers').hide();
			tweetError("follower-error-panel", error.responseText);
		});
	});

	// On click of following in twitter panel
    $("#widgets").off('click','#twitter_following');
	$("#widgets").on('click','#twitter_following', function(e1)
	{
		e1.preventDefault();

		if (Twitter_following_ids && Twitter_following_ids.length != 0)
			return;

		Twitter_following_ids = [];

		$('#twitter_following_panel', agile_crm_get_current_view()).html(TWITTER_UPDATE_LOAD_IMAGE);

		// Retrieves the Twitter IDs of all the following persons
		getFollowingIdsInTwitter(Twitter_id, function(data)
		{
			// Store array of IDs in a global variable
			Twitter_following_ids = data;

			console.log(data.length);
			if (data.length == 0)
			{
				$('#twitter_following_panel', agile_crm_get_current_view()).html(Twitter_current_profile_user_name + " isn't following anyone yet");
				return;
			}

			// Get 20 from array and remove 20 from array
			var temp = Twitter_following_ids.splice(0, 20);
			console.log(temp);

			// Get the Twitter profile for 20 Twitter IDs
			getListOfProfilesByIDsinTwitter(temp, function(result)
			{

				// Show matching profiles in Twitter panel
				
				getTemplate('twitter-follower-following', result, undefined, function(template_ui){
			 		if(!template_ui)
			    		return;
					$('#twitter_following_panel', agile_crm_get_current_view()).html($(template_ui));
					$("#widgets").on('mouseover','.twitterImage', function(e1)
					{
						// Unique Twitter Id from widget
						var id = $(this).attr('id');
                
                $("#widgets").off('mouseover','.twitterImage');
						// Aligns details to left in the pop over
						$('#' + id).popover({ placement : 'left',
							html : true
						});

						/*
						 * Called show to overcome pop over bug (not showing pop
						 * over on mouse hover for first time)
						 */
						$('#' + id).popover('show');
					}); 
				}, '#twitter_following_panel', agile_crm_get_current_view());

					
			}, function(error)
			{
				Twitter_following_ids = undefined;
				$('#tweet_load').remove();
				tweetError("following-error-panel", error.responseText);
			});
		});
	});

    $("#widgets").off('click','#more_following');
	$("#widgets").on('click','#more_following', function(e2)
	{
		e2.preventDefault();

		if (!Twitter_following_ids)
			return;

		$('#spinner-following').show();

		// Get 20 from array and remove 20 from array
		var temp = Twitter_following_ids.splice(0, 20);
		console.log(temp);

		// Get the Twitter profile for 20 Twitter IDs
		getListOfProfilesByIDsinTwitter(temp, function(result)
		{

			// $('#tweet_load').remove();
			$('#spinner-following').hide();

			// Show matching profiles in Twitter panel
			getTemplate('twitter-follower-following', result, undefined, function(template_ui){
		 		if(!template_ui)
		    		return;
		    	$('#twitter_following_panel').append($(template_ui)); 
			}, null);
		}, function(error)
		{
			$('#spinner-following').hide();
			tweetError("following-error-panel", error.responseText);
		});

	});
}