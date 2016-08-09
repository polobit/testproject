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
var _BULKACTION_FILTER = undefined;

/** 
* Bulk actions collection view
*/
var Contacts_Events_Collection_View = Base_Collection_View.extend({
    events: {
    	'click .contact-type-image, .company-type-image' : 'navigateToProperContact',
    	'mouseenter #companies-list-view-model-list > tr > td:not(":first-child")' : 'companiesDataPopoverEnter',
    	'mouseleave #companies-list-view-model-list > tr > td:not(":first-child")' : 'companiesDataPopoverLeave'
    },
    
    navigateToProperContact : function(e){
    	e.stopPropagation();
		var currentObjId = $(e.currentTarget).attr("id");
		if($(e.currentTarget).hasClass("contact-type-image"))
		{
			Backbone.history.navigate("contact/" + currentObjId, { trigger : true });
		}
		else
		{
			Backbone.history.navigate("company/" + currentObjId, { trigger : true });
		}
    },

    companiesDataPopoverEnter : function(e)
    {
    	var left=e.pageX;
		left=left-100;
		var top=0;
		var that=$(e.currentTarget).parent();
        if($(e.currentTarget).hasClass("contact-type-custom-field-td") || $(e.currentTarget).hasClass("company-type-custom-field-td") || $(e.currentTarget).hasClass("contact-type-image") || $(e.currentTarget).hasClass("company-type-image"))
        {
        	return;
        }
        popoverEnter(that,left,top,true);
    },

    companiesDataPopoverLeave : function(e)
    {
    	var that=$(e.currentTarget).parent();
		popout(that);
    }
});

$(function(){
	 $('#deleteContactModal').on("click", ".delete-confirmed", function(e){

	 		var contactId = $(this).attr("data");
            var contactModel = App_Contacts.contactsListView.collection.get(contactId);

            contactModel.url = "core/api/contacts/" + contactId;		
			contactModel.destroy({success: function(model, response) {
				  Backbone.history.navigate("contacts",{trigger: true});
			}});
	 });
});


	


