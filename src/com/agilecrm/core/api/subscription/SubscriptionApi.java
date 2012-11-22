package com.agilecrm.core.api.subscription;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.util.DBUtil;
import com.google.appengine.api.NamespaceManager;
import com.stripe.exception.StripeException;

@Path("/api/subscription")
public class SubscriptionApi
{

    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription getsubscription() throws StripeException
    {
	return Subscription.getSubscription();

    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription subscribe(Subscription subscribe)
    {

	try
	{

	    if (subscribe.plan == null && subscribe.card_details != null)
		subscribe = updateCreditCard(subscribe.card_details);

	    else if (subscribe.card_details == null && subscribe.plan != null)
		subscribe = changePlan(subscribe.plan);

	    else if (subscribe.card_details != null && subscribe.plan != null)
		subscribe = subscribe.createCustomer();

	    return subscribe;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    @Path("/change-plan")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription changePlan(Plan plan)
    {
	try
	{
	    return Subscription.updatePlan(plan);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    @Path("/update-card")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription updateCreditCard(CreditCard card_details)
	    throws Exception
    {

	return Subscription.updateCreditCard(card_details);
    }

    @DELETE
    public void deleteSubscription()
    {
	try
	{
	    Subscription subscription = Subscription.getSubscription();

	    // Check if subscription is null
	    if (subscription != null)
		subscription.delete();

	    DBUtil.deleteNamespace(NamespaceManager.get());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    @Path("/invoices")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List getInvoices()
    {
	try
	{
	    return Subscription.getInvoices();
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    @Path("/cancel/subscription")
    @GET
    public void cancelSubscription()
    {
	try
	{
	    Subscription.getSubscription().delete();
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
}
