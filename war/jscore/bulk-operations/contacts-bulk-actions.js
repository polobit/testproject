/**
 * Performs operations like changing owner, adding tags and etc.. on contacts
 * bulk
 * 
 * @module Bulk operations
 * 
 * author: Rammohan
 */
var _BULK_CONTACTS = undefined;
var current_view_contacts_count = 0;
var SELECT_ALL = false;
$(function()
{

	/**
	 * Bulk operations - Change owner Shows all the users as drop down list to
	 * select one of them as the owner for the selected contacts.
	 */
	$("#bulk-owner").live('click', function(e)
	{
		e.preventDefault();

		var filter, id_array = [];
		if (SELECT_ALL == true)
			filter = getSelectionCriteria();
		else
			id_array = get_contacts_bulk_ids();

		// Bind a custom event to trigger on loading the form
		$('body').die('fill_owners').live('fill_owners', function(event)
		{
			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
			fillSelect('ownerBulkSelect', '/core/api/users', 'domainUsers', 'no-callback ', optionsTemplate);
		});

		// Navigate to show form
		Backbone.history.navigate("bulk-owner", { trigger : true });

		/**
		 * Changes the owner by sending the new owner name as path parameter and
		 * contact ids as form data of post request
		 */
		$('#changeOwnerToBulk').die().live('click', function(e)
		{
			e.preventDefault();

			var $form = $('#ownerBulkForm');

			// Button Disabled or Validate Form failed
			if ($(this).attr('disabled')=='disabled' || !isValidForm($form))
			{
				return;
			}
			
			var saveButton=$(this);
			
			disable_save_button(saveButton);
			// Show loading symbol until model get saved
			//$('#ownerBulkForm').find('span.save-status').html(LOADING_HTML);

			var url;

			var new_owner = $('#ownerBulkSelect option:selected').attr('value');
			url = '/core/api/bulk/update?action_type=CHANGE_OWNER&owner=' + new_owner;
			var json = {};
			json.contact_ids = id_array;
			postBulkOperationData(url, json, $form, undefined, function(data){
				enable_save_button(saveButton);
			})
		});
	});

	/**
	 * Bulk operations - Adds to campaign Shows all the workflows as drop down
	 * list to select one of them to subscribe the selected contacts
	 */
	$("#bulk-campaigns").live('click', function(e)
	{
		e.preventDefault();

		var id_array = [];
		var filter;
		if (SELECT_ALL == true)
			filter = getSelectionCriteria();
		else
			id_array = get_contacts_bulk_ids();

		console.log(filter);

		$('body').die('fill_campaigns').live('fill_campaigns', function(event)
		{
			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
			fillSelect('campaignBulkSelect', '/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate);
		});

		// Navigate to show form
		Backbone.history.navigate("bulk-campaigns", { trigger : true });

		/**
		 * Subscribes the selected contacts to a campaign by sending the
		 * workflow id and selected contacts' ids.
		 */
		$('#addBulkTocampaign').die().live('click', function(e)
		{
			e.preventDefault();

			var $form = $('#campaignsBulkForm');

			// Button Disabled or Validate Form Failed
			if ($(this).attr('disabled')=='disabled' || !isValidForm($form))
			{
				return;
			}
			
			var saveButton=$(this);

			disable_save_button(saveButton);
			// Show loading symbol until model get saved
			//$('#campaignsBulkForm').find('span.save-status').html(LOADING_HTML);

			var workflow_id = $('#campaignBulkSelect option:selected').attr('value');
			var url = '/core/api/bulk/update?workflow_id=' + workflow_id + "&action_type=ASIGN_WORKFLOW";

			var json = {};
			json.contact_ids = id_array;
			postBulkOperationData(url, json, $form,undefined,function(data){
				enable_save_button(saveButton);
			});
		});

	});

	/**
	 * Bulk operations - Adds tags' Shows the existing tags with help of
	 * typeahead to add tags to the selected contacts. Also we can add new tags.
	 */
	$("#bulk-tags").live('click', function(e)
	{
		e.preventDefault();

		var id_array = get_contacts_bulk_ids();

		// var tags = get_tags('tagsBulkForm');

		Backbone.history.navigate("bulk-tags", { trigger : true });

		setup_tags_typeahead();
		
		/**
		 * Add the tags to the selected contacts by sending the contact ids and
		 * tags through post request to the appropriate url
		 */
		$('#addTagsToContactsBulk').die().live('click', function(e)
		{
			e.preventDefault();

			var tags = get_tags('tagsBulkForm');

			if (tags[0].value.length > 0)
			{
				// Show loading symbol until model get saved
				var saveButton=$(this);

				disable_save_button(saveButton);
				
				//$('#tagsBulkForm').find('span.save-status').html(LOADING_HTML);

				var url = '/core/api/bulk/update?action_type=ADD_TAG';
				var json = {};
				json.data = JSON.stringify(tags[0].value);
				json.contact_ids = id_array;

				postBulkOperationData(url, json, $('#tagsBulkForm'), undefined, function(data)
				{
					enable_save_button(saveButton);
					// Add the added tags to the collection of tags
					$.each(tags[0].value, function(index, tag)
					{
						tagsCollection.add({ "tag" : tag });
					});
					// On save back to contacts list
					Backbone.history.navigate("contacts", { trigger : true });
				});
			}
			else 
			{
				$('#addBulkTags').focus();
				$('.error-tags').show().delay(3000).hide(1);
				return;
			}
		});
	});


	/**
	 * Bulk operations - Send email Sends email to the bulk of contacts by
	 * filling up the send email details like email from address, subject and
	 * body by selecting a template.
	 */
	$("#bulk-email").live('click', function(e)
	{
		e.preventDefault();

		var email_array = [];

		var table = $('body').find('table.showCheckboxes');

		$(table).find('tr .tbody_check').each(function(index, element)
		{

			// If element is checked add store it's id in an array
			if ($(element).is(':checked'))
			{
				var json = $(element).closest('tr').data().toJSON();
				email_array.push(getPropertyValue(json.properties, "email"));
			}
		});

		$('body').live('fill_emails', function(event)
		{

			// Populate from address and templates
			populate_send_email_details();

			$("#emailForm").find('input[name="to"]').val(email_array);

		});

		Backbone.history.navigate("bulk-email", { trigger : true });
	});

	$("#select-all-available-contacts").die().live('click', function(e)
	{
				e.preventDefault();
				SELECT_ALL = true;
				_BULK_CONTACTS = window.location.hash;
				$('body')
						.find('#bulk-select')
						.css('display', 'block')
						.html(
								'Selected All ' + getAvailableContacts() + ' contacts. <a hrer="#" id="select-all-revert" style="cursor:pointer">Select chosen contacts only</a>');

				// On choosing select all option, all the visible
				// checkboxes in the table should be checked
				$.each($('.tbody_check'), function(index, element)
				{
					$(element).attr('checked', "checked");
				});
	});

	$("#select-all-revert").die().live('click', function(e)
	{
						e.preventDefault();
						SELECT_ALL = false;
						_BULK_CONTACTS = undefined;

						$('body').find('#bulk-select').css('display', 'block').html(
										"Selected " + App_Contacts.contactsListView.collection.length + " contacts. <a href='#'  id='select-all-available-contacts' >Select all " + getAvailableContacts() + " contacts</a>");
	});
	
});

/**
 * Gets an array of contact ids to perform bulk operations
 * 
 * @method get_contacts_bulk_ids
 * @returns {Array} id_array of contact ids
 */
function get_contacts_bulk_ids()
{
	var id_array = [];
	if (SELECT_ALL == true)
		return id_array;

	var table = $('body').find('.showCheckboxes');

	if ($(".grid-view").length != 0)
	{
		$(table).find('.tbody_check').each(function(index, element)
		{
			// If element is checked add store it's id in an array
			if ($(element).is(':checked'))
			{
				id_array.push($(element).parent('div').attr('id'));
			}
		});

		return id_array;
	}

	$(table).find('tr .tbody_check').each(function(index, element)
	{

		// If element is checked add store it's id in an array
		if ($(element).is(':checked'))
		{
			id_array.push($(element).closest('tr').data().get('id'));
		}
	});
	return id_array;
}

/**
 * Shows bulk actions drop down menu (of contacts table) only when any of the
 * check box is enabled.
 * 
 * @method toggle_contacts_bulk_actions_dropdown
 * @param {Object}
 *            clicked_ele clicked check-box element
 */
function toggle_contacts_bulk_actions_dropdown(clicked_ele, isBulk)
{
	SELECT_ALL = false;
	_BULK_CONTACTS = undefined;
	var total_available_contacts = getAvailableContacts();

	console.log(readCookie('contact_filter'));
	$('body').find('#bulk-select').css('display', 'none')
	if ($(clicked_ele).attr('checked') == 'checked')
	{
		$('body').find('#bulk-actions').css('display', 'block');

		if (isBulk && total_available_contacts != App_Contacts.contactsListView.collection.length)
			$('body')
					.find('#bulk-select')
					.css('display', 'block')
					.html(
							"Selected " + App_Contacts.contactsListView.collection.length + " contacts. <a id='select-all-available-contacts' href='#'>Select all " + total_available_contacts + " contacts</a>");
	}
	else
	{
		if (isBulk)
		{
			$('#bulk-actions').css('display', 'none');
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
			$('#bulk-actions').css('display', 'none');
		}
	}
}

/**
 * Returns number of available contacts, which is read from count field in first
 * contact in the collection. If count variable in not available in first
 * contact then collection length is returned
 * 
 * @returns
 */
function getAvailableContacts()
{
	if (App_Contacts.contactsListView.collection.toJSON()[0] && App_Contacts.contactsListView.collection.toJSON()[0].count)
	{
		//
		current_view_contacts_count = App_Contacts.contactsListView.collection.toJSON()[0].count;
		return current_view_contacts_count;
	}

	return App_Contacts.contactsListView.collection.toJSON().length;
}

/**
 * Returns selection criteria. Reads filter cookie, if filter cookie is not
 * available, it returns window hash(to check whether tag filter is applied on
 * it)
 * 
 * @returns
 */
function getSelectionCriteria()
{
	// Reads filter cookie
	var filter_id = readCookie('contact_filter');

	if (filter_id)
	{
		return filter_id;
	}
	// If filter cookie is not available then it returns either '#contacts' of
	// '#tags/{tag}' according to current window hash
	if (_BULK_CONTACTS)
	{
		return _BULK_CONTACTS;
	}
}

/**
 * Posts filter id. It takes url to post, the data 
 * @param url
 * @param data
 * @param form
 * @param contentType
 * @param callback
 */
function postBulkOperationData(url, data, form, contentType, callback)
{

	// 
	if (data.contact_ids && data.contact_ids.length == 0)
	{
		console.log(data.contact_ids);
		console.log(getSelectionCriteria());
		url = url + "&filter=" + encodeURIComponent(getSelectionCriteria());
		console.log(url);
	}
	else
		data.contact_ids = JSON.stringify(data.contact_ids);

	contentType = contentType != undefined ? contentType : "application/x-www-form-urlencoded"

	// Ajax request to post data
	$.ajax({ url : url, type : 'POST', data : data, contentType : contentType, success : function(data)
	{

		$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Task Scheduled.</i></p></small></div>');

		var save_msg=$(form).find('.form-actions');
		
		if(save_msg.find('.text-success'))
			save_msg.find('.text-success').parent().parent().remove(); // erase previous message.

		save_msg.append($save_info);

		if (callback && typeof (callback) === "function")
			callback(data);

		/*
		 * setInterval(function(){ Backbone.history.navigate("contacts", {
		 * trigger: true }); },2000);
		 */
	} });
}
