package com.agilecrm.workflows.triggers;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * Trigger is a base class for all triggers which allow application to run
 * campaign automatically. The Trigger Object encapsulates the trigger details
 * which includes name of a trigger, type and campaign.
 * <p>
 * Trigger uses these conditions
 * <ul>
 * <li>When same tag defined in trigger is added to contact.</li>
 * <li>When same tag defined in trigger is deleted from contact.</li>
 * <li>When new contact is added.</li>
 * <li>When new deal is created.</li>
 * <li>When deal is deleted.</li>
 * <li>When score of contact reaches the trigger score.</li>
 * </ul>
 * <p>
 * Some important points to consider are campaigns should not be empty while
 * creating trigger. Trigger use DeferredTask to run different trigger tasks.
 * 
 * @author Naresh
 * 
 */

@XmlRootElement
@Cached
public class Trigger
{
    /**
     * Id of a trigger. Each trigger has its own and unique id.
     */
    @Id
    public Long id;

    /**
     * Name of a trigger which is a valid identifier.
     */
    @NotSaved(IfDefault.class)
    public String name = null;

    /**
     * Types of Triggers.
     * 
     */
    public enum Type
    {
	TAG_IS_ADDED, TAG_IS_DELETED, CONTACT_IS_ADDED, DEAL_IS_ADDED, DEAL_IS_DELETED, DEAL_MILESTONE_IS_CHANGED, ADD_SCORE, STRIPE_CHARGE_EVENT
    };

    /**
     * Trigger type.
     */
    public Type type;

    /**
     * Campaign id of a campaign with respect to trigger. Campaign name can be
     * retrieved using campaign id.
     */
    @NotSaved(IfDefault.class)
    public Long campaign_id = null;

    /**
     * Custom score while saving trigger with Add score type.
     */
    @NotSaved(IfDefault.class)
    public Integer custom_score = null;

    /**
     * Custom tags set while saving trigger with Tag is added and Tag is deleted
     * types.
     */
    @NotSaved(IfDefault.class)
    public String custom_tags = null;

    /**
     * Milestone set for DEAL_MILESTONE_IS_CHANGED trigger
     */
    @NotSaved(IfDefault.class)
    public String trigger_deal_milestone = null;

    /**
     * Stripe event for STRIPE_CHARGE_EVENT trigger
     */
    @NotSaved(IfDefault.class)
    public String trigger_stripe_event = null;

    /**
     * Initialize DataAccessObject.
     */
    public static ObjectifyGenericDao<Trigger> dao = new ObjectifyGenericDao<Trigger>(Trigger.class);

    /**
     * Default Trigger.
     */
    Trigger()
    {

    }

    /**
     * Constructs new {@link Trigger} with name,type and campaign id.
     * 
     * @param name
     *            The trigger name.Required.
     * @param type
     *            The trigger condition.Required.
     * @param campaign_id
     *            The campaign id from campaign.Required.
     */
    public Trigger(String name, Type type, Long campaign_id)
    {
	this.name = name;
	this.type = type;
	this.campaign_id = campaign_id;
    }

    /**
     * Returns campaign name as an xml element which is retrieved using
     * campaign-id.
     * 
     * @return The campaign name as an xml element based on campaign id if
     *         exists otherwise return '?'.
     * @throws Exception
     *             When campaign doesn't exist for given campaign id.
     */
    @XmlElement(name = "campaign")
    public String getCampaign() throws Exception
    {
	if (campaign_id == null)
	    return " ";

	Workflow workflow = WorkflowUtil.getWorkflow(campaign_id);

	if (workflow != null)
	    return workflow.name;

	return "?";
    }

    /**
     * Saves trigger in database.
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Removes trigger from database.
     */
    public void delete()
    {
	dao.delete(this);
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    public String toString()
    {
	return "Name: " + name + " Condition: " + type + "Campaign:" + campaign_id;
    }
}