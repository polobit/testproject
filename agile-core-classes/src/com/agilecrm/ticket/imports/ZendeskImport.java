package com.agilecrm.ticket.imports;

import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.ticket.deferred.ZendeskFetchAudits;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.entitys.Tickets.Type;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;

public class ZendeskImport
{
	public static void fetchTickets(JSONObject json) throws Exception
	{
		DomainUser domainOwner = DomainUserUtil.getDomainOwner(NamespaceManager.get());

		String username = json.getString("zendesk_username");
		String password = json.getString("zendesk_password");

		URI uri = new URI(json.getString("zendesk_url"));

		String url = "https://" + uri.getHost() + "/api/v2/tickets.json?include=users";

		System.out.println("url: " + url);

		String response = HTTPUtil.accessURLUsingAuthentication(url, username, password, "GET", "", false,
				"application/json", "application/json");

		JSONObject responseJSON = new JSONObject(response);

		JSONArray tickets = responseJSON.getJSONArray("tickets"), users = responseJSON.getJSONArray("users");

		System.out.println("Fetched tickets count: " + tickets.length());
		System.out.println("Fetched users count: " + users.length());

		Map<Long, DomainUser> domainUsersMap = new HashMap<Long, DomainUser>();
		Map<Long, Contact> contactsMap = new HashMap<Long, Contact>();

		// Preparing domain users and contacts map
		for (int i = 0; i < users.length(); i++)
		{
			JSONObject user = users.getJSONObject(i);

			Long id = user.getLong("id");

			if (domainUsersMap.containsKey(id))
				continue;

			if (contactsMap.containsKey(id))
				continue;

			String email = user.getString("email");

			if ("end-user".equalsIgnoreCase(user.getString("role")))
			{
				Contact contact = ContactUtil.searchContactByEmail(email);

				if (contact == null)
					contact = ContactUtil.createContact(user.getString("name"), email);

				contactsMap.put(id, contact);
				continue;
			}

			DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail("sasi@clickdesk.com");
			
			if (domainUser != null)
				domainUsersMap.put(id, domainUser);
		}

		System.out.println("domainUsersMap count: " + domainUsersMap.size());

		TicketGroups supportGroup = TicketGroupUtil.getDefaultTicketGroup();

		for (int i = 0; i < tickets.length(); i++)
		{
			JSONObject ticketJSON = tickets.getJSONObject(i);

			Tickets ticket = new Tickets();
			ticket.subject = ticketJSON.getString("subject");

			if (ticketJSON.has("type"))
				try
				{
					ticket.type = Type.valueOf(ticketJSON.getString("type").toUpperCase());
				}
				catch (Exception e)
				{
				}

			ticket.group_id = new Key<>(TicketGroups.class, supportGroup.id);
			ticket.groupID = supportGroup.id;

			ticket.first_notes_text = ticketJSON.getString("description");
			ticket.last_reply_text = ticketJSON.getString("description");

			Contact contact = contactsMap.get(ticketJSON.getLong("requester_id"));

			// Requester can be domain user in Zendesk. So if contact is null
			// then create a contact with the domain id.
			if (contact == null)
			{
				DomainUser user = null;

				if (domainUsersMap.containsKey(ticketJSON.getLong("requester_id")))
					user = domainUsersMap.get(ticketJSON.getLong("requester_id"));
				else
					user = domainOwner;

				contact = ContactUtil.createContact(user.name, user.email);

				contactsMap.put(ticketJSON.getLong("requester_id"), contact);
			}

			ticket.requester_name = contact.first_name;
			ticket.requester_email = contact.getContactFieldValue("email");
			ticket.contact_key = new Key<>(Contact.class, contact.id);
			ticket.contactID = contact.id;

			String priority = ticketJSON.getString("priority");

			if (StringUtils.isBlank(priority))
				priority = "low";

			switch (priority)
			{
			case "urgent":
			case "high":
				ticket.priority = Priority.HIGH;
				break;
			case "normal":
				ticket.priority = Priority.MEDIUM;
				break;
			case "low":
				ticket.priority = Priority.LOW;
				break;
			}

			String status = ticketJSON.getString("status");

			if (StringUtils.isBlank(priority))
				status = "open";

			switch (status)
			{
			case "new":
				ticket.status = Status.NEW;
				break;
			case "open":
				ticket.status = Status.OPEN;
				break;
			case "pending":
			case "hold":
				ticket.status = Status.PENDING;
				break;
			case "closed":
			case "solved":
				ticket.status = Status.CLOSED;
				break;
			}

			if (ticket.status != Status.NEW)
			{
				DomainUser assignee = null;

				if (domainUsersMap.containsKey(ticketJSON.getLong("assignee_id")))
					assignee = domainUsersMap.get(ticketJSON.getLong("assignee_id"));
				else
					assignee = domainOwner;

				ticket.assignee_id = new Key<DomainUser>(DomainUser.class, assignee.id);
				ticket.assigneeID = assignee.id;
				ticket.assigned_time = 0l;
			}

			String createdAt = ticketJSON.getString("created_at");
			String updatedAt = ticketJSON.getString("updated_at");
			String datePattern = "yyyy-MM-dd'T'HH:mm:ss'Z'";

			Date date = new SimpleDateFormat(datePattern).parse(createdAt);
			ticket.created_time = date.getTime();

			date = new SimpleDateFormat(datePattern).parse(updatedAt);
			ticket.last_updated_time = date.getTime();

			if(ticket.status == Status.CLOSED)
				ticket.closed_time = date.getTime();
			
			if (ticketJSON.has("collaborator_ids"))
			{
				JSONArray ccEmails = ticketJSON.getJSONArray("collaborator_ids");

				List<String> ccEmailsList = new ArrayList<>();

				for (int j = 0; j < ccEmails.length(); j++)
					ccEmailsList.add(ccEmails.getString(j));

				ticket.cc_emails = ccEmailsList;
			}

			ticket.saveWithNewID();

			// Create search document
			new TicketsDocument().add(ticket);

			// Logging ticket created activity
			ActivityUtil.createTicketActivity(ActivityType.TICKET_CREATED, ticket.contactID, ticket.id,
					ticketJSON.getString("description"), ticketJSON.getString("description"), "last_reply_text");
			// activity.created_time = date.getTime();
			// activity.save();

			ZendeskFetchAudits fetchAudits = new ZendeskFetchAudits(ticket, json.toString());
			TaskOptions options = TaskOptions.Builder.withPayload(fetchAudits);
			Queue queue = QueueFactory.getQueue(AgileQueues.TICKET_BULK_ACTIONS_QUEUE);
			queue.add(options);
		}
	}
}
