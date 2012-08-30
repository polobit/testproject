package com.agilecrm.core.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.activities.Task;
import com.agilecrm.campaign.Campaign;
import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Opportunity;
import com.sun.jersey.api.json.JSONWithPadding;

@Path("api/js/api")
public class JSAPI
{
	// This method is called if TEXT_PLAIN is request
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String sayPlainTextHello()
	{
		return "Invalid Path";
	}

	@Path("contacts/{email}")
	@GET
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Contact getContact(@PathParam("email") String email)
	{

		System.out.println("Searching my email in js " + email);

		Contact contact = Contact.searchContactByEmail(email);

		System.out.println("Contact " + contact);

		// Get Contact count by email
		return contact;
	}

	@Path("contacts")
	@GET
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces("application/x-javascript")
	public JSONWithPadding createContact(@QueryParam("contact") String json, @QueryParam("callback") String jsoncallback)
	{
		try
		{
			ObjectMapper mapper = new ObjectMapper();
			Contact contact = mapper.readValue(json, Contact.class);
			System.out.println(mapper.writeValueAsString(contact));
			System.out.println(contact);
			

			// Get Contact count by email
			String email = contact.getContactFieldValue(Contact.EMAIL);
			int count = Contact.searchContactCountByEmail(email);
			if (count != 0)
			{
				System.out.println("Duplicate found for " + email);
				return null;
			}
			// If zero, save it
			contact.save();
			
			return new JSONWithPadding(new GenericEntity<Contact>(contact) {}, jsoncallback);
		
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
	
	
	@Path("contacts/add-tags")
	@GET
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces("application/x-javascript")
	public JSONWithPadding addTags(@QueryParam("email") String email, @QueryParam("tags") String tags, @QueryParam("callback") String jsoncallback)
	{
		try
		{
			
			// Replace multiple space with single space
		    tags =  tags.trim().replaceAll(" +", " ");

		    // Replace ,space with space
		    tags = tags.replaceAll(", ", " ");

		    // Replace , with spaces
		    tags = tags.replaceAll(",", " ");

		    String[] tagsArray =  tags.split(" ");
		    
		    Contact contact = Contact.addTags(email, tagsArray);
			
			return new JSONWithPadding(new GenericEntity<Contact>(contact) {}, jsoncallback);
		
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
	
	@Path("contacts/remove-tags")
	@GET
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces("application/x-javascript")
	public JSONWithPadding removeTags(@QueryParam("email") String email, @QueryParam("tags") String tags, @QueryParam("callback") String jsoncallback)
	{
		try
		{
			
			// Replace multiple space with single space
		    tags =  tags.trim().replaceAll(" +", " ");

		    // Replace ,space with space
		    tags = tags.replaceAll(", ", " ");

		    // Replace , with spaces
		    tags = tags.replaceAll(",", " ");

		    String[] tagsArray =  tags.split(" ");
		    
		    Contact contact = Contact.removeTags(email, tagsArray);
			
			return new JSONWithPadding(new GenericEntity<Contact>(contact) {}, jsoncallback);
		
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	// New Task
	@Path("js/tasks")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Task createTask(Task task)
	{
		task.save();
		return task;
	}

	@Path("js/opportunity")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Opportunity createOpportunity(Opportunity opportunity)
	{
		opportunity.save();
		return opportunity;
	}

	// Campaign
	@Path("js/campaign/enroll/{contact-id}/{workflow-id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Boolean subscribeContact(@PathParam("contact-id") String contactId,
			@PathParam("workflow-id") String workflowId)
	{
		Contact contact = Contact.getContact(Long.parseLong(contactId));
		if (contact == null)
		{
			System.out.println("Null contact");
			return true;
		}

		Campaign.subscribe(contact, Long.parseLong(workflowId));

		return true;
	}
}