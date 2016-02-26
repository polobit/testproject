package com.agilecrm.workflows.triggers.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONException;
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

	public static void executeTriggerForNewNoteAddedByUser(Tickets ticket)
	{
		// if null
		if (ticket == null)
			return;

		executeTriggerForTicketBasedOnCondition(ticket.getContact(), ticket, Trigger.Type.TICKET_NOTE_ADDED_BY_USER);

	}

	/**
	 * Executes when note added by user or customer
	 * 
	 * @param ticket
	 * @param noteAddedBy
	 */
	public static void executeTriggerForNewNoteAddedByCustomer(Tickets ticket)
	{
		// if null
		if (ticket == null)
			return;

		executeTriggerForTicketBasedOnCondition(ticket.getContact(), ticket, Trigger.Type.TICKET_NOTE_ADDED_BY_CUSTOMER);

	}

	/**
	 * Executes SLA is reached
	 * 
	 * @param ticket
	 * @param noteAddedBy
	 */
	public static void executeTriggerForSLAReachedTicket(Tickets ticket)
	{
		// if null
		if (ticket == null)
			return;

		executeTriggerForTicketBasedOnCondition(ticket.getContact(), ticket, Trigger.Type.TICKET_SLA_REACHED);

	}

	/**
	 * Executes when assignee changed
	 * 
	 * @param ticket
	 * @param noteAddedBy
	 */
	public static void executeTriggerForAssigneeChanged(Tickets ticket)
	{
		// if null
		if (ticket == null)
			return;

		executeTriggerForTicketBasedOnCondition(ticket.getContact(), ticket, Trigger.Type.TICKET_ASSIGNEE_CHANGED);

	}

	/**
	 * Executes when label added
	 * 
	 * @param ticket
	 * @param noteAddedBy
	 */
	public static void executeTriggerForLabelAddedToTicket(Tickets ticket)
	{
		// if null
		if (ticket == null)
			return;

		executeTriggerForTicketBasedOnCondition(ticket.getContact(), ticket, Trigger.Type.TICKET_LABEL_IS_ADDED);

	}

	/**
	 * Executes when label added
	 * 
	 * @param ticket
	 * @param noteAddedBy
	 */
	public static void executeTriggerForLabelDeletedToTicket(Tickets ticket)
	{
		// if null
		if (ticket == null)
			return;

		executeTriggerForTicketBasedOnCondition(ticket.getContact(), ticket, Trigger.Type.TICKET_LABEL_IS_DELETED);

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
		List<Trigger> triggersList = new ArrayList<Trigger>();

		triggersList = TriggerUtil.getTriggersByCondition(condition);
		
		System.out.println("triggersList: " + triggersList);
		
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
				executeCampaign(contact, trigger.campaign_id, ticket);
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	/**
	 * Execute campaign for ticket
	 * 
	 * @param contact
	 * @param campaignId
	 * @param ticket
	 */
	public static void executeCampaign(Contact contact, Long campaignId, Tickets ticket)
	{

		try
		{
			// Run campaign
			WorkflowSubscribeUtil.subscribeDeferred(contact, campaignId,
					new JSONObject().put("ticket", new JSONObject(ticket.toString())));
		}
		catch (JSONException e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

}