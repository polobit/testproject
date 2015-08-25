function initializeWidgetUtilListeners(){
	
}

$(function(){
	
	$('#content').on('click', '#widget-prefs-save', function(e)
	{
		e.preventDefault();

		if ($(this).attr('disabled') == "disabled")
			return;

		$(this).attr('disabled', 'disabled');

		// Read from from
		var form = $(this).parents('form');

		// Gets widget object
		var data = $(form).data('widget');

		var form_id = $(form).attr('id');

		if (!isValidForm($(form)))
		{
			$(this).removeAttr('disabled')
			return;
		}

		// Serializes form daa
		var form_data = serializeForm(form_id);

		try
		{

			if (data.prefs)
				data["prefs"] = JSON.parse(data["prefs"]);
			else
				data["prefs"] = {};

			console.log(data["prefs"]);
		}
		catch (err)
		{
		}

		// Update prefs
		$.each(form_data, function(key, value)
		{
			data["prefs"][key] = value;
		});

		if (data.prefs)
		{
			data.prefs = JSON.stringify(data.prefs);

			update_collection_with_prefs(data);
		}

		var that = this;

		// Save entity
		saveEntity(data, "core/api/widgets", function(result)
		{
			$(form).data('widget', result.toJSON());
			$(that).removeAttr('disabled');
			Backbone.history.navigate("add-widget", { trigger : true });
		})
	});

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

function clickdesk_save_widget_prefs()
{
	$('#save_clickdesk_prefs').unbind("click");

	// On click of save button, check input and save details
	$('body').on('click', '#save_clickdesk_prefs', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#clickdesk_login_form")))
			return;

		// Saves ClickDesk preferences in ClickDesk
		// widget object
		saveClickDeskWidgetPrefs();
	});
}

/**
 * Calls method in script API (agile_widget.js) to save ClickDesk preferences in
 * ClickDesk widget object
 */
function saveClickDeskWidgetPrefs()
{
	// Retrieve and store the ClickDesk preferences entered by the
	// user as JSON
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

function helpscout_save_widget_prefs()
{
	$('#save_api_key').unbind("click");

	// Saves the API key
	$('body').on('click', '#save_api_key', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#helpscout_login_form")))
		{
			return;
		}

		// Saves HelpScout preferences in HelpScout
		// widget object
		saveHelpScoutWidgetPrefs();
	});

}

/**
 * Calls method in script API (agile_widget.js) to save HelpScout preferences in
 * HelpScout widget object
 */
function saveHelpScoutWidgetPrefs()
{
	// Retrieve and store the HelpScout API key entered by the user
	var HelpScout_prefs = {};
	HelpScout_prefs["helpscout_api_key"] = $("#helpscout_api_key").val();

	// Saves the preferences into widget with Rapleaf widget name
	save_widget_prefs("HelpScout", JSON.stringify(HelpScout_prefs), function(data)
	{
		console.log('In HelpScout save success');
		console.log(data);
	});
}

function freshbook_save_widget_prefs()
{
	$('#freshbooks_save_token').unbind("click");

	// On click of save button, check input and save details
	$('body').on('click', '#freshbooks_save_token', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#freshbooks_login_form")))
		{
			return;
		}

		// Saves FreshBooks preferences in FreshBooks
		// widget object
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
	$('body').on('click', '#save_api_key', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#rapleaf_login_form")))
		{
			return;
		}

		// Saves Rapleaf preferences in Rapleaf widget
		// object
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
	$('body').on('click', '#save_prefs', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		try{
			if (!isValidForm($("#zendesk_login_form")))
			{
				return;
			}

		}catch(err){
			return;
		}
		
		// Saves Zendesk preferences in ClickDesk widget
		// object
		saveZendeskWidgetPrefs();

	});

}

/**
 * Calls method in script API (agile_widget.js) to save Zendesk preferences in
 * Zendesk widget object
 */
function saveZendeskWidgetPrefs()
{
	// Retrieve and store the Zendesk preferences entered by the
	// user as JSON
	var zendesk_prefs = {};
	zendesk_prefs["zendesk_username"] = $("#zendesk_username").val();
	zendesk_prefs["zendesk_password"] = $("#zendesk_password").val();
//	zendesk_prefs["zendesk_url"] = $("#zendesk_url").val();
	
    var zenDeskURL = $("#zendesk_url").val();
    if(zenDeskURL.indexOf("https") == -1) {//if not found
    	zenDeskURL = zenDeskURL.replace("http", "https");
    }
    zendesk_prefs["zendesk_url"] = zenDeskURL;

	// Saves the preferences into widget with zendesk widget name
	save_widget_prefs("Zendesk", JSON.stringify(zendesk_prefs), function(data)
	{
		console.log('In zendesk save success');
		console.log(data);
	});
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
 * Shows setup if user adds TwilioIO widget for the first time or clicks on
 * reset icon on TwilioIO panel in the UI
 * 
 */
function twilioio_save_widget_prefs()
{

	$('#save_prefs').unbind("click");

	// On click of save button, check input and save details
	$('body').on('click', '#save_prefs', function(e)
	{
		e.preventDefault();

		$("#error-number-not-selected").hide();

		if ($(this).text() == "Saving..." || $(this).text() == "Loading...")
		{
			console.log("Do not hit me again " + $(this).text());
			return;
		}

		// Checks whether all input fields are given
		try{
			if (!isValidForm($("#twilioio_login_form")))
			{
				return;
			}
		}catch(err){
			return;
		}
		

		if ($("#twilio_from_numbers option:selected").val() == "" && $("#twilio_numbers option:selected").val() == "")
		{
			$("#error-number-not-selected").show();
			return;
		}

		// Saves twilioio preferences in ClickDesk widget object
		saveTwilioIOWidgetPrefs();

	});

}

/**
 * Calls method in script API (agile_widget.js) to save TwilioIO preferences in
 * TwilioIO widget object
 */
function saveTwilioIOWidgetPrefs()
{
	$("#save_prefs").text("Saving...");
	$("#save_prefs").attr("disabled", true);

	// Retrieve and store the TwilioIO preferences entered by the user as JSON
	var twilioio_prefs = {};
	twilioio_prefs["twilio_acc_sid"] = $("#twilio_acc_sid").val();
	twilioio_prefs["twilio_auth_token"] = $("#twilio_auth_token").val();
	twilioio_prefs["twilio_from_number"] = $("#twilio_from_numbers option:selected").val();
	twilioio_prefs["twilio_number"] = $("#twilio_numbers option:selected").val();
	twilioio_prefs["twilio_number_sid"] = $("#twilio_number_sid").val();
	twilioio_prefs["twilio_twimlet_url"] = $("#twilio_twimlet_url").val();
	
	if ($('#twilio_record').is(':checked'))
		twilioio_prefs["twilio_record"] = "true";
	else
		twilioio_prefs["twilio_record"] = "false";

	console.log(twilioio_prefs);

	// Create application and update twilio number setting (add url)
	// twilioio_prefs["twilio_app_sid"] = createAppSid(twilioio_prefs);

	createAppSid(twilioio_prefs, function(data)
	{
		twilioio_prefs["twilio_app_sid"] = data;
		console.log(twilioio_prefs);

		// Saves the preferences into widget with sip widget name
		save_widget_prefs("TwilioIO", JSON.stringify(twilioio_prefs), function(data)
		{
			console.log('In TwilioIO save success');
			console.log(data);
		});
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

	widgetModel.save(models[0].toJSON(), { success : function(data)
	{
		// Checks if Widget_View is defined and adds
		// widget to collection
		if (Widgets_View && Widgets_View.collection)
			Widgets_View.collection.add(new BaseModel(data.toJSON()));

		data.set('is_added', true);
		models[0].set(data);
		
		// If plugin name is CallScript do not redirect
		if (pluginName != "CallScript")
		window.location.href = "#add-widget";

		console.log("data******");
		console.log(data);

		update_collection_with_prefs(data);

		if (pluginName == "Sip")
		{
			// Stop old stack.
			if (Sip_Start == true)
			{
				Sip_Updated = true;
				sipUnRegister();
			}

			// Register on Sip.
			sipStart();
		}

		if (pluginName == "TwilioIO")
		{
			Twilio_Setup_Called = false;

			// Get widget, Create token and set twilio device
			globalTwilioIOSetup();
		}
		
		if (callback && typeof (callback) === "function")
			callback(data);
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

	if (widget_name == "Zendesk")
		zendesk_save_widget_prefs();

	else if (widget_name == "ClickDesk")
		clickdesk_save_widget_prefs();

	else if (widget_name == "HelpScout")
		helpscout_save_widget_prefs();

	else if (widget_name == "FreshBooks")
		freshbook_save_widget_prefs();

	else if (widget_name == "Rapleaf")
		rapleaf_save_widget_prefs();

	else if (widget_name == "Sip")
		sip_save_widget_prefs();

	else if (widget_name == "TwilioIO")
		twilioio_save_widget_prefs();

	else if (widget_name == "QuickBooks")
		quickBooks_save_widget_prefs();

	else if (widget_name == "Chargify")
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

	$('body').on('click', '.revoke-widget', function(e)
	{

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

function xero_save_widget_prefs()
{
	$('#xero_save_token').unbind("click");
	
	// On click of save button, check input and save details
	$('body').on('click', '#xero_save_token', function(e)
	{
		e.preventDefault();

		// Retrieve and store the ClickDesk preferences
		// entered by the user as
		// JSON
		var Xero_prefs = {};

		// Saves the preferences into widget with
		// ClickDesk widget name
		save_widget_prefs("Xero", JSON.stringify(Xero_prefs), function(data)
		{
			console.log('In xero save success');
			console.log(data);
		});
	});
}

function quickBooks_save_widget_prefs(template_id, url)
{
	head.js('https://appcenter.intuit.com/Content/IA/intuit.ipp.anywhere.js', function()
	{
		$('#widget-settings', el).html(getTemplate(template_id, { "url" : url }));
		console.log(el);
		intuit.ipp.anywhere.setup({ menuProxy : 'http://example.com/myapp/BlueDotMenu', grantUrl : url });
	});

}
function chargify_save_widget_prefs()
{
	$('#chargify_save_api_key').unbind("click");

	// Saves the API key
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
