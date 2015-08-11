package com.agilecrm.core.api.portlets;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.portlets.Portlet;
import com.agilecrm.portlets.util.PortletUtil;
import com.agilecrm.user.DomainUser;

/**
 * <code>PortletsAPI</code> includes REST calls to interact with
 * {@link Portlet} class to initiate Portlets CRUD operations.
 * <p>
 * It is called from client side to create, update, fetch and delete the
 * portlets. It also interacts with {@link PortletUtil} class to fetch
 * the data of Portlet class from database.
 * </p>
 * 
 * @author Subrahmanyam
 * 
 */
@Path("/api/portlets")
public class PortletsAPI {
	/**
	 * Gets List of available portlets
	 * 
	 * @return {@link List} of {@link Portlet}
	 */
	@Path("default")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Portlet> getAvailablePortlets()throws Exception {
		return PortletUtil.getAvailablePortlets();
	}
	/**
	 * Gets List of portlets added for current user
	 * 
	 * @return {@link List} of {@link Portlet}
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Portlet> getPortlets()throws Exception{
		// Returns list of portlets saved by current user
		return PortletUtil.getAddedPortletsForCurrentUser();
	}
	/**
	 * Adding of new portlet
	 * 
	 * @param portlets
	 * 
	 * @return {@link List} of {@link Portlet}
	 */
	@POST
	@Path("addPortlet")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Portlet createPortlet(Portlet portlet) {
		try {
			if(portlet!=null){	
				portlet.save();
				
				if(portlet.prefs!=null){
					JSONObject json=(JSONObject)JSONSerializer.toJSON(portlet.prefs);
					portlet.settings=json;
				}
				//PortletUtil.setPortletContent(portlet);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return portlet;
	}
	/**
	 * Saves position of portlet, used to show portlets in ascending order 
	 * according to position
	 * 
	 * @param portlets
	 *             {@link List} of {@link Portlet}
	 */
	@Path("positions")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public void savePortletPositions(List<Portlet> portlets){
		if (portlets == null)
			return;

		// UI sends only ID and Position
		for (Portlet portlet : portlets){
			Portlet portlt = PortletUtil.getPortlet(portlet.id);
			portlt.column_position = portlet.column_position;
			portlt.row_position = portlet.row_position;
			portlt.save();
		}
	}
	/**
	 * Saves position of portlet, used to show portlets in ascending order 
	 * according to position
	 * 
	 * @param portlets
	 *             {@link List} of {@link Portlet}
	 */
	@Path("widthAndHeight")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public void savePortletWidthAndHeight(List<Portlet> portlets){
		if (portlets == null)
			return;

		// UI sends only ID and Position
		for (Portlet portlet : portlets){
			Portlet portlt = PortletUtil.getPortlet(portlet.id);
			portlt.size_x = portlet.size_x;
			portlt.size_y = portlet.size_y;
			portlt.column_position = portlet.column_position;
			portlt.row_position = portlet.row_position;
			portlt.save();
		}
	}
	/**
	 * Saves position of portlet, used to show portlets in ascending order 
	 * according to position
	 * 
	 * @param portlets
	 *             {@link List} of {@link Portlet}
	 */
	@Path("saveOnboardingPrefs")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Portlet saveOnboardingPortletPrefs(Portlet portlet)throws Exception{
		if (portlet == null)
			return null;

		Portlet portlt = PortletUtil.getPortlet(portlet.id);
		portlt.prefs=portlet.prefs;
		portlt.save();
		return portlt;
	}
	/**
	 * Updates a portlet
	 * 
	 * @param portlet
	 *            {@link Portlet}
	 *            
	 * @return {@link Portlet}
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Portlet updatePortlet(Portlet portlet)throws Exception{
		if (portlet == null)
			return null;
		Portlet portlt = PortletUtil.getPortlet(portlet.id);
		portlt.prefs=portlet.prefs;
		portlt.is_minimized=portlet.is_minimized;

		portlt.save();
		if(portlt.prefs!=null){
			JSONObject json=(JSONObject)JSONSerializer.toJSON(portlt.prefs);
			portlt.settings=json;
		}
		//PortletUtil.setPortletContent(portlt);
		return portlt;
	}
	/**
	 * Deletes a portlet based on portlet id
	 * 
	 * @param portlet_id
	 *            {@link Long}
	 */
	@Path("{portlet_id}")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deletePortlet(@PathParam("portlet_id") Long portlet_id){
		// Deletes portlet based on name
		Portlet portlet = PortletUtil.getPortlet(portlet_id);

		if (portlet == null)
			return;

		// default portlets are removed from database on deletion
		portlet.delete();
	}
	/**
	 * Gets Filter based contatcs portlet data
	 * 
	 * @return {@Link List} of {@link Contact}
	 */
	@Path("/portletContacts")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Contact> getPortletContactsList(@QueryParam("filter") String filter, @QueryParam("sortKey") String sortKey)throws Exception {
		JSONObject json=new JSONObject();
		json.put("filter",filter);
		if(sortKey==null)
			sortKey = "-created_time";
		return PortletUtil.getContactsList(json,sortKey);
	}
	
	/**
	 * Gets Emails opened portlet data
	 * 
	 * @return {@Link List} of {@link Contact}
	 */
	@Path("/portletEmailsOpened")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<JSONObject> getPortletEmailsOpenedList(@QueryParam("duration") String duration,@QueryParam("start-date") String startDate,@QueryParam("end-date") String endDate)throws Exception {
		JSONObject json=new JSONObject();
		json.put("duration",duration);
		json.put("startDate",startDate);
		json.put("endDate",endDate);
		return PortletUtil.getEmailsOpenedList(json);
	}
	/**
	 * Gets Pending deals portlet data
	 * 
	 * @return {@Link List} of {@link Contact}
	 */
	@Path("/portletPendingDeals")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Opportunity> getPortletPendingDealsList(@QueryParam("deals") String deals)throws Exception {
		JSONObject json=new JSONObject();
		json.put("deals",deals);
		PortletUtil.checkPrivilegesForPortlets("DEALS");
		return PortletUtil.getPendingDealsList(json);
	}
	/**
	 * Gets Pending deals portlet data
	 * 
	 * @return {@Link List} of {@link Contact}
	 */
	@Path("/portletDealsWon")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Opportunity> getPortletDealsWonList(@QueryParam("duration") String duration)throws Exception {
		JSONObject json=new JSONObject();
		json.put("duration",duration);
		PortletUtil.checkPrivilegesForPortlets("DEALS");
		return PortletUtil.getDealsWonList(json);
	}
	/**
	 * Gets Agenda portlet data
	 * 
	 * @return {@Link List} of {@link Contact}
	 */
	@Path("/portletAgenda")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Event> getPortletAgendaList(@QueryParam("duration") String duration,@QueryParam("start_time") String startTime, @QueryParam("end_time") String endTime)throws Exception {
		PortletUtil.checkPrivilegesForPortlets("EVENTS");
		return PortletUtil.getAgendaList(startTime,endTime,duration);
	}
	/**
	 * Gets Today Tasks portlet data
	 * 
	 * @return {@Link List} of {@link Contact}
	 */
	@Path("/portletTodayTasks")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Task> getPortletTodayTasksList(@QueryParam("duration") String duration,@QueryParam("start_time") String startTime, @QueryParam("end_time") String endTime)throws Exception {
		PortletUtil.checkPrivilegesForPortlets("TASKS");
		return PortletUtil.getTodayTasksList(startTime,endTime,duration);
	}
	/**
	 * Gets Deals By Milestone portlet data
	 * 
	 * @return {@Link JSONObject}
	 */
	@Path("/portletDealsByMilestone")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getPortletDealsByMilestoneData(@QueryParam("deals") String deals,@QueryParam("track") String track)throws Exception {
		JSONObject json=new JSONObject();
		json.put("deals",deals);
		json.put("track",track);
		//json.put("due-date",dueDate);
		PortletUtil.checkPrivilegesForPortlets("DEALS");
		return PortletUtil.getDealsByMilestoneData(json);
	}
	/**
	 * Gets Closures Per Person portlet data
	 * 
	 * @return {@Link JSONObject}
	 */
	@Path("/portletClosuresPerPerson")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getPortletClosuresPerPersonData(@QueryParam("due-date") String dueDate)throws Exception {
		JSONObject json=new JSONObject();
		json.put("due-date",dueDate);
		PortletUtil.checkPrivilegesForPortlets("DEALS");
		return PortletUtil.getClosuresPerPersonData(json);
	}
	/**
	 * Gets Closures Per Person portlet data
	 * 
	 * @return {@Link JSONObject}
	 */
	@Path("/portletDealsFunnel")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getPortletDealsFunnelData(@QueryParam("deals") String deals,@QueryParam("track") String track)throws Exception {
		JSONObject json=new JSONObject();
		json.put("deals",deals);
		json.put("track",track);
		//json.put("due-date",dueDate);
		PortletUtil.checkPrivilegesForPortlets("DEALS");
		return PortletUtil.getDealsByMilestoneData(json);
	}
	/**
	 * Gets Closures Per Person portlet data
	 * 
	 * @return {@Link JSONObject}
	 */
	@Path("/portletEmailsSent")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getPortletEmailsSentData(@QueryParam("duration") String duration)throws Exception {
		JSONObject json=new JSONObject();
		json.put("duration",duration);
		PortletUtil.checkPrivilegesForPortlets("ACTIVITY");
		return PortletUtil.getEmailsSentData(json);
	}
	/**
	 * Gets Closures Per Person portlet data
	 * 
	 * @return {@Link JSONObject}
	 */
	@Path("/portletGrowthGraph")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getPortletGrowthGraphData(@QueryParam("tags") String tags,@QueryParam("frequency") String frequency,@QueryParam("duration") String duration,@QueryParam("start-date") String startDate,@QueryParam("end-date") String endDate)throws Exception {
		JSONObject json=new JSONObject();
		json.put("tags",tags);
		json.put("frequency",frequency);
		json.put("duration",duration);
		json.put("startDate",startDate);
		json.put("endDate",endDate);
		
		return PortletUtil.getGrowthGraphData(json);
	}
	/**
	 * Gets Deals Assigned Per Person portlet data
	 * 
	 * @return {@Link JSONObject}
	 */
	@Path("/portletDealsAssigned")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getPortletDealsAssigned(@QueryParam("duration") String duration)throws Exception {
		JSONObject json=new JSONObject();
		json.put("duration",duration);
		PortletUtil.checkPrivilegesForPortlets("DEALS");
		return PortletUtil.getPortletDealsAssigned(json);
	}
	/**
	 * Gets Calls Per Person portlet data
	 * 
	 * @return {@Link JSONObject}
	 */
	@Path("/portletCallsPerPerson")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getPortletCallsPerPerson(@QueryParam("duration") String duration,@QueryParam("start-date") String startDate,@QueryParam("end-date") String endDate,@QueryParam("user") String user)throws Exception {
		JSONObject json=new JSONObject();
		json.put("duration",duration);
		json.put("startDate", startDate);
		json.put("endDate", endDate);
		if(user!=null && !user.equals(""))
			json.put("user", (JSONArray)JSONSerializer.toJSON(user));
		else
			json.put("user", null);
		PortletUtil.checkPrivilegesForPortlets("ACTIVITY");
		return PortletUtil.getPortletCallsPerPerson(json);
	}
	/**
	 * Gets Task Report portlet data
	 * 
	 * @return {@Link JSONObject}
	 */
	@Path("/portletTaskReport")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getTaskReportPortletData(@QueryParam("group-by") String groubBy,@QueryParam("split-by") String splitBy,@QueryParam("start-date") String startDate,@QueryParam("end-date") String endDate,@QueryParam("tasks") String tasks,@QueryParam("user") String user)throws Exception {
		JSONObject json=new JSONObject();
		json.put("group-by",groubBy);
		json.put("split-by",splitBy);
		json.put("startDate",startDate);
		json.put("endDate",endDate);
		json.put("tasks",tasks);
		if(user!=null && !user.equals(""))
			json.put("user", (JSONArray)JSONSerializer.toJSON(user));
		else
			json.put("user", null);
		PortletUtil.checkPrivilegesForPortlets("TASKS");
		return PortletUtil.getTaskReportPortletData(json);
	}
	/**
	 * Gets Emails opened portlet data
	 * 
	 * @return {@Link List} of {@link Contact}
	 */
	@Path("/portletEmailsOpenedPie")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getPortletEmailsOpenedPieData(@QueryParam("duration") String duration,@QueryParam("start-date") String startDate,@QueryParam("end-date") String endDate)throws Exception {
		JSONObject json=new JSONObject();
		json.put("duration",duration);
		json.put("startDate",startDate);
		json.put("endDate",endDate);
		return PortletUtil.getEmailsOpenedPieData(json);
	}
	/**
	 * Gets Status Report portlet data
	 * 
	 * @return {@Link List} of {@link Contact}
	 */
	@Path("/portletStatsReport")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getPortletStatsReportData(@QueryParam("duration") String duration,@QueryParam("start-date") String startDate,@QueryParam("end-date") String endDate,@QueryParam("time_zone") String timeZone,@QueryParam("reportType") String reportType)throws Exception {
		JSONObject json=new JSONObject();
		json.put("duration",duration);
		json.put("startDate",startDate);
		json.put("endDate",endDate);
		json.put("timeZone",timeZone);
		json.put("reportType",reportType);
		PortletUtil.checkPrivilegesForPortlets("ACTIVITY");
		return PortletUtil.getPortletStatsReportData(json);
	}
	/**
	 * Gets Leaderboard portlet data
	 * 
	 * @return {@Link JSONObject}
	 */
	@Path("/portletLeaderboard")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getPortletLeaderboardData(@QueryParam("duration") String duration,@QueryParam("start-date") String startDate,@QueryParam("end-date") String endDate,@QueryParam("revenue") Boolean revenue,@QueryParam("dealsWon") Boolean dealsWon,@QueryParam("calls") Boolean calls,@QueryParam("tasks") Boolean tasks,@QueryParam("user") String user)throws Exception {
		JSONObject json=new JSONObject();
		json.put("duration",duration);
		json.put("startDate",startDate);
		json.put("endDate",endDate);
		json.put("revenue",revenue);
		json.put("dealsWon",dealsWon);
		json.put("calls",calls);
		json.put("tasks",tasks);
		if(user!=null && !user.equals(""))
			json.put("user", (JSONArray)JSONSerializer.toJSON(user));
		else
			json.put("user", null);
		PortletUtil.checkPrivilegesForPortlets("ACTIVITY");
		return PortletUtil.getPortletLeaderboardData(json);
	}
	/**
	 * Gets all current domain users
	 * 
	 * @return {@Link JSONObject}
	 */
	@Path("/portletUsers")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<DomainUser> getCurrentDomainUsersForPortlets()throws Exception {
		return PortletUtil.getCurrentDomainUsersForPortlets();
	}
	
	/**
	 * Gets Activity portlet data
	 * 
	 * @return {List Activity}
	 */
	@Path("/portletCustomerActivity")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Activity> getPortletActivityData(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count)throws Exception {
		
		PortletUtil.checkPrivilegesForPortlets("ACTIVITY");
		if(count!=null){
		return PortletUtil.getPortletActivitydata(Integer.parseInt(count), cursor);
		}
		else
			return null;
	}
	
	/**
	 * Gets Account portlet data
	 * 
	 * @return {JSONObject}
	 */
	@Path("/portletAccount")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getPortletAccountList()throws Exception {
	
		return PortletUtil.getAccountsList();
	}
}
