package com.agilecrm.core.api.prefs;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.email.util.ContactGmailUtil;
import com.agilecrm.email.wrappers.EmailWrapper;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.SocialPrefs.Type;
import com.agilecrm.user.util.SocialPrefsUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;

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
	    prefs.delete();
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
    public List<EmailWrapper> getGoogleEmails(@QueryParam("e") String searchEmail,
	    @QueryParam("page_size") String pageSize, @QueryParam("cursor") String cursor)
    {
	List<EmailWrapper> emails = null;
	try
	{
	    if (StringUtils.isBlank(cursor))
		cursor = "0";
	    // Removes unwanted spaces in between commas
	    String normalisedEmail = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', searchEmail);

	    // Gets GmailPrefs url
	    String gmailURL = ContactGmailUtil.getGmailURL(AgileUser.getCurrentAgileUser(), normalisedEmail, cursor,
		    pageSize);

	    // If both are not set, return Contact emails.
	    if (StringUtils.isNotBlank(gmailURL))
	    {
		emails = ContactEmailUtil.getEmailsfromServer(gmailURL, pageSize, cursor);
	    }

	}
	catch (Exception e)
	{
	    System.out.println("Got an exception in SocialPrefsAPI: " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
	return emails;
    }
}