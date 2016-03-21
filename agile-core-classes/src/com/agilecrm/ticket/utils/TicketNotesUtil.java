package com.agilecrm.ticket.utils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import com.agilecrm.Globals;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.VersioningUtil;
import com.agilecrm.util.email.MustacheUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.thirdparty.mandrill.Mandrill;

/**
 * 
 * @author Sasi on 28-Sep-2015
 */
public class TicketNotesUtil
{
	/**
	 * 
	 * @param ticketID
	 * @param sortOrder
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static TicketNotes getTicketNotesByID(Long notesID) throws EntityNotFoundException
	{
		return TicketNotes.ticketNotesDao.get(notesID);
	}

	/**
	 * 
	 * @param ticketID
	 * @param sortOrder
	 * @return
	 */
	public static List<TicketNotes> getTicketNotes(Long ticketID, String sortOrder)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("ticket_key", new Key<Tickets>(Tickets.class, ticketID));

		List<TicketNotes> notes = TicketNotes.ticketNotesDao.listByPropertyAndOrder(searchMap, sortOrder);
		
		//Formatting plain text content
		for (TicketNotes note : notes)
		{
			//note.plain_text = StringEscapeUtils.escapeHtml(note.plain_text);
			note.plain_text = TicketNotesUtil.convertNewLinesToBreakTags(note.plain_text);
		}

