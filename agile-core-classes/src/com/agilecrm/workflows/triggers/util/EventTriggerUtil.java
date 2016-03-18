package com.agilecrm.workflows.triggers.util;

import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Event;
import com.agilecrm.contact.Contact;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;

public class EventTriggerUtil
{

    public static void executeTriggerForNewEvent(Event event)
    {
	List<Contact> contactsList = event.relatedContacts();

	// if event has no related contacts
	if (contactsList == null || contactsList.size() == 0)
	    return;

	// Gets triggers based on Event Added
	List<Trigger> triggersList = TriggerUtil.getTriggersByCondition(Trigger.Type.EVENT_IS_ADDED);

	try
	{
	    for (Trigger trigger : triggersList)
	    {
		executeEventTrigger(trigger, event, contactsList);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * @param event
     * @param contactsList
     * @param eventOwnerId
     * @param trigger
     * @throws JSONException
     */
    private static void executeEventTrigger(Trigger trigger, Event event, List<Contact> contactsList)

    {
	try
	{
	    if (trigger == null || trigger.event_owner_id == null)
		return;

	    DomainUser eventOwner = event.eventOwner();

	    String eventOwnerId = eventOwner == null ? null : eventOwner.id.toString();

	    System.out.println("Event type is " + event.type + " trigger event type " + trigger.event_type);

	    if (trigger.event_type.equals("WEB_APPOINTMENT"))
	    {
		// Return if not WebAppointment
		if (!event.type.toString().equals(trigger.event_type))
		    return;
	    }

	    if (trigger.event_owner_id.equals("ANY") || trigger.event_owner_id.equals(eventOwnerId))
	    {
		WorkflowSubscribeUtil.subscribeDeferred(contactsList, trigger.campaign_id,
		        new JSONObject().put("event", getEventJSONForTrigger(event)));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    private static JSONObject getEventJSONForTrigger(Event event)
    {
	try
	{
	    JSONObject eventJSON = TriggerUtil.getJSONObject(event);

	    // If null
	    if (eventJSON == null)
		return null;

	    eventJSON.remove("contacts");
	    eventJSON.remove("related_contacts");
	    eventJSON.remove("cursor");
	    eventJSON.remove("count");
	    eventJSON.remove("id");
	    eventJSON.remove("created_time");

	    JSONObject owner = null;

	    if (eventJSON.has("owner"))
		owner = eventJSON.getJSONObject("owner");

	    if (owner != null)
	    {
		JSONObject updatedOwner = new JSONObject();
		updatedOwner.put("id", owner.getString("id"));
		updatedOwner.put("name", owner.getString("name"));
		updatedOwner.put("email", owner.getString("email"));

		eventJSON.put("owner", updatedOwner);
	    }

	    return eventJSON;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

    }
}
