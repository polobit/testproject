$(function()
{
	$("#widget-prefs-save").die().live('click', function(e){
		e.preventDefault();
		
		// Read from from 
		var form = $(this).parents('form');
		
		// Gets widget object
		var data = $(form).data('widget');
		
		var form_id = $(form).attr('id');
		
		// Serializes form daa
		var form_data = serializeForm(form_id);
		if(!data.prefs)
			data["prefs"] = {};
		
		// Update prefs
		$.each(form_data, function(key, value){
			data["prefs"][key] = value;
		});
		
		if(data.prefs)
			data.prefs = JSON.stringify(data.prefs);
		
		// Save entity
		saveEntity(data, "core/api/widgets", function(data){
		})
	});
	
});



function clickdesk_save_widget_prefs()
{
	// On click of save button, check input and save details
	$('#save_clickdesk_prefs').die().live('click', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#clickdesk_login_form")))
			return;

		// Saves ClickDesk preferences in ClickDesk widget object
		saveClickDeskPrefs();
	});
}

/**
 * Calls method in script API (agile_widget.js) to save ClickDesk preferences in
 * ClickDesk widget object
 */
function saveClickDeskPrefs()
{
	// Retrieve and store the ClickDesk preferences entered by the user as JSON
	var ClickDesk_prefs = {};
	ClickDesk_prefs["clickdesk_username"] = $("#clickdesk_username").val();
	ClickDesk_prefs["clickdesk_api_key"] = $("#clickdesk_api_key").val();

	// Saves the preferences into widget with ClickDesk widget name
	save_widget_prefs("ClickDesk", JSON.stringify(ClickDesk_prefs), function(data)
	{
		console.log('In clickdesk save success');
		console.log(data);
	});
}

function freshbook_save_widget_prefs()
{
	// On click of save button, check input and save details
	$('#freshbooks_save_token').die().live('click', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#freshbooks_login_form")))
		{
			return;
		}

		// Saves FreshBooks preferences in FreshBooks widget object
		savefreshBooksPrefs();
	});
}

/**
 * Calls method in script API (agile_widget.js) to save FreshBooks preferences
 * in FreshBooks widget object
 */
function savefreshBooksPrefs()
{
	// Store the data given by the user as JSON
	var freshbooks_prefs = {};
	freshbooks_prefs["freshbooks_apiKey"] = $("#freshbooks_apiKey").val();
	freshbooks_prefs["freshbooks_url"] = $("#freshbooks_url").val();

	// Saves the preferences into widget with FreshBooks widget name
	save_widget_prefs("FreshBooks", JSON.stringify(freshbooks_prefs), function(data)
	{
		console.log('In freshbooks save success');
		console.log(data);
	});
}

function rapleaf_save_widget_prefs()
{
	// Saves the API key
	$('#save_api_key').die().live('click', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#rapleaf_login_form")))
		{
			return;
		}

		// Saves Rapleaf preferences in Rapleaf widget object
		saveRaplefPrefs();
	});
}

/**
 * Calls method in script API (agile_widget.js) to save Rapleaf preferences in
 * Rapleaf widget object
 */
function saveRaplefPrefs()
{
	// Retrieve and store the Rapleaf API key entered by the user
	var Rapleaf_prefs = {};
	Rapleaf_prefs["rapleaf_api_key"] = $("#rapleaf_api_key").val();

	// Saves the preferences into widget with Rapleaf widget name
	save_widget_prefs("Rapleaf", JSON.stringify(Rapleaf_prefs), function(data)
	{
		console.log('In Rapleaf save success');
		console.log(data);
	});
}

/**
 * Shows setup if user adds Zendesk widget for the first time or clicks on reset
 * icon on Zendesk panel in the UI
 * 
 */
function zendesk_save_widget_prefs()
{

	// On click of save button, check input and save details
	$('#save_prefs').die().live('click', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#zendesk_login_form")))
		{
			return;
		}
		// Saves Zendesk preferences in ClickDesk widget object
		saveZendeskPrefs();

	});

}

/**
 * Calls method in script API (agile_widget.js) to save Zendesk preferences in
 * Zendesk widget object
 */
