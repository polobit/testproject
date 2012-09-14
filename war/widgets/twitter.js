var TWITTER_PLUGIN_NAME = "Twitter";
var TWITTER_PLUGIN_HEADER = '<div style=" margin-bottom:20px " class="bottom-line" style="display:inline-block;"></div>';

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
    $('#Twitter').html(TWITTER_PLUGIN_HEADER + "<button class='btn'><a href=" + url + ">Link Your Twitter</button>");
}

function showTwitterMatchingProfiles(plugin_id)
{	
	$('#Twitter').html(TWITTER_PLUGIN_HEADER + '<img src=\"img/1-0.gif\"></img>');
	
	$.getJSON("/core/api/widgets/twitter/" + agile_crm_get_contact()['id'] + "/" + plugin_id, function (data) {
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
                     el = el.concat("<img  rel=\"popover\" data-content=\" <img src=" + object.picture 
                    		 + "></img><span style='display: inline-block;text-align: justify;font-style: italic;vertical-align: middle;width: 190px;padding-left: 10px;'> Name : " 
                    		 + object.name + " <br/>Followers : " + object.num_connections + " <br/>Location : " 
                    		 + object.location + "</span><p style='text-align: justify;font-style: italic;'>Summary : "+ object.summary+" </p>\" data-original-title=\" Twitter Profile\"class=\"twitterImage thumbnail \" id=" 
                    		 + object.id + " src =\" "+ object.picture + " \"style=\"width: 55px;height: 55px; display:inline-block; margin-right:2px; margin-bottom:2px; cursor:pointer;\" ></img>");
                 });
             });
             $('#Twitter').html(el);

     });
	

	// Display to Twitter profile details on mouseover
	$(".twitterImage").die().live('mouseover' ,function() {
		
		 var id = $(this).attr('id');
		 var twitter_image = $(this).attr('src');
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
		 });
		 
		 // Confirmation for saving image to contact 
		 $('#save_twitter_image').die().live('click', function(e){
			 e.preventDefault();
			 agile_crm_update_contact("image", twitter_image);
			 $('#twitter-image-save-modal').modal('hide');
		 });
		 
	});

	
}

function showTwitterProfile(twitter_id, plugin_id)
{
	$('#Twitter').html('<div style=" margin-bottom:10px " class="bottom-line" style="display:inline-block;">'
							+'<img src="widgets/twitter-logo-small.png" style="padding-right:5px; padding-bottom:1px; height:15px;"></img>'
						+'</div>'
						+'<label style="display:inline">Twitter</label>'
						+'<span id="twitter_plugin_delete" class="icon-remove pull-right" style=" cursor:pointer; color: #FF00FF"></span>'
						+'<p><img src=\"img/1-0.gif\"></img></p>');
	
    $.getJSON("/core/api/widgets/contact/TWITTER/" + twitter_id +"/" + plugin_id, function (data) {
    	
        $('#Twitter').html('<div style=" margin-bottom:20px " class="bottom-line" style="display:inline-block;">'
				        		+'<img src="widgets/twitter-logo-small.png" style="padding-right:5px; padding-bottom:1px; height:15px;"></img>'
				        		+'<label style="display:inline">Twitter</label>'
				        		+'<a class="icon-remove pull-right" id="twitter_plugin_delete" style=" cursor:pointer; color: #FF00FF"></a>'
				        	+'</div>'
				        	+'<div  style="display:inline;  line-height:12px;">'
				        		+'<div class="row-fluid well" style="margin-top:-10px;padding:0px;">'
				        		   +'<div class="span3" style=" margin-right:3%">'
				        		       +'<img src=' + data.picture + ' style=" display:inline; float:left; margin-right:2px; margin-top:5px; padding:0px 5px; cursor:pointer; color: #FF00FF "/>'
				        		   +'</div>'
				        		   +'<div class="span8">'
				        		       +'<h4 style="color:blue"><a href=\"' + data.url + '\" target="_blank">@' + data.name + '</a></h4>'
				        		       +'<span style="font-size:10px; margin-bottom:2px;">' + data.summary + ',<br/> ' + data.location +',<br/>' + data.num_connections + '+ connections ,<br/></span><br/><br/>'
				        		   +'</div>'
				        		 +'</div>'
				        	 +'</div>');
    });	
    
    // Delete twitter profile
    $('#twitter_plugin_delete').die().live('click',function(e){
    	e.preventDefault();
    	 agile_crm_delete_widget_property(TWITTER_PLUGIN_NAME);
    	 
    });
}

