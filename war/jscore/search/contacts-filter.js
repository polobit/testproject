/**
 * contact-filter.js defines functionalities to show filter in dropdown, events
 * on selecting filter, call to set cookie when filter is selected. Shows name
 * of the selected filter on dropdown button client side. This also defines
 * clone function, used while adding multiple filter conditions
 * 
 * @module Search author: Yaswanth
 */
var filter_name;

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

$(function()
{
	CUSTOM_FIELDS = undefined;
	
	// Filter Contacts- Clone Multiple
	$(".filter-contacts-multiple-add").die().live('click', function(e)
	{
		e.preventDefault();
		// To solve chaining issue when cloned
		var htmlContent = $(getTemplate("filter-contacts", {})).find('tr').clone();
		
		scramble_input_names($(htmlContent));

		chainFilters(htmlContent);

//		$(this).hide();
		// var htmlContent = $(this).closest("tr").clone();
		$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
		$(this).siblings("table").find("tbody").append(htmlContent);
	});
	
	
	

	// Filter Contacts- Remove Multiple
	$("i.filter-contacts-multiple-remove").die().live('click', function(e)
	{
		$(this).closest("tr").remove();
	});

	// Fetch filter result without changing route on click
	$('.filter').live('click', function(e)
	{

		e.preventDefault();
		eraseCookie('company_filter');

		var filter_id = $(this).attr('id');

		// Saves Filter in cookie
		createCookie('contact_filter', filter_id)

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
	$('.default_filter').live('click', function(e)
	{
		e.preventDefault();
		revertToDefaultContacts();
	});

	$('.default_contact_remove_tag').die().live('click', function(e)
	{
		e.preventDefault();
		// Navigate to show form
		Backbone.history.navigate("contacts", { trigger : true });
	});

	$('#companies-filter').live('click', function(e)
	{

		e.preventDefault();
		eraseCookie('contact_filter');

		createCookie('company_filter', "Companies");
		CONTACTS_HARD_RELOAD = true;
		App_Contacts.contacts(); // /Show Companies list, explicitly hard
		// reload
		return;
		/*
		 * {{ OLD-CODE below }} if(readCookie('contact_view')) {
		 * App_Contacts.contact_custom_view.collection.url =
		 * "core/api/contacts/companies"
		 * App_Contacts.contact_custom_view.collection.fetch();
		 * //$('.filter-dropdown',
		 * App_Contacts.contact_custom_view.el).append(filter_name); } /* If
		 * contactsListView is defined (default view) then load filter results
		 * in default view
		 * 
		 * if(App_Contacts.contactsListView &&
		 * App_Contacts.contactsListView.collection) { // Set url to default
		 * view to load filter results
		 * App_Contacts.contactsListView.collection.url =
		 * "core/api/contacts/companies";
		 * App_Contacts.contactsListView.collection.fetch();
		 * //$('.filter-dropdown',
		 * App_Contacts.contactsListView.el).append(filter_name); }
		 */
	});

	$('.lhs_chanined_parent').die().live('change', function(e)
	{
		e.preventDefault();

		if (($(this).val()).indexOf('tags') != -1)
		{
			var element = $(this).closest('tr').find('div#RHS');
			addTagsDefaultTypeahead(element);
		}
	});
	
	$("#condition > select").die().live('change', function(e){
		e.preventDefault();

		if ($(this).find("option:selected").hasClass('tags'))
		{
			var element = $(this).parents().closest('tr').find('div#RHS');
			addTagsDefaultTypeahead(element);
		}
		
	})
	
	
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
						'<ul id="added-tags-ul" class="tagsinput" style="display: inline; vertical-align: top; margin-bottom: 10px"><li style="display: inline-block;" class="tag" data="developer"><span style="margin-left:5px">' + tag_id + '<a class="close default_contact_remove_tag" style="margin-left:5px">&times</a></span></li></ul>')

	contactFiltersListView = new Base_Collection_View(
			{
				url : '/core/api/filters',
				restKey : "ContactFilter",
				templateKey : "contact-filter-list",
				individual_tag_name : 'li',
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
							filter_name = contactFiltersListView.collection.get(filter_name).toJSON().name;

						el.find('.filter-dropdown').append(filter_name);
					}
					else if (filter_name = readCookie('company_filter'))
						el.find('.filter-dropdown').append(filter_name);

					if (!filter_name)
						return;

					$('.filter-criteria', cel)
							.html(
									'<ul id="added-tags-ul" class="tagsinput" style="display: inline; vertical-align: top; margin-bottom: 10px"><li style="display: inline-block;" class="tag" data="developer"><span style="margin-left:5px">' + filter_name + '<a class="close default_filter" style="margin-left:5px;">&times</a></span></li></ul>')
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
	eraseCookie('company_filter');

	if (App_Contacts.contactsListView)
		App_Contacts.contactsListView = undefined;
	if (App_Contacts.contact_custom_view)
		App_Contacts.contact_custom_view = undefined;

	// Loads contacts
	App_Contacts.contacts();
}

/**
 * Chains fields using jquery.chained library. It deserialzed data into form
 * 
 * @param el
 */
function chainFilters(el, data, callback)
{
	if(!CUSTOM_FIELDS)
	{
		$("#content").html(LOADING_HTML);
		fillCustomFieldsInFilters(el, function(){
			show_chained_fields(el, data, true);
			if (callback && typeof (callback) === "function")
			{
				// execute the callback, passing parameters as necessary
				callback();
			}
		})
		return;
	}
	
	fillCustomFields(CUSTOM_FIELDS, el)
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
	
	// Chaining dependencies of input fields with jquery.chained.js
	RHS.chained(condition, function(chained_el, self){
		var selected_field = $(chained_el).find('option:selected');
		var placeholder = $(selected_field).attr("placeholder");
		var is_custom_field = $(selected_field).hasClass("custom_field");
		
		var field_type = $(selected_field).attr("field_type");
		if(placeholder)
		{
			$("input", self).attr("placeholder", placeholder);
		}
		if(field_type && field_type == 'LIST')
		{
			$("input", self).remove();
			$("select", self).show();
		}
	});
	condition.chained(LHS);
	
	RHS_NEW.chained(condition);
	NESTED_CONDITION.chained(LHS);
	NESTED_LHS.chained(NESTED_CONDITION);
	NESTED_RHS.chained(NESTED_CONDITION);



	if(data && data.rules)
		deserializeChainedSelect($(el).find('form'), data.rules, el_self.find('form'));
	
	// If LHS selected is tags then typeahead is enabled on rhs field
	if ($(':selected', LHS).val() && ($(':selected', LHS).val()).indexOf('tags') != -1)
	{
		addTagsDefaultTypeahead(RHS)
	}

	// If there is a change in lhs field, and it has tags in it then tags are
	// loaded into its respective RHS block
	$('.lhs', el).die().live('change', function(e)
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


function fillCustomFieldsInFilters(el, callback)
{

	$.getJSON("core/api/custom-fields/searchable/scope?scope=CONTACT", function(fields){
		
		fillCustomFields(fields, el, callback)
	})
}

function fillCustomFields(fields, el, callback)
{
	
	var lhs_element = $("#LHS > select > #custom-fields", el);
	var rhs_element = $("#RHS", el);
	var condition = $("#condition > select", el);
	for(var i = 0; i < fields.length ; i++)
	{
		if(i == 0)
			lhs_element.show();
		
		var field = fields[i];
		
		
		if(field.field_type == "DATE")
		{
			lhs_element.append('<option value="'+field.field_label+'_time" field_type="'+field.field_type+'">'+field.field_label+'</option>');
			condition.find("option.created_time").addClass(field.field_label+'_time');
		}
		else
			lhs_element.append('<option value="'+field.field_label+' custom_field" field_type="'+field.field_type+'" >'+field.field_label+'</option>');
		condition.append('<option value="EQUALS" class="'+field.field_label+' custom_field" field_type="'+field.field_type+'">is</option>');
		condition.append('<option value="NOTEQUALS" class="'+field.field_label+' custom_field" field_type="'+field.field_type+'">isn\'t</option>');
		condition.append('<option value="MATCHES" class="'+field.field_label+' custom_field" field_type="'+field.field_type+'">contains</option>');
		condition.append('<option value="NOT_CONTAINS" class="'+field.field_label+' custom_field" field_type="'+field.field_type+'">doesn\'t contain</option>');
			
		if(field.field_type == "LIST")
		{
			var custom_list_values = field.field_data.split(";");
			el = "<select style='display:none' name='"+field.field_label+"'>"
			for(var i = 0; i < custom_list_values.length; i++)
			{
				
				el = el + '<option value="'+custom_list_values[i]+'" class="EQUALS NOTEQUALS MATCHES NOT_CONTAINS" field_type="'+field.field_type+'">'+custom_list_values[i]+'</option>';
			}
			el = el +"</select>";
			rhs_element.append(el);
		}
		if(field.field_data)
			rhs_element.append('<option value="'+field.field_label+'">'+field.field_label+'</option>');
	}
	
	if (callback && typeof (callback) === "function")
	{
		// execute the callback, passing parameters as necessary
		callback();
	}
}