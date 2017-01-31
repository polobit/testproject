$(function()
{
	$('body').on('click', '.deals-add', function(e)
	{
		e.preventDefault();
		show_deal();
		setup_tags_typeahead();
	});


	$('#opportunityUpdateModal, #newDealModal').off('click', '#opportunity_archive');
  $('#opportunityUpdateModal, #newDealModal').on('click', '#opportunity_archive', function(e)
  {
    e.preventDefault();
    $('#archived', $('#opportunityUpdateForm')).prop('checked', 'checked');
    $("#opportunityUpdateModal #opportunity_validate").trigger('click');
  });

  $('#opportunityUpdateModal, #newDealModal').off('click', '#opportunity_unarchive');
  $('#opportunityUpdateModal, #newDealModal').on('click', '#opportunity_unarchive', function(e)
  {
    e.preventDefault();
    $('#archived', $('#opportunityUpdateForm')).removeAttr('checked');
    $('#opportunityUpdateModal #opportunity_validate').trigger('click');
  });

  	$('#opportunityUpdateModal, #newDealModal').on('hidden.bs.modal', function (e) {
    	$("#timeline","#deal-details").css("zIndex","1");		
  	});
  /**
   * Validates deal and saves
   */
  $('#opportunityUpdateModal, #newDealModal').off('click', '#opportunity_validate');
  $('#opportunityUpdateModal, #newDealModal').on('click', '#opportunity_validate', function(e)
  {
    e.preventDefault();

    var color = {"#E1BEE7":"VIOLET","#C5CAE9":"INDIGO","#BBDEFB":"BLUE","#C8E6C9":"GREEN","#FFF9C4":"YELLOW"
		               ,"#FFE0B2":"ORANGE","#FFCDD2":"RED","#000000":"BLACK","#FFFFFF":"WHITE","#E0E0E0":"GREY" ,"#D7CCC8":"BROWN"}; 
       
                    
    // To know updated or added deal form names
    var modal_id = $(this).closest('.opportunity-modal').attr("id");
    var form_id = $(this).closest('.opportunity-modal').find('form').attr("id");
    var colorcode = $(this).closest('.opportunity-modal').find('form').find("#color1").val();

    var json = serializeForm(form_id);
    json["custom_data"] = serialize_custom_fields(form_id);
    json["colorName"]  = color[colorcode];
    var tagsSourceId ;          
        if (!tagsSourceId)
                tagsSourceId = form_id;
        var tagobj = get_tags(tagsSourceId);
        var i;
        var tags;
        for (i = 0; i < tagobj.length ; i++) {
                        if(tagobj[i].name == "tags" && tagobj[i].value != "")
                                tags = tagobj[i];
    }   
        if (tags != undefined && tags.length != 0)
        {
            json.tags = [];
            var tags_valid = true;
            if (!json['tagsWithTime'] || json['tagsWithTime'].length == 0)
            {
                $.each(tags.value, function(index, value)
                {
                    if(!isValidTag(value, false)) {
                        tags_valid = false;
                        return false;
                    }
                });
                json['tagsWithTime'] = [];
                $.each(tags.value, function(index, value)
                {
                    json.tagsWithTime.push({ "tag" : value });
                });
            }
            else
            {
                var tag_objects_temp = [];
                $.each(tags.value, function(index, value)
                {
                    var is_new = true;
                    $.each(json['tagsWithTime'], function(index, tagObject)
                    {
                        if (value == tagObject.tag)
                        {
                                tag_objects_temp.push(tagObject);
                                is_new = false
                                return false;
                        }
                    });

                    if (is_new) {
                        tag_objects_temp.push({ "tag" : value });
                        //check if tags are valid if they are newly adding to the contact.
                        if(!isValidTag(value, false)) {
                                tags_valid = false;
                                return false;
                        }
                    }
                });
                json['tagsWithTime'] = tag_objects_temp;
            }
            if(!tags_valid) {
                    $('.invalid-tags-person').show().delay(6000).hide(1);
                    enable_save_button($(saveBtn));
                    return false;
            }
        }

        json["products"] = serialize_deal_products(form_id);
        
		console.log(json);
		if (form_id == "opportunityForm")
			saveDeal(form_id, modal_id, this, json, false);
		else
			saveDeal(form_id, modal_id, this, json, true);
	});

	/**
	 * When mouseover on any row of opportunities list, the popover of deal is shown
	 **/
	$('#opportunity-listners').off('mouseenter', '#opportunities-model-list > tr');
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
    $('#opportunity-listners').off('mouseleave', '#opportunities-model-list > tr');
	$('#opportunity-listners').on('mouseleave', '#opportunities-model-list > tr', function(e) {
    	 $(this).popover('hide');
    });
	
    /**
     * On click on the row hides the popover.
     **/
    $('#opportunity-listners').off('click', '#opportunities-model-list > tr, .hide-popover');
	$('#opportunity-listners').on('click', '#opportunities-model-list > tr, .hide-popover', function(e) {
    	 $(this).closest('tr').popover('hide');
    });
    
   /**
    * When deal is added from contact-detail by selecting 'Add Opportunity' from actions 
    * and then close button of deal is clicked, it should navigate to contact-detail.
    **/
    $('#opportunity-listners').off('click', '#close-deal');
	$('#opportunity-listners').on('click', '#close-deal', function(e) {
    	e.preventDefault();
    	window.history.back();
    });

	$('#opportunityUpdateModal, #newDealModal').off("click",".navigate-products");
    $('#opportunityUpdateModal, #newDealModal').on("click",".navigate-products",function(e)
	{
				Backbone.history.navigate('products', { trigger : true });
	});
	$('#opportunity-listners').off('click', '#opportunities-model-list > tr, .hide-popover');
	$('#opportunity-listners').on('click', '#opportunities-model-list > tr, .hide-popover', function(e) {
    	 $(this).closest('tr').popover('hide');
    });
    $('#opportunityUpdateModal, #newDealModal').off('click', '.bcp-select');
	$('#opportunityUpdateModal, #newDealModal').on('click', '.bcp-select', function(e)
	{
		if($(this).children().hasClass('bcp-selected')){
         	$(this).children().removeClass('bcp-selected');
         	$(this).closest('form').find('#color1').val("#FFFFFF");
		}
		else
		{
			var id = $(this).attr('id');
			$(".bcp-select").children().removeClass('bcp-selected');
			$(this).children().addClass('bcp-selected');
			$(this).closest('form').find('#color1').val('#'+id);
		}	
	});
	
});

