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
		fillSelect('owner_select','/core/api/users', 'domainUser', function() {
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
		fillSelect('owner_select','/core/api/users', 'domainUser', function() {
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
	addTagsDefaultTypeahead($($('#tags-lhs-filter-table',cel).find("tr")[1]).find('#RHS'));
	$("input.date", cel).datepicker({ format : 'mm/dd/yyyy', autoclose: true});
	//$('#custom-filter-fields', cel).find("input.date").datepicker({ format : 'mm/dd/yyyy'});
	$('select[name="CONDITION"]', cel).die().live('change', function(e)
	{
		var selected = $(this).val();
		$(this).parent().find('div').addClass('hide');
		$(this).parent().find('div').find('input').val("").attr('prev-val', "");;
		$(this).parent().find('div').find('select').val("").attr('prev-val', "");;
		$(this).parent().find('div.'+selected).removeClass('hide');
		$(this).parent().find('div.'+selected).find('#RHS :not(input.date)').focus();
	});
	scramble_filter_input_names(cel);
	if(is_company && readData('dynamic_company_filter')) {
		deserializeLhsFilters($('#lhs-contact-filter-form'), readData('dynamic_company_filter'));
	} 
	if(!is_company && readData('dynamic_contact_filter')) {
		deserializeLhsFilters($('#lhs-contact-filter-form'), readData('dynamic_contact_filter'));
	}
}

function submitLhsFilter() {
	var formData = serializeLhsFilters($('#lhs-contact-filter-form'))
	// erase filter cookies
	eraseCookie('contact_filter');
	eraseCookie('contact_filter_type');
	//eraseCookie('company_filter');
	var contact_type = formData.contact_type;
	if(contact_type == 'COMPANY') {
		eraseData('dynamic_compnay_filter');
		storeData('dynamic_company_filter', JSON.stringify(formData));
	} else {
		eraseData('dynamic_contact_filter');
		storeData('dynamic_contact_filter', JSON.stringify(formData));
	}
	
	CONTACTS_HARD_RELOAD=true;
	App_Contacts.contacts(undefined, undefined, undefined, true);
}

$('a.filter-tags-multiple-add-lhs').die().live("click", function(e) {
	e.preventDefault();
	var htmlContent = $($('#tags-lhs-filter-table').find("tr")[0]).clone();
	htmlContent.find('div').removeClass('hide').addClass("lhs-contact-filter-row");
	addTagsDefaultTypeahead(htmlContent);
	scramble_filter_input_names(htmlContent);
	$(htmlContent).find("i.filter-tags-multiple-remove-lhs").css("display", "inline-block");
	$(this).siblings("table").find("tbody").append(htmlContent);
});

// Filter Contacts- Remove Multiple
	$("i.filter-tags-multiple-remove-lhs").die().live('click', function(e)
	{
		$(this).closest("tr").remove();
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

$('#RHS input').die().live("blur keyup", function(e) {
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
			}
		} else {
			submitLhsFilter();
		}
	}
});

$('#RHS select').die().live("change", function(e) {
	submitLhsFilter();
});

$('#RHS_NEW input').die().live("blur keyup", function(e) {
	if (e.type == 'focusout' || e.keyCode == '13')  {
		var prevVal = $(this).attr('prev-val');
		var currVal = $(this).val().trim();
		if(prevVal == currVal) {
			return;
		} else {
			$(this).attr('prev-val', currVal);
		}
		if($(this).parent().prev().attr("id") == "RHS") {
			if(currVal != "" && $(this).parent().prev().find('input').val() != "") {
				submitLhsFilter();
			}
		} else {
			if(currVal != "") {
				submitLhsFilter();
			}
		}
	}
});