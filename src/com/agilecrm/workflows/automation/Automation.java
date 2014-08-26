package com.agilecrm.workflows.automation;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/* 
 * @author Ramesh
 * 
 */

@XmlRootElement
@Cached
public class Automation
{
	/**
	 * Id of a automation. Each automation has its own and unique id.
	 */
	@Id
	public Long id;

	/**
	 * Name of a automation which is a valid identifier.
	 */
	@NotSaved(IfDefault.class)
	public String name = null;

	/**
	 * Campaign id of a campaign with respect to automation. Campaign name can
	 * be retrieved using campaign id.
	 */
	@NotSaved(IfDefault.class)
	public Long campaign_id = null;

	/**
	 * ContactFilter id of a contact with respect to automation. Contact Filter
	 * details can be retrieved using contact filter id.
	 */
	@NotSaved(IfDefault.class)
	public Long contactFilter_id = null;

	/**
	 * Types of Durations.
	 * 
	 */
	public enum Duration
	{
		DAILY, WEEKLY, MONTHLY
	};

	/**
	 * Automation duration type.
	 */
	public Duration durationType;

	public static ObjectifyGenericDao<Automation> dao = new ObjectifyGenericDao<Automation>(Automation.class);

	/**
	 * Default Automation.
	 */
	Automation()
	{

	}

	/**
	 * Constructs new {@link Automation} with name,type and campaign id.
	 * 
	 * @param name
	 *            The Automation name.Required.
	 * @param type
	 *            The Automation duration type.Required.
	 * @param campaign_id
	 *            The campaign id from campaign.Required.
	 * @param contactFilter_id
	 *            The contactFilter id from contactFilter.Required.
	 */
	public Automation(String name, Duration type, Long campaign_id, Long contactFilter_id)
	{
		this.name = name;
		this.durationType = type;
		this.campaign_id = campaign_id;
		this.contactFilter_id = contactFilter_id;
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
		if (contactFilter_id == null)
			return " ";

		ContactFilter contactFilter = null;
		contactFilter = ContactFilter.getContactFilter(contactFilter_id);

		if (contactFilter != null)
			return contactFilter.name;

		return "?";
	}

	/**
	 * Saves Automation in database.
	 */
	public void save()
	{
		dao.put(this);
	}

	/**
	 * Removes Automation from database.
	 */
	public void delete()
	{
		dao.delete(this);
	}

}