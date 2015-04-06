package com.agilecrm.contact.email.bounce;

public class EmailBounceStatus
{
    /**
     * Bounced email-id
     */
    public String email = null;

    /**
     * Email bounce type
     * 
     */
    public enum EmailBounceType
    {
	HARD_BOUNCE, SOFT_BOUNCE, SPAM
    };

    public EmailBounceType emailBounceType = null;

    /**
     * Bounce time
     */
    public Long time = 0L;

    /**
     * Campaign id of which campaign bounced
     */
    public String campaign_id = null;

    /**
     * Default EmailBounceStatus
     */
    EmailBounceStatus()
    {

    }

    /**
     * Constructs a new {@link EmailBounceStatus} with email and email bounce
     * type
     * 
     * @param email
     *            - contact email-id
     * @param emailBounceType
     *            - Hard bounce or Soft bounce
     */
    public EmailBounceStatus(String email, EmailBounceType emailBounceType)
    {
	this.email = email;
	this.emailBounceType = emailBounceType;

	this.time = System.currentTimeMillis() / 1000;
    }
}
