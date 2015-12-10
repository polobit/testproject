/**
 * @author jitendra
 * @sinnce 2014
 */
package com.thirdparty.quickbook;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;

import com.agilecrm.contact.sync.Type;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactsImportUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * <code>QuickBookController</code> provide controller Service handles all REST
 * API calls. it maps calls using @path annotation and provide HTTP CRUD service
 * for ContactSyncPrefs and also initialize sync service for sync contacts.
 *
 */
@Path("/quickbook")
public class QuickBookController
{
    /**
     * Return ContactPrefs
     * 
     * @return
     */
    @GET
    @Path("/import-settings")
    public ContactPrefs getPrefs()
    {
	return ContactPrefsUtil.getPrefsByType(Type.QUICKBOOK);
    }

    @PUT
    @Path("/import-settings")
    public void savePrefs(ContactPrefs prefs)
    {
	ContactPrefs contactPrefs = ContactPrefsUtil.mergePrefs(ContactPrefsUtil.get(prefs.id), prefs);
	contactPrefs.save();

	if (!contactPrefs.token.isEmpty() && contactPrefs != null)
	    doImport(contactPrefs);
    }

    /**
     * delete ContactPref
     */
    @DELETE
    @Path("/import-settings")
    public void deletePrefs()
    {
	ContactPrefsUtil.delete(Type.QUICKBOOK);

    }

    private void doImport(ContactPrefs contactPrefs)
    {
	ContactsImportUtil.initilaizeImportBackend(contactPrefs, true);
    }

}
