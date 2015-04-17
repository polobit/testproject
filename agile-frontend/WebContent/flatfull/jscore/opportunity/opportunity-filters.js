/**
 * opportunity-filters.js is a script file that handles opportunity filters like pipeline,
 * milestones and owner select list.
 * 
 * @module Deals
 * 
 **/
$(function () {
	
	// Show filter drop down.
	$('#show-filter-button').live('click', function(e){
		e.preventDefault();
		if($('#filter_options').is(':visible'))
			$('#filter_options').hide();
		else
			showFilters();
	});
	
	// Filter deals.
	$('#deals-filter-validate').live('click', function(e){
		e.preventDefault();
		filterDeals($(this));
	});
	
	// For updating the filter inequality and the fields based on the filter type selected.
	$('#filter_options .filter_type').live('change',function(e){
		var filter = $(this).closest('.control-group').attr('id');
		if($(this).val()=='equals'){
			$('#'+filter+' .equals').show();
			$('#'+filter+' .between').hide();
		}
		else {
			var msg = "You can only use one 'between' condition for filtering. Press Ok to change other conditions to equal.";
			var bwCount = $("#filter_options").find('select option[value="between"]:selected').length;
			var valid = true;
			if(bwCount > 1)
				valid = false;
			if(valid){
				$('#filter_options .filter_type').val('equal');
				$(this).val('between');
				$('#sort_field').val($(this).attr('data'));
				$('#filter_options .between').hide();
				$('#filter_options .equals').show();
				$('#'+filter+' .equals').hide();
				$('#'+filter+' .between').show();
			} else {
				alert("Sorry. You can't have multiple 'Between' conditions.");
				$(this).val('equals');
			}
			
		}
	});
	
	// Clear the deal filter form and remove the cookie.
	$('#clear-deal-filters').live('click',function(e){
		$('#dealsFilterForm input').val('');
	 	$('#dealsFilterForm select').filter(':visible').val('');
		$('#dealsFilterForm select.filter_type').val('equals');
		$('#filter_options .between').hide();
		$('#filter_options .equals').show();
		$('#dealsFilterForm #archived').val('false');
		$('#filter_options').find('.control-group').each(function(index){
			if($(this).find('.controls').height()>0)
				$(this).find('a.changeIcon').trigger('click');
		});
		eraseCookie('deal-filters');
		$('#show-filter-button').removeClass('btn-primary');
	});
	
	$('#filter_options a.changeIcon').live('click',function(e){$(this).find('i').toggleClass('icon-plus icon-minus')});
	
});

function setupDealFilters(cel){
	
	$('#deal-list-filters').html(getTemplate('deal-filter'));
	var el = $('#filter_options');
	// Fills owner select element
	
	populateUsers("owners-list-filters", el, undefined, undefined, function(data){
		
		$("#deals-filter").find("#owners-list-filters").html(data);
		//Select none by default.
		if(readCookie('deal-filters')){
			var json = $.parseJSON(readCookie('deal-filters'));
		}
		
		$("#owners-list-filters", $("#dealsFilterForm")).closest('div').find('.loading-img').hide();
		
		$("#deal_owner_change_modal").find("#owners-list-bulk").html(data);
		$("#owners-list-bulk", $("#deal_owner_change_modal")).closest('div').find('.loading').hide();
	
	// Populate pipeline in the select box.
	populateTracks(el, undefined, undefined, function(data){
		//Select none by default.
		$('#pipeline').val('');
		deal_bulk_actions.fillPipelineList(data);
		$('#owners-list-filters').val('');
		if(readCookie('deal-filters')){
			var json = $.parseJSON(readCookie('deal-filters'));
			$.each(json,function(key,value){
				
				// Fill the filters based on previously selected filters in cookie.
				if(value){
					if($('[name="'+key+'"]').closest('.controls').height()== 0 && key.indexOf('_filter')<0){
						$('[name="'+key+'"]').closest('.controls').addClass('in');
						$('[name="'+key+'"]').closest('.control-group').find('a.changeIcon').find('i').toggleClass('icon-plus icon-minus');
					}
					
					if(key=='pipeline_id'){
						// Fills milestone and select element
						populateMilestones(el, undefined,json.pipeline_id, undefined, function(data){
							$("#milestone", el).html(data);
							$("#milestone", el).closest('div').find('.loading-img').hide();
							$("#milestone",el).val(json.milestone);
						});
					}
					$('#'+key).val(value);
					if(key=='pipeline_id')
						$('#pipeline').val(value);
					else if(key=='owner_id')
						$('#owners-list-filters').val(value);
					else if($('#'+key).hasClass('date'))
						$('#'+key).val(new Date(value * 1000).format('mm/dd/yyyy'));
					
					if(key.indexOf('_filter')>0)
						$('#'+key).trigger('change');
					
				}
			});
			//deserializeForm(json, $('#dealsFilterForm'));
			updateFilterColor();
		}
		// Enable the datepicker
		$('#filter_options .date').datepicker({
			format : 'mm/dd/yyyy',
		});
		if(!readCookie("agile_deal_view")){
			$('#pipeline').closest('.control-group').hide();
			$('#milestone').closest('.control-group').hide();
		}
		$('#filter_options select').find('option[value=""]').text('Any');
	});
	});
}

