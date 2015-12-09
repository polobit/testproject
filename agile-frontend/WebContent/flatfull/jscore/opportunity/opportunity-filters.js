/**
 * opportunity-filters.js is a script file that handles opportunity filters like
 * pipeline, milestones and owner select list.
 * 
 * @module Deals
 * 
 */
$(function()
{

 $('.deals-add').on('click', function(e)
	{
		e.preventDefault();
		show_deal();
	});


	$('#opportunityUpdateModal, #opportunityModal').on('click', '#opportunity_archive', function(e)
	{
		e.preventDefault();
		$('#archived', $('#opportunityUpdateForm')).prop('checked', 'checked');
		$("#opportunityUpdateModal #opportunity_validate").trigger('click');
	});
	$('#opportunityUpdateModal, #opportunityModal').on('click', '#opportunity_unarchive', function(e)
	{
		e.preventDefault();
		$('#archived', $('#opportunityUpdateForm')).removeAttr('checked');
		$('#opportunityUpdateModal #opportunity_validate').trigger('click');
	});


	/**
	 * Validates deal and saves
	 */
	$('#opportunityUpdateModal, #opportunityModal').on('click', '#opportunity_validate', function(e)
	{
		e.preventDefault();

		// To know updated or added deal form names
		var modal_id = $(this).closest('.opportunity-modal').attr("id");
		var form_id = $(this).closest('.opportunity-modal').find('form').attr("id");

		var json = serializeForm(form_id);
		json["custom_data"] = serialize_custom_fields(form_id);

		console.log(json);
		if (form_id == "opportunityForm")
			saveDeal(form_id, modal_id, this, json, false);
		else
			saveDeal(form_id, modal_id, this, json, true);
	});

	
});

function setupDealFilters(cel)
{

	getTemplate('deal-filter', {}, undefined, function(template_ui){
		if(!template_ui)
			  return;

		$('#deal-list-filters').html($(template_ui));
		var el = $('#filter_options');

		// Fills owner select element
		populateUsers("owners-list-filters", el, undefined, undefined, function(data)
		{

			$("#deals-filter").find("#owners-list-filters").html(data);
			// Select none by default.
			if (readCookie('deal-filters'))
			{
				var json = $.parseJSON(readCookie('deal-filters'));
			}

			$("#owners-list-filters", $("#dealsFilterForm")).closest('div').find('.loading-img').hide();

			$("#deal_owner_change_modal").find("#owners-list-bulk").html(data);
			$("#owners-list-bulk", $("#deal_owner_change_modal")).closest('div').find('.loading').hide();

			// Populate pipeline in the select box.
			populateTracks(el, undefined, undefined, function(data)
			{
				// Select none by default.
				$('#pipeline').val('');
				deal_bulk_actions.fillPipelineList(data);
				$('#owners-list-filters').val('');
				if (readCookie('deal-filters'))
				{
					var json = $.parseJSON(readCookie('deal-filters'));
					$.each(json, function(key, value)
					{

						// Fill the filters based on previously selected filters in
						// cookie.
						if (value)
						{
							if ($('[name="' + key + '"]').closest('.controls').height() == 0 && key.indexOf('_filter') < 0)
							{
								$('[name="' + key + '"]').closest('.controls').addClass('in');
								$('[name="' + key + '"]').closest('.control-group').find('a.changeIcon').find('i').toggleClass('icon-plus icon-minus');
							}

							if (key == 'pipeline_id')
							{
								// Fills milestone and select element
								populateMilestones(el, undefined, json.pipeline_id, undefined, function(data)
								{
									$("#milestone", el).html(data);
									$("#milestone", el).closest('div').find('.loading-img').hide();
									$("#milestone", el).val(json.milestone);
								});
							}
							$('#' + key).val(value);
							if (key == 'pipeline_id')
								$('#pipeline').val(value);
							else if (key == 'owner_id')
								$('#owners-list-filters').val(value);
							else if ($('#' + key).hasClass('date'))
								$('#' + key).val(new Date(value * 1000).format('mm/dd/yyyy'));

							if (key.indexOf('_filter') > 0)
								$('#' + key).trigger('change');

						}
					});
					// deserializeForm(json, $('#dealsFilterForm'));
					//updateFilterColor();
				}
				// Enable the datepicker
				$('#filter_options .date').datepicker({ format : 'mm/dd/yyyy', });
				if (!readCookie("agile_deal_view"))
				{
					$('#pipeline').closest('.control-group').hide();
					$('#milestone').closest('.control-group').hide();
				}
				$('#filter_options select').find('option[value=""]').text('Any');
			});
		});

	}, '#deal-list-filters');
}

