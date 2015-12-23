package com.agilecrm.ticket.deferred;

import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.ticket.entitys.TicketActivity;
import com.agilecrm.ticket.entitys.TicketActivity.TicketActivityType;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

public class ZendeskFetchAudits implements DeferredTask
{
	Tickets ticket = null;
	String zendeskPrefs = "";

	public ZendeskFetchAudits(Tickets ticket, String zendeskPrefs)
	{
		super();
		this.ticket = ticket;
		this.zendeskPrefs = zendeskPrefs;
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public void run()
	{
		try
		{
			JSONObject json = new JSONObject(zendeskPrefs);
			String username = json.getString("zendesk_username");
			String password = json.getString("zendesk_password");

			URI uri = new URI(json.getString("zendesk_url"));

			String url = "https://" + uri.getHost() + "/api/v2/tickets/" + ticket.id + "/audits.json?include=users";

			String response = HTTPUtil.accessURLUsingAuthentication(url, username, password, "GET", "", false,
					"application/json", "application/json");

			JSONObject responseJSON = new JSONObject(response);

			JSONArray audits = new JSONArray(responseJSON.getJSONArray("audits")), users = new JSONArray(
					responseJSON.getJSONArray("users"));

			Map<Long, DomainUser> domainUsersMap = new HashMap<Long, DomainUser>();
			Map<Long, Contact> contactsMap = new HashMap<Long, Contact>();

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

				DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);

				if (domainUser != null)
					domainUsersMap.put(id, domainUser);
			}

			for (int i = 0; i < audits.length(); i++)
			{
				JSONObject auditJSON = audits.getJSONObject(i);

				Date date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").parse(auditJSON.getString("created_at"));

				Long id = auditJSON.getLong("author_id");

				if (domainUsersMap.containsKey(id))
					continue;

				if (contactsMap.containsKey(id))
					continue;

				JSONArray eventsArray = auditJSON.getJSONArray("events");

				for (int j = 0; j < eventsArray.length(); j++)
				{
					JSONObject eventJSON = eventsArray.getJSONObject(j);
					id = auditJSON.getLong("author_id");

					boolean repliedByEndUser = (domainUsersMap.get(id) != null) ? false : true;

					if (eventJSON.getString("type").equalsIgnoreCase("Comment"))
					{
						String body = eventJSON.getString("body");

						if (eventJSON.getBoolean("public"))
						{
							if (repliedByEndUser)
							{
								// Creating new Notes in TicketNotes table
								TicketNotesUtil.createTicketNotes(ticket.id, ticket.groupID, 0l, CREATED_BY.REQUESTER,
										ticket.requester_name, ticket.requester_email, body, body, NOTE_TYPE.PUBLIC,
										new ArrayList<TicketDocuments>());

								// Logging private notes activity
								new TicketActivity(TicketActivityType.TICKET_REQUESTER_REPLIED, ticket.contactID,
										ticket.id, body, body, "html_text").save();
							}
							else
							{
								TicketNotesUtil.createTicketNotes(ticket.id, ticket.groupID, ticket.assigneeID,
										CREATED_BY.AGENT, ticket.requester_name, ticket.requester_email, body, body,
										NOTE_TYPE.PUBLIC, new ArrayList<TicketDocuments>());

								// Logging private notes activity
								new TicketActivity(TicketActivityType.TICKET_ASSIGNEE_REPLIED, ticket.contactID,
										ticket.id, body, body, "html_text").save();
							}
						}
						else
						{
							DomainUser domainUser = domainUsersMap.get(id);

							TicketNotes ticketNotes = TicketNotesUtil.createTicketNotes(ticket.id, null, domainUser.id,
									CREATED_BY.AGENT, "", "", body, body, NOTE_TYPE.PRIVATE,
									new ArrayList<TicketDocuments>());

							// Logging private notes activity
							new TicketActivity(TicketActivityType.TICKET_PRIVATE_NOTES_ADD, ticket.contactID,
									ticket.id, body, body, "html_text").save();
						}
					}
				}
			}
		}
		catch (JSONException e)
		{
			e.printStackTrace();
		}
		catch (URISyntaxException e)
		{
			e.printStackTrace();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}
