var LINKEDIN_PLUGIN_NAME = "Linkedin";



$(function () {
	
	// Get the Plugin id
	var plugin_id = agile_crm_get_plugin_id(LINKEDIN_PLUGIN_NAME);
	if(!plugin_id)
	{
		return;
	}
	
	// Get Plugin Prefs
	var plugin_prefs = agile_crm_get_plugin_prefs(LINKEDIN_PLUGIN_NAME);

	// If not found - first time usage - show oauth setup
	if(plugin_prefs == undefined)
	{
		setupLinkedinOAuth(plugin_id);
		return;
	}
	
	// Get Contact Prefs for this widget
	var linkedin_id = agile_crm_get_widget_property(LINKEDIN_PLUGIN_NAME);

	// If property with Linkedin do not exist, all the matching profiles
    if (!linkedin_id) 
    {
    	showLinkedinMatchingProfiles(plugin_id);
    	return;
    }
    	
    // Show contact's linkedin profile
    showLinkedinProfile(linkedin_id, plugin_id);	
  
});


function setupLinkedinOAuth(plugin_id)
{
    var callbackURL = window.location.href;

    var path = "widgets/linkedin.js"
    var url = '/scribe?service=linkedin&return_url=' + encodeURIComponent(callbackURL) + '&plugin_id=' + encodeURIComponent(plugin_id);
    $('#Linkedin').append("<div><button class='btn'><a href=" + url + ">SetUp</button></div>");
}

function showLinkedinMatchingProfiles(plugin_id)
{
	$('#Linkedin').html('<div style="margin-left:-8px; margin-top:10px"><img src="widgets/linkedin-logo-small.png" style="margin-right:10px"></img><label class="bottom-line" style="display:inline">Linkedin</label></div><br/><img src=\"img/1-0.gif\"></img>');
	$.getJSON("/core/api/widgets/linkedin/" + agile_crm_get_contact()['id'] + "/" + plugin_id, function (data) {
         var el = '<div style="margin-left:-8px; margin-top:10px"><img src="widgets/linkedin-logo-small.png" style="margin-right:10px"></img><label class="bottom-line" style="display:inline">Linkedin</label></div>';
         if (data != null) {
             $.each(data, function (key, value) {
                 if (value.length === undefined) {
                	 if(value.picture != undefined)
                		 el = el.concat("<img  rel=\"popover\" data-content=\"Location : "+value.location+"<br/>connection :"+value.summary+" \" data-original-title=\""+value.name+"\" class=\"linkedinImage thumbnail \" id=" + value.id + " src =\" "+ value.picture +" \" style=\"width: 50px;height: 50px\"></img>");
                	 else
                		 el = el.concat("<img  rel=\"popover\" data-content=\"Location : "+value.location+"<br/>connection :"+value.summary+" \" data-original-title=\""+value.name+"\" class=\"linkedinImage thumbnail \" id=" + value.id + " src =\" http://wiseheartdesign.com/page_attachments/0000/0062/default-avatar.png \"style=\"width: 50px;height: 50px;display:inline-block;\"></img>");
                 } else {
                     $.each(value, function (index, object) {
                    	 if(object.picture != undefined)
                    		 el = el.concat("<img rel=\"popover\" data-content=\"Location : "+object.location+"<br/>connection :"+object.summary+" \" data-original-title=\""+object.name+"\"  class=\"linkedinImage thumbnail \" id=" + object.id + " src =\" "+ object.picture +" \" style=\"width: 50px;height: 50px;display:inline-block;\" ></img>");
                    	 else
                    		 el = el.concat("<img  rel=\"popover\" data-content=\"Location : "+object.location+"<br/>connection :"+object.summary+" \" data-original-title=\""+object.name+"\"class=\"twitterImage thumbnail \" class=\"linkedinImage thumbnail \" id=" + object.id + " src =\" http://wiseheartdesign.com/page_attachments/0000/0062/default-avatar.png \" style=\"width: 50px;height: 50px; display:inline-block;\"></img>");
                         
                     });
                 }
             });
            
             $('#Linkedin').html(el);
         }
         else {
        	 $('#Linkedin').html('<div style="margin-left:-8px; margin-top:10px"><img src="widgets/linkedin-logo-small.png" style="margin-right:10px"></img><label class="bottom-line" style="display:inline">Linkedin</label></div><br/>No Matches Found');
        }
     });
	
	// Display to Twitter profile details on mouseover and saves on click
	$(".linkedinImage").die().live('mouseover' ,function() {
		
		 var id = $(this).attr('id');

		 $('#'+id).popover({placement:'left'});
		 
		 $('#'+id).die().live('click', function(){
			 $('#'+id).popover('hide');
			    if (id) 
			    	{
			    		agile_crm_save_widget_property(LINKEDIN_PLUGIN_NAME, id);
			    		showLinkedinProfile(id, plugin_id)
			    	}
		 });
		 
	});
}

function showLinkedinProfile(linkedin_id, plugin_id)
{
	$('#Linkedin').html('<div style="margin-left:-8px"><img src="widgets/linkedin-logo-small.png" style="margin-right:10px"></img><label class="bottom-line" style="display:inline">Linkedin</label></div><br/><img src=\"img/1-0.gif\"></img>');
    $.getJSON("/core/api/widgets/contact/LINKEDIN/" + linkedin_id +"/" + plugin_id, function (data) {
    	if(data.picture != null)
        	$('#Linkedin').html('<div style="margin-left:-8px; margin-bottom:10px; margin-top:10px"><img src="widgets/linkedin-logo-small.png" style="margin-right:10px"></img><label class="bottom-line" style="display:inline">Linkedin</label></div><div class="page-header" style="display:inline;  line-height:12px;"><div class="row-fluid " style="color:gray; background:#f5f5f5; margin-top:0px;margin-left:-8px; width:200px; border-top:5px solid whitesmoke;"><div class="3"><img src=' + data.picture + ' width="50px" height="50px" style="display:inline; float:left; margin-right:2px; margin-top:2px; padding:0px 5px; "/></div><div class="span8"><h4 style="color:blue">@' + data.name + '</h4><span style="font-size:10px;">' + data.summary + ',<br/> ' + data.location + ',<br/></span><br/><br/></div></div><a href="#" class= "addLinkedinImage" id='+ data.picture+'>Add Image To Profile</a>');
    	else
    		$('#Linkedin').html('<div style="margin-left:-8px; margin-bottom:10px; margin-top:10px"><img src="widgets/linkedin-logo-small.png" style="margin-right:10px"></img><label class="bottom-line" style="display:inline">Linkedin</label></div><div class="page-header" style="display:inline;  line-height:12px;"><div class="row-fluid " style="color:gray; background:#f5f5f5; margin-top:0px;margin-left:-8px; width:200px; border-top:5px solid whitesmoke;"><div class="3"><img src="http://wiseheartdesign.com/page_attachments/0000/0062/default-avatar.png" width="50px" height="50px" style="display:inline; float:left; margin-right:2px; margin-top:2px; padding:0px 5px; "/></div><div class="span8"><h4 style="color:blue">' + data.name + '</h4><span style="font-size:10px;">' + data.summary + ',<br/> ' + data.location + ',<br/></span><br/><br/></div></div>');    	
    });	
    
    
    $('.addLinkedinImage').die().live('click',function(e){
    	e.preventDefault();
    	alert("clicked");
    	 var id = $(this).attr('id');
    	 agile_crm_update_contact("image", id);
    	 
    });
}


