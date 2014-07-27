package com.thirdparty.shopify;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.contact.sync.SyncClient;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactUtilServlet;
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
	 return ContactPrefsUtil.getPrefsByType(SyncClient.SHOPIFY);
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

	ContactPrefs contactPrefs = ContactPrefsUtil.get(prefs.id);
	contactPrefs.save();

	if (!contactPrefs.token.isEmpty() && contactPrefs != null)
		ContactsImportUtil.initilaizeImportBackend(contactPrefs);


    }
    
    /**
     * Delete prefs.
     */
    @DELETE
    @Path("/import-settings")
    public void deletePrefs()
    {
	ContactPrefsUtil.delete(SyncClient.SHOPIFY);

    }

}
