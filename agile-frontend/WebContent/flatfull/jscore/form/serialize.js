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
		if(CURRENT_USER_PREFS.dateFormat.indexOf("dd/mm/yy") != -1 || CURRENT_USER_PREFS.dateFormat.indexOf("dd.mm.yy") != -1)
			return {
				"name" : this.name,
				"value" : getFormattedDateObjectWithString(this.value).getTime() / 1000
			};
		else
			return {
				"name" : this.name,
				"value" : getFormattedDateObjectWithString(this.value).getTime() / 1000
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

	
	//Included to set content editable data
	arr = arr.concat($('#' + form_id + ' div[contenteditable="true"]').map(function() {

		var $editable_div = $('div[contenteditable="true"]');

		return {
			"name" : $editable_div.attr('data-name'),
			"value" : $editable_div.html()
		};
	}).get());

	// Serialize cc_emails
	arr = arr.concat($('#' + form_id + ' [name="cc_emails"]').map(function() {

        var array = [];
        $.each($(this).children(), function(g, h) {

    		if($(h).attr("data"))
        		array.push(($(h).attr("data")).toString());
	    });

	    return { name: 'cc_emails', value: array };

	}).get());

	// Serialize sortable widget data
	arr = arr.concat($('#' + form_id + ' .selected_columns').map(function() {

	    return { name: $(this).attr('name'), value: $(this).sortable("toArray") };

	}).get());

	//Serialize attachments list
	//arr = arr.concat(Ticket_Attachments.serializeList(form_id));

	arr = arr.concat($('#' + form_id + ' .array-input-fields').map(function() {
		console.log($(this).val());
		return {
			"name" : this.name,
			"value" : $(this).val()
		};
	}).get());


	// Serialize tags
	arr = arr.concat(get_tags(form_id));

	// Serialize notes
	arr = arr.concat(get_notes(form_id));
	
	// Serialize tags
	arr = arr.concat(get_related_deals(form_id));
	
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

	arr = arr.concat($('#' + form_id + ' .chosen-select').map(function() {
		var fields_set = [];

		// The array of selected values are mapped with the field name and
		// returned as a key value pair
		return {
			"name" : $(this).attr('name'),
			"value" : $(this).val()
		};
	}).get());

	arr = arr.concat($('#' + form_id + ' .multiple-input').map(function() {
		var fields_set = [];

		// Gets list of options, selected and pushes the field values in to an
		// array fields_set
		$.each($(this).find('input'), function(index, data) {
			if($(data).val())
				fields_set.push($(data).val());
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

	arr = arr.concat($('#' + form_id + ' .multiple-checkbox-adminprefs').map(function() {
		var fields_set = [];

		$('input:checkbox:checked', this).each(function(index, element_checkbox){
			if(!($(this).closest(".multiple-checkbox")) == undefined){
				console.log("admin-prefs");
			}
			else if (($(this).closest(".multiple-checkbox")).length == 0 )
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

	arr = arr.concat($('#' + form_id + ' input.month_date').map(function() {
		
			return {
				"name" : this.name,
				"value" : getFormattedDateObjectForMonthWithString(this.value).getTime() / 1000
			};
	}).get());

	/*
	 * Chained select, Chained select is used for filters, which uses logical
	 * input relation, field show have a class name "chained". Iterates through
	 * fields under element with class "chained", finds "div" element in it
	 */
	// Stores build rules based on chained select
	
	var chained_selects = $('#' + form_id + ' .chained-table:visible');
	$.each(chained_selects, function(index, element){
		var json_array = [];
	arr = arr.concat($(element).find('.chained:visible').map(function() {
		
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
			if($(data).closest('td').siblings('td.lhs-block').find("select#LHS").val() == "closed_time" && $(data).closest('tr').parent().parent().hasClass('opportunity'))
			{
				var date = getFormattedDateObjectWithString($(data).val());

				if(date)
				{
					value = date.getTime();
				}
			}
			else
			{
				var date = getFormattedDateObjectWithString($(data).val());

				value = getGMTEpochFromDateForCustomFilters(date);
			}
		}
		else if ($(data).hasClass("contact_custom_field") || $(data).hasClass("company_custom_field")) {
			value = $(data).attr("data");
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
	if(json_object.CONDITION == "BETWEEN") {
	    var newdate = (json_object.RHS_NEW + (24 * 60 * 60 * 1000) - 1);
       json_object.RHS_NEW = newdate;
	}
	if(json_object.nested_condition == "BETWEEN") {
	    var newdate = (json_object.nested_rhs + (24 * 60 * 60 * 1000) - 1);
       json_object.nested_rhs = newdate;
	}
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
	
	$('.modal').on('shown.bs.modal', function(event){
		var modalClassLength =  event.target.classList.length;
		if(event.target.classList[modalClassLength - 2] == "focusRelatedTo"){
			$('#opportunityUpdateForm').find("input[name='relates_to']").focus();
		}
		else {
		$('form', this).focus_first();
		}	
	});
});

function serializeLhsFilters(element)
{
	var json_array = [];
	var json_array_1 = [];
	var filters = {};
	$(element).find('a#lhs-filters-header').removeClass('bold-text');
	$.each($(element).find('.lhs-contact-filter-row'), function(index, data) {
		var json_object = {};
		var currentElement = $(data)[0];
		var RHS_VALUE, RHS_NEW_VALUE;
		var CONDITION = $(currentElement).find('[name="CONDITION"]').val();
		
		var RHS_ELEMENT = $(currentElement).find('.'+CONDITION).find('#RHS').children();
		var RHS_NEW_ELEMENT = $(currentElement).find('.'+CONDITION).find('#RHS_NEW').children();
		if($(RHS_ELEMENT).val() != undefined) {			
			RHS_VALUE = $(RHS_ELEMENT).val().trim();
		}
		if ($(RHS_ELEMENT).hasClass("date") && RHS_VALUE && RHS_VALUE != "") {
			var date = getFormattedDateObjectWithString($(RHS_ELEMENT).val());

			RHS_VALUE = getGMTEpochFromDateForDynamicFilters(date);
		}
		if ($(RHS_ELEMENT).hasClass("custom_contact") || $(RHS_ELEMENT).hasClass("custom_company")) {
			RHS_VALUE = $(RHS_ELEMENT).parent().find("input").attr("data");
		}
		if ($(RHS_ELEMENT).hasClass("custom_contacts") || $(RHS_ELEMENT).hasClass("custom_companies")) {
			$(RHS_ELEMENT).find("li").each(function(){
				var json_object_1 = {};
				var RHS_VALUE_1 = $(this).attr("data");
				var LHS_1 = $(currentElement).find('[name="LHS"]').val();
				if(RHS_VALUE_1)
				{
					json_object_1["LHS"] = LHS_1;
					json_object_1["CONDITION"] = "EQUALS";
					json_object_1["RHS"] = RHS_VALUE_1;
					json_object_1["RHS_NEW"] = "";
					json_array_1.push(json_object_1);
					var fieldName = LHS_1.replace(/ +/g, '_');
					fieldName = fieldName.replace(/#/g, '\\#').replace(/@/g, '\\@').replace(/[\/]/g,'\\/');
					var currentElemnt = $(element).find('#'+fieldName+'_div');
					$(currentElemnt).parent().find("a#lhs-filters-header").addClass('bold-text');
					$(currentElemnt).find('a.clear-filter-condition-lhs').removeClass('hide');
				}
			});
			
		}
		RHS_NEW_VALUE = $(RHS_NEW_ELEMENT).val();
		if ($(RHS_NEW_ELEMENT).hasClass("date") && RHS_NEW_VALUE && RHS_NEW_VALUE !="") {
			var date = getFormattedDateObjectWithString($(RHS_NEW_ELEMENT).val());
		if(CONDITION != "BETWEEN") {
			RHS_NEW_VALUE = getGMTEpochFromDateForDynamicFilters(date);
		}
		else {
			date = new Date(getGMTEpochFromDateForDynamicFilters(date) + (24 * 60 * 60 * 1000) - 1);
			RHS_NEW_VALUE = date.getTime();
		}
			
			
		}
		if(RHS_NEW_VALUE && typeof RHS_NEW_VALUE == "string") {
			RHS_NEW_VALUE = RHS_NEW_VALUE.trim();
		}
		
		// Set if value of input/select is valid
		if ((RHS_VALUE && RHS_VALUE != null && RHS_VALUE != "") || CONDITION =="DEFINED" || CONDITION =="NOT_DEFINED") {
			//if rhs_new exists and is empty dont consider this condition.
			if(RHS_NEW_ELEMENT && RHS_NEW_ELEMENT.length > 0 ) {
				if(!RHS_NEW_VALUE || RHS_NEW_VALUE == null || RHS_NEW_VALUE == "") {
					//in jquery each return is equivalent to continue.
					return;
				}
			}
			var LHS = $(currentElement).find('[name="LHS"]').val();
			json_object["LHS"] = LHS;
			json_object["CONDITION"] = CONDITION;
			json_object["RHS"] = RHS_VALUE;
			json_object["RHS_NEW"] = RHS_NEW_VALUE;
			json_array.push(json_object);
			var fieldName = LHS.replace(/ +/g, '_');
			fieldName = fieldName.replace(/#/g, '\\#').replace(/@/g, '\\@').replace(/[\/]/g,'\\/');
			var currentElemnt = $(element).find('#'+fieldName+'_div');
			$(currentElemnt).parent().find("a#lhs-filters-header").addClass('bold-text');
			$(currentElemnt).find('a.clear-filter-condition-lhs').removeClass('hide');
		}
		// Pushes each rule built from chained select in to an JSON array
	});
	filters["rules"] = json_array;
	if(json_array_1)
	{
		filters["or_rules"] = json_array_1;
	}
	filters["contact_type"] = $(element).find('#contact_type').val();
	return filters;
}
