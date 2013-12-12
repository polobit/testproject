/** on load of social suites page. */
(function()
	  {
		 console.log("In social-ui.js");
		 
		 // Default values
		 pubnub = null;	   
		 StreamType = null;	
		 NetworkType = null;
		 registerAllDone = false;	
		 TweetOwnerForAddContact = null;
		 focused = true;
		 ScheduledEdit = false;
	  })();

// To collect tweets in temp collection.
window.onfocus = function() {
    focused = true;    
};
window.onblur = function() {
    focused = false;    
};

function initializeSocialSuite()
{
	// On close tab/window unregister all streams on server.
	$(window).unload(function() {	
		unregisterAll();
		});
	
	// After clicking on logout, unregister all streams on server.
	$('a').click(function(event) {
	   var herfLogout = $(this).attr("href");
	   if(herfLogout == "/login")
	     unregisterAll();      
	});

	/**
	 * Fills name with twitter's owner in add-contact popup form. 
	 */
	$(".add-twitter-contact").die().live("click", function(e)
	{
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));
		
		// Get stream from collection.
		var modelStream = StreamsListView.collection.get(streamId);		
		
		// Get tweet from stream.
		var tweet = modelStream.get('tweetListView').get(tweetId).toJSON();
				
		// Tweet owner's full name.
		var fullName = tweet.user.name;
			
		// Tweet owner's description.
		var description = tweet.user.description;
		
		// Tweet owner's handle/Screen name.
		TweetOwnerForAddContact = tweet.user.screen_name;
		
		// Separate full name.
		var firstName = fullName.substr(0,fullName.indexOf(' '));
		var lastName = fullName.substr(fullName.indexOf(' ')+1);;	
		
		// Add values in add contact form.
		$("#fname", $('#personModal')).attr("value",firstName);
		$("#lname", $('#personModal')).attr("value",lastName);
		$("#job_title", $('#personModal')).attr("value",description);	
		
		document.getElementById("network_handle").className = 'socialsuite-network-handle';
		$("#handle", $('#personModal')).attr("value",TweetOwnerForAddContact);
		
		// Add website / handle of twitter of tweet owner.
		$("#website", $('#personModal')).attr("value",TweetOwnerForAddContact);		
		$("#image", $('#personModal')).attr("value",tweet.user.profile_image_url);
		  	  
		// Select network type.
		$("div.website select").val("TWITTER");
		
		
		// If picture is not null and undefined, display it by given width, else display none
		var pic = tweet.user.profile_image_url;
		if (pic != undefined && pic != null)
		{
			var el = $('<img class="imgholder thumbnail person-img" onload="changeProperty()" style="display: inline;"  src="' + pic + '"></img>');
			$('#pic').html(el).show();
			$("img").error(function()
			{
				$('#pic').css("display", "none");
			});
		}
		
		changeProperty();
	});

	// Hide network handle from add contact form.
	$('#personModal').on('hidden.bs.modal', function () {
		document.getElementById("network_handle").className = 'network-handle';
		document.getElementById("handle").className = ''; 
		$('#pic').css("display", "none");
		$('#pic').empty();
		changeProperty();
		});

	// If img is shown then reduce size of network handle on add contact form.
	$('#personModal').on('shown.bs.modal', function () {
		changeProperty();
		});
	$('#personModal').on('show.bs.modal', function () {
		changeProperty();
		});
	$( "#pic" ).change(function() {
		changeProperty();
		});

	// Makes ScheduledEdit flag false to show normal update flow.
	$('#socialsuite_twitter_messageModal').on('show.bs.modal', function () {
		ScheduledEdit = false;
		$('#socialsuite_twitter_RTModal').remove();	
		});
		
	/**
	 * Display popup form with stream details. 
	 */
	$(".add-stream").die().live("click", function(e)
	{
	 	 head.js('js/designer/ui.js', function(){});
	 	
		 // Reset all fields
		 $('#streamDetail').each(function() {
		 this.reset();});
		
		 // Enable button of add stream on form of stream detail
		 $('#addStreamModal').find('#add_twitter_stream').removeAttr('disabled');

		 // Fill elements on form related to stream.
		 fillStreamDetail();	

		 // Add social network types template
		 $("#streamDetails").html(getTemplate('socialsuite-social-network'),{});
		 
		 // Show form modal
		 $('#addStreamModal').modal('show');	
	});

	/**
	 * On click of social network icon, Calls Oauth for selected network type.
	 */
	$(".network-type").die().live("click", function(e)
			{ 
		      // User select Twitter.
		      if(this.id == "twitter_option")
		    	  {    
		    		// Oauth for twitter.	 
		    	  	openTwitter();
		    	  
		    	  	/**
		    	  	 * Get network type from selected option of social networks. 
		    	  	 * Icon can not store value attribute so need store on options.
		    	  	 */
		    	  	NetworkType = "TWITTER";
		    	  	
		    	  	console.log("in network-type");
		    	  }
		      
		      // User select Linkedin.
		      if(this.id == "linkedin_option")
		    	  {
		    	    NetworkType = "LINKEDIN";	

		    	    // Add button for twitter is hidden.
		    		$('#add_twitter_stream').hide();
		    			
		    		// Add button for linkedin is shown.
		    		$('#add_linkedin_stream').show();
		    		    		 
		    		// Add linkedin stream types template.
		    		$("#streamDetails").html(getTemplate('linkedin-stream-type'),{});	
		    	  }	      
		      
		        console.log(NetworkType);	      
		
		        // Store network type on input element for form feild.
		        $("#network_type", $('#addStreamModal')).attr("value",NetworkType); 
			});

	/**
	 * Get stream name from selected option in list of streams.
	 */
	$(".stream-type").die().live("click", function(e)
			{	
			  e.preventDefault();
			  
			  if(this.className == "stream-type stream-type-button-color")
				  {
				    console.log("deselected");
				    
				    //remove keyword input element
			  	    $('.remove-keyword').remove();
				    
	 			    // Remove all selection.
				    $('.stream-type').removeClass("stream-type-button-color");	
				    
				    // Button deselected.			  
				    this.className = "stream-type";
				    
				    // Empty stream type.
				    StreamType = null;
				    $("#stream_type", $('#addStreamModal')).attr("value",'');
				  }
			  else
				  {
				    console.log("selected");
				    // Remove all other selection.
				    $('.stream-type').removeClass("stream-type-button-color");	
				   
				    // Button selected.			  
				    this.className = "stream-type stream-type-button-color";
				    
				    // Store stream type.
				    StreamType = $(this).attr("value").trim();
				    $("#stream_type", $('#addStreamModal')).attr("value",StreamType);
				    
				    // Display keyword field.
				    if(StreamType == "Search")
				    	{
				    	  document.getElementById('search_stream_keyword').innerHTML='<div class="remove-keyword"><input id="keyword" name="keyword" type="text" class="required" required="required" autocapitalize="off" placeholder="Search Keyword..." value=""></div>';
				    	}
				    else
				    	{
	 			    	  // Remove keyword input element
				  	      $('.remove-keyword').remove();
				    	}
				  }  		  
			 
			  // Removes bg color.
			  $(this).css('background-color', '');
	          
			  console.log(StreamType);
			});

	/**
	 * Get description of stream on mouse over and show at bottom of form.
	 */
	$(document).on("mouseover",".stream-type", function(e)
	 {	
		// To show stream type description.
		document.getElementById("stream_description_label").className = 'txt-mute';
		
		// Gets value of selected stream type.	
		mouseoverStream = $(this).attr("value");
		
		var theColorIs = $(this).css("background-color");
		
		if(theColorIs != 'rgb(187, 187, 187)')
			{
			  // Changes bg color.
		      $(this).css('background-color', '#EDEDED');
			}
			
		switch (mouseoverStream){
		case "Search":		  
			  document.getElementById('stream_description_label').innerHTML='<i class="icon-search"></i> Relevant Tweets matching a specified Search Keyword.';	   	 
		  	  break;
		case "Home": 
			  document.getElementById('stream_description_label').innerHTML='<i class="icon-home"></i> Tweets and retweets of user and followers.';
		      break;
		case "Mentions": 
			  document.getElementById('stream_description_label').innerHTML='<img src="../img/socialsuite/mentions.png" style="width: 15px;height: 15px;"> Mentions (all tweets containing a users\'s @screen_name).';
		      break;
		case "Retweets": 
			  document.getElementById('stream_description_label').innerHTML='<i class="icon-retweet"></i> User\'s tweets retweeted by others.';
			  break;
		case "DM_Inbox": 
			  document.getElementById('stream_description_label').innerHTML='<i class="icon-download-alt"></i> Direct messages sent to the user.';
			  break;
		case "DM_Outbox": 
			  document.getElementById('stream_description_label').innerHTML='<i class="icon-upload-alt"></i> Direct messages sent by the user.';
			  break;
		case "Favorites": 
			  document.getElementById('stream_description_label').innerHTML='<i class="icon-star"></i> User\'s favorite tweets.';
			  break;
		case "Sent": 
			  document.getElementById('stream_description_label').innerHTML='<i class="icon-share-alt"></i> Tweets sent by the user.';
			  break;
		case "Scheduled": 
			  document.getElementById('stream_description_label').innerHTML='<i class="icon-time"></i> Tweets scheduled for sending later.';
			  break;
		case "All_Updates": 
			  document.getElementById('stream_description_label').innerHTML='<i class="icon-home"></i> Updates and shares from user\'s connections and groups.';	   	  
		  	  break;
		case "My_Updates": 
			  document.getElementById('stream_description_label').innerHTML='<i class="icon-share-alt"></i> Updates authored by the user.';
		      break;
		}//switch end	
	 });

	/**
	 * Remove description of stream on mouse out and from bottom of form.
	 */
	$(document).on("mouseout",".stream-type", function(e)
	  {
		// Removes bg color.
		$(this).css('background-color', '');
		
		// To hide stream type description.
		document.getElementById("stream_description_label").className = 'description-hidden txt-mute';
	  });

	/**
	 * Fetchs data from popup stream add form and save stream as well as add to the collection, 
	 * publish register message to the server.
	 */
	$(".save-twitter-stream").die().live("click", function(e)
	{	
		// Check add-stream button is not enable
		if($('#addStreamModal').find('#add_twitter_stream').attr('disabled'))
	 		return;
			
		// Check if Oauth is done.
		if($('#twitter_account').val() == null || $('#twitter_account').val() == '')
			{		  		
			  alert("You have to give access to your social account.");
			  $("#add-stream").click();
			  return;
			}	
		
		// Check if stream type is not selected.
		if(StreamType == null || StreamType == '')
			{		  		
			  alert("You have to select your favorite stream type.");
			  return;
			}
		
		// Check if the form is valid
		if (!isValidForm('#streamDetail')) 
		{
		    $('#streamDetail').find("input").focus();
		    return false;
		}
				
		// Disables add button to prevent multiple add on click event issues
	    $('#addStreamModal').find('#add_twitter_stream').attr('disabled', 'disabled');
	    
	    // Show notification for adding stream.
	    showNotyPopUp('information', "Adding Stream...", "top", 2500);
		
		// Get data from form elements
		var formData = jQuery(streamDetail).serializeArray();	
	    var json = {};
	    
	    // Convert into JSON
	    jQuery.each(formData, function() {
	        json[this.name] = this.value || '';
	    });     
	    
	    // Add collection's column index in stream.
	    json["column_index"] = StreamsListView.collection.length + 1;
	    
	    // Create new stream
	    var newStream = new Backbone.Model();
		newStream.url = '/core/social';
		newStream.save(json, {
			success : function(stream) {
						
				// Close form
				//$('#addStreamModal').modal('hide');	
				
				// Append in collection,add new stream 			
				socialsuitecall.streams(stream);
				
				// Scroll down the page till end, so user can see newly added stream.
				$("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
				
				// Register on server
				var publishJSON = {"message_type":"register", "stream":stream.toJSON()};
				sendMessage(publishJSON);	
				
				// Get recent stream from database, suppose we add directly this stream so it will create reference 
				// and data replicated in both.
	     		$.getJSON("/core/social/getstream/" + stream.id,function(data)
	     		   		  {
	     					console.log("data after fetching streams from db");
	     		   		    console.log(data);
	     		   		    
	     		   		    if(data != null)
	     		   		    	{	 		      
	     		   		           TempStreamsListView.collection.add(data);
	     		   		    	} // client json if end
	     		   		    
	     		   		    // Notification for stream added.
	     		   		    showNotyPopUp('information', "Stream added. You can add another Stream now.", "top", 4000);
	     		   		    
	     		   		    setTimeout(function ()
	     		   			  {
	     		   		        // Find selected stream id.
		     		   		    var idOfStreamType = $('#addStreamModal').find("div[value='"+StreamType+"']").attr('id');
		     		   		    $("#"+idOfStreamType).click();
		     		   		    
		     		   		    // Make send button enable
		     		   		    $('#addStreamModal').find('#add_twitter_stream').removeAttr('disabled');
		     		   		    
		     		   		    StreamType="";
	     		   			  }, 4000);    		   		    
	     		   			     		   		
	     		   	      }).error(function(jqXHR, textStatus, errorThrown) { alert("error occurred!"); });	
				},
		error : function(data){console.log(data);},
		});	
	});

	/**
	 * Gets stream, Delete it from collection and dB and publish unregister stream.
	 */
	$(".stream-delete").die().live("click", function(e)
	{		
		if(!confirm("Are you sure you want to delete?"))
			return;
			
		var id = $(this).attr('id');
			
		// Fetch stream from collection
		var stream = StreamsListView.collection.get(id).toJSON();
		
		// Stream size is too big, can not handle by pubnub so remove list of tweet.
		delete stream.tweetListView;	
		
		// Unregister on server
		var publishJSON = {"message_type":"unregister", "stream":stream};
		sendMessage(publishJSON);
		
		// Delete stream from collection and DB
		StreamsListView.collection.get(id).destroy();	
	});

	/**
	 * Get relation and perform action as per that.
	 */
	$(".action-notify").die().live("click", function(e)
	{	
		// Get relation for action.
		var relation = $(this).attr('rel');
		
		// Get stream id.
	    var streamId = $(this).attr('data');

	    // Remove notification of new tweets on stream.
	    document.getElementById(this.id).innerHTML= '';
	    
		if(relation == "add-new-tweet")
			mergeCollections(streamId);
		else if(relation == "retry")
		    registerStreamAgain(streamId);
		
		// Remove relation from <div> for notification.
		$(this).attr("rel",'');
		
		// Remove deleted tweet element from ui
		$('.deleted').remove();
	 });	
	
	/**
	 * Get scheduled updates of current domain user.
	 */
	$("#show_scheduled_updates").die().live("click", function(e)
	{
	  // Toggle dropdown with slow speed.
	  $('.scheduled-updates-list').toggle();
	  	  
	  var display = $('.scheduled-updates-list').css("display");	
	  
	  // If open then only fetch DB.
	  if (display == 'block')
		getScheduledUpdate();
	});		
	
	$('.scheduled-updates-list').die().live("mouseleave", function(e)
	 {
	  // Hide dropdown.
	  //$("#show_scheduled_updates").click();
	 });
}