function updateFilterColor(){
	var filters_count = 0;
	var json = $.parseJSON(readCookie('deal-filters'));
	if(json.owner_id.length > 0)
		filters_count++;
	if(json.value_filter == 'equals'){
		if(json.value.length > 0)
			filters_count++;
	}else {
		if(json.value_start.length > 0 || json.value_end.length > 0)
			filters_count++;
	}
	
	if (readCookie("agile_deal_view")){
		if(json.pipeline_id.length > 0)
			filters_count++;
	}
	
	if(json.archived != 'false')
		filters_count++;
	
	if(filters_count > 0)
	$('#show-filter-button').addClass('btn-primary');
}

/**
 * Show filters drop down and fill the options.
 */
function showFilters(){
	var el = $('#filter_options');

	el.show();
	//$("#deals-filter").modal('show');
	

	/*add_custom_fields_to_form({}, function(data){
		console.log('----------------',data);
		var el_custom_fields = getTemplate("deal-custom-filter",data["custom_fields"]);
		//$(el_custom_fields).find('div.control-group').addClass('row-filter');
		$("#dealsCustomFilterForm fieldset", el).html($(el_custom_fields)).find('div.control-group').addClass('row-filter');
		
	}, "DEAL");*/
	
}

/**
 * Deserialize the filters form and save them in the cookie as JSON string and reload the page.
 * @param saveBtn
 */
function filterDeals(saveBtn){
	// Returns, if the sav	e button has disabled attribute
	if (saveBtn.attr('disabled'))
		return;
	saveBtn.attr('disabled','disabled');
	$('#filter_options').hide();
	var formId = 'dealsFilterForm';
	/*if (!isValidForm('#' + formId)) {
		// Removes disabled attribute of save button
		enable_save_button(saveBtn);//$(saveBtn).removeAttr('disabled');
		return false;
	}*/
	var json = serializeForm(formId);
	//var customJson = serializeForm('dealsCustomFilterForm');
	//json.customFields=customJson;
	if(readCookie("agile_deal_track") && json.pipeline_id.length > 1 && readCookie("agile_deal_track") != json.pipeline_id)
		createCookie("agile_deal_track", json.pipeline_id)
	createCookie('deal-filters',JSON.stringify(json));
	saveBtn.removeAttr('disabled');
	// Loads the deals
	App_Deals.deals();
}

/**
 * Get the deal filters in the cookie.
 * @returns
 */
function getDealFilters(){
	var query = ''
	if(readCookie('deal-filters')){
		query = readCookie('deal-filters');
		// Remove the milestone field in the filters if it is milestone view.
		if(!readCookie("agile_deal_view")){
			var json = $.parseJSON(query);
			if(json.pipeline_id.length == 0)
				json.pipeline_id = readCookie('agile_deal_track');
			json.milestone = '';
			return JSON.stringify(json);
		}
	}
	return query;
}