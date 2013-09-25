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
 * Get stream name from selected option in list of streams.
 */
$(document).on("click",".streamtype", function(e)
		{	
	      StreamType = $(this).val().trim();		  
	      NetworkType = $(this).attr("network-type").trim(); 
	      alert(StreamType+" "+NetworkType);
		});

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
$(document).on("click",".add-social-stream", function(e)
{		
	alert("selected netwoek type is : "+NetworkType);
	
	if(NetworkType == "linkedin")
	   {
		 // Show confirmation modal
		 $('#linkedinConfirmationModal').modal('show');		 
		 setupSocialSuiteLinkedinOAuth();
	   }
	
	if(NetworkType == "twitter")
	   {
		 // Reset all fields
		 $('#streamDetail').each(function() {
		 this.reset();});
	
		 // Remove keyword input element
		 $('.remove-keyword').remove();
	
		 // Enable button of add stream on form of stream detail
		 $('#addStreamModal').find('#add-twitter-stream').removeAttr('disabled');
	
		 // Fill elements on form related to stream.
		 fillStreamDetail();	

		 // Show form modal
		 $('#addStreamModal').modal('show');
	   }		
});// AddSocialStream end

/**
 * Fetchs data from popup stream add form and save stream as well as add to the collection, 
 * publish register message to the server.
 */
$(document).on("click",".save-twitter-stream", function(e)
{	
	// Check add-stream button is not enable
	 if($('#addStreamModal').find('#add-twitter-stream').attr('disabled'))
 		return;
	
	// Check if the form is valid
	if (!isValidForm('#streamDetail')) {
		$('#streamDetail').find("input").focus();
		return false;
	}
	
	// Disables add button to prevent multiple add on click event issues
    $('#addStreamModal').find('#add-twitter-stream').attr('disabled', 'disabled');
	
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