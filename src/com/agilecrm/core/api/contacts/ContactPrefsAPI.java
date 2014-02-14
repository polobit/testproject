package com.agilecrm.core.api.contacts;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.Type;
import com.thirdparty.google.utl.ContactPrefsUtil;

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
	@Path("/{type}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public ContactPrefs getContactPrefs(@PathParam("type") String type)
	{

		System.out.println("in contact prefs api");
		return ContactPrefsUtil.getPrefsByType(Type.GOOGLE);
	}

	@Path("/{type}")
	@PUT
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void updateContactPrefs(@PathParam("type") String type, ContactPrefs prefs)
	{

		System.out.println("in contact prefs api");

		if (prefs.id == null)
			return;

		ContactPrefs currentPrefs = ContactPrefsUtil.get(prefs.id);

		ContactPrefsUtil.mergePrefs(currentPrefs, prefs);

		currentPrefs.save();
	}

	/**
	 * Fetches import contact preferences.
	 * 
	 * If count is null fetches all the contacts at once
	 * 
	 * 
	 * @return {@link ContactPrefs}
	 */
	@Path("{type}")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteContactPrefs(@PathParam("type") String type)
	{
		ContactPrefs.Type prefsType = ContactPrefs.Type.valueOf(type.toUpperCase());
		if (prefsType != null)
			ContactPrefsUtil.delete(prefsType);
	}
}
