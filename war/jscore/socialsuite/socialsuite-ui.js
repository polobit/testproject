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
	  })();



window.onfocus = function() {
    focused = true;
};
window.onblur = function() {
    focused = false;
};

/**
 * Fills name with twitter's owner in add-contact popup form. 
 */
$(document).on("click",".add-twitter-contact", function(e)
{
	// Tweet owner's full name.
	var fullName = $(this).attr("data-user-name");
		
	// Tweet owner's description.
	var description = $(this).attr("description");
	
	// Tweet owner's handle/Screen name.
	TweetOwnerForAddContact = $(this).attr("tweet-owner");
	
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
$(document).on("click",".stream-type", function(e)
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
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-calendar"></i> Tweets user want to sent in future time.';
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
			
			// Scroll down the page till end, so user can see newly added stream.
			$("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
			
			// Get recent stream from database, suppose we add directly this stream so it will create reference 
			// and data replicated in both.
     		$.getJSON("/core/social/getstream/" + stream.id,function(data)
     		   		  {
     					console.log("data after fetching client from db");
     		   		    console.log(data);
     		   		    
     		   		    if(data != null)
     		   		    	{	 		      
     		   		           TempStreamsListView.collection.add(data);
     		   		    	} // client json if end
     		   	      }).error(function(jqXHR, textStatus, errorThrown) { alert("error occurred!"); });	
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
 * Add tweets from temp collection to original collection and remove notification.
 */
$(document).on("click",".add-new-tweets", function(e)
{	
	// Remove notification of new tweets on stream.
    document.getElementById(this.id).innerHTML= '';
	
    // Get stream id.
    var streamId = $(this).attr('data');
    
    // Get stream from collection.
    var originalStream = StreamsListView.collection.get(streamId);
    var tempStream = TempStreamsListView.collection.get(streamId);
    
    console.log("tempStream: ");console.log(tempStream.get("tweetListView").toJSON());
    console.log("originalStream: ");console.log(originalStream.get("tweetListView").toJSON());
    
    // Get tweet collection from stream.
    var tweetCollection = originalStream.get('tweetListView');
    
    // Add new tweets from temp collection to original collection.
    tweetCollection.add(tempStream.get("tweetListView").toJSON());
    console.log("tempStream: ");console.log(tempStream.get("tweetListView").toJSON());
    console.log("originalStream: ");console.log(originalStream.get("tweetListView").toJSON());
        
    // Sort tweet collection on id. so recent tweet comes on top.
    tweetCollection.sort();    
	   
	// Create normal time.
	head.js('lib/jquery.timeago.js', function(){	 
		        $(".time-ago", $(".chirp-container")).timeago();	
			});
	 
	// Clear temp tweet collection.
	tempStream.get("tweetListView").reset();
	console.log("tempStream: ");console.log(tempStream.get("tweetListView").toJSON());
    console.log("originalStream: ");console.log(originalStream.get("tweetListView").toJSON());
    
});
