/**
 * Deletes the selected row related entities from the database based on the url 
 * attribute of the table and fades out the rows from the table
 * 
 * @module Bulk operations
 * ---------------------------------------------
 * author: Rammohan 
 */

$(function(){	
   /**
    * Validates the checked status of table body check-boxes
    * Customizes the delete operation
    * Deletes the entities
    */	
	$('#delete-checked').live('click', function(event){
		event.preventDefault();
		var id_array = [];
		var index_array = [];
		var data_array = [];
		var checked = false;
		var table = $('body').find('table.showCheckboxes');

		$(table).find('tr .tbody_check').each(function(index, element){
			
			// If element is checked store it's id in an array 
			if($(element).is(':checked')){
				index_array.push(index);
				id_array.push($(element).closest('tr').data().get('id'));
				data_array.push($(element).closest('tr').data().toJSON());
				checked = true;
			}
		});
		if(checked){
			
			if(!confirm("Are you sure you want to delete?"))
	    		return;
			// Customize the bulk delete operations
			if(!customizeBulkDelete(id_array, data_array))
				return;
			
			bulkDeleteOperation($(table).attr('url'), id_array, index_array, table, data_array);
		}	
		else
            $('body').find(".select-none").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">×</a>You have not selected any records to delete. Please select at least one record to continue.</div>').show().delay(3000).hide(1);
			
	});
});

/**
 * Customizes the bulk delete operation of certain tables for example,
 * in case of users checks each user weather he/she is an admin or not before deleting the users
 * @method customizeBulkDelete
 * @param {Array} id_array holds the array of ids
 * @param {Array} data_array holds the array of entities
 * @returns {Boolean} 
 */
function customizeBulkDelete(id_array, data_array){
	if(Current_Route == 'users'){
		$.each(data_array, function(index, model){
			if(model.is_admin){
				id_array.splice(id_array.indexOf(model.id), 1);
			}	
		});
		if(id_array.length == 0){
			$('body').find(".select-none").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">×</a>Sorry, you can not delete user who is admin.</div>').show().delay(3000).hide(1);
			return false;
		}
	}
	return true;
}

/**
 * Bulk operations - delete function
 * Deletes the entities by sending their ids as form data of ajax POST request 
 * and then fades out the rows from the table
 * @method bulkDeleteOperation
 * @param {Steing} url to which the request has to be sent
 * @param {Array} id_array holds array of ids of the entities to be deleted
 * @param {Array} index_array holds array of row indexes to be faded out
 * @param {Object} table content as html object
 * @param {Array} data_array holds array of entities 
 */
function bulkDeleteOperation(url, id_array, index_array, table, data_array){
	var json = {};
	json.model_ids = JSON.stringify(id_array);
	var tbody = $(table).find('tbody');
	
	$.ajax({
		url: url,
		type: 'POST',
		data: json,
		success: function(){
			
			// To remove table rows on delete 
			for(var i = 0; i < index_array.length; i++) 
				$(tbody).find('tr:eq(' + index_array[i] + ')').fadeOut(300, function() { $(this).remove(); });
			
			// Tags re-fetching
			if(App_Contacts.contactsListView){
				setupTags(App_Contacts.contactsListView.el);
			}	
		}
	});
}