package com.campaignio.tasklets.agile.util;

import java.io.UnsupportedEncodingException;
import java.util.Calendar;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.campaignio.reports.DateUtil;
import com.google.common.base.Joiner;
import com.google.common.base.Splitter;
import com.googlecode.objectify.Key;

/**
 * <code>AgileTaskletUtil</code> is the utility class for agile tasklets. It
 * fetches owner required for AddNote. It normalizes the tags string entered in
 * Tags and CheckTags.
 * 
 * @author Naresh
 * 
 */
public class AgileTaskletUtil
{
    // JSON - Google App Engine DB Key
    public final static String DATASTORE_KEY_IN_JSON = "id";

    // Default encoding to convert Unicode strings
    public final static String DEFAULT_ENCODING = "UTF-8";

    /**
     * Returns contact owner-id from subscriberJSON.
     * 
     * @param subscriberJSON
     *            - SubscriberJSON
     * @return String
     */
    public static String getContactOwnerIdFromSubscriberJSON(JSONObject subscriberJSON)
    {
	String ownerId = null;

	try
	{
	    JSONObject owner = subscriberJSON.getJSONObject("data").getJSONObject("owner");

	    if (owner.length() != 0)
		ownerId = owner.getString("id");

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return ownerId;
    }

    /**
     * Returns AgileUser key
     * 
     * @param ownerId
     *            - DomainUser Id.
     * @return Key
     */
    public static Key<AgileUser> getAgileUserKey(Long ownerId)
    {
	AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(ownerId);
	Key<AgileUser> owner = new Key<AgileUser>(AgileUser.class, agileUser.id);
	return owner;
    }

    /**
     * Normalizes the given string separated by any delimiter. Inorder to
     * normalize, Splitter and Joiner methods are used. For e.g.,
     * ",a,b ,c, d,e," is converted to "a,b,c,d,e"
     * 
     * @param separator
     *            - Any separator like comma.
     * @param str
     *            - String that needs to be normalized.
     * @return normalized String
     */
    public static String normalizeStringSeparatedByDelimiter(char separator, String str)
    {
	Splitter splitter = Splitter.on(separator).omitEmptyStrings().trimResults();
	Joiner joiner = Joiner.on(separator).skipNulls();
	return joiner.join(splitter.split(str));
    }

    /**
     * Makes the number as starting with "+1", if it does not so.
     * 
     * @param number
     * @return number starts with +1
     */
    public static String changeNumber(String number)
    {
	// Add if it does not start with 1 or +
	if (number.startsWith("+"))
	    return number;

	if (number.startsWith("1"))
	    return "+" + number;

	return "+1" + number;
    }

    /**
     * Gets ID from JSONObject - gets id from json.
     * 
     * @param json
     *            JSONObject reference
     * @return value of the id attribute of given json object
     */
    public static String getId(JSONObject json)
    {
	try
	{
	    return json.getString(AgileTaskletUtil.DATASTORE_KEY_IN_JSON);
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    /**
     * Converts contact object into json object.
     * 
     * @param contact
     *            Contact object that subscribes to workflow.
     * @return JsonObject of contact.
     */
    public static JSONObject getSubscriberJSON(Contact contact)
    {
	if (contact == null)
	    return null;

	try
	{
	    JSONObject subscriberJSON = new JSONObject();

	    List<ContactField> properties = contact.getProperties();

	    // Contact Properties
	    for (ContactField field : properties)
	    {
		if (field.name != null && field.value != null)
		{
		    // Gets twitter-id from website property
		    if (field.name.equals(Contact.WEBSITE) && field.subtype.equals("TWITTER"))
			field.name = "twitter_id";

		    // Get LinkedIn id
		    if (field.name.equals(Contact.WEBSITE) && field.subtype.equals("LINKEDIN"))
			field.name = "linkedin_id";

		    // Converts address string to JSONObject
		    if (field.name.equals(Contact.ADDRESS))
		    {
			try
			{
			    // Address property is saved as json string with
			    // city, state
			    // and country, so converting to json.
			    subscriberJSON.put("location", new JSONObject(field.value));
			}
			catch (JSONException e)
			{
			    e.printStackTrace();
			}

			// Already inserted address as location, so continue
			continue;

		    }

		    subscriberJSON.put(field.name, field.value);
		}
	    }

	    // Get contact owner.
	    DomainUser domainUser = contact.getOwner();
	    JSONObject owner = new JSONObject();

	    if (domainUser != null)
	    {
		owner.put("id", domainUser.id);
		owner.put("name", domainUser.name);
		owner.put("email", domainUser.email);
	    }

	    // Inserts contact owner-name and owner-email.
	    subscriberJSON.put("owner", owner);

	    // Score
	    subscriberJSON.put("score", contact.lead_score);

	    // Returns Created and Updated date in GMT with given format.
	    subscriberJSON.put("created_date", DateUtil.getGMTDateInGivenFormat(contact.created_time * 1000, "MM/dd/yyyy"));
	    subscriberJSON.put("modified_date", DateUtil.getGMTDateInGivenFormat(contact.updated_time * 1000, "MM/dd/yyyy"));

	    System.out.println("SubscriberJSON in WorkflowUtil: " + subscriberJSON);

	    // Add Id and data
	    return new JSONObject().put("data", subscriberJSON).put("id", contact.id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while converting contact to subscriberJSON " + e.getMessage());
	    return null;
	}
    }

    /**
     * Converts list of contacts into JSONArray.
     * 
     * @param contacts
     *            List of Contact objects subscribed to campaign.
     * @return JSONArray of list of contacts.
     */
    public static JSONArray getSubscriberJSONArray(List<Contact> contacts)
    {
	JSONArray subscriberJSONArray = new JSONArray();

	for (Contact contact : contacts)
	{
	    if (contact != null)
		subscriberJSONArray.put(getSubscriberJSON(contact));
	}

	return subscriberJSONArray;
    }

    /**
     * Returns date set to mid-night in millisecs.
     * 
     * @param days
     *            - Given number of days.
     * @return Long
     */
    public static Long getDateInEpoch(String days)
    {
	Calendar calendar = Calendar.getInstance();

	// Add duration and make time set to midnight of that day.
	calendar.add(Calendar.DAY_OF_MONTH, Integer.parseInt(days));
	calendar.set(Calendar.HOUR_OF_DAY, 0);
	calendar.set(Calendar.MINUTE, 0);
	calendar.set(Calendar.SECOND, 0);
	calendar.set(Calendar.MILLISECOND, 0);

	return calendar.getTimeInMillis() / 1000;
    }

    /**
     * Returns encoded string. Mostly UTF-8 is used for encoding different kind
     * of international characters for sending through internet.
     * 
     * @param str
     *            - String need to be encoded
     * @return String
     */
    public static String getUTF8String(String str)
    {
	// if null or empty return
	if (StringUtils.isBlank(str))
	    return str;

	try
	{
	    // Converts string into default encoded.
	    String encodedString = new String(str.getBytes(DEFAULT_ENCODING), DEFAULT_ENCODING);
	    return encodedString;
	}
	catch (UnsupportedEncodingException e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while encoding...");
	    return str;
	}
    }
}