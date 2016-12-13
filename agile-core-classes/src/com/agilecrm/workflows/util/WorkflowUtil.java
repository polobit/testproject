package com.agilecrm.workflows.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.projectedpojos.PartialDAO;
import com.agilecrm.projectedpojos.WorkflowPartial;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.WorkflowBackup;
import com.campaignio.tasklets.util.TaskletUtil;
import com.googlecode.objectify.Key;

/**
 * <code>WorkflowUtil</code> provides various static methods to convert contact
 * and workflow objects into json objects. WorkflowUtil class uses
 * {@link TaskletUtil} to run campaign with contact.
 * <p>
 * <code>WorkflowUtil</code> is used whenever single contact or bulk contacts
 * are subscribed to campaign. It subscribes contacts to campaigns and runs
 * campaign with the contact details. WorkflowUtil class is used for triggers
 * too. Whenever trigger fires, trigger calls WorkflowUtil class to run the
 * campaign.
 * </p>
 * 
 * @author Manohar
 * 
 */
public class WorkflowUtil
{
	/**
	 * Initialize DataAccessObject.
	 */
	private static ObjectifyGenericDao<Workflow> dao = new ObjectifyGenericDao<Workflow>(Workflow.class);
	
	 /**
	   * ObjectifyDao of WorkflowPartial.
	 */
	 private static PartialDAO<WorkflowPartial> partialDAO = new PartialDAO<WorkflowPartial>(WorkflowPartial.class);

