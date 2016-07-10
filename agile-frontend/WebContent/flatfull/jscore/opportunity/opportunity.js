/**
 * opportunity.js is a script file that handles opportunity pop-over,
 * milestones and owner select list.
 * 
 * @module Deals
 * 
 **/

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
	var track_name = "";
	if(!this.trackListView)
	{
		this.trackListView = new Deals_Track_Change_Events_Collection_View({ url : '/core/api/milestone/pipelines', templateKey : "opportunity-track-list", individual_tag_name : 'li', postRenderCallback : function(el){
			var tracksArray = trackListView.collection.models;
			if(tracksArray && tracksArray.length==1){
				milestone_util.showMilestonePopup(tracksArray[0].toJSON(), function(new_milestone){
					if(new_milestone)
					{
						trackListView.collection.get(new_milestone.id).set(new BaseModel(new_milestone), { silent : true });
					}
				});
			}
			else if(tracksArray){
				milestone_util.isNotyVisible = false;
				$.each(tracksArray,function(index,mile){
					milestone_util.showMilestonePopup(mile.toJSON(), function(new_milestone){
						if(new_milestone)
						{
							trackListView.collection.get(new_milestone.id).set(new BaseModel(new_milestone), { silent : true });
						}
					});
				});
			}
			$.each(tracksArray,function(i,value){
				console.log(value.toJSON());
				if(pipeline_id == 0 && value.toJSON().isDefault){
					pipeline_id = value.id;
					console.log('default pipeline set.');
					_agile_set_prefs('agile_deal_track',pipeline_id);
				}
					
				if(value.id == pipeline_id)
				{
					track_name = value.attributes.name;
				}
			});
			
			$("#deals-new-list-view", $("#opportunity-listners")).hide();
			$("#deals-new-milestone-view", $("#opportunity-listners")).show();
			$('#deals-tracks',$("#opportunity-listners")).show();
			setTimeout(function(){
				$('#deals-tracks .filter-dropdown', $("#opportunity-listners")).append(Handlebars.compile('{{name}}')({name : track_name}));
			}, 100);
			startGettingDeals();
			setupTracksAndMilestones($('#opportunity-listners'));

			// Hide the track list if there is only one pipeline.
			if(tracksArray.length<=1)
				$('#deals-tracks',cel).hide();
			
			
		}});
		this.trackListView.collection.fetch();
		$('#deals-tracks',cel).append(this.trackListView.render().el);
	}
	else
	{
		$('#deals-tracks',cel).append(this.trackListView.render(true).el);
	}
	
	
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
function appendCustomfields(el, is_append){
	if(!App_Deals.custom_fields_list)
	{
		$.ajax({
			url: 'core/api/custom-fields/scope?scope=DEAL',
			type: 'GET',
			dataType: 'json',
			success: function(customfields){
				App_Deals.custom_fields_list = customfields;
				//If header already added, we can ignore header part
				if(!is_append)
				{
					var columns = '';
					$.each(customfields, function(index,customfield){
						columns +=  Handlebars.compile('<th>{{label}}</th>')({label : customfield.field_label});
					});
					$(el).find('#deal-list thead tr').append(columns);
				}

				appendCustomFiledsData(el, customfields);
			}
		});
	}
	else
	{
		//If header already added, we can ignore header part
		if(!is_append)
		{
			var columns = '';
			$.each(App_Deals.custom_fields_list, function(index,customfield){
				columns +=  Handlebars.compile('<th>{{label}}</th>')({label : customfield.field_label});
			});
			$(el).find('#deal-list thead tr').append(columns);
		}

		appendCustomFiledsData(el, App_Deals.custom_fields_list);
	}
}

