/**
 * ===linkedin.js==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party JavaScript API provided. It interacts with the
 * application based on the function provided on agile_widgets.js (Third party
 * API)
 */
$(function ()
{
	// LinkedIn plugin name as global variable
    LINKEDIN_PLUGIN_NAME = "Linkedin";
    
    // LinkedIn update loading image declared as global
    LINKEDIN_UPDATE_LOAD_IMAGE = '<div id="status_load"><center><img  src=\"img/ajax-loader-cursor.gif\" ' + 
    		'style="margin-top: 10px;margin-bottom: 14px;"></img></center></div>';
    
    $('#Linkedin').html(LINKEDIN_UPDATE_LOAD_IMAGE);
    
    Errorjson = {};
    
    // Current contact user name in LinkedIn profile
    Linkedin_current_profile_user_name = "";   

    // Gets plugin id from plugin object, fetched using script API
    var plugin_id = agile_crm_get_plugin(LINKEDIN_PLUGIN_NAME).id;

    // Gets Plugin Preferences to check whether to show setup or matching profiles
    var plugin_prefs = agile_crm_get_plugin_prefs(LINKEDIN_PLUGIN_NAME);

    // If not found, considering first time usage of widget, setupLinkedinOAuth called
    if (plugin_prefs == undefined)
    {
        setupLinkedinOAuth(plugin_id);
        return;
    }

    // Global linkedin id
    var linkedin_id = "";

    //Get website URL for LinkedIn from contact to get profile based on it
    var web_url = agile_crm_get_contact_property_by_subtype('website', 'LINKEDIN');
    
    if (web_url)
    {
    	 // Get LinkedIn id from URL and show profile
        getLinkedinIdByUrl(plugin_id, web_url, function (data)
        {
            linkedin_id = data;
            console.log('id from url' + linkedin_id);
            
            showLinkedinProfile(linkedin_id, plugin_id);
        });
    }
    else
    {
        // Shows all the matches in linkedin for the contact 
        showLinkedinMatchingProfiles(plugin_id);
    }
   

    // Deletes LinkedIn  profile on click of delete button in template
    $('#Linkedin_plugin_delete').die().live('click', function (event)
    {
        event.preventDefault();
        
       agile_crm_delete_contact_property_by_subtype('website', 'LINKEDIN', web_url);	            
       
    });

    //Sends a message to LinkedIn when clicked on send message button
    $('#linkedin_message').die().live('click', function (e)
    {
        e.preventDefault();
        sendLinkedInMessage(plugin_id, linkedin_id);
    });

    //Sends an connect request to LinkedIn when clicked on connect button
    $('#linkedin_connect').die().live('click', function (e)
    {
        e.preventDefault();
        sendLinkedInAddRequest(plugin_id, linkedin_id);
    });

    //ReShares a post in LinkedIn on click of share link
    $('.linkedin_share').die().live('click', function (e)
    {
        e.preventDefault();
        var share_id = $(this).attr("id");
        reSharePost(plugin_id, share_id, "optional", this);
    });
    
    $('#linkedin_experience').die().live('click', function (e)
    {
    	e.preventDefault();
    	getExperienceOfPerson(plugin_id, linkedin_id);
    });

    $('#linkedin_shared_connections').die().live('click', function (e)
    		{
    	e.preventDefault();
    	getLinkedInSharedConnections(plugin_id, linkedin_id);
    });
});

/**
 * Shows setup if user adds LinkedIn widget for the first time. Uses ScribeServlet 
 * to create a client and get preferences and save it to the widget.
 * 
 * @param plugin_id
 * 			To get the widget and save tokens in it.
 */
