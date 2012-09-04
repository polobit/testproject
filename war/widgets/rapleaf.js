var RAPLEAF_PLUGIN_NAME = "Rapleaf";
var RAPLEAF_PLUGIN_HEADER = '<div style=" margin-bottom:20px " class="bottom-line" style="display:inline-block;"><img src="widgets/twitter-logo-small.png" style="padding-right:5px; padding-bottom:1px; height:15px;"></img><label style="display:inline">Rapleaf</label></div>'

$(function () {
	
	// Get the Plugin id
	var plugin_id = agile_crm_get_plugin_id(RAPLEAF_PLUGIN_NAME);
	if(!plugin_id)
	{
		return;
	}

	// Get Plugin Prefs
	var plugin_prefs = agile_crm_get_plugin_prefs(RAPLEAF_PLUGIN_NAME);
	// If not found - first time usage - show oauth setup
	if(plugin_prefs == undefined)
	{
		setupRapleafOAuth(plugin_id);
		return;
	}
	
	// Get Contact Prefs for this widget
	var rapleaf_id = agile_crm_get_widget_property(RAPLEAF_PLUGIN_NAME);

	// If property with Rapleaf do not exist, all the matching profiles
    if (!rapleaf_id) 
    {
    	showRapleafDetails(plugin_id);
    	return;
    }
  
});

function setupRapleafOAuth(plugin_id)
{
   // var callbackURL = window.location.href;
    $('#Rapleaf').html(RAPLEAF_PLUGIN_HEADER +'<input type="text" id="rapleaf_api_key" class="input-medium" placeholder="API Key" value=""><br/><button id="save_api_key" class="btn"><a href=" + url + ">Save</button>');
    $('#save_api_key').die().live('click', function(e){
		 e.preventDefault();
		 var api_key=$("#rapleaf_api_key").val();
		 //api_key="f3e71aadbbc564750d2057612a775ec6";
		 agile_crm_save_plugin_prefs(RAPLEAF_PLUGIN_NAME, api_key);
	 });
}

function showRapleafDetails(plugin_id)
{	
	$('#Rapleaf').html(RAPLEAF_PLUGIN_HEADER + '<img src=\"img/1-0.gif\"></img>');
	
	var email=agile_crm_get_contact_property('email');
    var callbackURL = window.location.href;
   console.log(email);
	//var url = 'https://personalize.rapleaf.com/v4/dr?api_key='+ agile_crm_get_plugin_prefs(RAPLEAF_PLUGIN_NAME)+'&email='+ encodeURIComponent(email) +'&callback=?';
	
   var url = "core/api/widgets/rapleaf/"+agile_crm_get_plugin_prefs(RAPLEAF_PLUGIN_NAME)+"/"+email;
   
	$.getJSON(url, function (data) {
		console.log(data);
		var el =  RAPLEAF_PLUGIN_HEADER;
		
	});
		/*	// If no matching profiles found
	     if (data.length == 0) {
	      	 $('#Rapleaf').html(RAPLEAF_PLUGIN_HEADER  + "No Matches Found");
	       	 return;
	      }
		
		// If matching profiles available
		
             $.each(data, function (key, value) {
                 
            	 if (!isArray(value)) 
                	 value = [value]
                 
                 $.each(value, function (index, object) {
                     el = el.concat("<img  rel=\"popover\" data-content=\"Location : " + object.location + "<br/>connection :" + object.num_connections + " \" data-original-title=\"" + object.name + "\"class=\"twitterImage thumbnail \" id=" + object.id + " src =\" " + object.picture + " \"style=\"width: 50px;height: 50px; display:inline-block; margin-right:2px; margin-bottom:2px; cursor:pointer; color: #FF00FF   \" ></img>");
                 });
             });
             $('#Rapleaf').html(el);
		

     });*/

}
