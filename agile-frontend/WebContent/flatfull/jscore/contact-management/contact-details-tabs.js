/**
 * contact-details-tabs.js fetches the contact (which is in contact detail view)
 * related details (notes, tasks, deals, campaigns and mails etc..) and presents
 * in tab content as specified, when the corresponding tab is clicked. Timeline
 * tab is activated by default to show all the details as vertical time-line.
 * 
 * @module Contact management
 * @author Rammohan
 */

var contact_tab_position_cookie_name = "contact_tab_position_" + CURRENT_DOMAIN_USER.id;

var CONTACT_ASSIGNED_TO_CAMPAIGN = false;

var NO_WEB_STATS_SETUP = true;

var email_server_type = "agilecrm";

var email_server_type_cookie_name = "email_server_type_" + CURRENT_DOMAIN_USER.id;

function fill_company_related_contacts(companyId, htmlId)
{
	$('#' + htmlId).html(LOADING_HTML);

	var companyContactsView = new Base_Collection_View({ url : 'core/api/contacts/related/' + companyId, templateKey : 'company-contacts',
		individual_tag_name : 'tr', cursor : true, page_size : 25, sort_collection : false, postRenderCallback : function(el)
		{
			// var cel = App_Contacts.contactsListView.el;
			// var collection = App_Contacts.contactsListView.collection;
		} });

	companyContactsView.collection.fetch();

	$('#' + htmlId).html(companyContactsView.render().el);
}

