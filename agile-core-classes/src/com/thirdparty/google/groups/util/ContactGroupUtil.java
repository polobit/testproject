package com.thirdparty.google.groups.util;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.google.gdata.client.Query;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.PlainTextConstruct;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;
import com.google.gdata.data.contacts.ContactGroupEntry;
import com.google.gdata.data.contacts.ContactGroupFeed;
import com.google.gdata.data.contacts.GroupMembershipInfo;
import com.google.gdata.data.extensions.Email;
import com.google.gdata.data.extensions.ExtendedProperty;
import com.google.gdata.util.ServiceException;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.GoogleServiceUtil;
import com.thirdparty.google.groups.GoogleGroupDetails;
import com.thirdparty.google.utl.ContactPrefsUtil;

public class ContactGroupUtil
{

    public static boolean hasGroup(ContactEntry entry, String group)
    {
	if (entry.hasEmailAddresses())
	{
	    for (Email email : entry.getEmailAddresses())
	    {

		System.out.println(email.getAddress());
	    }
	}
	List<GroupMembershipInfo> infos = entry.getGroupMembershipInfos();
	System.out.println(infos.size());
	for (GroupMembershipInfo info : infos)
	{

	    System.out.println(info.getHref());
	    System.out.println(group);
	    if (StringUtils.equals(group, info.getHref()))
		return true;
	}

	return false;
    }

    public static void printAllGroups(String token) throws Exception
    {
	// Request the feed
	URL feedUrl = new URL("https://www.google.com/m8/feeds/groups/default/full" + "?access_token=" + token +"&max-results=" + 100 );
	System.out.println(feedUrl);
	System.out.println(token);
	System.out.println("**********************************");
	Query myQuery = new Query(feedUrl);

	ContactsService service = GoogleServiceUtil.getService(token);
	ContactGroupFeed resultFeed = service.query(myQuery, ContactGroupFeed.class);

	for (ContactGroupEntry groupEntry : resultFeed.getEntries())
	{
	    System.out.println("Atom Id: " + groupEntry.getId());
	    System.out.println("Group Name: " + groupEntry.getTitle().getPlainText());
	    System.out.println("Last Updated: " + groupEntry.getUpdated());

	    System.out.println("Extended Properties:");
	    for (ExtendedProperty property : groupEntry.getExtendedProperties())
	    {
		if (property.getValue() != null)
		{
		    System.out.println("  " + property.getName() + "(value) = " + property.getValue());
		}
		else if (property.getXmlBlob() != null)
		{
		    System.out.println("  " + property.getName() + "(xmlBlob) = " + property.getXmlBlob().getBlob());
		}
	    }
	    System.out.println("Self Link: " + groupEntry.getSelfLink().getHref());
	    if (!groupEntry.hasSystemGroup())
	    {
		// System groups do not have an edit link
		System.out.println("Edit Link: " + groupEntry.getEditLink().getHref());
		System.out.println("ETag: " + groupEntry.getEtag());
	    }
	    if (groupEntry.hasSystemGroup())
	    {
		System.out.println("System Group Id: " + groupEntry.getSystemGroup().getId());
	    }
	}
	
    }

    public static List<GoogleGroupDetails> getGroups(ContactPrefs contactPrefs) throws Exception
    {
	System.out.println(contactPrefs.expires);
	System.out.println(contactPrefs.expires - 60000);
	if ((contactPrefs.expires - 60000) <= System.currentTimeMillis())
	{
	    System.out.println(contactPrefs.token);
	    GoogleServiceUtil.refreshGoogleContactPrefsandSave(contactPrefs);
	}

	return ContactGroupUtil.getGroups(contactPrefs.token);
    }

    public static List<GoogleGroupDetails> getGroups(String token) throws Exception
    {
	ContactsService service = GoogleServiceUtil.getService(token);

	// Request the feed
	URL feedUrl = new URL(GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL + "groups/default/full" + "?access_token="
		+ token + "&max-results=" + 100);
	Query myQuery = new Query(feedUrl);
	System.out.println(feedUrl);
	System.out.println(token);

	ContactGroupFeed resultFeed = service.query(myQuery, ContactGroupFeed.class);

	List<GoogleGroupDetails> groupsList = new ArrayList<GoogleGroupDetails>();

	for (ContactGroupEntry groupEntry : resultFeed.getEntries())
	{
	    GoogleGroupDetails details = new GoogleGroupDetails(groupEntry);
	    System.out.println(details.groupName);
	    groupsList.add(details);
	}
	System.out.println(groupsList);
	return groupsList;
    }

