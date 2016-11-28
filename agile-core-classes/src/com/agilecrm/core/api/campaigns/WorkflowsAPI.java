package com.agilecrm.core.api.campaigns;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.AllDomainStats;
import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.alldomainstats.util.AllDomainStatsUtil;
import com.agilecrm.cms.CMSPlugin;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.projectedpojos.WorkflowPartial;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.AliasDomainUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.MD5Util;
import com.agilecrm.util.VersioningUtil;
import com.agilecrm.util.email.SendMail;
import com.agilecrm.util.language.LanguageUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.WorkflowBackup;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.agilecrm.workflows.status.util.CampaignSubscribersUtil;
import com.agilecrm.workflows.unsubscribe.util.UnsubscribeStatusUtil;
import com.agilecrm.workflows.util.WorkflowBackupUtil;
import com.agilecrm.workflows.util.WorkflowDeleteUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.cron.util.CronUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;

/**
 * <code>WorkflowsAPI</code> includes REST calls to interact with
 * {@link Workflow} class to initiate {@link Workflow} CRUD operations.
 * <p>
 * It is called from client side to create, fetch, update and delete workflows.
 * It also interact with {@link Workflow} class to fetch the data of Workflow
 * class from database.
 * </p>
 * 
 * @author Naresh
 * 
 */
@Path("/api/workflows")
public class WorkflowsAPI {
	/**
	 * Gets list of workflows based on query parameters page-size and cursor. At
	 * first only the list of workflows with the page_size are retrieved, when
	 * cursor scroll down, rest of workflows are retrieved. This method is
	 * called if TEXT_PLAIN is request.
	 * 
	 * @param count
	 *            Number of workflows for a page.
	 * @param cursor
	 *            Points the rest of workflows that are over the limit.
	 * @return list of workflows.
	 */

	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Workflow> getWorkflows(@QueryParam("page_size") String count,
			@QueryParam("cursor") String cursor, @QueryParam("allow_campaign") Long allow_campaign, @QueryParam("global_sort_key") String orderBy) {
		if (count != null) {
			return WorkflowUtil
					.getAllWorkflows(Integer.parseInt(count), cursor, orderBy);
		}
		
		return WorkflowUtil.getAllWorkflows(allow_campaign, orderBy);
	}

