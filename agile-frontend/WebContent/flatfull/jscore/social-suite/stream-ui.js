/** 
 * This file contains all event related actions on Stream, 
 * Like add stream, remove stream, select network type, select stream type, etc.
 */

/** On load of social suites page. */
$(function()
{
	// Default values
	Stream_Type = null;
	Network_Type = null;
	Register_All_Done = false;
	Tweet_Owner_For_Add_Contact = null;
	Focused = true;
	Scheduled_Edit = false;
	Register_Counter = null;
	Add_Img_Done = false;

	/*
	 * When user click on clock icon to schedule update so need to save original
	 * URL of model, in case of user de-select scheduling.
	 */
	Previous_URL = null;

	// If selected schedule is future time then it will be true.
	Schedule_In_Future = false;

	// Flag for Scroll down reached to end of stream.
	Scroll_Down_Call = false;

	// How many Tweets ready for display.
	Past_Tweets_Count = 0;
});

// To collect tweets in temp collection.
window.onfocus = function()
{
	Focused = true;
};
window.onblur = function()
{
	Focused = false;
};

window.onbeforeunload = unregisterAll;

function initializeSocialSuite()
{
	// On close tab/window unregister all streams on server.
	$(window).unload(function()
	{
		unregisterAll();
	});

	// After clicking on logout, unregister all streams on server.
	$('a').click(function(event)
	{		
		var herfLogout = $(this).attr("href");
		if (herfLogout == "/login")
			unregisterAll();
	});

	/**
	 * Display popup form with stream details.
	 */
	$('body').on('click', '.add-stream', function(e)
	{
		// Need to call openTwitter function in ui.js for Oauth.
		head.js('js/designer/ui.js', function()
		{
		});

		// Reset all fields
		$('#streamDetail').each(function()
		{
			this.reset();
		});

		// Enable button of add stream on form of stream detail
		// $('#addStreamModal').find('#add_twitter_stream').removeAttr('disabled');

		// Fill elements on form related to stream.
		fillStreamDetail();

		getTemplate('socialsuite-social-network', {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			// Add social network types template
			$('#streamDetails').html($(template_ui));

			// Show form modal
			$('#addStreamModal').modal('show');

		}, "#streamDetails");
		
	});

	/**
	 * On click of twitter icon, Calls Oauth for selected network type.
	 */
	$('body').on('click', '.network-type', function(e)
	{
		// User select Twitter.
		if (this.id == "twitter_option")
		{
			// Oauth for twitter.
			openTwitter();

			/**
			 * Get network type from selected option of social networks. Icon
			 * can not store value attribute so need store on options.
			 */
			Network_Type = "TWITTER";
		}

		// Store network type on input element for form feild.
		$("#network_type", $('#addStreamModal')).attr("value", Network_Type);
	});

	/**
	 * Get stream name from selected option in list of streams.
	 */
	$('body').on('click', '.stream-type', function(e)
					{
						e.preventDefault();

						if (this.className == "stream-type stream-type-button-color")
						{
							// remove keyword input element
							$('.remove-keyword').remove();

							// Remove all selection.
							$('.stream-type').removeClass("stream-type-button-color");

							// Button deselected.
							this.className = "stream-type";

							// Empty stream type.
							Stream_Type = null;
							$("#stream_type", $('#addStreamModal')).attr("value", '');
						}
						else
						{
							// Remove all other selection.
							$('.stream-type').removeClass("stream-type-button-color");

							// Button selected.
							this.className = "stream-type stream-type-button-color";

							// Store stream type.
							Stream_Type = $(this).attr("value").trim();
							$("#stream_type", $('#addStreamModal')).attr("value", Stream_Type);

							// Display keyword field.
							if (Stream_Type == "Search")
							{
								$("#search_stream_keyword").html('<div class="remove-keyword"><div class="row"><div class="control-group col-md-5"><span class="controls"><input id="keyword" name="keyword" type="text" class="required form-control" required="required" autocapitalize="off" placeholder="Search Keyword..." value="" autofocus></span></div></div></div>');
							}
							else
							{
								// Remove keyword input element
								$('.remove-keyword').remove();
							}
						}

						// Removes bg color.
						$(this).css('background-color', '');
					});

	/**
	 * Get description of stream on mouse over and show at bottom of add stream
	 * form.
	 */
	$(document)
			.on(
					"mouseover",
					".stream-type",
					function(e)
					{
						// To show stream type description.
						$("#stream_description_label").addClass("txt-mute");

						// Gets value of selected stream type.
						mouseoverStream = $(this).attr("value");

						var theColorIs = $(this).css("background-color");

						if (theColorIs != 'rgb(187, 187, 187)')
						{
							// Changes bg color.
							$(this).css('background-color', '#EDEDED');
						}

						getTemplate('socialsuite-hover-helptext', {"item":mouseoverStream}, undefined, function(template_ui){
							if(!template_ui)
								  return;
							$("#stream_description_label").removeClass('description-hidden');
							$('#stream_description_label').html(template_ui);	
						}, null);

						
					});

	/**
	 * Remove description of stream on mouse out and from bottom of form.
	 */
	$(document).on("mouseout", ".stream-type", function(e)
	{
		// Removes bg color.
		$(this).css('background-color', '');

		// To hide stream type description.
		$("#stream_description_label").addClass('description-hidden txt-mute');
	});

	/**
	 * Fetchs data from popup stream add form and save stream as well as add to
	 * the collection, publish register message to the server.
	 */
	$('body').on('click', '.save-twitter-stream', function(e)
					{
						// Check add-stream button is not enable
						if ($('#addStreamModal').find('#add_twitter_stream').attr('disabled'))
							return;

						// Check if Oauth is done.
						if ($('#twitter_account').val() == null || $('#twitter_account').val() == '')
						{
							alert("You have to give access to your social account.");
							$("#add-stream").click();
							return;
						}

						// Check if stream type is not selected.
						if (Stream_Type == null || Stream_Type == '')
						{
							// To show error description.
							$("#stream_description_label").addClass("txt-mute").html('<span style="color: red;"><i class="icon-exclamation"></i> You have to select your favorite stream type.</span>');
							return;
						}

						// Check if the form is valid
						if (!isValidForm('#streamDetail'))
						{
							$('#streamDetail').find("input").focus();
							return false;
						}

						// Disables add button to prevent multiple add on click
						// event issues
						$('#addStreamModal').find('#add_twitter_stream').attr('disabled', 'disabled');

						// Show notification for adding stream.
						showNotyPopUp('information', "Adding Stream...", "top", 2500);

						// Get data from form elements
						var formData = jQuery(streamDetail).serializeArray();
						var json = {};

						// Convert into JSON
						jQuery.each(formData, function()
						{
							json[this.name] = this.value || '';
						});

						// Add collection's column index in stream.
						json["column_index"] = Streams_List_View.collection.length + 1;

						// Create new stream
						var newStream = new Backbone.Model();
						newStream.url = '/core/social';
						newStream.save(json, { success : function(stream)
						{
							// Append in collection,add new stream
							socialsuitecall.streams(stream);

							// Scroll down the page till end, so user can see
							// newly added stream.
							$("html, body").animate({ scrollTop : $(document).height() - $(window).height() });

							// Register on server
							var publishJSON = { "message_type" : "register", "stream" : stream.toJSON() };
							sendMessage(publishJSON);

							// Notification for stream added.
							showNotyPopUp('information', "Stream added. You can add another Stream now.", "top", 4000);

							setTimeout(function()
							{
								// Find selected stream id.
								var idOfStreamType = $('#addStreamModal').find("div[value='" + Stream_Type + "']").attr('id');
								$("#" + idOfStreamType).click();

								// Make send button enable
								$('#addStreamModal').find('#add_twitter_stream').removeAttr('disabled');

								Stream_Type = "";
							}, 4000);

							// Adds tag in 'our' domain to track usage
							addTagAgile(SOCIAL_TAG);

						}, error : function(data)
						{
							console.log(data);
						} });
					});

	/**
	 * Gets stream, Delete it from collection and dB and publish unregister
	 * stream.
	 */
	$('body').on('click', '.stream-delete', function(e)
	{
		if (!confirm("Are you sure you want to delete?"))
			return;

		var id = $(this).attr('id');

		// Fetch stream from collection
		var stream = Streams_List_View.collection.get(id).toJSON();

		// Stream size is too big, can not handle by pubnub so remove list of
		// tweet.
		delete stream.tweetListView;

		// Unregister on server
		var publishJSON = { "message_type" : "unregister", "stream" : stream };
		sendMessage(publishJSON);

		// Delete stream from collection and DB
		//Streams_List_View.collection.get(id).destroy();
		$.ajax({ type : 'DELETE', url : '/core/social/' + id, contentType : "application/json; charset=utf-8",
			success : function(data){
				Streams_List_View.collection.remove(id);
				Streams_List_View.render(true).el;
			}, dataType : 'json' });
	});

	/**
	 * In stream on click of notification, Gets relation and perform action as
	 * per that. like Retry : re-register stream on server. Add-new -tweet : Add
	 * new unread tweets on stream.
	 */
	$('body').on('click', '.action-notify', function(e)
	{
		// Get relation for action.
		var relation = $(this).attr('rel');

		// Get stream id.
		var streamId = $(this).attr('data');

		// Remove notification of new tweets on stream.
		$("#"+this.id).html('');

		if (relation == "add-new-tweet")
			mergeNewUnreadTweets(streamId);
		else if (relation == "retry")
			registerStreamAgain(streamId);

		// Remove relation from <div> for notification.
		$(this).attr("rel", '');

		// Remove deleted tweet element from ui
		$('.deleted').remove();
	});
}
