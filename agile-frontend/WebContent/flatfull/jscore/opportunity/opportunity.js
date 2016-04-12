/**
 * opportunity.js is a script file that handles opportunity pop-over,
 * milestones and owner select list.
 * 
 * @module Deals
 * 
 **/
$(function () {
	
	/**
	 * When mouseover on any row of opportunities list, the popover of deal is shown
	 **/
	$('#opportunity-listners').on('mouseenter', '#opportunities-model-list > tr', function(e) {
        var data = $(this).find('.data').attr('data');

        var currentDeal = App_Deals.opportunityCollectionView.collection.get(data);
        var that = this;
        
        getTemplate("opportunity-detail-popover", currentDeal.toJSON(), undefined, function(template_ui){
			if(!template_ui)
				  return;
			
			var ele = $(template_ui);
	        console.log(ele);
	        console.log(that);
	        $(that).popover({
	        	"rel" : "popover",
	        	"trigger" : "hover",
	        	"placement" : 'right',
	        	"original-title" : currentDeal.toJSON().name,
	        	"content" :  ele,
	        	"html" : true,
	        	"container": 'body'
	        });
       
	        /**
	         * Checks for last 'tr' and change placement of popover to 'top' inorder
	         * to prevent scrolling on last row of list
	         **/
	       $('#opportunities-model-list > tr:last').popover({
	        	"rel" : "popover",
	        	"trigger" : "hover",
	        	"placement" : 'top',
	        	"original-title" : currentDeal.toJSON().name,
	        	"content" :  ele,
	        	"html" : true,
	        	"container": 'body'
	        });

	        $(that).popover('show');

		}, null);

     });
	
    /**
     * On mouse out on the row hides the popover.
     **/
	$('#opportunity-listners').on('mouseleave', '#opportunities-model-list > tr', function(e) {
    	 $(this).popover('hide');
    });
	
    /**
     * On click on the row hides the popover.
     **/
	$('#opportunity-listners').on('click', '#opportunities-model-list > tr, .hide-popover', function(e) {
    	 $(this).closest('tr').popover('hide');
    });
    
   /**
    * When deal is added from contact-detail by selecting 'Add Opportunity' from actions 
    * and then close button of deal is clicked, it should navigate to contact-detail.
    **/
	$('#opportunity-listners').on('click', '#close-deal', function(e) {
    	e.preventDefault();
    	window.history.back();
    });
	
	$('#opportunity-listners').on('click', '#deal-milestone-regular', function(e) {
    	e.preventDefault();
    	_agile_delete_prefs('deal-milestone-view');
    	App_Deals.deals();
    });
	
	$('body').on('click', '#deal-milestone-compact', function(e) {
    	e.preventDefault();
    	_agile_set_prefs('deal-milestone-view','compact');
    	App_Deals.deals();
    });
	
	$('body').on('click', '#deal-milestone-fit', function(e) {
    	e.preventDefault();
    	_agile_set_prefs('deal-milestone-view','fit');
    	App_Deals.deals();
    });
	
	//Check the archived filter for the first time and set it to false as default.
	if(_agile_get_prefs('deal-filters')){
		var json = $.parseJSON(_agile_get_prefs('deal-filters'));
		if(!json.archived){
			json.archived="false";
			_agile_set_prefs('deal-filters',JSON.stringify(json));
		}
	} else {
		var json = {"owner_id":"","pipeline_id":"","milestone":"","value_filter":"equals","value":"","value_start":"","value_end":"","archived":"false","":false,"contact_ids":[]};
		json.archived="false";
		_agile_set_prefs('deal-filters',JSON.stringify(json));
	}
	
});

/**
 * Populate users in options of owner input field drop-down.
 * When new deal is created,owner select is filled with owners list.When
 * deal is need to edit,the owner select field is filled with previous option.
 *  
 * @param id - Id of select element of Owner
 * @param el - el references the DOM object created in the browser.
 * @param value - Deal object
 * @param key - key name in the value.It is passed during declaration
 **/
function populateUsers(id, el ,value, key, callback) {
		
	// Users set id of agile user to save agileuser key in opportunities
	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	
	 /**
      * Fills owner select with existing Users.
      * 
      * @param id - Id of select element of Owner
      * @param /core/api/users - Url to get users
      * @param 'domainUser' - parse key
      * @param function - callback function
      * @param optionsTemplate- to fill options with users
      **/
	fillSelect(id,'/core/api/users/partial', 'domainUser', function fillOwner() {
		
		if(value)
		{
			// If domain user is deleted owner is undefined
			if(value[key])
				// While deserialize set agile user id from user prefs, to save agile user key in opportunity 
				$('#' + id, el).find('option[value='+ value[key].id +']').attr("selected", "selected");
		}
		else
			$('#' + id, el).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
		// If callback is present, it is called to deserialize the select field
		if (callback && typeof (callback) === "function") {
			// execute the callback, passing parameters as necessary
			callback($('#' + id).html());
		}
	}, optionsTemplate); 
	
	
}