	/**
	 * Returns single workflow for the given id.
	 * 
	 * @param workflowId
	 *            - workflow id
	 * @return
	 */
	@Path("{workflow-id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Workflow getWorkflow(@PathParam("workflow-id") String workflowId) {
		try {
			return  WorkflowUtil
					.getWorkflow(Long.parseLong(workflowId), true);
		} catch (Exception e) {
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Returns workflow of given id
	 * 
	 * @param workflow_id
	 *            campaign-id
	 * @param senderDomain
	 *            Domain name of the user who has shared the campaign
	 * 
	 */
	@Path("shareCampAPI")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Workflow getWorkflowForSharedCampaign(
			@QueryParam("id") String workflow_id,
			@QueryParam("senderDomain") String senderDomain) {

		String oldNamespace = NamespaceManager.get();
		Workflow workflow = null;
		try {
			System.out.println("SenderDomain in workflowsAPI" + senderDomain);
			NamespaceManager.set(senderDomain);
			System.out.println("Domain in namespacemanager"
					+ NamespaceManager.get());
			workflow = WorkflowUtil.getWorkflow(Long.parseLong(workflow_id));
			System.out.println("Workflow rules" + workflow.rules);

		} catch (Exception e) {
			System.err
					.println("Exception occurred in getWorkflowForSharedCampaign... "
							+ e.getMessage());
			e.printStackTrace();
		} finally {
			NamespaceManager.set(oldNamespace);
		}
		return workflow;
	}

	/**
	 * Saves new workflow.
	 * 
	 * @param workflow
	 *            Workflow object that is newly created.
	 * @return Created workflow.
	 * @throws PlanRestrictedException
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Workflow createWorkflow(Workflow workflow)
			throws PlanRestrictedException, WebApplicationException {
		workflow.save();
		try {
			// Inform to CMS plugins
			CMSPlugin.updateToCmsPlugins(CMSPlugin.EventName.Campaigns, true);
						
			ActivityUtil.createCampaignActivity(ActivityType.CAMPAIGN_CREATE,
					workflow, null);
			
			//Increase count of Campaign for AllDomainstats report in database
			AllDomainStatsUtil.updateAllDomainStats(AllDomainStats.CAMPAIGN_COUNT);
			//Increase count of top ten nodes count template for AllDomainstats report in database
			
			//AllDomainStatsUtil.updateWorkflowNodecount(AllDomainStatsUtil.getNodeCountFromWorkflow(workflow.rules));
			
		} catch (Exception e) {
			System.out
					.println("exception occured while creating workflow creation activity");
		}

		return workflow;
	}

	/**
	 * Updates workflow.
	 * 
	 * @param workflow
	 *            Workflow object that is updated.
	 * @return updated workflow.
	 */
	@Path("{id}")
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Workflow updateWorkflow(Workflow workflow) throws Exception {
		try {
			workflow.save();
			
			try {
				// Inform to CMS plugins
				CMSPlugin.updateToCmsPlugins(CMSPlugin.EventName.Campaigns, false);
				
				ActivityUtil.createCampaignActivity(ActivityType.CAMPAIGN_EDIT,
						workflow, null);
			} catch (Exception e) {
				System.out
						.println("exception occured while creating workflow creation activity");
			}
			return workflow;
		} catch (Exception e) {
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Deletes single workflow based on id.
	 * 
	 * @param id
	 *            Respective workflow id.
	 */
	@Path("{id}")
	@DELETE
	public void deleteWorkflow(@PathParam("id") Long id) {
		Workflow workflow = WorkflowUtil.getWorkflow(id);

		if (workflow != null) {
			try {
				// Inform to CMS plugins
				CMSPlugin.updateToCmsPlugins(CMSPlugin.EventName.Campaigns, false);
				
				ActivityUtil.createCampaignActivity(
						ActivityType.CAMPAIGN_DELETE, workflow, null);
				
			} catch (Exception e) {
				System.out
						.println("exception occured while creating workflow creation activity");
			}
			workflow.delete();
		}
	}

	/**
	 * Deletes selected workflows using their keys list.Deletes related
	 * campaignStats
	 * 
	 * @param model_ids
	 *            array of workflow ids as String.
	 * @throws JSONException
	 */
	@Path("bulk")
	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public void deleteWorkflows(@FormParam("ids") String model_ids)
			throws JSONException {
		JSONArray workflowsJSONArray = new JSONArray(model_ids);

		try {
			// Inform to CMS plugins
			CMSPlugin.updateToCmsPlugins(CMSPlugin.EventName.Campaigns, false);
						
			ActivitySave.createLogForBulkDeletes(EntityType.CAMPAIGN,
					workflowsJSONArray,
					String.valueOf(workflowsJSONArray.length()), "");
			
		} catch (Exception e) {
			System.out
					.println("exception occured while creating workflow creation activity");
		}

		Workflow.dao.deleteBulkByIds(workflowsJSONArray);

		// Deletes CampaignStats
		WorkflowDeleteUtil.deleteRelatedEntities(workflowsJSONArray);

	}
	
	/**
	 * Returns count of contacts having campaignStatus Done for the given
	 * campaign-id.
	 * 
	 * @param workflow_id
	 *            - workflow id.
	 * @return
	 */
	@Path("{subscribers_type}-subscribers/{id}/count")
	@GET
	@Produces({ MediaType.APPLICATION_JSON + "; charset=utf-8",
			MediaType.APPLICATION_XML + "; charset=utf-8" })
	public Integer getCompletedContacts(
			@PathParam("subscribers_type") String subscribers_type, @PathParam("id") String workflow_id) {
		
		System.out.println("subscribers_type = " + subscribers_type);
		
		if(subscribers_type.equalsIgnoreCase("all"))
		{
			return CampaignSubscribersUtil.getContactsCountByCampaignId(workflow_id);
			
		}
		
		if(subscribers_type.equalsIgnoreCase("active"))
		{
			return CampaignSubscribersUtil.getSubscribersCount(workflow_id + "-" + CampaignStatus.Status.ACTIVE);
			
		}
		
		if(subscribers_type.equalsIgnoreCase("completed")){
			
			return CampaignSubscribersUtil.getSubscribersCount(workflow_id + "-" + CampaignStatus.Status.DONE);
		}
		
		if(subscribers_type.equalsIgnoreCase("removed")){
			
			return CampaignSubscribersUtil.getSubscribersCount(workflow_id + "-" + CampaignStatus.Status.REMOVED);
		}
		
		if(subscribers_type.equalsIgnoreCase("unsubscribed")){
			
			return UnsubscribeStatusUtil.getUnsubscribeContactsCountByCampaignId(workflow_id);
		}
		
		if(subscribers_type.equalsIgnoreCase("hardbounced")){
			
			return CampaignSubscribersUtil.getBoucedContactsCountByCampaignId(EmailBounceType.HARD_BOUNCE,
					workflow_id);
		}
		
		if(subscribers_type.equalsIgnoreCase("softbounced")){
			
			return CampaignSubscribersUtil.getBoucedContactsCountByCampaignId(EmailBounceType.SOFT_BOUNCE,
					workflow_id);
		}
		
		if(subscribers_type.equalsIgnoreCase("spam-reported")){
			
			return CampaignSubscribersUtil.getBoucedContactsCountByCampaignId(EmailBounceType.SPAM,
					workflow_id);
		}
		
		return 0;
	}

	/**
	 * Returns active subscribers of given campaign.
	 * 
	 * @param workflow_id
	 *            - campaign-id
	 * @param count
	 *            - count (or limit) of subscribers per request
	 * @param cursor
	 *            - cursor object
	 * @return
	 */
	@Path("active-subscribers/{id}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON + "; charset=utf-8",
			MediaType.APPLICATION_XML + "; charset=utf-8" })
	public List<Contact> getActiveContacts(@PathParam("id") String workflow_id,
			@QueryParam("page_size") String count,
			@QueryParam("cursor") String cursor) {
		return CampaignSubscribersUtil.getSubscribers(Integer.parseInt(count),
				cursor, workflow_id + "-" + CampaignStatus.Status.ACTIVE);
	}

	/**
	 * Returns list of contacts having campaignStatus Done for the given
	 * campaign-id.
	 * 
	 * @param workflow_id
	 *            - workflow id.
	 * @param count
	 *            - count (or limit) of subscribers per request
	 * @param cursor
	 *            - cursor object
	 * @return
	 */
	@Path("completed-subscribers/{id}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON + "; charset=utf-8",
			MediaType.APPLICATION_XML + "; charset=utf-8" })
	public List<Contact> getCompletedContacts(
			@PathParam("id") String workflow_id,
			@QueryParam("page_size") String count,
			@QueryParam("cursor") String cursor) {
		return CampaignSubscribersUtil.getSubscribers(Integer.parseInt(count),
				cursor, workflow_id + "-" + CampaignStatus.Status.DONE);
	}

	/**
	 * Returns removed subscribers of given campaign.
	 * 
	 * @param workflow_id
	 *            - campaign-id
	 * @param count
	 *            - count (or limit) of subscribers per request
	 * @param cursor
	 *            - cursor object
	 * @return
	 */
	@Path("removed-subscribers/{id}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Contact> getRemovedContacts(
			@PathParam("id") String workflow_id,
			@QueryParam("page_size") String count,
			@QueryParam("cursor") String cursor) {
		return CampaignSubscribersUtil.getSubscribers(Integer.parseInt(count),
				cursor, workflow_id + "-" + CampaignStatus.Status.REMOVED);
	}

	/**
	 * Removes subscriber from Cron and updates status to REMOVED
	 * 
	 * @param workflowId
	 *            - workflow id.
	 * @param contactId
	 *            - contact id.
	 */
	@Path("remove-active-subscriber/{campaign-id}/{contact-id}")
	@DELETE
	public void removeActiveSubscriber(
			@PathParam("campaign-id") String workflowId,
			@PathParam("contact-id") String contactId) {
		// if any one of the path params is empty
		if (StringUtils.isEmpty(workflowId) || StringUtils.isEmpty(contactId))
			return;

		// Remove from Cron.
		CronUtil.removeTask(workflowId, contactId);

		// Updates CampaignStatus to REMOVE
		CampaignStatusUtil.setStatusOfCampaign(contactId, workflowId,
				WorkflowUtil.getCampaignName(workflowId),
				CampaignStatus.Status.REMOVED);
	}

	/**
	 * Returns all subscribers including active, completed and removed
	 * subscribers of given campaign.
	 * 
	 * @param workflow_id
	 *            - workflow id.
	 * @param count
	 *            - count (or limit) of subscribers per request
	 * @param cursor
	 *            - cursor object
	 * @return
	 */
	@Path("all-subscribers/{id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML + "; charset=utf-8",
			MediaType.APPLICATION_JSON + "; charset=utf-8" })
	public List<Contact> getAllWorkflowContacts(
			@PathParam("id") String workflow_id,
			@QueryParam("page_size") String count,
			@QueryParam("cursor") String cursor) {
		return CampaignSubscribersUtil.getContactsByCampaignId(
				Integer.parseInt(count), cursor, workflow_id);
	}

	/**
	 * Returns Unsubscribed subscribers
	 * 
	 * @param workflow_id
	 *            - campaign-id
	 * @param count
	 *            - count (or limit) of subscribers per request
	 * @param cursor
	 *            - cursor object
	 * @return
	 */
	@Path("unsubscribed-subscribers/{id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML + "; charset=utf-8",
			MediaType.APPLICATION_JSON + "; charset=utf-8" })
	public List<Contact> getUnsubscribedContacts(
			@PathParam("id") String workflow_id,
			@QueryParam("page_size") String count,
			@QueryParam("cursor") String cursor) {
		return UnsubscribeStatusUtil.getUnsubscribeContactsByCampaignId(
				Integer.parseInt(count), cursor, workflow_id);
	}