var contacts_bulk_actions = {

	/**
	 * Bulk operations - Change owner Shows all the users as drop down list to
	 * select one of them as the owner for the selected contacts.
	 */
	change_owner : function(e){
			load_bulk_operations_template(function(){

					if (!canRunBulkOperations())
					{
						showModalConfirmation(
								_agile_get_translated_val('bulk-actions','change-owner'),
								_agile_get_translated_val('bulk-actions','no-pem-to-change-owners') + "<br/><br/> " + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),
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
	},

	/**
	 * Bulk operations - Adds to campaign Shows all the workflows as drop down
	 * list to select one of them to subscribe the selected contacts
	 */
	assign_to_campaigns : function(e){
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
					_agile_get_translated_val('bulk-actions','assign-campaign'),
					_agile_get_translated_val('bulk-actions','no-pem-to-update-contacts') + "<br/><br/>" + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),
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
					_agile_get_translated_val('contacts-view','add-to-campaign'),
					_agile_get_translated_val('bulk-actions','limit-on-contacts'),
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
					},  _agile_get_translated_val('portlets','upgrade'), _agile_get_translated_val('contact-details','CLOSE'));
		}
		if (!canSendEmails(count))
		{
			continueAction = false;
			var pendingEmails = getPendingEmails() + getEmailCreditsCount();
			var yes = _agile_get_translated_val('portlets', 'yes');
			var no = _agile_get_translated_val('portlets', 'no');

			var message = "";
			var upgrade_link = _agile_get_translated_val('bulk-actions','you-may') + ' <a href="#subscribe" class="action text-info" data-dismiss="modal" subscribe="subscribe" action="deny">' +_agile_get_translated_val('plan-and-upgrade','purchase')+ ' </a>' + _agile_get_translated_val('bulk-actions','more-emails-to-action');
			var title = _agile_get_translated_val('bulk-actions','email-low-limit');
			if (pendingEmails <= 0)
			{
				title = _agile_get_translated_val('bulk-actions','email-low-limit');
				yes = "";
				no = _agile_get_translated_val('reputation','Ok');
				message = _agile_get_translated_val('bulk-actions','emails-limit-reached') + " " + upgrade_link;
			}
			else
				message = _agile_get_translated_val('billing','have-only') + " " + pendingEmails + " " +_agile_get_translated_val('bulk-actions','emails-left-quota')+ ". " + upgrade_link + " " +_agile_get_translated_val('bulk-actions','wanna-continue')+ "<br/><br/>" + _agile_get_translated_val('deal-view','do-you-want-to-proceed');

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
	},

	/**
	 * Bulk operations - Adds tags' Shows the existing tags with help of
	 * typeahead to add tags to the selected contacts. Also we can add new tags.
	 */
	add_tags : function(e){

		load_bulk_operations_template(function(){

						if (!canRunBulkOperations())
						{
							showModalConfirmation(
									_agile_get_translated_val('bulk-actions','add-tag'),
									_agile_get_translated_val('bulk-actions','add-tag') + "<br/><br/> " + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),

									show_add_tag_bulkaction_form, function()
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
							continueAction = false;
							showModalConfirmation(
									_agile_get_translated_val('contacts-view','add-tags'),
									_agile_get_translated_val('bulk-actions','limit-on-contacts'),
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
									},  _agile_get_translated_val('portlets','upgrade'), _agile_get_translated_val('contact-details','CLOSE'));
						}
						else
						{
							show_add_tag_bulkaction_form()
						}
					});
	},

	/**
	 * Bulk operations - Adds tags' Shows the existing tags with help of
	 * typeahead to add tags to the selected contacts. Also we can add new tags.
	 */
     remove_tags : function(e){
     	load_bulk_operations_template(function(){

					if (!canRunBulkOperations())
					{
						showModalConfirmation(
								_agile_get_translated_val('bulk-actions','remove-tag'),
								_agile_get_translated_val('bulk-actions','bulk-update-ur-contacts') + "<br/><br/> " + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),

								show_remove_tag_bulkaction_form, function()
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
						continueAction = false;
						showModalConfirmation(
								_agile_get_translated_val('contacts-view','remove-tags'),
								_agile_get_translated_val('bulk-actions','limit-on-contacts'),
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
								}, _agile_get_translated_val('portlets','upgrade'), _agile_get_translated_val('contact-details','CLOSE'));
					}
					else
					{
						show_remove_tag_bulkaction_form()
					}
				});
     },

     /**
	 * Bulk operations - Sends email to the bulk of contacts by filling up the
	 * send email details like from, subject and body.
	 */
     send_email : function(e){
     		load_bulk_operations_template(function(){

						// Selected Contact ids
						var id_array = get_contacts_bulk_ids();

						if (!canRunBulkOperations())
						{
							showModalConfirmation(
									_agile_get_translated_val('bulk-actions','bulk-email'),
									_agile_get_translated_val('bulk-actions','bulk-email-ur-contacts') + "<br/><br/> " + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),
									function()
									{
										show_bulk_email_form(id_array)
									},
									function()
									{
										// No callback
										return;
									}, function()
									{
										return;
									});
						}
						if (has_more_than_limit())
						{
							showModalConfirmation(
									_agile_get_translated_val('contact-details','send-email'),
									_agile_get_translated_val('billing', 'not-send->25email'),
									 function()
									{
										Backbone.history.navigate("workflows", { trigger : true })
									},  function()
									{
										// No callback
										return;
									}, function()
									{
										return;
									},_agile_get_translated_val('campaigns','go-to-campaign'),_agile_get_translated_val('contact-details','CLOSE'));
						}
						else
						{

							// when SELECT_ALL is true i.e., all contacts are
							// selected.
							if (id_array.length === 0)
								count = getAvailableContacts();
							else
								count = id_array.length;

							if (!canSendEmails(count))
							{
								var pendingEmails = getPendingEmails() + getEmailCreditsCount();

								var yes = _agile_get_translated_val('portlets', 'yes');
								var no = _agile_get_translated_val('portlets', 'no');

								var message = "";
								var upgrade_link = _agile_get_translated_val('contact-details','please') + '<a href="#subscribe" class="action text-info" data-dismiss="modal" subscribe="subscribe" action="deny">'+ _agile_get_translated_val('menu','upgrade') + '</a>' +  _agile_get_translated_val('billing','your-email-subscription');
								var emialErrormsg = '<div>' +_agile_get_translated_val("billing","continue-send-emails")+ ', '+_agile_get_translated_val('contact-details', 'please')+'<a href="#subscribe" class="action text-info" data-dismiss="modal" subscribe="subscribe" action="deny"> '+_agile_get_translated_val('menu', 'upgrade')+'</a>  ' +_agile_get_translated_val('billing','more')+ '.</div>';
								var title = _agile_get_translated_val('billing','not-enough-emails');
								if (pendingEmails <= 0)
								{
									title = _agile_get_translated_val('campaigns', 'emails-limit');
									yes = "";
									no = _agile_get_translated_val('reputation','Ok');
									message = "<div>" +_agile_get_translated_val('billing','email-quota-exceed')+ "</div> " + emialErrormsg;
								}
								else
									message = _agile_get_translated_val('billing','remaining-email') + " " + pendingEmails + " "+_agile_get_translated_val('billing','have-only')+" " + upgrade_link + _agile_get_translated_val('billing','not-send-email') + " <br/><br/>" + _agile_get_translated_val('deal-view','do-you-want-to-proceed');

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

							show_bulk_email_form(id_array)
						}
					});
     },


	/**
	 * Bulk Operations - Exports selected contacts in a CSV file as an
	 * attachment to email of current domain user.
	 */
     export_contacts : function(e){

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


						getTemplate('contacts-export-csv-modal', {}, undefined, function(template_ui){
							if(!template_ui)
								  return;
							var contacts_csv_modal = $(template_ui);
							contacts_csv_modal.modal('show');

							contacts_csv_modal.on('shown.bs.modal', function(){
									// If Yes clicked
									$("#contacts-export-csv-modal").on("click",'#contacts-export-csv-confirm', function(e)
									{
										e.preventDefault();

										if ($(this).attr('disabled'))
											return;

										$(this).attr('disabled', 'disabled');

										// Shows message
										$save_info = $('<img src="' + updateImageS3Path("img/1-0.gif") +'" height="18px" width="18px"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>' +_agile_get_translated_val('campaigns','email-will-be-sent-shortly')+ '</i></small></span>');
										$(this).parent('.modal-footer').find('.contacts-export-csv-message').append($save_info);
										$save_info.show();

										var url = '/core/api/contacts/export?action_type=EXPORT_CONTACTS_CSV';

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
											$('body').find('#bulk-action-btns button').addClass("disabled");
											$('table#contacts-table').find('.thead_check').removeAttr('checked');
											$('table#contacts-table').find('.tbody_check').removeAttr('checked');
											$(".grid-checkboxes").find(".thead_check").removeAttr("checked");
                                            $(".contacts-grid-view-temp").find(".tbody_check").removeAttr("checked");

										}, "no_noty");
									});
							});			


						}, null);
						
     },

     /**
	 * Bulk Operations - Exports selected contacts in a CSV file as an
	 * attachment to email of current domain user.
	 */
	export_companies : function(e)
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

				
				getTemplate('companies-export-csv-modal', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					var companies_csv_modal = $(template_ui);
					companies_csv_modal.modal('show');

					companies_csv_modal.on('shown.bs.modal', function(){
						// If Yes clicked
						$("#companies-export-csv-modal").on("click", '#companies-export-csv-confirm', function(e)
										{
											e.preventDefault();

											if ($(this).attr('disabled'))
												return;

											$(this).attr('disabled', 'disabled');

											// Shows message
											$save_info = $('<img src="img/1-0.gif" height="18px" width="18px"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>'+_agile_get_translated_val('campaigns','email-will-be-sent-shortly')+'</i></small></span>');
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
												$('table#companies,table#contacts-table').find('.thead_check').removeAttr('checked');
												$('table#companies,table#contacts-table').find('.tbody_check').removeAttr('checked');

											}, "no_noty");
										});
						});
				}, null);
			},


