package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.cases.Case;
import com.agilecrm.cases.util.CaseUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;

/**
 * <ContactFullDetails> loads deals, tasks, notes and cases of a particular
 * contact. It should be initiated with contact id for which related entites
 * should be returned. Designed to use for timeline in contact details page
 * 
 * @author yaswanth
 * 
 */
@XmlRootElement
public class ContactFullDetails
{
	// Takes contact id
	Long contact_id;

	public ContactFullDetails()
	{

	}

	/**
	 * Takes contact id based on which all related entities are fetched
	 * 
	 * @param id
	 */
	public ContactFullDetails(Long id)
	{
		contact_id = id;
	}

	/**
	 * Fetches notes related to contact
	 * 
	 * @return
	 */
	@XmlElement
	public List<Note> getNotes()
	{
		try
		{
			return NoteUtil.getNotes(contact_id);
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new ArrayList<Note>();
		}
	}

	/**
	 * Fetches deals
	 * 
	 * @return
	 */
	@XmlElement
	public List<Opportunity> getDeals()
	{
		return OpportunityUtil.getDeals(contact_id, null, null);
	}

	/**
	 * Fetches taks
	 * 
	 * @return
	 */
	@XmlElement
	public List<Task> getTasks()
	{
		try
		{
			return TaskUtil.getContactTasks(contact_id);
		}
		catch (Exception e)
		{ // TODO Auto-generated catch block
			e.printStackTrace();
			return new ArrayList<Task>();
		}
	}

	/**
	 * fetches contact_owner_change activity and call activity from Activity
	 * Table
	 * 
	 * @return
	 */
	@XmlElement
	public List<Activity> getCalls()
	{
		try
		{
			List<Activity> ownerchange = ActivityUtil.getActivitiesByFilter(null, EntityType.CONTACT.toString(),
					"CONTACT_OWNER_CHANGE", contact_id, null, null);
			List<Activity> call = ActivityUtil.getActivitiesByFilter(null, EntityType.CONTACT.toString(), "CALL",
					contact_id, null, null);
			List<Activity> list = new ArrayList<Activity>();
			list.addAll(ownerchange);
			list.addAll(call);
			return list;
		}
		catch (Exception e)
		{ // TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}

	@XmlElement
	public List<Case> getCases()
	{
		return CaseUtil.getCases(contact_id, null, null);
	}

	/**
	 * Fetches events
	 * 
	 * @return
	 */
	@XmlElement
	public List<Event> getEvents()
	{
		try
		{
			return EventUtil.getContactEventsBeforeToday(contact_id);
		}
		catch (Exception e)
		{ // TODO Auto-generated catch block
			e.printStackTrace();
			return new ArrayList<Event>();
		}
	}

}