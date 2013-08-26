/**
 * widget-model.js manages the widgets, adding/deleting widgets. When user
 * chooses to add/manage widgets from any contact detailed view, list of
 * available widgets are shown to add or delete if already added.
 */
var Catalog_Widgets_View = null;

// Show when Add widget is selected by user in contact view
/**
 * pickWidget method is called when add/manage widgets link in contact details
 * is clicked, it creates a view of widget collection showing add/delete based
 * on is_added variable in widget model, which is checked in template using
 * handle bars
 */
function pickWidget()
{
	Catalog_Widgets_View = new Base_Collection_View({ url : '/core/api/widgets/default', restKey : "widget", templateKey : "widgets-add",
		sort_collection : false, individual_tag_name : 'div' });

	// Append widgets into view by organizing them
	Catalog_Widgets_View.appendItem = organize_widgets;

	// Fetch the list of widgets
	Catalog_Widgets_View.collection.fetch();

	// Shows available widgets in the content
	$('#content').html(Catalog_Widgets_View.el);
}

/**
 * Organizes widgets into different categories like (SOCIAL, SUPPORT, EMAIL,
 * CALL, BILLING.. etc) to show in the add widget page, based on the widget_type
 * fetched from Widget object
 * 
 * @param base_model
 */
function organize_widgets(base_model)
{
	var itemView = new Base_List_View({ model : base_model, template : this.options.templateKey + "-model", tagName : 'div', });

	// Get widget type from model (widget object)
	var widget_type = base_model.get('widget_type');

	/*
	 * Appends the model (widget) to its specific div, based on the widget_type
	 * as div id (div defined in widget_add.html)
	 */
	if (widget_type == "SOCIAL")
		$('#social', this.el).append($(itemView.render().el).addClass('span4'));

	if (widget_type == "SUPPORT")
		$('#support', this.el).append($(itemView.render().el).addClass('span4'));

	if (widget_type == "EMAIL")
		$('#email', this.el).append($(itemView.render().el).addClass('span4'));

	if (widget_type == "CALL")
		$('#call', this.el).append($(itemView.render().el).addClass('span4'));

	if (widget_type == "BILLING")
		$('#billing', this.el).append($(itemView.render().el).addClass('span4'));
	
	if (widget_type == "CUSTOM")
		$('#custom', this.el).append($(itemView.render().el).addClass('span4'));
}

/**
 * Add/ Delete button are shown in the widget based on the attribute is_added in
 * widget model, Add and delete functionalities of the widgets are defined in
 * this init function
 */
$(function()
{
	// adding widget
	/**
	 * When user clicks on add-widget, gets the widget-name which is set to add
	 * anchor tag and gets the model from the collection with widget name and
	 * add widget then navigates back to the contact-details page
	 */
	$('.add-widget').live('click', function(e)
	{
		/*
		 * We make add button on a widget disabled on click of it. This is done
		 * to avoid continuous click in a short time, like double click on add
		 * button
		 */
		if ($(this).attr("disabled"))
			return;

		// set attribute disabled as disabled
		$(this).attr("disabled", "disabled");

		// Reads the name of the widget to be added
		var widget_name = $(this).attr('widget-name');

		if (Catalog_Widgets_View == null)
			return;

		/*
		 * Get widget model from collection based on the name attribute of the
		 * widget model
		 */
		var models = Catalog_Widgets_View.collection.where({ name : widget_name });

		/*
		 * Saves widget model and on success navigate back to contact detailed
		 * view
		 */
		var widgetModel = new Backbone.Model();

		// URL to connect with widgets
		widgetModel.url = '/core/api/widgets';
		
		// is added is set true to show delete button
		// models[0].set('is_added', true);

		widgetModel.save(models[0].toJSON(), { success : function(data)
		{
			// Checks if Widget_View is defined and adds widget to collection
			if (Widgets_View && Widgets_View.collection)
				Widgets_View.collection.add(new BaseModel(data.toJSON()));

			/*
			 * If contacts view is not defined, redirected to list of contacts
			 * page after adding widget
			 */
			if (!App_Contacts || !App_Contacts.contactDetailView || !App_Contacts.contactDetailView.model)
			{
				Backbone.history.navigate("contacts", { trigger : true });
				return;
			}

			// Navigates back to the contact id form
			Backbone.history.navigate("contact/" + App_Contacts.contactDetailView.model.id, { trigger : true });

		} });

	});

	// Deleting widget
	/**
	 * When user chooses to delete a widget, on confirmation sends delete
	 * request based on the name of the widget
	 */
	$('#delete-widget').die().live('click', function(e)
	{
		// Fetch widget name from the widget on which delete is clicked
		var widget_name = $(this).attr('widget-name');

		// If not confirmed to delete, return
		if (!confirm("Are you sure to delete " + widget_name))
			return;

		/*
		 * Sends Delete request with widget name as path parameter, and on
		 * success fetches the widgets to reflect the changes is_added, to show
		 * add widget in the view instead of delete option
		 */
		$.ajax({ type : 'DELETE', url : '/core/api/widgets/' + widget_name, contentType : "application/json; charset=utf-8",

		success : function(data)
		{
			/*
			 * If Widgets_View is defined, remove widgets from widget collection
			 */
			if (Widgets_View && Widgets_View.collection)
			{
				// Fetch widget from collection based on widget_name
				var model = Widgets_View.collection.where({ name : widget_name });
				Widgets_View.collection.remove(model);
			}

			// Call fetch on collection to update widget models
			Catalog_Widgets_View.collection.fetch();

			/*
			 * If contacts view is not defined, redirected to list of contacts
			 * page after adding widget
			 */
			if (!App_Contacts || !App_Contacts.contactDetailView || !App_Contacts.contactDetailView.model)
			{
				Backbone.history.navigate("contacts", { trigger : true });

				return;
			}
			// Navigates back to the contact id form
			Backbone.history.navigate("contact/" + App_Contacts.contactDetailView.model.id, { trigger : true });

		}, dataType : 'json' });
	});
});
