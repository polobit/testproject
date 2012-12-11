// We store one template compiled - if repetitive templates are called, we save time on compilations
var Handlebars_Compiled_Templates = {};

/**
 * Loads the template (script element with its id attribute as templateName
 * appended with "-template". For example if the templateName is "tasks", then
 * the script element id should be as "tasks-template") from html document body.
 * 
 * Compiles the loaded template using handlebars and replaces the context
 * related property names (which are under mustache like {{name}}) in the
 * template, with their associated values, on calling the context with the
 * compiled template.
 * 
 * @method getTemplate
 * @param {String}
 *            templateName name of the tempate to be loaded
 * @param {Object}
 *            context json object to call with the compiled template
 * @param {String}
 *            download verifies whether the template is found or not
 * @returns compiled html with the context
 */
function getTemplate(templateName, context, download) {

	// Check if it is (compiled template) present in templates
	if (Handlebars_Compiled_Templates[source])
		return Handlebars_Compiled_Templates[source](context);
	else
		Handlebars_Compiled_Templates = {};

	// Check if source is available in body
	var source = $('#' + templateName + "-template").html();
	if (source) {
		var template = Handlebars.compile(source);

		// Store it in template
		Handlebars_Compiled_Templates[source] = template;

		return template(context);
	}

	// Check if the download is explicitly set to no
	if (download == 'no') {
		console.log("Not found " + templateName);
		return;
	}

	// Download
	var templateHTML = '';

	// If starts with settings
	/**
	 * If the template is not found in document body, then download the template
	 * synchronously (stops other browser actions) by verifying the starting
	 * name of the given templateName, if it is down-loaded append it to the
	 * document body. And call the function (getTemplate) again by setting the
	 * download parameter to "no"
	 */
	if (templateName.indexOf("settings") == 0) {
		templateHTML = downloadSynchronously("tpl/min/settings.js");
	}
	if (templateName.indexOf("admin-settings") == 0) {
		templateHTML = downloadSynchronously("tpl/min/admin-settings.js");
	}
	if (templateName.indexOf("continue") == 0) {
		templateHTML = downloadSynchronously("tpl/min/continue.js");
	}

	if (templateHTML) {
		// console.log("Adding " + templateHTML);
		$('body').append($(templateHTML));
	}

	return getTemplate(templateName, context, 'no');
}

/**
 * Downloads the template synchronously (stops other browsing actions) from the
 * given url and returns it
 * 
 * @param {String}
 *            url location to download the template
 * @returns down-loaded template content
 */
function downloadSynchronously(url) {

	var urlContent;
	jQuery.ajax({
		url : url,
		dataType : 'html',
		success : function(result) {
			urlContent = result;
		},
		async : false
	});

	return urlContent;
}

/**
 * Iterates the given "items", to find a match with the given "name", if found
 * returns the value of its value attribute
 * 
 * @param {Object}
 *            items array of json objects
 * @param {String}
 *            name to get the value (of value atribute)
 * @returns value of the matched object
 */
function getPropertyValue(items, name) {
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++) {
		if (items[i].name == name)
			return items[i].value;
	}
}

/**
 * Turns the first letter of the given string to upper-case and the remaining to
 * lower-case (EMaiL to Email).
 * 
 * @param {String}
 *            value to convert as ucfirst
 * @returns converted string
 */
function ucfirst(value) {
	return (value && typeof value === 'string') ? (value.charAt(0)
			.toUpperCase() + value.slice(1).toLowerCase()) : '';

}

