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

    public Long start_time = null;

    /**
     * Time when last node of workflow ended.
     */

    public Long end_time = null;

    /**
     * CampaignId.
     */
    public String campaign_id = null;

    /**
     * Status of workflow.
     * 
     */
    public enum Status
    {
	ACTIVE, DONE
    };

    public String status;

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
     * @param status
     *            - Active or Done.
     */
    public CampaignStatus(Long start_time, Long end_time, String campaign_id, String status)
    {
	this.start_time = start_time;
	this.end_time = end_time;
	this.campaign_id = campaign_id;
	this.status = status;
    }

}
