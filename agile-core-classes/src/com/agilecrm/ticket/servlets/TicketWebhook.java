package com.agilecrm.ticket.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.agilecrm.Globals;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.CreatedBy;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Source;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.entitys.Tickets.Type;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.AmazonS3;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.google.api.client.util.Base64;
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
			 * msgJSON contains email field where Mandrill received the message
			 */

			String toAddress = msgJSON.getString("email");

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

			String text = "No plain text available", html = "No html content available";

			if (msgJSON.has("text"))
				text = msgJSON.getString("text");

			if (msgJSON.has("html"))
				html = msgJSON.getString("html");

			// Check if any attachments exists
			Boolean attachmentExists = msgJSON.has("attachments") || msgJSON.has("images");

			// Save attachments and get URLs
			// Need to implement attachments saving code here
			List<TicketDocuments> attachmentURLs = new ArrayList<TicketDocuments>();

			try
			{
				if (msgJSON.has("attachments"))
				{
					JSONObject attachments = msgJSON.getJSONObject("attachments");

					for (Iterator iter = attachments.keys(); iter.hasNext();)
					{
						JSONObject fileJSON = attachments.getJSONObject((String) iter.next());

						String fileName = fileJSON.getString("name"), fileType = fileJSON.getString("type");

						System.out.println("fileName: " + fileName);
						System.out.println("type: " + fileType);
						System.out.println("base64: " + fileJSON.getBoolean("base64"));

						JSONObject responseJSON = AmazonS3.SaveFile(fileName, fileType, fileJSON.getString("content")
								.getBytes(StandardCharsets.UTF_8));

						TicketDocuments document = new TicketDocuments(fileName, fileType, 0l,
								responseJSON.getString("file_url"));

						attachmentURLs.add(document);
					}
				}

				if (msgJSON.has("images"))
				{
					JSONObject images = msgJSON.getJSONObject("images");

					Document doc = Jsoup.parse(html, "UTF-8");

					for (Iterator iter = images.keys(); iter.hasNext();)
					{
						JSONObject fileJSON = images.getJSONObject((String) iter.next());

						String fileName = fileJSON.getString("name"), fileType = fileJSON.getString("type");

						boolean isBase64Encoded = false;

						if (fileJSON.has("base64"))
							isBase64Encoded = fileJSON.getBoolean("base64");

						System.out.println("fileName: " + fileName);
						System.out.println("type: " + fileType);
						System.out.println("base64: " + isBase64Encoded);

						byte[] bytes = null;

						if (isBase64Encoded)
							bytes = Base64.decodeBase64(fileJSON.getString("content"));
						else
							bytes = fileJSON.getString("content").getBytes();

						JSONObject responseJSON = AmazonS3.SaveFile(fileName, fileType, bytes);

						Elements elements = doc.getElementsByAttributeValue("src", "cid:" + fileName);

						if (elements == null || elements.size() == 0)
						{
							TicketDocuments document = new TicketDocuments(fileName, fileType, 0l,
									responseJSON.getString("file_url"));

							attachmentURLs.add(document);

							continue;
						}

						Element element = elements.first();

						element.attr("src", responseJSON.getString("file_url"));
					}

					html = doc.toString();
				}
			}
			catch (Exception e)
			{
				System.out.println(ExceptionUtils.getFullStackTrace(e));
			}

			Tickets ticket = null;

			if (isNewTicket)
			{
				String ip = "";

				try
				{
					ip = msgJSON.getJSONObject("headers").getString("X-Originating-Ip");
				}
				catch (Exception e)
				{
				}

				String fromName = "";

				if (msgJSON.has("from_name"))
					fromName = msgJSON.getString("from_name");

				// Creating new Ticket in Ticket table
				ticket = TicketsUtil.createTicket(groupID, null, fromName,
						msgJSON.getString("from_email"), msgJSON.getString("subject"), ccEmails, text, Status.NEW,
						Type.PROBLEM, Priority.LOW, Source.EMAIL, CreatedBy.CUSTOMER, attachmentExists, ip,
						new ArrayList<Key<TicketLabels>>());

				BulkActionNotifications.publishNotification("New ticket #" + ticket.id + " received");
			}
			else
			{
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
				ticket = TicketsUtil.updateTicket(ticketID, ccEmails, msgJSON.getString("text"),
						LAST_UPDATED_BY.REQUESTER, ticketUpdatedTime, ticketUpdatedTime, null, attachmentExists);

				BulkActionNotifications.publishNotification(ticket.requester_name + " replied to ticket(#" + ticket.id
						+ ")");
			}

			// Creating new Notes in TicketNotes table
			TicketNotes ticketNotes = TicketNotesUtil.createTicketNotes(ticket.id, groupID, ticket.assigneeID,
					CREATED_BY.REQUESTER, msgJSON.getString("from_name"), msgJSON.getString("from_email"), text, html,
					NOTE_TYPE.PUBLIC, attachmentURLs);

			if (!isNewTicket)
				// Execute note created by customer trigger
				TicketTriggerUtil.executeTriggerForNewNoteAddedByCustomer(ticket);

			NamespaceManager.set(oldNamespace);
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}
}
