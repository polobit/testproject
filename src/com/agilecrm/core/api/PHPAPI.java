/**
 * This file handles requests from the PHP API calls
 */
package com.agilecrm.core.api;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;

import com.agilecrm.account.APIKey;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

@Path("php/api")
public class PHPAPI
{
	@POST
	@Path("contact")
	@Produces("application / x-javascript")
	public String createContact(String data, @QueryParam("id") String apiKey)
	{
		try
		{
			Contact contact = new Contact();
			List<ContactField> properties = new ArrayList<ContactField>();
			String[] tags = new String[0];
			JSONObject obj = new JSONObject(data);
			Iterator<?> keys = obj.keys();
			while (keys.hasNext())
			{
				String key = (String) keys.next();
				if (key.equals("tags"))
				{
					String tagString = obj.getString(key);
					tagString = tagString.trim();
					tagString = tagString.replace("/ /g", " ");
					tagString = tagString.replace("/, /g", ",");
					tags = tagString.split(",");
					System.out.println("tags array" + tags);
				}
				else
				{
					ContactField field = new ContactField();
					String value = obj.getString(key);
					field.name = key;
					field.value = value;
					field.type = FieldType.SYSTEM;
					properties.add(field);
				}

			}
			contact.properties = properties;
			contact.addTags(tags);
			int count = ContactUtil.searchContactCountByEmail(Contact.EMAIL);
			if (count != 0)
			{
				return null;
			}
			contact.setContactOwner(APIKey.getDomainUserKeyRelatedToAPIKey(apiKey));
			contact.save();
			ObjectMapper mapper = new ObjectMapper();
			return mapper.writeValueAsString(contact);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@DELETE
	@Path("contact")
	@Produces("application / x-javascript")
	public String deleteContact(String data)
	{
		try
		{
			JSONObject obj = new JSONObject(data);
			Contact contact = ContactUtil.searchContactByEmail(obj.getString("email"));
			if (contact == null)
				return null;
			contact.delete();
			JSONObject json = new JSONObject();
			json.put("contact", "deleted");
			return json.toString();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@POST
	@Path("note")
	@Produces("application / x-javascript")
	public String addNote(String data)
	{
		try
		{
			Note note = new Note();
			JSONObject obj = new JSONObject(data);
			ObjectMapper mapper = new ObjectMapper();
			Contact contact = new Contact();
			Iterator<?> keys = obj.keys();
			while (keys.hasNext())
			{
				String key = (String) keys.next();
				if (key.equals("email"))
				{
					contact = ContactUtil.searchContactByEmail(obj.getString(key));
					if (contact == null)
						return null;
				}
			}
			obj.remove("email");
			note = mapper.readValue(obj.toString(), Note.class);
			note.addRelatedContacts(contact.id.toString());
			note.save();
			return mapper.writeValueAsString(note);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@POST
	@Path("score")
	@Produces("application / x-javascript")
	public String addScore(String data)
	{
		try
		{
			Contact contact = new Contact();
			JSONObject obj = new JSONObject(data);
			Iterator<?> keys = obj.keys();
			while (keys.hasNext())
			{
				String key = (String) keys.next();
				if (key.equals("email"))
				{
					contact = ContactUtil.searchContactByEmail(obj.getString(key));
					if (contact == null)
						return null;
				}
				if (key.equals("score"))
				{
					contact.addScore(obj.getInt(key));
				}
			}
			ObjectMapper mapper = new ObjectMapper();
			return mapper.writeValueAsString(contact);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@POST
	@Path("task")
	@Produces("application / x-javascript")
	public String addTask(String data, @QueryParam("id") String apikey)
	{
		try
		{
			Contact contact = new Contact();
			Task task = new Task();
			JSONObject obj = new JSONObject(data);
			Iterator<?> keys = obj.keys();
			while (keys.hasNext())
			{
				String key = (String) keys.next();
				if (key.equals("email"))
				{
					contact = ContactUtil.searchContactByEmail(obj.getString(key));
					if (contact == null)
						return null;
				}
			}
			obj.remove("email");
			ObjectMapper mapper = new ObjectMapper();
			task = mapper.readValue(obj.toString(), Task.class);
			task.setOwner(APIKey.getDomainUserKeyRelatedToAPIKey(apikey));
			task.contacts = new ArrayList<String>();
			task.contacts.add(contact.id.toString());
			task.save();
			return mapper.writeValueAsString(task);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@POST
	@Path("deal")
	@Produces("application / x-javascript")
	public String addDeal(String data, @QueryParam("id") String apikey)
	{
		try
		{
			Contact contact = new Contact();
			JSONObject obj = new JSONObject(data);
			Iterator<?> keys = obj.keys();
			while (keys.hasNext())
			{
				String key = (String) keys.next();
				if (key.equals("email"))
				{
					contact = ContactUtil.searchContactByEmail(obj.getString(key));
					if (contact == null)
						return null;
				}
			}
			obj.remove("email");
			ObjectMapper mapper = new ObjectMapper();
			Opportunity opportunity = mapper.readValue(obj.toString(), Opportunity.class);
			opportunity.addContactIds(contact.id.toString());
			opportunity.owner_id = String.valueOf(APIKey.getDomainUserKeyRelatedToAPIKey(apikey).getId());
			opportunity.save();
			return mapper.writeValueAsString(opportunity);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@POST
	@Path("tags")
	@Produces("application / x-javascript")
	public String addTags(String data)
	{
		try
		{
			Contact contact = new Contact();
			String[] tagsArray = new String[0];
			JSONObject obj = new JSONObject(data);
			Iterator<?> keys = obj.keys();
			while (keys.hasNext())
			{
				String key = (String) keys.next();
				if (key.equals("email"))
				{
					contact = ContactUtil.searchContactByEmail(obj.getString(key));
					if (contact == null)
						return null;
				}
				if (key.equals("tags"))
				{
					String value = obj.getString(key);
					String tags = value;
					tags = tags.trim().replaceAll(" +", " ");
					tags = tags.replaceAll(", ", ",");
					tagsArray = tags.split(",");
				}
			}
			contact.addTags(tagsArray);
			ObjectMapper mapper = new ObjectMapper();
			return mapper.writeValueAsString(contact);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@DELETE
	@Path("tags")
	@Produces("application / x-javascript")
	public String removeTags(String data)
	{
		try
		{
			Contact contact = new Contact();
			String[] tagsArray = new String[0];
			JSONObject obj = new JSONObject(data);
			Iterator<?> keys = obj.keys();
			while (keys.hasNext())
			{
				String key = (String) keys.next();
				if (key.equals("email"))
				{
					contact = ContactUtil.searchContactByEmail(obj.getString(key));
					if (contact == null)
						return null;
				}
				if (key.equals("tags"))
				{
					String tags = obj.getString(key);
					tags = tags.trim().replaceAll(" +", " ");
					tags = tags.replaceAll(", ", ",");
					tagsArray = tags.split(",");
					System.out.println(" tags array is " + tagsArray);
				}
			}
			contact.removeTags(tagsArray);
			ObjectMapper mapper = new ObjectMapper();
			return mapper.writeValueAsString(contact);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@DELETE
	@Path("score")
	@Produces("application / x-javascript")
	public String subtractScore(String data)
	{
		try
		{
			Contact contact = new Contact();
			JSONObject obj = new JSONObject(data);
			Iterator<?> keys = obj.keys();
			while (keys.hasNext())
			{
				String key = (String) keys.next();
				if (key.equals("email"))
				{
					contact = ContactUtil.searchContactByEmail(obj.getString(key));
					if (contact == null)
						return null;
				}
				if (key.equals("score"))
				{
					Integer value = obj.getInt(key);
					contact.subtractScore(value);
				}
			}
			ObjectMapper mapper = new ObjectMapper();
			return mapper.writeValueAsString(contact);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@GET
	@Path("tags")
	@Produces("application / x-javascript")
	public String getTags(String data)
	{
		try
		{
			JSONObject obj = new JSONObject(data);
			Contact contact = ContactUtil.searchContactByEmail(obj.getString("email"));
			if (contact == null)
				return null;

			ObjectMapper mapper = new ObjectMapper();
			return mapper.writeValueAsString(contact.tags);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@GET
	@Path("score")
	@Produces("application / x-javascript")
	public String getScore(String data)
	{
		try
		{
			JSONObject obj = new JSONObject(data);
			Contact contact = ContactUtil.searchContactByEmail(obj.getString("email"));
			if (contact == null)
				return null;
			ObjectMapper mapper = new ObjectMapper();
			return mapper.writeValueAsString(contact.lead_score);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@GET
	@Path("note")
	@Produces("application / x-javascript")
	public String getNotes(String data)
	{
		try
		{
			JSONObject obj = new JSONObject(data);
			Contact contact = ContactUtil.searchContactByEmail(obj.getString("email"));
			if (contact == null)
				return null;
			List<Note> Notes = new ArrayList<Note>();
			Notes = NoteUtil.getNotes(contact.id);
			ObjectMapper mapper = new ObjectMapper();
			JSONArray arr = new JSONArray();
			for (Note note : Notes)
			{
				arr.put(mapper.writeValueAsString(note));
			}
			return arr.toString();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@GET
	@Path("deal")
	@Produces("application / x-javascript")
	public String getDeals(String data)
	{
		try
		{
			JSONObject obj = new JSONObject(data);
			Contact contact = ContactUtil.searchContactByEmail(obj.getString("email"));
			if (contact == null)
				return null;
			List<Opportunity> deals = new ArrayList<Opportunity>();
			deals = OpportunityUtil.getCurrentContactDeals(contact.id);
			ObjectMapper mapper = new ObjectMapper();
			JSONArray arr = new JSONArray();
			for (Opportunity deal : deals)
			{
				arr.put(mapper.writeValueAsString(deal));
			}
			return arr.toString();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@GET
	@Path("task")
	@Produces("application / x-javascript")
	public String getTasks(String data)
	{
		try
		{
			JSONObject obj = new JSONObject(data);
			Contact contact = ContactUtil.searchContactByEmail(obj.getString("email"));
			if (contact == null)
				return null;
			List<Task> tasks = new ArrayList<Task>();
			tasks = TaskUtil.getContactTasks(contact.id);
			JSONArray arr = new JSONArray();
			ObjectMapper mapper = new ObjectMapper();
			for (Task task : tasks)
			{
				arr.put(mapper.writeValueAsString(task));
			}
			return arr.toString();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@GET
	@Path("contact")
	@Produces("application / x-javascript")
	public String getContact(String data)
	{
		try
		{
			JSONObject obj = new JSONObject(data);
			Contact contact = ContactUtil.searchContactByEmail(obj.getString("email"));
			if (contact == null)
				return null;
			ObjectMapper mapper = new ObjectMapper();
			return mapper.writeValueAsString(contact);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
}