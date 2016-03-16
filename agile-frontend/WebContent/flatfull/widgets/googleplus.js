/*
 * === googleplus.js ==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party JavaScript API provided.It interacts with the
 * application based on the function provided on agile_widgets.js(Third party API)
 */


function showMatchedPeople(search)
{

	getMatchingPeople(search, function(retData){

		if (typeof retData.errors == "undefined"){

			var data = retData.items;
			// If no matches found display message
			if (data.length == 0)
			{
				if (searchDetails['keywords'] && searchDetails['keywords'] != "")
					displayError(
							WIDGET_NAME,
							"<p class='text-base' style='margin-bottom:0px;'>No matches found for <a href='#' class='peoplesearch'>" + searchDetails['keywords'] + "</a>",
							true);
				else
					displayError(WIDGET_NAME,
							"<p class='text-base' style='margin-bottom:0px;'>No matches found. <a href='#' class='peoplesearch'>Modify search</a>", true);
				return;
			}

			var el;

			if (searchDetails['keywords'] && searchDetails['keywords'] != ""){
				el = "<div class='panel-body text-base'><p>Search results for " + "<a href='#' class='peoplesearch'>" + searchDetails['keywords'] + "</a></p>";
			} else {
				el = "<div class='panel-body text-base'><p>Search results. " + "<a href='#' class='peoplesearch'>Modify search</a></p>";
			}

			el = el.concat(getTemplate("googleplus-search-result", data));
			el = el + "</div></div><div class='clearfix'></div>";

			// Show matching profiles in widget panel
			$('#' + WIDGET_NAME).html(el);
		}

	});

}

function showGooglePlusProfile(id)
{
	/*var resData = {};

	if (typeof PROFILE_DATA["" + id] == "undefined")
	{
		resData = getGooglePlusUserDetails(id);
	}
	else
	{
		resData = PROFILE_DATA["" + id];
	}*/

	getGooglePlusUserDetails(id, function(resData){

		if (typeof resData.errors == "undefined")
		{
			var el = getTemplate("googleplus-profile", resData);		
			console.log(el);
			$('#' + WIDGET_NAME).html(el);
			showGooglePlusPosts(id);
		}

	});
}

function showGooglePlusPosts(id, nextPageToken)
{
	getGooglePlusPosts(id, nextPageToken, function(GPostsData){

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
	});

}

function getGooglePlusUserDetails(id, callback)
{
	var apiURL = "https://www.googleapis.com/plus/v1/people/" + id;
	var reqData = "fields=aboutMe%2CcurrentLocation%2CdisplayName%2Cdomain%2Cgender%2Cid%2Cimage%2CisPlusUser%2Coccupation%2Corganizations%2CplacesLived%2Curl";
		
	googlePlusApiCall(apiURL, reqData, function(apiCallReturnData){

		var errorObj = apiCallReturnData.error;	
		if(typeof errorObj != "undefined") {
			if (errorObj.code == 401 && errorObj.message == "Invalid Credentials")
			{
				refreshAccessToken();
			}
			else
			{
				displayError(WIDGET_NAME, errorObj.message);
				return;
			}
		}
		else {
			return callback(apiCallReturnData);
		}

	});	
	
}

function getGooglePlusPosts(id, nextPageToken, callback)
{
	var apiURL = "https://www.googleapis.com/plus/v1/people/" + id + "/activities/public";
	var reqData = "fields=id%2Citems(actor(displayName%2Cid%2Cimage%2Curl)%2Cid%2Ckind%2Clocation%2Cobject(actor%2Cattachments(content%2CdisplayName%2Cid%2Cimage%2CobjectType%2Cthumbnails%2Curl)%2Ccontent%2Cid%2CobjectType%2CoriginalContent%2Curl)%2Cpublished%2Ctitle%2Cupdated%2Curl%2Cverb)%2CnextPageToken%2CselfLink%2Cupdated&maxResults=4";
	if (typeof nextPageToken != "undefined")
		reqData += "&pageToken=" + nextPageToken;
	
	googlePlusApiCall(apiURL, reqData, function(apiCallReturnData){

		var errorObj = apiCallReturnData.error;	
		if(typeof errorObj != "undefined") {
			if (errorObj.code == 401 && errorObj.message == "Invalid Credentials")
			{
				refreshAccessToken();
			}
			else
			{
				displayError(WIDGET_NAME, errorObj.message);
				return;
			}
		}
		else {
			return callback(apiCallReturnData);
		}
	});	
}

function getMatchingPeople(search, callback) {
	var apiURL = "https://www.googleapis.com/plus/v1/people";
	var reqData = "query=" + search + "&maxResults=20";
	googlePlusApiCall(apiURL, reqData, function(apiCallReturnData){

		var errorObj = apiCallReturnData.error;	
		if(typeof errorObj != "undefined") {
			if (errorObj.code == 401 && errorObj.message == "Invalid Credentials")
			{
				refreshAccessToken();
			}
			else
			{
				displayError(WIDGET_NAME, errorObj.message);
				return;
			}
		}
		else {
			return callback(apiCallReturnData);
		}

	});	
}

// utility functions

