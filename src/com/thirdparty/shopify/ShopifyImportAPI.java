package com.thirdparty.shopify;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.Type;
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

    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:ss");
    String date = df.format(new Date()).substring(0, 10);

    /**
     * validating and saving users ContactPrefs
     * 
     * @param shopname
     * @param apiKey
     * @param apiPass
     * @return
     * @throws Exception
     */

    @Path("/save")
    @POST
    @Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactPrefs isAutherize(@FormParam("Shop") String shopname) throws Exception
    {

	try
	{
	    
	 ContactPrefs pref = new ContactPrefs();
		pref.userName = shopname;
		
	    if (ShopifyUtil.isValid(pref))
		pref.save();
	    return pref;
	}

	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    @GET
    @Path("/getPref")
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactPrefs getContactPref()
    {
	ContactPrefs prefs = ContactPrefsUtil.getPrefsByType(Type.SHOPIFY);
	return prefs;
    }

    /**
     * Import customers from shopify
     * 
     * @param customer
     * @return
     */

    @POST
    @Path("/importCustomer")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactPrefs importCustomers(@FormParam("customer") boolean customer)
    {
	ArrayList<String> list = new ArrayList<String>();
	ContactPrefs pref = ContactPrefsUtil.getPrefsByType(Type.SHOPIFY);
	try
	{
	    if (pref != null)
	    {

		if (customer)
		    list.add("customer");
		pref.thirdPartyField = list;

		if (pref.count == 0)
		    ContactsImportUtil.initilaizeImportBackend(pref);
		else
		{
		    ShopifyUtil.sync();
		    pref.last_update_time = date;
		    pref.save();
		}
	    }

	    return pref;
	}
	catch (Exception e)
	{
	    ContactsImportUtil.initilaizeImportBackend(pref);
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

}
