package com.agilecrm.ticket.utils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.safety.Whitelist;

import com.agilecrm.Globals;
import com.agilecrm.account.util.AccountPrefsUtil;
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
import com.agilecrm.util.MD5Util;
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

		return inclDomainUsers(notes);
	}

	/**
	 * 
	 * @param ticket_id
	 * @param group_id
	 * @param created_by
	 * @param requester_name
	 * @param requester_email
	 * @param original_plain_text
	 * @param original_html_text
	 * @param note_type
	 * @param attachments_list
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static TicketNotes createTicketNotes(Long ticket_id, Long group_id, Long assignee_id, CREATED_BY created_by,
			String requester_name, String requester_email, String original_plain_text, String original_html_text,
			NOTE_TYPE note_type, List<TicketDocuments> attachments_list, String mimeObject)
			throws EntityNotFoundException
	{
		TicketNotes ticketNotes = new TicketNotes(ticket_id, group_id, assignee_id, created_by, requester_name,
				requester_email, removedQuotedReplies(original_plain_text), removedQuotedReplies(original_html_text),
				original_plain_text, original_html_text, note_type, attachments_list, mimeObject);

		Key<TicketNotes> key = TicketNotes.ticketNotesDao.put(ticketNotes);

		System.out.println("Notes key: " + key.getId());

		return ticketNotes;
	}

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

		TicketGroups group = TicketGroupUtil.getTicketGroupById(ticket.groupID);

		String groupName = group.group_name;
		String agentName = DomainUserUtil.getDomainUser(ticket.assigneeID).name;

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

			JSONObject eachNoteJSON = getFormattedEmailNoteJSON(notes);

			if (eachNoteJSON != null)
				notesArray.put(eachNoteJSON);
		}

		json.put("note_json_array", notesArray);

		System.out.println("notesArray: " + notesArray);

		String fromAddress = NamespaceManager.get() + "+" + TicketGroupUtil.getShortGroupID(group.id) + "+"
				+ TicketsUtil.getTicketShortID(ticket.id) + Globals.INBOUND_EMAIL_SUFFIX;

		sendEmail(ticket.requester_email, ticket.subject, agentName, fromAddress, ticket.cc_emails,
				SendMail.TICKET_REPLY, json);
	}

	/**
	 * 
	 * @param notes
	 * @return
	 * @throws Exception
	 */
	public static JSONObject getFormattedEmailNoteJSON(TicketNotes notes) throws Exception
	{
		Map<Long, DomainUser> domainUsersMap = new HashMap<Long, DomainUser>();

		JSONObject json = new JSONObject();

		json.put("created_time", DateUtil.getCalendarString(notes.created_time, "MMM d, h:mm a (z)", ""));

		json.put("plain_text", notes.plain_text);
		json.put("html_text", TicketNotesUtil.parseHtmlText(notes.html_text));

		if (notes.attachments_list != null && notes.attachments_list.size() > 0)
		{
			json.put("attachments_exists", true);
			json.put("attachments_list", notes.attachments_list);
		}

		if (notes.created_by == CREATED_BY.AGENT)
		{
			if (!domainUsersMap.containsKey(notes.assignee_id))
				domainUsersMap.put(notes.assignee_id, DomainUserUtil.getDomainUser(notes.assignee_id));

			DomainUser user = domainUsersMap.get(notes.assignee_id);

			json.put("user_name", user.name);
			json.put("img_url", user.getOwnerPic());
		}
		else
		{
			json.put("user_name", notes.requester_name);
			json.put("img_url", Globals.GRAVATAR_SECURE_IMAGE_URL + MD5Util.getMD5Code(notes.requester_email));
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

			Map<Long, DomainUser> map = new HashMap<Long, DomainUser>();

			NamespaceManager.set("");

			for (TicketNotes note : notes)
			{
				if (note.created_by == CREATED_BY.REQUESTER)
					continue;

				System.out.println(note.assignee_id);

				domainUserKeys.add(new Key<DomainUser>(DomainUser.class, note.assignee_id));
			}

			System.out.println("domainUserKeys: " + domainUserKeys);

			List<DomainUser> domainUsers = DomainUserUtil.dao.fetchAllByKeys(new ArrayList<Key<DomainUser>>(
					domainUserKeys));

			System.out.println("domainUsers: " + domainUsers);

			for (DomainUser domainUser : domainUsers)
				map.put(domainUser.id, domainUser);

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
	public static String parsePlainText(String plainText)
	{
		// parse plain text
		return plainText.replaceAll("(\r\n|\n\r|\r|\n)", "<br />");
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
	 * Removes quoted replies in received ticket.
	 * 
	 * @param text
	 * @param fromAddress
	 * @return sent only last typed reply
	 */
	private static String removedQuotedReplies(String text)
	{
		try
		{
			if (StringUtils.isBlank(text))
				return text;

			Pattern pattern = Pattern.compile("On.*?wrote:.*?", Pattern.DOTALL);
			text = pattern.split(text)[0];
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		return text;
	}

	/**
	 * 
	 * @param ticketID
	 * @param notesID
	 * @throws Exception
	 */
	public static void updateRequestedViewedTime(String ticketID, String notesID) throws Exception
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

	public static String br2nl(String html)
	{
		if (html == null)
			return html;

		Document document = Jsoup.parse(html);
		document.outputSettings(new Document.OutputSettings().prettyPrint(false));
		document.select("br").append("\\n");
		document.select("p").prepend("\\n\\n");
		String s = document.html().replaceAll("\\\\n", "\n");

		return Jsoup.clean(s, "", Whitelist.none(), new Document.OutputSettings().prettyPrint(false));
	}

	/** Example */
	public static void main(String[] args) throws Exception
	{
		JSONArray notesArray = new JSONArray();
		
		JSONObject json = new JSONObject();
		json.put("img_url", "https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/11.png");
		json.put("user_name", "Sasi");
		json.put("plain_text", "fdsafd asf dsa f dasf das ");

		JSONArray attachmentsArray = new JSONArray();
		JSONObject attchments = new JSONObject();
		json.put("url", "attachemnt_url");
		json.put("name", "file.pdf");
		
		attachmentsArray.put(attchments);
		
		json.put("attachments_exists", true);
		json.put("attachments_list", attachmentsArray);
		
		notesArray.put(json);
		
		String template = "{{#note_json_array}}{{img_url}}, {{user_name}} {{plain_text}} {{#attachments_exists}}{{#attachments_list}} {{url}} {{name}} {{/attachments_list}}{{/attachments_exists}}{{/note_json_array}}";
		
		System.out.println(MustacheUtil.compile(template, new JSONObject().put("note_json_array", notesArray)));
	}
}