function refreshAccessToken() {

	var reqData = "reqType=googleplusrefresh&widgetId=" + pluginId + "&refreshToken=" + widgetPref['refresh_token'] + "&code_token=" + widgetPref['code_token'];

	$.ajax({ type : "POST", url : "/scribe", data : reqData, success : function(data, textStatus, jqXHR)
	{
		// data - response from server
		getWidgetDetails(function(prefs){
			   widgetDetails = prefs;
			   widgetPref = JSON.parse(widgetDetails.prefs);
		});
		
	}, error : function(jqXHR, textStatus, errorThrown)
	{

	} });
}

function getWidgetDetails(callback) {
	accessUrlUsingAjax("core/api/widgets/GooglePlus", function(response){
		if(callback)
			   callback(response);
	});
}

function googlePlusApiCall(apiURL, reqData, callback) {
	$.ajax({ 
		type : "GET",
		url : "/core/api/widgets/googlewidgetsapi/"+pluginId,
		success: function(data){
			$.ajax({ 
				type : "GET", 
				url : apiURL, 
				data : reqData + "&access_token=" + data,
				dataType : "json",
				success: function(data){
					callback(data);
				},error:function(data){
					var errorObj = JSON.parse(data.responseText);
					if(errorObj){
						displayError(WIDGET_NAME, errorObj.error.message);
					}
				}
			});
		},error:function(data){
			var errorObj = JSON.parse(data.responseText);
			if(errorObj){
				displayError(WIDGET_NAME, errorObj.error.message);
			}
		}
	});
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

function startGooglePlusWidget(contact_id) {

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
	if (agile_crm_contact_property(WIDGET_LOADED_CONTACT, "first_name"))
		name = name + agile_crm_contact_property(WIDGET_LOADED_CONTACT, "first_name");
	if (agile_crm_contact_property(WIDGET_LOADED_CONTACT, "last_name"))
		name = name + " " + agile_crm_contact_property(WIDGET_LOADED_CONTACT, "last_name");
	searchDetails['keywords'] = name.trim();	
	contactGooglePlusId = agile_widget_contact_property_by_subtype('website', 'GOOGLE-PLUS');

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
	$("#"+WIDGET_PARENT_ID).off("click", "#GooglePlus_plugin_delete");
	$("#"+WIDGET_PARENT_ID).on("click", "#GooglePlus_plugin_delete", function(e)
	{
		e.preventDefault();
		contactGooglePlusId = agile_widget_contact_property_by_subtype('website', 'GOOGLE-PLUS');

		if(App_Contacts.contactDetailView.model){
			agile_crm_delete_contact_property_by_subtype('website', 'GOOGLE-PLUS', contactGooglePlusId, function(data){
				showMatchedPeople(searchDetails['keywords']);
			});
		}
	});

	$("#"+WIDGET_PARENT_ID).off("click", ".peoplesearch");
	$("#"+WIDGET_PARENT_ID).on("click", ".peoplesearch", function(e)
	{
		e.preventDefault();
		getTemplate('googleplus-modified-search', {}, undefined, function(template_ui){
	 		if(!template_ui)
	    		return;
			$('#' + WIDGET_NAME).html($(template_ui)); 
		},'#' + WIDGET_NAME);

	});
	
	$("#"+WIDGET_PARENT_ID).off("click", "#gpsearchbtn");
	$("#"+WIDGET_PARENT_ID).on("click", "#gpsearchbtn", function(e)
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

	$("#"+WIDGET_PARENT_ID).off("keypress", "#searchkeywords");
	$("#"+WIDGET_PARENT_ID).on("keypress", "#searchkeywords", function(event)
	{
		if (event.keyCode == 13)
		{
			event.preventDefault();
			$("#gpsearchbtn").trigger("click");
		}
	});

	$("#"+WIDGET_PARENT_ID).off("click", "#gpsearchclose");
	$("#"+WIDGET_PARENT_ID).on("click", "#gpsearchclose", function(e)
	{
		showMatchedPeople(searchDetails['keywords']);
		e.preventDefault();
	});

	$("#"+WIDGET_PARENT_ID).off("mouseover", ".GoogleplusDisplayPic");
	$("#"+WIDGET_PARENT_ID).on("mouseover", ".GoogleplusDisplayPic", function(e)
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
		$(this).popover({ placement : 'left',
			html:true
		});
		/*
		 * Called show to overcome pop over bug (not showing pop over on mouse
		 * hover for first time)
		 */
		$(this).popover('show');  

		$('#' + profileID).on('click', function(e)
		{

			e.preventDefault();
			// Hide pop over after clicking on any picture
			$(this).popover('hide');

			// saving in db
			var propertiesArray = [
				{ "name" : "website", "value" : profileID, "subtype" : "GOOGLE-PLUS" }
			];

			if (!agile_crm_contact_property(WIDGET_LOADED_CONTACT, "image")){
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
			agile_widget_update_contact_properties(propertiesArray);

			contactGooglePlusId = profileID;

			showGooglePlusProfile(profileID);

		});

	});

	$("#"+WIDGET_PARENT_ID).off("click", "#gplusstreammore");
	$("#"+WIDGET_PARENT_ID).on("click", "#gplusstreammore", function(e)
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

}// End of function