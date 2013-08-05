package com.agilecrm.contact.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

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
	/**
	 * Defines set of url to which request is to be sent based on the type of
	 * bulk action
	 * 
	 */
	public static enum ActionType
	{
		DELETE("/core/api/bulk-actions/delete/contacts"), ASIGN_WORKFLOW("/core/api/bulk-actions/enroll-campaign/%s"), CHANGE_OWNER(
				"/core/api/bulk-actions/change-owner/%s"), ADD_TAG("/core/api/bulk-actions/contact/tags"), CONTACTS_UPLOAD(
				"/core/api/bulk-actions/contacts/multi/upload");

		String url;

		/*
		 * Constructor sets domain user Id at the end of the url, it is
		 * reqeuired to set Session in thread local so domain user can be
		 * fetched
		 */
		ActionType(String url)
		{
			this.url = url + "/" + SessionManager.get().getDomainId();
		}

		/*
		 * Return url of particular action
		 */
		public String getUrl()
		{
			return url;
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
	public static void postDataToBulkActionBackend(byte[] data, String uri, String contentType, Method type)
	{

		String url = BackendServiceFactory.getBackendService().getBackendAddress(Globals.BULK_ACTION_BACKENDS_URL);

		// Create Task and push it into Task Queue
		Queue queue = QueueFactory.getQueue("bulk-actions-queue");
		TaskOptions taskOptions = TaskOptions.Builder.withUrl(uri).payload(data).header("Content-Type", contentType)
				.header("Host", url).method(type)

				.method(type);

		queue.add(taskOptions);
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
	public static void postDataToBulkActionBackend(String uri, String contentType, Method type, String... data)
	{
		Queue queue = QueueFactory.getQueue("bulk-actions-queue");
		TaskOptions taskOptions = null;

		String url = BackendServiceFactory.getBackendService().getBackendAddress(Globals.BULK_ACTION_BACKENDS_URL);

		/*
		 * If there are more than on argument in data then it is sent in
		 * requests
		 */
		if (data.length > 1 && !StringUtils.isEmpty(data[1]))
		{
			taskOptions = TaskOptions.Builder.withUrl(uri).param("filter", data[0]).param("data", data[1])
					.header("Content-Type", contentType).header("Host", url).method(type);

			queue.add(taskOptions);
			return;
		}

		taskOptions = TaskOptions.Builder.withUrl(uri).param("filter", data[0]).header("Content-Type", contentType)
				.header("Host", url).method(type);

		queue.add(taskOptions);
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
		BulkActionUtil.postDataToBulkActionBackend(data, url, contentType, type);
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
		BulkActionUtil.postDataToBulkActionBackend(url, contentType, type, id);
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

		BulkActionUtil.postDataToBulkActionBackend(data, url, contentType, type);
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

		BulkActionUtil.postDataToBulkActionBackend(url, contentType, type, id);
	}

	public static List<Key<Contact>> getContactKeysForBulkOperations(String contactIds, Long domainUserId)
	{
		setSessionManager(domainUserId);

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

	public static List<Key<Contact>> getFilterContactsKeys(String criteria, Long domainUserId)
	{
		if (criteria.isEmpty())
			return new ArrayList<Key<Contact>>();

		setSessionManager(domainUserId);

		if (criteria.startsWith("#tags/"))
		{
			String[] tagCondition = StringUtils.split("#tags/");
			String tag = tagCondition.length > 0 ? tagCondition[1] : "";

			return Contact.dao.listKeysByProperty("tagsWithTime.tag", tag);
		}

		if (criteria.equals("#contacts"))
			return ContactUtil.getAllContactKey();

		return ContactFilterUtil.getContactsKeys(criteria, domainUserId);
	}

	public static List<Contact> getFilterContacts(String criteria, Long domainUserId)
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

			return ContactUtil.getContactsForTag(tag, null, null);
		}

		if (criteria.equals("#contacts"))
			return ContactUtil.getAllContacts(0, null);

		return new ArrayList<Contact>(ContactFilterUtil.getContacts(criteria, null, null));
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
