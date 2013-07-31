package com.agilecrm.contact.imports;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.ObjectInputStream;
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
     * Called from backends.
     */
    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {

	try
	{

	    System.out.println("in contact util servlet");
	    InputStream stream = req.getInputStream();
	    byte[] contactPrefsByteArray = IOUtils.toByteArray(stream);

	    ByteArrayInputStream b = new ByteArrayInputStream(
		    contactPrefsByteArray);
	    ObjectInputStream o = new ObjectInputStream(b);

	    System.out
		    .println("contactPrefsByteArray " + contactPrefsByteArray);
	    ContactPrefs contactPrefs = (ContactPrefs) o.readObject();

	    System.out.println("domain user key in contacts util servlet "
		    + contactPrefs.getDomainUser());
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

	// contactPrefs = ContactPrefs.get(contactPrefs.id);

	Key<DomainUser> key = contactPrefs.getDomainUser();
	String nameSpace = DomainUserUtil.getDomainUser(key.getId()).domain;
	System.out.println("namespace " + nameSpace);

	NamespaceManager.set(nameSpace);

	if ((contactPrefs.expires - 60000) <= System.currentTimeMillis())
	    refreshPrefsandSave(contactPrefs);

	System.out.println("contactprefs token : " + contactPrefs.token);
	List<ContactEntry> entries = GoogleContactToAgileContactUtil
		.retrieveContacts(contactPrefs.token);

	ContactsImportUtil.saveGoogleContactsInAgile(entries, key);
    }

    public static void refreshPrefsandSave(ContactPrefs contactPrefs)
	    throws Exception
    {
	System.out.println("in refresh token og google contact prefs");
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
	    System.out.println("domiain user key in refresh token method: "
		    + contactPrefs.getDomainUser());
	    contactPrefs.save();
	}

    }
}