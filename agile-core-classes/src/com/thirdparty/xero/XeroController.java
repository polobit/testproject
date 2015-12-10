/**
 * @author jitendra
 * @since 2014
 */
package com.thirdparty.xero;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;

import com.agilecrm.contact.sync.Type;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactsImportUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * 
 <code>XeroController</code> provide controller service handles all REST API
 * calls. it maps method using @path annotation and provide HTTP CRUD service
 * for ContactSyncPrefs and also initialize sync service for sync contacts.
 * 
 */
@Path("/xero")
public class XeroController
{
    @GET
    @Path("/import-settings")
    public ContactPrefs getPrefs()
    {
	return ContactPrefsUtil.getPrefsByType(Type.XERO);
    }

    @PUT
    @Path("/import-settings")
    public void savePrefs(ContactPrefs prefs)
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
	ContactPrefsUtil.delete(Type.XERO);

    }

    private void doImport(ContactPrefs contactPrefs)
    {
	ContactsImportUtil.initilaizeImportBackend(contactPrefs, true);
    }

}
