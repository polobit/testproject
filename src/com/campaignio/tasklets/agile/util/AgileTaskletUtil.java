package com.campaignio.tasklets.agile.util;

import java.util.Calendar;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.email.bounce.EmailBounceStatus;
import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus.UnsubscribeType;
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

	// Return if contact is company.
	if (contact.type.equals(Contact.Type.COMPANY))
	{
	    System.err.println("Campaign cannot be executed for company contact.");
	    return null;
	}

	try
	{
	    JSONObject subscriberJSON = new JSONObject();

	    List<ContactField> properties = contact.getProperties();

	    // Contact Properties
	    for (ContactField field : properties)
	    {
		// If field is null just continue
		if (field == null)
		    continue;

		if (field.name != null && field.value != null)
		{
		    // Gets twitter-id from website property
		    if (field.name.equals(Contact.WEBSITE) && "TWITTER".equals(field.subtype))
			field.name = "twitter_id";

		    // Get LinkedIn id
		    if (field.name.equals(Contact.WEBSITE) && "LINKEDIN".equals(field.subtype))
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
			    System.err.println("Exception occured while converting address string to json "
				    + e.getMessage());
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
	    subscriberJSON.put("created_date",
		    DateUtil.getGMTDateInGivenFormat(contact.created_time * 1000, "MM/dd/yyyy"));
	    subscriberJSON.put("modified_date",
		    DateUtil.getGMTDateInGivenFormat(contact.updated_time * 1000, "MM/dd/yyyy"));

	    subscriberJSON.put("powered_by", EmailUtil.getPoweredByAgileLink("campaign", "Powered by"));

	    System.out.println("SubscriberJSON in WorkflowUtil: " + subscriberJSON);

	    // Add Id and data
	    JSONObject subscriberJSONWithAddedParams = new JSONObject();

	    subscriberJSONWithAddedParams.put("data", subscriberJSON).put("id", contact.id)
		    .put("isUnsubscribedAll", isUnsubscribedAll(contact));

	    // If isBounce not null
	    if (isBounce(contact, subscriberJSON) != null)
		subscriberJSONWithAddedParams.put("isBounce", isBounce(contact, subscriberJSON));

	    return subscriberJSONWithAddedParams;
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
     * Checks whether contact's unsubscribeStatus contains ALL type, inorder to
     * avoid further sending emails through campaign. If contains ALL, return
     * true, otherwise false.
     * 
     * @param contact
     *            - Contact object
     * @return boolean value
     */
    public static boolean isUnsubscribedAll(Contact contact)
    {
	// By default false
	boolean isAll = false;

	try
	{
	    // Iterating from the end, to get status faster
	    for (int i = contact.unsubscribeStatus.size() - 1; i >= 0; i--)
	    {
		UnsubscribeStatus unsubscribeStatus = contact.unsubscribeStatus.get(i);

		if (unsubscribeStatus == null)
		    continue;

		// If unsubscribe type is ALL, break and return true
		if (unsubscribeStatus.unsubscribeType == UnsubscribeType.ALL)
		{
		    System.out.println("Contact has All status...");
		    isAll = true;
		    break;
		}
	    }
	}
	catch (Exception e)
	{
	    System.err.print("Exception occured while iterating unsubscribe status " + e.getMessage());
	    e.printStackTrace();
	}

	return isAll;
    }

    /**
     * Checks whether contact's email is hard bounced
     * 
     * @param contact
     *            - Contact object
     * @return boolean value
     */
    public static EmailBounceType isBounce(Contact contact, JSONObject subscriberJSON)
    {

	if (!subscriberJSON.has(Contact.EMAIL))
	    return null;

	try
	{

	    for (EmailBounceStatus emailBounceStatus : contact.emailBounceStatus)
	    {
		if (StringUtils.equals(emailBounceStatus.email, subscriberJSON.getString(Contact.EMAIL)))
		{
		    if (emailBounceStatus.emailBounceType.equals(EmailBounceType.HARD_BOUNCE))
			return EmailBounceType.HARD_BOUNCE;

		    return EmailBounceType.SOFT_BOUNCE;
		}
	    }

	}
	catch (Exception e)
	{
	    System.err.print("Exception occured while iterating emailBounceStatus " + e.getMessage());
	    e.printStackTrace();
	}

	return null;
    }

    /**
     * Returns subscriberJSON for given contact.
     * 
     * @param updatedContact
     *            - contact object
     * @param oldSubscriberJSON
     *            - old subscriberJSON
     * @return JSONObject
     */
    public static JSONObject getUpdatedSubscriberJSON(Contact updatedContact, JSONObject oldSubscriberJSON)
    {
	// Update subscriberJSON
	JSONObject updatedSubscriberJSON = AgileTaskletUtil.getSubscriberJSON(updatedContact);

	// If any exception occured return old
	if (updatedSubscriberJSON == null)
	{
	    System.err.println("Updated subscriber json is null...");
	    return oldSubscriberJSON;
	}

	return updatedSubscriberJSON;
    }

    /**
     * Returns contactOwner id if selected owner option is Contact's owner
     * 
     * @param givenOwnerId
     *            - selected owner id from UI.
     * @param contactOwnerId
     *            - contact owner id from subscriberJSON
     * @return String
     */
    public static Long getOwnerId(String givenOwnerId, Long contactOwnerId)
    {
	// If contact_owner, then owner is contact owner
	if (givenOwnerId.equals("contact_owner"))
	    return contactOwnerId;

	if (givenOwnerId.equals("any_owner"))
	    return null;

	return Long.parseLong(givenOwnerId);
    }
}