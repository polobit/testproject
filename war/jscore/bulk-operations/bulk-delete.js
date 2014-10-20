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
    * Validates the checkbox status of each row in table body
    * Customizes the delete operation
    * Deletes the entities
    */	
	$('#delete-checked, .delete-checked-contacts').die().live('click', function(event){
		event.preventDefault();
		var id_array = [];
		var index_array = [];
		var data_array = [];
		var checked = false;
		var table = $('body').find('.showCheckboxes');

		$(table).find('tr .tbody_check').each(function(index, element){
			
			// If element is checked store it's id in an array 
			if($(element).is(':checked')){
				// Disables mouseenter once checked for delete(To avoid popover in deals when model is checked)
				$(element).closest('tr').on("mouseenter", false);
				index_array.push(index);
				if(!$(element).closest('tr').hasClass("pseduo-row"))
				{
					id_array.push($(element).closest('tr').data().get('id'));
					data_array.push($(element).closest('tr').data().toJSON());
					checked = true;
				}
			}
		});
		if(checked){
			
			if(!canRunBulkOperations())
			{
				showModalConfirmation("Bulk Delete", 
						"You may not have permission to update some of the contacts selected. " +
						"Proceeding with this operation will change the owner for only the contacts " +
						"you are allowed to update.<br/><br/> Do you want to proceed?", 
						function (){
					
					// Customize the bulk delete operations
					if(!customize_bulk_delete(id_array, data_array))
						return;
					
					
					$(this).after('<img class="bulk-delete-loading" style="padding-right:5px;margin-bottom:15px" src= "img/21-0.gif"></img>');
					
					var url = $(table).attr('url');
					if(SELECT_ALL == true)
					{
						if($(table).attr('id') == "contacts" || $(table).attr('id') == "companies" )
							url = url + "&filter=" + encodeURIComponent(getSelectionCriteria());
					}
					
					// For Active Subscribers table
					if(SUBSCRIBERS_SELECT_ALL == true){	
						if($(table).attr('id') == "active-campaign")
							url = url + "&filter=all-active-subscribers";
					}
					
					bulk_delete_operation(url, id_array, index_array, table, undefined, data_array);
						}, 
						function(){
							
							return;
						},
						function() {
							
						});
			}
			else
			{
				// customize delete confirmation message
				if(!customize_delete_message(table))
					return;
				
				// Customize the bulk delete operations
				if(!customize_bulk_delete(id_array, data_array))
					return;
				
				
				$(this).after('<img class="bulk-delete-loading" style="padding-right:5px;margin-bottom:15px" src= "img/21-0.gif"></img>');
				
				var url = $(table).attr('url');
				if(SELECT_ALL == true)
				{
					if($(table).attr('id') == "contacts" || $(table).attr('id') == "companies" )
						url = url + "&filter=" + encodeURIComponent(getSelectionCriteria());
				}
				
				// For Active Subscribers table
				if(SUBSCRIBERS_SELECT_ALL == true){	
					if($(table).attr('id') == "active-campaign")
						url = url + "&filter=all-active-subscribers";
				}
				
				bulk_delete_operation(url, id_array, index_array, table, undefined, data_array);
			}
						
		}	
		else
		{
			// if disabled return
			if($(this).attr('disabled') === "disabled")
				return;
			
			$('body').find(".select-none").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times;</a>You have not selected any records to delete. Please select at least one record to continue.</div>').show().delay(3000).hide(1);
		}
			
	});
	
	
	
	/**
	    * Validates the checkbox status of each row in table body
	    * Customizes the delete operation
	    * Deletes the entities
	    */	
		$('#delete-checked-grid').die().live('click', function(event){
			event.preventDefault();
			var id_array = [];
			var index_array = [];
			var data_array = [];
			var checked = false;
			var table = $('body').find('.showCheckboxes');

			$(table).find('.tbody_check').each(function(index, element){
				
				// If element is checked store it's id in an array 
				if($(element).is(':checked')){
					
					console.log($(element).parent('div').attr('id'));
					index_array.push(index);
					console.log(index_array);
					id_array.push($(element).parent('div').attr('id'));
					//data_array.push($(element).parent('div').data().toJSON());
					checked = true;
				}
			});
			if(checked){
				
				if(!canRunBulkOperations())
				{
					showModalConfirmation("Bulk Delete", 
							"You may not have permission to update some of the contacts selected. " +
							"Proceeding with this operation will change the owner for only the contacts " +
							"you are allowed to update.<br/><br/> Do you want to proceed?", 
							function (){
								// Customize the bulk delete operations
								if(!customize_bulk_delete(id_array, data_array))
										return;
				
								bulk_delete_operation($(table).attr('url'), id_array, index_array, table, true, data_array);
							}
							, function(){
								// No callback
								return;
								},
								function(){
					
								});
				}
			else
				{
					if(!confirm("Are you sure you want to delete?"))
		    		return;
					
					// Customize the bulk delete operations
						if(!customize_bulk_delete(id_array, data_array))
							return;
				
						bulk_delete_operation($(table).attr('url'), id_array, index_array, table, true, data_array);
				}
				
				
			}	
			else
	            $('body').find(".select-none").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times;</a>You have not selected any records to delete. Please select at least one record to continue.</div>').show().delay(3000).hide(1);
				
		});
	
});

