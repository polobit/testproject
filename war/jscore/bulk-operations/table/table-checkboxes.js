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
	$('body').live('agile_collection_loaded', function(event) {
		
		
		  // Adds class to tbody to edit the table by validating the route attribute 
		if($('table').find('tbody').attr('route'))
			$('table').find('tbody').addClass('agile-edit-row');
		
		if($('table').hasClass('onlySorting'))
		{	
			var sortingtable = $(this).find('table.onlySorting');
		    sort_tables(sortingtable);
		    return;
		}
		
		if($('.grid-view').hasClass('showCheckboxes'))
		{
			if($(this).find('#delete-checked-grid').length == 0)
					var element = $('.showCheckboxes').after('<div class="row-fluid"><div class="span6 select-none"></div></div><a href="#" class="btn btn-danger left" id="delete-checked-grid" style="margin-bottom: 15px"> Delete</a>');		
			console.log(element);
			return;
		}
		
		var table = $(this).find('table.showCheckboxes');
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
		
		$(this).find('#delete-checked').remove();
		

		$(table).after('<div class="row-fluid"><div class="span6  select-none"></div></div><a href="#" class="btn btn-danger left" id="delete-checked" style="margin-bottom: 15px"> Delete</a>');
		
		// Sorts the tables based on their column values
		sort_tables(table);
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
			toggle_contacts_bulk_actions_dropdown(undefined, true);
		}
		else
			$('.tbody_check').attr('checked', 'checked');
	
		console.log($(this).attr('checked'));
		
		// Show bulk operations only when thead check box is checked
		toggle_contacts_bulk_actions_dropdown(this, true);
		
	});
	
   /**
    * Stops the propagation of default functionality (editing the entity) of parent to the check-box (tr)
    * and shows the bulk-actions drop down of contacts only when 
    * there is at least one check-box checked.
    */	
	$('.tbody_check').live('click', function(event){
		event.stopPropagation();
		
		toggle_contacts_bulk_actions_dropdown(this);
	});
});

function append_checkboxes(el)
{
	var checkbox_element = $('tr:last > td.select_checkbox', el);
	if(checkbox_element)
	{
		if(SELECT_ALL == true)
		$('.tbody_check', checkbox_element).attr('checked', 'checked');
		
		return;
	}

		
	// If select all is chosen then all the upcomming models with in table should have checked checkboxes
	if(SELECT_ALL == true)
		$('tr:last', el).prepend('<td><input class="tbody_check" type="checkbox" checked="checked"/></td>');
	else
		$('tr:last', el).prepend('<td><input class="tbody_check" type="checkbox"/></td>');	
}