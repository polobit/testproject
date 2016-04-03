package com.agilecrm.ticket.servlets;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Properties;

import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
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
import com.agilecrm.ticket.rest.TicketBulkActionsBackendsRest;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

public class SendgridInboundParser extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		PrintWriter pw = response.getWriter();
		pw.write("Get");
		System.out.println("Get method called..");
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			boolean isMultipart = ServletFileUpload.isMultipartContent(request);

			System.out.println("isMultipart: " + isMultipart);

			try
			{
				Long currentTime = Calendar.getInstance().getTimeInMillis();

				if (isMultipart)
				{
					JSONObject json = getJSONFromMIME(request);

					System.out.println("JSON keys list:");

					String envelope = json.getString("envelope");

					System.out.println("Envelope:" + envelope);

					JSONObject enveloperJSON = new JSONObject(envelope);
					String toAddress = (String) new JSONArray(enveloperJSON.getString("to")).get(0);

					System.out.println("To address: " + toAddress);

					/**
					 * Replacing helptor.com text with space so that we'll get a
					 * string of namespace and group ID separated by delimeter
					 * '+'
					 */
					String namespace = getSubDomain(toAddress);

					System.out.println("namespace: " + namespace);

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

					String groupName = toAddress.split("@")[0];

					System.out.println("groupName: " + groupName);

					String[] groupArray = groupName.split("\\+");
					boolean isNewTicket = true;

					if (groupArray.length >= 2)
					{
						groupName = groupArray[0];
						isNewTicket = false;
					}

					TicketGroups ticketGroup = null;

					/**
					 * Verifying for valid Group or not
					 */
					try
					{
						ticketGroup = TicketGroupUtil.getTicketGroupByName(groupName);
					}
					catch (Exception e)
					{
						System.out.println("Invalid group: " + groupName);
						return;
					}

					List<String> ccEmails = getCCEmails(json);

					// Get email key value as it contains plain text, html text
					// and attachments data
					String fileData = json.getString("eomail");

					Properties props = System.getProperties();
					Session session = Session.getInstance(props);

					MimeMessage message = new MimeMessage(session, new ByteArrayInputStream(fileData.toString()
							.getBytes()));

					MimeMessageParser messageParser = new MimeMessageParser(message).parse();

					String plainText = messageParser.hasPlainContent() ? messageParser.getPlainContent() : "";
					String htmlText = messageParser.hasHtmlContent() ? messageParser.getHtmlContent() : "";

					boolean attachmentExists = messageParser.hasAttachments();
					List<TicketDocuments> documentsList = messageParser.getAttachmentsList();

					Tickets ticket = null;

					String[] nameEmail = getNameAndEmail(json);

					if (isNewTicket)
					{
						// Creating new Ticket in Ticket table
						ticket = new Tickets(ticketGroup.id, null, nameEmail[0], nameEmail[1],
								json.getString("subject"), ccEmails,
								TicketNotesUtil.removedQuotedRepliesFromPlainText(plainText), Status.NEW, Type.PROBLEM,
								Priority.LOW, Source.EMAIL, CreatedBy.CUSTOMER, attachmentExists,
								json.getString("sender_ip"), new ArrayList<Key<TicketLabels>>());

						// BulkActionNotifications.publishNotification("New ticket #"
						// +
						// ticket.id + " received");
						TicketBulkActionsBackendsRest.publishNotification("New ticket #" + ticket.id + "received");
					}
					else
					{
						try
						{
							ticket = TicketsUtil.getTicketByID(Long.parseLong(groupArray[1]));

						}
						catch (Exception e)
						{
							System.out.println(ExceptionUtils.getFullStackTrace(e));
						}

						// Check if ticket exists
						if (ticket == null)
						{
							System.out.println("Invalid ticketID or ticket has been deleted: " + groupArray[1]);
							return;
						}

						String lastRepliedText = TicketNotesUtil.removedQuotedRepliesFromPlainText(plainText);

						// Checking if contact existing or not
						Contact contact = ticket.getTicketRelatedContact();

						ticket.contact_key = new Key<Contact>(Contact.class, contact.id);
						ticket.contactID = contact.id;

						ticket.updateTicketAndSave(ccEmails, lastRepliedText, LAST_UPDATED_BY.REQUESTER, currentTime,
								currentTime, null, attachmentExists, false);

						// Sending user replied notification
						// BulkActionNotifications.publishNotification(ticket.requester_name
						// + " replied to ticket#" + ticket.id);

						TicketBulkActionsBackendsRest.publishNotification(ticket.requester_name
								+ " replied to ticket# " + ticket.id);

						// Execute note created by customer trigger
						TicketTriggerUtil.executeTriggerForNewNoteAddedByCustomer(ticket);
					}

					// Creating new Notes in TicketNotes table
					TicketNotes notes = new TicketNotes(ticket.id, ticketGroup.id, ticket.assigneeID,
							CREATED_BY.REQUESTER, nameEmail[0], nameEmail[1], plainText, htmlText, NOTE_TYPE.PUBLIC,
							documentsList, json.getString("headers"));

					notes.save();

					NamespaceManager.set(oldNamespace);

					System.out.println("Execution time: " + (Calendar.getInstance().getTimeInMillis() - currentTime)
							+ "ms");
				}
			}
			catch (Exception e)
			{
				System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
				e.printStackTrace();
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	private String[] getNameAndEmail(JSONObject json)
	{
		String name = "x", from = "customer@domain.com";
		try
		{
			from = json.getString("from");

			int delimeterIndex = from.indexOf("<");

			name = from.substring(0, delimeterIndex).trim();
			from = from.substring((delimeterIndex + 1), from.indexOf(">")).trim();

			if (StringUtils.isBlank(name))
				name = from.substring(0, from.lastIndexOf("@"));

			System.out.println("name: " + name);
			System.out.println("from: " + from);
		}
		catch (JSONException e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return new String[] { name, from };
	}

	private List<String> getCCEmails(JSONObject json)
	{
		if (!json.has("cc"))
			return new ArrayList<>();

		try
		{
			String ccEmailsString = json.getString("cc");

			List<String> emailsList = new ArrayList<>();

			String[] ccEmailsArray = ccEmailsString.split(",");

			for (String ccEmail : ccEmailsArray)
				emailsList.add(ccEmail.replaceAll("<|>", ""));

			System.out.println("emailsList: " + emailsList);

			return emailsList;
		}
		catch (JSONException e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return new ArrayList<>();
	}

	private String getSubDomain(String toAddress)
	{
		String tailPart = toAddress.split("@")[1];
		return tailPart.substring(0, tailPart.indexOf("."));
	}

	private JSONObject getJSONFromMIME(HttpServletRequest request)
	{
		JSONObject dataJSON = new JSONObject();

		ServletFileUpload upload = new ServletFileUpload();

		try
		{
			FileItemIterator iter = upload.getItemIterator(request);

			FileItemStream item = null;

			while (iter.hasNext())
			{
				item = iter.next();

				// System.out.println("Field name: " + item.getFieldName());
				// System.out.println("Field value: ");
				// System.out.println(IOUtils.toString(item.openStream()));

				dataJSON.put(item.getFieldName(), IOUtils.toString(item.openStream()));

				// if (item.isFormField())
				// {
				// System.out.println("Form field:  " + name);
				// String value = IOUtils.toString(item.openStream());
				//
				// dataJSON.put(name, value);
				// }
				// else
				// {
				// name = item.getName();
				// System.out.println("name==" + name);
				//
				// if (name != null && !"".equals(name))
				// {
				// String fileName = new File(item.getName()).getName();
				// System.out.println("fileName: " + fileName);
				// System.out.println("file content: ");
				//
				// String theString = IOUtils.toString(item.openStream());
				//
				// System.out.println(theString);
				// }
				// }
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return dataJSON;
	}

	public static void main(String[] args) throws JSONException, IOException
	{
		File file = new File("D:\\email.txt");
		FileInputStream inputStream = new FileInputStream(file);

		System.out.println(IOUtils.toString(inputStream, StandardCharsets.UTF_8.name()));
	}
}