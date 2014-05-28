package com.thirdparty.mandrill.webhook;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.EmailBounceStatus;
import com.agilecrm.contact.email.EmailBounceStatus.EmailBounceType;
import com.agilecrm.contact.util.ContactUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>MandrillWebhook</code> is the webhook servlet to handle hard bounce and
 * soft bounces
 * 
 * @author naresh
 * 
 */
@SuppressWarnings("serial")
public class MandrillWebhook extends HttpServlet
{

    public static final String MANDRILL_EVENTS = "mandrill_events";

    public static final String EVENT = "event";
    public static final String HARD_BOUNCE = "hard_bounce";
    public static final String SOFT_BOUNCE = "soft_bounce";

    public static final String MSG = "msg";
    public static final String EMAIL = "email";
    public static final String SUBACCOUNT = "subaccount";

    public void service(HttpServletRequest req, HttpServletResponse res)
    {
	try
	{
	    String mandrillEvents = req.getParameter(MANDRILL_EVENTS);

	    String event = "";

	    if (StringUtils.isBlank(mandrillEvents))
		return;

	    JSONArray events = new JSONArray(mandrillEvents);

	    for (int i = 0, len = events.length(); i < len; i++)
	    {
		JSONObject eventJSON = events.getJSONObject(i);

		event = eventJSON.getString(EVENT);

		System.out.println("Mandrill webhook event is " + event);

		// Set to contact if event is HardBounce or SoftBounce
		if (StringUtils.equalsIgnoreCase(event, HARD_BOUNCE)
			|| StringUtils.equalsIgnoreCase(event, SOFT_BOUNCE))
		    setBounceStatusToContact(eventJSON);
	    }
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in Mandrill Webhook post..." + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Sets bounce state for a contact within namespace
     * 
     * @param eventJSON
     *            webhook event
     */
    private void setBounceStatusToContact(JSONObject eventJSON)
    {
	String oldNamespace = NamespaceManager.get();

	try
	{
	    if (!eventJSON.has(MSG))
		return;

	    JSONObject msgJSON = eventJSON.getJSONObject(MSG);

	    if (!msgJSON.has(SUBACCOUNT) || !msgJSON.has(EMAIL))
		return;

	    // Return if empty namespace
	    if (StringUtils.isBlank(msgJSON.getString(SUBACCOUNT)))
		return;

	    NamespaceManager.set(msgJSON.getString(SUBACCOUNT));

	    // By default SOFT_BOUNCE
	    EmailBounceType type = EmailBounceType.SOFT_BOUNCE;

	    if (HARD_BOUNCE.equals(eventJSON.getString(EVENT)))
		type = EmailBounceType.HARD_BOUNCE;

	    setContactEmailBounceStatus(msgJSON.getString(EMAIL), type);
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while setting email bounce status..." + e.getMessage());
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }

    /**
     * Set bounce status to contact having obtained email
     * 
     * @param email
     *            - bounced email-id
     * @param emailBounceType
     *            - Hard Bounce or SoftBounce
     */
    private void setContactEmailBounceStatus(String email, EmailBounceType emailBounceType)
    {
	try
	{

	    Contact contact = ContactUtil.searchContactByEmail(email);

	    if (contact == null)
	    {
		System.err.println("Contact didn't exist having email " + email);
		return;
	    }

	    EmailBounceStatus emailBounceStatus = new EmailBounceStatus(email, emailBounceType);
	    contact.emailBounceStatus.add(emailBounceStatus);
	    contact.save();
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while saving contact..." + e.getMessage());
	    e.printStackTrace();
	}
    }
}
