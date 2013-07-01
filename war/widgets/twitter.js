/*
 * === twitter.js ==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party JavaScript API provided.It interacts with the
 * application based on the function provided on agile_widgets.js(Third party API)
 */
$(function ()
{
    // Twitter plugin name as a global variable
    TWITTER_PLUGIN_NAME = "Twitter";

    // Twitter update loading image declared as global
    TWITTER_UPDATE_LOAD_IMAGE = '<div id="tweet_load"><center><img  src=\"img/ajax-loader-cursor.gif\" ' + 
    			'style="margin-top: 10px;margin-bottom: 14px;"></img></center></div>';
    
    Errorjson = {};
    
    $('#Twitter').html(TWITTER_UPDATE_LOAD_IMAGE);

    // Current contact user name in Twitter profile
    Twitter_current_profile_user_name = "";
    Twitter_current_update_id = "";
    Twitter_current_profile_screen_name = "";
    var Twitter_follower_ids;
    var Twitter_following_ids;
    
    // Global twitter id
    var twitter_id = "";

    // Gets plugin id from plugin object, fetched using script API
    var plugin_id = agile_crm_get_plugin(TWITTER_PLUGIN_NAME).id;

    // Gets Plugin Preferences to check whether to show setup or matching profiles
    var plugin_prefs = agile_crm_get_plugin_prefs(TWITTER_PLUGIN_NAME);

    // If not found, considering first time usage of widget, setupTwitterOAuth called
    if (plugin_prefs == undefined)
    {
        setupTwitterOAuth(plugin_id);
        return;
    }

    //Get website URL for Twitter from contact to get profile based on it
    var web_url = agile_crm_get_contact_property_by_subtype('website', 'TWITTER');
    console.log(web_url);
  
    	
    //If Twitter URL exists for contact,
    if (web_url)
    {
        // Get Twitter id from URL and show profile
        getTwitterIdByUrl(plugin_id, web_url, function (data)
        {
            twitter_id = data;
            showTwitterProfile(twitter_id, plugin_id);
        });
    }
    else
    {
        // Shows all the matches in Twitter for the contact 
        getTwitterMatchingProfiles(plugin_id);
    }
    
    // Deletes Twitter  profile on click of delete button in template
    $('#Twitter_plugin_delete').die().live('click', function (e)
    {
        e.preventDefault();

        agile_crm_delete_contact_property_by_subtype('website', 'TWITTER', web_url);
         
    });

    //Sends a message to Twitter when clicked on send message button
    $('#twitter_message').die().live('click', function (e)
    {
        e.preventDefault();
        sendTwitterMessage(plugin_id, twitter_id);
    });

    //Sends an follow request to Twitter when clicked on follow button
    $('#twitter_follow').die().live('click', function (e)
    {
        e.preventDefault();

        // Checks whether it is disabled, if disabled no request is sent
        if ($(this).attr("disabled")) return;

        // Once if follow clicked, request sent and button is disabled 
        sendFollowRequest(plugin_id, twitter_id);
    });

    //Sends an UnFollow request to Twitter when clicked on UnFollow button
    $('#twitter_unfollow').die().live('click', function (e)
    {
        e.preventDefault();
        sendUnfollowRequest(plugin_id, twitter_id);
    });
    
    // On mouse enter unfollow
    $('#twitter_unfollow').live('mouseenter', function ()
    {   
    	$('#twitter_unfollow').text("Unfollow");
    	$('#twitter_unfollow').addClass("btn-danger");
    	$('#twitter_unfollow').removeClass("btn-primary");
    });
    
    // On mouse leave following
    $('#twitter_unfollow').live('mouseleave', function ()
    {
    	$('#twitter_unfollow').text("Following");
    	$('#twitter_unfollow').addClass("btn-primary");
    	$('#twitter_unfollow').removeClass("btn-danger");
    });

    //ReTweets a tweet in Twitter on click of ReTweet link
    $('.twitter_retweet').die().live('click', function (e)
    {
        e.preventDefault();

        // Get the id of the tweet on which retweet is clicked
        var tweet_id = $(this).attr("id");
        console.log(tweet_id);

        // While retweet, the comment message is made optional
        retweetTheTweet(plugin_id, tweet_id, "optional", this);
    });

    // Sends a tweet to the contact Twitter profile
    $('#twitter_tweet').die().live('click', function (e)
    {
        e.preventDefault();
        tweetInTwitter(plugin_id, twitter_id);

    });
    
    $('.twitter_modify_search').die().live('click', function(e){
    	e.preventDefault();
    	
    	var details = {};
    	details['firstname'] = agile_crm_get_contact_property("first_name");
    	details['lastname'] = agile_crm_get_contact_property("last_name");
    	details['keywords'] = details.firstname + " " + details.lastname;
    	
    	console.log(details);
    	$('#Twitter').html(getTemplate('twitter-modified-search',details));
    });
    
    $('#twitter_search_btn').die().live('click', function(e){
    	e.preventDefault();
    	
    	// Checks whether all input fields are given
        if (!isValidForm($("#twitter-search_form")))
        {
            return;
        }

    	var search_string = $('#twitter_keywords').val();
    	console.log(search_string);
    	getModifiedTwitterMatchingProfiles(plugin_id, search_string);
    	
    });
    
    $('#twitter_search_close').die().live('click', function(e){
    	e.preventDefault();
    	
    	getTwitterMatchingProfiles(plugin_id);
    });
    
    // On click of followers in twitter panel
    $('#twitter_followers').die().live('click', function (e1)
    {
    	 e1.preventDefault();
    	
    	 if(Twitter_follower_ids)
    		 return;
    	
    	 Twitter_follower_ids = [];

    	 $('#twitter_follower_panel').html(TWITTER_UPDATE_LOAD_IMAGE);
    	 
    	 // Retrieves the Twitter IDs of all the followers 
    	 getFollowerIdsInTwitter(plugin_id, twitter_id, function(data)
    	 {
    		 // Store array of IDs in a global variable    		 
	    	 Twitter_follower_ids = data; 
	    	 
	    	 console.log(data); 
	    	 
	    	 if(data.length == 0)
	    	 {
	    		 $('#twitter_follower_panel').html(Twitter_current_profile_user_name +
	    				 " doesn't have any followers yet");
	    		 return;
	    	 }
	    	 
    		 // Get 20 from array and remove 20 from array
	    	 var temp = Twitter_follower_ids.splice(0, 20);	
	    	 //var temp = Twitter_follower_ids;
	    	 console.log(temp);
	    	 
	    	 // Get the Twitter profile for 20 Twitter IDs
	    	 getListOfProfilesByIDsinTwitter(plugin_id, temp, function(result) {	    		 
	    		 	
	    		 // Show matching profiles in Twitter panel
	    		 $('#twitter_follower_panel').html(getTemplate("twitter-follower-following", result));
	    		 
	    		 $(".twitterImage").die().live('mouseover', function ()
	    	     {
	    			 // Unique Twitter Id from widget 
	    	    	 var id = $(this).attr('id');
	    	    	            
	    	    	 // Aligns details to left in the pop over
	    	    	 $('#' + id).popover(
	    	    	 {
	    	    		 placement: 'left'
	    	    	 });

	    	    	 // Called show to overcome pop over bug (not showing pop over on mouse 
	    	    	 // hover for first time)
	    	    	 $('#' + id).popover('show');
	    	     });
	    	 },
		     function(error)
		     {
	    		 Twitter_follower_ids = undefined;
	    		 $('#tweet_load').remove();
		    	 $('#follower-error-panel').html(error.responseText);
		    	 $('#follower-error-panel').show();
		    	 $('#follower-error-panel').fadeOut(10000);
		     });
	    	 
	    	 $('#more_followers').die().live('click', function (e2)
	    	 {
	    		 e2.preventDefault();
	    		 
	    		 if(!Twitter_follower_ids)
	        		 return;
	    		 
	        	 //$('#twitter_follower_panel').append(TWITTER_UPDATE_LOAD_IMAGE);
	        	 $('#spinner-followers').show();
	        	 
	    		 // Get 20 from array and remove 20 from array
		    	 var temp = Twitter_follower_ids.splice(0, 20);	    	 
		    	 console.log(temp);
		    	 
		    	 // Get the Twitter profile for 20 Twitter IDs
		    	 getListOfProfilesByIDsinTwitter(plugin_id, temp, function(result) {	    		 
		    		 	
		    		 //$('#tweet_load').remove();
		    		 $('#spinner-followers').hide();
		    		 
		    		 // Show matching profiles in Twitter panel
		    		 $('#twitter_follower_panel').append(getTemplate('twitter-follower-following', result));
		    	 },
		    	 function(error)
			     {
		    		 $('#spinner-followers').hide();
			    	 $('#follower-error-panel').html(error.responseText);
			    	 $('#follower-error-panel').show();
			    	 $('#follower-error-panel').fadeOut(10000);
			     });
	    	 });
	    	 
    	 });    		        
    });
    
    // On click of following in twitter panel
    $('#twitter_following').die().live('click', function (e1)
    {
    	e1.preventDefault();
    	
    	if(Twitter_following_ids)
    		return;
    	
    	Twitter_following_ids = [];

   	 	$('#twitter_following_panel').html(TWITTER_UPDATE_LOAD_IMAGE);
   	 
   	    // Retrieves the Twitter IDs of all the following persons 
    	getFollowingIdsInTwitter(plugin_id, twitter_id, function(data)
    	{
    		// Store array of IDs in a global variable 
    		Twitter_following_ids = data;    		
    		   		 
    		console.log(data.length); 
    		if(data.length == 0)
	    	 {
	    		 $('#twitter_following_panel').html(Twitter_current_profile_user_name + 
	    				 " isn't following anyone yet");
	    		 return;
	    	 }
    		
    		// Get 20 from array and remove 20 from array
    		var temp = Twitter_following_ids.splice(0, 20);	    	 
 	    	console.log(temp);
	    	 
	    	// Get the Twitter profile for 20 Twitter IDs
	    	getListOfProfilesByIDsinTwitter(plugin_id, temp, function(result) {	    		 
	    		 	   			    		 
	    		// Show matching profiles in Twitter panel
	    		$('#twitter_following_panel').html(getTemplate("twitter-follower-following", result));
	    		
	    		 $(".twitterImage").die().live('mouseover', function ()
	    		 {
	    			    // Unique Twitter Id from widget 
	    	            var id = $(this).attr('id');
	    	            
	    	            // Aligns details to left in the pop over
	    	            $('#' + id).popover(
	    	            {
	    	                placement: 'left'
	    	            });

	    	            // Called show to overcome pop over bug (not showing pop over on mouse 
	    	            // hover for first time)
	    	            $('#' + id).popover('show');
	    		 });
	    	},
	    	function(error)
	    	{
	    		Twitter_following_ids = undefined;
	    		$('#tweet_load').remove();
	    		$('#following-error-panel').html(error.responseText);
	    		$('#following-error-panel').show();
	    		$('#following-error-panel').fadeOut(10000);
	    	});
	    	
    		$('#more_following').die().live('click', function (e2)
    	    {
    			e2.preventDefault();
	    		 
    			if(!Twitter_following_ids)
	        		 return;
    			
    			//$('#twitter_following_panel').append(TWITTER_UPDATE_LOAD_IMAGE);
    			$('#spinner-following').show();
    			
	    		// Get 20 from array and remove 20 from array
	    		var temp = Twitter_following_ids.splice(0, 20);	    	 
	 	    	console.log(temp);
		    	 
		    	// Get the Twitter profile for 20 Twitter IDs
		    	getListOfProfilesByIDsinTwitter(plugin_id, temp, function(result) {	    		 
		    		 	   			
		    		 //$('#tweet_load').remove();
		    		 $('#spinner-following').hide();
		    		
		    		// Show matching profiles in Twitter panel
		    		$('#twitter_following_panel').append(getTemplate('twitter-follower-following', result));
		    	},
		    	function(error)
		    	{
		    		$('#spinner-following').hide();
		    		$('#following-error-panel').html(error.responseText);
		    		$('#following-error-panel').show();
		    		$('#following-error-panel').fadeOut(10000);
		    	});
		    	
    	    });
    	});   	 
    });
});