var Contact_Details_Tab_Actions = {

	 /**
	 * Activates the Timeline tab-content to show the time-line with all
	 * details, which are already added to time-line, when the contact is
	 * getting to its detail view.
	 */
	  openTimeLine : function(e){
	  		
			save_contact_tab_position_in_cookie("timeline");

			contact_details_tab.load_timeline();
	  },

	  onEmailSubjectClick : function(e){
	  		
	  		var targetEl = $(e.currentTarget);

			var href = $(targetEl).attr("href");
			var id = $(targetEl).attr('id');
			$(".collapse-" + id).hide();
			$(href).collapse('toggle');

			$(href).on("hidden.bs.collapse", function()
			{
				$(".collapse-" + id).show();
			})
	  },

	  // Hide More link and truncated webstats and show complete web stats.
	  showPageViews : function(e){
		   $(e.currentTarget).closest('.activity-text-block').find('#complete-webstats').toggle();	  	
	  },

	  // to remove contact from active campaign.
	  removeActiveCampaigns : function(e){
	  	var targetEl = $(e.currentTarget);

  		if (!confirm("Are you sure to remove " + $(targetEl).attr("contact_name") + " from " + $(targetEl).attr("campaign_name") + " campaign?"))
		return;

		var $active_campaign = $(targetEl).closest('span#active-campaign');
		var campaign_id = $active_campaign.attr('data');
		var contact_id;

		// Fetch contact id from model
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
			contact_id = App_Contacts.contactDetailView.model.get('id');

		// Url to delete
		var deleteUrl = 'core/api/workflows/remove-active-subscriber/' + campaign_id + '/' + contact_id;

		$.ajax({ url : deleteUrl, type : 'DELETE', success : function(data)
		{

			var contact_json = App_Contacts.contactDetailView.model.toJSON();
			var campaign_status = contact_json.campaignStatus;

			// On success callback, remove from both UI and backbone contact
			// model.
			if (campaign_status !== undefined)
			{
				for (var i = 0, len = campaign_status.length; i < len; i++)
				{
					if (campaign_id === campaign_status[i].campaign_id)
					{
						// Remove from campaignStatus array of contact model
						campaign_status.splice(i, 1);
						break;
					}
				}
			}

			// Remove li
			$active_campaign.remove();

		} });
	  },

	  /**
	 * Fetches all the notes related to the contact and shows the notes
	 * collection as a table in its tab-content, when "Notes" tab is clicked.
	 */
	  showNotes : function(e){
		   save_contact_tab_position_in_cookie("notes");
		   contact_details_tab.load_notes();
	  
	  },

	  /**
	 * Fetches all the events related to the contact and shows the events
	 * collection as a table in its tab-content, when "Events" tab is clicked.
	 */
	  showEvents : function(e){
		   save_contact_tab_position_in_cookie("events");
		contact_details_tab.load_events();
	  },

	   replyToEmail : function(e){
		   
		   var targetEl = $(e.currentTarget);

				var from = $(targetEl).data('from');

				var $parent_element = $(targetEl).closest('#email-reply-div');

				var to_emails = $parent_element.find('.to-emails').data('to');
				var cc_emails = $parent_element.find('.cc-emails').data('cc');
				var bcc_emails = $parent_element.find('.bcc-emails').data('bcc');

				var email_sync_configured = contact_details_tab.configured_sync_email;

				var configured_email;

				if (email_sync_configured)
				{
					configured_email = email_sync_configured;
				}

				if (configured_email && to_emails)
				{
					// Merge both from and to removing configured email
					to_emails = get_emails_to_reply(from + ', ' + to_emails, configured_email);
				}

				if (configured_email && cc_emails)
				{

					cc_emails = get_emails_to_reply(cc_emails, configured_email);
				}

				if (configured_email && bcc_emails)
				{

					bcc_emails = get_emails_to_reply(bcc_emails, configured_email);
				}

				// Change url only without triggerring function
				App_Contacts.navigate('send-email');

				// Reply all emails
				reply_email = to_emails;

				// Removes leading and trailing commas
				reply_email = reply_email.replace(/(, $)/g, "");

				if (cc_emails)
					cc_emails = cc_emails.replace(/(, $)/g, "");

				if (bcc_emails)
					bcc_emails = bcc_emails.replace(/(, $)/g, "");

				// Trigger route callback
				App_Contacts.sendEmail(reply_email, "Re: " + $parent_element.find('.email-subject').text(),
						'<p></p><blockquote style="margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex;">' + $parent_element.find('.email-body')
								.html() + '</blockquote>', cc_emails, bcc_emails);

	  },

	  /**
	 * Delete functionality for activity blocks in contact details
	 */
	   deleteActivity : function(e){
		  	
		  	var targetEl = $(e.currentTarget);

		  	var model = $(targetEl).parents('li').data();

			if (model && model.toJSON().type != "WEB_APPOINTMENT")
			{
				if (!confirm("Are you sure you want to delete?"))
					return;
			}
			else if (model && model.toJSON().type == "WEB_APPOINTMENT" && parseInt(model.toJSON().start) < parseInt(new Date().getTime() / 1000))
			{
				if (!confirm("Are you sure you want to delete?"))
					return;
			}

			if (model && model.collection)
			{
				model.collection.remove(model);
			}

			// Gets the id of the entity
			var entity_id = $(targetEl).attr('id');

			if (model && model.toJSON().type == "WEB_APPOINTMENT" && parseInt(model.toJSON().start) > parseInt(new Date().getTime() / 1000))
			{
				web_event_title = model.toJSON().title;
				if (model.toJSON().contacts.length > 0)
				{
					var firstname = getPropertyValue(model.toJSON().contacts[0].properties, "first_name");
					if (firstname == undefined)
						firstname = "";
					var lastname = getPropertyValue(model.toJSON().contacts[0].properties, "last_name");
					if (lastname == undefined)
						lastname = "";
					web_event_contact_name = firstname + " " + lastname;
				}
				$("#webEventCancelModel").modal('show');
				$("#cancel_event_title").html("Delete event &#39" + web_event_title + "&#39");
				$("#event_id_hidden").html("<input type='hidden' name='event_id' id='event_id' value='" + entity_id + "'/>");
				return;
			}

			// Gets the url to which delete request is to be sent
			var entity_url = $(targetEl).attr('url');

			if (!entity_url)
				return;

			var id_array = [];
			var id_json = {};

			// Create array with entity id.
			id_array.push(entity_id);

			// Set entity id array in to json object with key ids,
			// where ids are read using form param
			id_json.ids = JSON.stringify(id_array);
			var that = targetEl;

			// Add loading. Adds loading only if there is no loaded image added
			// already i.e.,
			// to avoid multiple loading images on hitting delete multiple times
			if ($(targetEl).find('.loading').length == 0)
				$(targetEl).prepend($(LOADING_HTML).addClass('pull-left').css('width', "20px"));

			$.ajax({ url : entity_url, type : 'POST', data : id_json, success : function()
			{
				// Removes activity from list
				$(that).parents(".activity").fadeOut(400, function()
				{
					$(targetEl).remove();
				});
				removeItemFromTimeline($("#" + entity_id, $("#timeline")));
			} });
	  },

	 
};

