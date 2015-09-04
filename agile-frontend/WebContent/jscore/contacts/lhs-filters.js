/**
 * This file is used for filters shown in lhs of contacts page.
 */

var scrambled_index=0;
function scramble_filter_input_names(el)
{
	$(el).find("input[type=text],input[type=number]").each(function(){
		$(this).attr('name','temp-'+scrambled_index);
		$(this).attr('id','temp-'+scrambled_index);
		scrambled_index+=1;
	});
}
 
function setupLhsFilters(cel, is_company) {
	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	if(is_company) {
		$('#lhs_filters_conatiner', cel).html(getTemplate("companies-lhs-filters"));
		fillSelect('owner_select','/core/api/users', undefined, function() {
			if(!COMPANY_CUSTOM_FIELDS)
			{
				$.getJSON("core/api/custom-fields/searchable/scope?scope=COMPANY", function(fields){
				COMPANY_CUSTOM_FIELDS = fields;
				loadCustomFiledsFilters(fields, cel, is_company);
				return;
			})
			} else {		
				loadCustomFiledsFilters(COMPANY_CUSTOM_FIELDS, cel, is_company);
			}
		}, optionsTemplate, false, $('#lhs_filters_conatiner', cel)); 

	} else {
		$('#lhs_filters_conatiner', cel).html(getTemplate("contacts-lhs-filters"));
		fillSelect('owner_select','/core/api/users', undefined, function() {
			//loading image is added to hidden select by fillselect
			//remove it manually.
			if(!SEARCHABLE_CONTACT_CUSTOM_FIELDS)
			{
				$.getJSON("core/api/custom-fields/searchable/scope?scope=CONTACT", function(fields){
				SEARCHABLE_CONTACT_CUSTOM_FIELDS = fields;
				loadCustomFiledsFilters(fields, cel, is_company);
				return;
			})
			} else {		
				loadCustomFiledsFilters(SEARCHABLE_CONTACT_CUSTOM_FIELDS, cel, is_company);
			}
		}, optionsTemplate, false, $('#lhs_filters_conatiner', cel)); 

	}
		
}

function loadCustomFiledsFilters(fields, cel, is_company) {
	$('#custom-filter-fields', cel).html(getTemplate("contacts-lhs-filters-custom", fields));
	//$('#custom-filter-fields', cel).find("input.date").datepicker({ format : 'mm/dd/yyyy'});
	addTagsTypeaheadLhs($('#tags-lhs-filter-table',cel).find("div.lhs-contact-filter-row").find('#RHS'));
	$("input.date", cel).datepicker({ format : 'mm/dd/yyyy', autoclose: true});
	//$('#custom-filter-fields', cel).find("input.date").datepicker({ format : 'mm/dd/yyyy'});
	$('select[name="CONDITION"]', cel).die().live('change', function(e)
	{
		var selected = $(this).val();
		$(this).parent().find('div.condition_container').addClass('hide');
		$(this).parent().find('div.condition_container.'+selected).find('input').val("").attr('prev-val', "");
		$(this).parent().find('div.condition_container.'+selected).find('select').val("").attr('prev-val', "");;
		$(this).parent().find('div.condition_container.'+selected).removeClass('hide');
		$(this).parent().find('div.condition_container.'+selected).find('#RHS :not(input.date)').focus();
	});
	scramble_filter_input_names(cel);
	if(is_company && readData('dynamic_company_filter')) {
		deserializeLhsFilters($('#lhs-contact-filter-form'), readData('dynamic_company_filter'));
	} 
	if(!is_company && readData('dynamic_contact_filter')) {
		deserializeLhsFilters($('#lhs-contact-filter-form'), readData('dynamic_contact_filter'));
	}
}

function getSerializedFilter()
{
	return serializeLhsFilters($('#lhs-contact-filter-form'));
}

function submitLhsFilter() {
	var formData = getSerializedFilter();
	// erase filter cookies
	eraseCookie('contact_filter');
	eraseCookie('contact_filter_type');
	//eraseCookie('company_filter');
	var contact_type = formData.contact_type;
	if(contact_type == 'COMPANY') {
		eraseData('dynamic_company_filter');
		if(formData != null && formData.rules.length >0) {
			storeData('dynamic_company_filter', JSON.stringify(formData));
			createCookie('company_filter', "Companies");
		}
	} else {
		eraseData('dynamic_contact_filter');
		if(formData != null && formData.rules.length >0)
			storeData('dynamic_contact_filter', JSON.stringify(formData));
	}
	
	CONTACTS_HARD_RELOAD=true;
	App_Contacts.contacts(undefined, undefined, undefined, true);
}

$('a.filter-multiple-add-lhs').die().live("click", function(e) {
	e.preventDefault();
	var fieldName = $(this).data('name');
	var htmlContent = $('#'+fieldName+'-lhs-filter-table').find("div.hide.master-"+fieldName+"-add-div").clone();
	htmlContent.removeClass('hide').addClass("lhs-contact-filter-row");
	if(fieldName == 'tags') {		
		addTagsTypeaheadLhs(htmlContent);
	}
	scramble_filter_input_names(htmlContent);
	$(htmlContent).appendTo('#'+fieldName+'-lhs-filter-table');
	$('#'+fieldName+'-lhs-filter-table').find("div.lhs-contact-filter-row:last").find('#RHS:visible').find(':not(input.date)').focus();
});

