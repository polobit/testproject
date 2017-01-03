$(function(){
	showLinkedinMatchingProfilesBasedOnName();
});

/**
 * Fetches matching profiles from LinkedIn based on current contact
 * first name and last name
 */
function showLinkedinMatchingProfilesBasedOnName(){
	var contact_image = agile_crm_get_contact_property("image");
	var name = "";
	if (agile_crm_get_contact_property("first_name"))
		name = name + agile_crm_get_contact_property("first_name");
	if (agile_crm_get_contact_property("last_name"))
		name = name + " " + agile_crm_get_contact_property("last_name");

	var evt = document.createEvent('Event');
	evt.initEvent('myCustomEvent', true, false);
	document.dispatchEvent(evt);
}
function onLoadHandler(){
	var ifrm = document.getElementById("linkedin-iframe");
    ifrmDc = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;       
	var target = ifrmDc.document.getElementById("search-box");
	target.innerHTML = name;
}
