/**
 * Serialize.js is used to serialize the forms, It returns a map, with field
 * values in form mapped against field names in the form as keys. It uses jquery
 * serializeArray method to serialize field value, and also provides custom
 * serializations for fields, to get custom values form the fields.
 * 
 * @param form_id
 *            Sends form id to be serialized
 * @returns JSON returns serialized form values
 */

function serializeForm(form_id) {
	var arr = $('#' + form_id).serializeArray(), obj = {};

	/*
	 * Serializes check box, though serialization for check box is available in
	 * SerializeArray which return "on", if checked. Since it is required to
	 * return true, if check box field is checked, so serialization is
	 * customized for checkbox.
	 */
	arr = arr.concat($('#' + form_id + ' input[type=checkbox]').map(function() {
		return {
			"name" : this.name,
			"value" : $(this).is(':checked')
		}
	}).get());

	// Change the dates properly from human readable strings to epoch
	/*
	 * Date fields, fields html elements with class "date" are serialized
	 * returns epoch time.
	 */
	arr = arr.concat($('#' + form_id + ' input.date').map(function() {
		return {
			"name" : this.name,
			"value" : new Date(this.value).getTime() / 1000
		};
	}).get());
	
	arr = arr.concat($('#' + form_id + ' select.multi-select').map(function() {
		console.log($(this).val());
		return {
			"name" : this.name,
			"value" : $(this).val()
		};
	}).get());
	console.log(arr);
	

	// Serialize tags
	arr = arr.concat(get_tags(form_id));


	/*
	 * Multiple select, If field is of type muti select then this returns set of
	 * values selected with the name of the field. To use this multi select,
	 * field element should have a class "multiSelect" and value in ms-value/
	 * Multi select is used for creating a custom view, it uses
	 * jquery.multiselect
	 */
	arr = arr.concat($('#' + form_id + ' .multiSelect').map(function() {
		var fields_set = [];

		// Gets list of options, selected and pushes the field values in to an
		// array fields_set
		$.each($(this).children('li'), function(index, data) {
			fields_set.push(($(data).attr('ms-value')))
		});

		// The array of selected values are mapped with the field name and
		// returned as a key value pair
		return {
			"name" : $(this).attr('name'),
			"value" : fields_set
		};
	}).get());
	
	arr = arr.concat($('#' + form_id + ' .multiple-checkbox').map(function() {
		var fields_set = [];

		$('input:checkbox:checked', this).each(function(index, element_checkbox){
			fields_set.push($(element_checkbox).val());
		});
		
		console.log(fields_set);

		// The array of selected values are mapped with the field name and
		// returned as a key value pair
		return {
			"name" : $(this).attr('name'),
			"value" : fields_set
		};
	}).get());

	/*
	 * Chained select, Chained select is used for filters, which uses logical
	 * input relation, field show have a class name "chained". Iterates through
	 * fields under element with class "chained", finds "div" element in it
	 */
	// Stores build rules based on chained select
	
	var chained_selects = $('#' + form_id + ' .chained-table');
	$.each(chained_selects, function(index, element){
		var json_array = [];
	arr = arr.concat($(element).find('.chained').map(function() {
		
		var json_object = serializeChainedElement(this);
		json_array.push(json_object);
	
		// Maps json array with name "rules"
		return {
			"name" : $(this).attr('name'),
			"value" : json_array
		};

	}).get());
	});

	// Converts array built from the form fields into JSON
	for ( var i = 0; i < arr.length; ++i) {
		obj[arr[i].name] = arr[i].value;
	}

	// obj[ $('#' + form_id + ' select').attr('name') ] = $('#' + form_id + '
	// select').val();
	return obj;
}

function serializeChainedElement(element)
{
	var json_object = {};
	$.each($(element).find('div').children(), function(index, data) {
		
		var tagName = $(data)[0].tagName;
		
		if(!(tagName == "TEXTAREA" || tagName == "INPUT" || tagName == "SELECT"))
			return;
		// Gets the name of the tr
		var name = $(data).parent().attr('name');
		var value;

		// If type of the field is "date" then return epoch time
		if ($(data).hasClass("date")) {
			var date = new Date($(data).val());
			value = getGMTTimeFromDate(date);
		}

		// Value of input/select
		else
			{
			if(!json_object[name])
				value = $(data).val();
			}

		// Set if value of input/select is valid
		if (value != null && value != "")
			json_object[name] = value;
		// Pushes each rule built from chained select in to an JSON array
	});
	return json_object;
}


$(function(){
	//Focus first element
	$.fn.focus_first = function() {
		
		var elem = $(this).find('input:visible').not('.hide').get(0);
		var textarea = $('textarea:visible', this).get(0);
		if (textarea && elem) {
			if (textarea.offsetTop < elem.offsetTop) {
				elem = textarea;
			}
		}
  
		if (elem) {
			$(elem).focus();
		}
		return this;
	}
	
	$('.modal').on('shown', function(event){
		$('form', this).focus_first();
	});
});