/**
 * Shows setup if user adds Twitter widget for the first time. Uses ScribeServlet 
 * to create a client and get preferences and save it to the widget.
 * 
 * @param plugin_id
 * 			To get the widget and save tokens in it.
 */
function setupTwitterOAuth(plugin_id)
{
    // URL to return, after fetching token and secret key from Twitter
    var callbackURL = window.location.href;

    /*
     * Creates a URL, which on click can connect to scribe using parameters sent
     * and returns back to the profile based on return URL provided and saves widget  
     * preferences in widget based on plugin id
     */
    var url = '/scribe?service=twitter&return_url=' + encodeURIComponent(callbackURL) +
        '&plugin_id=' + encodeURIComponent(plugin_id);

    //Shows a link button in the UI which connects to the above URL
    $('#Twitter').html("<div class='widget_content' style='border-bottom:none;line-height: 160%;' >" + 
    		"Engage with contacts in real time based on what they tweet." + 
    		"<p style='margin: 10px 0px 5px 0px;'>" + 
    		"<a class='btn' href=\"" + url + "\" style='text-decoration:none;'>" + 
    		"Link Your Twitter</a></p></div>");
}

/**
 * Fetches matching profiles from Twitter based on PluginID and current contact first
 * name and last name
 * 
 * @param plugin_id :
 *            To get the widget and access tokens saved in it.
 */
