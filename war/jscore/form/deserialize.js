/**
 * Deserialize.js It deserializes the form with the data, it is used while
 * editing data, it pre fills the form with the data to be edited.
 * 
 * deserializeForm(data, form) function iterates through data and finds the
 * element with respect to the name attribute of the field to fill the basic
 * fields i.e., input field, check box, select filed. This function includes
 * functionalities to deserialize the fields designed with custom functionality.
 * 
 * @param data
 *            data to be filled in form
 * @param form
 *            html form element
 */
function deserializeForm(data, form)
{

	// Iterates through the data(which is to be populated in the form) and finds
	// field elements in the form based on the name of the field and populates
	// it. i represents key of the map, el is the value corresponding to key
	$
			.each(
					data,

					function(i, el)
					{

						// Finds the element with name attribute same as the key
						// in the JSON data
						var fel = form.find('*[name="' + i + '"]'), type = "", tag = "";

						// If Fields exist with the field name, process the
						// fields to fill the data in the form
						if (fel.length > 0)
						{

							// Reads the tag name of the field
							tag = fel[0].tagName.toLowerCase();

							// If tag of the element is of type select of
							// textarea fills the data
							if (tag == "select" || tag == "textarea")
							{ // ...
								$(fel).val(el);
							}

							/*
							 * If tag of the field is input type, checks whether
							 * input field is a date field, to generate date
							 * based on epoch time and fills in the input
							 * field(date fields uses bootstrap datepicker in
							 * the fileds)
							 */
							else if (tag == "input")
							{
								type = $(fel[0]).attr("type");

								/*
								 * If field has class date, calculates the date
								 * and fills in the input field, formats with
								 * datepicker
								 */
								if (fel.hasClass('date'))
								{
									try
									{
										fel.val(new Date(el * 1000).format('mm/dd/yyyy'));
									}
									catch (err)
									{

									}
									fel.datepicker({ format : 'mm/dd/yyyy', });
								}

								/*
								 * If type of the field is text of password or
								 * hidden fills the data
								 */
								else if (type == "text" || type == "password" || type == "hidden" || type == "number")
								{
									fel.val(el);
								}
								else if (tag == "select")
								{
									fel.val(el).trigger('change');
								}

								// Checks the checkbox if value of the filed is
								// true
								else if (type == "checkbox")
								{
									if (el)
									{
										if (el == true)
											fel.attr("checked", "checked");
									}
									else
									{
										fel.removeAttr("checked");
									}
								}

								/*
								 * If type of the field is "radio", then filters
								 * the field based on the value and checks it
								 * accordingly
								 */
								else if (type == "radio")
								{
									fel.filter('[value="' + el + '"]').attr("checked", "checked");
								}
							}

							/*
							 * Deserialize multiselect, select box to select
							 * multiple values, used for contact custom views.
							 * This is for the fields which uses
							 * jquery.multi-select.js, it provides multiSelect()
							 * function to fill the select
							 */
							else if (fel.hasClass('multiSelect') && tag == 'ul')
							{

								/*
								 * Iterates through options of the select and
								 * call multiSelect function to select the
								 * option
								 */
								$.each(el, function(index, option)
								{
									$('#multipleSelect', form).multiSelect('select', option);
								});
							}

							/*
							 * Deserialize tags, tags are represented by list
							 * elements prepended the respective input field. If
							 * field has class tagsinput and tag is ul and
							 * attribute of the field is contacts, then is field
							 * is considered as the tags field, it de-serializes
							 * the contact tags
							 */
							else if (fel.hasClass('tagsinput') && tag == "ul" && fel.hasClass('contacts'))
							{
								// Iterates through contacts to create a tag
								// element for each contact
								$
										.each(
												data.contacts,

												function(index, contact)
												{
													var tag_name;

													/*
													 * tag_id represents
													 * contact.id, values of the
													 * tags(li) are contact ids
													 */
													var tag_id = contact.id;

													/*
													 * tag_name represent the
													 * name of the contact
													 * first_name and last_name
													 */
													tag_name = getContactName(contact);

													/*
													 * Creates a tag for each
													 * contact and appends to
													 * tags input field with
													 * class "tagsinput", tag
													 * value is contact id and
													 * name of li element is
													 * contact full name
													 */
													$('.tagsinput', form)
															.append(
																	'<li class="tag" data="' + tag_id + '" class="tag"  style="display: inline-block; "><a href="#contact/' + contact.id + '">' + tag_name + '</a><a class="close" id="remove_tag">&times</a></li>');
												});
							}

							/*
							 * Deserialize multiselect, select box to select
							 * multiple values, used for contact custom views.
							 * This is for the fields which uses
							 * jquery.multi-select.js, it provides multiSelect()
							 * function to fill the select
							 */
							else if (fel.hasClass('multiSelect') && tag == 'ul')
							{

								/*
								 * Iterates through options of the select and
								 * call multiSelect function to select the
								 * option
								 */
								$.each(el, function(index, option)
								{
									$('#multipleSelect', form).multiSelect('select', option);
								});
							}
							
							/**
							 * Deserialize multiple checkboxes. 
							 */
							else if (fel.hasClass('multiple-checkbox')) {

								/*
								 * Iterates through options of the select and
								 * call multiSelect function to select the
								 * option
								 */
								for(var i=0 ; i < el.length; i++)
								{
									$('input:checkbox[value="'+el[i]+'"]', fel).attr("checked", "checked");
								}
							}

							/*
							 * Deserialize chained select, chained select is
							 * used for creating filters. It is logical chaining
							 * of the input fields, If form contains an element
							 * with class "chainedSelect" the deserializes the
							 * chained select. Chained select fields can be
							 * multiple, if value include multiple rules a
							 * chained select field should is added to the form
							 * and populates with the value
							 */
							else if (fel.hasClass('chainedSelect'))
							{

								// deserializeChainedSelect(form, el);
							}
						}

					});
}