function setupLinkedinOAuth(plugin_id)
{
    // URL to return, after fetching token and secret key from LinkedIn
    var callbackURL = window.location.href;

    /*
     * Creates a URL, which on click can connect to scribe using parameters sent
     * and returns back to the profile based on return URL provided and saves widget  
     * preferences in widget based on plugin id
     */
    var url = '/scribe?service=linkedin&return_url=' + encodeURIComponent(callbackURL) +
        '&plugin_id=' + encodeURIComponent(plugin_id);

    //Shows a link button in the UI which connects to the above URL
    $('#Linkedin').html("<div class='widget_content' style='border-bottom:none;line-height: 160%;' >" + 
    		"Build professional relationships with contacts and keep a tab on " +  
    		"their business interests.<p style='margin: 10px 0px 5px 0px;' >" + 
    		"<button class='btn' ><a href='" + url + "' style='text-decoration: none;'>" + 
    		"Link Your LinkedIn</a></p></button></div>");
}

/**
 * Fetches matching profiles from LinkedIn based on PluginID and current contact first
 * name and last name
 * 
 * @param plugin_id :
 *            To get the widget and access tokens saved in it.
 */
function showLinkedinMatchingProfiles(plugin_id)
{
    // Shows loading image, until matches profiles are fetched
    $('#Linkedin').html(LINKEDIN_UPDATE_LOAD_IMAGE);

    /*
     *  Fetches matching profiles from LinkedIn based on widget preferences, and uses 
     *  call back function to get template and view matches
     */
    getLinkedinMatchingProfiles(plugin_id, function (data)
    {
        // If no matches found display message
        if (data.length == 0)
        {
        	linkedinMainError("No Matches Found");
            return;
        }

        // Show matching profiles in LinkedIn panel
        $('#Linkedin').html(getTemplate("linkedin-search-result", data));
        
        // Displays LinkedIn profile details on mouse hover and saves profile on click
        $(".linkedinImage").die().live('mouseover', function ()
        {
            // Unique LinkedIn Id from widget 
            var id = $(this).attr('id');

            //Get image link which can be used to save image for contact
            var linkedin_image = $(this).attr('src');

            // Aligns details to left in the pop over
            $('#' + id).popover(
            {
                placement: 'left'
            });

            // Called show to overcome pop over bug (not showing pop over on mouse hover 
            // for first time)
            $('#' + id).popover('show');

            // on click of any profile, save it to the contact
            $('#' + id).die().live('click', function (e)
            {
                e.preventDefault();

                //Hide pop over after clicking on any picture
                $('#' + id).popover('hide');
                
                console.log('on click in search');
                console.log(id);
                
                var url = $(this).attr('url');
                console.log(url);
                console.log(linkedin_image);
                
                // If id (LinkedIn id) is defined, shows modal and prompts user to save 
                // picture to contact
                if (id)
                {
                	$('#linkedin-image-save-modal').remove();
                	
                    // Creates a modal element which is to be appended to content to show
                    var modal = $(getTemplate('linkedin-profile-add', {}));

                    // Checks if modal is already added to content
                    if ($('#linkedin-image-save-modal').size() == 0)
                    {
                        // If not added, appends modal element again
                        $('#content').append(modal);
                    }

                    // If added call show on modal and ask for confirmation about 
                    // adding image to contact
                    $('#linkedin-image-save-modal').modal('show');

                }
                
                // On click of yes on modal, image is saved as contact image
                $('.save-linkedin-profile').die().live('click', function (e)
                {
                	e.preventDefault();
                	
                	// Hides modal after confirmation
                    $('#linkedin-image-save-modal').modal('hide');
                    
                	if($(this).attr('resp') == "no")
                	{
                		showLinkedinMatchingProfiles(plugin_id);
                		return;
                	}
	                
	                var propertiesArray = [
	                        {"name"  : "image",
	                        "value" : linkedin_image },
	                        {"name"  : "website",
		                     "value" : url,
		                     "subtype" : "LINKEDIN"},
		                        ];
	                
	                if($('#save_linkedin_image').is(':checked'))
	                	agile_crm_update_contact_properties(propertiesArray);
	                else
	                	// save url to contact
		                agile_crm_save_contact_properties_subtype("website", "LINKEDIN", url);
	                
                });
            
            });

        });

    });
}