function showTwitterMatchingProfiles(plugin_id, data)
{
    var contact_image = agile_crm_get_contact_property("image");
    console.log("conatact_image " + contact_image);
    
    var el = "<div style='padding:10px'><p>Locate the contact on Twitter. " +
    		"<a href='#' class='twitter_modify_search'>Modify search</a></p>";

    // If no matches found display message
    if (data.length == 0)
    {
    	twitterMainError("No Matches Found " +
    			"<a href='#' class='twitter_modify_search'>Modify search</a>");
        return;
    }
   
    el = el.concat(getTemplate("twitter-search-result", data));
    el = el + "</div>";

    // Show matching profiles in Twitter panel
    $('#Twitter').html(el);
    
    // Displays Twitter profile details on mouse hover and saves profile on click
    $(".twitterImage").die().live('mouseover', function ()
    {
    	// Unique Twitter Id from widget 
        var id = $(this).attr('id');

        // Aligns details to left in the pop over
        $(this).popover(
        {
            placement: 'left'
        });

        // Called show to overcome pop over bug (not showing pop over on mouse hover 
        // for first time)
        $(this).popover('show');

        // on click of any profile, save it to the contact
        $('#' + id).die().live('click', function (e)
        {
            e.preventDefault();

            //Hide pop over after clicking on any picture
            $(this).popover('hide');
            
            console.log('on click in search');
            
            // Web url of twitter for this profile
            var url = "@" + $(this).attr('screen_name');
            
            console.log(url);
            var propertiesArray = [
                                   {"name"  : "website",
                     				"value" : url,
                     				"subtype" : "TWITTER"}
            					   ];
            if(!contact_image)
            {
            		//Get image link which can be used to save image for contact
                    var twitter_image = $(this).attr('src');
            		propertiesArray.push({"name"  : "image","value" : twitter_image });
            }
          	                        
            // If contact title is undefined, saves headline of the Twitter profile
        	// to the contact title
            if(!agile_crm_get_contact_property("title"))
            {
            	var summary = $(this).attr("summary");
            	propertiesArray.push({"name" : "title", "value" : summary});
            }
            
            console.log(propertiesArray);
           
            agile_crm_update_contact_properties(propertiesArray);
          
        });
    });
   
}

