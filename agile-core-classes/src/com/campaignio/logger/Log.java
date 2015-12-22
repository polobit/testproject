package com.campaignio.logger;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonAutoDetect;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;

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
@Cached
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
	 * Campaign Name.
	 */
	public String campaign_name;

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
	 * Log epoch time(log_time converted) is sent along with other fields. Epoch
	 * time is needed for timeline and tables.
	 **/
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
	 * To get log in contact-timeline.
	 */
	@NotSaved
	public String entity_type = "log";

	/**
	 * Log Types. These names are also dependent to show images (img/campaigns)
	 * for contact-detail-campaigns.
	 * 
	 */
	public enum LogType
	{
		EMAIL_QUEUED, EMAIL_SENT, EMAIL_OPENED, EMAIL_CLICKED, EMAIL_HARD_BOUNCED, EMAIL_SPAM, EMAIL_SOFT_BOUNCED, WAIT, CLICKED, OPENED, AB, URL_VISITED, TWEET, ADD_NOTE, TAGS, CHECK_TAGS, CONDITION, JSONIO, SCORE, SET_OWNER, ADD_TASK, ADD_DEAL, ADD_CASE, TRANSFER, GENDER, REPLIED, CHANGED_DEAL_MILESTONE, EMAIL_SLEEP, EMAIL_SENDING_FAILED, EMAIL_SENDING_SKIPPED, UNSUBSCRIBED, SET_PROPERTY, CAMPAIGN_STOPPED, WAIT_TILL, SMS_SENT, SMS_FAILED, SMS_LINK_CLICKED, UNSUBSCRIBE, CLOSED_TASK, ADD_EVENT, SET_PROPERTY_FAILED
	};

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
			Contact contact = ContactUtil.getContact(Long.parseLong(subscriber_id));

			if (contact != null)
				return contact;
		}

		return null;
	}
}
