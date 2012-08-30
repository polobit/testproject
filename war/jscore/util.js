// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    return vars;
}


function fillSelect(selectId, url, parseKey, callback, template)
{
	// Fetch Collection from URL
	var collection_def = Backbone.Collection.extend({
	       url: url,
	       parse: function (response) {
	    	   
	    	   if (response && response[parseKey]) 
	           	return response[parseKey];
	           
	           return response;
	    	    }
	   });
	
	 var collection = new collection_def();
	 collection.fetch({
	       success: function () {
	    	   console.log(collection.models);
	    	   console.log(collection.toJSON());
	       	
	       	  // Delete prev options if any
	       	  $("#" + selectId).empty().append('<option>Select...</option>');
	       		
	       	  $.each(collection.toJSON(), function(index, model){
	       		
	       			// Convert template into HTML
	       			var modelTemplate = Handlebars.compile(template);
	       			var optionsHTML = modelTemplate(model);
	       			$("#"  + selectId).append(optionsHTML);
	       			
	       			 if (callback && typeof(callback) === "function") {
	       	        	// execute the callback, passing parameters as necessary
	       	        	callback();
	       	        }	
	       		});
	       	 }
	   	
	   });
}

//Fill selects with tokenized data
function fillTokenizedSelect(selectId, array){
	$("#" + selectId).empty().append('<option>Select...</option>');
		$.each(array,function(index, element){
			$("#" + selectId).append('<option value=' + '"' + element +'">' + element + '</option>');
		});
}

function btnDropDown(contact_id, workflow_id){

}

// Delete contact properties
function delete_contact_property(contact, propertyName)
{
	for(var index = 0; index < contact.properties.length; index++){
		if(contact.properties[index].name == propertyName)
			delete contact.properties[index];
	}
	return contact;
}

 