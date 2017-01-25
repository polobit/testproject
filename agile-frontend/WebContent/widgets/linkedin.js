$(function(){
	showLinkedinMatchingProfilesBasedOnName();
	
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	// Listen to message from child window
	eventer(messageEvent,function(e) {
	    var key = e.message ? "message" : "data";
	    var data = e[key];
	    console.log(data.city+"========="+data.state+"========="+data.country+"========="+data.image_src+"received==="+data.p_link+"====="+data.p_phone+"===="+data.p_email+"===="+data.p_twitter);
	    if(data == "loadsearchpage"){
	    	var source = "https://www.linkedin.com/search/results/people/?keywords="+$("#contact_name").text().trim()+"&origin=GLOBAL_SEARCH_HEADER";
			$("#linkedin-iframe").get(0).contentWindow.location.replace(source);
	    }else{
		    var contact_image = agile_crm_get_contact_property("image");
		    var propertiesArray = [{ "name" : "website", "value" : data.p_link, "subtype" : "LINKEDIN" ,"type" : "SYSTEM"}];
		    var website_url = data.p_url;
		    if(website_url){
		    	var w_urls = website_url.split(",");
		    	for(var i=0;i<w_urls.length;i++){
		    		if(!checkPropertyValue("website",w_urls[i].trim(),"URL")){
		    			propertiesArray.push({ "name" : "website", "value" : w_urls[i].trim(),"subtype" : "URL","type" : "SYSTEM"});
		    		}
		    	}
		    }
		    var twitter_profile = data.p_twitter;
		    if(twitter_profile){
		    	var t_profiles = twitter_profile.split(",");
		    	for(var i=0;i<t_profiles.length;i++){
		    		if(!checkPropertyValue("website","@"+t_profiles[i].trim(),"TWITTER")){
		    			propertiesArray.push({ "name" : "website", "value" : "@"+t_profiles[i].trim(),"subtype" : "TWITTER","type" : "SYSTEM"});
		    		}
		    	}
		    }
		    var l_email = data.p_email;
		    if(l_email){
		    	var c_email = l_email.split(",");
		    	for(var i=0;i<c_email.length;i++){
			    	if(!checkPropertyValueWithOutSubType("email",c_email[i].split(" (")[0].trim())){
						propertiesArray.push({ "name" : "email", "value" : c_email[i].split(" (")[0].trim(),"type" : "SYSTEM"});
					}
				}
			}
			var l_phone = data.p_phone;
			if(l_phone){
				var p_no = l_phone.split(",");
				for(var i=0;i<p_no.length;i++){
					if(!checkPropertyValueWithOutSubType("email",p_no[i].split(" (")[0].trim())){
						propertiesArray.push({ "name" : "phone", "value" : p_no[i].split(" (")[0].trim(),"type" : "SYSTEM"});
					}
				}
			}
			if (!contact_image && data.image_src){
				var linkedin_image = data.image_src;
				propertiesArray.push({ "name" : "image", "value" : linkedin_image});
			}
			var address = {};
			var contact_address = agile_crm_get_contact_property("address");
			if(!contact_address){
				if(data.city){
					var l_city = data.city;
					address.city = l_city.trim();
				}
				if(data.state){
					var l_state = data.state;
					address.state = l_state.trim();
				}
				/*if(data.country){
					var l_country = data.country
					address.countryname = l_country.trim();
				}*/
				if(address){
					propertiesArray.push({ "name" : "address", "value" : JSON.stringify(address),"type" : "SYSTEM"});
				}
			}
			if(data.title){
				if(!checkPropertyValueWithOutSubType("title",data.title)){
					propertiesArray.push({ "name" : "title", "value" : data.title,"type" : "SYSTEM"});
				}
			}
			verifyUpdateImgPermission(function(can_update){
				if(can_update){
					agile_crm_update_contact_properties_linkedin(propertiesArray);
				}
			});
		}
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
/**
 * Updates a contact with the list of property name and its value specified in
 * propertiesArray. If property name already exists with the given then replaces
 * the value, if property is new then creates a new field and saves it
 * 
 * @param propertiesArray
 *            Array of the properties to be created/updated
 * @param callback
 */
function agile_crm_update_contact_properties_linkedin(propertiesArray, callback){	
	var contact_model = App_Contacts.contactDetailView.model;
	var contactId = contact_model.id;
	var properties = contact_model.toJSON()['properties'];
	for ( var i in propertiesArray){
		var flag = false;
		$.each(properties, function(index, property){
			if (property.name == propertiesArray[i].name){
				flag = true;
				if (propertiesArray[i].subtype){
					if (propertiesArray[i].subtype == property.subtype)
						property.value = propertiesArray[i].value;
					else
						flag = false;
				}
				else
					property.value = propertiesArray[i].value;

				// break each if match is found
				return false;
			}
		});
		// If flag is false, given property is new then new field is created
		if (!flag){
			if(propertiesArray[i].type != "SYSTEM"){
				properties.push({ "name" : propertiesArray[i].name, "value" : propertiesArray[i].value, "subtype" : propertiesArray[i].subtype, "type" : "CUSTOM" });
			}else{
				properties.push({ "name" : propertiesArray[i].name, "value" : propertiesArray[i].value, "subtype" : propertiesArray[i].subtype, "type" : "SYSTEM" });
			}
		}

	}
	// If property is new then new field is created
	contact_model.set({ "properties" : properties });
	// Save model
	var model = new Backbone.Model();
	model.url = "core/api/contacts";
	model.save(contact_model.toJSON(), {
		success : function(data){
			if(data){
				console.log("Contact ID ****** ");				
				var currentContactId = App_Contacts.contactDetailView.model.id;
				console.log(currentContactId + " : "+ contactId);
				if(currentContactId && contactId == currentContactId){
					console.log("fullcontact Updated **** ");
					App_Contacts.contactDetailView.model = data;

					var contactDetailsBlock = new Base_Model_View({ 
						template : "contact-details-block",					
						data : App_Contacts.contactDetailView.model					
					});

					var block_el = contactDetailsBlock.render(true).el;
	      			$('#contact-details-block').html($(block_el)); 
	      		}
	      	}
		}
	});
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