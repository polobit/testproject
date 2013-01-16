/*
* === twitter.js ==== It is a pluginIn to be integrated with CRM, developed
* based on the third party javascript API provided.It interacts with the 
* application based on the function provided on agile_widgets.js(Third party API)
*/
$(function () {
    // Plugin name as a global variable
    TWITTER_PLUGIN_NAME = "Twitter";
    TWITTER_PLUGIN_HEADER = '<div></div>';
    // Gets plugin id from plugin object, fetched using script API
    var plugin_id = agile_crm_get_plugin(TWITTER_PLUGIN_NAME).id;
    // Get Plugin Prefs
    var plugin_prefs = agile_crm_get_plugin_prefs(TWITTER_PLUGIN_NAME);
    // If not found - considering first time usage of widget, setupLinkedinOAuth
    // called
    if (plugin_prefs == undefined) {
        setupTwitterOAuth(plugin_id);
        return;
    }
    // Gets Contact Preferences for this widget, based on plugin name (using
    // Third party script API)
    var twitter_id = agile_crm_get_widget_property_from_contact(TWITTER_PLUGIN_NAME);
    // If property with Twitter do not exist, all the matching profiles
    if (!twitter_id) {
        showTwitterMatchingProfiles(plugin_id);
        return;
    }
    
    // Show contact's twitter profile
    showTwitterProfile(twitter_id, plugin_id);
    
    // Deletes Twitter profile, when click on elemtn with id "twitter_plugin_delete", 
    // represents cross mark shown in panel
    $('#twitter_plugin_delete').die().live('click', function (e) {
        e.preventDefault();
        agile_crm_delete_widget_property_from_contact(TWITTER_PLUGIN_NAME);
    });
    
    $('#twitter_message').die().live('click', function (e) {
    	e.preventDefault();
    	sendMessage(plugin_id, twitter_id);
    });
    
    $('#twitter_connect').die().live('click', function(e)
    {
    	e.preventDefault();
    	sendAddRequest(plugin_id, twitter_id);
    });
    
    
});
/**
 * Shows setup if user adds Twitter widget for the first time, to set up
 * connection to Twitter account. uses ScribeServlet to create a client and get
 * prefs
 * 
 * @param plugin_id
 */
function setupTwitterOAuth(plugin_id) {
    // Url to return, after fetching token and secret key from linkedin
    var callbackURL = window.location.href;
    /*
     * Creates a url for link, which on click can connect using parameters sent,
     * plugin_id : To save plugins in to widgets based on widget id i.e,
     * plugin_id CallbackURL : Specifies which url to return after subscribing
     * i.e, always current URL
     */
    var url = '/scribe?service=twitter&return_url=' + encodeURIComponent(callbackURL) + '&plugin_id=' + encodeURIComponent(plugin_id);
    // Shows link built (url created above), which hits scribe servlet and
    // fetches token and access keys, and saves in the widget. Button to set up
    // in shown in Twitter widget block
    $('#Twitter').html(TWITTER_PLUGIN_HEADER + "<p>Follow your friends, experts, favorite celebrities, and breaking news on TWITTER.<p><button class='btn'><a href=" + url + ">Link Your Twitter</button>");
}
/**
 * Fetches matching profiles from Twitter in based on PluginID and current
 * contact id, uses widget/plugin id to get prefs and details from current
 * contact id to fetch Twitter matches based on first and last name of the
 * contat
 * 
 * @param plugin_id :
 *            wiget/plugin id needs to be sent in request url along with current
 *            contact id
 */
