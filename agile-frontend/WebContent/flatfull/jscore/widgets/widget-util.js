//Helps to know that widget is for all users.
var isForAll = false;

function initializeWidgetUtilListeners(){
	
}

$(function(){
	
});

function update_collection_with_prefs(data)
{
	console.log("In update_collection_with_prefs");
	console.log(data);
	if (App_Widgets.Catalog_Widgets_View && App_Widgets.Catalog_Widgets_View.collection)
	{
		var models = App_Widgets.Catalog_Widgets_View.collection.where({ name : data["name"] });
		if (models && models[0])
		{
			models[0].set({ 'prefs' : data.prefs });
			console.log(App_Widgets.Catalog_Widgets_View.collection.where({ name : data["name"] })[0]);
		}

	}

	if (Widgets_View && Widgets_View.collection)
	{
		var models = Widgets_View.collection.where({ name : data["name"] });
		if (models && models[0])
		{
			models[0].set({ 'prefs' : data.prefs });
			console.log(Widgets_View.collection.where({ name : data["name"] })[0]);
		}

	}
}

/**
 * Shows setup if user adds Sip widget for the first time or clicks on reset
 * icon on Sip panel in the UI
 * 
 */
function sip_save_widget_prefs()
{

	$('#save_prefs').unbind("click");

	// On click of save button, check input and save details
    $('body').off('click', '#save_prefs');
	$('body').on('click', '#save_prefs', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		try{
			if (!isValidForm($("#sip_login_form")))
					{
						return;
					}			
		}catch(err){
			return;
		}
		
		// Saves Sip preferences in ClickDesk widget
		// object
		saveSipWidgetPrefs();

	});

}

/**
 * Calls method in script API (agile_widget.js) to save Sip preferences in Sip
 * widget object
 */
function saveSipWidgetPrefs()
{
	// Retrieve and store the Sip preferences entered by the user as
	// JSON
	var sip_prefs = {};
	sip_prefs["sip_username"] = $("#sip_username").val();
	sip_prefs["sip_privateid"] = $("#sip_privateid").val();
	sip_prefs["sip_realm"] = $("#sip_realm").val();
	sip_prefs["sip_password"] = $("#sip_password").val();

	sip_prefs["sip_publicid"] = "sip:" + $("#sip_privateid").val() + "@" + $("#sip_realm").val();

	if ($('#sip_wsenable').is(':checked'))
		sip_prefs["sip_wsenable"] = "true";
	else
		sip_prefs["sip_wsenable"] = "false";

	console.log(sip_prefs);

	// Saves the preferences into widget with sip widget name
	save_widget_prefs("Sip", JSON.stringify(sip_prefs), function(data)
	{
		console.log('In sip save success');
		console.log(data);
	});
}

/**
 * Shows setup if user adds call script widget for the first time or clicks on
 * reset icon on call script panel in the UI
 * 
 */
function callscript_save_widget_prefs()
{
	$('#save_prefs').unbind("click");

	// On click of save button, check input and save details
    $('body').off('click', '#save_prefs');
	$('body').on('click', '#save_prefs', function(e)
	{
		e.preventDefault();		

		if ($(this).text() == "Saving..." || $(this).text() == "Loading...")
		{
			console.log("Do not hit me again " + $(this).text());
			return;
		}

		// Checks whether all input fields are given
		try{
			if (!isValidForm($("#callscriptruleForm")))
			{
				return;
			}
		}catch(err){
			return;
		}
				

		// Saves call script preferences in callscript widget object
		saveCallScriptWidgetPrefs();
	});
}

/**
 * Calls method in script API (agile_widget.js) to save CallScript preferences in
 * CallScript widget object
 */
function saveCallScriptWidgetPrefs()
{
	$("#save_prefs").text("Saving...");
	$("#save_prefs").attr("disabled", true);
	
	// Retrieve and store the Sip preferences entered by the user as
	// JSON
	var callscript_prefs = makeRule();	
	
	console.log(callscript_prefs);

	// Saves the preferences into widget with sip widget name
	save_widget_prefs("CallScript", JSON.stringify(callscript_prefs), function(data)
	{
		console.log('In call script save success');
		console.log(data);		
		
		// Redirect to show call script rules page
		window.location.href = "#callscript/rules";
	});	
}

