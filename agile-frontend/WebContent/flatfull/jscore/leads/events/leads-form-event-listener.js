/**
 * Creates backbone model events view with leads 
 * add and edit form events view.
 */
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