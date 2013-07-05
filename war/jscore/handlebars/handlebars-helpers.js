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
	
	Handlebars.registerHelper('getPropertyValueBySubtype', function(items, name, subtype) {
		
		return getPropertyValueBySubtype(items, name, subtype);
	});
	
	Handlebars.registerHelper('getPropertyValueBytype', function(items, name, type, subtype) {
		return getPropertyValueBytype(items, name, type, subtype);
	});
	
	
	
	Handlebars.registerHelper('getTwitterHandleByURL', function(value) {
		
		if (value.indexOf("https://twitter.com/") != -1)
		    return value;

		value = value.substring(value.lastIndexOf("/") + 1);
		console.log(value);
		
		return value;
	});
	
	Handlebars.registerHelper('getContactCustomProperties', function(items, options) {
		var fields = getContactCustomProperties(items);
		if(fields.length == 0)
			return options.inverse(fields);
		
		return options.fn(fields);
		
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
		var img = DEFAULT_GRAVATAR_url;

		var email = getPropertyValue(items, "email");
		if (email) {
			return 'https://secure.gravatar.com/avatar/' + MD5(email)
					+ '.jpg?s=' + width + "&d=" + escape(img);
		}

		return 'https://secure.gravatar.com/avatar/' + MD5("") + '.jpg?s='
				+ width + "&d=" + escape(img);

	});

	Handlebars.registerHelper('defaultGravatarurl', function(width) {
		// Default image
		var img = DEFAULT_GRAVATAR_url;

		return 'https://secure.gravatar.com/avatar/' + MD5("") + '.jpg?s='
				+ width + "&d=" + escape(img);
	});

	Handlebars.registerHelper('emailGravatarurl', function(width, email) {
		// Default image
		var img = DEFAULT_GRAVATAR_url;

		if (email) {
			return 'https://secure.gravatar.com/avatar/' + MD5(email)
					+ '.jpg?s=' + width + "&d=" + escape(img);
		}

		return 'https://secure.gravatar.com/avatar/' + MD5("") + '.jpg?s='
				+ width + "&d=" + escape(img);
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
		item = item.toLowerCase();
		if (item == "email")
			return "icon-envelope-alt";
		if (item == "phone")
			return "icon-headphones";
		if (item == "url")
			return "icon-home";
		if (item == "call")
			return "icon-phone-sign";
		if (item == "follow_up")
			return "icon-signout";
		if (item == "meeting")
			return "icon-group";
		if (item == "milestone")
			return "icon-cog";
		if (item == "send")
			return "icon-reply";
		if (item == "tweet")
			return "icon-share-alt";

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
	
	/**
	 * Returns Contact short name
	 */
	Handlebars.registerHelper('contactShortName', function() {
		if (App_Contacts.contactDetailView
				&& App_Contacts.contactDetailView.model) {
			
			var contact_properties = App_Contacts.contactDetailView.model
					.get('properties');
			
				for ( var i = 0; i < contact_properties.length; i++) {
					
					if (contact_properties[i].name == "last_name")
						return contact_properties[i].value;
					else if (contact_properties[i].name == "first_name")
						return contact_properties[i].value;
				}
				return "Contact";
			}
	});
	
	/**
	 * Returns workflow name surrounded by quotations if exists, otherwise this
	 ***/
	Handlebars.registerHelper('workflowName',function(){
		if(App_Workflows.workflow_model)
			{
			var workflowName = App_Workflows.workflow_model.get("name");
			return "\'" + workflowName + "\'";
			}
		
		return "this";
	});
	
	
	/**
	 * 
	 * @method task_property
	 * @param {String}
	 *            change property value in view
	 * @returns converted string
	 */
	Handlebars.registerHelper('task_property', function(value) {

		if (value == "FOLLOW_UP")
			return "Follow Up";
		else
			return ucfirst(value);
		
	});
	
	// Tip on using Gravar with JS:
	// http://www.deluxeblogtips.com/2010/04/get-gravatar-using-only-javascript.html
	/**
	 * Helper function to generate a html string as desired to show-up the
	 * tags-view
	 * 
	 * @method tagslist
	 * @param {Object}
	 *            tags array containing all tags
	 */
	Handlebars.registerHelper('tagslist', function(tags) {

		var json = {};

		// Store tags in a json, starting letter as key
		for ( var i = 0; i < tags.length; i++) {

			var tag = tags[i].tag;
			// console.log(tag);
			var start = tag.charAt(0).toUpperCase();

			var array = new Array();

			// see if it is already present
			if (json[start] != undefined) {
				array = json[start];
			}

			array.push(tag);
			json[start] = array;

		}
		
        // To sort tags in case-insensitive order i.e. keys in json object
		var keys = Object.keys(json);
		keys.sort();

		// Sorts it based on characters and then draws it
		var html = "";

		for ( var i in keys ) {

			var array = json[keys[i]];
			
			html += "<div class='tag-element'><div class='tag-key'>"
					+ keys[i] + "</div> ";

			html += "<div class='tag-values'>";

			for ( var i = 0; i < array.length; i++) {
				var hrefTag = "#tags/" + array[i];

				html += ('<a href=\"' + hrefTag + '\" >' + array[i] + '</a> ');
			}
			html += "</div></div>";

		}

		return html;
	});
	
	/**
	 * Helper function to return date string from epoch time
	 */
	Handlebars.registerHelper('epochToHumanDate', function(format, date) {
			
		if(!format)format = "mmm dd yyyy HH:MM:ss";
		
		if (!date)
			return;

		if ((date / 100000000000) > 1) {
			return new Date(parseInt(date)).format(format);
		}
		// date form milliseconds
		var d = new Date(parseInt(date) * 1000).format(format);
		
		return d

		// return $.datepicker.formatDate(format , new Date( parseInt(date) *
		// 1000));
	});

	/**
	 * Helper function to return task date (MM dd, ex: Jan 10 ) from epoch time
	 */
	Handlebars.registerHelper('epochToTaskDate', function(date) {
		
		var intMonth, intDay;
		
		// Verifies whether date is in milliseconds, then 
		//no need to multiply with 1000
		if ((date / 100000000000) > 1) {
			intMonth =  new Date(date).getMonth();
			intDay = new Date(date).getDate();
		} 
		else
		{
			intMonth = new Date(parseInt(date) * 1000).getMonth();
		    intDay = new Date(parseInt(date) * 1000).getDate();
		}
		 var monthArray = [ "Jan", "Feb", "March", "April", "May", "June",
				"July", "Aug", "Sept", "Oct", "Nov", "Dec" ];

		return (monthArray[intMonth] + " " + intDay);
	});
	
	/**
	 * Helper function to return task color based on it's priority
	 */
	Handlebars.registerHelper('task_label_color', function(priority) {
		if (priority == 'HIGH')
			return 'important';

		if (priority == 'NORMAL')
			return 'info';

		if (priority == 'LOW')
			return 'success';
	});

	/**
	 * Helper function to return date (Jan 10, 2012) from epoch time (users
	 * table)
	 * 
	 * @param {Object}
	 *            info_json json object containing information about
	 *            createdtime, last logged in time etc..
	 * @param {String}
	 *            date_type specifies the type of date to return (created or
	 *            logged in)
	 */
	Handlebars.registerHelper('epochToDate', function(info_json, date_type) {

		var obj = JSON.parse(info_json);

		if(!obj[date_type])
			return "-"
		var intMonth = new Date(parseInt(obj[date_type]) * 1000).getMonth();
		var intDay = new Date(parseInt(obj[date_type]) * 1000).getDate();
		var intYear = new Date(parseInt(obj[date_type]) * 1000).getFullYear();

		var monthArray = [ "Jan", "Feb", "March", "April", "May", "June",
				"July", "Aug", "Sept", "Oct", "Nov", "Dec" ];

		return (monthArray[intMonth] + " " + intDay + ", " + intYear);
	});

	/**
	 * Returns currency symbol based on the currency value (deals)
	 */
	Handlebars.registerHelper('currencySymbol', function(value) {
		var symbol = ((value.length < 4) ? "$" : value.substring(4,
				value.length));
		return symbol;
	});

	/**
	 * Calculates the "pipeline" for deals based on their value and probability
	 * (value * probability)
	 * 
	 * @param {Number}
	 *            value of the deal
	 * @param {Number}
	 *            probability of the deal
	 */
	Handlebars.registerHelper('calculatePipeline',
			function(value, probability) {

				var pipeline = parseInt(value) * parseInt(probability) / 100;
				return pipeline;
			});

	/**
	 * Returns required log (time or message) from logs (campaign logs)
	 */
	Handlebars.registerHelper('getRequiredLog',
			function(log_array_string, name) {
				var logArray = JSON.parse(log_array_string);
				if (name == "t") {
					var readableTime = new Date(logArray[0][name] * 1000);
					return readableTime;
				}
				return logArray[0][name];
			});

	/**
	 * Returns table headings for custom contacts list view
	 */
	Handlebars.registerHelper('contactTableHeadings', function(item) {

		var el = "";
		$.each(App_Contacts.contactViewModel[item], function(index, element) {

			element = element.replace("_", " ")

			el = el.concat('<th>' + ucfirst(element) + '</th>');

		});

		return new Handlebars.SafeString(el);
	});

	/**
	 * Returns table headings for reports custom contacts list view
	 */
	Handlebars.registerHelper('reportsContactTableHeadings', function(item) {

		var el = "";
		$.each(REPORT[item], function(index, element) {

			if (element.indexOf("properties_") != -1)
				element = element.split("properties_")[1];

			element = element.replace("_", " ")

			el = el.concat('<th>' + ucfirst(element) + '</th>');

		});

		return new Handlebars.SafeString(el);
	});

	/**
	 * Helper function, which executes different templates (entity related)
	 * based on entity type. Here "this" reffers the current entity object.
	 * (used in timeline)
	 * 
	 */
	Handlebars.registerHelper('if_entity', function(item, options) {

		if (this.entity_type == item) {
			return options.fn(this);
		}
		if (!this.entity && this[item] != undefined) {
			return options.fn(this);
		}
	});

	/**
	 * Returns trigger type, by removing underscore and converting into
	 * lowercase, excluding first letter.
	 */
	Handlebars.registerHelper('titleFromEnums', function(value) {
		if (!value)
			return;
		
		var str = value.replace(/_/g, ' ');
		return ucfirst(str.toLowerCase());

	});
	
	Handlebars.registerHelper('triggerType',function(value){
		if(value == 'ADD_SCORE')
			return value.replace('ADD_SCORE','Score (>=)');
		
		return titleFromEnums(value);
	});

	/**
	 * Returns notification type,by replacing 'has been' with underscore and
	 * converting into lowercase.
	 */
	Handlebars.registerHelper('if_notification_type', function() {

		// Makes 'CONTACT CREATED' To 'COMPANY CREATED'
		if (this.type == "COMPANY") {
			var arr = this.notification.split('_');
			var temp = ucfirst(arr[0].replace('CONTACT', 'COMPANY')) + " " + ucfirst(arr[1]);
			return " - " + temp;
		}
		
		// Replaces '_' with ' '
		var str = this.notification.replace(/_/g, ' ');
		
		switch(str)
		{
		case "IS BROWSING": return str.toLowerCase() + " " + this.custom_value;
		                   
		case "CLICKED LINK": var customJSON = JSON.parse(this.custom_value);
		                     return str.toLowerCase() + " " + customJSON.url_clicked + 
		                            " " + " of campaign " + "\"" + customJSON.workflow_name + "\"";
			                 
		case "OPENED EMAIL": if("custom_value" in this)
                              return str.toLowerCase() + " " + " of campaign " + "\"" + this.custom_value + "\"";
		
                             return str.toLowerCase();
			
		case "CONTACT ADDED": return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);
			
		case "CONTACT DELETED": return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);
			
		case "DEAL CREATED": return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);
		                     
		case "DEAL CLOSED": return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);
			
		case "TAG ADDED": return " - " + "\"" + this.custom_value + "\" "  + str.toLowerCase().split(' ')[0]+ " has been " + str.toLowerCase().split(' ')[1];
			
		case "TAG DELETED": return " - " + "\"" + this.custom_value + "\" "  + str.toLowerCase().split(' ')[0]+ " has been " + str.toLowerCase().split(' ')[1];

		default: return str.toLowerCase();               
		}
	});

	/**
	 * Converts Epoch Time to Human readable date of default format.Used for
	 * campaign-logs.
	 */
	Handlebars.registerHelper('epochToLogDate', function(logTime) {
		return new Date(logTime * 1000);
	});
	
	Handlebars.registerHelper('getCountryName', function(countrycode){
		return getCode(countrycode);
	});

	/**
	 * Replace '+' symbols with space.Used in notification.
	 */
	Handlebars.registerHelper('replace_plus_symbol', function(name) {

		return name.replace(/\+/g, ' ');
	});

	/**
	 * Removes forward slash. Makes A/B to AB. Used in contact-detail-campaigns
	 */
	Handlebars.registerHelper('removeSlash', function(value) {
		if (value == 'A/B')
			return value.replace(/\//g, '');

		return value;
	});

	
	/**
	 * Displays all the properties of a contact in its detail view, excluding
	 * the function parameters (fname, lname, company etc..)
	 */
	Handlebars.registerHelper('if_property', function(fname, lname, company,
			title, image, email, phone, website, address, options) {

		if (this.name != fname && this.name != lname && this.name != company
				&& this.name != title && this.name != image
				&& this.name != email && this.name != phone
				&& this.name != website && this.name != address)
			return options.fn(this);
	});

	/**
	 * Counts the existence of property name which occurred multiple times.
	 */
	Handlebars.registerHelper('property_is_exists', function(name,
			properties, options) {

		if(getPropertyValue(properties, name))
			return options.fn(this);
		return options.inverse(this);
	});
	
	/*
	 * To add comma in between the elements.
	 */
	Handlebars.registerHelper('comma_in_between_property', function(value1, value2, properties, options) {

		if(getPropertyValue(properties, value1) && getPropertyValue(properties, value2))
			return ",";
	});
	
	Handlebars.registerHelper('property_subtype_is_exists', function(name, subtype, properties, options) {

		if(getPropertyValueBySubtype(properties, name, subtype))
			return options.fn(this);
		return options.inverse(this);
	});

	/**
	 * Displays multiple times occurred properties of a contact in its detail
	 * view in single entity
	 */
	Handlebars
			.registerHelper(
					'multiple_Property_Element',
					function(name, properties, options) {

						var matching_properties_list = agile_crm_get_contact_properties_list(name)
						if (matching_properties_list.length > 0)
							return options.fn(matching_properties_list);
					});

	/**
	 * Converts address as comma seprated values and returns as handlebars safe
	 * string.
	 */
	Handlebars.registerHelper('address_Element', function(properties) {

		for ( var i = 0, l = properties.length; i < l; i++) {

			if (properties[i].name == "address") {
				var el = '<div style="display: inline-block; vertical-align: top;text-align:right;" class="span3"><span><strong style="color:gray">Address</strong></span></div>';
				var address = JSON.parse(properties[i].value);
				
				// Gets properties (keys) count of given json object
				var count = countJsonProperties(address);

				el =  el.concat('<div style="display:inline;padding-right: 10px;display: inline-block;padding-bottom: 2px; line-height: 20px;" class="span9"><div style="border-top: 1px solid #f5f5f5;margin-top:-5px;padding-top:3px;"><span>');
				
				$.each(address, function(key, val) {
					if (--count == 0) {
						el = el.concat(val + ".");
						return;
					}
					el = el.concat(val + ", ");
				});

				if (properties[i].subtype)
					el = el.concat(" <span class='label'>" + properties[i].subtype + "</span>");
				el = el.concat('</span></div></div>');
				return new Handlebars.SafeString(el);
			}
		}
	});
	
	/**
	 * Converts reports field element as comma seprated values and returns as handlebars safe
	 * string.
	 */
	Handlebars.registerHelper('reports_Field_Element', function(properties) {
				var el = "";
				var count = properties.length;
				$.each(properties, function(key, value) {
					
					if (value.indexOf("properties_") != -1)
						value = value.split("properties_")[1];
					else if (value.indexOf("custom_") != -1)
						value = value.split("custom_")[1];
					else if (value == "created_time")
						value = "Created Date";
					else if (value == "updated_time")
						value = "Updated Date";
					
					value = value.replace("_", " ");

					if (--count == 0) {
						el = el.concat(value);
						return;
					}
					el = el.concat(value + ", ");
				});
				
				return new Handlebars.SafeString(el);
	});
	
	/**
	 * Converts views field element as comma seprated values and returns as handlebars safe
	 * string.
	 */
	Handlebars.registerHelper('views_Field_Element', function(properties) {
				var el = "";
				var count = properties.length;
				$.each(properties, function(key, value) {
					
					if (value.indexOf("custom_") != -1)
						value = value.split("custom_")[1];
					else if (value == "created_time")
						value = "Created Date";
					else if (value == "updated_time")
						value = "Updated Date";
					
					value = value.replace("_", " ");

					if (--count == 0) {
						el = el.concat(value);
						return;
					}
					el = el.concat(value + ", ");
				});
				
				return new Handlebars.SafeString(el);
	});

	/**
	 * Converts string to JSON
	 */
	Handlebars.registerHelper('stringToJSON', function(object, key, options) {
		if (key) {
			try {
				object[key] = JSON.parse(object[key]);
			} finally {
				return options.fn(object[key]);
			}
		}

		try {
			return options.fn(JSON.parse(object));
		} catch (err) {
			return options.fn(object);
		}
	});

	/**
	 * Checks the existence of property name and prints value
	 */
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

	/**
	 * Converts string to JSON
	 */
	Handlebars.registerHelper('stringToJSON', function(object, key, options) {
		if (key) {
			try {
			object[key] = JSON.parse(object[key]);
			return options.fn(object[key]);
			} catch(err) {
				return options.fn(object[key]);
			}
		}

		return options.fn(JSON.parse(object));
	});

	/**
	 * Convert string to lower case
	 */
	Handlebars.registerHelper('toLowerCase', function(value) {
		if(!value)
			return;
		return value.toLowerCase();
	});

	/**
	 * Convert string to lower case
	 */
	Handlebars.registerHelper('toUpperCase', function(value) {
		if(!value)
			return;
		return value.toUpperCase();
	});
	
	/**
	 * Executes template, based on contact type (person or company)
	 */
	Handlebars.registerHelper('if_contact_type', function(ctype, options) {
		if (this.type == ctype) {
			return options.fn(this);
		}
	});

	/**
	 * Returns modified message for timeline logs
	 */
	Handlebars.registerHelper('tl_log_string', function(string) {

		return string.replace("Sending email From:", "Email sent From:");
	});

	/**
	 * Returns "Lead Score" of a contact, when it is greater than zero only
	 */
	Handlebars.registerHelper('lead_score', function(value) {
		if (this.lead_score > 0)
			return this.lead_score;
		else
			return "";
	});

	/**
	 * Returns task completion status (Since boolean false is not getting
	 * printed, converted it into string and returned.)
	 */
	Handlebars.registerHelper('task_status', function(status) {
		if (status)
			return true;

		// Return false as string as the template can not print boolean false
		return "false";

	});

	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 */
	Handlebars.registerHelper('if_equals', function(value, target, options) {

		if (!target)
			return options.inverse(this);

		if (value == target)
			return options.fn(this);
		else
			return options.inverse(this);
	});
	
	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 */
	Handlebars.registerHelper('if_greater', function(value, target, options) {

		if (target > value)
			return options.inverse(this);
		else
			return options.fn(this);
	});

	/**
	 * Adds Custom Fields to forms, where this helper function is called
	 */
	Handlebars.registerHelper('show_custom_fields', function(custom_fields,
			properties) {

		var el = show_custom_fields_helper(custom_fields, properties);
		return new Handlebars.SafeString(fill_custom_field_values($(el),
				properties));

	});

	Handlebars
			.registerHelper(
					'is_link',
					function(value, options) {

						var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

						if (value.search(exp) != -1)
							return options.fn(this);
						else
							return options.inverse(this);
					});

	Handlebars
			.registerHelper(
					'show_link_in_statement',
					function(value) {

						var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

						try {
							value = value
									.replace(exp,
											"<a href='$1' target='_blank' class='cd_hyperlink'>$1</a>");
							return new Handlebars.SafeString(value);
						} catch (err) {
							return value;
						}

					});

	/**
	 * Returns table headings for custom contacts list view
	 */
	Handlebars.registerHelper('displayPlan', function(value) {

		return ucfirst(value).replaceAll("_", " ");

	});

	Handlebars.registerHelper('getCurrentContactProperty', function(value) {
		if (App_Contacts.contactDetailView
				&& App_Contacts.contactDetailView.model) {
			var contact_properties = App_Contacts.contactDetailView.model
					.get('properties')
			console.log(App_Contacts.contactDetailView.model.toJSON());
			return getPropertyValue(contact_properties, value);
		}
	});

	Handlebars.registerHelper('safe_string', function(data) {

		data = data.replace(/\n/g, "<br/>");
		return new Handlebars.SafeString(data);
	});

	Handlebars.registerHelper('string_to_date', function(format, date) {

		return new Date(date).format(format);
	});

	Handlebars.registerHelper('isArray', function(data, options) {
		if (isArray(data))
			return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('is_string', function(data, options) {
		if(typeof data == "string")
			return options.fn(this);
		return options.inverse(this);
			
	});
	
	Handlebars.registerHelper("bindData", function(data) {
		
		return  JSON.stringify(data);
	});

	Handlebars.registerHelper("getCurrentUserPrefs", function(options) {
		if(CURRENT_USER_PREFS);
			return options.fn(CURRENT_USER_PREFS);
	});
	
	Handlebars.registerHelper("getCurrentDomain", function(options) {
		var url = window.location.host;
		
		var exp = /(\.)/;
		
		if(url.search(exp) >= 0)
			return url.split(exp)[0];

		return " ";
	});
	
	// Gets date in given range
	Handlebars.registerHelper('date-range', function(from_date_string, no_of_days,
	  options) {
	 var from_date = Date.parse(from_date_string);
	 var to_date = Date.today().add({
	  days : parseInt(no_of_days)
	 });
	 return to_date.toString('MMMM d, yyyy') + " - "
	   + from_date.toString('MMMM d, yyyy');

	});

	Handlebars.registerHelper("extractEmail", function(content, options) {

		console.log(content);
		
		return options.fn(content.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)[0]);
	});
	
	Handlebars.registerHelper('getCurrentContactPropertyBlock', function(value, options) {
		if (App_Contacts.contactDetailView
				&& App_Contacts.contactDetailView.model) {
			var contact_properties = App_Contacts.contactDetailView.model
					.get('properties')
			console.log(App_Contacts.contactDetailView.model.toJSON());
			return options.fn(getPropertyValue(contact_properties, value));
		}
	});
	
	Handlebars.registerHelper('isDuplicateContactProperty', function(properties, key,  options) {
		if (App_Contacts.contactDetailView
				&& App_Contacts.contactDetailView.model) {
			var contact_properties = App_Contacts.contactDetailView.model
					.get('properties')
					var currentContactEntity = getPropertyValue(contact_properties, key);
					var contactEntity = getPropertyValue(properties, key);
					
					if(!currentContactEntity || !contactEntity)
					{
						currentContactEntity = getPropertyValue(contact_properties, "first_name") + " " + getPropertyValue(contact_properties, "last_name");
						contactEntity = getPropertyValue(properties, "first_name") + " " + getPropertyValue(properties, "last_name");
					}
					
					if(getPropertyValue(contact_properties, key) == getPropertyValue(properties, key))
					 return options.fn(this);

					 return options.inverse(this)
		}
	});
	
	Handlebars.registerHelper('containString', function(value, target,  options) {
		if(target.search(value) != -1)
			return options.fn(this);
		
		return options.inverse(this);
	});
	
	Handlebars.registerHelper('numeric_operation', function(operand1, operand2, operator) {
		
		var operators = "/*-+";
		
		if (operators.indexOf(operator) == -1)
			return "";
		
		if(operator == "+")
			return operand1 + operand2;
		
		if(operator == "-")
			return operand1 - operand2;
		
		if(operator == "*")
			return operand1 * operand2;
		
		if(operator == "/")
			return operand1 / operand2;
	});
	
	Handlebars.registerHelper('check_length', function(content, length, options) {
		
		if(parseInt(content.length) > parseInt(length))
			return options.fn(this);
		
		return options.inverse(this);
	});
	
	Handlebars.registerHelper('iterate_json', function(context, options) {
	    var result = "";
	    var count = 0;
	    var length = 0;
	    for(var prop in context)
	    {
	    	length++;
	    }
	    
	    for(var prop in context)
	    {
	    	count++;
	    	if(count == length)
	    		result = result + options.fn({ property:prop, value:context[prop], last:true });
	    	else
	    		result = result + options.fn({ property:prop, value:context[prop], last:false });
	    	
	    }
	    
	    console.log(result);
	    return result;
	});
	
	Handlebars.registerHelper('get_social_icon', function(name)
	{
		if(!name)
			return;
		
		var icon_json = {
							"TWITTER" : "icon-twitter-sign", 
							"LINKEDIN" : "icon-linkedin-sign", 
							"URL" : "icon-globe",
							"GOOGLE_PLUS" : "icon-google-plus-sign",
							"FACEBOOK" : "icon-facebook-sign",
							"GITHUB" : "icon-github",
							"FEED" : "icon-rss"
						}
		
		
		name = name.trim();
		
		if(icon_json[name])
			return icon_json[name];
		
		return "icon-globe";
		
	});
	
	Handlebars.registerHelper("each_with_index", function(array, options) {
		 var buffer = "";
		 for (var i = 0, j = array.length; i < j; i++) {
		  var item = array[i];
		 
		  // stick an index property onto the item, starting with 1, may make configurable later
		  item.index = i+1;
		 
		  // show the inside of the block
		  buffer += options.fn(item);
		 }
		 
		 // return the finished buffer
		 return buffer;
		 
		});
	
	Handlebars.registerHelper('if_json', function(context, options) {
		
		try
		{
			 var json = $.parseJSON(context);
			
			if(typeof json === 'object')
				return options.fn(this);
			return options.inverse(this);
		}
		catch(err)
		{
			return options.inverse(this);
		}
	});
	
	
	Handlebars.registerHelper('add_tag', function(tag) {
		addTagAgile(tag);
	});
	
	Handlebars.registerHelper('set_up_dashboard_padcontent', function(key){
		return new Handlebars.SafeString(getTemplate("empty-collection-model",
				CONTENT_JSON.dashboard[key]));
	});
	
	/**
	 * Removes surrounded square brackets
	 ***/
	Handlebars.registerHelper('removeSquareBrackets', function(value){
		return value.replace(/[\[\]]+/g,'');
	});
	
	/**
	 * Shows list of triggers separated by comma
	 **/
	Handlebars.registerHelper('toLinkTrigger', function(context,options){
		var ret = "";
		  for(var i=0, j=context.length; i<j; i++) {
		    ret = ret + options.fn(context[i]);
		    
		    // Avoid comma appending to last element
		    if (i<j-1) {
		      ret = ret + ", ";
		    };
		  }
		  return ret;
	});
	
	// Gets minutes from milli seconds
	Handlebars.registerHelper('millSecondsToMinutes', function(timeInMill) {
		 if (isNaN(timeInMill))
		  return;
		 var sec = timeInMill / 1000;
		 var min = Math.floor(sec / 60);
	
		 if (min < 1)
		  return Math.ceil(sec) + " secs";
	
		 var remainingSec = Math.ceil(sec % 60);
	
		 return min + " mins, " + remainingSec + " secs";
	});
});