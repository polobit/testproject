var LINKEDIN_PLUGIN_NAME = "Linkedin";
var LINKEDIN_PLUGIN_HEADER = '<div></div>';
	

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
    $('#Linkedin').html(LINKEDIN_PLUGIN_HEADER + "<p>Build and engage with your professional network. Access knowledge, insights and opportunities. <p><button class='btn'><a href=" + url + ">Link Your LinkedIn</button>");
}

function showLinkedinMatchingProfiles(plugin_id)
{
	// Show loading of linkedin matching profiles
	$('#Linkedin').html(LINKEDIN_PLUGIN_HEADER + '<img src=\"img/1-0.gif\"></img>');
	
	// Fetch matching profiles and displays
	$.getJSON("/core/api/widgets/linkedin/" + agile_crm_get_contact()['id'] + "/" + plugin_id, function (data) {
			
		// Widget header
         var el = LINKEDIN_PLUGIN_HEADER;
         
         // If no matches found display message
         if (data.length == 0) {
        	 $('#Linkedin').html(el.concat("No Matches Found"));
        	 return;
         }
         
         // If matched found
             $.each(data, function (key, value) {
            	 
            	 if(!isArray(value))
            		 value = [value];
            	 
            	 // Iterates through each profile
            	 $.each(value, function (index, object) {
            		 
            		 // If profile picture is null assign default profile pic 
            		 if(object.picture == null)
                		 {
            			  	object.picture = 'https://contactuswidget.appspot.com/images/pic.png';
                		 }
                	 
                	 el = el.concat("<img  rel=\"popover\" data-content=\" <img style='width:55px;height:55px;' src=" + object.picture 
                    		 + "></img><span style='display: inline-block;width:185px;text-align: justify;vertical-align: middle;padding-left: 10px;'> Name : " 
                    		 + object.name + " <br/>Connections : " + object.num_connections + " <br/>Location : " 
                    		 + object.location + "</span><p style='text-align: justify;font-style: italic;'><br/>"+ object.summary+" </p>\" data-original-title=\" Linked Profile\"class=\"linkedinImage thumbnail \" id=" 
                    		 + object.id + " src =\" "+ object.picture + " \"style=\"width: 55px;height: 55px; display:inline-block; margin-right:2px; margin-bottom:2px; cursor:pointer;\" ></img>");
                 
                 });
              });
            
             $('#Linkedin').html(el);
         
     });
	
	// Display to Linkedin profile details on mouseover and saves on click
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

// Shows saved Linkedin profile
function showLinkedinProfile(linkedin_id, plugin_id)
{
	// Shows loading before fetching matching profiles
	$('#Linkedin').html(LINKEDIN_PLUGIN_HEADER  + '<img src=\"img/1-0.gif\"></img>');
	
	// Fetches matching profiles
    $.getJSON("/core/api/widgets/contact/LINKEDIN/" + linkedin_id +"/" + plugin_id, function (data) {
    	
    	if(data.picture == null)
    		{
    			data.picture = 'https://contactuswidget.appspot.com/images/pic.png';
    		}
    	    	
    	$('#Linkedin').html('<div  style="display:inline;  line-height:12px;">'
				    		    +'<div class="row-fluid well" style="margin-top:-10px;padding:0px;">'
				    		    +'<a class="icon-remove pull-right" id="linkedin_plugin_delete" style="cursor:pointer; color: #FF00FF"></a>'
				    		    +'<div class="span3" style=" margin-right:3%">'
				    		           +'<img src=' + data.picture + ' style=" display:inline; float:left; margin-right:2px; margin-top:5px; padding:0px 5px;cursor:pointer; color: #FF00FF"/>'
				    		    +'</div>'
				    			+'<div class="span8">'
				    			       +'<h4 style="color:blue"><a href=\"' + data.url + '\" target="_blank">@' + data.name + '</a></h4>'
				    			       +'<span style="font-size:10px; margin-bottom:2px;">' + data.summary + ',<br/> ' + data.location +',<br/>' + data.num_connections + 'connections ,<br/></span><br/><br/>'
				    			+'</div>'
				    		+'</div>');
    });	
    
    
    // delete linkedin profile
    $('#linkedin_plugin_delete').die().live('click',function(event){
    	 event.preventDefault();
    	 agile_crm_delete_widget_property(LINKEDIN_PLUGIN_NAME);
    	 
    });
}