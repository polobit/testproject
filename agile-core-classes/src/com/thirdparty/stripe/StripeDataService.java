/**
 * 
 */
package com.thirdparty.stripe;

import java.util.ArrayList;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.contact.sync.Type;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactsImportUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * <code>StripeDataService</code> provide service for managing ContactPref CRUD
 * and import customers service
 * 
 * @author jitendra
 * 
 */
@Path("/api/stripe")
public class StripeDataService
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
	ContactPrefs contactPrefs = ContactPrefsUtil.getPrefsByType(Type.STRIPE);
	return contactPrefs; //
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

	if (contactPrefs != null && !contactPrefs.apiKey.isEmpty())
	    doImport(contactPrefs);

    }

    /**
     * delete ContactPref
     */
    @DELETE
    @Path("/import-settings")
    public void deletePrefs()
    {
	ContactPrefsUtil.delete(Type.STRIPE);

    }

    /**
     * initialize import data for given configuration preferences
     * 
     * @param pref
     */
    private void doImport(ContactPrefs prefs)
    {
	ArrayList<String> options = new ArrayList<String>();
	options.add("customer");
	prefs.importOptions = options;
	ContactsImportUtil.initilaizeImportBackend(prefs, true);

    }

}