select_contacts :  function(e)
			{
				e.preventDefault();
				SELECT_ALL = true;
				_BULK_CONTACTS = window.location.hash;
				
				var html = '';
				
				var resultCount = getAvailableContacts();
				var limitValue = 10000;

				if(company_util.isCompany()){
					if(localStorage.getItem("dynamic_company_filter") != null || localStorage.getItem("company_filter") != null){				
						if(resultCount > limitValue){
							resultCount = limitValue + "+";
						}
					}
					html = ' '+_agile_get_translated_val('contacts','select-all')+' ' + resultCount + ' '+_agile_get_translated_val('contact-details','companies')+'. <a hrer="#" id="select-all-revert" class="c-p text-info">{{agile_lng_translate "companies" "select-choosen-only"}}</a>';
				}else{
					if(localStorage.getItem("dynamic_contact_filter") != null || localStorage.getItem("contact_filter") != null){				
						if(resultCount > limitValue){
							resultCount = limitValue + "+";
						}
					}
					html = ' '+_agile_get_translated_val('contacts','select-all')+' ' + resultCount + ' '+_agile_get_translated_val('contact-details','contacts')+'. <a hrer="#" id="select-all-revert" class="c-p text-info">{{agile_lng_translate "contacts" "select-choosen-only"}}</a>';
				}
				
				$('body')
						.find('#bulk-select')
						.css('display', 'inline-block')
						.html(html);

				// On choosing select all option, all the visible
				// checkboxes in the table should be checked
				$.each($('.tbody_check'), function(index, element)
				{
					$(element).attr('checked', "checked");
				});
			},

};