/**
 * Fetches Twitter matching profiles based on plugin id
 * 
 * @param plugin_id 
 * 			plugin id to fetch widget preferences
 */
function getTwitterMatchingProfiles(plugin_id)
{
	// Shows loading image, until matches profiles are fetched
    $('#Twitter').html(TWITTER_UPDATE_LOAD_IMAGE);
    
    // Gets contact id, to save social results of a particular id
    var contact_id = agile_crm_get_contact()['id'];

    // Reads from cookie (local storage HTML5), since widgets are saved using local 
    // storage when matches are fetched for the first time on the contact
    var data = localStorage.getItem('Agile_twitter_matches_' + contact_id);

    // If cookie is not available fetch results from Twitter
    if (!data)
    {
        // Sends request to url "core/api/widgets/match/" and Calls WidgetsAPI with contact
        // id and plugin id as path parameters
   		queueGetRequest("widget_queue", "core/api/widgets/match/" + plugin_id + "/" +contact_id, 'json', 
   		function success(data)
        {
            // Save social results in cookie of particular contact
            localStorage.setItem('Agile_twitter_matches_' + contact_id, JSON.stringify(data));

            showTwitterMatchingProfiles(plugin_id, data);
            
        }, function error(data)
        {
            // Remove loading image on error 
            $('#tweet_load').remove();

            // Shows error message if error occurs
            twitterMainError(data.responseText);
        });
    }
    else
    	showTwitterMatchingProfiles(plugin_id, JSON.parse(data));
}

/**
 * Fetches Twitter matching profiles based on plugin id and search string
 * 
 * @param plugin_id 
 * 			plugin id to fetch widget preferences
 */
function getModifiedTwitterMatchingProfiles(plugin_id, search_string)
{
	// Shows loading image, until matches profiles are fetched
    $('#spinner-twitter-search').show();
    
	// Sends request to url "core/api/widgets/match/twitter" and Calls WidgetsAPI with 
	// plugin id and search string as path parameters
	$.get("core/api/widgets/modified/match/twitter/" + plugin_id + "/" + search_string , 
	function (data)
    {
		$('#spinner-twitter-search').hide();
        showTwitterMatchingProfiles(plugin_id, data);
        
    }, "json").error( function(data)
    {
    	// Remove loading image on error 
    	$('#spinner-twitter-search').remove();
        
        // Shows error message if error occurs
        twitterMainError(data.responseText);
    });
}

/**
 * Shows saved Twitter profile based on Twitter Id and Plugin Id
 * 
 * @param twitter_id
 * 			Twitter id to fetch profile from Twitter
 * @param plugin_id
 * 			plugin_id to get tokens saved to connect with Twitter
 */