// To deserialize multiple forms in content
/**
 * Desrializes the multiple forms, It calls deserializeForm for each form in the
 * element passed. Called from base-model when there are multiple forms with
 * single save option.
 * 
 * @param data
 *            data to be filled in forms
 * @param form
 *            html element with multiple forms
 */
function deserializeMultipleForms(data, form)
{
	// Iterates through each form element in the form and calls
	// deseriazlie of each form with respective data element
	// based on key(i.e., name of the form)
	$.each(form, function(index, form_element)
	{
		// Reads the name of the form element
		var key = $(form_element).attr('name');

		// If form have attribute name deserializes with particular object
		if (key && data[key])
		{
			deserializeForm(data[key], $(form_element));
		}

		// If data with the key is not available then calls
		// deserialize on the data directly, since form values
		// can be directly available in the JSON object
		else
			deserializeForm(data, $(form_element));
	});
}

function deserializeChainedSelect(form, el, el_self)
{

	// Iterates through JSON array of rules, to fill
	// a chained select
	$.each(el, function(index, data)
	{

		// Finds the rule html element
		var rule_element = ($(form).find('.chained'))[0];

		/*
		 * If more than one rule clones the fields and relate with
		 * jquery.chained.js
		 */
		if (index > 0)
		{
			var parent_element = $(rule_element).parent();

			/*
			 * Gets the Template for input and select fields
			 */
			rule_element = $($(el_self).clone().find('.chained'))[0];

			// Add remove icon for rule
			$(rule_element).find("i.filter-contacts-multiple-remove").css("display", "inline-block");

			var remove_icon = $(rule_element).find("i.filter-contacts-multiple-remove").css("display", "inline-block");

			// Loads jquery chained plugin for chaining
			// the input fields
			// head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js',

			// function ()
			// {

			/*
			 * Chains dependencies of input fields with jquery.chained.js based
			 * on the rule element
			 */
			chainFilters(rule_element);

			$(parent_element).append(rule_element);
			deserializeChainedElement(data, rule_element);

			// });

			return;
		}

		deserializeChainedElement(data, rule_element);
	})
}

