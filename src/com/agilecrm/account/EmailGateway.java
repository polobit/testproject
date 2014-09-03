package com.agilecrm.account;

import java.io.Serializable;

import javax.persistence.Id;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>EmailGateway</code> is the core class for Agile Email Gateways. It
 * stores third party email api values.
 * 
 * @author naresh
 * 
 */
@SuppressWarnings("serial")
@XmlRootElement
@Cached
public class EmailGateway implements Serializable
{
    /**
     * Auto generated id
     */
    @Id
    public Long id = null;

    /**
     * API User - SendGrid API have api_user
     */
    @NotSaved(IfDefault.class)
    public String api_user = null;

    /**
     * API Key
     */
    @NotSaved(IfDefault.class)
    public String api_key = null;

    /**
     * Email API types
     * 
     */
    public enum EMAIL_API
    {
	SEND_GRID, MANDRILL
    };

    public EMAIL_API email_api = EMAIL_API.MANDRILL;

    /**
     * Objectify dao
     */
    public static ObjectifyGenericDao<EmailGateway> dao = new ObjectifyGenericDao<EmailGateway>(EmailGateway.class);

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

    /**
     * Saves EmailGateway to datastore
     */
    public void save()
    {
	try
	{
	    // Validates given api values before saving
	    EmailGatewayUtil.checkEmailAPISettings(this);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}

	dao.put(this);
    }

    /**
     * Deletes EmailGateway from datastore
     */
    public void delete()
    {
	dao.delete(this);
    }
}
