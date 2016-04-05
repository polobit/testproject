Backbone.View.prototype.close = function()
{
	this.remove();
	this.unbind();
	if (this.onClose)
	{
		this.onClose();
	}
}

var BaseModel = Backbone.Model.extend({});

/**
 * Defines a backbone collection, which sorts the collection based on the
 * sortkey and parses based on the restKey
 */
var BaseCollection = Backbone.Collection.extend({ model : BaseModel,
/*
 * Initializes the collection sets restKey and sortKey
 */
initialize : function(models, options)
{
	this.restKey = options.restKey;
	if (options.sortKey)
		this.sortKey = options.sortKey;
	if (options.descending)
		this.descending = options.descending;

	// Set false if sorting is not required. Used when order returned
	// from server is to be preserved.
	this.sort_collection = options.sort_collection;
	if (this.sort_collection == false)
		this.comparator = false;
},
/*
 * Sorts the order of the collection based on the sortKey. When models are
 * fetched then comparator gets the value of the softKey in the model and sorts
 * according to it
 */
comparator : function(item)
{
	if (this.sortKey)
	{
		if (this.descending == true)
			return -item.get(this.sortKey);
		// console.log("Sorting on " + this.sortKey);
		return item.get(this.sortKey);
	}
	return item.get('id');
},
/*
 * Gets the corresponding objects based on the key from the response object
 */
parse : function(response)
{
	// console.log("parsing " + this.restKey + " " +
	// response[this.restKey]);

	if (response && response[this.restKey])
		return response[this.restKey];

	return response;
} });

/*
 * Creates an view object on the model, with events click on .delete, .edit,
 * .agile_delete and respective funtionalities are defined and binds to current
 * view.
 */
var Base_List_View = Backbone.View.extend({ events : { "click .delete" : "deleteItem", "click .edit" : "edit", "delete-checked .agile_delete" : "deleteItem",
	"click .delete-model" : "deleteModel",
	"click .delete-confirm" : "deleteConfirm"

},
/*
 * Binds events on the model
 */
initialize : function()
{
	_.bindAll(this, 'render', 'deleteItem', 'edit', 'deleteModel'); // every function
	// that uses 'this'
	// as the current
	// object should be
	// in here
	this.model.bind("destroy", this.close, this);

	this.model.bind("change", this.render, this);
	this.model.bind("popoverChange", this.test,this);

},
/*
 * On click on ".delete" model representing the view is deleted, and removed
 * from the collection
 */
deleteItem : function(e)
{
	e.preventDefault();
	this.model.destroy();
	this.remove();
}, 
deleteModel : function(e)
{
	e.preventDefault();
	if(!confirm("Are you sure you want to delete?"))
		return false;

	$.ajax({ type: 'DELETE', url: this.model.url(),success : function() {
		location.reload(true);
	}
        });
	
},

deleteConfirm : function(e)
{
	var that = this;
	var confirmModal = $('#deleteConfirmationModal');

	confirmModal.html(getTemplate('modal-delete-confirm', {})).modal('show');

	$("#delete-confirm", confirmModal).click(function(e){
			e.preventDefault();
			var id=that.model.get("id");
			console.log(id);
		   // Show loading
		   $(this).addClass("disabled")
		   $.ajax({
    					url: 'core/api/users/'+id,
       					type: 'DELETE',
       					success: function()
       					{
       						console.log("success");
       						$('#deleteConfirmationModal').modal('hide');
       						that.remove();
						    if(!_billing_restriction.currentLimits.freePlan)
							   {
							    var message;
							    if(count > 1)
							     message = "Users have been deleted successfully. Please adjust your billing plan to avoid being billed for the deleted users.";
							    else
							     message = "User has been deleted successfully. Please adjust your billing plan to avoid being billed for the deleted user.";
							    showNotyPopUp('information', message, "top", 10000);
							   }


       					},
       					error : function(response)
						{
							console.log("error");
							confirmModal.find(".modal-footer").find("#delete-user").html('<small class="text-danger" style="font-size:15px;margin-right:172px;">Sorry, can not delete user having admin privilege.</small>');
							console.log(response);

						}

       			});
          
	});

},

edit : function(e)
{
	/*
	 * console.log(this.model); console.log("Editing " +
	 * this.model.get("edit_template")); // Edit
	 * if(this.model.get("edit_template")) { console.log("Moving to edit"); var
	 * editView = new Base_Model_View({ model: this.model, isNew: true,
	 * template: this.model.get("edit_template") }); var el =
	 * editView.render().el; $('#content').html(el); }
	 */
}, 
test : function(callback)
{
		var async = false;
	// if(callback && typeof (callback) == "function")
	// async = true;
	if (async)
	{
		var that = this
		// console.log(this.model.toJSON());
		getTemplate(that.options.template, that.model.toJSON(), undefined, function(el)
		{
			$(that.el).html(el);
			$(that.el).data(that.model);
			console.log($(that.el));
			callback(that.el);
		});
		return this;
	}

	$(this.el).html(getTemplate(this.options.template, this.model.toJSON()));

	return this;
},
render : function(callback)
{
	var async = false;
	// if(callback && typeof (callback) == "function")
	// async = true;
	if (async)
	{
		var that = this
		// console.log(this.model.toJSON());
		// startFunctionTimer("model getTemplate");
		getTemplate(that.options.template, that.model.toJSON(), undefined, function(el)
		{
			// endFunctionTimer("model getTemplate");
			$(that.el).html(el);
			$(that.el).data(that.model);
			console.log($(that.el));
			callback(that.el);
		});
		return this;
	}

	$(this.el).html(getTemplate(this.options.template, this.model.toJSON()));
	$(this.el).data(this.model);
	// Add model as data to it's corresponding row

	return this;
} });

