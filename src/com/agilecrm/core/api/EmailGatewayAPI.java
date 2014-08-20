package com.agilecrm.core.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.util.EmailGatewayUtil;

@Path("/api/email-integration")
public class EmailGatewayAPI
{

    @PUT
    @POST
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public EmailGateway saveEmailGateway(EmailGateway emailGateway)
    {
	emailGateway.save();

	return emailGateway;
    }

    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public EmailGateway getEmailGateway()
    {
	return EmailGatewayUtil.getEmailGateway();
    }

    @DELETE
    public void deleteEmailGateway()
    {
	EmailGateway emailGateway = EmailGatewayUtil.getEmailGateway();

	if (emailGateway != null)
	    emailGateway.delete();
    }
}
