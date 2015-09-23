/* !JSCore */
/**
 * Base_Model_View represents view specified by backbone js
 * (http://backbonejs.org/#View), It is view backed by a models, Base_Model_View
 * binds events(click on ".save" and ".delete" html elements) which represents
 * view with logical actions i.e., actions can defined to perform on an event.
 * This binds a view backbone model to view's render function on change event of
 * model, model data is show in the view (used handlebars js to fill model data
 * to template), whenever there is a change in model data, view is updated with
 * new data, since change on model is binded to render function of the view.
 * <p>
 * While creating new Base_Model_View options can be passed, so view is
 * initialized based on the options. Options processed are
 * <p>
 * data : Data should be sent in JSON format (backbone model is created based on
 * data sent).
 * <p>
 * <p>
 * model : Backbone model should be sent.
 * <p>
 * <p>
 * url : Represents url property of the model.
 * <p>
 * <p>
 * isNew : To specify model model needs to be downloaded or not.
 * <p>
 * <p>
 * Window : Specifies which window to navigate after saving the form
 * <p>
 * <p>
 * reload : Boolean value, to specify whether to reload the page after save
 * <p>
 * $el represents the html element of view
 * </p>
 */
var Base_Model_View = Backbone.View
		.extend({

			/*
			 * Events defined on the view and related function(defines action to
			 * be performed on event). ".save" and ".delete" represents html
			 * elements in current view
			 */
			events : {
				"click .save" : "save",
				"click .delete" : "deleteItem"
			},

			/**
			 * Sets options to view object(this.options), these options are
			 * passed when creating a view, in initialize function options are
			 * set to current view object. Also binds functions and model data
			 * to views.
			 */
			initialize : function() {
				/*
				 * Binds functions to current view object, every function that
				 * uses current view "this" should be bind to view
				 * object("this").
				 */
				_.bindAll(this, 'render', 'save', 'deleteItem', 'buildModelViewUI');

				/*
				 * If data is passed as an option to create a view, then
				 * backbone model object is created with data sent, data is
				 * represented as backbone model and bind to view.
				 */
				if (this.options.data != undefined)
					this.model = new Backbone.Model(this.options.data);
				/*
				 * If backbone model is passed as option the model is set to
				 * view
				 */
				else if (this.options.model)
					this.model = this.options.model;
				else
					this.model = new Backbone.Model({});

				/*
				 * Binds render function to change event on the view object
				 * which includes model object, whenever model is changed render
				 * is called to update the view.
				 */
				this.model.bind("change", this.onChange, this);
				
				this.model.bind('error', function(model, response){

					if(response.status == 401)
					{
						var hash = window.location.hash;

						// Unregister all streams on server.
						unregisterAll();
						
						// Unregister on SIP server.
						sipUnRegister();
						
						// Firefox do not support window.location.origin, so protocol is explicitly added to host
						window.location.href = window.location.protocol + "//" + window.location.host+"/login"+hash;
						return;
					}
				});

				/*
				 * Sets URL to backbone model, if url is passed when creating a
				 * view. URL specified is used to fetch, save the model
				 */
				if (this.options.url) {
					this.model.url = this.options.url;
				}

				/*
				 * If "isNew" in options is true, model is not downloaded. which
				 * represents no model data needs to be shown in the view, but
				 * can be used to save data in url set for model. If isNew is
				 * not true and model is empty data needs to be fetched
				 */
				if ((!this.options.isNew)
						&& $.isEmptyObject(this.model.toJSON())) {
					console.log("to fetch");
					/*
					 * Stores view object in temp variable, to be used in
					 * success back for fetch to call render
					 */
					var that = this;

					/*
					 * Fetches model from the url property set, on success
					 * forces render to execute to show the data fetched in
					 * view.
					 */
					this.model.fetch({
						success : function(data) {
							/*
							 * Used true argument to render (forcing render to
							 * execute and show view.), which represent data is
							 * downloaded from server, If render called out
							 * "true" argument then loading image is show
							 * instead of showing data (because Showing view
							 * without downloading data causes flash effect on
							 * page, since on change in model i.e., data fetched
							 * render is called again)
							 */
							that.render(true);
						}
					});
				}
			},

			/**
			 * Defines action for click event on html element with class
			 * ".delete" in current view object, which sends delete request to
			 * server(to URL set to model in initialize function)
			 */
			deleteItem : function(e) {
				e.preventDefault();
				
				var deleteCallback = this.options.deleteCallback;
				
				if(!confirm("Are you sure you want to delete?"))
		    		return false;
				
				/*
				 * Sends delete request, and reloads view on success
				 */
				this.model.destroy({
					success : function(model, response) {
						
						// Delete callback
						if (deleteCallback && typeof (deleteCallback) === "function") {
							
							console.log(response)
							
							// execute the callback, passing parameters as necessary
							deleteCallback(model, response);
						}
						
						location.reload(true);
					}
				});
				
			},
			/**
			 * Defines action to be performed for click event on HTML element
			 * with class ".save" in current view/template, this can be used to
			 * save the model data in the view representing a form i.e., saveS
			 * the data in form, to the URL set in model.
			 */
			save : function(e) {
				e.preventDefault();
				
				// Saves tinymce content back to 
				// textarea before form serialization
				trigger_tinymce_save();

				
				/*
				 * Gets the form id from the view, this.el represents html
				 * element of the view.
				 */
				var formId = $(this.el).find('form').attr('id');
				
				var saveCallback = this.options.saveCallback;
				
				var errorCallback = this.options.errorCallback;
				
				// Represents form element
				var $form = $('#' + formId);
				console.log($form.find('.save'));
				// Returns, if the save button has disabled attribute 
				if($(e.currentTarget).attr('disabled'))
					return;
				
								
				// Disables save button to prevent multiple click event issues
				disable_save_button($(e.currentTarget));
				
				
				// Represents validations result of the form, and json
				// represents serialized data in the form
				var isValid, json;

				/**
				 * If view contains multiple forms, then data are all the forms
				 * in the view are serialized in to a JSON object, each form
				 * data is added to json object with key name attribute of the
				 * form as follows
				 * 
				 * <pre>
				 * 		{
				 * 			primary : {key:value ....} // Data of form with name &quot;primary&quot;
				 * 			secondary : {key : value} // Data for 2nd for with name secondary
				 * 			key1 : value1 // For forms with out a name, values 
				 * 						  //are set directly in JSON with field name
				 * 		}
				 * </pre>
				 */
				if ($(this.el).find('form').length > 1) {
					
					
					// Initialize variable json as a map
					json = {};

					/*
					 * Iterates through the forms in the view (this.el), each
					 * form is validated, if a form is not valid, isValid
					 * variable is set and returned. If form is valid then form
					 * data is serialized, and set in the JSON object with key
					 * as name of the form
					 */
					$.each($(this.el).find('form'),
							function(index, formelement) {

								/*
								 * If any form in multiple forms are not valid
								 * then returns, setting a flag form data is
								 * invalid
								 */
								if (!isValidForm($(formelement))) {
									isValid = false;
									return;
								}

								/*
								 * Form id and Mame of the form is read,
								 * required to serialize and set in JSON
								 */
								var form_id = $(formelement).attr('id');
								var name = $(formelement).attr('name');

								/*
								 * If name of the form is defined, set the
								 * serialized data in to JSON object with form
								 * name as key
								 */
								if (name) {
									json[name] = serializeForm(form_id);
								}
								/*
								 * If form name is not defined the set the
								 * serialized values to json, with filed names
								 * as key for the value
								 */
								else {
									$.each(serializeForm(form_id), function(
											key, value) {
										json[key] = value;
									});
								}
							});
				}

				/*
				 * Check isValid flag for validity(which is set in processing
				 * multiple forms), or checks validity of single form
				 */
				if (isValid == false || !isValidForm($form)) {
					
					// Removes disabled attribute of save button
					enable_save_button($(e.currentTarget));
					
					return;
				}

				// Clears all the fields in the form before saving
				this.model.clear({
					silent : true
				});

				/*
				 * If variable json is not defined i.e., view does not contacts
				 * multiple forms, so read data from single form
				 */
				if (!json)
					json = serializeForm(formId);

				/*
				 * Saves model data, (silent : true} as argument do not trigger
				 * change view so view is not reset.
				 */
				this.model.set(json, {
					silent : true
				});

				var window = this.options.window;
				var reload = this.options.reload;

				// Store Modal Id
				var modal = this.options.modal;

				var prePersist = this.options.prePersist;
				
				if (prePersist && typeof (prePersist) === "function") {
				    
				     prePersist(this.model);
				    }
				// Loading while saving
				//$save_info = $('<div style="display:inline-block"><img src="img/1-0.gif" height="15px" width="15px"></img></div>');
				//$(".form-actions", this.el).append($save_info);
				//$save_info.show();

				// Calls save on the model
				this.model
						.save(
								[],
								{
									/*
									 * Wait for the server before setting the
									 * new attributes on the model, to trigger
									 * change
									 */
									wait : true,
									/*
									 * On save success, performs the actions as
									 * specified in the options set when
									 * creating an view
									 */
									success : function(model, response) 
									{	
										// Removes disabled attribute of save button
										enable_save_button($(e.currentTarget));
										
										if (saveCallback && typeof (saveCallback) === "function") {
											console.log(response)
											// execute the callback, passing parameters as necessary
											saveCallback(response);
										}
										// Reload the current page
										if (reload)
											location.reload(true);
										else if (window) 
										{
											/*
											 * If window option is 'back'
											 * navigate to previews page
											 */
											if (window == 'back') history.back(-1);
											
											// Else navigate to page set in
											// window attribute
											else Backbone.history.navigate( window, { trigger : true });
											

											// Reset each element
											$form.each(function() {
												this.reset();
											});

											// Hide modal if enabled
											if (modal) $(modal).modal('hide');
										}
										else {
											/* Hide loading on error
											if($save_info)
												$save_info.hide();

											/*
											 * Appends success message to form
											 * actions block in form, if window
											 * option is not set for view
											 *
											 *
											$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Saved Successfully</i></p></small></div>');
											$(".form-actions", this.el).append($save_info);
											$save_info.show().delay(3000).hide(1);	
											*/
										}
									},

									/*
									 * If error occurs in saving a model, error
									 * message in response object is shown in
									 * the form
									 */
									error : function(model, response) {
										
										// Removes disabled attribute of save button
										enable_save_button($(e.currentTarget));
										console.log(response);
										
										if (errorCallback && typeof (errorCallback) === "function") {
											errorCallback(response);
										     return;
										    }
										// Hide loading on error
										//$save_info.hide();

										// Show cause of error in saving
										$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
												+ response.responseText
												+ '</i></p></small></div>');

										// Appends error info to form actions
										// block.
										$(e.currentTarget).closest(".form-actions", this.el).append(
												$save_info);

										// Hides the error message after 3
										// seconds
										if(response.status != 406)
											$save_info.show().delay(3000).hide(1);
									}
								}, { silent : true });
			},
			/**
			 * Render function, renders the view object with the model binded
			 * and show the view with model data filled in it. Render function
			 * shows loading image in the page if model is not download(if
			 * download is required). It is called whenever attributes of the
			 * model are changed, of when fetch is called on the model binded
			 * with current view.
			 * <p>
			 * And there are other cases when render should show to view in
			 * page.
			 * <p>
			 * 
			 * @param isFetched
			 *            Boolean, force render to show the view called with
			 *            'true' when model is download
			 */
			render : function(isFetched) {

				
				
				/**
				 * Renders and returns the html element of view with model data,
				 * few conditions are checked render the view according to
				 * requirement and to avoid unwanted rendering of view.
				 * conditions are
				 * <p>
				 * !this.model.isNew() = model is fetched from the server/ Sent
				 * to edit the model
				 * <p>
				 * <p>
				 * this.options.isNew = If model download form the server is not
				 * required
				 * <p>
				 * <p>
				 * !$.isEmptyObject(this.model.toJSON()) = if model is empty
				 * <p>
				 * isFetched = Force call to execute render(when fetch is
				 * success full render is called successfully)
				 * <p>
				 */
				if (!this.model.isNew() || this.options.isNew
						|| !$.isEmptyObject(this.model.toJSON()) || isFetched) {

					//$(this.el).html(getRandomLoadingImg());
					/*
					 * Uses handlebars js to fill the model data in the template
					 */
					getTemplate(this.options.template, this.model
							.toJSON(), "yes", this.buildModelViewUI);
					
				}
				// Shows loading in the view, if render conditions are
				// satisfied
				else {
					$(this.el).html(getRandomLoadingImg());
				}

				// Returns view object
				return this;
			}, 
			onChange: function()
			{
				if(this.options.change == false)
					return;
				

				this.render(true);
			}, 
			buildModelViewUI : function(content)
			{
				$(this.el).on('DOMNodeInserted', function(e) {
					//alert("triggered");
					//$('form', this).focus_first();
					$(this).trigger('view_loaded');
				 });
			
				$(this.el).html(content);
				
				/*
				 * Few operations on the view after rendering the view,
				 * operations like adding some alerts, graphs etc after the
				 * view is rendered, so to perform these operations callback
				 * is provided as option when creating an model.
				 */
				var callback = this.options.postRenderCallback;
				
				/*
				 * If callback is available for the view, callback functions
				 * is called by sending el(current view html element) as
				 * parameters
				 */
				
				if (callback && typeof (callback) === "function") {
					// execute the callback, passing parameters as necessary
					callback($(this.el),this.model.toJSON());
				}

				// If isNew is not true, then serialize the form data
				if (this.options.isNew != true) {
					// If el have more than 1 form de serialize all forms
					if ($(this.el).find('form').length > 1)
						deserializeMultipleForms(this.model.toJSON(), $(
								this.el).find('form'));

					// If el have one form
					else if ($(this.el).find('form').length == 1)
						deserializeForm(this.model.toJSON(), $(this.el)
								.find('form'));
				}
				
				
				
				// Add row-fluid if user prefs are set to fluid
				if (IS_FLUID)
				{
					$(this.el).find('div.row').removeClass('row').addClass(
							'row-fluid');
				}
				
				$(this.el).trigger('agile_model_loaded');
			}
		});

/**
 * Functions Which take JQuery button elements and enable disable them.
 * 
 * Disable by setting original text in data-save-text attribute and adding disabled:disabled attribute,
 * Also set min width to current width so button can't collapse, but can expand if necessary
 * 
 * Enable by reverse of the above
 * 
 * @param elem - jQuery element corresponding to the button.
 */
function disable_save_button(elem)
{
	elem.css('min-width',elem.width()+'px')
		.attr('disabled', 'disabled')
		.attr('data-save-text',elem.html())
		.text('Saving...');
}

/**
 * Enables save button.
 * @param elem
 */
function enable_save_button(elem)
{
	elem.html(elem.attr('data-save-text')).removeAttr('disabled data-save-text');
}
