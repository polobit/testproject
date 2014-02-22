package com.agilecrm.core.api.prefs;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.util.IMAPEmailPrefsUtil;
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
	// Verify imap credentials
	try
	{
	    IMAPEmailPrefsUtil.checkImapPrefs(prefs);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}

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
	// Verify imap credentials
	try
	{
	    IMAPEmailPrefsUtil.checkImapPrefs(prefs);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}

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
}