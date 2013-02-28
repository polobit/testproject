/**
 * ===linkedin.js==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party javascript API provided. It interacts with the
 * application based on the function provided on agile_widgets.js (Third party
 * API)
 */
$(function () {
    // Plugin name as a global variable
    LINKEDIN_PLUGIN_NAME = "Linkedin";
    LINKEDIN_PLUGIN_HEADER = '<div></div>';
    
    Linkedin_current_profile_user_name = "";
    // Gets plugin id from plugin object, fetched using script API
    var plugin_id = agile_crm_get_plugin(LINKEDIN_PLUGIN_NAME).id;
    // Gets Plugin Prefs, required to check whether to show setup button or matching profiles
    var plugin_prefs = agile_crm_get_plugin_prefs(LINKEDIN_PLUGIN_NAME);
    // If not found - considering first time usage of widget, setupLinkedinOAuth
    // called
    if (plugin_prefs == undefined) {
        setupLinkedinOAuth(plugin_id);
        return;
    }
    // Gets Contact Preferences for this widget, based on plugin name (using
    // Third party script API)
    var linkedin_id = agile_crm_get_widget_property_from_contact(LINKEDIN_PLUGIN_NAME);
    // If property with LinkedIn do not exist, all the matching profiles
    if (!linkedin_id) {
        showLinkedinMatchingProfiles(plugin_id);
        return;
    }
    // Shows contact's linkedIn profile
    showLinkedinProfile(linkedin_id, plugin_id);
    
    // Deletes linkedin profile, when click on elemtn with id "linkedin_plugin_delete", 
    // represents cross mark shown in panel
    $('#Linkedin_plugin_delete').die().live('click', function (event) {
        event.preventDefault();
        agile_crm_delete_widget_property_from_contact(LINKEDIN_PLUGIN_NAME);
    });
    
    //Sends a message to linkedin when clicked on send message button
    $('#linkedin_message').die().live('click', function (e) {
    	e.preventDefault();
    	sendLinkedInMessage(plugin_id, linkedin_id);
    });
    
    //Sends an add request to llinkedin when clicked on connect button
    $('#linkedin_connect').die().live('click', function(e)
    {
    	e.preventDefault();
    	sendLinkedInAddRequest(plugin_id, linkedin_id);
    });
    
    //Reshare a post in linkedin
    $('.linkedin_share').die().live('click', function(e)
    {
    	e.preventDefault();
    	var share_id = $(this).attr("id");
    	reSharePost(plugin_id, share_id,"optional",this);
    });
    

});
/**
 * Shows setup if user adds linkedIn widget for the first time, to set up
 * connection to linkedIn account. uses ScribeServlet to create a client and get
 * prefs
 * 
 * @param plugin_id
 */
function setupLinkedinOAuth(plugin_id) {
    // Url to return, after fetching token and secret key from linkedin
    var callbackURL = window.location.href;
    /*
     * Creates a url for link, which on click can connect using parameters sent,
     * plugin_id : To save plugins in to widgets based on widget id i.e,
     * plugin_id CallbackURL : Specifies which url to return after subscribing
     * i.e, always current URL
     */
    var url = '/scribe?service=linkedin&return_url=' + encodeURIComponent(callbackURL) + '&plugin_id=' + encodeURIComponent(plugin_id);
    // Shows link built (url created above), which hits scribe servlet and
    // fetches token and access keys, and saves in the widget. Button to set up
    // in shown in linkedin widget block
    $('#Linkedin')
        .html(
    LINKEDIN_PLUGIN_HEADER + "<p>Build and engage with your professional network. Access knowledge, insights and opportunities. <p><button class='btn'><a href=" + url + ">Link Your LinkedIn</button>");
}
/**
 * Fetches matching profiles from Linked in based on PluginID and current
 * contact id, uses widget/plugin id to get prefs and details from current
 * contact id to fetch linkedIn matches based on first and last name of the
 * contat
 * 
 * @param plugin_id :
 *            wiget/plugin id needs to be sent in request url along with current
 *            contact id
 */
