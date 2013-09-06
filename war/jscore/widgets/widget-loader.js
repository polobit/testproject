/**
 * Loads widgets on a contact, creates a collection view
 */
var Widgets_View;

/**
 * Loads all the widgets for the current agile user
 * 
 * @param el
 * @param contact
 */
function loadWidgets(el, contact)
{

	// Create Data JSON
	var data = { contact : contact };

	/*
	 * If Widgets_View is not defined , creates collection view, collection is
	 * sorted based on position i.e., set when sorted using jquery ui sortable
	 */
	if (!Widgets_View)
	{
		Widgets_View = new Base_Collection_View({ url : '/core/api/widgets', restKey : "widget", templateKey : "widgets", individual_tag_name : 'li',
			sortKey : 'position', modelData : data, postRenderCallback : function(widgets_el)
			{

			} });

		/*
		 * Fetch widgets from collection and set_up_widgets (load their scripts)
		 */
		Widgets_View.collection.fetch({ success : function(data)
		{
			set_up_widgets(el, Widgets_View.el);
		} });

		// show widgets
		var newEl = Widgets_View.render().el;
		$('#widgets', el).html(newEl);

	}
	else
	{
		/*
		 * Have a flag, which is used to check whether widgets are already
		 * loaded. This avoid unnecessary loading.
		 */
		var flag = false;

		$(el).live('view_loaded', function(e)
		{
			if (flag == false)
			{
				flag = true;

				// Sort needs to be called as there could be position change
				Widgets_View.collection.sort();

				$('#widgets', el).html(Widgets_View.render(true).el);

				// Sets up widget
				set_up_widgets(el, Widgets_View.el);

			}

		});
	}

	/*
	 * Called on click of icon-minus on widgets, collapsed class is added to it
	 * and sets "is_minimized" field of widget as true, we check this while
	 * loading widgets and skip loading widget if it is minimized
	 */
	$('.widget-minimize').die().live('click', function(e)
	{
		e.preventDefault();
		var widget_name = $(this).attr('widget');

		// content in widget is hidden
		$("#" + widget_name).collapse('hide');
		$(this).removeClass();

		$(this).addClass('collapsed');
		$(this).addClass('widget-maximize');
		$(this).addClass('icon-plus');

		// Get widget from collection by widget name
		var widget = Widgets_View.collection.where({ name : widget_name })[0]
		var widgetJSON = widget.toJSON();

		// set "is_minimized" field of widget as true
		widget.set({ 'is_minimized' : true }, { silent : true });
		widgetJSON['is_minimized'] = true;

		// Get model and save widget
		var model = new BaseModel();
		model.url = "core/api/widgets";
		model.save(widgetJSON, { silent : true });

	});

	/*
	 * Called on click of icon-plus on widgets, sets "is_minimized" field of
	 * widget as false, we check this while loading widgets and skip loading
	 * widget if it is minimized
	 */
	$('.widget-maximize').die().live('click', function(e)
	{
		e.preventDefault();
		var widget_name = $(this).attr('widget');

		// Get widget from collection by widget name
		var widget = Widgets_View.collection.where({ name : widget_name })[0];
		var widgetJSON = widget.toJSON();

		// set "is_minimized" field of widget as false
		widgetJSON['is_minimized'] = false;
		widget.set({ 'is_minimized' : false }, { silent : true })

		// Get model and save widget
		var model = new BaseModel();
		model.url = "core/api/widgets";
		model.save(widgetJSON, { silent : true });

		// Stores boolean whether widget has class collapsed
		var is_collapsed = $(this).hasClass('collapsed');
		$(this).removeClass();

		$(this).addClass('widget-minimize');
		$(this).addClass('icon-minus');

		/*
		 * If is collapsed, script is already loaded, show the content in widget
		 * and return
		 */
		if (is_collapsed)
		{
			$("#" + widget_name).collapse('show');
			return;
		}

		// else load the script
		$.get(widget.get('url'), 'script');

	});
}

/**
 * Loads the scripts of widgets which are not minimized and enables sorting
 * functionality on widgets
 * 
 * @param el
 * @param widgets_el
 */
function set_up_widgets(el, widgets_el)
{
	console.log("widgets el");
	console.log(el);
	console.log("widgets el");
	console.log(widgets_el);
	/*
	 * Iterates through all the models (widgets) in the collection, and scripts
	 * are loaded from the URL in the widget
	 */
	_(Widgets_View.collection.models).each(function(model)
	{
		// In case collection is not empty
		var id = model.get("id");
		var url = model.get("url");

		console.log(model.get('name'));

		/*
		 * Set the data element in the div so that we can retrieve this in get
		 * plugin preferences
		 */
		$('#' + model.get('name'), widgets_el).data('model', model);

		/*
		 * Checks if widget is minimized, if minimized script is not loaded
		 */
		if (!model.get("is_minimized") && model.get("widget_type") != "CUSTOM")
			$.get(url, "script");

		/*
		 * For custom widgets we load the scripts using HTTP connections and
		 * store the script in script field of widget object, that is retrieved
		 * and appended in the body
		 */
		if (model.get("widget_type") == "CUSTOM")
		{
			console.log('in widget type custom');
			console.log(model.get('name'));
			console.log(model.get('script'));
			console.log($('#' + model.get('name'), widgets_el));

			if (model.get('script'))
				$('#' + model.get('name'), widgets_el).html(model.get('script'));
			else
				getScript(model, function(data)
				{
					console.log(data);
					$('#' + model.get('name'), widgets_el).html(data);
				});

			console.log($('#' + model.get('name'), widgets_el));
		}

	}, this);

	enableWidgetSoring(widgets_el);

}

