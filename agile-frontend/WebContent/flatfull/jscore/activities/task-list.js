/**
 * To show the dates or time in words of time-ago plugin.
 * @param element
 */
function includeTimeAgo(element){
	agileTimeAgoWithLngConversion($("time", element));
}

/**
 * To fill the tasklist ordered by default 
 */
function initOwnerslist() {
	
	// Click events to agents dropdown and department
	$("body").on("click", 'ul#owner-tasks li a, ul#type-tasks li a', function(e) {
				e.preventDefault();

				// Show selected name
				var name = $(this).html(), id = $(this).attr("href");

				$(this).closest("ul").data("selected_item", id);
				$(this).closest(".btn-group").find(".selected_name")
						.text(name);
				var url = getParams();
				updateData(url);
				
	});
	$("body").on("click", 'ul#owner-tasks li a', function(e) {
		
		$('.task-heading').html($(this).html() +'&nbsp<small class="tasks-count"></small> <span style="font-size: small;color: #525252;  background-color: rgb(255,255,204);  border: 1px solid rgb(211,211,211);border-radius: 3px;padding: 3px 5px 3px 5px;">Try our <a href="#tasks-new">new look</a></span>');
		//$('.task-heading').text($(this).html());
		pieTasks(getParams()); // Show tasks only when user changes My Tasks vs All Tasks
	});
	updateData(getParams() + "&owner=" + CURRENT_DOMAIN_USER.id + "&pending=" + true);
	pieTasks(getParams() + "&owner=" + CURRENT_DOMAIN_USER.id + "&pending=" + true);
}

var allTasksListView;

/**
 * updateData() method updates chat sessions on page for different query's from
 * user
 * 
 * @param params
 *            query string contains date, agentId & widgetId
 */
function updateData(params) {
	
	// Shows loading image untill data gets ready for displaying
	$('#task-list-based-condition').html(LOADING_HTML);
	
	// Creates backbone collection view
		this.App_Calendar.allTasksListView = new Base_Collection_View({
		url : '/core/api/tasks/based' + params,
		restKey : "task",
		sort_collection : false,
		templateKey : "tasks-list",
		cursor : true, page_size : 25,
		individual_tag_name : 'tr',
		postRenderCallback : function(el) {
			$('.tasks-count').html(getCount(this.App_Calendar.allTasksListView.collection.toJSON()));

			$('.tasks-count').attr('data', getTaskCount(this.App_Calendar.allTasksListView.collection.toJSON()));
			includeTimeAgo(el);
			showContactImages(this.App_Calendar.allTasksListView.collection.toJSON());
		},
		appendItemCallback : function(el)
		{
			includeTimeAgo(el);
			showContactImages(this.App_Calendar.allTasksListView.collection.toJSON());
		}

	});

	// Fetches data from server
	this.App_Calendar.allTasksListView.collection.fetch();
	// Renders data to tasks list page.
	$('#task-list-based-condition').html(this.App_Calendar.allTasksListView.render().el);
	
}

/**
 * getParams() method returns a string(used as query param string) contains user
 * selected type and owners
 * 
 * @returns {String} query string
 */
function getParams() {

	var params = "?";

	// Get task type and append it to params
	var type = $('#type-tasks').data("selected_item");
	if (type)
		params += ("&type=" + type);
	// Get owner name and append it to params
	var owner = $('#owner-tasks').data("selected_item");
	if(owner == 'my-pending-tasks')
	{
		params += ("&pending=" + true);
		params += ("&owner=" + CURRENT_DOMAIN_USER.id);
		return params;
	}
	if (owner)
		params += ("&owner=" + owner);
	else if(owner == undefined)
		params += ("&owner=" + CURRENT_DOMAIN_USER.id);
	
	return params;
}

/**
 * Completes the selected row related entities from the database based on the url 
 * attribute of the table and fades out the rows from the table
 * 
 * @module Bulk operation for completed task
 * ---------------------------------------------
 * 
 */

$(function(){	
   /**
    * Validates the checkbox status of each row in table body
    * Customizes the delete operation
    * Deletes the entities
    */	
	$("body").on("click", '#bulk-complete', function(event) {
		event.preventDefault();
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
				data_array.push($(element).closest('tr').data().toJSON());
				checked = true;
			}
		});
		if(checked){
			$(this).after('<img class="bulk-complete-loading" style="padding-right:5px;margin-bottom:15px" src= "'+updateImageS3Path("img/21-0.gif")+'"></img>');
			bulk_complete_operation('/core/api/tasks/bulk/complete', index_array, table, data_array);
		}	
		else
            $('body').find(".select-none").html('<div class="alert alert-danger"><a class="close" data-dismiss="alert" href="#">&times;</a>'+_agile_get_translated_val('bulk-actions','no-tasks-delete')+'</div>').show().delay(3000).hide(1);
	
		getDueTasksCount(function(count){

			var due_task_count= count;
			if(due_task_count != 0)
				$('#due_tasks_count').html(due_task_count);
			else
				$('#due_tasks_count').html("");
		});
		
	});
	
});

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
function bulk_complete_operation(url, index_array, table, data_array){
	
	var tasks = [];
	$.each(data_array, function(index, task){
		var contacts = task.taskContacts;
		task.contacts = [];
		$.each(contacts, function(i, contact){
			task.contacts.push(contact.id);
			tasks.push(task);
		});
		task.is_complete = true;
		task.owner_id = task.taskOwner.id;
	});
	$.ajax({
		url: url,
		type: 'POST',
		data: JSON.stringify(tasks),
		contentType : 'application/json',
		success: function() {
			$(".bulk-complete-loading").remove();
			
			var tbody = $(table).find('tbody');
			// To remove table rows on delete 
			for(var i = 0; i < index_array.length; i++) 
				$(tbody).find('tr:eq(' + index_array[i] + ')').find("div:lt(3)").css("text-decoration","line-through");
		}
	});
}

function showContactImages(collection){
	////url = "core/api/tasks/getContactsList"
	var referenceContactIds = [];
	for(var i=0;i<collection.length;i++){
		for(var j=0;j<collection[i].contacts.length;j++){
			referenceContactIds.push(collection[i].contacts[j].id);
		}
	}
	var contactid = [];
	$.ajax({ url : "/core/api/contacts/taskreferences",method:"POST",data:JSON.stringify(referenceContactIds),dataType:"json",success : function(data)
			{
				$.each(data, function(j, item) {
					if(jQuery.inArray(item.id,contactid) == -1){
						contactid.push(item.id);
						for(var k=0;k<(item.properties).length;k++){
							if(item.properties[k].name == "image"){
		    					$(".img"+item.id).attr("src", item.properties[k].value);
		    				}
						}
					};
					
    			});
			} 
		});
}
		