/**
 * Populate Pipelines in options of pipeline input field drop-down.
 * When new deal is created,pipeline select is filled with pipelines list.When
 * deal is need to edit,the pipeline select field is filled with previous option.
 * 
 * @param el - el references the DOM object created in the browser.
 * @param dealDetails - dealDetails value
 * @param value - Deal Object
 **/
function populateTrackMilestones(el, dealsDetails, value, callback, defaultSelectOption, id){
var tracks = new Base_Collection_View({url : '/core/api/milestone/pipelines'});
	
	// If id undefined
	if(!id)
		id = 'pipeline_milestone';

	tracks.collection.fetch({
		success: function(data){
			var jsonModel = data.toJSON();
			var html = '<option value="">Select...</option>';
			console.log(jsonModel);
			
			// If there is only one pipeline, select the option by default and hide the field.
			if(jsonModel.length==1){
				var mile = jsonModel[0];
				$.each(mile.milestones.split(","), function(index,milestone){
					var json = {id : mile.id, milestone : milestone};
					if(value && mile.id == value.pipeline_id && milestone == value.milestone)
						html += Handlebars.compile('<option value="{{id}}_{{milestone}}" selected="selected">{{milestone}}</option>')(json);
					else
						html += Handlebars.compile('<option value="{{id}}_{{milestone}}">{{milestone}}</option>')(json);
				});
				if(mile.lost_milestone){
					html += Handlebars.compile('<option value="{{id}}_{{lost_milestone}}" style="display:none;">{{lost_milestone}}</option>')({id : mile.id, lost_milestone : mile.lost_milestone});
				}
				$('#' + id, el).closest('.control-group').find('label').html('Milestone<span class="field_req">*</span>');
			}
			else {
				$.each(jsonModel,function(index,mile){
					console.log(mile.milestones,value);
					var array = [];
					html+='<optgroup label="'+mile.name+'">';
					$.each(mile.milestones.split(","), function(index,milestone){
						array.push($.trim(this));
						var json = {id : mile.id, milestone : milestone, name : mile.name};
						if(value && mile.id == value.pipeline_id && milestone == value.milestone)
							html += Handlebars.compile('<option value="{{id}}_{{milestone}}" selected="selected">{{name}} - {{milestone}}</option>')(json);
						else
							html += Handlebars.compile('<option value="{{id}}_{{milestone}}">{{name}} - {{milestone}}</option>')(json);
					});
					if(mile.lost_milestone){
						html += Handlebars.compile('<option value="{{id}}_{{lost_milestone}}" style="display:none;">{{name}} - {{milestone}}</option>')({id : mile.id, lost_milestone : mile.lost_milestone, name : mile.name});
					}
					html+='</optgroup>';
				});
				$('#' + id, el).closest('.control-group').find('label').html('Track & Milestone<span class="field_req">*</span>');
			}
			
			$('#' + id, el).html(html);
			console.log('adding');
			$('#' + id, el).closest('div').find('.loading-img').hide();

			// Hide loading bar
			hideTransitionBar();
			
			/* Hide the Tracks select box when there is only one pipeline.
			if(jsonModel.length==1){
				$('#pipeline',el).closest('div.control-group').hide();
				$('#milestone',el).closest('div.control-group').css("margin-left","0px");
				$('#dealsFilterForm #pipeline',el).closest('div.control-group').show();
			}*/
			
			if (callback && typeof (callback) === "function") {
				// execute the callback, passing parameters as necessary
				callback(jsonModel);
			}
		}
	}); 
}

/**
 * Populate Pipelines in options of pipeline input field drop-down.
 * When new deal is created,pipeline select is filled with pipelines list.When
 * deal is need to edit,the pipeline select field is filled with previous option.
 * 
 * @param el - el references the DOM object created in the browser.
 * @param dealDetails - dealDetails value
 * @param value - Deal Object
 **/
