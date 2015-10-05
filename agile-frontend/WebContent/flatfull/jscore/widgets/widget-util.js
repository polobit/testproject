//Helps to know that widget is for all users.
var isForAll = false;

function update_collection_with_prefs(data) {
	console.log("In update_collection_with_prefs");
	console.log(data);
	if (App_Widgets.Catalog_Widgets_View
			&& App_Widgets.Catalog_Widgets_View.collection) {
		var models = App_Widgets.Catalog_Widgets_View.collection.where({
			name : data["name"]
		});
		if (models && models[0]) {
			models[0].set({
				'prefs' : data.prefs
			});
			console.log(App_Widgets.Catalog_Widgets_View.collection.where({
				name : data["name"]
			})[0]);
		}

	}

	if (Widgets_View && Widgets_View.collection) {
		var models = Widgets_View.collection.where({
			name : data["name"]
		});
		if (models && models[0]) {
			models[0].set({
				'prefs' : data.prefs
			});
			console.log(Widgets_View.collection.where({
				name : data["name"]
			})[0]);
		}

	}
}

function save_widget_prefs(pluginName, prefs, callback) {
	console.log("In save_widget_prefs.");
	/*
	 * Get widget model from collection based on the name attribute of the
	 * widget model
	 */
	var models = App_Widgets.Catalog_Widgets_View.collection.where({
		name : pluginName
	});

	/*
	 * Saves widget model and on success navigate back to contact detailed view
	 */
	var widgetModel = new Backbone.Model();

	console.log(widgetModel);

	// URL to connect with widgets
	widgetModel.url = '/core/api/widgets';
	models[0].set('prefs', prefs);
	models[0].set('isForAll', isForAll);

	widgetModel.save(models[0].toJSON(), {
		success : function(data) {
			// Checks if Widget_View is defined and adds
			// widget to collection
			if (Widgets_View && Widgets_View.collection) {
				Widgets_View.collection.add(new BaseModel(data.toJSON()));
			}

			data.set('is_added', true);
			models[0].set(data);
			var widgetID = data.id;
			if(widgetID){

				// If plugin name is CallScript do not redirect
				if (pluginName != "CallScript") {
					window.location.href = ("#" + pluginName + "/" + data.id);
				}

				console.log("data******");
				console.log(data);

				update_collection_with_prefs(data);

				if (pluginName == "Sip") {
					// Stop old stack.
					if (Sip_Start == true) {
						Sip_Updated = true;
						sipUnRegister();
					}
					// Register on Sip.
					sipStart();
				}

				if (pluginName == "TwilioIO") {
					Twilio_Setup_Called = false;
					// Get widget, Create token and set twilio device
					globalTwilioIOSetup();
				}
				showNotyPopUp("success", (pluginName+" widget saved successfully"), "bottomRight");
			}else{
				showNotyPopUp("error", ("Error occurred while saving "+pluginName), "bottomRight");
			}

			if (callback && typeof (callback) === "function") {
				callback(data);
			}

		}
	});
}

