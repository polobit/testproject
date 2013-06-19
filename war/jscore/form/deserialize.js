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
    $.each(
    data,

    function (i, el)
    {

        // Finds the element with name attribute same as the key
        // in the JSON data
        var fel = form.find('*[name="' + i + '"]'),
            type = "",
            tag = "";

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
                	
                    fel.val(new Date(el * 1000)
                        .format('mm/dd/yyyy'));

                    fel.datepicker(
                    {
                        format: 'mm/dd/yyyy',
                    });
                }

                /*
                 * If type of the field is text of password or
                 * hidden fills the data
                 */
                else if (type == "text" || type == "password" || type == "hidden")
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
                        if (el == true) fel.attr("checked", "checked");
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
                    fel.filter('[value="' + el + '"]').attr(
                        "checked", "checked");
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
                $.each(el, function (index, option)
                {
                    $('#multipleSelect', form).multiSelect(
                        'select', option);
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
                $.each(
                		data.contacts,

                function (index, contact)
                {
                    var tag_name;

                    /*
                     * tag_id represents contact.id, values of the
                     * tags(li) are contact ids
                     */
                    var tag_id = contact.id;

                    /*
                     * tag_name represent the name of the contact
                     * first_name and last_name
                     */
                    if(contact.type == "COMPANY")
                    	tag_name = getPropertyValue(
                                contact.properties,
                                    "name");
                    else
                    	tag_name = getPropertyValue(
                    			contact.properties,
                        "first_name") + " " + getPropertyValue(
                        		contact.properties,
                        "last_name");

                    /*
                     * Creates a tag for each contact and appends to
                     * tags input field with class "tagsinput", tag
                     * value is contact id and name of li element is
                     * contact full name
                     */
                    $('.tagsinput', form)
                        .append(
                        '<li class="tag" data="' + tag_id + '" class="tag"  style="display: inline-block; ">' + tag_name + '<a class="close" id="remove_tag">&times</a></li>');
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
                $.each(el, function (index, option)
                {
                    $('#multipleSelect', form).multiSelect(
                        'select', option);
                });
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

            	//deserializeChainedSelect(form, el);
            }
        }

    });
}

// To deserialize multiple forms in content
/**
 * Desrializes the multiple forms, It calls deserializeForm for each form 
 * in the element passed. Called from base-model when there are multiple 
 * forms with single save option.
 * @param data data to be filled in forms
 * @param form html element with multiple forms
 */
function deserializeMultipleForms(data, form)
{
	// Iterates through each form element in the form and calls 
	// deseriazlie of each form with respective data element 
	// based on key(i.e., name of the form)
    $.each(form, function (index, form_element)
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
        else deserializeForm(data, $(form_element));
    });
}




function deserializeChainedSelect(form, el)
{

    // Iterates through JSON array of rules, to fill
    // a chained select
    $.each(el,
    function (index, data)
    {

        // Finds the rule html element
        var rule_element = ($(form)
            .find('.chained'))[0];

        /*
         * If more than one rule clones the fields and relate with
         * jquery.chained.js
         */
        if (index > 0)
        {
            var parent_element = $(rule_element).parent();

            /*
             * Gets the Template for input and select
             * fields
             */
            rule_element = $(getTemplate("filter-contacts", {})).find('tr')
                .clone();

            // Add remove icon for rule
            $(rule_element).find("i.filter-contacts-multiple-remove").css("display", "inline-block");

            // Loads jquery chained plugin for chaining
            // the input fields
            head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js',

            function ()
            {

                /*
                 * Chains dependencies of input fields with
                 * jquery.chained.js based on the rule element
                 */
				chainFilters(rule_element);

                $(parent_element).append(rule_element);
            });
        }

        $.each(data, function (i, value)
        {
            var input_element = ($(rule_element).find('*[name="'+ i +'"]').children())[0];
         
            // If input field set is value for input field, checks it chained select elements
            // date fields should be filled with date
            if (input_element.tagName.toLowerCase() == "input")
            {

            	// Fills date in to fields and initialize datepicker on the field
                if ($(input_element).hasClass('date'))
                {
                	value = getLocalTimeFromGMTMilliseconds(value);
                	 
                    $(input_element).val(new Date(parseInt(value))
                        .format('mm/dd/yyyy'));
                    
                    $(input_element).datepicker(
                    {
                        format: 'mm/dd/yyyy',
                    });
                    return;
                }
                $(
                input_element)
                    .val(
                value);
                return;
            }

            // Gets related select field
            var option_element = $(input_element).children()

            // Iterates through options in select field
            $.each(option_element, function (index, element)
            {
                // Selects the option
                if ($(element).attr('value') == value)
                {
                    $(element).attr("selected",
                        "selected");
                    $(input_element).trigger("change");
                    return;
                }
            });
        });
    })
}