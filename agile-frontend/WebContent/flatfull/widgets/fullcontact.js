var FullContactObj = {};

function warpFullContactToAgileContact(agileContact, fullContact){
	var result = "";
	if(agileContact && fullContact){
		var properties = agileContact.properties;

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


		// 
		// ------------------------ Full contact fields ---------------------
		// 
		// Photos: Array - for profile pic ( linkedin, twitter, facebook, other)
		// contactInfo - Chats Array - skype, gtalk, googletalk
		// contactInfo - websites Array - websites										
		// demographics- locationDeduced - country, state, city
		// socialProfiles - youtube, facebook, twitter, GooglePlus, LinkedIn, xing, GitHub, Flickr

		if(contactInfo){
			first_name = contactInfo["givenName"];
			last_name = contactInfo["familyName"];
		} 		

		if(organisationArray){
			organisationArray.forEach(item, index) {
				var companyObj = organisationArray[index];
				if(companyObj["isPrimary"] == true){
					company = companyObj["name"];
				}								
    		}
		}

		console.log(first_name + " : "+ last_name + " : "+ company);

	}
 	//App_Contacts.contactDetailView.model.set(new BaseModel());

	return result;
}

function loadFullContactData(apikey, emailID){
	head.js(LIB_PATH + 'lib/jquery.fullcontact.2.2.js', function(){		
		$.fullcontact.emailLookup(apikey, emailID, function(fullContactObj){
			if(fullContactObj){	
 				var status = fullContactObj.status;
 				var displayData = "";
 				if(status == 200){ 					
 					var currentContactJson = App_Contacts.contactDetailView.model.toJSON();
 					displayData = warpFullContactToAgileContact(currentContactJson, fullContactObj);

 					if(displayData.length > 0){
 						displayData = "<span class='p-sm'>"+displayData+"</span>";
 					}else{
 						displayData = "<span class='p-sm'>Nothing to update</span>";
 					}
 				}else{
 					displayData = "<span class='p-sm'>"+fullContactObj.message+"</span>";
 				}
				$('#FullContact').html(displayData);
			}            
        });
	});
}

function startFullContactWidget(contact_id){
	console.log("FullContact loaded : "+contact_id);

	FullContactObj = {};
	
	FULLCONTACT_PLUGIN_NAME = "FullContact";

	var fullcontact_widget = agile_crm_get_widget(FULLCONTACT_PLUGIN_NAME);
	var fullcontact_widget_prefs = JSON.parse(fullcontact_widget.prefs);
	var fcApiKey = fullcontact_widget_prefs["fullcontact_apikey"];
	var contact_email = agile_crm_get_contact_property('email');

	console.log('In FullContact');
	console.log(fullcontact_widget);

	if(contact_email){
		loadFullContactData(fcApiKey, contact_email);
	}else{
		$('#FullContact').html('<div>Email not found for this contact.</div>');	
	}

	FULLCONTACT_Plugin_Id = fullcontact_widget.id;
	var fullcontact_widget_prefs = JSON.parse(fullcontact_widget.prefs);
}