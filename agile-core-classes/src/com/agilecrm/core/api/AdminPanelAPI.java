package com.agilecrm.core.api;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.document.util.DocumentUtil;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.limits.cron.deferred.AccountLimitsRemainderDeferredTask;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.AccountDeleteUtil;
import com.agilecrm.webrules.util.WebRuleUtil;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.analytics.util.AnalyticsSQLUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.gson.Gson;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import com.stripe.model.Refund;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

@Path("/api/admin_panel")
public class AdminPanelAPI
{
    // fetches users for particular domain

    @Path("/getParticularDomainUsers")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<DomainUser> getDomainUserDetails(@QueryParam("d") String domainname)
    {
	if (StringUtils.isEmpty(NamespaceManager.get()) || !NamespaceManager.get().equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}
	try
	{

	    String domain = domainname;
	    if (domain.contains("@"))
	    {
		String email = domain;
		DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);
		if (domainUser != null)
		{
		    String userDomain = domainUser.domain;
		    List<DomainUser> domainUsers = DomainUserUtil.getUsers(userDomain);
		    return domainUsers;
		}
	    }
	    // Gets the users and update the password to the masked one
	    List<DomainUser> users = DomainUserUtil.getUsers(domain);
	    return users;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets list of all domain users irrespective of domain for the users of
     * domain "admin".
     * 
     * @return DomainUsers list
     */
    @Path("/getAllDomainUsers")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<DomainUser> getAllDomainUsers(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count)
    {

     try{

	    String domain = NamespaceManager.get();

		if (StringUtils.isEmpty(domain) || !domain.equals("admin"))
		{
		    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry you don't have privileges to access this page.").build());
		}

		if (count != null)
		{
		    System.out.println("Fetching page by page");
		    return DomainUserUtil.getAllDomainUsers(Integer.parseInt(count), cursor);
		}

		

     }catch(Exception e){
            System.out.println(e.getMessage());      
     }
	
       return DomainUserUtil.getAllUsers();
	
    }

    /**
     * Delete domain users of particular namespace
     */
    @Path("/deletedomain/{namespace}")
    @DELETE
    public void deleteDomainUser(@PathParam("namespace") String namespace)
    {
	System.out.println("delete request for deletion of account from admin panel " + namespace);
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain) || !domain.equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}

	try
	{
	    AccountDeleteUtil.deleteNamespace(namespace);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    @Path("/deleteuser")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteDomainUserFromAdminPanel(@QueryParam("id") String id)
    {
	System.out.println("delete request for domain user deletion from admin panel" + id);
	DomainUser domainUser;
	if (StringUtils.isEmpty(NamespaceManager.get()) || !NamespaceManager.get().equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}
	try
	{
	    long domainuserid = Long.parseLong(id);

	    domainUser = DomainUserUtil.getDomainUser(domainuserid);
	    int count = DomainUserUtil.count(domainUser.domain);

	    // Throws exception, if only one account exists
	    if (count == 1)
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		        .entity("Can�t delete all users").build());

	    // Throws exception, if user is owner
	    if (domainUser.is_account_owner)
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		        .entity("Master account can�t be deleted").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

	AccountDeleteUtil.deleteRelatedEntities(domainUser.id);

	domainUser.delete();
    }

    // fetches account stats from admin panel for partcular domain- stats means
    // count for contacts,triggers..
    @Path("/getdomainstats")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public String getAccountStats(@QueryParam("d") String domainname)
    {
	if (StringUtils.isEmpty(NamespaceManager.get()) || !NamespaceManager.get().equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}
	String oldnamespace = NamespaceManager.get();
	NamespaceManager.set(domainname);

	JSONObject json = new JSONObject();

	int webrulecount = WebRuleUtil.getCount();
	int contactcount = ContactUtil.getCount();
	int dealscount = OpportunityUtil.getCount();
	int docs = DocumentUtil.getCount();
	int eventcount = EventUtil.getCount();
	int compaigncount = WorkflowUtil.getCount();
	int triggerscount = TriggerUtil.getCount();
	int webstats = AnalyticsSQLUtil.getPageViewsCountForGivenDomain(domainname);

	String emailinfo = MandrillSubAccounts.getSubAccountInfo(domainname, null);

	try
	{
	    json.put("webrule_count", webrulecount);
	    json.put("contact_count", contactcount);
	    json.put("deals_count", dealscount);
	    json.put("docs_count", docs);
	    json.put("events_count", eventcount);
	    json.put("compaign_count", compaigncount);
	    json.put("triggers_count", triggerscount);
	    json.put("webstats_count", webstats);
	    json.put("emailcount", emailinfo);

	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldnamespace);
	}
	System.out.println("status account " + json);

	return json.toString();
    }

