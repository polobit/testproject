/** on load of social suites page. */
(function()
	  {
		 console.log("In social-ui.js");
		 
		 // Default values
		 pubnub = null;	   
		 StreamType = "Home";	
		 NetworkType = "twitter";
		 registerAllDone = false;		
	  })();

/**
 * Fills name with twitter's owner in add-contact popup form. 
 */
$(document).on("click",".add-twitter-contact", function(e)
{
	var fullName = $(this).attr("data-user-name");
	console.log(fullName);
	
	var firstName = fullName.substr(0,fullName.indexOf(' '));
	var lastName = fullName.substr(fullName.indexOf(' ')+1);;	
	
	$("#fname", $('#personModal')).attr("value",firstName);
	$("#lname", $('#personModal')).attr("value",lastName);
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

	 // Remove keyword input element
	 $('.remove-keyword').remove();

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
$('#select_network_type').change(function() {
    if($(this).val() == 'TWITTER') 
      {
    	StreamType = "Home";	
    	document.getElementById('stream_description_label').innerHTML='<i class="icon-home"></i> Tweets and retweets posted by the authenticating user and the users they follow.';
    	document.getElementById("twitter_streams").selectedIndex = 0;
    	// Remove keyword input element
   	    $('.remove-keyword').remove();
    	$('select[for=twitter], #twitter_streams').show();        
        $("#network_type", $('#addStreamModal')).attr("value",'TWITTER');
        $('#access_to_twitter').show();
        $('#add_twitter_stream').show();       
        $('select[for=linkedin], #linkedin_streams').hide();
        $('#add_linkedin_stream').hide();
      } 
    else 
      {
    	// Remove keyword input element
   	    $('.remove-keyword').remove();
    	StreamType = "All_Updates";	
    	document.getElementById("linkedin_streams").selectedIndex = 0;
    	document.getElementById('stream_description_label').innerHTML='<i class="icon-home"></i> Updates and shares from authenticated user\'s connections and groups.';
    	$('select[for=linkedin], #linkedin_streams').show();
        $('#add_linkedin_stream').show();
        setupSocialSuiteLinkedinOAuth();
    	$('select[for=twitter], #twitter_streams').hide();    
    	$("#network_type", $('#addStreamModal')).attr("value",'LINKEDIN');
    	$('#access_to_twitter').hide();
        $('#add_twitter_stream').hide();
        $("#twitter_warning").hide();
      }
});

/**
 * Get stream name from selected option in list of streams.
 */
$('#twitter_streams').change(function() {
	StreamType = $(this).val();
	$("#stream_type", $('#addStreamModal')).attr("value",StreamType);
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
	}//switch end
});

$('#linkedin_streams').change(function() {
	StreamType = $(this).val();
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
	
	// Check if the Oauth is done.			
	var screen_name = null;	
	screen_name = $("[name='screen_name']").val();	
	if(screen_name == '' || screen_name == null)
	  {
		$("#twitter_warning").show();
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