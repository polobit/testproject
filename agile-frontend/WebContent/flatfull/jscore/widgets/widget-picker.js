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
	var container = "";

	if (widget_type == "SOCIAL")
		  container = "social";
	if (widget_type == "SUPPORT")
		  container = "support";
	if (widget_type == "EMAIL")
		container = "email";
	if (widget_type == "CALL")
	{
	  if( base_model.get('name') == "Twilio" && !base_model.get('is_added'))
		  console.log("It is old twilio");
	  else
		  container = "call";
	}	
	if (widget_type == "BILLING")
		container = "billing";
	if (widget_type == "ECOMMERCE")
		container = "ecommerce";
	if (widget_type == "CUSTOM")
		 container = "custom";

	if(container)
		$('#' + container, this.el).append($(itemView.render().el).addClass('col-md-4 col-sm-6 col-xs-12'));
}

/**
 * Add/ Delete button are shown in the widget based on the attribute is_added in
 * widget model, Add and delete functionalities of the widgets are defined in
 * this init function
 */
function initializeWidgetSettingsListeners(){
	// adding widget
	/**
	 * When user clicks on add-widget, gets the widget-name which is set to add
	 * anchor tag and gets the model from the collection with widget name and
	 * add widget then navigates back to the contact-details page
	 */
	$('#prefs-tabs-content').off();
	
	$('#prefs-tabs-content .install-custom-widget').off('click');
	$('#prefs-tabs-content, #custom-widget').on('click', '.install-custom-widget', function(e)
	{

		e.preventDefault();
		console.log($(this));
		
		/* We make add button on a widget disabled on click of it. This is done
		 * to avoid continuous click in a short time, like double click on add
		 * button
		 */
		if ($(this).attr("disabled"))
			return;

		// set attribute disabled as disabled
		$(this).attr("disabled", "disabled");

		// Reads the name of the widget to be added
		var widget_name = $(this).attr('widget-name');

		console.log('In add widget');
		console.log(widget_name);

		if (App_Widgets.Catalog_Widgets_View == null)
			return;

		
		 /* Get widget model from collection based on the name attribute of the
		 * widget model
		 */
		var models = App_Widgets.Catalog_Widgets_View.collection.where({ name : widget_name });

		
		 /* Saves widget model and on success navigate back to contact detailed
		 * view
		 */
		var widgetModel = new Backbone.Model();

		console.log(widgetModel);

		// URL to connect with widgets
		widgetModel.url = '/core/api/widgets';

		widgetModel.save(models[0].toJSON(), { success : function(data)
		{
			// Checks if Widget_View is defined and adds widget to collection
			if (Widgets_View && Widgets_View.collection)
				Widgets_View.collection.add(new BaseModel(data.toJSON()));


			data.set('is_added', true);
			models[0].set(data);

		} });

	});

	$('#prefs-tabs-content .acl_widget').off('click');
	$('#prefs-tabs-content').on('click', '.acl_widget', function(e){
		// Fetching widget ID.
		var widgetData = $(this).attr('widget-data');		
		var that = $(this);
		$.getJSON( "core/api/users/agileusers", function(data){	
			var result ={}; 
			result.widget = JSON.parse(widgetData);							
			var userList = JSON.stringify(result.widget.listOfUsers);
			for(var i=0; i < data.length ; i++){	
				var obj = data[i];						
				if(userList.indexOf(obj.id) > 0){
					obj.isChecked = true;
					data[i] = obj;
				}				
			}
			result.data = data;

			getTemplate('widget-acls-modal-content', result , undefined, function(template_ui){
  				$("#widget-acls-modal").html(template_ui).modal('show');    					

  				$('#widget-acls-modal').off('click', '.agileUserChk_all');
				$('#widget-acls-modal').on('click', '.agileUserChk_all', function(e){
					if($(this).is(":checked")){
						$('#widget-acls-modal .agileUserChk').prop('checked',true);
					}else{
						$('#widget-acls-modal .agileUserChk').prop('checked',false);
					}					
				});

  				$('#widget-acls-modal').off('click', '.widget_acl_save');
				$('#widget-acls-modal').on('click', '.widget_acl_save', function(e){					
					var widgetID = $(this).attr('widget-id');
					var widget = result.widget;

					var newUserList = [];
					$('input:checkbox[name=agileUserChk]:checked').each(function(e){
       					newUserList.push($(this).val());
    				});

					widget.listOfUsers = newUserList;

					$.ajax({
						type : 'POST',
						url : '/core/api/widgets/saveWidgetPrivilages',
						data : JSON.stringify(widget),						
						success: function(resultData){
							var widgetData = result.widget;
							widgetData.listOfUsers = widget.listOfUsers;

							that.attr('widget-data',JSON.stringify(widgetData));
							console.log('Widget ACL updated');
							Widgets_View = undefined;
							$("#widget-acls-modal").html(template_ui).modal('hide');
						}
					});
																							
				});
  											
  			});					
		});
	});	

	// Deleting widget
	/**
	 * When user chooses to delete a widget, on confirmation sends delete
	 * request based on the name of the widget
	 */
	$('#prefs-tabs-content #delete-widget').off('click');
	$('#prefs-tabs-content').on('click', '#delete-widget', function(e)
	{
		// Fetch widget name from the widget on which delete is clicked
		var widget_name = $(this).attr('widget-name');

		// If not confirmed to delete, return
		var displayName;
		
		if(widget_name == "Rapleaf"){
			displayName = "Towerdata";
		}else if(widget_name == "TwilioIO"){
			displayName = "Twilio";
		}else{
			displayName = widget_name;
		}

		showAlertModal("Are you sure to delete " + displayName, "confirm", function(){
			delete_widget(widget_name);

			if(widget_name == "Linkedin")
				$('#Linkedin-container').hide();
			
			if(widget_name == "Twilio")
				$('#Twilio-container').hide();
		},undefined, "Delete Widget");

	});	
	
	// Helps to know that widget is for all users.
	$('#prefs-tabs-content .add_to_all').off('click');
	$('#prefs-tabs-content').on('click', '.add_to_all', function(e){
		isForAll = true;
	});

	$('#prefs-tabs-content .add-widget').off('click');
	$('#prefs-tabs-content').on('click', '.add-widget', function(e){
		isForAll = false;
	});
	
	$('#prefs-tabs-content #remove-widget').off('click');
	$('#prefs-tabs-content').on('click', '#remove-widget', function(e)
	{

		// Fetch widget name from the widget on which delete is clicked
		var widget_name = $(this).attr('widget-name');
		
		
		// If not confirmed to delete, return
		showAlertModal("delete", "confirm", function(){
			//Deletes the cutom widget form the widget entity.
			delete_widget(widget_name);
			
			/*
			 * Sends Delete request with widget name as path parameter, and on
			 * success fetches the widgets to reflect the changes is_added, to show
			 * add widget in the view instead of delete option
			 */
			$.ajax({ type : 'DELETE', url : '/core/api/widgets/remove?widget_name=' + widget_name, contentType : "application/json; charset=utf-8",

			success : function(data)
			{
				update_collection(widget_name);
				
				// Call fetch on collection to update widget models
				App_Widgets.Catalog_Widgets_View.collection.fetch();

			}, dataType : 'json' });
		},undefined, "Delete Widget");

		

	});
                
}


function delete_widget(widget_name)
{
	/*
	 * Sends Delete request with widget name as path parameter, and on
	 * success fetches the widgets to reflect the changes is_added, to show
	 * add widget in the view instead of delete option
	 */
	$.ajax({ type : 'DELETE', url : '/core/api/widgets?widget_name=' + widget_name, contentType : "application/json; charset=utf-8",

	success : function(data)
	{

		App_Widgets.Catalog_Widgets_View.collection.where({ name : widget_name })[0].set({'is_added': false}, {silent : true}).unset("prefs");
		update_collection(widget_name);
		location.reload();
		
	}, dataType : 'json' });

}

function update_collection(widget_name)
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
}