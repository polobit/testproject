package com.agilecrm.core.api.prefs;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.EmailTemplateCategory;
import com.agilecrm.account.util.EmailTemplateCategoryUtil;
import com.agilecrm.contact.util.ContactUtil;


/**
 * <code>EmailTemplateCategoryAPI</code> includes REST calls to interact with
 * {@link EmailTemplateCategory} class to initiate {@link EmailTemplateCategory} CRUD operations.
 * <p>
 * It is called from client side to create & fetch emailTemplateCategory.
 * </p>
 * 
 * @author Prakash Kumar
 * 
 */
@Path("/api/emailTemplate-category")
public class EmailTemplateCategoryAPI {
	
	/**
	 * Gets all EmailTemplateCategories orderBy name
	 * 
	 * @return EmailTemplateCategory List.
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<EmailTemplateCategory> getEmailTemplateCategories(@QueryParam("global_sort_key") String orderBy) {
		if(orderBy == null){
			orderBy = "name_dummy";
		}
		return EmailTemplateCategoryUtil.getAllEmailTemplateCategory(orderBy.trim());
	}
	
	
	/**
	 * Saves new EmailTemplateCategory into database, by verifying the existence of duplicates
     * with its name. If any duplicate is found throws web exception.
	 * 
	 * @param emailTemplateCategory
	 *            - EmailTemplateCategory object that is newly created.
	 * @return EmailTemplateCategory.
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public EmailTemplateCategory createEmailTemplateCategory(EmailTemplateCategory emailTemplateCategory){
		
		// Check if the EmailTemplateCategory exists with the same name.
		if(emailTemplateCategory != null){
			if (EmailTemplateCategoryUtil.getEmailTemplateCategoryNameCount(emailTemplateCategory.name) > 0){
				System.out.println("Duplicate EmailTemplateCategory found");
				throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
						.entity("Sorry, same kind of name already exists.").build());
			}
		}
		emailTemplateCategory.save();
		return emailTemplateCategory;
	}
	
	
	/**
	 * Gets all EmailTemplateCategories.
	 * 
	 * @return EmailTemplateCategory List.
	 */
	@Path("/count")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public int getCount()
	{
		return EmailTemplateCategoryUtil.getCount();
	}
}
