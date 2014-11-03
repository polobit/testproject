package com.agilecrm.core.api.deals;

import java.util.List;
import java.util.Set;

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
import javax.ws.rs.core.MediaType;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.deferred.DealsDeferredTask;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.export.util.DealExportBlobUtil;
import com.agilecrm.export.util.DealExportEmailUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.notification.util.DealNotificationPrefsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.workflows.triggers.util.DealTriggerUtil;
import com.google.appengine.api.backends.BackendServiceFactory;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;

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
@Path("/api/opportunity")
public class DealsAPI
{
    /**
     * Returns list of opportunities. This method is called if TEXT_PLAIN is
     * request.
     * 
     * @return list of opportunities.
     */
    @Path("/byPipeline/based")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public JSONObject getOpportunitiesByPipelineWithMilestones(@QueryParam("owner_id") String ownerId,
	    @QueryParam("milestone") String milestone, @QueryParam("related_to") String contactId,
	    @QueryParam("order_by") String fieldName, @QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count, @QueryParam("pipeline_id") Long pipelineId)
    {
	if (count != null)
	    return OpportunityUtil.getOpportunitiesWithMilestones(ownerId, milestone, contactId, fieldName,
		    (Integer.parseInt(count)), cursor, pipelineId);
	return OpportunityUtil.getOpportunitiesWithMilestones(ownerId, milestone, contactId, fieldName, 0, cursor,
		pipelineId);
    }

