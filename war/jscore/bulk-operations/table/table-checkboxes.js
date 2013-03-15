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
		
		if($('table').hasClass('onlySorting'))
		{	
			var sortingtable = $(this).find('table.onlySorting');
		    sort_tables(sortingtable);
		    return;
		}
		
		if($('.grid-view').hasClass('showCheckboxes'))
		{
			if($(this).find('#delete-checked-grid').length == 0)
					var element = $('.showCheckboxes').after('<div class="row"><div class="span6  select-none"></div></div><a href="#" class="btn btn-danger left" id="delete-checked-grid" style="margin-bottom: 15px"> Delete</a>');		
			console.log(element);
			return;
		}
		
		var table = $(this).find('table.showCheckboxes');
		$(table).removeClass('table-bordered');
		$(table).closest('div.data-block').removeClass('data-block');
		
		//$(table).setAttribute('id', 'sort-table');

		// Remove, if rendere of a collection is called multiple times 
		$(table).find('.thead_check').parent().remove();
		$(table).find('.tbody_check').parent().remove();
		$(this).find('.select-none').parent().remove();
		$(this).find('#delete-checked').remove();
		
		$(table).find('thead tr').prepend('<th><input class="thead_check" name="" type="checkbox"/></th>');

		$(table).find('tbody tr').prepend('<td><input class="tbody_check" type="checkbox"/></td>');
		
	    // Adds class to tbody to edit the table by validating the route attribute 
		if($(table).find('tbody').attr('route'))
			$(table).find('tbody').addClass('agile-edit-row');
		
		$(table).after('<div class="row"><div class="span6  select-none"></div></div><a href="#" class="btn btn-danger left" id="delete-checked" style="margin-bottom: 15px"> Delete</a>');
		
		// Sorts the tables based on their column values
		sort_tables(table);
	});

   /**
    * Select all - Enables/Disables all check-boxes of table body when table head check-box is clicked 
    * Changes the checking status of table body check-boxes according to 
    * the status of table head check-box
    */	
	$('.thead_check').live('click', function(event){
		$('.tbody_check').attr('checked', this.checked);
	
		// Show bulk operations only when thead check box is checked
		if($(this).is(':checked'))
			$('#bulk-actions').css('display', 'block');
		else
			$('#bulk-actions').css('display', 'none');
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