function getScript(model, callback)
{
	// Gets contact id, to save social results of a particular id
	var contact_id = agile_crm_get_contact()['id'];

	console.log("in get script");

	$.post("core/api/widgets/script/" + contact_id + "/" + model.get("name"), function(data)
	{
		console.log("script post");

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);
	}).error(function(data)
	{
		console.log('in error');
		console.log(data);
		console.log(data.responseText);
	});
}

/**
 * Enables sorting on widgets by loading jquery-ui to get sortable functionality
 * on widgets. Whenever widget is sorted, it saves the new positions of widgets
 * 
 * @param el
 */
function enableWidgetSoring(el)
{
	// Loads jquery-ui to get sortable functionality on widgets
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function()
	{
		$('.widget-sortable', el).sortable();

		// Makes icon-move on widgets panel as handle for sorting
		$('.widget-sortable', el).sortable("option", "handle", ".icon-move");

		/*
		 * This event is called after sorting stops to save new positions of
		 * widgets
		 */
		$('.widget-sortable', el).on(
				"sortstop",
				function(event, ui)
				{
					var models = [];

					/*
					 * Iterate through each all the widgets and set each widget
					 * position and store it in array
					 */
					$('.widget-sortable > li', el).each(function(index, element)
					{
						var model_name = $(element).find('.widgets').attr('id');

						// Get Model, model is set as data to widget element
						var model = $('#' + model_name).data('model');

						model.set({ 'position' : index }, { silent : true });

						models.push({ id : model.get("id"), position : index });
					});

					// Saves new positions in server
					$.ajax({ type : 'POST', url : '/core/api/widgets/positions', data : JSON.stringify(models),
						contentType : "application/json; charset=utf-8", dataType : 'json' });
				});
	});
}

/**
 * Initializes an ajax queue with GET request for the given URL with the given
 * queue name
 * 
 * <p>
 * Requests with the same queue name are processes synchronously one after the
 * other. This method is used by widgets
 * </p>
 * 
 * @param queueName
 *            Name of the queue
 * @param url
 *            URL to make request
 * @param dataType
 *            Type of data to be retrieved
 * @param successcallback
 *            Function to be executed on success
 * @param errorCallback
 *            Function to be executed on error
 */
function queueGetRequest(queueName, url, dataType, successCallback, errorCallback)
{
	// Loads ajaxq to initialize queue
	head.js('/js/lib/ajaxm/ajaxq.js', function()
	{
		/*
		 * Initialize a queue, with GET request
		 */
		$.ajaxq(queueName, { url : url, cache : false, dataType : dataType,

		// function to be executed on success, if successCallback is defined
		success : function(data)
		{
			if (successCallback && typeof (successCallback) === "function")
				successCallback(data);
		},

		// function to be executed on success, if errorCallback is defined
		error : function(data)
		{
			if (errorCallback && typeof (errorCallback) === "function")
				errorCallback(data);
		},

		// function to be executed on completion of queue
		complete : function(data)
		{
			console.log('completed get');
		}, });
	});
}

/**
 * Initializes an ajax queue with POST request for the given URL with the given
 * queue name
 * 
 * <p>
 * Requests with the same queue name are processes synchronously one after the
 * other. This method is used by widgets
 * </p>
 * 
 * @param queueName
 *            Name of the queue
 * @param url
 *            URL to make request
 * @param dataType
 *            Type of data to be retrieved
 * @param successcallback
 *            Function to be executed on success
 * @param errorCallback
 *            Function to be executed on error
 */
function queuePostRequest(queueName, url, data, successcallback, errorCallback)
{
	// Loads ajaxq to initialize queue
	head.js('/js/lib/ajaxm/ajaxq.js', function()
	{
		/*
		 * Initialize a queue, with POST request
		 */
		$.ajaxq(queueName, { type : 'POST', url : url, cache : false, data : data,

		// function to be executed on success, if successCallback is defined
		success : function(data)
		{
			if (successcallback && typeof (successcallback) === "function")
				successcallback(data);
		},

		// function to be executed on success, if errorCallback is defined
		error : function(data)
		{
			if (errorCallback && typeof (errorCallback) === "function")
				errorCallback(data);
		},

		// function to be executed on completion of queue
		complete : function(data)
		{
			console.log('completed post');
		} });
	});
}

/**
 * Shrink the widget header name width
 * 
 * <p>
 * Shows the icons and decrease the width of widget header to avoid the widget
 * name overflow on mouse hover
 * 
 * @param el
 *            Element on which mouse entered (widget header)
 */
function showIcons(el)
{
	// Shows widget icons on hover
	$(el).find('div.widget_header_icons').show();

	// Changes width of widget name
	$(el).find('div.widget_header_name').css({ "width" : "40%" });
}

/**
 * Expand the widget header name width.
 * 
 * <p>
 * Hide the icons and use the remaining width in widget header name DIV on mouse
 * leave
 * </p>
 * 
 * @param el
 *            Element on which mouse left (widget header)
 */
function hideIcons(el)
{
	// Hide widget icons on hover
	$(el).find('div.widget_header_icons').hide();

	// Changes width of widget name
	$(el).find('div.widget_header_name').css({ "width" : "80%" });
}
