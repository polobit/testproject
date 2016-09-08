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
        'click #bulk-email' : 'leadsBulkEmailSend'
    },

    addLead : function(e)
    {
        e.preventDefault();
    	var newLeadModalView = new Leads_Form_Events_View({ data : {}, template : "new-lead-modal", isNew : true,
            postRenderCallback : function(el)
            {
                leadsViewLoader = new LeadsViewLoader();
                leadsViewLoader.setupSources(el);
                leadsViewLoader.setupStatuses(el);
                setup_tags_typeahead(undefined, el);
                var fxn_display_company = function(data, item)
                {
                    $("#new-lead-modal [name='lead_company_id']").html('<li class="inline-block tag btn btn-xs btn-primary m-r-xs m-b-xs" data="' + data + '"><span><a class="text-white m-r-xs" href="#contact/' + data + '">' + item + '</a><a class="close" id="remove_tag">&times</a></span></li>');
                }
                agile_type_ahead("lead_company", $("#new-lead-modal"), contacts_typeahead, fxn_display_company, 'type=COMPANY', '<b>'+_agile_get_translated_val("others","no-results")+'</b> <br/> ' + _agile_get_translated_val("others","add-new-one"));
            }
        });
		$("#new-lead-modal").html(newLeadModalView.render().el).modal("show");
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
		if(_agile_get_prefs("contacts_tag")){
			App_Leads.leadsViewLoader.getLeads(App_Leads.leadViewModel, $("#content"), _agile_get_prefs("contacts_tag"));
			return;
		}
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
    	$(".thead_check", $("#content")).prop("checked", false);
		App_Leads.leadsViewLoader.getLeads(App_Leads.leadViewModel, $("#content"));
    },

    addOrRemoveLeadColumns : function(e)
    {
    	e.preventDefault();
    	var $checkboxInput = $(e.currentTarget).find("input");
    	if($checkboxInput.is(":checked"))
    	{
    		$checkboxInput.prop("checked", false);
    	}
    	else
    	{
    		$checkboxInput.prop("checked", true);
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

        var url = '/core/api/bulk/update?action_type=DELETE';
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
                    message = "<div>" +_agile_get_translated_val('billing','email-quota-exceed')+ "</div> " + emialErrormsg;
                }
                else
                    message = _agile_get_translated_val('billing','remaining-email') + " " + pendingEmails + " "+_agile_get_translated_val('billing','have-only')+" " + upgrade_link + _agile_get_translated_val('billing','not-send-email') + " <br/><br/>" + _agile_get_translated_val('deal-view','do-you-want-to-proceed');

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
    }

});

var Leads_Form_Events_View = Base_Model_View.extend({
    events: {
    	'click #lead_validate' : 'validateLead',
    	'click #continue-lead' : 'continueLead'
    },

    validateLead : function(e)
    {
    	e.preventDefault();
    	serialize_and_save_continue_lead(e, 'leadForm', 'new-lead-modal', false, e.currentTarget, 'tags_source_lead_modal');
    },

    continueLead : function(e)
    {
    	e.preventDefault();
    	serialize_and_save_continue_lead(e, 'leadForm', 'new-lead-modal', true, e.currentTarget, 'tags_source_lead_modal');
    }

});