/**
 * Customizes the bulk delete operation of certain tables. For example,
 * in case of users table, this code verifies if each user is an admin or not before deleting them. 
 * Doesn't delete admins.
 * 
 * @method customize_bulk_delete
 * @param {Array} id_array holds the array of ids
 * @param {Array} data_array holds the array of entities
 * @returns {Boolean} 
 */
function customize_bulk_delete(id_array, data_array){
	if(Current_Route == 'users'){
		$.each(data_array, function(index, model){
			if(model.is_admin){
				id_array.splice(id_array.indexOf(model.id), 1);
			}	
		});
		if(id_array.length == 0){
			$('body').find(".select-none").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry, can not delete user with <i>admin</i> privilege.</div>').show().delay(5000).hide(1);
			return false;
		}
	}
	return true;
}

/**
 * Bulk operations - delete function
 * Deletes the entities by sending their ids as form data of ajax POST request 
 * and then fades out the rows from the table
 * @method bulk_delete_operation
 * @param {Steing} url to which the request has to be sent
 * @param {Array} id_array holds array of ids of the entities to be deleted
 * @param {Array} index_array holds array of row indexes to be faded out
 * @param {Object} table content as html object
 * @param {Array} data_array holds array of entities 
 */
function bulk_delete_operation(url, id_array, index_array, table, is_grid_view, data_array){
	var json = {};
	json.ids = JSON.stringify(id_array);
		
	$.ajax({
		url: url,
		type: 'POST',
		data: json,
		success: function() {
			$(".bulk-delete-loading").remove();	
			
			if($(table).attr('id') == "contacts")
				showNotyPopUp('information', "Your contacts deletion will be processed shortly", "top", 5000);
			if($(table).attr('id') == "companies")
				showNotyPopUp('information', "Your companies deletion will be processed shortly", "top", 5000);
			
			if(!is_grid_view)
			{
				var tbody = $(table).find('tbody');
				
				// To remove table rows on delete 
				for(var i = 0; i < index_array.length; i++) 
					$(tbody).find('tr:eq(' + index_array[i] + ')').fadeOut(300, function() { $(this).remove(); });				
			}
			else
			{
				// To remove table rows on delete 
				for(var i = 0; i < id_array.length; i++) 
					$("."+id_array[i]).fadeOut(300, function() { $(this).remove(); });				
			}
			
			$('.thead_check').attr("checked", false);
			
			// Show bulk operations only when thead check box is checked
			toggle_contacts_bulk_actions_dropdown(undefined, true,$('.thead_check').parents('table').attr('id'));
			
			// Tags re-fetching
			if(App_Contacts.contactsListView){
				setup_tags(App_Contacts.contactsListView.el);
			}
			
			// Removes the entities from timeline, if they are deleted from contact detail view
			if(App_Contacts.contactDetailView && Current_Route == "contact/"
				+ App_Contacts.contactDetailView.model.get('id')){
				
				// Activates "Timeline" tab and its tab content in contact detail view 
				activate_timeline_tab();
				
				$.each(data_array, function(index, data){
					var $removeItem = $( '#' + data.id );
					$('#timeline').isotope('remove', $removeItem);
				});
			}			
		}
	});
}

/**
 * Returns boolean value based on user action on confirmation message.
 * If OK is clicked returns true, otherwise false.
 * 
 * @param table - table object
 **/
function customize_delete_message(table)
{
	
	// Default message for all tables
	var confirm_msg = "Are you sure you want to delete?";
	
	// Appends campaign-name for active subscribers
	if($(table).attr('id') === "active-campaign")
		confirm_msg = "Delete selected contacts from " +$('#subscribers-campaign-name').text()+" Campaign?";

	// Shows confirm alert, if Cancel clicked, return false
	if(!confirm(confirm_msg))
		return false;
	
	// if OK clicked return true
	return true;
	
}