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
var CONTACTS_SORT_LIST={"created_time":"Created Date","lead_score":"Score","star_value":"Starred","first_name":"First Name","last_name":"Last Name","last_contacted":"Contacted Date",}

function contactTableView(base_model,customDatefields,view) {
	
	var templateKey = 'contacts-custom-view-model';
	var gridViewEl = _agile_get_prefs("agile_contact_view");
	if (gridViewEl) {
		templateKey = 'contacts-grid';
	}

	// Creates list view for
	var itemView = new Base_List_View({
		model : base_model,
		template : templateKey,
		tagName : view.options.individual_tag_name
	});

	// Reads the modelData (customView object)
	var modelData = view.options.modelData;

	// Reads fields_set from modelData
	var fields = modelData['fields_set'];

	// Converts base_model (contact) in to JSON
	var contact = base_model.toJSON();
	var el = itemView.el;

	if (!gridViewEl || window.location.hash=="#companies") {
	
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
				var json = {};
				if(!property)
				{
					json.id = contact.id;
					getTemplate('contacts-custom-view-custom', json, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$(el).append($(template_ui));
					}, null);
					return;
				}
				if(isDateCustomField(customDatefields,property)){
					console.log('got true');
					json = property;
					json.id = contact.id;
					getTemplate('contacts-custom-view-custom-date', json, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$(el).append($(template_ui));
					}, null);
				}
				else
				{
					json = property;
					json.id = contact.id;
					getTemplate('contacts-custom-view-custom', json, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$(el).append($(template_ui));
					}, null);
					
				}
				return;
			}
			
			getTemplate('contacts-custom-view-' + field_name, contact, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$(el).append($(template_ui));
			}, null);
		});

	} else  {
		getTemplate('contacts-grid-model', contact, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$(el).append($(template_ui));
			}, null);
	}
				
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
	/*head.load(CSS_PATH + 'css/bootstrap_submenu.css',  function()
	{*/
		getTemplate("contact-view-collection", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			
			var el = $(template_ui);
			$("#view-list", cel).html(el);
			
			// If button_name is defined, then view is selected then the name of
			// the view is show in the custom view button.
			if (button_name)
				$("#view-list", cel).find('.custom_view').append(button_name);
			
			setUpContactSortFilters(cel);

			//updates the selected sort item to bold
			//updateSelectedSortKey($(".contacts-toolbar", cel));
			//addClickEventsForSorting($("#view-list", cel));
			if(_agile_get_prefs('company_filter') || _agile_get_prefs('contact_filter_type') == 'COMPANY')
			{
				$('#contact-view-model-list>li').css('display','none');
				$('#contact-view-model-list>li:first').css('display','list-item');
			}

		}, $("#view-list", cel));
	// });
}

var CUSTOM_SORT_VIEW = undefined;
function setUpContactSortFilters(el)
{
	if(CUSTOM_SORT_VIEW)
	{
		$("#contact-sorter", el).html(CUSTOM_SORT_VIEW.render(true).el);
		//CUSTOM_SORT_VIEW.init();
		//CUSTOM_SORT_VIEW.preSelectFields();
		return;	
	}

	var view = CONTACT_SORT_FIELDS_VIEW.view();
	CUSTOM_SORT_VIEW = new view ({
		data : sort_configuration.getContactSortableFields(),
		templateKey : "contact-view-sort",
		individual_tag_name : "li",
		sort_collection : false,
		postRenderCallback: function(el)
		{
			CUSTOM_SORT_VIEW.postProcess();
		}
	});

	
	CUSTOM_SORT_VIEW.init();
	$("#contact-sorter", el).html(CUSTOM_SORT_VIEW.render(true).el);
	

	getSearchableCustomFields("CONTACT", function(data){
		CUSTOM_SORT_VIEW.collection.add(data);
	})
	
}

function addCustomFieldToSearch(base_model)
{
	if(!CUSTOM_SORT_VIEW)
		return;

	if(!base_model)
		return;

	if(!base_model.get("searchable"))
		return;

	CUSTOM_SORT_VIEW.collection.add(base_model);
}

function updateModel (base_model)
{
	if(!CUSTOM_SORT_VIEW)
		return;

	if(!base_model)
		return;

	var searchable  = base_model.get("searchable");
	var model = CUSTOM_SORT_VIEW.collection.get(base_model.get('id'));


	if(!model)
		return;

	if(!searchable)
		removeCustomFieldFromSortOptions(base_model);
}

function removeCustomFieldFromSortOptions(base_model)
{
	if(!base_model)
		return;

	if(!base_model.get("searchable"))
		return;

	if(!CUSTOM_SORT_VIEW)
		return;
	
	var model = CUSTOM_SORT_VIEW.collection.get(base_model.get('id'));

	if(model)
	{
		CUSTOM_SORT_VIEW.collection.remove(base_model.get('id'));

		CUSTOM_SORT_VIEW.render(true);
	}
}

function getSearchableCustomFields(scope, callback)
{
	if(!scope)
	  scope = "CONTACT";

	$.getJSON("core/api/custom-fields/scope?scope=" + scope, function(data){
		if(callback && typeof callback === 'function')
			callback(data);
	});
}