function showTwitterProfile(twitter_id, plugin_id)
{
    // Shows loading, until profile is fetched
    $('#Twitter').html(TWITTER_UPDATE_LOAD_IMAGE);

    //Stores connected status of agile user with contact Twitter profile
    var twitter_connected;

    // Stores the initial update stream of the contact's Twitter profile
    var stream_data;

    // Calls WidgetsAPI class to get Twitter profile of contact
	$.get("/core/api/widgets/profile/" + plugin_id + "/" + twitter_id, 
    function (data)
    {
		if(!data)
			return;
		
        //shows delete button in the Twitter panel
        $('#Twitter_plugin_delete').show();

        // Sets the Twitter name of the profile to the global variable
        Twitter_current_profile_user_name = data.name;
        Twitter_current_profile_screen_name = data.screen_name;
        
        // Sets the Twitter connected status to the local variable
        twitter_connected = data.is_connected;

        // Sets the latest update id of the contact's Twitter profile 
        Twitter_current_update_id = data.current_update_id;

        // Gets Twitter profile template and populate the fields with details
        $('#Twitter').html(getTemplate("twitter-profile", data));

        // Checks if the agile user is following the contact's Twitter profile
        if (data.is_connected)
            // If following unFollow and compose tweet buttons are shown
            $('#twitter_unfollow').show();

        else
        {
            // Checks if follow request is sent, if not sent follow button is shown
            if (!data.is_follow_request_sent)
                $('#twitter_follow').show();
            else
                // If follow request sent, then button is disabled showing the text as
                // follow request sent
                $('#twitter_follow').text("Follow Request Sent")
                    .attr("disabled", "disabled").show();
        }

        // If updates are available, show recent updates in Twitter profile
        if (data.updateStream && data.updateStream.length != 0)
        {
            // Current update heading and refresh button is shown
            $('#twitter_refresh_stream').show();
            
            // Sets the update stream into a local variable for this method
            stream_data = data.updateStream;
            
            var element = $(getTemplate("twitter-update-stream", data.updateStream))

            head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		$(".time-ago", element).timeago();
            	});
            	
            // Template is populated with update details and shown
            $('#twitter_social_stream').append(element);          

            return;
        }

        // Current current update is shown
        $('#twitter_current_activity').show();
        
        
    }, "json").error(function (data)
    {
        // Remove loading image on error 
        $('#tweet_load').remove();

        twitterMainError(data.responseText);
        
    });

    // On click of see more link, more updates are retrieved
    $('.twitter_stream').die().live('click', function (e)
    {

        e.preventDefault();

        // Tweet Id of the last update is retrieved to get old updates before that Id
        var tweet_id = $('ul#twitter_social_stream')
            .find('li#twitter_status:last').attr('status_id');
        
        console.log(tweet_id);

        if(!Twitter_current_update_id)
        	return;
        
        // It is undefined in case if person does not share his updates
        if (!tweet_id)
        {
            // Checks if person is already following in Twitter to agile user
            if (twitter_connected)
            {
            	tweetError("This member doesn't share his/her tweets");
                return;
            }

            // If not following, advice user to follow him/her to see updates
            // Error message is shown to the user
            tweetError("Member does not share his/her tweets. Follow him/her and try");
            return;
        }

        // Loading image is shown until the updates are retrieved 
        //$("#twitter_social_stream").append(TWITTER_UPDATE_LOAD_IMAGE);
        $('#spinner-tweets').show();

        var that = this;

        // See more link is disabled until the updates are retrieved since there may 
        // be a chance of getting duplicate updates
        $(this).removeClass('twitter_stream');

        // Calls WidgetsAPI class to request for five more updates tweeted before the 
        // tweet id of the last update
        $.getJSON("/core/api/widgets/updates/more/" + plugin_id + "/" + twitter_id +
            "/"+ tweet_id +"/5",

        function (data)
        {
            // Removes loading button after fetching updates
            // $('#tweet_load').remove();
            $('#spinner-tweets').hide();

            // See more link activated to get more updates
            $(that).addClass('twitter_stream');
            $('#twitter_refresh_stream').show();
            
            // If no more updates available, less and refresh buttons are shown
            if (data.length == 0)
            {
                tweetError("No more updates available");
             
                // On click of more if no updates available and if user have initial 
                // updates more than 3 and  then less button is shown
                if (stream_data.length > 3)
                {
                    $("#twitter_stream").hide();
                    $('#twitter_less').show();
                }
                return;
            }

            // Populate the template with update stream details and show in panel
            $("#twitter_social_stream")
                .append(getTemplate("twitter-update-stream", data));
            
           $(".time-ago", $("#twitter_social_stream")).timeago();
        	
            // Current activity is hidden
            $('#twitter_current_activity').hide();
           

        }).error(function (data)
        {
            // Removes loading button if error occurs
        	$('#spinner-tweets').hide();

            // Activates see more button 
            $(that).addClass('twitter_stream');

            // Error message is shown to the user
            tweetError(data.responseText);
        });
    });

    // On click of less button, hides update stream and shows current update by toggling 
    $('#twitter_less').die().live('click', function (e)
    {
        e.preventDefault();

        // For the first time less attribute is false and will not enter if        
        if ($(this).attr("less") == "true")
        {
            // On click of see more, less attribute is made false and text on link is 
            // changed as see less and shows all the updates by toggling
            $(this).attr("less", "false");

            // If updates exists only hide current update
            if ($('ul#twitter_social_stream').find('div#twitter_update').length != 0)
            {
                $('#twitter_current_activity').hide();
            }

            // On first click of see less, less attribute is made true and text will be
            // changed as see more button 
            $(this).text("Show Less..");
            $('#twitter_refresh_stream').show();
        }
        else
        {
        	$(this).attr("less", "true");
        	$(this).text("Show More..");
	        $('#twitter_current_activity').show();
	        $('#twitter_refresh_stream').hide();
        }
    });

    // On click of refresh icon in the Twitter panel, all the new updates are shown
    $('#twitter_refresh_stream').die().live('click', function (e)
    {
        e.preventDefault();

        // Loading button is displayed until updates are shown
        $("#twitter_social_stream").html(TWITTER_UPDATE_LOAD_IMAGE);

        // Calls WidgetsAPI class to get the updates based on plugin id
        $.getJSON("/core/api/widgets/updates/" + plugin_id + "/" + twitter_id,

        function (data)
        {
            // Remove loading button on success
            $('#tweet_load').remove();            
            
            // Populates the template with the data 
            $("#twitter_social_stream").html(getTemplate("twitter-update-stream", data));   
            
            $(".time-ago", $("#twitter_social_stream")).timeago();
            
            // Checks if stream available, 
            if (data.length == 0)
            {
                // See Less is shown and see more is hidden
                $("#twitter_stream").hide();
                $('#twitter_less').show();
                return;
            }

            // See more,refresh  buttons are shown and less is hidden
            $("#twitter_stream").show();
            $('#twitter_less').hide(); 
            $('#twitter_current_activity').hide();

        }).error(function (data)
        {
            // Remove loading button on error
            $('#tweet_load').remove();
            $("#twitter_stream").show();
            $('#twitter_less').hide();
            
            if(stream_data && stream_data.length != 0)
            	 // Populates the template with the initial update stream on error
                $("#twitter_social_stream")
                		.html(getTemplate("twitter-update-stream", stream_data));
            
            // Error message is shown to the user
            tweetError(data.responseText);
            
        });
    });
}


