$(function(){
	showLinkedinMatchingProfilesBasedOnName();

	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	// Listen to message from child window
	eventer(messageEvent,function(e) {
	    var key = e.message ? "message" : "data";
	    var data = e[key];
	    console.log(data.image_src+"received==="+data.p_link+"====="+data.p_phone+"===="+data.p_email+"===="+data.p_twitter);

	    var contact_image = agile_crm_get_contact_property("image");
	    var propertiesArray = [{ "name" : "website", "value" : data.p_link, "subtype" : "LINKEDIN" }];
	    var website_url = data.p_url;
	    if(website_url){
	    	var w_urls = website_url.split(",");
	    	for(var i=0;i<w_urls.length;i++){
	    		if(!checkPropertyValue("website",w_urls[i].trim(),"URL")){
	    			propertiesArray.push({ "name" : "website", "value" : w_urls[i].trim(),"subtype" : "URL"});
	    		}
	    	}
	    }
	    var twitter_profile = data.p_twitter;
	    if(twitter_profile){
	    	var t_profiles = twitter_profile.split(",");
	    	for(var i=0;i<t_profiles.length;i++){
	    		if(!checkPropertyValue("website","@"+t_profiles[i].trim(),"TWITTER")){
	    			propertiesArray.push({ "name" : "website", "value" : "@"+t_profiles[i].trim(),"subtype" : "TWITTER"});
	    		}
	    	}
	    }
	    var l_email = data.p_email;
	    if(l_email){
	    	var c_email = l_email.split(",");
	    	for(var i=0;i<c_email.length;i++){
		    	if(!checkPropertyValueWithOutSubType("email",c_email[i].split(" (")[0].trim())){
					propertiesArray.push({ "name" : "email", "value" : c_email[i].split(" (")[0].trim()});
				}
			}
		}
		var l_phone = data.p_phone;
		if(l_phone){
			var p_no = l_phone.split(",");
			for(var i=0;i<p_no.length;i++){
				if(!checkPropertyValueWithOutSubType("email",p_no[i].split(" (")[0].trim())){
					propertiesArray.push({ "name" : "phone", "value" : p_no[i].split(" (")[0].trim()});
				}
			}
		}
		if (!contact_image && data.image_src){
			var linkedin_image = data.image_src;
			propertiesArray.push({ "name" : "image", "value" : linkedin_image});
		}
		verifyUpdateImgPermission(function(can_update){
			if(can_update){
				agile_crm_update_contact_properties(propertiesArray);
			}
		});
	},false);
});
/**
 * Fetches matching profiles from LinkedIn based on current contact
 * first name and last name
 */
function showLinkedinMatchingProfilesBasedOnName(){
	console.log(navigator.userAgent+"user agent");
	if(navigator.userAgent.indexOf("Chrome") != -1){
		var evt = document.createEvent('Event');
		evt.initEvent('plugincheck', true, false);
		document.dispatchEvent(evt);
		if($("#contact_name").attr("data-plugin") == "installed"){
			var linkedin_profile = agile_crm_get_contact_property_by_subtype("website","LINKEDIN");
			console.log(linkedin_profile+"linkedin profile");
		    if(!linkedin_profile){
				var contact_image = agile_crm_get_contact_property("image");
				var name = "";
				if (agile_crm_get_contact_property("first_name"))
					name = name + agile_crm_get_contact_property("first_name");
				if (agile_crm_get_contact_property("last_name"))
					name = name + " " + agile_crm_get_contact_property("last_name");

				var evt = document.createEvent('Event');
				evt.initEvent('myCustomEvent', true, false);
				document.dispatchEvent(evt);
			}else{
				console.log(linkedin_profile+"linkedin profile");
				var source = linkedin_profile;
				$("#Linkedin").html("<iframe id='linkedin-iframe' src='"+source+"' height='500px' width='250px' style='overflow: hidden;' frameBorder='0'><p>Your browser does not support iframes.</p></iframe>");
			}
		}else{
			$("#Linkedin").html("<div class='col-md-12'>"+_agile_get_translated_val('widgets','install-plugin')+"</div>");
		}
	}else{		
		$("#Linkedin").html("<div class='col-md-12'>"+_agile_get_translated_val('widgets','linkedin-browser-info')+"</div>");
	}
}
function checkPropertyValue(propertyName,propValue,subtype){
	var contact_model = App_Contacts.contactDetailView.model;
	var properties = contact_model.get('properties');
	var property_value;
	$.each(properties, function(index, property){
		if (property.name == propertyName && property.subtype == subtype && property.value == propValue){
			property_value = property.value;
			return false;
		}
	});
	if (property_value){
		return true;
	}else{
		return false;
	}
}
function checkPropertyValueWithOutSubType(propertyName,propValue){
	var contact_model = App_Contacts.contactDetailView.model;
	var properties = contact_model.get('properties');
	var property_value;
	$.each(properties, function(index, property){
		if (property.name == propertyName && property.value == propValue){
			property_value = property.value;
			return false;
		}
	});
	if (property_value){
		return true;
	}else{
		return false;
	}
}
/*function loadframe(){
	console.log("load frmae valueee");
	var node = document.getElementById('contact_name');
	var contactname = node.textContent;
	var iframeWin = document.getElementById("linkedin-iframe").contentWindow;
	iframeWin.postMessage(contactname, "https://touch.www.linkedin.com/#search");
}
function loadframeWithoutHeaders(){
	var iframeWin = document.getElementById("linkedin-iframe").contentWindow;
	iframeWin.postMessage("loadwithoutheaders", "https://touch.www.linkedin.com/#search");
}*/