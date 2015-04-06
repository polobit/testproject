package com.agilecrm.core.api.contacts;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.session.SessionManager;
import com.agilecrm.util.CSVUtil;
import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreInputStream;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;

@Path("/api/upload")
public class UploadContactsAPI
{
    /**
     * Fetches Blob data from blobstore and based on the blob key sent after
     * file upload. It fetches blob data and process first 10 lines of blob
     * data, to return first 10 contacts. It is read using UTF-8 to support
     * special characters
     * 
     * @param key
     * @return
     */
    @Path("/process")
    @GET
    public String post(@QueryParam("blob-key") String key)
    {
	BlobKey blobKey = new BlobKey(key);

	InputStream stream = null;

	try
	{
	    stream = new BlobstoreInputStream(blobKey);
	    System.out.println("available stream" + stream.available());
	}
	catch (IOException e1)
	{
	    // TODO Auto-generated catch block
	    e1.printStackTrace();
	}
	List<String> headings = new ArrayList<String>();
	try
	{
	    headings = CSVUtil.getCSVHeadings(stream);
	}
	catch (Exception e)
	{
	    // Delete blob from store before sending validation exception to
	    // client
	    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
	    blobstoreService.delete(blobKey);

	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

	Map success = new HashMap();
	success.put("success", true);
	success.put("blob_key", key);

	// Heading are stored in data key
	success.put("data", new JSONArray(headings));

	System.out.println(new JSONObject(success));

	return new JSONObject(success).toString();

    }

    /**
     * Reads blobkey from the request and request also includes a contacts
     * prototype (Order of the contact fields set on import table).
     * 
     * Request is sent to Backends from with payload contact and blob key.
     * 
     * @param request
     *            {@link HttpServletRequest}
     * @return {@link String}
     */
    @Path("/save")
    @POST
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void saveContacts(@Context HttpServletRequest request)
    {
	try
	{
	    // Checks User access control over current entity to be saved.
	    // UserAccessControlUtil.check(com.agilecrm.contact.Contact.class.getSimpleName(),
	    // null, CRUDOperation.IMPORT,
	    // true);

	    // Reads the request body. It is included as payload to backends
	    InputStream stream = request.getInputStream();
	    byte[] bytes = IOUtils.toByteArray(stream);

	    System.out.println(bytes);

	    // If blobkey is not present then request is returned
	    String key = request.getParameter("key");
	    if (StringUtils.isEmpty(key))
		return;

	    // Sets key in cache, which is used while deleting used Blob data
	    // from cron
	    CacheUtil.setCache(key, true);

	    // Task is created setting host as backends url. It takes payload
	    // and blobkey, current domain user id as path parameters. current
	    // owner id is required to set owner of uploaded contacts
	    String s = request.getParameter("type");
	    if (s.equalsIgnoreCase("deals"))
	    {
		// Backends should be initialized using a task queue
		Queue queue = QueueFactory.getQueue(AgileQueues.DEALS_UPLOAD_QUEUE);

		TaskOptions taskOptions = TaskOptions.Builder
		        .withUrl(
		                "/core/api/bulk-actions/upload-deals/"
		                        + String.valueOf(SessionManager.get().getDomainId() + "/"
		                                + request.getParameter("key"))).payload(bytes)
		        .header("Content-Type", request.getContentType()).method(Method.POST);

		// Task is added into queue
		queue.addAsync(taskOptions);
	    }
	    else
	    {
		// Backends should be initialized using a task queue
		Queue queue = QueueFactory.getQueue(AgileQueues.CONTACTS_UPLOAD_QUEUE);

		TaskOptions taskOptions = TaskOptions.Builder
		        .withUrl(
		                "/core/api/bulk-actions/upload/"
		                        + String.valueOf(SessionManager.get().getDomainId() + "/"
		                                + request.getParameter("key") + "/" + request.getParameter("type")))
		        .payload(bytes).header("Content-Type", request.getContentType())
		        .method(Method.POST);

		// Task is added into queue
		queue.addAsync(taskOptions);
	    }

	    System.out.println("completed");
	}
	catch (WebApplicationException e)
	{
	    throw e;
	}

	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }
}