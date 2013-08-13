/**
 * Utility functions common for few tasks.
 * 
 * @author Dheeraj
 * */

/**
 * Function for building tags list from contact object data.
 * 
 * @method build_tag_ui
 * @param {Array}
 *            tagList container for list tags.
 * @param {Array}
 *            val array of tags got from server.
 */
function build_tag_ui(tagList, val) {

	// Removing all tags from list except first hidden element.
	$(tagList).children("li:gt(0)").remove();
	// Iterating up to number of tags in array.
	for (index = 0; index < val.tags.length; index++) {
		// Cloning hidden list item
		var CloneElement = $(tagList).children().eq(0).clone(true);
		$(CloneElement).css('display', 'inline-block');
		// Filling tag value.
		$('.tagName', CloneElement).text(val.tags[index]);
		// Appending list item to list container.
		CloneElement.appendTo(tagList);
	}
}

/**
 * Build form template.
 * 
 * @method build_form_template
 * @param {Object}
 *            that current context jQuery object ($(this)).
 * @param {String}
 *            template template's name to be generated.
 * @param {String}
 *            templateLoc class name (location) of template to be filled.
 * @param {Function}
 *            callback function to be called as callback.
 */
function build_form_template(that, template, templateLoc, callback) {

	// Send request for template.
	agile_getGadgetTemplate(template + "-template", function(data) {

		// Taking contact data from local object variable.
		var json = Contacts_Json[that.closest(".show_form").data("content")];
		// Compiling template and generating UI.
		var handlebarsTemplate = getTemplate(template, json, 'no');
		// Inserting template to container in HTML.
		that.closest(".gadget_contact_details_tab").find(templateLoc).html(
				$(handlebarsTemplate));

		if (callback && typeof (callback) === "function") {
			callback();
		}
	});
}

/**
 * Requesting for template, If template is not present in local.
 * 
 * @method agile_getGadgetTemplate
 * @param {String}
 *            template_name template's name to be generated.
 * @param {Function}
 *            callback function to be called as callback.
 */
function agile_getGadgetTemplate(template_name, callback) {

	// Search body for the template.
	var content = $("#" + template_name).text();
	if (content) {
		return callback(content);
	}

	// URL from where to get template.
	var agile_url = "http://localhost:8888/gmail-template?callback=?&template=gadget-template";

	// Send cross domain request.
	agile_json(agile_url, function(data) {

		// Template from server response.
		var template = data.content;

		// Add template to body.
		$("body").append(template);

		if (callback && typeof (callback) === "function") {
			agile_getGadgetTemplate(template_name, callback);
		}
	});
}

/**
 * Loading and setting bootstrap date picker.
 * 
 * @method load_datepicker
 * @param {Object}
 *            calendar jQuery object of date picker container text box.
 * @param {Function}
 *            callback function to be called as callback.
 */
function load_datepicker(calendar, callback) {
	// Load Bootstrap libraries.
	head.js(LIB_PATH + 'lib/bootstrap.min.js', LIB_PATH
			+ 'lib/bootstrap-datepicker-min.js');

	head.ready(function() {
		// Enables date picker.
		calendar.datepicker({
			format : 'mm/dd/yyyy'
		});

		if (callback && typeof (callback) === "function") {
			callback();
		}
	});
}

/**
 * Validating forms.
 * 
 * @method isValidForm
 * @param {Object}
 *            form jQuery object of form.
 * @returns {Boolean} specify that whether form is valid or not.
 */
function isValidForm(form) {
	$(form).validate();
	return $(form).valid();
}

/**
 * Serialize form data.
 * 
 * @param {Object}
 *            form jQuery object of form.
 * @returns {Object} json serialized form data.
 */
function serializeForm(form) {
	if (!isValidForm(form)) {
		return;
	}
	var json = form.serializeArray();
	return json;
}