function populateTracks(el, dealsDetails, value, callback, defaultSelectOption){
var tracks = new Base_Collection_View({url : '/core/api/milestone/pipelines'});
	
	tracks.collection.fetch({
		success: function(data){
			hideTransitionBar();
			var jsonModel = data.toJSON();
			var html = '<option value="">Select..</option>';
			console.log(jsonModel);
			
			// If there is only one pipeline, select the option by default and hide the field.
			if(jsonModel.length==1){
				html += Handlebars.compile('<option value="{{id}}" selected="selected">{{name}}</option>')({id : jsonModel[0].id, name : jsonModel[0].name});
				milestone_util.showMilestonePopup(jsonModel[0]);
			}
			else {
				milestone_util.isNotyVisible = false;
				$.each(jsonModel,function(index,mile){
					var json = {id : mile.id, name : mile.name};
					if(!mile.name)
						mile.name = 'Default';
					if(value && mile.id == value.pipeline_id)
						html += Handlebars.compile('<option value="{{id}}" selected="selected">{{name}}</option>')(json);
					else
						html += Handlebars.compile('<option value="{{id}}">{{name}}</option>')(json);
					milestone_util.showMilestonePopup(mile);
				});
			}
			$('#pipeline',el).html(html);
			console.log('adding');
			$('#pipeline',el).closest('div').find('.loading-img').hide();
			
			// Hide the Tracks select box when there is only one pipeline.
			/*if(jsonModel.length==1){
				$('#pipeline',el).closest('div.control-group').hide();
				$('#milestone',el).closest('div.control-group').css("margin-left","0px");
				$('#dealsFilterForm #pipeline',el).closest('div.control-group').show();
			}*/
			
			if (callback && typeof (callback) === "function") {
				// execute the callback, passing parameters as necessary
				callback(jsonModel, html);
			}
		}
	}); 
}

/**
 * Populate milestones in options of milestone input field drop-down.
 * When new deal is created,milestone select is filled with milestones list.When
 * deal is need to edit,the milestone select field is filled with previous option.
 * 
 * @param el - el references the DOM object created in the browser.
 * @param dealDetails - dealDetails value
 * @param piepline - pipeline value, to which the deal belogs to.
 * @param value - Deal Object
 **/
function populateMilestones(el, dealsDetails, pipeline, value, callback, defaultSelectOption){
	 // Fill milestones in select options
    var milestone_model = Backbone.Model.extend({
   	 url: '/core/api/milestone/'+pipeline
		});
    
    var model = new milestone_model();
    model.fetch({ 
   			 success: function(data) 
   			 { 
   				 		var jsonModel = data.toJSON();
						var milestones = jsonModel.milestones;
						console.log("------", data);
						// Split , and trim
						var array = [];
						$.each(milestones.split(","), function(){
							array.push($.trim(this));
						});
						if(dealsDetails)
						{
							fillMilestones('move', array);
							return;
						}
						/**
						 * Fills milestone select with existing milestones.
						 * 
						 * @param 'milestone' - Id of select element of Owner
						 * @param  array - array of milestones
						 * @param function - callback function
						 **/
						fillTokenizedSelect('pipeline_milestone', array, function(){
														
							// Quotes required for option value because milestone can have spaces in between
							if(value && value.milestone)
								$("#pipeline_milestone",el).find('option[value=\"'+ value.milestone +'\"]').attr("selected", "selected");
								
							// If callback is present, it is called to deserialize the select field
							if (callback && typeof (callback) === "function") {
								var optionsHtml = '<option value="">Select...</option>';
								$.each(array, function(index,element){
									optionsHtml += Handlebars.compile('<option value="{{element}}">{{element}}</option>')({element : element});
								});
								// execute the callback, passing parameters as necessary
								callback($(optionsHtml));
							}
						}, defaultSelectOption);
    			   }
    });
}

/**
 * Build the Pipeline list filter for displaying the pipeline.
 * @param cel
 * @returns
 */
function setupDealsTracksList(cel){
	this.trackListView = new Base_Collection_View({ url : '/core/api/milestone/pipelines', templateKey : "opportunity-track-list", individual_tag_name : 'li', postRenderCallback : function(el){
		trigger_dropdown_select($(".pipeline-tour-dropdown", el));
		trigger_dropdown_select($(".opportunity-track-dropdown", el));
		var tracksArray = trackListView.collection.models;
		$.each(tracksArray,function(i,value){
			console.log(value.toJSON());
			if(pipeline_id == 0 && value.toJSON().isDefault){
				pipeline_id = value.id;
				console.log('default pipeline set.');
				_agile_set_prefs('agile_deal_track',pipeline_id);
			}
				
			if(value.id == pipeline_id)
				$('#deals-tracks .filter-dropdown').append(Handlebars.compile('{{name}}')({name : value.attributes.name}));
		});
		
		// Add all option for the deals in the list view.
		if (_agile_get_prefs("agile_deal_view"))
			$('#deals-tracks .dropdown-menu').append('<li><a id="1" class="pipeline" data="All" style="cursor: pointer;">All</a></li>');
		else{
			setupNewDealFilters(function(){
				startGettingDeals();
			});
		}
		// Hide the track list if there is only one pipeline.
		if(tracksArray.length<=1)
			$('#deals-tracks',cel).hide();
		
		
	}});
	this.trackListView.collection.fetch();
	$('#deals-tracks',cel).append(this.trackListView.render().el);
	
}

