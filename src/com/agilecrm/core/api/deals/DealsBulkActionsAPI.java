package com.agilecrm.core.api.deals;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;

/**
 * <code>DealsAPI</code> includes REST calls to interact with
 * {@link Opportunity} class to initiate Opportunity/Deal CRUD operations.
 * <p>
 * It is called from client side to create, update, fetch and delete the
 * opportunities. It also interacts with {@link OpportunityUtil} class to fetch
 * the data of Opportunity class from database.
 * </p>
 * 
 * @author Yaswanth
 * 
 */
@Path("/api/opportunity/backend")
public class DealsBulkActionsAPI
{
    /**
     * Call backends to archive deals in bulk.
     */
    @Path("/archive/{current_user_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void archiveDeals(@PathParam("current_user_id") Long currentUserId, @FormParam("ids") String ids,
	    @FormParam("filter") String filters)
    {
	// Set the session manager to get the user preferences and the other
	// details required.
	if (SessionManager.get() != null)
	{
	    SessionManager.get().setDomainId(currentUserId);
	}
	else
	{
	    DomainUser user = DomainUserUtil.getDomainUser(currentUserId);
	    SessionManager.set(new UserInfo(null, user.email, user.name));
	    SessionManager.get().setDomainId(user.id);
	}

	try
	{
	    List<Opportunity> deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters);

	    for (Opportunity deal : deals)
	    {
		deal.archived = true;
	    }
	    Opportunity.dao.putAll(deals);

	    BulkActionNotifications.publishNotification(deals.size() + " deals are archived.");
	    OpportunityUtil.updateSearchDoc(deals);
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }

    /**
     * Call backends for restoring deals in bulk.
     */
    @Path("/restore/{current_user_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void restoreDeals(@PathParam("current_user_id") Long currentUserId, @FormParam("ids") String ids,
	    @FormParam("filter") String filters)
    {
	// Set the session manager to get the user preferences and the other
	// details required.
	if (SessionManager.get() != null)
	{
	    SessionManager.get().setDomainId(currentUserId);
	}
	else
	{
	    DomainUser user = DomainUserUtil.getDomainUser(currentUserId);
	    SessionManager.set(new UserInfo(null, user.email, user.name));
	    SessionManager.get().setDomainId(user.id);
	}

	try
	{
	    List<Opportunity> deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters);

	    for (Opportunity deal : deals)
	    {
		deal.archived = false;
	    }
	    Opportunity.dao.putAll(deals);

	    BulkActionNotifications.publishNotification(deals.size() + " deals are restored.");
	    OpportunityUtil.updateSearchDoc(deals);
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }

    /**
     * Call backends for updating deals owner in bulk.
     */
    @Path("/change-owner/{owner_id}/{current_user_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void changeOwnerForDeals(@PathParam("current_user_id") Long currentUserId,
	    @PathParam("owner_id") Long ownerId, @FormParam("ids") String ids, @FormParam("filter") String filters)
    {
	// Set the session manager to get the user preferences and the other
	// details required.
	if (SessionManager.get() != null)
	{
	    SessionManager.get().setDomainId(currentUserId);
	}
	else
	{
	    DomainUser user = DomainUserUtil.getDomainUser(currentUserId);
	    SessionManager.set(new UserInfo(null, user.email, user.name));
	    SessionManager.get().setDomainId(user.id);
	}

	try
	{
	    List<Opportunity> deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters);

	    for (Opportunity deal : deals)
	    {
		deal.owner_id = String.valueOf(ownerId);
	    }
	    Opportunity.dao.putAll(deals);
	    BulkActionNotifications.publishNotification("Owner changed for " + deals.size() + " deals.");
	    OpportunityUtil.updateSearchDoc(deals);
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }

    /**
     * Call backends for updating pipeline and milestone of deals in bulk.
     */
    @Path("/change-milestone/{current_user_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void changMilestoneForDeals(@PathParam("current_user_id") Long currentUserId, @FormParam("ids") String ids,
	    @FormParam("filter") String filters, @FormParam("form") String form)
    {
	DomainUser user = DomainUserUtil.getDomainUser(currentUserId);

	// Set the session manager to get the user preferences and the other
	// details required.
	if (SessionManager.get() != null)
	{
	    SessionManager.get().setDomainId(currentUserId);
	}
	else
	{
	    SessionManager.set(new UserInfo(null, user.email, user.name));
	    SessionManager.get().setDomainId(user.id);
	}

	try
	{
	    JSONObject formJSON = new JSONObject(form);
	    System.out.println("------------" + formJSON.toString());

	    List<Opportunity> deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters);

	    for (Opportunity deal : deals)
	    {
		if (formJSON.has("pipeline"))
		    deal.pipeline_id = formJSON.getLong("pipeline");
		if (formJSON.has("milestone"))
		    deal.milestone = formJSON.getString("milestone");
	    }
	    Opportunity.dao.putAll(deals);
	    BulkActionNotifications.publishNotification("Milestone changed for " + deals.size() + " deals.");
	    OpportunityUtil.updateSearchDoc(deals);
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }
}
