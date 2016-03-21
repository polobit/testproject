package com.agilecrm.core.api.deals;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.bulkaction.deferred.CampaignSubscriberDeferredTask;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.filter.DealFilterIdsFetcher;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.export.ExportBuilder;
import com.agilecrm.export.Exporter;
import com.agilecrm.export.util.DealExportBlobUtil;
import com.agilecrm.export.util.DealExportEmailUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.DealTriggerUtil;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

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
	    List<Opportunity> all_deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters, 100);
	    DealFilterIdsFetcher dealFilterIdsFetcher = new DealFilterIdsFetcher(all_deals, currentUserId);
	    List<Opportunity> deals = dealFilterIdsFetcher.getDealsAfterResriction();
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
	    List<Opportunity> all_deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters, 100);
	    DealFilterIdsFetcher dealFilterIdsFetcher = new DealFilterIdsFetcher(all_deals, currentUserId);
	    List<Opportunity> deals = dealFilterIdsFetcher.getDealsAfterResriction();
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
		List<Opportunity> all_deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters, 100);
	    DealFilterIdsFetcher dealFilterIdsFetcher = new DealFilterIdsFetcher(all_deals, currentUserId);
	    List<Opportunity> deals = dealFilterIdsFetcher.getDealsAfterResriction();
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

	    List<Opportunity> all_deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters, 100);
	    DealFilterIdsFetcher dealFilterIdsFetcher = new DealFilterIdsFetcher(all_deals, currentUserId);
	    List<Opportunity> deals = dealFilterIdsFetcher.getDealsAfterResriction();
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
	    List<Opportunity> all_deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters, 100);
	    DealFilterIdsFetcher dealFilterIdsFetcher = new DealFilterIdsFetcher(all_deals, currentUserId);
	    List<Opportunity> deals = dealFilterIdsFetcher.getDealsAfterResriction();
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
	DomainUser user = DomainUserUtil.getDomainUser(currentUserId);

	if (user == null)
	    return;
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
	    Exporter<Opportunity> dealsExporter = ExportBuilder.buildDealsExporter();
	    do
	    {
		deals = OpportunityUtil.getOpportunitiesByFilter(filterJSON, max, currentCursor);
		currentCursor = deals.get(deals.size() - 1).cursor;
		dealsExporter.writeEntitesToCSV(deals);
		total += deals.size();
	    } while (deals.size() > 0 && !StringUtils.equals(previousCursor, currentCursor));

	    dealsExporter.finalize();
	    dealsExporter.sendEmail(user.email);
	}
	catch (JSONException e)
	{
	    System.out.println("Exception in export deal in backend code. - " + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Call backends for adding tags to the related contacts of the selected
     * deals.
     */
    @Path("/contacts/add-tag/{current_user_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addTagToDealRelatedContacts(@PathParam("current_user_id") Long currentUserId,
	    @FormParam("ids") String ids, @FormParam("filter") String filters, @FormParam("form") String form)
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

	if (StringUtils.isEmpty(form))
	    return;

	try
	{
	    JSONObject formJSON = new JSONObject(form);
	    System.out.println("------------" + formJSON.toString());

	    if (!formJSON.has("tags"))
		return;

	    JSONArray tagsJSONArray = formJSON.getJSONArray("tags");

	    String[] tagsArray = null;
	    try
	    {
		tagsArray = new ObjectMapper().readValue(tagsJSONArray.toString(), String[].class);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	    if (tagsArray == null)
		return;

	    List<Opportunity> deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters, 100);
	    System.out.println("total deals -----" + deals.size());
	    Set<Key<Contact>> contactKeys = new HashSet<Key<Contact>>();
	    for (Opportunity deal : deals)
	    {
		contactKeys.addAll(deal.getContactKeys());
	    }

	    List<Contact> contactsList = new ArrayList<Contact>();

	    Objectify ofy = ObjectifyService.begin();
	    contactsList.addAll(ofy.get(contactKeys).values());

	    // ContactUtil.deleteContactsbyListSupressNotification(fetcher.nextSet());
	    ContactUtil.addTagsToContactsBulk(contactsList, tagsArray);

	    BulkActionNotifications.publishNotification(Arrays.asList(tagsArray).toString() + " Tag(s) are added to "
		    + contactKeys.size() + " Contacts.");

	    ActivitySave.createBulkActionActivity(contactKeys.size(), "ADD_TAG", tagsJSONArray.toString(), "contacts",
		    "");

	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }

    /**
     * Call backends for adding the related contacts of deals to the selected
     * campaign.
     */
    @Path("/contacts/add-campaign/{workflow_id}/{current_user_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addDealRelatedContactToCampaigns(@PathParam("current_user_id") Long currentUserId,
	    @PathParam("workflow_id") Long workflowId, @FormParam("ids") String ids, @FormParam("filter") String filters)
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
	    if (user == null)
		return;

	    List<Opportunity> deals = OpportunityUtil.getOpportunitiesForBulkActions(ids, filters, 100);
	    System.out.println("total deals -----" + deals.size());
	    Set<Key<Contact>> contacts = new HashSet<Key<Contact>>();
	    for (Opportunity deal : deals)
	    {
		for (String contactId : deal.getContact_ids())
		{
		    contacts.add(new Key<Contact>(Contact.class, Long.parseLong(contactId)));
		}
	    }

	    CampaignSubscriberDeferredTask task = new CampaignSubscriberDeferredTask(currentUserId, workflowId,
		    NamespaceManager.get(), contacts, new UserInfo(user));

	    // Add to queue
	    Queue queue = QueueFactory.getQueue(AgileQueues.CAMPAIGN_SUBSCRIBE_SUBTASK_QUEUE);
	    queue.add(TaskOptions.Builder.withPayload(task));

	    Workflow workflow = WorkflowUtil.getWorkflow(workflowId);

	    String message = contacts.size() + " Contacts are added to " + workflow.name + " Campaign.";

	    if (contacts.size() == 1)
		message = " 1 Contact is added to " + workflow.name + " Campaign.";

	    BulkActionNotifications.publishNotification(message);

	    ActivitySave.createBulkActionActivity(contacts.size(), "ASIGN_WORKFLOW", workflow.name, "contacts", "");

	}
	catch (Exception je)
	{
	    je.printStackTrace();
	}
    }

}
