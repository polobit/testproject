/**
 * contact-filter.js defines functionalities to show filter in dropdown, events
 * on selecting filter, call to set cookie when filter is selected. Shows name
 * of the selected filter on dropdown button client side. This also defines
 * clone function, used while adding multiple filter conditions
 * 
 * @module Search author: Yaswanth
 */
var filter_name;
var CONTACTS_DYNAMIC_FILTER_COOKIE_STATUS = "toggle_dynamic_filter_" + CURRENT_DOMAIN_USER.id;

/**
 * Change name of input[name='temp'] to more random i.e. temp-<unique_number>.
 * This is necessary for showing correct validation errors when multiple entries with same field-name are on the page.
 * @param el
 */
var scrambled_index=0;
function scramble_input_names(el)
{
	el.find("input").each(function(){
		$(this).attr('name','temp-'+scrambled_index);
		$(this).addClass('required');
		scrambled_index+=1;
	});
}
SEARCHABLE_CONTACT_CUSTOM_FIELDS = undefined;
COMPANY_CUSTOM_FIELDS = undefined;
function initializeContactFiltersListeners()
{
}
$(function(){

	// Filter Contacts- Clone Multiple
	$('body').on('click', '.filter-contacts-multiple-add', function(e)
	{
		e.preventDefault();
		var that = this;
		// To solve chaining issue when cloned

		getTemplate("filter-contacts", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			
			var htmlContent = $($(template_ui).find('.chained-table.contact')[0]).find('tr').clone();
			$(htmlContent).removeClass('hide');
			scramble_input_names($(htmlContent));

			// boolean parameter to avoid contacts/not-contacts fields in form
			chainFilters(htmlContent, function(){
			}, false);

	//		$(this).hide();
			// var htmlContent = $(this).closest("tr").clone();
			$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
			//hide camapign status
			//$(htmlContent).find('#LHS select').find("optgroup[label='Activities']").remove();
			$(that).prev('table').find("tbody").append(htmlContent);

		}, null);
	});
	
	// Filter Contacts- Clone Multiple
	$('body').on('click', '.filter-contacts-multiple-add-or-rules', function(e)
	{
		e.preventDefault();
		var that = this;
		// To solve chaining issue when cloned
		getTemplate("filter-contacts", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;

			var htmlContent = $($(template_ui).find('.chained-table.contact')[1]).find('tr').clone();
			$(htmlContent).removeClass('hide');
			scramble_input_names($(htmlContent));

			// boolean parameter to avoid contacts/not-contacts fields in form
			chainFilters(htmlContent, function(){
			}, false);

	//		$(this).hide();
			// var htmlContent = $(this).closest("tr").clone();
			$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
			//hide camapign status
			//$(htmlContent).find('#LHS select').find("optgroup[label='Activities']").remove()
			$(that).prev('table').find("tbody").append(htmlContent);

		}, null);
		
	});
	
	// Filter Contacts- Clone Multiple
	$('body').on('click', '.filter-companies-multiple-add', function(e)
	{
		e.preventDefault();
		// To solve chaining issue when cloned
		var that = this;
		getTemplate("filter-contacts", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;

			var htmlContent = $($(template_ui).find('.chained-table.company')[0]).find('tr').clone();
			$(htmlContent).removeClass('hide');
			scramble_input_names($(htmlContent));

			// boolean parameter to avoid contacts/not-contacts fields in form
			chainFilters(htmlContent,undefined, function(){
			}, false, true);

	//		$(this).hide();
			// var htmlContent = $(this).closest("tr").clone();
			$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
			$(that).prev("table").find("tbody").append(htmlContent);

		}, null);
		
	});
	
	// Filter Contacts- Clone Multiple
	$('body').on('click', '.filter-companies-multiple-add-or-rules', function(e)
	{
		e.preventDefault();
		var that = this;
		// To solve chaining issue when cloned
		getTemplate("filter-contacts", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;

			var htmlContent = $($(template_ui).find('.chained-table.company')[1]).find('tr').clone();
			$(htmlContent).removeClass('hide');
			scramble_input_names($(htmlContent));

			// boolean parameter to avoid contacts/not-contacts fields in form
			chainFilters(htmlContent,undefined, function(){
			}, false, true);

	//		$(this).hide();
			// var htmlContent = $(this).closest("tr").clone();
			$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
			$(that).prev("table").find("tbody").append(htmlContent);

		}, null);

		
	});

	// Filter Contacts- Remove Multiple
	$('body').on('click', 'i.filter-contacts-multiple-remove', function(e)
	{
		$(this).closest("tr").remove();
	});

	// Fetch filter result without changing route on click
	$('body').on('click', '.filter', function(e)
	{

		e.preventDefault();
		eraseData('dynamic_contact_filter');

		var filter_id = $(this).attr('id');
		var filter_type = $(this).attr('filter_type');

		// Saves Filter in cookie
		createCookie('contact_filter', filter_id)
		createCookie('contact_filter_type', filter_type)

		// Gets name of the filter, which is set as data
		// attribute in filter
		filter_name = $(this).attr('data');

		CONTACTS_HARD_RELOAD=true;
		App_Contacts.contacts();
		return;
		// /removed old code from below,
		// now filters will work only on contact, not company
	});
	/*
	 * If default filter is selected, removes filter cookies an load contacts
	 * with out any query condition
	 */
	$('body').on('click', '.default_filter', function(e)
	{
		e.preventDefault();
		revertToDefaultContacts();
	});

	$('body').on('click', '.default_contact_remove_tag', function(e)
	{
		e.preventDefault();
		// Navigate to show form
		Backbone.history.navigate("contacts", { trigger : true });
	});

	$('body').on('click', '#companies-filter', function(e)
	{

		e.preventDefault();
		eraseCookie('contact_filter');
		eraseCookie('contact_filter_type');

		createCookie('company_filter', "Companies");
		CONTACTS_HARD_RELOAD = true;
		App_Contacts.contacts(); // /Show Companies list, explicitly hard
		// reload
		return;
		
	});

	$('body').on('change', '.lhs_chanined_parent', function(e)
	{
		e.preventDefault();

		if (($(this).val()).indexOf('tags') != -1)
		{
			var element = $(this).closest('tr').find('div#RHS');
			addTagsDefaultTypeahead(element);
		}
	});
	
	$('body').on('change', '#condition > select', function(e){
		e.preventDefault();

		if ($(this).find("option:selected").hasClass('tags'))
		{
			var element = $(this).parents().closest('tr').find('div#RHS');
			addTagsDefaultTypeahead(element);
		}
		
	})
	
	$('body').on('change', '#contact_type', function(e)
	{
		if($(this).val() == 'COMPANY') {
			$('#companies-filter-wrapper').show();
			$('#contacts-filter-wrapper').hide();
		} else {
			$('#companies-filter-wrapper').hide();
			$('#contacts-filter-wrapper').show();
		}
	});
	
});

