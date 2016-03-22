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

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.NamespaceManager;
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
			DomainUser domainOwner = DomainUserUtil.getDomainOwner(NamespaceManager.get());

			JSONObject json = new JSONObject(zendeskPrefs);
			String username = json.getString("zendesk_username");
			String password = json.getString("zendesk_password");

			URI uri = new URI(json.getString("zendesk_url"));

			String url = "https://" + uri.getHost() + "/api/v2/tickets/" + ticket.id + "/audits.json?include=users";

			String response = HTTPUtil.accessURLUsingAuthentication(url, username, password, "GET", "", false,
					"application/json", "application/json");

			JSONObject responseJSON = new JSONObject(response);

			JSONArray audits = responseJSON.getJSONArray("audits"), users = responseJSON.getJSONArray("users");

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

				DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail("sasi@clickdesk.com");

				if (domainUser != null)
					domainUsersMap.put(id, domainUser);
			}

			for (int i = 0; i < audits.length(); i++)
			{
				JSONObject auditJSON = audits.getJSONObject(i);

				Date date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").parse(auditJSON.getString("created_at"));

				Long id = auditJSON.getLong("author_id");

				JSONArray eventsArray = auditJSON.getJSONArray("events");

				for (int j = 0; j < eventsArray.length(); j++)
				{
					JSONObject eventJSON = eventsArray.getJSONObject(j);
					id = auditJSON.getLong("author_id");

					boolean repliedByEndUser = (domainUsersMap.get(id) == null) ? true : false;

					String eventType = eventJSON.getString("type");

					if ("Comment".equalsIgnoreCase(eventType))
					{
						String body = eventJSON.getString("body");

						if (eventJSON.getBoolean("public"))
						{
							if (repliedByEndUser)
							{
								// Creating new Notes in TicketNotes table
								TicketNotes notes = new TicketNotes(ticket.id, ticket.groupID, null,
										CREATED_BY.REQUESTER, ticket.requester_name, ticket.requester_email, body,
										body, NOTE_TYPE.PUBLIC, new ArrayList<TicketDocuments>(), "");

								notes.created_time = date.getTime();
								notes.save();
							}
							else
							{
								TicketNotes notes = new TicketNotes(ticket.id, ticket.groupID, ticket.assigneeID,
										CREATED_BY.AGENT, ticket.requester_name, ticket.requester_email, body, body,
										NOTE_TYPE.PUBLIC, new ArrayList<TicketDocuments>(), "");

								notes.save();
							}
						}
						else
						{
							// DomainUser domainUser = domainUsersMap.get(id);

							DomainUser domainUser = null;

							if (domainUsersMap.containsKey(id))
								domainUser = domainUsersMap.get(id);
							else
								domainUser = domainOwner;

							TicketNotes notes =new TicketNotes(ticket.id, null, domainUser.id, CREATED_BY.AGENT, "", "",
									body, body, NOTE_TYPE.PRIVATE, new ArrayList<TicketDocuments>(), "");
							
							notes.save();
						}
					}
					else
					{
						if ("Change".equalsIgnoreCase(eventType))
						{
							String fieldName = eventJSON.getString("field_name");

							switch (fieldName)
							{
							case "assignee_id":
								ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNEE_CHANGED,
										ticket.contactID, ticket.id, eventJSON.getString("previous_value"),
										eventJSON.getString("value"), "assigneeID", false);
								// activity.setUser(new Key<>(DomainUser.class,
								// domainOwner.id));
								// activity.created_time = date.getTime();
								// activity.save();
								break;
							case "status":
							{
								String oldStatus = eventJSON.getString("value"), newStatus = eventJSON
										.getString("previous_value");

								Map<String, String> statusMap = new HashMap<String, String>()
								{
									private static final long serialVersionUID = 1L;

									{
										put("new", Status.NEW.toString());
										put("open", Status.OPEN.toString());
										put("pending", Status.PENDING.toString());
										put("hold", Status.PENDING.toString());
										put("closed", Status.CLOSED.toString());
										put("solved", Status.CLOSED.toString());
									}
								};

								// Logging activity
								ActivityUtil.createTicketActivity(ActivityType.TICKET_STATUS_CHANGE, ticket.contactID,
										ticket.id, statusMap.get(oldStatus), statusMap.get(newStatus), "status", false);
								// statusActivity.setUser(new
								// Key<>(DomainUser.class, domainOwner.id));
								// statusActivity.created_time = date.getTime();
								// statusActivity.save();
								break;
							}
							}
						}
						else
						{
							if ("Create".equalsIgnoreCase(eventType))
							{
								String fieldName = eventJSON.getString("field_name");

								if ("assignee_id".equalsIgnoreCase(fieldName))
								{
									Long agentID = eventJSON.getLong("value");

									if (!domainUsersMap.containsKey(agentID))
										agentID = domainOwner.id;

									// Logging private notes activity
									ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNED, ticket.contactID,
											ticket.id, "", agentID + "", "assigneeID", false);
									// activity.setUser(new
									// Key<>(DomainUser.class, domainOwner.id));
									// activity.created_time = date.getTime();
									// activity.save();
								}
							}
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
