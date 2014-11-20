package com.agilecrm.portlets.util;

import java.util.ArrayList;
import java.util.Calendar;
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
		allPortlets.add(new Portlet("Emails Sent",PortletType.CONTACTS));
		allPortlets.add(new Portlet("Growth Graph",PortletType.CONTACTS));
		allPortlets.add(new Portlet("Calls Per Person",PortletType.CONTACTS));
		allPortlets.add(new Portlet("Pending Deals",PortletType.DEALS));
		allPortlets.add(new Portlet("Deals By Milestone",PortletType.DEALS));
		allPortlets.add(new Portlet("Closures Per Person",PortletType.DEALS));
		allPortlets.add(new Portlet("Deals Won",PortletType.DEALS));
		allPortlets.add(new Portlet("Deals Funnel",PortletType.DEALS));
		allPortlets.add(new Portlet("Deals Assigned",PortletType.DEALS));
		allPortlets.add(new Portlet("Agenda",PortletType.TASKSANDEVENTS));
		allPortlets.add(new Portlet("Today Tasks",PortletType.TASKSANDEVENTS));
		
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

		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);

		/*
		 * Fetches list of portlets related to AgileUser key
		 */
		List<Portlet> portlets = ofy.query(Portlet.class).ancestor(userKey).order("row_position").list();
		for(Portlet portlet : portlets){
			if(portlet.prefs!=null){
				JSONObject json=(JSONObject)JSONSerializer.toJSON(portlet.prefs);
				portlet.settings=json;
			}
			//setPortletContent(portlet);
		}
		
		return portlets;
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
	/**
	 * Sets contacts list {@link List} of {@link Contact}, deals list
	 * {@link List} of {@link Opportunity} etc... for a portlet based on its
	 * {@link String} of {@link portlet_type}
	 * 
	 * @param name
	 *            {@link String}. Name of the portlet
	 * @param agileUserId
	 *            {@link Long} agile user id
	 * @return {@link Portlet}
	 */
	public static Portlet setPortletContent(Portlet portlet)throws Exception{
		JSONObject json=null;
		if(portlet.prefs!=null){
			System.out.println("Portlet settings not null");
			json=(JSONObject)JSONSerializer.toJSON(portlet.prefs);
			portlet.settings=json;
		}
		if(portlet.portlet_type==PortletType.CONTACTS && portlet.name.equalsIgnoreCase("Filter Based")){
			if(json!=null && json.get("filter")!=null){
				if(json.get("filter").toString().equalsIgnoreCase("contacts"))
					portlet.contactsList=ContactUtil.getAllContacts(10000000,null);
				else if(json.get("filter").toString().equalsIgnoreCase("companies"))
					portlet.contactsList=ContactUtil.getAllCompanies(10000000, null);
				else if(json.get("filter").toString().equalsIgnoreCase("recent"))
					portlet.contactsList=ContactFilterUtil.getContacts("system-RECENT", 10000000, null);
				else if(json.get("filter").toString().equalsIgnoreCase("myContacts"))
					portlet.contactsList=ContactFilterUtil.getContacts("system-CONTACTS", 10000000, null);
				else if(json.get("filter").toString().equalsIgnoreCase("leads"))
					portlet.contactsList=ContactFilterUtil.getContacts("system-LEADS", 10000000, null);
			}
		}else if(portlet.portlet_type==PortletType.CONTACTS && portlet.name.equalsIgnoreCase("Emails Opened")){
			long minTime=0L;
			long maxTime=0L;
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
				portlet.contactsList=ContactUtil.getEmailsOpened(minTime,maxTime);
			}
		}else if(portlet.portlet_type==PortletType.CONTACTS && portlet.name.equalsIgnoreCase("Emails Sent")){
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
				for(DomainUser domainUser : domainUsersList){
					List<ContactEmail> emailsList=ContactEmailUtil.getEmailsSent(domainUser,minTime,maxTime);
					if(emailsList!=null)
						mailsCountList.add(emailsList.size());
					else
						mailsCountList.add(0);
				}
				portlet.mailsCountList=mailsCountList;
				portlet.domainUsersList=domainUsersList;
			}
		}else if(portlet.portlet_type==PortletType.CONTACTS && portlet.name.equalsIgnoreCase("Growth Graph")){
			String growthGraphString=null;
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
				portlet.growthGraphJson=(JSONObject)JSONSerializer.toJSON(growthGraphString);
		}else if(portlet.portlet_type==PortletType.DEALS && portlet.name.equalsIgnoreCase("Pending Deals")){
			if(json!=null && json.get("deals")!=null && json.get("due-date")!=null){
				if(json.get("deals").toString().equalsIgnoreCase("all-deals"))
					portlet.dealsList=OpportunityUtil.getPendingDealsRelatedToAllUsers(json.getLong("due-date"));
				else if(json.get("deals").toString().equalsIgnoreCase("my-deals"))
					portlet.dealsList=OpportunityUtil.getPendingDealsRelatedToCurrentUser(json.getLong("due-date"));
			}
		}else if(portlet.portlet_type==PortletType.DEALS && (portlet.name.equalsIgnoreCase("Deals By Milestone") || portlet.name.equalsIgnoreCase("Deals Funnel"))){
			if(json!=null){
				if(json.get("deals")!=null && (json.get("deals").toString().equalsIgnoreCase("all-deals") || json.get("deals").toString().equalsIgnoreCase("my-deals")) && json.get("track")!=null && json.get("due-date")!=null){
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
								map = OpportunityUtil.getTotalMilestoneValueAndNumber(milestones[i],false,json.getLong("due-date"),null);
							else if(json.get("deals").toString().equalsIgnoreCase("my-deals"))
								map = OpportunityUtil.getTotalMilestoneValueAndNumber(milestones[i],true,json.getLong("due-date"),null);
							for(Map.Entry<Double, Integer> entry : map.entrySet()){
								milestoneValuesList.add(entry.getKey());
								milestoneNumbersList.add(entry.getValue());
							}
						}
					}
					portlet.milestonesList=milestonesList;
					portlet.milestoneValuesList=milestoneValuesList;
					portlet.milestoneNumbersList=milestoneNumbersList;
				}
			}
			portlet.milestoneList=MilestoneUtil.getMilestonesList();
		}else if(portlet.portlet_type==PortletType.DEALS && portlet.name.equalsIgnoreCase("Deals Won")){
			long minTime=0L;
			long maxTime=0L;
			if(json!=null && json.get("duration")!=null){
				if(json.get("duration").toString().equalsIgnoreCase("1-week")){
					DateUtil startDateUtil = new DateUtil();
		    		minTime = startDateUtil.removeDays(7).toMidnight().getTime().getTime() / 1000;
		    		
		    		DateUtil endDateUtil = new DateUtil();
		    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
		    		portlet.dealsList=OpportunityUtil.getOpportunitiesWon(minTime,maxTime);
				}else if(json.get("duration").toString().equalsIgnoreCase("1-month")){
					DateUtil startDateUtil = new DateUtil();
		    		minTime = startDateUtil.removeDays(30).toMidnight().getTime().getTime() / 1000;
		    		
		    		DateUtil endDateUtil = new DateUtil();
		    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
		    		portlet.dealsList=OpportunityUtil.getOpportunitiesWon(minTime,maxTime);
				}else if(json.get("duration").toString().equalsIgnoreCase("3-months")){
					DateUtil startDateUtil = new DateUtil();
		    		minTime = startDateUtil.removeDays(90).toMidnight().getTime().getTime() / 1000;
		    		
		    		DateUtil endDateUtil = new DateUtil();
		    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
		    		portlet.dealsList=OpportunityUtil.getOpportunitiesWon(minTime,maxTime);
				}else if(json.get("duration").toString().equalsIgnoreCase("6-months")){
					DateUtil startDateUtil = new DateUtil();
		    		minTime = startDateUtil.removeDays(180).toMidnight().getTime().getTime() / 1000;
		    		
		    		DateUtil endDateUtil = new DateUtil();
		    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
		    		portlet.dealsList=OpportunityUtil.getOpportunitiesWon(minTime,maxTime);
				}else if(json.get("duration").toString().equalsIgnoreCase("12-months")){
					DateUtil startDateUtil = new DateUtil();
		    		minTime = startDateUtil.removeDays(365).toMidnight().getTime().getTime() / 1000;
		    		
		    		DateUtil endDateUtil = new DateUtil();
		    		maxTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)-1;
		    		portlet.dealsList=OpportunityUtil.getOpportunitiesWon(minTime,maxTime);
				}
			}
		}else if(portlet.portlet_type==PortletType.DEALS && portlet.name.equalsIgnoreCase("Closures Per Person")){
			List<Integer> milestoneNumbersList=new ArrayList<Integer>();
			List<Double> milestoneValuesList=new ArrayList<Double>();
			List<DomainUser> domainUsersList=null;
			DomainUser dUser=DomainUserUtil.getCurrentDomainUser();
			if(dUser!=null)
				domainUsersList=DomainUserUtil.getUsers(dUser.domain);
			if(json!=null && json.get("due-date")!=null){
				for(DomainUser domainUser : domainUsersList){
					Map<Double,Integer> map = OpportunityUtil.getTotalMilestoneValueAndNumber("Won",true,json.getLong("due-date"),domainUser.id);
					for(Map.Entry<Double, Integer> entry : map.entrySet()){
						milestoneValuesList.add(entry.getKey());
						milestoneNumbersList.add(entry.getValue());
					}
				}
			}
			portlet.milestoneNumbersList=milestoneNumbersList;
			portlet.milestoneValuesList=milestoneValuesList;
			portlet.domainUsersList=domainUsersList;
		}else if(portlet.portlet_type==PortletType.TASKSANDEVENTS && portlet.name.equalsIgnoreCase("Agenda")){
			portlet.eventsList=EventUtil.getTodayPendingEvents();
		}else if(portlet.portlet_type==PortletType.TASKSANDEVENTS && portlet.name.equalsIgnoreCase("Today Tasks")){
			portlet.tasksList=TaskUtil.getTodayPendingTasks();
		}
		return portlet;
	}
	public static List<Contact> getContactsList(JSONObject json)throws Exception{
		List<Contact> contactsList=null;
		if(json!=null && json.get("filter")!=null){
			if(json.get("filter").toString().equalsIgnoreCase("contacts"))
				contactsList=ContactUtil.getAllContacts(10000000,null);
			else if(json.get("filter").toString().equalsIgnoreCase("companies"))
				contactsList=ContactUtil.getAllCompanies(10000000, null);
			else if(json.get("filter").toString().equalsIgnoreCase("recent"))
				contactsList=ContactFilterUtil.getContacts("system-RECENT", 10000000, null);
			else if(json.get("filter").toString().equalsIgnoreCase("myContacts"))
				contactsList=ContactFilterUtil.getContacts("system-CONTACTS", 10000000, null);
			else if(json.get("filter").toString().equalsIgnoreCase("leads"))
				contactsList=ContactFilterUtil.getContacts("system-LEADS", 10000000, null);
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
		if(json!=null && json.get("deals")!=null && json.get("due-date")!=null){
			if(json.get("deals").toString().equalsIgnoreCase("all-deals"))
				dealsList=OpportunityUtil.getPendingDealsRelatedToAllUsers(json.getLong("due-date"));
			else if(json.get("deals").toString().equalsIgnoreCase("my-deals"))
				dealsList=OpportunityUtil.getPendingDealsRelatedToCurrentUser(json.getLong("due-date"));
		}
		return dealsList;
	}
	public static List<Opportunity> getDealsWonList(JSONObject json)throws Exception{
		long minTime=0L;
		long maxTime=0L;
		List<Opportunity> dealsList=null;
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

    		dealsList=OpportunityUtil.getOpportunitiesWon(minTime,maxTime);
		}
		return dealsList;
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
			if(json.get("deals")!=null && (json.get("deals").toString().equalsIgnoreCase("all-deals") || json.get("deals").toString().equalsIgnoreCase("my-deals")) && json.get("track")!=null && json.get("due-date")!=null){
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
							map = OpportunityUtil.getTotalMilestoneValueAndNumber(milestones[i],false,json.getLong("due-date"),null);
						else if(json.get("deals").toString().equalsIgnoreCase("my-deals"))
							map = OpportunityUtil.getTotalMilestoneValueAndNumber(milestones[i],true,json.getLong("due-date"),null);
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
		if(json!=null && json.get("due-date")!=null){
			for(DomainUser domainUser : domainUsersList){
				Map<Double,Integer> map = OpportunityUtil.getTotalMilestoneValueAndNumber("Won",true,json.getLong("due-date"),domainUser.id);
				for(Map.Entry<Double, Integer> entry : map.entrySet()){
					milestoneValuesList.add(entry.getKey());
					milestoneNumbersList.add(entry.getValue());
				}
				domainUserNamesList.add(domainUser.name);
			}
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
			for(DomainUser domainUser : domainUsersList){
				List<ContactEmail> emailsList=ContactEmailUtil.getEmailsSent(domainUser,minTime,maxTime);
				if(emailsList!=null)
					mailsCountList.add(emailsList.size());
				else
					mailsCountList.add(0);
				domainUserNamesList.add(domainUser.name);
			}
			
			emailsSentJSON.put("domainUsersList",domainUserNamesList);
			emailsSentJSON.put("mailsCountList",mailsCountList);
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

}
