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
import com.agilecrm.user.OfficeEmailPrefs;
import com.agilecrm.user.util.OfficeEmailPrefsUtil;
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
}