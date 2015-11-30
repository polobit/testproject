package com.agilecrm.ticket.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Tag;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Source;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.entitys.Tickets.Type;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

/**
 * <code>TicketWebhook</code> is the root class for handling inbound events from
 * Mandrill. Mandrill posts the inbound event data to this servlet. Inbound data
 * format can be found below.
 * 
 * <p>
 * Inbound data can be a new ticket or reply to existing ticket. Attachments in
 * the ticket are saved to Amazon s3 and related URLs will be saved along with
 * {@link TicketNotes}.
 * </p>
 * 
 * @author Sasi on 28-Sep-2015
 * @see <a
 *      href="https://mandrill.zendesk.com/hc/en-us/articles/205583197-Inbound-Email-Processing-Overview#inbound-events-format">Mandrill
 *      Inbound data format</a>
 * 
 */
public class TicketWebhook extends HttpServlet
{
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		PrintWriter pw = response.getWriter();
		pw.write("Get");
		System.out.println("Get method called..");
		// doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			// Fetch data posted by Mandrill
			String mandrillResponse = request.getParameter("mandrill_events");

			System.out.println("MandrillResponse: " + mandrillResponse);

			if (StringUtils.isBlank(mandrillResponse))
				return;

			JSONObject mandrillInboundJSON = new JSONArray(mandrillResponse).getJSONObject(0);

			if (mandrillInboundJSON == null || !mandrillInboundJSON.has("msg"))
				return;

			JSONObject msgJSON = mandrillInboundJSON.getJSONObject("msg");

			// Checking for mime headers
			if (!msgJSON.has("headers"))
				return;

			/**
			 * msgJSON contains recipient addresses as json array
			 */
			JSONArray recipientsArray = msgJSON.getJSONArray("to");

			if (recipientsArray == null || recipientsArray.length() == 0)
				return;

			/**
			 * Finding the exact recipient address as recipient addresses may
			 * contains many. To address will be in below format -
			 * namespace+groupID@helptor.com
			 */
			String toAddress = "";
			for (int i = 0; i < recipientsArray.length(); i++)
			{
				toAddress = recipientsArray.getJSONArray(i).getString(0);

				if (toAddress.endsWith(Globals.INBOUND_EMAIL_SUFFIX))
					break;
			}

			System.out.println("toAddress: " + toAddress);

			/**
			 * Replacing helptor.com text with space so that we'll get a string
			 * of namespace and group ID separated by delimeter '+'
			 */
			String[] toAddressArray = toAddress.replace(Globals.INBOUND_EMAIL_SUFFIX, "").split("\\+");

			if (toAddressArray.length < 2)
				return;

			String namespace = toAddressArray[0];

			/**
			 * GroupID is converted with Base62. So to get original GroupID
			 * converting back to decimal with Base62.
			 */
			Long groupID = TicketGroupUtil.getLongGroupID(toAddressArray[1]);

			System.out.println("DomainName: " + namespace);
			System.out.println("GroupID: " + groupID);

			/**
			 * Verifying for valid domain or not
			 */
			if (DomainUserUtil.count(namespace) <= 0)
			{
				System.out.println("Invalid domain: " + namespace);
				return;
			}

			String oldNamespace = NamespaceManager.get();

			// Setting namespace
			NamespaceManager.set(namespace);

			/**
			 * Verifying for valid Group or not
			 */
			TicketGroups ticketGroup = TicketGroupUtil.getTicketGroupById(groupID);
			if (ticketGroup == null)
			{
				System.out.println("Invalid groupID: " + groupID);
				return;
			}

			boolean isNewTicket = true;

			/**
			 * If received ticket is reply to existing ticket then email address
			 * will be in the form of namespace+groupid+ticketid@helptor.com
			 */
			if (toAddressArray.length == 3)
				isNewTicket = false;

			List<String> ccEmails = new ArrayList<String>();
			JSONArray ccEmailsArray = new JSONArray();

			// CC emails will be sent as JSON array
			if (msgJSON.has("cc"))
				ccEmailsArray = msgJSON.getJSONArray("cc");

			for (int i = 0; i < ccEmailsArray.length(); i++)
				ccEmails.add(ccEmailsArray.getJSONArray(i).getString(0));

			// Check if any attachments exists
			Boolean attachmentExists = msgJSON.has("attachments") || msgJSON.has("images");

			// Save attachments and get URLs
			// Need to implement attachments saving code here
			List<TicketDocuments> attachmentURLs = new ArrayList<TicketDocuments>();

			Tickets ticket = null;

			if (isNewTicket)
			{
				// Creating new Ticket in Ticket table
				ticket = TicketsUtil.createTicket(groupID, null, msgJSON.getString("from_name"),
						msgJSON.getString("from_email"), msgJSON.getString("subject"), ccEmails,
						msgJSON.getString("text"), Status.NEW, Type.PROBLEM, Priority.LOW, Source.EMAIL,
						attachmentExists, msgJSON.getJSONObject("headers").getString("X-Originating-Ip"),
						new ArrayList<Key<TicketLabels>>());
			}
			else
			{
				// Fetch ticket ID from In-Reply-To mime header
				Long ticketID = Long.parseLong(toAddressArray[2]);

				ticket = TicketsUtil.getTicketByID(ticketID);

				// Check if ticket exists
				if (ticket == null)
				{
					System.out.println("Invalid ticketID: " + ticketID);
					return;
				}

				Long ticketUpdatedTime = Calendar.getInstance().getTimeInMillis();

				// Updating existing ticket
				TicketsUtil.updateTicket(ticketID, ccEmails, msgJSON.getString("text"),
						LAST_UPDATED_BY.REQUESTER, ticketUpdatedTime, ticketUpdatedTime, null, attachmentExists);
			}

			// Creating new Notes in TicketNotes table
			TicketNotes ticketNotes = TicketNotesUtil.createTicketNotes(ticket.id, groupID, ticket.assigneeID,
					CREATED_BY.REQUESTER, msgJSON.getString("from_name"), msgJSON.getString("from_email"),
					msgJSON.getString("text"), msgJSON.getString("html"), NOTE_TYPE.PUBLIC, attachmentURLs);

			NamespaceManager.set(oldNamespace);
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}
}