		return inclDomainUsers(notes);
	}

	// /**
	// *
	// * @param ticket_id
	// * @param group_id
	// * @param created_by
	// * @param requester_name
	// * @param requester_email
	// * @param original_plain_text
	// * @param original_html_text
	// * @param note_type
	// * @param attachments_list
	// * @return
	// * @throws EntityNotFoundException
	// */
	// public static TicketNotes createTicketNotes(Long ticket_id, Long
	// group_id, Long assignee_id, CREATED_BY created_by,
	// String requester_name, String requester_email, String
	// original_plain_text, String original_html_text,
	// NOTE_TYPE note_type, List<TicketDocuments> attachments_list, String
	// mimeObject)
	// throws EntityNotFoundException
	// {
	// TicketNotes ticketNotes = new TicketNotes(ticket_id, group_id,
	// assignee_id, created_by, requester_name,
	// requester_email, removedQuotedRepliesFromPlainText(original_plain_text),
	// removedQuotedRepliesFromHTMLText(original_html_text),
	// original_plain_text, original_html_text,
	// note_type, attachments_list, mimeObject);
	//
	// Key<TicketNotes> key = TicketNotes.ticketNotesDao.put(ticketNotes);
	//
	// System.out.println("Notes key: " + key.getId());
	//
	// return ticketNotes;
	// }

	/**
	 * 
	 * @param ticket
	 * @throws Exception
	 */
	public static void sendReplyToRequester(Tickets ticket) throws Exception
	{
		JSONObject json = new JSONObject();

		List<TicketNotes> notesList = getTicketNotes(ticket.id, "-created_time");

		System.out.println("notesList size.." + notesList.size());

		TicketGroups group = null;

		try
		{
			group = TicketGroupUtil.getTicketGroupById(ticket.groupID);
		}
		catch (Exception e)
		{
			throw new Exception("No group found with id " + group.id + " or group has been deleted.");
		}

		String groupName = group.group_name;
		String agentName = DomainUserUtil.getDomainUser(ticket.assigneeID).name;

		if (StringUtils.isBlank(agentName))
			agentName = "";

		json.put("ticket_id", ticket.id);
		json.put("group_name", groupName);
		json.put("agent_name", agentName);
		json.put("tracking_img", appendTrackingImage(ticket.id, notesList.get(0).id));

		String companyName = AccountPrefsUtil.getAccountPrefs().company_name;

		if (companyName != null)
			json.put("company_name", companyName);

		System.out.println("notesList.get(0).id): " + notesList.get(0).id);

		JSONArray notesArray = new JSONArray();

		// Add all notes
		for (TicketNotes notes : notesList)
		{
			if (notes.note_type == NOTE_TYPE.PRIVATE)
				continue;

			JSONObject eachNoteJSON = getFormattedEmailNoteJSON(notes,
					ContactUtil.getContact(ticket.contact_key.getId()));

			if (eachNoteJSON != null)
				notesArray.put(eachNoteJSON);
		}

		json.put("note_json_array", notesArray);

		System.out.println("notesArray: " + notesArray);

		String fromAddress = NamespaceManager.get() + "+" + TicketGroupUtil.getShortGroupID(group.id) + "+" + ticket.id
				+ Globals.INBOUND_EMAIL_SUFFIX;

		sendEmail(ticket.requester_email, ticket.subject, agentName, fromAddress, ticket.cc_emails,
				SendMail.TICKET_REPLY, json);
	}

	/**
	 * 
	 * @param notes
	 * @return
	 * @throws Exception
	 */
	public static JSONObject getFormattedEmailNoteJSON(TicketNotes notes, Contact contact) throws Exception
	{
		Map<Long, DomainUser> domainUsersMap = new HashMap<Long, DomainUser>();

		JSONObject json = new JSONObject();

		json.put("created_time", DateUtil.getCalendarString(notes.created_time, "MMM d, h:mm a (z)", ""));

		json.put("plain_text", notes.plain_text);

		String htmlText = notes.html_text;

		if (StringUtils.isBlank(htmlText))
			htmlText = notes.plain_text;

		json.put("html_text", htmlText);

		if (notes.attachments_list != null && notes.attachments_list.size() > 0)
		{
			JSONArray attachmentsArray = new JSONArray();

			for (TicketDocuments document : notes.attachments_list)
				attachmentsArray.put(new JSONObject(document.toString()));

			json.put("attachments_exists", true);
			json.put("attachments_list", attachmentsArray);
		}

		if (notes.created_by == CREATED_BY.AGENT)
		{
			if (!domainUsersMap.containsKey(notes.assignee_id))
				domainUsersMap.put(notes.assignee_id, DomainUserUtil.getDomainUser(notes.assignee_id));

			DomainUser user = domainUsersMap.get(notes.assignee_id);

			if (user == null)
			{
				json.put("user_name", "");
				json.put("img_url", Globals.GRAVATAR_SECURE_DEFAULT_IMAGE_URL);
			}
			else
			{
				json.put("user_name", user.name);
				json.put("img_url", user.getOwnerPic());
			}
		}
		else
		{
			json.put("user_name", notes.requester_name);

			String imageURL = contact.getContactFieldValue(Contact.IMAGE);

			if (imageURL == null)
				imageURL = Globals.GRAVATAR_SECURE_DEFAULT_IMAGE_URL;

			json.put("img_url", imageURL);
		}

		return json;
	}

	public static void sendEmail(String toAddress, String subject, String fromName, String fromEmail,
			List<String> ccEmails, String template, JSONObject dataJSON) throws Exception
	{
		// Read template - HTML
		String emailHTML = MustacheUtil.templatize(template + SendMail.TEMPLATE_HTML_EXT, dataJSON);

		// Read template - Body
		String emailBody = MustacheUtil.templatize(template + SendMail.TEMPLATE_BODY_EXT, dataJSON);

		// If both are null, nothing to be sent
		if (emailHTML == null && emailBody == null)
		{
			System.err.println("Email could not be sent as no matching templates were found " + template);
			return;
		}

		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		JSONObject mailJSON = Mandrill.setMandrillAPIKey(null, NamespaceManager.get(), null);

		String ccEmailString = "";
		for (String ccEmail : ccEmails)
			ccEmailString += ccEmail + ",";

		// All email params are inserted into Message json
		JSONObject messageJSON = Mandrill.getMessageJSON("", fromEmail, fromName, toAddress, ccEmailString, "", "",
				subject, emailHTML, emailBody, "", "");

		String response = null;

		mailJSON.put(Mandrill.MANDRILL_MESSAGE, messageJSON);

		System.out.println("mailJSON: " + mailJSON);
		long start_time = System.currentTimeMillis();

		response = HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL + Mandrill.MANDRILL_API_MESSAGE_CALL,
				mailJSON.toString());

		long process_time = System.currentTimeMillis() - start_time;

		System.out.println("Process time for sending mandrill " + process_time + "ms");

		System.out.println("Response for first attempt " + response);

		NamespaceManager.set(oldNamespace);
	}

	/**
	 * 
	 * @param notes
	 * @return
	 */
	public static List<TicketNotes> inclDomainUsers(List<TicketNotes> notes)
	{
		String oldnamespace = NamespaceManager.get();

		try
		{
			Set<Key<DomainUser>> domainUserKeys = new HashSet<Key<DomainUser>>();

			Map<Long, DomainUserPartial> map = new HashMap<Long, DomainUserPartial>();

			NamespaceManager.set("");

			for (TicketNotes note : notes)
			{
				if (note.created_by == CREATED_BY.REQUESTER || note.assignee_id == null)
					continue;

				System.out.println(note.assignee_id);

				domainUserKeys.add(new Key<DomainUser>(DomainUser.class, note.assignee_id));
			}

			System.out.println("domainUserKeys: " + domainUserKeys);

			List<DomainUserPartial> domainUsers = new ArrayList<DomainUserPartial>();

			for (Key<DomainUser> key : domainUserKeys)
				map.put(key.getId(), DomainUserUtil.getPartialDomainUser(key.getId()));

			System.out.println("domainUsers: " + domainUsers);

			for (TicketNotes note : notes)
			{
				if (note.created_by == CREATED_BY.REQUESTER)
					continue;

				note.domain_user = map.get(note.assignee_id);
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldnamespace);
		}

		return notes;
	}

	/**
	 * 
	 * @param original_plain_text
	 * @return
	 */
	public static String convertNewLinesToBreakTags(String plainText)
	{
		return plainText.replaceAll("(\r\n|\n\r|\r|\n)", "<br/>");
	}

	/**
	 * 
	 * @param original_html_text
	 * @return
	 */
	public static String parseHtmlText(String htmlText)
	{
		// parse plain text
		return htmlText;
	}

	/**
	 * Removes quoted replies in received ticket plain text.
	 * 
	 * @return text
	 */
	public static String removedQuotedRepliesFromPlainText(String text)
	{
		try
		{
			if (StringUtils.isBlank(text))
				return text;

			// Checking with on.... wrote: delimeter
			Pattern pattern = Pattern.compile("On.*?wrote:.*?", Pattern.DOTALL);

			String[] textArray = pattern.split(text);

			if (textArray.length >= 2)
				return textArray[0];

			// Checking with \n and greater than delimeter
			pattern = Pattern.compile("\n\n>", Pattern.DOTALL);

			textArray = pattern.split(text);

			if (textArray.length >= 2)
				return textArray[0];

			// Checking with \r\n and greater than delimeter
			pattern = Pattern.compile("\r\n\r\n>", Pattern.MULTILINE);

			textArray = pattern.split(text);

			if (textArray.length >= 2)
				return textArray[0];

			return text;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return text;
	}

	/**
	 * Removes quoted replies in received ticket html text.
	 * 
	 * @return text
	 */
	public static String removedQuotedRepliesFromHTMLText(String html)
	{
		try
		{
			if (StringUtils.isBlank(html))
				return html;

			Document doc = Jsoup.parse(html, "UTF-8");

			// Right now considering only mails from gmail
			for (Element element : doc.select("div.gmail_extra"))
				element.remove();

			return doc.toString();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return html;
	}

	/**
	 * 
	 * @param ticketID
	 * @param notesID
	 * @throws Exception
	 */
	public static void ticketNoteViewedTime(String ticketID, String notesID) throws Exception
	{
		if (StringUtils.isBlank(ticketID) || StringUtils.isBlank(notesID))
			return;

		Tickets ticket = TicketsUtil.getTicketByID(Long.parseLong(ticketID));

		if (ticket == null)
			return;

		TicketNotes notes = TicketNotes.ticketNotesDao.get(Long.parseLong(notesID));

		System.out.println("notes id" + notes.id);

		if (notes.requester_viewed_time != 0l)
			return;

		notes.requester_viewed_time = Calendar.getInstance().getTimeInMillis();

		TicketNotes.ticketNotesDao.put(notes);
	}

	/**
	 * Appends tracking image for html body
	 * 
	 * @param html
	 *            - html body.
	 * @param campaignId
	 *            - CampaignId.
	 * @param trackerId
	 *            - TrackerId or SubscriberId.
	 * @return html string with appended image.
	 **/
	public static String appendTrackingImage(Long ticketID, Long notesID)
	{
		String queryParams = "";

		queryParams = "t=" + ticketID;
		queryParams += "&";
		queryParams += "n=" + notesID;

		String trackingImage = "<div class=\"ag-img\"><img src="
				+ VersioningUtil.getHostURLByApp(NamespaceManager.get()) + "/ticket-module/backend/open?" + queryParams
				+ " nosend=\"1\" style=\"display:none !important;\" width=\"1\" height=\"1\"></img></div>";

		return trackingImage;
	}

	/**
	 * Removes ticket notes for given ticket id
	 * 
	 * @param ticketID
	 */
	public static void deleteNotes(Long ticketID)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("ticket_key", new Key<Tickets>(Tickets.class, ticketID));

		List<Key<TicketNotes>> notes = TicketNotes.ticketNotesDao.listKeysByProperty(searchMap);

		TicketNotes.ticketNotesDao.deleteKeys(notes);
	}
	
	public static void main(String[] args)
	{
		String s = "hiiiiiiii\r\n\r\n2016-03-11 17:25 GMT+05:30 Sudha <sudha+QFp5CyjS4+199@helptor.com>:\r\n\r\n> Your request (#199) has been reviewed by support team.\r\n> [image: clickdesk-profile-pic]\r\n>\r\n> *Sudha*\r\n>\r\n> Mar 11, 11:55 AM (GMT)\r\n> hiiii\r\n>\r\n> Sent using Agile\r\n> <https://www.agilecrm.com?utm_source=powered-by&utm_medium=email-signature&utm_campaign=sudha>\r\n> [image: clickdesk-profile-pic]\r\n>\r\n> *sudha P*\r\n>\r\n> Mar 11, 5:57 AM (GMT)\r\n> మరియు మాత్రమే\r\n> వారు మీ వెబ్సైట్ లేదా కాల్ సందర్శించడానికి క్లిక్ చెల్లిస్తారు\r\n> [image: clickdesk-profile-pic]\r\n>\r\n> *Sudha*\r\n>\r\n> Mar 11, 5:57 AM (GMT)\r\n> వారు మీ వెబ్సైట్ లేదా కాల్ సందర్శించడానికి క్లిక్ చెల్లిస్తారు\r\n>\r\n> Sent using Agile\r\n> <https://www.agilecrm.com?utm_source=powered-by&utm_medium=email-signature&utm_campaign=sudha>\r\n> [image: clickdesk-profile-pic]\r\n>\r\n> *sudha P*\r\n>\r\n> Mar 11, 5:56 AM (GMT)\r\n> వారు మీరు శోధిస్తున్న సమయంలో ప్రకటనతో ప్రజలు చేరుకోవడానికి. మరియు మాత్రమే\r\n> వారు మీ వెబ్సైట్ లేదా కాల్ సందర్శించడానికి క్లిక్ చెల్లిస్తారు\r\n> This email is a service from My company. Delivered by Agile CRM\r\n> <https://www.agilecrm.com?utm_source=www.agilecrm.com?utm_source=powered-by&utm_medium=email-signature&utm_campaign=null>\r\n>\r\n";
		System.out.println(s);
		System.out.println("Quoted text........");
		System.out.println(removedQuotedRepliesFromPlainText(s));
		
		System.out.println("Next text..........");
		
		s = "Hi,\n\ndhaynadadsaf dsafndskanf sda\n\n\nThank you\n\n2016-03-19 22:49 GMT+05:30 sasi <sasi+OJ0FQV9Ae+5783832003346694@helptor.com\n>:\n\n> Your request (#5783832003346694) has been reviewed by support team.\n> [image: clickdesk-profile-pic]\n>\n> *sasi*\n>\n> Mar 19, 5:19 PM (GMT)\n> thnk you\n>\n> fadsf dsafdas fdsa\n>\n> f\n> sad fdsf safdsa fsa\n>\n> Sent using Agile\n> <https://www.agilecrm.com?utm_source=powered-by&utm_medium=email-signature&utm_campaign=sasi>\n> [image: clickdesk-profile-pic]\n>\n> *Sasi Jolla*\n>\n> Mar 19, 5:18 PM (GMT)\n> హల్లో\n>\n> డియర్ వెబ్ యజమాని,\n>\n> మరింత ఖాతాదారులకు మరియు వినియోగదారులు వాంట్?\n>\n> మేము వాటిని Google (Yahoo & బింగ్) లో * మొదటి పేజీ న మీరు పెట్టటం ద్వారా\n> మీరు కనుగొనడంలో సహాయంగా.\n>\n>\n> మేము ఈ సీజన్లో కొన్ని ప్రత్యేక ఆఫర్లు ఉన్నాయి.\n> This email is a service from My company. Delivered by Agile CRM\n> <https://www.agilecrm.com?utm_source=www.agilecrm.com?utm_source=powered-by&utm_medium=email-signature&utm_campaign=null>\n>\n\n\n";
		System.out.println(s);
		System.out.println("Quoted text........");
		System.out.println(removedQuotedRepliesFromPlainText(s));
	}
}