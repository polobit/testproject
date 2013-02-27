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
	 * @param {Object}
	 *            tags array containing all tags
	 */
	Handlebars.registerHelper('tagslist', function(tags) {

		var json = {};

		// Store tags in a json, starting letter as key
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

		// Sorts it based on characters and then draws it
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

	/**
	 * Helper function to return date string from epoch time
	 */
	Handlebars.registerHelper('epochToHumanDate', function(format, date) {

		if(!date)
			return;
		
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
		var intMonth = new Date(parseInt(date) * 1000).getMonth();
		var intDay = new Date(parseInt(date) * 1000).getDate();

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
		var symbol = ((value.length < 4)? "$" : value.substring(4, value.length));
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
	 * Helper function, which executes different templates (entity related)
	 * based on entity type. Here "this" reffers the current entity object.
	 * (used in timeline)
	 * 
	 */
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

	/**
	 * Returns trigger type, by removing underscore and converting into
	 * lowercase, excluding first letter.
	 */
	Handlebars.registerHelper('titleFromEnums', function(value) {
		if(!value)
			return;
		
		var str = value.replace(/_/g, ' ');
		return ucfirst(str.toLowerCase());

	});
	
	/**
	 * Returns notification type,by replacing 'has been' with underscore and 
	 * converting into lowercase. 
	 */
	Handlebars.registerHelper('if_notification_type', function() {
		
		// Makes 'CONTACT CREATED' To 'COMPANY CREATED'
		if(this.type == "COMPANY")
		{
			var arr = this.notification.split('_');
			 var temp = arr[0].replace('CONTACT','COMPANY') + " " + arr[1];
			 return temp.toLowerCase();
		}
		
		// Makes 'TAG_CREATED' to 'created tag'
        if(this.notification == 'TAG_CREATED' || this.notification == 'TAG_DELETED')
			{
			  var arr = this.notification.split('_');
			  var temp = arr[0] + " " + arr[1];
			  return temp.toLowerCase();
			}
		
		// Replaces '_' with 'has been' 
		var str = this.notification.replace(/_/g, ' has been ');
		return str.toLowerCase();
		
	//return temp.charAt(0).toUpperCase() + temp.slice(1);
	});
	
	

	/**
	 * Displays all the properties of a contact in its detail view, excluding
	 * the function parameters (fname, lname, company etc..)
	 */
	Handlebars.registerHelper('if_property', function(fname, lname, company,
			title, email, image, options) {
		
		/*
		 * Converts address as comma seprated values and returns as
		 * handlebars safe string.
		 */ 
		if(this.name == "address"){
			var el = "<span><small><b>Address</b></small>";
			
			var address = JSON.parse(this.value);
			if(address.subtype)
				el = el.concat("(" + address.subtype +") :</br>");
			else
				el = el.concat(" :</br>");
			
			// Gets properties (keys) count of given json object
			var count = countJsonProperties(address);
			
			$.each(address, function(key, val){
				if(--count == 0){
					el = el.concat(val + ".</span></br>");
					return;
				}
				
				el = el.concat(val + ", ");
			});
			return new Handlebars.SafeString(el);
		}	
		if (this.name != fname && this.name != lname && this.name != company
				&& this.name != title && this.name != email && this.name != image)
			return options.fn(this);
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
			object[key] = JSON.parse(object[key]);
			return options.fn(object[key]);
		}

		return options.fn(JSON.parse(object));
	});

	/**
	 * Convert string to lower case
	 */
	Handlebars.registerHelper('toLowerCase', function(value) {
		return value.toLowerCase();
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
		
		if(!target)
			return options.inverse(this);
			
		if (value == target)
			return options.fn(this);
		else
			return options.inverse(this);
	})
	
	/**
	 * Adds Custom Fields to forms, where this helper function is called
	 */
	Handlebars.registerHelper('show_custom_fields', function(custom_fields,
			properties) {

		var el = show_custom_fields_helper(custom_fields, properties);
		return new Handlebars.SafeString(fill_custom_field_values($(el),
				properties));

	});
	
	 Handlebars.registerHelper('is_link', function(value, options) {
		  if (value.indexOf("http") != -1)
		   return options.fn(this);
		  else
		   return options.inverse(this);
		 });
	 
	 Handlebars.registerHelper('show_link_in_statement', function(value){
		   
		   if (value.indexOf("http") == -1)
		    return value;
		   var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		   
		   try {
		    value = value.replace(exp,"<a href='$1' target='_blank' class='cd_hyperlink'>$1</a>");
		    return new Handlebars.SafeString(value);
		   } 
		   catch (err) {
		    return text;
		   }

		  })
		  
		  /**
			 * Returns table headings for custom contacts list view
			 */
			Handlebars.registerHelper('displayPlan', function(value) {

				return ucfirst(value).replaceAll("_", " ");

				});
	 
	 
		  
		  
		  
});