function showTwitterMatchingProfiles(plugin_id) {
    // Shows loading, until matches profiles are fetched
    $('#Twitter').html(TWITTER_PLUGIN_HEADER + '<img src=\"img/1-0.gif\"></img>');
    // Fetches matching profiles from LinkedIn, and uses call back function to generate view for the profiles
    getTwitterMatchingProlfiles(plugin_id, function (data) {
        var el = TWITTER_PLUGIN_HEADER;
        // If no matches found, display information 
        if (data.length == 0) {
            $('#Twitter').html(TWITTER_PLUGIN_HEADER + "No Matches Found");
            return;
        }
        // If matched found, Iterates though each profile
        $.each(data, function (key, value) {
            // Converts data in to array if it is not an array
            if (!isArray(value)) value = [value]
            // Iterates through each profile, and populates a template using handlebars
            $.each(value, function (index, object) {
                // Calls to populate template and append to element, which 
                // is shown in Twitter widget panel
                el = el.concat(getTemplate("twitter-search-result", object));
            });
        });
        // Show matching profiles in Twitter panel
        $('#Twitter').html(el);
        // Displays to Twitter profile details on mouseover and saves on click
        $(".twitterImage").die().live('mouseover', function () {
            // Id from widget i.e., unique 'id' given by Twitter 
            // set in image tag of template
            var id = $(this).attr('id');
            // Gets the image link from the element, so can be used 
            // to save profile pic to pic of contact in CRM
            var twitter_image = $(this).attr('src');
            // sets popover prefs, aligned to left
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
                // If id (Twitter id) is defined, shows modal prompting 
                // user to save profile picture
                if (id) {
                    // Creates an modal element which is to be appended to content to show
                    var modal = $('<div id="twitter-image-save-modal" class="modal fade in" >' + '<div class="modal-header" ><a href="#" data-dismiss="modal" class="close">&times;</a>' + '<h3>Add Image</h3></div>' + '<div class="modal-body"><p>You are about to add Image to contact</p>' + '<p>Do you want to proceed?</p>' + '</div>' + '<div class="modal-footer"><a href="#" id="save_twitter_image" class="btn btn-primary">Yes</a>' + '<a  href="#" class="btn close" data-dismiss="modal" >No</a>' + '</div>' + '</div>');
                    // Checks if modal html element is already added to content,
                    // if added show is call instead of appending modal element again
                    if ($('#twitter-image-save-modal').size() == 0) {
                        $('#content').append(modal);
                    }
                    // Asks for confirmation about adding image to contact
                    // Calls show on the modal
                    $('#twitter-image-save-modal').modal('show');
                    // Calls method from script api, to save Twitter details in contact,
                    // with property name as name of plugin and id which is given by Twitter 
                    agile_crm_save_widget_property_to_contact(TWITTER_PLUGIN_NAME, id);
                    // Shows Selected profile in the plugin block
                    showTwitterProfile(id, plugin_id)
                }
                // Confirmation for saving image to contact
                $('#save_twitter_image').die().live('click', function (e) {
                    e.preventDefault();
                    // On confirmation, contact is update with image from Twitter using script API method
                    agile_crm_update_contact("image", twitter_image);
                    // Hides modal
                    $('#twitter-image-save-modal').modal('hide');
                });
            });
        });
    });
}
/**
 * Shows saved Twitter profile, in the Twitter plugin panel
 * 
 * @param linkedin_id : Linkedin id to fetch profile
 * @param plugin_id	  : plugin_id to get prefs to connect to Linkedin
 */
function showTwitterProfile(twitter_id, plugin_id) {
    // Shows loading, until profile is fetched
    $('#Twitter').html('<p><img src=\"img/1-0.gif\"></img></p>');
    // Fetches matching profiles
    $.getJSON("/core/api/widgets/profile/" + plugin_id + "/" + twitter_id, function (data) {
        console.log(data);
        // Gets Twitter-profile template and populate the fields using handlebars
        $('#Twitter').html(getTemplate("twitter-profile", data));
    });
}
/**
 * Sends request to url "core/api/widget/Twitter/" with contact id and plugin id
 * as path parameters, which fetches matching profiles using widget prefs based on 
 * plugin id and fist name, last name of the contact related to the id sent
 * 
 * @param plugin_id plugin id to fetch prefs
 * @param callback callback to create template and show matching profiles
 */
function getTwitterMatchingProlfiles(plugin_id, callback) {
    // Get contact id to save social results of a particular id
    var contact_id = agile_crm_get_contact()['id'];
    // Reads from cookie 
    var data = localStorage.getItem('Agile_twitter_matches_' + contact_id);
    // If cookie is not available fetch results from twitter
    if (!data) {
        $.getJSON("/core/api/widgets/match/" + plugin_id + "/" + agile_crm_get_contact()['id'], function (data) {
            // Save social results in cookie of particular contact
            localStorage.setItem('Agile_twitter_matches_' + contact_id, JSON.stringify(data));
            // Call back to show twitter matching profiles from cookie
            if (callback && typeof (callback) === "function") {
                // execute the callback, passing parameters as necessary
                callback(data);
            }
        });
    } else {
        // Call back to show twitter matching profiles from cookie
        if (callback && typeof (callback) === "function") {
            // execute the callback, passing parameters as necessary
            callback(JSON.parse(data));
        }
    }
}

function sendFollowRequest(plugin_id, twitter_id) {
	var json = {};
	json["headline"] = "Connect";
	 var message_form_modal = getTemplate("twitter-message", json);
		console.log("show modal");
		$('#content').append(message_form_modal);
		$('#messageModal').modal("show");
		

		$('#send_request').click( function(e) {
			e.preventDefault();
			
		    if(!isValidForm($("#messageForm"))){
		    }
		    
		    $.post( "/core/api/widgets/connect/" + plugin_id + "/" + linkedin_id , $('#messageForm').serialize(), function(data) {
		    	$('#messageModal').modal("hide");
		       });
		});
}

function sendMessage(plugin_id, twitter_id, message) {
	
	var json = {};
	json["headline"] = "Send Message";
	var message_form_modal = getTemplate("twitter-message", json);
	console.log("show modal");
	
	$("#messageModal").remove();
	
	$('#content').append(message_form_modal);
	$('#messageModal').modal("show");
	

	
	$('#send_request').click( function(e) {
		e.preventDefault();
	    
		if(!isValidForm($("#messageForm"))){
	    	return;
	    }
		
		$.post( "/core/api/widgets/message/" + plugin_id + "/" + twitter_id ,$('#messageForm').serialize(), function (data) {
			$('#messageModal').modal("hide");
		});
	});
}

function retweetTheTweet(plugin_id, share_id, message) {
    $.get("/core/api/widgets/reshare/" + plugin_id + "/" + share_id + "/" + message, function (data) {
        console.log(data);
    });
}