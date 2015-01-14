/*
 * === googleplus.js ==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party JavaScript API provided.It interacts with the
 * application based on the function provided on agile_widgets.js(Third party API)
 */


function showMatchedPeople(search)
{

	var retData = getMatchingPeople(search);

	if (typeof retData.errors == "undefined")
	{
		var data = retData.items;
		// If no matches found display message
		if (data.length == 0)
		{
			if (searchDetails['keywords'] && searchDetails['keywords'] != "")
				displayError(
						WIDGET_NAME,
						"<p class='a-dotted' style='margin-bottom:0px;'>No matches found for <a href='#' class='peoplesearch'>" + searchDetails['keywords'] + "</a>",
						true);
			else
				displayError(WIDGET_NAME,
						"<p class='a-dotted' style='margin-bottom:0px;'>No matches found. <a href='#' class='peoplesearch'>Modify search</a>", true);
			return;
		}

		var el;
		if (searchDetails['keywords'] && searchDetails['keywords'] != "")
			el = "<div><p class='a-dotted'>Search results for " + "<a href='#' class='peoplesearch'>" + searchDetails['keywords'] + "</a></p>";
		else
			el = "<div><p class='a-dotted'>Search results. " + "<a href='#' class='peoplesearch'>Modify search</a></p>";

		el = el.concat(getTemplate("googleplus-search-result", data));
		el = el + "</div>";

		// Show matching profiles in widget panel
		$('#' + WIDGET_NAME).html(el);
	}
	else
	{
		// console.log(retData);
		return;
	}

}

function showGooglePlusProfile(id)
{
	var resData = {};

	if (typeof PROFILE_DATA["" + id] == "undefined")
	{
		resData = getGooglePlusUserDetails(id);
	}
	else
	{
		resData = PROFILE_DATA["" + id];
	}

	var resData = getGooglePlusUserDetails(id);

	if (typeof resData.errors == "undefined")
	{

		var el;
		el = getTemplate("googleplus-profile", resData);
		$('#' + WIDGET_NAME).html(el);
		showGooglePlusPosts(id);
	}
	else
	{
		// console.log(resData);
		return;
	}
}

function showGooglePlusPosts(id, nextPageToken)
{
	var GPostsData = {};

	if (typeof nextPageToken != "undefined")
	{
		GPostsData = getGooglePlusPosts(id, nextPageToken);
	}
	else
	{
		GPostsData = getGooglePlusPosts(id);
	}

//	console.clear();
//	console.log(GPostsData);

	if (typeof nextPageToken != "undefined")
	{
		$('#gplus_social_stream').append(getTemplate("googleplus-posts", GPostsData));
		$('#gplusstreammore').attr("ntoken", GPostsData['nextPageToken']);
	}
	else
	{
		$('#gpostscontainer').html(getTemplate("googleplus-profile-tabs", GPostsData));
		if(!GPostsData.items.length)
			$('#recentPostsText').html('<div style="text-align: center;font-size: 13px;padding: 5px 0 6px 0;">No Posts.</div>');
	}

	head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
	{
		$(".time-ago").timeago();
	});

}

function getGooglePlusUserDetails(id)
{
	var apiURL = "https://www.googleapis.com/plus/v1/people/" + id;
	var reqData = "fields=aboutMe%2CcurrentLocation%2CdisplayName%2Cdomain%2Cgender%2Cid%2Cimage%2CisPlusUser%2Coccupation%2Corganizations%2CplacesLived%2Curl";
		
	var apiCallReturnData = googlePlusApiCall(apiURL, reqData);	
	var errorObj = apiCallReturnData.error;	
	if(typeof errorObj != "undefined") {
		if (errorObj.code == 401 && errorObj.message == "Invalid Credentials")
		{
//			alert("Refreshing access token");
			refreshAccessToken();
		}
		else
		{
			displayError(WIDGET_NAME, errorObj.message);
			return;
		}
	}
	else {
		return apiCallReturnData;
	}
	
	return googlePlusApiCall(apiURL, reqData);

}

