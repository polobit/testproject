package com.agilecrm.contact.imports;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.agilecrm.contact.imports.util.ContactsImportUtil;
import com.agilecrm.social.GoogleContactToAgileContactUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.gdata.data.contacts.ContactEntry;
import com.googlecode.objectify.Key;

/**
 * <code>ContactUtilServlet</code> contains method to import contacts
 * 
 * @author Tejaswi
 * 
 */
@SuppressWarnings("serial")
public class ContactUtilServlet extends HttpServlet
{
    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {
	doGet(req, res);
    }

    /**
     * Imports the contacts from Google based checking {@link ContactPrefs}.If
     * called from backend requset has no parameters and continues with
     * importing contacts
     */
    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {

	try
	{

	    // if request contains parameters, request is from import.js
	    // else backends calls this servlet
	    String returnUrl = req.getParameter("return_url");
	    if (returnUrl != null)
	    {
		String type = req.getParameter("service");
		ContactPrefs contactPrefs = ContactPrefs
			.getPrefsByType(ContactPrefs.Type.valueOf(type
				.toUpperCase()));

		// if contact prefs exists for google initilaize backend
		System.out.println("in ininin");
		System.out.println(contactPrefs);
		ContactsImportUtil.initilaizeImportBackend(contactPrefs);
		return;
	    }

	    // retrieves contact prefs from db and saves conatct to agile
	    System.out.println("in servlet");
	    InputStream stream = req.getInputStream();
	    String contactSyncerPrefsString = IOUtils.toString(stream);

	    System.out.println(contactSyncerPrefsString);
	    ContactPrefs contactPrefs = new ObjectMapper().readValue(
		    contactSyncerPrefsString, ContactPrefs.class);

	    System.out.println(contactPrefs);
	    importContacts(contactPrefs);

	}
	catch (Exception e)
	{
	    System.out.println("in sync servlet");
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }

    /**
     * Calls {@link GoogleContactToAgileContactUtil} to retrieve contacts
     * 
     * @param contactPrefs
     *            {@link ContactPrefs}
     * @throws Exception
     */
    public static void importContacts(ContactPrefs contactPrefs)
	    throws Exception
    {

	System.out.println(contactPrefs.token);

	if ((contactPrefs.expires - 60000) <= System.currentTimeMillis())
	    refreshPrefsandSave(contactPrefs);

	List<ContactEntry> entries = GoogleContactToAgileContactUtil
		.retrieveContacts(contactPrefs.token);

	Key<DomainUser> key = ContactPrefs.get(contactPrefs.id).getDomainUser();
	String nameSpace = DomainUserUtil.getDomainUser(ContactPrefs
		.get(contactPrefs.id).getDomainUser().getId()).domain;
	System.out.println("namespace " + nameSpace);

	NamespaceManager.set(nameSpace);

	ContactsImportUtil.saveGoogleContactsInAgile(entries, key);
    }

    public static void refreshPrefsandSave(ContactPrefs contactPrefs)
	    throws Exception
    {
	System.out.println("in refresh token");
	String response = GoogleContactToAgileContactUtil
		.refreshTokenInGoogle(contactPrefs.refreshToken);

	// Creates HashMap from response JSON string
	HashMap<String, Object> properties = new ObjectMapper().readValue(
		response, new TypeReference<HashMap<String, Object>>()
		{
		});
	System.out.println(properties.toString());

	if (properties.containsKey("error"))
	    throw new Exception(String.valueOf(properties.get("error")));
	else if (properties.containsKey("access_token"))
	{
	    contactPrefs.token = String.valueOf(properties.get("access_token"));
	    contactPrefs.expires = Long.parseLong(String.valueOf(properties
		    .get("expires_in")));
	    contactPrefs.save();
	}

    }
}