/**
 * Sets up contact filters list in contacts list page, also whether cookie is
 * save with filter name to load filter results instead of all contacts
 * 
 * @method setupContactFilterList
 * @param cel
 *            Html form element to append filters list,
 */
var contactFiltersListView
function setupContactFilterList(cel, tag_id)
{
	if (tag_id)
		$('.filter-criteria', cel)
				.html(
						'<ul id="added-tags-ul" class="tagsinput p-n m-b-sm m-t-sm m-l-sm"><li  class="inline-block tag btn btn-xs btn-primary" data="developer"><span class="m-l-xs pull-left">' + decodeURI(tag_id) + '</span><a class="close default_contact_remove_tag m-l-xs pull-left">&times</a></li></ul>').attr("_filter", tag_id);
						

	var filter_id = null;
		contactFiltersListView = new Base_Collection_View(
			{
				url : '/core/api/filters?type=PERSON',
				sort_collection : false,
				restKey : "ContactFilter",
				templateKey : "contact-filter-list",
				individual_tag_name : 'li',
				sort_collection : false,
				postRenderCallback : function(el)
				{
					var filter_name;
					// Set saved filter name on dropdown button
					if (filter_name = readCookie('contact_filter'))
					{
						/*
						 * Check whether filter contains recent of lead to set
						 * system filter names, to load results based on those
						 * filters
						 */
						if (filter_name.toLowerCase().indexOf('recent') >= 0)
							filter_name = "Recent";

						else if (filter_name.toLowerCase().indexOf('contacts') >= 0)
							filter_name = "My Contacts";

						else if (filter_name.toLowerCase().indexOf('leads') >= 0)
							filter_name = "Leads";

						// If is not system type get the name of the filter from
						// id(from cookie)
						else if (filter_name.indexOf("system") < 0)
						{
							filter_id = filter_name;
							if(contactFiltersListView.collection.get(filter_name))
									filter_name = contactFiltersListView.collection.get(filter_name).toJSON().name;
							
						}

						el.find('.filter-dropdown').append(filter_name);
					}

					if (!filter_name)
						return;

					
					$('.filter-criteria', cel)
					.html(
							'<ul id="added-tags-ul" class="tagsinput p-n m-b-sm m-t-sm m-l-sm"><li class="inline-block tag btn btn-xs btn-primary" data="developer"><span class="inline-block m-r-xs v-middle">' + filter_name + '</span><a class="close default_filter">&times</a></li></ul>');
					
					if(filter_id)
						$('.filter-criteria', cel).attr("_filter", filter_id);
					else
						$('.filter-criteria', cel).attr("_filter", filter_name);
						
				} });

			// Fetchs filters
			contactFiltersListView.collection.fetch();
		
			var filter_dropdown_element = contactFiltersListView.render().el;
		
			// Shows in contacts list
			$('#filter-list', cel).html(contactFiltersListView.render().el);
}

