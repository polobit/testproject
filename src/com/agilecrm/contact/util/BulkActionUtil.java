package com.agilecrm.contact.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.AgileQueues;
import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.backends.BackendServiceFactory;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;
import com.googlecode.objectify.Key;

/**
 * <code>BulkActionUtil<code> class contains utility methods to handle backends requests. 
 * It includes methods to post data and fetch contacts based on filter or on list of contact ids
 * 
 * @author Yaswanth
 * 
 */
public class BulkActionUtil
{
    public static final Integer ENTITIES_FETCH_LIMIT = 500;

    /**
     * Defines set of url to which request is to be sent based on the type of
     * bulk action
     * 
     */
    public static enum ActionType
    {
	DELETE("/core/api/bulk-actions/delete/contacts", AgileQueues.CONTACTS_DELETE_QUEUE), ASIGN_WORKFLOW(
	        "/core/api/bulk-actions/enroll-campaign/%s", AgileQueues.CAMPAIGN_SUBSCRIBE_QUEUE), CHANGE_OWNER(
	        "/core/api/bulk-actions/change-owner/%s", AgileQueues.OWNER_CHANGE_QUEUE), ADD_TAG(
	        "/core/api/bulk-actions/contact/tags", AgileQueues.BULK_TAGS_QUEUE), CONTACTS_UPLOAD(
	        "/core/api/bulk-actions/contacts/multi/upload", AgileQueues.CONTACTS_UPLOAD_QUEUE), REMOVE_ACTIVE_SUBSCRIBERS(
	        "/core/api/bulk-actions/remove-active-subscribers/%s", AgileQueues.WORKFLOWS_RELATED_QUEUE), SEND_EMAIL(
	        "/core/api/bulk-actions/contacts/send-email", AgileQueues.BULK_EMAILS_QUEUE), EXPORT_CONTACTS_CSV(
	        "/core/api/bulk-actions/contacts/export-contacts-csv", AgileQueues.CONTACTS_EXPORT_QUEUE), REMOVE_TAG(
	        "/core/api/bulk-actions/contact/remove-tags", AgileQueues.BULK_TAGS_QUEUE);

	String url, queue;

	/*
	 * Constructor sets domain user Id at the end of the url, it is required
	 * to set Session in thread local, so domain user can be fetched
	 */
	ActionType(String url, String queue)
	{
	    this.url = url;
	    this.queue = queue;
	}

	/*
	 * Return url of particular action
	 */
	public String getUrl()
	{
	    return url + "/" + SessionManager.get().getDomainId();
	}

	public String getQueue()
	{
	    return queue;
	}
    }

    /**
     * Posts data to backends in the form of byte data. Entire request is
     * forwarded to the url specified
     * <p>
     * It is used when the action is to be performed on list of contact ids
     * <p>
     * 
     * @param data
     * @param uri
     * @param contentType
     * @param type
     */
    @SuppressWarnings("deprecation")
    public static void postDataToBulkActionBackend(byte[] data, String uri, String contentType, Method type,
	    String queueName)
    {

	// By default, use 'bulk-actions-queue'
	if (StringUtils.isBlank(queueName))
	    queueName = "bulk-actions-queue";

	String url = BackendServiceFactory.getBackendService().getBackendAddress(Globals.BULK_ACTION_BACKENDS_URL);

	// Create Task and push it into Task Queue
	Queue queue = QueueFactory.getQueue(queueName);
	TaskOptions taskOptions = TaskOptions.Builder.withUrl(uri).payload(data).header("Content-Type", contentType)
	        .header("Host", url).method(type);

	queue.addAsync(taskOptions);
    }

    /**
     * It sends customized request to backends url. It is used to send request
     * to perform action on contacts based on contact filter Id.
     * <p>
     * This method takes var arg of paraeters as there are cased we need to send
     * extra data (like tag to be added or message in send bulk email)
     * <p>
     * 
     * @param uri
     * @param contentType
     * @param type
     * @param data
     */
    @SuppressWarnings("deprecation")
    public static void postDataToBulkActionBackend(String uri, String contentType, String queueName, Method type,
	    String... data)
    {

	// By default, use 'bulk-actions-queue'
	if (StringUtils.isBlank(queueName))
	    queueName = "bulk-actions-queue";

	Queue queue = QueueFactory.getQueue(queueName);
	TaskOptions taskOptions = null;

	String url = BackendServiceFactory.getBackendService().getBackendAddress(Globals.BULK_ACTION_BACKENDS_URL);

	/*
	 * If there are more than one argument in data then it is sent in
	 * requests
	 */
	if (data.length > 1 && !StringUtils.isEmpty(data[1]))
	{
	    taskOptions = TaskOptions.Builder.withUrl(uri).param("filter", data[0]).param("data", data[1])
		    .header("Content-Type", contentType).header("Host", url).method(type);

	    queue.addAsync(taskOptions);
	    return;
	}

	taskOptions = TaskOptions.Builder.withUrl(uri).param("filter", data[0]).header("Content-Type", contentType)
	        .header("Host", url).method(type);

	queue.addAsync(taskOptions);
    }