// Filter Contacts- Remove Multiple
	$("i.filter-tags-multiple-remove-lhs").die().live('click', function(e)
	{
		var container = $(this).parents('.lhs-contact-filter-row');
		$(container).find('#RHS').children().val("").trigger('blur').trigger('change');
		$(this).closest('div.lhs-contact-filter-row').remove();
	});
	
	// Filter Contacts- Remove Multiple
	$("a.clear-filter-condition-lhs").die().live('click', function(e)
	{
		$(this).addClass('hide');
		var container = $(this).parents('.lhs-row-filter');
		$(container).find('#RHS').children().val("").attr('prev-val', "");
		$(container).find('#RHS_NEW:visible').children().val("").attr('prev-val', "");
		$(container).find('a#lhs-filters-header').find('i').toggleClass('fa-plus-square-o').toggleClass('fa-minus-square-o');
		$(container).find('a#lhs-filters-header').next().addClass('hide');
		submitLhsFilter();
	});

$('#clear-lhs-contact-filters').die().live("click", function(e) {
	e.preventDefault();
	eraseData('dynamic_contact_filter');
	CONTACTS_HARD_RELOAD=true;
	App_Contacts.contacts();
});

$('#clear-lhs-company-filters').die().live("click", function(e) {
	e.preventDefault();
	eraseData('dynamic_company_filter');
	CONTACTS_HARD_RELOAD=true;
	App_Contacts.contacts();
});

$('#lhs-filters-header').die().live("click", function(e) {
	e.preventDefault();
	$(this).find('i').toggleClass('fa-plus-square-o').toggleClass('fa-minus-square-o');
	$(this).next().toggleClass('hide');
	$(this).next().find('.lhs-contact-filter-row:visible').find('#RHS:visible').find(':not(input.date)').focus();
});

$('#lhs-contact-filter-form #RHS input').die().live("blur keyup", function(e) {
	if (e.type == 'focusout' || e.keyCode == '13')  {
		var prevVal = $(this).attr('prev-val');
		var currVal = $(this).val().trim();
		if(prevVal == currVal) {
			return;
		} else {
			$(this).attr('prev-val', currVal);
		}
		if($(this).parent().next().attr("id") == "RHS_NEW") {
			if($(this).parent().next().find('input').val() != "" && currVal != "") {
				submitLhsFilter();
				$(this).blur();
			}
		} else {
			if(currVal == "") {
				var container = $(this).parents('.lhs-contact-filter-row');
				$(container).find('a.clear-filter-condition-lhs').addClass('hide');
			}
			submitLhsFilter();
			$(this).blur();
		}
	}
});

$('#lhs-contact-filter-form #RHS select').die().live("change", function(e) {
	if($(this).parent().next().attr("id") == "RHS_NEW") {
		if($(this).val() != "" && $(this).parent().next().children().val() != "") {
			submitLhsFilter();
		}
		if($(this).val() == "" && $(this).parent().next().children().val() == "") {
			var container = $(this).parents('.lhs-contact-filter-row');
			$(container).find('a.clear-filter-condition-lhs').addClass('hide');
			submitLhsFilter();
		}
	} else {
		var prevVal = $(this).attr('prev-val');
		var currVal = $(this).val().trim();
		if(prevVal == currVal) {
			return;
		} else {
			$(this).attr('prev-val', currVal);
		}
		if($(this).val() == "") {
			var container = $(this).parents('.lhs-contact-filter-row');
			$(container).find('a.clear-filter-condition-lhs').addClass('hide');
		}
		submitLhsFilter();
	}
	$(this).blur();
});

$('#lhs-contact-filter-form #RHS_NEW select').die().live("change", function(e) {
	if($(this).parent().prev().attr("id") == "RHS") {
		if($(this).val() != "" && $(this).parent().prev().children().val() != "") {
			submitLhsFilter();
		}
		if($(this).val() == "" && $(this).parent().prev().children().val() == "") {
			submitLhsFilter();
		}
	} else {
		submitLhsFilter();
	}
	$(this).blur();
});

$('#lhs-contact-filter-form #RHS_NEW input').die().live("blur keyup", function(e) {
	if (e.type == 'focusout' || e.keyCode == '13')  {
		var prevVal = $(this).attr('prev-val');
		var currVal = $(this).val().trim();
		if(prevVal == currVal) {
			return;
		} else {
			$(this).attr('prev-val', currVal);
		}
		if($(this).parent().prev().attr("id") == "RHS") {
			if($(this).parent().prev().find('input').val() != "") {
				submitLhsFilter();
				$(this).blur();
			}
		} else {
			if(currVal != "") {
				submitLhsFilter();
				$(this).blur();
			}
		}
	}
});
/**
 * Added tags typeahead on fields
 * 
 * @param element
 */
function addTagsTypeaheadLhs(element)
{
	var tags_array = [];

	// 'TAGS' are saved in global variable when they are fetched to show stats
	// in contacts page. If it is undefined, tags are fetched from DB an then type ahead is built
	if (!TAGS)
	{
		var TagsCollection = Backbone.Collection.extend({ url : '/core/api/tags', sortKey : 'tag' });

		tagsCollection = new TagsCollection();

		tagsCollection.fetch({ success : function(data)
		{
			TAGS = tagsCollection.models;
			addTagsTypeaheadLhsFilters(tagsCollection.toJSON(), element);

		} });
		return;
	}
	

	// Adds typeahead to given element
	addTagsTypeaheadLhsFilters(tagsCollection.toJSON(), element);
}

// With tags JSON sent type ahead is built on input fields
function addTagsTypeaheadLhsFilters(tagsJSON, element)
{
	var tags_array = [];

	$.each(tagsJSON, function(index, element)
	{
		tags_array.push(element.tag.toString());
	});

	// $("input", element).attr("data-provide","typeahead");
	$("input", element).typeahead({ "source" : tags_array,
		updater:function (item) {
			this.$element.val(item);
			this.$element.trigger('blur');
			this.hide();
			return item;
	    }
		}).attr('placeholder', "Enter Tag").width("92%");
}
