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
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.AllDomainStats;
import com.agilecrm.account.EmailTemplates;
import com.agilecrm.account.util.EmailTemplatesUtil;
import com.agilecrm.alldomainstats.util.AllDomainStatsUtil;

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
	 * Gets list of emailTemplates based on query parameters page-size, cursor and categoryId.
	 * At first only the list of emailTemplates with the page_size are retrieved, when
	 * cursor scroll down, rest of emailTemplates are retrieved. This method is
	 * called if TEXT_PLAIN is request.
	 * 
	 * @param count
	 *            Number of emailTemplates for a page.
	 * @param cursor
	 *            Points the rest of emailTemplates that are over the limit.
	 *@param categoryId
	 *            EmailTemplateCategory id.
	 * 
	 * @return EmailTemplates List.
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<EmailTemplates> getAllEmailTemplates(@QueryParam("page_size") String count,
					@QueryParam("cursor") String cursor, @QueryParam("category_id") Long categoryId)
	{	
		if(count != null){
			return EmailTemplatesUtil.getAllEmailTemplates(Integer.parseInt(count), cursor, categoryId);
		}
		
		return EmailTemplatesUtil.getAllEmailTemplates(categoryId);
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
		
		//Increase count of Campaign for AllDomainstats report in database
		AllDomainStatsUtil.updateAllDomainStats(AllDomainStats.EMAIL_TEMPLATE_COUNT);
		
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
		email.updated_time = System.currentTimeMillis()/1000;
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
	
	/**
	 * Gets EmailTemplates with respect to emailTemplate_category_id.
	 * 
	 * @param category_id
	 *            - EmailTemplateCategory id.
	 * @return EmailTemplates List
	 */
	@Path("/category/{category-id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<EmailTemplates> getEmailTemplatesBasedOnCategory(@PathParam("category-id") Long category_id)
	{
		return EmailTemplatesUtil.getEmailTemplatesBasedOnCategory(category_id);
	}
	
}