    /**
     * Formats url with workflow id. It is called when action is to be performed
     * based on list of contact ids
     * 
     * @param data
     * @param parameter
     * @param url
     * @param contentType
     * @param type
     */
    public static void enrollCampaign(byte[] data, Map<String, Object> parameter, String url, String contentType,
	    Method type)
    {
	String workflowId = ((String[]) parameter.get("workflow_id"))[0];
	url = String.format(url, workflowId);
	System.out.println(url);
	BulkActionUtil.postDataToBulkActionBackend(data, url, contentType, type, AgileQueues.CAMPAIGN_SUBSCRIBE_QUEUE);
    }

    /**
     * Formats url with workflow id. It is called when action is to be performed
     * based on filter criteria
     * 
     * @param id
     * @param parameter
     * @param url
     * @param contentType
     * @param type
     */
    public static void enrollCampaign(String id, Map<String, Object> parameter, String url, String contentType,
	    Method type)
    {
	String workflowId = ((String[]) parameter.get("workflow_id"))[0];
	url = String.format(url, workflowId);
	System.out.println(url);
	BulkActionUtil.postDataToBulkActionBackend(url, contentType, AgileQueues.CAMPAIGN_SUBSCRIBE_QUEUE, type, id);
    }

    /**
     * Formats url with owner id. It is called when action is to be performed
     * based on contact ids list
     * 
     * @param data
     * @param parameter
     * @param url
     * @param contentType
     * @param type
     */
    public static void changeOwner(byte[] data, Map<String, Object> parameter, String url, String contentType,
	    Method type)
    {
	String ownerId = ((String[]) parameter.get("owner"))[0];
	url = String.format(url, ownerId);

	BulkActionUtil.postDataToBulkActionBackend(data, url, contentType, type, AgileQueues.OWNER_CHANGE_QUEUE);
    }

    /**
     * Formats url with owner id. It is called when action is to be performed
     * based on filter criteria
     * 
     * @param id
     * @param parameter
     * @param url
     * @param contentType
     * @param type
     */
    public static void changeOwner(String id, Map<String, Object> parameter, String url, String contentType, Method type)
    {
	String ownerId = ((String[]) parameter.get("owner"))[0];
	url = String.format(url, ownerId);

	System.out.println("url to send : " + url);

	BulkActionUtil.postDataToBulkActionBackend(url, contentType, AgileQueues.OWNER_CHANGE_QUEUE, type, id);
    }