function showLinkedinMatchingProfiles(plugin_id) {
    // Shows loading, until matches profiles are fetched
    $('#Linkedin').html(
    LINKEDIN_PLUGIN_HEADER + '<img src=\"img/1-0.gif\"></img>');
    // Fetches matching profiles from LinkedIn, and uses call back function to generate view for the profiles
    getLinkedinMatchingProlfiles(plugin_id, function (data) {
        // Widget header
        var el = LINKEDIN_PLUGIN_HEADER;
        // If no matches found display message
        if (data.length == 0) {
            $('#Linkedin').html(el.concat("No Matches Found"));
            return;
        }
        // If matched found, Iterates though each profile
        $.each(data, function (key, value) {

                if (value.picture == null) {
                	value.picture = 'https://contactuswidget.appspot.com/images/pic.png';
                }
                // Calls to populate template and append to element, which 
                // is shown in LinkedIn widget panel
                el = el.concat(getTemplate("linkedin-search-result",
                		value));

        });
        // Show matching profiles in LinkedIn panel
        $('#Linkedin').html(el);
    });
    // Displays to LinkedIn profile details on mouseover and saves on click
    $(".linkedinImage").die().live('mouseover', function () {
        // Id from widget i.e., unique 'id' given by LinkedIn 
        // set in image tag of template
        var id = $(this).attr('id');
        // Gets the image link from the element, so can be used 
        // to save profile pic to pic of contact in CRM
        var linkedin_image = $(this).attr('src');
        // sets prefs to , aligned to left
        $('#' + id).popover({
            placement: 'left'
        });
        // Called show, called shown and popover to overcome 
        // popover bug i.e., not showing popover on mouserover for 
        // first time after loading images
        $('#' + id).popover('show');
        $('#' + id).die().live('click', function (e) {
            e.preventDefault();
            // Hides the popover on clicking on profile picture
            // i.e., to select a matching profile which is to be 
            // added to contact widget_properties
            $('#' + id).popover('hide');
            // If id (LinkedIn id) is defined, shows modal prompting 
            // user to save profile picture
            if (id) {
                // Creates an modal element which is to be appended to content to show
                var modal = $('<div id="linkedin-image-save-modal" class="modal fade in" >' + '<div class="modal-header" ><a href="#" data-dismiss="modal" class="close">&times;</a>' + '<h3>Add Image</h3></div>' + '<div class="modal-body"><p>You are about to add Image to contact</p>' + '<p>Do you want to proceed?</p>' + '</div>' + '<div class="modal-footer"><a href="#" id="save_linkedin_image" class="btn btn-primary">Yes</a>' + '<a  href="#" class="btn close" data-dismiss="modal" >No</a>' + '</div>' + '</div>');
                // Checks if modal html element is already added to content,
                // if added show is call instead of appending modal element again
                if ($('#linkedin-image-save-modal').size() == 0) {
                    $('#content').append(modal);
                }
                // Asks for confirmation about adding image to contact
                // Calls show on the modal
                $('#linkedin-image-save-modal')
                    .modal('show');
                // Calls method from script api, to save LinkedIn details in contact,
                // with property name as name of plugin and id which is given by linkedin 
                agile_crm_save_widget_property_to_contact(LINKEDIN_PLUGIN_NAME, id);
                // Shows Selected profile in the plugin block
                showLinkedinProfile(id, plugin_id)
            }
        });
        // Confirmation for saving image to contact
        $('#save_linkedin_image').die().live('click', function (e) {
            e.preventDefault();
            // On confirmation, contact is update with image from linkedin using script API method
            agile_crm_update_contact("image", linkedin_image);
            // Hides modal
            $('#linkedin-image-save-modal').modal('hide');
        });
    });
}
/**
 * Shows saved LinkedIn profile, in the LinkedIn plugin panel
 * 
 * @param linkedin_id : Linkedin id to fetch profile
 * @param plugin_id	  : plugin_id to get prefs to connect to Linkedin
 */
