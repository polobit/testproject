package com.agilecrm.core.api.subscription;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.customer.CreditCard;
import com.agilecrm.customer.Plan;
import com.agilecrm.subscription.Subscription;
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
	System.out.println(subscribe);
	try
	{

	    if (subscribe.plan == null && subscribe.card_details != null)
		return updateCreditCard(subscribe.card_details);

	    else if (subscribe.card_details == null && subscribe.plan != null)
		return changePlan(subscribe.plan);

	    return subscribe.createCustomer();

	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    @Path("/changeplan")
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

    @Path("/updatecard")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription updateCreditCard(CreditCard card_details)
    {
	try
	{
	    return Subscription.updateCreditCard(card_details);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    @Path("/delete/customer")
    @DELETE
    public void deleteSubscription()
    {
	try
	{
	    Subscription.getSubscription().deleteCustomer();
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
}
