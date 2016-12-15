var fullContactObjects = {};


function updateContactProperties(newProperties, resetSocialWidgets){
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
	//contact_model.url = "core/api/contacts";
	console.log(contact_model);
	
	// Save updated contact model
	//contact_model.save();
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
	      			console.log("Reset widgets ***** ");
	      			console.log(resetSocialWidgets);
	      			if(resetSocialWidgets && resetSocialWidgets.length > 0){
	      				$.each(resetSocialWidgets, function(index,value){
	      					if(value){
		  						if(value == "Google+"){
		  							value = "GooglePlus";
		  							$('#'+value).html('');
		  							eval("start" + value + "Widget")(currentContactId);
		  						}		  						
	      					}      					      		
						});	
	      			}		
				}				  				
			}
		}
	});
}

function loadFullContactData(apikey, emailID, autoProfiling){	
	head.js('/flatfull/lib/jquery.fullcontact.2.2.js', function(){		
		//emailID = "bart@fullcontact.com";
		$.fullcontact.emailLookup(apikey, emailID, function(contactObj){
			var resetSocialWidgets = [];	
			console.log("fullContactData **** ");
			console.log(contactObj);
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
					var organisationArray = contactObj["organizations"];
					var PhotosArray = contactObj["photos"];			

					var socialProfilesArray = contactObj["socialProfiles"];
					var websitesArray;
					var chatsArray;
					if(contactInfo){
						websitesArray =  contactInfo["websites"];
						chatsArray = contactInfo["chats"];
					}

					var addressObject = contactObj["demographics"];					
					var locationObject;
					if(addressObject){
						locationObject = addressObject["locationDeduced"];
					}	

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
								resultArray.push("Last name");
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

					if(socialProfilesArray){
						// var fullSocialArray = ["youtube", "github", "facebook", "google", "xing"];
						// var agileSocialArray = ["YOUTUBE", "GITHUB", "FACEBOOK", "GOOGLE-PLUS", "XING"];	
						// var flagText = ["Youtube", "Github", "Facebook", "Google+", "xing"];					

						var fullSocialArray = ["youtube", "github", "google", "xing"];
						var agileSocialArray = ["YOUTUBE", "GITHUB", "GOOGLE-PLUS", "XING"];	
						var flagText = ["Youtube", "Github", "Google+", "xing"];

						$.each(socialProfilesArray, function (index,value) {
							var webValue = value;
							var arrayIndex = fullSocialArray.indexOf(webValue.type);
							if(arrayIndex >= 0){
								var agileKey = agileSocialArray[arrayIndex];								
								var webData = getPropertyValueBySubtype(properties, "website", agileKey);
								if(!webData){
									if(agileKey && agileKey != null){
										var flagTemp = flagText[arrayIndex];
										//if(flagTemp && (flagTemp == "Facebook" || flagTemp == "Google+")){
										if(flagTemp && flagTemp == "Google+"){
											resetSocialWidgets.push(flagTemp);
											var changeURL = webValue.url;											
    										var res = changeURL.replace("https://plus.google.com/", "");
											webValue.url = res;
										}
										resultArray.push(flagTemp);								
										newProperties.push(setPropertyForContact("website", webValue.url, agileKey, "SYSTEM"));
									}
								}
							}							
						});						
					}

					if(websitesArray){
						var web_url = getPropertyValueBySubtype(properties, "website", "URL");
						if(!web_url){
							var websiteURL;
							if(websitesArray.length > 0){
								websiteURL = websitesArray[0].url;
							}

							if(websiteURL){
								resultArray.push("Website");	
								newProperties.push(setPropertyForContact("website", websiteURL, "URL", "SYSTEM"));
							}
						}
					}

					if(chatsArray){
						var web_skype = getPropertyValueBySubtype(properties, "website", "SKYPE");
						if(!web_skype){
							var webSkype;							
							$.each(chatsArray, function (index,value) {
								var tempObject = value;
								if(value.client == "skype"){									
									webSkype = value.handle;
									resultArray.push("Skype");	
									newProperties.push(setPropertyForContact("website", webSkype, "SKYPE", "SYSTEM"));
									return false;
								}
							});
						}
					}

					if(locationObject){
						//office 
						// {"address":"d 9-42-40","city":"Hyderabad","state":"Telengana","zip":"500003","country":"IN","countryname":"India"}
						var contact_address;
						var subTypes = [null, "office", "home", "postal"];
						var i = 0;
						while(!contact_address && i < subTypes.length){
							var key = subTypes[i];
							contact_address = getPropertyValueBySubtype(properties, "address", key);
							i++;
						}

						if(!contact_address){
							var addressObj = {};

							var city = locationObject.city;
							if(city){
								addressObj.city = city.name;
							}

							var state = locationObject.state;
							if(state){
								addressObj.state = state.name;
							}

							var country = locationObject.country;
							if(country){
								addressObj.country = country.code;
							}					

							var addressString = JSON.stringify(addressObj);
							resultArray.push("Address");	
							console.log(addressString);
							newProperties.push(setPropertyForContact("address", addressString, "postal", "SYSTEM"));
						}

					}

					if(newProperties.length > 0){						
						$.each(resultArray, function(index,value){
							if(value && value != null) {
								if(index == 0){
									displayData += value; 	
								}else{
									displayData += ", "+value ;
								}
							}
						});			

 						$('#FullContact').html("<div class='p-sm'><p> New data - "+displayData+"</p></div>");

 						if(autoProfiling == undefined || autoProfiling == true){				
							updateContactProperties(newProperties, resetSocialWidgets);							
 						}else{
 							showAlertModal(_agile_get_translated_val('widgets', 'Fullcontact-newdata') + " <p>New data - " + displayData + "</p>", "confirm", function(){
								updateContactProperties(newProperties, resetSocialWidgets);
							},undefined, "FullContact");
 						} 						 						

					}else{													
						$('#FullContact').html("<div class='p-sm'>"+_agile_get_translated_val('widgets', 'Fullcontact-nodata')+"</div>");															
					}					
 				}else{ 
 					var errorMessage = contactObj.message;		
 					if(errorMessage == "Forbidden"){ 							 					
 						errorMessage = _agile_get_translated_val('widgets', 'Fullcontact-invalid-api-key');
 					}

 					$('#FullContact').html("<div class='p-sm' style='word-break:break-all;'>"+errorMessage+"</div>");
 				}				
			}            
        });
	});
}

function startFullContactWidget(contact_id){	
	fullContactObjects = {};	

	FULLCONTACT_PLUGIN_NAME = "FullContact";

	var fullcontact_widget = agile_crm_get_widget(FULLCONTACT_PLUGIN_NAME);
	var fullcontact_widget_prefs = JSON.parse(fullcontact_widget.prefs);
	FULLCONTACT_Plugin_Id = fullcontact_widget.id;
	var autoProfiling = fullcontact_widget_prefs["autoProfiling"];
	var fcApiKey = fullcontact_widget_prefs["fullcontact_apikey"];
	var contact_email = agile_crm_get_contact_property('email');

	console.log('In FullContact');
	console.log(fullcontact_widget);

	if(contact_email){		
		loadFullContactData(fcApiKey, contact_email, autoProfiling);
	}else{								
		$('#FullContact').html('<div class="p-sm">'+ _agile_get_translated_val('widgets', 'Fullcontact-email-required')+'</div>');	
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
