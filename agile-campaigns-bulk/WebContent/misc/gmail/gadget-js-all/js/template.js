var TPL_PATH = "http://localhost:8888/misc/gmail/gadget-js-all/tpl/min/"

// Get HTML
function set_html(selector, template, context, update)
{
	// Get Template first
	var template = getTemplate(template, context);
	if (!template)
		return;

	if (update)
		template = selector.html() + template;

	selector.html(template);

	if (!Is_Localhost)
	{
		console.log("Adjusting height");
		gadgets.window.adjustHeight();
	}
}

function getTemplate(templateName, context, download)
{

	// Check if the template is already found
	var template = Handlebars.templates[templateName];
	if (template)
	{
		// console.log("Template " + templateName + " found");
		return template(context);
	}

	// Check if the download is explicitly set to no
	if (download == 'no')
	{
		console.log("Not found " + templateName);
		return;
	}

	downloadSynchronously(TPL_PATH + templateName + ".js");

	return getTemplate(templateName, context, 'no');
}

function downloadSynchronously(url)
{
	var dataType = 'script';

	console.log(url + " " + dataType);

	jQuery.ajax({ url : url, dataType : dataType, success : function(result)
	{
		console.log("Downloaded url " + url);
	}, async : false });

	return "";
}

/**
 * Build form template.
 * 
 * @method agile_build_form_template
 * @param {Object}
 *            That Current context jQuery object ($(this)).
 * @param {String}
 *            template Template's name to be generated.
 * @param {String}
 *            Template_Location Class name (location) of template to be filled.
 * @param {Function}
 *            callback Function to be called as callback.
 */
function agile_build_form_template(That, Template, Template_Location, callback)
{

	// ------ Take contact data from global object variable. ------
	var Json = Contacts_Json[That.closest(".show-form").data("content")];

	// ------ Compile template and generate UI. ------
	var Handlebars_Template = getTemplate(Template, Json, 'no');
	// ------ Insert template to container in HTML. ------
	That.closest(".gadget-contact-details-tab").find(Template_Location).html($(Handlebars_Template));

	if (callback && typeof (callback) === "function")
	{
		callback();
	}
}

/**
 * Adjust height of gadget window.
 * 
 * @method agile_gadget_adjust_height
 * 
 */
function agile_gadget_adjust_height()
{
	if (!Is_Localhost)
		gadgets.window.adjustHeight();
}

/**
 * Build tags list from contact data object.
 * 
 * @method agile_build_tag_ui
 * @param {Array}
 *            Tag_List Container for list tags.
 * @param {Array}
 *            val array of tags got from server.
 */
function agile_build_tag_ui(Tag_List, Val)
{

	// ------ Remove all tags from list except first, hidden list item. ------
	$(Tag_List).children("li:gt(0)").remove();
	// ------ Iterate up to number of tags in array. ------
	for (Index = 0; Index < Val.tags.length; Index++)
	{
		// ------ Clone hidden list item. ------
		var Clone_Element = $(Tag_List).children().eq(0).clone(true);
		$(Clone_Element).css('display', 'inline-block');
		// ------ Fill tag value. ------
		$('.tag-name', Clone_Element).text(Val.tags[Index]);
		// ------ Append list item to list container. ------
		Clone_Element.appendTo(Tag_List);
	}
}

/**
 * Load and set bootstrap date picker.
 * 
 * @method agile_load_datepicker
 * @param {Object}
 *            calendar jQuery object of date picker container text box.
 * @param {Function}
 *            callback Function to be called as callback.
 */
function agile_load_datepicker(Calendar, callback)
{
	// ------ Load Bootstrap libraries. ------
	head.js(LIB_PATH + 'lib/bootstrap.min.js', LIB_PATH + 'lib/bootstrap-datepicker-min.js', function()
	{

		// ------ Enables date picker. ------
		Calendar.datepicker({ format : 'mm/dd/yyyy' });

		if (callback && typeof (callback) === "function")
		{
			callback();
		}
	});
}
