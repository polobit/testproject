package com.agilecrm;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.APIKey;
import com.agilecrm.cleanup.CleanupUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;
import com.googlecode.objectify.Key;

public class UpdateExistingData extends HttpServlet
{

    /**
	 * 
	 */
    private static final long serialVersionUID = 1L;

    public void doGet(HttpServletRequest req, HttpServletResponse resp)
    {

	/*
	 * Get the content type, as same content type will be set while sending
	 * request to backend
	 */

	String backend = req.getParameter("backend");
	if (!StringUtils.isEmpty(backend))
	{
	    backendInit(req, resp);
	    return;
	}
	String contentType = req.getHeader("Content-Type");

	byte[] b = new byte[5];

	Queue queue = QueueFactory.getQueue("bulk-actions-queue");
	TaskOptions taskOptions = TaskOptions.Builder.withUrl("/backend/updatedata?" + req.getQueryString() + "&backend=true")
		.header("Content-Type", "text/xml").method(Method.GET);

	queue.add(taskOptions);
    }

    public void backendInit(HttpServletRequest req, HttpServletResponse resp)
    {
	String count = req.getParameter("page_size");
	String cursor = req.getParameter("cursor");
	String namespace = req.getParameter("domain");
	String apiKey = req.getParameter("api_key");
	String tags = req.getParameter("tags");
	System.out.println("api key : " + apiKey);
	if (StringUtils.isEmpty(namespace))
	{
	    try
	    {
		resp.getWriter().write("please enter domain");
	    }
	    catch (IOException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    return;
	}

	String oldNamespace = NamespaceManager.get();
	try
	{
	    NamespaceManager.set(namespace);
	    Key<DomainUser> user = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);
	    Integer page_size = 0;
	    if (count != null)
	    {
		try
		{
		    page_size = Integer.parseInt(count);
		}
		catch (Exception e)
		{
		    page_size = 500;
		}
	    }

	    if (!StringUtils.isEmpty(tags))
	    {
		CleanupUtil.cleanTags();
	    }
	    else
		updateContacts(cursor, page_size, user.getId());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }

    public void updateContacts(String cursor, Integer count, Long userId)
    {
	CleanupUtil.loadTags();
	List<Contact> contacts = null;
	int fetchedContacts = 0;
	if (count < 500)
	{
	    contacts = ContactUtil.getAll(count, cursor);
	    fetchedContacts += 500;
	    CleanupUtil.deleteTags(contacts);
	    return;
	}

	contacts = ContactUtil.getAll(500, cursor);
	CleanupUtil.deleteTags(contacts);

	String currentCursor = null;
	String previousCursor = null;
	do
	{
	    fetchedContacts += contacts.size();
	    previousCursor = contacts.get(contacts.size() - 1).cursor;

	    if (!StringUtils.isEmpty(previousCursor))
	    {
		contacts.clear();
		contacts = BulkActionUtil.getFilterContacts("#contacts", previousCursor, userId);

		currentCursor = contacts.size() > 0 ? contacts.get(contacts.size() - 1).cursor : null;
		System.out.println("cursor : " + currentCursor);

		CleanupUtil.deleteTags(contacts);

		Long contact_id = contacts.get(contacts.size() - 1).id;
		// Mandrill.sendMail("yaswanth@agilecrm.com", "yaswanth",
		// "yaswanth@agilecrm.com", "Cursor", null, "",
		// currentCursor + " , incomplete - " + fetchedContacts +
		// ", contact_id : " + contact_id);
		continue;
	    }
	    break;
	}
	while (contacts.size() > 0 && !StringUtils.equals(previousCursor, currentCursor) && fetchedContacts <= count);

	// Mandrill.sendMail("yaswanth@agilecrm.com", "yaswanth",
	// "yaswanth@agilecrm.com", "Cursor", null, "",
	// currentCursor);

    }

}