	/**
	 * Returns Hard Bounced contacts
	 * 
	 * @param count
	 *            - count (or limit) of subscribers per request
	 * @param cursor
	 *            - cursor object
	 * @return
	 */
	@Path("hardbounced-subscribers/{id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML + "; charset=utf-8",
			MediaType.APPLICATION_JSON + "; charset=utf-8" })
	public List<Contact> getHardBouncedContacts(
			@PathParam("id") String workflow_id,
			@QueryParam("page_size") String count,
			@QueryParam("cursor") String cursor) {
		return CampaignSubscribersUtil.getBoucedContactsByCampaignId(
				Integer.parseInt(count), cursor, EmailBounceType.HARD_BOUNCE,
				workflow_id);
	}

	/**
	 * Returns Soft Bounced contacts
	 * 
	 * @param count
	 *            - count (or limit) of subscribers per request
	 * @param cursor
	 *            - cursor object
	 * @return
	 */
	@Path("softbounced-subscribers/{id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML + "; charset=utf-8",
			MediaType.APPLICATION_JSON + "; charset=utf-8" })
	public List<Contact> getSoftBouncedContacts(
			@PathParam("id") String workflow_id,
			@QueryParam("page_size") String count,
			@QueryParam("cursor") String cursor) {
		return CampaignSubscribersUtil.getBoucedContactsByCampaignId(
				Integer.parseInt(count), cursor, EmailBounceType.SOFT_BOUNCE,
				workflow_id);
	}

	/**
	 * Returns spam reported contacts
	 * 
	 * @param count
	 *            - count (or limit) of subscribers per request
	 * @param cursor
	 *            - cursor object
	 * @return
	 */
	@Path("spam-reported-subscribers/{id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML + "; charset=utf-8",
			MediaType.APPLICATION_JSON + "; charset=utf-8" })
	public List<Contact> getSpamReportedContacts(
			@PathParam("id") String workflow_id,
			@QueryParam("page_size") String count,
			@QueryParam("cursor") String cursor) {
		return CampaignSubscribersUtil.getBoucedContactsByCampaignId(
				Integer.parseInt(count), cursor, EmailBounceType.SPAM,
				workflow_id);
	}

	/**
	 * Sends mail from sender mailId to receiver mailId with a link to view the
	 * shared campaign
	 * 
	 * @param workflow_id
	 *            campaign-id
	 * @param recEmail
	 *            MailId of the receiver(to whom the Campaign is shared)
	 * 
	 */
	@Path("share")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public void shareCampaignFrom(@QueryParam("id") String workflow_id,
			@QueryParam("type") String type,
			@QueryParam("recEmail") String recEmail) {
		try {

			Map<String, String> map = new HashMap<String, String>();
			map.put("verification_link",
					VersioningUtil.getHostURLByApp(AliasDomainUtil.getCachedAliasDomainName(NamespaceManager.get())));

			DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
			map.put("campaignId", workflow_id);
			map.put("recEmail", MD5Util.getMD5HashedPassword(recEmail));
			map.put("type", "Workflow");
			map.put("senderName", domainUser.name);
			map.put("senderId", domainUser.id.toString());
			map.put("senderDomain", AliasDomainUtil.getCachedAliasDomainName(domainUser.domain));
			
			//Get user prefs language
			String language = LanguageUtil.getUserLanguageFromEmail(recEmail);
			SendMail.sendMail(recEmail, SendMail.SHARE_CAMPAIGN_SUBJECT,
					SendMail.SHARE_CAMPAIGN_CONFIRMATION, map,
					domainUser.email, domainUser.name, language);

		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("Exception occured in ShareCampaignFrom.."
					+ e.getMessage());
		}

	}

	/**
	 * Returns count of workflow for all users.
	 * 
	 * @param workflowId
	 *            - workflow id
	 * @return
	 */
	@Path("count")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String getWorkflowCount() {
		try {
			return  String.valueOf(WorkflowUtil.getAllWorkflows().size());
		} catch (Exception e) {
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	@Path("/restore")
	@POST
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Workflow restoreWorkflow(@QueryParam("workflow_id") Long workflowId) throws EntityNotFoundException
	{
		WorkflowBackup backup =  WorkflowBackupUtil.getWorkflowBackup(workflowId);
		
		if(backup == null)
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("No backup yet").build());
		
		// Deleting workflow backup after restore
		backup.delete();
		
		Workflow workflow = WorkflowUtil.restoreWorkflow(workflowId, backup);
		
		try 
		{
			ActivityUtil.createCampaignActivity(ActivityType.CAMPAIGN_RESTORE, workflow, null);
		}
		catch (Exception e){
			System.out.println("Exception occured while creating workflow restore activity" + e.getMessage());
		}
		
		return workflow;
	}

	 @Path("/backups/get/{id}")
     @GET
     @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
     public WorkflowBackup getWorkflowBackup(@PathParam("id") Long workflowId) throws EntityNotFoundException
     {
         WorkflowBackup backup =  WorkflowBackupUtil.getWorkflowBackup(workflowId);
         
         if(backup == null)
                 throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("No backup yet").build());
         
         return backup;
     }
     
     @Path("/partial")
     @GET
     @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
     public List<WorkflowPartial> getPartialWorkflows(){	
	 return WorkflowUtil.getAllPartialWorkflows();		
     }

}