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
	$('body').on('agile_collection_loaded', function(event, el) {
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
		
		/*if($('.grid-view', el).hasClass('showCheckboxes'))
		{
			if($(this).find('#delete-checked-grid').length == 0)
					var element = $('.showCheckboxes').after('<div class="row"><div class="span6 select-none"></div></div><a href="#" class="btn btn-danger left" id="delete-checked-grid" style="margin-bottom: 15px"> Delete</a>');		
			console.log(element);
			return;
		}*/
		
		
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
			$(table_header_row).prepend('<th style="width:5%;"><label class="i-checks i-checks-sm m-b-none"><input type="checkbox" class="thead_check" value=""><i></i></label></th>');
		
		if(table_cell.length == 0)
			$(table_body_row).prepend('<td class="v-middle checkbox" style="cursor:default;"><label class="i-checks i-checks-sm"><input type="checkbox" class="tbody_check" value=""><i></i></label></td>');	  
		
		$(el).find('#delete-checked').remove();
		
		if(!$(table_element).hasClass('noDelete')){
			
			$(table).after('<div><div class="select-none"></div></div><footer class="panel-footer"><a href="#" class="btn btn-danger btn-sm" id="delete-checked"> Delete</a></footer>');
			
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
	$('body').on('click', '.thead_check', function(event){
		console.log( $(this).is(':checked'));
		if(!$(this).is(':checked'))
		{
			$('.tbody_check').prop('checked',false);
			
			if (Current_Route == 'deals')
				deal_bulk_actions.toggle_deals_bulk_actions_dropdown(undefined, true,$(this).parents('table').attr('id'));
			else if(Current_Route == 'users')			
				toggle_admin_user_bulk_actions_delete(this, true,$(this).parents('table').attr('id'));
			else
				toggle_contacts_bulk_actions_dropdown(undefined, true,$(this).parents('table').attr('id'));
			
		}
		else{
			$('.tbody_check').prop('checked',true);		
			$("#bulk-action-btns button").removeClass("disabled");
		}
		console.log($(this).is(':checked'));
		
		// Show bulk operations only when thead check box is checked
		if (Current_Route == 'deals')
			deal_bulk_actions.toggle_deals_bulk_actions_dropdown(this, true,$(this).parents('table').attr('id'));
		else if(Current_Route == 'users')			
				toggle_admin_user_bulk_actions_delete(this, true,$(this).parents('table').attr('id'));		

		else
			toggle_contacts_bulk_actions_dropdown(this, true,$(this).parents('table').attr('id'));
		
	});
	
   /**
    * Stops the propagation of default functionality (editing the entity) of parent to the check-box (tr)
    * and shows the bulk-actions drop down of contacts only when 
    * there is at least one check-box checked.
    */	
	$('body').on('click', '.tbody_check', function(event){
		event.stopPropagation();
		if (Current_Route == 'dashboards')
		{
			return;
		}

		if (Current_Route == 'deals')
			deal_bulk_actions.toggle_deals_bulk_actions_dropdown(this,false,$(this).parents('table').attr("id"));
		/*else if(Current_Route=='contacts' && _agile_get_prefs("agile_contact_view"))
			toggle_contacts_bulk_actions_dropdown(this,true,$(this).parents('table').attr("id"));*/
		else if(Current_Route == 'users')			
				toggle_admin_user_bulk_actions_delete(this, true,$(this).parents('table').attr('id'));
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
	{
		$('tr:last', el).prepend('<td><label class="i-checks i-checks-sm"><input class="tbody_check" type="checkbox" checked="checked"/><i></i></label></td>');
		var grid_view_element = $(".grid-view-checkbox", el);
		  if(grid_view_element.length != 0)
		      grid_view_element.prop("checked", "checked");
	}	

	else
		$('tr:last', el).prepend('<td><label class="i-checks i-checks-sm"><input class="tbody_check" type="checkbox"/><i></i></label></td>');	
}