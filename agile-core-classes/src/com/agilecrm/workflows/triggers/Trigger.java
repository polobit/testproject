package com.agilecrm.workflows.triggers;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.filter.ContactFilter;
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
 * 
 * <p>
 * Triggers can run periodically (Daily,Weekly,Monthly), these periodic triggers
 * allows user to select contact filters then trigger runs on those matching
 * contacts.
 * </p>
 * 
 * <p>
 * Trigger uses these conditions
 * <ul>
 * <li>When same tag defined in trigger is added to contact.</li>
 * <li>When same tag defined in trigger is deleted from contact.</li>
 * <li>When new contact is added.</li>
 * <li>When new deal is created.</li>
 * <li>When deal is deleted.</li>
 * <li>When score of contact reaches the trigger score.</li>
 * <li>Uses contact filter to run campaign specific contacts.</li>
 * <li>
 * </ul>
 * <p>
 * Some important points to consider are campaigns should not be empty while
 * creating trigger. Trigger use DeferredTask to run different trigger tasks.
 * 
 * @author Naresh,Ramesh
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
		TAG_IS_ADDED, TAG_IS_DELETED, CONTACT_IS_ADDED, DEAL_IS_ADDED, DEAL_IS_DELETED, DEAL_MILESTONE_IS_CHANGED, ADD_SCORE, STRIPE_CHARGE_EVENT, SHOPIFY_EVENT, RUNS_DAILY, RUNS_WEEKLY, RUNS_MONTHLY, SOFT_BOUNCE, HARD_BOUNCE, SPAM_REPORT, INBOUND_MAIL_EVENT, EMAIL_OPENED, EMAIL_LINK_CLICKED, EVENT_IS_ADDED, UNSUBSCRIBED, FORM_SUBMIT, INBOUND_CALL, OUTBOUND_CALL, NEW_TICKET_IS_ADDED, TICKET_NOTE_ADDED_BY_USER, TICKET_NOTE_ADDED_BY_CUSTOMER, TICKET_IS_CLOSED
	};

	/**
	 * Trigger type.
	 */
	public Type type;

	@NotSaved(IfDefault.class)
	public String email_tracking_type = "ANY";

	@NotSaved(IfDefault.class)
	public Long email_tracking_campaign_id = null;

	@NotSaved(IfDefault.class)
	public String custom_link_clicked = null;

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
	 * Shopify event for SHOPIFY_EVENT trigger
	 */
	@NotSaved(IfDefault.class)
	public String trigger_shopify_event = null;

	/**
	 * ContactFilter id of a contact. Contact Filter details can be retrieved
	 * using contact filter id.
	 */
	@NotSaved(IfDefault.class)
	public Long contact_filter_id = null;

	@NotSaved(IfDefault.class)
	public String event_owner_id = "ANY";

	@NotSaved(IfDefault.class)
	public String event_type = "ANY";

	@NotSaved(IfDefault.class)
	public String call_disposition = null;

	@NotSaved(IfDefault.class)
	public String trigger_form_event = null;

	@NotSaved(IfDefault.class)
	public Boolean trigger_run_on_new_contacts = false;

	@NotSaved(IfDefault.class)
	public Boolean new_email_trigger_run_on_new_contacts = true;

	@NotSaved
	public Boolean is_disabled = false;

	/**
	 * Returns campaign name as an xml element which is retrieved using
	 * campaign-id.
	 * 
	 * @return The campaign name as an xml element based on campaign id if
	 *         exists otherwise return '?'.
	 * @throws Exception
	 *             When campaign doesn't exist for given campaign id.
	 */

	@JsonIgnore
	private Workflow workflow;

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

		this.workflow = WorkflowUtil.getWorkflow(campaign_id);

		if (this.workflow != null)
			return this.workflow.name;

		return "?";
	}

	/**
	 * Returns contactFilter name as an xml element which is retrieved using
	 * contactFilter-id.
	 * 
	 * @return The contactFilter name as an xml element based on contactFilter
	 *         id if exists otherwise return '?'.
	 * @throws Exception
	 *             When contactFilter doesn't exist for given campaign id.
	 */
	@XmlElement(name = "contactFilter")
	public String getContactFilter() throws Exception
	{
		if (contact_filter_id == null)
			return " ";

		ContactFilter contactFilter = null;
		contactFilter = ContactFilter.getContactFilter(contact_filter_id);

		if (contactFilter != null)
			return contactFilter.name;

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

	@PostLoad
	public void postLoad()
	{
		try
		{
			if (this.workflow == null)
			{
				getCampaign();
			}

			if (this.workflow != null)
				this.is_disabled = workflow.is_disabled;

		}
		catch (Exception e)
		{
			System.out.println("Exception during postload in triggers: " + e.getMessage());
		}
	}
}