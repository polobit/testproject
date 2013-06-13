/*
 * Global values of each step. 
 */

var IS_PROFILE_GUIDER_CLOSED = false;
var PROFILE_SETTINGS = {
		"Email" : "#email",
		//"User_invited" : "#users",
		//"Widgets" : 10
		//"Share" : "#",
}

var PROFILE_SETUP_MESSAGES = {};

PROFILE_SETUP_MESSAGES.Welcome =  "Welcome to Agile - the next generation CRM. I will be your tour guide.<a href='#' id='noty-welcome-user' style='text-decoration: none;'> Let's get you started."
PROFILE_SETUP_MESSAGES.Email = "Shake Hands. Let's sync your emails first. It's simple and secure.";
PROFILE_SETUP_MESSAGES.User_invited = "Emails will show up in the awesome timeline. It's time to invite your colleague"; 
PROFILE_SETUP_MESSAGES.Share = "Are you liking Agile? Spread the love."; 

// Initial percentage after first time login
var INITIAL_TOTAL = 65;

var PROFILE_INFO = {
		"Welcome" : false,
		"Email" : false,
		//"User_invited" : false,
		//"Widgets" : false,
		"total" : INITIAL_TOTAL
};

// Calculate based on tags added in 'OUR' domain
function calculateProfile()
{

	// Get tags from global contact
	var tags = AGILE_CONTACT.tags;
	if(!tags)
		return PROFILE_INFO;
	
	
	var total = INITIAL_TOTAL;
	
	var is_first_time_user = false;
	$.each(PROFILE_SETTINGS, function(key, value){
		var temp_key = key.indexOf("_") != -1 ? key.replace("_", " ") : key;

		if(tags.indexOf(temp_key) != -1)
		{
			PROFILE_INFO[key] = true;
			total = total + value;
			is_first_time_user = true;
			return;
		}
		
		PROFILE_INFO[key] = false;
	});
	
	if(is_first_time_user)
	{
		PROFILE_INFO["Welcome"] = is_first_time_user;	
	}
	
	PROFILE_INFO["total"] = total;
	
	return PROFILE_INFO
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
	if(IS_PROFILE_GUIDER_CLOSED)
		return;
	
	$('body').find('#wrap').find('#notify-container').remove();
	$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top','0px'); 
  	$('body').find('#wrap').find('#agilecrm-container').css('padding-top','60px');

   	$('body').find('#wrap').find('#notify-container').remove();
			$('body').find('#wrap').prepend(getTemplate("sticky-noty", content));
			$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top','34px');
			$('body').find('#wrap').find('#agilecrm-container').css('padding-top','96px');
}		

function removeProfileNoty() {
	$('body').find('#wrap').find('#notify-container').remove();
	$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top','0px'); 
  	$('body').find('#wrap').find('#agilecrm-container').css('padding-top','60px');
}

$(function(){
	$('span.notify-close').die().live('click' , function(){
		IS_PROFILE_GUIDER_CLOSED = true;
        $(this).parent().slideUp("slow", function () {
       	 $('body').find('#wrap').find('.navbar-fixed-top').css('margin-top','0px'); 
       	 $('body').find('#wrap').find('#agilecrm-container').css('padding-top','60px');
       });
	}); 
	
	$('#noty-welcome-user').die().live('click', function(e) {
		e.preventDefault();
		delete PROFILE_INFO["Welcome"];
		setProfileMeter();
		
	})	
});