/**
 * Returns contact properties in a json
 * 
 * @method get_property_JSON
 * @param {Object}
 *            contactJSON contact as json object
 */
function get_property_JSON(contactJSON)
{
	var properties = contactJSON.properties;
	var json = {};
	$.each(properties, function(i, val)
	{
		json[this.name] = this.value;
	});
	console.log(json);
	return json;
}

/**
 * Populates send email details (from address, to address, signature and email
 * templates)
 * 
 * @method populate_send_email_details
 * @param {Object}
 *            el html object of send email form
 */
function populate_send_email_details(el)
{

	$("#emailForm", el).find('input[name="from_name"]').val(CURRENT_DOMAIN_USER.name);
	$("#emailForm", el).find('input[name="from_email"]').val(CURRENT_DOMAIN_USER.email);

	// Fill hidden signature field using userprefs
	// $("#emailForm").find( 'input[name="signature"]'
	// ).val(CURRENT_USER_PREFS.signature);

	// Prefill the templates
	var optionsTemplate = "<option value='{{id}}'> {{#if name}}{{name}}{{else}}{{subject}}{{/if}}</option>";
	fillSelect('sendEmailSelect', '/core/api/email/templates', 'emailTemplates', undefined, optionsTemplate, false, el, '- Fill from Template -');
}

/**
 * Activates "Timeline" tab and its tab-content in contact details and also
 * deactivates the other activated tabs.
 * 
 * @method activate_timeline_tab
 * 
 * Changed to activate first tab in the list ( on contact-details page , works
 * even on company-details page
 * @modified Chandan
 */
function activate_timeline_tab()
{
	$('#contactDetailsTab').find('li.active').removeClass('active');
	$('#contactDetailsTab li:first-child').addClass('active');

	$('div.tab-content').find('div.active').removeClass('active');
	$('div.tab-content > div:first-child').addClass('active');

	// $('#time-line').addClass('active'); //old original code for flicking
	// timeline

	if (App_Contacts.contactDetailView.model.get('type') == 'COMPANY')
	{
		fill_company_related_contacts(App_Contacts.contactDetailView.model.id, 'company-contacts');
	}
}

/**
 * Disables Send button of SendEmail and change text from Send to Sending...
 * 
 * @param elem -
 *            element to be disabled.
 * 
 */
function disable_send_button(elem)
{
	elem.css('min-width', elem.width() + 'px').attr('disabled', 'disabled').attr('data-send-text', elem.text()).text('Sending...');
}

/**
 * Enables disabled Send button and keep old text
 * 
 * @param elem -
 *            element to be enabled.
 * 
 */
function enable_send_button(elem)
{
	elem.text(elem.attr('data-send-text')).removeAttr('disabled data-send-text');
}

/**
 * Returns webstats count w.r.t domain
 */
function get_web_stats_count_for_domain(callback)
{
	// Returns web-stats count
	accessUrlUsingAjax('core/api/web-stats/JSAPI-status', function(resp){
			if(callback)
				 callback(resp);
	});
	
}

function save_contact_tab_position_in_cookie(tab_href)
{

	var position = _agile_get_prefs(contact_tab_position_cookie_name);

	if (position == tab_href)
		return;

	_agile_set_prefs(contact_tab_position_cookie_name, tab_href);
}

function load_contact_tab(el, contactJSON)
{
	timeline_collection_view = null;
	var position = _agile_get_prefs(contact_tab_position_cookie_name);
	if (position == null || position == undefined || position == "")
		position = "timeline";

	$('#contactDetailsTab a[href="#' + position + '"]', el).tab('show');

	if (!position || position == "timeline")
	{
		activate_timeline_tab()
		contact_details_tab.load_timeline();
		return;
	}

	if (contact_details_tab["load_" + position])
	{

		// Should add active class, tab is not enough as content might not be
		// shown in view.
		$(".tab-content", el).find("#" + position).addClass("active");
		contact_details_tab["load_" + position]();
	}

}