/**
 * Copy the cursor in the last model of collection to the new model while adding it to the collection. 
 * @param dealPipelineModel
 * @param newDeal
 * @returns
 */
function copyCursor(dealPipelineModel, newDeal){
	var dealColl = dealPipelineModel[0].get('dealCollection');
	if(dealColl.length > 0 && dealColl.at(dealColl.length -1).get('cursor'))
		newDeal.cursor = dealColl.at(dealColl.length -1).get('cursor');
	
	return newDeal;
}

/**
 * Append Column names for Deals customfields to the Deals List view.
 */
function appendCustomfieldsHeaders(el){
	$.ajax({
		url: 'core/api/custom-fields/scope?scope=DEAL',
		type: 'GET',
		dataType: 'json',
		success: function(customfields){
			var columns = '';
			$.each(customfields, function(index,customfield){
				columns +=  Handlebars.compile('<th>{{label}}</th>')({label : customfield.field_label});
			});
			$(el).find('#deal-list thead tr').append(columns);
		}
	});
}

/**
 * Append Deals customfields to the Deals List view.
 */ 
function appendCustomfields(el){
	$.ajax({
		url: 'core/api/custom-fields/scope?scope=DEAL',
		type: 'GET',
		dataType: 'json',
		success: function(customfields){
			 var deals = App_Deals.opportunityCollectionView.collection.models;
			 $(el).find('td.deal_custom_replace').remove();
			 $(el).find('#opportunities-model-list tr').each(function(index,element){
				 var row = '';
				 $.each(customfields, function(i,customfield){
				 		if(customfield.field_type == "DATE")
				 			row += '<td class="deal_custom_replace"><div class="text-ellipsis" style="width:6em">'+dealCustomFieldValueForDate(customfield.field_label,deals[index].attributes.custom_data)+'</div></td>';
				 		else
							row += '<td class="deal_custom_replace"><div class="text-ellipsis" style="width:6em">'+dealCustomFieldValue(customfield.field_label,deals[index].attributes.custom_data)+'</div></td>';
					});
				 $(this).append(row);
			 });
			 
		}
	});
}

/**
 * Returns the value of the custom field.
 * @param name name of the custom field.
 * @param data the name. value pair of the custom fields of the deal.
 * @returns {String} value of the custom field.
 */
function dealCustomFieldValue(name, data){
	var value = '';
	$.each(data,function(index, field){
		if(field.name == name){
			value = field.value;
		}
	});
	return value;
}

function dealCustomFieldValueForDate(name, data){
	var value = '';
	$.each(data,function(index, field){
		if(field.name == name){
			if(!field.value)
				return '';
			var dateString = new Date(field.value);
			if(dateString == "Invalid Date")
				value = getDateInFormatFromEpoc(field.value);
			else
				value = en.dateFormatter({raw: getGlobalizeFormat()})(dateString);
			
		}
	});
	return value;
}

