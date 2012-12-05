/**
 * table-checkboxes.js Prepends check-boxes to each row of desired tables, 
 * in order to perform bulk operations (Delete, Change owner etc..)
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
    * by triggering the event agile_collection_loaded while loading the collection.
    */ 	
	$('body').live('agile_collection_loaded', function(event) {
		var table = $(this).find('table.showCheckboxes');
		$(table).removeClass('table-bordered');
		$(table).closest('div.data-block').removeClass('data-block');
		
		//$(table).setAttribute('id', 'sort-table');

		// Remove, if rendere of a collection called multiple times 
		$(table).find('.thead_check').parent().remove();
		$(table).find('.tbody_check').parent().remove();
		$(this).find('.select-none').parent().remove();
		$(this).find('#delete-checked').remove();
		
		$(table).find('thead tr').prepend('<th><input class="thead_check" name="" type="checkbox"/></th>');

		$(table).find('tbody tr').prepend('<td><input class="tbody_check" type="checkbox"/></td>');
		
		$(table).after('<div class="row"><div class="span6  select-none"></div></div><a href="#" class="btn btn-danger left" id="delete-checked"> Delete</a>');
		
		sortTables(table);
	});

   /**
    * Click head - click all check-boxes of table body
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
    * there is at least one check-box is checked.
    */	
	$('.tbody_check').live('click', function(event){
		event.stopPropagation();
		
		// Show bulk actions drop down menu (of contact) only when any of the check box is checked
		if($(this).attr('checked') == 'checked')
			$('body').find('#bulk-actions').css('display', 'block');
		else{
			var check_count = 0
			$.each($('.tbody_check'), function(index, element){
				if($(element).is(':checked')){
					check_count++;
					return false;
				}
				//return;
			});
			if(check_count == 0){
				$('#bulk-actions').css('display', 'none');
			}
		}	
	});
});