// Deal Listeners
function initializeDealListners(el){

	$('#opportunity-listners').off('change', '#deal-cd-condition .deal-cd-value');
	$('#opportunity-listners').on('change', '#deal-cd-condition .deal-cd-value', function(e) {
		if(this.value == "BETWEEN"){
			$('#deal-cd-rhs').parent().removeClass("hide");
			$('#deal-cd-rhs-new').parent().removeClass("hide");
			$('#cd-value').parent().addClass("hide");
		}
		else if(this.value == "ON" || (this.value == "AFTER" || this.value == "BEFORE")){
			$('#deal-cd-rhs').parent().removeClass("hide");
			$('#deal-cd-rhs-new').parent().addClass("hide");
			$('#cd-value').parent().addClass("hide");
		}else if(this.value == "LAST" || this.value == "NEXT" ){
			$('#cd-value').parent().removeClass("hide");
			$('#deal-cd-rhs-new').parent().addClass("hide");
			$('#deal-cd-rhs').parent().addClass("hide");
		}
	});

	$('#opportunity-listners').off('click', ".deals-list-view");
	$('#opportunity-listners').on('click', '.deals-list-view', function(e) {
		e.preventDefault();

		//If same view selected, not loading the page
		if(_agile_get_prefs("agile_deal_view")){
			return;
		}
		
		// Creates the cookie
		_agile_set_prefs("agile_deal_view", "list_view");
		
		// Loads the deals
		fetchDealsList();

	});
	
	
	/**
	 * Update the milestones list when the pipeline is changed in the modal.
	 */
	$('#opportunity-listners').off('change', '#pipeline');
	$('#opportunity-listners').on('change', '#pipeline', function(e)
	{
		var el = $(this).closest('form');
		if(!$(this).val())
		{
			$('#milestone',el).find('option[value!=""]').remove();
			$('#milestone',el).find('option[value=""]').text("Any");
			return;
		}
		$('#milestone', el).closest('div').find('.loading-img').show();
		// Fills milestone select element
		populateMilestones(el, undefined, $(this).val(), undefined, function(data)
		{
			$("#milestone", el).html(data);
			$("#milestone", el).closest('div').find('.loading-img').hide();
		});
		if(el && $(el).attr('id') == "dealsFilterForm")
		{
			setTimeout(function(){
				$('#milestone',el).find('option[value=""]').text("Any");
			},500);
		}
	});
	/**
	 * Update the milestones list when the pipeline is changed in the modal.
	 */
	$('#opportunity-listners').off('change', '#filter_pipeline');
	$('#opportunity-listners').on('change', '#filter_pipeline', function(e)
	{
		var el = $(this).closest('form');
		var track = $('#filter_pipeline', el).val();
		if (track)
		{
			var milestoneModel = Backbone.Model.extend({ url : '/core/api/milestone/'+track });
			var model = new milestoneModel();
			model.fetch({ 
				success : function(data){
					var json = data.toJSON();
					var milestones = json.milestones;
					milestonesList = milestones.split(",");
					$('#milestone').html('');
					if(milestonesList.length > 1)
					{
						$('#milestone', el).html('<option value="">{{agile_lng_translate "portlets" "any"}}</option>');
					}
					$.each(milestonesList, function(index, milestone){
						$('#milestone', el).append('<option value="'+milestone+'">'+milestone+'</option>');
					});
					$('#milestone', el).parent().find('img').hide();
					hideTransitionBar();
				} 
			});
		}
		else
		{
			$('#milestone', el).html('<option value="">{{agile_lng_translate "portlets" "any"}}</option>');
		}
		
	});
	/**
	 * If Pipelined View is selected, deals are loaded with pipelined view and 
	 * creates the pipelined view cookie
	 */
	$('#opportunity-listners').off('click', '.deals-pipelined-view');
	$('#opportunity-listners').on('click', '.deals-pipelined-view', function(e) {
		e.preventDefault();

		//If same view selected, not loading the page
		if(!_agile_get_prefs("agile_deal_view")){
			return;
		}

		// Erases the cookie
		_agile_delete_prefs("agile_deal_view");

		// Loads the deals
		setupDealsTracksList();

	});
	/**
	 * If Pipelined View is selected, deals are loaded with pipelined view and 
	 * creates the pipelined view cookie
	 */
	$('#opportunity-listners').off('click', '.deals-export-csv');
	$('#opportunity-listners').on('click', '.deals-export-csv', function(e) {
		e.preventDefault();

		console.log('Exporting ...');
		$("body #deals-export-csv-modal").remove();

		getTemplate('deals-export-csv-modal', {}, undefined, function(template_ui){
			if(!template_ui)

				  return;
			var deals_csv_modal = $(template_ui);
			deals_csv_modal.modal('show');			
			deals_csv_modal.on("shown.bs.modal", function(){
					// If Yes clicked
					$('#deals-export-csv-modal').on('click', '#deals-export-csv-confirm', function(e) {
							e.preventDefault();
							if($(this).attr('disabled'))
						   	     return;
							
							$(this).attr('disabled', 'disabled');
							var input = {};
							input.filter = getDealFilters();
							 // Shows message
						    $save_info = $('<img src="'+updateImageS3Path("img/1-0.gif")+'" height="18px" width="18px" style="opacity:0.5;"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>'+_agile_get_translated_val('campaigns','email-will-be-sent-shortly')+'</i></small></span>');
						    $(this).parent('.modal-footer').find('.deals-export-csv-message').append($save_info);
							$save_info.show();
							// Export Deals.
							$.ajax({
								url: '/core/api/opportunity/export',
								type: 'POST',
								data : input,
								success: function() {
									console.log('Exported!');
									deals_csv_modal.modal('hide');
								}
							});
					});

			});
		}, null);
	});

	/**
	 * Deal list view edit
	 */
	$('#opportunity-listners').off('click', '#opportunities-model-list > tr > td:not(":first-child")');
	$('#opportunity-listners').on('click', '#opportunities-model-list > tr > td:not(":first-child")', function(e){
		e.preventDefault();
		$('.popover').remove();
		var currentdeal = $(this).closest('tr').data();
		if($(this).find(".contact-type-image").length > 0 || $(this).find(".company-type-image").length > 0)
		{
			return;
		}
		if (e.ctrlKey || e.metaKey) {
           window.open("#deal/" +currentdeal.id , '_blank');
           return;
        }
		Backbone.history.navigate("deal/" + currentdeal.id, { trigger : true });
		// updateDeal($(this).closest('tr').data());
	});

	$('#opportunity-listners').off('click', '.contact-type-image');
	$('#opportunity-listners').on('click', '.contact-type-image', function(e){
		e.preventDefault();
		
		Backbone.history.navigate("contact/" + $(this).attr("id"), { trigger : true });
	});

	$('#opportunity-listners').off('click', '.company-type-image');
	$('#opportunity-listners').on('click', '.company-type-image', function(e){
		e.preventDefault();
		
		Backbone.history.navigate("company/" + $(this).attr("id"), { trigger : true });
	});

	/**
	 * Shows deal popup
	 */
	$('#opportunity-listners').off('click', '.deals-add-opportunity');
	$('#opportunity-listners').on('click', '.deals-add-opportunity', function(e)
	{
		e.preventDefault();
		show_deal();
		setup_tags_typeahead();
	});

	$('#opportunity-listners').off('change', '#pipeline_milestone');
	$('#opportunity-listners').on('change', '#pipeline_milestone', function(e)
	{
		var temp = $(this).val();
		var track = temp.substring(0, temp.indexOf('_'));
		var milestone = temp.substring(temp.indexOf('_') + 1, temp.length + 1);
		$(this).closest('form').find('#pipeline').val(track);
		$(this).closest('form').find('#milestone').val(milestone);
		console.log(track, '-----------', milestone);
	});
	
    /**
     * On click on the row hides the popover.
     **/
    $('#opportunity-listners').off('click', '#opportunities-model-list > tr, .hide-popover');
	$('#opportunity-listners').on('click', '#opportunities-model-list > tr, .hide-popover', function(e) {
    	 $(this).closest('tr').popover('hide');
    });
	
	$('#opportunity-listners').off('click', '#deal-milestone-regular');
	$('#opportunity-listners').on('click', '#deal-milestone-regular', function(e) {
    	e.preventDefault();
    	//If same view selected, not loading the page
		if(!_agile_get_prefs("agile_deal_view") && !_agile_get_prefs("deal-milestone-view")){
			return;
		}

		if(!_agile_get_prefs("agile_deal_view")){
			_agile_delete_prefs('deal-milestone-view');
			setupMilestoneViewWidth();
			return;
		}

		_agile_delete_prefs('deal-milestone-view');
    	_agile_delete_prefs("agile_deal_view");

    	setupDealsTracksList();
    });
	
	$('#opportunity-listners').off('click', '#deal-milestone-compact');
	$('#opportunity-listners').on('click', '#deal-milestone-compact', function(e) {
    	e.preventDefault();
    	//If same view selected, not loading the page
		if(!_agile_get_prefs("agile_deal_view") && _agile_get_prefs("deal-milestone-view") == "compact"){
			return;
		}

		if(!_agile_get_prefs("agile_deal_view")){
			_agile_set_prefs('deal-milestone-view','compact');
			setupMilestoneViewWidth();
			return;
		}

		_agile_set_prefs('deal-milestone-view','compact');
    	_agile_delete_prefs("agile_deal_view");

    	setupDealsTracksList();
    });
	
	$('#opportunity-listners').off('click', '#deal-milestone-fit');
	$('#opportunity-listners').on('click', '#deal-milestone-fit', function(e) {
    	e.preventDefault();
    	//If same view selected, not loading the page
		if(!_agile_get_prefs("agile_deal_view") && _agile_get_prefs("deal-milestone-view") == "fit"){
			return;
		}

		if(!_agile_get_prefs("agile_deal_view")){
			_agile_set_prefs('deal-milestone-view','fit');
			setupMilestoneViewWidth();
			return;
		}

		_agile_set_prefs('deal-milestone-view','fit');
    	_agile_delete_prefs("agile_deal_view");

    	setupDealsTracksList();
    });

    $('#opportunity-listners').off('change', '#value_filter');
	$('#opportunity-listners').on('change', '#value_filter', function(e) {
		var that = $(this);
    	that.find('option').each(function(){
    		if($(this).val()==that.val()){
    			$('.'+$(this).val(),$('#deal-value-filter')).removeClass('hide');
    		}else{
    			$('.'+$(this).val(),$('#deal-value-filter')).addClass('hide');
    			$('.'+$(this).val(),$('#deal-value-filter')).each(function(){
    				$(this).find('input').val("");
    			});
    		} 
    	});
    });

    $('#opportunity-listners').off('click', '.remove_deal_filter');
	$('#opportunity-listners').on('click', '.remove_deal_filter', function(e) {
		_agile_delete_prefs('deal-filter-name');
		_agile_delete_prefs('deal-filters');
		_agile_delete_prefs('report_filter');
		_agile_delete_prefs('report_filter_name');
		delete App_Deals.deal_filters.collection.reportFilter;
		setupDefaultDealFilters();
		$('#opportunity-listners').find('.remove_deal_filter').parent().remove();
        if (!_agile_get_prefs("agile_deal_view")){
            setupDealsTracksList();
        }else{
            fetchDealsList();
        }
    });

    $('#opportunity-listners').off('click', '.deal-track-close');
	$('#opportunity-listners').on('click', '.deal-track-close', function(e) {
		var pos = $("#moving-deal").attr("data-pos");

		$("#new-track-list-paging").hide();
		$("#new-opportunity-list-paging").show();
		$("#opportunities-header", $("#opportunity-listners")).show();

		revertDeal(DEAL_DRAG_EVENT, DEAL_DRAG_UI, pos);
    });

    $('#opportunity-listners').off('click', '.update-drag-deal');
	$('#opportunity-listners').on('click', '.update-drag-deal', function(e) {
		var posCss = $(this).position();
		posCss["left"] = parseInt(posCss["left"]) + (($(this).find("div:first").width() - 50) / 2) + "px";
		posCss["overflow"] = "hidden";
		posCss["width"] = "50px";
		$("#moved-deal", $("#new-track-list-paging")).find("li").eq(1).animate(posCss, 700, function(){
			$("#moved-deal", $("#new-track-list-paging")).find("li").eq(1).css("overflow", "hidden");
		});
		var deal_id = $("#moving-deal").find("div:first").attr("id");
		var heading = $("#moving-deal").attr("data-heading");
		var track = $(this).find("div:first").attr("data-track");
		var newMilestone = $(this).find("div:first").text().trim();
		var dealsCollection = DEALS_LIST_COLLECTION.collection.where({ heading : heading });
		if(dealsCollection) {
			var dealModel = dealsCollection[0].get("dealCollection").get(deal_id);
			App_Deals.dealModel = dealModel;
			if(dealModel) {
				var old_milestone = dealModel.get("milestone");
				dealModel.set({ "pipeline_id" : track }, { silent : true });
				update_milestone(dealModel, deal_id, newMilestone, old_milestone, true, "", false);
				$('#'+old_milestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+old_milestone.replace(/ +/g, '')+'_count').text())-1);
				var modelsLength = $("#" + old_milestone.replace(/ +/g, "")).find('ul li.deal-color').size() ;
	        	if(modelsLength ==10 && modelsLength <= parseInt($('#'+old_milestone.replace(/ +/g, '')+'_count').text()))
	        	{
	          		dealsCollection[0]['isUpdateCollection'] = true ;
	          		dealsFetch(dealsCollection[0]);
	        	}
			}
		}
		//If deal moves to lost milestone of other track, will ask reasons for lost the deal
		if($(this).attr("data-lost-milestone") == "true")
		{
			App_Deals.newMilestone = newMilestone;
			App_Deals.old_milestone = old_milestone;
			App_Deals.lost_reason_milesone_id = deal_id;
			populateLostReasons($('#dealLostReasonModal'), undefined);
			$('#deal_lost_reason',$('#dealLostReasonModal')).removeClass("hidden");
			$('#dealLostReasonModal > .modal-dialog > .modal-content > .modal-footer > a#deal_lost_reason_save').text("{{agile_lng_translate 'modals' 'save'}}");
			$('#dealLostReasonModal > .modal-dialog > .modal-content > .modal-footer > a#deal_lost_reason_save').attr('disabled',false);
		}
		else{
			setTimeout(function(){
				$("#new-track-list-paging").hide();
				$("#new-opportunity-list-paging").show();
				$("#opportunities-header", $("#opportunity-listners")).show();
			},800);
		}
    });

}

