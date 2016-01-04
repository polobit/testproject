package com.agilecrm.portlets.util;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
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
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.access.exception.AccessDeniedException;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.DateUtil;
import com.campaignio.reports.CampaignReportsSQLUtil;
import com.campaignio.reports.CampaignReportsUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Query;
import com.agilecrm.db.util.GoogleSQLUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
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
			allPortlets.add(new Portlet("Emails Opened",PortletType.CONTACTS));
			allPortlets.add(new Portlet("Growth Graph",PortletType.CONTACTS));
			
			if(domainUser!=null && domainUser.menu_scopes!=null && domainUser.menu_scopes.contains(NavbarConstants.DEALS)){
				allPortlets.add(new Portlet("Pending Deals",PortletType.DEALS));
				allPortlets.add(new Portlet("Deals By Milestone",PortletType.DEALS));
				//allPortlets.add(new Portlet("Closures Per Person",PortletType.DEALS));
				//allPortlets.add(new Portlet("Deals Won",PortletType.DEALS));
				allPortlets.add(new Portlet("Deals Funnel",PortletType.DEALS));
				//allPortlets.add(new Portlet("Deals Assigned",PortletType.DEALS));
				allPortlets.add(new Portlet("Revenue Graph",PortletType.DEALS));
				allPortlets.add(new Portlet("Deal Goals",PortletType.DEALS));
			}
			
			if(domainUser!=null && domainUser.menu_scopes!=null && domainUser.menu_scopes.contains(NavbarConstants.CALENDAR)){
				allPortlets.add(new Portlet("Agenda",PortletType.TASKSANDEVENTS));
				allPortlets.add(new Portlet("Today Tasks",PortletType.TASKSANDEVENTS));
				allPortlets.add(new Portlet("Task Report",PortletType.TASKSANDEVENTS));
				allPortlets.add(new Portlet("Mini Calendar",PortletType.TASKSANDEVENTS));
			}
			
			if(domainUser!=null && domainUser.menu_scopes!=null && domainUser.menu_scopes.contains(NavbarConstants.ACTIVITY)){
				//allPortlets.add(new Portlet("Emails Sent",PortletType.USERACTIVITY));
				allPortlets.add(new Portlet("Stats Report",PortletType.USERACTIVITY));
				allPortlets.add(new Portlet("Leaderboard",PortletType.USERACTIVITY));
				allPortlets.add(new Portlet("Calls Per Person",PortletType.USERACTIVITY));
				allPortlets.add(new Portlet("User Activities",PortletType.USERACTIVITY));
				allPortlets.add(new Portlet("Campaign stats",PortletType.USERACTIVITY));
			}
			
			allPortlets.add(new Portlet("Agile CRM Blog",PortletType.RSS));
			allPortlets.add(new Portlet("Account Details",PortletType.ACCOUNT));
			
			setIsAddedStatus(allPortlets);
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
	public static List<Portlet> getAddedPortletsForCurrentUser()throws Exception{
		
		Objectify ofy = ObjectifyService.begin();
		
		List<Portlet> added_portlets = new ArrayList<Portlet>();

		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);

		/*
		 * Fetches list of portlets related to AgileUser key
		 */
		List<Portlet> portlets = ofy.query(Portlet.class).ancestor(userKey).order("row_position").list();
		//If user first time login after portlets code deploy, we add some portlets by default
		//in DB and one null portlet also
		if(portlets!=null && portlets.size()==0)
			addDefaultPortlets();
		portlets = ofy.query(Portlet.class).ancestor(userKey).order("row_position").list();
		for(Portlet portlet : portlets){
			if(portlet.prefs!=null){
				JSONObject json=(JSONObject)JSONSerializer.toJSON(portlet.prefs);
				//if portlet is growth graph we can change the start date and end dates based on duration
				/*System.out.println("Portlet Name---"+portlet.name);
				System.out.println("portlet.name.equalsIgnoreCase(Growth Graph)---"+portlet.name.equalsIgnoreCase("Growth Graph"));
				System.out.println("contains start-date----"+json.containsKey("start-date"));
				System.out.println("contains end-date-----"+json.containsKey("end-date"));
				System.out.println("contains duration-----"+json.containsKey("duration"));
				System.out.println("is duration value null--"+json.get("duration")==null);
				System.out.println("duration value--"+json.get("duration"));*/
				if(portlet.name!=null && portlet.name.equalsIgnoreCase("Growth Graph") && json.containsKey("start-date") && json.containsKey("end-date")
						 && !json.containsKey("duration"))
					json.put("duration","1-week");
				else if(portlet.name!=null && (portlet.name.equalsIgnoreCase("Agenda") || portlet.name.equalsIgnoreCase("Today Tasks")) && !json.containsKey("duration"))
					json.put("duration","1-day");
				portlet.settings=json;
			}else{
				if(portlet.name!=null && (portlet.name.equalsIgnoreCase("Agenda") || portlet.name.equalsIgnoreCase("Today Tasks"))){
					JSONObject json=new JSONObject();
					json.put("duration","1-day");
					portlet.settings=json;
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
		List<Portlet> currentPortlets = getAddedPortletsForCurrentUser();

		for (Portlet portlet : portlets){
			for (Portlet currentPortlet : currentPortlets){
				if (currentPortlet.name.equals(portlet.name) && currentPortlet.portlet_type.equals(portlet.portlet_type))
					portlet.is_added = true;
			}
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
	public static Portlet getPortlet(String name){
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
	public static Portlet getPortlet(String name, Long agileUserId){
		try{
			Objectify ofy = ObjectifyService.begin();

			// Gets the Current AgileUser key to query on widgets
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, agileUserId);

			// Queries on widget name, with current AgileUser Key
			return ofy.query(Portlet.class).ancestor(userKey).filter("name", name).get();
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
			if(json!=null && json.get("deals")!=null){
				if(json.get("deals").toString().equalsIgnoreCase("all-deals"))
					dealsList=OpportunityUtil.getPendingDealsRelatedToAllUsers(0);
				else if(json.get("deals").toString().equalsIgnoreCase("my-deals"))
					dealsList=OpportunityUtil.getPendingDealsRelatedToCurrentUser(0);
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
				if(milestone.won_milestone != null){
					dealsByMilestoneJSON.put("wonMilestone",milestone.won_milestone);
				}else{
					dealsByMilestoneJSON.put("wonMilestone","Won");
				}
				if(milestone.lost_milestone != null){
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
			
			growthGraphString=TagSearchUtil.getTagCount(null, tags, String.valueOf(start_date), String.valueOf(end_date), type).toString();
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
		
		List<Integer> answeredCallsCountList=new ArrayList<Integer>();
		List<Integer> busyCallsCountList=new ArrayList<Integer>();
		List<Integer> failedCallsCountList=new ArrayList<Integer>();
		List<Integer> voiceMailCallsCountList=new ArrayList<Integer>();
		List<Integer> missedCallsCountList=new ArrayList<Integer>();
		List<Integer> inquiryCallsCountList=new ArrayList<Integer>();
		List<Integer> interestCallsCountList=new ArrayList<Integer>();
		List<Integer> noInterestCallsCountList=new ArrayList<Integer>();
		List<Integer> incorrectReferralCallsCountList=new ArrayList<Integer>();
		List<Integer> newOpportunityCallsCountList=new ArrayList<Integer>();
		List<Integer> meetingScheduledCallsCountList=new ArrayList<Integer>();
		
		List<Integer> totalCallsCountList=new ArrayList<Integer>();
		
		List<Long> callsDurationList=new ArrayList<Long>();
		
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
		for(DomainUser domainUser : usersList){
			int answeredCallsCount=0;
			int busyCallsCount=0;
			int failedCallsCount=0;
			int voiceMailCallsCount=0;
			int missedCallsCount=0;
			int inquiryCallsCount=0;
			int interestCallsCount=0;
			int noInterestCallsCount=0;
			int incorrectReferralCallsCount=0;
			int newOpportunityCallsCount=0;
			int meetingScheduledCallsCount=0;
			
			int totalCallsCount=0;
			
			long callsDuration=0;
			
			List<Activity> callActivitiesList = ActivityUtil.getActivitiesByActivityType("CALL",domainUser.id,minTime,maxTime);
			try{
				for(Activity activity : callActivitiesList){
					if(activity.custom3!=null && (activity.custom3.equalsIgnoreCase(Call.ANSWERED) || activity.custom3.equalsIgnoreCase("completed")))
						answeredCallsCount++;
					else if(activity.custom3!=null && (activity.custom3.equalsIgnoreCase(Call.BUSY) || activity.custom3.equalsIgnoreCase(Call.NO_ANSWER)))
						busyCallsCount++;
					else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.FAILED))
						failedCallsCount++;
					else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.VOICEMAIL))
						voiceMailCallsCount++;
					else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.Missed))
						missedCallsCount++;
					else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.Inquiry))
						inquiryCallsCount++;
					else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.Interest))
						interestCallsCount++;
					else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.NoInterest))
						noInterestCallsCount++;
					else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.IncorrectReferral))
						incorrectReferralCallsCount++;
					else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.NewOppurtunity))
						newOpportunityCallsCount++;
					else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.MeetingScheduled))
						meetingScheduledCallsCount++;
					if(activity.custom4!=null && !activity.custom3.equalsIgnoreCase(Call.VOICEMAIL) && !activity.custom4.equalsIgnoreCase(null) 
							&& !activity.custom4.equalsIgnoreCase("null") && !activity.custom4.equalsIgnoreCase(""))
						callsDuration+=Long.valueOf(activity.custom4);
					totalCallsCount++;
				}
			}catch(Exception e){
				e.printStackTrace();
			}
			
			answeredCallsCountList.add(answeredCallsCount);
			busyCallsCountList.add(busyCallsCount);
			failedCallsCountList.add(failedCallsCount);
			voiceMailCallsCountList.add(voiceMailCallsCount);
			missedCallsCountList.add(missedCallsCount);
			inquiryCallsCountList.add(inquiryCallsCount);
			interestCallsCountList.add(interestCallsCount);
			noInterestCallsCountList.add(noInterestCallsCount);
			incorrectReferralCallsCountList.add(incorrectReferralCallsCount);
			newOpportunityCallsCountList.add(newOpportunityCallsCount);
			meetingScheduledCallsCountList.add(meetingScheduledCallsCount);
			
			totalCallsCountList.add(totalCallsCount);
			
			callsDurationList.add(callsDuration);
			
			domainUserNamesList.add(domainUser.name);
			
			AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);
			
			UserPrefs userPrefs = null;
			
			if(agileUser!=null)
				userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
			if(userPrefs!=null)
				domainUserImgList.add(userPrefs.pic);
			else
				domainUserImgList.add("no image-"+i);
			i++;
		}
		callsPerPersonJSON.put("answeredCallsCountList",answeredCallsCountList);
		callsPerPersonJSON.put("busyCallsCountList",busyCallsCountList);
		callsPerPersonJSON.put("failedCallsCountList",failedCallsCountList);
		callsPerPersonJSON.put("voiceMailCallsCountList",voiceMailCallsCountList);
		callsPerPersonJSON.put("missedCallsCountList",missedCallsCountList);
		callsPerPersonJSON.put("inquiryCallsCountList",inquiryCallsCountList);
		callsPerPersonJSON.put("interestCallsCountList",interestCallsCountList);
		callsPerPersonJSON.put("noInterestCallsCountList",noInterestCallsCountList);
		callsPerPersonJSON.put("incorrectReferralCallsCountList",incorrectReferralCallsCountList);
		callsPerPersonJSON.put("newOpportunityCallsCountList",newOpportunityCallsCountList);
		callsPerPersonJSON.put("meetingScheduledCallsCountList",meetingScheduledCallsCountList);

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
			Portlet dummyPortlet = new Portlet("Dummy Blog",PortletType.RSS,1,1,1,1);
			Portlet statsReportPortlet = new Portlet("Stats Report",PortletType.USERACTIVITY,1,1,1,1);
			Portlet dealsFunnelPortlet = new Portlet("Deals Funnel",PortletType.DEALS,2,1,1,1);
			Portlet blogPortlet = new Portlet("Agile CRM Blog",PortletType.RSS,3,3,1,2);
			Portlet eventsPortlet = new Portlet("Agenda",PortletType.TASKSANDEVENTS,1,2,1,1);
			Portlet tasksPortlet = new Portlet("Today Tasks",PortletType.TASKSANDEVENTS,2,2,1,1);
			Portlet pendingDealsPortlet = new Portlet("Pending Deals",PortletType.DEALS,1,4,2,1);
			Portlet filterBasedContactsPortlet = new Portlet("Filter Based",PortletType.CONTACTS,1,3,2,1);
			Portlet accountPortlet=new Portlet("Account Details",PortletType.ACCOUNT,1,5,1,1);
			Portlet onboardingPortlet = new Portlet("Onboarding",PortletType.CONTACTS,3,1,1,2);
			Portlet activityPortlet=new Portlet("User Activities",PortletType.USERACTIVITY,2,5,1,1);
			
			JSONObject filterBasedContactsPortletJSON = new JSONObject();
			filterBasedContactsPortletJSON.put("filter","myContacts");
			filterBasedContactsPortlet.prefs = filterBasedContactsPortletJSON.toString();
			
			JSONObject pendingDealsPortletJSON = new JSONObject();
			pendingDealsPortletJSON.put("deals","my-deals");
			pendingDealsPortletJSON.put("due-date",(new Date().getTime())/1000);
			pendingDealsPortlet.prefs = pendingDealsPortletJSON.toString();
			
			JSONObject dealsFunnelPortletJSON = new JSONObject();
			dealsFunnelPortletJSON.put("deals","my-deals");
			dealsFunnelPortletJSON.put("track",0);
			dealsFunnelPortletJSON.put("due-date",(new Date().getTime())/1000);
			dealsFunnelPortlet.prefs = dealsFunnelPortletJSON.toString();
			
			JSONObject statsReportPortletJSON = new JSONObject();
			statsReportPortletJSON.put("duration","yesterday");
			statsReportPortlet.prefs = statsReportPortletJSON.toString();
			
			JSONObject eventsPortletJSON = new JSONObject();
			eventsPortletJSON.put("duration","today-and-tomorrow");
			eventsPortlet.prefs = eventsPortletJSON.toString();
			
			JSONObject tasksPortletJSON = new JSONObject();
			tasksPortletJSON.put("duration","today-and-tomorrow");
			tasksPortlet.prefs = tasksPortletJSON.toString();
			
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
			
			//JSONObject accountPortletJSON = new JSONObject();
			//accountPortletJSON.put("account", "default");
			//accountPortlet.prefs=accountPortletJSON.toString();
			
			
			accountPortlet.save();
			activityPortlet.save();
			dummyPortlet.save();
			eventsPortlet.save();
			tasksPortlet.save();
			blogPortlet.save();
			filterBasedContactsPortlet.save();
			pendingDealsPortlet.save();
			dealsFunnelPortlet.save();
			statsReportPortlet.save();
			
			onboardingPortlet.save();
			
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
					AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);
					
					UserPrefs userPrefs = null;
					
					if(agileUser!=null)
						userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
					if(userPrefs!=null)
						groupByList.add(userPrefs.pic);
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
					AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);
					
					UserPrefs userPrefs = null;
					
					if(agileUser!=null)
						userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
					if(userPrefs!=null)
						groupByList.add(userPrefs.pic);
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
								milestoneValue += opportunity.expected_value;
							}
						}
						cateJson.put("value", Math.round(milestoneValue));
						cateJson.put("userName", domainUser.name);
						if(dUser.id.equals(domainUser.id))
							cateJson.put("isDomainUser", true);
						else
							cateJson.put("isDomainUser", false);
						
						AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);
						
						UserPrefs userPrefs = null;
						
						if(agileUser!=null)
							userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
						if(userPrefs!=null)
							cateJson.put("userPic",userPrefs.pic);
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
						
						AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);
						
						UserPrefs userPrefs = null;
						
						if(agileUser!=null)
							userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
						if(userPrefs!=null)
							cateJson.put("userPic",userPrefs.pic);
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
						cateJson.put("name", "Deals Won");
						cateJson.put("value", ActivityUtil.getCompletedCallsCountOfUser(domainUser.id, minTime, maxTime));
						cateJson.put("userName", domainUser.name);
						if(dUser.id.equals(domainUser.id))
							cateJson.put("isDomainUser", true);
						else
							cateJson.put("isDomainUser", false);
						
						AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);
						
						UserPrefs userPrefs = null;
						
						if(agileUser!=null)
							userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
						if(userPrefs!=null)
							cateJson.put("userPic",userPrefs.pic);
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
						
						AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);
						
						UserPrefs userPrefs = null;
						
						if(agileUser!=null)
							userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
						if(userPrefs!=null)
							cateJson.put("userPic",userPrefs.pic);
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
									" FROM stats.campaign_logs USE INDEX(domain_logtype_logtime_index) "+
									"WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain) +" AND log_type in ('EMAIL_SENT','EMAIL_OPENED','EMAIL_CLICKED','UNSUBSCRIBED')"+
									" AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " +
										 "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type ";
			else
				 query = "SELECT log_type,count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
									"FROM stats.campaign_logs USE INDEX(campid_domain_logtype_logtime_subid_index) "+
									"WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignType)+" AND log_type in ('EMAIL_SENT','EMAIL_OPENED','EMAIL_CLICKED','UNSUBSCRIBED')"+
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
				DomainUser owner=contact.getOwner();
				json.put("Owner_name",owner.name);
				json.put("Owner_pic",owner.getOwnerPic());
				json.put("Owner_url", owner.getCalendarURL());
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
	
	public static List<Activity> getPortletActivitydata(int max,String cursor) {
		System.out.println("Inside list");
		List<Activity> list=ActivityUtil.getActivities(max, cursor);
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
	public static JSONObject getGoalsAttainedData(Long owner_id,Long minTime,Long maxTime)
	{
		int count=0;
		Long count_goal=0L;
		Double value=0.0;
		Double amount_goal=0.0;
		JSONObject json=new JSONObject();;
		List<Opportunity> opportunities=OpportunityUtil.getWonDealsListWithOwner(minTime, maxTime, owner_id);
		if(opportunities!=null){
			for(Opportunity opp:opportunities){
			value = value+opp.expected_value;
			count++;
		}
		}
		json.put("dealcount", count);
		json.put("dealAmount", value);
		List<Goals> goals=GoalsUtil.getAllGoalsForUser(owner_id, minTime, maxTime);
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
		return json;
	}

}
