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
	
	getLinkedinMatchingProlfiles(plugin_id, function(data){
		
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
                	 
                	 el = el.concat("<img  rel=\"popover\" data-content=\" <div class='span5' style='margin-left:-20px;'><div class='span1'><img style='width:55px;height:55px;' src=" + object.picture 
                    		 + "></img></div><div class='span3' style='text-align: justify;vertical-align: middle;'><b style='color:#069;font-size:15px;'>" 
                    		 + object.name + " </b><br/>" + object.location +"<br/>" + object.num_connections + " Connections</div></div><br/><p style='text-align: justify;font-style: italic;'>"
                    		 + object.summary+" </p>\" data-original-title=\" Linked Profile\"class=\"linkedinImage thumbnail \" id=" 
                    		 + object.id + " src =\" "+ object.picture + " \"style=\"width: 55px;height: 55px; display:inline-block; margin-right:2px; margin-bottom:2px; cursor:pointer;\" ></img>");
                 
                 });
              });
            
             $('#Linkedin').html(el);
         
     });
	
	// Display to Linkedin profile details on mouseover and saves on click
	$(".linkedinImage").die().live('mouseover' ,function() {
		
		 var id = $(this).attr('id');
		 var linkedin_image = $(this).attr('src');
		 $('#'+id).popover({placement:'left'});
		 
		 $('#'+id).die().live('click', function(e){
			 e.preventDefault();
			 $('#'+id).popover('hide');
			    if (id) 
			    	{
				    	// To ask user to add profile pic to contact image
			    		var modal = $('<div id="linkedin-image-save-modal" class="modal fade in" >'
			    				          +'<div class="modal-header" ><a href="#" data-dismiss="modal" class="close">&times;</a>'
			    				          +'<h3>Add Image</h3></div>'
			    				          +'<div class="modal-body"><p>You are about to add Image to contact</p>'
			    				                +'<p>Do you want to proceed?</p>'
			    				          +'</div>'
			    				          +'<div class="modal-footer"><a href="#" id="save_linkedin_image" class="btn btn-primary">Yes</a>'
			    				                 +'<a  href="#" class="btn close" data-dismiss="modal" >No</a>'
			    				          +'</div>'
			    				      +'</div>');
			    		if($('#linkedin-image-save-modal').size() == 0)
			    		      $('#content').append(modal);
			    		$('#linkedin-image-save-modal').modal('show');
			    		agile_crm_save_widget_property(LINKEDIN_PLUGIN_NAME, id);
			    		showLinkedinProfile(id, plugin_id)
			    	}
		 });
		 // Confirmation for saving image to contact 
		 $('#save_linkedin_image').die().live('click', function(e){
			 e.preventDefault();
			 agile_crm_update_contact("image", linkedin_image);
			 $('#linkedin-image-save-modal').modal('hide');
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

//Get twitter matching profiles from cookie or from Linkedin
function getLinkedinMatchingProlfiles(plugin_id, callback)
{
	// Get contact id to save social results of a particular id
	var contact_id = agile_crm_get_contact()['id'];

	// Read from cookie 
	var data = localStorage.getItem('Agile_linkedin_matches_' + contact_id);
	
	// If cookie is not available fetch results from twitter
	if(!data)
		{
			$.getJSON("/core/api/widgets/linkedin/" + agile_crm_get_contact()['id'] + "/" + plugin_id, function (data) {
					
				// Save social results in cookie of particular contact
				localStorage.setItem('Agile_linkedin_matches_' + contact_id, JSON.stringify(data));
				
					// Call back to show twitter matching profiles from cookie
					if (callback && typeof(callback) === "function") {
						
						// execute the callback, passing parameters as necessary
						callback(data);
					}
			});
		}
	else
		{
			console.log("from cache");
			// Call back to show twitter matching profiles from cookie
			if (callback && typeof(callback) === "function") {
			
				// execute the callback, passing parameters as necessary
				callback(JSON.parse(data));
			}
		}	
}

