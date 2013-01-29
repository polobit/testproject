package com.campaignio;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
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
    public Long campaign_id = null;

    /**
     * Emails sent count
     */
    public int emails_sent;

    /**
     * Emails clicked count
     */
    public int emails_clicked;

    /**
     * Emails opened count
     */
    public int emails_opened;

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
	campaign_id = campaignId;
	emails_sent = emailsSent;
	emails_clicked = emailsClicked;
	emails_opened = emailsOpened;
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
    @XmlElement
    public String getCampaign()
    {
	if (campaign_id == null)
	    return " ";
	Workflow workflow = WorkflowUtil.getWorkflow(campaign_id);

	if (workflow != null)
	    return workflow.name;

	return "?";
    }

    /**
     * Saves CampaignStats.
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Deletes CampaignStats
     */
    public void delete()
    {
	dao.delete(this);
    }

    public String toString()
    {
	return "CampaignStats: Campaign id " + campaign_id + " Emails sent "
		+ emails_sent + " Emails Opened " + emails_opened
		+ " Emails clicked " + emails_clicked;
    }
}