function getGooglePlusPosts(id, nextPageToken)
{
	var apiURL = "https://www.googleapis.com/plus/v1/people/" + id + "/activities/public";
	var reqData = "fields=id%2Citems(actor(displayName%2Cid%2Cimage%2Curl)%2Cid%2Ckind%2Clocation%2Cobject(actor%2Cattachments(content%2CdisplayName%2Cid%2Cimage%2CobjectType%2Cthumbnails%2Curl)%2Ccontent%2Cid%2CobjectType%2CoriginalContent%2Curl)%2Cpublished%2Ctitle%2Cupdated%2Curl%2Cverb)%2CnextPageToken%2CselfLink%2Cupdated&maxResults=4";
	if (typeof nextPageToken != "undefined")
		reqData += "&pageToken=" + nextPageToken;
	
	var apiCallReturnData = googlePlusApiCall(apiURL, reqData);	
	var errorObj = apiCallReturnData.error;	
	if(typeof errorObj != "undefined") {
		if (errorObj.code == 401 && errorObj.message == "Invalid Credentials")
		{
//			alert("Refreshing access token");
			refreshAccessToken();
		}
		else
		{
			displayError(WIDGET_NAME, errorObj.message);
			return;
		}
	}
	else {
		return apiCallReturnData;
	}
	
	return googlePlusApiCall(apiURL, reqData);

}

function getMatchingPeople(search)
{
	var apiURL = "https://www.googleapis.com/plus/v1/people";
	var reqData = "query=" + search + "&maxResults=20";
	var apiCallReturnData = googlePlusApiCall(apiURL, reqData);	
	var errorObj = apiCallReturnData.error;	
	if(typeof errorObj != "undefined") {
		if (errorObj.code == 401 && errorObj.message == "Invalid Credentials")
		{
//			alert("Refreshing access token");
			refreshAccessToken();
		}
		else
		{
			displayError(WIDGET_NAME, errorObj.message);
			return;
		}
	}
	else {
		return apiCallReturnData;
	}
	return googlePlusApiCall(apiURL, reqData);
}

// utility functions

function refreshAccessToken()
{

	var reqData = "reqType=googleplusrefresh&widgetId=" + pluginId + "&refreshToken=" + widgetPref['refresh_token'] + "&code_token=" + widgetPref['code_token'];

	$.ajax({ type : "POST", url : "/scribe", async : false, data : reqData, success : function(data, textStatus, jqXHR)
	{
		// data - response from server
		widgetDetails = getWidgetDetails();
		widgetPref = JSON.parse(widgetDetails.prefs);
	}, error : function(jqXHR, textStatus, errorThrown)
	{

	} });
}

function getWidgetDetails()
{
	return $.parseJSON($.ajax({ url : "core/api/widgets/GooglePlus", async : false, dataType : 'json' }).responseText);

}

function googlePlusApiCall(apiURL, reqData)
{

	var jsonRequest = $.ajax({ type : "GET", url : apiURL, async : false, data : reqData + "&access_token=" + widgetPref['access_token'], dataType : "json" });
	return $.parseJSON(jsonRequest.responseText);

}

function displayError(id, error, disable_check)
{
	// build JSON with error message
	var error_json = {};
	error_json['message'] = error;
	error_json['disable_check'] = disable_check;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	$('#' + id).html(getTemplate('googleplus-error-panel', error_json));

}

