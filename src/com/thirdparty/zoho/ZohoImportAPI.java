/**
 * 
 */
package com.thirdparty.zoho;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
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
 * <code>ZohoImport</code> This class Used for REST call for saving user Auth
 * preferences and Importing contact from saved preferences;
 * 
 * @author jitendra
 * 
 */
@Path("/api/zoho")
public class ZohoImportAPI
{

    /**
     * This Method is used for saving user zoho crm auth preferences
     * 
     * @param username
     * @param password
     * @param authtoken
     * @return
     */
    @Path("/save")
    @POST
    @Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactPrefs saveAuthPrefs(@FormParam("username") String username, @FormParam("password") String password,
	    @FormParam("authtoken") String authtoken)
    {
	ContactPrefs ctx = new ContactPrefs();
	ctx.userName = username;
	ctx.password = password;
	ctx.token = authtoken;
	ctx.type = Type.ZOHO;
	try
	{

	    if (ZohoUtils.isValidContactPrefs(ctx))
		ctx.save();
	    else
	    {
		throw new Exception("Invalid login. Please try again");
	    }

	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

	return ctx;
    }

    /**
     * This method will do import data from zoho crm from different modules
     * 
     * @param accounts
     * @param leads
     * @param contacts
     * @return
     */
    @Path("/import")
    @POST
    @Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
    @Produces({ MediaType.APPLICATION_JSON })
    public ContactPrefs importFromZoho(@FormParam("accounts") boolean accounts, @FormParam("leads") boolean leads,
	    @FormParam("contacts") boolean contacts)
    {

	ContactPrefs ctxPrefs = ContactPrefsUtil.getPrefsByType(Type.ZOHO);
	List<String> list = new ArrayList<String>();

	if (accounts)
	    list.add("accounts");

	if (leads)
	    list.add("leads");

	if (contacts)
	    list.add("contacts");

	ctxPrefs.thirdPartyField = list;
	try
	{
	    ContactsImportUtil.initilaizeImportBackend(ctxPrefs);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return ctxPrefs;

    }

}