/**
 * Shows saved LinkedIn profile based on LinkedIn Id and Plugin Id
 * 
 * @param linkedin_id
 * 			Linkedin id to fetch profile from LinkedIn
 * @param plugin_id
 * 			plugin_id to get tokens saved to connect with LinkedIn
 */
function showLinkedinProfile(linkedin_id, plugin_id)
{
    // Shows loading image, until profile is fetched
    $('#Linkedin').html(LINKEDIN_UPDATE_LOAD_IMAGE);

    //Stores connected status of agile user with contact LinkedIn profile
    var linkedin_connected;

    // Stores the initial update stream of the contact's LinkedIn profile
    var stream_data;
    
    // Calls WidgetsAPI class to get LinkedIn profile of contact
    $.get("/core/api/widgets/profile/" + plugin_id + "/" + linkedin_id, 
    function (data)
    {
    	if(!data)
    		return;
    	
        // Sets the LinkedIn name of the profile to the global variable
        Linkedin_current_profile_user_name = data.name;

        // Sets the LinkedIn connected status to the local variable
        linkedin_connected = data.is_connected;

        // If picture is not available to user then show default picture
        if (data.picture == null)
        {
            data.picture = 'https://contactuswidget.appspot.com/images/pic.png';
        }

    	// If contact title is undefined, saves headline of the LinkedIn profile
    	// to the contact title
    	if(!agile_crm_get_contact_property("title"))
    		agile_crm_update_contact("title", data.summary, function(el) 
    		{
    			// Gets LinkedIn profile template and populate the fields with details
    			$('#Linkedin').html(getTemplate("linkedin-profile", data));
    		});
    	else
    	{
    		// Gets LinkedIn profile template and populate the fields with details
            $('#Linkedin').html(getTemplate("linkedin-profile", data));
    	}
        
        
        // If updates are available, show recent updates in LinkedIn profile
        if (data.updateStream && data.updateStream.length != 0)
        {
        	// Current update heading, refresh button is shown
            $('#linkedin_refresh_stream').show();
            
            // Sets the update stream into a local variable for this method
            stream_data = data.updateStream;
            
            // Template is populated with update details and shown
            $('#linkedin_social_stream')
            	.append(getTemplate("linkedin-update-stream", data.updateStream));        
           
            head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
        		$(".time-ago", $('#linkedin_social_stream')).timeago();
        	})
        	
            return;
        }

        $('.linkedin_current_activity',  $('#Linkedin')).show();
        
    },"json").error(function (data)
    {
    	// Remove loading image on error 
    	$('#status_load').remove();
    	
    	// Check if member does not share information for third party applications
    	if(data.responseText == "Invalid member id {private}")
    	{
    		linkedinMainError("Member doesn't share his information for third party applications");
    		return;
    	}
    	
    	// Shows error message if error occurs
    	linkedinMainError(data.responseText);
    	
    });

    // On click of see more link, more updates are retrieved
    $('.linkedin_stream').die().live('click', function (e)
    {
        e.preventDefault();

        // Time of the last update is retrieved to get old updates before that time
        var end_time = $('ul#linkedin_social_stream')
        		.find('li#linkedin_status:last').attr('update_time');
        
        // It is undefined in case if person does not share his updates
        if (!end_time)
        {
            // Checks if person is already connected in LinkedIn to agile user
            if (linkedin_connected)
            {
                statusError("This person does not share his/her updates");
                return;
            }

            // If not connected, advice user to connect to see updates
            statusError("Member does not share his/her updates. Get connected");
            return;
        }

        // Loading image is shown until the updates are retrieved 
       // $("#linkedin_social_stream").append(LINKEDIN_UPDATE_LOAD_IMAGE);
        $('#spinner-status').show();
        
        var that = this;

        // See more link is disabled until the updates are retrieved since there may 
        // be a chance of getting duplicate updates
        $(this).removeClass('twitter_stream');

        // Calls WidgetsAPI class to request for five more updates before the end time
        // The start time is from January 1st 2010
        $.getJSON("/core/api/widgets/updates/more/" + plugin_id + "/" + linkedin_id + 
        		"/0/5/1262304000/" + end_time,

        function (data)
        {
            // Removes loading button after fetching updates
            // $('#status_load').remove();
            $('#spinner-status').hide();

            // See more link activated to get more updates
            $(that).addClass('linkedin_stream');
            
            // If no more updates available, less and refresh buttons are shown
            if (data.length == 0)
            {
                statusError("No more updates available");
                $('#linkedin_refresh_stream').show();

                // If user have overall updates more than 3, less button is shown
                if (stream_data.length > 3)
                {
                    $("#linkedin_stream").hide();
                    $('#linkedin_less').show();
                }
                return;
            }

            // Populate the template with update stream details and show in panel
            $("#linkedin_social_stream").append(getTemplate("linkedin-update-stream", data));

            $(".time-ago", $("#linkedin_social_stream")).timeago();
        	        	
            // Current activity is hidden and refresh button is shown
            $('#linkedin_current_activity').hide();
            $('#linkedin_refresh_stream').show();

        }).error(function (data)
        {
            // Removes loading button if error occurs
            //$('#status_load').remove();
            
            $('#spinner-status').hide();

            // Activates see more button 
            $(that).addClass('linkedin_stream');

            // Error message is shown to the user
            statusError(data.responseText);
        });
    });

    // On click of less button, hides update stream and shows current update by toggling 
    $('#linkedin_less').die().live('click', function (e)
    {
        e.preventDefault();

        // For the first time less attribute is false and will not enter if        
        if ($(this).attr("less") == "true")
        {
            // On click of see more, less attribute is made false and text on link is changed 
            // as see less and shows all the updates by toggling
            $(this).attr("less", "false");
            $(this).text("See Less..");
            $('#linkedin_current_activity').hide();
            $('#linkedin_refresh_stream').show();
            return;
        }

        // On first click of see less, less attribute is made true and text will be changed as 
        // see more button 
        $(this).attr("less", "true");
        $(this).text("See More..");
        $('#linkedin_current_activity').show();
        $('#linkedin_refresh_stream').hide();
    });

    // On click of refresh icon in the LinkedIn panel, all the new updates are shown
    $('#linkedin_refresh_stream').die().live('click', function (e)
    {
        e.preventDefault();
    
        // Loading button is displayed until updates are shown
        $("#linkedin_social_stream").html(LINKEDIN_UPDATE_LOAD_IMAGE);

        // Calls WidgetsAPI class to get the updates based on plugin id
        $.getJSON("/core/api/widgets/updates/" + plugin_id + "/" + linkedin_id,

        function (data)
        {
            // Remove loading button on success
            $('#status_load').remove();

            // Populates the template with the data 
            $("#linkedin_social_stream").html(getTemplate("linkedin-update-stream", data));
            
            // If no updates are available for person return
            if (data.length == 0)
            {
            	// See Less is shown and see more is hidden
                $("#linkedin_stream").hide();
                $('#linkedin_less').show();
                return;
            }

            // See more,refresh  buttons are shown and less is hidden
            $("#linkedin_stream").show();
            $('#linkedin_less').hide();
           
        }).error(function (data)
        {
            // Remove loading button on error
            $('#status_load').remove();            
           
            if(stream_data)
            {
            	// Populates the template with the initial update stream on error
            	$("#linkedin_social_stream")
            		.html(getTemplate("linkedin-update-stream", stream_data));
            }
            
            // Error message is displayed to user 
            statusError(data.responseText);
        });
    });
}