/**
 * Sends a follow request in Twitter based on plugin id and Twitter Id of the profile 
 * set to the contact
 * 
 * @param plugin_id
 * 			plugin id to fetch widget preferences
 * @param twitter_id
 * 			Twitter Id to send follow request
 */
function sendFollowRequest(plugin_id, twitter_id)
{
    // Sends post request to url "core/api/widgets/connect/" and Calls WidgetsAPI with 
    // plugin id and Twitter id as path parameters
    $.post("/core/api/widgets/connect/" + plugin_id + "/" + twitter_id, function (data)
    {
        // Checks whether data is true, followed successfully in Twitter
        if (data == "true")
        {
            // Compose a new tweet and unfollow buttons are shown and follow hidden
            $('#twitter_follow').hide();
            $('#twitter_unfollow').show();
        }
        else
        {
        	$('#twitter_follow').text("Follow Request Sent")
            .attr("disabled", "disabled").show();
        	return;
        }

        // If current activity is undefined, then no updates can be retrieved 
        if (!Twitter_current_update_id) 
        	return;

        // Sends request to get five updates before current update when follow is clicked
        $.getJSON("/core/api/widgets/updates/more/" + plugin_id + "/" + twitter_id +
            "/" + Twitter_current_update_id + "/5",

        function (data)
        {
            // Populates the template with the data and shows refresh button
            $("#twitter_social_stream").html(getTemplate("twitter-update-stream", data));
            $('#twitter_current_activity').hide();
            $('#twitter_refresh_stream').show();

            // Checks if stream available, 
            if (data.length == 0)
            {
                // See Less is shown and see more is hidden
                $("#twitter_stream").hide();
                $('#twitter_current_activity').show();
                $('#twitter_less').show();
                return;
            }

        }).error(function (data)
        {           
        	$('#twitter_refresh_stream').show();
        	
            // Error message is shown if error occurs
            twitterError(data.responseText);
            
        });

    }).error(function (data)
    {
    	console.log(data);
        // Error message is shown if error occurs
    	twitterError(data.responseText);
    });
}

/**
 * Sends unfollow request to unFollow the contact's Twitter profile in Twitter based on
 * plugin id and Twitter id
 * 
 * * @param plugin_id
 * 			plugin id to fetch widget preferences
 * @param twitter_id
 * 			Twitter Id to send unfollow request
 */
function sendUnfollowRequest(plugin_id, twitter_id)
{
    // Sends get request to url "core/api/widgets/connect/" and Calls WidgetsAPI with 
    // plugin id and Twitter id as path parameters
    $.get("/core/api/widgets/disconnect/" + plugin_id + "/" + twitter_id, function (data)
    {
        // On success, unFollow, tweet and message buttons are hidden and follow shown
        $("#twitter_follow").show();
        $('#twitter_unfollow').hide();

    }).error(function (data)
    {
        // Error message is shown if error occurs
    	twitterError(data.responseText);
    });

}

/**
 * Sends a message to the Twitter profile of the contact based on Twitter Id of the profile
 * set to the contact
 *  
 *  @param plugin_id
 * 			plugin id to fetch widget preferences
 * @param twitter_id
 * 			Twitter Id to send request
 */
function sendTwitterMessage(plugin_id, twitter_id, message)
{
    // Store info in a json, to send it to the modal window when making send message request
    var json = {};

    // Set headline of modal window as Send Message
    json["headline"] = "Direct Message";

    // Information to be shown in the modal to the user while sending message 
    json["info"] = "Send message to " + Twitter_current_profile_user_name.toUpperCase() +
        " on Twitter";

    // If modal already exists remove to show a new one
    $('#twitter_messageModal').remove();

    // Populate the modal template with the above json details in the form
    var message_form_modal = getTemplate("twitter-message", json);

    // Append the form into the content
    $('#content').append(message_form_modal);
    
    $('#twitter_messageModal').on('shown', function () {
		  
		  head.js(LIB_PATH + 'lib/bootstrap-limit.js', function(){
			  $(".twit-message-limit").limit({
			  	  maxChars: 125,
			  	  counter: "#twitter-counter"
			  	});
			  $('#twitter_messageModal').find('#twit-message').focus();
		  });
	});
    
   //
    
    // Shows the modal after filling with details
    $('#twitter_messageModal').modal("show");
    
    // On click of send button in the modal, message request is sent    
    $('#send_request').click(function (e)
    {
        e.preventDefault();

        // Checks whether all the input fields are filled
        if (!isValidForm($("#twitter_messageForm")))
        {
            return;
        }

        $("#spinner-modal").show();
    
        // Sends post request to url "core/api/widgets/message/" and Calls WidgetsAPI with 
        // plugin id and Twitter id as path parameters and form as post data
        $.post("/core/api/widgets/message/" + plugin_id + "/" + twitter_id,
        $('#twitter_messageForm').serialize(),

        function (data)
        {
        	 $("#spinner-modal").hide();
        	 
            // On success, shows the status as sent
            $('#twitter_messageModal').find('span.save-status').html("sent");

            // Hides the modal after 2 seconds after the sent is shown
            setTimeout(function ()
            {
                $('#twitter_messageModal').modal("hide");
            }, 2000);

        }).error(function (data)
        {
        	 $("#spinner-modal").hide();
        	 
            // If error occurs while posting modal is removed and error message is shown
            $('#twitter_messageModal').remove();

            // Error message is shown if error occurs
            twitterError(data.responseText);
        });
    });
}

