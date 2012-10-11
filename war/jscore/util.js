var LOADING_HTML = '<img class="loading" style="padding-right:5px" src= "img/21-0.gif"></img>';
var LOADING_ON_CURSOR = '<img class="loading" style="padding-right:5px" src= "img/ajax-loader-cursor.gif"></img>';
var DEFAULT_GRAVATAR_url = "https://d13pkp0ru5xuwf.cloudfront.net/css/images/pic.png";  

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(
			window.location.href.indexOf('?') + 1).split('&');
	for ( var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}

	return vars;
}

function fillSelect(selectId, url, parseKey, callback, template) {
	// Fetch Collection from URL
	var collection_def = Backbone.Collection.extend({
		url : url,
/*		parse : function(response) {

			if (response && response[parseKey])
				return response[parseKey];

			return response;
		}*/
	});

	// Prepend Loading
	$loading = $(LOADING_HTML);
	$("#" + selectId).after($loading);

	var collection = new collection_def();
	collection.fetch({
		success : function() {
			console.log(collection.models);
			console.log(collection.toJSON());

			// Remove loading
			$loading.remove();

			// Delete prev options if any
			$("#" + selectId).empty().append('<option value="">Select...</option>');

			$.each(collection.toJSON(), function(index, model) {
				// Convert template into HTML
				var modelTemplate = Handlebars.compile(template);
				var optionsHTML = modelTemplate(model);
				$("#" + selectId).append(optionsHTML);

				if (callback && typeof (callback) === "function") {
					// execute the callback, passing parameters as necessary
					callback();
				}
			});
		}

	});
}

// Fill selects with tokenized data
function fillTokenizedSelect(selectId, array, value ) {
	$("#" + selectId).empty().append('<option value="">Select...</option>');
	$.each(array, function(index, element) {
		$("#" + selectId)
				.append(
						'<option value=' + '"' + element + '">' + element
								+ '</option>');
	});

	if(value)
		$("#" + selectId).find('option[value='+value+']').attr("selected", "selected");
}

function fillMilestones(ulId, array) {
	$("#" + ulId).empty();
	$.each(array, function(index, element) {
		$("#" + ulId)
				.append(
						'<a href="#"><li value=' + '"' + element + '">' + element
								+ '</li></a>');
	});
}
function btnDropDown(contact_id, workflow_id) {

}

// Delete contact properties
function delete_contact_property(contact, propertyName) {
	for ( var index = 0; index < contact.properties.length; index++) {
		if (contact.properties[index].name == propertyName){
			contact.properties.splice(index, 1);
			--index;
		}
	}
	return contact;
}

// Delete contact tag
function delete_contact_tag(contact, tagName) {
	for ( var index = 0; index < contact.tags.length; index++) {
		if (contact.tags[index] == tagName){
			contact.tags.splice(index, 1);
			break;
		}
	}
	return contact;
}

// Add contact tags
function add_contact_tags(contact, newTags) {
	for ( var index = 0; index < newTags.length; index++) {
		contact.tags.push(newTags[index])
	}
	return contact;
}
