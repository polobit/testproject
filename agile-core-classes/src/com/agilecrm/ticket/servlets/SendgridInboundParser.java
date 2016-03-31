package com.agilecrm.ticket.servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
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

					for (Iterator iter = json.keys(); iter.hasNext();)
					{
						String keyName = (String) iter.next();

						System.out.println("keyName: " + keyName);

						if (keyName.contains("attachment"))
							System.out.println(json.getString(keyName));
					}

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

					String plainText = json.has("text") ? json.getString("text") : "", htmlText = json.has("html") ? json
							.getString("html") : "";

					// Check if any attachments exists
					Boolean attachmentExists = false;

					if (json.has("attachments"))
					{
						if (json.getInt("attachments") > 0)
							attachmentExists = true;
					}

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

					List<TicketDocuments> documentsList = new ArrayList<TicketDocuments>();

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

				BufferedReader br = new BufferedReader(new InputStreamReader(item.openStream()));

				// you should estimate buffer size
				StringBuffer sb = new StringBuffer(5000);

				try
				{
					int linesPerRead = 100;
					for (int i = 0; i < linesPerRead; ++i)
					{
						sb.append(br.readLine());
						// placing newlines back because readLine() removes them
						sb.append('\n');
					}
				}
				catch (Exception e)
				{
					e.printStackTrace();
				}

				dataJSON.put(item.getFieldName(), sb.toString());

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