/**
 * Base_Collection_view class defines a Backbone view, which binds the list of
 * models (Collections, backbone collection) i.e, defines view for the
 * collection.
 * <p>
 * Adds view to collection and binds sync (calls every time it attempts to read
 * or save a model to the server),
 * <p>
 * Whenever whenever save model operation is done, appendItem method in the
 * Base_Collection_view class is called on current view, since then sync is
 * binded with appendItem method. It appends the new model created to collection
 * and adds in the view
 * <p>
 * In View initialize function, new collection is created based on the options
 * (url, restkey, sortkey), passed while creating a new view. The collection
 * created in initialize is based on the BaseCollection (in base-colleciton.js),
 * which define the comparator and parse based on the restKey (to parse the
 * response) and sortKey (to sort the collection) passed to Base_Collection_View
 * <p>
 * Options to Base_collection_View are :
 * 
 * <pre>
 * 		resetKey :  Used to parse the response.
 * 		sortKey  : 	Used to sort the collection based in the sortkey value
 * 		url		 :	To fetch the collection and to perform CRUD operations on models 
 * 		cursor 	 :  To initialize the infiniscroll
 * </pre>
 */
var Base_Collection_View = Backbone.View
		.extend({

			/*
			 * Events defined on the view and related function(defines action to
			 * be performed on event). ".save" and ".delete" represents html
			 * elements in current view
			 */
			events : {
				"click .temp_collection_event" : "tempEvent"
			},

			/**
			 * Initializes the view, creates an empty BaseCollection and options
			 * restKey, sortKey, url and binds sync, reset, error to collection.
			 * Also checks if the collection in this view needs infiniscroll
			 * (checks for cursor option).
			 */
			initialize : function()
			{
				// startFunctionTimer("initialize");

				// Do not show transition bar 
				if(!this.options.no_transition_bar)
				    showTransitionBar();

				// Binds functions to view
				_.bindAll(this, 'render', 'appendItem', 'appendItemOnAddEvent', 'buildCollectionUI');

				if (this.options.data)
				{
					// Initializes the collection with restKey and sortkey
					this.collection = new BaseCollection(this.options.data, { restKey : this.options.restKey, sortKey : this.options.sortKey,
						descending : this.options.descending, sort_collection : this.options.sort_collection });
				}
				else
				{
					// Initializes the collection with restKey and sortkey
					this.collection = new BaseCollection([], { restKey : this.options.restKey, sortKey : this.options.sortKey,
						descending : this.options.descending, sort_collection : this.options.sort_collection });
				}

				/*
				 * Sets url to the collection to perform CRUD operations on the
				 * collection
				 */
				this.collection.url = this.options.url;

				this.model_list_template = $('<div class="model-list"></div>');

				/*
				 * Binds appendItem function to sync event of the collection
				 * i.e., Gets called every time it attempts to read or save a
				 * model to the server
				 */
				this.collection.bind('sync', this.appendItem);
				this.collection.bind('add', this.appendItemOnAddEvent);

				var that = this;

				/*
				 * Calls render when collection is reset
				 */
				this.collection.bind('reset', function()
				{
					that.render(true)
				});

				/*
				 * Binds error event to collection, so when error occurs the
				 * render is called with parameters force render and error
				 * response text to show in the template
				 */
				this.collection.bind('error', function(collection, response)
				{
					if (response.status == 401)
					{
						handleAjaxError();
						return;
					}
					that.render(true, response.responseText);
				});

				// Commented as it was creating a ripple effect
				// this.collection.bind('add', function(){that.render(true)});

				// endFunctionTimer("initialize");
				/*
				 * Calls render before fetching the collection to show loading
				 * image while collection is being fetched.
				 */
				this.render();

				/*
				 * If cursor options are passed when creating a view then
				 * inifiscroll (infiniscroll.js plug in) is initialized on the
				 * collection
				 */
				if (this.options.cursor)
				{
					/*
					 * If page size is not defined then sets page size to 20.
					 */
					this.page_size = this.options.page_size;
					this.global_sort_key = this.options.global_sort_key;
					this.request_method = this.options.request_method;
					this.post_data = this.options.post_data;
					if (!this.page_size)
						this.page_size = 20;

					/*
					 * stores current view object in temp variable, can be used
					 * to call render in infiniscroll, on successful fetch on
					 * scrolling
					 */
					var that = this;

					/**
					 * Initiazlizes the infi$target : this.options.scroll_target ? tarniscroll on the collection created
					 * in the view,
					 */
					this.infiniScroll = new Backbone.InfiniScroll(this.collection, { success : function()
					{
						/*
						 * If fetch is success then render is called, so
						 * addition models fetched in collection are show in the
						 * view
						 */
						$(".scroll-loading", that.el).remove();

						/**
						 *callback to be fired when next set is fetched. Added by Sasi on Jan/18/2016.
						 */
						if (that.options.infini_scroll_cbk)
							that.options.infini_scroll_cbk();

					}, untilAttr : 'cursor', param : 'cursor', strict : true, pageSize : this.page_size, target : this.options.scroll_target ? this.options.scroll_target: $(window),

					/*
					 * Shows loading on fetch, at the bottom of the table
					 */
					onFetch : function()
					{
						
						var element="table"; 
						if (that.options.scroll_symbol)
							element="section";
						if(that.options.custom_scrollable_element)
							element=that.options.custom_scrollable_element;
						$(element, that.el).after('<div class="scroll-loading" style="margin-left:50%">' + LOADING_ON_CURSOR + '</div>');
					} });

					/*
					 * Adds infiniscroll objects in to a map with current route
					 * as key, to manage the infiniscroll if view changes i.e.,
					 * to disable infiniscroll on different view if not
					 * necessary.
					 */
					addInfiniScrollToRoute(this.infiniScroll);

					// disposePreviousView(this.options.templateKey +
					// '-collection', this);

					// Store in a variable for us to access in the custom fetch
					// as this is different
					var page_size = this.page_size;
					var global_sort_key = this.global_sort_key;
					var request_method = this.request_method;
					var post_data = this.post_data;

					// Set the URL
					this.collection.fetch = function(options)
					{
						// startFunctionTimer("fetch time");
						options || (options = {})
						options.data || (options.data = {});
						options.data['page_size'] = page_size;
						if(global_sort_key && global_sort_key != null)
							options.data['global_sort_key'] = global_sort_key;
						if(request_method && request_method != null) {
							options.type = request_method;
							if(request_method.toLowerCase()=='post' && post_data && post_data != null) {
								$.each(post_data, function(key, value) {
									options.data[key] = value;
								});
							}
						}
						return Backbone.Collection.prototype.fetch.call(this, options);
					};

					// this.collection.url = this.collection.url + "?page_size="
					// + this.page_size;
				}

			},

			tempEvent: function(){
				console.log("tempEvent");
			},

			/**
			 * Takes each model and creates a view for each model using model
			 * template and appends it to model-list, This method is called
			 * whenever a model is added or deleted from the collection, since
			 * this method is binded with sync event of collection
			 * 
			 * @param base_model
			 *            backbone model object
			 */
			appendItem : function(base_model, append)
			{

				// This is required when add event is raised, in that case
				// updating document fragment does not update view. And on the
				// other hand, append item should definitely be called from
				// appendItemOnAddEvent because there are many places where
				// appenditem is overridden and that needs to be called on newly
				// added model
				if (append)
				{
					$(this.model_list_element).append(this.createListView(base_model).render().el);
					return;
				}

				console.log("appendItem");
				this.model_list_element_fragment.appendChild(this.createListView(base_model).render().el);
			},
			createListView : function(base_model)
			{
				// If modelData is set in options of the view then custom data
				// is added to model.
				if (this.options.modelData)
				{
					// console.log("Adding custom data");
					base_model.set(this.options.modelData);
				}

				/*
				 * Creates Base_List_View i.e., view is created for the model in
				 * the collection.
				 */
				var itemView = new Base_List_View({ model : base_model, template : (this.options.templateKey + '-model'),
					tagName : this.options.individual_tag_name });

				return itemView
			}, appendItemOnAddEvent : function(base_model)
			{
				this.appendItem(base_model, true);
				/*
				 * if(this.collection && this.collection.length) {
				 * if(this.collection.at(0).attributes.count)
				 * this.collection.at(0).attributes.count+=1; }
				 */

				// callback for newly added models
				var appendItemCallback = this.options.appendItemCallback;

				if (appendItemCallback && typeof (appendItemCallback) === "function")
					appendItemCallback($(this.el));

				if ($('table', this.el).hasClass('onlySorting'))
					return;

				append_checkboxes(this.model_list_element);

			},
			/**
			 * Renders the collection to a template specified in options, uses
			 * handlebars to populate collection data in to vew
			 * <p>
			 * To use this render, naming of the handlebars template script tags
			 * should be followed
			 * <p>
			 * 
			 * <pre>
			 * 	template-name + model-list :  To append all the models in to list
			 *  template-name + collection :	appends populated model-list to this template
			 *  template-name + model 	 :  Represent each model which is appended to model-list 
			 * </pre>
			 * 
			 * @param force_render
			 *            boolean forces the render to execute, unless it is
			 *            true view is not show and loading image is shown
			 *            instead
			 */
			render : function(force_render, error_message)
			{
				// If collection in not reset then show loading in the content,
				// once collection is fetched, loading is removed by render and
				// view gets populated with fetched collection.
				if (force_render == undefined)
				{	
					//Included by Sasi for tickets
					var html = (this.options.customLoader) ? getTemplate(this.options.customLoaderTemplate) : '';

					$(this.el).html(html);
					return this;
				}

				// Remove loading
				if ($(this.el).html() == getRandomLoadingImg())
					$(this.el).empty();

				// If error message is defined the append error message to el
				// and return
				if (error_message)
				{
					$(this.el).html('<div style="padding:10px;font-size:14px"><b>' + error_message + '<b></div>');
					return;
				}
				// endFunctionTimer("fetch time");
				// printCurrentDateMillis("render start");

				var _this = this;
				var ui_function = this.buildCollectionUI;
				// Populate template with collection and view element is created
				// with content, is used to fill heading of the table

				// startFunctionTimer("getTemplate");
				getTemplate((this.options.templateKey + '-collection'), this.collection.toJSON(), "yes", ui_function);

				if (this.page_size && (this.collection.length < this.page_size))
				{
					console.log("Disabling infini scroll");
					this.infiniScroll.destroy();
				}

				this.delegateEvents();
				return this;
			}, buildCollectionUI : function(result)
			{
				// endFunctionTimer("getTemplate")
				// startFunctionTimer("buildCollectionUI");
				$(this.el).html(result);
				// If collection is Empty show some help slate
				if (this.collection.models.length == 0)
				{
					// Add element slate element in collection template send
					// collection template to show slate pad
					fill_slate("slate", this.el, this.options.slateKey);
				}

				// Add row-fluid if user prefs are set to fluid (deprecated in BS3 Version its been commented)
				/*if (IS_FLUID)
				{
					$(this.el).find('div.row').removeClass('row').addClass('row');
				}*/

				// Used to store all elements as document fragment
				this.model_list_element_fragment = document.createDocumentFragment();

				this.model_list_element = $('#' + this.options.templateKey + '-model-list', $(this.el));

				var fragment = document.createDocumentFragment();

				/*
				 * Iterates through each model in the collection and creates a
				 * view for each model and adds it to model-list
				 */
				_(this.collection.models).each(function(item)
				{ // in case collection is not empty

					this.appendItem(item);
				}, this);

				$(this.model_list_element).append(this.model_list_element_fragment);

				// endFunctionTimer("buildCollectionUI");

				/*
				 * Few operations on the view after rendering the view,
				 * operations like adding some alerts, graphs etc after the view
				 * is rendered, so to perform these operations callback is
				 * provided as option when creating an model.
				 */
				var callback = this.options.postRenderCallback;

				/*
				 * If callback is available for the view, callback functions is
				 * called by sending el(current view html element) as parameters
				 */
				if (callback && typeof (callback) === "function")
				{
					// startFunctionTimer("postRenderCallback");
					// execute the callback, passing parameters as necessary
					callback($(this.el), this.collection);
				}
				
				hideTransitionBar();

				// Add checkboxes to specified tables by triggering view event
				$('body').trigger('agile_collection_loaded', [
					this.el
				]);

				// $(this.el).trigger('agile_collection_loaded', [this.el]);

				// For the first time fetch, disable Scroll bar if results are
				// lesser
				if (callback && typeof (callback) === "function"){}
					// endFunctionTimer("postRenderCallback");

				// printCurrentDateMillis("render end");

				return this;
			}, });
/**
*  Extended View of Base_Collection. It combines parent events to extended view events.
*/
Base_Collection_View.extend = function(child) {
	var view = Backbone.View.extend.apply(this, arguments);
	view.prototype.events = _.extend({}, this.prototype.events, child.events);
	return view;
};


/**
*  Extended View of list view. It combines parent events to extended view events.
*/
Base_List_View.extend = function(child) {
	var view = Backbone.View.extend.apply(this, arguments);
	view.prototype.events = _.extend({}, this.prototype.events, child.events);
	return view;
};
