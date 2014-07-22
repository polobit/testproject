package com.agilecrm.core.api.contacts;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.sync.SyncClient;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactsImportUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * <code>ContactPrefsAPI</code> includes REST calls to interact with
 * {@link ContactPrefs} class
 * <p>
 * It is called from client side to create, update, fetch and delete the import
 * contacts preferences.
 * </p>
 * 
 * @author
 * 
 */
@Path("/api/contactprefs")
public class ContactPrefsAPI
{

    /**
     * Fetches import contact preferences based on type and current user.
     * 
     * 
     * @return {@link ContactPrefs}
     */
    @Path("/{type}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public ContactPrefs getContactPrefs(@PathParam("type") String type)
    {

	System.out.println("in contact prefs api");
	return ContactPrefsUtil.getPrefsByType(SyncClient.GOOGLE);
    }

    @Path("/{type}")
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void updateContactPrefs(@PathParam("type") String type, ContactPrefs prefs, @QueryParam("sync") String sync)
    {

	System.out.println("in contact prefs api");

	if (prefs.id == null)
	    return;

	ContactPrefs currentPrefs = ContactPrefsUtil.get(prefs.id);

	ContactPrefs updatedPrefs = ContactPrefsUtil.mergePrefs(currentPrefs, prefs);

	updatedPrefs.save();

	System.out.println("Sync" + sync);

	if (!StringUtils.isEmpty(sync))
	    ContactsImportUtil.initilaizeImportBackend(updatedPrefs);
    }

    /**
     * Fetches import contact preferences.
     * 
     * If count is null fetches all the contacts at once
     * 
     * 
     * @return {@link ContactPrefs}
     */
    @Path("{type}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteContactPrefs(@PathParam("type") String type)
    {

	ContactPrefsUtil.delete(SyncClient.GOOGLE);

    }
}
