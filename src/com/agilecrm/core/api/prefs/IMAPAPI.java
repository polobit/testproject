package com.agilecrm.core.api.prefs;

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

import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.email.util.ContactImapUtil;
import com.agilecrm.email.wrappers.EmailWrapper;
import com.agilecrm.user.AgileUser;
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
    public IMAPEmailPrefs getIMAPPrefs()
    {
	IMAPEmailPrefs prefs = IMAPEmailPrefsUtil.getIMAPPrefs(AgileUser.getCurrentAgileUser());

	if (prefs != null)
	{
	    prefs.password = IMAPEmailPrefs.MASKED_PASSWORD;
	}
	System.out.println(prefs);
	return prefs;
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
	prefs.setAgileUser(new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id));
	prefs.save();
	return prefs;
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
	return prefs;
    }

    /**
     * Deletes IMAPEmailPrefs with respect to agile user.
     */
    @DELETE
    public void deleteIMAPEmailPrefs()
    {
	IMAPEmailPrefs prefs = IMAPEmailPrefsUtil.getIMAPPrefs(AgileUser.getCurrentAgileUser());
	if (prefs != null)
	    prefs.delete();
    }
    
    /**
     * Returns imap emails merging with contact emails . Emails json string are
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
    @Path("imap-emails")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<EmailWrapper> getIMAPEmails(@QueryParam("e") String searchEmail,
	    @QueryParam("page_size") String pageSize, @QueryParam("cursor") String cursor)
    {
	List<EmailWrapper> emails = null;
	try
	{
	    if (StringUtils.isBlank(cursor))
		cursor = "0";
	    // Removes unwanted spaces in between commas
	    String normalisedEmail = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', searchEmail);

	    // Gets IMAPPrefs url
	    String imapURL = ContactImapUtil.getIMAPURL(AgileUser.getCurrentAgileUser(), normalisedEmail, cursor,
		    pageSize);

	    if (StringUtils.isNotBlank(imapURL))
	    {
		emails = ContactEmailUtil.getEmailsfromServer(imapURL, pageSize, cursor);
	    }

	}
	catch (Exception e)
	{
	    System.out.println("Got an exception in EmailsAPI: " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
	return emails;
    }
}