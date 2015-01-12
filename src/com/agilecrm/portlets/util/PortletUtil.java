package com.agilecrm.portlets.util;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.portlets.Portlet;
import com.agilecrm.portlets.Portlet.PortletType;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.search.util.TagSearchUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

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
		
		allPortlets.add(new Portlet("Filter Based",PortletType.CONTACTS));
		allPortlets.add(new Portlet("Emails Opened",PortletType.CONTACTS));
		allPortlets.add(new Portlet("Growth Graph",PortletType.CONTACTS));
		
		allPortlets.add(new Portlet("Pending Deals",PortletType.DEALS));
		allPortlets.add(new Portlet("Deals By Milestone",PortletType.DEALS));
		allPortlets.add(new Portlet("Closures Per Person",PortletType.DEALS));
		allPortlets.add(new Portlet("Deals Won",PortletType.DEALS));
		allPortlets.add(new Portlet("Deals Funnel",PortletType.DEALS));
		//allPortlets.add(new Portlet("Deals Assigned",PortletType.DEALS));
		
		allPortlets.add(new Portlet("Agenda",PortletType.TASKSANDEVENTS));
		allPortlets.add(new Portlet("Today Tasks",PortletType.TASKSANDEVENTS));
		
		allPortlets.add(new Portlet("Emails Sent",PortletType.USERACTIVITY));
		allPortlets.add(new Portlet("Calls Per Person",PortletType.USERACTIVITY));
		
		allPortlets.add(new Portlet("Agile CRM Blog",PortletType.RSS));
		
		setIsAddedStatus(allPortlets);

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
				portlet.settings=json;
			}
			if(!portlet.name.equalsIgnoreCase("Dummy Blog"))
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
	public static List<Contact> getEmailsOpenedList(JSONObject json)throws Exception{
		long minTime=0L;
		long maxTime=0L;
		List<Contact> contactsList=null;
		if(json!=null && json.get("duration")!=null){
			if(json.get("duration").toString().equalsIgnoreCase("2-days")){
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
			}
			contactsList=ContactUtil.getEmailsOpened(minTime,maxTime);
		}
		return contactsList;
	}
	public static List<Opportunity> getPendingDealsList(JSONObject json)throws Exception{
		List<Opportunity> dealsList=null;
		if(json!=null && json.get("deals")!=null){
			if(json.get("deals").toString().equalsIgnoreCase("all-deals"))
				dealsList=OpportunityUtil.getPendingDealsRelatedToAllUsers(0);
			else if(json.get("deals").toString().equalsIgnoreCase("my-deals"))
				dealsList=OpportunityUtil.getPendingDealsRelatedToCurrentUser(0);
		}
		return dealsList;
	}
	public static List<Opportunity> getDealsWonList(JSONObject json)throws Exception{
		long minTime=0L;
		long maxTime=0L;
		List<Opportunity> finalDealsList = new ArrayList<Opportunity>();
		if(json!=null && json.get("duration")!=null){
			if(json.get("duration").toString().equalsIgnoreCase("1-week")){
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
			}

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
	public static List<Event> getAgendaList()throws Exception{
		return EventUtil.getTodayPendingEvents();
	}
	public static List<Task> getTodayTasksList()throws Exception{
		return TaskUtil.getTodayPendingTasks();
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
						milestonesList.add(milestones[i]);
						Map<Double,Integer> map=null;
						if(json.get("deals").toString().equalsIgnoreCase("all-deals"))
							map = OpportunityUtil.getTotalMilestoneValueAndNumber(milestones[i],false,0,null,milestone.id);
						else if(json.get("deals").toString().equalsIgnoreCase("my-deals"))
							map = OpportunityUtil.getTotalMilestoneValueAndNumber(milestones[i],true,0,null,milestone.id);
						for(Map.Entry<Double, Integer> entry : map.entrySet()){
							milestoneValuesList.add(entry.getKey());
							milestoneNumbersList.add(entry.getValue());
						}
					}
				}
				dealsByMilestoneJSON.put("milestonesList",milestonesList);
				dealsByMilestoneJSON.put("milestoneValuesList",milestoneValuesList);
				dealsByMilestoneJSON.put("milestoneNumbersList",milestoneNumbersList);
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
			if(json.get("duration").toString().equalsIgnoreCase("1-day")){
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
			}
			List<Integer> mailsCountList=new ArrayList<Integer>();
			List<DomainUser> domainUsersList=DomainUserUtil.getAllUsers();
			List<String> domainUserNamesList=new ArrayList<String>();
			List<Integer> mailsOpenedCountList=new ArrayList<Integer>();
			for(DomainUser domainUser : domainUsersList){
				List<ContactEmail> emailsList=ContactEmailUtil.getEmailsSent(domainUser,minTime,maxTime);
				List<ContactEmail> emailsOpenedList=ContactEmailUtil.getEmailsOpenedByUser(domainUser,minTime,maxTime);
				if(emailsList!=null)
					mailsCountList.add(emailsList.size());
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
		if(json!=null && json.get("tags")!=null && json.get("frequency")!=null && json.get("start-date")!=null && json.get("end-date")!=null){
			String[] tags = json.getString("tags").split(",");
			int type = Calendar.DAY_OF_MONTH;

			if (StringUtils.equalsIgnoreCase(json.getString("frequency"), "monthly"))
			    type = Calendar.MONTH;
			if (StringUtils.equalsIgnoreCase(json.getString("frequency"), "weekly"))
			    type = Calendar.WEEK_OF_YEAR;
			
			ReportsUtil.check(Long.parseLong(json.getString("start-date")), Long.parseLong(json.getString("end-date")));
			
			growthGraphString=TagSearchUtil.getTagCount(null, tags, json.getString("start-date"), json.getString("end-date"), type).toString();
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
			if(json.get("duration").toString().equalsIgnoreCase("1-day")){
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
			}
			List<DomainUser> domainUsersList=DomainUserUtil.getAllUsers();
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
		if(json!=null && json.get("duration")!=null){
			if(json.get("duration").toString().equalsIgnoreCase("1-day")){
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
			}
		}
		List<DomainUser> domainUsersList=DomainUserUtil.getAllUsers();
		List<String> domainUserNamesList=new ArrayList<String>();
		
		List<Integer> incomingCompletedCallsCountList=new ArrayList<Integer>();
		List<Integer> incomingFailedCallsCountList=new ArrayList<Integer>();
		
		List<Long> incomingCompletedCallsDurationList=new ArrayList<Long>();
		
		List<Integer> outgoingCompletedCallsCountList=new ArrayList<Integer>();
		List<Integer> outgoingFailedCallsCountList=new ArrayList<Integer>();
		
		List<Long> outgoingCompletedCallsDurationList=new ArrayList<Long>();
		
		List<Integer> completedCallsCountList=new ArrayList<Integer>();
		List<Integer> failedCallsCountList=new ArrayList<Integer>();
		
		List<Long> completedCallsDurationList=new ArrayList<Long>();
		
		for(DomainUser domainUser : domainUsersList){
			int incomingCompletedCallsCount=0;
			int incomingFailedCallsCount=0;
			
			long incomingCompletedCallsDuration=0;
			
			int outgoingCompletedCallsCount=0;
			int outgoingFailedCallsCount=0;
			
			long outgoingCompletedCallsDuration=0;
			
			List<Activity> callActivitiesList = ActivityUtil.getActivitiesByActivityType("CALL",domainUser.id,minTime,maxTime);
			for(Activity activity : callActivitiesList){
				if(activity.custom2!=null && activity.custom2.equalsIgnoreCase("incoming")){
					if(activity.custom3!=null && activity.custom3.equalsIgnoreCase("completed")){
						incomingCompletedCallsCount++;
						if(activity.custom4!=null)
							incomingCompletedCallsDuration += Long.valueOf(activity.custom4);
					}else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase("failed")){
						incomingFailedCallsCount++;
					}
				}else if(activity.custom2!=null && activity.custom2.equalsIgnoreCase("outgoing")){
					if(activity.custom3!=null && activity.custom3.equalsIgnoreCase("completed")){
						outgoingCompletedCallsCount++;
						if(activity.custom4!=null)
							outgoingCompletedCallsDuration += Long.valueOf(activity.custom4);
					}else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase("failed")){
						outgoingFailedCallsCount++;
					}
				}
			}
			incomingCompletedCallsCountList.add(incomingCompletedCallsCount);
			incomingFailedCallsCountList.add(incomingFailedCallsCount);
			
			incomingCompletedCallsDurationList.add(incomingCompletedCallsDuration);
			
			outgoingCompletedCallsCountList.add(outgoingCompletedCallsCount);
			outgoingFailedCallsCountList.add(outgoingFailedCallsCount);
			
			outgoingCompletedCallsDurationList.add(outgoingCompletedCallsDuration);
			
			completedCallsCountList.add(incomingCompletedCallsCount+outgoingCompletedCallsCount);
			failedCallsCountList.add(incomingFailedCallsCount+outgoingFailedCallsCount);
			
			completedCallsDurationList.add(incomingCompletedCallsDuration+outgoingCompletedCallsDuration);
			
			domainUserNamesList.add(domainUser.name);
		}
		callsPerPersonJSON.put("incomingCompletedCallsCountList",incomingCompletedCallsCountList);
		callsPerPersonJSON.put("incomingFailedCallsCountList",incomingFailedCallsCountList);
		callsPerPersonJSON.put("incomingCompletedCallsDurationList",incomingCompletedCallsDurationList);
		callsPerPersonJSON.put("outgoingCompletedCallsCountList",outgoingCompletedCallsCountList);
		callsPerPersonJSON.put("outgoingFailedCallsCountList",outgoingFailedCallsCountList);
		callsPerPersonJSON.put("outgoingCompletedCallsDurationList",outgoingCompletedCallsDurationList);
		callsPerPersonJSON.put("completedCallsCountList",completedCallsCountList);
		callsPerPersonJSON.put("failedCallsCountList",failedCallsCountList);
		callsPerPersonJSON.put("completedCallsDurationList",completedCallsDurationList);
		callsPerPersonJSON.put("domainUsersList",domainUserNamesList);
		
		return callsPerPersonJSON;	
	}
	public static void addDefaultPortlets(){
		try {
			//Added dummy portlet for recognizing whether Agile CRM Blog 
			//portlet is deleted by user or not
			Portlet dummyPortlet = new Portlet("Dummy Blog",PortletType.RSS,1,1,1,1);
			Portlet eventsPortlet = new Portlet("Agenda",PortletType.TASKSANDEVENTS,1,1,1,1);
			Portlet tasksPortlet = new Portlet("Today Tasks",PortletType.TASKSANDEVENTS,2,1,1,1);
			Portlet blogPortlet = new Portlet("Agile CRM Blog",PortletType.RSS,3,1,1,2);
			Portlet filterBasedContactsPortlet = new Portlet("Filter Based",PortletType.CONTACTS,1,2,2,1);
			Portlet pendingDealsPortlet = new Portlet("Pending Deals",PortletType.DEALS,1,3,2,1);
			Portlet dealsFunnelPortlet = new Portlet("Deals Funnel",PortletType.DEALS,3,3,1,1);
			
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
			
			dummyPortlet.save();
			eventsPortlet.save();
			tasksPortlet.save();
			blogPortlet.save();
			filterBasedContactsPortlet.save();
			pendingDealsPortlet.save();
			dealsFunnelPortlet.save();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
