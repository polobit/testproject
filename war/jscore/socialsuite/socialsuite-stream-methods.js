/**
 * Fill details of stream in add-stream form and arrange elements as per
 * requirement.
 */
function fillStreamDetail()
{
	// Network Type not selected
	Network_Type = null;

	// Stream Type not selected
	Stream_Type = null;

	// Empty screen name means Oauth is not done.
	$("#twitter_account", $('#addStreamModal')).attr("value", '');

	// Empty stream type.
	$("#stream_type", $('#addStreamModal')).attr("value", '');

	// remove keyword input element
	$('.remove-keyword').remove();

	// Add value to hidden input element.
	$("#domain_user_id", $('#addStreamModal')).attr("value", CURRENT_DOMAIN_USER.id);
	$("#client_channel", $('#addStreamModal')).attr("value", CURRENT_DOMAIN_USER.id + "_Channel");

	// Add button for twitter is hidden.
	$('#add_twitter_stream').hide();

	// To hide stream type description.
	document.getElementById("stream_description_label").className = 'description-hidden txt-mute';

	// Empty hidden profile image on form.
	$('#twitter_profile_img_url').attr("src", "");
}

// Calls from Profile image onload to fill account holder's name in Form.
function onloadProfileImg()
{
	// Add button for twitter is shown.
	$('#add_twitter_stream').show();

	// Add twitter stream types template.
	$("#streamDetails").html(getTemplate('twitter-stream-type'), {});

	// Add profile image to account description.
	$('#twitter_profile_img').attr("src", document.getElementById("twitter_profile_img_url").src);

	// Add screen name to label.
	document.getElementById('account_description_label').innerHTML = '<b>' + $('#twitter_account').val() + '</b>';
}

// Add website and select network on continue form in add contact flow.
function socialsuite_add_website()
{
	if (Tweet_Owner_For_Add_Contact != null)
	{
		// Add values in continue form after add contact form.
		// Add website / handle of twitter of tweet owner.
		$("#website", $('#continueform')).attr("value", Tweet_Owner_For_Add_Contact);

		// Select network type.
		$("div.website select").val("TWITTER");

		Tweet_Owner_For_Add_Contact = null;
	}
}

// Change property of website and select network in add contact form.
function changeProperty()
{
	var display = $('#network_handle', $('#personModal')).css("display");
	var picDisplay = $("#pic", $('#personModal')).css("display");
	var picValue = $("#pic", $('#personModal')).html();

	if ((picDisplay == 'inline' || picDisplay == 'block') && picValue != '')
	{
		if (display == 'none')
			document.getElementById("network_handle").className = 'after-img-load-hide';
		else if (display == 'block')
			document.getElementById("network_handle").className = 'after-img-load-show';

		document.getElementById("handle").className = 'add-form-input';
	}
	else if ((picDisplay == 'none' || picDisplay == null || picDisplay == '') || (picValue == null || picValue == ''))
	{
		if (display == 'none')
			document.getElementById("network_handle").className = 'network-handle';
		else if (display == 'block')
			document.getElementById("network_handle").className = 'socialsuite-network-handle';

		document.getElementById("handle").className = '';
	}
}

/**
 * Register all streams on server
 */
function registerAll(index)
{	
	var streamsJSON = Streams_List_View.collection.toJSON();

	// Streams not available OR streams already registered OR pubnub not
	// initialized OR (index 0 stream is done and RC is increased.)
	if (streamsJSON == null || Register_All_Done == true || Pubnub == null || (Register_Counter != null && index == 0))
	{
		console.log("Register_All_Done : " + Register_All_Done);
		return;
	}

	// Get stream.
	var stream = Streams_List_View.collection.at(index);

	// Check stream is present or added in collection.
	if (stream == null || stream == undefined)
		return;

	// First stream from collection to register and assign value to RC.
	if (index == 0 && Register_Counter == null)
	{
		Register_Counter = 0;

		if (Add_Img_Done == false)
			addUserImgToColumn();
	}

	// Publish data to register on server
	var publishJSON = { "message_type" : "register", "stream" : stream };
	sendMessage(publishJSON);

	// All added streams registered.
	if (Register_Counter == (Streams_List_View.collection.length - 1))
		Register_All_Done = true;
}

/**
 * Unregister all streams on server
 */
function unregisterAll()
{
	// Collection not defined.
	if (!Streams_List_View)
		return;

	// Streams not available OR pubnub not initialized.
	if (Streams_List_View == undefined || Pubnub == null)
		return;

	// Unregister on server
	var publishJSON = { "message_type" : "unregister_all", "client_channel" : CURRENT_DOMAIN_USER.id + "_Channel" };
	sendMessage(publishJSON);

	// Flush all data.
	Register_All_Done = false;
	Register_Counter = null;
	Add_Img_Done = false;
	Streams_List_View = undefined;
}

/**
 * Add relevant profile img to stream in column header.
 */
function addUserImgToColumn()
{
	var streamsJSON = Streams_List_View.collection.toJSON();

	// Get stream
	$.each(streamsJSON, function(i, stream)
	{
		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(stream.id);

		// Fetching profile image url from twitter server
		$.get("/core/social/getprofileimg/" + stream.id, function(url)
		{
			// Set url in stream model.
			modelStream.set("profile_img_url", url);

			// Append in collection
			socialsuitecall.streams(modelStream);
		});
	});
	Add_Img_Done = true;
}

/**
 * Send register message again to twitter server.
 */
function registerStreamAgain(streamId)
{
	// Fetch stream from collection
	var stream = Streams_List_View.collection.get(streamId).toJSON();

	// Register on server
	var publishJSON = { "message_type" : "register", "stream" : stream };
	sendMessage(publishJSON);

	// Show waiting symbol.
	$("#stream-spinner-modal-" + streamId).show();
}
