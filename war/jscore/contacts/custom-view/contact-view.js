/**
 * contactTableView is customized function (customization of appendedItem

 * function in Base_Collection_View), when custom view is selected, this
 * function is called whenever a new contact is added or contact list is fetched
 * (called on each contact model from Base_collection_View render function) .
 * when a custom view is selected then collection view is initialized with
 * modelData option for view is "custom view" object, since model data is custom
 * view object, it includes fields_set which defines the order of the files
 * (first_name, last_name, job title, organization..etc). This function iterates
 * through fields_set in CustomView object and loads the template according to
 * the field (Template are set for each field with name 'contacts-custom-view-' +
 * field name) and creates a view model template which is appended to collection
 * template.
 * 
 * @param base_model
 */
var CURRENT_VIEW_OBJECT;

function contactTableView(base_model,customDatefields,view) {
	
	// Creates list view for
	var itemView = new Base_List_View({
		model : base_model,
		template : 'contacts-custom-view-model',
		tagName : view.options.individual_tag_name
	});

	// Reads the modelData (customView object)
	var modelData = view.options.modelData;

	// Reads fields_set from modelData
	var fields = modelData['fields_set'];

	// Converts base_model (contact) in to JSON
	var contact = base_model.toJSON();
	var el = itemView.el;
	
				// Clears the template, because all the fields are appended, has to be reset
				// for each contact
				// $('#contacts-custom-view-model-template').empty();
				
				// Iterates through, each field name and appends the field according to
				// order of the fields
				$.each(fields, function(index, field_name) {
					if(field_name.indexOf("CUSTOM_") != -1)
					{
						field_name = field_name.split("CUSTOM_")[1]; 			
						var property = getProperty(contact.properties, field_name);
						if(!property)
						{
							$(el).append(getTemplate('contacts-custom-view-custom', {}));
							return;
						}
						if(isDateCustomField(customDatefields,property)){
							console.log('got true');
							$(el).append(getTemplate('contacts-custom-view-custom-date', property));
						}
						else
							$(el).append(getTemplate('contacts-custom-view-custom', property));
						return;
					}
					
			/*		$('#contacts-custom-view-model-template').append(
							getTemplate('contacts-custom-view-' + field_name, contact));*/
					$(el).append(getTemplate('contacts-custom-view-' + field_name, contact));
				});
				
	// Appends model to model-list template in collection template
	$(('#'+view.options.templateKey+'-model-list'), view.el).append(el);

	// Sets data to tr
	$(('#'+view.options.templateKey+'-model-list'), view.el).find('tr:last').data(
			base_model);

}

// Check whether the given fields list has the property name.
function isDateCustomField(customDatefields,property){
	var count = 0;
	$.each(customDatefields,function(index,field){
		if(field.field_label==property.name)
			count++;
	});
	return count>0;
}

/**
 * Gets the list of custom fields saved by the user, and shown in the Html
 * element with "view-list" in the Html element sent to this method. It fetches
 * the list of custom fields and on rendering the collection unordered list of
 * created and appended in view-list element in contacts page. If custom view
 * selected from the list, this function is called with button name from the
 * customView function, which is set on the list button.
 * 
 * @param cel
 *            html element
 * @param button_name
 *            name of the button (name of the view)
 */
function setupViews(cel, button_name) {

	// Creates a view for custom views
	head.load(CSS_PATH + 'css/bootstrap_submenu.css',  function()
	{
		var el = getTemplate("contact-view-collection");
		$("#view-list", cel).html(el);
		$("#view-list", cel).find('.dropdown-menu').find(".dropdown-submenu").on("click",function(e){
		    e.stopImmediatePropagation();
		});
		// If button_name is defined, then view is selected then the name of
		// the view is show in the custom view button.
		if (button_name)
			$("#view-list", cel).find('.custom_view').append(button_name);
		//updates the selected sort item to bold
		updateSelectedSortKey($("#view-list", cel));
		addClickEventsForSorting($("#view-list", cel));
		if(readCookie('company_filter') || readCookie('contact_filter_type') == 'COMPANY')
		{
			$('#contact-view-model-list>li').css('display','none');
			$('#contact-view-model-list>li:first').css('display','list-item');
		}
	});
}

