package com.agilecrm.core.api.campaigns;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.campaign.Campaign;
import com.agilecrm.contact.Contact;
import com.campaignio.logger.Log;

@Path("/api/campaigns")
public class CampaignsAPI
{

    // Campaign
    @Path("enroll/{contact-id}/{workflow-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String subscribeContact(@PathParam("contact-id") String contactId,
	    @PathParam("workflow-id") String workflowId)
    {
	Contact contact = Contact.getContact(Long.parseLong(contactId));
	if (contact == null)
	{
	    System.out.println("Null contact");
	    return "true";
	}

	Campaign.subscribe(contact, Long.parseLong(workflowId));

	return "true";
    }

    // Campaign
    @Path("logs/contact/{contact-id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Log> getCampaignContactLogs(
	    @PathParam("contact-id") String contactId)
    {

	return Log.getSubscriberLog(contactId);
    }

    // Campaign
    @Path("logs/contact/{contact-id}/{campaign-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Log getCampaignContactLogs(
	    @PathParam("contact-id") String contactId,
	    @PathParam("campaign-id") String campaignId)
    {

	return Log.getCampaignSubscriberLog(campaignId, contactId);
    }

    // Campaign
    @Path("logs/{campaign-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Log> getCampaignLogs(@PathParam("campaign-id") String campaignId)
    {

	return Log.getCampaignLog(campaignId);
    }

    @Path("logs/{campaign-id}")
    @DELETE
    public void deleteCampaignLogs(@PathParam("campaign-id") String id)
    {
	Log.removeCampaignLogs(id);
    }

    // Bulk operations - delete
    @Path("logs/bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteLogs(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {
	JSONArray logsJSONArray = new JSONArray(model_ids);
	Log.dao.deleteBulkByIds(logsJSONArray);
    }

    // Bulk operations - add to campaign
    @Path("enroll/bulk/{workflow-id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String subscribeContactsBulk(
	    @FormParam("contact_ids") String contact_ids,
	    @PathParam("workflow-id") String workflowId) throws JSONException
    {

	JSONArray contactsJSONArray = new JSONArray(contact_ids);

	// Get contacts list
	List<Contact> contacts_list = Contact
		.getContactsBulk(contactsJSONArray);
	if (contacts_list.size() == 0)
	{
	    System.out.println("Null contact");
	    return "true";
	}

	for (Contact contact : contacts_list)
	{
	    Campaign.subscribe(contact, Long.parseLong(workflowId));
	}

	return "true";
    }
}