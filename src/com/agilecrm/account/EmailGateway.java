package com.agilecrm.account;

import java.io.Serializable;

import javax.persistence.Id;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;

@SuppressWarnings("serial")
@XmlRootElement
@Cached
public class EmailGateway implements Serializable
{
    @Id
    public Long id = null;

    public String api_user = null;

    public String api_key = null;

    public enum EMAIL_API
    {
	SEND_GRID, MANDRILL
    };

    @Indexed
    public EMAIL_API email_api = EMAIL_API.MANDRILL;

    private static ObjectifyGenericDao<EmailGateway> dao = new ObjectifyGenericDao<EmailGateway>(EmailGateway.class);

    EmailGateway()
    {
    }

    public EmailGateway(String apiUser, String apiKey, EMAIL_API emailApi)
    {
	this.api_user = apiUser;
	this.api_key = apiKey;
	this.email_api = emailApi;
    }

    public void save()
    {
	try
	{
	    EmailGatewayUtil.checkEmailAPISettings(this);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}

	dao.put(this);
    }

    public void delete()
    {
	dao.delete(this);
    }
}
