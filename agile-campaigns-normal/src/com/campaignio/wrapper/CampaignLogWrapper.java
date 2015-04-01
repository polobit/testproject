package com.campaignio.wrapper;

import com.agilecrm.cursor.Cursor;

public class CampaignLogWrapper extends Cursor

{
    /**
     * URL of page where analytics code is pasted
     */

    public String url;

    /**
     * IP Address of client
     */
    public String ip;

    /**
     * Actually NOW() time in SQL. Stores time of row insertion
     */
    public String stats_time;

    /**
     * User email. Retrieved from cookie of browser.
     */
    public String email;

    /**
     * Id of a campaign.
     */
    public String campaign_id;

    /**
     * Contact id that subscribes to campaign.
     */
    public String subscriber_id;

    /**
     * Campaign Name.
     */
    public String campaign_name;

    /**
     * Log time
     */
    public String log_time;

    /**
     * Log Type
     */
    public String log_type;

    /**
     * Message
     */
    public String message;

    /**
     * Log epoch time(log_time converted) is sent along with other fields. Epoch
     * time is needed for timeline and tables.
     **/
    public String time;
    
    public String entity_type = "log";

    public CampaignLogWrapper()
    {

    }

}