/**
 * Fetches LinkedIn matching profiles based on plugin id
 * 
 * @param plugin_id 
 * 			plugin id to fetch widget preferences
 * @param callback 
 * 			callback to create template and show matching profiles
 */
function getLinkedinMatchingProfiles(plugin_id, callback)
{
    // Gets contact id, to save social results of a particular id
    var contact_id = agile_crm_get_contact()['id'];

    // Reads from cookie (local storage HTML5), since widgets are saved using local 
    // storage when matches are fetched for the first time on the contact
    var data = localStorage.getItem('Agile_linkedin_matches_' + contact_id);

    // If cookie is not available, fetches results from LinkedIn
    if (!data)
    {
        // Sends request to url "core/api/widgets/match/" and Calls WidgetsAPI with contact
        // id and plugin id as path parameters
        queueGetRequest("widget_queue", "/core/api/widgets/match/" + plugin_id + "/" + contact_id, 'json', function(data){
            // Store social results in cookie of particular contact
            localStorage.setItem('Agile_linkedin_matches_' + contact_id, JSON.stringify(data));

            // Call back to show LinkedIn matching profiles from cookie
            if (callback && typeof (callback) === "function")
            {
                // Execute the callback, passing parameters as necessary
                callback(data);
            }	
        	
        }, 
        function (data) {
        	// Remove loading image on error 
        	$('#status_load').remove();
        	
        	// Shows error message if error occurs
            linkedinMainError(data.responseText);            
        });

    }
    else
    {
        // Call back to show LinkedIn matching profiles from cookie
        if (callback && typeof (callback) === "function")
        {
            // execute the callback, passing parameters as necessary
            callback(JSON.parse(data));
        }
    }
}

