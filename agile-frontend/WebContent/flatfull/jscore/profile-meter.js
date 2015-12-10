/**
 * Global variable 'Is_Profile_Guider_Closed' is used to check whether user has
 * closed noty bar.
 */
var Is_Profile_Guider_Closed = false;

/*
 * Global values of each step.
 */
var Profile_Settings = {
	"Email" : "",
// "User_invited" : "#users",
// "Widgets" : 10
// "Share" : "#",
}

/**
 * Holds messages to be shown on each step ex: welcome, configuring email,
 * inviting users, sharing
 */
var Profile_Setup_Messages = {};

Profile_Setup_Messages.Welcome = "Welcome to Agile - the next generation CRM. I will be your tour guide.<a href='#' id='noty-welcome-user' style='text-decoration: none;'> Let's get you started."
Profile_Setup_Messages.Email = "Shake Hands. <a href='#email' style='text-decoration: none;'> Let's sync your emails first</a>. It's simple and secure.";
Profile_Setup_Messages.User_invited = "Emails will show up in the awesome timeline. It's time to invite your colleague";
Profile_Setup_Messages.Share = "Are you liking Agile? Spread the love.";

// Initial percentage after first time login
var Initial_Total = 65;

var Profile_Info = {
	"Welcome" : false,
	"Email" : false,
	// "User_invited" : false,
	// "Widgets" : false,
	"total" : Initial_Total
};

// Calculate based on tags added in 'OUR' domain
function calculate_profile() {

	// Get tags from global contact fetched from 'OUR' domain.
	var tags = Agile_Contact.tags;

	// If tags are not empty then return profile_info with basic information
	if (!tags || tags.length == 0)
		return Profile_Info;

	// Gets the initial count to calculate completed percentage (Percentage is
	// not show now)
	var total = Initial_Total;

	// Check to show welcome message or not
	var is_first_time_user = true;

	// Iterates thought each field in Profile_Settings and finds whether tag is
	// available in contact
	$.each(Profile_Settings, function(key, value) {
		// Replaces "_" with space, that is how tag is saved in 'our' domain
		var temp_key = key.indexOf("_") != -1 ? key.replace("_", " ") : key;

		// Checks if tag is available in contact. Sets true in JSON object if
		// tag is available, which indicates that step can be excluded from
		// showing in noty.
		if (tags.indexOf(temp_key) != -1) {
			Profile_Info[key] = true;

			// Calculates complete percentage
			total = total + value;
			is_first_time_user = false;
			return;
		}
	});

	// If user has tags (email, user invited etc) then welcome message is not
	// shown
	if (!is_first_time_user)
		Profile_Info["Welcome"] = !is_first_time_user;

	// Assigns percentage completeness or profile
	Profile_Info["total"] = total;

	return Profile_Info

}

function set_profile_noty() {

}

/**
 * Sets up noty message to be shown. It iterates though profile stats calculated
 * in calculate_profile() method and creates noty template with appropriate
 * message
 */
function set_profile_noty1() {
	console.log(Agile_Contact);
	if (jQuery.isEmptyObject(Agile_Contact))
		return;

	// Gets profile stats
	var profile_stats = calculate_profile();

	// Removes noty before building
	remove_profile_noty();

	$.each(profile_stats, function(key, value) {
		console.log(profile_stats);
		// If value is false, then noty is built with that respective message
		if (value == false) {
			var json = {};
			json.message = Profile_Setup_Messages[key];
			json.route = Profile_Settings[key];
			show_noty_on_top_of_panel(json);
			return false;
		}
	});

}

/**
 * Show noty and arranges home dashbord to adjust accordingly
 * 
 * @param content
 */
function show_noty_on_top_of_panel(content) {
	if (Is_Profile_Guider_Closed)
		return;

	$('body').find('#wrap').find('#notify-container').remove();
	$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top', '0px');
	$('body').find('#wrap').find('#agilecrm-container').css('padding-top',
			'60px');

	$('body').find('#wrap').find('#notify-container').remove();
	
	getTemplate("sticky-noty", content, undefined, function(template_ui){
		if(!template_ui)
			  return;
		$('body').find('#wrap').prepend($(template_ui));
		$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top', '34px');
		$('body').find('#wrap').find('#agilecrm-container').css('padding-top',
				'96px');

	}, null);
}

/**
 * Removes noty and re-arranges the navbar layout by removing 60px padding which
 * is added to show naoty
 */
function remove_profile_noty() {
	$('body').find('#wrap').find('#notify-container').remove();
	$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top', '0px');
	$('body').find('#wrap').find('#agilecrm-container').css('padding-top',
			'60px');
}

$(function() {
	/**
	 * User can exlicitly disable noty in current session. Along with removing
	 * the noty a flag is set, which is checked before showing noty
	 */
	$("#content").on("click", "span.notify-close", function(e) {
				// Flat which indicates user has disables
				Is_Profile_Guider_Closed = true;
				$(this).parent().slideUp(
						"slow",
						function() {
							$('body').find('#wrap').find('.navbar-fixed-top')
									.css('margin-top', '0px');
							$('body').find('#wrap').find('#agilecrm-container')
									.css('padding-top', '60px');
						});
			});

	/**
	 * Removes welcome message and shows next step
	 */
	 $("#content").on("click", "#noty-welcome-user", function(e) {
		e.preventDefault();
		delete Profile_Info["Welcome"];
		set_profile_noty();

	})
});