function updateSelectedSortKey(el) {
	var sort_key = _agile_get_prefs("sort_by_name");
	$('.sort-field-check').addClass('display-none');
	$('.sort-by-check').addClass('display-none');
	if(sort_key && sort_key != null) {
		var sort = sort_key.split("-")
		if(sort[0] == "")
			$(".sort-by[data='-']").find('i').removeClass('display-none');
		else
			$(".sort-by[data='']").find('i').removeClass('display-none');
		if(sort.length > 1)
			sort_key = sort[1];
		$(".sort-field[data='"+sort_key+"']").find('i').removeClass('display-none');
		printSortNameByData(sort_key);
		
	}else{
		$(".sort-by[data='']").find('i').removeClass('display-none');
		$(".sort-field[data='created_time']").find('i').removeClass('display-none');
		printSortNameByData('created_time');
	}
}

function printSortNameByData(data){
	 $(".contacts-toolbar").find(".sort-field-txt").html(CONTACTS_SORT_LIST[data]);
}

	function addClickEventsForSorting(el) {
		// Fetch sort result without changing route on click
		$('.contacts-toolbar').on('click', 'a.sort-field', function(e){
			e.preventDefault();
			// Gets name of the attribut to sort, which is set as data
			// attribute in the link
			var sort_field = $(this).attr('data');
			printSortNameByData(sort_field);
			var sort_key = _agile_get_prefs('sort_by_name');
			if(sort_key != undefined && sort_key != null && sort_key[0] == "-")
				sort_field = "-"+sort_field;
			_agile_set_prefs('sort_by_name', sort_field);
			
			CONTACTS_HARD_RELOAD=true;
			// If filter is not set then show view on the default contacts
			// list
			if(!App_Contacts.tag_id)
			{
				App_Contacts.contacts(undefined, undefined, undefined, true);
				return;
			}
			
			// If tag filter is applied send tags fetch url and tag_id, which is tobe shown on contacts table.
			App_Contacts.contacts(App_Contacts.tag_id, undefined, undefined, true);
			return;
			
		});

		$('.contacts-toolbar').on('click', 'a.sort-by', function(e){
			e.preventDefault();


			var sort_by = $(this).attr("data");
			var sort_field = _agile_get_prefs('sort_by_name');
			if(sort_field == null || sort_field == undefined)
				sort_field = "created_time";
			if(sort_field[0] == "-")
				sort_field = sort_field.slice(1);
			_agile_set_prefs('sort_by_name', sort_by+sort_field);
			
			CONTACTS_HARD_RELOAD=true;
			// If filter is not set then show view on the default contacts
			// list
			if(!App_Contacts.tag_id)
			{
				App_Contacts.contacts(undefined, undefined, undefined, true);
				return;
			}
			
			// If tag filter is applied send tags fetch url and tag_id, which is tobe shown on contacts table.
			App_Contacts.contacts(App_Contacts.tag_id, undefined, undefined, true);
			return;

			
		});


		/*$(el).find('.sort').on("click", function(e)
		{

			e.preventDefault();
			_agile_delete_prefs('sort_by_name');

			// Gets name of the attribut to sort, which is set as data
			// attribute in the link
			sort_by = $(this).attr('data');
			
			// Saves Sort By in cookie
			_agile_set_prefs('sort_by_name', sort_by);
			$('.sort').removeClass('bold-text');
			$(this).addClass('bold-text');

			CONTACTS_HARD_RELOAD=true;
			// If filter is not set then show view on the default contacts
			// list
			if(!App_Contacts.tag_id)
			{
				App_Contacts.contacts(undefined, undefined, undefined, true);
				return;
			}
			
			// If tag filter is applied send tags fetch url and tag_id, which is tobe shown on contacts table.
			App_Contacts.contacts(App_Contacts.tag_id, undefined, undefined, true);
			return;
		});*/

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
	$('body').on('click', '.ContactView', function(e){

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
				_agile_set_prefs("contact_view", id);

				/*
				 * Even when custom view is selected, have to check if user sets
				 * any filter so custom view should be shown on the filter
				 * results instead of showing view on default contacts, so if
				 * contact_filter cookie is set the sets the url to filter with
				 * filter id from cookie, then results are fetched from custom
				 * views
				 */
				if (filter_id = _agile_get_prefs('contact_filter')) {
					App_Contacts.customView(id, undefined,
							'core/api/filters/query/' + filter_id);
					return;
				}
				
				if(_agile_get_prefs('company_filter'))
      			{
					//App_Contacts.customView(_agile_get_prefs("contact_view"), undefined, "core/api/contacts/companies")
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
	$('body').on('click', '.DefaultView', function(e){
		e.preventDefault();
		
		if(company_util.isCompany())
			return;

		// Erases the cookie
		_agile_delete_prefs("contact_view");
		_agile_delete_prefs("agile_contact_view");
		
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
	$('body').on('click', '.GridView', function(e){
		e.preventDefault();
		
		// Erases the cookie
		_agile_delete_prefs("contact_view");
		// Creates the cookie
		_agile_set_prefs("agile_contact_view", "grid_view");
		
		if(App_Contacts.contactsListView)
			App_Contacts.contactsListView = undefined;

		// Loads the contacts
		App_Contacts.contacts(undefined, undefined, true);

	});
});