/**
 * Tweets to the Twitter profile of the contact based on Twitter Id of the profile
 * set to the contact
 *  
 * @param plugin_id
 * 			plugin id to fetch widget preferences
 * @param twitter_id
 * 			Twitter Id to send tweet request
 */
function tweetInTwitter(plugin_id, twitter_id)
{
	// Store info in a json, to send it to the modal window when making send tweet request
    var json = {};

    // Set headline of modal window as Send Message
    json["headline"] = "Tweet";

    // Information to be shown in the modal to the user while sending message    
    json["info"] = "Tweet to " + Twitter_current_profile_user_name.toUpperCase() +
        " on Twitter";

    json["description"] = "@" + Twitter_current_profile_screen_name;
	    
    // If modal already exists remove to show a new one
    $('#twitter_messageModal').remove();

    // Populate the modal template with the above json details in the form
    var message_form_modal = getTemplate("twitter-message", json);

    // Append the form into the content
    $('#content').append(message_form_modal);

    $('#twitter_messageModal').on('shown', function () {
		  
		  head.js(LIB_PATH + 'lib/bootstrap-limit.js', function(){
			  $(".twit-tweet-limit").limit({
			  	  maxChars: 125,
			  	  counter: "#twitter-counter"
			  	});
			  $('#twitter_messageModal').find('#twit-tweet').focus();
		  });
	});
    
  //  
    
    // Shows the modal after filling with details
    $('#twitter_messageModal').modal("show");
    
    // On click of send button in the modal, tweet request is sent 
    $('#send_request').click(function (e)
    {
        e.preventDefault();

        // Checks whether all the input fields are filled
        if (!isValidForm($("#twitter_messageForm")))
        {
            return;
        }

        $("#spinner-modal").show();
        
        // Sends post request to url "core/api/widgets/message/" and Calls WidgetsAPI with 
        // plugin id and Twitter id as path parameters and form as post data
        $.post("/core/api/widgets/tweet/" + plugin_id ,
        $('#twitter_messageForm').serialize(),

        function (data)
        {
        	 $("#spinner-modal").hide();
        	 
            // On success, shows the status as sent
            $('#twitter_messageModal').find('span.save-status').html("sent");

            // Hides the modal after 2 seconds after the sent is shown
            setTimeout(function ()
            {
                $('#twitter_messageModal').modal("hide");
            }, 2000);

        }).error(function (data)
        {
        	 $("#spinner-modal").hide();
        	 
            // If error occurs while posting modal is removed and error message is shown
            $('#twitter_messageModal').remove();

            // Error message is shown if error occurs
            twitterError(data.responseText);
        });
    });
}

/**
 * Retweets a post in Twitter on click of retweet link of particular tweet shown in the
 * update stream
 * 
 * @param plugin_id
 * 			plugin id to fetch widget preferences
 * @param share_id
 * 			Id of the tweet on which retweet is clicked
 * @param message
 * 			The message is optional while retweeting the tweet
 * @param element
 * 			Tweet object which is to be Retweeted
 */
function retweetTheTweet(plugin_id, share_id, message, element)
{
    // Sends get request to url "core/api/widgets/reshare/" and Calls WidgetsAPI with 
    // plugin id, Twitter id and message as path parameters
    $.get("/core/api/widgets/reshare/" + plugin_id + "/" + share_id + "/" + message,

    function (data)
    {
        // On success, the color of the reshare is shown green for that instance only
        $(element).css('color', 'green');

    }).error(function (data)
    {
        // Error message is shown when error occurs
    	tweetError(data.responseText);

    });
}


/**
 * If Twitter URL is provided for the contact, gets Twitter Id of the profile based on 
 * which Twitter profile of the contact is retrieved
 *  
 * @param plugin_id
 * 			plugin id to fetch widget preferences
 * @param web_url
 * 			URL provided saved for contact
 * @param callback
 * 			Callback to be executed to get the profile
 */