function setUpError(widget_name, template_id, error_data, error_url, model) {

	$("#content").html(getTemplate("settings"), {});

	var el;
	var models;
	var json;

	$('#prefs-tabs-content').html(getRandomLoadingImg());
	$('#PrefsTab .select').removeClass('select');
	$('.add-widget-prefs-tab').addClass('select');

	if (model) {
		el = $(getTemplate("widget-settings", model));
		json = model;
	} else {

		if (!App_Widgets.Catalog_Widgets_View
				|| App_Widgets.Catalog_Widgets_View.collection.length == 0) {

			App_Widgets.Catalog_Widgets_View = new Base_Collection_View({ url : '/core/api/widgets/default' });

			// Fetch the list of widgets
			App_Widgets.Catalog_Widgets_View.collection.fetch({ success : function() {
					$.getJSON('core/api/widgets/' + widget_name,function(data1) {
						setUpError(widget_name, template_id,
								error_data, error_url, data1)
					});
				}
			});
			return;
		}

		models = App_Widgets.Catalog_Widgets_View.collection.where({
			name : widget_name
		});
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


function addWidgetProfile(widgetId, widgetName, template, url) {
	loadSettingsUI(function() {

		// Get route model
		getWidgetModelFromName(widgetId, "", function(model) {
				$.getJSON((url + widgetId), function(data) {
					var widget_el = getTemplate(
							"widget-settings", model);
					$('#prefs-tabs-content')
							.html(widget_el);

					if (data) {
						model["profile"] = data;
					} else {

						// Loading GooglePlus profile
						if (widgetName == "GooglePlus") {
							var widgetPrefGP = JSON.parse(model.prefs);
							$.getJSON("https://www.googleapis.com/plus/v1/people/me?access_token="+ widgetPrefGP['access_token'], function(userData) {
								model["profile"] = userData;

								// Create a view modal for widgets
								renderWidgetView(template, url,model, '#widget-settings');
								return;
							});
							return;
							// Loading Stripe profile
						} else if (widgetName == "Stripe") {
							$.getJSON("core/api/custom-fields/type/scope?scope=CONTACT&type=TEXT", function(data) {
								model["custom_data"] = data;

								// Create a view modal for widgets
								renderWidgetView(template, url,model, '#widget-settings');
								return;

							});
							model["profile"] = jQuery.parseJSON(model.prefs);
						} else {
							model["profile"] = jQuery.parseJSON(model.prefs);
						}
					}

					// Create a view modal for widgets
					renderWidgetView(template, url,model, '#widget-settings');
					
				});
		});
	});

}

// 
function addOAuthWidget(widgetName, template, url) {
	loadSettingsUI(function() {

		// Get route model
		getWidgetModelFromName(widgetName, "name", function(model) {

			if (model) {
				model["url"] = url;
			}

			var widget_el = getTemplate("widget-settings", model);
			$('#prefs-tabs-content').html(widget_el);

			// Create a view modal for widgets
			renderWidgetView(template, 'core/api/widgets',model, '#widget-settings');

		});

	});
}

/**
 * Add model widget.
 */
function addConfigurableWidget(widgetId, widgetName, templateName) {

	loadSettingsUI(function() {

		var type = "";
		var selector = "";

		if (!widgetId) {
			type = "name";
			selector = widgetName;
		} else {
			selector = widgetId;
		}

		// Get route model
		getWidgetModelFromName(selector, type, function(model) {

			var widget_el = getTemplate("widget-settings", model);
			$('#prefs-tabs-content').html(widget_el);

			// Create a view modal for widgets
			renderWidgetView(templateName, 'core/api/widgets',model, '#widget-settings');
			
			if (model.name == "TwilioIO") {
				fill_twilioio_numbers();
			}

		});

	});
}

function loadSettingsUI(callback) {
	getTemplate('settings', {}, undefined, function(template_ui) {
		if (!template_ui)
			return;

		$('#content').html($(template_ui));
		$('#prefs-tabs-content').html(getRandomLoadingImg());

		$('#PrefsTab .select').removeClass('select');
		$('.add-widget-prefs-tab').addClass('select');

		if (callback)
			callback();

	}, "#content");

}

function getWidgetModelFromName(widgetId, type, callback) {

	getAgileConfiguredWidgetCollection(function(widgetCollection) {

		var model = "";
		if (type == "name") {
			models = widgetCollection.where({ name : widgetId });
			model = models[0];
		} else {
			model = widgetCollection.get(widgetId);
		}

		if (!model) {
			Backbone.history.navigate('add-widget', { trigger : true });
			return;
		}
		callback(model.toJSON());
	});
}

function deserializeWidget(widget, el) {

	if (!widget.prefs){
		return;
	}

	deserializeForm(JSON.parse(widget.prefs), $(el).find("form"));
}