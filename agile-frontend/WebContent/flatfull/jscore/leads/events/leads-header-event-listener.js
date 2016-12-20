/**
 * Creates backbone model events view with leads header 
 * events view like add lead, toogle view etc...
 */
var Leads_Header_Events_View = Base_Model_View.extend({
    events: {
    	'click #add-lead' : 'addLead',
    	'click .leads-view' : 'toggleLeadsView',
    	'click #leadTabelView' : 'toggleLeadsListView',
    	'click .leadcolumn' : 'addOrRemoveLeadColumns',
    	'click .toggle-lead-filters' : 'toggleLeadFilters',
        'click #bulk-tags' : 'bulkActionAddTags',
        'click #bulk-tags-remove' : 'bulkActionRemoveTags',
        'click #bulk-owner' : 'bulkOwnerChange',
        'click #bulk-delete' : 'leadsBulkDelete',
        'click #bulk-export' : 'leadsExport',
        'click #bulk-email' : 'leadsBulkEmailSend',
        'click #bulk-status' : 'bulkStatusChange',
        'click #select-all-available-leads' : 'selectAllLeads',
        'click #select-all-revert' : 'selectChoosenLeads',
    },

    addLead : function(e)
    {
        e.preventDefault();
    	addLeadBasedOnCustomfields();
    },

    toggleLeadsView : function(e)
    {
    	e.preventDefault();
    	LEADS_HARD_RELOAD=true;
		var data=$(e.currentTarget).attr("data");
		if(data == "list"){
			_agile_delete_prefs("agile_lead_view");
			$("#leadTabelView").show();
		}
		else if(data == "grid"){
			_agile_set_prefs("agile_lead_view","grid-view");
			$("#leadTabelView").hide();
		}
		/*if(_agile_get_prefs("contacts_tag")){
			App_Leads.leadsViewLoader.getLeads(App_Leads.leadViewModel, $("#content"), _agile_get_prefs("contacts_tag"));
			return;
		}*/
		$(".thead_check", $("#contacts-listener-container")).prop("checked", false);
		App_Leads.leadsViewLoader.getLeads(App_Leads.leadViewModel, $("#content"));
    },

    toggleLeadsListView : function(e)
    {
    	if(_agile_get_prefs("leadTabelView")){
    		_agile_delete_prefs("leadTabelView");
    		$(e.currentTarget).find("i").removeClass("fa fa-ellipsis-h");
    		$(e.currentTarget).find("i").addClass("fa fa-navicon");
    	}
    	else{
    		_agile_set_prefs("leadTabelView","true");
    		$(e.currentTarget).find("i").removeClass("fa fa-navicon");
    		$(e.currentTarget).find("i").addClass("fa fa-ellipsis-h");
    	}
    	$(e.currentTarget).parent().parent().toggleClass("compact");
    	App_Leads.leadsViewLoader.disableBulkActionBtns();
        App_Leads.leadsViewLoader.getLeads(App_Leads.leadViewModel, $("#content"));
    },

    addOrRemoveLeadColumns : function(e)
    {
    	e.preventDefault();
    	var $checkboxInput = $(e.currentTarget).find("input");
        if(CURRENT_USER_PREFS.theme == "15"){
        	if($checkboxInput.is(":checked"))
        	{
        		$checkboxInput.prop("checked", false);
        	}
        	else
        	{
        		$checkboxInput.prop("checked", true);
        	}
        }
    	var json = serializeForm("lead-static-fields");
		$.ajax({
			url : 'core/api/contact-view-prefs/lead',
			type : 'PUT',
			contentType : 'application/json',
			dataType : 'json',
			data :JSON.stringify(json),
			success : function(data)
			{
                App_Leads.leadsViewLoader.disableBulkActionBtns();
                
				App_Leads.leadViewModel = data;
				App_Leads.leadsViewLoader.fetchHeadings(function(modelData){
					App_Leads.leadsViewLoader.getLeads(modelData, $("#content"));
				});
			} 
		});
    },

    toggleLeadFilters : function(e)
    {
    	if (_agile_get_prefs("hide_leads_lhs_filter")) 
        {
            _agile_delete_prefs("hide_leads_lhs_filter");
            $(e.currentTarget).attr("data-original-title", "Hide Filters").tooltip("hide");
        } 
        else 
        {
            _agile_set_prefs("hide_leads_lhs_filter", true);
            $(e.currentTarget).attr("data-original-title", "Show Filters").tooltip("hide");
        }

        if ($('#leads-lhs-filters-toggle', $("#content")).is(':visible'))
		{
			$('#leads-lhs-filters-toggle', $("#content")).hide("slow");
			_agile_set_prefs(LEADS_DYNAMIC_FILTER_COOKIE_STATUS, "hide");
		}
		else
		{
			$('#leads-lhs-filters-toggle', $("#content")).show("slow");
			_agile_set_prefs(LEADS_DYNAMIC_FILTER_COOKIE_STATUS, "show");
		}
    },

    bulkActionAddTags :  function(e){
        e.preventDefault();
        App_Leads.idArray = App_Leads.leadsBulkActions.getLeadsBulkIds();
        if (!canRunBulkOperations())
        {
            showModalConfirmation(
                _agile_get_translated_val('bulk-actions','add-tag'),
                _agile_get_translated_val('bulk-actions','add-tag') + "<br/><br/> " + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),

                function()
                {
                    Backbone.history.navigate("lead-bulk-tags", { trigger : true });
                }, 
                function()
                {
                    return;
                }
            );
        }

        if (is_free_plan() && has_more_than_limit())
        {
            showModalConfirmation(
                _agile_get_translated_val('contacts-view','add-tags'),
                _agile_get_translated_val('bulk-actions','limit-on-contacts'),
                function()
                {
                    Backbone.history.navigate("subscribe", { trigger : true });
                }, function()
                {
                    return;
                }, function()
                {
                    return;
                },  
                _agile_get_translated_val('portlets','upgrade'), 
                _agile_get_translated_val('contact-details','CLOSE')
            );
        }
        else
        {
            Backbone.history.navigate("lead-bulk-tags", { trigger : true });
        }
    },

    bulkActionRemoveTags : function(e)
    {
        e.preventDefault();
        App_Leads.idArray = App_Leads.leadsBulkActions.getLeadsBulkIds();
        if (!canRunBulkOperations())
        {
            showModalConfirmation(
                _agile_get_translated_val('bulk-actions','remove-tag'),
                _agile_get_translated_val('bulk-actions','bulk-update-ur-contacts') + "<br/><br/> " + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),
                function()
                {
                    Backbone.history.navigate("lead-bulk-tags-remove", { trigger : true });
                }, function()
                {
                    return;
                }
            );
        }
        if (is_free_plan() && has_more_than_limit())
        {
            showModalConfirmation(
                _agile_get_translated_val('contacts-view','remove-tags'),
                _agile_get_translated_val('bulk-actions','limit-on-contacts'),
                function()
                {
                    Backbone.history.navigate("subscribe", { trigger : true });
                }, function()
                {
                    return;
                }, function()
                {
                    return;
                }, 
                _agile_get_translated_val('portlets','upgrade'), 
                _agile_get_translated_val('contact-details','CLOSE')
            );
        }
        else
        {
            Backbone.history.navigate("lead-bulk-tags-remove", { trigger : true });
        }
    },

    bulkOwnerChange : function(e)
    {
        e.preventDefault();
        App_Leads.idArray = App_Leads.leadsBulkActions.getLeadsBulkIds();
        if (!canRunBulkOperations())
        {
            showModalConfirmation(
                _agile_get_translated_val('bulk-actions','change-owner'),
                _agile_get_translated_val('bulk-actions','no-pem-to-change-owners') + "<br/><br/> " + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),
                function()
                {
                    Backbone.history.navigate("lead-bulk-owner", { trigger : true });
                }, function()
                {
                    return;
                }
            );
        }
        else
        {
            Backbone.history.navigate("lead-bulk-owner", { trigger : true });
        }
    },

    leadsBulkDelete : function(e)
    {
        e.preventDefault();

        var url = '/core/api/contacts/delete?action=DELETE';
        var json = {};
        json.contact_ids = App_Leads.leadsBulkActions.getLeadsBulkIds();

        var confirm_msg = _agile_get_translated_val("others", "delete-warn");
        // Shows confirm alert, if Cancel clicked, return false
        showAlertModal(confirm_msg, "confirm", function(){
            $(e.currentTarget).append('<img class="bulk-delete-loading" style="width:15px;" src= "'+updateImageS3Path("img/21-0.gif")+'"></img>');
            App_Leads.leadsBulkActions.postBulkOperationData(url, json, undefined, undefined, function(data)
            {
                
            }, Handlebars.compile("{{agile_lng_translate 'bulk-actions' 'leads-delete-scheduled'}}"));
        }, undefined, _agile_get_translated_val("bulk-delete", "bulk-delete"));
    },

    leadsExport : function(e)
    {
        e.preventDefault();

        // Removes if previous modals exist.
        if ($('#leads-export-csv-modal').size() != 0)
        {
            $('#leads-export-csv-modal').remove();
        }

        // Selected Lead ids
        var id_array = App_Leads.leadsBulkActions.getLeadsBulkIds();

        var count = 0;

        // when SELECT_ALL is true i.e., all contacts are
        // selected.
        if (id_array.length === 0)
            count = App_Leads.leadsBulkActions.getAvailableLeads();
        else
            count = id_array.length;


        getTemplate('leads-export-csv-modal', {}, undefined, function(template_ui){
            if(!template_ui)
                  return;
            var leads_csv_modal = $(template_ui);
            leads_csv_modal.modal('show');

            leads_csv_modal.on('shown.bs.modal', function(){
                // If Yes clicked
                $("#leads-export-csv-modal").on("click",'#leads-export-csv-confirm', function(e)
                {
                    e.preventDefault();

                    if ($(this).attr('disabled'))
                        return;

                    $(this).attr('disabled', 'disabled');

                    // Shows message
                    $save_info = $('<img src="' + updateImageS3Path("img/1-0.gif") +'" height="18px" width="18px"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>' +_agile_get_translated_val('campaigns','email-will-be-sent-shortly')+ '</i></small></span>');
                    $(this).parent('.modal-footer').find('.leads-export-csv-message').append($save_info);
                    $save_info.show();

                    var url = '/core/api/contacts/leads-export?action_type=EXPORT_LEADS_CSV';

                    var json = {};
                    json.contact_ids = id_array;
                    json.data = JSON.stringify(CURRENT_DOMAIN_USER);
                    App_Leads.leadsBulkActions.postBulkOperationData(url, json, undefined, undefined, function()
                    {

                        // hide modal after 3 secs
                        setTimeout(function()
                        {
                            leads_csv_modal.modal('hide');
                        }, 3000);

                        // Uncheck leads table and
                        // hide bulk actions button.
                        $('body').find('#bulk-actions').css('display', 'none');
                        $('body').find('#bulk-select').css('display', 'none');
                        $('body').find('#bulk-action-btns button').addClass("disabled");
                        $('body').find('#bulk-action-btns').find('.thead_check').removeAttr('checked');
                        $('table#leads-table').find('.tbody_check').removeAttr('checked');

                    }, "no_noty");
                });
            });         


        }, null);
    },

    leadsBulkEmailSend : function(e)
    {
        // Selected Contact ids
        var id_array = App_Leads.leadsBulkActions.getLeadsBulkIds();

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
                }
            );
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
                },
                _agile_get_translated_val('campaigns','go-to-campaign'),
                _agile_get_translated_val('contact-details','CLOSE')
            );
        }
        else
        {

            // when SELECT_ALL is true i.e., all contacts are
            // selected.
            if (id_array.length === 0)
                count = App_Leads.leadsBulkActions.getAvailableLeads();
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
                    message = "<div>" +_agile_get_translated_val('billing','email-quota-exceed')+ "</div> " + (_agile_is_user_from_iphone() ? "" : emialErrormsg);
                }
                else{
                    message = _agile_get_translated_val('billing','remaining-email') + " " + pendingEmails + " "+_agile_get_translated_val('billing','have-only')+" " 
                    if(!_agile_is_user_from_iphone())
                        message += upgrade_link + _agile_get_translated_val('billing','not-send-email'); 
                    
                    message +=  " <br/><br/>" + _agile_get_translated_val('deal-view','do-you-want-to-proceed');
                }
                    
                showModalConfirmation(title, message, App_Leads.leadsBulkActions.showBulkEmailForm, function(element)
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

            App_Leads.leadsBulkActions.showBulkEmailForm(id_array);
        }
    },

    bulkStatusChange : function(e)
    {
        e.preventDefault();
        App_Leads.idArray = App_Leads.leadsBulkActions.getLeadsBulkIds();
        if (!canRunBulkOperations())
        {
            showModalConfirmation(
                "{{agile_lng_translate 'leads-view' 'change-status'}}",
                _agile_get_translated_val('bulk-actions','no-pem-to-change-owners') + "<br/><br/> " + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),
                function()
                {
                    Backbone.history.navigate("lead-bulk-status", { trigger : true });
                }, function()
                {
                    return;
                }
            );
        }
        else
        {
            Backbone.history.navigate("lead-bulk-status", { trigger : true });
        }
    },

    selectAllLeads : function(e)
    {
        e.preventDefault();
        App_Leads.leadsBulkActions.SELECT_ALL_LEADS = true;
        App_Leads.leadsBulkActions.BULK_LEADS = window.location.hash;
        
        var html = '';
        
        var resultCount = App_Leads.leadsBulkActions.getAvailableLeads();
        var limitValue = 10000;

        if(localStorage.getItem("dynamic_lead_filter") != null || localStorage.getItem("lead_filter") != null)
        {               
            if(resultCount > limitValue)
            {
                resultCount = limitValue + "+";
            }
        }
        html = ' Selected All ' + resultCount + ' leads. <a hrer="#" id="select-all-revert" class="c-p text-info">Select chosen leads only</a>';
        
        $('body').find('#bulk-select').css('display', 'inline-block').html(html);

        $.each($('.tbody_check'), function(index, element)
        {
            $(element).attr('checked', "checked");
        });
    },

    selectChoosenLeads : function(e)
    {
        e.preventDefault();
        App_Leads.leadsBulkActions.SELECT_ALL_LEADS = true;
        App_Leads.leadsBulkActions.BULK_LEADS = undefined;
        
        var html = '';

        var limitValue = 10000;     
        var resultCount = App_Leads.leadsListView.collection.length;
        var appCount = App_Leads.leadsBulkActions.getAvailableLeads();

        if(localStorage.getItem("dynamic_lead_filter") != null || localStorage.getItem("lead_filter") != null) {              
            
            if(resultCount > limitValue)
            {
                resultCount = limitValue + "+";
            }

            if(appCount > limitValue)
            {
                appCount = limitValue + "+";
            }

        }

        html = "Selected " + resultCount + " leads. <a href='#'  id='select-all-available-leads' class='c-p text-info'>Select all " + appCount + " leads</a>";

        $('body').find('#bulk-select').html(html);
    }

});