/**
 * Sends a connect request in LinkedIn based on plugin id and LinkedIn Id of the profile 
 * set to the contact
 * 
 * @param plugin_id
 * 			plugin id to fetch widget preferences
 * @param linkedin_id
 * 			LinkedIn Id to send connect request
 */
function sendLinkedInAddRequest(plugin_id, linkedin_id)
{
    // Stores info in a JSON, to send it to the modal window when making a connect request
    var json = {};

    // Set headline of modal window as Connect
    json["headline"] = "Connect";

    // Information to be shown in the modal to the user 
    json["info"] = "Connect to " + Linkedin_current_profile_user_name +
        " on Linkedin";

    // Default message to be sent while sending connect request to LinkedIn
    json["description"] = "I'd like to add you to my professional network on LinkedIn.";

    // If modal already exists remove to show a new one
    $('#linkedin_messageModal').remove();

    // Populate the modal template with the above json details in the form
    var message_form_modal = getTemplate("linkedin-message", json);

    // Append the form into the content
    $('#content').append(message_form_modal);

    // Shows the modal after filling with details
    $('#linkedin_messageModal').modal("show");

    // On click of send button in the modal, connect request is sent
    $('#send_request').click(function (e)
    {
        e.preventDefault();

        // Checks whether all the input fields are filled
        if (!isValidForm($("#linkedin_messageForm")))
        {
            return;
        }

        // Sends post request to url "core/api/widgets/connect/" to call WidgetsAPI 
        // with plugin id and LinkedIn id as path parameters and form as post data
        $.post("/core/api/widgets/connect/" + plugin_id + "/" + linkedin_id, 
        		$('#linkedin_messageForm').serialize(),

        function (data)
        {
            // On success, shows the status as sent
            $('#linkedin_messageModal').find('span.save-status').html("sent");

            // Hides the modal after 2 seconds after the sent is shown
            setTimeout(function ()
            {
                $('#linkedin_messageModal').modal("hide");
            }, 2000);

        }).error(function (data)
        {
            // If error occurs while posting modal is removed and error message is shown
            $('#linkedin_messageModal').remove();
            linkedinError(data.responseText);

        });
    });
}

/**
 * Sends a message to the LinkedIn profile of the contact based on LinkedIn Id of the profile
 * set to the contact
 *  
 *  @param plugin_id
 * 			plugin id to fetch widget preferences
 * @param linkedin_id
 * 			LinkedIn Id to send request
 */
