/**
 * Loads widgets on a contact, creates a collection view
 */
function loadWidgets(el, contact)
{
    // Create Data JSON
    var data = {
        contact: contact
    };

    // Creates collection view, collection is sorted based on position i.e., set
    // when sorted using jquery ui sortable
    var view = new Base_Collection_View(
    {
        url: '/core/api/widgets',
        restKey: "widget",
        templateKey: "widgets",
        individual_tag_name: 'li',
        sortKey: 'position',
        modelData: data
    });

    // Fetches the widget collection, on success widget scripts are loaded form
    // the url specified in widget model attribute url.
    view.collection.fetch(
    {
        success: function ()
        {
        	console.log(view.collection.toJSON())

            // Iterates through all the models (widgets) in the
            // collection, and scripts are loaded from the url in the
            // widget
            _(view.collection.models).each(function (model)
            {
                // In case collection is not empty
                var id = model.get("id");
                var url = model.get("url");
 
                if(!model.get("is_minimized"))
                	$.get(url, "script");

                
                // Sets the data element in the div
                // We can retrieve this in get plugin prefs
                $('#' + model.get('name'), el).data('model', model);
            }, this);

            // Loads jquery-ui to get sortable functionality on widgets
            head.js(LIB_PATH + 'lib/jquery-ui.min.js', function ()
            {

                // Make widgets sortable
                $(".widget-sortable", newEl).sortable(
                {
                    update: function (event, ui)
                    {
                        var models = [];

                        // Store the save
                        $('.widget-sortable > li').each(function (index, element)
                        {
                        	var model_name = $(element).find('.widgets').attr('id');
                        	
                            // Get Model, model is set as data to widget element
                            var model = $('#' + model_name).data('model');
                            
                            models.push(
                            {
                                id: model.get("id"),
                                position: index
                            });
                        });

                        // Stores the positions at server
                        $.ajax(
                        {
                            type: 'POST',
                            url: '/core/api/widgets/positions',
                            data: JSON.stringify(models),
                            contentType: "application/json; charset=utf-8",
                            dataType: 'json'
                        });
                    }
                });
                
                // Disable selection after sorted
                $(".widget-sortable", newEl)
                    .disableSelection();
            });
        }
    });

    var newEl = view.render().el;

    $('#widgets', el).html(newEl);
    
	
	$('.widget-minimize').die().live('click', function(e){
		e.preventDefault();

		var widget_name = $(this).attr('widget');
		
		$("#" + widget_name).collapse('hide');
		$(this).removeClass();
		$(this).addClass('collapsed');
		$(this).addClass('widget-maximize');
		$(this).addClass('icon-plus');
		var widget = view.collection.where({name: widget_name})[0]
		var widgetJSON = widget.toJSON();
		
		widgetJSON['is_minimized'] = true;
		
		var model = new BaseModel();
		model.url = "core/api/widgets";
		model.save(widgetJSON, {silent:true});
		
		widget = model;
	});
	
	$('.widget-maximize').die().live('click', function(e){
		e.preventDefault();
		var widget_name = $(this).attr('widget');
		
		var widget = view.collection.where({name: widget_name})[0];
		
		var widgetJSON = widget.toJSON();
		widgetJSON['is_minimized'] = false;
		
		var model = new BaseModel();
		model.url = "core/api/widgets";
		model.save(widgetJSON, {silent:true});
		
		widget = model;

		var is_collapsed = $(this).hasClass('collapsed');
		$(this).removeClass();
		$(this).addClass('widget-minimize');
		$(this).addClass('icon-minus');
		console.log(is_collapsed);
		if(is_collapsed)
		{
			$("#" + widget_name).collapse('show');
			return;
		}
		
		$.get(widget.get('url'), 'script');

	});
}



function queueGetRequest(queueName, url, dataType, successcallback, errorCallback)
{
	head.js('/js/lib/ajaxm/ajaxq.js', function(){
	$.ajaxq(queueName, {
		 url : url,
		 cache: false,
		 dataType: dataType,
		    success: function(data)
		    {
		    	console.log(data);
		    	
		    	// If defined, execute the callback function
		        if (successcallback && typeof (successcallback) === "function")
		        {
		        	successcallback(data);
		        }
		    },
		    error: function(data)
            {
		    	// If defined, execute the callback function
		        if (errorCallback && typeof (errorCallback) === "function")
		        {
		        	errorCallback(data);
		        }
            },
		});
	});
}

function queuePostRequest(queueName, url, data, successcallback, errorCallback)
{
	head.js('/js/lib/ajaxm/ajaxq.js', function(){
	$.ajaxq(queueName, {
		type:'POST',
		 url : url,
		 cache: false,
		 data:data,
		    success: function(data)
		    {
		    	console.log(data);
		    	
		    	// If defined, execute the callback function
		        if (successcallback && typeof (successcallback) === "function")
		        {
		        	successcallback(data);
		        }
		    },
		    error: function(data)
            {
		    	// If defined, execute the callback function
		        if (errorCallback && typeof (errorCallback) === "function")
		        {
		        	errorCallback(data);
		        }
            },
		});
	});
}
