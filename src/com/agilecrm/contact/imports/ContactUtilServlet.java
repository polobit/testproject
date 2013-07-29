package com.agilecrm.contact.imports;

import java.io.InputStream;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.contact.imports.util.ContactsImporter;
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

	    // if request contains parameters, it is first time request and is
	    // redirected to scribe
	    String returnUrl = req.getParameter("return_url");
	    if (returnUrl != null)
	    {
		String type = req.getParameter("service");
		ContactPrefs contactPrefs = ContactPrefs
			.getPrefsByType(ContactPrefs.Type.valueOf(type
				.toUpperCase()));

		// after getting token initilaizes backends
		if (contactPrefs == null)
		{
		    res.sendRedirect("/scribe?service=" + type + "&return_url="
			    + returnUrl);
		    return;
		}

		// if contact prefs exists for google initilaize backend
		System.out.println("in ininin");
		System.out.println(contactPrefs);
		ContactsImporter.initilaizeImportBackend(contactPrefs);
		return;
	    }

	    // retrives contact prefs from db and saves conatct to agile
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

	System.out.println("import first");
	System.out.println(contactPrefs.token);
	List<ContactEntry> entries = GoogleContactToAgileContactUtil
		.retrieveContacts(contactPrefs.token);

	Key<DomainUser> key = ContactPrefs.get(contactPrefs.id).getDomainUser();
	String nameSpace = DomainUserUtil.getDomainUser(ContactPrefs
		.get(contactPrefs.id).getDomainUser().getId()).domain;
	System.out.println("namespace " + nameSpace);

	NamespaceManager.set(nameSpace);

	ContactsImporter.importGoogleContactsWithAgile(entries, key);
    }
}