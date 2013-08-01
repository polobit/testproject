package com.agilecrm.core.api.contacts;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.contact.imports.ContactPrefs;
import com.agilecrm.contact.imports.ContactPrefs.Type;

/**
 * <code>ContactPrefsAPI</code> includes REST calls to interact with
 * {@link ContactPrefs} class
 * <p>
 * It is called from client side to create, update, fetch and delete the import
 * contacts preferences.
 * </p>
 * 
 * @author
 * 
 */
@Path("/api/contactprefs")
public class ContactPrefsAPI
{

    /**
     * Fetches import contact preferences.
     * 
     * If count is null fetches all the contacts at once
     * 
     * 
     * @return {@link ContactPrefs}
     */
    @Path("/google")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public ContactPrefs getContactPrefs()
    {

	System.out.println("in contact prefs api");
	return ContactPrefs.getPrefsByType(Type.GOOGLE);
    }
}
