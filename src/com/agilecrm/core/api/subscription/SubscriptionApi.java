package com.agilecrm.core.api.subscription;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.limits.cron.deferred.AccountLimitsRemainderDeferredTask;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.stripe.StripeImpl;
import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.stripe.exception.StripeException;


/**
 * <code>SubscriptionApi</code> class includes REST calls to interact with
 * subscription class to initiate billing operations.
 * <p>
 * It is called from client side for new subscription, plan update, credit card
 * details update and even for cancellation of subscription
 * </p>
 * 
 * @author Yaswanth
 * 
 * @since November 2012
 */
@Path("/api/subscription")
public class SubscriptionApi
{
    /**
     * Gets subscription entity of current domain
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
     * Gets subscription entity of particular domain
     * 
     * @return {@link Subscription}
     * @throws StripeException
     */
    @Path("/adminpanel/subscription/{domainname}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription getsubscriptionOfDomain(@PathParam("domainname") String domainname) throws StripeException
    { 
    	
    	//System.out.println(sc.billing_data_json_string.toString());
	return Subscription.getSubscriptionOfParticularDomain(domainname);

    }
    
    
    /**
     * Called from client either for new Subscription or updating user credit
     * card or plan , Based on the type of request(create, update(credit card or
     * plan) respective methods are called)
     * 
     * @param subscribe
     *            {@link Subscription}
     * @return
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription subscribe(Subscription subscribe) throws PlanRestrictedException, WebApplicationException
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

	    // Sets plan in session
	    BillingRestrictionUtil.setPlanInSession(subscribe.plan);

	    // Initializes task to clear tags
	    AccountLimitsRemainderDeferredTask task = new AccountLimitsRemainderDeferredTask(NamespaceManager.get());

	    // Add to queue
	    Queue queue = QueueFactory.getDefaultQueue();
	    queue.add(TaskOptions.Builder.withPayload(task));

	    return subscribe;
	}
	catch (PlanRestrictedException e)
	{
	    throw e;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    /*
	     * If Exception is raised during subscription send the exception
	     * message to client
	     */
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
    
    //upgrades subscription plan from adminpanel
    
    @Path("/adminpanel/subscribe")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription subscribeForParticularDomain(Subscription subscribe) throws PlanRestrictedException, WebApplicationException
    {
    	System.out.println("plan upgradation request from Admin panel/support panel");
    	System.out.println(subscribe);
    	String oldnamespace=NamespaceManager.get(); 
	try
	{   
		
		String domain=subscribe.domain_name;
		
		System.out.println("domain name in subscribe for particular domain "+domain);
		
	
		NamespaceManager.set(domain);
	
		
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

	    // Sets plan in session
	    BillingRestrictionUtil.setPlanInSession(subscribe.plan);

	    // Initializes task to clear tags
	    AccountLimitsRemainderDeferredTask task = new AccountLimitsRemainderDeferredTask(NamespaceManager.get());

	    // Add to queue
	    Queue queue = QueueFactory.getDefaultQueue();
	    queue.add(TaskOptions.Builder.withPayload(task));
       
	    return subscribe;
	}
	catch (PlanRestrictedException e)
	{
	    throw e;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    /*
	     * If Exception is raised during subscription send the exception
	     * message to client
	     */
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	finally{
		 NamespaceManager.set(oldnamespace);
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
	catch (PlanRestrictedException e)
	{
	    System.out.println("excpetion plan exception");
	    throw e;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    /**
     * Updates credit card details of customer and updates subscription object
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

    @Path("coupon/{coupon}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String checkCoupon(@PathParam("coupon") String coupon) throws Exception
    {
	return StripeImpl.getCoupon(coupon).toString();
    }

    /**
     * Fetches invoices of subscription details
     * 
     * @return {@link List}
     */
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
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
    
    //fetches list invoices for particular domain
    @Path("/adminpanel/invoices/{domainname}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List getCollectionOfInvoicesOfParticularDomain(@PathParam("domainname") String domainname)
    {
	try
	{
		
	    return Subscription.getInvoicesOfParticularDomain(domainname);
	}
	catch (Exception e)
	{ 
	e.printStackTrace();    
	throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	    
	}
    }
    
    

    /**
     * Deletes subscription object of the domain and deletes related customer
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
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Cancels subscription from gateway but never delete {@link Subscription}
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
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
    
  
  
    
}
