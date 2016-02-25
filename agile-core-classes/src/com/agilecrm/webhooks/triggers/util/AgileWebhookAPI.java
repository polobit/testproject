package com.agilecrm.webhooks.triggers.util;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.appengine.api.NamespaceManager;

@Path("/api/webhooksregister")
public class AgileWebhookAPI
{

    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Webhook getWebhook()
    {
	return WebhookTriggerUtil.getWebhook();
    }

    /**
     * 
     * @param webhook
     * 
     * @return response ok
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void saveWebhook(Webhook webhook)
    {
	String domain = NamespaceManager.get();
	webhook.domain = domain;

	webhook.save();

	Response.ok();
    }

    /**
     * 
     * @param webhook
     * 
     * @return response ok
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void updateHook(Webhook webhook)
    {
	this.saveWebhook(webhook);

	Response.ok();
    }

    /**
     * Delete by current domain
     * 
     */
    @DELETE
    @Produces({ MediaType.APPLICATION_JSON })
    public void deleteWebhooks()
    {
	Webhook webhook = WebhookTriggerUtil.getWebhook();
	if (webhook != null)
	    WebhookTriggerUtil.deleteWebhook(webhook.id);

	Response.ok();
    }

    /**
     * 
     * @param id
     *            Testing purpose Webhook only return webhook
     */
    @Path("/related/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public Webhook getWebhook(@PathParam("id") Long id)
    {
	Webhook webhook = WebhookTriggerUtil.getWebhook(id);
	System.out.println("hook id " + webhook);
	return webhook;
    }

    /**
     * 
     * @param id
     *            testing purpose only not return
     */
    @Path("/related/{id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_JSON })
    public Webhook deleteWebhooks(@PathParam("id") Long id)
    {
	Webhook webhook = WebhookTriggerUtil.getWebhook(id);
	if (webhook != null)
	{
	    WebhookTriggerUtil.deleteWebhook(id);
	    System.out.println("Webhook deleted successfully");
	}
	else
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry, duplicate contact found with the same email address.").build());
	}
	System.out.println("webhook id " + webhook);
	return null;
    }

}