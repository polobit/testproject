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
	  })();

/**
 * Fills name with twitter's owner in add-contact popup form. 
 */
$(document).on("click",".add-twitter-contact", function(e)
{
	// Tweet owner's full name.
	var fullName = $(this).attr("data-user-name");
	console.log(fullName);
	
	// Tweet owner's description.
	var description = $(this).attr("description");
	console.log(description);

	// Tweet owner's handle/Screen name.
	TweetOwnerForAddContact = $(this).attr("tweet-owner");
	console.log(TweetOwnerForAddContact);
	
	// Separate full name.
	var firstName = fullName.substr(0,fullName.indexOf(' '));
	var lastName = fullName.substr(fullName.indexOf(' ')+1);;	
	
	// Add values in add contact form.
	$("#fname", $('#personModal')).attr("value",firstName);
	$("#lname", $('#personModal')).attr("value",lastName);
	$("#job_title", $('#personModal')).attr("value",description);		
});

/**
 * Display popup form with stream details. 
 */
$(document).on("click",".add-stream", function(e)
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
$(document).on("click",".network-type", function(e)
		{ 
	      // User select Twitter.
	      if(this.id == "twitter_option")
	    	  {    
	    	  	/**
	    	  	 * Get network type from selected option of social networks. 
	    	  	 * Icon can not store value attribute so need store on options.
	    	  	 */
	    	  	NetworkType = "TWITTER";	
	    	  	
	    	    // Add button for twitter is shown.
	    		$('#add_twitter_stream').show();
	    			
	    		// Add button for linkedin is hidden.
	    		$('#add_linkedin_stream').hide();
	    			    		
	    	    // Add twitter stream types template.
	    		$("#streamDetails").html(getTemplate('twitter-stream-type'),{});	    		
	    		 
	    	  	// Oauth for twitter.	 
	    	  	openTwitter();
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
$(document).on("click",".stream-type", function(e)
		{	
		  e.preventDefault();
	      
		  console.log(this.className);
		  
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
			    	  document.getElementById('search_stream_keyword').innerHTML='<div class="remove-keyword"><input id="keyword" name="keyword" type="text" class="required" required="required" autocapitalize="off" placeholder="Keyword.." value=""></div>';
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
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-search"></i> Relevant Tweets matching a specified query.';	   	 
	  	  break;
	case "Home": 
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-home"></i> Tweets and retweets posted by the authenticating user and the users they follow.';
	      break;
	case "Mentions": 
		  document.getElementById('stream_description_label').innerHTML='<img src="../img/socialsuite/mentions.png" style="width: 15px;height: 15px;"> Mentions (tweets containing a users\'s @screen_name) for the authenticating user.';
	      break;
	case "Retweets": 
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-retweet"></i> Tweets authored by the authenticating user that have been retweeted by others.';
		  break;
	case "DM_Inbox": 
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-download-alt"></i> Direct messages sent to the authenticating user.';
		  break;
	case "DM_Outbox": 
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-upload-alt"></i> Direct messages sent by the authenticating user.';
		  break;
	case "Favorites": 
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-star"></i> Tweets favorited by the authenticating user.';
		  break;
	case "Sent": 
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-share-alt"></i> Tweets authored or retweeted by the authenticating user.';
		  break;
	case "Scheduled": 
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-calendar"></i> Tweets user want to sent in future time.';
		  break;
	case "All_Updates": 
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-home"></i> Updates and shares from authenticated user\'s connections and groups.';	   	  
	  	  break;
	case "My_Updates": 
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-share-alt"></i> Updates authored by the authenticating user.';
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
	
	// Remove description.
	document.getElementById('stream_description_label').innerHTML='  ';
  });

/**
 * Fetchs data from popup stream add form and save stream as well as add to the collection, 
 * publish register message to the server.
 */
$(document).on("click",".save-twitter-stream", function(e)
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
			$('#addStreamModal').modal('hide');	
			
			// Append in collection,add new stream 			
			socialsuitecall.streams(stream);		
			
			// Register on server
			var publishJSON = {"message_type":"register", "stream":stream};
			sendMessage(publishJSON);			
			},
	error : function(data){console.log(data);},
	});	
});

/**
 * Gets stream, Delete it from collection and dB and publish unregister stream.
 */
$(document).on("click",".stream-delete", function(e)
{		
	if(!confirm("Are you sure you want to delete?"))
		return;
		
	var id = $(this).attr('id');
	console.log(id);	
		
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