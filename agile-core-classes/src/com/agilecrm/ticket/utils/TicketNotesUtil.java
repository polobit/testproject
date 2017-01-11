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
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import com.agilecrm.Globals;
import com.agilecrm.account.EmailTemplates;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.account.util.EmailTemplatesUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.projectedpojos.TicketNotesPartial;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.VersioningUtil;
import com.agilecrm.util.email.MustacheUtil;
import com.agilecrm.util.email.SendMail;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.urlshortener.util.Base62;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

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
		try{
			
			return TicketNotes.ticketNotesDao.get(notesID);
		}
		
		catch(Exception e){
			
			return null;
		}
	}

	/**
	 * 
	 * @param ticketID
	 * @param sortOrder
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static TicketNotesPartial getTicketNotesPartialByID(Long notesID) throws EntityNotFoundException
	{			
		return TicketNotes.partialDAO.get(notesID);
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

		// Formatting plain text content
		for (TicketNotes note : notes)
		{
			
			// note.plain_text = StringEscapeUtils.escapeHtml(note.plain_text);
			note.plain_text = TicketNotesUtil.convertNewLinesToBreakTags(note.plain_text);
		}

		// return inclDomainUsers(notes);
		return notes;
	}
	/**
	 * 
	 * @param noteID,feedback
	 * @return
	 * @throws EntityNotFoundException 
	 */
	public static void savefeedback(Long noteId,String feedback) throws EntityNotFoundException
	{
		TicketNotes dbnote = TicketNotes.ticketNotesDao.get(noteId);
		 
		dbnote.feed_back = feedback;
		TicketNotes.ticketNotesDao.put(dbnote);
		
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
		Contact contact = ContactUtil.getContact(ticket.contact_key.getId());

		// Converting contact object to json object
		JSONObject json = AgileTaskletUtil.getSubscriberJSON(contact);
		json = json.getJSONObject("data");

		System.out.println("json: " + json);

		// JSONObject json = new JSONObject();

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

		Boolean groupFeedback = group.feedback_flag;
		String groupName = group.group_name;
		String agentName = DomainUserUtil.getDomainUser(ticket.assigneeID).name;

		if (StringUtils.isBlank(agentName))
			agentName = "";

		json.put("ticket_id", ticket.id);
		json.put("group_name", groupName);
		json.put("agent_name", agentName);
		json.put("tracking_img", appendTrackingImage(ticket.id, notesList.get(0).id));

		json.put("feedback_flag",groupFeedback);
		String companyName = AccountPrefsUtil.getAccountPrefs().company_name;

		if (companyName != null)
			json.put("company_name", companyName);

		System.out.println("notesList.get(0).id): " + notesList.get(0).id);

		String domain = DomainUserUtil.getDomainUser(ticket.assigneeID).domain;
		 		
		 		Subscription subscription = new Subscription().getSubscriptionOfParticularDomain(domain);
		 
		 		Plan emailPlan = subscription.emailPlan;
		 		System.out.println(emailPlan);
		 		String email_pan = SubscriptionUtil.getEmailPlan(subscription.plan.quantity);
		 		json.put("subscription_email", "");
		 	
		 		if(emailPlan == null)
		 		{
		 			json.put("subscription_email", "email_plan");
		 		}
		 		
		 		System.out.println(email_pan);		
		 	
	    int count =0; 		
		JSONArray notesArray = new JSONArray();

		// Add all notes
		for (TicketNotes notes : notesList)
		{
			if (notes.note_type == NOTE_TYPE.PRIVATE)
				continue;

			JSONObject eachNoteJSON = getFormattedEmailNoteJSON(notes, contact,count );

			if (eachNoteJSON != null)
				notesArray.put(eachNoteJSON);
				count++;
		}

		json.put("note_json_array", notesArray);

		// Set merge fields data
		json.put("subject", ticket.subject);
		json.put("requester_name", ticket.requester_name);
		json.put("requester_email", ticket.requester_email);
		json.put("priority", StringUtils.capitalize(ticket.priority.toString()));
		json.put("status", StringUtils.capitalize(ticket.status.toString()));

		System.out.println("notesArray: " + notesArray);

		String html = prepareHTML(group, json);

		System.out.println("HTML:");
		// System.out.println(html);

		String fromAddress = group.group_email;
		String replyTo = null;
		
		fromAddress = StringUtils.isNotBlank(group.send_as) ? group.send_as : fromAddress;
		
		if( ticket != null )
		{
			replyTo = TicketsUtil.getTicketReplyToEmailAddress(group.group_email, ticket.id.toString());
		}

		sendEmail(ticket.requester_email, ticket.subject, agentName, fromAddress, ticket.cc_emails, html, replyTo);
	}

	public static String prepareHTML(TicketGroups group, JSONObject dataJSON)
	{
		try
		{
			// No template is chosen so returning default template html content
			if (group.template_id == null)
				return MustacheUtil.templatize(SendMail.TICKET_REPLY + SendMail.TEMPLATE_HTML_EXT, dataJSON, UserPrefs.DEFAULT_LANGUAGE);

			dataJSON.put("ticket_comments",
					MustacheUtil.templatize(SendMail.TICKET_COMMENTS + SendMail.TEMPLATE_HTML_EXT, dataJSON, UserPrefs.DEFAULT_LANGUAGE));
			dataJSON.put("ticket_footer",
					MustacheUtil.templatize(SendMail.TICKET_FOOTER + SendMail.TEMPLATE_HTML_EXT, dataJSON, UserPrefs.DEFAULT_LANGUAGE));

			EmailTemplates emailTemplates = EmailTemplatesUtil.getEmailTemplate(group.template_id);

			return MustacheUtil.compile(emailTemplates.text, dataJSON);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return "";
	}

	public static void sendEmail(String toAddress, String subject, String fromName, String fromEmail,
			List<String> ccEmails, String emailHTML) throws Exception
	{
		sendEmail(toAddress, subject, fromName, fromEmail, ccEmails, emailHTML, null);
		
//		String oldNamespace = NamespaceManager.get();
//
//		try
//		{
//			// Read template - HTML
//			// String emailHTML = MustacheUtil.templatize(template +
//			// SendMail.TEMPLATE_HTML_EXT, dataJSON);
//
//			// JSONObject mailJSON = Mandrill.setMandrillAPIKey(null,
//			// NamespaceManager.get(), null);
//
//			String ccEmailString = "";
//			for (String ccEmail : ccEmails)
//				ccEmailString += ccEmail + ",";
//
//			// All email params are inserted into Message json
//			// JSONObject messageJSON = Mandrill.getMessageJSON("", fromEmail,
//			// fromName, toAddress, ccEmailString, "", "",
//			// subject, emailHTML, emailBody, "", "");
//			//
//			// mailJSON.put(Mandrill.MANDRILL_MESSAGE, messageJSON);
//			//
//			// System.out.println("mailJSON: " + mailJSON);
//			long start_time = System.currentTimeMillis();
//
//			NamespaceManager.set("");
//
//			EmailGatewayUtil.sendEmail(null, NamespaceManager.get(), fromEmail, fromName, toAddress, ccEmailString, "",
//					subject, "", emailHTML, "", "", null, null);
//
//			// response =
//			// HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL
//			// + Mandrill.MANDRILL_API_MESSAGE_CALL,
//			// mailJSON.toString());
//
//			long process_time = System.currentTimeMillis() - start_time;
//
//			System.out.println("Process time for sending mandrill " + process_time + "ms");
//
//			NamespaceManager.set(oldNamespace);
//		}
//		catch (Exception e)
//		{
//			System.out.println(ExceptionUtils.getFullStackTrace(e));
//		}
//		finally
//		{
//			NamespaceManager.set(oldNamespace);
//		}
	}

	public static void sendEmail(String toAddress, String subject, String fromName, String fromEmail,
			List<String> ccEmails, String emailHTML, String replyTo) throws Exception
	{
		HashMap<String, Object> options = new HashMap<>();
		
		options.put("toAddress", toAddress);
		options.put("subject", subject);
		options.put("fromName", fromName);
		options.put("fromEmail", fromEmail);
		options.put("ccEmails", ccEmails);
		options.put("emailHTML", emailHTML);
		
		if( StringUtils.isNotBlank(replyTo) )	options.put("replyTo", replyTo);
		
		sendEmail(options);
	}

	public static void sendEmail(HashMap<String, Object> options) throws Exception
	{
		if( options == null )	return;
		
		String toAddress = (String) options.get("toAddress");
		String subject = (String) options.get("subject");
		String fromName = (String) options.get("fromName");
		String fromEmail = (String) options.get("fromEmail");
		List<String> ccEmails = (List<String>) options.get("ccEmails");
		String emailHTML = (String) options.get("emailHTML");
		String replyTo = (options.containsKey("replyTo")) ? (String) options.get("replyTo") : "";
		
		
		String oldNamespace = NamespaceManager.get();

		try
		{
			// Read template - HTML
			// String emailHTML = MustacheUtil.templatize(template +
			// SendMail.TEMPLATE_HTML_EXT, dataJSON);

			// JSONObject mailJSON = Mandrill.setMandrillAPIKey(null,
			// NamespaceManager.get(), null);

			String ccEmailString = "";
			for (String ccEmail : ccEmails)
				ccEmailString += ccEmail + ",";

			// All email params are inserted into Message json
			// JSONObject messageJSON = Mandrill.getMessageJSON("", fromEmail,
			// fromName, toAddress, ccEmailString, "", "",
			// subject, emailHTML, emailBody, "", "");
			//
			// mailJSON.put(Mandrill.MANDRILL_MESSAGE, messageJSON);
			//
			// System.out.println("mailJSON: " + mailJSON);
			long start_time = System.currentTimeMillis();

			NamespaceManager.set("");

			EmailGatewayUtil.sendEmail(null, NamespaceManager.get(), fromEmail, fromName, toAddress, ccEmailString, "",
					subject, replyTo, emailHTML, "", "", null, null);

			// response =
			// HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL
			// + Mandrill.MANDRILL_API_MESSAGE_CALL,
			// mailJSON.toString());

			long process_time = System.currentTimeMillis() - start_time;

			System.out.println("Process time for sending mandrill " + process_time + "ms");

			NamespaceManager.set(oldNamespace);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}

	
	public static JSONArray getJsonFeedback(Long startTime, Long endTime, String feedback, Long group, Long assignee) throws Exception{
		
		JSONArray json = new JSONArray();
		
		Map<String, Object> map =  new HashMap<String, Object>(); 
		
		map.put("created_by", CREATED_BY.AGENT);
		map.put("feedback_time >", startTime);
		map.put("feedback_time <", endTime);
		map.put("feedback_flag", true);
		
		if(StringUtils.isNotEmpty(feedback))
			map.put("feed_back",feedback);	
		
		List<TicketNotes> ticketnotes = TicketNotes.ticketNotesDao.listByProperty(map);
		
		Map<String, Object> map2 =  new HashMap<String, Object>(); 
		
		map2.put("created_by", CREATED_BY.AGENT);
		map2.put("created_time >", startTime);
		map2.put("created_time <", endTime);
		map2.put("feedback_flag", true);

		if(StringUtils.isNotEmpty(feedback))
			map2.put("feed_back",feedback);
		
		List<TicketNotes> ticketnotes2 = TicketNotes.ticketNotesDao.listByProperty(map2);
		
		ticketnotes.addAll(ticketnotes2);
		
		Set<TicketNotes> hs = new HashSet<>();
		
		hs.addAll(ticketnotes);
		ticketnotes.clear();
		ticketnotes.addAll(hs);
		
		for(TicketNotes tn: ticketnotes ){
				
				if(group != 0){
					if(tn.group_id.longValue()!=group)
						continue;
				}		
				if(assignee != 0){
					if(tn.assignee_id.longValue()!=assignee)
						continue;
				}		
				
				
				JSONObject jsonobject = new JSONObject();
				jsonobject.append("note", tn.html_text);
				jsonobject.append("feedback_comment", tn.feedback_comment);
				jsonobject.append("feedback", tn.feed_back);
				jsonobject.append("created_time", tn.feedback_time);
				jsonobject.append("note_created_time", tn.created_time);
		
				Long ticketfeedback_id = tn.ticket_id;		
				
				Tickets ticket = Tickets.ticketsDao.get(ticketfeedback_id);
				
				jsonobject.append("ticket_subject", ticket.subject);
				jsonobject.append("contact_id", ticket.contactID);
												
				String assignee_name;
		
				
				try{
						Long assigneeid = (tn.assignee_id);
						  
						String agentName = DomainUserUtil.getDomainUser((assigneeid)).name;
						
						assignee_name = agentName;
				}

				catch(Exception e){
					
					assignee_name = "";
				}
					
				jsonobject.append("assignee_name",assignee_name );
				
				Contact contact = ContactUtil.getContact(ticket.contactID);
				
				String imageURL = null; 
				
				if(contact != null){
					
					jsonobject.append("first_name",contact.first_name );
					jsonobject.append("last_name",contact.last_name );
				
				
					imageURL = contact.getContactFieldValue(Contact.IMAGE);
				
				}
				
				if (imageURL == null)			
					imageURL = Globals.GRAVATAR_SECURE_DEFAULT_IMAGE_URL;

				jsonobject.append("img_url", imageURL);

				jsonobject.append("ticket_id",tn.ticket_id);
				jsonobject.append("id",tn.id);
				
				json.put(jsonobject);
			}
			
			System.out.println(json);
		return json;
	}
	/**
	 * 
	 * @param notes
	 * @return
	 * @throws Exception
	 */
	public static JSONObject getFormattedEmailNoteJSON(TicketNotes notes, Contact contact , int count) throws Exception
	{
		Map<Long, DomainUser> domainUsersMap = new HashMap<Long, DomainUser>();

		String oldNamespace = NamespaceManager.get();
		
		JSONObject json = new JSONObject();

		

		
		if(count == 0){
			
		//creating encoded urls for feedback
		for(int i=1;i<=5;i++ ){
			
			String url= Base62.fromDecimalToOtherBase(62, i)+"-"+Base62.fromDecimalToOtherBase(62, notes.id)+"-"+Base62.fromDecimalToOtherBase(62, contact.id);
	
			json.put("url"+i, url);
		}
		
		json.put("count", true);
		json.put("namespace", oldNamespace);
		json.put("note_id", notes.id);
		json.put("contactid", contact.id);
		}
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

			Document doc = Jsoup.parseBodyFragment(html, "UTF-8");

			// Right now considering only mails from gmail
			for (Element element : doc.select("div.gmail_extra"))
				element.remove();

			return doc.body().html();
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
}