function populateLostReasons(el, value){
	if(!$('#deal_lost_reason',el).hasClass("hidden")){
		$('#deal_lost_reason',el).addClass("hidden");
	}
	var tracks = new Base_Collection_View({url : '/core/api/categories?entity_type=DEAL_LOST_REASON', sortKey : "label"});
	tracks.collection.fetch({
		success: function(data){
			var jsonModel = data.toJSON();
			var html = '<option value="">Select...</option>';
			console.log(jsonModel);
			
			$.each(jsonModel,function(index,lostReason){
				if (value && value.lost_reason_id == lostReason.id){
					html+= Handlebars.compile('<option value="{{id}}" selected="selected">{{label}}</option>')({label : lostReason.label, id : lostReason.id});
					$('#deal_lost_reason',el).removeClass("hidden");
				}else{
					html+= Handlebars.compile('<option value="{{id}}">{{label}}</option>')({label : lostReason.label, id : lostReason.id});
				}
			});
			$('#lost_reason', el).html(html);
			console.log('adding');
			$('#lost_reason', el).closest('div').find('.loading-img').hide();

			// Hide loading bar
			hideTransitionBar();

			if($('#pipeline_milestone',el).length>0){
				var temp = $('#pipeline_milestone',el).val();
				var track = temp.substring(0, temp.indexOf('_'));
				var milestone = temp.substring(temp.indexOf('_') + 1, temp.length + 1);
				$('#pipeline_milestone',el).closest('form').find('#pipeline').val(track);
				$('#pipeline_milestone',el).closest('form').find('#milestone').val(milestone);
				console.log(track, '-----------', milestone);
				var lost_milestone_flag = false;
				$('#pipeline_milestone',el).find('option').each(function(){
					if($(this).css("display") == "none" && $(this).val() == temp){
						lost_milestone_flag = true;
					}
				});
				if(lost_milestone_flag && $('#lost_reason',$('#pipeline_milestone',el).closest('.modal')).find('option').length>1){
					$('#deal_lost_reason',$('#pipeline_milestone',el).closest('.modal')).removeClass("hidden");
				}else{
					$('#lost_reason',$('#pipeline_milestone',el).closest('.modal')).val("");
					$('#deal_lost_reason',$('#pipeline_milestone',el).closest('.modal')).addClass("hidden");
				}
			}else{
				if($('#lost_reason',el).find('option').length>1){
					$('#dealLostReasonModal').modal('show');
				}
			}
		}
	}); 
}

