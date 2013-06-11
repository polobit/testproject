/*
 * Global values of each step. 
 */
var PROFILE_SETTINGS = {
		"Email" : "#email",
		"User_invited" : "#users",
		//"Widgets" : 10
		//"Share" : "#",
}

var PROFILE_SETUP_MESSAGES = {};

PROFILE_SETUP_MESSAGES.Email = "Sync your email with Agile";
PROFILE_SETUP_MESSAGES.User_invited = "Invite new colleagues to Agile"; 
PROFILE_SETUP_MESSAGES.Share = "Spread the love"; 

// Initial percentage after first time login
var INITIAL_TOTAL = 65;

// Calculate based on tags added in 'OUR' domain
function calculateProfile()
{
	var profile_info = {
			"Email" : false,
			"User_invited" : false,
			//"Widgets" : false,
			"total" : INITIAL_TOTAL
	};
	
	// Get tags from global contact
	var tags = AGILE_CONTACT.tags;
	if(!tags)
		return profile_info;
	
	
	var total = INITIAL_TOTAL;
	
	$.each(PROFILE_SETTINGS, function(key, value){
		var temp_key = key.indexOf("_") != -1 ? key.replace("_", " ") : key;
		console.log(temp_key);
		console.log(tags);
		if(tags.indexOf(temp_key) != -1)
		{
			profile_info[key] = true;
			total = total + value;
			return;
		}
		
		profile_info[key] = false;
	});
	
	profile_info["total"] = total;
	
	return profile_info
}

function setProfileMeter()
{
	var profile_stats = calculateProfile();
	console.log(profile_stats);

  	removeProfileNoty();
  	
   	$.each(profile_stats, function(key, value){
   		if(value == false)
   		{
   			var json = {};
   			json.message = PROFILE_SETUP_MESSAGES[key];
   			json.route = PROFILE_SETTINGS[key];
   			showNotyOnTopOfPanel(json);
   			return false;
   		}
   	});
   	
 
//	showNotyOnTopOfPanel(profile_stats);
//	$("#profile-meter").html(getTemplate("profile-meter", profile_stats));
}



function showNotyOnTopOfPanel(content)
{
	$('body').find('#wrap').find('#notify-container').remove();
	$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top','0px'); 
  	$('body').find('#wrap').find('#agilecrm-container').css('padding-top','60px');

   	$('body').find('#wrap').find('#notify-container').remove();
			$('body').find('#wrap').prepend(getTemplate("sticky-noty", content));
			$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top','35px');
			$('body').find('#wrap').find('#agilecrm-container').css('padding-top','95px');
}		

function removeProfileNoty() {
	$('body').find('#wrap').find('#notify-container').remove();
	$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top','0px'); 
  	$('body').find('#wrap').find('#agilecrm-container').css('padding-top','60px');
}

$(function(){
	$('span.notify-close').die().live('click' , function(){
	      
        $(this).parent().slideUp("slow", function () {
       	 $('body').find('#wrap').find('.navbar-fixed-top').css('margin-top','0px'); 
       	 $('body').find('#wrap').find('#agilecrm-container').css('padding-top','60px');
       });
      
	}); 
});