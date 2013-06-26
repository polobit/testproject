/**
 * Loads widgets on a contact, creates a collection view
 */
var WIDGETS_VIEW;
function loadWidgets(el, contact)
{
    // Create Data JSON
    var data = {
        contact: contact
    };

    // Creates collection view, collection is sorted based on position i.e., set
    // when sorted using jquery ui sortable

    if(!WIDGETS_VIEW)
    {
	   WIDGETS_VIEW = new Base_Collection_View(
	    {
	        url: '/core/api/widgets',
	        restKey: "widget",
	        templateKey: "widgets",
	        individual_tag_name: 'li',
	        sortKey: 'position',
	        modelData: data,
	        postRenderCallback : function(widgets_el) {
	        	set_up_widgets(el, widgets_el);
	        }
	    });
	   
	   WIDGETS_VIEW.collection.fetch();
	   	   		
	   		var newEl = WIDGETS_VIEW.render().el;
	    	$('#widgets', el).html(newEl);	    	
    }
    else
    {
    	// Have a flag, which is used to check whether widgets are already loaded. 
    	// This avoid unnecessary 
    	var flag = false;
        
        $(el).live('agile_model_loaded', function(e) {
        	if(flag == false)
        	{
        		// Sort needs to be called as there could be position change
        		 WIDGETS_VIEW.collection.sort();
        		 
        		$('#widgets', el).html(WIDGETS_VIEW.render(true).el);
        		
        		// Sets up widget
        		set_up_widgets(el, WIDGETS_VIEW.el);
        	}
        	flag = true;
        });
    }

	$('.widget-minimize').die().live('click', function(e) {
		e.preventDefault();

		var widget_name = $(this).attr('widget');
		
		$("#" + widget_name).collapse('hide');
		$(this).removeClass();
		$(this).addClass('collapsed');
		$(this).addClass('widget-maximize');
		$(this).addClass('icon-plus');
		var widget = WIDGETS_VIEW.collection.where({name: widget_name})[0]
		var widgetJSON = widget.toJSON();
		
		widget.set({'is_minimized' : true })
		widgetJSON['is_minimized'] = true;
		
		var model = new BaseModel();
		model.url = "core/api/widgets";
		model.save(widgetJSON, {silent:true});
		
		widget = model;
	});
	
	$('.widget-maximize').die().live('click', function(e){
		e.preventDefault();
		var widget_name = $(this).attr('widget');
		
		var widget = WIDGETS_VIEW.collection.where({name: widget_name})[0];
		
		var widgetJSON = widget.toJSON();
		widgetJSON['is_minimized'] = false;
		
		widget.set({'is_minimized' : false },{silent:true})
		
		var model = new BaseModel();
		model.url = "core/api/widgets";
		model.save(widgetJSON, {silent:true});
		
		widget = model;

		var is_collapsed = $(this).hasClass('collapsed');
		$(this).removeClass();
		$(this).addClass('widget-minimize');
		$(this).addClass('icon-minus');
		if(is_collapsed)
		{
			$("#" + widget_name).collapse('show');
			return;
		}
		$.get(widget.get('url'), 'script');

	});
}


function set_up_widgets(el, widgets_el)
{
    // Iterates through all the models (widgets) in the
    // collection, and scripts are loaded from the url in the
    // widget
    _(WIDGETS_VIEW.collection.models).each(function (model)
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
	
	enableWidgetSoring(widgets_el);

}

function enableWidgetSoring(el)
{
	
    // Loads jquery-ui to get sortable functionality on widgets
    head.js(LIB_PATH + 'lib/jquery-ui.min.js', function ()
    {
    	
    	$('.widget-sortable', el).sortable();
		//$('.widget-sortable').sortable("option", "containment", $('.widget-sortable'));
		$('.widget-sortable', el).sortable( "option", "handle", ".icon-move" );	
	
		$('.widget-sortable', el).on( "sortstop", function( event, ui ) {
			
			var models = [];

            // Store the save
            $('.widget-sortable > li', el).each(function (index, element)
            {
            	var model_name = $(element).find('.widgets').attr('id');
            	
            	
                // Get Model, model is set as data to widget element
                var model = $('#' + model_name).data('model');
                
                model.set({'position' : index}, {silent : true});
                                
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
            
		});
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
            
            complete: function(data)
            {
            	console.log('completed get');
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
		    	// If defined, execute the callback function
		        if (successcallback && typeof (successcallback) === "function")
		        {
		        	console.log('suceess queue post');
		        	
		        	successcallback(data);
		        }
		    },
		    error: function(data)
            {
		    	
		    	// If defined, execute the callback function
		        if (errorCallback && typeof (errorCallback) === "function")
		        {
		        	console.log('error queue post');
		        	errorCallback(data);
		        }
            },complete: function(data)
            {
            	console.log('completed post');
            }
		});
	});
}