function appendCustomFiledsData(el, customfields)
{
	var deals = App_Deals.opportunityCollectionView.collection.models;
	$(el).find('td.deal_custom_replace').remove();
	$(el).find('#opportunities-model-list tr').each(function(index,element){
		var row = '';
		$.each(customfields, function(i,customfield){
		 	if(customfield.field_type == "DATE")
		 		row += '<td class="deal_custom_replace"><div class="text-ellipsis" style="width:6em">'+dealCustomFieldValueForDate(customfield.field_label,deals[index].attributes.custom_data)+'</div></td>';
		 	else if(customfield.field_type == "CONTACT")
	 		{
	 			row += '<td class="deal_custom_replace" deal_contact_id="'+Handlebars.compile('{{id}}')({id : deals[index].attributes.id})+'_'+Handlebars.compile('{{id}}')({id : customfield.id})+'"></td>';
	 		}
	 		else if(customfield.field_type == "COMPANY")
	 		{
	 			row += '<td class="deal_custom_replace" deal_company_id="'+Handlebars.compile('{{id}}')({id : deals[index].attributes.id})+'_'+Handlebars.compile('{{id}}')({id : customfield.id})+'"></td>';
	 		}
		 	else
				row += '<td class="deal_custom_replace"><div class="text-ellipsis" style="width:6em">'+dealCustomFieldValue(customfield.field_label,deals[index].attributes.custom_data)+'</div></td>';
		});
		$(this).append(row);
	});
	dealCustomFieldValueForContact(el,customfields,deals);
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

function dealCustomFieldValueForContact(el, customfields, deals){
	var referenceContactIds = "";
	$.each(deals, function(index, dealModel){
		$.each(dealModel.get("custom_data"), function(index, field){
			if(isContactTypeCustomField(customfields, field) || isCompanyTypeCustomField(customfields, field))
			{
				var contactIdsJSON = JSON.parse(field.value);
				$.each(contactIdsJSON, function(index_1, val){
					if(App_Deals.dealContactTypeCustomFields && App_Deals.dealContactTypeCustomFields.collection && !App_Deals.dealContactTypeCustomFields.collection.get(val))
					{
						referenceContactIds += val+",";
					}
					else if(!App_Deals.dealContactTypeCustomFields)
					{
						referenceContactIds += val+",";
					}
					
				});
			}
		});
	});

	App_Deals.referenceContactsCollection = new Base_Collection_View({ url : '/core/api/contacts/references?references='+referenceContactIds, sort_collection : false });
	
	if(referenceContactIds)
	{
		App_Deals.referenceContactsCollection.collection.fetch({
			success : function(data){
				if (data && data.length > 0)
				{
					if(App_Deals.dealContactTypeCustomFields && App_Deals.dealContactTypeCustomFields.collection)
					{
						App_Deals.dealContactTypeCustomFields.collection.add(data.toJSON());
					}
					else
					{
						App_Deals.dealContactTypeCustomFields = new Base_Collection_View({ data : data.toJSON() });
					}
				}
				setupContactTypeCustomFields(el, customfields, deals);
				hideTransitionBar();
			}
		});
	}
	else
	{
		setupContactTypeCustomFields(el, customfields, deals);
		hideTransitionBar();
	}
}

function setupContactTypeCustomFields(el, customfields, deals){
	$.each(deals, function(index, dealModel){
		var contacts_data_json = {};
		var companies_data_json = {};
		$.each(customfields, function(index, cu_field){
			$.each(dealModel.get("custom_data"), function(index, field){
				if(field.name == cu_field.field_label && cu_field.field_type == "CONTACT")
				{
					var contacts_data_array = [];
					var contactIdsJSON = JSON.parse(field.value);
					$.each(contactIdsJSON, function(index_1, val){
						var con = App_Deals.dealContactTypeCustomFields.collection.get(val);
						if(con)
						{
							contacts_data_array.push(con.toJSON());
						}
					});
					//If same deal has two or more different contact type custom fields, 
					//we will add them to contacts_data_json with deal id and custom field name
					contacts_data_json[dealModel.id+"_"+field.name] = contacts_data_array;
				}

				if(field.name == cu_field.field_label && cu_field.field_type == "COMPANY")
				{
					var companies_data_array = [];
					var contactIdsJSON = JSON.parse(field.value);
					$.each(contactIdsJSON, function(index_1, val){
						var comp = App_Deals.dealContactTypeCustomFields.collection.get(val);
						if(comp)
						{
							companies_data_array.push(comp.toJSON());
						}
					});
					//If same deal has two or more different company type custom fields, 
					//we will add them to companies_data_json with deal id and custom field name
					companies_data_json[dealModel.id+"_"+field.name] = companies_data_array
				}
			});
		});

		$.each(customfields, function(index, cu_field){
			$.each(dealModel.get("custom_data"), function(index, field){
				if(field.name == cu_field.field_label && (cu_field.field_type == "CONTACT" || cu_field.field_type == "COMPANY"))
				{
					var data_json = contacts_data_json[dealModel.id+"_"+field.name];
					var template = 'contacts-custom-view-custom-contact';
					var ele_id = "deal_contact_id";
					var img_ele_class = "contact-type-image";

					if(cu_field.field_type == "COMPANY")
					{
						template = 'contacts-custom-view-custom-company';
						ele_id = "deal_company_id";
						img_ele_class = "company-type-image";
						data_json = companies_data_json[dealModel.id+"_"+field.name];
					}
					getTemplate(template, data_json, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$(el).find("td["+ele_id+"="+dealModel.id+"_"+cu_field.id+"]").html($(template_ui).html());
						var ellipsis_required = false;
						$(el).find("td["+ele_id+"="+dealModel.id+"_"+cu_field.id+"]").find("."+img_ele_class).each(function(index, val){
							if(index > 2)
							{
								ellipsis_required = true;
								$(this).remove();
							}
						});
						if(ellipsis_required)
						{
							$(el).find("td["+ele_id+"="+dealModel.id+"_"+cu_field.id+"]").find("div:first").append("<div class='m-t' style='font-size:20px;'>...</div>");
						}
					}, null);
				}
			});
		});
	});
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
							{	
								var _id=$(value).attr("data")
								var objModel= App_Deal_Details.deal_products_collection_view.collection.get(_id)
			
								
								objModel.set("isChecked",true)	
									
								//$(value).prop('checked',true);
								//$(value).trigger("click")
							}	
						});
					}
					else
					{
						$(".dealproducts_td_checkbox",me._form_id).each(function(index,value){
							if($(value).is(":checked"))			
							{
								var _id=$(value).attr("data")
								var objModel= App_Deal_Details.deal_products_collection_view.collection.get(_id)
			
								
								objModel.set("isChecked",false)	
								//$(value).prop('checked',false);
								//$(value).trigger("click")
							}	
						});
					}
					me.calculateGrandTotal();
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
						if(!$.isNumeric(value) || parseFloat(value)<=1)
						{
							return;
						}
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
							iTotal+=parseFloat(iQtyPriceTotal);		
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

