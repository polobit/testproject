/**
 * opportunity-filters.js is a script file that handles opportunity filters like pipeline,
 * milestones and owner select list.
 * 
 * @module Deals
 * 
 **/
$(function () {
	$('#show-filter-button').live('click', function(e){
		e.preventDefault();
		if($('#filter_options').is(':visible'))
			$('#filter_options').hide();
		else
			showFilters();
	});
	
	$('#deals-filter-validate').live('click', function(e){
		e.preventDefault();
		filterDeals($(this));
	});
	
	$('#dealsFilterForm input[type="checkbox"]').live('click',function(e){
		var id = $(this).attr('data');
		alert('add required to '+id);
		$('#dealsFilterForm #'+id).addClass('required');
	});
	
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
				valid = confirm(msg);
			if(valid){
				$('#filter_options .filter_type').val('equal');
				$(this).val('between');
				$('#sort_field').val($(this).attr('data'));
				$('#filter_options .between').hide();
				$('#filter_options .equals').show();
				$('#'+filter+' .equals').hide();
				$('#'+filter+' .between').show();
			} else {
				$(this).val('equals');
			}
			
		}
	});
	
	$('#clear-deal-filters').live('click',function(e){
		$('#dealsFilterForm input').val('');
	 	$('#dealsFilterForm select').val('');
		$('#dealsFilterForm select.filter_type').val('equals');
		$('#filter_options .between').hide();
		$('#filter_options .equals').show();
		eraseCookie('deal-filters');
	});
	
});

function showFilters(){
	var el = $('#filter_options');

	el.show();
	//$("#deals-filter").modal('show');
	
	// Fills owner select element
	populateUsers("owners-list", el, undefined, undefined, function(data){
		
		$("#deals-filter").find("#owners-list").html(data);
		$("#owners-list", $("#dealsFilterForm")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
		$("#owners-list", $("#dealsFilterForm")).closest('div').find('.loading-img').hide();
	});
	// Contacts type-ahead
	agile_type_ahead("relates_to", el, contacts_typeahead);

	populateTracks(el, undefined, undefined, function(data){
		if(readCookie('deal-filters')){
			var json = $.parseJSON(readCookie('deal-filters'));
			$.each(json,function(key,value){
				if(value){
					if(key=='pipeline_id'){
						var el = $('#filter_option');
						// Fills milestone select element
						populateMilestones(el, undefined,json.pipeline_id, undefined, function(data){
							$("#milestone", el).html(data);
							$("#milestone", el).closest('div').find('.loading-img').hide();
							$('#'+key).val(value);
						});
					} 					
					$('#'+key).val(value);
					if(key=='pipeline_id')
						$('#pipeline').val(value);
					else if($('#'+key).hasClass('date'))
						$('#'+key).val(new Date(value * 1000).format('mm/dd/yyyy'));
				}
			});
			// Enable the datepicker
			$('#filter_options .date').datepicker({
				format : 'mm/dd/yyyy',
			});
			//deserializeForm(json, $('#dealsFilterForm'));
		}
	});
	
	/*add_custom_fields_to_form({}, function(data){
		console.log('----------------',data);
		var el_custom_fields = getTemplate("deal-custom-filter",data["custom_fields"]);
		//$(el_custom_fields).find('div.control-group').addClass('row-filter');
		$("#dealsCustomFilterForm fieldset", el).html($(el_custom_fields)).find('div.control-group').addClass('row-filter');
		
	}, "DEAL");*/
	
}

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
	console.log('----filter json--- ',json);
	createCookie('deal-filters',JSON.stringify(json));
	saveBtn.removeAttr('disabled');
	// Loads the deals
	App_Deals.deals();
}

function getDealFilters(){
	var query = ''
	if(readCookie('deal-filters')){
		query = readCookie('deal-filters');
		if(!readCookie("agile_deal_view")){
			var json = $.parseJSON(query);
			json.milestone = '';
			return JSON.stringify(json);
		}
	}
	
	return query;
}