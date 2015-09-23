/**
 * This file is used for filters shown in lhs of contacts page.
 */

var scrambled_index = 0;
function scramble_filter_input_names(el)
{
	$(el).find("input[type=text],input[type=number]").each(function()
	{
		$(this).attr('name', 'temp-' + scrambled_index);
		$(this).attr('id', 'temp-' + scrambled_index);
		scrambled_index += 1;
	});
}

function setupLhsFilters(cel, is_company)
{
	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	if (is_company)
	{
		getTemplate("companies-lhs-filters", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;

			$('#lhs_filters_conatiner', cel).html($(template_ui));

			fillSelect('owner_select', '/core/api/users', undefined, function()
			{
				if (!COMPANY_CUSTOM_FIELDS)
				{
					$.getJSON("core/api/custom-fields/searchable/scope?scope=COMPANY", function(fields)
					{
						COMPANY_CUSTOM_FIELDS = fields;
						loadCustomFiledsFilters(fields, cel, is_company);
						return;
					})
				}
				else
				{
					loadCustomFiledsFilters(COMPANY_CUSTOM_FIELDS, cel, is_company);
				}
			
			}, optionsTemplate, false, $('#lhs_filters_conatiner', cel));

		}, $('#lhs_filters_conatiner', cel));

		

	}
	else
	{

		getTemplate("contacts-lhs-filters", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#lhs_filters_conatiner', cel).html($(template_ui));
			fillSelect('owner_select', '/core/api/users', undefined, function()
			{
				fillSelect('campaign_select_master', '/core/api/workflows', undefined, function()
				{
					// loading image is added to hidden select by fillselect
					// remove it manually.
					$('#campaign_select_master').next('.loading').remove();
					$('#campaign_select').html($('#campaign_select_master').html());
					if (!SEARCHABLE_CONTACT_CUSTOM_FIELDS)
					{
						$.getJSON("core/api/custom-fields/searchable/scope?scope=CONTACT", function(fields)
						{
							SEARCHABLE_CONTACT_CUSTOM_FIELDS = fields;
							loadCustomFiledsFilters(fields, cel, is_company);
							return;
						})
					}
					else
					{
						loadCustomFiledsFilters(SEARCHABLE_CONTACT_CUSTOM_FIELDS, cel, is_company);
					}
					$('[data-toggle="tooltip"]').tooltip();
					//showDynamicFilters();
				}, optionsTemplate, false, $('#lhs_filters_conatiner', cel));
			}, optionsTemplate, false, $('#lhs_filters_conatiner', cel));

		}, $('#lhs_filters_conatiner', cel));

		

	}

}

function loadCustomFiledsFilters(fields, cel, is_company)
{
	getTemplate("contacts-lhs-filters-custom", fields, undefined, function(template_ui){
		if(!template_ui)
			  return;
		$('#custom-filter-fields', cel).html($(template_ui));

		// $('#custom-filter-fields', cel).find("input.date").datepicker({ format :
		// 'mm/dd/yyyy'});
		addTagsTypeaheadLhs($('#tags-lhs-filter-table', cel).find("div.lhs-contact-filter-row").find('#RHS'));
		$("input.date", cel).datepicker({ format :CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY, autoclose : true });
		// $('#custom-filter-fields', cel).find("input.date").datepicker({ format :
		// 'mm/dd/yyyy'});

		scramble_filter_input_names(cel);
		if (is_company && readData('dynamic_company_filter'))
		{
			deserializeLhsFilters($('#lhs-contact-filter-form'), readData('dynamic_company_filter'));
		}
		if (!is_company && readData('dynamic_contact_filter'))
		{
			deserializeLhsFilters($('#lhs-contact-filter-form'), readData('dynamic_contact_filter'));
		}

	}, $('#custom-filter-fields', cel));
	
}

function submitLhsFilter()
{
	var formData = serializeLhsFilters($('#lhs-contact-filter-form'))
	// erase filter cookies
	var contact_type = formData.contact_type;
	if(contact_type == 'COMPANY') {
		eraseCookie('company_filter');
		eraseData('dynamic_company_filter');
		if (formData != null && formData.rules.length > 0)
		{
			storeData('dynamic_company_filter', JSON.stringify(formData));
			//createCookie('company_filter', "Companies");
		}
		COMPANIES_HARD_RELOAD=true;
		App_Companies.companies(undefined, undefined, undefined, true);
	} else {
		eraseCookie('contact_filter');
		eraseCookie('contact_filter_type');
		eraseData('dynamic_contact_filter');
		if (formData != null && formData.rules.length > 0)
			storeData('dynamic_contact_filter', JSON.stringify(formData));
		CONTACTS_HARD_RELOAD=true;
		App_Contacts.contacts(undefined, undefined, undefined, true);
	}
}