/**
 * Fetches deals list view data.
 *
 * @param data - deal filters collection.
 */
function fetchDealsList(data){
	var filters_collection = data;
	var dealTag = null ; var url = null;
    if(!filters_collection && App_Deals.deal_filters && App_Deals.deal_filters.collection)
    {
    	filters_collection = App_Deals.deal_filters.collection;
    }
    if(filters_collection.dealToFilter){
		dealTag = filters_collection.dealToFilter ;
	}
    setNewDealFilters(filters_collection);
	var query = ''
    if (_agile_get_prefs('deal-filters'))
    {
    	if(dealTag){
    		url = "core/api/opportunity/based/tags?tag="+dealTag ;
			$('#opportunity-listners').find("#opp-header").after('<ul id="added-tags-ul" class="tagsinput inline v-top m-b-sm p-n" style="margin-left:10px;"><li class="inline-block tag btn btn-xs btn-primary" data='+dealTag+'><span>'+dealTag+'<a href="#deals" class="anchor close m-l-xs pull-right">×</a></span></li></ul>');
		}
		else{
			query = '&filters=' + encodeURIComponent(getDealFilters());
			url = 'core/api/opportunity/based?pipeline_id=' + pipeline_id + query ;
		}
    }   	

    // Fetches deals as list
    App_Deals.opportunityCollectionView = new Deals_Milestone_Events_Collection_View({ url : url,
        templateKey : "opportunities", individual_tag_name : 'tr', sort_collection : false, cursor : true, page_size : 25,
        postRenderCallback : function(el)
        {
        	$("#deals-new-milestone-view", $("#opportunity-listners")).hide();
        	$('#deals-tracks',$("#opportunity-listners")).hide();
        	$("#deals-new-list-view", $("#opportunity-listners")).show();
        	if (pipeline_id == 1)
            {
                pipeline_id = 0;
            }
            appendCustomfields(el, false);
            // Showing time ago plugin for close date
            includeTimeAgo(el);
            initializeDealListners(el);
            contactListener();
            setTimeout(function(){
                $('#delete-checked',el).attr("id","deal-delete-checked");
            },500);
        }, appendItemCallback : function(el)
        {
            appendCustomfields(el, true);

            // To show timeago for models appended by infini scroll
            includeTimeAgo(el);

        } });
    App_Deals.opportunityCollectionView.collection.fetch();

    $('.new-collection-deal-list', $("#opportunity-listners")).html(App_Deals.opportunityCollectionView.render().el);
}

