var Leads_Header_Events_View = Base_Model_View.extend({
    events: {
    	'click #add-lead' : 'addLead',
    	'click .lead-view' : 'toggleLeadsView',
    	'click #leadTabelView' : 'toggleLeadsListView',
    	'click .leadcolumn' : 'addOrRemoveLeadColumns',
    	'click .toggle-lead-filters' : 'toggleLeadFilters',
        'click #bulk-tags' : 'bulkActionAddTags',
    },

    addLead : function(e)
    {
    	var newLeadModalView = new Leads_Form_Events_View({ data : {}, template : "new-lead-modal", isNew : true});
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
        Backbone.history.navigate("lead-bulk-tags", { trigger : true });
    },

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
        'click #addTagsToLeadsBulk' : 'addTagsToLeadsBulk'
    },

    addTagsToLeadsBulk : function(e)
    {
        
    }

});