function deserializeChainedElement(data, rule_element)
{	$(rule_element).removeClass('hide');
	$.each(data, function(i, value)
	{
		var input_element = ($(rule_element).find('*[name="' + i + '"]').children())[0];
		if (!input_element)
			return;

		// If input field set is value for input field, checks it chained select
		// elements
		// date fields should be filled with date
		if (input_element.tagName.toLowerCase() == "input")
		{

			// Fills date in to fields and initialize datepicker on the field
			if ($(input_element).hasClass('date'))
			{
				value = getLocalTimeFromGMTMilliseconds(value);

				$(input_element).val(new Date(parseInt(value)).format('mm/dd/yyyy'));

				$(input_element).datepicker({ format : 'mm/dd/yyyy', });

				$(input_element).datepicker('update');

				return;
			}
			$(input_element).val(value);
			return;
		}

		// Gets related select field
		var option_element = $("option", input_element);

		// Iterates through options in select field
		$.each(option_element, function(index, element)
		{
			// Selects the option
			if ($(element).attr('value') == value)
			{
				$(element).attr("selected", "selected");
				var url = $(element).attr("url");
				if (url)
				{
					$(element).attr("data", data.RHS);
					console.log($(element));
				}
				$(input_element).trigger("change");
				return;
			}
		});
	});

}

function deserializeChainedElementWebrule(data, rule_element)
{
	$.each(data, function(i, value)
	{
		if (value.value)
			value = value.value;
		var input_element_set = $(rule_element).find('*[name="' + i + '"]').children();

		var input_element = input_element_set[0];
		if (!input_element)
			return;

		var tag_name = input_element.tagName.toLowerCase();
		if (tag_name != "input" && tag_name != "textarea" && tag_name != "select" && input_element_set.length > 1)
			$.each(input_element_set, function(index, input)
			{
				if (index == 0)
					return;
				tag_name = input.tagName.toLowerCase();
				if (tag_name == "input" || tag_name == "textarea" || tag_name == "select")
				{
					input_element = input;
					return false;
				}

			})

		if (!input_element)
			return;

		// If input field set is value for input field, checks it chained select
		// elements
		// date fields should be filled with date
		if (input_element.tagName.toLowerCase() == "input" || input_element.tagName.toLowerCase() == "textarea")
		{
			$(input_element).val(value);
			if ($(input_element).hasClass('custom_html'))
			{

				if (value.value)
				{
					$(input_element).val(value.value);
				}
				// setupHTMLEditor($(input_element), value.value);
				// }
				// else
				// setupHTMLEditor($(input_element), value);
			}

			return;
		}

		// Gets related select field
		var option_element = $("option", input_element);

		// Iterates through options in select field
		$.each(option_element, function(index, element)
		{
			// Selects the option
			if ($(element).attr('value') == value)
			{
				if((value == "UNSUBSCRIBE_CAMPAIGN" || value == "ASSIGN_CAMPAIGN") && data['RHS']) {
					$(element).attr('data', data['RHS']);
				}
				$(element).attr("selected", "selected");
				$(input_element).trigger("change");
				return;
			}
		});
	});
}