function setupMilestoneViewWidth(){
	var currentTrack = trackListView.collection.get(pipeline_id).toJSON();
	var milestones = currentTrack.milestones.split(',');
	var count = milestones.length;
	if (!count){
		return;
	}
	// Setting dynamic auto width
	var width = 100 / count;

	if (_agile_get_prefs('deal-milestone-view'))
	{
		if (_agile_get_prefs('deal-milestone-view') == "compact" && count > 8)
			width = 100 / 8;

		if (_agile_get_prefs('deal-milestone-view') == "fit")
		{
			$('#opportunities-by-paging-model-list', $("#opportunity-listners")).find('.milestone-column').css("min-width",0);
		}
	}
	else if (count > 5)
	{
		width = 100 / 5;
	}
	var mile_col_ele = $('#opportunities-by-paging-model-list', $("#opportunity-listners")).find('.milestone-column');

	mile_col_ele.each(function(index){
		if(index != mile_col_ele.length - 1){
			$(this).width((width - 1) + "%");
		}else{
			$(this).width(width + "%");
		}
	});
}

function deleteDeal(id, milestone, dealPipelineModel, el){
	var id_array = [];
	var id_json = {};

	// Create array with entity id.
	id_array.push(id);

	// Set entity id array in to json object with key ids,
	// where ids are read using form param
	id_json.ids = JSON.stringify(id_array);

	var that = el;
	$.ajax({ url : 'core/api/opportunity/' + id, type : 'DELETE', success : function()
	{
		IS_DEAL_DELETED = true;
		// Remove the deal from the collection and remove the UI element.
		var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });
		if (!dealPipelineModel)
			return;

		var dealRemoveModel = dealPipelineModel[0].get('dealCollection').get(id);
		
		var dealRemoveValue = dealRemoveModel.attributes.expected_value;
		
		var removeDealValue = parseFloat($('#'+milestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))-parseFloat(dealRemoveValue); 
        


        $('#'+milestone.replace(/ +/g, '')+'_totalvalue').text(portlet_utility.getNumberWithCommasAndDecimalsForPortlets(removeDealValue));
      
        $('#'+ milestone.replace(/ +/g, '') + '_count').text(parseInt($('#' + milestone.replace(/ +/g, '') + '_count').text()) - 1);	
          
		 /* average of deal total */
      	var avg_deal_size = 0;
     	var deal_count = parseInt($('#' + milestone.replace(/ +/g, '') + '_count').text()); 
     	if(deal_count == 0)
     		avg_new_deal_size = 0;
     	else
     		avg_new_deal_size = removeDealValue / deal_count;	

			removeDealValue = portlet_utility.getNumberWithCommasAndDecimalsForPortlets(removeDealValue) ;
    	avg_new_deal_size =  portlet_utility.getNumberWithCommasAndDecimalsForPortlets(avg_new_deal_size);
       	var heading = milestone.replace(/ +/g, '');
        var symbol = getCurrencySymbolForCharts();
       
        $("#"+heading+" .dealtitle-angular").removeAttr("data"); 
        var dealTrack = $("#pipeline-tour-step").children('.filter-dropdown').text();	       
        var dealdata = {"dealTrack":dealTrack,"heading": heading ,"dealcount":removeDealValue ,"avgDeal" : avg_new_deal_size,"symbol":symbol,"dealNumber":deal_count};
		var dealDataString = JSON.stringify(dealdata); 
		$("#"+heading+" .dealtitle-angular").attr("data" , dealDataString); 

		dealPipelineModel[0].get('dealCollection').remove(dealPipelineModel[0].get('dealCollection').get(id));



		// Removes deal from list
		$(that).closest('li').css("display", "none");

		// Shows Milestones Pie
		pieMilestones();

		// Shows deals chart
		dealsLineChart();
	}, error : function(err)
	{
		if(err && err.status == 403)
		{
			showModalConfirmation("Delete Deal", 
				err.responseText, 
				function (){
					return;
				}, 
				function(){
					return;
				},
				function(){
					return;
				},
				"Cancel"
			);
			return;
		}
		
		$('.error-status', $('#opportunity-listners')).html(err.responseText);
		setTimeout(function()
		{
			$('.error-status', $('#opportunity-listners')).html('');
		}, 2000);
		console.log('-----------------', err.responseText);
	} });
}

