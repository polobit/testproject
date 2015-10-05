package com.agilecrm.account;

import java.io.Serializable;

/**
 * <code>EmailGateway</code> is the core class for Agile Email Gateways. It is
 * the wrapper class for gateways that are store in widget as prefs
 * 
 * @author naresh
 * 
 */
@SuppressWarnings("serial")
public class EmailGateway implements Serializable
{
    /**
     * API User - SendGrid API have api_user
     */
    public String api_user;

    /**
     * API Key
     */
    public String api_key;
    
    public String regions;

    /**
     * Email API types
     * 
     */
    public enum EMAIL_API
    {
	SEND_GRID, MANDRILL, SES
    };

    public EMAIL_API email_api = EMAIL_API.MANDRILL;

    /**
     * Constructs default {@link EmailGateway}
     */
    EmailGateway()
    {
    }

    /**
     * Constructs {@link EmailGateway}
     * 
     * @param apiUser
     *            - api user
     * @param apiKey
     *            - api key
     * @param emailApi
     *            - Email API type
     */
    public EmailGateway(String apiUser, String apiKey, EMAIL_API emailApi)
    {
	this.api_user = apiUser;
	this.api_key = apiKey;
	this.email_api = emailApi;
    }
}