function deserializeChainedSelect1(form, el, element)
{

	var self = $(element).find('.webrule-actions')[0];

	var rule_element_default = $(self).html();

	// Finds the rule html element
	var rule_element = ($(form).find('.webrule-actions'))[0];

	// Iterates through JSON array of rules, to fill
	// a chained select
	$.each(el, function(index, data)
	{

		/*
		 * If more than one rule clones the fields and relate with
		 * jquery.chained.js
		 */
		if (index > 0)
		{

			/*
			 * Gets the Template for input and select fields
			 */

			// Loads jquery chained plugin for chaining
			// the input fields
			// head.js('lib/agile.jquery.chained.min.js',
			// function ()
			// {
			var new_rule_element = $(rule_element_default).clone();

			// Add remove icon for rule
			$(new_rule_element).find("i.webrule-multiple-remove").css("display", "inline-block");

			var actions = [];
			actions.push(data);
			/*
			 * Chains dependencies of input fields with jquery.chained.js based
			 * on the rule element
			 */
			chainWebRules(new_rule_element, el, false, actions);

			deserializeChainedElementWebrule(data, new_rule_element);

			$(rule_element).append(new_rule_element);

			// });
			// return;
			return;
		}

		deserializeChainedElementWebrule(data, rule_element);
	})
}
	
	function deserializeLhsFilters(element, data)
{
	var json_object = JSON.parse(data);
	var tagsConditionsCount =0;
	$.each(json_object.rules, function(index, filter) {
		var LHS = filter.LHS;
		var CONDITION = filter.CONDITION;
		var RHS_VALUE = filter.RHS;
		var RHS_NEW_VALUE = filter.RHS_NEW;
		var fieldName = LHS.replace(/ +/g, '_');
		fieldName = fieldName.replace(/#/g, '\\#').replace(/@/g, '\\@');
		var currentElemnt = $(element).find('#'+fieldName+'_div');
		if(LHS == 'tags') {
			$('#tags_div').parent().find('a').addClass('bold-text');
			$('#tags_div').removeClass('hide');
			if(tagsConditionsCount == 0) {
				currentElemnt = $('#tags-lhs-filter-table').find("div.lhs-contact-filter-row:last")
				$('#tags_div').prev().find('i').toggleClass('fa-plus-square-o').toggleClass('fa-minus-square-o');
			} else {
				var htmlContent = $('#tags-lhs-filter-table').find("div.hide.master-tags-add-div").clone();
				htmlContent.removeClass('hide').addClass('lhs-contact-filter-row');
				addTagsDefaultTypeahead(htmlContent);
				$(htmlContent).find("i.filter-tags-multiple-remove-lhs").css("display", "inline-block");
				$(htmlContent).appendTo('#tags-lhs-filter-table');
				//$('#tags-lhs-filter-table').find("div.lhs-contact-filter-row:last").append(htmlContent);
				currentElemnt = $('#tags-lhs-filter-table').find("div.lhs-contact-filter-row:last");
			}
			tagsConditionsCount++;
		} else {
			$(currentElemnt).prev().find('i').toggleClass('fa-plus-square-o').toggleClass('fa-minus-square-o');
		}
		$(currentElemnt).parent().find("a").addClass('bold-text');
		$(currentElemnt).removeClass('hide');
		$(currentElemnt).find('[name="CONDITION"]').val(CONDITION);
		$(currentElemnt).find('[name="CONDITION"]').trigger('change');
		var RHS_ELEMENT = $(currentElemnt).find('.'+CONDITION).find('#RHS').children();
		var RHS_NEW_ELEMENT = $(currentElemnt).find('.'+CONDITION).find('#RHS_NEW').children();
		if ($(RHS_ELEMENT).hasClass("date")) {
			RHS_VALUE = getLocalTimeFromGMTMilliseconds(RHS_VALUE);
			$(RHS_ELEMENT).val(new Date(parseInt(RHS_VALUE)).format('mm/dd/yyyy'));
			$(RHS_ELEMENT).attr('prev-val', new Date(parseInt(RHS_VALUE)).format('mm/dd/yyyy'));
		} else {
			$(RHS_ELEMENT).val(RHS_VALUE);
			$(RHS_ELEMENT).attr('prev-val', RHS_VALUE);
		}
		if(RHS_NEW_ELEMENT) {
			if ($(RHS_NEW_ELEMENT).hasClass("date")) {
				RHS_NEW_VALUE = getLocalTimeFromGMTMilliseconds(RHS_NEW_VALUE);
				$(RHS_NEW_ELEMENT).val(new Date(parseInt(RHS_NEW_VALUE)).format('mm/dd/yyyy'));
				$(RHS_NEW_ELEMENT).attr('prev-val', new Date(parseInt(RHS_NEW_VALUE)).format('mm/dd/yyyy'));
			} else {
				$(RHS_NEW_ELEMENT).val(RHS_NEW_VALUE);
				$(RHS_NEW_ELEMENT).attr('prev-val', RHS_NEW_VALUE);
			}
		}

	});
}
