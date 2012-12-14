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
 * handlebars
 */
function pickWidget() {
	Catalog_Widgets_View = new Base_Collection_View({
		url : '/core/api/widgets/default',
		restKey : "widget",
		templateKey : "widgets-add",
		individual_tag_name : 'div'
	});

	// Fetch the list of widgets
	Catalog_Widgets_View.collection.fetch();

	// Shows available widgets in the content
	$('#content').html(Catalog_Widgets_View.el);
}

/**
 * Add/ Delete button are shown in the widget based on the attribute is_added in
 * widget model, Add and delete functionalities of the widgets are defined in
 * this init function
 */
$(function() {

	/**
	 * When user clicks on add-widget, gets the widget-name which is set to add
	 * anchor tag and gets the model from the collection with widget name and
	 * add widget then navigates back to the contact-details page
	 */
	$('.add-widget').live(
			'click',
			function(e) {

				// Reads the name of the widget to be added
				var widget_name = $(this).attr('widget-name');
				if (Catalog_Widgets_View == null) {
					return;
				}

				// Gets Widget Model from collection based on the name attribute
				// of the widget model
				var models = Catalog_Widgets_View.collection.where({
					name : widget_name
				});

				// Saves widget model and on success navigate back to contact
				// detailed view
				var widgetModel = new Backbone.Model();
				widgetModel.url = '/core/api/widgets';
				widgetModel.save(models[0].toJSON(), {
					success : function() {

						// Navigates back to the contact id form
						Backbone.history.navigate("contact/"
								+ App_Contacts.contactDetailView.model.id, {
							trigger : true
						});
					}
				});

			});

	// Deleting widget
	/**
	 * When user chooses to delete a widget, on confirmation sends delete
	 * request based on the name of the widget
	 */
	$('#delete-widget').die().live('click', function(e) {
		var widget_name = $(this).attr('widget-name');
		if (!confirm("Are you sure to delete " + widget_name))
			return;

		/*
		 * Sends Delete request with widget name as path parameter, and on
		 * success fetches the widgets to reflect the changes is_added, to show
		 * add widget in the view instead of delete option
		 */
		$.ajax({
			type : 'DELETE',
			url : '/core/api/widgets/' + widget_name,
			contentType : "application/json; charset=utf-8",
			success : function(data) {

				// Call Fetch to update widget models
				Catalog_Widgets_View.collection.fetch();
				$('#' + widget_name + "collection").remove();
			},
			dataType : 'json'
		});
	});
});
