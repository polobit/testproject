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
import com.stripe.exception.StripeException;

@Path("/api/subscription")
public class SubscriptionApi
{
    /**
     * Get subscription entity of current domain
     * 
     * @return {@link Subscription}
     * @throws StripeException
     */
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription getsubscription() throws StripeException
    {
	return Subscription.getSubscription();

    }

    /**
     * Called from client either for new Subscription or updating user
     * creditcard or plan for current domain, Based on the type of
     * request(create, update(creditcard or plan) respective methods are called)
     * 
     * @param subscribe
     *            {@link Subscription}
     * @return
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription subscribe(Subscription subscribe)
    {

	try
	{
	    /*
	     * If plan variable in subscription is not null and card details are
	     * null then updateCreditcard is called
	     */
	    if (subscribe.plan == null && subscribe.card_details != null)
		subscribe = updateCreditcard(subscribe.card_details);

	    /*
	     * If card_details are null and plan in not null then update plan
	     * for current domain subscription object
	     */
	    else if (subscribe.card_details == null && subscribe.plan != null)
		subscribe = changePlan(subscribe.plan);

	    /*
	     * If credit_card details and plan details are not null then it is
	     * new subscription
	     */
	    else if (subscribe.card_details != null && subscribe.plan != null)
		subscribe = subscribe.createNewSubscription();

	    return subscribe;
	}
	catch (Exception e)
	{
	    e.printStackTrace();

	    /*
	     * If Exception is raised during subscription send the exception
	     * message to client
	     */
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}
    }

    /**
     * Updates the plan of current domain subscription object
     * 
     * @param plan
     *            {@link Plan}
     * @return
     */
    @Path("/change-plan")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription changePlan(Plan plan)
    {
	try
	{
	    // Return updated subscription object
	    return Subscription.updatePlan(plan);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}

    }

    /**
     * Update creditcard details of customer of current domain subscription
     * object
     * 
     * @param card_details
     * @return {@link Subscription}
     * @throws Exception
     */
    @Path("/update-card")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription updateCreditcard(CreditCard card_details) throws Exception
    {

	return Subscription.updateCreditCard(card_details);
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
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}
    }

    /**
     * Delete subscription object of the domain and deletes related customer
     */
    @Path("delete/account")
    @DELETE
    public void deleteSubscription()
    {
	try
	{
	    // Get current domain subscription entity
	    Subscription subscription = Subscription.getSubscription();

	    // Check if subscription is not null delete
	    // subscription(subscription call delete customer form gateway)
	    if (subscription != null)
		subscription.delete();
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}
    }

    /**
     * Cancel subscription from gate way but never delete {@link Subscription}
     * entity
     */
    @Path("/cancel/subscription")
    @GET
    public void cancelSubscription()
    {
	try
	{
	    Subscription.getSubscription().cancelSubscription();
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}
    }
}