function sendLinkedInMessage(plugin_id, linkedin_id)
{
    // Store info in a json, to send it to the modal window when making send message request
    var json = {};

    // Set headline of modal window as Send Message
    json["headline"] = "Send Message";

    // Information to be shown in the modal to the user while sending message 
    json["info"] = "Send message to " + Linkedin_current_profile_user_name +
        " on LinkedIn";

    // If modal already exists remove to show a new one
    $('#linkedin_messageModal').remove();

    // Populate the modal template with the above json details in the form
    var message_form_modal = getTemplate("linkedin-message", json);

    // Append the form into the content
    $('#content').append(message_form_modal);

    // Shows the modal after filling with details
    $('#linkedin_messageModal').modal("show");

    // On click of send button in the modal, message request is sent    
    $('#send_request').click(function (e)
    {
        e.preventDefault();

        // Checks whether all the input fields are filled
        if (!isValidForm($("#linkedin_messageForm")))
        {
            return;
        }

        // Sends post request to url "core/api/widgets/message/" and Calls WidgetsAPI with 
        // plugin id and LinkedIn id as path parameters and form as post data
        $.post("/core/api/widgets/message/" + plugin_id + "/" + linkedin_id, 
        		$('#linkedin_messageForm').serialize(),

        function (data)
        {
            // On success, shows the status as sent
            $('#linkedin_messageModal').find('span.save-status').html("sent");

            // Hides the modal after 2 seconds after the sent is shown
            setTimeout(function ()
            {
                $('#linkedin_messageModal').modal("hide");
            }, 2000);

        }).error(function (data)
        {
            // If error occurs while posting modal is removed and error message is shown
            $('#linkedin_messageModal').remove();
            
            // Error message is shown if error occurs
            linkedinError(data.responseText);            
        });
    });

}

/**
 * Reshares a post in LinkedIn on click of reshare link of particular share shown in the
 * update stream
 *  
 * @param plugin_id
 * 			plugin id to fetch widget preferences
 * @param share_id
 * 			Id of the share item given by LinkedIn
 * @param message
 * 			Message is optional in LinkedIn while sharing
 * @param element
 * 			Share object which is to be shared
 */
function reSharePost(plugin_id, share_id, message, element)
{
    // Sends get request to url "core/api/widgets/reshare/" and Calls WidgetsAPI with 
    // plugin id, LinkedIn id and message as path parameters
    $.get("/core/api/widgets/reshare/" + plugin_id + "/" + share_id + "/" + message,

    function (data)
    {
        // On success, the color of the reshare is shown green for that instance only
        $(element).css('color', 'green');

        // Text is changed as shared, will be changed to reshare on refresh of profile
        $(element).text('Shared');

    }).error(function (data)
    {
        // Error message is shown when error occurs
    	linkedinError(data.responseText);

    });
}

/**
 * If LinkedIn URL is provided for the contact, gets Linkedin Id of the profile based on 
 * which LinkedIn profile of the contact is retrieved
 *  
 * @param plugin_id
 * 			plugin id to fetch widget preferences
 * @param web_url
 * 			URL provided saved for contact
 * @param callback
 * 			Callback to be executed to get the profile
 */
function getLinkedinIdByUrl(plugin_id, web_url, callback)
{

    // Store url in a json to post it
    var url_json = {};
    url_json['web_url'] = web_url;

    // Sends post request to URL "/core/api/widgets/getidbyurl/" bye sending plugin id 
    // as path parameter and json as post data
    	queuePostRequest("widget_queue", "/core/api/widgets/getidbyurl/" + plugin_id, url_json, function(data){
    		// If LinkedIn id is undefined
    		if (!data)
    		{
    			// Shows message that URL is invalid to the user
    			alert("URL provided for linkedin is not valid ");

    			// Shows LinkedIn matching profiles based on contact name
    			showLinkedinMatchingProfiles(plugin_id);
	
	            // Delete the LinkedIn URL associated with contact as it is incorrect
	            agile_crm_delete_contact_property_by_subtype('website', 'LINKEDIN', web_url);
	
	            return;
		        }
		
		        // If defined, execute the callback function
		        if (callback && typeof (callback) === "function")
		        {
		            callback(data);
		        }
		
		    }, function (data)
		    {
		    	if(data.responseText == "TimeOut")
		    	{
		    		linkedinMainError("Time Out while fetching LinkedIn profile. Reload and try again");
		    		return;
		    	}
		    	
		    	if(data.responseText.indexOf("Public profile URL is not correct") != -1)
		    	{
		    		// Shows error message to the user returned by LinkedIn
			        alert("URL provided for linkedin is not valid " + data.responseText);
			
			        // Delete the LinkedIn URL associated with contact as it is incorrect
			        agile_crm_delete_contact_property_by_subtype('website', 'LINKEDIN', web_url);
			        return;
		    	}
		        
		    	linkedinMainError(data.responseText);
		 });
}

