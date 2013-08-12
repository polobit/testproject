package com.agilecrm.core.api.contacts;

import java.io.IOException;
import java.io.InputStream;
import java.util.Hashtable;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.LineIterator;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.backends.BackendServiceFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreInputStream;
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
	try
	{
	    BlobKey blobKey = new BlobKey(key);

	    InputStream stream = new BlobstoreInputStream(blobKey);

	    // Reads blob data line by line upto first 10 line of file
	    LineIterator iterator = IOUtils.lineIterator(stream, "UTF-8");

	    int lines = 0;
	    String csv = "";

	    // Iterates through first 10 lines
	    while (iterator.hasNext() && lines <= 10)
	    {
		csv = csv + "\n" + iterator.nextLine();
		lines++;
	    }

	    // It converts first 10 lines in the CSV and returns a JSONObject
	    // (Now we are sending first 10 lines, normal method can be used).
	    Hashtable result = ContactUtil.convertCSVToJSONArrayPartially(csv, "");

	    System.out.println(result);

	    JSONObject success = new JSONObject();
	    success.put("success", true);
	    success.put("blob_key", key);

	    // returns CSV file as a json object with key "data"
	    success.put("data", result.get("result"));
	    System.out.println(success);

	    return success.toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return null;
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

	    // Creates a backends url
	    String postURL = BackendServiceFactory.getBackendService().getBackendAddress(
		    Globals.BULK_ACTION_BACKENDS_URL);

	    // Backends should be initialized using a task queue
	    Queue queue = QueueFactory.getQueue("bulk-actions-queue");

	    // Task is created setting host as backends url. It takes payload
	    // and blobkey, current domain user id as path parameters. current
	    // owner id is required to set owner of uploaded contacts
	    TaskOptions taskOptions = TaskOptions.Builder
		    .withUrl(
			    "/core/api/bulk-actions/upload/"
				    + String.valueOf(SessionManager.get().getDomainId() + "/"
					    + request.getParameter("key"))).payload(bytes)
		    .header("Content-Type", request.getContentType()).header("Host", postURL).method(Method.POST);

	    // Task is added into queue
	    queue.add(taskOptions);

	    System.out.println("completed");
	}

	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }
}