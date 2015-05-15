/**
 * 
 */
package com.thirdparty.freshbooks;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.sync.Type;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactsImportUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * @author jitendra
 *
 */
@Path("/api/freshbooks")
public class FreshbooksDataAPI
{

    /**
     * Retrieves {@link ContactPrefs} based on its type
     * 
     * @return
     */
    @GET
    @Path("/import-settings")
    @Produces(MediaType.APPLICATION_JSON)
    public ContactPrefs getPrefs()
    {

	return ContactPrefsUtil.getPrefsByType(Type.FRESHBOOKS);
    }

    /**
     * update Users {@link ContactPrefs} if token will be there in contactPref
     * then it will initialize import data from stripe
     * 
     * @param prefs
     */
    @PUT
    @Path("/import-settings")
    public void saveImportPrefs(ContactPrefs prefs)
    {

	ContactPrefs contactPrefs = ContactPrefsUtil.mergePrefs(ContactPrefsUtil.get(prefs.id), prefs);
	contactPrefs.save();
	if (contactPrefs != null && !contactPrefs.token.isEmpty())
	    doImport(contactPrefs);

    }

    /**
     * delete ContactPref
     */
    @DELETE
    @Path("/import-settings")
    public void deletePrefs()
    {
	ContactPrefsUtil.delete(Type.FRESHBOOKS);

    }

    /**
     * initialize import data for given configuration preferences
     * 
     * @param pref
     */
    private void doImport(ContactPrefs prefs)
    {
	ContactsImportUtil.initilaizeImportBackend(prefs, true);

    }

    /**
     * save freshbooks token
     */
    @GET
    @Path("/save/{token}/{url}")
    public ContactPrefs saveToken(@PathParam("token") String token, @PathParam("url") String url)
    {
	ContactPrefs contactPrefs = new ContactPrefs();
	if (!StringUtils.isBlank(token) && !StringUtils.isBlank(url))
	{
	    contactPrefs.token = token;
	    contactPrefs.othersParams = url;
	}
	contactPrefs.type = Type.FRESHBOOKS;
	contactPrefs.save();
	return contactPrefs;

    }

}
