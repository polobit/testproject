package com.agilecrm.core.api.deals;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.export.util.DealExportBlobUtil;
import com.agilecrm.export.util.DealExportEmailUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.DealTriggerUtil;
import com.agilecrm.workflows.triggers.util.TriggerUtil;

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
	    List<Opportunity> deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters, 100);
	    System.out.println("total deals -----" + deals.size());

	    List<Opportunity> subList = new ArrayList<Opportunity>();
	    for (Opportunity deal : deals)
	    {
		deal.archived = true;
		subList.add(deal);
		if (subList.size() >= 100)
		{
		    Opportunity.dao.putAll(subList);
		    OpportunityUtil.updateSearchDoc(subList);
		    System.out.println("total sublist -----" + subList.size());
		    subList.clear();
		}
	    }

	    if (!subList.isEmpty())
	    {
		Opportunity.dao.putAll(subList);
		OpportunityUtil.updateSearchDoc(subList);
		System.out.println("total sublist -----" + subList.size());
	    }
	    ActivitySave.createBulkActionActivityForDeals(deals.size(), "BULK_DEAL_ARCHIVE", "", "deals", "");

	    BulkActionNotifications.publishNotification(deals.size() + " Deals are archived.");

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
	    List<Opportunity> deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters, 100);
	    System.out.println("total deals -----" + deals.size());

	    List<Opportunity> subList = new ArrayList<Opportunity>();
	    for (Opportunity deal : deals)
	    {
		deal.archived = false;
		subList.add(deal);
		if (subList.size() >= 100)
		{
		    Opportunity.dao.putAll(subList);
		    OpportunityUtil.updateSearchDoc(subList);
		    System.out.println("total sublist -----" + subList.size());
		    subList.clear();
		}
	    }

	    if (!subList.isEmpty())
	    {
		Opportunity.dao.putAll(subList);
		OpportunityUtil.updateSearchDoc(subList);
		System.out.println("total sublist -----" + subList.size());
	    }
	    ActivitySave.createBulkActionActivityForDeals(deals.size(), "BULK_DEAL_RESTORE", "", "deals", "");

	    BulkActionNotifications.publishNotification(deals.size() + " Deals are restored.");

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
	    List<Opportunity> deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters, 100);
	    System.out.println("total deals -----" + deals.size());

	    List<Opportunity> subList = new ArrayList<Opportunity>();
	    for (Opportunity deal : deals)
	    {
		deal.owner_id = String.valueOf(ownerId);
		subList.add(deal);
		if (subList.size() >= 100)
		{
		    Opportunity.dao.putAll(subList);
		    OpportunityUtil.updateSearchDoc(subList);
		    System.out.println("total sublist -----" + subList.size());
		    subList.clear();
		}
	    }

	    if (!subList.isEmpty())
	    {
		Opportunity.dao.putAll(subList);
		OpportunityUtil.updateSearchDoc(subList);
		System.out.println("total sublist -----" + subList.size());
	    }

	    String owner_name = DomainUserUtil.getDomainUser(ownerId).name;
	    ActivitySave.createBulkActionActivityForDeals(deals.size(), "BULK_DEAL_OWNER_CHANGE", owner_name, "deals",
		    "");
	    BulkActionNotifications.publishNotification("Owner changed for " + deals.size() + " Deals.");

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
	String milestone_name = null;
	String pipeline_name = null;
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

	    List<Opportunity> deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters, 100);
	    System.out.println("total deals -----" + deals.size());

	    // Get Deal Milestone change triggers
	    List<Trigger> triggers = TriggerUtil.getTriggersByCondition(Trigger.Type.DEAL_MILESTONE_IS_CHANGED);

	    List<Opportunity> subList = new ArrayList<Opportunity>();
	    for (Opportunity deal : deals)
	    {

		// For triggers
		Long oldPipelineId = deal.getPipeline_id();
		String oldMilestone = deal.milestone;

		if (formJSON.has("pipeline"))
		    deal.pipeline_id = formJSON.getLong("pipeline");
		if (formJSON.has("pipeline-name"))
		    pipeline_name = formJSON.getString("pipeline-name");
		if (formJSON.has("milestone"))
		    milestone_name = deal.milestone = formJSON.getString("milestone");

		// If there is change in pipeline or milestone
		if (!oldPipelineId.equals(deal.pipeline_id) || !oldMilestone.equals(deal.milestone))
		    subList.add(deal);

		if (subList.size() >= 100)
		{
		    Opportunity.dao.putAll(subList);
		    OpportunityUtil.updateSearchDoc(subList);

		    // Trigger Bulk Deal Milestone change
		    if (!triggers.isEmpty())
			DealTriggerUtil.triggerBulkDealMilestoneChange(subList, triggers);

		    System.out.println("total sublist -----" + subList.size());
		    subList.clear();
		}
	    }

	    if (!subList.isEmpty())
	    {
		Opportunity.dao.putAll(subList);
		OpportunityUtil.updateSearchDoc(subList);

		// Trigger Bulk Deal Milestone change
		if (!triggers.isEmpty())
		    DealTriggerUtil.triggerBulkDealMilestoneChange(subList, triggers);

		System.out.println("total sublist -----" + subList.size());
	    }

	    ActivitySave.createBulkActionActivityForDeals(deals.size(), "BULK_DEAL_MILESTONE_CHANGE", milestone_name,
		    "deals", pipeline_name);
	    BulkActionNotifications.publishNotification("Track/Milestone changed for " + deals.size() + " Deals.");
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }

    /**
     * Call backends to delete deals in bulk.
     */
    @Path("/delete/{current_user_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteDeals(@PathParam("current_user_id") Long currentUserId, @FormParam("ids") String ids,
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
	    List<Opportunity> deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters, 100);
	    System.out.println("total deals -----" + deals.size());
	    JSONArray dealIdsArray = new JSONArray();
	    List<Opportunity> subList = new ArrayList<Opportunity>();
	    for (Opportunity deal : deals)
	    {
		dealIdsArray.put(deal.id);
		subList.add(deal);
		if (subList.size() >= 100)
		{
		    Opportunity.dao.deleteAll(subList);
		    System.out.println("total sublist -----" + subList.size());
		    DealTriggerUtil.executeTriggerForDeleteDeal(dealIdsArray);
		    OpportunityUtil.deleteSearchDoc(subList);
		    subList.clear();
		    ActivitySave.createLogForBulkDeletes(EntityType.DEAL, dealIdsArray,
			    String.valueOf(dealIdsArray.length()), "");
		    dealIdsArray = new JSONArray();
		}
	    }

	    if (!subList.isEmpty())
	    {
		Opportunity.dao.deleteAll(subList);
		OpportunityUtil.deleteSearchDoc(subList);
		System.out.println("total sublist -----" + subList.size());
		DealTriggerUtil.executeTriggerForDeleteDeal(dealIdsArray);
		ActivitySave.createLogForBulkDeletes(EntityType.DEAL, dealIdsArray,
			String.valueOf(dealIdsArray.length()), "");
	    }

	    BulkActionNotifications.publishNotification(deals.size() + " Deals are deleted.");
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }

    /**
     * Export list of opportunities. Create a CSV file with list of deals and
     * add it as a attachment and send the email.
     */
    @Path("/export/{current_user_id}")
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void exportOpportunitiesBackend(@PathParam("current_user_id") Long currentUserId,
	    @QueryParam("cursor") String cursor, @QueryParam("page_size") String count,
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
	String currentCursor = null;
	String previousCursor = null;
	int firstTime = 0;
	String path = null;
	List<Opportunity> deals = null;
	long total = 0;
	int max = 1000;
	try
	{
	    org.json.JSONObject filterJSON = new org.json.JSONObject(filters);
	    System.out.println("------------" + filterJSON.toString());

	    do
	    {
		deals = OpportunityUtil.getOpportunitiesByFilter(filterJSON, max, currentCursor);
		currentCursor = deals.get(deals.size() - 1).cursor;
		firstTime++;
		if (firstTime == 1)
		    path = DealExportBlobUtil.writeDealCSVToBlobstore(deals, false);
		else
		    DealExportBlobUtil.editExistingBlobFile(path, deals, false);
		total += deals.size();
	    } while (deals.size() > 0 && !StringUtils.equals(previousCursor, currentCursor));
	    DealExportBlobUtil.editExistingBlobFile(path, null, true);
	    List<String> fileData = DealExportBlobUtil.retrieveBlobFileData(path);
	    if (count == null)
		count = String.valueOf(total);
	    // Send every partition as separate email
	    for (String partition : fileData)
		DealExportEmailUtil.exportDealCSVAsEmail(DomainUserUtil.getDomainUser(currentUserId), partition,
			String.valueOf(count));
	}
	catch (JSONException e)
	{
	    System.out.println("Exception in export deal in backend code. - " + e.getMessage());
	    e.printStackTrace();
	}
    }

}
