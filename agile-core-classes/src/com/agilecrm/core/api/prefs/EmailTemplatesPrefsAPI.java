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
import com.agilecrm.account.util.EmailTemplatesUtil;

/**
 * <code>EmailTemplatesPrefsAPI</code> includes REST calls to interact with
 * {@link EmailTemplates} class. It performs all CRUD Operations for
 * EmailTemplates.
 * 
 */
@Path("/api/email/templates")
public class EmailTemplatesPrefsAPI
{
	/**
	 * Gets all EmailTemplates. This method is called if TEXT_PLAIN is request
	 * 
	 * @return EmailTemplates List.
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<EmailTemplates> getAllEmailTemplates()
	{
		return EmailTemplatesUtil.getAllEmailTemplates();
	}

	/**
	 * Gets EmailTemplates with respect to id.
	 * 
	 * @param id
	 *            - EmailTemplates id.
	 * @return EmailTemplates
	 */
	@Path("/{template-id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public EmailTemplates getEmailTemplate(@PathParam("template-id") Long id)
	{
		return EmailTemplatesUtil.getEmailTemplate(id);
	}

	/**
	 * Saves EmailTemplates.
	 * 
	 * @param email
	 *            - EmailTemplates object to be saved.
	 * @return EmailTemplates.
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public EmailTemplates createEmailTemplate(EmailTemplates email)
	{
		email.save();
		return email;
	}

	/**
	 * Updates EmailTemplates.
	 * 
	 * @param email
	 *            - EmailTemplates object to be updated.
	 * @return EmailTemplates.
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public EmailTemplates updateEmailTemplate(EmailTemplates email)
	{
		email.save();
		return email;
	}

	/**
	 * Deletes EmailTemplates with respect to id.
	 * 
	 * @param id
	 *            - EmailTemplates Id.
	 */
	@Path("/{email-id}")
	@DELETE
	public void deleteEmailTemplate(@PathParam("email-id") Long id)
	{
		EmailTemplates email = EmailTemplatesUtil.getEmailTemplate(id);
		if (email != null)
			email.delete();
	}

	/**
	 * Deletes bulk of email templates based on their ids.
	 * 
	 * @param model_ids
	 *            Array of emailTemplate ids as String.
	 * @throws JSONException
	 */
	@Path("bulk")
	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public void deleteEmailTemplates(@FormParam("ids") String model_ids) throws JSONException
	{
		JSONArray emailsJSONArray = new JSONArray(model_ids);
		EmailTemplates.dao.deleteBulkByIds(emailsJSONArray);
	}

	/**
	 * Gets all EmailTemplates. This method is called if TEXT_PLAIN is request
	 * 
	 * @return EmailTemplates List.
	 */
	@Path("/count")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public int getCount()
	{
		return EmailTemplatesUtil.getCount();
	}
}