function save_widget_prefs(pluginName, prefs, callback)
{
	console.log("In save_widget_prefs.");
	/*
	 * Get widget model from collection based on the name attribute of the
	 * widget model
	 */
	var models = App_Widgets.Catalog_Widgets_View.collection.where({ name : pluginName });

	/*
	 * Saves widget model and on success navigate back to contact detailed view
	 */
	var widgetModel = new Backbone.Model();

	console.log(widgetModel);

	// URL to connect with widgets
	widgetModel.url = '/core/api/widgets';
	models[0].set('prefs', prefs);
	models[0].set('isForAll', isForAll);

	widgetModel.save(models[0].toJSON(), { success : function(data)
	{
		// Checks if Widget_View is defined and adds
		// widget to collection
		if (Widgets_View && Widgets_View.collection){
			Widgets_View.collection.add(new BaseModel(data.toJSON()));
		}

		data.set('is_added', true);
		models[0].set(data);
		
		// If plugin name is CallScript do not redirect
		if (pluginName != "CallScript"){
			window.location.href = ("#"+pluginName+"/"+data.id);
		}
		

		console.log("data******");
		console.log(data);

		update_collection_with_prefs(data);

		if (pluginName == "Sip"){
			// Stop old stack.
			if (Sip_Start == true){
				Sip_Updated = true;
				sipUnRegister();
			}
			// Register on Sip.
			sipStart();
		}

		if (pluginName == "TwilioIO"){
			Twilio_Setup_Called = false;
			// Get widget, Create token and set twilio device
			globalTwilioIOSetup();
		}
		
		if (callback && typeof (callback) === "function"){
			callback(data);
		}

	} });
}

function show_set_up_widget(widget_name, template_id, url, model)
{
	$("#content").html(getTemplate("settings"), {});

	var el;
	var models;
	$('#prefs-tabs-content').html(getRandomLoadingImg());
	initializeWidgetUtilListeners();

	if (model)
	{
		console.log(model)
		el = $(getTemplate("widget-settings", model));
	}
	else
	{
		if (!App_Widgets.Catalog_Widgets_View || App_Widgets.Catalog_Widgets_View.collection.length == 0)
		{
			App_Widgets.Catalog_Widgets_View = new Base_Collection_View({ url : '/core/api/widgets/default' });

			// Fetch the list of widgets
			App_Widgets.Catalog_Widgets_View.collection.fetch({ success : function()
			{

				$.getJSON('core/api/widgets/' + widget_name, function(data)
				{
					show_set_up_widget(widget_name, template_id, url, data);
				});
			} });
			return;
		}
		models = App_Widgets.Catalog_Widgets_View.collection.where({ name : widget_name });

		el = $(getTemplate("widget-settings", models[0].toJSON()));
	}
	console.log(el);

	if (widget_name == "Chargify")
		chargify_save_widget_prefs();

	else if (widget_name == "CallScript")
		callscript_save_widget_prefs();

	// Shows available widgets in the content
	if (url)
	{
		$('#widget-settings', el).html(getTemplate(template_id, { "url" : url }));
		console.log(el);
	}
	else
	{
		if (widget_name == "Shopify" && (model || models[0].attributes.id))
		{
			if (model)
			{
				$('#widget-settings', el).html(getTemplate(template_id, { "data" : jQuery.parseJSON(model.prefs) }));
			}
			else if (models[0].attributes.id)
			{
				$('#widget-settings', el).html(getTemplate(template_id, { "data" : jQuery.parseJSON(models[0].attributes.prefs) }));
			}
		}
		else
		{
			$('#widget-settings', el).html(getTemplate(template_id, {}));
			console.log(el);
		}
	}
	$('#prefs-tabs-content').html(el);
	$('#PrefsTab .select').removeClass('select');
	$('.add-widget-prefs-tab').addClass('select');
}

function set_up_access(widget_name, template_id, data, url, model)
{
	$("#content").html(getTemplate("settings"), {});

	var el;
	var json;
	var models;

	$('#prefs-tabs-content').html(getRandomLoadingImg());
	$('#PrefsTab .select').removeClass('select');
	$('.add-widget-prefs-tab').addClass('select');

	if (model)
	{
		el = $(getTemplate("widget-settings", model));
		json = model;
	}
	else
	{

		if (!App_Widgets.Catalog_Widgets_View || App_Widgets.Catalog_Widgets_View.collection.length == 0)
		{

			App_Widgets.Catalog_Widgets_View = new Base_Collection_View({ url : '/core/api/widgets/default' });

			// Fetch the list of widgets
			App_Widgets.Catalog_Widgets_View.collection.fetch({ success : function()
			{

				$.getJSON('core/api/widgets/' + widget_name, function(data1)
				{
					set_up_access(widget_name, template_id, data, url, data1)
				});
			} });

			return;

		}

		models = App_Widgets.Catalog_Widgets_View.collection.where({ name : widget_name });
		json = models[0].toJSON();
		el = $(getTemplate("widget-settings", json));
	}

	if (json.name == "Twilio")
		json['outgoing_numbers'] = data;

	else if (json.name == "Linkedin" || json.name == "Twitter")
		json['profile'] = data;

	else
		json['custom_data'] = data;

	console.log(json);

	// merged_json = $.extend(merged_json, model, data);

	$('#widget-settings', el).html(getTemplate(widget_name.toLowerCase() + "-revoke-access", json));

	$('#prefs-tabs-content').html(el);

	$('#prefs-tabs-content').find('form').data('widget', json);
	console.log(json);
	console.log($('#prefs-tabs-content').find('form').data('widget'));

	$('#PrefsTab .select').removeClass('select');
	$('.add-widget-prefs-tab').addClass('select');

    $('body').off('click', '.revoke-widget');
	$('body').on('click', '.revoke-widget', function(e){
		console.log($(this).attr("widget-name"));
		delete_widget(widget_name);
		show_set_up_widget(widget_name, template_id, url, model);
	});

}

