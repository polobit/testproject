package com.agilecrm.core.api.prefs;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.account.EmailTemplates;

@Path("/api/email/templates")
public class EmailTemplatesPrefsAPI
{

    // This method is called if TEXT_PLAIN is request
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<EmailTemplates> getAllEmailTemplates()
    {
	return EmailTemplates.getAllEmailTemplates();
    }

    @Path("/{template-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public EmailTemplates getEmailTemplate(@PathParam("template-id") Long id)
    {
	return EmailTemplates.getEmailTemplate(id);
    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public EmailTemplates createEmailTemplate(EmailTemplates email)
    {
	email.save();
	return email;
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public EmailTemplates updateEmailTemplate(EmailTemplates email)
    {
	email.save();
	return email;
    }

    @Path("/{email-id}")
    @DELETE
    public void deleteEmail(@PathParam("email-id") Long id)
    {
	EmailTemplates email = EmailTemplates.getEmailTemplate(id);
	if (email != null)
	    email.delete();
    }

    // Bulk operations - delete
    /**
     * Deletes the bulk of email templates based on their ids
     * 
     * @param model_ids
     *            array of emailTemplate ids as String
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteContacts(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {

	JSONArray emailsJSONArray = new JSONArray(model_ids);
	EmailTemplates.dao.deleteBulkByIds(emailsJSONArray);
    }
}