function getTwitterIdByUrl(plugin_id, web_url, callback)
{
	var proper_web_url;
	
	console.log(web_url);

	if(web_url.indexOf("https://twitter.com/") == -1)
    {
    	if(web_url.indexOf('@') == 0)
    		proper_web_url = "https://twitter.com/" + web_url.substring(1);
    	else
    		proper_web_url = "https://twitter.com/" + web_url;
    	
    	console.log(proper_web_url);
    }
	else
	{
		proper_web_url = web_url;
	}
	
    // Store url in a json to post it
    var url_json = {};
    url_json['web_url'] = proper_web_url;
    console.log('in method');

    // Sends post request to URL "/core/api/widgets/getidbyurl/" bye sending plugin id 
    // as path parameter and json as post data
    queuePostRequest("widget_queue","/core/api/widgets/getidbyurl/" + plugin_id, url_json, function (data)
    {
        // If Twitter id is undefined
        if (!data)
        {
            // Shows message that URL is invalid to the user
            alert("URL provided for Twitter is not valid ");

            // Shows Twitter matching profiles based on contact name
            getTwitterMatchingProfiles(plugin_id);

            // Delete the Twitter URL associated with contact as it is incorrect
            agile_crm_delete_contact_property_by_subtype('website', 'TWITTER', web_url);

            return;
        }

        // If defined, execute the callback function
        if (callback && typeof (callback) === "function")
        {
            callback(data);
        }

    }, function (data)
    {
    	// If time out exception occurs, ask user to refresh and return
    	if(data.responseText == "TimeOut")
    	{
    		twitterMainError("Time Out while fetching Twitter profile. Reload and try again");
    		return;
    	}
    	
    	if(data.responseText == "URL provided for Twitter is invalid. No such user exists.")
    	{
    		alert(data.responseText);
    		
    		console.log(web_url);
            // Delete the Twitter URL associated with contact as it is incorrect
            agile_crm_delete_contact_property_by_subtype('website', 'TWITTER', web_url.toString());
            
            return;
    	}
    	
    	twitterMainError(data.responseText);

    });
}

/**
 * Retrieves Twitter Ids of the followers of Twitter profile of contact based on 
 * twitter id of the contact
 * 
 *@param plugin_id
 * 			plugin id to fetch widget preferences
 * @param twitter_id
 * 			Twitter Id to send tweet request
 * @param callback
 * 			Callback to be executed to get the profiles
 */
function getFollowerIdsInTwitter(plugin_id, twitter_id, callback)
{
	
    // Sends get request to URL "/core/api/widgets/followers/" by sending plugin id 
    // and twitter id as path parameter
	$.getJSON("/core/api/widgets/followers/" + plugin_id + "/" + twitter_id,  
	function (data)
	{		 
		// If data is undefined, return
		if(!data)
			return;
		
		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
	    {
			callback(data);
	    }
		
	}).error(function (data)
	{
		// Show the error message
		$('#follower-error-panel').html(data.responseText);
   	    $('#follower-error-panel').show();
   	    $('#follower-error-panel').fadeOut(10000);

		$('#tweet_load').remove();
	});
}

/**
 * Retrieves Twitter Ids of persons whom contact twitter profile follows based on 
 * twitter id of the contact
 * 
 *@param plugin_id
 * 			plugin id to fetch widget preferences
 * @param twitter_id
 * 			Twitter Id to send tweet request
 * @param callback
 * 			Callback to be executed to get the profiles
 */
function getFollowingIdsInTwitter(plugin_id, twitter_id, callback)
{
	// Sends get request to URL "/core/api/widgets/followers/" by sending plugin id 
    // and twitter id as path parameter
	$.getJSON("/core/api/widgets/following/" + plugin_id + "/" + twitter_id,  
	function (data)
	{		 
		// If data is undefined, return
		if(!data)
			return;
		
		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
	    {
			callback(data);
	    }
		
	}).error(function (data)
	{
		// Show the error message
		$('#following-error-panel').html(data.responseText);
   	    $('#following-error-panel').show();
   	    $('#following-error-panel').fadeOut(10000);

		$('#tweet_load').remove();
	});
}

/**
 * Retrieves the Twitter profiles of followers or following based on the 
 * twitter IDs provided
 * 
 * @param plugin_id
 * 			plugin id to fetch widget preferences
 * @param twitter_ids
 * 			Array of IDs for which profiles are required
 * @param callback
 * 			Callback to be executed to get the profiles
 */
function getListOfProfilesByIDsinTwitter(plugin_id, twitter_ids, callback, errorcallback)
{	
	// Store the Twitter IDs provided as json tos send it as post data
	var json = {};
	json["twitter_ids"] = JSON.stringify(twitter_ids);
	
	// Sends post request to URL "/core/api/widgets/profile/list/" by sending 
	// plugin id as path parameter and array of twitter ids as post data
	$.post("/core/api/widgets/profile/list/" + plugin_id, json, function(data) 
	{
		// If data is undefined, return
		if(!data)
		{
			$('#tweet_load').remove(); 
			
			return;
		}
		
		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
	    {
			callback(data);
	    }
        
	// Accept the return type as json
	}, "json").error(function (data)
	{
		
		// If defined, execute the callback function
		if (errorcallback && typeof (errorcallback) === "function")
	    {
			errorcallback(data);
	    }
		
	});
	
}

function twitterError(error)
{
	Errorjson['message'] = error;
    
	$('#twitter-error-panel').html(getTemplate('twitter-error-panel', Errorjson));
	$('#twitter-error-panel').show();
	
	// Hides the modal after 2 seconds after the sent is shown
    $('#twitter-error-panel').fadeOut(10000);
    
}

function tweetError(error)
{
	Errorjson['message'] = error;
    
    // Error message is shown to the user
	$('#tweet-error-panel').html(getTemplate('twitter-error-panel', Errorjson));
	$('#tweet-error-panel').show();
	
	// Hides the modal after 2 seconds after the sent is shown
    $('#tweet-error-panel').fadeOut(10000);
}

function twitterMainError(error)
{
	Errorjson['message'] = error;
    
	$('#Twitter').html(getTemplate('twitter-error-panel', Errorjson));
}