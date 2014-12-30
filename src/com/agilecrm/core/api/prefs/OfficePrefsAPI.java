package com.agilecrm.core.api.prefs;

import java.util.Iterator;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.email.util.ContactOfficeUtil;
import com.agilecrm.email.wrappers.EmailWrapper;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.OfficeEmailPrefs;
import com.agilecrm.user.util.OfficeEmailPrefsUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.googlecode.objectify.Key;

/**
 * <code>OfficePrefsAPI</code> includes REST calls to interact with
 * {@link OfficeEmailPrefs} class. It handles CRUD operations for
 * {@link OfficeEmailPrefs}.
 * 
 * @author Manohar
 * 
 */
@Path("/api/office")
public class OfficePrefsAPI
{
    /**
     * Gets OfficeEmailPrefs of current agile user. This method is called if
     * TEXT_PLAIN is request.
     * 
     * @return OfficeEmailPrefs.
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public OfficeEmailPrefs getOfficePrefs()
    {
	OfficeEmailPrefs prefs = OfficeEmailPrefsUtil.getOfficePrefs(AgileUser.getCurrentAgileUser());

	if (prefs != null)
	{
	    prefs.password = OfficeEmailPrefs.MASKED_PASSWORD;
	}
	System.out.println(prefs);
	return prefs;
    }

    /**
     * Saves OfficeEmailPrefs.
     * 
     * @param prefs
     *            OfficeEmailPrefs object to be saved.
     * @return OfficeEmailPrefs.
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public OfficeEmailPrefs createOfficeEmailPrefs(OfficeEmailPrefs prefs)
    {
	prefs.setAgileUser(new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id));
	prefs.save();
	return prefs;
    }

    /**
     * Updates OfficeEmailPrefs.
     * 
     * @param prefs
     *            OfficeEmailPrefs object to be updated and saved.
     * @return OfficeEmailPrefs.
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public OfficeEmailPrefs updateOfficeEmailPrefs(OfficeEmailPrefs prefs)
    {
	prefs.setAgileUser(new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id));

	prefs.save();
	return prefs;
    }

    /**
     * Deletes OfficeEmailPrefs with respect to agile user.
     */
    @DELETE
    public void deleteOfficeEmailPrefs()
    {
	OfficeEmailPrefs prefs = OfficeEmailPrefsUtil.getOfficePrefs(AgileUser.getCurrentAgileUser());
	if (prefs != null)
	    prefs.delete();
    }

    /**
     * Returns office365 emails . Emails json string are returned in the format
     * {emails:[]}.
     * 
     * @param searchEmail
     *            - to get emails related to search email
     * @param count
     *            - required number of emails.
     * @param offset
     *            - offset.
     * @return String
     */
    @Path("office365-emails")
    @GET
    @Produces({ MediaType.APPLICATION_JSON+ " ;charset=utf-8", MediaType.APPLICATION_XML+ " ;charset=utf-8" })
    public List<EmailWrapper> getOffice365Emails(@QueryParam("from_email") String fromEmail,
	    @QueryParam("search_email") String searchEmail, @QueryParam("page_size") String pageSize,
	    @QueryParam("cursor") String cursor)
    {
	List<EmailWrapper> emails = null;
	try
	{
	    if (StringUtils.isBlank(cursor))
		cursor = "0";
	    // Removes unwanted spaces in between commas
	    String normalisedSearchEmail = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', searchEmail);

	    // Removes unwanted spaces in between commas
	    String normalisedFromEmail = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', fromEmail);

	    // Gets office365Prefs url if not null, otherwise imap url.
	    String url = ContactOfficeUtil.getOfficeURL(AgileUser.getCurrentAgileUser(), normalisedFromEmail,
		    normalisedSearchEmail, cursor, pageSize);

	    // If both are not set, return Contact emails.
	    if (StringUtils.isNotBlank(url))
	    {
		emails = ContactEmailUtil.getEmailsfromServer(url, pageSize, cursor);
	    }
	}
	catch (Exception e)
	{
	    System.out.println("Got an exception in OfficePrefsAPI: " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
	return emails;
    }

    /**
     * /** Returns list of users ,current user OfficeEmailPrefs shared with
     * these users
     * 
     * @return
     */
    @Path("shared-to-users")
    @GET
    @Produces({ MediaType.APPLICATION_JSON + " ;charset=utf-8", MediaType.APPLICATION_XML + " ;charset=utf-8" })
    public String getSharedToUsersList()
    {

	List<AgileUser> agileUsers = null;
	JSONArray users = new JSONArray();
	String result = null;
	try
	{
	    agileUsers = AgileUser.getUsers();
	    if (agileUsers != null)
	    {
		Iterator<AgileUser> itr = agileUsers.iterator();
		AgileUser currentAgileUser = AgileUser.getCurrentAgileUser();
		while (itr.hasNext())
		{
		    AgileUser user = itr.next();
		    if (user.id.longValue() == currentAgileUser.id.longValue())
			itr.remove();
		}
		OfficeEmailPrefs imapEmailPrefs = OfficeEmailPrefsUtil.getOfficePrefs(currentAgileUser);
		List<Key<AgileUser>> sharedUsers = null;
		if (imapEmailPrefs != null)
		{
		    sharedUsers = imapEmailPrefs.getSharedWithUsers();
		}
		for (AgileUser agileUser : agileUsers)
		{
		    DomainUser domainUser = agileUser.getDomainUser();
		    String name = domainUser.name;
		    Long id = agileUser.id;
		    JSONObject user = new JSONObject();
		    user.put("id", id.toString());
		    user.put("name", name);

		    if (sharedUsers != null)
		    {
			for (Key<AgileUser> sharedUser : sharedUsers)
			{
			    if (sharedUser.getId() == id.longValue())
			    {
				user.put("selected", "selected=selected");
			    }
			}
		    }
		    users.put(user);
		}
	    }
	}
	catch (Exception e)
	{
	    System.out.println("Got an exception in EmailsAPI: " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
	result = users.toString();
	return result;
    }
}