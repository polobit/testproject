package com.campaignio.logger;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonAutoDetect;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;

/**
 * 
 * <code>Log</code> class is the base class for logging details of various
 * actions in agilecrm. For example, email sending details such as delivery
 * reports can be known using logs. Log class can be used in any tasklets that
 * require logging.
 * 
 * @author Manohar
 * 
 */
@XmlRootElement
@JsonAutoDetect
public class Log
{
    /**
     * Uniquely generated Id for each log created.
     */
    @Id
    public Long id;

    /**
     * Id of a campaign.
     */
    public String campaign_id;

    /**
     * Contact id that subscribes to campaign.
     */
    public String subscriber_id;

    /**
     * Log message
     */
    public String message;

    /**
     * Domain
     */
    public String domain;

    /**
     * Log Type
     */
    public String log_type;

    /**
     * Log epoch time.
     */
    public String time;

    /**
     * Log Date time.
     */
    public String log_time;

    /**
     * Log level
     */
    public String level;

    /**
     * Default Log.
     */
    public Log()
    {

    }

    /**
     * Returns name of contact that subscribes to campaign as an xml element.
     * 
     * @return Contact name.
     * @throws Exception
     */
    @XmlElement
    public Contact getContact() throws Exception
    {
	if (subscriber_id != null)
	{
	    Contact contact = ContactUtil.getContact(Long
		    .parseLong(subscriber_id));

	    if (contact != null)
		return contact;
	}

	return null;
    }

    /**
     * Returns workflow name from campaign-id.
     * 
     * @return campaign name string.
     */
    @XmlElement
    public String getCampaignName()
    {
	if (campaign_id != null)
	{
	    Workflow workflow = WorkflowUtil.getWorkflow(Long
		    .parseLong(campaign_id));

	    if (workflow != null)
		return workflow.name;
	}

	return null;
    }

}
