//Helps to know that widget is for all users.
var isForAll = false;

function initializeTabListeners(localStorageItem, navigateURL){
	$("#prefs-tabs-content .widgets_inner ul li").off("click");
	$("#prefs-tabs-content").on("click",".tab-container ul li",function(){
		var temp = $(this).find("a").attr("href").split("#");
		if(islocalStorageHasSpace())
			localStorage.setItem(localStorageItem, temp[1]);
		Backbone.history.navigate(navigateURL, { trigger : true });
	});
}

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
			var displayName;
			if(pluginName  == "Rapleaf"){
				displayName = "Towerdata"
			}else if(pluginName == "HelpScout"){
				displayName = "Help Scout"
			}else if(pluginName == "TwilioIO"){
				displayName = "Twilio";
			}else{
				displayName = pluginName;
			}

			var msgType = "success";
			var msg = displayName+" widget saved successfully";

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
					globalCallWidgetSet();
				}

				if (pluginName == "TwilioIO") {
					Twilio_Setup_Called = false;
					// Get widget, Create token and set twilio device
					globalTwilioIOSetup();
					globalCallWidgetSet();
				}

				if (pluginName == "Bria"){
					globalCallWidgetSet();
				}
				
				if (pluginName == "Skype"){
					globalCallWidgetSet();
				}

			}else{
				msgType = "error";
				msg = ("Error occurred while saving "+displayName);
			}

			// if (pluginName != "CallScript")
			showNotyPopUp(msgType , msg, "bottomRight");

			if (callback && typeof (callback) === "function") {
				callback(data);
			}

		}, error : function(data){
			console.log(data);
			alert("error occurred"+data);
		}
	});
}

function setUpError(widget_name, template_id, error_data, error_url, model) {

	$("#content").html(getTemplate("settings"), {});

	var el;
	var models;
	var json;

	if (model) {
		el = $(getTemplate("widget-settings", model));
		json = model;
	} else {

		if (!App_Widgets.Catalog_Widgets_View
				|| App_Widgets.Catalog_Widgets_View.collection.length == 0) {

						if(callback)
			 				callback(el);

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
}

function set_up_access(widget_name, template_id, data, url, model){
	getTemplate('settings', {}, undefined, function(template_ui){
 		if(!template_ui)
    		return;
		$('#content').html($(template_ui)); 
		var el;
		var json;
		var models;

		$('#prefs-tabs-content').html(getRandomLoadingImg());
		$('#PrefsTab .select').removeClass('select');
		$('.add-widget-prefs-tab').addClass('select');

		if (model){
			getTemplate('widget-settings', model, undefined, function(template_ui1){
		 		if(!template_ui1)
		    		return;
				el = $(template_ui1);
				var widgetTab = localStorage.getItem("widget_tab");
				el.find('a[href="#'+widgetTab+'"]').closest("li").addClass("active");
				initializeTabListeners("widget_tab", "add-widget");
				json = model; 
				setup_widget_revoke_access(el, json, data, widget_name, template_id, url, model);
			}, null);

			return;
		} else {

			$('#widget-settings', el).html(getTemplate(template_id, json));

			App_Widgets.Catalog_Widgets_View = new Base_Collection_View({ url : '/core/api/widgets/default' });

			$('#prefs-tabs-content').find('form').data('widget', json);

			$.getJSON('core/api/widgets/' + widget_name, function(data1){
				set_up_access(widget_name, template_id, data, url, data1)
			});
			
		} 
	});
}

function addWidgetProfile(widgetId, widgetName, template, url) {
	loadSettingsUI(function() {

		// Get route model
		getWidgetModelFromName(widgetId, "", function(model) {
				$.getJSON((url), function(data) {

					getTemplate(
							"widget-settings", model, undefined, function(widget_el){

					$('#prefs-tabs-content')
							.html(widget_el);

					// Loading GooglePlus profile
					if (widgetName == "GooglePlus") {
						var widgetPrefGP = JSON.parse(model.prefs);
						$.getJSON("https://www.googleapis.com/plus/v1/people/me?access_token="+ widgetPrefGP['access_token']).success(function(userData) { 
							model["profile"] = userData;
							// Create a view modal for widgets
							renderWidgetView(template, url, model, '#widget-settings');
							return;
						}).error(function() { 
							model["profile"] = {};
							// Create a view modal for widgets
							renderWidgetView(template, url, model, '#widget-settings');
							return;
						});
						return;
						// Loading Stripe profile
					} else if (widgetName == "Stripe") {
						console.log('stripe add widget');
						console.log(model);
					
						if(model)
						model["prefs"] = JSON.parse(model["prefs"]);

						$.getJSON("core/api/custom-fields/type/scope?scope=CONTACT&type=TEXT", function(data) {
							model["custom_data"] = data;

							// Create a view modal for widgets
							renderWidgetView(template, url, model, '#widget-settings');
							return;

						});
						model["profile"] = jQuery.parseJSON(model.prefs);
					} else {

						if (data) {
							if($.isArray(data)){
								model["profile"] = jQuery.parseJSON(model.prefs);
							}else{
								try{
									data.prefs = jQuery.parseJSON(data.prefs);
								}catch(e){
									console.log("Error occured while parsing widget prefs");
								}
								model["profile"] = data;
							}
						}
					}
					
					// Create a view modal for widgets
					renderWidgetView(template, url, model, '#widget-settings');
					
				});								
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

			getTemplate("widget-settings", model, undefined, function(widget_el){
				$('#prefs-tabs-content').html(widget_el);

				// Create a view modal for widgets
				renderWidgetView(template, 'core/api/widgets',model, '#widget-settings');
			});

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
			
			if (model.name == "TwilioIO" && model.is_added) {
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
