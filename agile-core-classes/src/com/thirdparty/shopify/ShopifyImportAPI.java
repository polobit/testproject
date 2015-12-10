package com.thirdparty.shopify;

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
 * Shopify RestApi method save UserContactPrefs and used for Import data from
 * shopify API
 * 
 * @author jitendra
 * 
 */

@Path("/api/shopify")
public class ShopifyImportAPI
{

    /**
     * Gets the contact prefs.
     * 
     * @return the contact prefs
     */
    @GET
    @Path("/import-settings")
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactPrefs getContactPrefs()
    {
	return ContactPrefsUtil.getPrefsByType(Type.SHOPIFY);
    }

    /**
     * Import customers from shopify
     * 
     * @param customer
     * @return
     */

    @PUT
    @Path("/import-settings")
    public void saveImportPrefs(ContactPrefs prefs)
    {

	ContactPrefs contactPrefs = ContactPrefsUtil.mergePrefs(ContactPrefsUtil.get(prefs.id), prefs);
	contactPrefs.save();

	if (!contactPrefs.token.isEmpty() && contactPrefs != null)
	    ContactsImportUtil.initilaizeImportBackend(contactPrefs, true);

    }

    /**
     * delete shopify import prefs
     */

    @DELETE
    @Path("/import-settings")
    public void deleteShopifyPrefs()
    {
	ContactPrefsUtil.delete(Type.SHOPIFY);

    }

}
