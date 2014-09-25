package com.agilecrm.core.api.subscription.addon;

import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.http.message.BasicNameValuePair;
import org.mozilla.javascript.tools.shell.Global;

import com.agilecrm.Globals;
import com.agilecrm.subscription.AgileBilling;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.subscription.ui.serialize.Plan.PlanType;
import com.google.appengine.api.NamespaceManager;
import com.google.gdata.util.common.xml.XmlWriter.Namespace;
import com.stripe.exception.APIConnectionException;
import com.stripe.exception.APIException;
import com.stripe.exception.AuthenticationException;
import com.stripe.exception.CardException;
import com.stripe.exception.InvalidRequestException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;

@Path("/api/subscription-addon")
public class AddonSubscriptionAPI
{
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void subscribe(@QueryParam("plan") String planid) throws PlanRestrictedException, WebApplicationException,
	    AuthenticationException, InvalidRequestException, APIConnectionException, CardException, APIException
    {
	System.out.println(planid);
	com.stripe.model.Plan plan = com.stripe.model.Plan.retrieve(planid, Globals.STRIPE_API_KEY);
	if (plan == null)
	    return;

	try
	{
	    Customer customer = SubscriptionUtil.getCustomer(NamespaceManager.get());
	    // Returns live mode sut
	    if (customer.getLivemode())
		return;

	    Map<String, Object> params = new HashMap<String, Object>();
	    params.put("plan", plan.getId());
	    // customer.createSubscription(params, Globals.STRIPE_API_KEY);

	}
	catch (StripeException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return;
    }

    @GET
    @Path("/subscribe")
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription getSubscription()
    {
	Subscription sub = SubscriptionUtil.getSubscription();
	
	return sub;
    }

    @POST
    @Path("/subscribe")
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void subscribe(Subscription subscription)
    {
	try
	{
	    //AgileBilling billing = subscription.getAgileBilling();
	    
	}
	catch (Exception e)
	{
	    /*
	     * If Exception is raised during subscription send the exception
	     * message to client
	     */
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
}
