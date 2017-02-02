package com.agilecrm.webhooks.triggers.util;

import java.io.BufferedReader;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
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
    try{
		String domain = NamespaceManager.get();
		Subscription sub=SubscriptionUtil.getSubscription();
		System.out.println("plan name = "+ sub.plan.getPlanName());
		if(sub.plan.getPlanName().equals("ENTERPRISE") || sub.plan.getPlanName().equals("PRO")){
			webhook.domain = domain;
			
			webhook.save();
	
			Response.ok();
		}
		else{
			throw new Exception("Please upgrade to Enterprise plan to use this feature.");
		}
    	}
    	catch (Exception e) {
		e.printStackTrace();
		throw new WebApplicationException(Response
				.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
				.build());
    	}	
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
		    .entity("Sorry, no webhook found").build());
	}
	System.out.println("webhook id " + webhook);
	return null;
    }
    
    /**
     * 
     * @param webhook
     * @return
     * 
     * @return response ok
     */
    @Path("/create/")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Webhook saveWebhookDeveloper(Webhook webhook) {
	try {
	    String domain = NamespaceManager.get();
	    Subscription sub = SubscriptionUtil.getSubscription();
	    System.out.println("plan name = " + sub.plan.getPlanName());
	    if (sub.plan.getPlanName().equals("ENTERPRISE")
		    || sub.plan.getPlanName().equals("PRO")) {
		Webhook whook = WebhookTriggerUtil.getWebhook();
		if (whook != null) {
		    System.out.println("Webhook found = " + whook);
		    throw new Exception(
			    "Webhook found. Please remove current webhook to create new.");
		}

		webhook.domain = domain;

		webhook.save();

		return webhook;
	    }else {
		throw new Exception(
			"Please upgrade to Enterprise plan to use this feature.");
	    }	
	    
	} catch (Exception e) {
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    @Path("/list/")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Webhook> getListWebhook() {
	return WebhookTriggerUtil.getWebhooksList();
    }

    /**
     * 
     * @param webhook
     * @return 
     * 
     * @return response ok
     */
    @Path("/update/")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Webhook updateHookDeveloper(Webhook webhook) {

	try {
	    String domain = NamespaceManager.get();
	    Subscription sub = SubscriptionUtil.getSubscription();
	    System.out.println("plan name = " + sub.plan.getPlanName());
	    if (sub.plan.getPlanName().equals("ENTERPRISE")
		    || sub.plan.getPlanName().equals("PRO")) {

		
		Webhook whook = WebhookTriggerUtil.getWebhook(webhook.id);

		System.out.println("hook  = " + whook);
		if (whook == null ) {
		    throw new Exception("No Webhook found");
		}

		whook = webhook;
		whook.save();

		return whook;
	    } else {
		throw new Exception(
			"Please upgrade to Enterprise plan to use this feature.");
	    }
	} catch (Exception e) {
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }
    
    /**
     * For Zapier hook and other hook customer(future)
     * @param webhook
     * @return 
     * 
     * @return response ok
     */
    @POST
    @Path("/subscribe/hook")
    @Produces(MediaType.APPLICATION_JSON)
    public RestHookZap subscribeHook(@Context HttpServletRequest request, @Context HttpServletResponse response)
	    throws Exception
    {
	System.out.println("Register hook");
	StringBuffer stringBuffer = new StringBuffer();
	String line = null;
	try
	{
	    BufferedReader reader = request.getReader();
	    while ((line = reader.readLine()) != null)
		stringBuffer.append(line);
	}
	catch (Exception e)
	{
	    response.setStatus(HttpServletResponse.SC_CONFLICT);
	    e.printStackTrace();
	}

	System.out.println("StringBuffer..." + stringBuffer);

	JSONObject hookJSON = new JSONObject(stringBuffer.toString());

	if (!hookJSON.has("target_url") || !hookJSON.has("event"))
	{
	    response.setStatus(HttpServletResponse.SC_CONFLICT);

	    throw new Exception("Target URL not found or Event name not found.");
	}

	String target_url = hookJSON.getString("target_url");
	String event = hookJSON.getString("event");
	System.out.println("target URL = " + target_url);
	System.out.println("target event = " + event);
	System.out.println("Posted data from Zapier..." + hookJSON);

	return ZapierRestHook.subscribeHook(target_url, event);

    }

    @DELETE
    @Path("/unsubscribe/hook")
    @Produces(MediaType.APPLICATION_JSON)
    public String unSubscribeHook(@Context HttpServletRequest request, @Context HttpServletResponse response,
	    @QueryParam("id") String id) throws Exception
    {
	System.out.println("Webhooks to delete..." + id);

	JSONObject responseJSON = new JSONObject();
	responseJSON.put("response", "Hook removed successfully!....");
	response.setStatus(HttpServletResponse.SC_OK);

	if (!ZapierRestHook.unsubscribeHook(id))
	{
	    response.setStatus(HttpServletResponse.SC_CONFLICT);
	    responseJSON.put("response", "An error occured while removing hook.");
	}

	return responseJSON.toString();
    }

}