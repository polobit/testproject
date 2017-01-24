package com.agilecrm.ticket.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.MultipartStream.ItemInputStream;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.geronimo.mail.util.Base64;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.agilecrm.contact.Contact;
import com.agilecrm.export.gcs.GCSServiceAgile;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.TicketStats;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.CreatedBy;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Source;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.entitys.Tickets.Type;
import com.agilecrm.ticket.entitys.TicketsBackup;
import com.agilecrm.ticket.rest.TicketBulkActionsBackendsRest;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.ticket.utils.TicketStatsUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.appengine.api.NamespaceManager;
import com.google.apphosting.api.ApiProxy;
import com.googlecode.objectify.Key;

/**
 * <code>SendgridInboundParser</code> is the root class for handling inbound
 * events from Sendgrid. Sendgrid posts the inbound event data to this servlet.
 * Inbound data format can be found below.
 * 
 * <p>
 * Inbound data can be a new ticket or reply to existing ticket. Attachments in
 * the ticket are saved to Google cloud storage and related URLs will be saved
 * along with {@link TicketNotes}.
 * </p>
 * 
 * @author Sasi on 28-Sep-2015
 * @see <a
 *      href="https://sendgrid.com/docs/API_Reference/Webhooks/parse.html">Sendgrid
 *      Inbound data format</a>
 * 
 */