    /**
     * Returns list of opportunities. This method is called if TEXT_PLAIN is
     * request.
     * 
     * @return list of opportunities.
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getOpportunities(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count)
    {
	if (count != null)
	{
	    return OpportunityUtil.getOpportunities((Integer.parseInt(count)), cursor);
	}
	return OpportunityUtil.getOpportunities();
    }

    /**
     * Returns list of opportunities. This method is called if TEXT_PLAIN is
     * request.
     * 
     * @param ownerId
     *            Owner of the deal.
     * @param milestone
     *            Deals Milestone.
     * @param contactId
     *            Id of the contact related to deal.
     * @param fieldName
     *            the name field to sort on.
     * @param cursor
     * @param count
     *            page size.
     * @return List of deals.
     */
    @Path("/based")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getOpportunitiesByFilter(@QueryParam("owner_id") String ownerId,
	    @QueryParam("milestone") String milestone, @QueryParam("related_to") String contactId,
	    @QueryParam("order_by") String fieldName, @QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count, @QueryParam("pipeline_id") Long pipelineId,
	    @QueryParam("filters") String filters)
    {
	if (filters != null)
	{
	    System.out.println(filters);
	    try
	    {
		org.json.JSONObject json = new org.json.JSONObject(filters);
		if (milestone != null)
		    json.put("milestone", milestone);
		System.out.println(json.toString());
		if (count != null)
		    return OpportunityUtil.getOpportunitiesByFilter(json, Integer.parseInt(count), cursor);
		return OpportunityUtil.getOpportunitiesByFilter(json, 0, cursor);
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}
	if (count != null)
	{
	    return OpportunityUtil.getOpportunitiesByFilter(ownerId, milestone, contactId, fieldName,
		    (Integer.parseInt(count)), cursor, pipelineId);
	}
	return OpportunityUtil
		.getOpportunitiesByFilter(ownerId, milestone, contactId, fieldName, 0, cursor, pipelineId);
    }

    /**
     * Return opportunity with respect to Id. This method is called if XML is
     * request.
     * 
     * @param id
     *            - Opportunity Id to be fetched.
     * @return Opportunity object.
     */
    @Path("{opportunity-id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public Opportunity getOpportunity(@PathParam("opportunity-id") Long id)
    {
	Opportunity opportunity = OpportunityUtil.getOpportunity(id);
	return opportunity;
    }

    /**
     * Return opportunity with respect to Id. This method is called if XML is
     * request.
     * 
     * @param id
     *            - Opportunity Id to be fetched.
     * @return Opportunity object.
     * @throws JSONException
     */
    @Path("/byMilestone")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public JSONObject getOpportunitiesByMilestone()
    {
	JSONObject opportunity = OpportunityUtil.getDealsByMilestone();
	return opportunity;
    }

    /**
     * Return opportunities with respect to Milestone.
     * 
     * @param milestone
     *            - Milestone for the deals.
     * @return Opportunities list having the given milestone.
     */
    @Path("/byMilestone/{milestone}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public List<Opportunity> getOpportunitiesWithMilestone(@PathParam("milestone") String milestone)
    {
	return OpportunityUtil.getDeals(null, milestone, null);
    }

    /**
     * Saves new Opportunity.
     * 
     * @param opportunity
     *            - Opportunity object that is newly created.
     * @return created opportunity.
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Opportunity createOpportunity(Opportunity opportunity)
    {
	if (opportunity.pipeline_id == null || opportunity.pipeline_id == 0L)
	    opportunity.pipeline_id = MilestoneUtil.getMilestones().id;
	opportunity.save();
	try
	{
	    ActivitySave.createDealAddActivity(opportunity);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return opportunity;
    }

    /**
     * Updates opportunity.
     * 
     * @param opportunity
     *            - Opportunity object that is updated.
     * @return - updated opportunity.
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Opportunity updateOpportunity(Opportunity opportunity)
    {

	if (opportunity.pipeline_id == null || opportunity.pipeline_id == 0L)
	    opportunity.pipeline_id = MilestoneUtil.getMilestones().id;

	try
	{
	    ActivitySave.createDealEditActivity(opportunity);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	opportunity.save();
	return opportunity;
    }

    /**
     * Deletes single opportunity.
     * 
     * @param id
     *            - Opportunity id that should be deleted.
     * @throws com.google.appengine.labs.repackaged.org.json.JSONException
     */
    @Path("{opportunity-id}")
    @DELETE
    public void deleteOpportunity(@PathParam("opportunity-id") Long id)
	    throws com.google.appengine.labs.repackaged.org.json.JSONException
    {
	Opportunity opportunity = OpportunityUtil.getOpportunity(id);
	if (opportunity != null)
	{
	    if (!opportunity.getNotes().isEmpty())
		NoteUtil.deleteBulkNotes(opportunity.getNotes());
	    opportunity.delete();
	}
    }

    /**
     * Returns milestones with respect to given minimum time and maximum time.
     * Deals Stats - Milestones.
     * 
     * @param min
     *            - given time less than closed date of deal.
     * @param max
     *            - given time more than closed date of deal.
     * @return milestones.
     */
    @Path("stats/milestones")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getDealsStatsForMilestones(@QueryParam("min") Long min, @QueryParam("max") Long max)
    {
	return OpportunityUtil.getMilestones(min, max).toString();
    }

    /**
     * Returns milestones with respect to given minimum time and maximum time.
     * Deals Stats - Milestones.
     * 
     * @param min
     *            - given time less than closed date of deal.
     * @param max
     *            - given time more than closed date of deal.
     * @return milestones.
     */
    @Path("stats/milestones/{pipeline-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getDealsStatsForMilestonesByPipeline(@PathParam("pipeline-id") Long pipelineId,
	    @QueryParam("min") Long min, @QueryParam("max") Long max)
    {
	return OpportunityUtil.getMilestonesByPipeline(pipelineId, min, max).toString();
    }

    /**
     * Returns percentage of opportunities won compared to total opportunities
     * exist with respect to closed date. Deals Stats - Conversions.
     * 
     * @param min
     *            - Given time less than closed date.
     * @param max
     *            - Given time more than closed date.
     * @return percentage of opportunities won in given time period.
     */
    @Path("stats/conversions")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getConversions(@QueryParam("min") Long min, @QueryParam("max") Long max)
    {
	return OpportunityUtil.getConversionDetails(min, max).toString();
    }

    /**
     * Gets sum of expected values and pipeline values of the deals having
     * closed date within the month of given time period. Deals Stats - Details.
     * 
     * @param min
     *            - Given time less than closed date.
     * @param max
     *            - Given time more than closed date.
     * @return string having sum of expected values and pipeline values of the
     *         deals of same month.
     */
    @Path("stats/details")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getDealsDetails(@QueryParam("min") Long min, @QueryParam("max") Long max)
    {
	return OpportunityUtil.getDealsDetails(min, max).toString();
    }

    /**
     * Gets sum of expected values and pipeline values of the deals having
     * closed date within the month of given time period. Deals Stats - Details.
     * 
     * @param min
     *            - Given time less than closed date.
     * @param max
     *            - Given time more than closed date.
     * @return string having sum of expected values and pipeline values of the
     *         deals of same month.
     */
    @Path("stats/details/{pipeline-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getDealsDetailsByPipeline(@PathParam("pipeline-id") Long pipelineId, @QueryParam("min") Long min,
	    @QueryParam("max") Long max)
    {
	return OpportunityUtil.getDealsDetailsByPipeline(pipelineId, min, max).toString();
    }

    /**
     * Deletes the bulk of deals and executes trigger to the related contacts of
     * each deal. Bulk operations - delete.
     * 
     * @param model_ids
     *            array of deal ids as String.
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteOpportunities(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray opportunitiesJSONArray = new JSONArray(model_ids);

	// Executes trigger when deal is deleted
	DealTriggerUtil.executeTriggerForDeleteDeal(opportunitiesJSONArray);

	// Executes notification when deal is deleted
	DealNotificationPrefsUtil.executeNotificationForDeleteDeal(opportunitiesJSONArray);
	ActivitySave.createLogForBulkDeletes(EntityType.DEAL, opportunitiesJSONArray.toString(),
		String.valueOf(opportunitiesJSONArray.length()), "");
	Opportunity.dao.deleteBulkByIds(opportunitiesJSONArray);
    }

    /**
     * Deals related to current user
     * 
     * @return list of opportunities.
     */
    @Path("/my/deals")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getDealsRelatedToCurrentUser()
    {
	return OpportunityUtil.getDealsRelatedToCurrentUser();
    }

    /**
     * To display upcoming deals on DashBoard.
     * 
     * @param page_size
     * @return list of opportunities.
     */
    @Path("/my/upcoming-deals")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getUpcomingDealsRelatedToCurrentUser(@QueryParam("page_size") String page_size)
    {
	if (page_size != null)
	    return OpportunityUtil.getUpcomingDealsRelatedToCurrentUser(page_size);

	return OpportunityUtil.getUpcomingDealsRelatedToCurrentUser("10");
    }

    /**
     * Saves new Opportunity.
     * 
     * @param opportunity
     *            - Opportunity object that is newly created.
     * @param email
     *            email of contact to be added in deal.
     * @return created opportunity.
     */
    @Path("/email/{email}")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Opportunity createOpportunityByEmail(Opportunity opportunity, @PathParam("email") String email)
    {
	// Get the Contact based on the Email and add it to the Deal.
	Contact contact = ContactUtil.searchContactByEmail(email);
	if (contact != null)
	{
	    opportunity.addContactIds(contact.id.toString());
	}

	if (opportunity.pipeline_id == null || opportunity.pipeline_id == 0L)
	    opportunity.pipeline_id = MilestoneUtil.getMilestones().id;

	opportunity.save();
	return opportunity;
    }

    /**
     * Export list of opportunities. Create a CSV file with list of deals and
     * add it as a attachment and send the email.
     */
    @Path("/export")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void exportOpportunities(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count)
    {
	// Append the URL with the current userId to set the session manager in
	// the backend.
	OpportunityUtil.postDataToDealBackend("/core/api/opportunity/backend/export/"
		+ SessionManager.get().getDomainId());
    }

    /**
     * Export list of opportunities. Create a CSV file with list of deals and
     * add it as a attachment and send the email.
     */
    @Path("/backend/export/{current_user_id}")
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void exportOpportunitiesBackend(@PathParam("current_user_id") Long currentUserId,
	    @QueryParam("cursor") String cursor, @QueryParam("page_size") String count)
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
	int max = 1000;
	do
	{
	    deals = OpportunityUtil.getOpportunities(max, currentCursor);
	    currentCursor = deals.get(deals.size() - 1).cursor;
	    firstTime++;
	    if (firstTime == 1)
		path = DealExportBlobUtil.writeDealCSVToBlobstore(deals, false);
	    else
		DealExportBlobUtil.editExistingBlobFile(path, deals, false);
	} while (deals.size() > 0 && !StringUtils.equals(previousCursor, currentCursor));
	DealExportBlobUtil.editExistingBlobFile(path, null, true);
	List<String> fileData = DealExportBlobUtil.retrieveBlobFileData(path);
	if (count == null)
	    count = String.valueOf(deals.size());
	// Send every partition as separate email
	for (String partition : fileData)
	    DealExportEmailUtil.exportDealCSVAsEmail(DomainUserUtil.getCurrentDomainUser(), partition,
		    String.valueOf(count));
    }

    /**
     * Call backends for updating deals pipeline.
     */
    @Path("/bulk/default_track")
    @POST
    public void setDealtoDefaultTrack()
    {
	// Append the URL with the current userId to set the session manager in
	// the backend.
	String uri = "/core/api/opportunity/backend/bulk/default_track/" + SessionManager.get().getDomainId();

	String url = BackendServiceFactory.getBackendService().getBackendAddress("b1-sandbox");

	// Create Task and push it into Task Queue
	Queue queue = QueueFactory.getQueue("pipeline-queue");
	TaskOptions taskOptions = TaskOptions.Builder.withUrl(uri).header("Host", url).method(Method.POST);

	queue.addAsync(taskOptions);
    }

    @Path("/backend/bulk/default_track/{current_user_id}")
    @POST
    public void setDealtoDefaultTrackBackend(@PathParam("current_user_id") Long currentUserId)
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

	Set<String> namespaces = NamespaceUtil.getAllNamespaces();
	System.out.println("Total namespaces - " + namespaces.size());
	for (String domain : namespaces)
	{
	    DealsDeferredTask dealTracks = new DealsDeferredTask(domain);
	    // Initialize task here
	    Queue queue = QueueFactory.getQueue("pipeline-queue");

	    // Create Task and push it into Task Queue
	    TaskOptions taskOptions = TaskOptions.Builder.withPayload(dealTracks);

	    queue.add(taskOptions);
	}

    }

}
