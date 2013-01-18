package com.campaignio;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class CampaignStats
{
    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public Long campaignId = null;

    public int emailsSent = 0;

    public int emailsClicked = 0;

    public int emailsOpened = 0;

    private static ObjectifyGenericDao<CampaignStats> dao = new ObjectifyGenericDao<CampaignStats>(
	    CampaignStats.class);

    CampaignStats()
    {

    }

    public CampaignStats(Long campaignId, int emailsSent, int emailsClicked,
	    int emailsOpened)
    {
	this.campaignId = campaignId;
	this.emailsSent = emailsSent;
	this.emailsClicked = emailsClicked;
	this.emailsOpened = emailsOpened;
    }

    public void save()
    {
	String namespace = NamespaceManager.get();
	NamespaceManager.set(namespace);
	dao.put(this);
    }

    public void delete()
    {
	dao.delete(this);
    }

    public static CampaignStats getCampaignStatsByCampaignId(Long campaignId)
    {
	CampaignStats campaignStats = dao.getByProperty("campaignId",
		campaignId);

	if (campaignStats == null)
	    return getDefaultCampaignStats(campaignId);

	return campaignStats;
    }

    private static CampaignStats getDefaultCampaignStats(Long campaignId)
    {
	CampaignStats campaignStats = new CampaignStats(campaignId, 0, 0, 0);
	campaignStats.save();
	return campaignStats;
    }

    public static void incrementEmailsClicked(String campaignId)
    {
	CampaignStats campaignStats = getCampaignStatsByCampaignId(Long
		.parseLong(campaignId));
	campaignStats.emailsClicked++;
	campaignStats.save();
    }

    public static void incrementEmailsSent(String campaignId)
    {
	CampaignStats campaignStats = getCampaignStatsByCampaignId(Long
		.parseLong(campaignId));
	campaignStats.emailsSent++;
	campaignStats.save();
    }
}
