/**
 * custom-field.js is a script file to deal with the UI of the custom fields,
 * and also contains a function which adds custom_fields attribute to the
 * desired entity with all the custom fields as values.
 * 
 * @module Custom fields
 * 
 * author: Yaswanth
 */
$(function() {
	/**
	 * Loads the respective modal (Text or Date or List or Check-box modal) based
	 * on the id attribute of the clicked link to save the custom fields.
	 */
	$(".fieldmodal").die().live('click', function(event) {
		event.preventDefault();
		var modal_id = $(this).attr('id');
		// Creating model for bootstrap-modal
		var modelView = new Base_Model_View({
			url : '/core/api/custom-fields',
			template : 'custom-field-' + modal_id + '-modal',
			window : 'custom-fields',
			reload : true,
			modal : '#' + modal_id + 'Modal',
			isNew : true,
			postRenderCallback : function(el) {
				$('.modal-backdrop').remove();

				$('#' + modal_id + 'Modal', el).modal('show');
			}
		});

		$('#custom-field-modal').html(modelView.render().el);
	});
});

/**
 * Adds custom fields to the the desired entity and then calls the callback to
 * update the custom fields to that entity.
 * 
 * @method add_custom_fields_to_form
 * @param context
 *            entity to fill up with the custom fields
 * @param callback
 *            will be called with the modified entity as parameter, when it is a
 *            function
 * 
 */
function add_custom_fields_to_form(context, callback) {

	
	$("#content").html(LOADING_HTML);
	var custom_fields = Backbone.Model.extend({
		url : "core/api/custom-fields"
	});

	new custom_fields().fetch({
		success : function(custom_field_data) {

			var custom_fields_list = [];

			$.each(custom_field_data.toJSON(), function(index, value) {
				custom_fields_list.push(value);
			});

			// var contact = contact.toJSON();

			context['custom_fields'] = custom_fields_list;

			if (callback && typeof (callback) === "function") {

				// execute the callback, passing parameters as necessary
				callback(context);
			}

		}
	});

}

/**
 * Called from handlebars
 * Generates suitable html string for each custom field entity depending upon it's type 
 * and does concatenation. For example, if the type of the field is list then a 'select drop down' 
 * is generated. Similarly, html strings are generated based on other filed types.
 * If the custom field has the attribute is_required as true, then it's associated html
 * string also contains the "required" class. 
 * 
 * @method show_custom_fields_helper
 * @param custom_fields
 * @param properties
 * @returns {String}
 */
function show_custom_fields_helper(custom_fields, properties){
	var el = "";
	
	// Text as default
	var field_type = "text"
		
	// Create Field for each custom field  to insert into the desired form 
	$.each(custom_fields, function(index, field)
	{
		// If field type is list create a select dropdown
		if(field.field_type.toLowerCase() == "list")
		{
			var list_values = [],list_options = '<option value="">Select</option>';
			
			// Split values at ";" to separate values of field_data (list options)
			if(field.field_data)
					list_values = field.field_data.split(";");
				
				// Create options based on list values
				$.each(list_values,function(index, value){
					if(value != "")
						list_options = list_options.concat('<option value='+value+'>'+value+'</option>');
				});
				
				// Create select drop down by checking it's required nature
				if(field.is_required)
					el = el.concat('<div class="control-group">	<label class="control-label">'
									+ucfirst(field.field_label)
									+' <span class="field_req">*</span></label><div class="controls"><select class="'
									+field.field_type.toLowerCase()
									+' custom_field required" id='
									+field.id
									+' name="'
									+field.field_label
									+'">'
									+list_options
									+'</select></div></div>');
				else
					el = el.concat('<div class="control-group">	<label class="control-label">'
									+ucfirst(field.field_label)
									+'</label><div class="controls"><select class="'
									+field.field_type.toLowerCase()
									+' custom_field" id='
									+field.id
									+' name="'
									+field.field_label+'">'
									+list_options+'</select></div></div>');
				
			return;
		}
		else if(field.field_type.toLowerCase() == "checkbox")
			{
				field_type = "checkbox";
				if(field.is_required)
					el = el.concat('<div class="control-group">	<label class="control-label">'
								+ucfirst(field.field_label)
								+' <span class="field_req">*</span></label><div class="controls"><input type="'
								+field_type
								+'" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field required" id='
								+field.id+' name="'
								+field.field_label
								+'"></div></div>');
				else
					el = el.concat('<div class="control-group">	<label class="control-label">'
								+ucfirst(field.field_label)
								+'</label><div class="controls"><input type="'
								+field_type
								+'" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field" id='
								+field.id+' name="'
								+field.field_label
								+'"></div></div>');
				return;
			}
		else if(field.field_type.toLowerCase() == "textarea")
		{
			field_type = "textarea";
			if(field.is_required)
				el = el.concat('<div class="control-group">	<label class="control-label">'
							+ucfirst(field.field_label)
							+' <span class="field_req">*</span></label><div class="controls"><textarea rows="3" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required" id='
							+field.id+' name="'
							+field.field_label
							+'"></textarea></div></div>');
			else
				el = el.concat('<div class="control-group">	<label class="control-label">'
							+ucfirst(field.field_label)
							+'</label><div class="controls"><textarea rows="3" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field" id='
							+field.id+' name="'
							+field.field_label
							+'"></textarea></div></div>');
			return;
		}
		
		// If the field is not of type list or checkbox, create text field (plain text field or date field)
		if(field.is_required)
			el = el.concat('<div class="control-group">	<label class="control-label">'
							+ucfirst(field.field_label)
							+' <span class="field_req">*</span></label><div class="controls"><input type="text" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required" id='
							+field.id+' name="'+field.field_label
							+'"></div></div>');
		else
			el = el.concat('<div class="control-group">	<label class="control-label">'
							+ucfirst(field.field_label)
							+'</label><div class="controls"><input type="text" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field" id='
							+field.id+' name="'
							+field.field_label
							+'"></div></div>');
	});

	return el;
}

/**
 * De-serializes custom fields (fills the matched custom field values of the entity 
 * (for list and check-box fields) to the generated html string above) and return 
 * string to handlebars register helper to return as handlebars safestring.
 * 
 * @method fill_custom_field_values
 * @param {String} form 
 * 				html string of custom field values
 * @param {Object} content json object including custom fields
 * @returns {String} prefilled html string with matched custom field values
 */
function fill_custom_field_values(form, content)
{
	$.each(content, function(index , property){
		if(property.type == "CUSTOM")
			{

				var element = $(form).find('*[name="' + property.name + '"]');
				
				// If custom field is deleted or not found with property name return
				if(!element[0])
					{
						return;
					}
					var tagName = element[0].tagName.toLowerCase();
					var type = element.attr("type");
				
				if(tagName == "input")
					{
						if(type == "checkbox" && property.value == "on")
							{
								element.attr("checked", "checked"); 
								return;
							}
						
						element.attr("value", property.value);							
					}
				if(tagName == "select")
					{
					
						element.find('option[value='+property.value+']').attr("selected", "selected");
					}
			}
			
	});
	return $('<div>').append(form).html();
}