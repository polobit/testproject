package com.agilecrm.ticket.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.MD5Util;
import com.agilecrm.util.email.MustacheUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
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
	 */
	public static TicketNotes createTicketNotes(Long ticket_id, Long group_id, Long assignee_id, CREATED_BY created_by,
			String requester_name, String requester_email, String original_plain_text, String original_html_text,
			NOTE_TYPE note_type, List<String> attachments_list)
	{
		TicketNotes ticketNotes = new TicketNotes(ticket_id, group_id, assignee_id, created_by, requester_name,
				requester_email, removedQuotedReplies(original_plain_text, requester_email), removedQuotedReplies(
						original_html_text, requester_email), original_plain_text, original_html_text, note_type,
				attachments_list);

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

		TicketGroups group = TicketGroupUtil.getTicketGroupById(ticket.groupID);

		String groupName = group.group_name;
		String agentName = DomainUserUtil.getDomainUser(ticket.assigneeID).name;

		json.put("ticket_id", ticket.id);
		json.put("group_name", groupName);
		json.put("agent_name", agentName);

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

		JSONObject json = new JSONObject();

		json.put("created_time", DateUtil.getCalendarString(notes.created_time, "MMM d, h:mm a (z)", ""));

		json.put("plain_text", TicketNotesUtil.parsePlainText(notes.plain_text));
		json.put("html_text", TicketNotesUtil.parseHtmlText(notes.html_text));

		if (notes.created_by == CREATED_BY.AGENT)
		{
			DomainUser user = DomainUserUtil.getDomainUser(notes.assignee_id);

			json.put("name", user.name);
			json.put("img_url", user.getOwnerPic());
		}
		else
		{
			json.put("name", notes.requester_name);
			json.put("img_url", Globals.GRAVATAR_SECURE_IMAGE_URL + MD5Util.getMD5Code(notes.requester_email));
		}

		return json;
	}

	public static void sendEmail(String toAddress, String subject, String fromName, String fromEmail, String ccEmails,
			String template, JSONObject dataJSON) throws Exception
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

		// All email params are inserted into Message json
		JSONObject messageJSON = Mandrill.getMessageJSON("", fromEmail, fromName, toAddress, ccEmails, "", "", subject,
				emailHTML, emailBody, "", "");

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
	public static String parsePlainText(String original_plain_text)
	{
		// parse plain text
		return original_plain_text.replaceAll("(\r\n|\n)", "<br/>");
	}

	/**
	 * 
	 * @param original_html_text
	 * @return
	 */
	public static String parseHtmlText(String original_html_text)
	{
		// parse plain text
		return original_html_text;
	}

	/**
	 * Removes quoted replies in received ticket.
	 * 
	 * @param text
	 * @param fromAddress
	 * @return sent only last typed reply
	 */
	private static String removedQuotedReplies(String text, String fromAddress)
	{
		try
		{
			Pattern pattern = Pattern.compile("On.*?wrote:.*?", Pattern.DOTALL);
			text = pattern.split(text)[0];
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		return text;
	}

	public static void main(String[] args) throws Exception
	{
		System.out.println(MustacheUtil
				.templatize(SendMail.TICKET_REPLY + SendMail.TEMPLATE_HTML_EXT, new JSONObject()));
		System.out.println(MustacheUtil.templatize("start_event_reminder" + SendMail.TEMPLATE_HTML_EXT,
				new JSONObject()));
	}
}