function serialize_deal_products(form_id)
{
				if(!App_Deal_Details.deal_products_collection_view)
					return App_Deal_Details.savedproducts;
				var arr = [];
				if(App_Deal_Details.deal_products_collection_view && App_Deal_Details.deal_products_collection_view.collection)
				{
					var arrCheckedProdcts=App_Deal_Details.deal_products_collection_view.collection.where({"isChecked":true});
					$.each(arrCheckedProdcts,function(index,value){
						arr.push(value.toJSON());	
					});
				}
				return arr;
}
function populate_deal_products(el, value,form_id){
	var me=this;
	me._el=el;
	me._value=value;
	App_Deal_Details.savedproducts=value?value.products:null;
	me._form_id=form_id;

	//Reset 
	$(form_id).off('click');
	$(form_id).off('keyup');
	$(form_id).off('keypress');
	$(form_id).off('blur');
	$(".modal-body").off('click');
	
	$("#deal_products_div",el).html("");
	App_Deal_Details.deal_products_collection_view=null;

	$(".discounttype-input-group-btn ul",form_id).html("<li><a >Percent</a></li><li><a >Value</a></li>")
	if($(".toggleHead i[class='icon-minus-sign']",form_id))
	{
		$(".toggleHead",form_id).find('i').removeClass('icon-minus-sign');	
	}

	$(".toggleHead",form_id).next().addClass("hide");
	$(".toggleHead",form_id).find('i').addClass('icon-plus-sign');	

	if($("#discount_type",form_id).val()==""  )
		$("#discount_type",form_id).val("Value");
	$("#discount_type_btn span:first-child",form_id).text($("#discount_type",form_id).val());
	//Init

	$(".modal-body").on(
			"click",form_id,
			function(e)
			{
				var source = e.target || e.srcElement;
				if(source.id=="discount_type_btn" || $(source).hasClass("caret") || $(source).hasClass("m-r-xs"))
					return;
				if($(source).hasClass("caret"))
					return;
				if($(".discounttype-input-group-btn",me._form_id).hasClass("open"))
				{
					$(".discounttype-input-group-btn",me._form_id).removeClass("open");
				}	
			});
	$(form_id).on(
			"click",".toggleHead",
			function(e)
			{
				$(this).find('i').toggleClass('icon-plus-sign').toggleClass('icon-minus-sign');
				$(this).next().toggleClass("hide");
				//$(this).next().slideToggle('fast');
				me.Process();
			});
		this.Process=function()
		{
			if(App_Deal_Details.deal_products_collection_view !=null)
				return;
				App_Deal_Details.deal_products_collection_view=new Base_Collection_View({ url : '/core/api/products', 
					templateKey : "deal-products",
					individual_tag_name : 'tr',className:'deal-products_tr',sort_collection : false,
					errorCallback:function(e)
					{
						console.log(e)
					},
					postRenderCallback : function(el)
					{
						//$(el).addClass("table-responsive");
						console.log("loaded products : ", el);
						$(me._form_id).on("click",".dealproducts_td_checkbox",
						function(e)
						{
							me.processProductsClick(e);
						});
						$(me._form_id).on("click",".dealproducts_td_qty_span",
						function(e)
						{
							me.processProductQtyClick(e);
						});
						$(me._form_id).on("click",".discountcheck",
						function(e)
						{
							
							me.calculateGrandTotal(e);
						});
						$(me._form_id).on("keyup",".discountvalue",
						function(e)
						{
							me.calculateGrandTotal(e);
						});
						$(me._form_id).on("keypress",".dealproducts_qty_input",
								function(e)
								{
									me.updateOnEnter(e);
								});
						$(me._form_id).on("blur",".dealproducts_qty_input",
								function(e)
								{
									me.close(e,"blur");
								});
						$(me._form_id).on("blur",".discounttype-input-group-btn ul",
								function(e)
								{
									$(".discounttype-input-group-btn",me._form_id).removeClass("open");
								});
						$(me._form_id).on("click",".discounttype-input-group-btn ul li a",
								function(e)
								{
									me.toggleDiscountOptionsClick(e);
								});
						$(me._form_id).on("click",".discounttype-select",
								function(e)
								{
									me.toggleDiscountButton(e);
								});
						$(me._form_id).on("click",".dealproducts_th_checkbox",
								function(e)
								{
									me.toggleAllProducts(e);
								});
						
					}});
					App_Deal_Details.deal_products_collection_view.collection.fetch({
					success : function(data)
					{
						var bProductsFound=false;
						for(var key in data.models)
						{
							var _found=false;
							bProductsFound=true;
							var _id=data.models[key].get("id");
							if(me._value && me._value.products)
							{
								
								for(var key1 in me._value.products)
								{
									if(me._value.products[key1].id	==_id)
									{
										data.models[key].set("qty",me._value.products[key1].qty);
										data.models[key].set("total",me._value.products[key1].total);
										data.models[key].set("price",me._value.products[key1].price);
										data.models[key].set("isChecked",true);	
										_found=true;
									}
								}
								
							}

							if(!data.models[key].get("qty"))
							{	
								data.models[key].set("qty",1);
								data.models[key].set("total",data.models[key].get("price"));
								data.models[key].set("isChecked",false);
							}	
						}
						if(me._value && me._value.products)
						{
							for(var key1 in me._value.products)
							{
								bProductsFound=true;
								var _found=false;
								var _id=me._value.products[key1].id; 
								
								for(var key in data.models)
								{
									if(data.models[key].id	==_id)
									{
										_found=true;
									}
								}
								if(!_found)
								{	
									var deletedProduct=new Backbone.Model();
									data.add(deletedProduct)
									deletedProduct.set("qty",me._value.products[key1].qty)
									deletedProduct.set("id",me._value.products[key1].id)
									deletedProduct.set("total",me._value.products[key1].total)
									deletedProduct.set("price",me._value.products[key1].price)
									deletedProduct.set("isChecked",true)
									deletedProduct.set("name",me._value.products[key1].name)
									deletedProduct.set("description",me._value.products[key1].description)
									

									//var deletedProduct=new Backbone.model()
									//deletedProduct.id = url;
									//data.models[key].set("qty",1);
									//data.models[key].set("total",data.models[key].get("price"));
									//data.models[key].set("isChecked",false);
								}	
							}
						}
						if(bProductsFound==false)
						{

							var sHTML='<tr><td colspan="6"><center>You do not have any Products currently setup.</center></td></tr>';
							$("#deal-products-model-list").append(sHTML);
						}
					}
				});
				
				App_Deal_Details.deal_products_collection_view.render(); 
				$("#deal_products_div",el).append(App_Deal_Details.deal_products_collection_view.el);
			}	
						
				this.toggleAllProducts=function(e)
				{

					if($(".dealproducts_th_checkbox",me._form_id).is(":checked"))
					{	
						$(".dealproducts_td_checkbox",me._form_id).each(function(index,value){
							if(!$(value).is(":checked"))			
								$(value).trigger("click")
						});
					}
					else
					{
						$(".dealproducts_td_checkbox",me._form_id).each(function(index,value){
							if($(value).is(":checked"))			
								$(value).trigger("click")
						});
					}
				}
				this.updateOnEnter=function (e)
				{
					if(e.keyCode==13)this.close(e,"enter");

				}
				this.toggleDiscountButton=function(e)
				{
					//$(".discounttype-input-group-btn","#opportunityForm").removeClass("open").addClass("open")
					//return;
					var source = e.target || e.srcElement;
					if($(".discounttype-input-group-btn",me._form_id).hasClass("open"))
						$(".discounttype-input-group-btn",me._form_id).removeClass("open")
					else
						$(".discounttype-input-group-btn",me._form_id).addClass("open")
				}
				this.toggleDiscountOptionsClick=function (e)
				{
					var source = e.target || e.srcElement;
					var sText=$(source).text();
					var objButtonGroup=$(source).closest(".discounttype-input-group-btn")

					var objButtonInput=objButtonGroup.children().eq(2);
					var objButton=objButtonGroup.children().eq(0);
					var objButtonSpan=objButton.children().eq(0);
					objButtonSpan.text(sText);
					objButtonInput.val(sText);	
					//$(".discounttype-select","#opportunityForm").trigger("click");
					me.toggleDiscountButton(e);
					me.calculateGrandTotal();
				}
				this.processProductsClick=function(e)
				{
					var source = e.target || e.srcElement;
					var checked = false;
					var iTotal=0;
					var objTR=$(source).closest('tr');
					var objData=objTR.data();
					var _id=$(source).attr("data")
					var objModel= App_Deal_Details.deal_products_collection_view.collection.get(_id)
			
					if($(source).is(':checked'))
					{
						if(!objTR.hasClass("pseduo-row"))
						{
							objModel.set("isChecked",true)	
						}
						
					}
					else
					{
						objModel.set("isChecked",false)	
						var id=objData.get('id')
					}
					me.calculateGrandTotal();
				}
				
				this.onEdit=function(e)
				{

					this.$el.addClass("editing");

					this.input.focus();
					$(this.input).val($(this.input).val());

				}
				this.close=function(e,type)
				{
					var source = e.target || e.srcElement;		
					var value=$(source).val();
					
					//type-enter/blur
					if(type=="blur")
					{
						if(!$.isNumeric(value) || parseFloat(value)<=0)
						{
							value=$(source).attr("prev_val");
							if(!$.isNumeric(value))
							{
								value=1;
							}
						}
						$(source).removeClass('block').addClass('hide');	
						var objTD=$(source).parent('td');
						objTD.children().eq(0).removeClass('hide').addClass('block');
					}
					else
					{
						if($.isNumeric(value) && parseFloat(value)>=1)
						{
							$(source).removeClass('block').addClass('hide');			
							var objTD=$(source).parent('td');
							objTD.children().eq(0).removeClass('hide').addClass('block');
						}		

					}
						
					if($.isNumeric(value) && parseFloat(value)>=1)
					{

						
						var objTR=$(source).closest('tr');
						var objData=objTR.data();
						var objModel= App_Deal_Details.deal_products_collection_view.collection.get(objData.id)
						var inputCheckbox=objTD.parent().children().eq(0).children().eq(0).children().eq(0);
						if(!$(inputCheckbox).is(':checked'))
						{	
							objModel.set("isChecked",true)
						}	
						objModel.set("qty",value)
					}
					me.calculateGrandTotal();

				}
				this.processProductQtyClick=function(e)
				{
					var source = e.target || e.srcElement;
					var jSpan=$(source)
					if($(source).prop("tagName")=="SPAN")
					{
						this.input=jSpan.next()
					}
					else if($(source).prop("tagName")=="TD")
					{
						this.input=$(source).children().eq(1);
						jSpan=$(source).children().eq(0)
					}
						
					this.input.removeClass('hide').addClass('block');
					this.input.focus();
					$(this.input).attr("prev_val",$(this.input).val())
					$(this.input).val($(this.input).val())
					jSpan.removeClass('block').addClass('hide');
					

				}
				this.calculateGrandTotal=function ()
				{
				//	var currentDeal = App_Deal_Details.dealDetailView.model	
					var iTotal=0;
					for(var key in App_Deal_Details.deal_products_collection_view.collection.models)
					{
						var iQtyPriceTotal= parseFloat( App_Deal_Details.deal_products_collection_view.collection.models[key].get("qty")) *parseFloat( App_Deal_Details.deal_products_collection_view.collection.models[key].get("price"))
						if(iQtyPriceTotal.toFixed)
							iQtyPriceTotal=iQtyPriceTotal.toFixed(2)
						App_Deal_Details.deal_products_collection_view.collection.models[key].set("total",iQtyPriceTotal)
						var sId=App_Deal_Details.deal_products_collection_view.collection.models[key].get("id")
						if(App_Deal_Details.deal_products_collection_view.collection.models[key].get("isChecked"))
							iTotal+=iQtyPriceTotal;		
					}
					var iDiscountAmt=0;
					if($("#apply_discount",me._form_id).is(':checked'))
					{
						iDiscountAmt=$("#discount_value",me._form_id).val();
						if(iDiscountAmt=="")
							iDiscountAmt=0
						if(iDiscountAmt!=null && iDiscountAmt!=undefined )
							{
								if($(".discounttype-input-group-btn span",me._form_id).eq(0).text()=="Percent")
								{
									iDiscountAmt=(iTotal *  iDiscountAmt)/100;
								}
							}
					}
					if(iDiscountAmt.toFixed)
						iDiscountAmt=iDiscountAmt.toFixed(2)
					$("input[name='discount_amt']",$(me._form_id)).val(iDiscountAmt);
					iTotal-=iDiscountAmt
					if($("input[name='currency_conversion_value']",$(me._form_id)).length)
						$("input[name='currency_conversion_value']",$(me._form_id)).val(iTotal);
					else
						$("input[name='expected_value']",$(me._form_id)).val(iTotal);
					
					ValidateDealDiscountAmt(me._form_id);
				}
				
}

