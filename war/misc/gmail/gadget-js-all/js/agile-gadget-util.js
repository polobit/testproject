/**
 * Utility functions common for few tasks.
 * 
 * @author Dheeraj
 * */

/**
 * Build tags list from contact data object.
 * 
 * @method agile_build_tag_ui
 * @param {Array}
 *            Tag_List Container for list tags.
 * @param {Array}
 *            val array of tags got from server.
 */
function agile_build_tag_ui(Tag_List, val) {

	//  ------ Remove all tags from list except first, hidden list item. ------ 
	$(Tag_List).children("li:gt(0)").remove();
	//  ------ Iterate up to number of tags in array. ------ 
	for (index = 0; index < val.tags.length; index++) {
		//  ------ Clone hidden list item. ------ 
		var Clone_Element = $(Tag_List).children().eq(0).clone(true);
		$(Clone_Element).css('display', 'inline-block');
		//  ------ Fill tag value. ------ 
		$('.tag-name', Clone_Element).text(val.tags[index]);
		//  ------ Append list item to list container. ------ 
		Clone_Element.appendTo(Tag_List);
	}
}

/**
 * Build form template.
 * 
 * @method agile_build_form_template
 * @param {Object}
 *            that Current context jQuery object ($(this)).
 * @param {String}
 *            template Template's name to be generated.
 * @param {String}
 *            Template_Location Class name (location) of template to be filled.
 * @param {Function}
 *            callback Function to be called as callback.
 */
function agile_build_form_template(that, template, Template_Location, callback) {

	//  ------ Send request for template. ------ 
	agile_get_gadget_template(template + "-template", function(data) {

		//  ------ Take contact data from global object variable. ------ 
		var json = Contacts_Json[that.closest(".show-form").data("content")];
		//  ------ Compile template and generate UI. ------ 
		var Handlebars_Template = getTemplate(template, json, 'no');
		//  ------ Insert template to container in HTML. ------ 
		that.closest(".gadget-contact-details-tab").find(Template_Location)
				.html($(Handlebars_Template));

		if (callback && typeof (callback) === "function") {
			callback();
		}
	});
}

/**
 * Request template, If template is not present locally.
 * 
 * @method agile_getGadgetTemplate
 * @param {String}
 *            Template_Name Template's id to be generated.
 * @param {Function}
 *            callback Function to be called as callback.
 */
function agile_get_gadget_template(Template_Name, callback) {

	//  ------ Search body for the template. ------ 
	var content = $("#" + Template_Name).text();
	if (content) {
		return callback(content);
	}

	//  ------ URL from where to get template. ------ 
	var Agile_Url = agile_id.getURL()
			+ "/gmail-template?callback=?&id=" + agile_id.get() + "&template=gadget-template";

	//  ------ Send cross domain request. ------ 
	agile_json(Agile_Url, function(data) {

		//  ------ Template from server response. ------ 
		var template = data.content;

		//  ------ Add template to body. ------ 
		$("body").append(template);

		if (callback && typeof (callback) === "function") {
			agile_get_gadget_template(Template_Name, callback);
		}
	});
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
function agile_load_datepicker(calendar, callback) {
	//  ------ Load Bootstrap libraries. ------ 
	head.js(Lib_Path + 'lib/bootstrap.min.js', Lib_Path
			+ 'lib/bootstrap-datepicker-min.js', function() {
		
		//  ------ Enables date picker. ------ 
		calendar.datepicker({
			format : 'mm/dd/yyyy'
		});

		if (callback && typeof (callback) === "function") {
			callback();
		}
	});
}

/**
 * Validate forms.
 * 
 * @method agile_is_valid_form
 * @param {Object}
 *            form jQuery object of form.
 * @returns {Boolean} Specify that whether form is valid or not.
 */
function agile_is_valid_form(form) {
	$(form).validate();
	return $(form).valid();
}

/**
 * Serialize form data.
 * 
 * @method agile_serialize_form
 * @param {Object}
 *            form jQuery object of form.
 * @returns {Object} json Serialized form data.
 */
function agile_serialize_form(form) {
	if (!agile_is_valid_form(form)) {
		return;
	}
	var json = form.serializeArray();
	return json;
}

/**
 * Utility Event handlers.
 * 
 * @method agile_init_util
 * 
 */
function agile_init_util(){
	
	//  ------ Click event for search contact. ------ 
	$("#search_drop_down").die().live('change', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		
		var email = $("#search_drop_down :selected").data("content");
		//  ------ Set chosen mail as data-email attribute of <ul>. ------   
		$(".agile-mail-dropdown").data("email", email);
	});
}