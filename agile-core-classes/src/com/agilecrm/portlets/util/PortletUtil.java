package com.agilecrm.portlets.util;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.TimeZone;

import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.account.NavbarConstants;
import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Call;
import com.agilecrm.activities.Category;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.activities.util.CategoriesUtil;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.GoogleSQL;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.db.util.GoogleSQLUtil;
import com.agilecrm.deals.Goals;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.GoalsUtil;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.portlets.Portlet;
import com.agilecrm.portlets.Portlet.PortletType;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.search.util.TagSearchUtil;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.exception.AccessDeniedException;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.status.util.CampaignSubscribersUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.reports.CampaignReportsSQLUtil;
import com.campaignio.reports.CampaignReportsUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
/**
 * <code>PortletUtil</code> is the utility class to fetch portlets with
 * respect to id, position.
 * <p>
 * The portlets data is retrieved based on portlet name and portlet type.
 * </p>
 * 
 * @author Subrahmanyam
 * 
 */
public class PortletUtil {
	// Dao
	private static ObjectifyGenericDao<Portlet> dao = new ObjectifyGenericDao<Portlet>(Portlet.class);
	
	/**
	 * Fetches all available {@link Portlet}s
	 *  
	 * @return {@link List} of {@link Portlet}s
	 */
	public static List<Portlet> getAvailablePortlets()throws Exception{
		
		List<Portlet> allPortlets = new ArrayList<Portlet>();
		try {
			DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
			
			allPortlets.add(new Portlet("Filter Based",PortletType.CONTACTS));
			//allPortlets.add(new Portlet("Emails Opened",PortletType.CONTACTS));
			allPortlets.add(new Portlet("Growth Graph",PortletType.CONTACTS));

			/*if(domainUser!=null && domainUser.menu_scopes!=null && domainUser.menu_scopes.contains(PortletType.MARKETING)){
			    	allPortlets.add(new Portlet("Emails Opened",PortletType.MARKETING));
			    	allPortlets.add(new Portlet("Campaign stats",PortletType.MARKETING));
				allPortlets.add(new Portlet("Campaign graph",PortletType.MARKETING));
				allPortlets.add(new Portlet("Referralurl stats",PortletType.MARKETING));
				allPortlets.add(new Portlet("Webstat Visits",PortletType.MARKETING));

			}*/
			
			if(domainUser!=null && domainUser.menu_scopes!=null && domainUser.menu_scopes.contains(NavbarConstants.DEALS)){
				allPortlets.add(new Portlet("Pending Deals",PortletType.DEALS));
				allPortlets.add(new Portlet("Deals By Milestone",PortletType.DEALS));
				//allPortlets.add(new Portlet("Closures Per Person",PortletType.DEALS));
				//allPortlets.add(new Portlet("Deals Won",PortletType.DEALS));
				allPortlets.add(new Portlet("Deals Funnel",PortletType.DEALS));
				//allPortlets.add(new Portlet("Deals Assigned",PortletType.DEALS));
				allPortlets.add(new Portlet("Revenue Graph",PortletType.DEALS));
				allPortlets.add(new Portlet("Deal Goals",PortletType.DEALS));
				allPortlets.add(new Portlet("Incoming Deals",PortletType.DEALS));
				allPortlets.add(new Portlet("Lost Deal Analysis",PortletType.DEALS));
			}
			
			if(domainUser!=null && domainUser.menu_scopes!=null && domainUser.menu_scopes.contains(NavbarConstants.CALENDAR)){
				allPortlets.add(new Portlet("Agenda",PortletType.TASKSANDEVENTS));
				allPortlets.add(new Portlet("Today Tasks",PortletType.TASKSANDEVENTS));
				allPortlets.add(new Portlet("Task Report",PortletType.TASKSANDEVENTS));
				allPortlets.add(new Portlet("Mini Calendar",PortletType.TASKSANDEVENTS));
				allPortlets.add(new Portlet("Average Deviation",PortletType.TASKSANDEVENTS));
			}
			
			if(domainUser!=null && domainUser.menu_scopes!=null && domainUser.menu_scopes.contains(NavbarConstants.ACTIVITY)){
				//allPortlets.add(new Portlet("Emails Sent",PortletType.USERACTIVITY));
				allPortlets.add(new Portlet("Stats Report",PortletType.USERACTIVITY));
				allPortlets.add(new Portlet("Leaderboard",PortletType.USERACTIVITY));
				allPortlets.add(new Portlet("Calls Per Person",PortletType.USERACTIVITY));
				allPortlets.add(new Portlet("User Activities",PortletType.USERACTIVITY));
				/*allPortlets.add(new Portlet("Campaign stats",PortletType.USERACTIVITY));
				allPortlets.add(new Portlet("Campaign graph",PortletType.USERACTIVITY));
				allPortlets.add(new Portlet("Referralurl stats",PortletType.USERACTIVITY));*/
			}
			
			allPortlets.add(new Portlet("Agile CRM Blog",PortletType.RSS));
			allPortlets.add(new Portlet("Account Details",PortletType.ACCOUNT));
			
			//allPortlets.add(new Portlet("Webstat Visits",PortletType.WEBSTATS));
			allPortlets.add(new Portlet("Emails Opened",PortletType.MARKETING));
		    	allPortlets.add(new Portlet("Campaign stats",PortletType.MARKETING));
			allPortlets.add(new Portlet("Campaign graph",PortletType.MARKETING));
			allPortlets.add(new Portlet("Referralurl stats",PortletType.MARKETING));
			allPortlets.add(new Portlet("Webstat Visits",PortletType.MARKETING));

			//setIsAddedStatus(allPortlets);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return allPortlets;
	}
	/**
	 * Fetches all {@link Portlet}s for current {@link AgileUser}
	 *  
	 * @return {@link List} of {@link Portlet}s
	 */
	public static List<Portlet> getAddedPortletsForCurrentUser(String route)throws Exception{
		
		Objectify ofy = ObjectifyService.begin();
		
		List<Portlet> added_portlets = new ArrayList<Portlet>();

		
		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);
		

		/*
		 * Fetches list of portlets related to AgileUser key
		 */
		List<Portlet> portlets;
		if(route==null){
			route= Portlet.PortletRoute.DashBoard.toString();
		}

		if(route.equals(Portlet.PortletRoute.DashBoard.toString())){
		portlets = ofy.query(Portlet.class).ancestor(userKey).order("row_position").list();
		//If user first time login after portlets code deploy, we add some portlets by default
		//in DB and one null portlet also
		if(portlets!=null && portlets.size()>0){
			for(Portlet portlet : portlets){
				if(portlet.portlet_route==null){
					portlet.portlet_route=Portlet.PortletRoute.DashBoard.toString();
					portlet.save();
				}	
			}
		}
		}
		portlets = ofy.query(Portlet.class).ancestor(userKey).order("row_position").filter("portlet_route", route).list();
		if(portlets!=null && portlets.size()==0 && route.equals(Portlet.PortletRoute.DashBoard.toString()))
			{addDefaultPortlets();
		portlets = ofy.query(Portlet.class).ancestor(userKey).order("row_position").filter("portlet_route",Portlet.PortletRoute.DashBoard.toString() ).list();
		}

		for(Portlet portlet : portlets){
			if(portlet.prefs!=null){
				JSONObject json=(JSONObject)JSONSerializer.toJSON(portlet.prefs);
				if(portlet.name!=null && portlet.name.equalsIgnoreCase("Growth Graph") && json.containsKey("start-date") && json.containsKey("end-date")
						 && !json.containsKey("duration"))
					json.put("duration","1-week");
				else if(portlet.name!=null && (portlet.name.equalsIgnoreCase("Agenda") || portlet.name.equalsIgnoreCase("Today Tasks")) && !json.containsKey("duration"))
					json.put("duration","1-day");
				else if(portlet.name!=null && portlet.name.equalsIgnoreCase("User Activities") && !json.containsKey("duration"))
					json.put("duration","this-quarter");
				portlet.settings=json;
			}else{
				if(portlet.name!=null && (portlet.name.equalsIgnoreCase("Agenda") || portlet.name.equalsIgnoreCase("Today Tasks"))){
					JSONObject json=new JSONObject();
					json.put("duration","1-day");
					portlet.settings=json;
				}
				else
				{
					if(portlet.name!=null && portlet.name.equalsIgnoreCase("User Activities") ){
						JSONObject json=new JSONObject();
						json.put("duration","this-quarter");
					json.put("activity_type","ALL");
					portlet.settings=json;
					}
				}
			}

			if(portlet.name!=null && !portlet.name.equalsIgnoreCase("Dummy Blog"))
				added_portlets.add(portlet);
		}
		
		return added_portlets;
	}
	/**
	 * Gets {@link Portlet} by its id, queries portlet on id with user key
	 * 
	 * @param id
	 *            {@link Long}
	 * @return {@link Portlet}
	 */
	public static Portlet getPortlet(Long id){
		try
		{
			// Retrieves current AgileUser key
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);

			// Gets Portlet key based on id and AgileUser Key
			Key<Portlet> portletKey = new Key<Portlet>(userKey, Portlet.class, id);

			// Returns widget based on widget key created.
			return dao.get(portletKey);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * Iterates through all the portlets. If portlet is present in database,
	 * returns its is_added status as added
	 * 
	 * @param portlets
	 *            {@link List} of {@link Portlet}
	 * @return {@link List} of {@link Portlet}
	 */
	public static List<Portlet> setIsAddedStatus(List<Portlet> portlets)throws Exception{
		

			
		List<Portlet> currentPortlets = getAddedPortletsForCurrentUser(Portlet.PortletRoute.DashBoard.toString());
		//currentPortlets.addAll(getAddedPortletsForCurrentUser(Portlet.PortletRoute.Contacts));
		//currentPortlets.addAll(getAddedPortletsForCurrentUser(Portlet.PortletRoute.Deals));
		//currentPortlets.addAll(getAddedPortletsForCurrentUser(Portlet.PortletRoute.Tasks));
		//currentPortlets.addAll(getAddedPortletsForCurrentUser(Portlet.PortletRoute.Events));
			for (Portlet portlet : portlets){
				HashSet<String> s = new HashSet<String>();
				for (Portlet currentPortlet : currentPortlets){
					if (currentPortlet.name.equals(portlet.name) && currentPortlet.portlet_type.equals(portlet.portlet_type)){
						portlet.is_added = true;
						//s.add(currentPortlet.portlet_route.toString());
					}	
				}
				//portlet.is_routeadded=s.toString();
				
			
		}
		
		return portlets;
	}
	
	/**
	 * Fetches portlet by its name and current {@link AgileUser} key
	 * 
	 * @param name
	 *            {@link String}. Name of the portlet
	 * @return {@link Portlet}
	 */
	public static List<Portlet> getPortlet(String name){
		try{
			return getPortlet(name, AgileUser.getCurrentAgileUser().id);
		}
		catch (Exception e){
			e.printStackTrace();
			return null;
		}
	}
	/**
	 * Fetches portlet by its name and current {@link AgileUser} key
	 * 
	 * @param name
	 *            {@link String}. Name of the portlet
	 * @param agileUserId
	 *            {@link Long} agile user id
	 * @return {@link Portlet}
	 */
	public static List<Portlet> getPortlet(String name, Long agileUserId){
		try{
			Objectify ofy = ObjectifyService.begin();

			// Gets the Current AgileUser key to query on widgets
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, agileUserId);

			// Queries on widget name, with current AgileUser Key
			return ofy.query(Portlet.class).ancestor(userKey).filter("name", name).list();
		}
		catch (Exception e){
			e.printStackTrace();
			return null;
		}
	}
	public static List<Contact> getContactsList(JSONObject json, String sortKey)throws Exception{
		List<Contact> contactsList=null;
		if(json!=null && json.get("filter")!=null){
			if(json.get("filter").toString().equalsIgnoreCase("contacts"))
				contactsList=ContactUtil.getAllContactsByOrder(50,null,sortKey);
			else if(json.get("filter").toString().equalsIgnoreCase("companies"))
				contactsList=ContactUtil.getAllCompaniesByOrder(50, null,sortKey);
			else if(json.get("filter").toString().equalsIgnoreCase("recent"))
				contactsList=ContactFilterUtil.getContacts("system-RECENT", 50, null,sortKey);
			else if(json.get("filter").toString().equalsIgnoreCase("myContacts"))
				contactsList=ContactFilterUtil.getContacts("system-CONTACTS", 50, null,sortKey);
			else if(json.get("filter").toString().equalsIgnoreCase("leads"))
				contactsList=ContactFilterUtil.getContacts("system-LEADS", 50, null,sortKey);
			else
				contactsList=ContactFilterUtil.getContacts(json.get("filter").toString(), 50, null,sortKey);
		}
		return contactsList;
	}
	public static List<JSONObject> getEmailsOpenedList(JSONObject json)throws Exception{
		long minTime=0L;
		long maxTime=0L;
		List<JSONObject> contactsList=null;
		try {
			if(json!=null && json.get("duration")!=null){
				/*if(json.get("duration").toString().equalsIgnoreCase("2-days")){
					DateUtil startDateUtil = new DateUtil();
		    		minTime = startDateUtil.removeDays(2).toMidnight().getTime().getTime() / 1000;
		    		
		    		DateUtil endDateUtil = new DateUtil();
		    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
				}else if(json.get("duration").toString().equalsIgnoreCase("1-week")){
					DateUtil startDateUtil = new DateUtil();
		    		minTime = startDateUtil.removeDays(7).toMidnight().getTime().getTime() / 1000;
		    		
		    		DateUtil endDateUtil = new DateUtil();
		    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
				}else if(json.get("duration").toString().equalsIgnoreCase("1-month")){
					DateUtil startDateUtil = new DateUtil();
		    		minTime = startDateUtil.removeDays(30).toMidnight().getTime().getTime() / 1000;
		    		
		    		DateUtil endDateUtil = new DateUtil();
		    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
				}*/
				if(json.getString("startDate")!=null)
					minTime = Long.valueOf(json.getString("startDate"));
				if(json.getString("endDate")!=null)
					maxTime = Long.valueOf(json.getString("endDate"))-1;
				contactsList=ContactUtil.getEmailsOpened(minTime,maxTime);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return contactsList;
	}
	public static List<Opportunity> getPendingDealsList(JSONObject json)throws Exception{
		List<Opportunity> dealsList=null;
		try {
			String track=null;
			String milestone=null;
			if(json.get("track")!=null)
				track=json.get("track").toString();
			if(json.get("milestone")!=null)
				milestone=json.get("milestone").toString();
			if(json!=null && json.get("deals")!=null){
				if(json.get("deals").toString().equalsIgnoreCase("all-deals"))
					dealsList=OpportunityUtil.getPendingDealsRelatedToAllUsers(0,track,milestone);
				else if(json.get("deals").toString().equalsIgnoreCase("my-deals"))
					dealsList=OpportunityUtil.getPendingDealsRelatedToCurrentUser(0,track,milestone);
				for(Opportunity opp:dealsList){
					
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dealsList;
	}
	public static List<Opportunity> getDealsWonList(JSONObject json)throws Exception{
		long minTime=0L;
		long maxTime=0L;
		List<Opportunity> finalDealsList = new ArrayList<Opportunity>();
		if(json!=null && json.get("duration")!=null){
			/*if(json.get("duration").toString().equalsIgnoreCase("1-week")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(7).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}else if(json.get("duration").toString().equalsIgnoreCase("1-month")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(30).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}else if(json.get("duration").toString().equalsIgnoreCase("3-months")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(90).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}else if(json.get("duration").toString().equalsIgnoreCase("6-months")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(180).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}else if(json.get("duration").toString().equalsIgnoreCase("12-months")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(365).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}*/
			minTime = getMinTime(json.get("duration").toString());
			maxTime = getMaxTime(json.get("duration").toString());

			List<Opportunity> dealsList = OpportunityUtil.getOpportunitiesWon(null);
    		List<Activity> wonDealsActivityList = ActivityUtil.getWonDealsActivityList(minTime,maxTime);
    		Map<Long,Opportunity> dealsMap = new LinkedHashMap<Long,Opportunity>();
    		Map<Long,Opportunity> wonDealsActivityMap = new LinkedHashMap<Long,Opportunity>();
    		if(dealsList!=null)
    			for(Opportunity opportunity : dealsList){
    				dealsMap.put(opportunity.id,opportunity);
    			}
    		if(wonDealsActivityList!=null)
    			for(Activity activity : wonDealsActivityList){
    				if(dealsMap.containsKey(activity.entity_id))
    					if(!wonDealsActivityMap.containsKey(activity.entity_id)){
    						wonDealsActivityMap.put(activity.entity_id,dealsMap.get(activity.entity_id));
    						finalDealsList.add(dealsMap.get(activity.entity_id));
    					}
    			}
    				
		}
		return finalDealsList;
	}
	public static List<Event> getAgendaList(String startTime,String endTime,String duration)throws Exception{
		try {
			if(startTime!=null && endTime!=null)
				return EventUtil.getTodayPendingEvents(Long.valueOf(startTime),Long.valueOf(endTime));
			else
				return null;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	public static List<Task> getTodayTasksList(String startTime,String endTime,String duration)throws Exception{
		try {
			if(startTime!=null && endTime!=null){
				if(duration!=null && duration.equalsIgnoreCase("all-over-due"))
					return TaskUtil.getTodayPendingTasks(Long.valueOf(startTime),Long.valueOf(endTime),duration);
				else
					return TaskUtil.getTodayPendingTasks(Long.valueOf(startTime),Long.valueOf(endTime),duration);
			}else
				return null;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	public static JSONObject getDealsByMilestoneData(JSONObject json)throws Exception{
		JSONObject dealsByMilestoneJSON=new JSONObject();
		try{
		if(json!=null){
			if(json.get("deals")!=null && (json.get("deals").toString().equalsIgnoreCase("all-deals") || json.get("deals").toString().equalsIgnoreCase("my-deals")) && json.get("track")!=null){
				List<String> milestonesList=new ArrayList<String>();
				List<Double> milestoneValuesList=new ArrayList<Double>();
				List<Integer> milestoneNumbersList=new ArrayList<Integer>();
				Milestone milestone = MilestoneUtil.getMilestone(Long.valueOf(json.get("track").toString()));
				if(milestone!=null && milestone.milestones!=null){
					String[] milestones=milestone.milestones.split(",");
					for(int i=0;i<milestones.length;i++){
						Map<Double,Integer> map=null;
						if(json.get("deals").toString().equalsIgnoreCase("all-deals"))
							map = OpportunityUtil.getTotalMilestoneValueAndNumber(milestones[i],false,0,null,milestone.id);
						else if(json.get("deals").toString().equalsIgnoreCase("my-deals"))
							map = OpportunityUtil.getTotalMilestoneValueAndNumber(milestones[i],true,0,null,milestone.id);
						for(Map.Entry<Double, Integer> entry : map.entrySet()){
							if(!milestones[i].equalsIgnoreCase("") && milestones[i]!=""){
								milestonesList.add(milestones[i]);
								milestoneValuesList.add(entry.getKey());
								milestoneNumbersList.add(entry.getValue());
							}
						}
					}
				}
				dealsByMilestoneJSON.put("milestonesList",milestonesList);
				dealsByMilestoneJSON.put("milestoneValuesList",milestoneValuesList);
				dealsByMilestoneJSON.put("milestoneNumbersList",milestoneNumbersList);
				if(milestone!=null && milestone.won_milestone != null){
					dealsByMilestoneJSON.put("wonMilestone",milestone.won_milestone);
				}else{
					dealsByMilestoneJSON.put("wonMilestone","Won");
				}
				if(milestone!=null && milestone.lost_milestone != null){
					dealsByMilestoneJSON.put("lostMilestone",milestone.lost_milestone);
				}else{
					dealsByMilestoneJSON.put("lostMilestone","Lost");
				}

			}
		}
		List<Milestone> milestoneList=MilestoneUtil.getMilestonesList();
		Map<String,String> milestoneMap=new LinkedHashMap<String,String>();
		for(Milestone milstone : milestoneList){
			milestoneMap.put(String.valueOf(milstone.id),milstone.name);
		}
		dealsByMilestoneJSON.put("milestoneMap",milestoneMap);
		
		
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return dealsByMilestoneJSON;
	}
	public static JSONObject getClosuresPerPersonData(JSONObject json)throws Exception{
		JSONObject closuresPerPersonJSON=new JSONObject();
		List<Integer> milestoneNumbersList=new ArrayList<Integer>();
		List<Double> milestoneValuesList=new ArrayList<Double>();
		List<DomainUser> domainUsersList=null;
		List<String> domainUserNamesList=new ArrayList<String>();
		DomainUser dUser=DomainUserUtil.getCurrentDomainUser();
		if(dUser!=null)
			domainUsersList=DomainUserUtil.getUsers(dUser.domain);
		List<Activity> wonDealsActivityList = null;
		if(json!=null && json.get("due-date")!=null){
			wonDealsActivityList = ActivityUtil.getWonDealsActivityList(0,json.getLong("due-date")+(24*60*60));
		}
		for(DomainUser domainUser : domainUsersList){
			double totalMilestoneValue=0;
			List<Opportunity> finalDealsList = new ArrayList<Opportunity>();
			List<Opportunity> dealsList = OpportunityUtil.getOpportunitiesWon(domainUser.id);
			Map<Long,Opportunity> dealsMap = new LinkedHashMap<Long,Opportunity>();
			Map<Long,Opportunity> wonDealsActivityMap = new LinkedHashMap<Long,Opportunity>();
			if(dealsList!=null)
				for(Opportunity opportunity : dealsList){
					dealsMap.put(opportunity.id,opportunity);
				}
			if(wonDealsActivityList!=null)
				for(Activity activity : wonDealsActivityList){
					if(dealsMap.containsKey(activity.entity_id))
						if(!wonDealsActivityMap.containsKey(activity.entity_id)){
							wonDealsActivityMap.put(activity.entity_id,dealsMap.get(activity.entity_id));
							finalDealsList.add(dealsMap.get(activity.entity_id));
						}
				}
			for(Opportunity opportunity1 : finalDealsList){
				if(opportunity1!=null && opportunity1.expected_value!=null)
					totalMilestoneValue+=opportunity1.expected_value;
    		}
			milestoneValuesList.add(totalMilestoneValue);
			milestoneNumbersList.add(finalDealsList.size());
			domainUserNamesList.add(domainUser.name);
		}
		
		closuresPerPersonJSON.put("milestoneNumbersList",milestoneNumbersList);
		closuresPerPersonJSON.put("milestoneValuesList",milestoneValuesList);
		closuresPerPersonJSON.put("domainUsersList",domainUserNamesList);
		
		return closuresPerPersonJSON;
	}
	public static JSONObject getEmailsSentData(JSONObject json)throws Exception{
		JSONObject emailsSentJSON=new JSONObject();
		long minTime=0L;
		long maxTime=0L;
		if(json!=null && json.get("duration")!=null){
			/*if(json.get("duration").toString().equalsIgnoreCase("1-day")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(1).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}else if(json.get("duration").toString().equalsIgnoreCase("2-days")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(2).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}else if(json.get("duration").toString().equalsIgnoreCase("1-week")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(7).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}else if(json.get("duration").toString().equalsIgnoreCase("1-month")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(30).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}*/
			minTime = getMinTime(json.get("duration").toString());
			maxTime = getMaxTime(json.get("duration").toString());
			List<Integer> mailsCountList=new ArrayList<Integer>();
			List<DomainUser> domainUsersList=null;
			DomainUser dUser=DomainUserUtil.getCurrentDomainUser();
			if(dUser!=null)
				domainUsersList=DomainUserUtil.getUsers(dUser.domain);
			List<String> domainUserNamesList=new ArrayList<String>();
			List<Integer> mailsOpenedCountList=new ArrayList<Integer>();
			for(DomainUser domainUser : domainUsersList){
				List<ContactEmail> emailsList=ContactEmailUtil.getEmailsSent(domainUser,minTime,maxTime);
				List<ContactEmail> emailsOpenedList=ContactEmailUtil.getEmailsOpenedByUser(domainUser,minTime,maxTime);
				if(emailsList!=null){
					if(emailsOpenedList!=null)
						mailsCountList.add(emailsList.size()-emailsOpenedList.size());
					else
						mailsCountList.add(emailsList.size());
				}
					
				else
					mailsCountList.add(0);
				if(emailsOpenedList!=null)
					mailsOpenedCountList.add(emailsOpenedList.size());
				else
					mailsOpenedCountList.add(0);
				domainUserNamesList.add(domainUser.name);
			}
			
			emailsSentJSON.put("domainUsersList",domainUserNamesList);
			emailsSentJSON.put("mailsCountList",mailsCountList);
			emailsSentJSON.put("mailsOpenedCountList",mailsOpenedCountList);
		}
		return emailsSentJSON;
	}
	public static JSONObject getGrowthGraphData(JSONObject json)throws Exception{
		String growthGraphString=null;
		JSONObject growthGraphJSON=null;
		long start_date = 0L;
		long end_date =0L;
		if(json!=null && json.get("tags")!=null && json.get("frequency")!=null && json.get("duration")!=null){
			String[] tags = json.getString("tags").split(",");
			int type = Calendar.DAY_OF_MONTH;

			if (StringUtils.equalsIgnoreCase(json.getString("frequency"), "monthly"))
			    type = Calendar.MONTH;
			if (StringUtils.equalsIgnoreCase(json.getString("frequency"), "weekly"))
			    type = Calendar.WEEK_OF_YEAR;
			if(json.getString("startDate")!=null)
				start_date = Long.valueOf(json.getString("startDate"));
			if(json.getString("endDate")!=null)
				end_date = Long.valueOf(json.getString("endDate"))-1;
			String time_zone = DateUtil.getCurrentUserTimezoneOffset();
		    if (time_zone != null)
		    {
		    	start_date -= (Long.parseLong(time_zone)*60*1000);
		    	end_date -= (Long.parseLong(time_zone)*60*1000);
		    }
			ReportsUtil.check(start_date, end_date);
			org.json.JSONObject tagCount=TagSearchUtil.getTagCount(null, tags, String.valueOf(start_date), String.valueOf(end_date), type);
			if(tagCount!=null)
			growthGraphString=tagCount.toString();
		}
		if(growthGraphString!=null)
			growthGraphJSON = (JSONObject)JSONSerializer.toJSON(growthGraphString);
		return growthGraphJSON;
	}
	public static JSONObject getPortletDealsAssigned(JSONObject json)throws Exception{
		long minTime=0L;
		long maxTime=0L;
		JSONObject dealsAssignedJSON=new JSONObject();
		if(json!=null && json.get("duration")!=null){
			/*if(json.get("duration").toString().equalsIgnoreCase("1-day")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(1).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}else if(json.get("duration").toString().equalsIgnoreCase("1-week")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(7).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}else if(json.get("duration").toString().equalsIgnoreCase("1-month")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(30).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}*/
			minTime = getMinTime(json.get("duration").toString());
			maxTime = getMaxTime(json.get("duration").toString());
			List<DomainUser> domainUsersList=null;
			DomainUser dUser=DomainUserUtil.getCurrentDomainUser();
			if(dUser!=null)
				domainUsersList=DomainUserUtil.getUsers(dUser.domain);
			List<String> domainUserNamesList=new ArrayList<String>();
			List<Integer> assignedOpportunitiesCountList=new ArrayList<Integer>();
			for(DomainUser domainUser : domainUsersList){
				int assignedOpportunitiesCount=0;
				List<Opportunity> assignedOpportunitiesList=OpportunityUtil.getOpportunitiesAsignedToUser(domainUser.id);
				for(Opportunity opportunity : assignedOpportunitiesList){
					List<Activity> activitiesList=ActivityUtil.getActivitiesByEntityId(opportunity.id,minTime,maxTime);
					if(activitiesList!=null && activitiesList.size()>0)
						assignedOpportunitiesCount++;
					else{
						if(opportunity.created_time>=minTime && opportunity.created_time<=maxTime)
							assignedOpportunitiesCount++;
					}
				}
				assignedOpportunitiesCountList.add(assignedOpportunitiesCount);
				domainUserNamesList.add(domainUser.name);
			}
			dealsAssignedJSON.put("domainUsersList",domainUserNamesList);
			dealsAssignedJSON.put("assignedOpportunitiesCountList",assignedOpportunitiesCountList);
		}
		return dealsAssignedJSON;
	}
	public static JSONObject getPortletCallsPerPerson(JSONObject json)throws Exception{
		long minTime=0L;
		long maxTime=0L;
		JSONObject callsPerPersonJSON=new JSONObject();
		if(json!=null){
			/*if(json.get("duration").toString().equalsIgnoreCase("1-day")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(1).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}else if(json.get("duration").toString().equalsIgnoreCase("1-week")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(7).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}else if(json.get("duration").toString().equalsIgnoreCase("1-month")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(30).toMidnight().getTime().getTime() / 1000;
	    		
	    		DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}*/
			if(json.getString("startDate")!=null)
				minTime = Long.valueOf(json.getString("startDate"));
			if(json.getString("endDate")!=null)
				maxTime = Long.valueOf(json.getString("endDate"))-1;
		}
		List<DomainUser> domainUsersList=null;
		DomainUser dUser=DomainUserUtil.getCurrentDomainUser();
		if(dUser!=null)
			domainUsersList=DomainUserUtil.getUsers(dUser.domain);
		List<String> domainUserNamesList=new ArrayList<String>();
		List<String> domainUserImgList=new ArrayList<String>();
		List<Integer> totalCallsCountList=new ArrayList<Integer>();
		List<Long> callsDurationList=new ArrayList<Long>();
		List<Long> nonZeroDurationCountList=new ArrayList<Long>();
		List<DomainUser> usersList = new ArrayList<DomainUser>();
		
		try {
			if(json.containsKey("user")){
				if(json.getJSONArray("user")!=null){
					List<Long> userJSONList = new ArrayList<Long>();
					for(int i=0;i<json.getJSONArray("user").size();i++){
						userJSONList.add(json.getJSONArray("user").getLong(i));
					}
					for(DomainUser domainUser : domainUsersList){
						if(userJSONList.contains(domainUser.id) && !domainUser.is_disabled)
							usersList.add(domainUser);
					}
				}
			}else{
				for(DomainUser domainUser : domainUsersList){
					if(!domainUser.is_disabled)
						usersList.add(domainUser);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		int i=0;
		//Map<String,Integer[]> finalCallStatusCount = new HashMap<>();
		List<Map<String, Integer>> finalCallStatusCountMapList = new ArrayList<>();
		Map<String,Integer> CallStatusCountMap = new LinkedHashMap<>();
		
		CategoriesUtil categoriesUtil = new CategoriesUtil();
		List<Category> categories = categoriesUtil.getCategoriesByType(Category.EntityType.TELEPHONY_STATUS.toString());
		//CallStatusCountMap.put(Call.ANSWERED,0);
		//CallStatusCountMap.put(Call.BUSY,0);
		//CallStatusCountMap.put(Call.FAILED,0);
		//CallStatusCountMap.put(Call.VOICEMAIL,0);
		//CallStatusCountMap.put(Call.Missed,0);
		for(Category category : categories){
			CallStatusCountMap.put(category.getLabel().toLowerCase(), 0);
		}
		CallStatusCountMap.put("others",0);
		
		for(DomainUser domainUser : usersList){
			// loop all the status and generate the count for each .........
			int totalCallsCount=0;
			long callsDuration=0;
			List<Activity> callActivitiesList = ActivityUtil.getActivitiesByActivityType("CALL",domainUser.id,minTime,maxTime);
			Map<String,Integer> tempCallStatusCountMap = new LinkedHashMap<>(CallStatusCountMap);
			Long nonZeroDurationCount = 0L;
			for(Activity activity:callActivitiesList){
				try{
					String statusInActivity = activity.custom3;
					if(statusInActivity != null && !statusInActivity.equals("")){
						if(statusInActivity.equalsIgnoreCase(Call.ANSWERED) || statusInActivity.equalsIgnoreCase(Call.COMPLETED)){
							statusInActivity = Call.ANSWERED;
						}else if((statusInActivity.equalsIgnoreCase(Call.BUSY) || statusInActivity.equalsIgnoreCase(Call.NO_ANSWER))){
							statusInActivity = Call.BUSY;
						}else if(activity.custom3!=null){
							if(tempCallStatusCountMap.containsKey(activity.custom3.toLowerCase())){
								statusInActivity=activity.custom3.toLowerCase();
							}else{
								statusInActivity="others";
							}
						}
						int count1=tempCallStatusCountMap.get(statusInActivity);
                 		count1++;
                 		tempCallStatusCountMap.put(statusInActivity,count1);
		                    
						totalCallsCount++;
						if(activity.custom4!=null &&  !activity.custom4.equalsIgnoreCase(null) 
								&& !activity.custom4.equalsIgnoreCase("null") && !activity.custom4.equalsIgnoreCase("")){
							callsDuration+=Long.valueOf(activity.custom4);
							if(Long.valueOf(activity.custom4) > 0){
								nonZeroDurationCount ++;
							}
						}
					}
				}catch(Exception e){
					e.printStackTrace();
				}
			}
			finalCallStatusCountMapList.add(tempCallStatusCountMap);
			nonZeroDurationCountList.add(nonZeroDurationCount);
			totalCallsCountList.add(totalCallsCount);
			callsDurationList.add(callsDuration);
			domainUserNamesList.add(domainUser.name);
			if(domainUser.pic != null)
				domainUserImgList.add(domainUser.pic);
			else
				domainUserImgList.add("no image-"+i);
			i++;
		}
		
		callsPerPersonJSON.put("totalNonZeroDurationStatusCountList",nonZeroDurationCountList);
		callsPerPersonJSON.put("finalCallStatusCountMapList", finalCallStatusCountMapList);	
		callsPerPersonJSON.put("callsDurationList",callsDurationList);
		callsPerPersonJSON.put("totalCallsCountList",totalCallsCountList);
		callsPerPersonJSON.put("domainUsersList",domainUserNamesList);
		callsPerPersonJSON.put("domainUserImgList",domainUserImgList);
		
		return callsPerPersonJSON;	
	}
	public static void addDefaultPortlets(){
		try {
			//Added dummy portlet for recognizing whether Agile CRM Blog 
			//portlet is deleted by user or not
			CategoriesUtil categoriesUtil = new CategoriesUtil();
			MilestoneUtil.getMilestones();
			categoriesUtil.getCategoriesByType(Category.EntityType.TELEPHONY_STATUS.toString());
			Portlet dummyPortlet = new Portlet("Dummy Blog",PortletType.RSS,1,1,1,1,Portlet.PortletRoute.DashBoard.toString());			
			Portlet filterBasedContactsPortlet = new Portlet("Filter Based",PortletType.CONTACTS,3,3,1,1,Portlet.PortletRoute.DashBoard.toString());
			Portlet onboardingPortlet = new Portlet("Onboarding",PortletType.CONTACTS,3,1,1,2,Portlet.PortletRoute.DashBoard.toString());
			Portlet incomingDealsPortlet = new Portlet("Incoming Deals",PortletType.DEALS,2,2,1,1,Portlet.PortletRoute.DashBoard.toString());
			Portlet miniCalendarPortlet = new Portlet("Mini Calendar",PortletType.TASKSANDEVENTS,2,3,1,1,Portlet.PortletRoute.DashBoard.toString());
			Portlet dealsFunnelPortlet = new Portlet("Deals Funnel",PortletType.DEALS,1,1,1,1,Portlet.PortletRoute.DashBoard.toString());
			Portlet dealsByMilestonePortlet = new Portlet("Deals By Milestone",PortletType.DEALS,2,1,1,1,Portlet.PortletRoute.DashBoard.toString());
			Portlet tasksPortlet = new Portlet("Today Tasks",PortletType.TASKSANDEVENTS,1,3,1,1,Portlet.PortletRoute.DashBoard.toString());
			Portlet lostDealAnalysisPortlet = new Portlet("Lost Deal Analysis",PortletType.DEALS,1,2,1,1,Portlet.PortletRoute.DashBoard.toString());						
			
			JSONObject filterBasedContactsPortletJSON = new JSONObject();
			filterBasedContactsPortletJSON.put("filter","myContacts");
			filterBasedContactsPortlet.prefs = filterBasedContactsPortletJSON.toString();
			
			JSONObject onboardingPortletJSON = new JSONObject();
			List<String> onboardingSteps = new ArrayList<>();
			DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
			if(domainUser.is_admin){
				onboardingSteps.add("addUsers");
				onboardingSteps.add("importContacts");
				onboardingSteps.add("setupIntegrations");
				onboardingSteps.add("createCampaign");
				onboardingSteps.add("setupTrackingCode");
				onboardingSteps.add("addWebrule");
				onboardingSteps.add("upgradePlan");
			}else{
				onboardingSteps.add("setupProfile");
				onboardingSteps.add("linkEmailAccount");
				onboardingSteps.add("addWidgets");
				onboardingSteps.add("importContacts");
				onboardingSteps.add("createCampaign");
			}
			Map<String,Boolean> processMap = new LinkedHashMap<String,Boolean>();
			processMap.put("done", false);
			processMap.put("skip", false);
			for (String string : onboardingSteps) {
				onboardingPortletJSON.put(string,processMap);
			}
			onboardingPortlet.prefs = onboardingPortletJSON.toString();
			
			JSONObject incomingDealsPortletJSON = new JSONObject();
			incomingDealsPortletJSON.put("type","deals");
			incomingDealsPortletJSON.put("frequency","daily");
			incomingDealsPortletJSON.put("duration","1-week");
			incomingDealsPortlet.prefs = incomingDealsPortletJSON.toString();
			
			JSONObject dealsFunnelPortletJSON = new JSONObject();
			dealsFunnelPortletJSON.put("deals","my-deals");
			dealsFunnelPortletJSON.put("track",0);
			dealsFunnelPortletJSON.put("due-date",(new Date().getTime())/1000);
			dealsFunnelPortlet.prefs = dealsFunnelPortletJSON.toString();
			
			JSONObject dealsByMilestonePortletJSON = new JSONObject();
			dealsByMilestonePortletJSON.put("deals","my-deals");
			dealsByMilestonePortletJSON.put("track",0);
			dealsByMilestonePortletJSON.put("due-date",(new Date().getTime())/1000);
			dealsByMilestonePortlet.prefs = dealsByMilestonePortletJSON.toString();
			
			JSONObject tasksPortletJSON = new JSONObject();
			tasksPortletJSON.put("duration","this-week");
			tasksPortlet.prefs = tasksPortletJSON.toString();
			
			JSONObject lostDealAnalysisPortletJSON = new JSONObject();
			lostDealAnalysisPortletJSON.put("duration","1-week");
			lostDealAnalysisPortlet.prefs = lostDealAnalysisPortletJSON.toString();
			
			dummyPortlet.save();			
			filterBasedContactsPortlet.save();
			onboardingPortlet.save();
			incomingDealsPortlet.save();
			miniCalendarPortlet.save();
			dealsFunnelPortlet.save();
			dealsByMilestonePortlet.save();
			tasksPortlet.save();
			lostDealAnalysisPortlet.save();
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	public static JSONObject getTaskReportPortletData(JSONObject json)throws Exception{
		List<DomainUser> domainUsersList=null;
		List<String> groupByList = new ArrayList<String>();
		List<Map<String,Integer>> splitByList = new ArrayList<Map<String,Integer>>();
		JSONObject dataJson = new JSONObject();
		List<String> domainUserNamesList = new ArrayList<String>();
		try {
			DomainUser dUser=DomainUserUtil.getCurrentDomainUser();
			if(dUser!=null)
				domainUsersList=DomainUserUtil.getUsers(dUser.domain);

			List<DomainUser> usersList = new ArrayList<DomainUser>();
			
			List<Key<DomainUser>> usersKeyList = new ArrayList<Key<DomainUser>>();

			if(json.containsKey("user")){
				if(json.getJSONArray("user")!=null){
					List<Long> userJSONList = new ArrayList<Long>();
					for(int i=0;i<json.getJSONArray("user").size();i++){
						userJSONList.add(json.getJSONArray("user").getLong(i));
					}
					for(DomainUser domainUser : domainUsersList){
						if(userJSONList.contains(domainUser.id) && !domainUser.is_disabled){
							usersList.add(domainUser);
							usersKeyList.add(new Key<DomainUser>(DomainUser.class, domainUser.id));
						}
					}
				}
			}else{
				for(DomainUser domainUser : domainUsersList){
					if(!domainUser.is_disabled){
						usersList.add(domainUser);
						usersKeyList.add(new Key<DomainUser>(DomainUser.class, domainUser.id));
					}
				}
			}
			CategoriesUtil categoriesUtil = new CategoriesUtil();
			List<Category> taskCategoriesList = categoriesUtil.getAllCategoriesByType(Category.EntityType.TASK.toString());

			if(json!=null && json.getString("group-by")!=null && json.getString("split-by")!=null && json.getString("startDate")!=null && json.getString("endDate")!=null && json.getString("group-by").equalsIgnoreCase("user") && json.getString("split-by").equalsIgnoreCase("category")){
				int i=0;
				for(DomainUser domainUser : usersList){
					Map<String,Integer> splitByMap = new LinkedHashMap<String,Integer>();
					for(Category category : taskCategoriesList){
						List<Task> tasksList = TaskUtil.getTasksRelatesToOwnerOfTypeAndCategory(domainUser.id,category.getName(),null,Long.valueOf(json.getString("startDate")),Long.valueOf(json.getString("endDate")),json.getString("tasks"),null);
						if(tasksList!=null)
							splitByMap.put(category.getLabel(),tasksList.size());
						else
							splitByMap.put(category.getLabel(),0);
					}
					if(domainUser.pic !=null)
						groupByList.add(domainUser.pic);
					else
						groupByList.add("no image-"+i);
					splitByList.add(splitByMap);
					domainUserNamesList.add(domainUser.name);
					i++;
				}
			}else if(json!=null && json.getString("group-by")!=null && json.getString("split-by")!=null && json.getString("startDate")!=null && json.getString("endDate")!=null && json.getString("group-by").equalsIgnoreCase("user") && json.getString("split-by").equalsIgnoreCase("status")){
				int i=0;
				for(DomainUser domainUser : usersList){
					Map<String,Integer> splitByMap = new LinkedHashMap<String,Integer>();
					for(Task.Status status : Task.Status.values()){
						List<Task> tasksList = TaskUtil.getTasksRelatesToOwnerOfTypeAndCategory(domainUser.id,null,status.name(),Long.valueOf(json.getString("startDate")),Long.valueOf(json.getString("endDate")),json.getString("tasks"),null);
						if(tasksList!=null)
							splitByMap.put(status.name(),tasksList.size());
						else
							splitByMap.put(status.name(),0);
					}
					if(domainUser.pic !=null)
						groupByList.add(domainUser.pic);
					else
						groupByList.add("no image-"+i);
					splitByList.add(splitByMap);
					domainUserNamesList.add(domainUser.name);
					i++;
				}
			}else if(json!=null && json.getString("group-by")!=null && json.getString("split-by")!=null && json.getString("startDate")!=null && json.getString("endDate")!=null && json.getString("group-by").equalsIgnoreCase("category") && json.getString("split-by").equalsIgnoreCase("user")){
				for(Category category : taskCategoriesList){
					Map<String,Integer> splitByMap = new LinkedHashMap<String,Integer>();
					for(DomainUser domainUser : usersList){
						List<Task> tasksList = TaskUtil.getTasksRelatesToOwnerOfTypeAndCategory(domainUser.id,category.getName(),null,Long.valueOf(json.getString("startDate")),Long.valueOf(json.getString("endDate")),json.getString("tasks"),null);
						if(tasksList!=null)
							splitByMap.put(domainUser.name,tasksList.size());
						else
							splitByMap.put(domainUser.name,0);
					}
					groupByList.add(category.getLabel());
					splitByList.add(splitByMap);
				}
			}else if(json!=null && json.getString("group-by")!=null && json.getString("split-by")!=null && json.getString("startDate")!=null && json.getString("endDate")!=null && json.getString("group-by").equalsIgnoreCase("category") && json.getString("split-by").equalsIgnoreCase("status")){
				for(Category category : taskCategoriesList){
					Map<String,Integer> splitByMap = new LinkedHashMap<String,Integer>();
					for(Task.Status status : Task.Status.values()){
						List<Task> tasksList = TaskUtil.getTasksRelatesToOwnerOfTypeAndCategory(null,category.getName(),status.name(),Long.valueOf(json.getString("startDate")),Long.valueOf(json.getString("endDate")),json.getString("tasks"),usersKeyList);
						if(tasksList!=null)
							splitByMap.put(status.name(),tasksList.size());
						else
							splitByMap.put(status.name(),0);
					}
					groupByList.add(category.getLabel());
					splitByList.add(splitByMap);
				}
			}else if(json!=null && json.getString("group-by")!=null && json.getString("split-by")!=null && json.getString("startDate")!=null && json.getString("endDate")!=null && json.getString("group-by").equalsIgnoreCase("status") && json.getString("split-by").equalsIgnoreCase("user")){
				for(Task.Status status : Task.Status.values()){
					Map<String,Integer> splitByMap = new LinkedHashMap<String,Integer>();
					for(DomainUser domainUser : usersList){
						List<Task> tasksList = TaskUtil.getTasksRelatesToOwnerOfTypeAndCategory(domainUser.id,null,status.name(),Long.valueOf(json.getString("startDate")),Long.valueOf(json.getString("endDate")),json.getString("tasks"),null);
						if(tasksList!=null)
							splitByMap.put(domainUser.name,tasksList.size());
						else
							splitByMap.put(domainUser.name,0);
					}
					groupByList.add(status.name());
					splitByList.add(splitByMap);
				}
			}else if(json!=null && json.getString("group-by")!=null && json.getString("split-by")!=null && json.getString("startDate")!=null && json.getString("endDate")!=null && json.getString("group-by").equalsIgnoreCase("status") && json.getString("split-by").equalsIgnoreCase("category")){
				for(Task.Status status : Task.Status.values()){
					Map<String,Integer> splitByMap = new LinkedHashMap<String,Integer>();
					for(Category category : taskCategoriesList){
						List<Task> tasksList = TaskUtil.getTasksRelatesToOwnerOfTypeAndCategory(null,category.getName(),status.name(),Long.valueOf(json.getString("startDate")),Long.valueOf(json.getString("endDate")),json.getString("tasks"),usersKeyList);
						if(tasksList!=null)
							splitByMap.put(category.getLabel(),tasksList.size());
						else
							splitByMap.put(category.getLabel(),0);
					}
					groupByList.add(status.name());
					splitByList.add(splitByMap);
				}
			}
			dataJson.put("groupByList", groupByList);
			dataJson.put("splitByList", splitByList);
			dataJson.put("domainUserNamesList", domainUserNamesList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dataJson;
	}
	public static long getMinTime(String duration)throws Exception{
		long minTime=0L;
		try {
			Calendar cl = Calendar.getInstance(TimeZone.getTimeZone(DomainUserUtil.getCurrentDomainUser().timezone));
			if(duration.equalsIgnoreCase("yesterday")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(1).toMidnight().getTime().getTime() / 1000;
			}else if(duration.equalsIgnoreCase("today") || duration.equalsIgnoreCase("1-day")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.toMidnight().getTime().getTime() / 1000;
			}else if(duration.toString().equalsIgnoreCase("this-week")){
				DateUtil startDateUtil = new DateUtil();
				minTime = startDateUtil.removeDays(cl.get(Calendar.DAY_OF_WEEK)-2).toMidnight().getTime().getTime() / 1000;
			}else if(duration.toString().equalsIgnoreCase("1-week")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(6).toMidnight().getTime().getTime() / 1000;
			}else if(duration.toString().equalsIgnoreCase("this-month")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(cl.get(Calendar.DAY_OF_MONTH)-1).toMidnight().getTime().getTime() / 1000;
			}else if(duration.equalsIgnoreCase("1-month")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(29).toMidnight().getTime().getTime() / 1000;
			}else if(duration.equalsIgnoreCase("2-days")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(1).toMidnight().getTime().getTime() / 1000;
			}else if(duration.equalsIgnoreCase("3-months")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(89).toMidnight().getTime().getTime() / 1000;
			}else if(duration.equalsIgnoreCase("6-months")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(179).toMidnight().getTime().getTime() / 1000;
			}else if(duration.equalsIgnoreCase("12-months")){
				DateUtil startDateUtil = new DateUtil();
	    		minTime = startDateUtil.removeDays(364).toMidnight().getTime().getTime() / 1000;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return minTime;
	}
	public static long getMaxTime(String duration)throws Exception{
		long maxTime=0L;
		try {
			if(duration.equalsIgnoreCase("yesterday")){
				DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.toMidnight().getTime().getTime() / 1000)-1;
			}else{
				DateUtil endDateUtil = new DateUtil();
	    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return maxTime;
	}
	public static boolean checkPrivilegesForPortlets(String menuscope)throws Exception{
		DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
		if(menuscope.equalsIgnoreCase("DEALS")){
			if(domainUser!=null && domainUser.menu_scopes!=null && domainUser.menu_scopes.contains(NavbarConstants.DEALS))
				return true;
			else{
				AccessDeniedException ade=new AccessDeniedException("<div class='portlet-error-privilege-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
				throw ade;
			}
				
		}else if(menuscope.equalsIgnoreCase("TASKS")){
			if(domainUser!=null && domainUser.menu_scopes!=null && domainUser.menu_scopes.contains(NavbarConstants.CALENDAR))
				return true;
			else{
				AccessDeniedException ade=new AccessDeniedException("<div class='portlet-error-privilege-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
				throw ade;
			}
				
		}else if(menuscope.equalsIgnoreCase("EVENTS")){
			if(domainUser!=null && domainUser.menu_scopes!=null && domainUser.menu_scopes.contains(NavbarConstants.CALENDAR))
				return true;
			else{
				AccessDeniedException ade=new AccessDeniedException("<div class='portlet-error-privilege-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
				throw ade;
			}
				
		}else if(menuscope.equalsIgnoreCase("ACTIVITY")){
			if(domainUser!=null && domainUser.menu_scopes!=null && domainUser.menu_scopes.contains(NavbarConstants.ACTIVITY))
				return true;
			else{
				AccessDeniedException ade=new AccessDeniedException("<div class='portlet-error-privilege-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
				throw ade;
			}
				
		}else
			return true;
			
		
	}
	public static JSONObject getEmailsOpenedPieData(JSONObject json)throws Exception{
		long minTime=0L;
		long maxTime=0L;
		JSONObject dataJson = new JSONObject();
		try {
			if(json!=null && json.get("duration")!=null){
				if(json.getString("startDate")!=null)
					minTime = Long.valueOf(json.getString("startDate"));
				if(json.getString("endDate")!=null)
					maxTime = Long.valueOf(json.getString("endDate"))-1;
				List<ContactEmail> emailsSentList = ContactEmailUtil.getEmailsOpened(minTime, maxTime, false);
				List<ContactEmail> emailsOpenedList = ContactEmailUtil.getEmailsOpened(minTime,maxTime,true);
				if(emailsSentList!=null)
					dataJson.put("emailsSentCount", emailsSentList.size());
				else
					dataJson.put("emailsSentCount", 0);
				if(emailsOpenedList!=null)
					dataJson.put("emailsOpenedCount", emailsOpenedList.size());
				else
					dataJson.put("emailsOpenedCount", 0);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dataJson;
	}
	
	public static JSONObject getPortletStatsReportData(JSONObject json)throws Exception{
		long minTime=0L;
		long maxTime=0L;
		JSONObject dataJson = new JSONObject();
		int newContactsCount = 0;
		int wonDealsCount = 0;
		Double wonDealValue = 0d;
		String emailsSentCount = "0";
		int newDealsCount = 0;
		Double newDealValue = 0d;
		List<Opportunity> wonDealsList = new ArrayList<Opportunity>();
		List<Opportunity> newDealsList = new ArrayList<Opportunity>();
		try {
			if(json!=null && json.get("duration")!=null){
				if(json.getString("startDate")!=null)
					minTime = Long.valueOf(json.getString("startDate"));
				if(json.getString("endDate")!=null)
					maxTime = Long.valueOf(json.getString("endDate"))-1;
				
				if(json.getString("reportType")!=null && json.getString("reportType").equalsIgnoreCase("newContacts")){
					newContactsCount = ContactUtil.getContactsCount(minTime, maxTime);
					dataJson.put("newContactsCount", newContactsCount);
					return dataJson;
				}
				if(json.getString("reportType")!=null && json.getString("reportType").equalsIgnoreCase("wonDeals")){
					wonDealsList = OpportunityUtil.getWonDealsList(minTime, maxTime);
					for(Opportunity opportunity : wonDealsList){
						if(opportunity!=null && opportunity.expected_value!=null)
							wonDealValue += opportunity.expected_value;
						wonDealsCount++;
					}
					dataJson.put("wonDealsCount", wonDealsCount);
					dataJson.put("wonDealValue", wonDealValue);
					return dataJson;
				}
				if(json.getString("reportType")!=null && json.getString("reportType").equalsIgnoreCase("newDeals")){
					newDealsList = OpportunityUtil.getNewDealsList(minTime, maxTime);
					for(Opportunity opportunity : newDealsList){
						if(opportunity!=null && opportunity.expected_value!=null)
							newDealValue += opportunity.expected_value;
						newDealsCount++;
					}
					dataJson.put("newDealsCount", newDealsCount);
					dataJson.put("newDealValue", newDealValue);
					return dataJson;
				}
				if(json.getString("reportType")!=null && json.getString("reportType").equalsIgnoreCase("campaignEmailsSent")){
					if(json.getString("duration")!=null && json.getString("duration").equalsIgnoreCase("24-hours")){
						minTime = (new Date().getTime()/1000)-(24*60*60);
						maxTime = new Date().getTime()/1000;
					}
					// start date in mysql date format.
					String startDate = CampaignReportsUtil.getStartDate(String.valueOf(minTime*1000), String.valueOf(maxTime*1000), null, json.getString("timeZone"));
					
					// end date in mysql date format.
					String endDate = CampaignReportsUtil.getEndDateForReports(String.valueOf(maxTime*1000), json.getString("timeZone"));
					
					String [] array = {"EMAIL_SENT"};
					JSONArray campaignEmailsJSONArray = CampaignReportsSQLUtil.getCountByLogTypes(startDate,endDate,json.getString("timeZone"),array);
					
					if(campaignEmailsJSONArray!=null && campaignEmailsJSONArray.length()>0 && campaignEmailsJSONArray.getJSONObject(0)!=null && campaignEmailsJSONArray.getJSONObject(0).getString("count")!=null)
						emailsSentCount = campaignEmailsJSONArray.getJSONObject(0).getString("count");
					dataJson.put("emailsSentCount", emailsSentCount);
					return dataJson;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dataJson;
	}
	
	public static JSONObject getPortletLeaderboardData(JSONObject json)throws Exception{
		List<DomainUser> domainUsersList = null;
		JSONObject dataJson = new JSONObject();
		List<JSONObject> cateList = new ArrayList<JSONObject>();
		long minTime=0L;
		long maxTime=0L;
		int categoryCount=0;
		List<DomainUser> usersList = new ArrayList<DomainUser>();
		try {
			DomainUser dUser=DomainUserUtil.getCurrentDomainUser();
			if(dUser!=null)
				domainUsersList=DomainUserUtil.getUsers(dUser.domain);
			if(json!=null && json.getString("duration")!=null){
				if(json.getString("startDate")!=null)
					minTime = Long.valueOf(json.getString("startDate"));
				if(json.getString("endDate")!=null)
					maxTime = Long.valueOf(json.getString("endDate"))-1;
				if(json.containsKey("user")){
					if(json.getJSONArray("user")!=null){
						List<Long> userJSONList = new ArrayList<Long>();
						for(int i=0;i<json.getJSONArray("user").size();i++){
							userJSONList.add(json.getJSONArray("user").getLong(i));
						}
						for(DomainUser domainUser : domainUsersList){
							if(userJSONList.contains(domainUser.id) && !domainUser.is_disabled)
								usersList.add(domainUser);
						}
					}
				}else{
					for(DomainUser domainUser : domainUsersList){
						if(!domainUser.is_disabled)
							usersList.add(domainUser);
					}
				}
				if(json.getBoolean("revenue")){
					for(DomainUser domainUser : usersList){
						JSONObject cateJson = new JSONObject();
						cateJson.put("name", "Revenue");
						List<Opportunity> wonDealsList = OpportunityUtil.getWonDealsListOfUser(minTime, maxTime, domainUser.id);
						Double milestoneValue = 0d;
						if(wonDealsList!=null){
							for(Opportunity opportunity : wonDealsList){
								if(opportunity.expected_value!=null)
								milestoneValue += opportunity.expected_value;
							}
						}
						cateJson.put("value", Math.round(milestoneValue));
						cateJson.put("userName", domainUser.name);
						if(dUser.id.equals(domainUser.id))
							cateJson.put("isDomainUser", true);
						else
							cateJson.put("isDomainUser", false);
						
						if(domainUser.pic!=null)
							cateJson.put("userPic",domainUser.pic);
						else
							cateJson.put("userPic","");
						cateList.add(cateJson);
						Collections.sort(cateList,new Comparator<JSONObject>(){
							@Override  
			                public int compare(JSONObject o1, JSONObject o2){
								return Double.valueOf(o2.getDouble("value")).compareTo(Double.valueOf(o1.getDouble("value")));  
			                }
			            });
					}
					dataJson.put("revenueJson", cateList);
					dataJson.put("revenue", true);
					categoryCount++;
				}else
					dataJson.put("revenue", false);
				if(json.getBoolean("dealsWon")){
					cateList = new ArrayList<JSONObject>();
					for(DomainUser domainUser : usersList){
						JSONObject cateJson = new JSONObject();
						cateJson.put("name", "Deals Won");
						cateJson.put("value", OpportunityUtil.getWonDealsCountOfUser(minTime, maxTime, domainUser.id));
						cateJson.put("userName", domainUser.name);
						if(dUser.id.equals(domainUser.id))
							cateJson.put("isDomainUser", true);
						else
							cateJson.put("isDomainUser", false);
						
						if(domainUser.pic!=null)
							cateJson.put("userPic",domainUser.pic);
						else
							cateJson.put("userPic","");
						cateList.add(cateJson);
						Collections.sort(cateList,new Comparator<JSONObject>(){
							@Override  
			                public int compare(JSONObject o1, JSONObject o2){
								return Integer.valueOf(o2.getInt("value")).compareTo(Integer.valueOf(o1.getInt("value")));  
			                }
			            });
					}
					dataJson.put("dealsWonJson", cateList);
					dataJson.put("dealsWon", true);
					categoryCount++;
				}else
					dataJson.put("dealsWon", false);
				if(json.getBoolean("calls")){
					cateList = new ArrayList<JSONObject>();
					for(DomainUser domainUser : usersList){
						JSONObject cateJson = new JSONObject();
						//JSONObject cateJson_total = new JSONObject();
						callsStatus(domainUser,minTime,maxTime,cateJson);
						//cateJson.put("value", ActivityUtil.getCompletedCallsCountOfUser(domainUser.id, minTime, maxTime));
						cateJson.put("name", "Calls Won");
						cateJson.put("userName", domainUser.name);
						if(dUser.id.equals(domainUser.id))
							cateJson.put("isDomainUser", true);
						else
							cateJson.put("isDomainUser", false);
						
						if(domainUser.pic!=null)
							cateJson.put("userPic",domainUser.pic);
						else
							cateJson.put("userPic","");
						cateList.add(cateJson);
					}
					Collections.sort(cateList,new Comparator<JSONObject>(){
						@Override  
		                public int compare(JSONObject o1, JSONObject o2){
							if(o1.get("eachCallStatus") instanceof Map<?, ?>){
								Map<String,Integer> mapO1 = (Map<String, Integer>) o1.get("eachCallStatus");
								Map<String,Integer> mapO2 = (Map<String, Integer>) o2.get("eachCallStatus");
								return mapO2.get("answered").compareTo(mapO1.get("answered")); 
							}
							return 0;
		                }
		            });
					dataJson.put("callsJson", cateList);
					dataJson.put("calls", true);
					categoryCount++;
				}else
					dataJson.put("calls", false);
				if(json.getBoolean("tasks")){
					cateList = new ArrayList<JSONObject>();
					for(DomainUser domainUser : usersList){
						JSONObject cateJson = new JSONObject();
						cateJson.put("name", "Deals Won");
						cateJson.put("value", TaskUtil.getCompletedTasksOfUser(minTime, maxTime, domainUser.id));
						cateJson.put("userName", domainUser.name);
						if(dUser.id.equals(domainUser.id))
							cateJson.put("isDomainUser", true);
						else
							cateJson.put("isDomainUser", false);
						
						if(domainUser.pic!=null)
							cateJson.put("userPic",domainUser.pic);
						else
							cateJson.put("userPic","");
						cateList.add(cateJson);
						Collections.sort(cateList,new Comparator<JSONObject>(){
							@Override  
			                public int compare(JSONObject o1, JSONObject o2){
								return Integer.valueOf(o2.getInt("value")).compareTo(Integer.valueOf(o1.getInt("value")));  
			                }
			            });
					}
					dataJson.put("tasksJson", cateList);
					dataJson.put("tasks", true);
					categoryCount++;
				}else
					dataJson.put("tasks", false);
				dataJson.put("categoryCount", categoryCount);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dataJson;
	}
	
	public static List<DomainUser> getCurrentDomainUsersForPortlets()throws Exception{
		try {
			DomainUser dUser=DomainUserUtil.getCurrentDomainUser();
			if(dUser!=null)
				return DomainUserUtil.getUsers(dUser.domain);
			else
				return null;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	/**
	 * Fetches Campaign emails data
	 * 
	 * @return {JSONObject}
	 */
	public static  JSONObject getCampaignstatsForPortlets(JSONObject json) throws Exception
	{
		JSONObject datajson=new JSONObject();
		int emailsClicked = 0;
		int emailsOpened =0;
		int emailsent = 0;
		int unsubscribe =0;
		int hardBounce=0;
		int softBounce=0;
		int emailsSkipped=0;
		int emailsSpam=0;
		String a="";
		JSONArray campaignEmailsJSONArray;
		long minTime=0L;
		long maxTime=0L;
		if(json!=null && json.get("duration")!=null){
			if(json.getString("startDate")!=null)
				minTime = Long.valueOf(json.getString("startDate"));
			if(json.getString("endDate")!=null)
				maxTime = Long.valueOf(json.getString("endDate"))-1;
		
			if(json.getString("duration")!=null && json.getString("duration").equalsIgnoreCase("24-hours")){
			minTime = (new Date().getTime()/1000)-(24*60*60);
			maxTime = new Date().getTime()/1000;
		}
		// start date in mysql date format.
		String startDate = CampaignReportsUtil.getStartDate(String.valueOf(minTime*1000), String.valueOf(maxTime*1000), null, json.getString("timeZone"));
		
		// end date in mysql date format.
		String endDate = CampaignReportsUtil.getEndDateForReports(String.valueOf(maxTime*1000), json.getString("timeZone"));
		
		String [] array = {"EMAIL_SENT","EMAIL_OPENED","EMAIL_CLICKED","UNSUBSCRIBED"};
		//if (json.getString("campaigntype").equalsIgnoreCase("All"))
		campaignEmailsJSONArray = getCountByLogTypesforPortlets(json.getString("campaigntype"),startDate,endDate,json.getString("timeZone"));
			
		//else
			//{campaignEmailsJSONArray	=CampaignReportsSQLUtil.getEachCampaignStatsForTable(json.getString("campaigntype"),startDate,endDate,json.getString("timeZone"),a);
				System.out.println("see"+campaignEmailsJSONArray);	//}
		if(campaignEmailsJSONArray!=null && campaignEmailsJSONArray.length()>0)
		{	
		try{
				for(int i=0;i<campaignEmailsJSONArray.length();i++){

			if(campaignEmailsJSONArray.getJSONObject(i).getString("log_type").equals("EMAIL_OPENED"))
			{emailsOpened = Integer.parseInt(campaignEmailsJSONArray.getJSONObject(i).getString("count"));continue;}
			
			if(campaignEmailsJSONArray.getJSONObject(i).getString("log_type").equals("EMAIL_CLICKED"))
			{emailsClicked = Integer.parseInt(campaignEmailsJSONArray.getJSONObject(i).getString("count"));continue;}
			
			if(campaignEmailsJSONArray.getJSONObject(i).getString("log_type").equals("EMAIL_SENT"))
			{emailsent = Integer.parseInt(campaignEmailsJSONArray.getJSONObject(i).getString("total"));continue;}
			
			if(campaignEmailsJSONArray.getJSONObject(i).getString("log_type").equals("UNSUBSCRIBED"))
			{unsubscribe = Integer.parseInt(campaignEmailsJSONArray.getJSONObject(i).getString("count"));continue;}
			
			if(campaignEmailsJSONArray.getJSONObject(i).getString("log_type").equals("EMAIL_SPAM"))
			{emailsSpam= Integer.parseInt(campaignEmailsJSONArray.getJSONObject(i).getString("count"));continue;}
			
			if(campaignEmailsJSONArray.getJSONObject(i).getString("log_type").equals("EMAIL_SENDING_SKIPPED"))
			{emailsSkipped= Integer.parseInt(campaignEmailsJSONArray.getJSONObject(i).getString("count"));continue;}
			
			if(campaignEmailsJSONArray.getJSONObject(i).getString("log_type").equals("EMAIL_HARD_BOUNCED"))
			{hardBounce= Integer.parseInt(campaignEmailsJSONArray.getJSONObject(i).getString("count"));continue;}
			
			if(campaignEmailsJSONArray.getJSONObject(i).getString("log_type").equals("EMAIL_SOFT_BOUNCED"))
			{softBounce= Integer.parseInt(campaignEmailsJSONArray.getJSONObject(i).getString("count"));continue;}
		
			}
			
			}
			catch(Exception e)
			{
				System.out.println(e);
			}
		}
		
	}
		    datajson.put("emailopened",emailsOpened);
			datajson.put("emailclicked",emailsClicked);
			datajson.put("emailsent",emailsent);
			datajson.put("emailunsubscribed",unsubscribe);
			datajson.put("emailSpam",emailsSpam);
			datajson.put("emailSkipped", emailsSkipped);
			datajson.put("hardBounce", hardBounce);
			datajson.put("softBounce", softBounce);
		return datajson;
		}
		
		 public static JSONArray getCountByLogTypesforPortlets(String campaignType,String startDate, String endDate, String timeZone)
    {
    	
			 String domain=NamespaceManager.get();
			 String query;
    	// For development
    	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
    	    domain = "localhost";

    	//if (StringUtils.isEmpty(domain) ||  logType == null || logType.length == 0)
    	  //  return null;
    		
    	// Returns (sign)HH:mm from total minutes.
    	String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);
    	
    	/* String query = "SELECT log_type,count(Distinct subscriber_id) AS count ,count(subscriber_id) AS total "+  
    			" FROM stats.campaign_logs USE INDEX(domain_logtype_logtime_index) "+
    	                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain) +" AND log_type = " + GoogleSQLUtil.encodeSQLColumnValue(logType[0]) + 
    	                " AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
    	                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type ";
    	
    	         for(int i = 0; i < logType.length; i++)
    	         {
    	        	 if(i == 0)
    	        		 continue;
    	        	 
    	        	query += " UNION ALL ";
    	        	 
    	        	query +=  "SELECT log_type,count(Distinct subscriber_id) AS count , count(subscriber_id) AS total "+  
    	    			" FROM stats.campaign_logs USE INDEX(domain_logtype_logtime_index) "+
    	    	                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+ " AND log_type = " + GoogleSQLUtil.encodeSQLColumnValue(logType[i]) + 
    	    	                " AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
    	    	                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type ";
    	        	 
    	         } */
			if(campaignType.equalsIgnoreCase("All"))	 
				 query  =  "SELECT log_type,count(Distinct subscriber_id) AS count ,count(subscriber_id) AS total "+ 
									" FROM stats2.campaign_logs "+
									"WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain) +" AND log_type in ('EMAIL_SENT','EMAIL_OPENED','EMAIL_CLICKED','UNSUBSCRIBED', 'EMAIL_SPAM', 'EMAIL_SENDING_SKIPPED', 'EMAIL_HARD_BOUNCED', 'EMAIL_SOFT_BOUNCED')"+
									" AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " +
										 "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type ";
			else
				 query = "SELECT log_type,count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
									"FROM stats2.campaign_logs "+
									"WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignType)+" AND log_type in ('EMAIL_SENT','EMAIL_OPENED','EMAIL_CLICKED','UNSUBSCRIBED', 'EMAIL_SPAM', 'EMAIL_SENDING_SKIPPED', 'EMAIL_HARD_BOUNCED', 'EMAIL_SOFT_BOUNCED')"+
									"AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
									"AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type " ;
                
    	
    	try
    	{
    	    return GoogleSQL.getJSONQuery(query);
    	}
    	catch (Exception e)
    	{
    	    e.printStackTrace();
    	    return new JSONArray();
    	}

    }

	public static JSONObject getAccountsList() throws Exception {
		JSONObject json=new JSONObject();


		String oldNamespace = NamespaceManager.get();
		DomainUser user = DomainUserUtil.getDomainOwner(oldNamespace);
		NamespaceManager.set("our");
		try
		{
		   
			String a=DomainUserUtil.getCurrentDomainUser().email;
			System.out.println(a);
			Contact contact=ContactUtil.searchContactByEmail(user.email);
			if(contact!=null){
				DomainUser owner=contact.getContactOwner();
				if(owner!=null)
				{
					json.put("Owner_name",owner.name);
					json.put("Owner_pic",owner.getOwnerPic());
					json.put("Owner_url", owner.getCalendarURL());
				}
			}
			
			
		}
		finally
		{
		    NamespaceManager.set(oldNamespace);
		}
		
		Subscription sub=SubscriptionUtil.getSubscription();
		System.out.println(sub.plan);
		json.put("Count",sub.plan.quantity);
		json.put("Plan",sub.plan.getPlanName());
		if(sub.plan.plan_id!=null){
			json.put("Plan_Interval",sub.plan.getPlanInterval());
		}
		if(sub.emailPlan!=null){
		json.put("Email",(sub.emailPlan.quantity)*1000);
		}
		
		
		return json;
	}
	
	public static List<Activity> getPortletActivitydata(String entitytype, Long userid, int max,
			String cursor, Long starttime, Long endtime) {
		
		List<Activity> list = ActivityUtil.getActivititesBasedOnSelectedConditon(entitytype, userid, max, cursor,
	        starttime, endtime,null,"");
		System.out.println("Size of List"+list.size());
		System.out.println(list);
		return list;
	}
	
	/*
	 * Gives the goal set for user and goal attained from it.
	 * 
	 * @param owner_id,minTime and maxTime
	 * 
	 * @returns JSONObject
	 * 
	 */
	public static JSONObject getGoalsAttainedData(Long owner_id,Long minTime,Long maxTime,Long timeZone)
	{
		int count=0;
		Long count_goal=0L;
		Double value=0.0;
		Double amount_goal=0.0;
		JSONObject json=new JSONObject();
		try{
		List<Opportunity> opportunities=OpportunityUtil.getWonDealsListWithOwner(minTime, maxTime, owner_id);
		if(opportunities!=null){
			for(Opportunity opp:opportunities){
				if(opp.expected_value!=null){
			value = value+opp.expected_value;
			count++;
				}
		}
		}
		json.put("dealcount", count);
		json.put("dealAmount", value);
		List<Goals> goals=GoalsUtil.getAllGoalsForUser(owner_id, minTime, maxTime,timeZone);
		if(goals!=null)
		{
			for(Goals goal:goals){
				if(goal.count!=null)
			count_goal+=goal.count;
				if(goal.amount!=null)
			amount_goal+=goal.amount;
		}
			json.put("goalCount",count_goal);
			json.put("goalAmount", amount_goal);
	}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return json;
	}
	
	public static JSONObject getAverageDeviationForTasks(Long minTime,Long maxTime)
	{
		List<DomainUser> domainUsersList=null;
		List<String> domainUserNamesList = new ArrayList<String>();
		List<String> groupByList = new ArrayList<String>();
		JSONObject dataJson = new JSONObject();
		List<Map<String,List<Long>>> splitByList = new ArrayList<Map<String,List<Long>>>();
		try {
		DomainUser dUser=DomainUserUtil.getCurrentDomainUser();
		
		List<DomainUser> usersList = new ArrayList<DomainUser>();
		
		List<Key<DomainUser>> usersKeyList = new ArrayList<Key<DomainUser>>();
		if(dUser!=null)
			domainUsersList=DomainUserUtil.getUsers(dUser.domain);

		for(DomainUser domainUser : domainUsersList){
			if(!domainUser.is_disabled){
				usersList.add(domainUser);
				usersKeyList.add(new Key<DomainUser>(DomainUser.class, domainUser.id));
			}
		}
		//List <Task> tasks=TaskUtil.getCompletedTasks(minTime, maxTime);
		
		
		CategoriesUtil categoriesUtil = new CategoriesUtil();
		List<Category> taskCategoriesList = categoriesUtil.getAllCategoriesByType(Category.EntityType.TASK.toString());
		int i=0;
		for(DomainUser domainUser : usersList){
			Map<String,List<Long>> splitByMap = new LinkedHashMap<String,List<Long>>();
			for(Category category : taskCategoriesList){
				List<Task> tasksList = TaskUtil.getTasksRelatesToOwnerOfTypeAndCategory(domainUser.id,category.getName(),null,minTime,maxTime,null,null);
				if(tasksList!=null)
					{
					List<Long> l=new ArrayList<Long>();
					//l.add((long) tasksList.size());
					Long Total_closure = 0L;
					int count=0;
					for(Task task:tasksList){
						Long time_deviation=0L;
						if(task.task_completed_time!=null && task.due!=null){
						if(task.task_completed_time>task.due)
							{
							time_deviation=(task.task_completed_time-task.due);
							count++;
							}
						}
						Total_closure+=time_deviation;
								}
					l.add((long)count);
					if(count!=0)
					l.add(Total_closure/count);
					else
						l.add(Total_closure);
					splitByMap.put(category.getLabel(),l);
					}

			}
			if(domainUser.pic!=null)
				groupByList.add(domainUser.pic);
			else
				groupByList.add("no image-"+i);
			splitByList.add(splitByMap);
			domainUserNamesList.add(domainUser.name);
			i++;
		}
		dataJson.put("groupByList", groupByList);
		dataJson.put("splitByList", splitByList);
		dataJson.put("domainUserNamesList", domainUserNamesList);
		
		
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return dataJson;
	}
	
	/**
	 * This method is used for getting contact count of ACTIVE, DONE and REMOVED campaign status
	 * @param campaignId
	 * @param startTime
	 * @return dataJson
	 */
	public static JSONObject getCampaignStatsForPieChart(String campaignId, Long startTime)
	  {

		JSONObject dataJson = new JSONObject();

		List<String> campaignStatusList = new ArrayList<String>();
		List<Double> contactValuesList = new ArrayList<Double>();
		
		double doneContactCount=0;
		double activeContactCount=0;
		double removeContactCount=0;
		
		try
		{
			if(campaignId.equals("All"))
		 	{
				//get all campaign list
				List<Workflow> workflows = new ArrayList<Workflow>();
				workflows = WorkflowUtil.getAllWorkflows();
				
				for(Workflow workflow : workflows)
				  {
					
					doneContactCount +=CampaignSubscribersUtil.getContactCountByCampaignStats(workflow.id + "-" + CampaignStatus.Status.DONE, startTime);
					activeContactCount +=CampaignSubscribersUtil.getContactCountByCampaignStats(workflow.id + "-" + CampaignStatus.Status.ACTIVE, startTime);
					removeContactCount +=CampaignSubscribersUtil.getContactCountByCampaignStats(workflow.id + "-" + CampaignStatus.Status.REMOVED, startTime);	
				   }
		 	  }
			else
			 {			
				 doneContactCount=CampaignSubscribersUtil.getContactCountByCampaignStats(campaignId + "-" + CampaignStatus.Status.DONE, startTime);
				 activeContactCount=CampaignSubscribersUtil.getContactCountByCampaignStats(campaignId + "-" + CampaignStatus.Status.ACTIVE, startTime);
				 removeContactCount=CampaignSubscribersUtil.getContactCountByCampaignStats(campaignId + "-" + CampaignStatus.Status.REMOVED, startTime);
			 }
			
			campaignStatusList.add("Completed");
			contactValuesList.add(doneContactCount);
			
			campaignStatusList.add("Active");
			contactValuesList.add(activeContactCount);
			
			campaignStatusList.add("Removed");
			contactValuesList.add(removeContactCount);
			
			dataJson.put("campaignStatusList", campaignStatusList);
			dataJson.put("campaignValuesList", contactValuesList);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured while getting contact campaign status count..." + e.getMessage());
		}
			
			return dataJson;
	  }

 
 public static JSONObject callsStatus(DomainUser domainUser,long minTime, long maxTime,JSONObject cateJson)
 {
	 
		Map<String,Integer> CallStatusCountMap = new LinkedHashMap<>();
		CategoriesUtil categoriesUtil = new CategoriesUtil();
		List<Category> categories = categoriesUtil.getCategoriesByType(Category.EntityType.TELEPHONY_STATUS.toString());
		Map<String,String> colors = new LinkedHashMap<>();
		String[] lightColors = {"#FFCCCC","#E8E4E3","#F5E7A3","#C2D6C2","#00FF00","#B8BAAB","#C3E619","#5ea1d4","#1d104a","#19A1E6","#0066CC","#E566FF","#FFFF99","#D98026","#FFAA00","#E6FFCC","#BBFF33","#FFFF33","#FF2A00","#66FFE6","#FF0080"};
		colors.put(Call.ANSWERED, "#27c24c");
		colors.put(Call.BUSY, "#23b7e5");
		colors.put(Call.Missed, "#fad733");
		colors.put(Call.VOICEMAIL, "#7266ba");
		colors.put(Call.FAILED, "#f05050");
		
		//CallStatusCountMap.put(Call.ANSWERED,0);
		//CallStatusCountMap.put(Call.BUSY,0);
		//CallStatusCountMap.put(Call.FAILED,0);
		//CallStatusCountMap.put(Call.VOICEMAIL,0);
		//CallStatusCountMap.put(Call.Missed,0);
		
		int lc=0;
		for(Category category : categories){
			CallStatusCountMap.put(category.getLabel().toLowerCase(), 0);
			if(!colors.containsKey(category.getLabel().toLowerCase())){
				String tempColor = "" ;
				int loop = 0;
				while(true){
					if(lc >= lightColors.length-1 || loop > 1){
						tempColor = "#" + Integer.toHexString(new Random().nextInt(0xFFFFFF)+ new Random().nextInt(0x16777));
					}else{
						loop = loop + 1;
						tempColor = lightColors[lc];
					}
					
					if(!colors.containsValue(tempColor)){
						loop = 0;
						lc = lc+1;
						break;
					}
				}
				colors.put(category.getLabel().toLowerCase(),tempColor);
			}
		}
		colors.put("others", "#ff8080");
		CallStatusCountMap.put("others",0);

		int total_Calls=0;
		List<Activity> callActivitiesList=ActivityUtil.getActivitiesByActivityType("CALL",domainUser.id,minTime,maxTime);
		for(Activity activity:callActivitiesList){
			try{
				String statusInActivity = activity.custom3;
				if(statusInActivity != null && !statusInActivity.equals("")){
					if(statusInActivity.equalsIgnoreCase(Call.ANSWERED) || statusInActivity.equalsIgnoreCase(Call.COMPLETED)){
						statusInActivity = Call.ANSWERED;
					}else if((statusInActivity.equalsIgnoreCase(Call.BUSY) || statusInActivity.equalsIgnoreCase(Call.NO_ANSWER))){
						statusInActivity = Call.BUSY;
					}else if(activity.custom3!=null){
						if(CallStatusCountMap.containsKey(activity.custom3.toLowerCase())){
							statusInActivity=activity.custom3.toLowerCase();
						}else{
							statusInActivity="others";
						}
					}
					int count1=CallStatusCountMap.get(statusInActivity);
             		count1++;
             		CallStatusCountMap.put(statusInActivity,count1);
             		total_Calls++;
				}
			}catch(Exception e){
				e.printStackTrace();
			}
		}
						cateJson.put("eachCallStatus",CallStatusCountMap);
						cateJson.put("colors",colors);
						cateJson.put("total", total_Calls);
						return cateJson;
 }
 
 public static void addDefaultMarketingPortlets(){
	try {
		CategoriesUtil categoriesUtil = new CategoriesUtil();
		MilestoneUtil.getMilestones();
		categoriesUtil.getCategoriesByType(Category.EntityType.TELEPHONY_STATUS.toString());
	  //  Portlet onboardingMarketingPortlet = new Portlet("Marketing Onboarding",PortletType.CONTACTS,3,1,1,3,Portlet.PortletRoute.MarketingDashboard.toString());
	   // Portlet dummyMarketiPortlet = new Portlet("Dummy Marketing Blog",PortletType.RSS,1,1,1,1,Portlet.PortletRoute.MarketingDashboard.toString());
	    Portlet campaignStatsMarketingPortlet = new Portlet("Campaign stats",PortletType.USERACTIVITY,1,1,1,1,Portlet.PortletRoute.MarketingDashboard.toString());
	    Portlet campaignGraphMarketingPortlet = new Portlet("Campaign graph",PortletType.USERACTIVITY,2,1,1,1,Portlet.PortletRoute.MarketingDashboard.toString());
	    /*Portlet webstatVisitsMarketingPortlet = new Portlet("Webstat Visits",PortletType.USERACTIVITY,1,2,1,1,Portlet.PortletRoute.MarketingDashboard.toString());
	    Portlet referralurlStatsMarketingPortlet = new Portlet("Referralurl stats",PortletType.USERACTIVITY,2,2,1,1,Portlet.PortletRoute.MarketingDashboard.toString());*/
	    Portlet emailOpenedMarketingPortlet = new Portlet("Emails Opened",PortletType.USERACTIVITY,3,1,1,1,Portlet.PortletRoute.MarketingDashboard.toString());
	    
	    JSONObject campaignStatsMarketingPortletJSON = new JSONObject();
	    campaignStatsMarketingPortletJSON.put("duration","yesterday");
	    campaignStatsMarketingPortletJSON.put("campaign_type", "All");
	    campaignStatsMarketingPortlet.prefs = campaignStatsMarketingPortletJSON.toString();
	    
	    JSONObject campaignGraphMarketingPortletJSON = new JSONObject();
	    campaignGraphMarketingPortletJSON.put("duration","1-month");
	    campaignGraphMarketingPortletJSON.put("campaign_type", "All");
	    campaignGraphMarketingPortlet.prefs = campaignGraphMarketingPortletJSON.toString();
	    
	   /* JSONObject webstatVisitsMarketingPortletJSON = new JSONObject();
	    webstatVisitsMarketingPortletJSON.put("duration","today");
	    webstatVisitsMarketingPortlet.prefs = webstatVisitsMarketingPortletJSON.toString();*/
	    
	    /*JSONObject referralurlStatsMarketingPortletJSON = new JSONObject();
	    referralurlStatsMarketingPortletJSON.put("duration","yesterday");
	    referralurlStatsMarketingPortlet.prefs = referralurlStatsMarketingPortletJSON.toString();*/
	    
	    JSONObject emailOpenedMarketingPortletJSON = new JSONObject();
	    emailOpenedMarketingPortletJSON.put("duration","2-days");
	    emailOpenedMarketingPortlet.prefs = emailOpenedMarketingPortletJSON.toString();    
		

		//default portle saving for marketing dashlet
		campaignStatsMarketingPortlet.save();
		campaignGraphMarketingPortlet.save();
		emailOpenedMarketingPortlet.save();
		//webstatVisitsMarketingPortlet.save();
		//referralurlStatsMarketingPortlet.save();
		//dummyMarketiPortlet.save();		
		//onboardingMarketingPortlet.save();
		
		
	} catch (Exception e) {
		e.printStackTrace();
	}
     }
//for marketing dashboard
 public static List<Portlet> getAddedPortletsForMarketingDashboard(String route)throws Exception{
     
     	Objectify ofy = ObjectifyService.begin();	
	List<Portlet> added_portlets = new ArrayList<Portlet>();
	List<Portlet> portlets;
	
	// Creates Current AgileUser key
	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);
	
	if(route.equals(Portlet.PortletRoute.MarketingDashboard.toString())){
	    portlets = ofy.query(Portlet.class).ancestor(userKey).order("row_position").filter("portlet_route",Portlet.PortletRoute.MarketingDashboard.toString()).list();
	    if(portlets!=null && portlets.isEmpty() && route.equals(Portlet.PortletRoute.MarketingDashboard.toString()))
		{
			addDefaultMarketingPortlets();
			portlets = ofy.query(Portlet.class).ancestor(userKey).order("row_position").filter("portlet_route",Portlet.PortletRoute.MarketingDashboard.toString() ).list();
		}
	    for(Portlet portlet : portlets){
		if(portlet.prefs!=null){
		    JSONObject json=(JSONObject)JSONSerializer.toJSON(portlet.prefs);
		    portlet.settings=json;
		}
		if(portlet.name!=null && !portlet.name.equalsIgnoreCase("Dummy Marketing Blog") && !portlet.name.equalsIgnoreCase("Marketing Onboarding"))
			added_portlets.add(portlet);
	    }
	    
	}
	
	return added_portlets;
 }
 	
 	/**
	 * Fetches all available sales {@link Portlet}s, 
	 * if sales dashboard loads first time, it will add some default {@link Portlet}s
	 *  
	 * @return {@link List} of {@link Portlet}s
	 */
	public static List<Portlet> getAddedPortletsForSalesDashboard(String route) throws Exception
	{
		Objectify ofy = ObjectifyService.begin();	
		List<Portlet> added_portlets = new ArrayList<Portlet>();
		List<Portlet> portlets = null;
		
		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);
		
		if(route.equals(Portlet.PortletRoute.SalesDashboard.toString()))
		{
		    portlets = ofy.query(Portlet.class).ancestor(userKey).order("row_position").filter("portlet_route", Portlet.PortletRoute.SalesDashboard.toString()).list();
		    if(portlets!=null && portlets.isEmpty() && route.equals(Portlet.PortletRoute.SalesDashboard.toString()))
			{
		    	addDefaultSalesPortlets();
				portlets = ofy.query(Portlet.class).ancestor(userKey).order("row_position").filter("portlet_route",Portlet.PortletRoute.SalesDashboard.toString() ).list();
			}
		    for(Portlet portlet : portlets){
				if(portlet.prefs!=null){
				    JSONObject json=(JSONObject)JSONSerializer.toJSON(portlet.prefs);
				    portlet.settings=json;
				}
				if(portlet.name!=null && !portlet.name.equalsIgnoreCase("Dummy Sales Blog"))
				{
					added_portlets.add(portlet);
				}
		    }
		}
		
		return added_portlets;
	}
	
	/**
	 * Adding contacts, deals funnel, incoming deals and mini calendar 
	 * as default {@link Portlet}s to sales dashboard
	 *  
	 * @return {@link List} of {@link Portlet}s
	 */
	public static void addDefaultSalesPortlets()
	{
		try 
		{
			CategoriesUtil categoriesUtil = new CategoriesUtil();
			MilestoneUtil.getMilestones();
			categoriesUtil.getCategoriesByType(Category.EntityType.TELEPHONY_STATUS.toString());
		//	Portlet dummySalesPortlet = new Portlet("Dummy Sales Blog",PortletType.RSS,1,1,1,1,Portlet.PortletRoute.SalesDashboard.toString());
			Portlet filterBasedContactsPortlet = new Portlet("Filter Based",PortletType.CONTACTS,1,1,1,1,Portlet.PortletRoute.SalesDashboard.toString());
		//	Portlet dealsFunnelPortlet = new Portlet("Deals Funnel",PortletType.DEALS,1,3,1,1,Portlet.PortletRoute.SalesDashboard.toString());
		//	Portlet incomingDealsPortlet = new Portlet("Incoming Deals",PortletType.DEALS,3,1,1,1,Portlet.PortletRoute.SalesDashboard.toString());
			Portlet miniCalendarPortlet = new Portlet("Mini Calendar",PortletType.TASKSANDEVENTS,1,2,1,1,Portlet.PortletRoute.SalesDashboard.toString());
			Portlet activityOverViewPortlet = new Portlet("User Activities",PortletType.USERACTIVITY,3,2,1,1,Portlet.PortletRoute.SalesDashboard.toString());
		//	Portlet revenueDealsGraphPortlet = new Portlet("Revenue Graph",PortletType.DEALS,2,3,1,1,Portlet.PortletRoute.SalesDashboard.toString());
			Portlet leaderBoardPortlet = new Portlet("Leaderboard",PortletType.USERACTIVITY,2,1,2,1,Portlet.PortletRoute.SalesDashboard.toString());
			Portlet tasksPortlet = new Portlet("Today Tasks",PortletType.TASKSANDEVENTS,2,2,1,1,Portlet.PortletRoute.SalesDashboard.toString());
		//	Portlet callsPortlet = new Portlet("Calls Per Person",PortletType.USERACTIVITY,3,3,1,1,Portlet.PortletRoute.SalesDashboard.toString());
		//	Portlet dealGoalsPortlet = new Portlet("Deal Goals",PortletType.DEALS,2,1,1,1,Portlet.PortletRoute.SalesDashboard.toString());
			
			
			JSONObject filterBasedContactsPortletJSON = new JSONObject();
			filterBasedContactsPortletJSON.put("filter","myContacts");
			filterBasedContactsPortlet.prefs = filterBasedContactsPortletJSON.toString();
			
			/*JSONObject dealsFunnelPortletJSON = new JSONObject();
			dealsFunnelPortletJSON.put("deals","my-deals");
			dealsFunnelPortletJSON.put("track",0);
			dealsFunnelPortletJSON.put("due-date",(new Date().getTime())/1000);
			dealsFunnelPortlet.prefs = dealsFunnelPortletJSON.toString();*/
			
			/*JSONObject incomingDealsPortletJSON = new JSONObject();
			incomingDealsPortletJSON.put("type","deals");
			incomingDealsPortletJSON.put("frequency","daily");
			incomingDealsPortletJSON.put("duration","1-week");
			incomingDealsPortlet.prefs = incomingDealsPortletJSON.toString();*/
			
			JSONObject activityOverViewPortletJSON = new JSONObject();			
			activityOverViewPortletJSON.put("duration","1-day");
			activityOverViewPortlet.prefs = activityOverViewPortletJSON.toString();
			
			/*JSONObject revenueDealsGraphPortletJSON = new JSONObject();			
			revenueDealsGraphPortletJSON.put("duration","this-quarter");
			revenueDealsGraphPortletJSON.put("track","anyTrack");
			revenueDealsGraphPortlet.prefs = revenueDealsGraphPortletJSON.toString();*/
			
			JSONObject leaderBoardPortletJSON = new JSONObject();
			leaderBoardPortletJSON.put("type","deals");
			leaderBoardPortletJSON.put("frequency","daily");
			leaderBoardPortletJSON.put("duration","1-week");
			JSONObject category = new JSONObject();
			category.put("revenue", true);
			category.put("dealsWon", true);
			category.put("calls", true);
			category.put("tasks", true);
			leaderBoardPortletJSON.put("category",category);
			leaderBoardPortlet.prefs = leaderBoardPortletJSON.toString();
			
			JSONObject tasksPortletJSON = new JSONObject();			
			tasksPortletJSON.put("duration","today-and-tomorrow");
			tasksPortlet.prefs = tasksPortletJSON.toString();
			
			/*JSONObject callsPortletJSON = new JSONObject();			
			callsPortletJSON.put("group-by","number-of-calls");
			callsPortletJSON.put("duration","1-day");
			callsPortlet.prefs = callsPortletJSON.toString();*/ 
			
			/*JSONObject dealGoalsPortletJSON = new JSONObject();			
			dealGoalsPortletJSON.put("group-by","number-of-calls");
			dealGoalsPortletJSON.put("duration","1-day");
			dealGoalsPortlet.prefs = dealGoalsPortletJSON.toString();*/
				
		//	dummySalesPortlet.save();
			filterBasedContactsPortlet.save();
		//	dealsFunnelPortlet.save();
		//	incomingDealsPortlet.save();
			miniCalendarPortlet.save();
			
			activityOverViewPortlet.save();
		//	revenueDealsGraphPortlet.save();
			leaderBoardPortlet.save();
			tasksPortlet.save();
		//	callsPortlet.save();
		//	dealGoalsPortlet.save();
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		}
	}
 
 
}