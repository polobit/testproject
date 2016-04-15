/**
 * Loading spinner shown while loading
 */
var LOADING_HTML = '<img class="loading" style="padding-right:5px;" height="32px" width="32px" src= "img/21-0.gif"></img>';

/**
 * Set of loading images
 */
LOADING_HTML_IMAGES = [
	LOADING_HTML
]

/**
 * Loading images shown which contacts are being fetched on page scroll
 */
var LOADING_ON_CURSOR = '<img class="loading" style="padding-right:5px" src= "img/ajax-loader-cursor.gif"></img>';

/**
 * Default image shown for contacts if image is not available
 */
var DEFAULT_GRAVATAR_url = "https://dpm72z3r2fvl4.cloudfront.net/css/images/user-default.png";

var ONBOARDING_SCHEDULE_URL = "https://our.agilecrm.com/calendar/khader,haaris_farooqi";

var SALES_SCHEDULE_URL = "https://our.agilecrm.com/calendar/Vikas,Mrudula,Shravi_Sharma,Bharat,Manish,Nick,Stephen";

var SUPPORT_SCHEDULE_URL = "https://our.agilecrm.com/calendar/khader,haaris_farooqi
";

/**
 * Returns random loading images
 * 
 * @returns
 */
function getRandomLoadingImg()
{
	var length = LOADING_HTML_IMAGES.length;
	return LOADING_HTML_IMAGES[Math.round(Math.random() * (LOADING_HTML_IMAGES.length - 1))]
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}

	return vars;
}

/**
 * Creates a select fields with the options fetched from the url specified,
 * fetches the collection from the url and creates a select element and appends
 * to the selectId sent, it takes the template to fill the values and also takes
 * a callback to deserialize the select field if form is being edited
 * 
 * @param selectId
 *            to append the options
 * @param url
 *            To fetch collection
 * @param parseKey
 *            parses the collection
 * @param callback
 *            to process select field after being created
 * @param template
 *            Template to create options
 */
function fillSelect(selectId, url, parseKey, callback, template, isUlDropdown, el, defaultSelectOption)
{
	// Fetch Collection from URL
	var collection_def = Backbone.Collection.extend({ url : url,
	/*
	 * parse : function(response) {
	 * 
	 * if (response && response[parseKey]) return response[parseKey];
	 * 
	 * return response; }
	 */
	});

	// Prepend Loading
	$loading = $(getRandomLoadingImg());
	$("#" + selectId, el).after($loading);

	// Creates a collection and fetches the data from the url set in collection
	var collection = new collection_def();

	// On successful fetch of collection loading symbol is removed and options
	// template is populated and appended in the selectId sent to the function
	collection.fetch({ success : function()
	{

		// Remove loading
		$loading.remove();

		// Delete prev options if any by verifying whether ul drop down or
		// select drop down
		if (isUlDropdown)
			$("#" + selectId, el).empty();
		else
		{
			if (!defaultSelectOption)
				defaultSelectOption = "Select...";

			$("#" + selectId, el).empty().append('<option class="default-select" value="">' + defaultSelectOption + '</option>');
		}
		var data = collection.toJSON();
		data.sort(function(a, b)
		{
			if (a.name < b.name)
				return -1;
			if (b.name < a.name)
				return 1;
			return 0;
		});
		// Convert template into HTML
		var modelTemplate = Handlebars.compile(template);
		// Iterates though each model in the collection and
		// populates the template using handlebars
		$.each(data, function(index, model)
		{
			var optionsHTML = modelTemplate(model);
			$("#" + selectId, el).append(optionsHTML);
		});

		// If callback is present, it is called to deserialize
		// the select field
		if (callback && typeof (callback) === "function")
		{
			// execute the callback, passing parameters as
			// necessary
			callback();
		}
	}

	});
}

// Fill selects with tokenized data
/**
 * fillTokenizedSelect if similar to fillSelect, but data is not fetched it is
 * sent to the function which creates options based on the array of values sent.
 * It also includes callback function to deseriazlie
 * 
 * @param selectId
 *            to To append options
 * @param array
 *            list of values to be used to create options
 * @param callback
 *            function to be called after select if created
 */
function fillTokenizedSelect(selectId, array, callback, defaultSelectOption)
{
	if (!defaultSelectOption)
		defaultSelectOption = "Select...";

	$("#" + selectId).empty().append('<option value="">' + defaultSelectOption + '</option>');

	// Iterates though each element in array and creates a options to select
	// field and
	// appends to the id sent
	$.each(array, function(index, element)
	{
		$("#" + selectId).append('<option value=' + '"' + element + '">' + element + '</option>');
	});

	// If callback exists it is called after select field is created
	if (callback && typeof (callback) === "function")
	{
		// execute the callback, passing parameters as necessary
		callback();
	}
}

/**
 * Fills milestore in to dorpdown
 * 
 * @param ulId
 * @param array
 */
function fillMilestones(ulId, array)
{
	$("#" + ulId).empty();
	$.each(array, function(index, element)
	{
		$("#" + ulId).append('<a href="#"><li value=' + '"' + element + '">' + element + '</li></a>');
	});
}
function btnDropDown(contact_id, workflow_id)
{

}

