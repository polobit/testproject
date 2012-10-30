// We store one template compiled - if repetitive templates are called, we save time on compilations
var Handlebars_Compiled_Templates = {};
	

function getTemplate(templateName, context, download)
{

	// Check if it is present in templates
	if(Handlebars_Compiled_Templates[source])
		return Handlebars_Compiled_Templates[source](context);
	else
		Handlebars_Compiled_Templates = {};
	
	// Check if source is available in body
	var source = $('#' + templateName + "-template").html();
	if (source) {
		// console.log(templateName + " " + source);
		var template = Handlebars.compile(source);
		//console.log(context);
		
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

function downloadSynchronously(url)
{

	// Show loading while we download
	// $('#content').html(LOADING_HTML);

	// console.log(url);
	var urlContent;
	jQuery.ajax({
		url : url,
		dataType : 'html',
		success : function(result)
		{
			urlContent = result;
		},
		async : false
	});

	return urlContent;
}

function getPropertyValue(items, name)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++) {
		if (items[i].name == name)
			return items[i].value;
	}
}

function ucfirst(value)
{
	return (value && typeof value === 'string') ? (value.charAt(0)
			.toUpperCase() + value.slice(1).toLowerCase()) : '';

}

$(function()
{

	// Gravatar
	Handlebars.registerHelper('getPropertyValue', function(items, name)
	{

		// console.log(name);
		return getPropertyValue(items, name);
	});

	// Gravatar
	Handlebars.registerHelper('urlEncode', function(url, key, data)
	{

		var startChar = "&";
		if (url.indexOf("?") != -1)
			startChar = "&";

		var encodedUrl = url + startChar + key + "="
				+ escape(JSON.stringify(data));
		// console.log(encodedUrl.length + " " + encodedUrl);
		return encodedUrl;
	});

	// Gravatar
	Handlebars.registerHelper('gravatarurl', function(items, width)
	{

		if (items == undefined)
			return;

		// Check if properties already has an image
		var agent_image = getPropertyValue(items, "image");
		if (agent_image)
			return agent_image;

		// Default images
		// var img =
		// "https://d1uqbqkiqv27mb.cloudfront.net/panel/img/default-avatar.png";
		// var img = "https://contactuswidget.appspot.com/images/pic.png";
		var img = "https://d13pkp0ru5xuwf.cloudfront.net/css/images/pic.png";
		
		var email = getPropertyValue(items, "email");
		if (email) {
			return 'https://secure.gravatar.com/avatar/' + MD5(email)
					+ '.jpg?s=' + width + "&d=" + escape(img);
		}

		return img;
	});

	// Icons
	Handlebars.registerHelper('icons', function(item)
	{
		if (item == "email")
			return "icon-envelope";
		if (item == "phone")
			return "icon-headphones";
		if (item == "url")
			return "icon-home";

	});

	Handlebars.registerHelper('eachkeys', function(context, options)
	{
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

	Handlebars.registerHelper('ucfirst', function(value)
	{
		return (value && typeof value === 'string') ? (value.charAt(0)
				.toUpperCase() + value.slice(1).toLowerCase()) : '';
	});

	// Tip on using Gravar with JS:
	// http://www.deluxeblogtips.com/2010/04/get-gravatar-using-only-javascript.html
	Handlebars.registerHelper('tagslist', function(tags)
	{

		var json = {};

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

		// console.log(json);

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
	Handlebars.registerHelper('epochToHumanDate', function(format, date)
	{
		// date form milliseconds
		var d = new Date(parseInt(date)*1000);
		return d.toLocaleDateString();

		// return $.datepicker.formatDate(format , new Date( parseInt(date) *
		// 1000));
	});

	// Get task date (MM dd) from epoch time
	Handlebars.registerHelper('epochToTaskDate', function(date)
	{
		var	intMonth = new Date(parseInt(date) * 1000).getMonth();
		var	intDay = new Date(parseInt(date) * 1000).getDate();
		
		var monthArray = [ "Jan", "Feb", "March", "April", "May", "June", "July",
				"Aug", "Sept", "Oct", "Nov", "Dec" ];

		return (monthArray[intMonth] + " " + intDay);
	});
	

	// Get task color from it's priority
	Handlebars.registerHelper('task_label_color', function(priority)
	{
		if(priority == 'HIGH')
			return 'important';
	
		if(priority == 'NORMAL')
			return 'info';
		
		if(priority == 'LOW')
			return 'success';
	});

	//Get Date from epoch time
	Handlebars.registerHelper('epochToDate', function(info_json, date_type)
			{
				
				var obj = JSON.parse(info_json);
				
				var	intMonth = new Date(parseInt(obj[date_type]) * 1000).getMonth();
				var	intDay = new Date(parseInt(obj[date_type]) * 1000).getDate();
				var intYear = new Date(parseInt(obj[date_type])* 1000).getFullYear();
				
				var monthArray = [ "Jan", "Feb", "March", "April", "May", "June", "July",
						"Aug", "Sept", "Oct", "Nov", "Dec" ];
                
				return (monthArray[intMonth] + " " + intDay + ", " + intYear);
			});


	// Calculate pipeline (value * probability)
	Handlebars.registerHelper('calculatePipeline', function(value, probability)
	{

		var pipeline = parseInt(value) * parseInt(probability) / 100;
		return pipeline;
	});

	// Get required log from logs
	Handlebars.registerHelper('getRequiredLog', function(log_array_string, name)
	{
		var logArray = JSON.parse(log_array_string);
		if (name == "t") {
			var readableTime = new Date(logArray[0][name] * 1000);
			return readableTime;
		}
		return logArray[0][name];
	});

	// Table headings for custom contacts list view
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
	
	// Timeline details
	Handlebars.registerHelper('if_entity', function(item, options) {
		if(this.entity_type == item)
		{
			return options.fn(this);
		}
		if(this[item] != undefined)
		{
			if(this.date_secs){
				
				// For emails convert milliseconds into seconds
				this.date_secs = this.date_secs / 1000;
			}
			return options.fn(this);
		}
	});
	
	// Display properties in contact details
	Handlebars.registerHelper('if_property', function(fname, lname, company, title, options) {
			if(this.name != fname && this.name != lname && this.name != company && this.name != title)
			return options.fn(this);
	});
	
	// Check the existence of property name and print value
	Handlebars.registerHelper('if_propertyName', function(pname, options){
		for(var i = 0; i < this.properties.length; i++)
		{
			if(this.properties[i].name == pname)
				return options.fn(this.properties[i]);
		}
	});
	
	// Get Count
	Handlebars.registerHelper('count', function(){
		if(this[0] && this[0].count && (this[0].count != -1))
			return "(" + this[0].count + " Total)";
		else
			return "(" + this.length + " Total)";
	});
	
	// Converts string into JSON
	Handlebars.registerHelper('stringToJSON', function(detail, options){
		
		this.billingData = JSON.parse(this["billingData"]);
		return options.fn(this.billingData);
	});
	
	// Convert string to lower case
	Handlebars.registerHelper('toLowerCase', function(value)
			{
				return value.toLowerCase();
			});
	
	// Execute template based on contact type
	Handlebars.registerHelper('if_contact_type', function(ctype, options){
		if(this.type == ctype){
			return options.fn(this);
		}
	});
	
	// Return task completion status
	Handlebars.registerHelper('task_status', function(status){
		console.log(status);
		if(status)
			return true;
		
		// Return false as string as the template can not print boolean false  
		return "false";
		
	});
	
	// Add Custom Fields to Forms
	Handlebars.registerHelper('show_custom_fields', function(custom_fields){
			
		var el = "";
		$.each(custom_fields, function(index, field)
		{
			console.log(field);
			console.log(field.field_type.toLowerCase());
			el = el.concat('<div class="control-group">	<label class="control-label">'+ucfirst(field.field_label)+'<span class="field_req">*</span></label><div class="controls"><input class="custom_field required" id='+field.id+' name='+field.field_label+' type="'+field.field_type.toLowerCase()+'"/></div></div>');

		});

		return new Handlebars.SafeString(el);
		
	});
	
});