$(function()
		{

			WIDGET_NAME = "GooglePlus";
			LODING_IMAGE = '<div id="tweet_load"><center><img  src=\"img/ajax-loader-cursor.gif\" ' + 'style="margin-top: 10px;margin-bottom: 14px;"></img></center></div>';

			PROFILE_DATA = {};

			// Retrieves widget which is fetched using script API
			widgetDetails = agile_crm_get_widget(WIDGET_NAME);

			// console.clear();
			// console.log("From Javascript API before refresh");
			// console.log(widgetDetails);
			// return;

			pluginId = widgetDetails.id;
			widgetPref = JSON.parse(widgetDetails.prefs);
			searchDetails = {};

			// console.log(widgetPref);

			var name = "";
			if (agile_crm_get_contact_property("first_name"))
				name = name + agile_crm_get_contact_property("first_name");
			if (agile_crm_get_contact_property("last_name"))
				name = name + " " + agile_crm_get_contact_property("last_name");
			searchDetails['keywords'] = name.trim();

			contactGooglePlusId = agile_crm_get_contact_property_by_subtype('website', 'GOOGLE-PLUS');

			// console.log("From Java API after refresh");
			// refreshAccessToken();
			// console.log(widgetDetails);
			// console.log(widgetPref);
			// return;

			if (typeof contactGooglePlusId == "undefined")
			{
				// search and display people matching customer name
				showMatchedPeople(searchDetails['keywords']);
			}
			else
			{
				showGooglePlusProfile(contactGooglePlusId);
			}

			// handling all events related to this widget

			// Deletes GooglePlus profile on click of delete button in template
			$('#GooglePlus_plugin_delete').die().live('click', function(e)
			{
				e.preventDefault();
				contactGooglePlusId = agile_crm_get_contact_property_by_subtype('website', 'GOOGLE-PLUS');

				agile_crm_delete_contact_property_by_subtype('website', 'GOOGLE-PLUS', contactGooglePlusId, function(data)
				{
					showMatchedPeople(searchDetails['keywords']);
				});

			});

			$('.peoplesearch').die().live('click', function(e)
			{
				e.preventDefault();
				$('#' + WIDGET_NAME).html(getTemplate('googleplus-modified-search', searchDetails));
			});

			$('#gpsearchbtn').die().live('click', function(e)
			{
				e.preventDefault();

				// Checks whether all input fields are given
				if (!isValidForm($("#gpsearchform")))
				{
					return;
				}

				var searchKey = $('#searchkeywords').val();
				$('#spinner-search').show();
				searchDetails['keywords'] = searchKey;
				showMatchedPeople(searchDetails['keywords']);
			});

			$('#searchkeywords').die().live('keypress', function(event)
			{
				if (event.keyCode == 13)
				{
					event.preventDefault();
					$("#gpsearchbtn").trigger("click");
				}
			});

			$('#gpsearchclose').die().live('click', function(e)
			{
				showMatchedPeople(searchDetails['keywords']);
				e.preventDefault();
			});

			$('.GoogleplusDisplayPic').die().live('mouseover', function(e)
			{

				// Unique Google Plus User Id from widget
				profileID = $(this).attr('id');
				// on hover ajax request
//				var profileDat = getGooglePlusUserDetails(profileID);
//				if (typeof profileDat.errors == "undefined")
//				{
//					if (typeof PROFILE_DATA["" + profileID] == "undefined")
//					{
//						PROFILE_DATA["" + profileID] = profileDat;
//						var povOverData = $("#" + profileID).attr('data-content');
//						$("#" + profileID).attr('data-content', povOverData + getTemplate("googleplus-pop-profile", profileDat));
//					}
		//
//				}

				// Aligns details to left in the pop over
				$(this).popover({ placement : 'left' });
				/*
				 * Called show to overcome pop over bug (not showing pop over on mouse
				 * hover for first time)
				 */
				$(this).popover('show');

				$('#' + profileID).die().live('click', function(e)
				{

					e.preventDefault();
					// Hide pop over after clicking on any picture
					$(this).popover('hide');

					// saving in db
					var propertiesArray = [
						{ "name" : "website", "value" : profileID, "subtype" : "GOOGLE-PLUS" }
					];

					if (!agile_crm_get_contact_property("image"))// If no contact
					// image
					{
						// Get image link which can be used to save image for contact
						var displayImage = $(this).attr('src');
						propertiesArray.push({ "name" : "image", "value" : displayImage });
					}

					/*
					 * If contact title is undefined, saves headline of the Twitter
					 * profile to the contact title
					 */
					// if (!agile_crm_get_contact_property("title"))
					// {
					// var summary = $(this).attr("summary");
					// propertiesArray.push({ "name" : "title", "value" : summary });
					// }
					agile_crm_update_contact_properties(propertiesArray);

					contactGooglePlusId = profileID;

					showGooglePlusProfile(profileID);

				});

			});

			$('#gplusstreammore').die().live('click', function(e)
			{
				e.preventDefault();
				var nextPageToken = $(this).attr("ntoken");

				if (nextPageToken == "")
				{
					$('#gplusstreammore').html("No more posts.");
					return;
				}

				$('#spinnerspan').show();
				showGooglePlusPosts(contactGooglePlusId, nextPageToken);
				$('#spinnerspan').hide();
			});

		});// End of function