function ValidateDealDiscountAmt(_form_id)
{
	
	var iTotal=0;
	try{
		var iDiscountValue=$("#discount_value",_form_id).val();
		$(".calculation-error-status",_form_id).html("")
		var iDiscountValue=$("#discount_value",_form_id).val();
			if(iDiscountValue.trim() && !$.isNumeric(iDiscountValue))
			{
				$(".calculation-error-status",_form_id).html("Discount should be numeric")
				return false;
			}
		if($("#apply_discount",_form_id).is(':checked'))
		{
			
			if(!$.isNumeric(iDiscountValue))
			{
				$(".calculation-error-status",_form_id).html("Discount should be numeric")
				return false;
			}
			if(iDiscountValue!=null && iDiscountValue!=undefined )
			{
				if($(".discounttype-input-group-btn span",_form_id).eq(0).text()=="Percent")
				{
					if(parseFloat(iDiscountValue)>100)
					{
						
						$(".calculation-error-status",_form_id).html("Discount percent cannot be greater than 100")
						return false;
					}
					else if(parseFloat(iDiscountValue)<0)
					{
						$(".calculation-error-status",_form_id).html("Discount percent cannot be less than 0")
						return false;
					}	
				}
				else
				{
					var iTotal=0;
					for(var key in App_Deal_Details.deal_products_collection_view.collection.models)
					{
						var iQtyPriceTotal= parseFloat( App_Deal_Details.deal_products_collection_view.collection.models[key].get("qty")) *parseFloat( App_Deal_Details.deal_products_collection_view.collection.models[key].get("price"))
						App_Deal_Details.deal_products_collection_view.collection.models[key].set("total",iQtyPriceTotal)
						var sId=App_Deal_Details.deal_products_collection_view.collection.models[key].get("id")
						if(App_Deal_Details.deal_products_collection_view.collection.models[key].get("isChecked"))
						{
						
							iTotal+=iQtyPriceTotal;		
						}	
					}
					if(iTotal ==0 )
					{
						$(".calculation-error-status",_form_id).html("Atleast one product should be selected to apply discount")
						return false;		
					}
					if(parseFloat(iDiscountValue)>parseFloat(iTotal))
					{
						$(".calculation-error-status",_form_id).html("Discount value cannot be greater than total products value")
						return false;	
					}
					if(parseFloat(iDiscountValue)<0)
					{
						$(".calculation-error-status",_form_id).html("Discount value cannot be less than 0")
						return false;	
					}	
				}
			}

		}	
	}catch(e)
	{

	}	
	return true;
}
function populateDealSources(el, value){
	if(!$('#deal_deal_source',el).hasClass("hidden")){
		$('#deal_deal_source',el).addClass("hidden");
	}
	var tracks = new Base_Collection_View({url : '/core/api/categories?entity_type=DEAL_SOURCE', sort_collection: false});
	tracks.collection.fetch({
		success: function(data){
			var jsonModel = data.toJSON();
			var html = '<option value="">Select...</option>';
			console.log(jsonModel);
			
			$.each(jsonModel,function(index,dealSource){
				if (value && value.deal_source_id == dealSource.id){
					html += Handlebars.compile('<option value="{{id}}" selected="selected">{{label}}</option>')({label : dealSource.label, id : dealSource.id});
					$('#deal_deal_source',el).removeClass("hidden");
				}else{
					html += Handlebars.compile('<option value="{{id}}">{{label}}</option>')({label : dealSource.label, id : dealSource.id});
				}
			});
			$('#deal_source', el).html(html);
			console.log('adding');
			$('#deal_source', el).closest('div').find('.loading-img').hide();

			// Hide loading bar
			hideTransitionBar();

			if($('#deal_source',el).find('option').length>1){
				$('#deal_deal_source',el).removeClass("hidden");
			}
		}
	}); 
}