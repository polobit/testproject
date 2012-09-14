package com.agilecrm.core.api.prefs;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.googlecode.objectify.Key;

@Path("/api/imap")
public class IMAPAPI
{

    // IMAP CRUD
    // This method is called if TEXT_PLAIN is request
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public IMAPEmailPrefs getIMAPPrefs()
    {
	IMAPEmailPrefs prefs = IMAPEmailPrefs.getIMAPPrefs(AgileUser
		.getCurrentAgileUser());
	if (prefs != null)
	{
	    prefs.password = prefs.MASKED_PASSWORD;
	}
	System.out.println(prefs);
	return prefs;
    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public IMAPEmailPrefs createIMAPEmailPrefs(IMAPEmailPrefs prefs)
    {
	prefs.setAgileUser(new Key<AgileUser>(AgileUser.class, AgileUser
		.getCurrentAgileUser().id));
	prefs.save();
	return prefs;
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public IMAPEmailPrefs updateIMAPEmailPrefs(IMAPEmailPrefs prefs)
    {
	prefs.setAgileUser(new Key<AgileUser>(AgileUser.class, AgileUser
		.getCurrentAgileUser().id));

	prefs.save();
	return prefs;
    }

    @DELETE
    public void deleteIMAPEmailPrefs()
    {
	IMAPEmailPrefs prefs = IMAPEmailPrefs.getIMAPPrefs(AgileUser
		.getCurrentAgileUser());
	if (prefs != null)
	    prefs.delete();
    }

}