function showLinkedinProfile(linkedin_id, plugin_id) {
	
    // Shows loading, until profile is fetched
    $('#Linkedin').html(
    LINKEDIN_PLUGIN_HEADER + '<img src=\"img/1-0.gif\"></img>');
    
    var linkedin_connected;
    var update_stream_length;
    
    // Fetches matching profiles
    $.getJSON("/core/api/widgets/profile/" + plugin_id + "/" + linkedin_id,

    function (data) {
    	
    	$('#Linkedin_plugin_delete').show();
    	
    	Linkedin_current_profile_user_name = data.name;
    	linkedin_connected = data.is_connected;
    	
        // If picture is not availabe to user then show default picture
        if (data.picture == null) {
            data.picture = 'https://contactuswidget.appspot.com/images/pic.png';
        }
        
        // Gets Linkedin-profile template and populate the fields using handlebars
        $('#Linkedin').html(getTemplate("linkedin-profile", data));  
               
       if(data.updateStream && data.updateStream.length != 0)
       {    	    
        	$('#linkedin_update_heading').show();
        	$('#linkedin_table').append(getTemplate("linkedin-update-stream", data.updateStream));
        	update_stream_length = data.updateStream.length;
        	return;
        }
        
       	if(data.current_update)
       	{        
       		$('#linkedin_update_heading').show();
       		$('#linkedin_current_activity',$('#Linkedin')).show();
       	}        
        
    });
    
    $('.linkedin_stream').die().live('click', function (e) {
    	e.preventDefault();
    
    	//$("#linkedin_social_stream").html(LOADING_HTML);
    	var end_time = $('#linkedin_table tr').eq(-2).attr('update_time');
    	
    	console.log(end_time);
    	if(!end_time){
    		if(linkedin_connected){
    			
    			alert("This person does not share his/her updates");
    			return;
    		}
    		alert("Member does not share his/her updates. Get connected");
    		return;
    	}    		
    	
    	$.getJSON("/core/api/widgets/updates/more/" + plugin_id + "/" + linkedin_id + "/0/5/1262304000/" + end_time, function(data){
    		if(data.length == 0)
			{    	
    			 alert("No more updates available");    			 
        		 $('#linkedin_refresh_stream').show();
        		 
        		 if(update_stream_length > 3){
        			 $("#linkedin_stream").hide();
        			 $('#linkedin_less').show();
        		 }
				return;
			}
    		
    		 $("#linkedin_table").append(getTemplate("linkedin-update-stream", data));
    		 console.log(data);
    		 
    		 $('#linkedin_current_activity',$('#Linkedin')).hide();
    		 $('#linkedin_refresh_stream').show();
    	}).error(function(data) { 
    		
    		$("#linkedin_table").remove();   		
    		alert(data.responseText); 
    	}); 
    });
    
   $('#linkedin_less').die().live('click', function (e) {
    	e.preventDefault();
    	var data = $(this).text();
    	
    	if($(this).attr("less") == "true"){
    		$(this).attr("less","false");
    		$(this).text("See Less..");
    		$('#linkedin_current_activity',$('#Linkedin')).hide();
    		$('#linkedin_refresh_stream').show();
    		return;
    	}
    	
    	$(this).attr("less","true");
    	$('#linkedin_current_activity',$('#Linkedin')).show();
    	$(this).text("See More..");
    	$('#linkedin_refresh_stream').hide();
    });
   
   
    $('#linkedin_refresh_stream').die().live('click', function (e) {
    	e.preventDefault();
    	$('#linkedin_table').html(LOADING_HTML);
    	$.getJSON("/core/api/widgets/updates/" + plugin_id + "/" + linkedin_id, function(data){
    		
    		if(data.length == 0)
			{    		
				return;
			}
    		
    		$("#linkedin_stream").show();
    		$('#linkedin_less').hide();
    		$('#linkedin_refresh_stream').show();
    		$("#linkedin_table").html(getTemplate("linkedin-update-stream", data));
    		
    	}).error(function(data) {  		
    		
    		alert(data.responseText); 
    	}); 
    });
}



