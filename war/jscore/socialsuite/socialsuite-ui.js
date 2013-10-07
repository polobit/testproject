/** on load of social suites page. */
(function()
	  {
		 console.log("In social-ui.js");
		 
		 // Default values
		 pubnub = null;	   
		 StreamType = null;	
		 NetworkType = null;
		 registerAllDone = false;	
		 var TweetOwnerForAddContact = null;
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

/** After Oauth, display profile image and screen name on form to show Oauth is done.*/
function loadImage() 
{	
	console.log("farah");
	// Hide Link and warning.
	$("#oauth_link").hide();	
	$("#twitter_warning").hide();	
	
	// profile image and screen name is visible.
	$("#account_description").show();
	
	// Add screen name to label.
	document.getElementById('account_description_label').innerHTML='<b>'+$('#twitter_account').val()+'</b>';
	console.log($('#account_description_label').html());
}

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

	 // Show form modal
	 $('#addStreamModal').modal('show');	
});

/**
 * Get network type from selected option in list of network.
 */
$('#select_network_type').change(function() 
{	
	// Make stream type null.
	StreamType = null;
	
	// Make network type null.
	NetworkType = null;
	
	// Remove keyword input element
	$('.remove-keyword').remove();

	// Oauth required warning and link hidden. 
	$("#oauth_link").hide();	
	$("#twitter_warning").hide();	
	
	// profile image and screen name is hidden.
	$("#account_description").hide();	
	
    // Div where Lists are going to display, is hidden when form open. Make it visible.  
    $("#select_stream").show();	
    
	// Display default description for selection of social network.
	document.getElementById('network_type_description_label').innerHTML='<b><i class="icon-sitemap"></i></b>  You can select your favorite social network type.';

	// Display default description for selection of stream type.
	document.getElementById('stream_description_label').innerHTML='<b><i class="icon-columns"></i></b>  You can select your favorite stream type.';
		
    if($(this).val() == 'TWITTER') 
      {     	
    	// Assign value Twitter to network_type. 
        $("#network_type", $('#addStreamModal')).attr("value",'TWITTER');
        NetworkType = "TWITTER";
        
    	// Display description for Twitter social network.
    	document.getElementById('network_type_description_label').innerHTML='<i class="icon-twitter"></i> With Social Suite\'s Twitter integration, you have all the access to your tweets, listen using Search Streams, as well as monitor Mentions, Direct Messages, Sent Tweets, Favorited Tweets, and more in dedicated streams.';

    	// Dispaly list of Twitter streams.
   	    $('select[for=twitter], #twitter_streams').show();
   	 
   	    // Show default selection.
   	    document.getElementById("twitter_streams").selectedIndex = 0;
   	       	   
        // Display add button to save twitter stream.
        $('#add_twitter_stream').show();
        
        // Hides list of Linkedin streams.
        $('select[for=linkedin], #linkedin_streams').hide();
        
        // Hides add button to save Linkedin stream.
        $('#add_linkedin_stream').hide();    
      } 
    else if($(this).val() == 'LINKEDIN') 
      {
    	// Assign value Linkedin to network_type. 
      	$("#network_type", $('#addStreamModal')).attr("value",'LINKEDIN');
      	NetworkType = "LINKEDIN";
      	
    	// Display description for Linkedin social network.
    	document.getElementById('network_type_description_label').innerHTML='<i class="icon-linkedin"></i> Connect with clients and monitor industry conversations with Social Suite\'s LinkedIn management. Social Suite allows you to post directly to your Linkedin profile.';
    	    	
    	// Dispaly list of Linkedin streams.
      	$('select[for=linkedin], #linkedin_streams').show();
      	
   	    // Show default selection.
   	    document.getElementById("linkedin_streams").selectedIndex = 0;
      	
        // Display add button to save linkedin stream.      	
      	$('#add_linkedin_stream').show();
      	
      	// Setups link to Oauth linked.
        setupSocialSuiteLinkedinOAuth();
        
        // Hides list of Twitter streams.
    	$('select[for=twitter], #twitter_streams').hide();    
    	    	
    	// Hides add button to save Twitter stream.
        $('#add_twitter_stream').hide();
        
        // Empty screen name means Oauth is not done.
    	$("#twitter_account", $('#addStreamModal')).attr("value",'');
      }
    else
    	{
    	  fillStreamDetail();
    	}
});

/**
 * Get stream name from selected option in list of streams.
 */
$('#twitter_streams').change(function() 
{
    // Gets value of selected stream type.	
	StreamType = $(this).val();
	
	// Assign stream type to stream type input.
	$("#stream_type", $('#addStreamModal')).attr("value",StreamType);
	
	if($('#twitter_account').val() == null || $('#twitter_account').val() == '')
	 {
    	// Shows link for Oauth.        
        $("#oauth_link").show();	 
	 }
        
	// Hides twitter warning.
	$("#twitter_warning").hide();	
	
	// Remove keyword input element
	$('.remove-keyword').remove();
	 
	switch (StreamType){
	case "Search":		  
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-search"></i> Relevant Tweets matching a specified query.';
	   	  document.getElementById('search_stream_keyword').innerHTML='<div class="remove-keyword"><label class="control-label">Keyword <span class="field_req">*</span></label><div class="controls"><input id="keyword" name="keyword" type="text" class="required" required="required" value="" autocapitalize="off"></div></div>';
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
	default :
		  // Display default description for selection of stream type.
		  document.getElementById('stream_description_label').innerHTML='<b><i class="icon-columns"></i></b>  You can select your favorite stream type.'; 
		  break;	
	}//switch end
});

$('#linkedin_streams').change(function() 
{
	// Gets value of selected stream type.	
	StreamType = $(this).val();
	
	// Assign stream type to stream type input.
	$("#stream_type", $('#addStreamModal')).attr("value",StreamType);   
	
	switch (StreamType){
	case "All_Updates": 
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-home"></i> Updates and shares from authenticated user\'s connections and groups.';	   	  
	  	  break;
	case "My_Updates": 
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-share-alt"></i> Updates authored by the authenticating user.';
	      break;
	case "Scheduled": 
		  document.getElementById('stream_description_label').innerHTML='<i class="icon-calendar"></i> Updates user want to sent in future time.';
	      break;
	default :
		  // Display default description for selection of stream type.
		  document.getElementById('stream_description_label').innerHTML='<b><i class="icon-columns"></i></b>  You can select your favorite stream type.'; 
		  break;
	}//switch end
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
	
	// Check if network type is not selected.
	if(NetworkType == null || NetworkType == '' || NetworkType == "NONE")
	{
	  // Display warning.
	  $("#oauth_link").hide();	  
	  $("#twitter_warning").show();	  
		
	  // Add description of warning.
      document.getElementById('twitter_warning').innerHTML='Please, Select your favorite social network.';
	  return false;
	}
	
	// Check if stream type is not selected.
	if(StreamType == null || StreamType == '' || StreamType == "NONE")
		{
		  // Display warning.		
		  $("#oauth_link").hide();	  
		  $("#twitter_warning").show();
		
		  // Add description of warning.
	      document.getElementById('twitter_warning').innerHTML='Please, Select your favorite stream.';
		  return false;
		}
	 
	// Check if the Oauth is done.			
	var screen_name = null;	
	screen_name = $("[name='screen_name']").val();	
	if(screen_name == '' || screen_name == null)
	  {
   	    // Display warning.		
		$("#oauth_link").show();	  
		$("#twitter_warning").show();
		
		// Add description of warning.
	    document.getElementById('twitter_warning').innerHTML='Please, Allow access for your account.';
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