function initializeMilestoneListners(el){

    $('#pipelineModal').off('click', '#pipeline_validate');
	$('#pipelineModal').on('click', '#pipeline_validate', function(e) {
    	e.preventDefault();
    	
    	// Returns, if the save button has disabled attribute
    	if ($(this).attr('disabled'))
    		return;
    	var that = $(this);
    	// Disables save button to prevent multiple click event issues
    	disable_save_button($(this));//$(saveBtn).attr('disabled', 'disabled');
    	
    	if (!isValidForm('#pipelineForm')) {
    		// Removes disabled attribute of save button
    		enable_save_button(that);//$(saveBtn).removeAttr('disabled');
    		return false;
    	}
    	
    	var mile = serializeForm('pipelineForm');
    	console.log(mile);
    	// Saving that pipeline object
    	var pipeline = new Backbone.Model();
    	pipeline.url = '/core/api/milestone/pipelines';
    	pipeline.save(mile, {
    		// If the milestone is changed, to show that change in edit popup if opened without reloading the app.
    		success : function(model, response) {
    			// Removes disabled attribute of save button
    			$('#pipelineModal').modal('hide');
    			enable_save_button(that);
    			App_Admin_Settings.milestones();
    			$('body').removeClass('modal-open');
    		},
			error: function(data,response){
				console.log(response,data);
				$('#pipelineModal').find('.save-status').html('<span style="color:red;">'+response.responseText+'</span>');
				setTimeout(function(){$('#pipelineModal').find('.save-status').html('');}, 5000);
				enable_save_button(that);
			}
    	});
    	
    });
}
function createtypeheadcontact(el){
	var cname = el.closest('form').find('.typeahead_contacts').val();
	var type = $(el).attr('type') ; 
	var contact = {}; var url = '/core/api/contacts' ;
	var properties = []; var json = {};
	contact['source'] = 'manual' ;
	if(type == "contact"){
		contact['type'] = 'PERSON' ;
		json.name = "first_name";
		json.type = "SYSTEM";
		json.value = cname ; 
	}
	else {
		contact['type'] = 'COMPANY' ;
		json.name = "name";
		json.type = "SYSTEM";
		json.value = cname ;
	}
	properties.push(json);
	contact.properties = properties ;
	$.ajax({
	  type: "POST",
	  url: url,contentType : "application/json; charset=utf-8",
	  dataType : 'json',
	  data: JSON.stringify(contact),
	  success: function(data){
	  	console.log(data);
	  	var properties = [];var i ;var coname ;var cValue = 'first_name'; 
	  	var cType = data.type ; 
	  	properties = data['properties'];
	  	if(cType == 'COMPANY')
	  		cValue = 'name';
	  	for(i=0 ; i<properties.length ; i++){
	  		if(properties[i].name == cValue){
	  			coname = properties[i].value;
	  			break ; 
	  		}
	  	}
	  	el.closest('form')
			.find(".newtypeaheadcontact")
			.append(
					'<li class="tag  btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + data.id + '"><a class="text-white v-middle" href="#contact/' + data.id + '">' + coname + '</a><a class="close" id="remove_tag">&times</a></li>');
	  },error : function(model, response)
		{
			if (model && model.responseText)
			{
				// Show cause of error in saving
				var save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>' + model.responseText + '</i></p></small></div>');
				el.closest('form').find('.contact-add-error').html(save_info).show().delay(3000).hide(1);

			}
			else
			{
				var save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>Exception while saving the Contact/Company</i></p></small></div>');
				el.closest('form').find('.contact-add-error').html(save_info).show().delay(3000).hide(1);
			}
		}
	});
}