/**
 * Sends request to url "core/api/widget/linkedin/" with contact id and plugin id
 * as path parameters, which fetches matching profiles using widget prefs based on 
 * plugin id and fist name, last name of the contact related to the id sent
 * 
 * @param plugin_id plugin id to fetch prefs
 * @param callback callback to create template and show matching profiles
 */
function getLinkedinMatchingProlfiles(plugin_id, callback) {
    // Gets contact id, to save social results of a particular id
    var contact_id = agile_crm_get_contact()['id'];
    // Reads from cookie (localstorage HTML5), since widgets are saved using localstorage
    // when matches are fetched for the first time on the contact
    var data = localStorage.getItem('Agile_linkedin_matches_' + contact_id);
    // If cookie is not available, fetches results from LinkedIn
    if (!data) {
        $.getJSON("/core/api/widgets/match/" + plugin_id + "/" + agile_crm_get_contact()['id'], function (data) {
            // Saves social results in cookie of particular contact
            localStorage.setItem('Agile_linkedin_matches_' + contact_id, JSON.stringify(data));
            // Call back to show twitter matching profiles from cookie
            if (callback && typeof (callback) === "function") {
                // execute the callback, passing parameters as necessary
                callback(data);
            }
        });
    } else {
        console.log("from cache");
        // Call back to show twitter matching profiles from cookie
        if (callback && typeof (callback) === "function") {
            // execute the callback, passing parameters as necessary
            callback(JSON.parse(data));
        }
    }
}

function sendLinkedInAddRequest(plugin_id, linkedin_id) {
	
	var json = {};
	json["headline"] = "Connect";
	json["info"] = "Sends a connect request to "+ Linkedin_current_profile_user_name +" on Linkedin from your Linkedin account associated with Agile CRM";
	json["description"] = "I'd like to add you to my professional network on LinkedIn.";
	
	$('#linkedin_messageModal').remove();
    var message_form_modal = getTemplate("linkedin-message", json);
	
	$('#content').append(message_form_modal);
	$('#linkedin_messageModal').modal("show");
	

	$('#send_request').click( function(e) {
		e.preventDefault();
		
	    if(!isValidForm($("#linkedin_messageForm"))){
	    	return;
	    }
	    
	    $.post( "/core/api/widgets/connect/" + plugin_id + "/" + linkedin_id , $('#linkedin_messageForm').serialize(), function(data) {
	    	
	    	$('#linkedin_messageModal').find('span.save-status').html("sent");
			
			setTimeout(function(){ 
				$('#linkedin_messageModal').modal("hide");
			}, 2000);
			
	       }).error(function(data) { 
	    	$('#linkedin_messageModal').remove();
       		alert(data.responseText); 
       	}); 
	});
}

function sendLinkedInMessage(plugin_id, linkedin_id) {
	
	var json = {};
	json["headline"] = "Send Message";
	json["info"] = "Sends a message to " + Linkedin_current_profile_user_name +
			" on Linkedin from your Linkedin account associated with Agile CRM";
	
	$('#linkedin_messageModal').remove();
	var message_form_modal = getTemplate("linkedin-message", json);

		$('#content').append(message_form_modal);
		$('#linkedin_messageModal').modal("show");
		
		$('#send_request').click( function(e) {
			e.preventDefault();
		    
			if(!isValidForm($("#linkedin_messageForm"))){
		    	return;
		    }
		    
			$.post( "/core/api/widgets/message/" + plugin_id + "/" + linkedin_id , $('#linkedin_messageForm').serialize(), function(data) {

				$('#linkedin_messageModal').find('span.save-status').html("sent");
				
				setTimeout(function(){ 
					$('#linkedin_messageModal').modal("hide");
				}, 2000);
				
       		}).error(function(data) { 
       			$('#linkedin_messageModal').remove();
        		alert(data.responseText); 
        	}); 
		});

}

function reSharePost(plugin_id, share_id, message, element) {
    $.get("/core/api/widgets/reshare/" + plugin_id + "/" + share_id + "/" + message, function (data) {
    	$(element).css('color', 'green');
    	$(element).text('Shared');
    });
}

