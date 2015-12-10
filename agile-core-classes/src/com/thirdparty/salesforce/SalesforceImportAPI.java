package com.thirdparty.salesforce;

import java.io.IOException;
import java.net.SocketTimeoutException;
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

import com.agilecrm.contact.sync.Type;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactsImportUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

@Path("/api/salesforce")
public class SalesforceImportAPI
{

    @Path("/save")
    @POST
    @Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactPrefs saveSalesforcePrefs(@FormParam("username") String username,
	    @FormParam("password") String password, @FormParam("apiKey") String apiKey)
    {
	System.out.println("In SalesforceImportAPI save");

	ContactPrefs contactPrefs = new ContactPrefs();

	contactPrefs.userName = username;
	contactPrefs.password = password;
	contactPrefs.apiKey = apiKey;
	contactPrefs.type = Type.SALESFORCE;

	try
	{

	    System.out.println(contactPrefs);
	    SalesforceUtil.checkSalesforcePrefs(contactPrefs);
	    contactPrefs.save();

	    return contactPrefs;
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occurred. Refresh and Please try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    @Path("/import")
    @POST
    @Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactPrefs importFromSalesforce(@FormParam("accounts") boolean accounts,
	    @FormParam("leads") boolean leads, @FormParam("contacts") boolean contacts,
	    @FormParam("deals") boolean deals, @FormParam("cases") boolean cases)
    {
	System.out.println("In SalesforceImportAPI save");

	ContactPrefs contactPrefs = ContactPrefsUtil.getPrefsByType(Type.SALESFORCE);

	System.out.println(contactPrefs);
	try
	{

	    List<String> list = new ArrayList<String>();

	    if (accounts)
		list.add("accounts");

	    if (leads)
		list.add("leads");

	    if (contacts)
		list.add("contacts");

	    if (deals)
		list.add("deals");

	    if (cases)
		list.add("cases");

	    contactPrefs.importOptions = list;
	    ContactsImportUtil.initilaizeImportBackend(contactPrefs, true);

	    return contactPrefs;
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

}