function show_bulk_owner_change_page()
	{
		var filter, id_array = [];
		if (SELECT_ALL == true)
			filter = getSelectionCriteria();
		else
			id_array = get_contacts_bulk_ids();

		// Yes callback
		// Bind a custom event to trigger on loading the form
		$("body").off('fill_owners').on("fill_owners", function(event)
		{
			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
			fillSelect('ownerBulkSelect', '/core/api/users/partial', 'domainUsers', 'no-callback ', optionsTemplate);
		});

		// Navigate to show form
		if(company_util.isCompany())
			Backbone.history.navigate("company-bulk-owner", { trigger : true });
		else
			Backbone.history.navigate("bulk-owner", { trigger : true });

		/**
		 * Changes the owner by sending the new owner name as path parameter and
		 * contact ids as form data of post request
		 */
		$("#changeOwnerToBulk").click(function(e)
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

			var new_owner = $('#ownerBulkSelect option:selected').prop('value');
			url = '/core/api/bulk/update?action_type=CHANGE_OWNER&owner=' + new_owner;
			var json = {};
			json.contact_ids = id_array;
			postBulkOperationData(url, json, $form, undefined, function(data)
			{
				enable_save_button(saveButton);
			}, _agile_get_translated_val('bulk-actions','owner-change-scheduled'))
		});

	}

	function show_bulk_campaign_assign_page()
	{

		load_bulk_operations_template(function(){

			var id_array = [];
			var filter;
			if (SELECT_ALL == true)
				filter = getSelectionCriteria();
			else
				id_array = get_contacts_bulk_ids();

			console.log(filter);

	        $("body").off('fill_campaigns').on("fill_campaigns", function(event)
			{
				var optionsTemplate = "<option value='{{id}}'{{#if is_disabled}}disabled=disabled>{{name}} ("+_agile_get_translated_val('campaigns','disabled')+"){{else}}>{{name}}{{/if}}</option>";
 				fillSelect('campaignBulkSelect', '/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate);
			});

			// Navigate to show form
			Backbone.history.navigate("bulk-campaigns", { trigger : true });

			/**
			 * Subscribes the selected contacts to a campaign by sending the
			 * workflow id and selected contacts' ids.
			 */
			$("#addBulkTocampaign").click(function(e)
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

				var workflow_id = $('#campaignBulkSelect option:selected').prop('value');
				var url = '/core/api/bulk/update?workflow_id=' + workflow_id + "&action_type=ASIGN_WORKFLOW";

				var json = {};
				json.contact_ids = id_array;
				postBulkOperationData(url, json, $form, undefined, function(data)
				{
					enable_save_button(saveButton);
				}, _agile_get_translated_val('campaigns','assigned'));
			});
		});
		
	}

	function show_add_tag_bulkaction_form()
	{
		var id_array = get_contacts_bulk_ids();

		// var tags = get_tags('tagsBulkForm');

		 if (company_util.isCompany()) {
        Backbone.history.navigate("company-bulk-tags", {
            trigger: true
        })
    } else {

		Backbone.history.navigate("bulk-tags", { trigger : true });
	}

		setup_tags_typeahead();

	/*	$('#addBulkTags')
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

						});  */
		/**
		 * Add the tags to the selected contacts by sending the contact ids and
		 * tags through post request to the appropriate url
		 */
		 $("#addTagsToContactsBulk").click(function(e)
		{
			e.preventDefault();

			var tags = get_tags('tagsBulkForm');

			// To add input field value as tags
			var tag_input = $('#addBulkTags').val().trim();
			$('#addBulkTags').val("");
			
			if(tag_input && tag_input.length>=0 && !(/^\s*$/).test(tag_input))
			{
				var template = Handlebars.compile('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="{{name}}">{{name}}<a class="close" id="remove_tag" tag="{{name}}">&times</a></li>');
			 	// Adds contact name to tags ul as li element
			 	$('#addBulkTags').closest(".control-group").find('ul.tags').append(template({name : tag_input}));
			}	
			
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

				acl_util.canAddTag(json.data,function(result){
					postBulkOperationData(url, json, $('#tagsBulkForm'), undefined, function(data)
							{
								enable_save_button(saveButton);
								// Add the added tags to the collection of tags
								$.each(tags[0].value, function(index, tag)
								{
									tagsCollection.add({ "tag" : tag });
								});
							}, _agile_get_translated_val('contacts','add-tag-scheduled'));
				}, function(error){
					enable_save_button(saveButton);
				});
			}
			else 
			{
				$('#addBulkTags').focus();
				$('.error-tags').show().delay(3000).hide(1);
				return;
			}
		});
	}

	function show_remove_tag_bulkaction_form()
	{
		var id_array = get_contacts_bulk_ids();

		// var tags = get_tags('tagsBulkForm');
		 if (company_util.isCompany()) {
        Backbone.history.navigate("company-bulk-tags-remove", {
            trigger: true
        })
    } else {

		Backbone.history.navigate("bulk-tags-remove", { trigger : true });
	}

		setup_tags_typeahead();

	/**	$('#removeBulkTags')
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
		
		 * Add the tags to the selected contacts by sending the contact ids and
		 * tags through post request to the appropriate url
		 */
		$("#removeTagsToContactsBulk").click(function(e)
						{
							e.preventDefault();

							var tags = get_tags('tagsRemoveBulkForm');

							// To add input field value as tags
							var tag_input = $('#removeBulkTags').val().trim();
							$('#removeBulkTags').val("");

							if (tag_input && tag_input.length >= 0 && !(/^\s*$/).test(tag_input))
							{
								var template = Handlebars.compile('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="{{name}}">{{name}}<a class="close" id="remove_tag" tag="{{name}}">&times</a></li>');
							 	// Adds contact name to tags ul as li element
							 	$('#removeBulkTags').closest(".control-group").find('ul.tags').append(template({name : tag_input}));
								
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
								}, _agile_get_translated_val('contacts','delete-tag-scheduled'));
							}
							else
							{
								$('#removeBulkTags').focus();
								$('.error-tags').show().delay(3000).hide(1);
								return;
							}
						});
	}


	function show_bulk_email_form(id_array)
	{
		var count = 0;

		// Selected Contact ids
		if(id_array && id_array.length == 0)
		id_array = get_contacts_bulk_ids();

        $("body").off('fill_emails').on("fill_emails", function(event)
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
			
			if(company_util.isCompany())
				$emailForm.find('div#bulk-count p').html(_agile_get_translated_val('companies-view','selected') +" <b>" + count + _agile_get_translated_val('companies-view','Companies') + " </b> " + _agile_get_translated_val('companies-view','for-sending-email'));
			else
				$emailForm.find('div#bulk-count p').html(_agile_get_translated_val('companies-view','selected') + " <b>" + count + _agile_get_translated_val('companies-view','Contacts') + " </b> " + _agile_get_translated_val('companies-view','for-sending-email'));

			// Hide to,cc and bcc
			$emailForm.find('input[name="to"]').closest('.control-group').attr('class', 'hidden');
			$emailForm.find('a#cc-link').closest('.control-group').attr('class', 'hidden');

			// Change ids of Send and Close button, to avoid normal send-email
			// actions.
			$emailForm.find('.form-actions a#sendEmail').removeAttr('id').attr('id', 'bulk-send-email');
			$emailForm.find('.form-actions a#send-email-close').removeAttr('id');

		});

		if(company_util.isCompany())
			Backbone.history.navigate("company-bulk-email", { trigger : true });
		else
			Backbone.history.navigate("bulk-email", { trigger : true });

		$("body #bulk-send-email").off("click");
		$("#bulk-send-email").click(function(e)
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

			var url = '/core/api/bulk/update?action_type=SEND_EMAIL';

			var json = {};
			json.contact_ids = id_array;
			json.data = JSON.stringify(form_json);
			
			var msg = _agile_get_translated_val('campaigns','emails-queued') + " " + count + " " +_agile_get_translated_val('contact-details','contacts')+ ". " + _agile_get_translated_val('campaigns','emails-sent-shortly');
			if(company_util.isCompany())
				msg = _agile_get_translated_val('campaigns','emails-queued') + " " + count + " " +_agile_get_translated_val('contact-details','companies')+ ". "+ _agile_get_translated_val('campaigns','emails-sent-shortly');

			postBulkOperationData(url, json, $form, null, function()
			{
				enable_send_button($('#bulk-send-email'));
			}, msg);
		});
	}

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
				id_array.push($(element).parent().parent().parent('div').attr('id'));
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

	console.log(_agile_get_prefs('contact_filter'));
	$('body').find('#bulk-select').css('display', 'none')
	if ($(clicked_ele).is(':checked'))
	{
		<!--$('body').find('#bulk-actions').css('display', 'inline-block');-->


		var resultCount = 0;
		var appCount = 0;
		var limitValue = 10000;		

		if(company_util.isCompany()){
			$("#bulk-action-btns button").removeClass("disabled");
			resultCount = App_Companies.companiesListView.collection.length;
			appCount = total_available_contacts;

			if (isBulk && appCount != resultCount){
				if(localStorage.getItem("dynamic_company_filter") != null || localStorage.getItem("company_filter") != null){				
					if(resultCount > limitValue){
						resultCount = limitValue + "+";
					}

					if(appCount > limitValue){
						appCount = limitValue + "+";
					}
				}

				$('body').find('#bulk-select').css('display', 'block')
				.html(_agile_get_translated_val('companies-view','selected') + " " + resultCount + " " +_agile_get_translated_val('contact-details', 'companies')+ ". <a id='select-all-available-contacts' class='c-p text-info' href='#'>" +_agile_get_translated_val('contacts','select-all')+ " " + appCount + " " +_agile_get_translated_val('contact-details', 'companies')+ "</a>");
				$('#bulk-select').css("display","block");
			}
		}else{
			$("#bulk-action-btns button").removeClass("disabled");
			resultCount = App_Contacts.contactsListView.collection.length;
			appCount = total_available_contacts;

			if (isBulk && total_available_contacts != resultCount){
				if(localStorage.getItem("dynamic_contact_filter") != null || localStorage.getItem("contact_filter") != null){	
					if(resultCount > limitValue){
						resultCount = limitValue + "+";
					}

					if(appCount > limitValue){
						appCount = limitValue + "+";
					}
				}

				$('body').find('#bulk-select').css('display', 'block')
				.html(_agile_get_translated_val('companies-view','selected') + " " + resultCount + " " +_agile_get_translated_val('contact-details', 'contacts')+ ". <a id='select-all-available-contacts' class='c-p text-info' href='#'>" +_agile_get_translated_val('contacts','select-all')+ " " + appCount + " " +_agile_get_translated_val('contact-details', 'contacts')+ "</a>");
				$('#bulk-select').css("display","block");
			}			
		}
		
	}
	else
	{
		if (isBulk)
		{
			if(company_util.isCompany())
			{
				$("#bulk-action-btns button").addClass("disabled");
				$("#companiesTabelView").removeClass("disabled");
			}
			else
			{
				$("#bulk-action-btns button").addClass("disabled");
				$("#contactTabelView").removeClass("disabled");
			}
				
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
			
				$("#bulk-action-btns button").addClass("disabled");
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
		if (company_util.isCompany() && App_Companies.companiesListView.collection.toJSON()[0] && App_Companies.companiesListView.collection.toJSON()[0].count)
		{
			//
			current_view_contacts_count = App_Companies.companiesListView.collection.toJSON()[0].count;
			return current_view_contacts_count;
		} else if (App_Contacts.contactsListView.collection.toJSON()[0] && App_Contacts.contactsListView.collection.toJSON()[0].count)
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

	var filter_id = undefined;
	
	if(company_util.isCompany())
		filter_id = $('.filter-criteria', $(App_Companies.companiesListView.el)).attr("_filter");
	else
		filter_id = $('.filter-criteria', $(App_Contacts.contactsListView.el)).attr("_filter");

	if (filter_id && _BULK_CONTACTS == "#contacts")
	{
		return filter_id;
	}
	
	if(_BULK_CONTACTS == "#companies"){
		if(filter_id)
			return filter_id;
		else
			return _agile_get_translated_val('menu','menu-companies');
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
	var count = data.contact_ids.length;
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

		$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>' +_agile_get_translated_val('bulk-actions','task-scheduled')+'.</i></p></small></div>');

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

		if(!company_util.isCompany())
			// On save back to contacts list
			Backbone.history.navigate("contacts", { trigger : true });
		else
			Backbone.history.navigate("companies", { trigger : true });

		// If no_noty is given as error message, neglect noty
		if (error_message === "no_noty")
			return;

		if (!error_message)
		{
			showNotyPopUp('information', _agile_get_translated_val('bulk-actions','task-scheduled'), "top", 5000);
			return;
		}
		if(count > 20 || count == 0)
			showNotyPopUp('information', error_message, "top", 5000);
	} });
}

function getDynamicFilters()
{
	var dynamic_filter = null;
	
	if (company_util.isCompany())
	{
		if(!App_Companies.companiesListView || !App_Companies.companiesListView.post_data)
		{
			return null;
		}
		
		dynamic_filter = App_Companies.companiesListView.post_data.filterJson;
	}
	else
	{
		if(!App_Contacts.contactsListView || !App_Contacts.contactsListView.post_data)
		{
			return null;
		}
		
		dynamic_filter = App_Contacts.contactsListView.post_data.filterJson;;
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


function load_bulk_operations_template(callback){

	getTemplate("bulk-actions-company-owner", {}, undefined, function(template_ui){
				if(callback)
				   callback();

	}, null);

}
