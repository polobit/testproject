package com.agilecrm.workflows.triggers.util;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.Trigger.Type;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;

/**
 * <code>TicketTriggerUtil</code> executes trigger for Tickets the conditions
 * ticket created, Note added, And ticket closed. When these actions performed
 * fetch and fires the matched trigger
 * 
 * @author Vaishnavi
 * 
 */
public class TicketTriggerUtil
{

	/**
	 * Executes trigger when new ticket is added
	 * 
	 * @param ticket
	 */
	public static void executeTriggerForNewTicket(Tickets ticket)
	{
		// Executes trigger when deal is created.
		if (ticket == null)
			return;

		executeTriggerForTicketBasedOnCondition(ticket.getContact(), ticket, Trigger.Type.NEW_TICKET_IS_ADDED);
	}

	/**
	 * Executes trigger when ticket is closed
	 * 
	 * @param ticket
	 *            ticket
	 */
	public static void executeTriggerForClosedTicket(Tickets ticket)
	{
		// if null
		if (ticket == null)
			return;

		executeTriggerForTicketBasedOnCondition(ticket.getContact(), ticket, Trigger.Type.TICKET_IS_CLOSED);

	}

	/**
	 * Executes when note added by user or customer
	 * 
	 * @param ticket
	 * @param noteAddedBy
	 */
	public static void executeTriggerForNewNote(Tickets ticket, Type condition)
	{
		// if null
		if (ticket == null)
			return;

		executeTriggerForTicketBasedOnCondition(ticket.getContact(), ticket, condition);

	}

	/**
	 * Executes trigger when tickets is created, updated or closed based on the
	 * action trigger called.
	 * 
	 * @param contact
	 * @param ticket
	 * @param condition
	 */
	public static void executeTriggerForTicketBasedOnCondition(Contact contact, Tickets ticket, Type condition)
	{

		// if ticket has no related contacts
		if (contact == null)
			return;

		// Gets triggers with Ticket condition.
		List<Trigger> triggersList = new ArrayList();

		triggersList = TriggerUtil.getTriggersByCondition(condition);

		// If no triggers
		if (triggersList.isEmpty())
			return;

		// Trigger campaign
		triggerCampaign(contact, triggersList, ticket);
	}

	/**
	 * Trigger the campaign
	 * 
	 * @param contact
	 * @param triggersList
	 * @param ticket
	 */
	public static void triggerCampaign(Contact contact, List<Trigger> triggersList, Tickets ticket)
	{
		if (contact == null || triggersList.isEmpty() || ticket == null)
			return;

		try
		{
			// Run campaign
			for (Trigger trigger : triggersList)
			{
				WorkflowSubscribeUtil.subscribeDeferred(contact, trigger.campaign_id,
						new JSONObject().put("ticket", ticket));
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

}