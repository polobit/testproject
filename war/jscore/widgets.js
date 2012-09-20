var Catalog_Widgets_View = null;

// Show when Add widget is selected by user in contact view
function pickWidget() {
        Catalog_Widgets_View = new Base_Collection_View({
            url: '/core/api/widgets/default',
            restKey: "widget",
            templateKey: "widgets-add",
            individual_tag_name: 'div'
        });

        Catalog_Widgets_View.collection.fetch();
    $('#content').html(Catalog_Widgets_View.el);
}

// Load Widgets
function loadWidgets(el, contact, user) {
	
	// Create Data JSON
	var data = {contact: contact, user: user};
	
	// console.log("Contact length" + escape(contact).length)
	
    var view = new Base_Collection_View({
        url: '/core/api/widgets',
        restKey: "widget",
        templateKey: "widgets",
        individual_tag_name: 'li',
        sortKey: 'position',
        modelData: data
    });

    view.collection.fetch({
        success: function () {
        	
        	// Fetch all Widgets URL and run them through handlebars to convert {{xx} to actual values
        	  _(view.collection.models).each(function (model) { // in case collection is not empty
						var id = model.get("id");
						var url = model.get("url");
						$.get(url, "script");

						// Set the data element in the div
						// We can retrieve this in get plugin prefs
						
						$('#' + model.get('name'), el).data('model', model);						
				}, this);
        	
   	  head.js('https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js',
           function(){
        	  
            // Make widgets sortable
            $(".widget-sortable", newEl).sortable({
                update: function (event, ui) {                	
                	var models = [];

                    // Store the save
                    $('.widget-sortable li').each(function (index) {

                    	var model_name = $(this).find('.widget').attr('id');
                        
                        // Get Model
                        var model = $('#' + model_name).data('model');
                        
                        // console.log(modelId);
                        models.push({id: model.get("id"), position: index});
                    });
                    
                    // Store the positions at server
                    $.ajax({
                        type: 'POST',
                        url: '/core/api/widgets/positions',
                        data: JSON.stringify(models),
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                           // console.log("Positions Saved Successfully");
                        },
                        dataType: 'json'
                    });
                }
            });
            $(".widget-sortable", newEl).disableSelection();
   	  		});
        }
    });
    
    
    
    var newEl = view.render().el;

    $('#widgets', el).html(newEl);
}

$(function () {

    $('.add-widget').live('click', function (e) {

        var widget_name = $(this).attr('widget-name');
        if (Catalog_Widgets_View == null) {
            return;
        }

        // Get Widget Model
        var models = Catalog_Widgets_View.collection.where({
            name: widget_name
        });
        
        // Save widget model
        var widgetModel = new Backbone.Model();
        widgetModel.url = '/core/api/widgets';
        widgetModel.save(models[0].toJSON(), {success:function(){
        	
        	// Navigate back to the contact id form
            Backbone.history.navigate("contact/" + App_Contacts.contactDetailView.model.id, { trigger: true });
        }});
        
    });
    
    //Deleting widget
    $('#delete-widget').die().live('click', function (e) {
    	var widget_name = $(this).attr('widget-name');
    	if(!confirm("Are you sure to delete " + widget_name))
    		return;
    	
        $.ajax({
            type: 'DELETE',
            url: '/core/api/widgets/'+ widget_name ,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
            	
            	// Call Fetch to update widget models
            	Catalog_Widgets_View.collection.fetch();
            	$('#' + widget_name + "collection").remove();
            },
            dataType: 'json'
        });
    });
});


function addSocial(socialEl) {

    // Add Social Search
    var socialServices = ["TWITTER", "LINKEDIN"];

    $.each(socialServices, function (index, value) {
        var url = "/core/api/social/" + value + "/" + App_Contacts.contactDetailView.model.id
      
        var socialResults = new SocialSearchesListView();
        socialResults.collection.url = url;

        // Check if the results are present in local Storage 
        var key = value + '-' + App_Contacts.contactDetailView.model.id;

        // Store the key for list to retrieve
        socialResults.key = key;
        var cache = localStorage.getItem(key);

        if (localStorage && cache != null && JSON.parse(cache).length != 0) {
            socialResults.collection = new SocialSearchCollection(JSON.parse(cache));
            socialResults.render();
        } else socialResults.collection.fetch();


        	$('#social', socialEl).append(socialResults.el);
    });
}