function contactFiltersListeners(container_id){

if(!container_id)
	  container_id = 'conatcts-listeners-conatainer';

$('#' + container_id).on('click', 'a.filter-multiple-add-lhs', function(e)
{
	e.preventDefault();
	var fieldName = $(this).data('name');
	var htmlContent = $('#' + fieldName + '-lhs-filter-table').find("div.hide.master-" + fieldName + "-add-div").clone();
	htmlContent.removeClass('hide').addClass("lhs-contact-filter-row");
	if (fieldName == 'tags')
	{
		addTagsTypeaheadLhs(htmlContent);
	}
	scramble_filter_input_names(htmlContent);
	$(htmlContent).appendTo('#' + fieldName + '-lhs-filter-table');
	$('#' + fieldName + '-lhs-filter-table').find("div.lhs-contact-filter-row:last").find('#RHS:visible').find(':not(input.date)').focus();
});

// Filter Contacts- Remove Multiple
$('#' + container_id).on('click', 'i.filter-tags-multiple-remove-lhs', function(e)
{
	var container = $(this).parents('.lhs-contact-filter-row');
	$(container).find('#RHS').children().val("").trigger('blur').trigger('change');
	$(this).closest('div.lhs-contact-filter-row').remove();
});

// Filter Contacts- Remove Multiple
$('#' + container_id).on('click', 'a.clear-filter-condition-lhs', function(e)
{
	$(this).addClass('hide');
	var container = $(this).parents('.lhs-row-filter');
	$(container).find('#RHS').children().val("").attr('prev-val', "");
	$(container).find('#RHS_NEW').filter(visibleFilter).children().val("").attr('prev-val', "");
	$(container).find('select[name="CONDITION"]').val($(container).find('select[name="CONDITION"] option:first').val()).attr('prev-val', "");
	$(container).find('select[name="CONDITION"]').trigger('change');
	$(container).find('a#lhs-filters-header').find('i').toggleClass('fa-plus-square-o').toggleClass('fa-minus-square-o');
	$(container).find('a#lhs-filters-header').next().addClass('hide');
	submitLhsFilter();
});

$('#' + container_id).on('click', '#clear-lhs-contact-filters', function(e)
{
	e.preventDefault();
	eraseData('dynamic_contact_filter');
	CONTACTS_HARD_RELOAD = true;
	App_Contacts.contacts();
});

$('#' + container_id).on('click', '#clear-lhs-company-filters', function(e)
{
	e.preventDefault();
	eraseData('dynamic_company_filter');
	COMPANIES_HARD_RELOAD=true;
	App_Companies.companies();
});

$('#' + container_id).on('click', '#lhs-filters-header', function(e)
{
	e.preventDefault();
	$(this).find('i').toggleClass('fa-plus-square-o').toggleClass('fa-minus-square-o');
	$(this).next().toggleClass('hide');
	$(this).next().find('.lhs-contact-filter-row:visible').find('#RHS').filter(visibleFilter).find(':not(input.date)').focus();
});

$('#' + container_id).on('change', '#lhs-contact-filter-form select[name="CONDITION"]', function(e)
{
	var selected = $(this).val();
	$(this).parent().find('div.condition_container').addClass('hide');
	$(this).parent().find('div.condition_container.' + selected).removeClass('hide');
	$(this).parent().find('div.condition_container.' + selected).find('#RHS :not(input.date)').focus();
	var rhs = $(this).parent().find('div.condition_container.' + selected).find('#RHS').children().first().val();
	var rhs_new_exist = false;
	var rhs_new = "";
	if ($(this).parent().find('div.condition_container.' + selected).find('#RHS_NEW') != undefined)
	{
		rhs_new_exist = true;
		rhs_new = $(this).parent().find('div.condition_container.' + selected).find('#RHS_NEW').children().first().val();
	}
	if (rhs != "" && (!rhs_new_exist || rhs_new != ""))
	{
		submitLhsFilter();
	}
});

$('#' + container_id).on('blur keyup', '#lhs-contact-filter-form #RHS input:not(.date)', function(e)
{
	if (e.type == 'focusout' || e.keyCode == '13')
	{
		var prevVal = $(this).attr('prev-val');
		var currVal = $(this).val().trim();
		if (prevVal == currVal)
		{
			return;
		}
		else
		{
			$(this).attr('prev-val', currVal);
		}
		if ($(this).parent().next().attr("id") == "RHS_NEW")
		{
			if ($(this).parent().next().find('input').val() != "" && currVal != "")
			{
				submitLhsFilter();
				$(this).blur();
			}
		}
		else
		{
			if (currVal == "")
			{
				var container = $(this).parents('.lhs-contact-filter-row');
				$(container).find('a.clear-filter-condition-lhs').addClass('hide');
			}
			submitLhsFilter();
			$(this).blur();
		}
	}
});

$('#' + container_id).on('change keyup', '#lhs-contact-filter-form #RHS input.date', function(e)
{
	if (e.type == 'change' || e.keyCode == '13')
	{
		var prevVal = $(this).attr('prev-val');
		var currVal = $(this).val().trim();
		if (prevVal == currVal)
		{
			return;
		}
		else
		{
			$(this).attr('prev-val', currVal);
		}
		if ($(this).parent().next().attr("id") == "RHS_NEW")
		{
			if ($(this).parent().next().find('input').val() != "" && currVal != "")
			{
				submitLhsFilter();
				$(this).blur();
			}
		}
		else
		{
			if (currVal == "")
			{
				var container = $(this).parents('.lhs-contact-filter-row');
				$(container).find('a.clear-filter-condition-lhs').addClass('hide');
			}
			submitLhsFilter();
			$(this).blur();
		}
	}
});

$('#' + container_id).on('change', '#lhs-contact-filter-form #RHS select', function(e)
{
	if ($(this).parent().next().attr("id") == "RHS_NEW")
	{
		if ($(this).val() != "" && $(this).parent().next().children().val() != "")
		{
			submitLhsFilter();
		}
		if ($(this).val() == "" && $(this).parent().next().children().val() == "")
		{
			var container = $(this).parents('.lhs-contact-filter-row');
			$(container).find('a.clear-filter-condition-lhs').addClass('hide');
			submitLhsFilter();
		}
	}
	else
	{
		var prevVal = $(this).attr('prev-val');
		var currVal = $(this).val().trim();
		if (prevVal == currVal)
		{
			return;
		}
		else
		{
			$(this).attr('prev-val', currVal);
		}
		if ($(this).val() == "")
		{
			var container = $(this).parents('.lhs-contact-filter-row');
			$(container).find('a.clear-filter-condition-lhs').addClass('hide');
		}
		submitLhsFilter();
	}
	$(this).blur();
});

$('#' + container_id).on('change', '#lhs-contact-filter-form #RHS_NEW select', function(e)
{
	if ($(this).parent().prev().attr("id") == "RHS")
	{
		if ($(this).val() != "" && $(this).parent().prev().children().val() != "")
		{
			submitLhsFilter();
		}
		if ($(this).val() == "" && $(this).parent().prev().children().val() == "")
		{
			submitLhsFilter();
		}
	}
	else
	{
		submitLhsFilter();
	}
	$(this).blur();
});

$('#' + container_id).on('blur keyup', '#lhs-contact-filter-form #RHS_NEW input:not(.date)', function(e)
{
	if (e.type == 'focusout' || e.keyCode == '13')
	{
		var prevVal = $(this).attr('prev-val');
		var currVal = $(this).val().trim();
		if (prevVal == currVal)
		{
			return;
		}
		else
		{
			$(this).attr('prev-val', currVal);
		}
		if ($(this).parent().prev().attr("id") == "RHS")
		{
			if ($(this).parent().prev().find('input').val() != "")
			{
				submitLhsFilter();
				$(this).blur();
			}
		}
		else
		{
			if (currVal != "")
			{
				submitLhsFilter();
				$(this).blur();
			}
		}
	}
});

$('#' + container_id).on('change keyup', '#lhs-contact-filter-form #RHS_NEW input.date', function(e)
{
	if (e.type == 'change' || e.keyCode == '13')
	{
		var prevVal = $(this).attr('prev-val');
		var currVal = $(this).val().trim();
		if (prevVal == currVal)
		{
			return;
		}
		else
		{
			$(this).attr('prev-val', currVal);
		}
		if ($(this).parent().prev().attr("id") == "RHS")
		{
			if ($(this).parent().prev().find('input').val() != "")
			{
				submitLhsFilter();
				$(this).blur();
			}
		}
		else
		{
			if (currVal != "")
			{
				submitLhsFilter();
				$(this).blur();
			}
		}
	}
});


     $('#' + container_id).on('click', '#contacts-left-filters-toggle', function(e)
		{
			e.preventDefault();

			if ($('#contacts-lhs-filters-toggle').is(':visible'))
			{
				$('#contacts-lhs-filters-toggle').hide();
				createCookie(CONTACTS_DYNAMIC_FILTER_COOKIE_STATUS, "hide");
			}
			else
			{
				$('#contacts-lhs-filters-toggle').show();
				createCookie(CONTACTS_DYNAMIC_FILTER_COOKIE_STATUS, "show");
			}

		});


      $('#' + container_id).on('click', '.contacts-view', function(e)
    		{
				e.preventDefault();

    				var data=$(this).attr("data");
    				if(data=="list"){
    					eraseCookie("agile_contact_view");
    				}
    				else if(data=="grid"){
    					createCookie("agile_contact_view","grid-view");
    					CONTACTS_HARD_RELOAD=true;
    				}
    				App_Contacts.contacts();
    	   });

}
/**
 * Added tags typeahead on fields
 * 
 * @param element
 */
function addTagsTypeaheadLhs(element)
{
	var tags_array = [];

	// 'TAGS' are saved in global variable when they are fetched to show stats
	// in contacts page. If it is undefined, tags are fetched from DB an then
	// type ahead is built
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
	$("input", element).typeahead({ "source" : tags_array, updater : function(item)
	{
		this.$element.val(item);
		this.$element.trigger('blur');
		this.hide();
		return item;
	} }).attr('placeholder', "Enter Tag");
}