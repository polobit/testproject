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

var company_tab_position_cookie_name = "company_tab_position_" + CURRENT_DOMAIN_USER.id;

var CONTACT_ASSIGNED_TO_CAMPAIGN = false;

var NO_WEB_STATS_SETUP = true;

var email_server_type = "agilecrm";

var email_server_type_cookie_name = "email_server_type_" + CURRENT_DOMAIN_USER.id;

function fill_company_related_contacts(companyId, htmlId, context_el)
{
	$('#' + htmlId).html(LOADING_HTML);
	var contactsHeader = new Contacts_And_Companies_Events_View({ data : {}, template : "company-contacts-collection", isNew : true,
			postRenderCallback : function(el)
			{
				setupContactCompanyFields(el);
				fetchContactCompanyHeadings(function(modelData){
					getContactofCompanies(modelData,el,companyId);
		});
			}
		});

	/*var companyContactsView = new Base_Collection_View({ url : 'core/api/contacts/related/' + companyId, templateKey : 'company-contacts',
		individual_tag_name : 'tr', cursor : true, page_size : 25, sort_collection : false, scroll_target : (context_el ? $("#infinite-scroller-company-details", context_el) : "#infinite-scroller-company-details"), postRenderCallback : function(el)
		{
			// var cel = App_Contacts.contactsListView.el;
			// var collection = App_Contacts.contactsListView.collection;
			contactListener();
		} });

	companyContactsView.collection.fetch();*/

	if(context_el)
		$('#' + htmlId, $(context_el)).html(contactsHeader.render().el);
	else
		$('#' + htmlId,App_Companies.companyDetailView.el).html(contactsHeader.render().el);
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
	  	showAlertModal("{{agile_lng_translate 'campaigns' 'sure-remove-active'}} " + $(targetEl).attr("contact_name") + " {{agile_lng_translate 'contacts-view' 'from'}}  " + $(targetEl).attr("campaign_name") + " {{agile_lng_translate 'contact-details' 'campaign'}} ?", "confirm", function(){
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
		},undefined, _agile_get_translated_val('campaigns','remove-active-campaign'));

		
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

		  	var owner = model.get("owner_id");

		  	if(!owner && model.get("owner")){
		  		owner = model.get("owner").id;
		  	}

		  	if(!owner && Current_Route.indexOf("deal/") == 0 && App_Deal_Details.dealDetailView && App_Deal_Details.dealDetailView.model){
		  		owner = App_Deal_Details.dealDetailView.model.get("owner").id;
		  	}

		  	if(!hasScope("DELETE_DEALS") && model.get("entity_type") && model.get("entity_type") == "deal"){
		  		$('#deal_delete_privileges_error_modal').html(getTemplate("deal-delete-privileges-error-modal")).modal('show');
		  		return;
		  	}

		  	if(model.get("entity_type") && model.get("entity_type") == "note" && Current_Route.indexOf("deal/") == 0 && model.get("domainOwner") && !hasScope("UPDATE_DEALS") && (CURRENT_DOMAIN_USER.id != owner)){
		  		$('#deal_update_privileges_error_modal').html(getTemplate("deal-update-privileges-error-modal")).modal('show');
		  		return;
		  	}

		  	if(!hasScope("MANAGE_CALENDAR") && (CURRENT_DOMAIN_USER.id != owner) && model.get("entity_type") && model.get("entity_type") == "event"){
				$("#deleteEventErrorModal").html(getTemplate("delete-event-error-modal")).modal('show');
				return;
			}

			// Gets the id of the entity
			var entity_id = $(targetEl).attr('id');
			if (model && model.toJSON().type != "WEB_APPOINTMENT" || parseInt(model.toJSON().start) < parseInt(new Date().getTime() / 1000))
			{
				showAlertModal("delete", "confirm", function(){
					modelDelete(model, targetEl, function(){
						removeItemFromTimeline($("#" + entity_id, $("#timeline")));
					});
				});
				return;
			}
			modelDelete(model, targetEl);

			
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

	if(CURRENT_DOMAIN_USER && CURRENT_DOMAIN_USER.name)
	{
		//When name contains script word, we are getting that script as &#x73;cript from server side
		$("#emailForm", el).find('input[name="from_name"]').val(CURRENT_DOMAIN_USER.name.replace(/&#x73;+/g, 's'));
	}
	if(CURRENT_DOMAIN_USER && CURRENT_DOMAIN_USER.email)
	{
		//When email contains script word, we are getting that script as &#x73;cript from server side
		$("#emailForm", el).find('input[name="from"]').val(CURRENT_DOMAIN_USER.email.replace(/&#x73;+/g, 's'));
	}

	// Fill hidden signature field using userprefs
	// $("#emailForm").find( 'input[name="signature"]'
	// ).val(CURRENT_USER_PREFS.signature);

	// Prefill the templates
	var optionsTemplate = "<option value='{{id}}'> {{#if name}}{{name}}{{else}}{{subject}}{{/if}}</option>";
	fillSelect('sendEmailSelect', '/core/api/email/templates', 'emailTemplates', undefined, optionsTemplate, false, el, _agile_get_translated_val('other','fill-from-template'));
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

function activate_company_contact_tab()
{
	$('#contactDetailsTab').find('li.active').removeClass('active');
	$('#contactDetailsTab li:first-child').addClass('active');

	$('div.tab-content').find('div.active').removeClass('active');
	$('div.tab-content > div:first-child',App_Companies.companyDetailView.el).addClass('active');

	// $('#time-line').addClass('active'); //old original code for flicking
	// timeline

	if (App_Companies.companyDetailView.model.get('type') == 'COMPANY')
	{
		fill_company_related_contacts(App_Companies.companyDetailView.model.id, 'company-contacts');
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

function save_company_tab_position_in_cookie(tab_href)
{

	var position = _agile_get_prefs(company_tab_position_cookie_name);

	if (position == tab_href)
		return;

	_agile_set_prefs(company_tab_position_cookie_name, tab_href);
}

function load_contact_tab(el, contactJSON)
{
	timeline_collection_view = null;
	var position = _agile_get_prefs(contact_tab_position_cookie_name);
	if (position == null || position == undefined || position == "")
		position = "timeline";

	if(position == "timeline" && agile_is_mobile_browser())
			return;

	//Any tab is saved as cookie and if that tab doesn't have permissions,
	//change the tab position to timeline
	if($('#contactDetailsTab a[href="#' + position + '"]', el).length == 0)
	{
		position = "timeline";
	}

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

function load_company_tab(el, contactJSON)
{
	//timeline_collection_view = null;
	var position = _agile_get_prefs(company_tab_position_cookie_name);
	if (position == null || position == undefined || position == "")
		position = "contacts";

	if(position == "contacts" && agile_is_mobile_browser())
			return;

	//Any tab is saved as cookie and if that tab doesn't have permissions,
	//change the tab position to contacts
	if($('#contactDetailsTab a[href="#company-' + position + '"]', el).length == 0)
	{
		position = "contacts";
	}

	$('#contactDetailsTab a[href="#company-' + position + '"]', el).tab('show');

	if (!position || position == "contacts")
	{
		activate_company_contact_tab()
		company_detail_tab.load_fill_company_related_contacts
		return;
	}

	if (company_detail_tab["load_company_" + position])
	{

		// Should add active class, tab is not enough as content might not be
		// shown in view.
		$(".tab-content", el).find("#company-" + position).addClass("active");
		company_detail_tab["load_company_" + position]();
	}

}

function get_emails_to_reply(emails, configured_email)
{
	var emails_array = emails.split(',');

	emails = "";

	for (var i = 0, len = emails_array.length; i < len; i++)
	{

		var email = emails_array[i].match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

		// Skip configured email
		if (configured_email && email == configured_email || !email)
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
		var previous_cookie_value = _agile_get_prefs(email_server_type_cookie_name);
		if (previous_cookie_value === cookie_value)
			return;
		_agile_set_prefs(email_server_type_cookie_name, cookie_value, 30);
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

			$("#emailForm").find('textarea[name="message"]').val("");
			
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
					el.find("#attachment-select option:first").after("<option value='new'>"+_agile_get_translated_val('others','upload-new-doc')+"</option>");
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
						
						json.from = $(".email").find(":selected").val();
						if ((json.contact_to_ids).join())
							json.to += ((json.to != "") ? "," : "") + (json.contact_to_ids).join();

						if ((json.contact_cc_ids).join())
							json.cc += ((json.cc != "") ? "," : "") + (json.contact_cc_ids).join();

						if ((json.contact_bcc_ids).join())
							json.bcc += ((json.bcc != "") ? "," : "") + (json.contact_bcc_ids).join();

						if (json.to == "" || json.to == null || json.to == undefined)
						{
							// Appends error info to form actions block.
							$save_info = $('<span style="display:inline-block;color:#df382c;">'+_agile_get_translated_val('validation-msgs','required')+'</span>');
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

						try
						{
							var emails_length = json.to.split(',').length;
							var MAX_EMAILS_LIMIT = 10;

							if(json.cc)
								emails_length = json.cc.split(',').length + emails_length;

							if(json.bcc)
								emails_length = json.bcc.split(',').length + emails_length;

							if(emails_length > MAX_EMAILS_LIMIT)
							{
								showAlertModal("Maximum limit of sending emails at once exceeded.", undefined, function(){},
									function(){},
									"Alert");
								return;
							}
						}
						catch(err)
						{
							
						}
						
						var that =$(this);

						if(hasScope("EDIT_CONTACT"))
						{
							emailSend(that,json);
						}
						else
						{
							showModalConfirmation(_agile_get_translated_val('contact-details','send-email'), 
								_agile_get_translated_val('campaigns','no-perm-send-emails') + "<br/><br/> " + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),
								function (){
									emailSend(that,json);
								},
								function(){
									return;
								},
								function(){
					
								});
						}

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

/*
 * Ajax call to send email
 */
function emailSend(ele,json)
{
	// Disables send button and change text to Sending...
	disable_send_button(ele);

	// Navigates to previous page on sending email
	$.ajax({
		type : 'POST',
		data : JSON.stringify(json),
		dataType: 'json',
		contentType: "application/json",
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
		} 
	});
}

function modelDelete(model, targetEl, callback){
	if (model && model.collection)
	{
		model.collection.remove(model);
	}

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
		$("#cancel_event_title").html(_agile_get_translated_val('events','delete-event') + " &#39" + web_event_title + "&#39");
		$("#event_id_hidden").html("<input type='hidden' name='event_id' id='event_id' value='" + entity_id + "'/>");
		return;
	}

	// Gets the id of the entity
	var entity_id = $(targetEl).attr('id');

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
	/*if ($(targetEl).find('.loading').length == 0)
		$(targetEl).prepend($(LOADING_HTML).addClass('pull-left').css('width', "20px"));*/

	$.ajax({ url : entity_url, type : 'POST', data : id_json, success : function(response_data)
	{	
		if((Current_Route.indexOf("contact/") == 0 || Current_Route.indexOf("company/") == 0) && !response_data)
		{
			return;
		}
		if((Current_Route.indexOf("contact/") == 0 || Current_Route.indexOf("company/") == 0) && response_data)
		{
			var can_edit = false;
			$.each(response_data, function(index, contactId){
				if(Current_Route.indexOf("contact/") == 0 && App_Contacts.contactDetailView.model.get("id") && contactId == App_Contacts.contactDetailView.model.get("id"))
				{
					can_edit = true;
				}
				else if(Current_Route.indexOf("company/") == 0 && App_Companies.companyDetailView.model.get("id") && contactId == App_Companies.companyDetailView.model.get("id"))
				{
					can_edit = true;
				}
			});
			if(Current_Route.indexOf("contact/") == 0 && !App_Contacts.contactDetailView.model.get("id"))
			{
				can_edit = true;
			}
			else if(Current_Route.indexOf("company/") == 0 && !App_Companies.companyDetailView.model.get("id"))
			{
				can_edit = true;
			}
			if(!can_edit)
			{
				showModalConfirmation(_agile_get_translated_val('contact-details','delete') + " <span class='text-cap'>"+model.get("entity_type")+"</span>", 
					'<span class="text-cap">'+model.get("entity_type")+'</span> '+CONTACTS_ACTIVITY_ACL_DELETE_ERROR, 
					function (){
						return;
					}, 
					function(){
						return;
					},
					function (){
						return;
					},
					_agile_get_translated_val('contact-details','cancel')
				);
				return;
			}
		}
		// Removes activity from list
		$(that).parents(".activity").parent().fadeOut(400, function()
		{
			$(targetEl).remove();
		});
		if(callback && typeof(callback) === "function"){
			callback();
		}
	}, error : function(response){
		showModalConfirmation("Delete <span class='text-cap'>"+model.get("entity_type")+"</span>", 
			'<span>'+response.responseText+'</span>', 
			function (){
				return;
			}, 
			function(){
				return;
			},
			function (){
				return;
			},
			'Cancel'
		);
		return;
	} });
}

function setupContactCompanyFields(el){
		// Update el with default dropdown
		$('#contact-static-fields-group', el).html(getTemplate("contact-custom-fields"));

		get_custom_fields(function(data){
		
 		for(i=0; i<data.length; i++){
		getTemplate("contact-custom-fields-append", data[i], undefined, function(template_ui){
     				if(!template_ui)
    					  return;
    		$("#custom-fields-group",el).append(template_ui);
 		});
	}

			$.ajax({
					url : 'core/api/contact-view-prefs/contact-company',
					type : 'GET',
					dataType : 'json',
					
					success : function(data)
						{
							console.log("")
						var customfields = $("#contact-static-fields");
						deserializecontactsForm(data.fields_set, customfields);
						console.log(data);
					}
				});
			
		
		});


}

function fetchContactCompanyHeadings(callback,url)
	{
			var view = new Backbone.Model();
			view.url = 'core/api/contact-view-prefs/contact-company';
			view.fetch({ success : function(data)
			{		
				App_Companies.contactCompanyViewModel = data.toJSON();
				if(callback && typeof callback === "function")
				{
					return callback(App_Companies.contactCompanyViewModel);
				}

			} });
	}

function getContactofCompanies(modelData,el,companyId)
{
						var url = 'core/api/contacts/related/' + companyId;
		var slateKey = getContactPadcontentKey(url);
		//var postData = {'filterJson': contacts_view_loader.getPostData()};
		//var sortKey = contacts_view_loader.getContactsSortKey();
		if(companyId)
		{
					App_Companies.contacts_Company_List = new  Contacts_Events_Collection_View({ url : url, modelData : modelData, sort_collection : false,
					 templateKey : "company-contacts-list-view", individual_tag_name : "tr",
				cursor : true, page_size : 25, slateKey : slateKey, request_method : 'GET', postRenderCallback : function(cel, collection)
				{	
					if(App_Companies.contacts_Company_List.collection.models.length == 0)	
					$('.add-contact-extra').parent().hide();
					if(App_Companies.contacts_Company_List.collection.models.length > 0
					 && !App_Companies.contacts_Company_List.collection.models[0].get("count")){
						// Call to get Count 
						getAndUpdateCollectionCount("contacts-company", el);						
					}
					contactListener();
					contact_detail_page_infi_scroll($('#infinite-scroller-company-details', App_Companies.companyDetailView.el), App_Companies.contacts_Company_List);

				} });
			App_Companies.contacts_Company_List.collection.fetch();

			App_Companies.contacts_Company_List.appendItem = function(base_model){
				contactTableView(base_model,CONTACTS_DATE_FIELDS,this,CONTACTS_CONTACT_TYPE_FIELDS,CONTACTS_COMPANY_TYPE_FIELDS);
			};

			$("#company-contacts-list-view", el).html(App_Companies.contacts_Company_List.render().el);
		}

		else
		{
			App_Companies.contacts_Company_List.options.modelData = modelData;

			App_Companies.contacts_Company_List.appendItem = function(base_model){
				contactTableView(base_model,CONTACTS_DATE_FIELDS,this,CONTACTS_CONTACT_TYPE_FIELDS,CONTACTS_COMPANY_TYPE_FIELDS);
			};

			$("#company-contacts-list-view", el).html(App_Companies.contacts_Company_List.render(true).el);
		}
		}
