/*
 * Global values of each step.   
 */

var Is_Profile_Guider_Closed = false;
var Profile_Settings = {
		"Email" : "",
		//"User_invited" : "#users",
		//"Widgets" : 10
		//"Share" : "#",
}

var Profile_Setup_Messages = {};

Profile_Setup_Messages.Welcome =  "Welcome to Agile - the next generation CRM. I will be your tour guide.<a href='#' id='noty-welcome-user' style='text-decoration: none;'> Let's get you started."
Profile_Setup_Messages.Email = "Shake Hands. <a href='#email' style='text-decoration: none;'> Let's sync your emails first</a>. It's simple and secure.";
Profile_Setup_Messages.User_invited = "Emails will show up in the awesome timeline. It's time to invite your colleague"; 
Profile_Setup_Messages.Share = "Are you liking Agile? Spread the love."; 

// Initial percentage after first time login
var Initial_Total = 65;

var Profile_Info = {
		"Welcome" : false,
		"Email" : false,
		//"User_invited" : false,
		//"Widgets" : false,
		"total" : Initial_Total
};

// Calculate based on tags added in 'OUR' domain
function calculate_profile()
{

	// Get tags from global contact
	var tags = Agile_Contact.tags;
	if(!tags)
		return Profile_Info;
	
	
	var total = Initial_Total;
	
	var is_first_time_user = false;
	$.each(Profile_Settings, function(key, value){
		var temp_key = key.indexOf("_") != -1 ? key.replace("_", " ") : key;

		if(tags.indexOf(temp_key) != -1)
		{
			Profile_Info[key] = true;
			total = total + value;
			is_first_time_user = true;
			return;
		}
		
		Profile_Info[key] = false;
	});
	
	if(is_first_time_user)
	{
		Profile_Info["Welcome"] = is_first_time_user;	
	}
	
	Profile_Info["total"] = total;
	
	return Profile_Info
	
}

function set_profile_meter()
{
	var profile_stats = calculate_profile();
	console.log(profile_stats);

  	remove_profile_noty();
   	$.each(profile_stats, function(key, value){
   		if(value == false)
   		{
   			var json = {};
   			json.message = Profile_Setup_Messages[key];
   			json.route = Profile_Settings[key];
   			show_noty_on_top_of_panel(json);
   			return false;
   		}
   	});
   	
 
//	show_noty_on_top_of_panel(profile_stats);
//	$("#profile-meter").html(getTemplate("profile-meter", profile_stats));
}



function show_noty_on_top_of_panel(content)
{
	if(Is_Profile_Guider_Closed)
		return;
	
	$('body').find('#wrap').find('#notify-container').remove();
	$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top','0px'); 
  	$('body').find('#wrap').find('#agilecrm-container').css('padding-top','60px');

   	$('body').find('#wrap').find('#notify-container').remove();
			$('body').find('#wrap').prepend(getTemplate("sticky-noty", content));
			$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top','34px');
			$('body').find('#wrap').find('#agilecrm-container').css('padding-top','96px');
}		

function remove_profile_noty() {
	$('body').find('#wrap').find('#notify-container').remove();
	$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top','0px'); 
  	$('body').find('#wrap').find('#agilecrm-container').css('padding-top','60px');
}

$(function(){
	$('span.notify-close').die().live('click' , function(){
		Is_Profile_Guider_Closed = true;
        $(this).parent().slideUp("slow", function () {
       	 $('body').find('#wrap').find('.navbar-fixed-top').css('margin-top','0px'); 
       	 $('body').find('#wrap').find('#agilecrm-container').css('padding-top','60px');
       });
	}); 
	
	$('#noty-welcome-user').die().live('click', function(e) {
		e.preventDefault();
		delete Profile_Info["Welcome"];
		set_profile_meter();
		
	})	
});