function setupNewDealFilters(callback)
{
	App_Deals.deal_filters = new Base_Collection_View({url : '/core/api/deal/filters', sort_collection : false});
	
	App_Deals.deal_filters.collection.fetch({
		success: function(data){
			hideTransitionBar();
			setNewDealFilters(data);
			return callback();
		}
	}); 
}
function setNewDealFilters(data){
	var filters_list = data.toJSON();
	var filters_ui = "<li><a class='default_deal_filter'>All</a></li>" +
					 "<li><a class='deal-filter' id='my-deals'>My</a></li>" + 
					 "<li class='divider'></li>" + 
					 "<li><a href='#deal-filters'>Add/Edit Filter</a></li>";
	if (filters_list && filters_list.length > 0)
	{
		filters_ui += "<li class='divider'></li>";
	}
	$.each(filters_list,function(index, filter){
		filters_ui += "<li><a class='deal-filter' id='"+filter.id+"'>"+filter.name+"</a></li>"
	});
	$('#deal-filter-list-model-list').html(filters_ui);
	var cookie_filter_id = readCookie("deal-filter-name");
	if(cookie_filter_id && cookie_filter_id != 'my-deals' && data.get(cookie_filter_id) && data.get(cookie_filter_id).get('name')){
		$('#opportunity-listners').find('h3').find('small').after('<div class="inline-block tag btn btn-xs btn-primary m-l-xs"><span class="inline-block m-r-xs v-middle pull-left">'+data.get(cookie_filter_id).get("name")+'</span><a class="close default_deal_filter">×</a></div>');
		/*var filters = readCookie('deal-filters');
		if(filters){
			var filtersJSON = $.parseJSON(filters);
			if(filtersJSON && filtersJSON.pipeline_id){
				createCookie('agile_deal_track', filtersJSON.pipeline_id);
				$('#deals-tracks').find('button').attr('disabled', true);
			}
		}*/
	}else if(cookie_filter_id && cookie_filter_id == 'my-deals'){
		$('#opportunity-listners').find('h3').find('small').after('<div class="inline-block tag btn btn-xs btn-primary m-l-xs"><span class="inline-block m-r-xs v-middle pull-left">My Deals</span><a class="close default_deal_filter">×</a></div>');
	}else{
		var deal_filter_json = {};
		deal_filter_json['owner_id'] = "";
		deal_filter_json['pipeline_id'] = readCookie('agile_deal_track');
		deal_filter_json['milestone'] = "";
		deal_filter_json['archived'] = "all";
		deal_filter_json['value_filter'] = "equals";
		createCookie('deal-filters', JSON.stringify(deal_filter_json));
	}
}
function updateFilterColor()
{
	var filters_count = 0;
	var json = $.parseJSON(readCookie('deal-filters'));
	if (json.owner_id.length > 0)
		filters_count++;
	if (json.value_filter == 'equals')
	{
		if (json.value.length > 0)
			filters_count++;
	}
	else
	{
		if (json.value_start.length > 0 || json.value_end.length > 0)
			filters_count++;
	}

	if (readCookie("agile_deal_view"))
	{
		if (json.pipeline_id.length > 0)
			filters_count++;
	}

	if (json.archived != 'false')
		filters_count++;

	if (filters_count > 0)
		$('#show-filter-button').addClass('btn-primary');
}

/**
 * Show filters drop down and fill the options.
 */
function showFilters()
{
	var el = $('#filter_options');

	el.show();
	// $("#deals-filter").modal('show');

	/*
	 * add_custom_fields_to_form({}, function(data){
	 * console.log('----------------',data); var el_custom_fields =
	 * getTemplate("deal-custom-filter",data["custom_fields"]);
	 * //$(el_custom_fields).find('div.control-group').addClass('row-filter');
	 * $("#dealsCustomFilterForm fieldset",
	 * el).html($(el_custom_fields)).find('div.control-group').addClass('row-filter');
	 *  }, "DEAL");
	 */

}

/**
 * Deserialize the filters form and save them in the cookie as JSON string and
 * reload the page.
 * 
 * @param saveBtn
 */
function filterDeals(saveBtn)
{
	// Returns, if the sav e button has disabled attribute
	if (saveBtn.attr('disabled'))
		return;
	saveBtn.attr('disabled', 'disabled');
	$('#filter_options').hide();
	var formId = 'dealsFilterForm';
	/*
	 * if (!isValidForm('#' + formId)) { // Removes disabled attribute of save
	 * button enable_save_button(saveBtn);//$(saveBtn).removeAttr('disabled');
	 * return false; }
	 */
	var json = serializeForm(formId);
	// var customJson = serializeForm('dealsCustomFilterForm');
	// json.customFields=customJson;
	if (readCookie("agile_deal_track") && json.pipeline_id.length > 1 && readCookie("agile_deal_track") != json.pipeline_id)
		createCookie("agile_deal_track", json.pipeline_id)
	createCookie('deal-filters', JSON.stringify(json));
	saveBtn.removeAttr('disabled');
	// Loads the deals
	App_Deals.deals();
}

/**
 * Get the deal filters in the cookie.
 * 
 * @returns
 */