$(function() {

	/**
	 * Helper function to return the value of a property matched with the given
	 * name from the array of properties
	 * 
	 * @method getPropertyValue
	 * @param {Object}
	 *            items array of objects
	 * @param {String}
	 *            name to get matched object value
	 * @returns value of the matched object
	 */
	Handlebars.registerHelper('getPropertyValue', function(items, name) {

		return getPropertyValue(items, name);
	});

	Handlebars.registerHelper('urlEncode', function(url, key, data) {

		var startChar = "&";
		if (url.indexOf("?") != -1)
			startChar = "&";

		var encodedUrl = url + startChar + key + "="
				+ escape(JSON.stringify(data));
		// console.log(encodedUrl.length + " " + encodedUrl);
		return encodedUrl;
	});

	/**
	 * Helper function to return image for an entity (contact). Checks for
	 * existing image, if not found checks for an image using the email of the
	 * entity, if again failed to found returns a default image link.
	 * 
	 * @method gravatarurl
	 * @param {Object}
	 *            items array of objects
	 * @param {Number}
	 *            width to specify the width of the image
	 * @returns image link
	 * 
	 */
	Handlebars.registerHelper('gravatarurl', function(items, width) {

		if (items == undefined)
			return;

		// Checks if properties already has an image, to return it
		var agent_image = getPropertyValue(items, "image");
		if (agent_image)
			return agent_image;

		// Default image
		var img = "https://d13pkp0ru5xuwf.cloudfront.net/css/images/pic.png";

		var email = getPropertyValue(items, "email");
		if (email) {
			return 'https://secure.gravatar.com/avatar/' + MD5(email)
					+ '.jpg?s=' + width + "&d=" + escape(img);
		}

		return img;
	});

	/**
	 * Helper function to return icons based on given name
	 * 
	 * @method icons
	 * @param {String}
	 *            item name to get icon
	 * @returns icon name
	 */
	Handlebars.registerHelper('icons', function(item) {
		if (item == "email")
			return "icon-envelope";
		if (item == "phone")
			return "icon-headphones";
		if (item == "url")
			return "icon-home";

	});

	Handlebars.registerHelper('eachkeys', function(context, options) {
		var fn = options.fn, inverse = options.inverse;
		var ret = "";

		var empty = true;
		for (key in context) {
			empty = false;
			break;
		}

		if (!empty) {
			for (key in context) {
				ret = ret + fn({
					'key' : key,
					'value' : context[key]
				});
			}
		} else {
			ret = inverse(this);
		}
		return ret;
	});

	/**
	 * Turns the first letter of the given string to upper-case and the
	 * remaining to lower-case (EMaiL to Email).
	 * 
	 * @method ucfirst
	 * @param {String}
	 *            value to convert as ucfirst
	 * @returns converted string
	 */
	Handlebars.registerHelper('ucfirst', function(value) {
		return (value && typeof value === 'string') ? (value.charAt(0)
				.toUpperCase() + value.slice(1).toLowerCase()) : '';
	});

	// Tip on using Gravar with JS:
	// http://www.deluxeblogtips.com/2010/04/get-gravatar-using-only-javascript.html
	/**
	 * Helper function to generate a html string as desired to show-up the
	 * tags-view
	 * 
	 * @method tagslist
	 * @param {Object} tags array containing all tags
	 */
	Handlebars.registerHelper('tagslist', function(tags) {

		var json = {};

		// Store tags in a json, starting letters as keys 
		for ( var i = 0, l = tags.length; i < l; i++) {

			var tag = tags[i].tag;
			// console.log(tag);
			var start = tag.charAt(0);

			var array = new Array();
			
			// see if it is already present
			if (json[start] != undefined) {
				array = json[start];
			}

			array.push(tag);
			json[start] = array;

		}

		console.log(json);

		// Sort it based on characters and then draw it
		// var html = "<ul style='list-style:none'>";
		var html = "";
		for ( var key in json) {

			var array = json[key];
			html += "<div class='tag-element'><div class='tag-key'>"
					+ key.toUpperCase() + "</div> ";

			html += "<div class='tag-values'>";

			for ( var i = 0, l = array.length; i < l; i++) {
				var hrefTag = "#tags/" + array[i];
				html += ("<a href=" + hrefTag + " >" + array[i] + "</a> ");
			}
			html += "</div></div>";

		}

		// html += "</ul>";

		return html;
	});

	// Get date string from epoch time
	Handlebars.registerHelper('epochToHumanDate', function(format, date) {
		// date form milliseconds
		var d = new Date(parseInt(date) * 1000).format(format);
		return d

		// return $.datepicker.formatDate(format , new Date( parseInt(date) *
		// 1000));
	});

	// Get task date (MM dd) from epoch time
	Handlebars.registerHelper('epochToTaskDate', function(date) {
		var intMonth = new Date(parseInt(date) * 1000).getMonth();
		var intDay = new Date(parseInt(date) * 1000).getDate();

		var monthArray = [ "Jan", "Feb", "March", "April", "May", "June",
				"July", "Aug", "Sept", "Oct", "Nov", "Dec" ];

		return (monthArray[intMonth] + " " + intDay);
	});

	// Get task color from it's priority
	Handlebars.registerHelper('task_label_color', function(priority) {
		if (priority == 'HIGH')
			return 'important';

		if (priority == 'NORMAL')
			return 'info';

		if (priority == 'LOW')
			return 'success';
	});

	// Get Date from epoch time
	Handlebars.registerHelper('epochToDate', function(info_json, date_type) {

		var obj = JSON.parse(info_json);

		var intMonth = new Date(parseInt(obj[date_type]) * 1000).getMonth();
		var intDay = new Date(parseInt(obj[date_type]) * 1000).getDate();
		var intYear = new Date(parseInt(obj[date_type]) * 1000).getFullYear();

		var monthArray = [ "Jan", "Feb", "March", "April", "May", "June",
				"July", "Aug", "Sept", "Oct", "Nov", "Dec" ];

		return (monthArray[intMonth] + " " + intDay + ", " + intYear);
	});

	// Currency symbol
	Handlebars.registerHelper('currencySymbol', function(value) {
		var symbol = value.substring(4, value.length);
		return symbol;
	});

	// Calculate pipeline (value * probability)
	Handlebars.registerHelper('calculatePipeline',
			function(value, probability) {

				var pipeline = parseInt(value) * parseInt(probability) / 100;
				return pipeline;
			});

	// Get required log from logs
	Handlebars.registerHelper('getRequiredLog',
			function(log_array_string, name) {
				var logArray = JSON.parse(log_array_string);
				if (name == "t") {
					var readableTime = new Date(logArray[0][name] * 1000);
					return readableTime;
				}
				return logArray[0][name];
			});

	// Table headings for custom contacts list view
	Handlebars.registerHelper('contactTableHeadings', function(item) {

		var el = "";
		$.each(App_Contacts.contactViewModel[item], function(index, element) {

			element = element.replace("_", " ")

			el = el.concat('<th>' + ucfirst(element) + '</th>');

		});

		return new Handlebars.SafeString(el);
	});

	// Timeline details
	Handlebars.registerHelper('if_entity', function(item, options) {
		if (this.entity_type == item) {
			return options.fn(this);
		}
		if (this[item] != undefined) {
			if (this.date_secs) {

				// For emails convert milliseconds into seconds
				this.date_secs = this.date_secs / 1000;
			}
			return options.fn(this);
		}
	});

	// Display properties in contact details
	Handlebars.registerHelper('if_property', function(fname, lname, company,
			title, options) {
		if (this.name != fname && this.name != lname && this.name != company
				&& this.name != title)
			return options.fn(this);
	});

	// Check the existence of property name and print value
	Handlebars.registerHelper('if_propertyName', function(pname, options) {
		for ( var i = 0; i < this.properties.length; i++) {
			if (this.properties[i].name == pname)
				return options.fn(this.properties[i]);
		}
	});

	// Get Count
	Handlebars.registerHelper('count', function() {
		if (this[0] && this[0].count && (this[0].count != -1))
			return "(" + this[0].count + " Total)";
		else
			return "(" + this.length + " Total)";
	});

	// Converts string into JSON
	Handlebars.registerHelper('stringToJSON', function(object, key, options) {

		if (key) {
			object[key] = JSON.parse(object[key]);
			return options.fn(object[key]);
		}

		return options.fn(JSON.parse(object));
	});

	// Convert string to lower case
	Handlebars.registerHelper('toLowerCase', function(value) {
		return value.toLowerCase();
	});

	// Execute template based on contact type
	Handlebars.registerHelper('if_contact_type', function(ctype, options) {
		if (this.type == ctype) {
			return options.fn(this);
		}
	});

	// Lead Score if greater than zero return
	Handlebars.registerHelper('lead_score', function(value) {
		if (this.lead_score > 0)
			return this.lead_score;
		else
			return "";
	});

	// Return task completion status
	Handlebars.registerHelper('task_status', function(status) {
		console.log(status);
		if (status)
			return true;

		// Return false as string as the template can not print boolean false
		return "false";

	});

	Handlebars.registerHelper('compare', function(value, target, options) {
		if (value == target)
			return options.fn(this);
		else
			return options.inverse(this);
	})

	// Add Custom Fields to Forms
	Handlebars.registerHelper('show_custom_fields', function(custom_fields,
			properties) {

		var el = show_custom_fields_helper(custom_fields, properties);
		return new Handlebars.SafeString(fill_custom_field_values($(el),
				properties));

	});

	// Return modified message for timeline logs
	Handlebars.registerHelper('tl_log_string', function(string) {

		return string.replace("Sending email From:", "Email sent From:");
	});
});