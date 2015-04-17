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
	$("#bulk-owner")
			.live(
					'click',
					function(e)
					{
						e.preventDefault();

						if (!canRunBulkOperations())
						{
							showModalConfirmation(
									"Bulk Change Owner",
									"You may not have permission to update some of the contacts selected. " + "Proceeding with this operation will change the owner for only the contacts " + "you are allowed to update.<br/><br/> Do you want to proceed?",
									show_bulk_owner_change_page, function()
									{
										// No callback
										return;
									}, function()
									{

									});
						}
						else
						{
							show_bulk_owner_change_page();
						}

					});

	function show_bulk_owner_change_page()
	{
		var filter, id_array = [];
		if (SELECT_ALL == true)
			filter = getSelectionCriteria();
		else
			id_array = get_contacts_bulk_ids();

		// Yes callback
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
			if ($(this).attr('disabled') == 'disabled' || !isValidForm($form))
			{
				return;
			}

			var saveButton = $(this);

			disable_save_button(saveButton);
			// Show loading symbol until model get saved
			// $('#ownerBulkForm').find('span.save-status').html(getRandomLoadingImg());

			var url;

			var new_owner = $('#ownerBulkSelect option:selected').attr('value');
			url = '/core/api/bulk/update?action_type=CHANGE_OWNER&owner=' + new_owner;
			var json = {};
			json.contact_ids = id_array;
			postBulkOperationData(url, json, $form, undefined, function(data)
			{
				enable_save_button(saveButton);
			}, 'Contacts owner change scheduled')
		});

	}

	/**
	 * Bulk operations - Adds to campaign Shows all the workflows as drop down
	 * list to select one of them to subscribe the selected contacts
	 */
	$("#bulk-campaigns")
			.live(
					'click',
					function(e)
					{
						e.preventDefault();

						// Selected Contact ids
						var id_array = get_contacts_bulk_ids();

						// when SELECT_ALL is true i.e., all contacts are
						// selected.
						if (id_array.length === 0)
							count = getAvailableContacts();
						else
							count = id_array.length;

						var continueAction = true;
						if (!canRunBulkOperations())
						{
							continueAction = false;
							showModalConfirmation(
									"Bulk Assign Campaign",
									"You may not have permission to update some of the contacts selected. Proceeding with this operation will add only your contacts to the campaign.<br/><br/>Do you want to proceed?",
									show_bulk_campaign_assign_page, function()
									{
										// No callback
									}, function()
									{
										return;
									});
						}
						if (is_free_plan() && has_more_than_limit())
						{
							continueAction = false;
							showModalConfirmation(
									"Add to Campaign",
									"You can apply this bulk action only on 25 contacts in the FREE Plan. Please choose lesser number of contacts or upgrade your account.",
									function()
									{
										Backbone.history.navigate("subscribe", { trigger : true });
									}, function()
									{
										// No callback
										return;
									}, function()
									{
										return;
									}, "Upgrade", "Close");
						}
						if (!canSendEmails(count))
						{
							continueAction = false;
							var pendingEmails = getPendingEmails();

							var yes = "Yes";
							var no = "No"

							var message = "";
							var upgrade_link = ' You may <a href="#subscribe" class="action" data-dismiss="modal" subscribe="subscribe" action="deny">purchase more emails </a> if this does not suffice your bulk action.';
							var title = "Low on emails"
							if (pendingEmails <= 0)
							{
								title = "Low on emails";
								yes = "";
								no = "Ok"
								message = "You have used up all emails in your quota. " + upgrade_link;
							}
							else
								message = "You have only " + pendingEmails + " emails left as per your quota. " + upgrade_link + " Continuing with this operation will stop sending emails once it crosses the quota.<br/><br/>" + "Do you want to proceed?";

							showModalConfirmation(title, message, show_bulk_campaign_assign_page, function(element)
							{

								// No callback
								if (!element)
									return;

								if ($(element).attr('subscribe'))
									Backbone.history.navigate("subscribe", { trigger : true });
								return;
							}, function(element)
							{
							}, yes, no);
							return;
						}
						else if (continueAction)
						{
							show_bulk_campaign_assign_page()
						}

					});

	function show_bulk_campaign_assign_page()
	{
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
			if ($(this).attr('disabled') == 'disabled' || !isValidForm($form))
			{
				return;
			}

			var saveButton = $(this);

			disable_save_button(saveButton);
			// Show loading symbol until model get saved
			// $('#campaignsBulkForm').find('span.save-status').html(getRandomLoadingImg());

			var workflow_id = $('#campaignBulkSelect option:selected').attr('value');
			var url = '/core/api/bulk/update?workflow_id=' + workflow_id + "&action_type=ASIGN_WORKFLOW";

			var json = {};
			json.contact_ids = id_array;
			postBulkOperationData(url, json, $form, undefined, function(data)
			{
				enable_save_button(saveButton);
			}, 'Campaign assigning scheduled');
		});
	}

	/**
	 * Bulk operations - Adds tags' Shows the existing tags with help of
	 * typeahead to add tags to the selected contacts. Also we can add new tags.
	 */
	$("#bulk-tags")
			.live(
					'click',
					function(e)
					{
						e.preventDefault();

						if (!canRunBulkOperations())
						{
							showModalConfirmation(
									"Bulk Add Tag",
									"You may not have permission to update some of the contacts selected. Proceeding with this operation will add tag to only the contacts you are allowed to update.<br/><br/> Do you want to proceed?",

									show_add_tag_bulkaction_form, function()
									{
										// No callback
										return;
									}, function()
									{
										return;
									});
						}
						else
						{
							show_add_tag_bulkaction_form()
						}
					});

	function show_add_tag_bulkaction_form()
	{
		var id_array = get_contacts_bulk_ids();

		// var tags = get_tags('tagsBulkForm');

		Backbone.history.navigate("bulk-tags", { trigger : true });

		setup_tags_typeahead();

		$('#addBulkTags')
				.on(
						"focusout",
						function(e)
						{
							e.preventDefault();
							var tag_input = $(this).val().trim();
							$(this).val("");
							if (tag_input && tag_input.length >= 0 && !(/^\s*$/).test(tag_input))
							{
								$('#addBulkTags')
										.closest(".control-group")
										.find('ul.tags')
										.append(
												'<li class="tag" style="display: inline-block;" data="' + tag_input + '">' + tag_input + '<a class="close" id="remove_tag" tag="' + tag_input + '">&times</a></li>');
							}

						});
		/**
		 * Add the tags to the selected contacts by sending the contact ids and
		 * tags through post request to the appropriate url
		 */
		$('#addTagsToContactsBulk').die().live('click', function(e)
		{
			e.preventDefault();

			var tags = get_tags('tagsBulkForm');

			// To add input field value as tags
			var tag_input = $('#addBulkTags').val().trim();
			$('#addBulkTags').val("");
			
			if(tag_input && tag_input.length>=0 && !(/^\s*$/).test(tag_input))
			{
				$('#addBulkTags').closest(".control-group").find('ul.tags').append('<li class="tag" style="display: inline-block;" data="'+tag_input+'">'+tag_input+'<a class="close" id="remove_tag" tag="'+tag_input+'">&times</a></li>');
			}
			
		//	$('#addBulkTags').closest(".control-group").find('ul.tags').append('<li class="tag" style="display: inline-block;" data="'+tag_input+'">'+tag_input+'<a class="close" id="remove_tag" tag="'+tag_input+'">&times</a></li>');
			
			
			
			if(tag_input != "")
				tags[0].value.push(tag_input);

			if (tags[0].value.length > 0)
			{
				var tags_valid = true;
				$.each(tags[0].value, function(index, value)
					{
						if(!isValidTag(value, false)) {
							tags_valid = false;
							return false;
						}
					});
				if(!tags_valid) {
					$('.invalid-tags').show().delay(6000).hide(1);
					return false;
				}
				// Show loading symbol until model get saved
				var saveButton=$(this);

				disable_save_button(saveButton);
				
				//$('#tagsBulkForm').find('span.save-status').html(getRandomLoadingImg());

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
				}, 'Tags add scheduled');
			}
			else 
			{
				$('#addBulkTags').focus();
				$('.error-tags').show().delay(3000).hide(1);
				return;
			}
		});
	}

	/**
	 * Bulk operations - Adds tags' Shows the existing tags with help of
	 * typeahead to add tags to the selected contacts. Also we can add new tags.
	 */
	$("#bulk-tags-remove")
			.live(
					'click',
					function(e)
					{
						e.preventDefault();

						if (!canRunBulkOperations())
						{
							showModalConfirmation(
									"Bulk Remove Tag",
									"You may not have permission to update some of the contacts selected. Proceeding with this operation will delete tag to only the contacts you are allowed to update.<br/><br/> Do you want to proceed?",

									show_remove_tag_bulkaction_form, function()
									{
										// No callback
										return;
									}, function()
									{
										return;
									});
						}
						else
						{
							show_remove_tag_bulkaction_form()
						}

					});

	function show_remove_tag_bulkaction_form()
	{
		var id_array = get_contacts_bulk_ids();

		// var tags = get_tags('tagsBulkForm');

		Backbone.history.navigate("bulk-tags-remove", { trigger : true });

		setup_tags_typeahead();

		$('#removeBulkTags')
				.on(
						"focusout",
						function(e)
						{
							e.preventDefault();
							var tag_input = $(this).val().trim();
							$(this).val("");
							if (tag_input && tag_input.length >= 0 && !(/^\s*$/).test(tag_input))
							{
								$(this)
										.closest(".control-group")
										.find('ul.tags')
										.append(
												'<li class="tag" style="display: inline-block;" data="' + tag_input + '">' + tag_input + '<a class="close" id="remove_tag" tag="' + tag_input + '">&times</a></li>');
							}

						});
		/**
		 * Add the tags to the selected contacts by sending the contact ids and
		 * tags through post request to the appropriate url
		 */
		$('#removeTagsToContactsBulk')
				.die()
				.live(
						'click',
						function(e)
						{
							e.preventDefault();

							var tags = get_tags('tagsRemoveBulkForm');

							// To add input field value as tags
							var tag_input = $('#removeBulkTags').val().trim();
							$('#removeBulkTags').val("");

							if (tag_input && tag_input.length >= 0 && !(/^\s*$/).test(tag_input))
							{
								$('#removeBulkTags')
										.closest(".control-group")
										.find('ul.tags')
										.append(
												'<li class="tag" style="display: inline-block;" data="' + tag_input + '">' + tag_input + '<a class="close" id="remove_tag" tag="' + tag_input + '">&times</a></li>');
							}

							// $('#addBulkTags').closest(".control-group").find('ul.tags').append('<li
							// class="tag" style="display: inline-block;"
							// data="'+tag_input+'">'+tag_input+'<a
							// class="close" id="remove_tag"
							// tag="'+tag_input+'">&times</a></li>');

							if (tag_input != "")
								tags[0].value.push(tag_input);

							if (tags[0].value.length > 0)
							{
								// Show loading symbol until model get saved
								var saveButton = $(this);

								disable_save_button(saveButton);

								// $('#tagsBulkForm').find('span.save-status').html(getRandomLoadingImg());

								var url = '/core/api/bulk/update?action_type=REMOVE_TAG';
								var json = {};
								json.data = JSON.stringify(tags[0].value);
								json.contact_ids = id_array;

								postBulkOperationData(url, json, $('#tagsRemoveBulkForm'), undefined, function(data)
								{
									enable_save_button(saveButton);
									// Add the added tags to the collection of
									// tags
									$.each(tags[0].value, function(index, tag)
									{
										tagsCollection.add({ "tag" : tag });
									});
								}, 'Tags delete scheduled');
							}
							else
							{
								$('#removeBulkTags').focus();
								$('.error-tags').show().delay(3000).hide(1);
								return;
							}
						});
	}

	/**
	 * Bulk operations - Sends email to the bulk of contacts by filling up the
	 * send email details like from, subject and body.
	 */
	$("#bulk-email")
			.live(
					'click',
					function(e)
					{
						e.preventDefault();

						if (!canRunBulkOperations())
						{
							showModalConfirmation(
									"Bulk Email",
									"You may not be the owner for some of the contacts selected. Proceeding with this operation will send email to only your contacts.<br/><br/> Do you want to proceed?",

									show_bulk_email_form, function()
									{
										// No callback
										return;
									}, function()
									{
										return;
									});
						}
						if (is_free_plan() && has_more_than_limit())
						{
							showModalConfirmation(
									"Send Email",
									"You can apply this bulk action only on 25 contacts in the FREE Plan. Please choose lesser number of contacts or upgrade your account.",
									function()
									{
										Backbone.history.navigate("subscribe", { trigger : true });
									}, function()
									{
										// No callback
										return;
									}, function()
									{
										return;
									}, "Upgrade", "Close");
						}
						else
						{
							// Selected Contact ids
							var id_array = get_contacts_bulk_ids();

							// when SELECT_ALL is true i.e., all contacts are
							// selected.
							if (id_array.length === 0)
								count = getAvailableContacts();
							else
								count = id_array.length;

							if (!canSendEmails(count))
							{
								var pendingEmails = getPendingEmails();

								var yes = "Yes";
								var no = "No"

								var message = "";
								var upgrade_link = 'Please <a href="#subscribe" class="action" data-dismiss="modal" subscribe="subscribe" action="deny">upgarde your email subscription.</a>';
								var title = "Not enough emails left"
								if (pendingEmails <= 0)
								{
									title = "Emails limit";
									yes = "";
									no = "Ok"
									message = "You have used up all emails in your quota. " + upgrade_link;
								}
								else
									message = "You have only " + pendingEmails + " emails remaining as per your quota. " + upgrade_link + " Continuing with this operation may not send the email to some contacts. <br/><br/>" + "Do you want to proceed?";

								showModalConfirmation(title, message, show_bulk_email_form, function(element)
								{

									// No callback
									if (!element)
										return;

									if ($(element).attr('subscribe'))
										Backbone.history.navigate("subscribe", { trigger : true });
								}, function(element)
								{
								}, yes, no);
								return;
							}

							show_bulk_email_form()
						}

					});

	function show_bulk_email_form()
	{
		var count = 0;

		// Selected Contact ids
		var id_array = get_contacts_bulk_ids();

		$('body').die('fill_emails').live('fill_emails', function(event)
		{

			var $emailForm = $('#emailForm');

			// Populate from address and templates
			populate_send_email_details();

			// Setup HTML Editor
			setupTinyMCEEditor('textarea#email-body', false, undefined, function()
			{

				// Reset tinymce content
				set_tinymce_content('email-body', '');
			});

			// when SELECT_ALL is true i.e., all contacts are selected.
			if (id_array.length === 0)
				count = getAvailableContacts();
			else
				count = id_array.length;

			// Shows selected contacts count in Send-email page.
			$emailForm.find('div#bulk-count').css('display', 'inline-block');
			$emailForm.find('div#bulk-count p').html("Selected <b>" + count + " contacts</b> for sending email.");

			// Hide to,cc and bcc
			$emailForm.find('input[name="to"]').closest('.control-group').attr('class', 'hidden');
			$emailForm.find('a#cc-link').closest('.control-group').attr('class', 'hidden');

			// Change ids of Send and Close button, to avoid normal send-email
			// actions.
			$emailForm.find('.form-actions a#sendEmail').removeAttr('id').attr('id', 'bulk-send-email');
			$emailForm.find('.form-actions a#send-email-close').removeAttr('id');

		});

		Backbone.history.navigate("bulk-email", { trigger : true });

		$('#bulk-send-email').die().live('click', function(e)
		{
			e.preventDefault();

			if ($(this).attr('disabled'))
				return;

			var $form = $('#emailForm');

			// Is valid
			if (!isValidForm($form))
				return;

			// Disables send button and change text to Sending...
			disable_send_button($(this));

			// Saves tinymce content to textarea
			save_content_to_textarea('email-body');

			// serialize form.
			var form_json = serializeForm("emailForm");
			if (form_json.from_email != CURRENT_DOMAIN_USER.email && form_json.from_name == CURRENT_DOMAIN_USER.name)
			{
				form_json.from_name = "";
			}
			var url = '/core/api/bulk/update?action_type=SEND_EMAIL';

			var json = {};
			json.contact_ids = id_array;
			json.data = JSON.stringify(form_json);

			postBulkOperationData(url, json, $form, null, function()
			{
				enable_send_button($('#bulk-send-email'));
			}, "Emails have been queued for " + count + " contacts. They will be sent shortly.");
		});
	}

	/**
	 * Bulk Operations - Exports selected contacts in a CSV file as an
	 * attachment to email of current domain user.
	 */
	$("#bulk-contacts-export")
			.live(
					'click',
					function(e)
					{
						e.preventDefault();

						// Removes if previous modals exist.
						if ($('#contacts-export-csv-modal').size() != 0)
						{
							$('#contacts-export-csv-modal').remove();
						}

						// Selected Contact ids
						var id_array = get_contacts_bulk_ids();

						var count = 0;

						// when SELECT_ALL is true i.e., all contacts are
						// selected.
						if (id_array.length === 0)
							count = getAvailableContacts();
						else
							count = id_array.length;

						var contacts_csv_modal = $(getTemplate('contacts-export-csv-modal'), {});
						// $(contacts_csv_modal).find('.export-contacts-count').html("<b>"+count+"
						// contacts</b>");
						contacts_csv_modal.modal('show');

						// If Yes clicked
						$('#contacts-export-csv-confirm')
								.die()
								.live(
										'click',
										function(e)
										{
											e.preventDefault();

											if ($(this).attr('disabled'))
												return;

											$(this).attr('disabled', 'disabled');

											// Shows message
											$save_info = $('<img src="img/1-0.gif" height="18px" width="18px"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>Email will be sent shortly.</i></small></span>');
											$(this).parent('.modal-footer').find('.contacts-export-csv-message').append($save_info);
											$save_info.show();

											var url = '/core/api/bulk/update?action_type=EXPORT_CONTACTS_CSV';

											var json = {};
											json.contact_ids = id_array;
											json.data = JSON.stringify(CURRENT_DOMAIN_USER);
											postBulkOperationData(url, json, undefined, undefined, function()
											{

												// hide modal after 3 secs
												setTimeout(function()
												{
													contacts_csv_modal.modal('hide');
												}, 3000);

												// Uncheck contacts table and
												// hide bulk actions button.
												$('body').find('#bulk-actions').css('display', 'none');
												$('body').find('#bulk-select').css('display', 'none');
												$('table#contacts-table').find('.thead_check').removeAttr('checked');
												$('table#contacts-table').find('.tbody_check').removeAttr('checked');

											}, "no_noty");
										});

					});
	
	/**
	 * Bulk Operations - Exports selected contacts in a CSV file as an
	 * attachment to email of current domain user.
	 */
	$("#bulk-companies-export")
			.live(
					'click',
					function(e)
					{
						e.preventDefault();

						// Removes if previous modals exist.
						if ($('#companies-export-csv-modal').size() != 0)
						{
							$('#companies-export-csv-modal').remove();
						}

						// Selected Contact ids
						var id_array = get_contacts_bulk_ids();

						var count = 0;

						// when SELECT_ALL is true i.e., all contacts are
						// selected.
						if (id_array.length === 0)
							count = getAvailableContacts();
						else
							count = id_array.length;

						var companies_csv_modal = $(getTemplate('companies-export-csv-modal'), {});
						// $(contacts_csv_modal).find('.export-contacts-count').html("<b>"+count+"
						// contacts</b>");
						companies_csv_modal.modal('show');

						// If Yes clicked
						$('#companies-export-csv-confirm')
								.die()
								.live(
										'click',
										function(e)
										{
											e.preventDefault();

											if ($(this).attr('disabled'))
												return;

											$(this).attr('disabled', 'disabled');

											// Shows message
											$save_info = $('<img src="img/1-0.gif" height="18px" width="18px"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>Email will be sent shortly.</i></small></span>');
											$(this).parent('.modal-footer').find('.companies-export-csv-message').append($save_info);
											$save_info.show();

											var url = '/core/api/bulk/update?action_type=EXPORT_COMPANIES_CSV';

											var json = {};
											json.contact_ids = id_array;
											json.data = JSON.stringify(CURRENT_DOMAIN_USER);
											postBulkOperationData(url, json, undefined, undefined, function()
											{

												// hide modal after 3 secs
												setTimeout(function()
												{
													companies_csv_modal.modal('hide');
												}, 3000);

												// Uncheck contacts table and
												// hide bulk actions button.
												$('body').find('#bulk-actions').css('display', 'none');
												$('body').find('#bulk-select').css('display', 'none');
												$('table#companies').find('.thead_check').removeAttr('checked');
												$('table#companies').find('.tbody_check').removeAttr('checked');

											}, "no_noty");
										});

					});


	$("#select-all-available-contacts")
			.die()
			.live(
					'click',
					function(e)
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

	$("#select-all-revert")
			.die()
			.live(
					'click',
					function(e)
					{
						e.preventDefault();
						SELECT_ALL = false;
						_BULK_CONTACTS = undefined;

						$('body')
								.find('#bulk-select')
								.css('display', 'block')
								.html(
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
function toggle_contacts_bulk_actions_dropdown(clicked_ele, isBulk, isCampaign)
{
	SELECT_ALL = false;
	_BULK_CONTACTS = undefined;

	// For Active Subscribers table
	if (isCampaign === "active-campaign")
	{
		toggle_active_contacts_bulk_actions_dropdown(clicked_ele, isBulk);
		return;
	}

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
	// Reads filter cookie$('.filter-criteria'

	var filter_id = $('.filter-criteria', $(App_Contacts.contactsListView.el)).attr("_filter");

	if (filter_id && _BULK_CONTACTS == "#contacts")
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
 * 
 * @param url
 * @param data
 * @param form
 * @param contentType
 * @param callback
 */
function postBulkOperationData(url, data, form, contentType, callback, error_message)
{
	var dynamic_filter = getDynamicFilters();
	if (dynamic_filter != null)
	{
		data.dynamic_filter = dynamic_filter;
	}
	if (data.contact_ids && data.contact_ids.length == 0)
	{
		console.log(data.contact_ids);
		console.log(getSelectionCriteria());
		if (dynamic_filter == null)
		{
			url = url + "&filter=" + encodeURIComponent(getSelectionCriteria());
		}
		console.log(url);
	}
	else
		data.contact_ids = JSON.stringify(data.contact_ids);

	data.tracker = Math.floor(Math.random() * (10000 - 1)) + 1;
	contentType = contentType != undefined ? contentType : "application/x-www-form-urlencoded";
	
	// Ajax request to post data
	$.ajax({ url : url, type : 'POST', data : data, contentType : contentType, success : function(data)
	{

		$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Task Scheduled.</i></p></small></div>');

		if (form !== undefined)
		{
			var save_msg = $(form).find('.form-actions');

			if (save_msg.find('.text-success'))
				save_msg.find('.text-success').parent().parent().remove(); // erase
																			// previous
																			// message.

			save_msg.append($save_info);
		}

		if (callback && typeof (callback) === "function")
			callback(data);

		// On save back to contacts list
		Backbone.history.navigate("contacts", { trigger : true });

		// If no_noty is given as error message, neglect noty
		if (error_message === "no_noty")
			return;

		if (!error_message)
		{
			showNotyPopUp('information', "Task scheduled", "top", 5000);
			return;
		}
		showNotyPopUp('information', error_message, "top", 5000);
	} });
}

function getDynamicFilters()
{
	var dynamic_filter = null;
	if (readCookie('company_filter'))
	{
		dynamic_filter = readData('dynamic_company_filter')
	}
	else
	{
		dynamic_filter = readData('dynamic_contact_filter')
	}

	if (!dynamic_filter || dynamic_filter == null)
	{
		return null;
	}
	else
	{
		if (JSON.parse(dynamic_filter).rules.length > 0)
		{
			return dynamic_filter;
		}
		else
		{
			return null;
		}
	}
}

function bulkOperationContactsCount()
{
	if (SELECT_ALL == true)
	{
		return getAvailableContacts();
	}

	else
	{
		var id_array = get_contacts_bulk_ids();
		return id_array.length;
	}
}

/**
 * Limit on free user bulk operations
 */
function has_more_than_limit()
{
	if (bulkOperationContactsCount() > 25)
		return true;

	return false;
}
