$(function()
{

	$('#refresh-active-contacts, #refresh-completed-contacts').die().live('click', function(e)
	{
		e.preventDefault();
		
		if($(this).attr("id") === "refresh-active-contacts")
			App_Workflows.activeContacts($(this).attr("campaign_id"));
		else
			App_Workflows.completedContacts($(this).attr("campaign_id"));
	});
	
	

	$("#select-all-active-contacts")
			.die()
			.live(
					'click',
					function(e)
					{
						e.preventDefault();
						SELECT_ALL = true;
						$('body')
								.find('#bulk-select')
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
						SELECT_ALL = false;
						$('body')
								.find('#bulk-select')
								.css('display', 'block')
								.html(
										"Selected " + App_Workflows.active_contacts_collection.collection.length + " contacts. <a href='#'  id='select-all-active-contacts' >Select all " + getAvailableActiveContacts() + " contacts</a>");
					});
});

function toggle_active_contacts_bulk_actions_dropdown(clicked_ele, isBulk)
{
	SELECT_ALL = false;
	var total_available_contacts;
	if (clicked_ele)
	{
		if ($(clicked_ele).parents('table').attr("campaign-completed"))
			total_available_contacts = getAvailableCompletedContacts();
		else
			total_available_contacts = getAvailableActiveContacts();
	}

	console.log(total_available_contacts);

	$('body').find('#bulk-select').css('display', 'none')
	if ($(clicked_ele).attr('checked') == 'checked')
	{
		$('body').find('#remove-active-from-campaign').removeAttr('disabled');

		if ($(clicked_ele).parents('table').attr("campaign-completed"))
		{
			if (isBulk && total_available_contacts != App_Workflows.completed_contacts_collection.collection.length)
				$('body')
						.find('#bulk-select')
						.css('display', 'block')
						.html(
								"Selected " + App_Workflows.completed_contacts_collection.collection.length + " contacts. <a id='select-all-available-contacts' href='#'>Select all " + total_available_contacts + " contacts</a>");
		}
		else
		{
			if (isBulk && total_available_contacts != App_Workflows.active_contacts_collection.collection.length)
				$('body')
						.find('#bulk-select')
						.css('display', 'block')
						.html(
								"Selected " + App_Workflows.active_contacts_collection.collection.length + " contacts. <a id='select-all-active-contacts' href='#'>Select all " + total_available_contacts + " contacts</a>");
		}
	}
	else
	{
		if (isBulk)
		{
			$('#remove-active-from-campaign').attr('disabled', 'disabled');
			return;
		}

		var check_count = 0
		$.each($('.tbody_check'), function(index, element)
		{
			if ($(element).is(':checked'))
			{
				check_count++;
				return false;
			}
			// return;
		});

		if (check_count == 0)
		{
			$('#remove-active-from-campaign').attr('disabled', 'disabled');
		}
	}
}

function getAvailableActiveContacts()
{
	console.log("Active workflows collection");
	console.log(App_Workflows.active_contacts_collection.collection.toJSON());
	if (App_Workflows.active_contacts_collection.collection.toJSON()[0] && App_Workflows.active_contacts_collection.collection.toJSON()[0].count)
	{
		//
		var current_active_contacts_count = App_Workflows.active_contacts_collection.collection.toJSON()[0].count;
		return current_active_contacts_count;
	}

	return App_Workflows.active_contacts_collection.collection.toJSON().length;

}

function getAvailableCompletedContacts()
{
	if (App_Workflows.completed_contacts_collection.collection.toJSON()[0] && App_Workflows.completed_contacts_collection.collection.toJSON()[0].count)
	{
		//
		var current_completed_contacts_count = App_Workflows.completed_contacts_collection.collection.toJSON()[0].count;
		return current_completed_contacts_count;
	}

	return App_Workflows.completed_contacts_collection.collection.toJSON().length;
}
