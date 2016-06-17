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
function populateTrackMilestones(el, dealsDetails, value, callback, defaultSelectOption, id, filter_el, field_name){
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
			if(jsonModel.length==1 && !filter_el){
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
				if(!filter_el)
				{
					$('#' + id, el).closest('.control-group').find('label').html('Milestone<span class="field_req">*</span>');
				}
			}
			else {
				$.each(jsonModel,function(index,mile){
					console.log(mile.milestones,value);
					var array = [];
					html+='<optgroup label="'+mile.name+'">';
					if(filter_el && value && value.milestone == "ALL@MILESTONES")
					{
						html += Handlebars.compile('<option selected="selected" value="{{id}}_ALL@MILESTONES">{{name}} - All</option>')({id : mile.id, name : mile.name});
					}
					else if(filter_el)
					{
						html += Handlebars.compile('<option value="{{id}}_ALL@MILESTONES">{{name}} - All</option>')({id : mile.id, name : mile.name});
					}
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
				if(!filter_el)
				{
					$('#' + id, el).closest('.control-group').find('label').html('Track & Milestone<span class="field_req">*</span>');
				}
			}
			
			if(!filter_el)
			{
				$('#' + id, el).html(html);
				console.log('adding');
				$('#' + id, el).closest('div').find('.loading-img').hide();
			}
			else
			{
				$(filter_el).html("<select class='form-control required' name='"+field_name+"'>"+html+"</select>");
				OPPORTUNITY_LHS_FILTER_CHANGE = true;
			}
			

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
						contacts_data_array.push(App_Deals.dealContactTypeCustomFields.collection.get(val).toJSON());
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
						companies_data_array.push(App_Deals.dealContactTypeCustomFields.collection.get(val).toJSON());
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
    if(!filters_collection && App_Deals.deal_filters && App_Deals.deal_filters.collection)
    {
    	filters_collection = App_Deals.deal_filters.collection;
    }
    setNewDealFilters(filters_collection);
	var query = ''
	var url = 'core/api/deal/filters/query/list/'+_agile_get_prefs('deal-filter-name')+'?order_by='+getDealSortFilter();
    /*if (_agile_get_prefs('deal-filters'))
    {
    	var dealFilters = getDealFilters();
    	var dealFilterJSON = JSON.parse(dealFilters);
    	if(dealFilterJSON && (dealFilterJSON["rules"] || dealFilterJSON["or_rules"]))
    	{
    		url = 'core/api/deal/filters/query/list/'+_agile_get_prefs('deal-filter-name');
    	}
    	//query = '&filters=' + encodeURIComponent(getDealFilters());
    }*/
    // Fetches deals as list
    App_Deals.opportunityCollectionView = new Deals_Milestone_Events_Collection_View({ url : '' + url,
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