package com.agilecrm.social;

import net.helpscout.api.ApiClient;
import net.helpscout.api.Page;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.user.AgileUser;
import com.agilecrm.widgets.Widget;
import com.google.gson.Gson;

/**
 * The <code>HelpScoutUtil</code> class acts as a Client to HelpScout server
 * 
 * <code>HelpScoutUtil</code> class contains methods for interacting with the
 * HelpScout server using REST API.
 * 
 * @author Saikiran
 * @since April 2014
 */
public class HelpScoutUtil
{

    /**
     * Creates a {@link HelpScoutRestClient} instance and sets the account
     * api_key of {@link AgileUser} HelpScout account.
     * 
     * @param widget
     *            {@link Widget} to get account SID
     * @return {@link ApiClient} after setting api_key required to connect with
     *         the HelpScout server.
     * @throws Exception
     */
    private static ApiClient getHelpScoutApiClient(Widget widget)
    {
	ApiClient client = ApiClient.getInstance();
	client.setKey(widget.getProperty("helpscout_api_key"));

	return client;
    }

    /**
     * Call the HelpScout server for getting the Customer Information based on
     * the Email.
     * 
     * @param widget
     *            the Widget object containing the API_Key for the HelpScout
     *            widget.
     * @param email
     *            the email address of the customer used to search the customer
     *            details.
     * @return the Customer details as JSON String.
     * @throws Exception
     */
    public static String getCustomerByEmail(Widget widget, String email) throws Exception
    {
	// JSONObject for saving all the email categorized on Mailbox.
	JSONObject customerMails = new JSONObject();
	// For converting the Collection to JSON String.
	Gson gson = new Gson();
	// Get the HelpScout API Client with API_key.
	ApiClient client = getHelpScoutApiClient(widget);

	// Get the Customer name based upon the Email provided.
	Page page = client.searchCustomers(email, null, null);

	// If there are no customers with that email, respond with a suitable
	// message.
	if (page.getCount() <= 0)
	{
	    customerMails.put("message", "No Customers with this Email.");
	    return customerMails.toString();
	}

	// If there is a customer, get the Id.
	JSONArray customers = new JSONArray(gson.toJson(page.getItems()));

	return customers.getJSONObject(0).toString();

    }

    /**
     * Calls HelpScout Server using HelpScout Java API to get the details of the
     * contact
     * 
     * @param widget
     *            {@link Widget} to retrieve plugin prefs from zendesk account
     *            of agile user
     * @param email
     *            {@link String} email of contact
     * @return {@link String} with the client response
     * @throws Exception
     *             if the response is an exception
     */
    public static String getCustomerConversations(Widget widget, int customerId) throws Exception
    {
	// JSONObject for saving all the email/conversations categorized on
	// Mailbox.
	JSONObject customerConv = new JSONObject();
	// For converting the Collection to JSON String.
	Gson gson = new Gson();

	// Get the HelpScout API Client with API_key.
	ApiClient client = getHelpScoutApiClient(widget);

	// Get the list of mailboxes of the current User.
	JSONArray mailboxes = new JSONArray(getMailBoxes(widget));

	// Loop through the each mailbox and get the email sent by the Customer
	// to that mailbox.
	for (int i = 0; i < mailboxes.length(); i++)
	{
	    Page mailsPage = client.getConversationsForCustomerByMailbox(mailboxes.getJSONObject(i).getInt("id"),
		    customerId);

	    if (mailsPage.getCount() > 0)
	    {
		// Group the conversations/Mails based on their Mailbox.
		JSONArray conversations = new JSONArray(gson.toJson(mailsPage.getItems()));
		JSONObject mailbox = new JSONObject();
		mailbox.put("name", mailboxes.getJSONObject(i).getString("name"));
		mailbox.put("conversations", conversations);
		customerConv.append("mailbox", mailbox);
	    }

	}
	// If there are no conversations, add a message.
	if (customerConv.getJSONArray("mailbox").length() <= 0)
	    customerConv.put("message", "No Mails from this Customer.");

	return customerConv.toString();
    }

    /**
     * Call HelpScout Server using HelpScout Java API for getting the list of
     * mailboxes for the user presently logged in.
     * 
     * @param widget
     *            the widget object contains the API Key of the HelpScout.
     * @return the List of mailbox object in JSON format.
     */
    public static String getMailBoxes(Widget widget)
    {
	Gson gson = new Gson();
	String mailboxes = null;
	try
	{
	    // Get the HelpScout API Client with API_key.
	    ApiClient client = getHelpScoutApiClient(widget);
	    // Get the mailboxes from the HelpScout.
	    Page page = client.getMailboxes();
	    mailboxes = gson.toJson(page.getItems());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return mailboxes;
    }
}
