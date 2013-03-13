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
    LINKEDIN_PLUGIN_HEADER = '<div></div>';

    // LinkedIn profile load image declared as global
    LINKEDIN_PROFILE_LOAD_IMAGE = '<center><img id="linkedin_profile_load" ' + 
			'src=\"img/1-0.gif\" style="margin-bottom: 10px;margin-right: 16px;" >' + 
	        '</img></center>';   
    
    // LinkedIn update loading image declared as global
    LINKEDIN_UPDATE_LOAD_IMAGE = '<center><img id="status_load" src=' +
        '\"img/ajax-loader-cursor.gif\" style="margin-top: 14px;"></img></center>';
    
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

    // Gets Contact Preferences for this widget, based on plugin name 
    var linkedin_id = agile_crm_get_widget_property_from_contact(LINKEDIN_PLUGIN_NAME);

    //Get website URL for LinkedIn from contact to get profile based on it
    var web_url = agile_crm_get_contact_property_by_subtype('website', 'LINKED_IN');
    
    // If property with LinkedIn (LinkedIn ID) exist
    if (linkedin_id)
    {
        // Shows contact's linkedIn profile
        showLinkedinProfile(linkedin_id, plugin_id);
    }
    else
    {
        //If LinkedIn URL exists for contact,
        if (web_url)
        {
            // Get LinkedIn id from URL and show profile
            getLinkedinIdByUrl(plugin_id, web_url, function (data)
            {
                linkedin_id = data;
                showLinkedinProfile(linkedin_id, plugin_id);
            });
        }
        else
        {
            // Shows all the matches in linkedin for the contact 
            showLinkedinMatchingProfiles(plugin_id);
        }
    }

    // Deletes LinkedIn  profile on click of delete button in template
    $('#Linkedin_plugin_delete').die().live('click', function (event)
    {
        event.preventDefault();
        
        // Gets Contact Preferences for this widget, based on plugin name 
        var linked_id = agile_crm_get_widget_property_from_contact(LINKEDIN_PLUGIN_NAME);
        
        if(linked_id)
        {
        	 //If URL not exists remove LinkedIn Id saved for contact
            agile_crm_delete_widget_property_from_contact(LINKEDIN_PLUGIN_NAME);
        }
        else
        {
	        //If exists remove the URL from the contact to delete profile
	        if (web_url)
	        {
	            agile_crm_delete_contact_property_by_subtype('website', 'LINKED_IN', web_url);	            
	        }
        }
       
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
    $('#Linkedin').html("<div style='padding: 0px 5px 7px 5px;line-height: 160%;' >" + 
    		"Build and engage with your professional network. Access knowledge, " + 
    		"insights and opportunities.<button class='btn' style='margin-top: 7px;'>" +
    		"<a href='" + url + "'>Link Your LinkedIn</button></div>");
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
    $('#Linkedin').html(LINKEDIN_PROFILE_LOAD_IMAGE);

    /*
     *  Fetches matching profiles from LinkedIn based on widget preferences, and uses 
     *  call back function to get template and view matches
     */
    getLinkedinMatchingProlfiles(plugin_id, function (data)
    {
        var el = LINKEDIN_PLUGIN_HEADER;

        // If no matches found display message
        if (data.length == 0)
        {
            $('#Linkedin').html("<div style='padding: 0px 5px 7px 5px;line-height:160%;'>" + 
    				"No Matches Found</div>");
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
            el = el.concat(getTemplate("linkedin-search-result", value));

        });

        // Show matching profiles in LinkedIn panel
        $('#Linkedin').html(el);
        
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
                
                // If id (LinkedIn id) is defined, shows modal and prompts user to save 
                // picture to contact
                if (id)
                {
                    // Creates a modal element which is to be appended to content to show
                    var modal = $('<div id="linkedin-image-save-modal" class="modal fade in" >' +
                        '<div class="modal-header" >' +
                        '<a href="#" data-dismiss="modal" class="close">&times;</a>' +
                        '<h3>Add Image</h3></div>' +
                        '<div class="modal-body" >' +
                        '<p>You are about to add Image to contact</p>' +
                        '<p>Do you want to proceed?</p></div>' +
                        '<div class="modal-footer" >' +
                        '<a href="#" id="save_linkedin_image" class="btn btn-primary">Yes' +
                        '</a><a href="#" class="btn close" data-dismiss="modal" >No</a>' +
                        '</div></div>');

                    // Checks if modal is already added to content
                    if ($('#linkedin-image-save-modal').size() == 0)
                    {
                        // If not added, appends modal element again
                        $('#content').append(modal);
                    }

                    // If added call show on modal and ask for confirmation about 
                    // adding image to contact
                    $('#linkedin-image-save-modal').modal('show');

                    // Save LinkedInId of selected profile to contact with name LinkedIn
                    agile_crm_save_widget_property_to_contact(LINKEDIN_PLUGIN_NAME, id);

                    // Shows Selected profile in the LinkedIn block
                    showLinkedinProfile(id, plugin_id)
                }
            });

            // On click of yes on modal, image is saved as contact image
            $('#save_linkedin_image').die().live('click', function (e)
            {
                e.preventDefault();
                agile_crm_update_contact("image", linkedin_image);

                // Hides modal after confirmation
                $('#linkedin-image-save-modal').modal('hide');

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
    $('#Linkedin').html(LINKEDIN_PROFILE_LOAD_IMAGE);

    //Stores connected status of agile user with contact LinkedIn profile
    var linkedin_connected;

    // Stores the initial update stream of the contact's LinkedIn profile
    var stream_data;
    
    // Calls WidgetsAPI class to get LinkedIn profile of contact
    $.getJSON("/core/api/widgets/profile/" + plugin_id + "/" + linkedin_id,

    function (data)
    {
        //shows delete button in the LinkedIn panel
        $('#Linkedin_plugin_delete').show();

        // Sets the LinkedIn name of the profile to the global variable
        Linkedin_current_profile_user_name = data.name;

        // Sets the LinkedIn connected status to the local variable
        linkedin_connected = data.is_connected;

        // If picture is not available to user then show default picture
        if (data.picture == null)
        {
            data.picture = 'https://contactuswidget.appspot.com/images/pic.png';
        }

        // Gets LinkedIn profile template and populate the fields with details
        $('#Linkedin').html(getTemplate("linkedin-profile", data));
        
        // If updates are available, show recent updates in LinkedIn profile
        if (data.updateStream && data.updateStream.length != 0)
        {
        	// Current update heading, refresh button is shown
            $('#linkedin_update_heading').show();
            $('#linkedin_refresh_stream').show();
            
            // Sets the update stream into a local variable for this method
            stream_data = data.updateStream;
            
            // Template is populated with update details and shown
            $('#linkedin_social_stream')
            	.append(getTemplate("linkedin-update-stream", data.updateStream));        
           
            return;
        }

        // If no updates are available, current update is shown if present
        if (data.current_update)
        {
        	// Current update heading and current update is shown
            $('#linkedin_update_heading').show();
            $('#linkedin_current_activity', $('#Linkedin')).show();
        }

    }).error(function (data)
    {
    	// Remove loading image on error 
    	$('#linkedin_profile_load').remove();
    	
    	// Shows error message if error occurs
        alert(data.responseText);
    });

    // On click of see more link, more updates are retrieved
    $('.linkedin_stream').die().live('click', function (e)
    {
        e.preventDefault();

        // Time of the last update is retrieved to get old updates before that time
        var end_time = $('div#linkedin_social_stream')
        		.find('div#linkedin_status:last').attr('update_time');

        // It is undefined in case if person does not share his updates
        if (!end_time)
        {
            // Checks if person is already connected in LinkedIn to agile user
            if (linkedin_connected)
            {
                alert("This person does not share his/her updates");
                return;
            }

            // If not connected, advice user to connect to see updates
            alert("Member does not share his/her updates. Get connected");
            return;
        }

        // Loading image is shown until the updates are retrieved 
        $("#linkedin_social_stream").append(LINKEDIN_UPDATE_LOAD_IMAGE);

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
            $('#status_load').remove();

            // See more link activated to get more updates
            $(that).addClass('linkedin_stream');
            
            // If no more updates available, less and refresh buttons are shown
            if (data.length == 0)
            {
                alert("No more updates available");
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

            // Current activity is hidden and refresh button is shown
            $('#linkedin_current_activity').hide();
            $('#linkedin_refresh_stream').show();

        }).error(function (data)
        {
            // Removes loading button if error occurs
            $('#status_load').remove();

            // Activates see more button 
            $(that).addClass('linkedin_stream');

            // Error message is shown to the user
            alert(data.responseText);
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

            // If no updates are available for person return
            if (data.length == 0)
            {
                return;
            }

            // See more,refresh  buttons are shown and less is hidden
            $("#linkedin_stream").show();
            $('#linkedin_less').hide();
            $('#linkedin_refresh_stream').show();

            // Populates the template with the data 
            $("#linkedin_social_stream").html(getTemplate("linkedin-update-stream", data));

        }).error(function (data)
        {
            // Remove loading button on error
            $('#status_load').remove();            
           
            // Populates the template with the initial update stream on error
            $("#linkedin_social_stream")
            		.html(getTemplate("linkedin-update-stream", stream_data));
            
            // Error message is displayed to user 
            alert(data.responseText);
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
function getLinkedinMatchingProlfiles(plugin_id, callback)
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
        $.getJSON("/core/api/widgets/match/" + plugin_id + "/" + agile_crm_get_contact()['id'],

        function (data)
        {
            // Store social results in cookie of particular contact
            localStorage.setItem('Agile_linkedin_matches_' + contact_id, JSON.stringify(data));

            // Call back to show LinkedIn matching profiles from cookie
            if (callback && typeof (callback) === "function")
            {
                // Execute the callback, passing parameters as necessary
                callback(data);
            }
        }).error(function (data)
        	    {
        	// Remove loading image on error 
        	$('#linkedin_profile_load').remove();
        	
        	// Shows error message if error occurs
            alert(data.responseText);
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
    // Store info in a json, to send it to the modal window when making a connect request
    var json = {};

    // Set headline of modal window as Connect
    json["headline"] = "Connect";

    // Information to be shown in the modal to the user while making request 
    json["info"] = "Sends a connect request to " + Linkedin_current_profile_user_name +
        " on Linkedin from your Linkedin account associated with Agile CRM";

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

        // Sends post request to url "core/api/widgets/connect/" and Calls WidgetsAPI with 
        // plugin id and LinkedIn id as path parameters and form as post data
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
            alert(data.responseText);

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
    json["info"] = "Sends a message to " + Linkedin_current_profile_user_name +
        " on Linkedin from your Linkedin account associated with Agile CRM";

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
            alert(data.responseText);            
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
        alert(data.responseText);

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
    $.post("/core/api/widgets/getidbyurl/" + plugin_id, url_json, function (data)
    {
        // If LinkedIn id is undefined
        if (!data)
        {
            // Shows message that URL is invalid to the user
            alert("URL provided for linkedin is not valid ");

            // Shows LinkedIn matching profiles based on contact name
            showLinkedinMatchingProfiles(plugin_id);

            // Delete the LinkedIn URL associated with contact as it is incorrect
            agile_crm_delete_contact_property_by_subtype('website', 'LINKED_IN', web_url);

            return;
        }

        // If defined, execute the callback function
        if (callback && typeof (callback) === "function")
        {
            callback(data);
        }

    }).error(function (data)
    {
        // Shows error message to the user returned by LinkedIn
        alert("URL provided for linkedin is not valid " + data.responseText);

        // Shows LinkedIn matching profiles based on contact name
        showLinkedinMatchingProfiles(plugin_id);

        // Delete the LinkedIn URL associated with contact as it is incorrect
        agile_crm_delete_contact_property_by_subtype('website', 'LINKED_IN', web_url);

    });
}