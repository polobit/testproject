var TWITTER_PLUGIN_NAME = "Twitter";
var TWITTER_PLUGIN_HEADER = '<div></div>';

$(function () {
	
	// Get the Plugin id
	var plugin_id = agile_crm_get_plugin_id(TWITTER_PLUGIN_NAME);
	if(!plugin_id)
	{
		return;
	}

	
	// Get Plugin Prefs
	var plugin_prefs = agile_crm_get_plugin_prefs(TWITTER_PLUGIN_NAME);

	// If not found - first time usage - show oauth setup
	if(plugin_prefs == undefined)
	{
		setupTwitterOAuth(plugin_id);
		return;
	}
	
	// Get Contact Prefs for this widget
	var twitter_id = agile_crm_get_widget_property(TWITTER_PLUGIN_NAME);

	// If property with Twitter do not exist, all the matching profiles
    if (!twitter_id) 
    {
    	showTwitterMatchingProfiles(plugin_id);
    	return;
    }
    	
    // Show contact's twitter profile
    showTwitterProfile(twitter_id, plugin_id);	
  
});


function setupTwitterOAuth(plugin_id)
{
    var callbackURL = window.location.href;

    var path = "widgets/twitter.js"
    var url = '/scribe?service=twitter&return_url=' + encodeURIComponent(callbackURL) + '&plugin_id=' + encodeURIComponent(plugin_id);
    $('#Twitter').html(TWITTER_PLUGIN_HEADER + "<p>Follow your friends, experts, favorite celebrities, and breaking news on TWITTER.<p><button class='btn'><a href=" + url + ">Link Your Twitter</button>");
}

function showTwitterMatchingProfiles(plugin_id)
{	
	$('#Twitter').html(TWITTER_PLUGIN_HEADER + '<img src=\"img/1-0.gif\"></img>');
	
	getTwitterMatchingProlfiles(plugin_id, function(data){
		var el =  TWITTER_PLUGIN_HEADER;

		// If no matching profiles found
	     if (data.length == 0) {
	      	 $('#Twitter').html(TWITTER_PLUGIN_HEADER  + "No Matches Found");
	       	 return;
	      }
		
		// If matching profiles available
		
             $.each(data, function (key, value) {
                 
            	 if (!isArray(value)) 
                	 value = [value]
                 
                 $.each(value, function (index, object) {
                	 
                	 el = el.concat(getTemplate("twitter-search-result", object));
                     
                 });
             });
             $('#Twitter').html(el);

	

	// Display to Twitter profile details on mouseover
	$(".twitterImage").die().live('mouseover' ,function() {
		
		 var id = $(this).attr('id');
		 var twitter_image = $(this).attr('src');
		 console.log($(this).attr('src'));
		 $('#'+id).popover({placement:'left'});
		 
		 $('#'+id).die().live('click', function(e){
			 e.preventDefault();
			 
			 $('#'+id).popover('hide');
			    if (id) 
			    	{			    	
			    		// To ask user to add profile pic to contact image
			    		var modal = $('<div id="twitter-image-save-modal" class="modal fade in" >'
			    				          +'<div class="modal-header" ><a href="#" data-dismiss="modal" class="close">&times;</a>'
			    				          +'<h3>Add Image</h3></div>'
			    				          +'<div class="modal-body"><p>You are about to add Image to contact</p>'
			    				                +'<p>Do you want to proceed?</p>'
			    				          +'</div>'
			    				          +'<div class="modal-footer"><a href="#" id="save_twitter_image" class="btn btn-primary">Yes</a>'
			    				                 +'<a  href="#" class="btn close" data-dismiss="modal" >No</a>'
			    				          +'</div>'
			    				      +'</div>');
			    		if($('#twitter-image-save-modal').size() == 0)
			    		      $('#content').append(modal);
			    		$('#twitter-image-save-modal').modal('show');		   
			    		agile_crm_save_widget_property(TWITTER_PLUGIN_NAME, id);
			    		showTwitterProfile(id, plugin_id)
			    	}
		 
		 // Confirmation for saving image to contact 
		 $('#save_twitter_image').die().live('click', function(e){
			 e.preventDefault();
			 agile_crm_update_contact("image", twitter_image);
			 $('#twitter-image-save-modal').modal('hide');
		 });
		 });
	}); 
	});

	
}

function showTwitterProfile(twitter_id, plugin_id)
{
	$('#Twitter').html('<p><img src=\"img/1-0.gif\"></img></p>');
	
    $.getJSON("/core/api/widgets/contact/TWITTER/" + twitter_id +"/" + plugin_id, function (data) {
    	
        $('#Twitter').html(getTemplate("twitter-profile", data));
    });	
    
    // Delete twitter profile
    $('#twitter_plugin_delete').die().live('click',function(e){
    	e.preventDefault();
    	 agile_crm_delete_widget_property(TWITTER_PLUGIN_NAME);
    	 
    });
}

// Get twitter matching profiles from cookie or from twitter
function getTwitterMatchingProlfiles(plugin_id, callback)
{
	// Get contact id to save social results of a particular id
	var contact_id = agile_crm_get_contact()['id'];

	// Read from cookie 
	var data = localStorage.getItem('Agile_twitter_matches_' + contact_id);
	
	// If cookie is not available fetch results from twitter
	if(!data)
		{
			$.getJSON("/core/api/widgets/twitter/" + agile_crm_get_contact()['id'] + "/" + plugin_id, function (data) {
					
				// Save social results in cookie of particular contact
				localStorage.setItem('Agile_twitter_matches_' + contact_id, JSON.stringify(data));
				
					// Call back to show twitter matching profiles from cookie
					if (callback && typeof(callback) === "function") {
						
						// execute the callback, passing parameters as necessary
						callback(data);
					}
			});
		}
	else
		{
			// Call back to show twitter matching profiles from cookie
			if (callback && typeof(callback) === "function") {
			
				// execute the callback, passing parameters as necessary
				callback(JSON.parse(data));
			}
		}	
}

