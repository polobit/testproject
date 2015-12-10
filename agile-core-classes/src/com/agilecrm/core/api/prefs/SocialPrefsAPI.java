package com.agilecrm.core.api.prefs;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
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
import com.agilecrm.contact.email.util.ContactGmailUtil;
import com.agilecrm.email.wrappers.EmailWrapper;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.SocialPrefs.Type;
import com.agilecrm.user.util.SocialPrefsUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.googlecode.objectify.Key;

/**
 * <code>SocialPrefsAPI</code> includes REST calls to interact with
 * {@link SocialPrefs} class. It is called to get SocialPrefs with respect to
 * type and deletes existing SocialPrefs associated with type.
 * 
 * @author Manohar
 * 
 */
@Path("/api/social-prefs")
public class SocialPrefsAPI
{
    /**
     * Returns SocialPrefs associated with current AgileUser and given type.
     * 
     * @param type
     *            - SocialPrefs type.
     * @return SocialPrefs.
     */
    @Path("{type}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public SocialPrefs getSocialPrefs(@PathParam("type") String type)
    {
	try
	{
	    Type socialPrefsTypeEnum = Type.valueOf(type);
	    if (socialPrefsTypeEnum == null)
		return null;

	    return SocialPrefsUtil.getPrefs(AgileUser.getCurrentAgileUser(), socialPrefsTypeEnum);
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    /**
     * Returns SocialPrefs associated with current AgileUser and given type.
     * 
     * @param type
     *            - SocialPrefs type.
     * @return SocialPrefs.
     */
    @Path("{type}/list")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<SocialPrefs> getSocialPrefsList(@PathParam("type") String type)
    {
	try
	{
	    Type socialPrefsTypeEnum = Type.valueOf(type);
	    if (socialPrefsTypeEnum == null)
		return null;
	    return SocialPrefsUtil.getPrefsList(AgileUser.getCurrentAgileUser(), socialPrefsTypeEnum);
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    /**
     * Deletes SocialPrefs associated with current AgileUser and given type.
     * 
     * @param type
     *            - SocialPrefs type.
     */
    @Path("{type}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteSocialPrefs(@PathParam("type") String type)
    {
	try
	{
	    Type socialPrefsTypeEnum = Type.valueOf(type);
	    if (socialPrefsTypeEnum == null)
		return;
	    SocialPrefs prefs = SocialPrefsUtil.getPrefs(AgileUser.getCurrentAgileUser(), socialPrefsTypeEnum);
	    if (prefs != null)
		prefs.delete();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Deletes SocialPrefs associated with current AgileUser and given type.
     * 
     * @param type
     *            - SocialPrefs type.
     */
    @Path("/delete/{id}")
    @DELETE
    public void deleteSocialPrefsById(@PathParam("id") String sid)
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
		    SocialPrefs prefs = SocialPrefsUtil.getPrefs(id, agileUserKey);
		    if (prefs != null)
			prefs.delete();
		}
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Returns google emails merging with contact emails, when imap preferences
     * are set. Otherwise simply returns contact emails. Emails json string are
     * returned in the format {emails:[]}.
     * 
     * @param searchEmail
     *            - to get emails related to search email
     * @param count
     *            - required number of emails.
     * @param offset
     *            - offset.
     * @return String
     */
    @Path("google-emails")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<EmailWrapper> getGoogleEmails(@QueryParam("from_email") String fromEmail,
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
	    // Gets GmailPrefs url
	    String gmailURL = ContactGmailUtil
		    .getGmailURL(normalisedFromEmail, normalisedSearchEmail, cursor, pageSize);
	    // If both are not set, return Contact emails.
	    if (StringUtils.isNotBlank(gmailURL))
		emails = ContactEmailUtil.getEmailsfromServer(gmailURL, pageSize, cursor, normalisedFromEmail);
	}
	catch (Exception e)
	{
	    System.out.println("Got an exception in SocialPrefsAPI: " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
	return emails;
    }

    @Path("share/{id}")
    @POST
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void shareSocialPrefs(@PathParam("id") String sid, String shared_with_users_ids)
    {
	try
	{
	    JSONObject jsonIds = new JSONObject(shared_with_users_ids);
	    AgileUser currentAgileUser = AgileUser.getCurrentAgileUser();
	    Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, currentAgileUser.id);
	    if (StringUtils.isNotBlank(sid))
	    {
		Long uid = Long.parseLong(sid);
		if (uid != null)
		{
		    SocialPrefs socialPrefs = SocialPrefsUtil.getPrefs(uid, agileUserKey);
		    if (socialPrefs != null)
		    {
			List<Key<AgileUser>> sharedWithUsers = new ArrayList<Key<AgileUser>>();
			if (!(jsonIds.isNull("shared_with_users_ids")))
			{
			    JSONArray usersJSONArray = jsonIds.getJSONArray("shared_with_users_ids");
			    for (int i = 0; i < usersJSONArray.length(); i++)
			    {
				Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
				        Long.parseLong(usersJSONArray.getString(i)));
				sharedWithUsers.add(userKey);
			    }
			}
			socialPrefs.setSharedWithUsers(sharedWithUsers);
			socialPrefs
			        .setAgileUser(new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id));
			socialPrefs.update();
		    }
		}
	    }
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}
    }

    /**
     * 
     * Returns list of users ,current user SocialPrefs shared with these users
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
		    SocialPrefs gmailPrefs = SocialPrefsUtil.getPrefs(uid, agileUserKey);
		    if (gmailPrefs != null)
		    {
			sharedUsers = gmailPrefs.getSharedWithUsers();
		    }
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
				    user.put("selected", "selected");
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
	    System.out.println("Got an exception in EmailsAPI: " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
	result = users.toString();
	return result;
    }
}