function getDealFilters()
{
	var filterJSON = {};
	if (readCookie('deal-filter-name'))
	{
		var cookie_filter_id = readCookie('deal-filter-name');
		if(cookie_filter_id == 'my-deals'){
			filterJSON = $.parseJSON(readCookie('deal-filters'));
		}else{
			var filterModel = App_Deals.deal_filters.collection.get(cookie_filter_id);
			if(filterModel){
				filterJSON = filterModel.toJSON();
			}
			
			if(filterJSON){
				filterJSON.filterOwner = {};
			}
		}
		// Remove the milestone field in the filters if it is milestone view.
		if (filterJSON && !readCookie("agile_deal_view")){
			var json = filterJSON;
			//if (!json.pipeline_id)
			json.pipeline_id = readCookie('agile_deal_track');
			json.milestone = '';
			return JSON.stringify(json);
		}else if (filterJSON && readCookie("agile_deal_view")){
			return JSON.stringify(filterJSON);
		}else if(!filterJSON && !readCookie("agile_deal_view")){
			var json = {};
			json.pipeline_id = readCookie('agile_deal_track');
			return JSON.stringify(json);
		}else{
			return '';
		}
	}else{
		if (!readCookie("agile_deal_view")){
			var json = {};
			json.pipeline_id = readCookie('agile_deal_track');
			return JSON.stringify(json);
		}else{
			return '';
		}
	}
}



