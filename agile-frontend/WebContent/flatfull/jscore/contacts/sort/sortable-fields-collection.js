/**
* This is just like an abstract class, doesn't
contain all implementation; it is responsibility of child views to extend
*/
(function(contact_sort_configuration, $, undefined) {
	
contact_sort_configuration.SORT_FIELDS_VIEW = function(sort_options, custom_options)
{
	sort_options = sort_options || {};
	custom_options = custom_options || {};
	var sort_defaults = {
			// Default configurations
			sortPrefsName : "sort_by_name",
			orderBy : "created_time",
			sortBy : "-",
			is_custom_field : false,
			isAlreadyselected : false,
			built_key : this.sortBy + this.orderBy,
			selectedModel : undefined,
			original_with_order : this.final_sort_key,
		}
		sort_defaults.built_key = sort_defaults.sortBy + sort_defaults.orderBy;

		console.log(sort_defaults);

	sort_defaults = _.defaults(sort_options, sort_defaults);
	//custom_properties_defaults = _.defaults(custom_options, custom_properties_defaults);


	var setDefaultSelection = function(view)
	{
		//alert("ehere");
	}

	return Base_Collection_View.extend({
		events : {
			//"click a.sort-field" : "sort_collection_config",
			"click a.order-by" : "orderBy"
		},
		init : function(e)
		{	
			this.options.sort_options = this.options.sort_options || {};

			this.options.sort_options = _.defaults(sort_defaults, this.options.sort_options);
			
			// Gets sort key from local storage
			var sort_key = _agile_get_prefs(this.options.sort_options.sortPrefsName);

			//var sort_key = "created_time";

			if(this.options.sort_options.selectedModel)	
				this.setPropertiesByModel(this.options.sort_options.selectedModel);
			else
				this.setProperties(sort_key)

			this.preSelectFields();
		},
		postProcess : function(el)
		{
			this.preSelectFields();
			if(this.options.sort_options.selectedModel)
				this.printSortNameByData(this.options.sort_options.selectedModel);

		},
		setDefaults : function()
		{
			this.options.sort_options = _.defaults(sort_defaults, this.options.sort_options);
			this.setProperties(this.options.sort_options.built_key);
		},
		setSortOrder : function(sortBy)
		{
			this.options.sortBy = sortBy;
			this.updateLocalStorage(this.options.sortBy + this.options.sort_options.built_key);
		},
		setPropertiesByModel : function(base_model)
		{
			// Clones properties
			var clone_properties = _.defaults({}, sort_defaults);
			clone_properties.orderBy = base_model.get("search_key");
			clone_properties.sortBy = this.options.sortBy;
			clone_properties.is_custom_field = base_model.get("scope") ? true : false;
			if(clone_properties.is_custom_field)
				clone_properties.built_key =  clone_properties.orderBy +"_AGILE_CUSTOM_" + base_model.get("field_type");
			else
				clone_properties.built_key =  clone_properties.orderBy;

			clone_properties.selectedModel = base_model;

			clone_properties.isAlreadyselected = true;

			this.options.sort_options = _.defaults(clone_properties, this.options.sort_options);

			if(this.options.sortBy)
				this.updateLocalStorage(this.options.sortBy + this.options.sort_options.built_key);
			else
				this.updateLocalStorage(this.options.sort_options.built_key);

			this.setDefault(base_model);
		},
		setProperties : function(newKey)
		{
			// Returns if key is not defined
			if(!newKey || !newKey.trim())
				return;

			// Clones properties
			var clone_properties = _.defaults({}, sort_defaults);

			var sortBy = "";
			var orderBy = "";
			var selectedModel = undefined;

			/**
			* If sort key is not defined default sortkey is picked. If default sort key is defined in list config, it is picked from there,
			* otherwise, 'created_time' is considered as default one.
			*/
			if(newKey[0] == "-")
			{
				sortBy = "-";
				orderBy = newKey.split( /-(.+)/)[1];	
			}
			else
			{
				sortBy = "";
				orderBy = newKey;

			}

			clone_properties.is_custom_field = false;
			if(orderBy.indexOf("_AGILE_CUSTOM_"))
			{
				var temp = orderBy.split("_AGILE_CUSTOM_");
				orderBy = temp[0];
				clone_properties.is_custom_field = true;
			}
			
			clone_properties.orderBy = orderBy;
			var searchResults = this.collection.where({"search_key" : orderBy});
			selectedModel = searchResults.length > 0 ? searchResults[0] : selectedModel;

			this.options.sort_options = clone_properties;
			this.options.sortBy = sortBy;
			if(selectedModel)
			{
				this.setPropertiesByModel(selectedModel);
				this.setSortOrder(sortBy);
			}
		},
		preSetProperties : function(e)
		{
			//this.init();
			//this.preSelectFields();
		},
		preSelectFields : function(e)
		{
			//$('.sort-field-check', this.el).addClass('display-none');
			$('.sort-by-check', this.el).addClass('display-none');

			if(this.options.sortBy == "-")
			{
				$(".order-by[data='-']", this.el).find('i').removeClass('display-none');
			}
			else
			{
				$(".order-by[data='']", this.el).find('i').removeClass('display-none');				
			}
		},
		resetLocalStorage : function(e)
		{
			// Can be implemented in child views. 
			//This is left blank to make this class re-usable for both contacts and companies listing

		},
		updateLocalStorage : function(sort_by)
		{
			// abstract method;
			_agile_set_prefs(this.options.sortPrefsName, sort_by);
		},
		printSortNameByData : function(model)
		{
			 $(".contacts-toolbar", this.el).find(".sort-field-txt").html(model.get("field_label"));
		},
		orderBy : function(e)
		{
			sort_by = $(e.currentTarget).attr('data');

			if(this.options.sortBy == sort_by)
				return;

			this.setSortOrder(sort_by);

			

			this.setSortOrder(sort_by);

			this.preSelectFields();
			this.sort_collection();
		},
		sort_collection_config : function(model)
		{
			this.resetLocalStorage();
			if(!model)
				return;

			this.setPropertiesByModel(model);

			this.sort_collection();
		},
		setDefault : function (model)
		{
			var collection = this.collection.where({"selected" : true});
			if(collection.length != 0 )
			{
				$.each(collection, function(i, v){
					v.set("selected", false);
				});	
			}
			if(!model)
				return;

			model.set("selected" , true);
			this.printSortNameByData(model);
		},
		sort_collection : function()
		{
			// Can be implemented in child views. 
			//This is left blank to make this class re-usable for both contacts and companies listing
		},
		isMatchingEntity : function(base_model)
		{
			if(this.options.sort_options.isAlreadyselected)
				return false;

			if(base_model.get("search_key") == this.options.sort_options.orderBy)
			{
				return true;
			}

			return false;
		},
		addAll : function(fields_list)
		{
			var foundField = false;
			if(!fields_list || fields_list.length == 0)
			{
			//	foundField = this.options.sort_options.is_custom_field;
			}
			var collection = this.collection;
			var that = this;
			$.each(fields_list, function(index, value){
				if(that.options.sort_options.is_custom_field && that.options.sort_options.orderBy == value["search_key"] && !foundField)
					foundField = true;
				collection.add(value);
			});
			
			if(this.options.sort_options.is_custom_field && !foundField)
			{
				this.setDefaults();
				this.sort_collection();
			}
		},	
		appendItem : function(base_model, append)
			{	
				if(this.isMatchingEntity(base_model))
				{
					this.setPropertiesByModel(base_model);
				}

				// This is required when add event is raised, in that case
				// updating document fragment does not update view. And on the
				// other hand, append item should definitely be called from
				// appendItemOnAddEvent because there are many places where
				// appenditem is overridden and that needs to be called on newly
				// added model
				//if (append)
			//	{

					// Adds to respective div based on type of field
					var el = this.createListView(base_model).render().el;

					if(base_model.get("scope"))
					{
						this.custom_field_element = $("#sort-divider", this.el);
						$("#custom-fields", this.el).removeClass("display-none");
						$(this.custom_field_element).before(el);
					}
					else
					{
							$(!this.system_field_element)
								this.system_field_element = $("#custom-fields", this.el);

							$(this.system_field_element).before(el);
					}
					
		//			return;
		//		}

				//this.model_list_element_fragment.appendChild(this.createListView(base_model).render().el);
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

				var view = this.getListView();
				/*
				 * Creates Base_List_View i.e., view is created for the model in
				 * the collection.
				 */
				var itemView = new view({ model : base_model, template : (this.options.templateKey + '-model'),
					tagName : this.options.individual_tag_name, collectionView : this});


				return itemView
		},
		getListView : function ()
		{
			if(this.options.list_view)
				return this.options.list_view;

			this.options.list_view = Base_List_View.extend({
				events : {
					"click a.sort-field" : "sort_collection_config",
				},
				sort_collection_config : function (e, model)
				{
					e.preventDefault();
			
					console.log(model);
					this.options.collectionView.sort_collection_config(this.model);

				//	this.options.collectionView.printSortNameByData(this.model);
				}
			});

			return this.options.list_view;
		}
	});
}

}(window.contact_sort_configuration = window.contact_sort_configuration || {}, $));

function getSortFieldsConfig()
{
	return SORT_FIELDS_VIEW;
}