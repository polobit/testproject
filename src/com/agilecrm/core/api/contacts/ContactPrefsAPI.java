package com.agilecrm.core.api.contacts;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.contact.imports.ContactPrefs;
import com.agilecrm.contact.imports.ContactPrefs.Type;

@Path("/api/contactprefs")
public class ContactPrefsAPI
{

    @Path("/google")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public ContactPrefs getContactPrefs()
    {

	System.out.println("in contact prefs api");
	return ContactPrefs.getPrefsByType(Type.GOOGLE);
    }
}
