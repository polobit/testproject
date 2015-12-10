package com.agilecrm.core.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.thirdparty.mandrill.webhook.MandrillWebhookUtil;
import com.thirdparty.sendgrid.webhook.SendGridWebhook;
import com.thirdparty.sendgrid.webhook.util.SendGridWebhookUtil;

/**
 * <code>EmailGatewayAPI</code> is the api class for Email Gateways. It handles
 * CRUD operations of EmailGateway
 * 
 * @author naresh
 * 
 */
@Path("/api/email-gateway")
public class EmailGatewayAPI
{

    /**
     * Saves email gateway
     * 
     * @param emailGateway
     * @return
     */
    @PUT
    @POST
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public EmailGateway saveEmailGateway(EmailGateway emailGateway)
    {
	return EmailGatewayUtil.saveEmailGateway(emailGateway);
    }

    /**
     * Returns Email gateway
     * 
     * @return EmailGateway
     */
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public EmailGateway getEmailGateway()
    {
	return EmailGatewayUtil.getEmailGateway();
    }

    /**
     * Deletes Email gateway object
     */
    @DELETE
    public void deleteEmailGateway()
    {
	EmailGatewayUtil.deleteEmailGateway();
    }

    /**
     * Adds Agile Webhook to given api Mandrill Account
     * 
     * @param apiKey
     *            - mandrill api key
     * @param type
     *            - EmailGateway email api type e.g., Mandrill or Send Grid
     * @return String
     */
    @Path("/add-webhook")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String addAgileWebhook(@QueryParam("api_key") String apiKey, @QueryParam("api_user") String apiUser, @QueryParam("type") String type)
    {
	// Add webhook
	if (type.equals(EmailGateway.EMAIL_API.MANDRILL.toString()))
	    return MandrillWebhookUtil.addWebhook(apiKey);

	if(type.equals(EmailGateway.EMAIL_API.SEND_GRID.toString()))
		return SendGridWebhookUtil.addWebhook(apiUser, apiKey);
	
	return null;
    }

    /**
     * Removes Agile Webhook from given api Mandrill Account
     * 
     * @param apiKey
     *            - Mandrill api key
     * @param type
     *            - EmailGateway email api type e.g., Mandrill or Send Grid
     * @return String
     */
    @Path("/delete-webhook")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String deleteAgileWebhook(@QueryParam("api_key") String apiKey, @QueryParam("type") String type)
    {
	// Delete webhook
	if (type.equals(EmailGateway.EMAIL_API.MANDRILL.toString()))
	    return MandrillWebhookUtil.deleteWebhook(apiKey);

	return null;
    }
}
