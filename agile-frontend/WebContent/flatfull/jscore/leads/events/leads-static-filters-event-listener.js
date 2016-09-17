/**
 * Creates backbone model events view with 
 * leads add static filter events.
 */
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

/**
 * Creates backbone collection events view with 
 * leads static filters events from list view.
 */
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