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
	
	var templateKey = 'contacts-custom-view-model';
	var gridViewEl = readCookie("agile_contact_view");
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
	contactListener();
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
			//updates the selected sort item to bold
			updateSelectedSortKey($("#view-list", cel));
			addClickEventsForSorting($("#view-list", cel));
			if(readCookie('company_filter') || readCookie('contact_filter_type') == 'COMPANY')
			{
				$('#contact-view-model-list>li').css('display','none');
				$('#contact-view-model-list>li:first').css('display','list-item');
			}

		}, $("#view-list", cel));
	// });
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
	$('body').on('click', '.DefaultView', function(e){
		e.preventDefault();
		
		if(company_util.isCompany())
			return;

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
	$('body').on('click', '.GridView', function(e){
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

function contactListener()
{
	$('#contacts-table').off('mouseenter','tr');
		$('#contacts-table').on('mouseenter','tr',function(){
			var that=$(this);

			var html=""
			$(this).popover(
        {
            "rel": "popover",
            "trigger": "manual",
            "placement": "top",
            "html": "true",
            "content": "hello",
            });
			setTimeout(function() {
				if (!insidePopover)	{
		 $(that).popover('show');
		var id=that.find('.data').attr('data');
		 var contact=App_Contacts.contact_custom_view.collection.get(id).toJSON();
		 		getTemplate("contacts-custom-view-addData", contact, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('.popover').html($(template_ui));	
						attachEvents(that);
					});
		 		that.find('.data').attr('data');
		 	}
		 }, 1000);
});
		$('#contacts-table').off('mouseleave','tr');
	$('#contacts-table').on('mouseleave','tr',function(){
		var that=$(this);
	setTimeout(function() {
		if (!insidePopover)
				$(that).popover('hide');	
	}, 1000);
		
	});
}

var insidePopover=false;

function attachEvents(tr) {
	$('.popover').on('mouseenter', function() {
		insidePopover=true;
	});
	$('.popover').on('mouseleave', function() {
		insidePopover=false;
		$(tr).popover('hide');
	});

	$('.popover').on('click', '.contact-list-add-deal', function(e)
	{
		var that=$(this);
		e.preventDefault();
		var el = $("#opportunityForm");
		$("#opportunityModal").modal('show');

		add_custom_fields_to_form({}, function(data)
		{
			var el_custom_fields = show_custom_fields_helper(data["custom_fields"], [
				"modal"
			]);
			$("#custom-field-deals", $("#opportunityModal")).html($(el_custom_fields));

		}, "DEAL");

		// Fills owner select element
		populateUsers("owners-list", el, undefined, undefined, function(data)
		{

			$("#opportunityForm").find("#owners-list").html(data);
			$("#owners-list", $("#opportunityForm")).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
			$("#owners-list", $("#opportunityForm")).closest('div').find('.loading-img').hide();
		});
		// Contacts type-ahead
		agile_type_ahead("relates_to", el, contacts_typeahead);

		// Fills the pipelines list in select box.
		populateTrackMilestones(el, undefined, undefined, function(pipelinesList)
		{
			console.log(pipelinesList);
			$.each(pipelinesList, function(index, pipe)
			{
				if (pipe.isDefault)
				{
					var val = pipe.id + '_';
					if (pipe.milestones.length > 0)
					{
						val += pipe.milestones.split(',')[0];
						$('#pipeline_milestone', el).val(val);
						$('#pipeline', el).val(pipe.id);
						$('#milestone', el).val(pipe.milestones.split(',')[0]);
					}

				}
			});
		});

		populateLostReasons(el, undefined);

		populateDealSources(el, undefined);

		// Enable the datepicker

		$('#close_date', el).datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY});


		var json = null;

		if(company_util.isCompany()){
			json = App_Companies.companyDetailView.model.toJSON();
		} else {
			json = App_Contacts.contact_custom_view.collection.get($(that).parents('.data').attr('data')).toJSON();
		}
		var contact_name = getContactName(json);
		$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');

	});

	$('.popover').on('click', '.contact-list-add-note', function(e){ 
    	e.preventDefault();
        console.log("execution");
    	var	el = $("#noteForm");
    	var that=$(this);
    	
    	// Displays contact name, to indicate the note is related to the contact
    	//fill_relation(el);
    		var json = null;
	if(company_util.isCompany()){
		json = App_Companies.companyDetailView.model.toJSON();
	} else {
		json = App_Contacts.contact_custom_view.collection.get($(that).parents('.data').attr('data')).toJSON();
	}
 	var contact_name = getContactName(json);//getPropertyValue(json.properties, "first_name")+ " " + getPropertyValue(json.properties, "last_name");
 	
 	// Adds contact name to tags ul as li element
 	$('.tags',el).html('').html('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ json.id +'">'+contact_name+'</li>');


        if(!$(this).attr("data-toggle"))
             $('#noteModal').modal('show');
         
    	agile_type_ahead("note_related_to", el, contacts_typeahead);
     });

$('.popover').off('click', '#add-score')
$('.popover').on('click', '#add-score', function(e){
	    e.preventDefault();
	    var that=$(this);
	    // Convert string type to int
	    var add_score = parseInt($('#lead-score').text());
	    
	    add_score = add_score + 1;
	    
	    // Changes score in UI
	    $('#lead-score').text(add_score);
       
       var temp_model= App_Contacts.contactsListView.collection.get($(that).parents('.data').attr('data'));
	    temp_model.set({'lead_score': add_score});
		var contact_model =  temp_model.toJSON();
	    
	  /* // Refreshing the view ({silent: true} not working)
	    contact_model.url = 'core/api/contacts';
	    contact_model.set('lead_score', add_score, {silent: true});
	
	    // Save model
	    contact_model.save();*/
	    
		var new_model = new Backbone.Model();
		new_model.url = 'core/api/contacts';
		new_model.save(contact_model,{
			success: function(model){

			}
		});
		          
	});

$('.popover').off('click', '#minus-score')
$('.popover').on('click', '#minus-score', function(e){
	    e.preventDefault();
	    var that=$(this);
	    // Convert string type to int
	    var sub_score = parseInt($('#lead-score').text());
		
		if(sub_score <= 0)
			return;
		
		sub_score = sub_score - 1;
		
		// Changes score in UI
		$('#lead-score').text(sub_score);
		
       
       var temp_model= App_Contacts.contact_custom_view.collection.get($(that).parents('.data').attr('data'));
	    temp_model.set({'lead_score': sub_score}, {silent: true});
		var contact_model =  temp_model.toJSON();

		$(this.el).html(getTemplate(this.options.template,contact_model));
	    
	  /* // Refreshing the view ({silent: true} not working)
	    contact_model.url = 'core/api/contacts';
	    contact_model.set('lead_score', add_score, {silent: true});
	
	    // Save model
	    contact_model.save();*/
	    
		var new_model = new Backbone.Model();
		new_model.url = 'core/api/contacts';
		new_model.save(contact_model,{
			success: function(model){

			}
		});
		          
	});
}

function agile_crm_get_List_contact_properties_list(propertyName,id)
{
	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contact_custom_view.collection.get(id);

	// Gets properties list field from contact
	var properties = contact_model.get('properties');
	var property_list = [];

	/*
	 * Iterates through each property in contact properties and checks for the
	 * match in it for the given property name and retrieves value of the
	 * property if it matches
	 */
	$.each(properties, function(index, property)
	{
		if (property.name == propertyName)
		{
			property_list.push(property);
		}
	});

	// If property is defined then return property value list
	return property_list;
}