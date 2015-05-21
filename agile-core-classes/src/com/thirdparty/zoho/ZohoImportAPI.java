/**
 * 
 */
package com.thirdparty.zoho;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.contact.sync.Type;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactsImportUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

// TODO: Auto-generated Javadoc
/**
 * <code>ZohoImport</code> This class Used for REST call for saving user Auth
 * preferences and Importing contact from saved preferences;.
 * 
 * @author jitendra
 */

@Path("/api/zoho")
public class ZohoImportAPI
{

    /**
     * Retrieve ContactPrefs.
     * 
     * @return the prefs
     */
    @Path("/import-settings")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public ContactPrefs getPrefs()
    {
	return ContactPrefsUtil.getPrefsByType(Type.ZOHO);
    }

    /**
     * Delete prefs.
     */
    @Path("/import-settings")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public void deletePrefs()
    {
	ContactPrefsUtil.delete(Type.ZOHO);

    }

    /**
     * Update prefs.
     * 
     * @param prefs
     *            the prefs
     */
    @Path("/import-settings")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public void updatePrefs(ContactPrefs prefs)
    {
	ContactPrefs contactPrefs = ContactPrefsUtil.get(prefs.id);
	contactPrefs.save();

	if (!contactPrefs.token.isEmpty() && contactPrefs != null)
	    ContactsImportUtil.initilaizeImportBackend(contactPrefs, true);

    }

    /**
     * Checks if is authenticated.
     * 
     * @param username
     *            the username
     * @return true, if is authenticated
     */
    @GET
    @Path("/auth-user")
    public boolean isAuthenticated(@QueryParam("username") String username)
    {

	try
	{
	    ContactPrefs prefs = ContactPrefsUtil.getPrefsByType(Type.ZOHO);
	    String user = prefs.userName;

	    if (prefs != null && user != null && user.equalsIgnoreCase(username))
		return true;
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Invalid login Please try again").build());
	}
	return false;

    }

    /**
     * This method will do import data from zoho crm from different modules.
     * 
     * @param accounts
     *            the accounts
     * @param leads
     *            the leads
     * @param contacts
     *            the contacts
     * @return the contact prefs
     */
    @Path("/import")
    @POST
    @Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
    @Produces({ MediaType.APPLICATION_JSON })
    public ContactPrefs importFromZoho(@FormParam("accounts") boolean accounts, @FormParam("leads") boolean leads,
	    @FormParam("contacts") boolean contacts)
    {

	ContactPrefs prefs = ContactPrefsUtil.getPrefsByType(Type.ZOHO);
	if (prefs != null)
	{

	    if (accounts)
		prefs.importOptions.add("accounts");

	    if (leads)
		prefs.importOptions.add("leads");
	    if (contacts)
		prefs.importOptions.add("contacts");
	    prefs.save();
	}

	return prefs;

    }

}
