package com.agilecrm.core.api.prefs;

import java.util.Iterator;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.email.util.ContactImapUtil;
import com.agilecrm.email.wrappers.EmailWrapper;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.util.IMAPEmailPrefsUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.googlecode.objectify.Key;

/**
 * <code>IMAPAPI</code> includes REST calls to interact with
 * {@link IMAPEmailPrefs} class. It handles CRUD operations for
 * {@link IMAPEmailPrefs}.
 * 
 * @author Manohar
 * 
 */
@Path("/api/imap")
public class IMAPAPI
{
    /**
     * Gets IMAPEmailPrefs of current agile user. This method is called if
     * TEXT_PLAIN is request.
     * 
     * @return IMAPEmailPrefs.
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<IMAPEmailPrefs> getIMAPPrefs()
    {
	List<IMAPEmailPrefs> prefsList = IMAPEmailPrefsUtil.getIMAPPrefsList(AgileUser.getCurrentAgileUser());

	if (prefsList != null && prefsList.size() > 0)
	{
	    for (IMAPEmailPrefs prefs : prefsList)
		prefs.password = IMAPEmailPrefs.MASKED_PASSWORD;
	}
	return prefsList;
    }

    /**
     * Saves IMAPEmailPrefs.
     * 
     * @param prefs
     *            IMAPEmailPrefs object to be saved.
     * @return IMAPEmailPrefs.
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public IMAPEmailPrefs createIMAPEmailPrefs(IMAPEmailPrefs prefs)
    {
	int emailAccountLimitCount = BillingRestrictionUtil.getInstance().getCurrentLimits()
	        .getEmailAccountLimit();
	int emailPrefsCount = ContactEmailUtil.getEmailPrefsCount();
	if (emailPrefsCount < emailAccountLimitCount)
	{
	    prefs.setAgileUser(new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id));
	    prefs.save();
	    prefs.isUpdated = false;
	    return prefs;
	}
	else
	    return null;
    }

    /**
     * Updates IMAPEmailPrefs.
     * 
     * @param prefs
     *            IMAPEmailPrefs object to be saved.
     * @return IMAPEmailPrefs.
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public IMAPEmailPrefs updateIMAPEmailPrefs(IMAPEmailPrefs prefs)
    {
	prefs.setAgileUser(new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id));
	prefs.save();
	prefs.isUpdated = true;
	return prefs;
    }

    /**
     * Deletes IMAPEmailPrefs with respect to agile user.
     */
    @Path("/delete/{id}")
    @DELETE
    public void deleteIMAPEmailPrefs(@PathParam("id") String sid)
    {
	try
	{
	    AgileUser user = AgileUser.getCurrentAgileUser();
	    Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);
	    if (StringUtils.isNotBlank(sid))
	    {
		Long id = Long.parseLong(sid);
		if (id != null)
		{
		    IMAPEmailPrefs prefs = IMAPEmailPrefsUtil.getIMAPEmailPrefs(id, agileUserKey);
		    if (prefs != null)
			prefs.delete();
		}
	    }
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}
    }

    @Path("imap-emails")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<EmailWrapper> getIMAPEmails(@QueryParam("from_email") String fromEmail,
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

	    // Gets IMAPPrefs url
	    String imapURL = ContactImapUtil.getIMAPURL(normalisedFromEmail, normalisedSearchEmail, cursor, pageSize);

	    if (StringUtils.isNotBlank(imapURL))
		emails = ContactEmailUtil.getEmailsfromServer(imapURL, pageSize, cursor, normalisedFromEmail);
	}
	catch (Exception e)
	{
	    System.out.println("Got an exception in IMAPAPI while fetching mails: " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
	return emails;
    }

    @Path("{id}/imap-folders")
    @GET
    @Produces({ MediaType.APPLICATION_JSON + " ;charset=utf-8", MediaType.APPLICATION_XML + " ;charset=utf-8" })
    public String getIMAPFolders(@PathParam("id") String sid)
    {
	JSONArray newFolders = new JSONArray();
	try
	{
	    AgileUser agileUser = AgileUser.getCurrentAgileUser();
	    Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, agileUser.id);
	    Long id = Long.parseLong(sid);
	    if (id != null)
	    {
		IMAPEmailPrefs imapEmailPrefs = IMAPEmailPrefsUtil.getIMAPEmailPrefs(id, agileUserKey);
		if (imapEmailPrefs != null)
		{
		    String imapURL = ContactImapUtil.getIMAPURLForFetchingFolders(imapEmailPrefs, "folders");
		    if (StringUtils.isNotBlank(imapURL))
		    {
			// Gets IMAP server folders
			JSONArray allFolders = ContactImapUtil.getIMAPFoldersFromServer(imapURL);
			if (allFolders != null)
			{
			    List<String> existingFolders = null;
			    if (imapEmailPrefs != null)
				existingFolders = imapEmailPrefs.getFoldersList();
			    for (int i = 0; i < allFolders.length(); i++)
			    {
				JSONObject folder = new JSONObject();
				folder.put("name", allFolders.get(i));
				if (existingFolders != null)
				{
				    for (int j = 0; j < existingFolders.size(); j++)
				    {
					if (existingFolders.get(j).equals(allFolders.get(i)))
					    folder.put("selected", "selected=selected");
				    }
				}
				newFolders.put(folder);
			    }
			}
		    }
		}
	    }// end if id!=null
	}
	catch (Exception e)
	{
	    System.out.println("Got an exception in IMAPAPI while fetching folders: " + e.getMessage());
	    e.printStackTrace();
	}
	return newFolders.toString();
    }

    /**
     * Returns list of users ,current user IMAPEmailPrefs shared with these
     * users
     * 
     * @return
     */
    @Path("shared-to-users")
    @GET
    @Produces({ MediaType.APPLICATION_JSON + " ;charset=utf-8", MediaType.APPLICATION_XML + " ;charset=utf-8" })
    public String getSharedToUsersList(@QueryParam("id") String sid)
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
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, currentAgileUser.id);
		while (itr.hasNext())
		{
		    AgileUser user = itr.next();
		    if (user.id.longValue() == currentAgileUser.id.longValue())
			itr.remove();
		}
		List<Key<AgileUser>> sharedUsers = null;
		if (StringUtils.isNotBlank(sid))
		{
		    Long uid = Long.parseLong(sid);
		    IMAPEmailPrefs imapEmailPrefs = IMAPEmailPrefsUtil.getIMAPEmailPrefs(uid, agileUserKey);
		    if (imapEmailPrefs != null)
			sharedUsers = imapEmailPrefs.getSharedWithUsers();
		}
		for (AgileUser agileUser : agileUsers)
		{
		    DomainUser domainUser = agileUser.getDomainUser();
		    if (domainUser != null)
		    {
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
	}
	catch (Exception e)
	{
	    System.out.println("Got an exception in IMAPAPI: " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
	result = users.toString();
	return result;
    }
}