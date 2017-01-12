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
function loadframe(){
	console.log("load frmae valueee");
	var node = document.getElementById('contact_name');
	var contactname = node.textContent;
	var iframeWin = document.getElementById("linkedin-iframe").contentWindow;
	iframeWin.postMessage(contactname, "https://touch.www.linkedin.com/#search");
}