var Leads_LHS_Filters_Events_View = Base_Model_View.extend({
    events: {
        'click a.filter-multiple-add-lhs' : 'addMultipleFilters',
        'click i.filter-tags-multiple-remove-lhs' : 'removeMultipleFilters',
        'click a.clear-filter-condition-lhs' : 'clearFilterCondition',
        'click #clear-lhs-lead-filters' : 'clearAllFilters',
        'click #lhs-filters-header' : 'toggleFiltersHeader',
        'change select[name="CONDITION"]' : 'onConditionChange',
        'custom_blur #lhs-lead-filter-form #RHS input.filters-tags-typeahead:not(.date), keyup #lhs-lead-filter-form #RHS input.filters-tags-typeahead:not(.date)' : 'onTagAdd',
        'custom_blur #lhs-lead-filter-form #RHS input.typeahead_contacts:not(.date)' : 'onTagSelect',
        'click #remove_contact_in_lhs' : 'removeContact',
        'blur #lhs-lead-filter-form #RHS input:not(.date,.filters-tags-typeahead,.typeahead_contacts), keyup #lhs-lead-filter-form #RHS input:not(.date,.filters-tags-typeahead,.typeahead_contacts)' : 'onRHSChangeWithoutDateAndTags',
        'change #lhs-lead-filter-form #RHS input.date, keyup #lhs-lead-filter-form #RHS input.date' : 'onFilterDateChange',
        'change #lhs-lead-filter-form #RHS select' : 'onRHSChange',
        'change #lhs-lead-filter-form #RHS_NEW select' : 'onRHSNEWChange',
        'bulr #lhs-lead-filter-form #RHS_NEW input:not(.date), keyup #lhs-lead-filter-form #RHS_NEW input:not(.date)' : 'onRHSNEWNotDateChange',
        'change #lhs-lead-filter-form #RHS_NEW input.date, keyup #lhs-lead-filter-form #RHS_NEW input.date' : 'onRHSNEWDateChange',
        'click #leads-left-filters-toggle' : 'toggleFilters'
    },

    addMultipleFilters : function(e)
    {
        e.preventDefault();
        var fieldName = $(e.currentTarget).data('name');
        var htmlContent = $('#' + fieldName + '-lhs-filter-table').find("div.hide.master-" + fieldName + "-add-div").clone();
        htmlContent.removeClass('hide').addClass("lhs-lead-filter-row");
        if (fieldName == 'tags')
        {
            addTagsTypeaheadLhs(htmlContent);
        }
        scramble_filter_input_names(htmlContent);
        $(htmlContent).appendTo('#' + fieldName + '-lhs-filter-table');
        $('#' + fieldName + '-lhs-filter-table').find("div.lhs-contact-filter-row:last").find('#RHS:visible').find(':not(input.date)').focus();
    },

    removeMultipleFilters : function(e)
    {
        var container = $(e.currentTarget).parents('.lhs-contact-filter-row');
        $(container).find('#RHS').children().val("").trigger('blur').trigger('custom_blur').trigger('change').trigger('custom_change');
        $(e.currentTarget).closest('div.lhs-contact-filter-row').remove();

    },

    clearFilterCondition : function(e)
    {
        $(e.currentTarget).addClass('hide');
        var container = $(e.currentTarget).parents('.lhs-contact-filter-row');
        $(container).find('#RHS:not(.no-filter-action)').children().val("").attr('prev-val', "");
        $(container).find('#RHS').children().val("").attr('prev-val', "").attr('data', "");
        $(container).find('#RHS_NEW').filter(visibleFilter).children().val("").attr('prev-val', "");
        $(container).find('select[name="CONDITION"]').val($(container).find('select[name="CONDITION"] option:first').val()).attr('prev-val', "");
        $(container).find('select[name="CONDITION"]').trigger('change');
        $(container).find('a#lhs-filters-header').find('i').toggleClass('fa-plus-square-o').toggleClass('fa-minus-square-o');
        $(container).find('a#lhs-filters-header').next().addClass('hide');
        if($(container).find('#RHS').find('ul.custom_contacts').find('li'))
        {
            $(container).find('#RHS').find('ul.custom_contacts').find('li').remove();
        }
        if($(container).find('#RHS').find('ul.custom_companies').find('li'))
        {
            $(container).find('#RHS').find('ul.custom_companies').find('li').remove();
        }
        submitLeadLhsFilters();
    },

    clearAllFilters : function(e)
    {
        e.preventDefault();
        if(_agile_get_prefs('dynamic_lead_filter'))
        {
            _agile_delete_prefs('dynamic_lead_filter');
            LEADS_HARD_RELOAD = true;
            $("#lhs-lead-filter-form")[0].reset();
            $(".filters-tags-typeahead", $("#lhs-lead-filter-form")).removeAttr("prev-val");
            $(".lhs-row-filter > a", $("#lhs-lead-filter-form")).each(function(){
                $(this).removeClass("bold-text");
                $(this).find('i').addClass('fa-plus-square-o').removeClass('fa-minus-square-o');
                $(this).siblings().addClass('hide');
            });
            App_Leads.leadsViewLoader.getLeads(App_Leads.leadViewModel, $("#content"));
        }
    },

    toggleFiltersHeader : function(e)
    {
        e.preventDefault();
        $(e.currentTarget).find('i').toggleClass('fa-plus-square-o').toggleClass('fa-minus-square-o');
        $(e.currentTarget).next().toggleClass('hide');
        $(e.currentTarget).next().find('.lhs-contact-filter-row:visible').find('#RHS').filter(visibleFilter).find(':not(input.date)').focus();
    },

    onConditionChange : function(e)
    {
        var selected = $(e.currentTarget).val();
        if ($(e.currentTarget).parent().find('div.condition_container.' + selected).find('#RHS').children().first().hasClass('custom_contacts') || 
            $(e.currentTarget).parent().find('div.condition_container.' + selected).find('#RHS').children().first().hasClass('custom_companies'))
        {
            $(e.currentTarget).parent().find("div.IN").removeClass("hide");
            $(e.currentTarget).parent().find("div.EQUALS").addClass("hide");
            $(e.currentTarget).parent().find("div.EQUALS").find("input").val("").attr("data", "");
            return;
        }
        if ($(e.currentTarget).parent().find('div.condition_container.' + selected).find('#RHS').children().first().hasClass('custom_contact') || 
            $(e.currentTarget).parent().find('div.condition_container.' + selected).find('#RHS').children().first().hasClass('custom_company'))
        {
            $(e.currentTarget).parent().find("div.IN").addClass("hide");
            $(e.currentTarget).parent().find("div.EQUALS").removeClass("hide");
            if (!$(e.currentTarget).parent().find("div.EQUALS").find("input").val())
            {
                return;
            }
        }
        $(e.currentTarget).parent().find('div.condition_container').addClass('hide');
        $(e.currentTarget).parent().find('div.condition_container.' + selected).removeClass('hide');
        $(e.currentTarget).parent().find('div.condition_container.' + selected).find('#RHS :not(input.date)').focus();
        var rhs = $(e.currentTarget).parent().find('div.condition_container.' + selected).find('#RHS').children().first().val();
        if ($(e.currentTarget).parent().find('div.condition_container.' + selected).find('#RHS').children().first().hasClass('custom_contact') || 
            $(e.currentTarget).parent().find('div.condition_container.' + selected).find('#RHS').children().first().hasClass('custom_company'))
        {
            rhs = $(e.currentTarget).parent().find('div.condition_container.' + selected).find('#RHS').find('input').attr("data");
        }
        var rhs_new_exist = false;
        var rhs_new = "";
        if ($(e.currentTarget).parent().find('div.condition_container.' + selected).find('#RHS_NEW') != undefined)
        {
            rhs_new_exist = true;
            rhs_new = $(e.currentTarget).parent().find('div.condition_container.' + selected).find('#RHS_NEW').children().first().val();
        }
        if (rhs != "" && (rhs != undefined || selected == "DEFINED" || selected == "NOT_DEFINED") && (!rhs_new_exist || rhs_new != ""))
        {
            submitLeadLhsFilters();
        }
    },

    onTagAdd : function(e)
    {
        var container = e.currentTarget;
        if (e.type == 'custom_blur' || e.type == 'focusout' || e.keyCode == '13')
        {
            var prevVal = $(container).attr('prev-val');
            var currVal = $(container).val().trim();
            if (prevVal == currVal)
            {
                return;
            }
            else
            {
                $(container).attr('prev-val', currVal);
            }
            if ($(container).parent().next().attr("id") == "RHS_NEW")
            {
                if ($(container).parent().next().find('input').val() != "" && currVal != "")
                {
                    submitLeadLhsFilters();
                    $(container).blur();
                }
            }
            else
            {
                if (currVal == "")
                {
                    var container = $(container).parents('.lhs-contact-filter-row');
                    $(container).find('a.clear-filter-condition-lhs').addClass('hide');
                }
                submitLeadLhsFilters();
                $(container).blur();
            }
        }
    },

    onTagSelect : function(e)
    {
        var container = e.currentTarget;
        var prevVal = $(container).attr('prev-val');
        var currVal = $(container).val().trim();
        $(container).attr('prev-val', currVal);
        submitLeadLhsFilters();
        $(container).blur();
    },

    removeContact : function(e)
    {
        $(e.currentTarget).parent().remove();
        submitLeadLhsFilters();
    },

    onRHSChangeWithoutDateAndTags : function(e)
    {   
        var container = e.currentTarget;
        if(!$('#lhs_filters_segmentation #error-message').hasClass("hide"))
        {
            $('#lhs_filters_segmentation #error-message').addClass("hide");
        }
        
        if (e.type == 'focusout' || e.keyCode == '13')
        {
            var prevVal = $(container).attr('prev-val');
            var currVal = $(container).val().trim();
            if (prevVal == currVal)
            {
                return;
            }
            else
            {
                $(container).attr('prev-val', currVal);
            }
            if ($(container).parent().next().attr("id") == "RHS_NEW")
            {
                if ($(container).parent().next().find('input').val() != "" && currVal != "")
                {
                    submitLeadLhsFilters();
                    $(container).blur();
                }
            }
            else
            {
                if (currVal == "")
                {
                    var container = $(container).parents('.lhs-contact-filter-row');
                    $(container).find('a.clear-filter-condition-lhs').addClass('hide');
                }
                submitLeadLhsFilters();
                $(container).blur();
            }
        }
    },

    onFilterDateChange : function(e)
    {
        var container = e.currentTarget;
        if (e.type == 'change' || e.keyCode == '13')
        {
            var prevVal = $(container).attr('prev-val');
            var currVal = $(container).val().trim();
            if (prevVal == currVal)
            {
                return;
            }
            else
            {
                $(container).attr('prev-val', currVal);
            }
            if ($(container).parent().next().attr("id") == "RHS_NEW")
            {
                if ($(container).parent().next().find('input').val() != "" && currVal != "")
                {
                    submitLeadLhsFilters();
                    $(container).blur();
                }
            }
            else
            {
                if (currVal == "")
                {
                    var container = $(container).parents('.lhs-contact-filter-row');
                    $(container).find('a.clear-filter-condition-lhs').addClass('hide');
                }
                submitLeadLhsFilters();
                $(container).blur();
            }
        }
    },

    onRHSChange : function(e)
    {
        var container = e.currentTarget;
        if ($(container).parent().next().attr("id") == "RHS_NEW")
        {
            if ($(container).val() != "" && $(container).parent().next().children().val() != "")
            {
                submitLeadLhsFilters();
            }
            if ($(container).val() == "" && $(container).parent().next().children().val() == "")
            {
                var container = $(container).parents('.lhs-contact-filter-row');
                $(container).find('a.clear-filter-condition-lhs').addClass('hide');
                submitLeadLhsFilters();
            }
        }
        else
        {
            var prevVal = $(container).attr('prev-val');
            var currVal = $(container).val().trim();
            if (prevVal == currVal)
            {
                return;
            }
            else
            {
                $(container).attr('prev-val', currVal);
            }
            if ($(container).val() == "")
            {
                var container = $(container).parents('.lhs-contact-filter-row');
                $(container).find('a.clear-filter-condition-lhs').addClass('hide');
            }
            submitLeadLhsFilters();
        }
        $(container).blur();
    },

    onRHSNEWChange : function(e)
    {
        var container = e.currentTarget;
        if ($(container).parent().prev().attr("id") == "RHS")
        {
            if ($(container).val() != "" && $(container).parent().prev().children().val() != "")
            {
                submitLeadLhsFilters();
            }
            if ($(container).val() == "" && $(container).parent().prev().children().val() == "")
            {
                submitLeadLhsFilters();
            }
        }
        else
        {
            submitLeadLhsFilters();
        }
        $(container).blur();
    },

    onRHSNEWNotDateChange : function(e)
    {
        var container = e.currentTarget;
        if (e.type == 'focusout' || e.keyCode == '13')
        {
            var prevVal = $(container).attr('prev-val');
            var currVal = $(container).val().trim();
            if (prevVal == currVal)
            {
                return;
            }
            else
            {
                $(container).attr('prev-val', currVal);
            }
            if ($(container).parent().prev().attr("id") == "RHS")
            {
                if ($(container).parent().prev().find('input').val() != "")
                {
                    submitLeadLhsFilters();
                    $(container).blur();
                }
            }
            else
            {
                if (currVal != "")
                {
                    submitLeadLhsFilters();
                    $(container).blur();
                }
            }
        }
    },

    onRHSNEWDateChange : function(e)
    {
        var container = e.currentTarget;
        if (e.type == 'change' || e.keyCode == '13')
        {
            var prevVal = $(container).attr('prev-val');
            var currVal = $(container).val().trim();
            if (prevVal == currVal)
            {
                return;
            }
            else
            {
                $(container).attr('prev-val', currVal);
            }
            if ($(container).parent().prev().attr("id") == "RHS")
            {
                if ($(container).parent().prev().find('input').val() != "")
                {
                    submitLeadLhsFilters();
                    $(container).blur();
                }
            }
            else
            {
                if (currVal != "")
                {
                    submitLeadLhsFilters();
                    $(container).blur();
                }
            }
        }
    },

    toggleFilters : function(e)
    {
        e.preventDefault();

        if ($('#leads-lhs-filters-toggle').is(':visible'))
        {
            $('#leads-lhs-filters-toggle').hide("slow");
            _agile_set_prefs(LEADS_DYNAMIC_FILTER_COOKIE_STATUS, "hide");
        }
        else
        {
            $('#contacts-lhs-filters-toggle').show("slow");
            _agile_set_prefs(LEADS_DYNAMIC_FILTER_COOKIE_STATUS, "show");
        }

    }

});

