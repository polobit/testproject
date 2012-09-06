package com.agilecrm.core.api.prefs;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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
    public EmailTemplates getEmailTemplate(@PathParam("template-id") String id)
    {
	return EmailTemplates.getEmailTemplate(Long.parseLong(id));
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
    public void deleteEmail(@PathParam("email-id") String id)
    {
	EmailTemplates email = EmailTemplates.getEmailTemplate(Long
		.parseLong(id));
	if (email != null)
	    email.delete();
    }
}