package com.campaignio;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>CampaignStats</code> is the base class for campaign statistics. It
 * records number of emails sent, clicked and opened based on campaign.
 * 
 * @author Naresh
 * 
 */
@XmlRootElement
public class CampaignStats
{
    /**
     * CampaignStats Id
     */
    @Id
    public Long id;

    /**
     * Campaign Id
     */
    @NotSaved(IfDefault.class)
    public Long campaignId = null;

    /**
     * Emails sent count
     */
    public int emailsSent;

    /**
     * Emails clicked count
     */
    public int emailsClicked;

    /**
     * Emails opened count
     */
    public int emailsOpened;

    /**
     * Campaign Stats Dao
     */
    private static ObjectifyGenericDao<CampaignStats> dao = new ObjectifyGenericDao<CampaignStats>(
	    CampaignStats.class);

    /**
     * Default CampaignStats
     */
    CampaignStats()
    {

    }

    /**
     * Constructs a new {@link CampaignStats}.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @param emailsSent
     *            - Emails Sent count.
     * @param emailsClicked
     *            - Emails Clicked count.
     * @param emailsOpened
     *            - Emails Opened count.
     */
    public CampaignStats(Long campaignId, int emailsSent, int emailsClicked,
	    int emailsOpened)
    {
	this.campaignId = campaignId;
	this.emailsSent = emailsSent;
	this.emailsClicked = emailsClicked;
	this.emailsOpened = emailsOpened;
    }

    /**
     * Saves CampaignStats within empty namespace.
     */
    public void save()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{
	    dao.put(this);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Deletes CampaignStats
     */
    public void delete()
    {
	dao.delete(this);
    }
}
