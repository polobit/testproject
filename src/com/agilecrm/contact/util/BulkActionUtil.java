package com.agilecrm.contact.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

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

public class BulkActionUtil
{
    public static enum ActionType
    {
	DELETE("/core/api/contacts/bulk"), ASIGN_WORKFLOW(
		"/core/api/campaigns/enroll/bulk/%s"), CHANGE_OWNER(
		"/core/api/contacts/bulk/owner/%s"), ADD_TAG(
		"/core/api/contacts/bulk/tags"), CONTACTS_UPLOAD(
		"/core/api/contacts/multi/upload");

	String url;

	ActionType(String url)
	{
	    this.url = url + "/" + SessionManager.get().getDomainId();
	}

	public String getUrl()
	{
	    return url;
	}
    }

    public static void postDataToBulkActionBackend(byte[] data, String uri,
	    String contentType, Method type)
    {
	// Create Task and push it into Task Queue
	Queue queue = QueueFactory.getDefaultQueue();
	TaskOptions taskOptions = TaskOptions.Builder
		.withUrl(uri)
		.payload(data)
		.header("Content-Type", contentType)
		.header("Host",
			BackendServiceFactory.getBackendService()
				.getBackendAddress("bulk-actions"))
		.method(type);

	queue.add(taskOptions);
    }

    public static void enrollCampaign(byte[] data,
	    Map<String, Object> parameter, String url, String contentType,
	    Method type)
    {
	String workflowId = ((String[]) parameter.get("workflow_id"))[0];
	url = String.format(url, workflowId);
	System.out.println(url);
	BulkActionUtil
		.postDataToBulkActionBackend(data, url, contentType, type);
    }

    public static void changeOwner(byte[] data, Map<String, Object> parameter,
	    String url, String contentType, Method type)
    {
	String ownerId = ((String[]) parameter.get("owner"))[0];
	url = String.format(url, ownerId);

	BulkActionUtil
		.postDataToBulkActionBackend(data, url, contentType, type);
    }

    public static List<Contact> getContactForBulkOperations(String contactIds,
	    Long domainUserId)
    {
	JSONArray array = null;
	String criteria = null;
	setSessionManager(domainUserId);
	try
	{
	    array = new JSONArray(contactIds);
	    if (Integer.parseInt(array.getString(0)) == -1)
	    {
		criteria = array.getString(1);

	    }
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	if (!StringUtils.isEmpty(criteria))
	{

	    if (criteria.startsWith("#tags/"))
	    {
		String[] tagCondition = criteria.split("#tags/");
		System.out.println(tagCondition.length);
		String tag = tagCondition.length > 0 ? tagCondition[1] : "";
		if (StringUtils.isEmpty(tag))
		    return new ArrayList<Contact>();

		return ContactUtil.getContactsForTag(tag, null, null);
	    }

	    if (criteria.equals("#contacts"))
		return ContactUtil.getAllContacts();

	    return new ArrayList<Contact>(ContactFilterUtil.getContacts(
		    criteria, null, null));
	}

	return ContactUtil.getContactsBulk(array);

    }

    public static List<Key<Contact>> getContactKeysForBulkOperations(
	    String contactIds, Long domainUserId)
    {
	setSessionManager(domainUserId);

	JSONArray array = null;
	String criteria = null;
	try
	{
	    array = new JSONArray(contactIds);
	    if (Integer.parseInt(array.getString(0)) == -1)
	    {
		criteria = array.getString(1);
	    }
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	if (!StringUtils.isEmpty(criteria))
	{

	    if (criteria.startsWith("#tags/"))
	    {
		String[] tagCondition = StringUtils.split("#tags/");
		String tag = tagCondition.length > 0 ? tagCondition[1] : "";

		return Contact.dao.listKeysByProperty("tagsWithTime.tag", tag);
	    }

	    if (criteria.equals("#contacts"))
	    {
		return Contact.dao.ofy().query(Contact.class).listKeys();
	    }
	    return ContactFilterUtil.getContactsKeys(criteria, domainUserId);
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

    private static void setSessionManager(Long domainUserId)
    {
	System.out.println("domain user setting session: " + domainUserId);
	if (SessionManager.get() != null)
	{
	    SessionManager.get().setDomainId(domainUserId);
	    return;
	}
	DomainUser user = DomainUserUtil.getDomainUser(domainUserId);
	SessionManager.set(new UserInfo(null, user.email, user.name));
	SessionManager.get().setDomainId(domainUserId);
    }

}