var Leads_Filter_Events_View = Base_Model_View.extend({
    events: {
        'click .filter-leads-multiple-add' : 'leadsFilterMultipleAdd',
        'click .filter-leads-multiple-add-or-rules' : 'leadsFilterAddOrRules'
    },

    leadsFilterMultipleAdd : function(e)
    {
        e.preventDefault();
        var targetEl = $(e.currentTarget);

        var that = targetEl;
        
        getTemplate("leads-filter-add", {}, undefined, function(template_ui){
            if(!template_ui)
                  return;
            
            var htmlContent = $($(template_ui).find('.chained-table.lead')[0]).find('tr').clone();
            $(htmlContent).removeClass('hide');
            scramble_input_names($(htmlContent));

            chainLeadFilters(htmlContent, function(){}, false);
            $(htmlContent).find("i.filter-leads-multiple-remove").css("display", "inline-block");
            $(that).prev('table').find("tbody").append(htmlContent);
        }, null);
    },
    
    leadsFilterAddOrRules : function(e)
    {
        e.preventDefault();
        var targetEl = $(e.currentTarget);

        var that = targetEl;
        
        getTemplate("leads-filter-add", {}, undefined, function(template_ui){
            if(!template_ui)
                  return;

            var htmlContent = $($(template_ui).find('.chained-table.lead')[1]).find('tr').clone();
            $(htmlContent).removeClass('hide');
            scramble_input_names($(htmlContent));

            chainLeadFilters(htmlContent, function(){}, false);
            $(htmlContent).find("i.filter-leads-multiple-remove").css("display", "inline-block");
            $(that).prev('table').find("tbody").append(htmlContent);
        }, null);
        
    }

});

