/**
 * Creates backbone collection events view with 
 * leads list view or grid view events.
 */
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