function updateSelectedSortKey(el) {
	var sort_key = readCookie("sort_by_name");
	if(sort_key && sort_key != null) {
		var idSuffix = '-asc';
		if(sort_key.indexOf('-') == 0) {
			sort_key = sort_key.substring(1);
			idSuffix = '-desc'
		}
		var elementId = 'sort-by-'+sort_key+idSuffix;
		$(el).find('#'+elementId).addClass('bold-text');
	}
}

	function addClickEventsForSorting(el) {
		// Fetch sort result without changing route on click
		$(el).find('.sort').on("click", function(e)
		{

			e.preventDefault();
			eraseCookie('sort_by_name');

			// Gets name of the attribut to sort, which is set as data
			// attribute in the link
			sort_by = $(this).attr('data');
			
			// Saves Sort By in cookie
			createCookie('sort_by_name', sort_by);

			CONTACTS_HARD_RELOAD=true;
			// If filter is not set then show view on the default contacts
			// list
			if(!App_Contacts.tag_id)
			{
				App_Contacts.contacts();
				return;
			}
			
			// If tag filter is applied send tags fetch url and tag_id, which is tobe shown on contacts table.
			App_Contacts.contacts(App_Contacts.tag_id);
			return;
		});

	}

/**
 * Init function to define actions on events on the custom view list
 * 
 */
$(function() {

	/*
	 * If any custom view is selected, sets the cookie saves the id of the
	 * custom view, to show custom view even after refreshing. Also Load the
	 * contacts with custom view by reading the custom view id from the element
	 * which is selected and calls customView function is called to to custom
	 * view of contacts
	 */
	$('.ContactView').die().live('click', function(e) {

				e.preventDefault();
				
				if(App_Contacts.contactViewModel)
					App_Contacts.contactViewModel = undefined;

				if(App_Contacts.contact_custom_view)
					App_Contacts.contact_custom_view = undefined;
				
				// Gets id of the view
				var id = $(this).attr('id');

				// Saves contact_view id as cookie, so on refreshing shows the
				// custom view based on the cookie, and cookie deleted if
				// default view is selected
				createCookie("contact_view", id);

				/*
				 * Even when custom view is selected, have to check if user sets
				 * any filter so custom view should be shown on the filter
				 * results instead of showing view on default contacts, so if
				 * contact_filter cookie is set the sets the url to filter with
				 * filter id from cookie, then results are fetched from custom
				 * views
				 */
				if (filter_id = readCookie('contact_filter')) {
					App_Contacts.customView(id, undefined,
							'core/api/filters/query/' + filter_id);
					return;
				}
				
				if(readCookie('company_filter'))
      			{
					//App_Contacts.customView(readCookie("contact_view"), undefined, "core/api/contacts/companies")
      				App_Contacts.contacts();
					return;
      			}

				// If filter is not set then show view on the default contacts
				// list
				if(!App_Contacts.tag_id)
				{
					App_Contacts.customView(id);
					return;
				}
				
				// If tag filter is applied send tags fetch url and tag_id, which is tobe shown on contacts table.
				App_Contacts.customView(id, undefined, 'core/api/tags/' + App_Contacts.tag_id, App_Contacts.tag_id);
				
			});

	// If default view is selected, contacts are loaded with default view and
	// removes the view cookie set when view is selected
	$('.DefaultView').die().live('click', function(e) {
		e.preventDefault();

		// Erases the cookie
		eraseCookie("contact_view");
		eraseCookie("agile_contact_view");
		
		// Undefines current global view object
		if(App_Contacts.contactViewModel)
		App_Contacts.contactViewModel = undefined;

		if(App_Contacts.contactsListView)
			App_Contacts.contactsListView = undefined;
		
		// If filter is not set then show view on the default contacts
		// list
		if(!App_Contacts.tag_id)
		{
			App_Contacts.contacts();
			return;
		}
		
		// If tag filter is applied send tags fetch url and tag_id, which is tobe shown on contacts table.
		App_Contacts.contacts(App_Contacts.tag_id);

	});
	
	// If grid view is selected, contacts are loaded with grid view and
	// creates the grid view cookie 
	$('.GridView').die().live('click', function(e) {
		e.preventDefault();
		
		// Erases the cookie
		eraseCookie("contact_view");
		// Creates the cookie
		createCookie("agile_contact_view", "grid_view");
		
		if(App_Contacts.contactsListView)
			App_Contacts.contactsListView = undefined;

		// Loads the contacts
		App_Contacts.contacts(undefined, undefined, true);

	});
});
