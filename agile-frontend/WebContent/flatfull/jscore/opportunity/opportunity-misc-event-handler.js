$(function()
{
	$('body').on('click', '.deals-add', function(e)
	{
		e.preventDefault();
		show_deal();
		setup_tags_typeahead();
	});

 	$('#opportunityUpdateModal, #opportunityModal').off('click', '#opportunity_archive');
	$('#opportunityUpdateModal, #opportunityModal').on('click', '#opportunity_archive', function(e)
	{
		e.preventDefault();
		$('#archived', $('#opportunityUpdateForm')).prop('checked', 'checked');
		$("#opportunityUpdateModal #opportunity_validate").trigger('click');
	});

	$('#opportunityUpdateModal, #opportunityModal').off('click', '#opportunity_unarchive');
	$('#opportunityUpdateModal, #opportunityModal').on('click', '#opportunity_unarchive', function(e)
	{
		e.preventDefault();
		$('#archived', $('#opportunityUpdateForm')).removeAttr('checked');
		$('#opportunityUpdateModal #opportunity_validate').trigger('click');
	});


	/**
	 * Validates deal and saves
	 */
	$('#opportunityUpdateModal, #opportunityModal').off('click', '#opportunity_validate');
	$('#opportunityUpdateModal, #opportunityModal').on('click', '#opportunity_validate', function(e)
	{
		e.preventDefault();

		var color = {"#ee82ee":"VIOLET","#4b0082":"INDIGO","#0000ff":"BLUE","#00ff00":"GREEN","#ffff00":"YELLOW"
		               ,"#ff6600":"ORANGE","#ff0000":"RED","#000000":"BLACK","#ffffff":"WHITE","#808080":"GREY"}; 
       
                    
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
                        if(tagobj[i].value != "")
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
						$('#milestone', el).html('<option value="">Any</option>');
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
			$('#milestone', el).html('<option value="">Any</option>');
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
						    $save_info = $('<img src="'+updateImageS3Path("img/1-0.gif")+'" height="18px" width="18px" style="opacity:0.5;"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>Email will be sent shortly.</i></small></span>');
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
	$('#opportunity-listners').off('click', '.deals-add');
	$('#opportunity-listners').on('click', '.deals-add', function(e)
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
		setupDefaultDealFilters();
		$('#opportunity-listners').find('h3').find('.remove_deal_filter').parent().remove();
        if (!_agile_get_prefs("agile_deal_view")){
            setupDealsTracksList();
        }else{
            fetchDealsList();
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