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

import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.Type;
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
	 * Return User's Saved stripe contactPref if found else it will return null
	 * 
	 * @return
	 */
	@GET
	@Path("/import-settings")
	@Produces(MediaType.APPLICATION_JSON)
	public ContactPrefs getPrefs()
	{
		return ContactPrefsUtil.getPrefsByType(Type.STRIPE);
	}

	/**
	 * update Users contactPrefs if token will be there in contactPref then it
	 * will initialize import data from stripe
	 * 
	 * @param prefs
	 */
	@PUT
	@Path("/import-settings")
	public void saveImportPrefs(ContactPrefs prefs)
	{

		ContactPrefs pref = ContactPrefsUtil.get(prefs.id);
		pref.save();

		if (!pref.token.isEmpty() && pref != null)
			doImport(pref);

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
	private void doImport(ContactPrefs pref)
	{
		ArrayList<String> options = new ArrayList<String>();
		options.add("customer");
		pref.thirdPartyField = options;
		ContactsImportUtil.initilaizeImportBackend(pref);

	}

}
