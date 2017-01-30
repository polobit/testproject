function startLinkedinWidget(){
	showLinkedinMatchingProfilesBasedOnName();
}
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
				if(source.startsWith("linkedin")){
					source = "https://"+source;
				}
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
	var contact_collection;
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
	console.log("many many times");
	var model = new Backbone.Model();
	model.url = "core/api/contacts";
	model.save(contact_model.toJSON(), {
		success : function(data){
			if(data){
				var currentContactId = App_Contacts.contactDetailView.model.id;
				console.log(currentContactId + " : "+ contactId);
				if(currentContactId && contactId == currentContactId){
					App_Contacts.contactDetailView.model = data;

					var contactDetailsBlock = new Base_Model_View({ 
						template : "contact-details-block",					
						data : App_Contacts.contactDetailView.model					
					});

					var block_el = contactDetailsBlock.render(true).el;
	      			$('#contact-details-block').html($(block_el)); 

	      			if(App_Contacts.contactsListView && App_Contacts.contactsListView.collection)
						contact_collection = App_Contacts.contactsListView.collection;

	      			if (contact_collection != null)
						contact_detail_view_navigation_linkedin(contactId, App_Contacts.contactsListView, el);

	      			var msgType = "success";
					var msg = _agile_get_translated_val('widgets','linkedin-data-sync-success');
					showNotyPopUp(msgType , msg, "bottomRight");
	      		}
	      	}
		}
	});
}
/**
 * To navigate from one contact detail view to other
 */
function contact_detail_view_navigation_linkedin(id, contact_list_view){
	var contact_collection = contact_list_view.collection;
	var collection_length = contact_collection.length;
    var current_index = contact_collection.indexOf(contact_collection.get(id));
    var previous_contact_id;
    var next_contact_id;
    //fetch next set so that next link will work further.
    if(collection_length <= current_index+5) {
    	contact_list_view.infiniScroll.fetchNext();
    }
    if (collection_length > 1 && current_index < collection_length && contact_collection.at(current_index + 1) && contact_collection.at(current_index + 1).has("id")) {
     
    	next_contact_id = contact_collection.at(current_index + 1).id
    }

    if (collection_length > 0 && current_index != 0 && contact_collection.at(current_index - 1) && contact_collection.at(current_index - 1).has("id")) {

    	previous_contact_id = contact_collection.at(current_index - 1).id
    }

    var route = "contact";
    if(Current_Route && Current_Route == "lead/" + id)
    {
      route = "lead";
    }

    if(previous_contact_id != null)
    	$('.navigation').append('<a style="float:left;" href="#'+route+'/' + previous_contact_id + '" class="" onclick="clearContactWidetQueues(' + id + ')"><i class="icon icon-chevron-left"></i></a>');
    if(next_contact_id != null)
    	$('.navigation').append('<a style="float:right;" href="#'+route+'/'+ next_contact_id + '" class="" onclick="clearContactWidetQueues(' + id + ')"><i class="icon icon-chevron-right"></i></a>');
	
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