/*
 * Global values of each step. 
 */
var PROFILE_SETTINGS = {
		"Email" : 15,
		"User_invited" : 10,
		"Widgets" : 10
}

// Initial percentage after first time login
var INITIAL_TOTAL = 65;

// Calculate based on tags added in 'OUR' domain
function calculateProfile()
{
	var profile_info = {
			"Email" : false,
			"User_invited" : false,
			"Widgets" : false,
			"total" : INITIAL_TOTAL
	};
	
	// Get tags from global contact
	var tags = AGILE_CONTACT.tags;
	if(!tags)
		return profile_info;
	
	
	var total = INITIAL_TOTAL;
	
	$.each(PROFILE_SETTINGS, function(key, value){
		var temp_key = key.indexOf("_") != -1 ? key.replace("_", " ") : key;
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
	
	$("#profile-meter").html(getTemplate("profile-meter", profile_stats));
}