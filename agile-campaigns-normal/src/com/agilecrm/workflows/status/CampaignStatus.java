package com.agilecrm.workflows.status;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * <code>CampaignStatus</code> records the status of Workflow. It records
 * start-time, end-time and states(active or done) of workflow.
 * 
 * @author Naresh
 * 
 */
@XmlRootElement
public class CampaignStatus
{

    /**
     * Time when Start node of workflow started.
     */
    public Long start_time = 0L;

    /**
     * Time when last node of workflow ended.
     */
    public Long end_time = 0L;

    /**
     * CampaignId.
     */
    public String campaign_id = null;

    /**
     * Campaign Name
     **/
    public String campaign_name = null;

    /**
     * Status of workflow.
     * 
     */
    public enum Status
    {
	ACTIVE, DONE, REMOVED
    };

    /**
     * Status is 'campaignId-Status'. Inorder to query in datastore, combined
     * camapignId and enum Status.
     */
    public String status = null;

    /**
     * Constructs default CampaignStatus.
     */
    CampaignStatus()
    {
    }

    /**
     * Constructs new {@link CampaignStatus}
     * 
     * @param start_time
     *            - start-time of workflow.
     * @param end_time
     *            - end-time of workflow.
     * @param campaign_id
     *            - campaign-id
     * @param campaign_name
     *            - CampaignName
     * @param status
     *            - Active or Done.
     */
    public CampaignStatus(long startTime, long endTime, String campaignId, String campaignName, String status)
    {
	this.start_time = startTime;
	this.end_time = endTime;
	this.campaign_id = campaignId;
	this.campaign_name = campaignName;
	this.status = status;
    }
    
    @Override
    public boolean equals(Object o)
    {
	CampaignStatus status = (CampaignStatus) o;

	try
	{
	    if (this.campaign_id != null && this.status != null && this.campaign_id.equals(status.campaign_id) && this.status.equals(status.status))
	    return true;
	}
	catch(Exception e){
	    e.printStackTrace();
	    System.err.println("Exception occured in campaign status equals..."+ e.getMessage());
	}
	
	return false;
    }
}