public class SendgridInboundParser extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	
	private static boolean IS_ATTACHMENT_MORE_THAN_1MB = false;
	
	/**
	 * List of content types to avoid base64 conversion
	 */
	List<String> ignoreBase64Conversion = new ArrayList<String>()
	{
		private static final long serialVersionUID = 1L;

		{
			add("text/plain");
		}
	};

	/**
	 *
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		PrintWriter pw = response.getWriter();
		pw.write("Get");

		System.out.println("Get method called..");
	}

	/**
	 * 
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			Key<TicketsBackup> backupKey = null;

			boolean isMultipart = ServletFileUpload.isMultipartContent(request);

			System.out.println("isMultipart: " + isMultipart);
			IS_ATTACHMENT_MORE_THAN_1MB = false;

			try
			{
				if (isMultipart)
				{
					JSONObject json = getJSONFromMIME(request);

					String envelope = json.getString("envelope");

					System.out.println("Envelope:" + envelope);

					JSONObject enveloperJSON = new JSONObject(envelope);
					String toAddress = (String) new JSONArray(enveloperJSON.getString("to")).get(0);

					String[] toAddressArray = getNamespaceAndGroup(toAddress);

					if (toAddressArray.length < 2)
						return;

					try {
						// Adding record to tickets backup db
						backupKey = new TicketsBackup(json.toString(), toAddressArray[0]).save();
					} catch(Exception e) {
						if( e instanceof ApiProxy.RequestTooLargeException)
							IS_ATTACHMENT_MORE_THAN_1MB = true;
						
						System.out.println("Error while trying to save ticket backup: " + ExceptionUtils.getFullStackTrace(e));
					}

					saveTicket(json, toAddressArray);

					// Removing backup if everything is ok
					if( backupKey != null )	TicketsBackup.delete(backupKey);
				}
			}
			catch (Exception e)
			{
				System.out.println(ExceptionUtils.getFullStackTrace(e));
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	/**
	 * Converts the json object into ticket object and saves to db.
	 * 
	 * @param json
	 * @param key
	 * @throws Exception
	 */
	public void saveTicket(JSONObject json, String[] toAddressArray) throws Exception
	{
		Long currentTime = Calendar.getInstance().getTimeInMillis();

		String namespace = toAddressArray[0];
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

		/**
		 * GroupID is converted with Base62. So to get original GroupID
		 * converting back to decimal with Base62.
		 */
		Long groupID = TicketGroupUtil.getLongGroupID(toAddressArray[1]);

		System.out.println("groupID: " + groupID);

		TicketGroups ticketGroup = null;

		/**
		 * Verifying for valid Group or not
		 */
		try
		{
			ticketGroup = TicketGroupUtil.getTicketGroupById(groupID);
		}
		catch (Exception e)
		{
			// We are generating group forwarding email addresses
			// which are case sensitive.
			// So verifying if lowered case group id exists in
			// to address.
			boolean idFound = false;

			String tempGroupID = toAddressArray[1];

			List<TicketGroups> allGroups = TicketGroups.ticketGroupsDao.fetchAll();

			for (TicketGroups tempTicketGroup : allGroups)
			{
				String groupEmail = tempTicketGroup.group_email.toLowerCase();

				if (groupEmail.contains(tempGroupID.toLowerCase()))
				{
					ticketGroup = tempTicketGroup;
					idFound = true;
					break;
				}
			}

			if (!idFound)
			{
				System.out.println("Invalid groupID: " + groupID);
				return;
			}
		}

		List<String> ccEmails = getCCEmails(json);

		String plainText = "", htmlText = "";

		if (json.has("text"))
			plainText = json.getString("text");

		if (json.has("html"))
			htmlText = json.getString("html");

		boolean attachmentExists = false;

		if (json.has("attachments"))
			attachmentExists = json.getInt("attachments") > 0 ? true : false;

		List<TicketDocuments> documentsList = (attachmentExists) ? getAttachmentsList(json)
				: (new ArrayList<TicketDocuments>());

		try
		{
			// Creating jsoup object to remove inline image tags
			Document doc = Jsoup.parseBodyFragment(htmlText, "UTF-8");

			/**
			 * Iterating through each attachment and removing inline image text
			 * and tags fron plain text content and html content
			 */
			for (TicketDocuments ticketDocument : documentsList)
			{
				String fileContentType = ticketDocument.extension;

				boolean isImage = (fileContentType.contains("image") || fileContentType.contains("img"));

				if (!isImage)
					continue;

				Elements elements = doc.getElementsByAttributeValue("src", "cid:" + ticketDocument.name);

				if (elements == null || elements.size() == 0)
					continue;

				for (Element element : elements)
				{
					plainText = plainText.replace("[image: " + element.attr("alt") + "]", "");

					try
					{
						element.remove();
					}
					catch (Exception e)
					{
						System.out.println(ExceptionUtils.getFullStackTrace(e));
					}
				}
			}

			if (documentsList != null && documentsList.size() > 0)
				htmlText = doc.body().html();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		Tickets ticket = null;

		String[] nameEmail = getNameAndEmail(json);

		System.out.println("Name & email fetched: " + Arrays.toString(nameEmail));

		// boolean isNewTicket = isNewTicket(toAddressArray);
		String ticketID = extractTicketIDFromHtml(htmlText);

		boolean isNewTicket = StringUtils.isBlank(ticketID) ? true : false;

		if (isNewTicket)
		{
			// Creating new Ticket in Ticket table
			ticket = new Tickets(ticketGroup.id, null, nameEmail[0], nameEmail[1], json.getString("subject"), ccEmails,
					plainText, Status.NEW, Type.PROBLEM, Priority.LOW, Source.EMAIL, CreatedBy.CUSTOMER,
					attachmentExists, json.getString("sender_ip"), new ArrayList<Key<TicketLabels>>());

			TicketBulkActionsBackendsRest.publishNotification("New ticket #" + ticket.id + " received");
		}
		else
		{
			try
			{
				ticket = TicketsUtil.getTicketByID(Long.parseLong(ticketID));
			}
			catch (Exception e)
			{
				System.out.println(ExceptionUtils.getFullStackTrace(e));
			}

			// Check if ticket exists
			if (ticket == null)
			{
				System.out.println("Invalid ticketID or ticket has been deleted: " + toAddressArray[2]);
				return;
			}

			String lastRepliedText = TicketNotesUtil.removedQuotedRepliesFromPlainText(plainText);

			// Checking if contact existing or not
			Contact contact = ticket.getTicketRelatedContact();

			ticket.contact_key = new Key<Contact>(Contact.class, contact.id);
			ticket.contactID = contact.id;

			ticket.updateTicketAndSave(ccEmails, lastRepliedText, LAST_UPDATED_BY.REQUESTER, currentTime, currentTime,
					null, attachmentExists, false, true);

			// Sending user replied notification
			TicketBulkActionsBackendsRest.publishNotification(nameEmail[0] + " replied to ticket #"
					+ ticket.id);

			// Execute note created by customer trigger
			TicketTriggerUtil.executeTriggerForNewNoteAddedByCustomer(ticket);
		}

		/*
		 * If size of attachments is more than 1MB. Remove attachment-info from json object.
		 */
		if( IS_ATTACHMENT_MORE_THAN_1MB )
		{
			String msg = "This field is removed as the total size of attachments is very large";
			json.put("attachment-info", msg);
			
			int count = json.getInt("attachments");

			for (int i = 1; i <= count; i++)
			{
				json.put("attachment" + i, msg);
			}
		}
		
		// Creating new Notes in TicketNotes table
		TicketNotes notes = new TicketNotes(ticket.id, ticketGroup.id, ticket.assigneeID, CREATED_BY.REQUESTER,
				nameEmail[0], nameEmail[1], plainText, htmlText, NOTE_TYPE.PUBLIC, documentsList, json.toString(),
				isNewTicket);

		notes.save();

		// Updating ticket count DB. Async job.
		TicketStatsUtil.updateEntity(TicketStats.TICKETS_COUNT);

		NamespaceManager.set(oldNamespace);

		System.out.println("Successfully created ticket...");
		System.out.println("Execution time: " + (Calendar.getInstance().getTimeInMillis() - currentTime) + "ms");
	}

	/**
	 * Saves the attachments in the ticket to google cloud storage.
	 * 
	 * @param json
	 * @return TicketDocuments list which contains file name, URL and its size.
	 */
	private List<TicketDocuments> getAttachmentsList(JSONObject json)
	{
		List<TicketDocuments> documentsList = new ArrayList<TicketDocuments>();

		try
		{
			int count = json.getInt("attachments");

			JSONObject attachmentsInfo = new JSONObject(json.getString("attachment-info"));

			for (int i = 1; i <= count; i++)
			{
				try
				{
					String attachmentContent = json.getString("attachment" + i);

					JSONObject attachmentInfo = new JSONObject(attachmentsInfo.getString("attachment" + i));

					String fileName = "", fileType = "";

					if (attachmentInfo.has("type"))
						fileType = attachmentInfo.getString("type");

					if (attachmentInfo.has("filename"))
						fileName = attachmentInfo.getString("filename");

					if (attachmentInfo.has("content-id") && (fileType.contains("image") || fileType.contains("img")))
						fileName = attachmentInfo.getString("content-id");

					byte[] dataArray = null;

					System.out.println("fileName: " + fileName);
					System.out.println("fileType: " + fileType);

					if (ignoreBase64Conversion.contains(fileType))
						dataArray = attachmentContent.getBytes(StandardCharsets.UTF_8);
					else
						dataArray = Base64.decode(attachmentContent.getBytes(StandardCharsets.UTF_8));

					GCSServiceAgile service = saveFileToGCS(fileName, fileType, dataArray);

					System.out.println("Attachment saved successfully.");

					documentsList.add(new TicketDocuments(fileName, fileType, (long) dataArray.length, service
							.getFilePathToDownload()));
				}
				catch (Exception e)
				{
					System.out.println(ExceptionUtils.getFullStackTrace(e));
				}
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return documentsList;
	}

	/**
	 * Reads the from name and email address from posted data.
	 * 
	 * @param json
	 * @return string array containing name at first index and from address at
	 *         second index.
	 */
	private String[] getNameAndEmail(JSONObject json)
	{
		String name = "", from = "";
		try
		{
			from = json.getString("from");
			name = from;

			int delimeterIndex = from.indexOf("<");

			if (delimeterIndex == -1)
				name = from.substring(0, from.lastIndexOf("@"));
			else
			{
				name = from.substring(0, delimeterIndex).trim();
				from = from.substring((delimeterIndex + 1), from.indexOf(">")).trim();
				
				// If name is blank, extract it from email address.
				// Empty name is not allowed while creating contact
				// This covers the case where received email address is in the form "<a@b.c>" 
				// In the above case, the name is parsed to ""
				if( StringUtils.isBlank(name) )	name = from.substring(0, from.lastIndexOf("@"));
			}

			if (name.contains("\""))
				name = name.replace("\"", "");

			System.out.println("name: " + name);
			System.out.println("from: " + from);
		}
		catch (JSONException e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return new String[] { name, from };
	}

	/**
	 * Splits to address into array of namespace and groupid.
	 * 
	 * @return a string array containing namespace at first index and group id
	 *         in second index.
	 */
	public String[] getNamespaceAndGroup(String toAddress)
	{
		/**
		 * Replacing email suffix with space so that we'll get a string of
		 * namespace and group ID separated by delimeter '+'
		 */
		String inboundSuffix = TicketGroupUtil.getInboundSuffix();

		//String[] toAddressArray = toAddress.replace(inboundSuffix, "").split("\\_");
		/*
		 * Domain name might have _ in it. So, we need to consider the case
		 * where there is _ in the domain name
		 */
		String[] toAddressArray = new String[2];
		String temp = toAddress.replace(inboundSuffix, "");
		int index = temp.lastIndexOf('_');
		
		if( index != -1 )
		{
			toAddressArray[0] = temp.substring(0, index);
			toAddressArray[1] = temp.substring(index + 1);
			System.out.println("toAddressArray: " + Arrays.toString(toAddressArray));
		} else {
			// No _ found in the toAddress. Check for + as delimiter
			// Earlier we have provided forwarding email's with plus delimeter.
			// This is fall-back code to handle those addresses.
			toAddressArray = toAddress.replace(inboundSuffix, "").split("\\+");

			System.out.println("toAddressArray with plus delimeter: " + Arrays.toString(toAddressArray));

			if (toAddressArray.length < 2)
				return new String[0];
		}

		return toAddressArray;
	}

	/**
	 * Converts the cc emails we got in ticket to List of strings.
	 * 
	 * @param json
	 * @return CC emails list
	 */
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

	/**
	 * Converts the data in post request to json object. Post data format can be
	 * at https://sendgrid.com/docs/API_Reference/Webhooks/parse.html.
	 * 
	 * @param request
	 * @return json object
	 */
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

				String fieldName = item.getFieldName(), contentData = "", contentType = item.getContentType();

				System.out.println("Field names found: " + fieldName);

				/**
				 * Verifying if fetched field matches with "attachmentX" (X can
				 * any number from 1-9). If so we need to encode content with
				 * Base64Encoder.
				 */
				if (fieldName.matches("^attachment\\d+$") && !ignoreBase64Conversion.contains(contentType))
				{
					System.out.println("Encoding to base64....");

					ItemInputStream stream = (ItemInputStream) item.openStream();

					byte[] byteArray = IOUtils.toByteArray(stream);
					byte[] encodeBase64 = org.apache.commons.codec.binary.Base64.encodeBase64(byteArray, true);

					contentData = new String(encodeBase64);
				}
				else
					contentData = IOUtils.toString(item.openStream(), "UTF-8");

				dataJSON.put(fieldName, contentData);
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return dataJSON;
	}

	/**
	 * Returns ticket ID from HTML content
	 * 
	 * @param htmlContent
	 * @return ticketID
	 */
	public static String extractTicketIDFromHtml(String htmlContent)
	{
		String ticketID = "";

		if (StringUtils.isBlank(htmlContent))
			return ticketID;

		Document doc = Jsoup.parseBodyFragment(htmlContent, "UTF-8");

		System.out.println(doc);

		Elements elements = doc.select("[title=agl_tckt_id]");

		if (elements == null || elements.size() == 0)
		{
			System.out.print("No ticketID found...");
			return ticketID;
		}

		// Fetching last span
		ticketID = elements.get(elements.size() - 1).text();

		System.out.println("Ticket found in html content: " + ticketID);

		return ticketID;
	}

	/**
	 * Writes file content to GCS and returns service object to get file path.
	 * 
	 * @param fileName
	 * @param fileType
	 * @param fileContentType
	 * @param currentTime
	 * @return
	 * @throws IOException
	 */
	public GCSServiceAgile saveFileToGCS(String fileName, String fileType, byte[] fileContent) throws IOException
	{
		if (fileType.contains("application/rar"))
			fileType = "application/x-rar-compressed, application/octet-stream";
		else if (fileType.contains("application/zip"))
			fileType = "application/zip, application/octet-stream";

		GcsFileOptions options = new GcsFileOptions.Builder().mimeType(fileType).contentEncoding("UTF-8")
				.acl("public-read").addUserMetadata("domain", NamespaceManager.get()).build();

		GCSServiceAgile service = new GCSServiceAgile((Calendar.getInstance().getTimeInMillis()) + fileName,
				"ticket-attachments", options);

		GcsOutputChannel writer = service.getOutputchannel();

		writer.write(ByteBuffer.wrap(fileContent));
		writer.close();

		System.out.println("Added saved document....");

		return service;
	}
}