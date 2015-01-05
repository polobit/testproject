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
	 * Helper function to return the checkbox html element with value of a
	 * property matched with the given name from the array of properties
	 * 
	 * @method getPropertyValue
	 * @param {Object}
	 *            items array of objects
	 * @param {String}
	 *            name to get matched object value
	 * @returns heckbox html element with value of the matched object
	 */
	Handlebars.registerHelper('getPropertyValueInCheckbox', function(items, name, separator, checked)
	{
		return getPropertyValueInCheckbox(items, name, separator, checked);
	});

	Handlebars.registerHelper('get_correct_count', function(count)
	{
		return count - 1;
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
							var value = exclusive_fields[i].value;

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

		item = item.toLowerCase().trim();
		console.log(item);
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
		if (item == "twitter")
			return "icon-twitter";
		if (item == "facebook")
			return "icon-facebook";

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

	/**
	 * Adds Custom Fields to contact merge form, where this helper function is
	 * called
	 */
	Handlebars.registerHelper('show_custom_fields_for_merge', function(custom_fields, contacts)
	{

		var el = show_custom_fields_helper_for_merge(custom_fields, contacts);
		return new Handlebars.SafeString(el);

	});

	/**
	 * this is useful in activity when note characters exceeds abouve 50 simply
	 * show dots
	 */
	Handlebars.registerHelper('add_dots_end', function(value)
	{

		if (value)
		{
			if (value.length > 50)
			{
				var subst = value.substr(0, 50);
				subst = subst + "....";
				return subst;
			}
		}
		return value;

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

	/**
	 * returns online scheduling url of current user
	 */
	Handlebars.registerHelper('online_schedule_URL', function()
	{
		return ONLINE_SCHEDULING_URL;
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

								if (properties_count != 0)

									el = el
											.concat('<div class="contact-addressview"><div><div class="pull-left" style="width:25px"><i class="icon icon-map-marker"></i></div><div class="pull-left" style="width:90%">');
								else
									el = el
											.concat('<div class="contact-addressview"><div><div class="pull-left" style="width:25px"><i class="icon icon-map-marker"></i></div><div class="pull-left" style="width:90%">');

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
									el = el.concat('<span class="label">' + properties[i].subtype + '</span>');
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

	/*
	 * To represent a number with commas in deals from activities menu
	 */
	Handlebars.registerHelper('numberWithCommasForActivities', function(value)
	{
		value = parseFloat(value);
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

	Handlebars.registerHelper('duplicate_contacts_count', function()
	{
		var count_message;
		if (this[0] && this[0].count && (this[0].count != -1))
		{
			var count = this[0].count - 1;
			count_message = "<small> (" + count + " Total) </small>";
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
	Handlebars.registerHelper('if_not_equals', function(value, target, options)
	{

		if ((typeof target === "undefined") || (typeof value === "undefined"))
			return options.inverse(this);

		if (value.toString().trim() != target.toString().trim())
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
	Handlebars.registerHelper('is_emailPlan', function(planId, options)
	{

		if (planId.search("email") != -1)
			return options.fn(this);

		return options.inverse(this);

	});
	Handlebars.registerHelper('is_userPlan', function(planId, options)
	{
		if (planId.search("email") != -1)
			return options.inverse(this);
		return options.fn(this);

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
	Handlebars.registerHelper('get_total_amount', function(operand1, operand2)
	{

		return (operand1 / 100) * operand2;
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
		return get_social_icon(name);

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

	Handlebars.registerHelper('replace_spaces', function(value)
	{
		return value.replace(/ +/g, '_');

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

						return "<span style='font-size:13px;position: relative;top: -3px' class='label label-" + type + "'>" + reputation + "</span> <!--<span class='badge badge-" + type + "'>" + value + "</span>-->";

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

	Handlebars.registerHelper("canSyncContacts", function(options)
	{
		if (canImportContacts())
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

	Handlebars.registerHelper('isContactType', function(contact_type, contact_type_2, options)
	{
		if (!contact_type && contact_type_2 == 'PERSON')
		{
			return options.fn(this);
		}
		else if (contact_type == contact_type_2)
			return options.fn(this);

		return options.inverse(this);
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
		if (canEditContact(owner_id))
			return options.fn(this);

		return options.inverse(this)
	});

	Handlebars.registerHelper('canEditCurrentContact', function(owner_id, options)
	{
		if (canEditCurrentContact())
			return options.fn(this);

		return options.inverse(this)
	})

	Handlebars.registerHelper('gateway_exists', function(value, target, options)
	{

		for (var i = 0; i < target.length; i++)
		{

			var prefs = JSON.parse(target[i].prefs);

			if (target[i].name == "EmailGateway")
			{

				if (prefs.email_api == value)
					return options.fn(target[i]);
			}

			if (target[i].name == "SMS-Gateway")
			{
				if (prefs.sms_api == value)
					return options.fn(target[i]);
			}
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper("each_index_slice", function(array, index, options)
	{
		var buffer = "";
		for (var i = index; i < array.length; i++)
		{
			var item = array[i];

			// stick an index property onto the item, starting with 1, may make
			// configurable later
			// item.index = i + 1;

			console.log(item);
			// show the inside of the block
			buffer += options.fn(item);
		}

		// return the finished buffer
		return buffer;

	});

	Handlebars.registerHelper('gateway_exists', function(value, target, options)
	{

		for (var i = 0; i < target.length; i++)
		{

			var prefs = JSON.parse(target[i].prefs);

			if (target[i].name == "EmailGateway")
			{

				if (prefs.email_api == value)
					return options.fn(target[i]);
			}

			if (target[i].name == "SMS-Gateway")
			{
				if (prefs.sms_api == value)
					return options.fn(target[i]);
			}
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper('isOwnerOfContact', function(owner_id, options)
	{

		if (CURRENT_DOMAIN_USER.id == owner_id)
			return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('canEditContact', function(owner_id, options)
	{
		if ((hasScope('UPDATE_CONTACTS') || hasScope('DELETE_CONTACTS')) || CURRENT_DOMAIN_USER.id == owner_id)
			return options.fn(this);

		return options.inverse(this)
	});

	Handlebars.registerHelper('getAccountPlanName', function(plan_name)
	{
		if (!plan_name)
			return "Free";

		var plan_fragments = plan_name.split("_");

		return ucfirst(plan_fragments[0]);

	});

	Handlebars.registerHelper('getAccountPlanInteval', function(plan_name)
	{
		if (!plan_name)
			return "Monthly";

		var plan_fragments = plan_name.split("_");

		return ucfirst(plan_fragments[1]);

	});

	Handlebars.registerHelper('getSubscriptionBasedOnPlan', function(customer, plan, options)
	{
		var subscription = getSubscriptionWithAmount(customer, plan);

		if (subscription != null)
			return options.fn(subscription);

		return options.inverse(this);
	});

	// handling with iso date
	Handlebars.registerHelper("iso_date_to_normalizeDate", function(dateString)
	{

		/*
		 * var myDate = new Date(dateString); var timestamp = myDate.getTime();
		 * var d = new Date(parseInt(timestamp) / 1000).format("dd-MM-yyyy");
		 * return d;
		 */
		if (dateString.length <= 0)
			return;
		var arr = dateString.split("T");
		console.log("normalize date " + arr[0]);
		// var d = new Date(arr[0]).format("dd-MM-yyyy");
		return arr[0];

	});

	/**
	 * Index starts from 1
	 */
	Handlebars.registerHelper("getMonthFromIndex", function(month_index)
	{
		var monthArray = [
				"January", "february", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		];
		if (month_index > 12)
			return monthArray[11];

		return monthArray[month_index - 1];
	});

	Handlebars.registerHelper('xeroOrganisationShortCode', function(block)
	{
		if (typeof SHORT_CODE == "undefined" || SHORT_CODE == "")
		{
			return false;
		}
		else
		{
			return SHORT_CODE;
		}
	});

	Handlebars.registerHelper('buildOptions', function(field_data)
	{
		var list_values = field_data.split(";");
		var list_options = '';
		// Create options based on list values
		$.each(list_values, function(index, value)
		{
			if (value != "")
				list_options = list_options.concat('<option value="' + value + '">' + value + '</option>');
		});

		return list_options;
	});

	/**
	 * Choose Avatar templates
	 */
	Handlebars.registerHelper('get_avatars_template', function(options)
	{
		var template = getTemplate("choose-avatar-images-modal", {});
		return template;
	});

	// checks if email type is agile or not
	Handlebars.registerHelper('if_email_type_is_agile', function(value, options)
	{
		var type = email_server_type;
		if (type)
			if (value === type)
				return options.fn(this);
			else
				return options.inverse(this);
		else
		{
			return options.fn(this);
		}
	});

	// Reads the gloabal varaible and returns it value
	Handlebars.registerHelper('read_global_var', function()
	{
		var type = email_server_type;
		if (type)
			return type;
		else
		{
			return "agilecrm";
		}
	});

	// To pick randomly selected avatar url
	Handlebars.registerHelper('pick_random_avatar_url', function(options)
	{
		return choose_random_avatar();
	});

	Handlebars.registerHelper('getRemaininaEmails', function()
	{
		return getPendingEmails();
	});

	// helper function to return agile bcc special email for inbound mail event
	// trigger
	Handlebars.registerHelper('inboundMail', function()
	{
		var agile_api = $.ajax({ type : 'GET', url : '/core/api/api-key', async : false, dataType : 'json' }).responseText;
		agile_api = JSON.parse(agile_api);
		var inbound_email = window.location.hostname.split('.')[0] + "-" + agile_api.api_key + "@agle.cc";
		return new Handlebars.SafeString(inbound_email);
	});

	/**
	 * ==============================================================
	 * -------------------------- jitendra's start script ---------- Please do
	 * not add any function in this block extract time from epochTime
	 */
	Handlebars.registerHelper("getTime", function(date)
	{

		if (!date)
			return;

		if ((date / 100000000000) > 1)
		{
			var d = new Date(parseInt(date));
			var hours = d.getHours();
			if (hours > 12)
				hours = hours - 12;
			var min = d.getMinutes();
			if (min == 0)
				min = "00"
			var ampm = hours >= 12 ? "PM" : "AM";
			return hours + ":" + min + " " + ampm;
		}
		// date form milliseconds

		var d = new Date(parseInt(date) * 1000);
		var hours = d.getHours();
		if (hours > 12)
			hours = hours - 12;
		var min = d.getMinutes();
		if (min == 0)
			min = "00"
		var ampm = hours >= 12 ? "PM" : "AM";
		return hours + ":" + min + " " + ampm;

	});

	/**
	 * get custom date with time
	 */

	Handlebars.registerHelper("getCustomDateWithTime", function(start, end)
	{
		var day1 = getDay(start);
		var day2 = getDay(end);

		var d1 = getCustomFormatedDate(start);
		var d2 = getCustomFormatedDate(end);
		var time = extractTimeFromDate(end);

		if (day1 != day2)
			return d1 + " - " + d2;
		else
			return d1 + " - " + time;

	});

	function getCustomFormatedDate(date)
	{

		var months = [
				'Jan', 'Feb', 'March', 'April', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
		];

		if (!date)
			return;

		if ((date / 100000000000) > 1)
		{
			var d = new Date(parseInt(date));
			var hours = d.getHours();
			var year = d.getFullYear();
			var date = d.getDate();
			var month = d.getMonth();
			var min = d.getMinutes();
			if (min == 0)
				min = "00"
			var ampm = hours >= 12 ? "PM" : "AM";
			if (hours > 12)
				hours = hours - 12;
			return months[month] + " " + date + ", " + year + " " + hours + ":" + min + " " + ampm;

		}
		// date form milliseconds

		var d = new Date(parseInt(date) * 1000);
		var hours = d.getHours();
		var year = d.getFullYear();
		var date = d.getDate();
		var month = d.getMonth();
		var min = d.getMinutes();
		if (min == 0)
			min = "00"
		var ampm = hours >= 12 ? "PM" : "AM";
		if (hours > 12)
			hours = hours - 12;
		return months[month] + " " + date + ", " + year + " " + hours + ":" + min + " " + ampm;

	}
	function extractTimeFromDate(date)
	{
		if (!date)
			return;

		if ((date / 100000000000) > 1)
		{
			var d = new Date(parseInt(date));
			var hours = d.getHours();

			var min = d.getMinutes();
			if (min == 0)
				min = "00"
			var ampm = hours >= 12 ? "PM" : "AM";
			if (hours > 12)
				hours = hours - 12;
			return hours + ":" + min + " " + ampm;
		}
		// date form milliseconds

		var d = new Date(parseInt(date) * 1000);
		var hours = d.getHours();
		var min = d.getMinutes();
		if (min == 0)
			min = "00"
		var ampm = hours >= 12 ? "PM" : "AM";
		if (hours > 12)
			hours = hours - 12;
		return hours + ":" + min + " " + ampm;
	}

	function getDay(date)
	{
		if ((date / 100000000000) > 1)
		{
			var sDate = new Date(parseInt(date));
			return sDate.getDate();
		}
		else
		{
			var sDate = new Date(parseInt(date) * 1000);
			return sDate.getDate();
		}
	}
	/**
	 * return contact property value base on type if contact type is COMPANY
	 * then return company name other wise retun contact first_name + last_name
	 * as name
	 */

	Handlebars.registerHelper('getContactDisplayValue', function(contact)
	{
		var displayName;

		var type = contact.type;
		var properties = contact.properties;
		if (properties)
		{
			if (type == "COMPANY")
			{

				for (var i = 0; i < properties.length; i++)
				{
					if (properties[i].name == 'name')
					{
						displayName = properties[i].value;
						break;
					}
				}
			}
			else
			{
				var firstName;
				var lastName;
				for (var i = 0; i < properties.length; i++)
				{
					if (properties[i].name == 'first_name')
					{
						firstName = properties[i].value;

					}

					if (properties[i].name == 'last_name')
					{
						lastName = properties[i].value;

					}

				}
				if (!firstName)
				{
					firstName = '';
				}
				if (!lastName)
				{
					lastName == '';
				}
				displayName = firstName + " " + lastName;
			}
		}
		return displayName;
	});

	// return google event custom date and time

	Handlebars.registerHelper('getGoogleEventCustomTime', function(start, end)
	{
		var startDate = new Date(start);
		var endDate = new Date(end);

		return getGoogleCustomFormatteDate(startDate.getTime(), endDate.getTime());

	});

	function getGoogleCustomFormatteDate(start, end)
	{

		var day1 = getDay(start);
		var day2 = getDay(end);

		var d1 = getCustomFormatedDate(start);
		var d2 = getCustomFormatedDate(end);
		var time = extractTimeFromDate(end);
		var createdTime = getEventCreatedTime(start);
		if (createdTime == 0 || createdTime == 1)
		{
			var t1 = extractTimeFromDate(start);
			var t2 = extractTimeFromDate(end);
			if (t1 && t2)
				return t1 + " - " + t2;
			if (t2)
				return t1 + " - " + t2;
			else
				return t1;
		}
		else
		{

			if (day1 != day2)
			{
				if (d2)
					return d1 + " - " + d2;
				else
					return d1;
			}
			else
				return d1 + " - " + time;
		}
	}

	Handlebars.registerHelper("displayCustomDateTime", function(start, end)
	{
		var eventCreateTime = get_activity_created_time(start);

		var day1 = getDay(start);
		var day2 = getDay(end);

		var d1 = getCustomFormatedDate(start);
		var d2 = getCustomFormatedDate(end);
		var time = extractTimeFromDate(end);
		if (eventCreateTime == 0 || eventCreatedTime == 1)
		{
			return time;
		}
		else
		{
			if (day1 != day2)
				return d1 + " - " + d2;
			else
				return d1 + " - " + time;
		}
	});

	// function used know weather event rescheduled or modified and task due
	// date is modified
	Handlebars.registerHelper('get_event_rescheduled', function(value, options)
	{
		console.log(value);
		var modieied_fields = value.replace(/[^a-zA-Z ^,]/g, " ").split(",");
		var fields = [];
		if (modieied_fields)
		{
			for (var i = 0; i < modieied_fields.length; i++)
			{
				fields.push(modieied_fields[i].trim());
			}
		}
		if (fields.indexOf("start date") != -1)
		{
			return options.fn(value);
		}
		if (fields.indexOf("due date") != -1)
		{
			return options.fn(value);
		}

		return options.inverse(value);

	});

	// helper function return created time for event
	function getEventCreatedTime(due)
	{
		// Get Todays Date
		var eventStartDate = new Date(due);
		due = eventStartDate.getTime() / 1000;
		var date = new Date();
		date.setHours(0, 0, 0, 0);

		date = date.getTime() / 1000;
		// console.log("Today " + date + " Due " + due);
		return Math.floor((due - date) / (24 * 3600));
	}

	/**
	 * ------ End of jitendra script------ ======== Thank you =================
	 */

	// To pick randomly selected avatar url
	Handlebars.registerHelper('arrayToCamelcase', function(values)
	{
		var result = '';
		for (var i = 0; i < values.length; i++)
		{
			result += ucfirst(values[i]);
			if (i + 1 < values.length)
				result += ', ';
		}
		return result;
	});

	// To pick randomly selected avatar url
	Handlebars.registerHelper('namesFromObject', function(jsonArray, fieldName)
	{
		var result = '';
		console.log(jsonArray.length);
		for (var i = 0; i < jsonArray.length; i++)
		{
			result += jsonArray[i][fieldName];
			if (i + 1 < jsonArray.length)
				result += ', ';
		}
		return result;
	});

	// @author Purushotham
	Handlebars.registerHelper('secondsToFriendlyTime', function(time)
	{
		var hours = Math.floor(time / 3600);
		if (hours > 0)
			time = time - hours * 60 * 60;
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;
		var friendlyTime = "";
		if (hours == 1)
			friendlyTime = hours + "h ";
		if (hours > 1)
			friendlyTime = hours + "h ";
		if (minutes > 0)
			friendlyTime += minutes + "m ";
		if (seconds > 0)
			friendlyTime += seconds + "s ";
		if (friendlyTime != "")
			return ' - ' + friendlyTime;
		return friendlyTime;
	});
	// To pick randomly selected avatar url
	Handlebars.registerHelper('pick_random_avatar_url', function(options)
	{
		return choose_random_avatar();
	});

	// To choose font awesome icon for custom fields
	Handlebars.registerHelper('choose_custom_field_font_icon', function(field_type)
	{
		var icon_class = '';
		if (field_type == "TEXT")
			icon_class = "icon-text-height";
		else if (field_type == "TEXTAREA")
			icon_class = "icon-file-alt";
		else if (field_type == "DATE")
			icon_class = "icon-calendar";
		else if (field_type == "CHECKBOX")
			icon_class = "icon-check";
		else if (field_type == "LIST")
			icon_class = "icon-list-ul";
		else if (field_type == "NUMBER")
			icon_class = "icon-text-height";
		return icon_class;
	});

	// To choose font awesome icon for custom fields
	Handlebars.registerHelper('choose_custom_field_type', function(field_type)
	{
		var field_type_name = '';
		if (field_type == "TEXT")
			field_type_name = "Text Field";
		else if (field_type == "TEXTAREA")
			field_type_name = "Text Area";
		else if (field_type == "DATE")
			field_type_name = "Date";
		else if (field_type == "CHECKBOX")
			field_type_name = "Checkbox";
		else if (field_type == "LIST")
			field_type_name = "List";
		else if (field_type == "NUMBER")
			field_type_name = "Number";
		else if (field_type == "FORMULA")
			field_type_name = "Formula";
		return field_type_name;
	});

	// @author Purushotham
	// function to compare integer values
	Handlebars.registerHelper('ifCond', function(v1, type, v2, options)
	{
		switch (type) {
		case "greaterthan":
			if (parseInt(v1) > parseInt(v2))
				return options.fn(this);
			break;
		case "lessthan":
			if (parseInt(v1) < parseInt(v2))
				return options.fn(this);
			break;
		case "equals":
			if (parseInt(v1) === parseInt(v2))
				return options.fn(this);
			break;
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper('callActivityFriendlyStatus', function(status, direction)
	{

		switch (status) {
		case "completed":
		case "answered":
			return "Call duration";
			break;
		case "busy":
		case "no-answer":
			if (direction == 'outgoing')
				return "Contact busy";
			else
				return "Not answered";
			break;
		case "failed":
			return "Failed";
			break;
		case "in-progress":
		case "voicemail":
			return "Left voicemail";
			break;
		default:
			return "";
		}

	});

	Handlebars.registerHelper('shopifyWebhook', function()
	{
		var agile_api = $.ajax({ type : 'GET', url : '/core/api/api-key', async : false, dataType : 'json' }).responseText;
		agile_api = JSON.parse(agile_api);
		var shopify_webhook = window.location.origin + "/shopifytrigger?api-key=" + agile_api.api_key;
		return new Handlebars.SafeString(shopify_webhook);
	});
	/**
	 * getting convenient name of portlet
	 */
	Handlebars.registerHelper('get_portlet_name', function(p_name)
	{
		var portlet_name = '';
		if (p_name == 'Filter Based')
			portlet_name = 'Contact List';
		else if (p_name == 'Emails Opened')
			portlet_name = 'Email Opens';
		else if (p_name == 'Emails Sent')
			portlet_name = 'Emails';
		else if (p_name == 'Growth Graph')
			portlet_name = 'Tag Graph';
		else if (p_name == 'Calls Per Person')
			portlet_name = 'Calls';
		else if (p_name == 'Pending Deals')
			portlet_name = 'Pending Deals';
		else if (p_name == 'Deals By Milestone')
			portlet_name = 'Deals by Milestone';
		else if (p_name == 'Closures Per Person')
			portlet_name = 'Closures per Person';
		else if (p_name == 'Deals Won')
			portlet_name = 'Deals Won';
		else if (p_name == 'Deals Funnel')
			portlet_name = 'Deals Funnel';
		else if (p_name == 'Deals Assigned')
			portlet_name = 'Deals Assigned';
		else if (p_name == 'Agenda')
			portlet_name = "Today's Events";
		else if (p_name == 'Today Tasks')
			portlet_name = "Today's Tasks";
		else if (p_name == 'Agile CRM Blog')
			portlet_name = "Agile CRM Blog";
		return portlet_name;
	});
	/**
	 * getting portlet icons
	 */
	Handlebars.registerHelper('get_portlet_icon', function(p_name)
	{
		var icon_name = '';
		if (p_name == 'Filter Based')
			icon_name = 'icon-user';
		else if (p_name == 'Emails Opened')
			icon_name = 'icon-envelope';
		else if (p_name == 'Emails Sent')
			icon_name = 'icon-envelope';
		else if (p_name == 'Growth Graph')
			icon_name = 'icon-bar-chart';
		else if (p_name == 'Calls Per Person')
			icon_name = 'icon-phone';
		else if (p_name == 'Pending Deals')
			icon_name = 'icon-time';
		else if (p_name == 'Deals By Milestone')
			icon_name = 'icon-flag-checkered';
		else if (p_name == 'Closures Per Person')
			icon_name = 'icon-thumbs-up';
		else if (p_name == 'Deals Won')
			icon_name = 'icon-briefcase';
		else if (p_name == 'Deals Funnel')
			icon_name = 'icon-filter';
		else if (p_name == 'Deals Assigned')
			icon_name = 'icon-user';
		else if (p_name == 'Agenda')
			icon_name = "icon-calendar";
		else if (p_name == 'Today Tasks')
			icon_name = "icon-tasks";
		else if (p_name == 'Agile CRM Blog')
			icon_name = "icon-rss-sign";
		return icon_name;
	});
	/**
	 * getting flitered contact portlet header name
	 */
	Handlebars.registerHelper('get_flitered_contact_portlet_header', function(filter_name)
	{
		var header_name = '';
		if (filter_name == 'contacts')
			header_name = "All Contacts";
		else if (filter_name == 'companies')
			header_name = "All Companies";
		else if (filter_name == 'recent')
			header_name = "Recent Contacts";
		else if (filter_name == 'myContacts')
			header_name = "My Contacts";
		else if (filter_name == 'leads')
			header_name = "Leads";
		else
		{
			var contactFilter = $.ajax({ type : 'GET', url : '/core/api/filters/' + filter_name, async : false, dataType : 'json', success : function(data)
			{
				header_name = "" + data.name;
			} });
		}
		return header_name;
	});

	Handlebars.registerHelper('if_equals_or', function()
	{
		var options = arguments[arguments.length - 1];
		try
		{
			for (var i = 0; i < arguments.length - 1; i = i + 2)
			{
				value = arguments[i];
				target = arguments[i + 1];
				if ((typeof target === "undefined") || (typeof value === "undefined"))
					return options.inverse(this);
				if (value.toString().trim() == target.toString().trim())
					return options.fn(this);
			}
			return options.inverse(this);
		}
		catch (err)
		{
			console.log("error while if_equals_or of handlebars helper : " + err.message);
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('buildFacebookProfileURL', function(url)
	{
		return buildFacebookProfileURL(url);
	});

	/**
	 * getting flitered contact portlet header name
	 */
	Handlebars.registerHelper('get_deals_funnel_portlet_header', function(track_id)
	{
		var header_name = '';
		if (track_id == 0)
			header_name = "Default";
		else
		{
			var milestone = $.ajax({ type : 'GET', url : '/core/api/milestone/' + track_id, async : false, dataType : 'json', success : function(data)
			{
				header_name = data.name;
			} });
		}
		return header_name;
	});

	
	/**
	 * gets the duedate and starttime modification value for activities
	 */
	Handlebars.registerHelper('getDueDateOfTask', function(fields, values)
	{
		var field = fields.replace(/[^a-zA-Z ^,]/g, " ").split(",");
		var value = values.replace(/[^a-zA-Z0-9 ^,]/g, " ").split(",");
		var json = {};
		for (var i = 0; i < field.length; i++)
		{

			json[field[i].trim()] = value[i].trim();
		}

		if (field.indexOf("due date") != -1)
		{
			console.log(json);
			console.log(json['due date']);
			return convertToHumanDate(json['due date'].trim());
		}
		if (field.indexOf("start date") != -1)
		{
			console.log(json);
			console.log(json['start date']);
			return convertToHumanDate(json['start date'].trim());
		}

	});

	/**
	 * getting time in AM and PM format for event portlet
	 */
	Handlebars.registerHelper('get_AM_PM_format', function(date_val)
	{
		var date = new Date(date_val * 1000);
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	});

	/**
	 * getting duration between two dates for event portlet
	 */
	Handlebars.registerHelper('get_duration', function(startDate, endDate)
	{
		var duration = '';
		var days = 0;
		var hrs = 0;
		var mins = 0;
		var diffInSeconds = endDate - startDate;
		days = Math.floor(diffInSeconds / (24 * 60 * 60));
		hrs = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
		mins = Math.floor(((diffInSeconds % (24 * 60 * 60)) % (60 * 60)) / 60);
		if (days != 0 && days == 1)
			duration += '' + days + ' Day ';
		else if (days != 0 && days > 1)
			duration += '' + days + ' Days ';
		if (hrs != 0 && hrs == 1)
			duration += '' + hrs + ' Hour ';
		else if (hrs != 0 && hrs > 1)
			duration += '' + hrs + ' Hours ';
		if (mins != 0 && mins == 1)
			duration += '' + mins + ' Minute';
		else if (mins != 0 && mins > 1)
			duration += '' + mins + ' Minutes';
		return duration;
	});

});

// helper function return created time for event
function getEventCreatedTime(due)
{
	// Get Todays Date
	var eventStartDate = new Date(due);
	due = eventStartDate.getTime() / 1000;
	var date = new Date();
	date.setHours(0, 0, 0, 0);

	date = date.getTime() / 1000;
	// console.log("Today " + date + " Due " + due);
	return Math.floor((due - date) / (24 * 3600));
}