function get_emails_to_reply(emails, configured_email)
{
	var emails_array = emails.split(',');

	emails = "";

	for (var i = 0, len = emails_array.length; i < len; i++)
	{

		var email = emails_array[i].match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)[0];

		// Skip configured email
		if (configured_email && email == configured_email)
			continue;

		// Skip current user email
		if (email == CURRENT_DOMAIN_USER.email)
			continue;

		emails += email;

		// Append comma without trailing
		if (i < len - 1)
			emails += ', ';

	}

	return emails;
}
function save_email_server_type_in_cookie(cookie_value)
{
	if (cookie_value)
	{
		var previous_cookie_value = readCookie(email_server_type_cookie_name);
		if (previous_cookie_value === cookie_value)
			return;
		createCookie(email_server_type_cookie_name, cookie_value, 30);
	}
}

function initializeSendEmailListeners(){

/**
	 * Populates subject and description using email templates, on select option
	 * change of "Fill From Templates" field.
	 */
	$('#send-email-listener-container').on('change', '.emailSelect', function(e)
	{
		e.preventDefault();

		// To remove previous errors
		$('#emailForm').find('.error').removeClass('error');
		$('#emailForm').find('.help-inline').css('display', 'none');

		var model_id = $('.emailSelect option:selected').prop('value');

		// When default option selected make subject and body empty
		if (!model_id)
		{
			// Fill subject and body of send email form
			$("#emailForm").find('input[name="subject"]').val("");

			set_tinymce_content('email-body', '');

			$("#emailForm").find('textarea[name="body"]').val("");
			
			$('.add-attachment-cancel').trigger("click");

			$('#eattachment_error').hide();
			return;
		}

		var emailTemplatesModel = Backbone.Model.extend({ url : '/core/api/email/templates/' + model_id, restKey : "emailTemplates" });
		var templateModel = new emailTemplatesModel();
		templateModel.fetch({ success : function(data)
		{
			var model = data.toJSON();

			var subject = model.subject;
			var text = model.text;

			// Apply handlebars template on send-email route
			if (Current_Route !== 'bulk-email' && Current_Route !== 'send-email')
			{

				// Get Current Contact
				/*
				 * var contact = App_Contacts.contactDetailView.model; var json =
				 * contact.toJSON();
				 */

				/*
				 * Get Contact properties json to fill the templates using
				 * handlebars
				 */
				var json = get_contact_json_for_merge_fields();
				var template;

				// Templatize it
				try
				{
					template = Handlebars.compile(subject);
					subject = template(json);
				}
				catch (err)
				{
					subject = add_square_brackets_to_merge_fields(subject);

					template = Handlebars.compile(subject);
					subject = template(json);
				}

				try
				{
					template = Handlebars.compile(text);
					text = template(json);
				}
				catch (err)
				{
					text = add_square_brackets_to_merge_fields(text);

					template = Handlebars.compile(text);
					text = template(json);
				}
			}

			// Fill subject and body of send email form
			$("#emailForm").find('input[name="subject"]').val(subject);

			// Insert content into tinymce
			set_tinymce_content('email-body', text);
			
			if (model.attachment_id && Current_Route != 'bulk-email' && Current_Route != 'company-bulk-email')
			{
				var el = $('.add-attachment-select').closest("div");
				$('.add-attachment-select').hide();
				el.find(".attachment-document-select").css("display", "inline");
				var optionsTemplate = "<option value='{{id}}' network_type='{{titleFromEnums network_type}}' size='{{size}}' url='{{url}}'>{{name}}</option>";
        		fillSelect('attachment-select','core/api/documents', 'documents',  function fillNew()
				{
					el.find("#attachment-select option:first").after("<option value='new'>Upload new doc</option>");
					$('#attachment-select').find('option[value='+model.attachment_id+']').attr("selected","selected");
					$('.add-attachment-confirm').trigger("click");

				}, optionsTemplate, false, el);
			}
			else if (model.attachment_id && (Current_Route == 'bulk-email' || Current_Route == 'company-bulk-email'))
			{
				$('.add-attachment-select').hide();
				$('#eattachment_error').show();
			}
			else if(!model.attachment_id && (Current_Route == 'bulk-email' || Current_Route == 'company-bulk-email'))
			{
				$('.add-attachment-select').hide();
				$('#eattachment_error').hide();
			}
			else if(!model.attachment_id)
			{
				$('.add-attachment-cancel').trigger("click");
				$('#eattachment_error').hide();
			}
		} });

	});

	/**
	 * Sends email to the target email. Before sending, validates and serializes
	 * email form.
	 */
	$('#send-email-listener-container').on('click', '#sendEmail', function(e)
					{
						e.preventDefault();

						if ($(this).attr('disabled'))
							return;
						var $form = $('#emailForm');
						// Is valid
						if (!isValidForm($form))
							return;
						var network_type = $('#attachment-select').find(":selected").attr('network_type');
						// checking email attachment type , email doesn't allow
						// google drive documents as attachments
						if (network_type)
						{
							if (network_type.toUpperCase() === 'GOOGLE')
								return;
						}

						// Saves tinymce content to textarea
						save_content_to_textarea('email-body');

						// serialize form.
						var json = serializeForm("emailForm");
						if ((json.contact_to_ids).join())
							json.to += ((json.to != "") ? "," : "") + (json.contact_to_ids).join();

						if ((json.contact_cc_ids).join())
							json.email_cc += ((json.email_cc != "") ? "," : "") + (json.contact_cc_ids).join();

						if ((json.contact_bcc_ids).join())
							json.email_bcc += ((json.email_bcc != "") ? "," : "") + (json.contact_bcc_ids).join();

						if (json.to == "" || json.to == null || json.to == undefined)
						{
							// Appends error info to form actions block.
							$save_info = $('<span style="display:inline-block;color:#df382c;">This field is required.</span>');
							$('#emailForm').find("#to").closest(".controls > div").append($save_info);
							$('#emailForm').find("#to").focus();
							// Hides the error message after 3 seconds
							$save_info.show().delay(3000).hide(1);

							enable_send_button($('#sendEmail'));
							return;
						}

						// Is valid
						if (!isValidForm($('#emailForm')))
							return;

						// Disables send button and change text to Sending...
						disable_send_button($(this));

						// Navigates to previous page on sending email
						$
								.ajax({
									type : 'POST',
									data : json,
									url : 'core/api/emails/contact/send-email',
									success : function()
									{

										// Enables Send Email button.
										enable_send_button($('#sendEmail'));

										window.history.back();

									},
									error : function(response)
									{
										enable_send_button($('#sendEmail'));

										// Show cause of error in saving
										$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>' + response.responseText + '</i></p></small></div>');

										// Appends error info to form actions
										// block.
										$($('#sendEmail')).closest(".form-actions", this.el).append($save_info);

										// Hides the error message after 3
										// seconds
										if (response.status != 406)
											$save_info.show().delay(10000).hide(1);
									} });

					});

	/**
	 * Close button click event of send email form. Navigates to contact detail
	 * view.
	 */
	$('#send-email-listener-container').on('click', '#send-email-close', function(e)
	{
		e.preventDefault();

		window.history.back();
	});


$('#send-email-listener-container').on('click', '#cc-link, #bcc-link', function(e)
	{
		e.preventDefault();

		// Hide link
		$(this).hide();

		if ($(this).attr('id') === 'cc-link')
		{
			$('#email_cc').closest('.control-group').show();

			// Hide div.control-group to reduce space between subject
			if ($(this).parent().find('#bcc-link').css('display') === 'none')
				$(this).closest('.control-group').hide();

			return;
		}

		if ($(this).parent().find('#cc-link').css('display') === 'none')
			$(this).closest('.control-group').hide();

		$('#email_bcc').closest('.control-group').show();
	});

	$('#send-email-listener-container').on('click', '#from_email_link', function(e)
	{
		e.preventDefault();
		$(this).closest('.control-group').hide();
		$('#from_email').closest('.control-group').show();
		$('#from_name').closest('.control-group').show();
		return;
	});

}