// Deal Listeners
function initializeDealListners(el){
	
$('#opportunity-listners').off('click', ".deals-list-view");
$('#opportunity-listners').on('click', '.deals-list-view', function(e) {
		e.preventDefault();
		
		// Creates the cookie
		createCookie("agile_deal_view", "list_view");
		
		// Loads the deals
		App_Deals.deals();

	});


	/**
	 * If default view is selected, deals are loaded with default view and 
	 * removes the view cookie set when view is selected
	 */ 
	
	$('#opportunity-listners').off('click', '#opportunity-track-list-model-list a.pipeline');
	$('#opportunity-listners').on('click', '#opportunity-track-list-model-list a.pipeline', function(e) {
		e.preventDefault();
		createCookie("agile_deal_track", $(this).attr('id'));
		if(readCookie('deal-filters')){
			var json = $.parseJSON(readCookie('deal-filters'));
			var track = $(this).attr('id');
			if(track == '1')
				json.pipeline_id = '';
			else
				json.pipeline_id = $(this).attr('id');
			createCookie('deal-filters',JSON.stringify(json));
		}
		App_Deals.deals();
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
	 * If Pipelined View is selected, deals are loaded with pipelined view and 
	 * creates the pipelined view cookie
	 */
	$('#opportunity-listners').off('click', '.deals-pipelined-view');
	$('#opportunity-listners').on('click', '.deals-pipelined-view', function(e) {
		e.preventDefault();

		// Erases the cookie
		eraseCookie("agile_deal_view");

		// Loads the deals
		App_Deals.deals();

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
							var filterJSON = JSON.stringify($.parseJSON(readCookie('deal-filters')));
							if (!readCookie("agile_deal_view"))
								filterJSON.pipeline_id = readCookie('agile_deal_track');
							input.filter = filterJSON;
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


	// Show filter drop down.
	$('#opportunity-listners').off('click', '#show-filter-button');
	$('#opportunity-listners').on('click', '#show-filter-button', function(e)
	{
		e.preventDefault();
		if ($('#filter_options').is(':visible'))
			$('#filter_options').hide();
		else
			showFilters();
	});

	// Filter deals.
	$('#opportunity-listners').off('click', '#deals-filter-validate');
	$('#opportunity-listners').on('click', '#deals-filter-validate', function(e)
	{
		e.preventDefault();
		filterDeals($(this));
	});

	// For updating the filter inequality and the fields based on the filter
	// type selected.
	$('#opportunity-listners').off('change', '#filter_options .filter_type');
	$('#opportunity-listners').on('change', '#filter_options .filter_type', function(e)
	{
		var filter = $(this).closest('.control-group').attr('id');
		if ($(this).val() == 'equals')
		{
			$('#' + filter + ' .equals').show();
			$('#' + filter + ' .between').hide();
		}
		else
		{
			var msg = "You can only use one 'between' condition for filtering. Press Ok to change other conditions to equal.";
			var bwCount = $("#filter_options").find('select option[value="between"]:selected').length;
			var valid = true;
			if (bwCount > 1)
				valid = false;
			if (valid)
			{
				$('#filter_options .filter_type').val('equal');
				$(this).val('between');
				$('#sort_field').val($(this).attr('data'));
				$('#filter_options .between').hide();
				$('#filter_options .equals').show();
				$('#' + filter + ' .equals').hide();
				$('#' + filter + ' .between').show();
			}
			else
			{
				alert("Sorry. You can't have multiple 'Between' conditions.");
				$(this).val('equals');
			}

		}
	});

	// Clear the deal filter form and remove the cookie.
	$('#opportunity-listners').off('click', '#clear-deal-filters');
	$('#opportunity-listners').on('click', '#clear-deal-filters', function(e)
	{
		$('#dealsFilterForm input').val('');
		$('#dealsFilterForm select').filter(':visible').val('');
		$('#dealsFilterForm select.filter_type').val('equals');
		$('#filter_options .between').hide();
		$('#filter_options .equals').show();
		$('#dealsFilterForm #archived').val('false');
		$('#filter_options').find('.control-group').each(function(index)
		{
			if ($(this).find('.controls').height() > 0)
				$(this).find('a.changeIcon').trigger('click');
		});
		eraseCookie('deal-filters');
		$('#show-filter-button').removeClass('btn-primary');
	});

	$('#opportunity-listners').off('click', '#filter_options a.changeIcon');
	$('#opportunity-listners').on('click', '#filter_options a.changeIcon', function(e)
	{
		$(this).find('i').toggleClass('icon-plus icon-minus')
	});


  	$('#opportunity-listners').off('mouseenter', '.milestones > li');
	$('#opportunity-listners').on('mouseenter', '.milestones > li', function(e)
	{
		$(this).find('.deal-options').css("visibility", "visible");
	});

	$('#opportunity-listners').off('mouseleave', '.milestones > li');
	$('#opportunity-listners').on('mouseleave', '.milestones > li', function(e)
	{
		$(this).find('.deal-options').css("visibility", "hidden");
	});

	/**
	 * Milestone view deal edit
	 */
	$('#opportunity-listners').off('click', '.deal-edit');
	$('#opportunity-listners').on('click', '.deal-edit', function(e)
	{
		e.preventDefault();
		var id = $(this).closest('.data').attr('id');
		var milestone = ($(this).closest('ul').attr("milestone")).trim();
		var currentDeal;

		// Get the current deal model from the collection.
		var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });
		if (!dealPipelineModel)
			return;
		currentDeal = dealPipelineModel[0].get('dealCollection').get(id).toJSON();

		if (currentDeal)
			updateDeal(currentDeal, true);
	});

	/**
	 * Milestone view deal delete
	 */
	$('#opportunity-listners').off('click', '.deal-delete');
	$('#opportunity-listners').on('click', '.deal-delete', function(e)
	{
		e.preventDefault();
		if (!confirm("Are you sure you want to delete?"))
			return;

		var id = $(this).closest('.data').attr('id');
		var milestone = ($(this).closest('ul').attr("milestone")).trim();
		var id_array = [];
		var id_json = {};

		// Create array with entity id.
		id_array.push(id);

		// Set entity id array in to json object with key ids,
		// where ids are read using form param
		id_json.ids = JSON.stringify(id_array);

		var that = this;
		$.ajax({ url : 'core/api/opportunity/' + id, type : 'DELETE', success : function()
		{
			// Remove the deal from the collection and remove the UI element.
			var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });
			if (!dealPipelineModel)
				return;
			dealPipelineModel[0].get('dealCollection').remove(dealPipelineModel[0].get('dealCollection').get(id));

			// Removes deal from list
			$(that).closest('li').css("display", "none");

			// Shows Milestones Pie
			pieMilestones();

			// Shows deals chart
			dealsLineChart();
		} });
	});

	

	/**
	 * Deal list view edit
	 */
	$('#opportunity-listners').off('click', '#opportunities-model-list > tr > td:not(":first-child")');
	$('#opportunity-listners').on('click', '#opportunities-model-list > tr > td:not(":first-child")', function(e){
		e.preventDefault();
		$('.popover').remove();
		var currentdeal = $(this).closest('tr').data();
		Backbone.history.navigate("deal/" + currentdeal.id, { trigger : true });
		// updateDeal($(this).closest('tr').data());
	});



	/**
	 * Shows deal popup
	 */
	$('#opportunity-listners').off('click', '.deals-add');
	$('#opportunity-listners').on('click', '.deals-add', function(e)
	{
		e.preventDefault();
		show_deal();
	});
 

	/**
	 * Milestone view deal delete
	 */
	$('#opportunity-listners').off('click', '.deal-archive');
	$('#opportunity-listners').on('click', '.deal-archive', function(e)
	{
		e.preventDefault();

		var temp = {};
		temp.id = $(this).closest('.data').attr('id');
		temp.milestone = ($(this).closest('ul').attr("milestone")).trim();
		$("#archived-deal-id", $("#deal_archive_confirm_modal")).val(temp.id);
		$("#archived-deal-milestone", $("#deal_archive_confirm_modal")).val(temp.milestone);
		$("#deal_archive_confirm_modal").modal('show');
	});

	/**
	 * Milestone view deal delete
	 */
	$('#opportunity-listners').off('click', '.deal-restore');
	$('#opportunity-listners').on('click', '.deal-restore', function(e)
	{
		e.preventDefault();

		var temp = {};
		temp.id = $(this).closest('.data').attr('id');
		temp.milestone = ($(this).closest('ul').attr("milestone")).trim();
		$("#restored-deal-id", $("#deal_restore_confirm_modal")).val(temp.id);
		$("#restored-deal-milestone", $("#deal_restore_confirm_modal")).val(temp.milestone);
		$("#deal_restore_confirm_modal").modal('show');
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
	
	$('#opportunity-listners').off('click', '#deal-milestone-regular');
	$('#opportunity-listners').on('click', '#deal-milestone-regular', function(e) {
    	e.preventDefault();
    	eraseCookie('deal-milestone-view');
    	App_Deals.deals();
    });
	
	$('#opportunity-listners').off('click', '#deal-milestone-compact');
	$('#opportunity-listners').on('click', '#deal-milestone-compact', function(e) {
    	e.preventDefault();
    	createCookie('deal-milestone-view','compact');
    	App_Deals.deals();
    });
	
	$('#opportunity-listners').off('click', '#deal-milestone-fit');
	$('#opportunity-listners').on('click', '#deal-milestone-fit', function(e) {
    	e.preventDefault();
    	createCookie('deal-milestone-view','fit');
    	App_Deals.deals();
    });

    $('#opportunity-listners').off('change', '#value_filter');
	$('#opportunity-listners').on('change', '#value_filter', function(e) {
		var that = $(this);
    	that.find('option').each(function(){
    		if($(this).val()==that.val()){
    			$('.'+$(this).val()).removeClass('hide');
    		}else{
    			$('.'+$(this).val()).addClass('hide');
    		} 
    	});
    });

    $('#opportunity-listners').off('click', '#view_type');
	$('#opportunity-listners').on('click', '#view_type', function(e) {
		if($(this).val()=="milestone"){
			$('#filter-track').addClass('hide');
			$('#filter-milestone').addClass('hide');
		}else{
			$('#filter-track').removeClass('hide');
			$('#filter-milestone').removeClass('hide');
		}
    });

    $('#opportunity-listners').off('click', '.deal-filter');
	$('#opportunity-listners').on('click', '.deal-filter', function(e) {
		var filter_id = $(this).attr("id");
		var deal_filter;
		var deal_filter_json = {};
		if(filter_id == 'my-deals'){
			deal_filter_json['owner_id'] = CURRENT_DOMAIN_USER.id;
			deal_filter_json['pipeline_id'] = readCookie('agile_deal_track');
			deal_filter_json['milestone'] = "";
			deal_filter_json['archived'] = "all";
			deal_filter_json['value_filter'] = "equals";
		}else{
			deal_filter = App_Deals.deal_filters.collection.get(filter_id);
			deal_filter_json = deal_filter.toJSON();
			deal_filter_json.filterOwner = {};
		}
		createCookie('deal-filters', JSON.stringify(deal_filter_json));
		createCookie('deal-filter-name',filter_id);
		App_Deals.deals();
    });

    $('#opportunity-listners').off('click', '.default_deal_filter');
	$('#opportunity-listners').on('click', '.default_deal_filter', function(e) {
		eraseCookie('deal-filter-name');
		eraseCookie('deal-filters');
		App_Deals.deals();
    });

}



function initializeMilestoneListners(el){
	
	$('#milestone-listner').off();	
	$('#milestone-listner').on('click', '.add-pipeline', function(e) {
		$('#pipelineForm input').val('');
		$('#pipelineForm input#milestones').val('New,Prospect,Proposal,Won,Lost');
		$('#pipelineForm input#won_milestone').val('Won');
		$('#pipelineForm input#lost_milestone').val('Lost');
		$('#pipelineModal').find('.save-status').html('');
	});
	
	$('#milestone-listner').off('click', '.pipeline-edit');
	$('#milestone-listner').on('click', '.pipeline-edit', function(e) {
		var id = $(this).attr('id');
		var json = App_Admin_Settings.pipelineGridView.collection.get(id).toJSON();
		deserializeForm(json,$('#pipelineForm'));
		
	});
	
	/**
	 * If Pipelined View is selected, deals are loaded with pipelined view and 
	 * creates the pipelined view cookie
	 */
	$('#milestone-listner').off('click', '.pipeline-delete');
	$('#milestone-listner').on('click', '.pipeline-delete', function(e) {
		e.preventDefault();
		var id = $(this).attr('id');
		var name = $(this).attr('data');
		$('#track-name').text(name);
		// If Yes clicked
		$('body').on('click', '#pipeline-delete-confirm', function(e) {
			e.preventDefault();
			if($(this).attr('disabled'))
		   	     return;
			
			$(this).attr('disabled', 'disabled');
			var that = $(this);
			 // Shows message
		    $save_info = $('<img src="'+updateImageS3Path("img/1-0.gif")+'" height="18px" width="18px" style="opacity:0.5;"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>Deleting track.</i></small></span>');
		    $(this).parent('.modal-footer').find('.pipeline-delete-message').append($save_info);
			$save_info.show();
			// Export Deals.
			$.ajax({
				url: '/core/api/milestone/pipelines/'+id,
				type: 'DELETE',
				success: function() {
					console.log('Deleted!');
					$('#pipeline-delete-modal').modal('hide');
					if(readCookie("agile_deal_track") && readCookie("agile_deal_track") == id)
						eraseCookie("agile_deal_track");
					if(readCookie("deal-filters")){
						var json = $.parseJSON(readCookie("deal-filters"));
						if(json.pipeline_id = id)
							eraseCookie("deal-filters");
					}
					
					App_Admin_Settings.milestones();
					$('body').removeClass('modal-open');
					$save_info.hide();
					that.removeAttr('disabled');
				},
				error : function(jqXHR, status, errorThrown){
					console.log(jqXHR);
					$save_info.hide();
					$('#pipeline-delete-modal').find('.pipeline-delete-message').text(jqXHR.responseText);
					that.removeAttr('disabled');
				}
			});
		});
		

	});

	// Admin Settings milestone list
	/**
	 * To remove the milestone from list.
	 */
	$('#milestone-listner').off('click', '.milestone-delete');
	$('#milestone-listner').on('click', '.milestone-delete', function(e) {
		e.preventDefault();
		if (!confirm("Are you sure you want to delete ?" ))
			return;
		
		var formId = $(this).closest('form');
		if($(this).closest('tr').find('.mark-won').length > 0){
			formId.find('input[name="won_milestone"]').val('');
		} else if($(this).closest('tr').find('.mark-lost').length > 0){
			formId.find('input[name="lost_milestone"]').val('');
		}
		$(this).closest('tr').css("display", "none");
		fill_ordered_milestone($(this).closest('form').attr('id'));
	});
	
	/**
	 * Shows input field to add new milestone.
	 */
	$('#milestone-listner').off('click', '.show_milestone_field');
	$('#milestone-listner').on('click', '.show_milestone_field', function(e) {
    	e.preventDefault();
    	var form = $(this).closest('form');
    	console.log('New Milestone to - ',form.attr('id'));
    	$(this).closest("div").css("display","none");
    	form.find('.show_field').css("display","block");
    	form.find(".add_new_milestone").focus();
    });
    
    /**
	 * Adds new milestone to the sortable list.
	 */
	$('#milestone-listner').off('click', '.add_milestone');
	$('#milestone-listner').on('click', '.add_milestone', function(e) {
    	
    	e.preventDefault();
    	var form = $(this).closest('form');
    	var new_milestone = form.find(".add_new_milestone").val().trim();

    	/*if(!new_milestone || new_milestone.length <= 0 || !(/^[a-zA-Z0-9-_ ]*$/).test(new_milestone))
		{
    		$('#milestone-error-modal').modal('show');
			return;
		}*/
		if(form.find(".add_new_milestone").val().trim()==""){
			$('#new_milestone_name_error_'+form.attr('id').split('milestonesForm_')[1]).show();
			return false;
		}
		if(!(/^[a-zA-Z0-9-_ ]*$/).test(form.find(".add_new_milestone").val().trim())){
			$('#new_milestone_chars_error_'+form.attr('id').split('milestonesForm_')[1]).show();
			return false;
		}
    	form.find('.show_field').css("display","none");
    	form.find(".show_milestone_field").closest("div").css("display","inline-block");
    	
    	if(!new_milestone || new_milestone.length <= 0 || (/^\s*$/).test(new_milestone))
		{
			return;
		}
    	
    	// To add a milestone when input is not empty
    	if(new_milestone != "")
    	{
    		e.preventDefault();
    	
    		// Prevents comma (",") as an argument to the input field
    		form.find(".add_new_milestone").val("");
        	
    		var milestone_list = form.find('tbody');
    		var add_milestone = true;
    		
    		// Iterate over already present milestones, to check if this is a new milestone
    		milestone_list.find('tr').each(function(index, elem){
    			if($(elem).is( ":visible") && elem.getAttribute('data').toLowerCase() == new_milestone.toLowerCase())
    			{
    				add_milestone = false; // milestone exists, don't add
    				return false;
    			}
    		});
    		
    		if(add_milestone)
    		{
    			var html = "<tr data='" + new_milestone + "' style='display: table-row;'><td><div class='milestone-name-block inline-block v-top text-ellipsis' style='width:80%'>";
    			html += new_milestone + "</div></td><td class='b-r-none'><div class='m-b-n-xs'>";
    			html += "<a class='milestone-won text-l-none-hover c-p text-xs hover-show' style='visibility:hidden;' data-toggle='tooltip' title='Set as Won Milestone'><i class='icon-like'></i></a>";
				html += "<a class='milestone-lost text-l-none-hover c-p text-xs m-l-sm hover-show' style='visibility:hidden;' data-toggle='tooltip' title='Set as Lost Milestone'><i class='icon-dislike'></i></a>";
				html +=	"<a class='milestone-delete c-p m-l-sm text-l-none text-xs hover-show' style='visibility:hidden;' data-toggle='tooltip' title='Delete Milestone'><i class='icon icon-trash'></i>" +
				"</a><a class='text-l-none-hover c-p text-xs m-l-sm hover-show' style='visibility:hidden;'><i title='Drag' class='icon-move'></i></a></div></td></tr>";
				milestone_list.append(html);
    			//milestone_list.append("<tr data='"+new_milestone+"' style='display: table-row;'><td><div style='display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%'>"+new_milestone+"</div></td><td><div class='m-b-n-xs' style='display:none;'><a class='text-l-none-hover c-p'><i title='Drag' class='icon-move'></i></a><a class='milestone-delete' style='cursor: pointer;margin-left:10px; text-decoration: none;' data-toggle='modal' role='button' href='#'><i title='Delete Milestone' class='task-action icon icon-trash'></i></a></div></td></tr>");
    	//		milestone_list.append("<li data='" + new_milestone + "'><div><span>" + new_milestone + "</span><a class='milestone-delete right' href='#'>&times</a></div></li>");
    			fill_ordered_milestone(form.attr('id'));
    		}
    	}
    });
	
	$('#milestone-listner').off('keypress', '.add_new_milestone');
	$('#milestone-listner').on('keypress', '.add_new_milestone', function(e) {
		var form = $(this).closest('form');
    	$('#new_milestone_name_error_'+form.attr('id').split('milestonesForm_')[1]).hide();
		$('#new_milestone_existed_error_'+form.attr('id').split('milestonesForm_')[1]).hide();
		$('#new_milestone_chars_error_'+form.attr('id').split('milestonesForm_')[1]).hide();
    	if(e.keyCode == 13)
    	{
    		var form = $(this).closest("form");
    		form.find(".add_milestone").click();
    	}
    });

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
	
	$("#milestone-listner").off('click', '.add_lost_reason');
	$("#milestone-listner").on('click', '.add_lost_reason', function(e){
		e.preventDefault();
		if($('#lost_reason_name').val().trim()==""){
			$('#lost_reason_name_error').show();
			return false;
		}
		if(!(/^[a-zA-Z0-9-_ ]*$/).test($('#lost_reason_name').val().trim())){
			$('#lost_reason_chars_error').show();
			return false;
		}
		var obj = serializeForm('lostReasonsForm');
		var model = new BaseModel();
		model.url = 'core/api/categories';
		model.save(obj, {
        success: function (data) {
        	var model = data.toJSON();
	        App_Admin_Settings.dealLostReasons.collection.add(new BaseModel(model));
	        $('.show_field').find('#lost_reason_name').val("");
	        $('.show_field').hide();
	        $('.show_lost_reason_add').show();
        },
        error: function (model, response) {
        	if(response.status==400 && response.responseText=="Reason with this name already exists."){
        		$('#lost_reason_existed_error').show();
        	}
        }});
	});

	$("#milestone-listner").off('keypress', '#lost_reason_name');
	$("#milestone-listner").on('keypress', '#lost_reason_name', function(e){
		$('#lost_reason_name_error').hide();
		$('#lost_reason_existed_error').hide();
		$('#lost_reason_chars_error').hide();
		if(e.keyCode == 13)
    	{
    		e.preventDefault();
    		var form = $(this).closest("form");
    		form.find(".add_lost_reason").click();
    	}
	});

	$('#milestone-listner').off("click", '.lost-reason-edit');
	$('#milestone-listner').on("click", '.lost-reason-edit', function(e){
		$(this).closest('tr').find('.lost_reason_name_div').hide();
		$(this).closest('tr').find('.lost_reason_name_input').show();
	});

	$('#milestone-listner').off("keypress", '.update_lost_reason');
	$('#milestone-listner').on("keypress", '.update_lost_reason', function(e){
		if(e.which == 13){
			e.preventDefault();
			if($(this).val().trim()==""){
				$('#lost_reason_name_error_'+$(this).attr("id")).show();
				return false;
			}
			if(!(/^[a-zA-Z0-9-_ ]*$/).test($(this).val().trim())){
				$('#lost_reason_chars_error_'+$(this).attr("id")).show();
				return false;
			}
			var obj = serializeForm('lostReasonsForm_'+$(this).attr("id"));
			var model = new BaseModel();
			model.url = 'core/api/categories';
			model.save(obj, {
        	success: function (data) {
        		var model = data.toJSON();
	       		App_Admin_Settings.dealLostReasons.collection.get(model).set(new BaseModel(model));
	        	$('.lost_reason_name_input').hide();
	        	$('.lost_reason_name_div').show();
        	},
        	error: function (model, response) {
        		if(response.status==400 && response.responseText=="Reason with this name already exists."){
        			$('#lost_reason_existed_error').show();
        		}
        	}});
		}else{
			$('#lost_reason_name_error_'+$(this).attr("id")).hide();
			$('#lost_reason_existed_error_'+$(this).attr("id")).hide();
			$('#lost_reason_chars_error_'+$(this).attr("id")).hide();
		}
	});
	
	$('#milestone-listner').off("click", '.updates_lost_reason');
	$('#milestone-listner').on("click", '.updates_lost_reason', function(e){
		if($(this).parent().find('input:text').val().trim()==""){
			$('#lost_reason_name_error_'+$(this).parent().find('input:text').attr("id")).show();
			return false;
		}
		if(!(/^[a-zA-Z0-9-_ ]*$/).test($(this).parent().find('input:text').val().trim())){
			$('#lost_reason_chars_error_'+$(this).parent().find('input:text').attr("id")).show();
			return false;
		}
		var obj = serializeForm('lostReasonsForm_'+$(this).parent().find('input:text').attr("id"));
		var model = new BaseModel();
		model.url = 'core/api/categories';
		model.save(obj, {
        success: function (data) {
        	var model = data.toJSON();
	       	App_Admin_Settings.dealLostReasons.collection.get(model).set(new BaseModel(model));
	       	$('.lost_reason_name_input').hide();
	       	$('.lost_reason_name_div').show();
        },
        error: function (model, response) {
        	if(response.status==400 && response.responseText=="Reason with this name already exists."){
        		$('#lost_reason_existed_error').show();
        	}
        }});
	});
	
	$("#milestone-listner").off('click', '.lost-reason-delete');
	$("#milestone-listner").on('click', '.lost-reason-delete', function(e){
		if(confirm("Are you sure you want to delete ?")){
			e.preventDefault();
			var that = $(this);
			var obj = serializeForm($(this).closest('form').attr("id"));
			var model = new BaseModel();
			model.url = 'core/api/categories/'+obj.id;
			model.set({ "id" : obj.id });
			model.destroy({
        	success: function (data) {
        		var model = data.toJSON();
	      	  App_Admin_Settings.dealLostReasons.collection.remove(new BaseModel(model));
	      	  that.closest('tr').remove();
        	},
        	error: function (model, response) {
        	
        	}});
		}
	});

	$("#milestone-listner").off('click', '.add_deal_source');
	$("#milestone-listner").on('click', '.add_deal_source', function(e){
		e.preventDefault();
		if($('#deal_source_name').val().trim()==""){
			$('#deal_source_name_error').show();
			return false;
		}
		if(!(/^[a-zA-Z0-9-_ ]*$/).test($('#deal_source_name').val().trim())){
			$('#deal_source_chars_error').show();
			return false;
		}
		var obj = serializeForm('dealSourcesForm');
		var model = new BaseModel();
		model.url = 'core/api/categories';
		model.save(obj, {
        success: function (data) {
        	var model = data.toJSON();
	        App_Admin_Settings.dealSourcesView.collection.add(new BaseModel(model));
	        $('.show_field').find('#deal_source_name').val("");
	        $('.show_field').hide();
	        $('.show_deal_source_add').show();
        },
        error: function (model, response) {
        	if(response.status==400 && response.responseText=="Source with this name already exists."){
        		$('#deal_source_existed_error').show();
        	}
        }});
	});

	$("#milestone-listner").off('keypress', '#deal_source_name');
	$("#milestone-listner").on('keypress', '#deal_source_name', function(e){
		$('#deal_source_name_error').hide();
		$('#deal_source_existed_error').hide();
		$('#deal_source_chars_error').hide();
		if(e.keyCode == 13)
    	{
    		e.preventDefault();
    		var form = $(this).closest("form");
    		form.find(".add_deal_source").click();
    	}
	});

	$('#milestone-listner').off("click", '.deal-source-edit');
	$('#milestone-listner').on("click", '.deal-source-edit', function(e){
		$(this).closest('tr').find('.deal_source_name_div').hide();
		$(this).closest('tr').find('.deal_source_name_input').show();
	});

	$('#milestone-listner').off("keypress", '.update_deal_source');
	$('#milestone-listner').on("keypress", '.update_deal_source', function(e){
		if(e.which == 13){
			e.preventDefault();
			if($(this).val().trim()==""){
				$('#deal_source_name_error_'+$(this).attr("id")).show();
				return false;
			}
			if(!(/^[a-zA-Z0-9-_ ]*$/).test($(this).val().trim())){
				$('#deal_source_chars_error_'+$(this).attr("id")).show();
				return false;
			}
			var obj = serializeForm('dealSourcesForm_'+$(this).attr("id"));
			var model = new BaseModel();
			model.url = 'core/api/categories';
			model.save(obj, {
        	success: function (data) {
        		var model = data.toJSON();
	       		App_Admin_Settings.dealSourcesView.collection.get(model).set(new BaseModel(model));
	        	$('.deal_source_name_input').hide();
	        	$('.deal_source_name_div').show();
        	},
        	error: function (model, response) {
        		if(response.status==400 && response.responseText=="Source with this name already exists."){
        			$('#deal_source_existed_error').show();
        		}
        	}});
		}else{
			$('#deal_source_name_error_'+$(this).attr("id")).hide();
			$('#deal_source_existed_error_'+$(this).attr("id")).hide();
			$('#deal_source_chars_error_'+$(this).attr("id")).hide();
		}
	});
	
	$('#milestone-listner').off("click", '.updates_deal_source');
	$('#milestone-listner').on("click", '.updates_deal_source', function(e){
		if($(this).parent().find('input:text').val().trim()==""){
			$('#deal_source_name_error_'+$(this).parent().find('input:text').attr("id")).show();
			return false;
		}
		if(!(/^[a-zA-Z0-9-_ ]*$/).test($(this).parent().find('input:text').val().trim())){
			$('#deal_source_chars_error_'+$(this).parent().find('input:text').attr("id")).show();
			return false;
		}
		var obj = serializeForm('dealSourcesForm_'+$(this).parent().find('input:text').attr("id"));
		var model = new BaseModel();
		model.url = 'core/api/categories';
		model.save(obj, {
        success: function (data) {
        	var model = data.toJSON();
	       	App_Admin_Settings.dealSourcesView.collection.get(model).set(new BaseModel(model));
	        $('.deal_source_name_input').hide();
	        $('.deal_source_name_div').show();
        },
        error: function (model, response) {
        	if(response.status==400 && response.responseText=="Source with this name already exists."){
        		$('#deal_source_existed_error').show();
        	}
        }});
	});
	
	$("#milestone-listner").off('click', '.deal-source-delete');
	$("#milestone-listner").on('click', '.deal-source-delete', function(e){
		if(confirm("Are you sure you want to delete ?")){
			e.preventDefault();
			var that = $(this);
			var obj = serializeForm($(this).closest('form').attr("id"));
			var model = new BaseModel();
			model.url = 'core/api/categories/'+obj.id;
			model.set({ "id" : obj.id });
			model.destroy({
        	success: function (data) {
        		var model = data.toJSON();
	      	  App_Admin_Settings.dealSourcesView.collection.remove(new BaseModel(model));
	      	  that.closest('tr').remove();
        	},
        	error: function (model, response) {
        	
        	}});
		}
	});
}