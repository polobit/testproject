package com.agilecrm.core.api;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.core.DomainUser;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.NotificationPrefs;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.UserPrefs;
import com.google.appengine.api.NamespaceManager;

@Path("/api/users")
public class UsersAPI
{

    // Users
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<DomainUser> getUsers()
    {
	try
	{
	    String domain = NamespaceManager.get();
	    return DomainUser.getUsers(domain);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Users
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public DomainUser createDomainUser(DomainUser domainUser)
    {
	try
	{
	    domainUser.save();
	    return domainUser;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    // Users
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public DomainUser updateDomainUser(DomainUser domainUser)
    {
	try
	{
	    if (domainUser.id == null)
	    {
		throw new WebApplicationException(Response
			.status(Response.Status.BAD_REQUEST)
			.entity("Invalid User").build());
	    }

	    domainUser.save();
	    return domainUser;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    // Users
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteDomainUser(DomainUser domainUser)
    {

	Long id = domainUser.id;
	DomainUser domainuser = DomainUser.getDomainUser(id);
	int count = DomainUser.count();

	try
	{
	    // Check if only one account exists
	    if (count == 1)
		throw new WebApplicationException(
			Response.status(Response.Status.BAD_REQUEST)
				.entity("Cannot Delete Users if only one account exists")
				.build());
	    // Check for account owner
	    else if (domainUser.is_account_owner)
		throw new WebApplicationException(Response
			.status(Response.Status.BAD_REQUEST)
			.entity("Master account cannot be deleted").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

	AgileUser agileUser = AgileUser
		.getCurrentAgileUserFromDomainUser(domainUser.id);

	if (agileUser != null)
	{
	    // Delete UserPrefs
	    UserPrefs userPrefs = UserPrefs.getCurrentUserPrefs();
	    if (userPrefs != null)
		userPrefs.delete();

	    // Delete Social Prefs
	    List<SocialPrefs> socialPrefsList = SocialPrefs.getPrefs(agileUser);
	    for (SocialPrefs socialPrefs : socialPrefsList)
	    {
		socialPrefs.delete();
	    }

	    // Delete IMAP PRefs
	    IMAPEmailPrefs imapPrefs = IMAPEmailPrefs.getIMAPPrefs(agileUser);
	    if (imapPrefs != null)
		imapPrefs.delete();

	    // Delete Notification Prefs
	    NotificationPrefs notificationPrefs = NotificationPrefs
		    .getCurrentUserNotificationPrefs();
	    if (notificationPrefs != null)
		notificationPrefs.delete();

	    // Get and Delete AgileUser
	    agileUser.delete();
	}

	domainUser.delete();
    }

    // Bulk operation - delete
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteContacts(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {

	JSONArray usersJSONArray = new JSONArray(model_ids);

	for (int i = 0; i < usersJSONArray.length(); i++)
	{

	    DomainUser domainuser = DomainUser.getDomainUser(Long
		    .parseLong(usersJSONArray.getString(i)));

	    deleteDomainUser(domainuser);

	}

    }

}