    /**
     * Creates contact keys based on contact ids
     * 
     * @param contactIds
     *            Stringified list of contact ids
     * @param domainUserId
     * @return
     */
    public static List<Key<Contact>> getContactKeysFormIds(String contactIds, Long domainUserId)
    {
	JSONArray array = null;
	try
	{
	    array = new JSONArray(contactIds);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	List<Key<Contact>> keys = new ArrayList<Key<Contact>>();
	for (int i = 0; i < array.length(); i++)
	{
	    try
	    {
		keys.add(new Key<Contact>(Contact.class, array.getLong(i)));
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}

	return keys;
    }

    /**
     * Based on the filter criteria it returns contacts keys. It checks whether
     * filter criteria starts with #tags/ or #contacts, which is sent from
     * client. If filter criteria is filter id, it queries based on filter rules
     * and returns contact keys.
     * 
     * @param criteria
     * @param domainUserId
     * @return {@link List} of {@link Key}
     * @throws UnsupportedEncodingException
     */
    public static List<Key<Contact>> getFilterContactsKeys(String criteria, Long domainUserId)
	    throws UnsupportedEncodingException
    {
	// If criteria is empty returns empty list
	if (criteria.isEmpty())
	    return new ArrayList<Key<Contact>>();

	// Sets domain in session as 'my' contacts filter uses session manager
	// to get current user contacts
	setSessionManager(domainUserId);

	// If criteria starts with '#tags/' then it splits after '#tags/' and
	// gets tag and returns contact keys
	if (criteria.startsWith("#tags/"))
	{
	    String[] tagCondition = StringUtils.split("#tags/");
	    String tag = tagCondition.length > 0 ? tagCondition[1] : "";

	    return Contact.dao.listKeysByProperty("tagsWithTime.tag", URLDecoder.decode(tag, "UTF-8"));
	}

	// If criteria is '#contacts' then keys of all available contacts are
	// returned
	if (criteria.equals("#contacts"))
	    return ContactUtil.getAllContactKey();

	// If criteria is filter id then it returns contact keys based on filter
	// id
	return ContactFilterUtil.getContactsKeys(criteria, domainUserId);
    }

    /**
     * Filters based on search criteria
     * 
     * @param criteria
     * @param domainUserId
     * @return
     */
    public static List<Contact> getFilterContacts(String criteria, String cursor, Long domainUserId)
    {
	if (criteria.isEmpty())
	    return new ArrayList<Contact>();

	setSessionManager(domainUserId);

	if (criteria.startsWith("#tags/"))
	{
	    String[] tagCondition = criteria.split("#tags/");
	    System.out.println(tagCondition.length);
	    String tag = tagCondition.length > 0 ? tagCondition[1] : "";

	    if (StringUtils.isEmpty(tag))
		return new ArrayList<Contact>();

	    try
	    {
		return ContactUtil.getContactsForTag(URLDecoder.decode(tag, "UTF-8"), ENTITIES_FETCH_LIMIT, cursor);
	    }
	    catch (UnsupportedEncodingException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
		return new ArrayList<Contact>();
	    }
	}

	if (criteria.equals("#contacts"))
	    return ContactUtil.getAllContacts(ENTITIES_FETCH_LIMIT, cursor);

	return new ArrayList<Contact>(ContactFilterUtil.getContacts(criteria, ENTITIES_FETCH_LIMIT, cursor));
    }

    /**
     * Removes active subscribers from Cron if exists and updates each selected
     * contact campaign-status
     * 
     * @param data
     *            - Selected subscribers list of ids.
     * @param requestParameter
     *            - request data
     * @param url
     *            - API url to remove selected active subscribers.
     * @param contentType
     *            - Request content-type.
     * @param type
     *            - Request method type.
     */
    public static void removeActiveSubscribers(byte[] data, Map<String, Object> requestParameter, String url,
	    String contentType, Method type)
    {
	String workflowId = ((String[]) requestParameter.get("workflow_id"))[0];
	url = String.format(url, workflowId);

	System.out.println("Selected Active Subscribers removal url " + url);

	BulkActionUtil.postDataToBulkActionBackend(data, url, contentType, type, AgileQueues.WORKFLOWS_RELATED_QUEUE);
    }

    /**
     * Removes all active subscribers from Cron and updates campaign-status of
     * all active subscribers of that campaign.
     * 
     * @param id
     *            - filter-id to show that all active subscribers are selected
     * @param requestParameter
     *            - request data
     * @param url
     *            - API url to remove all active subscribers
     * @param contentType
     *            - request content type
     * @param type
     *            - request method type
     */
    public static void removeActiveSubscribers(String id, Map<String, Object> requestParameter, String url,
	    String contentType, Method type)
    {
	String workflowId = ((String[]) requestParameter.get("workflow_id"))[0];
	url = String.format(url, workflowId);

	System.out.println("All Active Subscribers removal url " + url);
	System.out.println("filter id is " + id);

	BulkActionUtil.postDataToBulkActionBackend(url, contentType, AgileQueues.WORKFLOWS_RELATED_QUEUE, type, id);
    }

    /**
     * Sets session manager, it is used to get current user when running in
     * backends
     * 
     * @param domainUserId
     */
    public static void setSessionManager(Long domainUserId)
    {
	System.out.println("domain user setting session: " + domainUserId);
	if (SessionManager.get() != null)
	{
	    SessionManager.get().setDomainId(domainUserId);
	    return;
	}
	DomainUser user = DomainUserUtil.getDomainUser(domainUserId);
	setSessionManager(user);
    }

    public static void setSessionManager(DomainUser user)
    {
	SessionManager.set(new UserInfo(user));
	SessionManager.get().setDomainId(user.id);
    }

}