function fill_form(id, widget_name, template_id)
{
	console.log("In fill_form");
	console.log(id + " " + widget_name + " " + template_id);

	var model = App_Widgets.Catalog_Widgets_View.collection.get(id);
	console.log(model.get("prefs"));
	console.log(model.length);

	show_set_up_widget(widget_name, template_id);

	if (model && model.get("prefs"))
	{
		var prefsJSON = JSON.parse(model.get("prefs"));
		console.log("prefsJSON:");
		console.log(prefsJSON);
		fill_fields(prefsJSON);
	}
}

function show_shopify_prefs(id, widget_name, template_id)
{
	console.log("In show pref  setting ");
	$('#prefs-tabs-content').html(getTemplate(template_id));

}

function fill_fields(fieldsJSON)
{
	for (i in fieldsJSON)
	{
		if (i == "sip_wsenable" || i == "twilio_record")
		{
			if (fieldsJSON[i] == 'true')
				$("#" + i).attr('checked', 'checked');
		}
		else
			$("#" + i).val(fieldsJSON[i]);

	}
}

function widgetError(id, template_id, error, disable_check)
{
	// build JSON with error message
	var error_json = {};
	error_json['message'] = error;
	error_json['disable_check'] = disable_check;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	$('#' + id).html(getTemplate(template_id, error_json));

}

function setUpError(widget_name, template_id, error_data, error_url, model)
{

	$("#content").html(getTemplate("settings"), {});

	var el;
	var models;
	var json;

	$('#prefs-tabs-content').html(getRandomLoadingImg());
	$('#PrefsTab .select').removeClass('select');
	$('.add-widget-prefs-tab').addClass('select');

	if (model)
	{
		el = $(getTemplate("widget-settings", model));
		json = model;
	}
	else
	{

		if (!App_Widgets.Catalog_Widgets_View || App_Widgets.Catalog_Widgets_View.collection.length == 0)
		{

			App_Widgets.Catalog_Widgets_View = new Base_Collection_View({ url : '/core/api/widgets/default' });

			// Fetch the list of widgets
			App_Widgets.Catalog_Widgets_View.collection.fetch({ success : function()
			{

				$.getJSON('core/api/widgets/' + widget_name, function(data1)
				{
					setUpError(widget_name, template_id, error_data, error_url, data1)
				});
			} });

			return;

		}

		models = App_Widgets.Catalog_Widgets_View.collection.where({ name : widget_name });
		json = models[0].toJSON();
		el = $(getTemplate("widget-settings", json));
	}

	json['error_message'] = error_data;
	json['error_url'] = error_url;

	// merged_json = $.extend(merged_json, model, data);

	$('#widget-settings', el).html(getTemplate(template_id, json));

	$('#prefs-tabs-content').html(el);

	$('#prefs-tabs-content').find('form').data('widget', json);

	$('#PrefsTab .select').removeClass('select');
	$('.add-widget-prefs-tab').addClass('select');

}

function chargify_save_widget_prefs()
{
	$('#chargify_save_api_key').off("click");

	// Saves the API key
    $('body').off('click', '#chargify_save_api_key');
	$('body').on('click', '#chargify_save_api_key', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#chargify_login_form")))
		{
			return;
		}

		// Saves HelpScout preferences in HelpScout
		// widget object
		saveChargifyWidgetPrefs();
	});

}

/**
 * Calls method in script API (agile_widget.js) to save HelpScout preferences in
 * HelpScout widget object
 */
function saveChargifyWidgetPrefs()
{
	// Retrieve and store the HelpScout API key entered by the user
	var Chargify_prefs = {};
	Chargify_prefs["chargify_api_key"] = $("#chargify_api_key").val();
	Chargify_prefs["chargify_subdomain"] = $("#chargify_subdomain").val();

	// Saves the preferences into widget with Rapleaf widget name
	save_widget_prefs("Chargify", JSON.stringify(Chargify_prefs), function(data)
	{
		console.log('In chargify save success');
		console.log(data);
	});
}