/**
 * Removes filter from cookie and calls function to load default contacts
 * without filter
 */
function revertToDefaultContacts()
{
	// Erase filter cookie. Erases both contact and company filter
	eraseCookie('contact_filter');
	eraseCookie('contact_filter_type');
	eraseCookie('company_filter');
	eraseData('dynamic_filter');

	if (App_Contacts.contactsListView)
		App_Contacts.contactsListView = undefined;
	if (App_Contacts.contact_custom_view)
		App_Contacts.contact_custom_view = undefined;

	// Loads contacts
	App_Contacts.contacts();
}

function chainFiltersForContactAndCompany(el, data, callback) {
	if(data && data.contact_type) {
		if(data.contact_type == 'PERSON') {
			chainFilters($(el).find('.chained-table.contact.and_rules'), data.rules, undefined, false, false);
			chainFilters($(el).find('.chained-table.contact.or_rules'), data.or_rules, undefined, false, false);
			chainFilters($(el).find('.chained-table.company.and_rules'), undefined, undefined, false, true);
			chainFilters($(el).find('.chained-table.company.or_rules'), undefined, callback, false, true);
		} else if(data.contact_type == 'COMPANY') {
			chainFilters($(el).find('.chained-table.company.and_rules'), data.rules, undefined, false, true);
			chainFilters($(el).find('.chained-table.company.or_rules'), data.or_rules, undefined, false, true);
			chainFilters($(el).find('.chained-table.contact.and_rules'), undefined, undefined, false, false);
			chainFilters($(el).find('.chained-table.contact.or_rules'), undefined, callback, false, false);
		}
	} else {
		chainFilters($(el).find('.chained-table.contact.and_rules'), undefined, undefined, false, false);
		chainFilters($(el).find('.chained-table.contact.or_rules'), undefined, undefined, false, false);
		chainFilters($(el).find('.chained-table.company.and_rules'), undefined, undefined, false, true);
		chainFilters($(el).find('.chained-table.company.or_rules'), undefined, callback, false, true);
	}
}

function chainFiltersForContact(el, data, callback) {
	if(data) {
		chainFilters($(el).find('.chained-table.contact.and_rules'), data.rules, undefined, false, false);
		chainFilters($(el).find('.chained-table.contact.or_rules'), data.or_rules, callback, false, false);			
	} else {
		chainFilters($(el).find('.chained-table.contact.and_rules'), undefined, undefined, false, false);
		chainFilters($(el).find('.chained-table.contact.or_rules'), undefined, callback, false, false);
	}
}

/**
 * Chains fields using jquery.chained library. It deserialzed data into form
 * 
 * @param el
 */
