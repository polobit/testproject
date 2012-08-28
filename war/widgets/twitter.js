var TWITTER_PLUGIN_NAME = "Twitter";

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
    $('#Twitter').append("<div><button class='btn'><a href=" + url + ">SetUp</button></div>");
}

function showTwitterMatchingProfiles(plugin_id)
{
	
	
	$('#Twitter').html('<div style="margin-left:-8px margin-top:10px"><img src="widgets/twitter-logo-small.png" style="margin-right:10px"></img><label class="bottom-line" style="display:inline">Twitter</label></div><br/><img src=\"img/1-0.gif\"></img>');
	$.getJSON("/core/api/widgets/twitter/" + agile_crm_get_contact()['id'] + "/" + plugin_id, function (data) {
		var el = '<div style=" margin-bottom:10px "><img src="widgets/twitter-logo-small.png" style="margin-right:10px"></img><label class="bottom-line" style="display:inline">Twitter</label></div>';
         if (data != null) {
             $.each(data, function (key, value) {
                 if (value.length === undefined) {
                	 el = el.concat("<img  rel=\"popover\" data-content=\"Location : "+value.location+"<br/>connection :"+value.num_connections+" \" data-original-title=\""+value.name+"\"class=\"twitterImage thumbnail \" id=" + value.id + " src =\" "+ value.picture +" \"style=\"width: 50px;height: 50px; display:inline-block;\" ></img>");
                 } else {
                     $.each(value, function (index, object) {
                         el = el.concat("<img  rel=\"popover\" data-content=\"Location : "+object.location+"<br/>connection :"+object.num_connections+" \" data-original-title=\""+object.name+"\"class=\"twitterImage thumbnail \" id=" + object.id + " src =\" "+ object.picture +" \"style=\"width: 50px;height: 50px; display:inline-block; \" ></img>");
                     });
                 }
             });
             $('#Twitter').html(el);
         }
         else {
        	 $('#Twitter').html("<div><label>Twitter</label></div><br/>No Matches Found");
        }
     });
	

	// Display to Twitter profile details on mouseover
	$(".twitterImage").die().live('mouseover' ,function() {
		
		 var id = $(this).attr('id');

		 $('#'+id).popover({placement:'left'});
		 
		 $('#'+id).click(function(){
			 $('#'+id).popover('hide');
			    if (id) 
			    	{
			    		agile_crm_save_widget_property(TWITTER_PLUGIN_NAME, id);
			    		showTwitterProfile(id, plugin_id)
			    	}
		 });
		 
	});

	
}

function showTwitterProfile(twitter_id, plugin_id)
{
	$('#Twitter').html('<div style="margin-left:-8px; margin-top:10px"><img src="widgets/twitter-logo-small.png" style="margin-right:10px"></img><label class="bottom-line" style="display:inline">Twitter</label></div><br/><img src=\"img/1-0.gif\"></img>');
    $.getJSON("/core/api/widgets/contact/TWITTER/" + twitter_id +"/" + plugin_id, function (data) {
        $('#Twitter').html('<div  style="margin-left:-8px"><img src="widgets/twitter-logo-small.png" style="margin-right:10px"></img><label class="bottom-line" style="display:inline">Twitter</label></div><div  style="display:inline;  line-height:12px;"><div class="row-fluid " style="color:gray; background:#f5f5f5; margin-top:10px;margin-left:-8px; width:200px; border-top:5px solid whitesmoke;"><div class="3"><img src=' + data.picture + ' width="50px" height="50px" style="display:inline; float:left; margin-right:2px; margin-top:2px; padding:0px 5px; "/></div><div class="span8"><h4 style="color:blue">' + data.name + '</h4><span style="font-size:10px; margin-bottom:2px;">' + data.summary + ',<br/> ' + data.location + ',<br/></span><br/><br/></div></div><a href="#" class= "addTwitterImage"id='+ data.picture+'>Add Image To Profile</a>');
    });	
    
    $('.addTwitterImage').die().live('click',function(e){
    	e.preventDefault();
    	alert("clicked");
    	 var id = $(this).attr('id');
    	 agile_crm_update_contact("image", id);
    	 
    });
}

