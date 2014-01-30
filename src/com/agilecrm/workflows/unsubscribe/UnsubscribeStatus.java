package com.agilecrm.workflows.unsubscribe;

/**
 * <code>UnsubscribeStatus</code> is the base class for holding unsubscribe
 * status w.r.t subscriber.It is embedded with Contact object. Each
 * UnsubscribeStatus is added to UnsubscribeStatus list property of Contact.
 * <p>
 * If ALL is set as status, then no email is sent through campaign to that
 * subscriber's email.
 * </p>
 * 
 * @author Naresh
 * 
 */
public class UnsubscribeStatus
{
    /**
     * Campaign Id of campaign whose email is unsubscribed
     */
    public String campaign_id = null;

    /**
     * Flag to know unsubscribe type
     * 
     */
    public enum UnsubscribeType
    {
	ALL, CURRENT
    };

    public UnsubscribeType unsubscribeType = null;

    /**
     * Default UnsubscribeStatus
     */
    UnsubscribeStatus()
    {

    }

    /**
     * Constructs a new {@link UnsubscribeStatus} with campaign-id and
     * unsubscribe type
     * 
     * @param campaignId
     * @param unsubscribeType
     */
    public UnsubscribeStatus(String campaignId, UnsubscribeType unsubscribeType)
    {
	this.campaign_id = campaignId;
	this.unsubscribeType = unsubscribeType;
    }
}
