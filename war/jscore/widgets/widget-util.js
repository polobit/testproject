$(function()
{
	$("#widget-prefs-save").die().live('click', function(e){
		e.preventDefault();
		
		if($(this).attr('disabled') == "disabled")
			return;
		
		$(this).attr('disabled', 'disabled');
		
		
		// Read from from 
		var form = $(this).parents('form');
		
		// Gets widget object
		var data = $(form).data('widget');
		
		var form_id = $(form).attr('id');
		
		// Serializes form daa
		var form_data = serializeForm(form_id);
		
		
		
		try
		{
		
			if(data.prefs)
				data["prefs"] = JSON.parse(data["prefs"]);
			else
				data["prefs"] = {};
			
			console.log(data["prefs"]);
		}
		catch(err)
		{
		}
			
		
		// Update prefs
		$.each(form_data, function(key, value){
			data["prefs"][key] = value;
		});
		
		if(data.prefs)
		{
			data.prefs = JSON.stringify(data.prefs);
			
			update_collection_with_prefs(data);
		}
			
		
		var that =this;
		
		// Save entity
		saveEntity(data, "core/api/widgets", function(result){
			$(form).data('widget', result.toJSON());
			$(that).removeAttr('disabled');
			Backbone.history.navigate("add-widget", { trigger : true });
		})
	});
	
});

function update_collection_with_prefs(data)
{
	 if(Catalog_Widgets_View && Catalog_Widgets_View.collection)
	   {
	    var models = Catalog_Widgets_View.collection.where({ name : data["name"] });
	    if(models && models[0]){
	    	 models[0].set({ 'prefs' : data.prefs });
	    	 console.log( Catalog_Widgets_View.collection.where({ name : data["name"] })[0]);
	    }
	    
	   }
	 
	 if(Widgets_View && Widgets_View.collection)
	   {
	    var models = Widgets_View.collection.where({ name : data["name"] });
	    if(models && models[0]){
	    	 models[0].set({ 'prefs' : data.prefs });
	    	 console.log( Widgets_View.collection.where({ name : data["name"] })[0]);
	    }
	    
	   }
}

function clickdesk_save_widget_prefs()
{
	$('#save_clickdesk_prefs').unbind("click");
	
	// On click of save button, check input and save details
	$('#save_clickdesk_prefs').die().live('click', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#clickdesk_login_form")))
			return;

		// Saves ClickDesk preferences in ClickDesk widget object
		saveClickDeskWidgetPrefs();
	});
}

/**
 * Calls method in script API (agile_widget.js) to save ClickDesk preferences in
 * ClickDesk widget object
 */
function saveClickDeskWidgetPrefs()
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
	$('#freshbooks_save_token').unbind("click");
	
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
		savefreshBooksWidgetPrefs();
	});
}

/**
 * Calls method in script API (agile_widget.js) to save FreshBooks preferences
 * in FreshBooks widget object
 */
function savefreshBooksWidgetPrefs()
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
	
	$('#save_api_key').unbind("click");
	
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
		saveRaplefWidgetPrefs();
	});
}

/**
 * Calls method in script API (agile_widget.js) to save Rapleaf preferences in
 * Rapleaf widget object
 */
function saveRaplefWidgetPrefs()
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
	
	$('#save_prefs').unbind("click");

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
		saveZendeskWidgetPrefs();

	});

}

/**
 * Calls method in script API (agile_widget.js) to save Zendesk preferences in
 * Zendesk widget object
 */
function saveZendeskWidgetPrefs()
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
		
		update_collection_with_prefs(data);
	} });

}

function show_set_up_widget(widget_name, template_id, url, model)
{
	$("#content").html(getTemplate("settings"), {});
	
	var el;
	var models;
	$('#prefs-tabs-content').html(LOADING_HTML);
	if(model)
		el = $(getTemplate("widget-settings", model));
	else
	 {
		if(!Catalog_Widgets_View)
		{
			$.getJSON('core/api/widgets/'+ widget_name, function(data){
				show_set_up_widget(widget_name, template_id, url, data);
			})
			return;
		}
			
		models= Catalog_Widgets_View.collection.where({ name : widget_name });
		el = $(getTemplate("widget-settings", models[0].toJSON()));
	 }
	
	console.log(el);
	
	if (widget_name == "Zendesk")
		zendesk_save_widget_prefs();

	else if (widget_name == "ClickDesk")
		clickdesk_save_widget_prefs();

	else if (widget_name == "FreshBooks")
		freshbook_save_widget_prefs();

	else if (widget_name == "Rapleaf")
		rapleaf_save_widget_prefs();
	
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

	

}

function set_up_access(widget_name, template_id, data, url, model)
{
 $("#content").html(getTemplate("settings"), {});
 
 var el;
 var json;
 $('#prefs-tabs-content').html(LOADING_HTML);
 if(model)
 {
  el = $(getTemplate("widget-settings", model));
  json = model;
 }
 else
  {
	 if(!Catalog_Widgets_View)
		{
			$.getJSON('core/api/widgets/'+ widget_name, function(data1){
				set_up_access(widget_name, template_id, data, url, data1)
			})
			return;
		}
	 
  models= Catalog_Widgets_View.collection.where({ name : widget_name });
  json = models[0].toJSON();
  el = $(getTemplate("widget-settings",json));
  }
 
 if(json.name == "Twilio")
  json['outgoing_numbers'] = data;
 
 else if(json.name == "Linkedin" || json.name == "Twitter")
  json['profile'] = data;
 
 else
  json['custom_data'] = data;
 
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
	
	show_set_up_widget(widget_name, template_id);
	
	if(model && model.get("prefs"))
	{
		var prefsJSON = JSON.parse(model.get("prefs"));
		fill_fields(prefsJSON);
	}
}

function fill_fields(fieldsJSON)
{
	for (i in fieldsJSON)
		$("#" + i).val(fieldsJSON[i]);
}



