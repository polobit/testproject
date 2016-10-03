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
	$("body").on("click", "#delete-checked, .delete-checked-contacts", function(event){
		event.preventDefault();
		var id_array = [];
		var index_array = [];
		var data_array = [];
		var checked = false;
		var table = $('body').find('.showCheckboxes');
		App_Companies.Company_detail_route="";
			 if (company_util.isCompanyContact())
				App_Companies.Company_detail_route = Current_Route;
		$(table).find('tr .tbody_check').each(function(index, element){
			
			// If element is checked store it's id in an array. !$(element).attr('disabled') included by Sasi to avoid disabled checkboxes
			if($(element).is(':checked') && !$(element).attr('disabled')){
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
			
			if(!hasScope('DELETE_CONTACT'))
			{
				showModalConfirmation(_agile_get_translated_val("bulk-delete", "bulk-delete"), 
						_agile_get_translated_val("contacts", "no-permission-to-delete"), 
						function (){
							return;
						}, 
						function(){
							return;
						},
						function() {
							
						},
						_agile_get_translated_val("contact-details", "cancel"), "");
			}
			else
			{
				if($(table).hasClass('show-delete-modal')){

					var json = {};
					json.title = $(table).attr('data-bulk-delete-title');
					json.msg = $(table).attr('data-bulk-delete-msg');

					getTemplate("bulk-actions-delete-modal", json, undefined, function(template_ui){

						if(!template_ui)
							return;

						$('#ticketsModal').html($(template_ui)).modal('show').on('shown.bs.modal', function(){
							
							$('#ticketsModal a.bulk-delete').off('click');
							$('#ticketsModal a.bulk-delete').click(function(e){
								console.log("tickets clicked");
								
								$('#ticketsModal').modal('hide');
								$(this).after('<img class="bulk-delete-loading" style="padding-right:5px;margin-bottom:15px" src= "img/21-0.gif"></img>');
								bulk_delete_operation($(table).attr('url'), id_array, index_array, table, undefined, data_array);
							});
						});				
					});

					return;
				}

				var related_contacts_update_acl_error = DOCS_CONTACTS_BULK_DELETE_ERROR;
				if($(table).attr("id") == "task-list")
				{
					related_contacts_update_acl_error = TASKS_CONTACTS_BULK_DELETE_ERROR;
				}
				if(($(table).attr("id") == "document-list" || $(table).attr("id") == "task-list") && !hasScope("EDIT_CONTACT"))
				{
					showModalConfirmation(_agile_get_translated_val("bulk-delete", "bulk-delete"), 
						related_contacts_update_acl_error, 
						function (){
							bulk_delete_operation($(table).attr('url'), id_array, index_array, table, undefined, data_array);
						}, 
						function(){
							return;
						}
					);
				}

				// customize delete confirmation message
				/*if(!customize_delete_message(table))
					return;*/
				
				// Customize the bulk delete operations
				if(!customize_bulk_delete(id_array, data_array))
					return;

				if(($(table).attr("id") == "document-list" || $(table).attr("id") == "task-list") && !hasScope("EDIT_CONTACT"))
					return;

				// Default message for all tables
				var confirm_msg = _agile_get_translated_val("others", "delete-warn");
				var $that = $(this);
				// Shows confirm alert, if Cancel clicked, return false
 				showAlertModal(confirm_msg, "confirm", function(){
				// Appends campaign-name for active subscribers
				if($(table).attr('id') === "active-campaign")
					confirm_msg = _agile_get_translated_val("contacts", "delete-contacts-from") + " " +$('#subscribers-campaign-name').text()+" " +_agile_get_translated_val("contact-details", "campaign")+ "?";
					$that.append('<img class="bulk-delete-loading" style="padding-right:5px;margin-bottom:15px" src= "'+updateImageS3Path("img/21-0.gif")+'"></img>');
				
					var url = $(table).attr('url');
					if(SELECT_ALL && SELECT_ALL == true)
					{
						if($(table).attr('id') == "contacts-table" || $(table).attr('id') == "companies" ) {
							var dynamic_filter = getDynamicFilters();
							if(dynamic_filter == null) {								
								url = url + "&filter=" + encodeURIComponent(getSelectionCriteria());
							}
						}
					}
					
					// For Active Subscribers table
					if(SUBSCRIBERS_SELECT_ALL && SUBSCRIBERS_SELECT_ALL == true){
						if($(table).attr('id') == "active-campaign")
							url = url + "&filter=all-active-subscribers";
					}
					
					bulk_delete_operation(url, id_array, index_array, table, undefined, data_array);
				}, undefined, _agile_get_translated_val("bulk-delete", "bulk-delete"));
			}
						
		}	
		else
		{
			// if disabled return
			if($(this).attr('disabled') === "disabled")
				return;
			
			$('body').find(".select-none").html('<div class="alert alert-danger m-t-sm"><a class="close" data-dismiss="alert" href="#">&times;</a>' + _agile_get_translated_val("others", "bulk-delete-no-select") + '</div>').show().delay(3000).hide(1);
		}
			
	});
	
	
	
	/**
	    * Validates the checkbox status of each row in table body
	    * Customizes the delete operation
	    * Deletes the entities
	    */	
		$("body").on("click", "#delete-checked-grid", function(event){
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
					if($(".grid-view").length!=0){
						id_array.push($(element).parent().parent().parent('div').attr('id'));
					}
					else
					id_array.push($(element).closest('div').attr('id'));
					if(Current_Route.indexOf('users')!=-1)
					data_array.push($(element).closest("div.data").parent('div').data().toJSON())
					checked = true;
				}
				
			});
			if(checked){
				
				if(!canRunBulkOperations())
				{
					showModalConfirmation(_agile_get_translated_val("bulk-delete", "bulk-delete"), 
							_agile_get_translated_val("contacts", "no-previlige-to-delete") + "<br/><br/> " + _agile_get_translated_val("deal-view",  "do-you-want-to-proceed"),
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
					showAlertModal("bulk_delete", "confirm", function(){
						// Customize the bulk delete operations
						if(!customize_bulk_delete(id_array, data_array))
							return;
				
						bulk_delete_operation($(table).attr('url'), id_array, index_array, table, true, data_array);
					});
					
				}
				
				
			}	
			else
	            $('body').find(".select-none").html('<div class="alert alert-danger"><a class="close" data-dismiss="alert" href="#">&times;</a>' + _agile_get_translated_val("others", "bulk-delete-no-select") + '</div>').show().delay(3000).hide(1);
				
		});

	$("body").on("click", "#deal-delete-checked", function(event){
		event.preventDefault();
		var id_array = [];
		var index_array = [];
		var data_array = [];
		var checked = false;
		var table = $('body').find('.showCheckboxes');
		var dealsCount = 0;
		$(table).find('tr .tbody_check').each(function(index, element){
			
			// If element is checked store it's id in an array 
			if($(element).is(':checked')){
				// Disables mouseenter once checked for delete(To avoid popover in deals when model is checked)
				$(element).closest('tr').on("mouseenter", false);
				index_array.push(index);
				dealsCount++;
				if(!$(element).closest('tr').hasClass("pseduo-row"))
				{
					id_array.push($(element).closest('tr').data().get('id'));
					data_array.push($(element).closest('tr').data().toJSON());
					checked = true;
				}
			}
		});
		if(checked){
			
			if(!hasScope("DELETE_DEALS"))
			{
				showModalConfirmation(_agile_get_translated_val("bulk-delete", "bulk-delete"), 
						_agile_get_translated_val("deal-view", "persmission-to-delete-deals"), 
						function (){
							return;
						}, 
						function(){
							return;
						},
						function() {
							
						},
						"Cancel", "");
				return;
			}

			if(!hasScope("EDIT_CONTACT"))
			{
				showModalConfirmation(_agile_get_translated_val("bulk-delete", "bulk-delete"), 
						DEALS_CONTACTS_BULK_DELETE_ERROR, 
						function (){
					
					// Customize the bulk delete operations
					if(!customize_bulk_delete(id_array, data_array))
						return;
					
					
					//$(this).after('<img class="bulk-delete-loading" style="padding-right:5px;margin-bottom:15px" src= "'+updateImageS3Path("img/21-0.gif")+'"></img>');
					
					var url = $(table).attr('url');
					if(SELECT_ALL == true)
					{
						if($(table).attr('id') == "contacts-table" || $(table).attr('id') == "companies" ) {
							var dynamic_filter = getDynamicFilters();
							if(dynamic_filter == null) {								
								url = url + "&filter=" + encodeURIComponent(getSelectionCriteria());
							}
						}
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
				showModalConfirmation(_agile_get_translated_val("bulk-delete", "bulk-delete"), 
						_agile_get_translated_val("contact-details", "delete") + " " + dealsCount + " " + _agile_get_translated_val("deal-view", "Deals?"), 
						function (){
							// Customize the bulk delete operations
							if(!customize_bulk_delete(id_array, data_array))
								return;
							
							
							//$(this).after('<img class="bulk-delete-loading" style="padding-right:5px;margin-bottom:15px" src= "'+updateImageS3Path("img/21-0.gif")+'"></img>');
							
							var url = $(table).attr('url');
							if(SELECT_ALL && SELECT_ALL == true)
							{
								if($(table).attr('id') == "contacts-table" || $(table).attr('id') == "companies" ) {
									var dynamic_filter = getDynamicFilters();
									if(dynamic_filter == null) {								
										url = url + "&filter=" + encodeURIComponent(getSelectionCriteria());
									}
								}
							}
							
							bulk_delete_operation(url, id_array, index_array, table, undefined, data_array);
						});
			}
						
		}	
		else
		{
			// if disabled return
			if($(this).attr('disabled') === "disabled")
				return;
			
			$('body').find(".select-none").html('<div class="alert alert-danger m-t-sm"><a class="close" data-dismiss="alert" href="#">&times;</a>' + _agile_get_translated_val("others", "bulk-delete-no-select") + '</div>').show().delay(3000).hide(1);
		}
			
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
			$('body').find(".select-none").html('<div class="alert alert-danger"><a class="close" data-dismiss="alert" href="#">&times;</a>' + _agile_get_translated_val("users", "delete-user-error") + '</div>').show().delay(5000).hide(1);
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
	var count = id_array.length;
	if(!SELECT_ALL)
		json.ids = JSON.stringify(id_array);
	var dynamic_filter = getDynamicFilters();
	if(dynamic_filter != null) {
		json.dynamic_filter = dynamic_filter;
	}
		
	$.ajax({
		url: url,
		type: 'POST',
		data: json,
		contentType : "application/x-www-form-urlencoded",
		success: function() {
			
			if(url=='core/api/tasks/bulk'){
				getDueTasksCount(function(count){
					var due_task_count= count;

					if(due_task_count==0)
						$(".navbar_due_tasks").css("display", "none");
					else
						$(".navbar_due_tasks").css("display", "block");
					if(due_task_count !=0)
						$('#due_tasks_count').html(due_task_count);
					else
						$('#due_tasks_count').html("");
				
				});
				
			}

			if(url=='core/api/dashboards/bulk')
			{
				if(App_Dashboards.dashboards_collection_view && App_Dashboards.dashboards_collection_view.collection)
				{
					$.each(id_array, function(index, id_val){
						App_Dashboards.dashboards_collection_view.collection.remove(id_val);
					});
				}
				if(CURRENT_USER_DASHBOARDS && CURRENT_USER_DASHBOARDS.length > 0)
				{
					$.each(id_array, function(index, id_val){
						$.each(CURRENT_USER_DASHBOARDS, function(index1, val)
						{
							if(id_val == this.id)
							{
								CURRENT_USER_DASHBOARDS.splice(index1, 1);
							}
						});
					});
				}
			}
			
			$(".bulk-delete-loading").remove();	
			if(url=='core/api/users/bulk' && !_billing_restriction.currentLimits.freePlan)
			{
				var message;
				if(count > 1)
				 message = _agile_get_translated_val("users", "deleted-users");
			    else
			     message = _agile_get_translated_val("users", "deleted-user");
				showNotyPopUp('information', message, "top", 10000);
			}
			if(count >= 100 || count == 0)
			{
				if($(table).attr('id') == "contacts-table")
				{
					showNotyPopUp('information', _agile_get_translated_val("contacts", "delete-process-info"), "top", 5000);
					CONTACTS_HARD_RELOAD = true;
				}
				if($(table).attr('id') == "companies"){
					showNotyPopUp('information', _agile_get_translated_val("companies", "delete-process-info"), "top", 5000);
					COMPANIES_HARD_RELOAD = true;
				}
			}
			
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
			
			try{
			if(App_Workflows.workflow_list_view && Current_Route == "workflows")
				{
				for(i=0;i<id_array.length;i++){
				App_Workflows.workflow_list_view.collection.remove(id_array[i]);
				$(App_Workflows.workflow_list_view.el).find(id_array[i]).closest("tr").remove();
				}
			}
			}
			catch(err)
			{}

			$('.thead_check').attr("checked", false);
			
			switch(url){
				case 'core/api/tickets/groups/bulk':{

					if(id_array.length == App_Ticket_Module.groupsCollection.collection.length)
						App_Ticket_Module.ticketGroups();
					break;
				}
				case 'core/api/tickets/canned-messages/bulk':{
					if(id_array.length == App_Ticket_Module.cannedResponseCollection.collection.length)
						App_Ticket_Module.cannedResponses();
					break;
				}
				case 'core/api/tickets/filters/bulk':{

					  if(id_array.length == App_Ticket_Module.ticketFiltersList.collection.length)
						App_Ticket_Module.ticketFilters();

			    	  $.each(id_array, function(index, data){
				      	App_Ticket_Module.ticketFiltersList.collection.remove(data);
				      });

				      if(id_array.indexOf(Ticket_Filter_ID) != -1){
	                      var filterJSON = App_Ticket_Module.ticketFiltersList.collection.at(0).toJSON();
			 			  Ticket_Filter_ID = filterJSON.id;
			 		  }

					break;
				}

				case 'core/api/contacts/delete?action=DELETE':{
					 
			    	  $.each(id_array, function(index, data){
					
					if(Current_Route == "contacts") 
					{
					App_Contacts.contactsListView.collection.remove(data)
					App_Contacts.contactsListView.collection.models[0].attributes.count=App_Contacts.contactsListView.collection.models[0].attributes.count-1;
					}
					else
					{
					App_Companies.companiesListView.collection.remove(data)	
					App_Companies.companiesListView.collection.models[0].attributes.count=App_Companies.companiesListView.collection.models[0].attributes.count-1
		      		}
		      		});
					break;
				}
				
				case 'core/api/tickets/labels/bulk':{
					if(id_array.length == Ticket_Labels.labelsCollection.collection.length)
						App_Ticket_Module.ticketLabels();
					break;
				}
			}	
			
			// Show bulk operations only when thead check box is checked
			toggle_contacts_bulk_actions_dropdown(undefined, true,$('.thead_check').parents('table').attr('id'));
			
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
	if(($(table).attr("id") == "document-list" || $(table).attr("id") == "task-list") && !hasScope("EDIT_CONTACT"))
	{
		return;
	}
	
	// Default message for all tables
	var confirm_msg = _agile_get_translated_val("others", "delete-warn");
	
	// Appends campaign-name for active subscribers
	if($(table).attr('id') === "active-campaign")
		confirm_msg = _agile_get_translated_val("contacts", "delete-contacts-from") +$('#subscribers-campaign-name').text()+" " + _agile_get_translated_val("contact-details", "campaign") + "?";

	// Shows confirm alert, if Cancel clicked, return false
	//if(!confirm(confirm_msg))   //changed 21/6 adi
	//	return false;
	
	// if OK clicked return true
	return true;
	
	
}
