/*on load of social suites page*/
(function()
	  {
		 console.log("In social-ui.js");
		 pubnub = null;	   
		 StreamType = "Home";	
		 NetworkType = "twitter";
		 registerAllDone = false;		
	  })();

/**
 * Get stream name from selected option
 */
$(document).on("click",".streamtype", function(e)
		{	
	      StreamType = $(this).val().trim();		  
	      NetworkType = $(this).attr("network-type").trim(); 
	      alert(StreamType+" "+NetworkType);
		});

/**
 * Call add-contact form and fill name with twitter's owner. 
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
 * Display form with stream details. 
 */
$(document).on("click",".add-social-stream", function(e)
{		
	alert("selected netwoek type is : "+NetworkType);
	
	if(NetworkType == "linkedin")
	   {
		 //show confirmation modal
		 $('#linkedinConfirmationModal').modal('show');		 
		 setupSocialSuiteLinkedinOAuth();
	   }
	if(NetworkType == "twitter")
	   {
		 //reset all fields
		 $('#streamDetail').each(function() {
		 this.reset();});
	
		 //remove keyword input element
		 $('.remove-keyword').remove();
	
		 //enable button of add stream on form of stream detail
		 $('#addStreamModal').find('#add-twitter-stream').removeAttr('disabled');
	
		 //fill elements on form related to stream.
		 fillStreamDetail();	

		 //show form modal
		 $('#addStreamModal').modal('show');
	   }		
});//addSocialStream end


/**
 * append stream type and keyword to callback url and display confirmation modal.
 */
$(document).on("click",".save-twitter-stream", function(e)
{	
	//check add-stream button is not enable
	 if($('#addStreamModal').find('#add-twitter-stream').attr('disabled'))
 		return;
	
	// Check if the form is valid
	if (!isValidForm('#streamDetail')) {
		$('#streamDetail').find("input").focus();
		return false;
	}
	
	// Disables add button to prevent multiple add on click event issues
    $('#addStreamModal').find('#add-twitter-stream').attr('disabled', 'disabled');
	
	//Get data from form elements
	var formData = jQuery(streamDetail).serializeArray();	
    var json = {};
    
    //convert into JSON
    jQuery.each(formData, function() {
        json[this.name] = this.value || '';
    });     
    
    //add collection's column index in stream.
    json["column_index"] = StreamsListView.collection.length + 1;
    
    //create new stream
    var newStream = new Backbone.Model();
	newStream.url = '/core/social';
	newStream.save(json, {
		success : function(stream) {
					
			//close form
			$('#addStreamModal').modal('hide');	
			
			//append in collection,add new stream 			
			socialsuitecall.streams(stream);		
			
			//register on server
			var publishJSON = {"message_type":"register", "stream":stream};
			sendMessage(publishJSON);			
			},
	error : function(data){console.log(data);},
	});	
});

/**
 * get stream and publish unregister stream.
 */
$(document).on("click",".stream-delete", function(e)
{		
	if(!confirm("Are you sure you want to delete?"))
		return;
		
	var id = $(this).attr('id');
	console.log(id);	
		
	//fetch stream from collection
	var stream = StreamsListView.collection.get(id).toJSON();
	
	//stream size is too big, can not handle by pubnub so remove list of tweet.
	delete stream.tweetListView;	
	
	//unregister on server
	var publishJSON = {"message_type":"unregister", "stream":stream};
	sendMessage(publishJSON);
	
	//delete stream from collection and DB
	StreamsListView.collection.get(id).destroy();	
});