var Leads_Filter_Collection_Events_View = Base_Collection_View.extend({
    events: {
        'click .lead_static_filter' : 'applyLeadFilter',
        'click .default_filter' : 'applyDefaultLeadFilter'
    },

    applyLeadFilter : function(e)
    {
        e.preventDefault();
        _agile_delete_prefs('dynamic_lead_filter');

        var filter_id = $(e.currentTarget).attr('id');
        var filter_type = $(e.currentTarget).attr('filter_type');

        _agile_set_prefs('lead_filter', filter_id)
        
        LEADS_HARD_RELOAD=true;
        App_Leads.leadsViewLoader.getLeads(App_Leads.leadViewModel, $('#content'));
    },

    applyDefaultLeadFilter : function(e)
    {
        e.preventDefault();
        _agile_delete_prefs('lead_filter');
        _agile_delete_prefs('lead_dynamic_filter');

        LEADS_HARD_RELOAD = true;

        App_Leads.leadsViewLoader.getLeads(App_Leads.leadViewModel, $('#content'));
    }

});

var Leads_Collection_Events_View = Base_Collection_View.extend({
    events: {
        'click .default_filter' : 'removeLeadFilter',
        'click #select-all-available-leads' : 'selectAllLeads',
        'click #select-all-revert' : 'selectChoosenLeads',
    },

    removeLeadFilter : function(e)
    {
        e.preventDefault();
        _agile_delete_prefs('lead_filter');
        _agile_delete_prefs('lead_dynamic_filter');

        LEADS_HARD_RELOAD = true;

        App_Leads.leadsViewLoader.getLeads(App_Leads.leadViewModel, $('#content'));
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


var Leads_Bulk_Action_Events_View = Base_Model_View.extend({
    events: {
        'click #addTagsToLeadsBulk' : 'addTagsToLeadsBulk',
        'click #removeTagsToLeadsBulk' : 'removeTagsToLeadsBulk',
        'click #changeOwnerToLeadsBulk' : 'changeOwnerToLeadsBulk',
        'change .emailSelect' : 'onEmailSelect',
        'click #sendEmail' : 'sendEmail',
        'click #send-email-close' : 'closeSendEmail',
        'click #cc-link, click #bcc-link' : 'openCcOrBccLinks',
        'click #from_email_link' : 'fromEmailLink',
        'click .add-attachment-select' : 'addAttachmentSelect',
        'click .add-attachment-confirm' : 'addAttachmentConfirm',
        'click .add-attachment-cancel' : 'addAttachmentCancel',
        'click #bulk-send-email' : 'bulkEmailSend'
    },

    addTagsToLeadsBulk : function(e)
    {
        e.preventDefault();
        var tags = get_tags('tagsBulkForm');

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
            var saveButton=$(e.currentTarget);

            disable_save_button(saveButton);
            
            var url = '/core/api/bulk/update?action_type=ADD_TAG';
            var json = {};
            json.data = JSON.stringify(tags[0].value);
            json.contact_ids = App_Leads.idArray;

            acl_util.canAddTag(json.data,function(result){
                App_Leads.leadsBulkActions.postBulkOperationData(url, json, $('#tagsBulkForm'), undefined, function(data)
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
    },

    removeTagsToLeadsBulk : function(e)
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

        if (tag_input != "")
            tags[0].value.push(tag_input);

        if (tags[0].value.length > 0)
        {
            // Show loading symbol until model get saved
            var saveButton = $(e.currentTarget);

            disable_save_button(saveButton);

            // $('#tagsBulkForm').find('span.save-status').html(getRandomLoadingImg());

            var url = '/core/api/bulk/update?action_type=REMOVE_TAG';
            var json = {};
            json.data = JSON.stringify(tags[0].value);
            json.contact_ids = App_Leads.idArray;

            App_Leads.leadsBulkActions.postBulkOperationData(url, json, $('#tagsRemoveBulkForm'), undefined, function(data)
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
    },

    changeOwnerToLeadsBulk : function(e)
    {
        e.preventDefault();
        var $form = $('#ownerBulkForm');

        if ($(e.currentTarget).attr('disabled') == 'disabled' || !isValidForm($form))
        {
            return;
        }

        var saveButton = $(e.currentTarget);

        disable_save_button(saveButton);
        
        var new_owner = $('#ownerBulkSelect option:selected').prop('value');
        var url = '/core/api/bulk/update?action_type=CHANGE_OWNER&owner=' + new_owner;
        var json = {};
        json.contact_ids = App_Leads.idArray;
        App_Leads.leadsBulkActions.postBulkOperationData(url, json, $form, undefined, function(data)
        {
            enable_save_button(saveButton);
        }, Handlebars.compile("{{agile_lng_translate 'bulk-actions' 'leads-owner-change-scheduled'}}"));
    },

    /**
     * Populates subject and description using email templates, on select option
     * change of "Fill From Templates" field.
     */
    onEmailSelect : function(e)
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
            if (Current_Route !== 'lead-bulk-email' && Current_Route !== 'send-email')
            {
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
    },

    /**
     * Sends email to the target email. Before sending, validates and serializes
     * email form.
     */
    sendEmail : function(e)
    {
        e.preventDefault();

        if ($(e.currentTarget).attr('disabled'))
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
        
        var that =$(e.currentTarget);

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
    },

    /**
     * Close button click event of send email form. Navigates to contact detail
     * view.
     */
    closeSendEmail : function(e)
    {
        e.preventDefault();
        window.history.back();
    },

    openCcOrBccLinks : function(e)
    {
        e.preventDefault();

        // Hide link
        $(e.currentTarget).hide();

        if ($(e.currentTarget).attr('id') === 'cc-link')
        {
            $('#email_cc').closest('.control-group').show();

            // Hide div.control-group to reduce space between subject
            if ($(e.currentTarget).parent().find('#bcc-link').css('display') === 'none')
                $(e.currentTarget).closest('.control-group').hide();

            return;
        }

        if ($(e.currentTarget).parent().find('#cc-link').css('display') === 'none')
            $(e.currentTarget).closest('.control-group').hide();

        $('#email_bcc').closest('.control-group').show();
    },

    fromEmailLink : function(e)
    {
        e.preventDefault();
        $(e.currentTarget).closest('.control-group').hide();
        $('#from_email').closest('.control-group').show();
        $('#from_name').closest('.control-group').show();
        return;
    },

    /**
     * For showing existing documents and Add new doc option
     * to attach in send-email form 
     */
    addAttachmentSelect : function(e)
    {
        e.preventDefault();
        var el = $(e.currentTarget).closest("div");
        $(e.currentTarget).css("display", "none");
        el.find(".attachment-document-select").css("display", "inline");
        var optionsTemplate = "<option value='{{id}}' network_type='{{titleFromEnums network_type}}' size='{{size}}' url='{{url}}'>{{name}}</option>";
        fillSelect('attachment-select','core/api/documents', 'documents',  function fillNew()
        {
            el.find("#attachment-select option:first").after("<option value='new'>"+_agile_get_translated_val('others','upload-new-doc')+"</option>");

        }, optionsTemplate, false, el);
    },

    /**
     * For adding existing document to current contact
     */
    addAttachmentConfirm : function(e)
    {
        e.preventDefault();     
        var network_type = $('#attachment-select').find(":selected").attr('network_type');
        var document_size = $('#attachment-select').find(":selected").attr('size');
        if(typeof network_type !=='undefined' && network_type.toUpperCase() === 'GOOGLE')
        {
            $(e.currentTarget).closest("span").find(".attachment-status").html("<span style='color:#df382c;margin-top:10px; display:block'>"+_agile_get_translated_val('documents','gd-error')+"</span>");
            //$(e.currentTarget).css({'border': '1px solid #df382c','outline': 'none'   });                                            
        }
        else if(document_size >= 5242880){
            $(e.currentTarget).closest("span").find(".attachment-status").html("<span style='color:#df382c;margin-top:10px; display:block'>"+_agile_get_translated_val('documents','size-exceed-error')+"</span>");
            //$(e.currentTarget).css({'border': '1px solid #df382c','outline': 'none'   });
        }
        else
        {
            $('#attachment-select').closest("span").find('.attachment-status').find("span").fadeOut(0);
            $('#attachment-select').css({"border":"1px solid #bbb"});
            var document_id = $(e.currentTarget).closest(".attachment-document-select").find("#attachment-select").val();
            var saveBtn = $(e.currentTarget);
            
            // To check whether the document is selected or not
            if(document_id == "")
            {
                saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>"+_agile_get_translated_val('validation-msgs','required')+"</span>");
                saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
                return;
            }           
            else if(document_id == "new")
            {   
                e.preventDefault();
                $(e.currentTarget).closest('form').find('#error').html("");
                var form_id = $(e.currentTarget).closest('form').attr("id");
                var id = $(e.currentTarget).find("a").attr("id");
                
                var newwindow = window.open("upload-attachment.jsp?id="+ form_id +"&t=" + CURRENT_USER_PREFS.template +"&d=" + CURRENT_DOMAIN_USER.domain, 'name','height=310,width=500');
                
                if (window.focus)
                {
                    newwindow.focus();
                }
            }
            else if(document_id != undefined && document_id != null)
            {
                var docName = $( "#attachment-select option:selected").text();
                $('#emailForm').find('#eattachment').css('display','block');
                $('#emailForm').find('#attachment_id').find("#attachment_fname").html('<a href='+$( "#attachment-select option:selected").attr('url')+'>'+docName+'</a>');
                $('#emailForm').find(".attachment-document-select").css('display','none');
                $('#emailForm').find('#eattachment_key').attr('name',"document_key");
                $('#emailForm').find('#eattachment_key').attr('value',document_id);
                $("#emailForm").find("#agile_attachment_name").attr("value", docName);
                $("#emailForm").find("#agile_attachment_url").attr("value", $("#attachment-select option:selected").attr("url"))
            }
        }
    },

    /**
     * To cancel the add attachment request in send-email form
     */
    addAttachmentCancel : function(e)
    {
        e.preventDefault();
        var blobKey = $('#emailForm').find('#attachment_id').attr('name');
        if(typeof blobKey !== typeof undefined)
        {
            if(blobKey.toLowerCase() === 'blob_key')
            {
                var blobKeyValue = $('#emailForm').find('#eattachment_key').attr("value");
                deleteBlob(blobKeyValue);
            }
        }
        $('#attachment-select').closest("span").find('.attachment-status').find("span").fadeOut(0);
        $('#attachment-select').css({"border":"1px solid #bbb"});    
        $('#attachment-select').find('option:first').attr('selected', 'selected');
        var el = $(this).closest("div");
        $('#emailForm').find('.attachment-document-select').css('display','none');
        $('#emailForm').find('#eattachment').css('display','none');
        $('#emailForm').find(".add-attachment-select").css("display", "inline");
        $('#emailForm').find('#eattachment_key').attr("name","name");
        $('#emailForm').find('#eattachment_key').attr("value","value");
        $("#emailForm").find("#agile_attachment_name").attr("value", "");
        $("#emailForm").find("#agile_attachment_url").attr("value", "")
        $('#enable_tracking').css("margin-top", "-7px");
    },

    bulkEmailSend : function(e)
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

        App_Leads.leadsBulkActions.postBulkOperationData(url, json, $form, null, function()
        {
            enable_send_button($('#bulk-send-email'));
        }, msg);
    }



});