function getExperienceOfPerson(plugin_id, linkedin_id)
{
	
	 $('#linkedin_experience_panel').html(LINKEDIN_UPDATE_LOAD_IMAGE);
	 
	 $.get("/core/api/widgets/experience/" + plugin_id + "/" + linkedin_id, function (data)
     {
		 console.log(data);
		 
		 var e1 = "";
		 
		 if(data.three_current_positions.length == 0 && data.three_past_positions.length == 0)
		 {			 
			 $('#linkedin_experience_panel').html('<div class="widget_content">Work status unavailable</div>');
			 return;
		 }
			 
		 if(data.three_current_positions)
		 {
			 e1 = e1.concat(getTemplate("linkedin-experience", data.three_current_positions));
		 }
		 
		 if(data.three_past_positions)
		 {
			 e1 = e1.concat(getTemplate("linkedin-experience", data.three_past_positions));
		 }
		 
		 $('#linkedin_experience_panel').html(e1);
		 
		 console.log(e1);
		 
     }).error(function(data){
    	// Remove loading image on error 
     	$('#status_load').remove();
     	
     	Errorjson['message'] = data.responseText;
     	$('#linkedin_experience_panel').html(getTemplate('linkedin-error-panel', Errorjson))
     	
    	// alert(data.responseText);
     });
     
}

function getLinkedInSharedConnections(plugin_id, linkedin_id)
{

	 $('#linkedin_shared_panel').html(LINKEDIN_UPDATE_LOAD_IMAGE);
	 
	 $.get("/core/api/widgets/shared/connections/" + plugin_id + "/" + linkedin_id, 
	 function (data)
     {
		 console.log(data);
		 
		 	var el = "<div style='padding:10px'>";

	        // If no matches found display message
	        if (data.length == 0)
	        {
	            $('#linkedin_shared_panel').html("<div style='padding: 10px;line-height:160%;'>" + 
	    				"No shared connections</div>");
	            return;
	        }

	        // If matches found, Iterates through each profile
	        $.each(data, function (key, value)
	        {
	            //If contact picture is null, show default image
	            if (value.picture == null)
	            {
	                value.picture = 'https://contactuswidget.appspot.com/images/pic.png';
	            }

	            // Calls to populate template with the search results
	            el = el.concat(getTemplate("linkedin-shared", value));

	        });

	        el = el + "</div>";
	        
	        $('#linkedin_shared_panel').html(el);
	        
	        // Displays LinkedIn profile details on mouse hover and saves profile on click
	        $(".linkedinSharedImage").die().live('mouseover', function ()
	        {
	          
	            // Aligns details to left in the pop over
	            $(this).popover(
	            {
	                placement: 'left'
	            });

	            // Called show to overcome pop over bug (not showing pop over on mouse hover 
	            // for first time)
	            $(this).popover('show');
	            
	        });
		 
    }).error(function(data){
    	// Remove loading image on error 
    	$('#status_load').remove();
    	
    	Errorjson['message'] = data.responseText;
    	$('#linkedin_shared_panel').html(getTemplate('linkedin-error-panel', Errorjson))
   	 	// alert(data.responseText);
    });
    
}

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