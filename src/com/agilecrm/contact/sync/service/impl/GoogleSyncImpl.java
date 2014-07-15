/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.List;

import org.scribe.utils.Preconditions;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.service.TwoWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;
import com.agilecrm.contact.sync.wrapper.impl.GoogleContactWrapperImpl;
import com.google.gdata.client.Query;
import com.google.gdata.client.authn.oauth.OAuthException;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.DateTime;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;
import com.google.gdata.util.ServiceException;
import com.thirdparty.google.GoogleServiceUtil;

/**
 * @author jitendra
 * 
 */
public class GoogleSyncImpl extends TwoWaySyncService
{
    private ContactsService contactService;

    public void syncContactFromClient()
    {
	String accessToken = prefs.token;

	Preconditions.checkEmptyString(accessToken, "Access token is empty");

	// Builds service with token
	try
	{
	    contactService = GoogleServiceUtil.getService(accessToken);
	}
	catch (OAuthException e1)
	{
	    // TODO Auto-generated catch block
	    e1.printStackTrace();
	    return;
	}
	URL feedUrl = null;
	Query myQuery = null;

	try
	{

	    // myQuery.setUpdatedMin(dateTime);
	    feedUrl = new URL(GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL + "contacts/default/full");

	    /*
	     * // Sets feed url feedUrl = new
	     * URL(GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL +
	     * "contacts/default/full");
	     */
	}
	catch (MalformedURLException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	DateTime dateTime = new DateTime(prefs.last_synced_from_client);
	// Build query with URL
	myQuery = new Query(feedUrl);
	myQuery.setMaxResults(MAX_SYNC_LIMIT);

	System.out.println(dateTime);
	myQuery.setUpdatedMin(dateTime);
	myQuery.setStringCustomParameter("access_token", prefs.token);

	System.out.println(myQuery.getQueryUri());

	/*
	 * If sync from group is not null then considering user chose a group to
	 * sync from instead of default "My contacts" group. If it is null then
	 * , by default, contacts are fetched from My contacts group.
	 */
	if (prefs.sync_from_group != null)
	{
	    prefs.sync_from_group = URLDecoder.decode(prefs.sync_from_group);

	    // Setting group query
	    myQuery.setStringCustomParameter("group", prefs.sync_from_group);
	}

	/*
	 * To avoid fetching contacts that are already synced, query is set to
	 * fetch contacts that are created/updated after last syced time (which
	 * is created time of last contact fetched from google)
	 */

	/*
	 * Query set to fetch contacts ordered by last modified time, so saving
	 * last contacts time can be saved in last synced time
	 */
	myQuery.setStringCustomParameter("orderby", "lastmodified");

	ContactFeed resultFeed = null;

	// Retrieves result feed
	try
	{
	    resultFeed = contactService.getFeed(myQuery, ContactFeed.class);
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (ServiceException e)
	{
	    e.printStackTrace();
	}

	Preconditions.checkNotNull(resultFeed, "Result contact feed is null");

	System.out.println("total results from google " + resultFeed.getEntries().size());
	saveContactsInAgile(resultFeed.getEntries());
    }

    private void saveContactsInAgile(List<ContactEntry> entries)
    {
	for (ContactEntry entry : entries)
	{

	    wrapContactToAgileSchemaAndSave(entry);
	}
	isLimitExceeded();
    }

    @Override
    public List<Contact> fetchNewContactsFromAgile()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public List<Contact> fetchUpdatedContactsFromAgile()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public void uploadContactsToClient(List<Contact> contacts)
    {
	// TODO Auto-generated method stub

    }

    @Override
    public Class<? extends WrapperService> getWrapperService()
    {
	// TODO Auto-generated method stub
	return GoogleContactWrapperImpl.class;
    }
}