function chainFilters(el, data, callback, is_webrules, is_company)
{
	if(is_company) {
		fillCompanyCustomFieldsInFilters(el, function(){
			show_chained_fields(el, data, true);
			if (callback && typeof (callback) === "function")
			{
				// execute the callback, passing parameters as necessary
				callback();
			}
		});
		return;
	} else {
		if(!SEARCHABLE_CONTACT_CUSTOM_FIELDS)
		{			
			/*if(window.location.hash.indexOf("contact-filter") != -1)
			   $("#content").html(getRandomLoadingImg());*/
			fillContactCustomFieldsInFilters(el, function(){
				show_chained_fields(el, data, true);
				if (callback && typeof (callback) === "function")
				{
					// execute the callback, passing parameters as necessary
					callback();
				}
			}, is_webrules)
			return;
		}
		
		fillCustomFields(SEARCHABLE_CONTACT_CUSTOM_FIELDS, el, undefined, false)
	}
	
	
	show_chained_fields(el, data);
	if (callback && typeof (callback) === "function")
	{
		// execute the callback, passing parameters as necessary
		callback();
	}
	
}

function show_chained_fields(el, data, forceShow)
{
	var el_self = $(el).clone();
	var LHS, condition, RHS, RHS_NEW, NESTED_CONDITION, NESTED_RHS, NESTED_LHS;

	// LHS, RHS, condition blocks are read from DOM
	LHS = $("#LHS", el);
	condition = $("#condition", el);
	RHS = $("#RHS", el);

	// Extra field required for (Between values condition)
	RHS_NEW = $("#RHS-NEW", el);

	NESTED_CONDITION = $("#nested_condition", el);
	NESTED_RHS = $("#nested_rhs", el);
	NESTED_LHS = $("#nested_lhs", el);
	
	RHS.chained(condition, function(chained_el, self){
		var selected_field = $(chained_el).find('option:selected');
		var placeholder = $(selected_field).attr("placeholder");
		var is_custom_field = $(selected_field).hasClass("custom_field");
		
		var field_type = $(selected_field).attr("field_type");
		
		// If there are any select fields without option elements they should be removed
		$("select", self).each(function(index, value){
			if($("option", value).length == 0)
				$(this).remove();
		})
		
		
		if(placeholder)
		{
			$("input", self).attr("placeholder", placeholder);
		}
		if(field_type && field_type == 'LIST')
		{
			var field_name = $(selected_field).attr("field_name");
			
			$("input", self).remove();
			$($('select[name="'+field_name+'"]', self)[0]).show();
			$('select:not([name="'+field_name+'"])', self).remove();
		}
		
		
	});
	condition.chained(LHS);
	
	RHS_NEW.chained(condition);
	NESTED_CONDITION.chained(LHS);
	NESTED_LHS.chained(NESTED_CONDITION);
	NESTED_RHS.chained(NESTED_CONDITION);

	if(data && data.rules) {
		deserializeChainedSelect(el, data.rules, el_self);
	} else if(data) {
		deserializeChainedSelect(el, data, el_self);
	}
		
	
	// If LHS selected is tags then typeahead is enabled on rhs field
	if ($(':selected', LHS).val() && ($(':selected', LHS).val()).indexOf('tags') != -1)
	{
		addTagsDefaultTypeahead(RHS)
	}

	// If there is a change in lhs field, and it has tags in it then tags are
	// loaded into its respective RHS block
	$('.lhs', el).on('change', function(e)
	{
		e.preventDefault();
		var value = $(this).val();

		if (value.indexOf('tags') != -1)
		{
			addTagsDefaultTypeahead($(this).closest('td').siblings('td.rhs-block'));
		}

	})
}

/**
 * Added tags typeahead on fields
 * 
 * @param element
 */
function addTagsDefaultTypeahead(element)
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
			addTagsArrayasTypeaheadSource(tagsCollection.toJSON(), element);

		} });
		return;
	}
	

	// Adds typeahead to given element
	addTagsArrayasTypeaheadSource(tagsCollection.toJSON(), element);
}

