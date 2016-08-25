package com.agilecrm.core.api.leads;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.lead.LeadConversion;
import com.agilecrm.lead.util.LeadConversionUtil;

@Path("api/leads")
public class LeadsAPI
{
    @Path("/list")
    @POST
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Contact> getLeads(@FormParam("cursor") String cursor, @FormParam("page_size") String count,
    		@FormParam("reload") boolean force_reload, @FormParam("global_sort_key") String sortKey)
    {
	if (count == null)
	{
	    count = "50";
	}

	if (sortKey != null && ContactFilterUtil.isCustomField(sortKey))
	{
	    return ContactFilterUtil.getFilterContactsBySortKey(sortKey, Integer.parseInt(count), cursor, Type.LEAD);
	}

	List<Contact> contacts = ContactUtil.getAllByOrder(Integer.parseInt(count), cursor, sortKey, Type.LEAD);
	return contacts;
    }

    @Path("{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact getLead(@PathParam("id") Long id)
    {
	return ContactUtil.getContact(id);
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact updateLead(Contact contact)
    {
	contact.save();
	return contact;
    }

    @Path("{id}")
    @DELETE
    public void deleteLead(@PathParam("id") Long id)
    {
	//ContactUtil.deleteEntity(id);
    }
    
    /**
     * Fetches all the contacts (of type person). Activates infiniScroll, if
     * no.of contacts are more than count and cursor is not null. This method is
     * called if TEXT_PLAIN is request
     * 
     * If count is null fetches all the contacts at once
     * 
     * @param cursor
     *            activates infiniScroll
     * @param count
     *            no.of contacts to be fetched at once (if more contacts are
     *            there)
     * @return list of contacts
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
	@Path("/list/count")
    @GET
    public int getContactsCount()
    {
	System.out.println("Fetching count int");
	Map searchMap = new HashMap();
	searchMap.put("type", Contact.Type.LEAD);

	return Contact.dao.getCountByProperty(searchMap);

    }
    
    @Path("conversion-status")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public LeadConversion getLeadConversionStatus()
    {
	LeadConversionUtil leadConversionUtil = new LeadConversionUtil();
	return leadConversionUtil.getConversionStatus();
    }
}