function saveZendeskPrefs()
{
	// Retrieve and store the Zendesk preferences entered by the user as JSON
	var zendesk_prefs = {};
	zendesk_prefs["zendesk_username"] = $("#zendesk_username").val();
	zendesk_prefs["zendesk_password"] = $("#zendesk_password").val();
	zendesk_prefs["zendesk_url"] = $("#zendesk_url").val();

	// Saves the preferences into widget with zendesk widget name
	save_widget_prefs("Zendesk", JSON.stringify(zendesk_prefs), function(data)
	{
		console.log('In zendesk save success');
		console.log(data);
	});
}

function save_widget_prefs(pluginName, prefs, callback)
{
	/*
	 * Get widget model from collection based on the name attribute of the
	 * widget model
	 */
	var models = Catalog_Widgets_View.collection.where({ name : pluginName });

	/*
	 * Saves widget model and on success navigate back to contact detailed view
	 */
	var widgetModel = new Backbone.Model();

	console.log(widgetModel);

	// URL to connect with widgets
	widgetModel.url = '/core/api/widgets';
	models[0].set('prefs', prefs);

	widgetModel.save(models[0].toJSON(), { success : function(data)
	{
		// Checks if Widget_View is defined and adds widget to collection
		if (Widgets_View && Widgets_View.collection)
			Widgets_View.collection.add(new BaseModel(data.toJSON()));

		data.set('is_added', true);
		models[0].set(data);
		window.location.href = "#add-widget";
	} });

}

function show_set_up_widget(widget_name, template_id, url, model)
{
	$("#content").html(getTemplate("settings"), {});
	
	var el;
	var models;
	
	if(model)
		el = $(getTemplate("widget-settings", model));
	else
	 {
		models= Catalog_Widgets_View.collection.where({ name : widget_name });
		el = $(getTemplate("widget-settings", models[0].toJSON()));
	 }
	
	console.log(el);
	
	// Shows available widgets in the content
	if (url)
		{
		$('#widget-settings', el).html(getTemplate(template_id, { "url" : url }));
		console.log(el);
		}
	else
		{		
		$('#widget-settings', el).html(getTemplate(template_id, {})); 
		console.log(el);
		}
	
	$('#prefs-tabs-content').html(el);
	
	$('#PrefsTab .active').removeClass('active');
	$('.add-widget-prefs-tab').addClass('active');

	if (widget_name == "Zendesk")
		zendesk_save_widget_prefs();

	else if (widget_name == "ClickDesk")
		clickdesk_save_widget_prefs();

	else if (widget_name == "FreshBooks")
		freshbook_save_widget_prefs();

	else if (widget_name == "Rapleaf")
		rapleaf_save_widget_prefs();

}

function set_up_access(widget_name, template_id, data, url, model)
{
	$("#content").html(getTemplate("settings"), {});
	
	var el;
	var json;
	
	if(model)
	{
		el = $(getTemplate("widget-settings", model));
		model['outgoing_numbers'] = data;
		json = model;
	}
	else
	 {
		models= Catalog_Widgets_View.collection.where({ name : widget_name });
		json = models[0].toJSON();
		el = $(getTemplate("widget-settings",json));
		json['outgoing_numbers'] = data;
		
		
	 }
	console.log(json);
	
	
	//merged_json =  $.extend(merged_json, model, data);
	
	$('#widget-settings', el).html(getTemplate(widget_name.toLowerCase() + "-revoke-access", json));
	
	$('#prefs-tabs-content').html(el);
	
	$('#prefs-tabs-content').find('form').data('widget', json);
	console.log(json);
	console.log($('#prefs-tabs-content').find('form').data('widget'));

	$('#PrefsTab .active').removeClass('active');
	$('.add-widget-prefs-tab').addClass('active');

	$(".revoke-widget").die().live('click', function(e){
		
		console.log($(this).attr("widget-name"));
		delete_widget(widget_name);
		show_set_up_widget(widget_name, template_id, url, model);
	});
	
}

function fill_form(id, widget_name, template_id)
{
	var model = Catalog_Widgets_View.collection.get(id);
	console.log(model.get("prefs"));

	var prefsJSON = JSON.parse(model.get("prefs"));

	show_set_up_widget(widget_name, template_id);
	fill_fields(prefsJSON);
}

function fill_fields(fieldsJSON)
{
	for (i in fieldsJSON)
		$("#" + i).val(fieldsJSON[i]);
}


