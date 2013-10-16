var Errorjson = {};

function getSocialSuiteLinkedInNetworkUpdates(stream)
{
	alert("In getSocialSuiteLinkedInNetworkUpdates");
	console.log("In getSocialSuiteLinkedInNetworkUpdates : "+ stream.id);
	  // LinkedIn update loading image declared as global
    LINKEDIN_UPDATE_LOAD_IMAGE = '<div id="status_load" class="status-load"><center><img  src=\"img/ajax-loader-cursor.gif\" ' + 
    		'style="margin-top: 10px;margin-bottom: 14px;"></img></center></div>';
  
	 // Loading button is displayed until updates are shown
    $("#"+stream.id+" .chirp-container").html(LINKEDIN_UPDATE_LOAD_IMAGE);

    // Calls WidgetsAPI class to get the updates based on plugin id
    $.getJSON("/core/social/updates/" + stream.id,
    function (linkedinUpdates)
    {
    	console.log("After get update.");
        // Remove loading button on success
        $("#"+stream.id+" .status-load").remove();

        if (linkedinUpdates && linkedinUpdates.length != 0)
        {
	        console.log(linkedinUpdates);
	       
	        //Get stream
	        $.each(linkedinUpdates, function(i, linkedinUpdate)
	     	  {	  		       
	        	console.log(linkedinUpdate);
	        	
	        	//add type of message
	        	linkedinUpdate["msg_type"] = "Update";
	        	linkedinUpdate["stream_id"] = stream.id;
	        	
	        	//Get stream from collection.
	        	  var modelStream = StreamsListView.collection.get(stream.id);	 
	        	  console.log(modelStream);
	        	  
	        	  if(modelStream != null || modelStream != undefined)
	        		{		
	        	        console.log("for add "+modelStream.get('tweetListView').length);
	            			                       
	                	 //Add tweet to stream.
	                	 modelStream.get('tweetListView').add(linkedinUpdate);	
	                		                	   
	                	 //create normal time.
	                	 head.js('lib/jquery.timeago.js', function(){	 
	                		        $(".time-ago", $(".chirp-container")).timeago();	
	                			});           	            
	        		}
	     	  });
        }
    }).error(function (linkedinUpdates)
    {
        // Remove loading button on error
    	$("#"+stream.id+" .status-load").remove();            
       
        Errorjson['message'] = linkedinUpdates.responseText;
        // Error message is displayed to user 
        $("#"+stream.id+" .chirp-container").html(getTemplate('linkedin-error-panel', Errorjson));
    });
}

/**
 * Share an update on linked profile on related stream account of user.
 */
$(document).on("click",".share-update", function(e)
{
	var streamId = $(this).attr("stream-id");
	console.log(this);
	 
	//fetch stream from collection
	var stream = StreamsListView.collection.get(streamId).toJSON();
	
	// Store info in a json, to send it to the modal window when making send tweet request
    var json = {};

    // Set headline of modal window as Send Message
    json["headline"] = "Share an update..";

    // Information to be shown in the modal to the user while sending message 
    json["info"] = "Owner of an update is " + stream.screen_name +
        " on LinkedIn";

    // If modal already exists remove to show a new one
    $('#socialsuite-linkedin_updateModal').remove();

    // Populate the modal template with the above json details in the form
    var update_form_modal = getTemplate("socialsuite-linkedin-update", json);

    // Append the form into the content
    $('#content').append(update_form_modal);

    // Shows the modal after filling with details
    $('#socialsuite-linkedin_updateModal').modal("show");

    // On click of send button in the modal, message request is sent    
    $('#send_linkedin_update').click(function (e)
    {
        e.preventDefault();

        // Checks whether all the input fields are filled
        if (!isValidForm($("#socialsuite-linkedin_updateForm")))
        {
            return;
        }
        
        $("#spinner-modal-linked").show();

        // Sends post request to url "core/api/widgets/message/" and Calls WidgetsAPI with 
        // plugin id and LinkedIn id as path parameters and form as post data
        $.post("/core/social/shareupdate/" + streamId ,
        		$('#socialsuite-linkedin_updateForm').serialize(),

        function (data)
        {
        	 $("#spinner-modal-linked").hide();
        	 
            // On success, shows the status as sent
            $('#socialsuite-linkedin_updateModal').find('span.save-status').html("sent");

            // Hides the modal after 2 seconds after the sent is shown
            setTimeout(function ()
            {
                $('#socialsuite-linkedin_updateModal').modal("hide");
            }, 2000);

        }).error(function (data)
        {        	
        	$("#spinner-modal-linked").hide();
        	 
            // If error occurs while posting modal is removed and error message is shown
            $('#socialsuite-linkedin_updateModal').remove();
            
            // Error message is shown if error occurs
            linkedinError(data.responseText);            
        });
    });
});

function linkedinError(error)
{
	Errorjson['message'] = error;
    
	$('#linkedin-error-panel').html(getTemplate('linkedin-error-panel', Errorjson));
	$('#linkedin-error-panel').show();
	
	// Hides the modal after 2 seconds after the sent is shown
    $('#linkedin-error-panel').fadeOut(10000);
    
}

function statusError(error)
{
	Errorjson['message'] = error;
    
    // Error message is shown to the user
	$('#status-error-panel').html(getTemplate('linkedin-error-panel', Errorjson));
	$('#status-error-panel').show();
	
	// Hides the modal after 2 seconds after the sent is shown
    $('#status-error-panel').fadeOut(10000);
}

function linkedinMainError(error)
{
	Errorjson['message'] = error;
    
	$('#Linkedin').html(getTemplate('linkedin-error-panel', Errorjson));
}