    // used to changes password from admin panel
    @Path("/changepassword/{id}")
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void changePasswordOfCurrentDomainUserFromAdminPanel(@PathParam("id") String id,
	    @FormParam("new_pswd") String newPassword) throws Exception
    {
	if (StringUtils.isEmpty(NamespaceManager.get()) || !NamespaceManager.get().equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}
	long idofuseremail = Long.parseLong(id);
	DomainUser currentDomainUser = DomainUserUtil.getDomainUser(idofuseremail);

	try
	{
	    currentDomainUser.password = newPassword;
	    currentDomainUser.save();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    // -------subscription-----

    /**
     * Gets subscription entity of particular domain
     * 
     * @return {@link Subscription}
     * @throws StripeException
     */
    @Path("/subscriptionofparticulardomain")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription getsubscriptionOfDomain(@QueryParam("d") String domainname) throws StripeException
    {
    	
//	if (StringUtils.isEmpty(NamespaceManager.get()) || (!NamespaceManager.get().equals("admin") && !NamespaceManager.get().equals("our")))
//	{
//	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
//		    .entity("Sorry you don't have privileges to access this page.").build());
//	}

	// System.out.println(sc.billing_data_json_string.toString());
	return Subscription.getSubscriptionOfParticularDomain(domainname);

    }

    // upgrades subscription plan from adminpanel

    @Path("/upgradesubscription")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Subscription subscribeForParticularDomain(Subscription subscribe) throws PlanRestrictedException,
	    WebApplicationException
    {
	if (StringUtils.isEmpty(NamespaceManager.get()) || !NamespaceManager.get().equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}
	String oldnamespace = NamespaceManager.get();
	try
	{

	    String domain = subscribe.domain_name;

	    System.out.println("domain name in subscribe for particular domain " + domain);

	    NamespaceManager.set(domain);

	    /*
	     * If card_details are null and plan in not null then update plan
	     * for current domain subscription object
	     */
	    if (subscribe.card_details == null && subscribe.plan != null)
		subscribe = changePlan(subscribe.plan);

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
	finally
	{
	    NamespaceManager.set(oldnamespace);
	}
    }

    /**
     * Updates the plan of particular domain subscription object
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

    // invoices of particulat domain

    // fetches list invoices for particular domain
    @Path("/getinvoices")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List getCollectionOfInvoicesOfParticularDomain(@QueryParam("d") String domainname)
    {
	if (StringUtils.isEmpty(NamespaceManager.get()) || !NamespaceManager.get().equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}
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

    @Path("/getcustomer")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Customer getStripeCustomerDetails(@QueryParam("d") String domainname) throws StripeException
    {
	if (StringUtils.isEmpty(NamespaceManager.get()) || !NamespaceManager.get().equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}
	Customer cus = SubscriptionUtil.getCustomer(domainname);
	System.out.println("customer object in Adminpanel api " + cus);
	return cus;
    }

    // gets collection of charges of a customer

    @Path("/getcharges")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getCollectionOfChargesOfCustomer(@QueryParam("d") String customerid)
    {
	if (StringUtils.isEmpty(NamespaceManager.get()) || !NamespaceManager.get().equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}
	try
	{

	    List<Charge> list = StripeUtil.getCharges(customerid);
	    System.out.println(list);
	    String customerJSONString = new Gson().toJson(list);
	    return customerJSONString;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}
    }

    // apply for refund based on charge id

    @Path("/applyrefund")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Charge applyRefund(@QueryParam("chargeid") String chargeid)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(chargeid) || !domain.equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}

	try
	{

	    Charge chrge = StripeUtil.createRefund(chargeid);
	    return chrge;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}

    }

    // partial refund
    @Path("/applypartialrefund")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Refund applyPartialRefund(@QueryParam("chargeid") String chargeId, @QueryParam("amount") Integer amount)
	    throws StripeException
    {
	String domain = NamespaceManager.get();
	System.out.println(chargeId);
	System.out.println(amount);
	if (StringUtils.isEmpty(chargeId) || !domain.equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}

	try
	{

	    Refund refund = StripeUtil.createPartialRefund(chargeId, amount);
	    return refund;

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}

    }

    // delete Subscription
    @Path("/deletesubscription")
    @DELETE
    public void deleteSubscription(@QueryParam("subscription_id") String sub_id, @QueryParam("cus_id") String cus_id)
    {
	if (StringUtils.isEmpty(NamespaceManager.get()) || !NamespaceManager.get().equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}
	StripeUtil.deleteSubscription(sub_id, cus_id);

    }
   
    @Path("/resumeMandrill")
    @PUT
    public void resumeMandrill(@QueryParam("domain") String domain){
    	String d = NamespaceManager.get();
    	if (!d.equals("admin"))
    	{
    	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
    		    .entity("Sorry you don't have privileges to access this page.").build());
    	}
    	try{
    	MandrillSubAccounts.resumeSubaccount(domain);
    	}
    	catch(Exception e){
    		 e.printStackTrace();
    		 System.out.println("error occured while resume mandrill..." + e.getMessage());
    	}
    }
    
    @Path("/users_count")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getsubscriptionOfDomainForOur(@QueryParam("d") String domainname) throws StripeException
    {
	if (StringUtils.isEmpty(NamespaceManager.get()) || (!NamespaceManager.get().equals("admin") && !NamespaceManager.get().equals("our")))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
	}
	String oldNameSpace = NamespaceManager.get();
	try{
		NamespaceManager.set(domainname);
		JSONObject json = new JSONObject();
		int remainingEmails = 0;
		BillingRestriction restrictions = BillingRestrictionUtil.getBillingRestrictionFromDB();
		int count = restrictions.one_time_emails_count;
		int max = restrictions.max_emails_count;
			
			// if max is greater than zero, we consider user is subscrbed to email plan
			if(max > 0)
			{
				// In case of count is less than zero we return 0;
				if(count < 0)
					remainingEmails =  0;
				else
				remainingEmails = count;
			}
			
			// If max is zero then it is free plan
			else if(max == 0)
			{
				// Count comes as a negavie value here
				int remaining =  5000 + count;
				if(remaining < 0)
					remainingEmails = 0;
				else
				remainingEmails = remaining;
			}
		json.put("userCount", DomainUserUtil.count());
		json.put("remainingEmails", remainingEmails);
		return json.toString();

	}catch(Exception e){
		e.printStackTrace();
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
			    .build());
	}finally{
		NamespaceManager.set(oldNameSpace);
	}
    }

}
