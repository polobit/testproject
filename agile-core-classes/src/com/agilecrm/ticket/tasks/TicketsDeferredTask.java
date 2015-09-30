package com.agilecrm.ticket.tasks;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.Source;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.campaignio.urlshortener.util.Base62;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>TicketsDeferredTask</code>
 * 
 * @author Sasi on 28-Sep-2015
 * @see <a href="https://mandrill.zendesk.com/hc/en-us/articles/205583197-Inbound-Email-Processing-Overview#inbound-events-format">Mandrill
 *      Inbound data format</a>
 * 
 */
public class TicketsDeferredTask implements DeferredTask
{
	String mandrillResponse = "";

	public TicketsDeferredTask(String mandrillResponse)
	{
		this.mandrillResponse = mandrillResponse;
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public void run()
	{
		try
		{
			JSONObject mandrillInboundJSON = new JSONArray(mandrillResponse).getJSONObject(0);

			if (mandrillInboundJSON == null || !mandrillInboundJSON.has("msg"))
				return;

			JSONObject msgJSON = mandrillInboundJSON.getJSONObject("msg");

			if (!msgJSON.has("headers"))
				return;

			JSONArray recipientsArray = msgJSON.getJSONArray("to");

			if (recipientsArray == null || recipientsArray.length() == 0)
				return;

			String toAddress = "";
			for (int i = 0; i < recipientsArray.length(); i++)
			{
				toAddress = recipientsArray.getJSONArray(i).getString(0);

				if (toAddress.endsWith("helptor"))
					break;
			}

			System.out.println("toAddress: " + toAddress);

			String[] toAddressArray = toAddress.replace("@helptor.com", "").split("\\+");

			if (toAddressArray.length != 2)
				return;

			String namespace = toAddressArray[0];
			Long groupID = Base62.fromOtherBaseToDecimal(62, toAddressArray[1]);

			System.out.println("DomainName: " + namespace);
			System.out.println("GroupID: " + groupID);

			if (DomainUserUtil.count(namespace) <= 0)
			{
				System.out.println("Invalid domain: " + namespace);
				return;
			}

			String oldNamespace = NamespaceManager.get();
			
			// Setting namespace
			NamespaceManager.set(oldNamespace);

			TicketGroups ticketGroup = TicketGroupUtil.getTicketGroupById(groupID);
			if (ticketGroup == null)
			{
				System.out.println("Invalid groupID: " + groupID);
				return;
			}

			JSONObject mimeHeaders = msgJSON.getJSONObject("headers");

			boolean isNewTicket = true;

			if (mimeHeaders.has("In-Reply-To"))
			{
				String inReplyTo = mimeHeaders.getString("In-Reply-To");

				if (inReplyTo.endsWith("@helptor.com"))
					isNewTicket = false;
			}

			String ccEmails = "";
			JSONArray ccEmailsArray = new JSONArray();

			// CC emails will be sent as JSON array
			if (msgJSON.has("cc"))
				ccEmailsArray = msgJSON.getJSONArray("cc");

			for (int i = 0; i < ccEmailsArray.length(); i++)
				ccEmails += ccEmailsArray.getJSONArray(i).getString(0) + " ";

			// Check if any attachments exists
			Boolean attachmentExists = msgJSON.has("attachments") || msgJSON.has("images");

			// Save attachments and get URLs
			// Need to implement attachments saving code here
			List<String> attachmentURLs = new ArrayList<String>();

			Tickets ticket = null;

			if (isNewTicket)
			{
				// Creating new Ticket in Ticket table
				ticket = TicketsUtil.createTicket(groupID, true, msgJSON.getString("from_name"),
						msgJSON.getString("from_email"), msgJSON.getString("subject"), ccEmails.trim(),
						msgJSON.getString("text"),  Source.EMAIL, attachmentExists,
						mimeHeaders.getString("X-Originating-Ip"));
			}
			else
			{
				// Fetch the ticket ID from In-Reply-To mime header
				String temp = mimeHeaders.getString("In-Reply-To").replace("@helptor.com", "");
				Long ticketID = Long.parseLong(temp);

				ticket = TicketsUtil.getTicketByID(ticketID);

				// Check if ticket exists
				if (ticket == null)
				{
					System.out.println("Invalid ticketID: " + temp);
					return;
				}

				// Updating existing ticket
				TicketsUtil.updateTicket(ticketID, ccEmails.trim(), msgJSON.getString("text"), attachmentExists);
			}

			// Creating new Notes in TicketNotes table
			TicketNotes ticketNotes = TicketNotesUtil.createTicketNotes(ticket.id, groupID, CREATED_BY.REQUESTER,
					msgJSON.getString("from_name"), msgJSON.getString("from_email"), msgJSON.getString("text"),
					msgJSON.getString("html"), NOTE_TYPE.PUBLIC, attachmentURLs);
			
			NamespaceManager.set(oldNamespace);
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}
}