/**
 * Removes the specified property from the contact
 */
function delete_contact_property(contact, propertyName)
{

	// Iterates through the properties of the contact, finds the property with
	// the name specified and removes the property from the contact
	for (var index = 0; index < contact.properties.length; index++)
	{
		if (contact.properties[index].name == propertyName)
		{
			contact.properties.splice(index, 1);
			--index;
		}
	}
	return contact;
}

// Delete contact tag
/**
 * Removes a tag from the contact, tag name is to be specified to remove the tag
 */
function delete_contact_tag(contact, tagName)
{

	// Iterates though tags in the contact and removes the tag which matches the
	// tag name parameter of the function
	$.each(contact.tagsWithTime, function(index, tagObject)
	{
		if (tagObject.tag == tagName)
		{
			// Tag should be removed from tags also,
			// or deleted tag will be added again
			contact.tags.splice(index, 1);
			contact.tagsWithTime.splice(index, 1);
			return false;
		}
		contact.tags.push(tagObject.tag);
	});

	return contact;
}

/**
 * Adds a new tag to contact
 */
function add_contact_tags(contact, newTags)
{
	for (var index = 0; index < newTags.length; index++)
	{
		contact.tags.push(newTags[index])
	}
	return contact;
}

/**
 * Creates a property json object
 * 
 * @param name
 * @param id
 * @param type
 */
function property_JSON(name, id, type)
{
	var json = {};

	if (type == undefined)
		json.type = "SYSTEM";
	else
		json.type = type;

	json.name = name;

	var elem = $('#' + id), elem_type = elem.attr('type'), elem_value;

	if (elem_type == 'checkbox')
		elem_value = elem.is(':checked') ? 'on' : 'off';
	else
		elem_value = elem.val();

	json.value = elem_value;
	return json;
}

// Sends post request using backbone model to given url. It is a generic
// function, can be called to save entity to database
function saveEntity(object, url, callback)
{
	var model = new Backbone.Model();
	model.url = url;
	model.save(object, { success : function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			// execute the callback, passing parameters as necessary
			callback(data);
		}
	} });
}

/**
 * Returns GMT time.
 * 
 * @param date
 * @returns
 */
function getGMTEpochFromDate(date)
{
	var current_sys_date = new Date();
	console.log(new Date().getHours());
	console.log(new Date().getMinutes());
	console.log(new Date().getSeconds());
	console.log(date.getYear() + "," + date.getMonth() + "," + date.getDate())
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

	// Adding offset to date returns GMT time
	return date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
}

/**
 * Returns local epoch time based form GMT time
 * 
 * @param time_in_milliseconds
 * @returns {Number}
 */
function getLocalTimeFromGMTMilliseconds(time_in_milliseconds)
{
	var date = new Date(parseInt(time_in_milliseconds));

	// Subtracting epoch offset from epoch time;
	return date.getTime() - (date.getTimezoneOffset() * 60 * 1000);
}

function showTextGravatar(selector, element)
{
	var el = $(selector, $(element));
	$(el).closest('img').error(function()
	{
		var name = $(this).attr("_data-name");

		if (!name)
			return;

		$(this).attr("data-name", name);
		$(this).initial({ charCount : 2 });
	});
}

function text_gravatar_initials(items)
{
	if (items == undefined)
		return;

	var name = "";

	var first_name;
	var last_name;

	var name = "";

	if (getPropertyValue(items, "first_name"))
	{

		first_name = getPropertyValue(items, "first_name");

	}

	if (getPropertyValue(items, "last_name"))
	{
		last_name = getPropertyValue(items, "last_name");
	}

	if (first_name && last_name)
	{
		name = first_name.substr(0, 1);
		name += last_name.substr(0, 1);
	}
	else
	{
		if (first_name)
		{
			var first_name_length = first_name.length;
			if (first_name_length > 1)
				name = first_name.substr(0, 2);
			else
				name = first_name.substr(0, 1);
		}
		else if (last_name)
		{
			var last_name_length = last_name.length;
			if (last_name_length > 1)
				name = last_name.substr(0, 2);
			else
				name = last_name.substr(0, 1);
		}
	}
	if (name.length == 0)
	{
		var email = getPropertyValue(items, "email");
		if (email)
		{
			if (email.length > 1)
				name = email.substr(0, 2);
		}
	}

	if (name.length == 0)
		name = "X";

	console.log(name);
	return name;
}

function buildFacebookProfileURL(URL)
{
	URL = URL.replace('@', '');
	var hasScheme = (URL.indexOf('http://') === 0 || URL.indexOf('https://') === 0);
	var isFBURL = (URL.indexOf('facebook.com') !== -1);
	if (URL && !hasScheme && !isFBURL)
	{
		URL = 'https://www.facebook.com/' + URL;
	}
	else if (URL && isFBURL && URL.indexOf('www.facebook.com') === -1)
	{
		URL = URL.replace('facebook.com', 'www.facebook.com');
	}
	else if (URL && !hasScheme)
	{
		URL = 'http://' + URL;
	}
	return URL;
}
