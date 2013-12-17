$(function()
{

	$("#select-all-active-contacts")
			.die()
			.live(
					'click',
					function(e)
					{
						e.preventDefault();
						SUBSCRIBERS_SELECT_ALL = true;
						$('body')
								.find('#subscribers-bulk-select')
								.css('display', 'block')
								.html(
										'Selected All ' + getAvailableActiveContacts() + ' contacts. <a hrer="#" id="select-all-active-contacts-revert" style="cursor:pointer">Select chosen contacts only</a>');

						// On choosing select all option, all the visible
						// checkboxes in the table should be checked
						$.each($('.tbody_check'), function(index, element)
						{
							$(element).attr('checked', "checked");
						});
					});

	$("#select-all-active-contacts-revert")
			.die()
			.live(
					'click',
					function(e)
					{
						e.preventDefault();
						SUBSCRIBERS_SELECT_ALL = false;
						$('body')
								.find('#subscribers-bulk-select')
								.css('display', 'block')
								.html(
										"Selected " + App_Workflows.active_subscribers_collection.collection.length + " contacts. <a href='#'  id='select-all-active-contacts' >Select all " + getAvailableActiveContacts() + " contacts</a>");
					});
});

/**
 * Shows delete button when thead/tbody checkbox is checked.
 * 
 * @param clicked_ele - 
 * 				clicked checkbox element.
 * 
 * @param isBulk -
 * 				true if .thead is checked, otherwise false
 * 
 */
function toggle_active_contacts_bulk_actions_dropdown(clicked_ele, isBulk)
{
	SUBSCRIBERS_SELECT_ALL = false;
	var total_available_contacts;

	if (clicked_ele)
			total_available_contacts = getAvailableActiveContacts();

	$('body').find('#subscribers-bulk-select').css('display', 'none');

	// When checked show Delete button
	if ($(clicked_ele).attr('checked') == 'checked')
	{
		$('body').find('#remove-active-from-campaign').css('display', 'inline-block');

		// To show subscribers-bulk-select only thead is checked i.e., isBulk is true.
		if (isBulk && total_available_contacts != App_Workflows.active_subscribers_collection.collection.length)
			$('body')
					.find('#subscribers-bulk-select')
					.css('display', 'block')
					.html(
							"Selected " + App_Workflows.active_subscribers_collection.collection.length + " contacts. <a id='select-all-active-contacts' href='#'>Select all " + total_available_contacts + " contacts</a>");

	}
	// When unchecked hide Delete button
	else
	{
		// To hide Delete button when .thead is unchecked
		if (isBulk)
		{
			$('#remove-active-from-campaign').css('display', 'none');
			return;
		}

		// Hide delete button when .tbody is unchecked
		var check_count = 0
		$.each($('.tbody_check'), function(index, element)
		{
			if ($(element).is(':checked'))
			{
				check_count++;
				return false;
			}
		});

		if (check_count == 0)
		{
			$('#remove-active-from-campaign').css('display', 'none');
		}
	}
}

/**
 * Returns total active subscribers count.
 **/
function getAvailableActiveContacts()
{

	if (App_Workflows.active_subscribers_collection.collection.toJSON()[0] && App_Workflows.active_subscribers_collection.collection.toJSON()[0].count)
	{
		var current_active_subscribers_count = App_Workflows.active_subscribers_collection.collection.toJSON()[0].count;
		return current_active_subscribers_count;
	}

	return App_Workflows.active_subscribers_collection.collection.toJSON().length;

}

/**
 * Returns subscribers base collection view object for given params.
 * 
 * @param workflow_id - 
 * 				workflow (or campaign) id
 * @param fetch_url -
 * 				rest url to get subscribers
 * 
 * @param template-key - 
 * 				id of subscribers html template
 * 
 **/
function get_campaign_subscribers_collection(workflow_id, fetch_url, template_key)
{
	/* Set the designer JSON. This will be deserialized */
	var workflow_model = App_Workflows.workflow_list_view.collection.get(workflow_id);
	var workflow_name = workflow_model.get("name");

	var subscribers_collection = new Base_Collection_View({ 
		url : fetch_url, 
		templateKey : template_key,
		individual_tag_name : 'tr', 
		cursor : true,
		page_size : 20,
		postRenderCallback : function(el)
		{
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$("time.campaign-started-time", el).timeago();
				$("time.campaign-completed-time", el).timeago();
			});

			$('#subscribers-campaign-name').text(workflow_name);

		},
		appendItemCallback : function(el)
		{
			$("time.campaign-started-time", el).timeago();
			$("time.campaign-completed-time", el).timeago();
		} });

	return subscribers_collection;
}

/**
 * Fills pad-content for all, active, completed and removed 
 * subscribers when empty json obtains.
 * 
 * @param id -
 *          slate div id.
 * @param type - 
 *          to match with SUBSCRIBERS_PAD_CONTENT json key
 **/
function fill_subscribers_slate(id, type)
{
	var SUBSCRIBERS_PAD_CONTENT = {
		    "active-subscribers": {
		        "title": "You do not have any active subscriber currently.",
		        "description": " Active subscribers are the contacts in the added campaign queue.",
		        "image": "/img/clipboard.png"
		    },
		    "completed-subscribers": {
		        "title": "You do not have any completed subscriber currently.",
		        "description": "Completed subscribers are the contacts completed in the added campaign queue.",
		        "image": "/img/clipboard.png"
		    },
		    "removed-subscribers": {
		        "title": "You do not have any removed subscriber currently.",
		        "description": "Removed subscribers are the contacts deleted from the active campaign.",
		        "image": "/img/clipboard.png"
		    },
		    "all-subscribers": {
		        "title": "You do not have any subscriber currently.",
		        "description": "Subscribers are the contacts added to the campaign.",
		        "image": "/img/clipboard.png"
		    }
		}

	$("#" + id).html(getTemplate("empty-collection-model", SUBSCRIBERS_PAD_CONTENT[type]));
}
