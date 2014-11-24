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

import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.portlets.Portlet;
import com.agilecrm.portlets.util.PortletUtil;

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
			portlt.save();
		}
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
	public List<Contact> getPortletContactsList(@QueryParam("filter") String filter)throws Exception {
		JSONObject json=new JSONObject();
		json.put("filter",filter);
		return PortletUtil.getContactsList(json);
	}
	/**
	 * Gets Emails opened portlet data
	 * 
	 * @return {@Link List} of {@link Contact}
	 */
	@Path("/portletEmailsOpened")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Contact> getPortletEmailsOpenedList(@QueryParam("duration") String duration)throws Exception {
		JSONObject json=new JSONObject();
		json.put("duration",duration);
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
	public List<Opportunity> getPortletPendingDealsList(@QueryParam("deals") String deals,@QueryParam("due-date") String dueDate)throws Exception {
		JSONObject json=new JSONObject();
		json.put("deals",deals);
		json.put("due-date",dueDate);
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
	public List<Opportunity> getPortletPendingDealsList(@QueryParam("duration") String duration)throws Exception {
		JSONObject json=new JSONObject();
		json.put("duration",duration);
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
	public List<Event> getPortletAgendaList()throws Exception {
		return PortletUtil.getAgendaList();
	}
	/**
	 * Gets Today Tasks portlet data
	 * 
	 * @return {@Link List} of {@link Contact}
	 */
	@Path("/portletTodayTasks")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Task> getPortletTodayTasksList()throws Exception {
		return PortletUtil.getTodayTasksList();
	}
	/**
	 * Gets Deals By Milestone portlet data
	 * 
	 * @return {@Link JSONObject}
	 */
	@Path("/portletDealsByMilestone")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getPortletDealsByMilestoneData(@QueryParam("deals") String deals,@QueryParam("track") String track,@QueryParam("due-date") String dueDate)throws Exception {
		JSONObject json=new JSONObject();
		json.put("deals",deals);
		json.put("track",track);
		json.put("due-date",dueDate);
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
	public JSONObject getPortletDealsFunnelData(@QueryParam("deals") String deals,@QueryParam("track") String track,@QueryParam("due-date") String dueDate)throws Exception {
		JSONObject json=new JSONObject();
		json.put("deals",deals);
		json.put("track",track);
		json.put("due-date",dueDate);
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
	public JSONObject getPortletGrowthGraphData(@QueryParam("tags") String tags,@QueryParam("frequency") String frequency,@QueryParam("start-date") String startDate,@QueryParam("end-date") String endDate)throws Exception {
		JSONObject json=new JSONObject();
		json.put("tags",tags);
		json.put("frequency",frequency);
		json.put("start-date",startDate);
		json.put("end-date",endDate);
		
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
	public JSONObject getPortletCallsPerPerson(@QueryParam("duration") String duration)throws Exception {
		JSONObject json=new JSONObject();
		json.put("duration",duration);
		
		return PortletUtil.getPortletCallsPerPerson(json);
	}
}
