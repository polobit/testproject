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
						'tr').clone()

				var LHS = $('#LHS', htmlContent);
				var condition = $('#condition', htmlContent);
				var RHS_NEW = $('#RHS-NEW', htmlContent);
				var RHS = $("#RHS", htmlContent);

				// Chaining dependencies of input fields with jquery.chained.js
				condition.chained(LHS);
				RHS_NEW.chained(condition);
				RHS.chained(LHS);

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
		
		// Loads contacts
		App_Contacts.contacts();

	})

	$('#companies-filter')
			.live(
					'click',
					function(e)
					{
						e.preventDefault();
						
						/*
						 * If contactsListView is defined (default view) then
						 * load filter results in default view 
						 */
						if(App_Contacts.contactsListView && App_Contacts.contactsListView.collection) 
						{ 
							// Set url to default view to load filter results
							App_Contacts.contactsListView.collection.url = "core/api/contacts/companies";
							App_Contacts.contactsListView.collection.fetch(); 
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