    public static GoogleGroupDetails getSyncToGroup(ContactPrefs prefs, String group) throws ServiceException,
	    Exception
    {
	ContactsService service = GoogleServiceUtil.getService(prefs.token);

	if (prefs.sync_to_group != null)
	{
	    try
	    {

		System.out.println("urllll" + prefs.sync_to_group);
		URL postUrl = new URL(prefs.sync_to_group + "?access_token=" + prefs.token);

		GoogleGroupDetails syncToGroup = ContactPrefsUtil.getGroupBasedOnID(prefs.sync_to_group, prefs);
		if (syncToGroup != null && syncToGroup.atomId != null)
		    return syncToGroup;
	    }
	    catch (MalformedURLException e)
	    {
		group = "Agile";
		GoogleGroupDetails googleGroup = ContactPrefsUtil.getGroup(group, prefs);
		if (googleGroup != null && googleGroup.atomId != null)
		{
		    if (!googleGroup.atomId.equals(prefs.sync_to_group))
		    {
			prefs.sync_to_group = googleGroup.atomId;
			prefs.save();
		    }
		    return googleGroup;
		}
	    }
	}
	else
	{
	    System.out.println("here creating fetching from group agile");
	    group = "Agile";

	    GoogleGroupDetails googleGroup = ContactPrefsUtil.getGroup(group, prefs);
	    System.out.println(prefs.groups);
	    for (GoogleGroupDetails group1 : prefs.groups)
	    {
		System.out.println(group1.groupName);
	    }
	    // System.out.println(googleGroup.groupName);
	    if (googleGroup != null && googleGroup.atomId != null)
	    {
		prefs.sync_to_group = googleGroup.atomId;
		prefs.save();
		return googleGroup;
	    }
	}

	// Create the entry to insert
	ContactGroupEntry newGroup = new ContactGroupEntry();
	newGroup.setTitle(new PlainTextConstruct(group));

	/*
	 * ExtendedProperty additionalInfo = new ExtendedProperty();
	 * additionalInfo.setName("more info about the group");
	 * additionalInfo.setValue("Nice people.");
	 * newGroup.addExtendedProperty(additionalInfo);
	 */

	// Ask the service to insert the new entry
	URL postUrl = new URL("https://www.google.com/m8/feeds/groups/default/full?access_token=" + prefs.token);
	ContactGroupEntry createdGroup = service.insert(postUrl, newGroup);

	System.out.println("Contact group's Atom Id: " + createdGroup.getId());
	prefs.sync_to_group = createdGroup.getId();
	prefs.save();
	GoogleGroupDetails newGroupCreated = new GoogleGroupDetails(createdGroup);
	prefs.groups.add(newGroupCreated);
	return newGroupCreated;
    }

    public static void deleteGroup(ContactPrefs prefs, String atomId)
    {
	try
	{

	    String url = GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL + "groups/default/full/"
		    + URLEncoder.encode(atomId);
	    URL groupUrl = new URL(atomId);

	    ContactsService service = GoogleServiceUtil.getService(prefs.token);
	    ContactGroupEntry group = service.getEntry(groupUrl, ContactGroupEntry.class);
	    System.out.println(group);
	    ContactGroupEntry group1 = service.getEntry(new URL(url), ContactGroupEntry.class);
	    System.out.println(group1);
	    group.delete();
	}
	catch (Exception e)
	{
	    System.out.println("exception raised " + e.getMessage());
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    /**
     * Retrieves available groups in google contacts
     * 
     * @param contactService
     *            {@link ContactsService}
     * @param accessToken
     *            {@link String} access token retrieved from OAuth
     * @return {@link ContactFeed}
     * @throws Exception
     */
    public static ContactFeed getGroups(ContactsService contactService, String accessToken) throws Exception
    {
	return ContactGroupUtil.getGroups(contactService, GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL
		+ "groups/default/full", accessToken);
    }

    public static ContactFeed getGroups(ContactsService contactService, String url, String accessToken)
	    throws IOException, ServiceException
    {

	URL feedUrl = new URL(GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL + "groups/default/full?" + "access_token="
		+ accessToken);

	// Build query with URL
	Query myQuery = new Query(feedUrl);

	// queries google for groups
	return contactService.query(myQuery, ContactFeed.class);
    }
    
    public static void main(String[] args)
    {
	try
	{
	    printAllGroups("ya29.UgBBEEB9obXY5iEAAABiCc94PPJxRT1t3cvmGBjemMrQ08BS3olI2zAQI8qLqNvh5V97yRPwJ52EsvjjrSU");
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	
    }

}
