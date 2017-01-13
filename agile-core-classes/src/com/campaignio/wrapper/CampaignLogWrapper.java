package com.campaignio.wrapper;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;

import com.agilecrm.cursor.Cursor;
import com.agilecrm.util.SMTPBulkEmailUtil;

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
    private String message;
    
    /**
     * email sent via SMTP, Gmail, Gateway
     */
    public String sent_via;

    /**
     * Log epoch time(log_time converted) is sent along with other fields. Epoch
     * time is needed for timeline and tables.
     **/
    public String time;
    
    public String entity_type = "log";

    public CampaignLogWrapper()
    {

    }
    
    public String getMessage() {
		return this.message;
	}

	public void setMessage(String message) {	

		message = StringEscapeUtils.unescapeJava(message).replaceAll("(<script|<SCRIPT)", "<!--<script").replaceAll("(</script>|</SCRIPT>)",
			        "<script>-->");
		
		this.sent_via = SMTPBulkEmailUtil.getEmailSentVia(message); 
		
		if(StringUtils.isNotBlank(sent_via))
			this.message = SMTPBulkEmailUtil.getEmailLogMessage(message);
		else
			this.message = message;
	}

}
