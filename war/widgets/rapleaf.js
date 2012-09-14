var RAPLEAF_PLUGIN_NAME = "Rapleaf";
var RAPLEAF_PLUGIN_HEADER = '<div style=" margin-bottom:20px " class="bottom-line" style="display:inline-block;"></div>'

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
    $('#Rapleaf').html(RAPLEAF_PLUGIN_HEADER +'<div><p><label>Enter Your API key</label>'
    										 +'<input type="text" id="rapleaf_api_key" class="input-medium" placeholder="API Key" value=""></input></p>'
    		                                 +'<button id="save_api_key" class="btn"><a href="+url+">Save</a></button>'
    		                                 +'<p>Don\'t have an API key ?<a href="https://www.rapleaf.com/developers/api_access">SignUp</a></p></div>');
    
    $('#save_api_key').die().live('click', function(e){
		 e.preventDefault();
		 var api_key = $("#rapleaf_api_key").val();
		 //api_key = "f3e71aadbbc564750d2057612a775ec6";
		 agile_crm_save_widget_prefs(RAPLEAF_PLUGIN_NAME, api_key);
		 showRapleafDetails(plugin_id);
	 });
}

function showRapleafDetails(plugin_id)
{	
	
	$('#Rapleaf').html(RAPLEAF_PLUGIN_HEADER + '<img src=\"img/1-0.gif\"></img>');
	
	var email = agile_crm_get_contact_property('email');
    var url = "core/api/widgets/rapleaf/"+agile_crm_get_plugin_prefs(RAPLEAF_PLUGIN_NAME)+"/"+email;
   
	$.getJSON(url, function (data) {
		//console.log(data);
		//&fields=gender,age,education,marital_status
		$('#Rapleaf').html(RAPLEAF_PLUGIN_HEADER + '<div></div>');
		if(data.gender == "Female")
			$('#Rapleaf').append('<img style="float:left;width:30px;height:30px;" src=\"img/user_female.png\"></img>' );
		else
			$('#Rapleaf').append('<img style="float:left;width:30px;height:30px;" src=\"img/user_male.png\"></img>' );
		
		$.each(data, function(index, value) { 
			if(index != "result"){
			  $('#Rapleaf').append('<li style="text-transform:capitalize;">'+ index +':'+ value +'</li>' );
			}
		});
	});

}


/*
   var first=agile_crm_get_contact_property('first_name');
   var last=agile_crm_get_contact_property('last_name');
   var url = "core/api/widgets/rapleaf/"+agile_crm_get_plugin_prefs(RAPLEAF_PLUGIN_NAME)+"/"+email+"/"+first+"/"+last;
 */

