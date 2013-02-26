/**
 * contact-filter.js defines functionalities to show filter in dropdown, events
 * on selecting filter, call to set cookie when filter is selected. Shows name
 * of the selected filter on dropdown button client side. This also defines
 * clone function, used while adding multiple filter conditions
 * 
 * @module Search author: Yaswanth
 */
var filter_name;
$(function()
{
	// Filter Contacts- Clone Multiple
	$("i.filter-contacts-multiple-add").die().live(
			'click',
			function(e)
			{

				// To solve chaining issue when cloned
				var htmlContent = $(getTemplate("filter-contacts", {})).find(
						'tr').clone();
						
						chainFilters(htmlContent);
				
				// var htmlContent = $(this).closest("tr").clone();
				$(htmlContent).find("i.filter-contacts-multiple-remove").css(
						"display", "inline-block");
				$(this).parents("tbody").append(htmlContent);
			});

	// Filter Contacts- Remove Multiple
	$("i.filter-contacts-multiple-remove").die().live('click', function(e)
	{
		$(this).closest("tr").remove();
	});

	// Fetch filter result without changing route on click
	$('.filter')
			.live(
					'click',
					function(e)
					{
						e.preventDefault();
						var filter_id = $(this).attr('id');

						// Saves Filter in cookie
						createCookie('contact_filter', filter_id)

						// Gets name of the filter, which is set as data
						// attribute in filter
						filter_name = $(this).attr('data');

						/*
						 * Reads the custom view cookie, if cookie is available
						 * then load filter results in custom view
						 */
						if (readCookie("contact_view"))
						{
							// Set url to custom view to load filter results
							App_Contacts.contact_custom_view.collection.url = "core/api/filters/query/"
									+ filter_id;
							App_Contacts.contact_custom_view.collection.fetch();
							return;
						}

						/*
						 * If contactsListView is defined (default view) then
						 * load filter results in default view
						 */
						if (App_Contacts.contactsListView
								&& App_Contacts.contactsListView.collection)
						{
							// Set url to default view to load filter results
							App_Contacts.contactsListView.collection.url = "core/api/filters/query/"
									+ filter_id;
							App_Contacts.contactsListView.collection.fetch();
						}
					});

	/*
	 * If default filter is selected, removes filter cookies an load contacts
	 * with out any query condition
	 */
	$('.default_filter').live('click', function(e)
	{
		e.preventDefault();
		
		// erase filter cookie
		eraseCookie('contact_filter');
		eraseCookie('company_filter');
		
		// Loads contacts
		App_Contacts.contacts();

	})

	$('#companies-filter')
			.live(
					'click',
					function(e)
					{
						e.preventDefault();
						
						
						if(readCookie('contact_view'))
						{
							App_Contacts.contact_custom_view.collection.url = "core/api/contacts/companies"
							App_Contacts.contact_custom_view.collection.fetch();
							
							$('.filter-dropdown', App_Contacts.contact_custom_view.el).append(filter_name);

						}
						/*
						 * If contactsListView is defined (default view) then
						 * load filter results in default view 
						 */
						if(App_Contacts.contactsListView && App_Contacts.contactsListView.collection) 
						{ 
							eraseCookie('contact_filter');
							createCookie('company_filter', "Companies");
							// Set url to default view to load filter results
							App_Contacts.contactsListView.collection.url = "core/api/contacts/companies";
							App_Contacts.contactsListView.collection.fetch();
							console.log(App_Contacts.contactsListView.el);
							$('.filter-dropdown', App_Contacts.contactsListView.el).append(filter_name);
						}
			 }); 
	
	$('.lhs_chanined_parent').die().live('change' , function(e){
		e.preventDefault();
		
		if(($(this).val()).indexOf('tags') != -1)
			{
				var element = $(this).closest('tr').find('div#RHS');
				addTagsDefaultTypeahead(element);
			}
	});
});
						 
/** Sets up contact filters list in contacts
 * list page, also whether cookie is save with filter
 * name to load filter results instead of all contacts
 * @method setupContactFilterList @param cel Html form
 * element to append filters list,
 */
function setupContactFilterList(cel)
{
	var filter_id;
	var contactFiltersListView = new Base_Collection_View({
		url : '/core/api/filters',
		restKey : "ContactFilter",
		templateKey : "contact-filter-list",
		individual_tag_name : 'li',
		postRenderCallback : function(el)
		{
			if(filter_id = readCookie('company_filter'))
				el.find('.filter-dropdown').append(filter_id);
				
			// Set saved filter name on dropdown button
			if (filter_id = readCookie('contact_filter'))
			{
				/*
				 * Check whether filter contains recent of lead to set system
				 * filter names, to load results based on those filters
				 */
				if (filter_id.toLowerCase().indexOf('recent') >= 0)
					var filter_name = "Recent";

				else
					if (filter_id.toLowerCase().indexOf('lead') >= 0)
						var filter_name = "My Lead";

					// If is not system type get the name of the filter from
					// id(from cookie)
					else
						if (filter_id.indexOf("system") < 0)
							var filter_name = contactFiltersListView.collection
									.get(filter_id).toJSON().name;

				el.find('.filter-dropdown').append(filter_name);
			}
		}
	});

	// Fetchs filters
	contactFiltersListView.collection.fetch();

	var filter_dropdown_element = contactFiltersListView.render().el;

	// Shows in contacts list
	$('#filter-list', cel).html(contactFiltersListView.render().el);
}

function chainFilters(el)
{	
	var LHS, condition, RHS, RHS_NEW, NESTED_CONDITION, NESTED_RHS, NESTED_LHS;
		
		LHS = $("#LHS", el);
		condition = $("#condition", el);
		RHS = $("#RHS", el);
		
		// Extra field required for (Between values condition)
		RHS_NEW = $("#RHS-NEW", el);
		
		NESTED_CONDITION = $("#nested_condition", el);
		NESTED_RHS = $("#nested_rhs", el);
		NESTED_LHS = $("#nested_lhs", el);
		// Chaining dependencies of input fields with jquery.chained.js
		RHS.chained(condition);
		condition.chained(LHS);
		
		RHS_NEW.chained(condition);
		NESTED_CONDITION.chained(LHS);
		NESTED_LHS.chained(NESTED_CONDITION);
		NESTED_RHS.chained(NESTED_CONDITION);	  

		if(($(':selected', LHS).val()).indexOf('tags') != -1)
			{
				console.log("adding tags");;
				addTagsDefaultTypeahead(RHS)
			}
}

function addTagsDefaultTypeahead(element)
{
	var tags_array = [];

	if(!TAGS)
		{
		var TagsCollection = Backbone.Collection.extend({
			url: '/core/api/tags',
			sortKey: 'tag'
		});
		
		
		tagsCollection = new TagsCollection();
		
		tagsCollection.fetch({success:function(data){
			TAGS = tagsCollection.models;
			addTagsArrayasTypeaheadSource(tagsCollection.toJSON(), element);
			
		}});
			return;
		}
	
	console.log(tagsCollection.toJSON());
	addTagsArrayasTypeaheadSource(tagsCollection.toJSON(), element);
}

function addTagsArrayasTypeaheadSource(tagsJSON, element)
{
	var tags_array = [];
	
	$.each(tagsJSON, function(index, element){
		tags_array .push(element.tag.toString());
	});

	console.log(tags_array);
	console.log(("input", element));
	$("input", element).attr("test","test");
	//$("input", element).attr("data-provide","typeahead");
	$("input", element).typeahead({"source": tags_array});
	console.log(("input", element).html())
}