
function initOwnerslist() {

	// Click events to agents dropdown and department
	$("ul#owner-tasks li a, ul#type-tasks li a").die()
			.live(
					"click",
					function(e) {
						e.preventDefault();

						// Show selected name
						var name = $(this).html(), id = $(this).attr("href");

						$(this).closest("ul").data("selected_item", id);
						$(this).closest(".btn-group").find(".selected_name")
								.text(name);

						updateData(getParams());
					});
	updateData(getParams());
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
	allTasksListView = new Base_Collection_View({
		url : '/core/api/tasks/based' + params,
		restKey : "task",
		templateKey : "tasks-list",
		individual_tag_name : 'tr',
		postRenderCallback : function(el) {
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
				$(".task-due-time", el).timeago();
			});
		}

	});

	// Fetches data from server
	allTasksListView.collection.fetch();

	// Renders data to chat transcript page.
	$('#task-list-based-condition').html(allTasksListView.render().el);

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
	if (owner)
		params += ("&owner=" + owner);
	return params;
}

/**
 * Deletes the selected row related entities from the database based on the url 
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
	$('#bulk-complete').live('click', function(event){
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
				id_array.push($(element).closest('tr').data().get('id'));
				data_array.push($(element).closest('tr').data().toJSON());
				checked = true;
			}
		});
		if(checked){
			
			// Customize the bulk complete task operations
			if(!customize_bulk_complete(id_array, data_array))
				return;
			
			bulk_complete_operation($(table).attr('url'), id_array, index_array, table, true, data_array);
		}	
		else
            $('body').find(".select-none").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">×</a>You have not selected any records to complete. Please select at least one record to continue.</div>').show().delay(3000).hide(1);
		
	});
	
});
		