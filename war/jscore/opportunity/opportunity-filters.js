/**
 * opportunity-filters.js is a script file that handles opportunity filters like pipeline,
 * milestones and owner select list.
 * 
 * @module Deals
 * 
 **/
$(function () {
	$('.deals-filter').live('click', function(e){
		e.preventDefault();
		
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
});

function showFilters(){
	var el = $("#deals-filter");

	$("#deals-filter").modal('show');
	
	add_custom_fields_to_form({}, function(data){
		var el_custom_fields = show_custom_fields_helper(data["custom_fields"], []);
		$("#custom-field-deals", $("#opportunityModal")).html($(el_custom_fields));
		
	}, "DEAL")
	
	
	
	// Fills owner select element
	populateUsers("owners-list", el, undefined, undefined, function(data){
		
		$("#deals-filter").find("#owners-list").html(data);
		$("#owners-list", $("#dealsFilterForm")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
		$("#owners-list", $("#dealsFilterForm")).closest('div').find('.loading-img').hide();
	});
	// Contacts type-ahead
	agile_type_ahead("relates_to", el, contacts_typeahead);

	populateTracks(el, undefined, undefined, function(data){});
}

function filterDeals(saveBtn){
	// Returns, if the save button has disabled attribute
	if (saveBtn.attr('disabled'))
		return;
	var formId = $("#dealsFilterForm");

	if (!isValidForm('#' + formId)) {
		// Removes disabled attribute of save button
		enable_save_button(saveBtn);//$(saveBtn).removeAttr('disabled');
		return false;
	}
}