	/**
	 * Locates workflow based on id.
	 * 
	 * @param id
	 *            Workflow id.
	 * @return workflow object with that id if exists, otherwise null.
	 */
	public static Workflow getWorkflow(Long id)
	{
		try
		{
			return dao.get(id);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * Locates workflow based on id.
	 * 
	 * @param id
	 *            Workflow id.
	 * @return workflow object with that id if exists, otherwise null.
	 */
	public static Workflow getWorkflow(Long id, boolean user_campaign_only)
	{
		try
		{
			Workflow worflow = getWorkflow(id);
			if(!user_campaign_only)
				return worflow;
			
			if(worflow.access_level == 1L || worflow.access_level.equals(DomainUserUtil.getCurentUserId()))
				return worflow;
		
			throw new Exception("This Workflow is not related to yours.");
		
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
	
	// returns all workflows count
	public static int getCount()
	{
		return Workflow.dao.count();
	}

	/**
	 * Returns all workflows as a collection list.
	 * 
	 * @return list of all workflows.
	 */
	public static List<Workflow> getAccountWorkflows(Long allowCampaign, String orderBy)
	{
		Map map = new HashMap();
		Long userId = DomainUserUtil.getCurentUserId();
		if(userId != null)
		{
			Set set = new HashSet();
			set.add(1L);
			set.add(userId);
			
			map.put("access_level in", set);
		}
		if(orderBy == null)
			orderBy = "name_dummy";
		List<Workflow> list = dao.fetchAllByOrder(orderBy, map);
		if(allowCampaign == null)
			  return list;
		
		boolean idPresent = false;
		for(Workflow workflow : list){
			  if(workflow.id.equals(allowCampaign))
				  idPresent = true;
		}
		
		if(!idPresent)
			list.add(WorkflowUtil.getWorkflow(allowCampaign));
		
		return list;
	}
	
	/**
	 * Returns all workflows as a collection list.
	 * 
	 * @return list of all workflows.
	 */
	public static List<Workflow> getAllWorkflows()
	{
		return getAccountWorkflows(null, null);
	}
	
	/**
	 * Returns all workflows as a collection list.
	 * 
	 * @return list of all workflows.
	 */
	public static List<Workflow> getAllWorkflows(Long allowCampaign, String orderBy)
	{
		return getAccountWorkflows(allowCampaign, orderBy);
	}
	
	/**
	 * Returns list of workflows based on page size.
	 * 
	 * @param max
	 *            Maximum number of workflows list based on page size query
	 *            param.
	 * @param cursor
	 *            Cursor string that points the list that exceeds page_size.
	 * @return Returns list of workflows with respective to page size and
	 *         cursor.
	 */
	public static List<Workflow> getAllWorkflows(int max, String cursor, String orderBy)
	{
		if(orderBy == null)
			orderBy = "name_dummy";
		Long userId = DomainUserUtil.getCurentUserId();
		Map map = new HashMap();
		
		if(userId != null)
		{
			Set set = new HashSet();
			set.add(1L);
			set.add(userId);
			
			// Conditional check for account level private access 
			if(dao.getCountByProperty("access_level !=", 1L) > 0)
				map.put("access_level in", set);
		}
		
		return dao.fetchAllByOrder(max, cursor, map, true, false, orderBy);
	}

	/**
	 * Converts workflow object into json object.
	 * 
	 * @param workflowId
	 *            Id of a workflow.
	 * @return JSONObject of campaign.
	 */
	public static JSONObject getWorkflowJSON(Long workflowId)
	{
		try
		{
			// Get Workflow JSON
			Workflow workflow = getWorkflow(workflowId);

			if (workflow == null)
				return null;

			// Campaign JSON
			JSONObject campaignJSON = new JSONObject();
			JSONObject workflowJSON = new JSONObject(workflow.rules);

			campaignJSON.put(TaskletUtil.CAMPAIGN_WORKFLOW_JSON, workflowJSON);
			campaignJSON.put("id", workflow.id);
			campaignJSON.put("name", workflow.name);
			campaignJSON.put("is_disabled", workflow.is_disabled);
			return campaignJSON;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Unsubscribe a contact into a campaign.
	 */
	public static void unsubscribe()
	{

	}

	/**
	 * Returns workflows list of current user in descending order.
	 * 
	 * @param page_size
	 *            - workflows limit
	 * @return List<Workflow>
	 */
	public static List<Workflow> getWorkflowsOfCurrentUser(String page_size)
	{
		return dao.ofy().query(Workflow.class)
				.filter("creator_key", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
				.order("-created_time").limit(Integer.parseInt(page_size)).list();
	}

	/**
	 * Returns campaignName with respect to campaign-id.
	 * 
	 * @param campaignId
	 *            - Campaign Id.
	 * @return String
	 */
	public static String getCampaignName(String campaignId)
	{
		if (campaignId == null)
			return null;

		Workflow workflow = getWorkflow(Long.parseLong(campaignId));

		if (workflow != null)
			return workflow.name;

		return "?";
	}

	/**
	 * Returns campaign-name count. It avoids saving duplicate campaign-names.
	 * 
	 * @param campaignName
	 *            - Campaign name.
	 * @return int
	 */
	public static int getCampaignNameCount(String campaignName)
	{
		return dao.ofy().query(Workflow.class).filter("name", campaignName).count();
	}

	/**
	 * Returns campaign-name count. It avoids saving duplicate campaign-names.
	 * 
	 * @param campaignName
	 *            - Campaign name.
	 * @return int
	 */

	public static Workflow getWorkflowByName(String campaignName)
	{
		return (Workflow) dao.ofy().query(Workflow.class).filter("name", campaignName);
	}
	
	public static int getWorkflowCountOfCurrentUser(long startTime,long endTime,Long ownerId)
	{
		return dao.ofy().query(Workflow.class)
				.filter("creator_key", new Key<DomainUser>(DomainUser.class, ownerId))
				.filter("created_time >=", startTime).filter("created_time <", endTime).count();
	}

	/**
	 * Updates the list of workflows
	 * 
	 * @param workflows
	 */
	public static void updateWorkflows(List<Workflow> workflows)
	{
		dao.putAll(workflows);
	}
	public static int get_enable_campaign_count()
	{
		return Workflow.dao.getCountByProperty("is_disabled", false);
	}
	
	/**
	 * Restores workflow with available backup
	 * 
	 * @param workflowId - Workflow id
	 * @param backup  - backup workflow object
	 * 
	 * @return Restored workflow
	 */
	public static Workflow restoreWorkflow(Long workflowId, WorkflowBackup backup) {
		Workflow workflow = WorkflowUtil.getWorkflow(workflowId);
		workflow.rules = backup.getRules();
		workflow.setSkip_verify(true);
		workflow.setBackupExists(false);
		workflow.save();
		
		return workflow;
	}
	
	/**
	 * Fetch all workflows and check the max number of nodes among them.
	 * @return int
	 */
	public static int getMaxWorkflowNodes(){
			int maxNodes = 0;
	    	List<Workflow> workflows = getAllWorkflows();
	    	for(Workflow workflow : workflows){
	    		if(workflow.rules != null){
	    			try{
	    			JSONObject json = new JSONObject(workflow.rules);
	    			JSONArray nodes = json.getJSONArray("nodes");
	    			if(nodes.length() > maxNodes)
	    				maxNodes = nodes.length();
	    			}catch(JSONException e){
	    				e.printStackTrace();
	    			}
	    			
	    		}
	    	}
	    	return maxNodes;
	}
	
	/**
	 * parse ids into Long if exception occurs then it will delete extra
	 * characters and also some extra digit from last based on given number(lastDigits)
	 * 
	 * @param id
	 * 
	 * @param lastDigits
	 * 
	 * @return Long
	 */
	public static Long getValidId(String id, int lastDigits){
		Long cId = 0l; 
		if(StringUtils.isNotEmpty(id)){
			try{
				cId = Long.parseLong(id);
			}catch(NumberFormatException nfe){
				// if there are extra characters at last then it will give only
				// numeric number from beginning  
				String arr[] = id.trim().split("[^(0-9)]+");
				try{
					cId = Long.parseLong(arr[0]);
				}catch(NumberFormatException nf){	
					try{
						// delete extra digit based on lastDigit, if value of lastDigit
						// is 4 then it will delete last 4 digit  
						String camp = arr[0].substring(0, arr[0].length()-lastDigits);
						cId = Long.parseLong(camp);
					}catch(Exception e){
						return 0l;
					}
				}catch (ArrayIndexOutOfBoundsException aioobe) {
					return 0l;
				}	
			}catch(Exception e){
				return cId;
			}
		}
		return cId;
	}
	
	/* This method is responsible for fetching partial workflows.
	 * Each Partial workflow contains 
	 * @return
	 */
	public static List<WorkflowPartial> getAllPartialWorkflows()
	{
	    Map<String,Object> map = new HashMap<String,Object>();
	    Long userId = DomainUserUtil.getCurentUserId();
	    if(userId != null)
	    {
	    	List<Long> list = new ArrayList<Long>();
	    	list.add(1L);
	    	list.add(userId);
	    	map.put("access_level IN ", list);
	    }
	    return partialDAO.listByProperty(map);	    	
	}
	
	public static List<WorkflowPartial> getAllPartialWorkflows(Long allowCampaign)
	{
	    Map<String,Object> map = new HashMap<String,Object>();
	    Long userId = DomainUserUtil.getCurentUserId();
	    if(userId != null)
	    {
	    	List<Long> list = new ArrayList<Long>();
	    	list.add(1L);
	    	list.add(userId);
	    	map.put("access_level IN ", list);
	    }
	    List<WorkflowPartial> partialWorkflows =  partialDAO.listByProperty(map);

	    try
	    {
		boolean idPresent = false;
		for(WorkflowPartial workflowPartial : partialWorkflows){
		    if(workflowPartial.id.equals(allowCampaign))
			  idPresent = true;
		}
		if(!idPresent)
		{
		    WorkflowPartial workflowPartial = WorkflowUtil.getPartialWorkflow(allowCampaign);
		    if(workflowPartial!=null)
		    {
			partialWorkflows.add(workflowPartial);
		    }
		}
	    }
	    catch(Exception e)
	    {
		System.err.println(e.getMessage());
	    }
	    return partialWorkflows;	    
	}
	
	/**
	 * Locates workflow based on id.
	 * 
	 * @param id
	 *            Workflow id.
	 * @return workflow object with that id if exists, otherwise null.
	 */
	public static WorkflowPartial getPartialWorkflow(Long id)
	{
	    try
	    {
		return partialDAO.get(id);
	    }
	    catch (Exception e)
	    {
		System.out.println(ExceptionUtils.getFullStackTrace(e));
		e.printStackTrace();
		return null;
	    }
	}
}