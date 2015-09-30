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

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.deferred.DealsDeferredTask;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.notification.util.DealNotificationPrefsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.workflows.triggers.util.DealTriggerUtil;
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
    public List<Opportunity> getOpportunitiesWithMilestone(@PathParam("milestone") String milestone,
	    @QueryParam("cursor") String cursor, @QueryParam("page_size") String count)
    {
	int counts = 0;
	if (count != null)
	{
	    counts = Integer.parseInt(count);
	    if (counts > 50)
		counts = 50;

	    System.out.println("Test page size = " + counts);

	    return OpportunityUtil.getDealsWithMilestone(null, milestone, null, counts, cursor);
	}
	else
	{
	    counts = 5;
	    System.out.println("Test page size1 = " + counts);
	    return OpportunityUtil.getDealsWithMilestone(null, milestone, null, counts, cursor);
	}

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
	    throws com.google.appengine.labs.repackaged.org.json.JSONException, JSONException
    {
	Opportunity opportunity = OpportunityUtil.getOpportunity(id);
	if (opportunity != null)
	{
	    ActivitySave.createDealDeleteActivity(opportunity);
	    if (!opportunity.getNotes().isEmpty())
		NoteUtil.deleteBulkNotes(opportunity.getNotes());
	    opportunity.delete();
	}
    }

    /**
     * Deletes single opportunity.
     * 
     * @param id
     *            - Opportunity id that should be deleted.
     * @throws com.google.appengine.labs.repackaged.org.json.JSONException
     */
    @Path("/delete")
    @POST
    public void quickDeleteOpportunity(@FormParam("ids") String ids)
	    throws com.google.appengine.labs.repackaged.org.json.JSONException, JSONException
    {
	JSONArray opportunitiesJSONArray = new JSONArray(ids);
	DealTriggerUtil.executeTriggerForDeleteDeal(opportunitiesJSONArray);
	DealNotificationPrefsUtil.executeNotificationForDeleteDeal(opportunitiesJSONArray);
	ActivitySave.createLogForBulkDeletes(EntityType.DEAL, opportunitiesJSONArray,
		String.valueOf(opportunitiesJSONArray.length()), "");
	Opportunity.dao.deleteBulkByIds(opportunitiesJSONArray);

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
	return OpportunityUtil.getDealsDetailsByPipeline(null,pipelineId, min, max,null).toString();
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
    public void deleteOpportunities(@FormParam("ids") String ids, @FormParam("filter") String filters)
	    throws JSONException
    {
	try
	{
	    if (StringUtils.isNotEmpty(ids))
	    {
		JSONArray idsArray = new JSONArray(ids);
		System.out.println("------------" + idsArray.length());
	    }

	    if (StringUtils.isEmpty(filters))
		filters = "{}";

	    org.json.JSONObject filterJSON = new org.json.JSONObject(filters);
	    System.out.println("------------" + filterJSON.toString());

	    String uri = "/core/api/opportunity/backend/delete/" + SessionManager.get().getDomainId();

	    OpportunityUtil.postDataToDealBackend(uri, filters, ids);
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
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
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void exportOpportunities(@FormParam("filter") String filter)
    {
	org.json.JSONObject filterJSON;
	try
	{
	    filterJSON = new org.json.JSONObject(filter);
	    System.out.println("------------" + filterJSON.toString());

	    // Append the URL with the current userId to set the session manager
	    // in
	    // the backend.
	    OpportunityUtil.postDataToDealBackend("/core/api/opportunity/backend/export/"
		    + SessionManager.get().getDomainId(), filter);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    /**
     * Call backends for updating deals pipeline.
     */
    @Path("/bulk/set_default")
    @POST
    public void setDealtoDefaultTrack()
    {
	// Append the URL with the current userId to set the session manager in
	// the backend.
	String uri = "/core/api/opportunity/backend/bulk/set_default/" + SessionManager.get().getDomainId();

	// Create Task and push it into Task Queue
	Queue queue = QueueFactory.getQueue("pipeline-queue");
	TaskOptions taskOptions = TaskOptions.Builder.withUrl(uri).method(Method.POST);

	queue.addAsync(taskOptions);
    }

    @Path("/backend/bulk/set_default/{current_user_id}")
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

    /**
     * Notes of a deal, which is in deal detail view
     * 
     * @param id
     *            deal id to get its related entities (notes)
     * @return list of notes related to a deal
     * @throws Exception
     */
    @Path("/{deal-id}/notes")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Note> getNotes(@PathParam("deal-id") Long id) throws Exception
    {
	List<Note> notes = NoteUtil.getDealNotes(id);
	List<Note> dealNotes = OpportunityUtil.getOpportunity(id).getNotes();
	if (notes != null && notes.size() > 0)
	{
	    for (Note no : notes)
	    {
		dealNotes.add(no);
	    }
	}
	return dealNotes;
    }

    /**
     * Notes of a deal, which is in deal detail view
     * 
     * @param id
     *            deal id to get its related entities (notes)
     * @return list of notes related to a deal
     */
    @Path("/{deal-id}/related_to")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getRelatedContacts(@PathParam("deal-id") Long id)
    {
	Opportunity opportunity = OpportunityUtil.getOpportunity(id);
	return opportunity.getContacts();
    }

    /**
     * update the owner of deal from deal details page
     * 
     * @param new_owner
     * @param dealid
     * @return
     * @throws JSONException
     */
    @Path("/change-owner/{new_owner}/{dealid}")
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Opportunity changeOwnerToDeal(@PathParam("new_owner") String new_owner, @PathParam("dealid") Long dealid)
	    throws JSONException
    {

	Opportunity opportunity = OpportunityUtil.getOpportunity(dealid);
	try
	{

	    String oldownername = opportunity.getOwner().name;

	    String new_owner_name = DomainUserUtil.getDomainUser(Long.parseLong(new_owner)).name;

	    List<Contact> contacts = opportunity.getContacts();
	    JSONArray jsn = null;
	    if (contacts != null && contacts.size() > 0)
	    {
		jsn = ActivityUtil.getContactIdsJson(contacts);
	    }

	    ActivityUtil.createDealActivity(ActivityType.DEAL_OWNER_CHANGE, opportunity, new_owner_name, oldownername,
		    "owner_name", jsn);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	opportunity.owner_id = new_owner;

	opportunity.save();
	return opportunity;
    }

    /**
     * fetches activities of a deal in deal details page
     * 
     * @param dealid
     * @param cursor
     * @param count
     * @return
     * @throws JSONException
     */
    @Path("/{dealid}/activities")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Activity> getActivitiesOfDeal(@PathParam("dealid") Long dealid, @QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count) throws JSONException
    {

	return ActivityUtil.getActivitiesByEntityId("DEAL", dealid, Integer.parseInt(count), cursor);
    }

    /**
     * save note of a deal from deal details page
     * 
     * @param note
     * @return updated deal
     */
    @Path("/deals/notes")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Opportunity saveDealNote(Note note)
    {
	String updatedOpportunityid = null;
	List<String> deal_ids = note.deal_ids;
	if (deal_ids != null && deal_ids.size() > 0)
	{
	    updatedOpportunityid = deal_ids.get(0);
	    for (int i = 0; i <= deal_ids.size() - 1; i++)
	    {
		Opportunity opp = OpportunityUtil.getOpportunity(Long.parseLong(deal_ids.get(i)));
		opp.note_description = note.description;
		opp.note_subject = note.subject;
		opp.save();
	    }
	}
	if (updatedOpportunityid != null)
	    return OpportunityUtil.getOpportunity(Long.parseLong(updatedOpportunityid));
	return null;
    }

    /**
     * update note from deal details page
     * 
     * @param note
     * @return updated deal
     */
    @Path("/deals/notes")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Opportunity saveDealUpdateNote(Note note)
    {
	String updatedOpportunityid = null;
	List<String> deal_ids = note.deal_ids;
	if (deal_ids != null && deal_ids.size() > 0)
	{
	    updatedOpportunityid = deal_ids.get(0);
	}
	note.save();
	if (updatedOpportunityid != null)
	    return OpportunityUtil.getOpportunity(Long.parseLong(updatedOpportunityid));
	return null;
    }

    /**
     * Call backends archive deals.
     */
    @Path("/bulk/archive")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void archiveDeals(@FormParam("ids") String ids, @FormParam("filter") String filters)
    {
	try
	{
	    if (StringUtils.isNotEmpty(ids))
	    {
		JSONArray idsArray = new JSONArray(ids);
		System.out.println("------------" + idsArray.length());
	    }

	    org.json.JSONObject filterJSON = new org.json.JSONObject(filters);
	    System.out.println("------------" + filterJSON.toString());

	    String uri = "/core/api/opportunity/backend/archive/" + SessionManager.get().getDomainId();

	    OpportunityUtil.postDataToDealBackend(uri, filters, ids);
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }

    /**
     * Call backends for restoring deals.
     */
    @Path("/bulk/restore")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void restoreDeals(@FormParam("ids") String ids, @FormParam("filter") String filters)
    {
	try
	{
	    if (StringUtils.isNotEmpty(ids))
	    {
		JSONArray idsArray = new JSONArray(ids);
		System.out.println("------------" + idsArray.length());
	    }

	    org.json.JSONObject filterJSON = new org.json.JSONObject(filters);
	    System.out.println("------------" + filterJSON.toString());

	    String uri = "/core/api/opportunity/backend/restore/" + SessionManager.get().getDomainId();

	    OpportunityUtil.postDataToDealBackend(uri, filters, ids);
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }

    /**
     * Call backends for updating deals owner.
     */
    @Path("/bulk/change-owner/{owner_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void changeOwnerForDeals(@PathParam("owner_id") Long ownerId, @FormParam("ids") String ids,
	    @FormParam("filter") String filters)
    {
	try
	{
	    if (StringUtils.isNotEmpty(ids))
	    {
		JSONArray idsArray = new JSONArray(ids);
		System.out.println("------------" + idsArray.length());
	    }

	    org.json.JSONObject filterJSON = new org.json.JSONObject(filters);
	    System.out.println("------------" + filterJSON.toString());
	    System.out.println("Owner_id" + ownerId);

	    String uri = "/core/api/opportunity/backend/change-owner/" + ownerId + "/"
		    + SessionManager.get().getDomainId();

	    OpportunityUtil.postDataToDealBackend(uri, filters, ids);
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }

    /**
     * Call backends for updating deals pipeline and milestone.
     */
    @Path("/bulk/change-milestone")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void changeMilestoneForDeals(@FormParam("ids") String ids, @FormParam("filter") String filters,
	    @FormParam("form") String form)
    {
	try
	{
	    if (StringUtils.isNotEmpty(ids))
	    {
		JSONArray idsArray = new JSONArray(ids);
		System.out.println("------------" + idsArray.length());
	    }

	    org.json.JSONObject filterJSON = new org.json.JSONObject(filters);
	    System.out.println("------------" + filterJSON.toString());

	    String uri = "/core/api/opportunity/backend/change-milestone/" + SessionManager.get().getDomainId();

	    OpportunityUtil.postDataToDealBackend(uri, filters, ids, form);
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }

    /**
     * Call backends for updating deals pipeline and milestone.
     */
    @Path("/bulk/contacts/add-tag")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addTagToDealRelatedContacts(@FormParam("ids") String ids, @FormParam("filter") String filters,
	    @FormParam("form") String form)
    {
	try
	{
	    if (StringUtils.isNotEmpty(ids))
	    {
		JSONArray idsArray = new JSONArray(ids);
		System.out.println("------------" + idsArray.length());
	    }

	    org.json.JSONObject filterJSON = new org.json.JSONObject(filters);
	    System.out.println("------------" + filterJSON.toString());

	    String uri = "/core/api/opportunity/backend/contacts/add-tag/" + SessionManager.get().getDomainId();

	    OpportunityUtil.postDataToDealBackend(uri, filters, ids, form);
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }

    /**
     * Call backends for updating deals owner.
     */
    @Path("/bulk/contacts/add-campaign/{workflow_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addDealRelatedContactsToCampaigns(@PathParam("workflow_id") Long workflowId,
	    @FormParam("ids") String ids, @FormParam("filter") String filters)
    {
	try
	{
	    if (StringUtils.isNotEmpty(ids))
	    {
		JSONArray idsArray = new JSONArray(ids);
		System.out.println("------------" + idsArray.length());
	    }

	    org.json.JSONObject filterJSON = new org.json.JSONObject(filters);
	    System.out.println("------------" + filterJSON.toString());
	    System.out.println("Workflow_id" + workflowId);

	    String uri = "/core/api/opportunity/backend/contacts/add-campaign/" + workflowId + "/"
		    + SessionManager.get().getDomainId();

	    OpportunityUtil.postDataToDealBackend(uri, filters, ids);
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
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
    @Path("stats/details/{owner-id}/{pipeline-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getDealsDetailsByPipelineandOwner(@PathParam("owner-id") Long ownerId,@PathParam("pipeline-id") Long pipelineId,
    		@QueryParam("min") Long min, @QueryParam("max") Long max,@QueryParam("frequency") String frequency)
    {
    	ReportsUtil.check(min*1000,max*1000);
	return OpportunityUtil.getDealsDetailsByPipeline(ownerId,pipelineId, min, max,frequency).toString();
    }
}
