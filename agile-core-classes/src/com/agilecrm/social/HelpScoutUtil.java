package com.agilecrm.social;

import java.util.ArrayList;
import java.util.List;

import net.helpscout.api.ApiClient;
import net.helpscout.api.Page;
import net.helpscout.api.cbo.ConversationType;
import net.helpscout.api.cbo.PersonType;
import net.helpscout.api.cbo.Status;
import net.helpscout.api.cbo.ThreadType;
import net.helpscout.api.model.Conversation;
import net.helpscout.api.model.ref.CustomerRef;
import net.helpscout.api.model.ref.MailboxRef;
import net.helpscout.api.model.ref.PersonRef;
import net.helpscout.api.model.ref.UserRef;
import net.helpscout.api.model.thread.ConversationThread;
import net.helpscout.api.model.thread.LineItem;

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

    public static final String PERSON_USER = "User";
    public static final String PERSON_CUSTOMER = "Customer";

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
    public static JSONObject getCustomerByEmail(Widget widget, String email) throws Exception
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
	    customerMails.put("message", "No customer found.");
	    return customerMails;
	}

	// If there is a customer, get the Id.
	JSONArray customers = new JSONArray(gson.toJson(page.getItems()));

	return customers.getJSONObject(0);

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
    public static JSONObject getCustomerConversations(Widget widget, int customerId) throws Exception
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

	customerConv.put("mailboxList", mailboxes);

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
	if (!customerConv.has("mailbox")){
	    customerConv.put("message", "No Mails from this Customer.");
	}
	System.out.println("----------------" + customerConv.toString());
	return customerConv;
    }

    /**
     * Returns the data required to fill the options in the Create Conversation
     * Form.
     * 
     * @param widget
     *            the widget object contains the API Key of the HelpScout.
     * @return the JSON String containing the data used to fill the create
     *         Conversations form.
     * @throws Exception
     */
    public static JSONObject getCreateFormData(Widget widget) throws Exception
    {
	JSONObject formData = new JSONObject();
	// Get list of user for assignees list.
	formData.put("assignees", new JSONArray(getPersonsFromHelpScout(widget, PERSON_USER)));
	// Get the list of Mailboxes.
	formData.put("mailboxes", new JSONArray(getMailBoxes(widget)));
	return formData;

    }

    /**
     * Call HelpScout Server using HelpScout Java API for getting the list of
     * mailboxes for the user presently logged in.
     * 
     * @param widget
     *            the widget object contains the API Key of the HelpScout.
     * @return the List of mailbox object in JSON format.
     */
    public static String getMailBoxes(Widget widget) throws Exception
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

    /**
     * Calls the HelpSout server to create the Conversation.
     * 
     * @param widget
     *            the widget object contains the API Key of the HelpScout.
     * @param customerId
     *            the id of the customer.
     * @param email
     *            the email Id of the customer.
     * @param mailboxId
     *            the mailbox id in which the user is creating the conversation.
     * @param subject
     *            the subject of the conversation.
     * @param description
     *            the description (body) about the conversation.
     * @param assignTo
     *            user id of the assignee.
     * @param type
     *            the type of the conversation.
     * @param tags
     *            tags to be added to the conversation.
     * @return the id of the conversation newly created.
     * @throws Exception
     */
    public static String addConversation(Widget widget, Long customerId, String email, Long mailboxId, String subject,
	    String description, String type, Long assignTo, String tags) throws Exception
    {
	// The customer associated with the conversation
	CustomerRef customer = new CustomerRef();
	customer.setEmail(email);
	customer.setId(customerId);

	Conversation conversation = new Conversation();
	conversation.setSubject(subject);
	conversation.setCustomer(customer);
	conversation.setType(ConversationType.findByLabel(type));

	// Add tags to the conversation.
	List<String> tagsList = new ArrayList<String>();
	for (String tag : tags.split(",")){
	    tagsList.add(tag);
	}
	conversation.setTags(tagsList);

	// Reference to the mailbox to which the conversation is created in to.
	MailboxRef mailbox = new MailboxRef();
	mailbox.setId(mailboxId);
	conversation.setMailbox(mailbox);

	// A conversation must have at least one thread
	ConversationThread thread = new net.helpscout.api.model.thread.Customer();
	thread.setType(ThreadType.Message);
	thread.setBody(description);
	thread.setStatus(Status.Active);

	// Set the assignee for the conversation.
	UserRef assignedTo = new UserRef();
	assignedTo.setId(assignTo);
	thread.setAssignedTo(assignedTo);

	// Get the detail of the presently logged in in user using to define who
	// is creating the conversation.
	JSONObject me = new JSONObject(getUserFromHelpScout(widget));
	// Reference of the person who is creating the conversation.
	PersonRef createdBy = new CustomerRef();
	createdBy.setId(me.getLong("id"));
	createdBy.setType(PersonType.User);
	thread.setCreatedBy(createdBy);

	List<LineItem> threads = new ArrayList<LineItem>();
	threads.add((LineItem) thread);
	conversation.setThreads(threads);

	// Get the HelpScout API Client with API_key.
	ApiClient client = getHelpScoutApiClient(widget);
	// Create the conversation. The Id of the conversation will be set to
	// the Conversation object passed to it.
	client.createConversation(conversation);

	System.out.println("Conversation id: " + conversation.getId());

	return String.valueOf(conversation.getId());
    }

    /**
     * Get the detail of the User currently logged in. It will user the api_key
     * to get the user details.
     * 
     * @param widget
     *            the widget object contains the API Key of the HelpScout.
     * @return the user object in the JSON String format.
     * @throws Exception
     */
    public static String getUserFromHelpScout(Widget widget) throws Exception
    {
	// Get the HelpScout API Client with API_key.
	ApiClient client = getHelpScoutApiClient(widget);
	Gson gson = new Gson();
	return gson.toJson(client.getUserMe());
    }

    /**
     * Call the HelpScout to get list of Persons of the specified type.
     * 
     * @param widget
     *            the widget object contains the API Key of the HelpScout.
     * @param type
     *            the type persons. Presently 2 types, User and Customer.
     * @return the list of persons in the JSON String format.
     * @throws Exception
     */
    public static String getPersonsFromHelpScout(Widget widget, String type) throws Exception
    {
	// Get the HelpScout API Client with API_key.
	ApiClient client = getHelpScoutApiClient(widget);
	Gson gson = new Gson();
	Page page = null;
	
	if (type.equalsIgnoreCase(PERSON_USER)){
	    page = client.getUsers();
	}else if (type.equalsIgnoreCase(PERSON_CUSTOMER)){
	    page = client.getCustomers();
	}
	
	if (page != null && page.getCount() > 0){
	    return gson.toJson(page.getItems());
	}else{
	    return "[]";
	}
    }
}
