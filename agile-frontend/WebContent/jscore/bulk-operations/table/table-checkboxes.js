/**
 * table-checkboxes.js Prepends check-boxes to each row of desired tables (which are 
 * having showCheckboxes class), in order to perform bulk operations (Delete, Change owner etc..)
 * 
 * @module Bulk operations
 * ---------------------------------------------
 * author: Rammohan
 *  
 */
$(function(){	
	
   /**
    * Custom event to add check-boxes to specified tables
    * Prepends check-boxes to the tables which are having the class showCheckboxes, 
    * by triggering the event agile_collection_loaded from base-collection render event, while loading the collection.
    */ 	
	$('body').live('agile_collection_loaded', function(event, el) {
		//use class ignore-collection if any other table needs to be used inside the template.
		var table_element = $('table:not(.ignore-collection)', el);
		
		  // Adds class to tbody to edit the table by validating the route attribute 
		if($(table_element).find('tbody').attr('route'))
			$(table_element).find('tbody').addClass('agile-edit-row');
		
		if($(table_element).hasClass('onlySorting'))
		{	
		    sort_tables(table_element);
		    return;
		}
		
		if($('.grid-view', el).hasClass('showCheckboxes'))
		{
			if($(this).find('#delete-checked-grid').length == 0)
					var element = $('.showCheckboxes').after('<div class="row-fluid"><div class="span6 select-none"></div></div><a href="#" class="btn btn-danger left" id="delete-checked-grid" style="margin-bottom: 15px"> Delete</a>');		
			console.log(element);
			return;
		}
		
		
		var table = $(el).find('table.showCheckboxes');
		$(table).removeClass('table-bordered');
		$(table).closest('div.data-block').removeClass('data-block');
		
	
		//$(table).setAttribute('id', 'sort-table');

		var table_body_row = $(table).find('tbody tr');
		var table_header_row = $(table).find('thead tr');

		var table_headers = $(table_header_row).find('.thead_check');
		var table_cell = $(table_body_row).find('.tbody_check');

		
		// Remove, if rendere of a collection is called multiple times 
		if(table_headers.length == 0)
			$(table_header_row).prepend('<th><input class="thead_check" type="checkbox"/></th>');
		
		if(table_cell.length == 0)
			$(table_body_row).prepend('<td style="cursor:default;"><input class="tbody_check" type="checkbox"/></td>');	  
		
		$(el).find('#delete-checked').remove();
		
		if(!$(table_element).hasClass('noDelete')){
			
			$(table).after('<div class="row-fluid"><div class="span6  select-none"></div></div><a href="#" class="btn btn-danger left" id="delete-checked" style="margin-bottom: 15px"> Delete</a>');
			
		}
			
		if($(table_element).hasClass('no-sorting'))
		{	
		    console.log(table_element);
		    return;
		}

		// Sorts the tables based on their column values
		sort_tables(table_element);
	});

   /**
    * Select all - Enables/Disables all check-boxes of table body when table head check-box is clicked 
    * Changes the checking status of table body check-boxes according to 
    * the status of table head check-box
    */	
	$('.thead_check').live('click', function(event){
		console.log( $(this).is(':checked'));
		if(!$(this).attr('checked'))
		{
			$('.tbody_check').removeAttr('checked');
			
			if (Current_Route == 'deals')
				deal_bulk_actions.toggle_deals_bulk_actions_dropdown(undefined, true,$(this).parents('table').attr('id'));
			else
				toggle_contacts_bulk_actions_dropdown(undefined, true,$(this).parents('table').attr('id'));
			
		}
		else
			$('.tbody_check').attr('checked', 'checked');
	
		console.log($(this).attr('checked'));
		
		// Show bulk operations only when thead check box is checked
		if (Current_Route == 'deals')
			deal_bulk_actions.toggle_deals_bulk_actions_dropdown(this, true,$(this).parents('table').attr('id'));
		else
			toggle_contacts_bulk_actions_dropdown(this, true,$(this).parents('table').attr('id'));
		
	});
	
   /**
    * Stops the propagation of default functionality (editing the entity) of parent to the check-box (tr)
    * and shows the bulk-actions drop down of contacts only when 
    * there is at least one check-box checked.
    */	
	$('.tbody_check').live('click', function(event){
		event.stopPropagation();
		
		if (Current_Route == 'deals')
			deal_bulk_actions.toggle_deals_bulk_actions_dropdown(this,false,$(this).parents('table').attr("id"));
		else
			toggle_contacts_bulk_actions_dropdown(this,false,$(this).parents('table').attr("id"));
	});
});

function append_checkboxes(el)
{
	var checkbox_element = $('tr:last > td.select_checkbox', el);
	if(checkbox_element.length != 0)
	{
		if(SELECT_ALL == true || (Current_Route == 'deals' && deal_bulk_actions.SELECT_ALL_DEALS==true) || SUBSCRIBERS_SELECT_ALL == true)
		$('.tbody_check', checkbox_element).attr('checked', 'checked');
		
		return;
	}

	// If select all is chosen then all the upcomming models with in table should have checked checkboxes
	if(SELECT_ALL == true || (Current_Route == 'deals' && deal_bulk_actions.SELECT_ALL_DEALS==true) || SUBSCRIBERS_SELECT_ALL == true)
		$('tr:last', el).prepend('<td><input class="tbody_check" type="checkbox" checked="checked"/></td>');
	else
		$('tr:last', el).prepend('<td><input class="tbody_check" type="checkbox"/></td>');	
}