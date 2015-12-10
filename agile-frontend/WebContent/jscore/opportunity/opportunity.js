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
	$('#opportunities-model-list > tr').live('mouseenter', function () {
        var data = $(this).find('.data').attr('data');

        var currentDeal = App_Deals.opportunityCollectionView.collection.get(data);
       
        //console.log(currentDeal.toJSON());
        
        var ele = getTemplate("opportunity-detail-popover", currentDeal.toJSON());
        $(this).attr({
        	"rel" : "popover",
        	"data-placement" : 'right',
        	"data-original-title" : currentDeal.toJSON().name,
        	"data-content" :  ele
        });
       
        /**
         * Checks for last 'tr' and change placement of popover to 'top' inorder
         * to prevent scrolling on last row of list
         **/
        $('#opportunities-model-list > tr:last').attr({
        	"rel" : "popover",
        	"data-placement" : 'top',
        	"data-original-title" : currentDeal.toJSON().name,
        	"data-content" :  ele
        });
        $(this).popover('show');
     });
	
    /**
     * On mouse out on the row hides the popover.
     **/
	$('#opportunities-model-list > tr').live('mouseleave', function(){
    	 $(this).popover('hide');
    });
	
    /**
     * On click on the row hides the popover.
     **/
	$('#opportunities-model-list > tr, .hide-popover').live('click', function(){
    	 $(this).closest('tr').popover('hide');
    });
    
   /**
    * When deal is added from contact-detail by selecting 'Add Opportunity' from actions 
    * and then close button of deal is clicked, it should navigate to contact-detail.
    **/
	$('#close-deal').live('click', function(e){
    	e.preventDefault();
    	window.history.back();
    });
	
	$('#deal-milestone-regular').live('click', function(e){
    	e.preventDefault();
    	eraseCookie('deal-milestone-view');
    	App_Deals.deals();
    });
	
	$('#deal-milestone-compact').live('click', function(e){
    	e.preventDefault();
    	createCookie('deal-milestone-view','compact');
    	App_Deals.deals();
    });
	
	$('#deal-milestone-fit').live('click', function(e){
    	e.preventDefault();
    	createCookie('deal-milestone-view','fit');
    	App_Deals.deals();
    });
	
	//Check the archived filter for the first time and set it to false as default.
	if(readCookie('deal-filters')){
		var json = $.parseJSON(readCookie('deal-filters'));
		if(!json.archived){
			json.archived="false";
			createCookie('deal-filters',JSON.stringify(json));
		}
	} else {
		var json = {"owner_id":"","pipeline_id":"","milestone":"","value_filter":"equals","value":"","value_start":"","value_end":"","archived":"false","":false,"contact_ids":[]};
		json.archived="false";
		createCookie('deal-filters',JSON.stringify(json));
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
	fillSelect(id,'/core/api/users', 'domainUser', function fillOwner() {
		
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
					if(value && mile.id == value.pipeline_id && milestone == value.milestone)
						html+='<option value="'+mile.id+'_'+milestone+'" selected="selected">'+milestone+'</option>';
					else
						html+='<option value="'+mile.id+'_'+milestone+'">'+milestone+'</option>';
				});
				$('#'+id,el).closest('.control-group').find('label b').text('Milestone');
			}
			else {
				$.each(jsonModel,function(index,mile){
					console.log(mile.milestones,value);
					var array = [];
					html+='<optgroup label="'+mile.name+'">';
					$.each(mile.milestones.split(","), function(index,milestone){
						array.push($.trim(this));
						if(value && mile.id == value.pipeline_id && milestone == value.milestone)
							html+='<option value="'+mile.id+'_'+milestone+'" selected="selected">'+mile.name+' - '+milestone+'</option>';
						else
							html+='<option value="'+mile.id+'_'+milestone+'">'+mile.name+' - '+milestone+'</option>';
					});
					html+='</optgroup>';
					
				});
				$('#'+id,el).closest('.control-group').find('label b').text('Track & Milestone');
			}
			$('#'+id,el).html(html);
			console.log('adding');
			$('#'+id,el).closest('div').find('.loading-img').hide();
			
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
			var jsonModel = data.toJSON();
			var html = '<option value="">Select..</option>';
			console.log(jsonModel);
			
			// If there is only one pipeline, select the option by default and hide the field.
			if(jsonModel.length==1)
				html+='<option value="'+jsonModel[0].id+'" selected="selected">'+jsonModel[0].name+'</option>';
			else {
				$.each(jsonModel,function(index,mile){
					console.log(mile.milestones,value);
					if(!mile.name)
						mile.name = 'Default';
					if(value && mile.id == value.pipeline_id)
						html+='<option value="'+mile.id+'" selected="selected">'+mile.name+'</option>';
					else
						html+='<option value="'+mile.id+'">'+mile.name+'</option>';
					
				});
			}
			$('#pipeline',el).html(html);
			console.log('adding');
			$('#pipeline',el).closest('div').find('.loading-img').hide();
			
			// Hide the Tracks select box when there is only one pipeline.
			if(jsonModel.length==1){
				$('#pipeline',el).closest('div.control-group').hide();
				$('#milestone',el).closest('div.control-group').css("margin-left","0px");
				$('#dealsFilterForm #pipeline',el).closest('div.control-group').show();
			}
			
			if (callback && typeof (callback) === "function") {
				// execute the callback, passing parameters as necessary
				callback(jsonModel);
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
									optionsHtml += '<option value=' + '"' + element + '">' + element + '</option>'
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
		
		var tracksArray = trackListView.collection.models;
		$.each(tracksArray,function(i,value){
			console.log(value.toJSON());
			if(pipeline_id == 0 && value.toJSON().isDefault){
				pipeline_id = value.id;
				console.log('default pipeline set.');
				createCookie('agile_deal_track',pipeline_id);
			}
				
			if(value.id == pipeline_id)
				$('#deals-tracks .filter-dropdown').append(value.attributes.name);
		});
		
		// Add all option for the deals in the list view.
		if (readCookie("agile_deal_view"))
			$('#deals-tracks .dropdown-menu').append('<li><a id="1" class="pipeline" data="All" style="cursor: pointer;">All</a></li>');
		else{
			startGettingDeals();
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
				//console.log(customfield);
				columns += '<th>'+customfield.field_label+'</th>';
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
						 row += '<td class="deal_custom_replace"><div style="width:6em;text-overflow:ellipsis;">'+dealCustomFieldValue(customfield.field_label,deals[index].attributes.custom_data)+'</div></td>';
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