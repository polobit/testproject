$(function()
{

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
	Handlebars.registerHelper('getPropertyValue', function(items, name)
	{
		return getPropertyValue(items, name);
	});

	/**
	 * Helper function to return the value of property based on sub-type of the
	 * property
	 */
	Handlebars.registerHelper('getPropertyValueBySubtype', function(items, name, subtype)
	{
		return getPropertyValueBySubtype(items, name, subtype);
	});

	/**
	 * Helper function to return the value of property based on type of the
	 * property
	 */
	Handlebars.registerHelper('getPropertyValueBytype', function(items, name, type, subtype)
	{
		return getPropertyValueBytype(items, name, type, subtype);
	});

	/**
	 * Returns twitter handle based on the twitter url of the profile. Accepts
	 * string URL and splits at last "/" and returns handle.
	 */
	Handlebars.registerHelper('getTwitterHandleByURL', function(value)
	{

		if (value.indexOf("https://twitter.com/") != -1)
			return value;

		value = value.substring(value.lastIndexOf("/") + 1);
		console.log(value);

		return value;
	});

	/**
	 * 
	 */
	Handlebars.registerHelper('getContactCustomProperties', function(items, options)
	{
		var fields = getContactCustomProperties(items);
		if (fields.length == 0)
			return options.inverse(fields);

		return options.fn(fields);

	});

	/**
	 * Returns custom fields without few fields like LINKEDIN or TWITTER or
	 * title fields
	 */
	Handlebars.registerHelper('getContactCustomPropertiesExclusively', function(items, options)
	{

		var exclude_by_subtype = [
				"LINKEDIN", "TWITTER"
		];
		var exclude_by_name = [
			"title"
		];

		var fields = getContactCustomProperties(items);

		var exclusive_fields = [];
		for (var i = 0; i < fields.length; i++)
		{
			if (jQuery.inArray(fields[i].name, exclude_by_name) != -1 || (fields[i].subtype && jQuery.inArray(fields[i].subtype, exclude_by_subtype) != -1))
			{
				continue;
			}

			exclusive_fields.push(jQuery.extend(true, {}, fields[i]));
		}
		if (exclusive_fields.length == 0)
			return options.inverse(exclusive_fields);

		$.getJSON("core/api/custom-fields/type/DATE", function(data)
		{

			if (data.length == 0)
				return;

			for (var j = 0; j < data.length; j++)
			{
				for (var i = 0; i < exclusive_fields.length; i++)
				{
					if (exclusive_fields[i].name == data[j].field_label)
						try
						{
							var value = exclusive_fields[i].value * 1000;

							if (!isNaN(value))
							{
								exclusive_fields[i].value = value;
								exclusive_fields[i]["subtype"] = data[j].field_type;
							}

						}
						catch (err)
						{
							exclusive_fields[i].value = exclusive_fields[i].value;
						}
				}
			}
			updateCustomData(options.fn(exclusive_fields));
		});

		return options.fn(exclusive_fields)

	});

	Handlebars.registerHelper('urlEncode', function(url, key, data)
	{

		var startChar = "&";
		if (url.indexOf("?") != -1)
			startChar = "&";

		var encodedUrl = url + startChar + key + "=" + escape(JSON.stringify(data));
		// console.log(encodedUrl.length + " " + encodedUrl);
		return encodedUrl;
	});

	Handlebars.registerHelper('encodeString', function(url)
	{
		return encodeURIComponent(url);
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
	Handlebars.registerHelper('gravatarurl', function(items, width)
	{

		if (items == undefined)
			return;

		// Checks if properties already has an image, to return it
		var agent_image = getPropertyValue(items, "image");
		if (agent_image)
			return agent_image;

		// Default image
		var img = DEFAULT_GRAVATAR_url;

		var email = getPropertyValue(items, "email");
		if (email)
		{
			return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + "&d=" + escape(img);
		}

		return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + "&d=" + escape(img);

	});

	Handlebars.registerHelper('defaultGravatarurl', function(width)
	{
		// Default image
		var img = DEFAULT_GRAVATAR_url;

		return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + "&d=" + escape(img);
	});

	Handlebars.registerHelper('emailGravatarurl', function(width, email)
	{
		// Default image
		var img = DEFAULT_GRAVATAR_url;

		if (email)
		{
			return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + "&d=" + escape(img);
		}

		return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + "&d=" + escape(img);
	});

	/**
	 * CSS text avatars
	 */
	Handlebars.registerHelper('nameAvatar', function(items, width)
	{

		if (items == undefined)
			return;

		// Checks if properties already has an image, to return it
		var agent_image = getPropertyValue(items, "image");
		if (agent_image)
			return agent_image;

		var email = getPropertyValue(items, "email");
		if (email)
		{
			return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + '&d=404';
		}

		return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + '&d=404';

	});

	/**
	 * To add data-name attribute to image tags
	 */
	Handlebars.registerHelper('dataNameAvatar', function(items)
	{

		if (items == undefined)
			return;

		var name = "";

		if (getPropertyValue(items, "first_name"))
			name = name + "" + getPropertyValue(items, "first_name").substr(0, 1);

		if (getPropertyValue(items, "last_name"))
			name = name + "" + getPropertyValue(items, "last_name").substr(0, 1);

		return name;

	});

	/**
	 * Helper function to return icons based on given name
	 * 
	 * @method icons
	 * @param {String}
	 *            item name to get icon
	 * @returns icon name
	 */
	Handlebars.registerHelper('icons', function(item)
	{
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
		if (item == "other")
			return "icon-tasks";

	});

	Handlebars.registerHelper('eachkeys', function(context, options)
	{
		var fn = options.fn, inverse = options.inverse;
		var ret = "";

		var empty = true;
		for (key in context)
		{
			empty = false;
			break;
		}

		if (!empty)
		{
			for (key in context)
			{
				ret = ret + fn({ 'key' : key, 'value' : context[key] });
			}
		}
		else
		{
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
	Handlebars.registerHelper('ucfirst', function(value)
	{
		return (value && typeof value === 'string') ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) : '';
	});

	/**
	 * Returns Contact short name
	 */
	Handlebars.registerHelper('contactShortName', function()
	{
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{

			var contact_properties = App_Contacts.contactDetailView.model.get('properties');

			if (App_Contacts.contactDetailView.model.get('type') == 'PERSON')
			{
				for (var i = 0; i < contact_properties.length; i++)
				{

					if (contact_properties[i].name == "last_name")
						return contact_properties[i].value;
					else if (contact_properties[i].name == "first_name")
						return contact_properties[i].value;
				}
				return "Contact";
			}
			else
			{
				for (var i = 0; i < contact_properties.length; i++)
				{
					if (contact_properties[i].name == "name")
						return contact_properties[i].value;
				}
				return "Company";
			}
		}
	});

	/**
	 * Returns workflow name surrounded by quotations if exists, otherwise this
	 */
	Handlebars.registerHelper('workflowName', function()
	{
		if (App_Workflows.workflow_model)
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
	Handlebars.registerHelper('task_property', function(value)
	{

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
	Handlebars.registerHelper('tagslist', function(tags)
	{

		console.log(tags);
		var json = {};

		// Store tags in a json, starting letter as key
		for (var i = 0; i < tags.length; i++)
		{

			var tag = tags[i].tag;
			// console.log(tag);
			var start = tag.charAt(0).toUpperCase();

			var array = new Array();

			// see if it is already present
			if (json[start] != undefined)
			{
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

		for ( var i in keys)
		{

			var array = json[keys[i]];

			html += "<div class='tag-element'><div class='tag-key'>" + keys[i] + "</div> ";

			html += "<div class='tag-values'>";

			for (var i = 0; i < array.length; i++)
			{
				console.log("************************");
				console.log(array[i]);
				var hrefTag = "#tags/" + encodeURIComponent(array[i]);

				html += ('<a href=\"' + hrefTag + '\" >' + array[i] + '</a> ');
			}
			html += "</div></div>";

		}

		return html;
	});

	Handlebars
			.registerHelper(
					'setupTags',
					function(tags)
					{

						console.log(tags);
						var json = {};

						var keys = [];
						// Store tags in a json, starting letter as key
						for (var i = 0; i < tags.length; i++)
						{
							var tag = tags[i].tag;
							var key = tag.charAt(0).toUpperCase();
							// console.log(tag);
							if (jQuery.inArray(key, keys) == -1)
								keys.push(key);
						}

						// To sort tags in case-insensitive order i.e. keys in
						// json object
						keys.sort();
						console.log(keys);
						var html = "";
						for (var i = 0; i < keys.length; i++)
						{
							html += "<div class='tag-element' style='margin-right:10px;'><div class='tag-key'>" + keys[i] + "</div><div class='tag-values' tag-alphabet=\"" + encodeURI(keys[i]) + "\"></div></div>";
						}
						return new Handlebars.SafeString(html);
					});

	// To show milestones as columns in deals
	Handlebars
			.registerHelper(
					'deals_by_milestones',
					function(data)
					{
						var html = "";
						var count = Object.keys(data).length;
						$
								.each(
										data,
										function(key, value)
										{
											if (count == 1 && key == "")
											{
												html += '<div class="slate" style="margin:0px;"><div class="slate-content"><div class="box-left"><img alt="Clipboard" src="/img/clipboard.png"></div><div class="box-right"><h3>You have no milestones defined</h3><br><a href="#milestones" class="btn"><i class="icon icon-plus-sign"></i> Add Milestones</a></div></div></div>';
											}
											else
											{
												html += "<div class='milestone-column'><div class='dealtitle-angular'><p class='milestone-heading'>" + key + "</p><span></span></div><ul class='milestones' milestone='" + key + "'>";
												for ( var i in value)
												{
													if (value[i].id)
														html += "<li id='" + value[i].id + "'>" + getTemplate("opportunities-grid-view", value[i]) + "</li>";
												}
												html += "</ul></div>";
											}
										});
						return html;
					});

	// To show milestones as sortable list
	Handlebars
			.registerHelper(
					'milestone_ul',
					function(data)
					{
						var html = "<ul class='milestone-value-list tagsinput' style='padding:1px;list-style:none;'>";
						if (data)
						{
							var milestones = data.split(",");
							for ( var i in milestones)
							{
								html += "<li data='" + milestones[i] + "'><div><span>" + milestones[i] + "</span><a class='milestone-delete right' href='#'>&times</a></div></li>";
							}
						}
						html += "</ul>";
						return html;
					});

	/**
	 * Helper function to return date string from epoch time
	 */
	Handlebars.registerHelper('epochToHumanDate', function(format, date)
	{

		if (!format)
			format = "mmm dd yyyy HH:MM:ss";

		if (!date)
			return;

		if ((date / 100000000000) > 1)
		{
			console.log(new Date(parseInt(date)).format(format));
			return new Date(parseInt(date)).format(format, 0);
		}
		// date form milliseconds
		var d = new Date(parseInt(date) * 1000).format(format);

		return d

		// return $.datepicker.formatDate(format , new Date( parseInt(date) *
		// 1000));
	});

	/**
	 * Helper function to return the date string converting to local timezone.
	 */
	Handlebars.registerHelper('toLocalTimezone', function(dateString)
	{
		var date = new Date(dateString);

		return date.toDateString() + ' ' + date.toLocaleTimeString();
	});

	/**
	 * Helper function to return the date string converting to local timezone
	 * from UTC.
	 */
	Handlebars.registerHelper('toLocalTimezoneFromUtc', function(dateString)
	{
		var date = new Date(dateString + ' GMT+0000');

		return date.toDateString() + ' ' + date.toLocaleTimeString();
	});

	/**
	 * Helper function to return task date (MM dd, ex: Jan 10 ) from epoch time
	 */
	Handlebars.registerHelper('epochToTaskDate', function(date)
	{

		var intMonth, intDay;

		// Verifies whether date is in milliseconds, then
		// no need to multiply with 1000
		if ((date / 100000000000) > 1)
		{
			intMonth = new Date(date).getMonth();
			intDay = new Date(date).getDate();
		}
		else
		{
			intMonth = new Date(parseInt(date) * 1000).getMonth();
			intDay = new Date(parseInt(date) * 1000).getDate();
		}
		var monthArray = [
				"Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"
		];

		return (monthArray[intMonth] + " " + intDay);
	});

	/**
	 * Helper function to return task color based on it's priority
	 */
	Handlebars.registerHelper('task_label_color', function(priority)
	{
		if (priority == 'HIGH' || priority == 'red')
			return 'important';
		if (priority == 'NORMAL' || priority == '#36C')
			return 'info';
		if (priority == 'LOW')
			return '';
		if (priority == 'green')
			return 'success';
	});

	/**
	 * Helper function to return event label based on it's priority
	 */
	Handlebars.registerHelper('event_priority', function(priority)
	{
		if (priority == 'red')
			return 'High';
		if (priority == '#36C')
			return 'Normal';
		if (priority == 'green')
			return 'Low';
	});

	/**
	 * Helper function to return type based on it's network type
	 */
	Handlebars.registerHelper('network', function(type)
	{
		if (type == 'GOOGLE')
			return 'Google Drive';
		if (type == 'S3')
			return 'Uploaded Doc';
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
	Handlebars.registerHelper('epochToDate', function(info_json, date_type)
	{

		var obj = JSON.parse(info_json);

		if (!obj[date_type])
			return "-";
		if (date_type != "created_time")
		{
			if ((obj[date_type] / 100000000000) > 1)
			{
				return new Date(parseInt(obj[date_type])).format("mmm dd yyyy HH:MM:ss", 0);
			}
			// date form milliseconds
			return new Date(parseInt(obj[date_type]) * 1000).format("mmm dd yyyy HH:MM:ss", 0);
		}
		else
		{
			var intMonth = new Date(parseInt(obj[date_type]) * 1000).getMonth();
			var intDay = new Date(parseInt(obj[date_type]) * 1000).getDate();
			var intYear = new Date(parseInt(obj[date_type]) * 1000).getFullYear();

			var monthArray = [
					"Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"
			];

			return (monthArray[intMonth] + " " + intDay + ", " + intYear);
		}
	});

	/**
	 * Returns currency symbol based on the currency value (deals)
	 */
	Handlebars.registerHelper('currencySymbol', function()
	{
		var value = ((CURRENT_USER_PREFS.currency != null) ? CURRENT_USER_PREFS.currency : "USD-$");
		var symbol = ((value.length < 4) ? "$" : value.substring(4, value.length));
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
	Handlebars.registerHelper('calculatePipeline', function(value, probability)
	{

		var pipeline = parseInt(value) * parseInt(probability) / 100;
		return pipeline;
	});

	/**
	 * Returns required log (time or message) from logs (campaign logs)
	 */
	Handlebars.registerHelper('getRequiredLog', function(log_array_string, name)
	{
		var logArray = JSON.parse(log_array_string);
		if (name == "t")
		{
			var readableTime = new Date(logArray[0][name] * 1000);
			return readableTime;
		}
		return logArray[0][name];
	});

	/**
	 * Returns table headings for custom contacts list view
	 */
	Handlebars.registerHelper('contactTableHeadings', function(item)
	{

		var el = "";
		$.each(App_Contacts.contactViewModel[item], function(index, element)
		{

			element = element.replace("_", " ")

			el = el.concat('<th>' + ucfirst(element) + '</th>');

		});

		return new Handlebars.SafeString(el);
	});

	/**
	 * Returns table headings for reports custom contacts list view
	 */
	Handlebars.registerHelper('reportsContactTableHeadings', function(item)
	{

		var el = "";
		$.each(REPORT[item], function(index, element)
		{

			if (element.indexOf("properties_") != -1)
				element = element.split("properties_")[1];
			if (element.indexOf("custom_") == 0)
				element = element.split("custom_")[1];

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
	Handlebars.registerHelper('if_entity', function(item, options)
	{

		if (this.entity_type == item)
		{
			return options.fn(this);
		}
		if (!this.entity && this[item] != undefined)
		{
			return options.fn(this);
		}
	});

	/**
	 * Returns trigger type, by removing underscore and converting into
	 * lowercase, excluding first letter.
	 */
	Handlebars.registerHelper('titleFromEnums', function(value)
	{
		if (!value)
			return;

		var str = value.replace(/_/g, ' ');
		return ucfirst(str.toLowerCase());

	});

	Handlebars.registerHelper('actionTemplate', function(actions)
	{
		if (!actions)
			return;

		var actions_count = actions.length;

		var el = '<div style="white-space: normal!important;word-break: break-word;">';

		$.each(actions, function(key, val)
		{
			if (--actions_count == 0)
			{
				el = el.concat(titleFromEnums(val.action));
				return;
			}
			el = el.concat(titleFromEnums(val.action) + ", ");
		});

		el = el.concat('</div>');
		return new Handlebars.SafeString(el);

	});

	Handlebars.registerHelper('triggerType', function(value)
	{
		if (value == 'ADD_SCORE')
			return value.replace('ADD_SCORE', 'Score (>=)');

		return titleFromEnums(value);
	});

	/**
	 * Returns notification type,by replacing 'has been' with underscore and
	 * converting into lowercase.
	 */
	Handlebars.registerHelper('if_notification_type', function()
	{

		// Makes 'CONTACT CREATED' To 'COMPANY CREATED'
		if (this.type == "COMPANY")
		{
			var arr = this.notification.split('_');
			var temp = ucfirst(arr[0].replace('CONTACT', 'COMPANY')) + " " + ucfirst(arr[1]);
			return " - " + temp;
		}

		// Replaces '_' with ' '
		var str = this.notification.replace(/_/, ' ');

		switch (str) {
		case "IS BROWSING":
			return str.toLowerCase() + " " + this.custom_value;

		case "CLICKED LINK":
			var customJSON = JSON.parse(this.custom_value);

			if (customJSON["workflow_name"] == undefined)
				return str.toLowerCase() + " " + customJSON.url_clicked;

			return str.toLowerCase() + " " + customJSON.url_clicked + " " + " of campaign " + "\"" + customJSON.workflow_name + "\""

		case "OPENED EMAIL":
			var customJSON = JSON.parse(this.custom_value);

			if (customJSON.hasOwnProperty("workflow_name"))
				return str.toLowerCase() + " " + " of campaign " + "\"" + customJSON.workflow_name + "\"";

			return str.toLowerCase() + " with subject " + "\"" + customJSON.email_subject + "\"";

		case "CONTACT ADDED":
			return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

		case "CONTACT DELETED":
			return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

		case "DEAL CREATED":
			return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

		case "DEAL CLOSED":
			return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

		case "TAG ADDED":
			return " - " + "\"" + this.custom_value + "\" " + str.toLowerCase().split(' ')[0] + " has been " + str.toLowerCase().split(' ')[1];

		case "TAG DELETED":
			return " - " + "\"" + this.custom_value + "\" " + str.toLowerCase().split(' ')[0] + " has been " + str.toLowerCase().split(' ')[1];

		default:
			return str.toLowerCase();
		}
	});

	/**
	 * Converts Epoch Time to Human readable date of default format.Used for
	 * campaign-logs.
	 */
	Handlebars.registerHelper('epochToLogDate', function(logTime)
	{
		return new Date(logTime * 1000);
	});

	/**
	 * Returns country name from country code.
	 */
	Handlebars.registerHelper('getCountryName', function(countrycode)
	{
		// retrieves country name from code using country-from-code.js
		return getCode(countrycode);
	});

	/**
	 * Replace '+' symbols with space.Used in notification.
	 */
	Handlebars.registerHelper('replace_plus_symbol', function(name)
	{

		return name.replace(/\+/, ' ');
	});

	/**
	 * Removes forward slash. Makes A/B to AB. Used in contact-detail-campaigns
	 */
	Handlebars.registerHelper('removeSlash', function(value)
	{
		if (value == 'A/B')
			return value.replace(/\//, '');

		return value;
	});

	/**
	 * Displays all the properties of a contact in its detail view, excluding
	 * the function parameters (fname, lname, company etc..)
	 */
	Handlebars
			.registerHelper(
					'if_property',
					function(fname, lname, company, title, image, email, phone, website, address, options)
					{

						if (this.name != fname && this.name != lname && this.name != company && this.name != title && this.name != image && this.name != email && this.name != phone && this.name != website && this.name != address)
							return options.fn(this);
					});

	/**
	 * Counts the existence of property name which occurred multiple times.
	 */
	Handlebars.registerHelper('property_is_exists', function(name, properties, options)
	{

		if (getPropertyValue(properties, name))
			return options.fn(this);
		return options.inverse(this);
	});

	// gets the refernce code of current domain

	Handlebars.registerHelper('get_current_domain', function()
	{
		return CURRENT_DOMAIN_USER.domain;
	});

	/*
	 * To add comma in between the elements.
	 */
	Handlebars.registerHelper('comma_in_between_property', function(value1, value2, properties, options)
	{

		if (getPropertyValue(properties, value1) && getPropertyValue(properties, value2))
			return ",";
	});

	Handlebars.registerHelper('property_subtype_is_exists', function(name, subtype, properties, options)
	{

		if (getPropertyValueBySubtype(properties, name, subtype))
			return options.fn(this);
		return options.inverse(this);
	});

	/**
	 * Displays multiple times occurred properties of a contact in its detail
	 * view in single entity
	 */
	Handlebars.registerHelper('multiple_Property_Element', function(name, properties, options)
	{

		var matching_properties_list = agile_crm_get_contact_properties_list(name)
		if (matching_properties_list.length > 0)
			return options.fn(matching_properties_list);
	});

	/**
	 * Converts address as comma seprated values and returns as handlebars safe
	 * string.
	 */
	Handlebars
			.registerHelper(
					'address_Element',
					function(properties)
					{
						var properties_count = 0;
						for (var i = 0, l = properties.length; i < l; i++)
						{

							if (properties[i].name == "address")
							{
								var el = '<div style="display: inline-block; vertical-align: top;text-align:right;margin-top:0px" class="span4"><span><strong style="color:gray">Address</strong></span></div>';

								var address = {};
								try
								{
									address = JSON.parse(properties[i].value);
								}
								catch (err)
								{
									address['address'] = properties[i].value;
								}

								// Gets properties (keys) count of given json
								// object
								var count = countJsonProperties(address);

								if (properties_count != 0)

									el = el
											.concat('<div style="display:inline;padding-right: 0px!important;display: inline-block;padding-bottom: 2px; line-height: 20px;" class="span8 contact-detail-entity-list"><div style="padding-top:3px;"><span>');
								else
									el = el
											.concat('<div style="display:inline;display: inline-block;padding-bottom: 2px; line-height: 20px;" class="span8"><div><span>');

								$.each(address, function(key, val)
								{
									if (--count == 0)
									{
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
							else if (properties[i].name == "phone" || properties[i].name == "email")
							{
								++properties_count;
							}
						}
					});

	Handlebars.registerHelper('address_Template', function(properties)
	{

		for (var i = 0, l = properties.length; i < l; i++)
		{

			if (properties[i].name == "address")
			{
				var el = '';

				var address = {};
				try
				{
					address = JSON.parse(properties[i].value);
				}
				catch (err)
				{
					address['address'] = properties[i].value;
				}

				// Gets properties (keys) count of given json
				// object
				var count = countJsonProperties(address);

				$.each(address, function(key, val)
				{
					if (--count == 0)
					{
						el = el.concat(val + ".");
						return;
					}
					el = el.concat(val + ", ");
				});
				/*
				 * if (properties[i].subtype) el = el.concat(" <span
				 * class='label'>" + properties[i].subtype + "</span>");
				 */

				return new Handlebars.SafeString(el);
			}
		}
	});

	// To show related to contacts for contacts as well as companies
	Handlebars.registerHelper('related_to_contacts', function(data, options)
	{
		var el = "";
		var count = data.length;
		$.each(data, function(key, value)
		{
			var html = getTemplate("related-to-contacts", value);
			if (--count == 0)
			{
				el = el.concat(html);
				return;
			}
			el = el.concat(html + ", ");
		});
		return new Handlebars.SafeString(el);
	});

	// To show only one related to contacts or companies in deals
	Handlebars.registerHelper('related_to_one', function(data, options)
	{
		// return "<span>" + getTemplate("related-to-contacts", data[0]) +
		// "</span>";
		var el = "";
		var count = data.length;
		$.each(data, function(key, value)
		{
			if (key <= 3)
			{
				var html = getTemplate("related-to-contacts", value);
				if (--count == 0 || key == 3)
				{
					el = el.concat(html);
					return;
				}
				el = el.concat(html + ", ");
			}

		});
		return new Handlebars.SafeString(el);

	});

	/**
	 * To represent a number with commas in deals
	 */
	Handlebars.registerHelper('numberWithCommas', function(value)
	{
		if (value)
			return value.toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",").replace('.00', '');
	});

	/**
	 * Converts reports/view field element as comma seprated values and returns
	 * as handlebars safe string.
	 */
	Handlebars.registerHelper('field_Element', function(properties)
	{
		var el = "";
		var count = properties.length;

		$.each(properties, function(key, value)
		{

			if (value.indexOf("properties_") != -1)
				value = value.split("properties_")[1];
			else if (value.indexOf("custom_") != -1)
				value = value.split("custom_")[1];
			else if (value.indexOf("CUSTOM_") != -1)
				value = value.split("CUSTOM_")[1];
			else if (value == "created_time")
				value = "Created Date";
			else if (value == "updated_time")
				value = "Updated Date";

			value = value.replace("_", " ");

			if (--count == 0)
			{
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
	Handlebars.registerHelper('stringToJSON', function(object, key, options)
	{
		console.log(object);
		console.log(key);
		if (key)
		{
			try
			{

				object[key] = JSON.parse(object[key]);
			}
			finally
			{
				return options.fn(object[key]);
			}
		}

		try
		{
			return options.fn(JSON.parse(object));
		}
		catch (err)
		{
			return options.fn(object);
		}
	});

	/**
	 * Checks the existence of property name and prints value
	 */
	Handlebars.registerHelper('if_propertyName', function(pname, options)
	{
		for (var i = 0; i < this.properties.length; i++)
		{
			if (this.properties[i].name == pname)
				return options.fn(this.properties[i]);
		}
		return options.inverse(this);
	});

	/*
	 * Gets company image from a contact object.
	 * 
	 * --If image uploaded, returns that ( the frame size requested ). --Else if
	 * url present, fetch icon from the url via Google S2 service (frame
	 * size=32x32) --Else return img/company.png ( the frame size requested ).
	 * 
	 * --CSS for frame is adjusted when fetching from url ( default padding =
	 * 4px , now 4+adjust ). --'onError' is an attribute (js function) fired
	 * when image fails to download, maybe due to remote servers being down It
	 * defaults to img/company.png which should be present in server as static
	 * file
	 * 
	 * Usage: e.g. <img {{getCompanyImage "40" "display:inline"}} class="..."
	 * ... >
	 * 
	 * This helper sets src,onError & style attribute. "40" is full frame size
	 * requested. Additional styles like "display:inline;" or "display:block;"
	 * can be specified in 2nd param.
	 * 
	 * @author Chandan
	 */
	Handlebars
			.registerHelper(
					'getCompanyImage',
					function(frame_size, additional_style)
					{

						var full_size = parseInt(frame_size); // size
						// requested,full
						// frame
						var size_diff = 4 + ((full_size - 32) / 2); // calculating
						// padding,
						// for small
						// favicon
						// 16x16 as
						// 32x32,
						// fill rest frame with padding

						// default when we can't find image uploaded or url to
						// fetch from
						var default_return = "src='img/company.png' style='width:" + full_size + "px; height=" + full_size + "px;" + additional_style + "'";

						// when the image from uploaded one or favicon can't be
						// fetched, then show company.png, adjust CSS ( if style
						// broken by favicon ).
						var error_fxn = "";

						for (var i = 0; i < this.properties.length; i++)
						{
							if (this.properties[i].name == "image")
							{
								default_return = "src='" + this.properties[i].value + "' style='width:" + full_size + "px; height=" + full_size + "px;" + additional_style + ";'";
								// found uploaded image, break, no need to
								// lookup url

								error_fxn = "this.src='img/company.png'; this.onerror=null;";
								// no need to resize, company.png is of good
								// quality & can be scaled to this size

								break;
							}
							if (this.properties[i].name == "url")
							{
								default_return = "src='https://www.google.com/s2/favicons?domain=" + this.properties[i].value + "' " + "style='width:32px; height:32px; padding:" + size_diff + "px; " + additional_style + " ;'";
								// favicon fetch -- Google S2 Service, 32x32,
								// rest padding added

								error_fxn = "this.src='img/company.png'; " + "$(this).css('width','" + frame_size + "px'); $(this).css('height','" + frame_size + "px');" + "$(this).css('padding','4px'); this.onerror=null;";
								// resize needed as favicon is 16x16 & scaled to
								// just 32x32, company.png is adjusted on error
							}
						}
						// return safe string so that our html is not escaped
						return new Handlebars.SafeString(default_return + " onError=\"" + error_fxn + "\"");
					});

	/**
	 * Get appropriate link i.e. protocol://whatever.xxx. If no protocol
	 * present, assume http
	 */
	Handlebars.registerHelper('getHyperlinkFromURL', function(url)
	{
		if (url.match(/((http|http[s]|ftp|file):\/\/)/) != null)
			return url;
		return 'http://' + url;
	});

	Handlebars.registerHelper('getSkypeURL', function(url)
	{
		if (url.match("skype:") != null)
			return url;
		return 'skype:' + url;
	});

	Handlebars.registerHelper('getFacebookURL', function(url)
	{
		return url.replace('@', '');
	});

	// Get Count
	Handlebars.registerHelper('count', function()
	{
		return getCount(this);
	});

	Handlebars
			.registerHelper(
					'contacts_count',
					function()
					{
						var count_message;
						if (this[0] && this[0].count && (this[0].count != -1))
						{

							if (this[0].count > 9999 && readCookie('contact_filter'))
								count_message = "<small> (" + 10000 + "+ Total) </small>" + '<span style="vertical-align: text-top; margin-left: -5px">' + '<img border="0" src="/img/help.png"' + 'style="height: 10px; vertical-align: middle" rel="popover"' + 'data-placement="bottom" data-title="Lead Score"' + 'data-content="Looks like there are over 10,000 results. Sorry we can\'t give you a precise number in such cases."' + 'id="element" data-trigger="hover">' + '</span>';

							else
								count_message = "<small> (" + this[0].count + " Total) </small>";
						}
						else
							count_message = "<small> (" + this.length + " Total) </small>";

						return new Handlebars.SafeString(count_message);
					});

	/**
	 * 
	 * Returns subscribers count without parenthesis
	 * 
	 */
	Handlebars.registerHelper('subscribers_count', function()
	{

		if (this[0] && this[0].count && (this[0].count != -1))
			return this[0].count;

		return this.length;

	});

	/**
	 * Convert string to lower case
	 */
	Handlebars.registerHelper('toLowerCase', function(value)
	{
		if (!value)
			return;
		return value.toLowerCase();
	});

	/**
	 * Convert string to lower case
	 */
	Handlebars.registerHelper('toUpperCase', function(value)
	{
		if (!value)
			return;
		return value.toUpperCase();
	});

	/**
	 * Executes template, based on contact type (person or company)
	 */
	Handlebars.registerHelper('if_contact_type', function(ctype, options)
	{
		if (this.type == ctype)
		{
			return options.fn(this);
		}
	});

	Handlebars.registerHelper('wrap_entity', function(item, options)
	{

		if (item)
			return options.fn(item);
	});

	/**
	 * Returns modified message for timeline logs
	 */
	Handlebars.registerHelper('tl_log_string', function(string)
	{

		return string.replace("Sending email From:", "Email sent From:");
	});

	/**
	 * Returns "Lead Score" of a contact, when it is greater than zero only
	 */
	Handlebars.registerHelper('lead_score', function(value)
	{
		if (this.lead_score > 0)
			return this.lead_score;
		else
			return "";
	});

	/**
	 * Returns task completion status (Since boolean false is not getting
	 * printed, converted it into string and returned.)
	 */
	Handlebars.registerHelper('task_status', function(status)
	{
		if (status)
			return true;

		// Return false as string as the template can not print boolean false
		return "false";

	});

	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 */
	Handlebars.registerHelper('if_equals', function(value, target, options)
	{

		/*
		 * console.log("typeof target: " + typeof target + " target: " +
		 * target); console.log("typeof value: " + typeof value + " value: " +
		 * value);
		 */
		/*
		 * typeof is used beacuse !target returns true if it is empty string,
		 * when string is empty it should not go undefined
		 */
		if ((typeof target === "undefined") || (typeof value === "undefined"))
			return options.inverse(this);

		if (value.toString().trim() == target.toString().trim())
			return options.fn(this);
		else
			return options.inverse(this);
	});

	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 */
	Handlebars.registerHelper('if_greater', function(value, target, options)
	{
		if (parseInt(target) > value)
			return options.inverse(this);
		else
			return options.fn(this);
	});

	/**
	 * Compares the arguments (value and target) and executes the template based
	 * on the result (used in contacts typeahead)
	 */
	Handlebars.registerHelper('if_less_than', function(value, target, options)
	{
		if (target < value)
			return options.inverse(this);
		else
			return options.fn(this);
	});

	Handlebars.registerHelper('campaigns_heading', function(value, options)
	{
		var val = 0;
		if (value && value[0] && value[0].count)
			val = value[0].count;

		if (val <= 20)
			return "Workflows";

		return "(" + val + " Total)";
	});

	/**
	 * Adds Custom Fields to forms, where this helper function is called
	 */
	Handlebars.registerHelper('show_custom_fields', function(custom_fields, properties)
	{

		var el = show_custom_fields_helper(custom_fields, properties);
		return new Handlebars.SafeString(fill_custom_field_values($(el), properties));

	});

	Handlebars.registerHelper('is_link', function(value, options)
	{

		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

		if (value.search(exp) != -1)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	Handlebars.registerHelper('show_link_in_statement', function(value)
	{

		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

		try
		{
			value = value.replace(exp, "<a href='$1' target='_blank' class='cd_hyperlink'>$1</a>");
			return new Handlebars.SafeString(value);
		}
		catch (err)
		{
			return value;
		}

	});

	/**
	 * Returns table headings for custom contacts list view
	 */
	Handlebars.registerHelper('displayPlan', function(value)
	{

		return ucfirst(value).replaceAll("_", " ");

	});

	Handlebars.registerHelper('getCurrentContactProperty', function(value)
	{
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{
			var contact_properties = App_Contacts.contactDetailView.model.get('properties')
			console.log(App_Contacts.contactDetailView.model.toJSON());
			return getPropertyValue(contact_properties, value);
		}
	});

	Handlebars.registerHelper('safe_string', function(data)
	{

		data = data.replace(/\n/, "<br/>");
		return new Handlebars.SafeString(data);
	});

	Handlebars.registerHelper('string_to_date', function(format, date)
	{

		return new Date(date).format(format);
	});

	Handlebars.registerHelper('isArray', function(data, options)
	{
		if (isArray(data))
			return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('is_string', function(data, options)
	{
		if (typeof data == "string")
			return options.fn(this);
		return options.inverse(this);

	});

	Handlebars.registerHelper("bindData", function(data)
	{

		return JSON.stringify(data);
	});

	Handlebars.registerHelper("getCurrentUserPrefs", function(options)
	{
		if (CURRENT_USER_PREFS)
			;
		return options.fn(CURRENT_USER_PREFS);
	});

	Handlebars.registerHelper("getCurrentDomain", function(options)
	{

		var url = window.location.host;

		var exp = /(\.)/;

		if (url.search(exp) >= 0)
			return url.split(exp)[0];

		return " ";
	});

	// Gets date in given range
	Handlebars.registerHelper('date-range', function(from_date_string, no_of_days, options)
	{
		var from_date = Date.parse(from_date_string);
		var to_date = Date.today().add({ days : parseInt(no_of_days) });
		return to_date.toString('MMMM d, yyyy') + " - " + from_date.toString('MMMM d, yyyy');

	});

	Handlebars.registerHelper("extractEmail", function(content, options)
	{

		console.log(content);

		return options.fn(content.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)[0]);
	});

	Handlebars.registerHelper('getCurrentContactPropertyBlock', function(value, options)
	{
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{
			var contact_properties = App_Contacts.contactDetailView.model.get('properties')
			console.log(App_Contacts.contactDetailView.model.toJSON());
			return options.fn(getPropertyValue(contact_properties, value));
		}
	});

	Handlebars.registerHelper('isDuplicateContactProperty', function(properties, key, options)
	{
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{
			var contact_properties = App_Contacts.contactDetailView.model.get('properties')
			var currentContactEntity = getPropertyValue(contact_properties, key);
			var contactEntity = getPropertyValue(properties, key);

			if (!currentContactEntity || !contactEntity)
			{
				currentContactEntity = getPropertyValue(contact_properties, "first_name") + " " + getPropertyValue(contact_properties, "last_name");
				contactEntity = getPropertyValue(properties, "first_name") + " " + getPropertyValue(properties, "last_name");
			}

			if (currentContactEntity == contactEntity)
				return options.fn(this);

			return options.inverse(this)
		}
	});

	Handlebars.registerHelper('containString', function(value, target, options)
	{
		if (target.search(value) != -1)
			return options.fn(this);

		return options.inverse(this);
	});

	Handlebars.registerHelper('numeric_operation', function(operand1, operand2, operator)
	{

		var operators = "/*-+";

		if (operators.indexOf(operator) == -1)
			return "";

		if (operator == "+")
			return operand1 + operand2;

		if (operator == "-")
			return operand1 - operand2;

		if (operator == "*")
			return operand1 * operand2;

		if (operator == "/")
			return operand1 / operand2;
	});

	Handlebars.registerHelper('check_length', function(content, length, options)
	{

		if (parseInt(content.length) > parseInt(length))
			return options.fn(this);

		return options.inverse(this);
	});

	Handlebars.registerHelper('check_json_length', function(content, length, options)
	{
		var json_length = 0;
		for ( var prop in content)
		{
			json_length++;
		}

		if (json_length == parseInt(length))
		{
			for ( var prop in content)
			{
				return options.fn({ property : prop, value : content[prop], last : true });
			}
		}

		return options.inverse(content);
	});

	Handlebars.registerHelper('iterate_json', function(context, options)
	{
		var result = "";
		var count = 0;
		var length = 0;
		for ( var prop in context)
		{
			length++;
		}

		for ( var prop in context)
		{
			count++;
			if (count == length)
				result = result + options.fn({ property : prop, value : context[prop], last : true });
			else
				result = result + options.fn({ property : prop, value : context[prop], last : false });

		}

		console.log(result);
		return result;
	});

	Handlebars.registerHelper('get_social_icon', function(name)
	{
		if (!name)
			return;

		var icon_json = { "TWITTER" : "icon-twitter-sign", "LINKEDIN" : "icon-linkedin-sign", "URL" : "icon-globe", "GOOGLE-PLUS" : "icon-google-plus-sign",
			"FACEBOOK" : "icon-facebook-sign", "GITHUB" : "icon-github", "FEED" : "icon-rss", "XING" : "icon-xing-sign", "SKYPE" : "icon-skype",
			"YOUTUBE" : "icon-youtube", "FLICKR" : "icon-flickr" };

		name = name.trim();

		if (icon_json[name])
			return icon_json[name];

		return "icon-globe";

	});

	Handlebars.registerHelper("each_with_index", function(array, options)
	{
		var buffer = "";
		for (var i = 0, j = array.length; i < j; i++)
		{
			var item = array[i];

			// stick an index property onto the item, starting with 1, may make
			// configurable later
			item.index = i + 1;

			console.log(item);
			// show the inside of the block
			buffer += options.fn(item);
		}

		// return the finished buffer
		return buffer;

	});

	Handlebars.registerHelper('if_json', function(context, options)
	{

		try
		{
			var json = $.parseJSON(context);

			if (typeof json === 'object')
				return options.fn(this);
			return options.inverse(this);
		}
		catch (err)
		{
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('add_tag', function(tag)
	{
		addTagAgile(tag);
	});

	Handlebars.registerHelper('set_up_dashboard_padcontent', function(key)
	{
		return new Handlebars.SafeString(getTemplate("empty-collection-model", CONTENT_JSON.dashboard[key]));
	});

	/**
	 * Removes surrounded square brackets
	 */
	Handlebars.registerHelper('removeSquareBrackets', function(value)
	{
		return value.replace(/[\[\]]+/g, '');
	});

	/**
	 * Removes "" with single quotes brackets
	 */
	Handlebars.registerHelper('removeDoubleCoutes', function(value)
	{
		var strings = value.replace(/[\[\]]+/g, '');
		var charwithsinglequote = strings.replace(/"/g, "'");
		return charwithsinglequote;
	});

	/**
	 * Shows list of triggers separated by comma
	 */
	Handlebars.registerHelper('toLinkTrigger', function(context, options)
	{
		var ret = "";
		for (var i = 0, j = context.length; i < j; i++)
		{
			ret = ret + options.fn(context[i]);

			// Avoid comma appending to last element
			if (i < j - 1)
			{
				ret = ret + ", ";
			}
			;
		}
		return ret;
	});

	// Gets minutes from milli seconds
	Handlebars.registerHelper('millSecondsToMinutes', function(timeInMill)
	{
		if (isNaN(timeInMill))
			return;
		var sec = timeInMill / 1000;
		var min = Math.floor(sec / 60);

		if (min < 1)
			return Math.ceil(sec) + " secs";

		var remainingSec = Math.ceil(sec % 60);

		return min + " mins, " + remainingSec + " secs";
	});

	Handlebars.registerHelper('if_overflow', function(content, div_height, options)
	{

		if (!content)
			return;

		console.log($('#Linkedin').width());
		content = content.trim();
		var element = $("<div style='width:" + $('#Linkedin').width() + "px;" + "word-break:normal;word-wrap:break-word;display:none;'>" + content + "</div>");

		$("#content").append(element);

		console.log(element.height() + " " + parseInt(div_height))
		if (element.height() > parseInt(div_height))
			return options.fn(this);
		return options.inverse(this);
	});

	/**
	 * To set up star rating in contacts listing
	 */
	Handlebars.registerHelper('setupRating', function(value)
	{

		var element = "";
		for (var i = 0; i < 5; i++)
		{
			if (i < parseInt(value))
			{
				element = element.concat('<li style="display: inline;"><img src="img/star-on.png" alt="' + i + '"></li>');
				continue;
			}
			element = element.concat('<li style="display: inline;"><img src="img/star-off.png" alt="' + i + '"></li>');
		}
		return new Handlebars.SafeString(element);
	});

	/**
	 * Builds options to be shown in the table heading of CSV import. Also tries
	 * to match headings in select field
	 */
	Handlebars.registerHelper('setupCSVUploadOptions', function(type, key, context)
	{
		// console.log(context.toJSON());
		var template;
		if (type == "contacts")
		{
			template = $(getTemplate('csv_upload_options', context));
		}
		else if (type == "company")
		{
			template = $(getTemplate('csv_companies_upload_options', context));
		}
		else if (type == "deals")
		{
			template = $(getTemplate('csv_deals_options', context));
		}

		// Replaces _ with spaces
		key = key.replace("_", " ");

		var isFound = false;

		var match_weight = 0;

		var key_length = key.length;
		var key = key.toLowerCase();
		var matched_value;

		var selected_element;
		template.find('option').each(function(index, element)
		{
			if ($(element).text().toLowerCase().indexOf(key) != -1)
			{

				var current_match_weight = key_length / $(element).text().length;
				if (match_weight >= current_match_weight)
					return;

				selected_element = $(element);
				matched_value = $(element).text();
				match_weight = current_match_weight;
			}
		})

		console.log(matched_value + ", " + key + " : " + match_weight);

		for (var i = 0; i < key.length - 3; i++)
		{
			template.find('option').each(function(index, element)
			{
				if ($(element).text().toLowerCase().indexOf(key.substr(0, key.length - i).toLowerCase()) != -1)
				{
					console.log(key.substr(0, key.length - i) + " , " + $(element).text());
					var current_match_weight = key.substr(0, key.length - i).length / $(element).text().length;
					console.log(current_match_weight);
					if (match_weight >= current_match_weight)
						return;
					selected_element = $(element);
					matched_value = $(element).text();
					match_weight = current_match_weight;
				}
			})
		}

		$(selected_element).attr("selected", true);

		/*
		 * // Iterates to create various combinations and check with the header
		 * for ( var i = 0; i < key.length - 3; i++) {
		 * template.find('option').each(function(index, element) { if
		 * ($(element).val().toLowerCase().indexOf(key) != -1) { isFound = true;
		 * $(element).attr("selected", true); return false; } else if
		 * ($(element).val().toLowerCase().indexOf(key.substr(0, key.length -
		 * i).toLowerCase()) != -1) { isFound = true;
		 * $(element).attr("selected", true); return false; }
		 * 
		 * }); if (isFound) break; }
		 */
		return new Handlebars.SafeString($('<div>').html(template).html());
	});

	/**
	 * Converts total seconds into hours, minutes and seconds. For e.g. 3600
	 * secs - 1hr 0 mins 0secs
	 */
	Handlebars.registerHelper('convertSecondsToHour', function(totalSec)
	{
		var hours = parseInt(totalSec / 3600) % 24;
		var minutes = parseInt(totalSec / 60) % 60;
		var seconds = totalSec % 60;

		// show only seconds if hours and mins are zero
		if (hours == 0 && minutes == 0)
			return (seconds + "s");

		// show mins and secs if hours are zero.
		if (hours == 0)
			return (minutes + "m ") + (seconds + "s");

		var result = (hours + "h ") + (minutes + "m ") + (seconds + "s");
		return result;
	});

	/**
	 * To check and return value of original referrer
	 */
	Handlebars.registerHelper('checkOriginalRef', function(original_ref)
	{
		if (!getCurrentContactProperty(original_ref))
			return "unknown";

		var url = getCurrentContactProperty(original_ref);

		url = url.split('/');
		url = (url[0] + '//' + url[2]);
		return new Handlebars.SafeString(
				'<a style="text-decoration: none" target="_blank" href="' + getCurrentContactProperty(original_ref) + '">' + url + '</a>');
	});

	/**
	 * To check google url and key words
	 */
	Handlebars.registerHelper('queryWords', function(original_ref)
	{
		// Check if original referrer exists
		if (getCurrentContactProperty(original_ref))
		{
			// Get input url from contact properties and initialize reference
			// url
			var inputUrl = getCurrentContactProperty(original_ref);
			var referenceUrl = 'www.google.';

			// Get host from input url and compare with reference url if equal
			var tempUrl = inputUrl.split('/');
			tempUrl = tempUrl[2].slice(0, 11);
			if (tempUrl === referenceUrl)
			{
				// Get search term from input url
				var parser = document.createElement('a');
				parser.href = inputUrl;
				var search = parser.search;

				// If search term exists, check if 'q' parameter exists, and
				// return its value
				if (search.length > 1)
				{
					search = search.split('&');
					var length = search.length;
					for (var i = 0; i < length; i++)
					{
						if (search[i].indexOf('q=') != -1)
						{
							search = search[i].split('=');
							return new Handlebars.SafeString('( Keyword : ' + search[1].split('+').join(" ") + ' )');
						}
					}
				}
			}
			else
				return;
		}
	});

	/**
	 * Returns contact full name if last-name exists, otherwise only first_name
	 * for contact type PERSON. It returns company name for other contact type.
	 * 
	 */
	Handlebars.registerHelper('contact_name', function(properties, type)
	{

		if (type === 'PERSON')
		{
			for (var i = 0; i < properties.length; i++)
			{

				// if last-name exists, return full name.
				if (properties[i].name === "last_name")
					return (getPropertyValue(properties, "first_name") + " " + properties[i].value);

				else if (properties[i].name === "first_name")
					return properties[i].value;
			}

			return "Contact";
		}

		// COMPANY type
		for (var i = 0; i < properties.length; i++)
		{
			if (properties[i].name === "name")
				return properties[i].value;
		}
		return "Company";
	});

	/**
	 * Returns full name of contact. Use this when empty value is not
	 * acceptable. Takes care that, even when no names are defined, returns
	 * email(necessary for PERSON) or Company <id>. Calls function
	 * getContactName defined in agile-typeahead.js. Also typeahead uses this
	 * fxn to append values as tags.
	 */
	Handlebars.registerHelper('contact_name_necessary', function(contact)
	{
		return getContactName(contact);
	});

	/**
	 * To check if string is blank
	 */
	Handlebars.registerHelper('is_blank', function(value, options)
	{
		value = value.trim();

		if (value == "")
			return options.fn(value);
		else
			return options.inverse(value);
	})

	/**
	 * Iterate through list of values (not json)
	 */
	Handlebars.registerHelper("each_with_index1", function(array, options)
	{
		console.log(array);
		var buffer = "";
		for (var i = 0, j = array.length; i < j; i++)
		{
			var item = {};
			item["value"] = array[i];

			console.log(item);
			// stick an index property onto the item, starting with 1, may make
			// configurable later
			item["index"] = i + 1;

			console.log(item);
			// show the inside of the block
			buffer += options.fn(item);
		}

		// return the finished buffer
		return buffer;

	});

	/**
	 * If log_type equals true otherwise false
	 */
	Handlebars.registerHelper("if_log_type_equals", function(object, key, log_type, options)
	{

		if (object[key] == log_type)
			return options.fn(object);

		return options.inverse(object);

	});

	/**
	 * Identifies EMAIL_SENT campaign-log string and splits the log string based
	 * on '_aGiLeCrM' delimiter into To, From, Subject and Body.
	 * 
	 */
	Handlebars.registerHelper("if_email_sent", function(object, key, options)
	{

		// delimiter for campaign send-email log
		var _AGILE_CRM_DELIMITER = "_aGiLeCrM";

		// if log_type is EMAIL_SENT
		if (object[key] === "EMAIL_SENT")
		{
			// Splits logs message
			var email_fields = object["message"].split(_AGILE_CRM_DELIMITER, 4);

			// Json to apply for handlebar template
			var json = {};

			if (email_fields === undefined)
				return options.inverse(object);

			// Iterates inorder to insert each field into json
			for (var i = 0; i < email_fields.length; i++)
			{
				// Splits based on colon. E.g "To: naresh@agilecrm.com"
				var arrcolon = email_fields[i].split(":");

				// Inserts LHS of colon as key. E.g., To
				var key = arrcolon[0];
				key = key.trim(); // if key starts with space, it can't
				// accessible

				// Inserts RHS of colon as value. E.g., naresh@agilecrm.com
				var value = arrcolon.slice(1).join(":"); // join the
				// remaining string
				// based on colon,
				// only first occurence of colon is needed
				value = value.trim();

				json[key] = value;
			}

			// inserts time into json
			json.time = object["time"];

			// apply customized json to template.
			return options.fn(json);
		}

		// if not EMAIL_SENT log, goto else in the template
		return options.inverse(object);

	});

	Handlebars.registerHelper('remove_spaces', function(value)
	{
		return value.replace(/ +/g, '');

	});

	/***************************************************************************
	 * Returns campaignStatus object from contact campaignStatus array having
	 * same campaign-id. It is used to get start and completed time from array.
	 **************************************************************************/
	Handlebars.registerHelper('if_same_campaign', function(object, data, options)
	{

		var campaignStatusArray = object[data];

		// if campaignStatus key doesn't exist return.
		if (data === undefined || campaignStatusArray === undefined)
			return;

		// Get campaign-id from hash
		var current_campaign_id = getIdFromHash();

		for (var i = 0, len = campaignStatusArray.length; i < len; i++)
		{

			// compares campaign-id of each element of array with
			// current campaign-id
			if (campaignStatusArray[i].campaign_id === current_campaign_id)
			{
				// if equal, execute template current json
				return options.fn(campaignStatusArray[i]);
			}
		}

	});

	/**
	 * Returns other active campaigns in campaign-active subscribers.
	 */
	Handlebars.registerHelper('if_other_active_campaigns', function(object, data, options)
	{

		if (object === undefined || object[data] === undefined)
			return;

		var other_campaigns = {};
		var other_active_campaigns = [];
		var other_completed_campaigns = [];
		var campaignStatusArray = object[data];

		var current_campaign_id = getIdFromHash();

		for (var i = 0, len = campaignStatusArray.length; i < len; i++)
		{
			// neglect same campaign
			if (current_campaign_id === campaignStatusArray[i].campaign_id)
				continue;

			// push all other active campaigns
			if (campaignStatusArray[i].status.indexOf('ACTIVE') !== -1)
				other_active_campaigns.push(campaignStatusArray[i])

				// push all done campaigns
			if (campaignStatusArray[i].status.indexOf('DONE') !== -1)
				other_completed_campaigns.push(campaignStatusArray[i]);
		}

		other_campaigns["active"] = other_active_campaigns;
		other_campaigns["done"] = other_completed_campaigns;

		return options.fn(other_campaigns);

	});

	/**
	 * Returns Contact Model from contactDetailView collection.
	 * 
	 */
	Handlebars.registerHelper('contact_model', function(options)
	{

		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
		{

			// To show Active Campaigns list immediately after campaign
			// assigned.
			if (CONTACT_ASSIGNED_TO_CAMPAIGN)
			{
				CONTACT_ASSIGNED_TO_CAMPAIGN = false;

				// fetches updated contact json
				var contact_json = $.ajax({ type : 'GET', url : '/core/api/contacts/' + App_Contacts.contactDetailView.model.get('id'), async : false,
					dataType : 'json' }).responseText;

				// Updates Contact Detail model
				App_Contacts.contactDetailView.model.set(JSON.parse(contact_json));

				return options.fn(JSON.parse(contact_json));
			}

			// if simply Campaigns tab clicked, use current collection
			return options.fn(App_Contacts.contactDetailView.model.toJSON());
		}
	});

	/**
	 * Returns json object of active and done subscribers from contact object's
	 * campaignStatus.
	 */
	Handlebars.registerHelper('contact_campaigns', function(object, data, options)
	{

		// if campaignStatus is not defined, return
		if (object === undefined || object[data] === undefined)
			return;

		// Temporary json to insert active and completed campaigns
		var campaigns = {};

		var active_campaigns = [];
		var completed_campaigns = [];

		// campaignStatus object of contact
		var campaignStatusArray = object[data];

		for (var i = 0, len = campaignStatusArray.length; i < len; i++)
		{
			// push all active campaigns
			if (campaignStatusArray[i].status.indexOf('ACTIVE') !== -1)
				active_campaigns.push(campaignStatusArray[i])

				// push all done campaigns
			if (campaignStatusArray[i].status.indexOf('DONE') !== -1)
				completed_campaigns.push(campaignStatusArray[i]);
		}

		campaigns["active"] = active_campaigns;
		campaigns["done"] = completed_campaigns;

		// apply obtained campaigns context within
		// contact_campaigns block
		return options.fn(campaigns);
	});

	/**
	 * Verifies given urls length and returns options hash based on restricted
	 * count value.
	 * 
	 */
	Handlebars.registerHelper("if_more_urls", function(url_json, url_json_length, options)
	{
		var RESTRICT_URLS_COUNT = 3;
		var temp_urls_array = [];
		var context_json = {};

		// If length is less than restricted, compile
		// else block with given url_json
		if (url_json_length < RESTRICT_URLS_COUNT)
			return options.inverse(url_json);

		// Insert urls until restricted count reached
		for (var i = 0; i < url_json.length; i++)
		{
			if (i === RESTRICT_URLS_COUNT)
				break;

			temp_urls_array.push(url_json[i]);
		}

		context_json.urls = temp_urls_array;

		// More remained
		context_json.more = url_json_length - RESTRICT_URLS_COUNT;

		return options.fn(context_json);

	});

	/**
	 * Returns first occurence string from string having underscores E.g,
	 * mac_os_x to mac
	 */
	Handlebars.registerHelper('normalize_os', function(data)
	{
		if (data === undefined || data.indexOf('_') === -1)
			return data;

		// if '_' exists splits
		return data.split('_')[0];
	});

	Handlebars.registerHelper('safe_tweet', function(data)
	{
		data = data.trim();
		return new Handlebars.SafeString(data);
	});
	/**
	 * Get stream icon for social suite streams.
	 */
	Handlebars.registerHelper('get_stream_icon', function(name)
	{
		if (!name)
			return;

		var icon_json = { "Home" : "icon-home", "Retweets" : "icon-retweet", "DM_Inbox" : "icon-download-alt", "DM_Outbox" : "icon-upload-alt",
			"Favorites" : "icon-star", "Sent" : "icon-share-alt", "Search" : "icon-search", "Scheduled" : "icon-time", "All_Updates" : "icon-home",
			"My_Updates" : "icon-share-alt" };

		name = name.trim();

		if (icon_json[name])
			return icon_json[name];

		return "icon-globe";

	});

	/**
	 * Get task list name without underscore and caps, for new task UI.
	 */
	Handlebars.registerHelper('get_normal_name', function(name)
	{
		if (!name)
			return;

		var name_json = { "HIGH" : "High", "LOW" : "Low", "NORMAL" : "Normal", "EMAIL" : "Email", "CALL" : "Call", "SEND" : "Send", "TWEET" : "Tweet",
			"FOLLOW_UP" : "Follow Up", "MEETING" : "Meeting", "MILESTONE" : "Milestone", "OTHER" : "Other", "YET_TO_START" : "Yet To Start",
			"IN_PROGRESS" : "In Progress", "COMPLETED" : "Completed", "TODAY" : "Today", "TOMORROW" : "Tomorrow", "OVERDUE" : "Overdue", "LATER" : "Later" };

		name = name.trim();

		if (name_json[name])
			return name_json[name];

		return name;

	});

	/**
	 * put user address location togather separated by comma.
	 */
	Handlebars.registerHelper('user_location', function()
	{

		var City = this.city == "?" ? "" : (this.city + ", ");
		var Region = this.region == "?" ? "" : (this.region + ", ");
		var Country = this.country;
		if (this.city == "?" && this.region == "?")
			Country = this.country == "?" ? this.city_lat_long : (this.city_lat_long + " ( " + this.country + " )");

		return (City + Region + Country).trim();
	});

	/**
	 * Trims trailing spaces
	 */
	Handlebars.registerHelper('trim_space', function(value)
	{

		if (value === undefined)
			return value;

		return value.trim();
	});

	/**
	 * Returns reputation name based on value
	 * 
	 */
	Handlebars
			.registerHelper(
					'get_subaccount_reputation',
					function(value)
					{
						var type = "";
						var reputation = "Unknown";

						if (value > 1 && value < 40)
						{
							type = "important";
							reputation = "Poor";
						}
						else if (value >= 40 && value < 75)
						{
							type = "";
							reputation = "Ok";
						}
						else if (value >= 75 && value < 90)
						{
							type = "success";
							reputation = "Good";
						}
						else if (value >= 90)
						{
							type = "success";
							reputation = "Excellent";
						}

						return "<span style='font-size:13px;' class='label label-" + type + "'>" + reputation + "</span> <!--<span class='badge badge-" + type + "'>" + value + "</span>-->";

					});

	/**
	 * Returns id from hash. It returns id from hash iff id exists at last.
	 * 
	 */
	Handlebars.registerHelper('get_id_from_hash', function()
	{

		return getIdFromHash();

	});

	Handlebars.registerHelper('get_subscribers_type_from_hash', function()
	{

		// Returns "workflows" from "#workflows"
		var hash = window.location.hash.substr(1);

		if (hash.indexOf("all") != -1)
			return "All";

		if (hash.indexOf("active") != -1)
			return "Active";

		if (hash.indexOf("completed") != -1)
			return "Completed";

		if (hash.indexOf("removed") != -1)
			return "Removed";

		if (hash.indexOf("unsubscribed") != -1)
			return "Unsubscribed";

		if (hash.indexOf("hardbounced") != -1)
			return "Hard Bounced";

		if (hash.indexOf("softbounced") != -1)
			return "Soft Bounced";

		if (hash.indexOf("spam-reported") != -1)
			return "Spam Reported";
	});

	Handlebars.registerHelper("check_plan", function(plan, options)
	{
		console.log(plan);

		if (!_billing_restriction)
			return options.fn(this);

		if (_billing_restriction.currentLimits.planName == plan)
			return options.fn(this);

		return options.inverse(this);

	});

	/**
	 * Safari browser doesn't supporting few CSS properties like margin-top,
	 * margin-bottom etc. So this helper is used to add compatible CSS
	 * properties to Safari
	 */
	Handlebars.registerHelper("isSafariBrowser", function(options)
	{

		if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1)
			return options.fn(this);

		return options.inverse(this);
	});

	/**
	 * give custome status base on xerotype
	 */

	Handlebars.registerHelper('xeroType', function(type)
	{
		return (type == "ACCPAY") ? "Payable" : "Receivable";
	});

	/**
	 * give custom type to xero type
	 */
	Handlebars.registerHelper('xeroTypeToolTip', function(type)
	{
		return (type == "ACCPAY") ? "Payable" : "Receivable";
	});

	/**
	 * gives first latter capital for given input
	 */
	Handlebars.registerHelper('capFirstLetter', function(data)
	{
		if (data === "DEFAULT")
		{
			// console.log("return empty");
			return "";
		}
		else
		{
			var temp = data.toLowerCase();
			return temp.charAt(0).toUpperCase() + temp.slice(1);
		}
	});

	Handlebars.registerHelper('qbStatus', function(Balance)
	{
		console.log(this);
		console.log(this.TotalAmt);
		if (Balance == 0)
		{
			return "Paid"
		}
		else
		{
			return "Due"
		}
	});
	Handlebars.registerHelper('currencyFormat', function(data)
	{

		return Number(data).toLocaleString('en');
		// data.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	});

	Handlebars.registerHelper('QbDateFormat', function(data)
	{

		var i = [];
		i = data.split("-");
		return i[0] + "-" + i[2] + "-" + i[1];
	});

	Handlebars.registerHelper("hasScope", function(scope_constant, options)
	{
		if (CURRENT_DOMAIN_USER.scopes && $.inArray(scope_constant, CURRENT_DOMAIN_USER.scopes) != -1)
			return options.fn(this);

		return options.inverse(this);
	});

	/**
	 * To check Access controls for showing icons on dashboard
	 */
	Handlebars.registerHelper('hasMenuScope', function(item, options)
	{
		if ((CURRENT_DOMAIN_USER.menu_scopes).indexOf(item) != -1)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	Handlebars.registerHelper('fetchXeroUser', function(data)
	{
		return JSON.parse(data).xeroemail;
	});

	Handlebars.registerHelper('getfbreturndomain', function(data)
	{
		var arr = window.location.href.split('/')
		return arr[2];
	});

	Handlebars
			.registerHelper(
					'tagManagementCollectionSetup',
					function(tags)
					{

						console.log(tags);
						var json = {};

						var keys = [];
						// Store tags in a json, starting letter as key
						for (var i = 0; i < tags.length; i++)
						{
							var tag = tags[i].tag;
							var key = tag.charAt(0).toUpperCase();
							// console.log(tag);
							if (jQuery.inArray(key, keys) == -1)
								keys.push(key);
						}

						console.log(keys);
						var html_temp = "";

						for (var i = 0; i < keys.length; i++)
							html_temp += "<div class=\"clearfix\"></div><div style='margin-right:10px;'><div class='tag-key tag-management-key'>" + keys[i] + "</div><div class=\"clearfix\"></div><div class='left' tag-alphabet=\"" + encodeURI(keys[i]) + "\"><ul class=\"tags-management tag-cloud\" style=\"list-style:none;\"></ul></div></div>";

						console.log(html_temp);
						return new Handlebars.SafeString(html_temp);
					});

	Handlebars.registerHelper('containsScope', function(item, list, options)
	{
		if (list.length == 0 || !item)
			return options.inverse(this);

		if (jQuery.inArray(item, list) == -1)
			return options.inverse(this);

		return options.fn(this);

	});

	Handlebars.registerHelper('isOwnerOfContact', function(owner_id, options)
	{

		if (CURRENT_DOMAIN_USER.id == owner_id)
			return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('canEditContact', function(owner_id, options)
	{
		return options.fn(this);

		if ((hasScope('UPDATE_CONTACTS') || hasScope('DELETE_CONTACTS')) || CURRENT_DOMAIN_USER.id == owner_id)
			return options.fn(this);

		return options.inverse(this)
	});

	Handlebars.registerHelper('gateway_exists', function(value, target, options)
    	    {
    	 
    	for(var i = 0; i<target.length;i++){
    		
    		var prefs = JSON.parse(target[i].prefs);
    		
    		if(target[i].name=="EmailGateway"){
    			
    			if(prefs.email_api==value)
    				return options.fn(target[i]);
    		}
    		
    		if(target[i].name=="SMS-Gateway"){
    			if(prefs.sms_api==value)
    				return options.fn(target[i]);
    		}
    	}
    	return options.inverse(this);
    	    });

});
