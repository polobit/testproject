/**
 * Creates backbone model events view with leads lhs filters events.
 */
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