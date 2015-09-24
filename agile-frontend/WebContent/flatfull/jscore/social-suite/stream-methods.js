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


/**
 * Register all streams on social server.
 */
function registerAll(index)
{
	var streamsJSON = Streams_List_View.collection.toJSON();

	// Streams not available OR streams already registered OR pubnub not
	// initialized OR (index 0 stream is done and Register_Counter is increased.)
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

		// Add user's profile img from twitter to stream header.
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
 * On logout or browser/window clise, Unregister all streams on server.
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
 * Add relevant profile img from twitter to stream in column header.
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
 * On click of retry button in stream notification,
 * Sends register message again to twitter server. 
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