// With tags JSON sent type ahead is built on input fields
function addTagsArrayasTypeaheadSource(tagsJSON, element)
{
	var tags_array = [];

	$.each(tagsJSON, function(index, element)
	{
		tags_array.push(element.tag.toString());
	});

	// $("input", element).attr("data-provide","typeahead");
	$("input", element).typeahead({ "source" : tags_array }).attr('placeholder', "Enter Tag").width("92%");
}


function fillContactCustomFieldsInFilters(el, callback, is_webrules)
{

	$.getJSON("core/api/custom-fields/searchable/scope?scope=CONTACT", function(fields){
		console.log(fields);
		SEARCHABLE_CONTACT_CUSTOM_FIELDS = fields;
		fillCustomFields(fields, el, callback, is_webrules)
	})
}

function fillCompanyCustomFieldsInFilters(el, callback)
{
	if(!COMPANY_CUSTOM_FIELDS)
	{
		$.getJSON("core/api/custom-fields/searchable/scope?scope=COMPANY", function(fields){
			console.log(fields);
			COMPANY_CUSTOM_FIELDS = fields;
			fillCustomFields(fields, el, callback, false);
		});
	} else {
		fillCustomFields(COMPANY_CUSTOM_FIELDS, el, callback, false)
	}
}

var _AGILE_CUSTOM_DIVIDER_ = ' _AGILE_CUSTOM_DIVIDER_';
var custom_chained_filter = "custom_chained_class";
function fillCustomFields(fields, el, callback, is_webrules)
{
	var lhs_element = $("#LHS > select > #custom-fields", el);
	var rhs_element = $("#RHS", el);
	var condition = $("#condition > select", el);

	var _AGILE_CUSTOM_DIVIDER_ = ' _AGILE_CUSTOM_DIVIDER_';
	for(var i = 0; i < fields.length ; i++)
	{
		if(i == 0)
			lhs_element.removeClass('hide');
		var field = fields[i];

		condition.append('<option value="EQUALS" custom_chained_class= "'+field.field_label+ " " + _AGILE_CUSTOM_DIVIDER_ +'  custom_field" class="'+field.field_label + _AGILE_CUSTOM_DIVIDER_ + ' custom_field" field_type="'+field.field_type+'" field_name="'+field.field_label+'">is</option>');
		condition.append('<option value="NOTEQUALS" custom_chained_class= "'+field.field_label+ " " +_AGILE_CUSTOM_DIVIDER_+'  custom_field" class="'+field.field_label + _AGILE_CUSTOM_DIVIDER_ + ' custom_field" field_type="'+field.field_type+'" field_name="'+field.field_label+'">isn\'t</option>');

		if(field.field_type == "DATE")
		{
			lhs_element.append('<option value="'+field.field_label+'_time" field_type="'+field.field_type+'">'+field.field_label+'</option>');
			//condition.find("option.created_time").addClass(field.field_label+'_time');
			var element = condition.find("option.created_time"); 
			add_custom_class_to_filter_elements(element, field.field_label+'_time');
			$(element).addClass(field.field_label+'_time' + _AGILE_CUSTOM_DIVIDER_);
			if(!is_webrules)
			{
				condition.append('<option value="DEFINED" custom_chained_class= "'+field.field_label+'_time'+ " " + _AGILE_CUSTOM_DIVIDER_ +'  custom_field" class="'+field.field_label +'_time '+ _AGILE_CUSTOM_DIVIDER_ + ' custom_field" field_type="'+field.field_type+'" field_name="'+field.field_label+'">is defined</option>');
				condition.append('<option value="NOT_DEFINED" custom_chained_class= "'+field.field_label+'_time'+ " " +_AGILE_CUSTOM_DIVIDER_+'  custom_field" class="'+field.field_label +'_time																																				 '+ _AGILE_CUSTOM_DIVIDER_ + ' custom_field" field_type="'+field.field_type+'" field_name="'+field.field_label+'">is not defined</option>');
			}
		} else if(field.field_type == "NUMBER")
		{
			lhs_element.append('<option value="'+field.field_label+'_number" field_type="'+field.field_type+'">'+field.field_label+'</option>');
			// condition.find("option.lead_score").addClass(field.field_label+'_number');
			var element = condition.find("option.lead_score");
			add_custom_class_to_filter_elements(element, field.field_label+'_number');
			$(element).addClass(field.field_label+'_number' + _AGILE_CUSTOM_DIVIDER_);
			if(!is_webrules)
			{
				condition.append('<option value="DEFINED" custom_chained_class= "'+field.field_label+'_number'+ " " + _AGILE_CUSTOM_DIVIDER_ +'  custom_field" class="'+field.field_label +'_number '+ _AGILE_CUSTOM_DIVIDER_ + ' custom_field" field_type="'+field.field_type+'" field_name="'+field.field_label+'">is defined</option>');
				condition.append('<option value="NOT_DEFINED" custom_chained_class= "'+field.field_label+'_number'+ " " +_AGILE_CUSTOM_DIVIDER_+'  custom_field" class="'+field.field_label +'_number '+ _AGILE_CUSTOM_DIVIDER_ + ' custom_field" field_type="'+field.field_type+'" field_name="'+field.field_label+'">is not defined</option>');
			}
		
		}
		else
		{
			lhs_element.append('<option value="'+field.field_label+'" field_type="'+field.field_type+'" >'+field.field_label+'</option>');
			if(!is_webrules)
			{
				condition.append('<option value="DEFINED" custom_chained_class= "'+field.field_label+ " " + _AGILE_CUSTOM_DIVIDER_ +'  custom_field" class="'+field.field_label + _AGILE_CUSTOM_DIVIDER_ + ' custom_field" field_type="'+field.field_type+'" field_name="'+field.field_label+'">is defined</option>');
				condition.append('<option value="NOT_DEFINED" custom_chained_class= "'+field.field_label+ " " +_AGILE_CUSTOM_DIVIDER_+'  custom_field" class="'+field.field_label + _AGILE_CUSTOM_DIVIDER_ + ' custom_field" field_type="'+field.field_type+'" field_name="'+field.field_label+'">is not defined</option>');
			}
		
		}
		
		// Contacts and not contains should only be in webrules form
		if(is_webrules)
		{
			condition.append('<option value="MATCHES" custom_chained_class= "'+field.field_label+ " " + _AGILE_CUSTOM_DIVIDER_+'  custom_field" class="'+field.field_label +' custom_field" field_name="'+field.field_label+'">contains</option>');
			condition.append('<option value="NOT_CONTAINS"  custom_chained_class= "'+field.field_label+ " " +_AGILE_CUSTOM_DIVIDER_+'  custom_field" class="'+field.field_label+' custom_field" field_name="'+field.field_label+'">doesn\'t contain</option>');
		}
		
		if(field.field_type == "LIST")
		{
			var custom_list_values = field.field_data.split(";");
			el = "<select class='form-control' style='display:none' name='"+field.field_label+"'>"
			for(var j = 0; j < custom_list_values.length; j++)
			{
				
				el = el + '<option value="'+custom_list_values[j]+'" class="EQUALS NOTEQUALS MATCHES NOT_CONTAINS" field_type="'+field.field_type+'">'+custom_list_values[j]+'</option>';
			}
			el = el +"</select>";
			rhs_element.append(el);
		}
		console.log(rhs_element[0]);
	}
	
	if (callback && typeof (callback) === "function")
	{
		// execute the callback, passing parameters as necessary
		callback();
	}
}

function add_custom_class_to_filter_elements(element, className)
{
	var custom_class = $(element).attr(custom_chained_filter);
	 var attrClass = $(element).attr('class');
	if(!custom_class)
		custom_class = "";
	else
		{
		 var classArray = attrClass.split(" ");
	     if(classArray && classArray.length > 0)
	      {
	       for(var i = 0 ; i < classArray.length ; i++)
	        {
	         custom_class += (_AGILE_CUSTOM_DIVIDER_ + " " +classArray[i]); 
	        }
	      }
		}
	
	custom_class += (_AGILE_CUSTOM_DIVIDER_ + " " +className);
	console.log(custom_class)
	
	$(element).attr('custom_chained_class', custom_class);
}

function showDynamicFilters(el){
	if(readCookie(CONTACTS_DYNAMIC_FILTER_COOKIE_STATUS)=="hide"){
		$('#contacts-lhs-filters-toggle').hide();
	}
	else{
		$('#contacts-lhs-filters-toggle').show();
	}
}