function setupTracksAndMilestones(el){
	if(trackListView && trackListView.collection){
		var tracks = trackListView.collection.models;
		var is_first_track = true;
		$.each(tracks, function(index, trackObj){
			var track = trackObj.toJSON();
			if(_agile_get_prefs("agile_deal_track") != track.id.toString() && track.milestones){
				var style_class = "m-b-lg";
				if(index == tracks.length-1)
				{
					style_class = "";
				}
				if(is_first_track)
				{
					$('#new-track-list-paging').find('#moving-tracks').html("<div style='font-size:18px;' class='m-t-xs'>Tracks & Milestones</div>");
					style_class += " m-t-sm";
					is_first_track = false;
				}
				$('#new-track-list-paging').find('#moving-tracks').append("<div class='"+style_class+" p-r'><div class='text-md m-b-xs'>"+track.name+"</div><div id='"+track.id+"' style='border: 1px solid #dee5e7;'></div></div>")
				var milestones = track.milestones.split(",");
				var milestone_width = 100 / milestones.length;
				$.each(milestones, function(index_1, milestone_name){
					var milestone_heading_class = "milestone-heading";
					var span_html = "<span></span>";
					var border_right_html = "";
					if(index_1 == milestones.length - 1){
						milestone_heading_class = "";
						span_html = "";
						border_right_html = "border-right:none!important;"
					}
					var milestone_html = 	'<div class="milestone-column panel m-b-none b-n r-n panel-default" style="width: '+milestone_width+'%;min-width:0px;'+border_right_html+'">'+
											'<div class="dealtitle-angular panel-heading c-p b-n update-drag-deal" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="{{milestone_name}}">'+
											'<div class="'+milestone_heading_class+' text-left text-ellipsis" data-track="{{track_id}}">'+
											'<span class="miltstone-title text-base text-ellipsis inline-block v-bottom pull-left">{{milestone_name}}</span></div>'+
											''+span_html+'</div></div>';
					var milestone_tpl = Handlebars.compile(milestone_html);
					var json = {"milestone_name" : milestone_name, "track_id" : track.id};
					$("#"+track.id, $('#new-track-list-paging')).append(milestone_tpl(json));
					$("[data-toggle=tooltip").tooltip();
				});
			}
		});
	}
}