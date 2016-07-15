var fullContactObjects = {};

function loadFullContactData(apikey, emailID){	
	head.js('/lib/jquery.fullcontact.2.2.js', function(){		
		var testEmail = "bart@fullcontact.com";
		$.fullcontact.emailLookup(apikey, testEmail, function(contactObj){			
			if(contactObj){	
 				var status = contactObj.status;
 				var displayData = "";
 				if(status == 200){ 					
 					var currentContactJson = App_Contacts.contactDetailView.model.toJSON(); 					 					
 					var resultArray = [];

					//Agile contact data;
					var properties = currentContactJson.properties;
					var newProperties = [];

					//Data from full contact.
					var contactInfo = contactObj["contactInfo"];
					var PhotosArray = contactObj["photos"];
					var organisationArray = contactObj["organizations"];



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
					// console.log(currentContactJson);

					// console.log("fullContact **** 2 ");
			 		// console.log(contactObj);

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
								newProperties.push(setPropertyForContact("first_name", first_name, null, "SYSTEM"));
							}else{
								first_name = contactInfo["fullName"];
								resultArray.push("First Name");
								newProperties.push(setPropertyForContact("first_name", first_name, null, "SYSTEM"));
							}
						}

						last_name = getPropertyValue(properties, "last_name");
						if(!last_name){
							if(contactInfo["familyName"]){
								last_name = contactInfo["familyName"];	
								resultArray.push("Last Name");
								newProperties.push(setPropertyForContact("last_name", last_name, null, "SYSTEM"));
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
								  newProperties.push(setPropertyForContact("company", company, null, "SYSTEM"));
							    }	
							});
						}
					}

					if(PhotosArray){
						photo = getPropertyValue(properties, "image");
						if(!photo){
							var photoObject = {};
							var tempUrl = "";			
							$.each(PhotosArray, function (index,value) {						        
						        tempUrl = value.url;
							    photoObject[value.typeId] = value.url;
							});

							if(photoObject["linkedin"]){
								photo = photoObject["linkedin"];
							}else if(photoObject["twitter"]){
								photo = photoObject["twitter"];
							}else if(photo = photoObject["facebook"]){
								photo = photoObject["facebook"];
							}else{
								photo = tempUrl;
							}							
							resultArray.push("Photo");
							newProperties.push(setPropertyForContact("image", photo, null, "CUSTOM"));
						}
					}


					if(newProperties.length > 0){
						// Reads current contact model form the contactDetailView
						var contact_model = App_Contacts.contactDetailView.model;
						var contactId = contact_model.id;
						// Gets properties list field from contact
						var properties = contact_model.get('properties');

						$.each(newProperties, function(index,value){
							console.log("contact details : *** " + value)
							properties.push(value);
						});

						contact_model.set("properties", properties);
						console.log(newProperties);
						contact_model.url = "core/api/contacts";

						// Save updated contact model
						contact_model.save();							
						fullContactObjects[contactId] = resultArray;

						var stringArray = JSON.stringify(fullContactObjects);
						_agile_set_prefs("fullcontact_log", stringArray);

						$.each(resultArray, function(index,value){
							displayData += "<p>"+value+"</p>";
						});						 							
 						$('#FullContact').html("<div class='p-sm'>"+displayData+"</div>");

					}else{		

						// Reads current contact model form the contactDetailView
						var contact_model = App_Contacts.contactDetailView.model;
						var contactId = contact_model.id;

						resultArray = fullContactObjects[contactId];

						//delete fullContactObjects[contactId];


						if(resultArray && resultArray.length > 0){
							$.each(resultArray, function(index,value){
								displayData += "<p>"+value+"</p>";
							});
							$('#FullContact').html("<div class='p-sm'>"+displayData+"</div>");
						}else{
							$('#FullContact').html("<div class='p-sm'>Nothing to update</div>");
						}										
					}					
 				}else{ 					
 					$('#FullContact').html("<div class='p-sm'>"+contactObj.message+"</div>");
 				}				
			}            
        });
	});
}

function startFullContactWidget(contact_id){
	//console.log("FullContact loaded : "+contact_id);	
	var fullContactLogArray = JSON.parse(_agile_get_prefs("fullcontact_log"));	
	if(fullContactLogArray){
		fullContactObjects = fullContactLogArray;
	}else{
		fullContactObjects = {};
	}

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

function setPropertyForContact(propertyName, value, subtype, type){
	var propertyObj = {};

	if(propertyName){
		propertyObj.name = propertyName;
		if(value){
			propertyObj.value = value;
		}
		if(subtype){
			propertyObj.subtype = subtype;
		}
		if(type){
			propertyObj.type = type;
		}
	}

	return propertyObj;
}