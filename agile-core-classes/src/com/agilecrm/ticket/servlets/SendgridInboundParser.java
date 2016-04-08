package com.agilecrm.ticket.servlets;

import java.io.ByteArrayInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.ByteBuffer;
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
import org.jsoup.select.Elements;

import com.agilecrm.contact.Contact;
import com.agilecrm.export.gcs.GCSServiceAgile;
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
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi
 * 
 */
public class SendgridInboundParser extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	List<String> ignoreBase64Conversion = new ArrayList<String>()
	{
		{
			add("text/plain");
		}
	};

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
			boolean isMultipart = ServletFileUpload.isMultipartContent(request);

			System.out.println("isMultipart: " + isMultipart);

			try
			{
				Long currentTime = Calendar.getInstance().getTimeInMillis();

				if (isMultipart)
				{
					JSONObject json = getJSONFromMIME(request);

					String envelope = json.getString("envelope");

					System.out.println("Envelope:" + envelope);

					JSONObject enveloperJSON = new JSONObject(envelope);
					String toAddress = (String) new JSONArray(enveloperJSON.getString("to")).get(0);

					/**
					 * Replacing helptor.com text with space so that we'll get a
					 * string of namespace and group ID separated by delimeter
					 * '+'
					 */
					String inboundSuffix = TicketGroupUtil.getInboundSuffix();

					String[] toAddressArray = toAddress.replace(inboundSuffix, "").split("\\+");

					if (toAddressArray.length < 2)
						return;

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
					 * GroupID is converted with Base62. So to get original
					 * GroupID converting back to decimal with Base62.
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
						System.out.println("Invalid groupID: " + groupID);
						return;
					}

					List<String> ccEmails = getCCEmails(json);

					// Get email key value as it contains plain text, html text
					// and attachments data
					String fileData = json.getString("headers");

					// Properties props = System.getProperties();
					// Session session = Session.getInstance(props);

					// MimeMessage message = new MimeMessage(session, new
					// ByteArrayInputStream(fileData.toString()
					// .getBytes()));

					// MimeMessageParser messageParser = new
					// MimeMessageParser(message).parse();

					String plainText = "", htmlText = "";

					if (json.has("text"))
						plainText = json.getString("text");

					if (json.has("text"))
						htmlText = json.getString("html");

					// String htmlText = messageParser.hasHtmlContent() ?
					// messageParser.getHtmlContent() : "";

					boolean attachmentExists = false;

					if (json.has("attachments"))
						attachmentExists = json.getInt("attachments") > 0 ? true : false;

					List<TicketDocuments> documentsList = (attachmentExists) ? getAttachmentsList(json)
							: (new ArrayList<TicketDocuments>());

					Tickets ticket = null;

					String[] nameEmail = getNameAndEmail(json);

					// boolean isNewTicket = isNewTicket(toAddressArray);
					String ticketID = extractTicketIDFromHtml(htmlText);

					boolean isNewTicket = StringUtils.isBlank(ticketID) ? true : false;

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

						ticket.updateTicketAndSave(ccEmails, lastRepliedText, LAST_UPDATED_BY.REQUESTER, currentTime,
								currentTime, null, attachmentExists, false, true);

						// Sending user replied notification
						// BulkActionNotifications.publishNotification(ticket.requester_name
						// + " replied to ticket#" + ticket.id);

						TicketBulkActionsBackendsRest.publishNotification(ticket.requester_name
								+ " replied to ticket #" + ticket.id);

						// Execute note created by customer trigger
						TicketTriggerUtil.executeTriggerForNewNoteAddedByCustomer(ticket);
					}

					// Creating new Notes in TicketNotes table
					TicketNotes notes = new TicketNotes(ticket.id, ticketGroup.id, ticket.assigneeID,
							CREATED_BY.REQUESTER, nameEmail[0], nameEmail[1], plainText, htmlText, NOTE_TYPE.PUBLIC,
							documentsList, json.toString());

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

	/**
	 * 
	 * @param json
	 * @return
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

					if (StringUtils.isBlank(fileName))
					{
						// Other cases yet to handle
						if (fileType.contains("image") || fileType.contains("img"))
						{
							if (attachmentInfo.has("content-id"))
								fileName = attachmentInfo.getString("content-id");
						}
					}

					byte[] dataArray = null;

					if (!ignoreBase64Conversion.contains(fileType))
						dataArray = attachmentContent.getBytes(StandardCharsets.UTF_8);
					else
						dataArray = Base64.decode(attachmentContent.getBytes(StandardCharsets.UTF_8));

					GCSServiceAgile service = saveFileToGCS(fileName, fileType, dataArray);

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
	 * 
	 * @param json
	 * @return
	 */
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
			else
			{
				if (name.contains("\""))
					name = name.replace("\"", "");
			}

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
	 * 
	 * @param json
	 * @return
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
	 * 
	 * @param request
	 * @return
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
				// item = iter.next();
				//
				// dataJSON.put(item.getFieldName(),
				// IOUtils.toString(item.openStream(), "UTF-8"));

				item = iter.next();

				String fieldName = item.getFieldName(), contentData = "", contentType = item.getContentType();

				System.out.println("Field name: " + fieldName);
				System.out.println("ContentType(): " + contentType);

				if (fieldName.matches("^attachment\\d$") && !ignoreBase64Conversion.contains(contentType))
				{
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
	 * If received ticket is reply to existing ticket then email address will be
	 * in the form of namespace+groupid+ticketid@helptor.com
	 */
	public static boolean isNewTicket(String[] toAddressArray)
	{
		return (toAddressArray.length == 3) ? false : true;
	}

	/**
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

		Elements elements = doc.select("[title=agl_tckt_id]");

		if (elements == null || elements.size() == 0)
		{
			System.out.print("No ticketID found...");
			return ticketID;
		}

		ticketID = elements.get(0).text();

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

	public static void main(String[] args) throws Exception
	{
		String ss = "?PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000,\u0000\u0000\u0000\"\b\u0002\u0000\u0000\u0000??&\u0000\u0000\u0000\u0001sRGB\u0000??\u001c?\u0000\u0000\u0000\u0004gAMA\u0000\u0000??\u000b?a\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000e?\u0000\u0000\u000e?\u0001?o?d\u0000\u0000\u0000bIDATXGcx+?2??a?]\u0000t??#`)a4$FC\u0002?P\u0018M\u0013?ib4M?Fs?h?\u0018?\u001d#2w????iD6`iUN\u0010??.R?V?Adj?(\u001bu?h?1Zw????r\u0002\u0000?2?g??\u001c?\u0000\u0000\u0000\u0000IEND?B`?";
		InputStream stream = new ByteArrayInputStream(ss.getBytes(StandardCharsets.UTF_8));

		byte[] byteArray = IOUtils.toByteArray(stream);
		byte[] encodeBase64 = org.apache.commons.codec.binary.Base64.encodeBase64(byteArray, true);

		FileOutputStream fos = new FileOutputStream("D:\\img.png");
		fos.write(encodeBase64);
		fos.close();

		System.out.println(new String(encodeBase64));
	}
}