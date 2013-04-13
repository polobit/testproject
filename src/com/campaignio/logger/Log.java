package com.campaignio.logger;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonAutoDetect;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

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
     * Logs List.
     */
    @XmlElement(name = "logs")
    @Embedded
    @Indexed
    public List<LogItem> logs = new ArrayList<LogItem>();

    /**
     * Sets entity type as log.
     */
    @NotSaved
    public String entity_type = "log";

    /**
     * Log Updated Time.
     */
    @NotSaved(IfDefault.class)
    public Long updated_time = 0L;

    /**
     * ObjectifyGenericDao for Log class.
     */
    public static ObjectifyGenericDao<Log> dao = new ObjectifyGenericDao<Log>(
	    Log.class);

    /**
     * Default Log.
     */
    public Log()
    {

    }

    /**
     * Constructs new {@link Log} with campaign id and subscriber id.
     * 
     * @param campaignId
     *            Id of a campaign.
     * @param subscriberId
     *            Id of a contact that subscribes to campaign.
     */
    public Log(String campaignId, String subscriberId, List<LogItem> logs)
    {
	this.subscriber_id = subscriberId;
	this.campaign_id = campaignId;
	this.logs = logs;
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
     * Returns logs array size.
     * 
     * @return logs array size.
     */
    @XmlElement
    public int getLogsCount()
    {
	return this.logs.size();
    }

    /**
     * Saves Log in database.
     */
    public void save()
    {
	dao.put(this);
    }

    @PrePersist
    private void Prepersist()
    {
	updated_time = System.currentTimeMillis() / 1000;
    }
}
