$(function()
{
    $('#content').on('click', '#select-all-active-contacts', function(e)
	{
						e.preventDefault();
						SUBSCRIBERS_SELECT_ALL = true;
						$('#content')
								.find('#subscribers-bulk-select')
								.css('display', 'block')
								.html(
										'Selected All ' + getAvailableActiveContacts() + ' contacts. <a hrer="#" id="select-all-active-contacts-revert" class="text-info">Select chosen contacts only</a>');

						// On choosing select all option, all the visible
						// checkboxes in the table should be checked
						$.each($('.tbody_check'), function(index, element)
						{
							$(element).attr('checked', "checked");
						});
					});

    $('#content').on('click', '#select-all-active-contacts-revert', function(e)
					{
						e.preventDefault();
						SUBSCRIBERS_SELECT_ALL = false;
						$('#content')
								.find('#subscribers-bulk-select')
								.css('display', 'block')
								.html(
										"Selected " + App_Workflows.active_subscribers_collection.collection.length + " contacts. <a href='#' id='select-all-active-contacts' class='text-info'>Select all " + getAvailableActiveContacts() + " contacts</a>");
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

	$('#content').find('#subscribers-bulk-select').css('display', 'none');

	// When checked show Delete button
	if ($(clicked_ele).is(':checked'))
	{
		$('#content').find('#subscribers-block').css('display', 'block');
		
		$('#subscribers-block').find('#remove-active-from-campaign').css('display', 'inline-block');

		// To show subscribers-bulk-select only thead is checked i.e., isBulk is true.
		if (isBulk && total_available_contacts != App_Workflows.active_subscribers_collection.collection.length)
		$('#subscribers-block')
					.find('#subscribers-bulk-select')
					.css('display', 'block')
					.html(
							"Selected " + App_Workflows.active_subscribers_collection.collection.length + " contacts. <a id='select-all-active-contacts' class='text-info' href='#'>Select all " + total_available_contacts + " contacts</a>");

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
	//var workflow_model = App_Workflows.workflow_list_view.collection.get(workflow_id);
	//var workflow_name = workflow_model.get("name");

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
				contactListener();
			});

			//$('#subscribers-campaign-name').text(workflow_name);

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
		        "title": "Campaign does not have any active subscriber",
		        "description": "You can add subscribers from Contacts tab - using the Bulk Actions option",
		        "button_text" : "Add subscribers",
				"route" : "#contacts",
		        "image": updateImageS3Path("/img/clipboard.png")
		    },
		    "completed-subscribers": {
		        "title": "No contact assigned to this campaign",
		        "description": "You can add subscribers from Contacts tab - using the Bulk Actions option",
		        "button_text" : "Add subscribers",
				"route" : "#contacts",
		        "image": updateImageS3Path("/img/clipboard.png")
		    },
		    "removed-subscribers": {
		        "title": "No contact removed from this campaign",
		        "description": "Removed subscribers are the contacts deleted from the active campaign",
		        "image": updateImageS3Path("/img/clipboard.png")
		    },
		    "all-subscribers": {
		        "title": "No current or past subscribers for this campaign",
		        "description": "You can add subscribers from Contacts tab - using the Bulk Actions option",
		        "button_text" : "Add subscribers",
				"route" : "#contacts",
				"image": updateImageS3Path("/img/clipboard.png")
		    },
		    "unsubscribe-subscribers": {
		    	"title": "No unsubscriptions for this campaign",
		        "description": "Great! No one unsubscribed from this campaign",
				"image": updateImageS3Path("/img/clipboard.png")
		    },
		    "hardbounced-subscribers": {
		    	"title": "No hard bounces for this campaign",
		        "description": "Great! No email get hardbounced",
				"image": updateImageS3Path("/img/clipboard.png")
		    },
		    "softbounced-subscribers": {
		    	"title": "No soft bounces for this campaign",
		        "description": "Great! No email get softbounced",
				"image": updateImageS3Path("/img/clipboard.png")
		    },
		    "spam-reported-subscribers": {
		    	"title": "No one reported spam for this campaign",
		        "description": "Great! No one reported spam yet",
				"image": updateImageS3Path("/img/clipboard.png")
		    }
		}

	
	getTemplate("empty-collection-model", SUBSCRIBERS_PAD_CONTENT[type], undefined, function(template_ui){
		if(!template_ui)
			  return;

		$("#" + id).html($(template_ui));
	}, "#" + id);

}
