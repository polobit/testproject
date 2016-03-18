package com.agilecrm.ticket.entitys;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.TextNode;
import org.jsoup.select.Elements;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * <code>TicketNotes</code> class contains Tickets sent by requester and agent.
 * 
 * @author Sasi on 28-Sep-2015
 * 
 */
@XmlRootElement
public class TicketNotes
{
	// Key
	@Id
	public Long id;

	/**
	 * Stores ticket id
	 */
	private Key<Tickets> ticket_key = null;

	/**
	 * Util attribute to send ticket id to client
	 */
	@NotSaved
	public Long ticket_id = null;

	/**
	 * Stores ticket group id to which it belongs
	 */
	private Key<TicketGroups> group_key = null;

	/**
	 * Util attribute to send group id to client
	 */
	@NotSaved
	public Long group_id = null;

	/**
	 * Stores user ID to whom ticket is assigned
	 */
	private Key<DomainUser> assignee_key = null;

	/**
	 * Util attribute to send assignee id to client
	 */
	@NotSaved
	public Long assignee_id = null;

	public static enum CREATED_BY
	{
		AGENT, REQUESTER
	};

	/**
	 * Stores last updated by text either agent or customer
	 */
	public CREATED_BY created_by = CREATED_BY.REQUESTER;

	/**
	 * Stores name of customer who created ticket
	 */
	public String requester_name = "";

	/**
	 * Stores email of customer who created ticket
	 */
	public String requester_email = "";

	/**
	 * Stores epoch time when notes is created
	 */
	public Long created_time = 0L;

	/**
	 * Stores description exists in case of Rules & Macros
	 */
	public String event_description = "";

	/**
	 * Stores notes content in plain text format
	 */
	public String plain_text = "";

	/**
	 * Stores notes content in html text format
	 */
	public String html_text = "";

	/**
	 * Stores original notes content in plain text format
	 */
	@JsonIgnore
	public String original_plain_text = "";

	/**
	 * Stores original notes content in html text format
	 */
	@JsonIgnore
	public String original_html_text = "";

	/**
	 * Stores mime object
	 */
	public String mime_object = "";

	public static enum NOTE_TYPE
	{
		PUBLIC, PRIVATE
	};

	/**
	 * Stores type of notes
	 */
	public NOTE_TYPE note_type = NOTE_TYPE.PUBLIC;

	/**
	 * Stores list of attachments URL's saved in Google cloud
	 */
	@Embedded
	public List<TicketDocuments> attachments_list = new ArrayList<TicketDocuments>();

	/**
	 * Stores requested viewed time in epoch format
	 */
	public Long requester_viewed_time = 0L;

	/**
	 * Util attribute to send assignee id to client
	 */
	@NotSaved
	public DomainUserPartial domain_user = null;

	/**
	 * Stores CC email addresses if ticket have any
	 */
	@NotSaved
	public List<String> cc_emails = new ArrayList<String>();

	/**
	 * Saves ticket close status when agent sending reply
	 */
	@NotSaved
	public boolean close_ticket = false;

	/**
	 * Default constructor
	 */
	public TicketNotes()
	{
		super();
	}

	public TicketNotes(Long ticket_id, Long group_id, Long assignee_id, CREATED_BY created_by, String requester_name,
			String requester_email, String original_plain_text, String original_html_text, NOTE_TYPE note_type,
			List<TicketDocuments> attachments_list, String mimeObject)
	{
		super();

		this.ticket_key = new Key<Tickets>(Tickets.class, ticket_id);

		if (group_id != null)
			this.group_key = new Key<TicketGroups>(TicketGroups.class, group_id);

		if (assignee_id != null)
			this.assignee_key = new Key<DomainUser>(DomainUser.class, assignee_id);

		this.created_by = created_by;
		this.requester_name = requester_name;
		this.requester_email = requester_email;
		this.original_plain_text = original_plain_text;
		this.original_html_text = original_html_text;
		this.note_type = note_type;
		this.attachments_list = attachments_list;
		this.created_time = Calendar.getInstance().getTimeInMillis();

		this.plain_text = TicketNotesUtil.removedQuotedRepliesFromPlainText(original_plain_text);
		this.html_text = TicketNotesUtil.removedQuotedRepliesFromHTMLText(original_html_text);

		this.mime_object = mimeObject;
	}

	public TicketNotes save()
	{
		TicketNotes.ticketNotesDao.put(this);

		try
		{
			Tickets ticket = TicketsUtil.getTicketByID(ticket_key.getId());

			if (ticket.user_replies_count == 1)
				return this;

			boolean isPublicNotes = (note_type == NOTE_TYPE.PUBLIC);

			ActivityType activityType = (isPublicNotes) ? ((created_by == CREATED_BY.AGENT) ? ActivityType.TICKET_ASSIGNEE_REPLIED
					: ActivityType.TICKET_REQUESTER_REPLIED)
					: ActivityType.TICKET_PRIVATE_NOTES_ADD;

			// Sending reply to requester if and only if notes type is public
			if (isPublicNotes)
			{
				if (created_by == CREATED_BY.AGENT)
					// Send email thread to user
					TicketNotesUtil.sendReplyToRequester(ticket);

				if (created_by == CREATED_BY.AGENT)
					// Execute note created by agent trigger
					TicketTriggerUtil.executeTriggerForNewNoteAddedByCustomer(ticket);
				else
					// Execute note created by user trigger
					TicketTriggerUtil.executeTriggerForNewNoteAddedByUser(ticket);
			}

			// Logging notes activity
			ActivityUtil.createTicketActivity(activityType, ticket.contactID, ticket.id, plain_text, html_text,
					"html_text");
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return this;
	}

	@javax.persistence.PostLoad
	private void PostLoad()
	{
		if (ticket_key != null)
			ticket_id = ticket_key.getId();

		if (group_key != null)
			group_id = group_key.getId();

		if (assignee_key != null)
			assignee_id = assignee_key.getId();
	}

	/**
	 * Initialize DataAccessObject
	 */
	public static ObjectifyGenericDao<TicketNotes> ticketNotesDao = new ObjectifyGenericDao<TicketNotes>(
			TicketNotes.class);
}
