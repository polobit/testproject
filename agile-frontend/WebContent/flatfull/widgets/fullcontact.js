 var fullContactObj = {};

function warpFullContactToAgileContact(agileContact, fullContact){
	var result = "";
	var resultArray = [];
	if(agileContact && fullContact){
		//Agile contact data;
		var properties = agileContact.properties;
		var newProperties = [];

		//Data from full contact.
		var contactInfo = fullContact["contactInfo"];
		var PhotosArray = fullContact["Photos"];
		var organisationArray = fullContact["organizations"];


		// Agile Contact fields.
		var first_name;
		var last_name;
		var company;
		var email; //- home, work
		var phone; //- home, work, mobile
		var website; // SKYPE, TWITTER, FACEBOOK, GOOGLE-PLUS, LINKEDIN, URL, YOUTUBE, FEED, GITHUB
		var address;
		var photo; //- image

		// console.log("AgileContact **** 2 ");
		// console.log(agileContact);

		// console.log("fullContact **** 2 ");
 		// console.log(fullContact);

		// 
		// ------------------------ Full contact fields ---------------------
		// 
		// Photos: Array - for profile pic ( linkedin, twitter, facebook, other)
		// contactInfo - Chats Array - skype, gtalk, googletalk
		// contactInfo - websites Array - websites										
		// demographics- locationDeduced - country, state, city
		// socialProfiles - youtube, facebook, twitter, GooglePlus, LinkedIn, xing, GitHub, Flickr

		//newArray.push.apply(newArray, newCode);

		// First name and last name.
		if(contactInfo){
			first_name = getPropertyValue(properties, "first_name");			
			if(!first_name){				
				if(contactInfo["givenName"]){
					first_name = contactInfo["givenName"];
					resultArray.push("First Name");
					newProperties.push(setPropertyForContact("first_name", first_name, null));
				}else{
					first_name = contactInfo["fullName"];
					resultArray.push("First Name");
					newProperties.push(setPropertyForContact("first_name", first_name, null));
				}
			}

			last_name = getPropertyValue(properties, "last_name");
			if(!last_name){
				if(contactInfo["familyName"]){
					last_name = contactInfo["familyName"];	
					resultArray.push("Last Name");
					newProperties.push(setPropertyForContact("last_name", last_name, null));
				}				
			}
		} 

		// Company details
		if(organisationArray){
			company = getPropertyValue(properties, "company");
			if(!company){				
				$.each(organisationArray, function (index,value) {
			        var companyObj = organisationArray[index];
				    if(companyObj["isPrimary"] == true){
					  company = companyObj["name"];
					  resultArray.push("Company");
					  newProperties.push(setPropertyForContact("company", company, null));
				    }	
				});
			}
		}

		if(newProperties.length > 0){
			agile_crm_save_contact_properties(newProperties);			

			$.each(resultArray, function(index,value){
				result += "<p>"+value+"</p>";
			});
		}else{
			alert("nothing");
		}

	}

 	return result;
}

function loadFullContactData(apikey, emailID){	
	head.js(LIB_PATH + 'lib/jquery.fullcontact.2.2.js', function(){		
		var testEmail = "bart@fullcontact.com";
		$.fullcontact.emailLookup(apikey, testEmail, function(contactObj){			
			if(contactObj){	
 				var status = contactObj.status;
 				var displayData = "";
 				if(status == 200){ 					
 					var currentContactJson = App_Contacts.contactDetailView.model.toJSON(); 					
 					displayData = warpFullContactToAgileContact(currentContactJson, contactObj);

 					if(displayData.length > 0){
 						displayData = "<div class='p-sm'>"+displayData+"</div>";
 					}else{
 						displayData = "<div class='p-sm'>Nothing to update</div>";
 					}
 				}else{
 					displayData = "<div class='p-sm'>"+contactObj.message+"</div>";
 				}
				$('#FullContact').html(displayData);
			}            
        });
	});
}

function startFullContactWidget(contact_id){
	//console.log("FullContact loaded : "+contact_id);	
	fullContactObj = {};

	FULLCONTACT_PLUGIN_NAME = "FullContact";

	var fullcontact_widget = agile_crm_get_widget(FULLCONTACT_PLUGIN_NAME);
	var fullcontact_widget_prefs = JSON.parse(fullcontact_widget.prefs);
	FULLCONTACT_Plugin_Id = fullcontact_widget.id;
	var fcApiKey = fullcontact_widget_prefs["fullcontact_apikey"];
	var contact_email = agile_crm_get_contact_property('email');

	console.log('In FullContact');
	console.log(fullcontact_widget);

	if(contact_email){		
		loadFullContactData(fcApiKey, contact_email);
	}else{
		$('#FullContact').html('<div>Email not found for this contact.</div>');	
	}
}

function setPropertyForContact(propertyName, value, subtype){
	var propertyObj = {};

	if(propertyName){
		propertyObj.name = propertyName;
		if(value){
			propertyObj.value = value;
		}
		if(subtype){
			propertyObj.subtype = subtype;
		}
		propertyObj.type = "SYSTEM";
	}

	return propertyObj;
}