package com.agilecrm.core.api.contacts;

import java.util.Hashtable;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.backends.BackendServiceFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreInputStream;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

@Path("/api/upload")
public class ContactsUploadAPI
{

    /**
     * Process the data in blobstore, which is fetched using blobkey sent. Calls
     * contact util method to process csv file and return first 10 contacts as
     * JSON objects, to show in a tabular form at client side.
     * 
     * @param blobKey
     * @return {@link String} JSON string of contacts
     */
    @POST
    @Path("csv/process")
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String processBlobToCSV(String blobKey)
    {
	BlobstoreInputStream stream;
	try
	{
	    // Read stream data from blobstore
	    stream = new BlobstoreInputStream(new BlobKey(blobKey));

	    // Converts byte data in to string
	    String csv = IOUtils.toString(stream);

	    JSONObject success = new JSONObject();
	    success.put("success", true);

	    // Stores results in to a map
	    Hashtable result = ContactUtil.convertCSVToJSONArrayPartially(csv,
		    "Email");

	    JSONArray csvArray = (JSONArray) result.get("result");

	    // returns CSV file as a json object with key "data"
	    success.put("data", csvArray);

	    return success.toString();
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}

    }

    @Path("contacts/save")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces(MediaType.TEXT_HTML)
    public String saveBulkContacts(String contact,
	    @QueryParam("key") String blobKey) throws Exception
    {

	// Gets the url of the backend
	String postURL = BackendServiceFactory.getBackendService()
		.getBackendAddress("contactsbulk").trim();

	// Stores blobkey in memcache
	CacheUtil.put(blobKey, blobKey);

	// Gets current domain user id, required to save lead owner
	Long ownerId = SessionManager.get().getDomainId();

	// Gets the default query
	Queue queue = QueueFactory.getDefaultQueue();

	// Add to task to queue, which access backends url with given data
	queue.add(TaskOptions.Builder.withPayload(new TaskRunner(contact,
		postURL, blobKey, ownerId, NamespaceManager.get())));

	// Blobkey is returned
	return blobKey;

    }

    /**
     * Returns whether the key of blob data still exists in the memcache i.e.,
     * task is not completed. This method will be called repeatedly with
     * specified time interval from client, to check whether the uploaded
     * contacts are saved. If contacts are saved then key is removed from the
     * memcache and also blobdata is deleted then this method will return true
     * if key is moved from the memcache.
     * 
     * @param key
     *            {@link String}, key of the contact list saved in memcache
     * @return {@link Boolean} returns true if key is removed from memcache and
     *         vice-versa
     */
    @Path("save/status")
    @POST
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public boolean contactsUploadStatus(String memcache_key)
    {
	// Checks if blobkey exists in memcache
	if (CacheUtil.isPresent(memcache_key))
	    return false;

	return true;
    }

}

/**
 * 
 * @author Yaswanth
 * 
 */
class TaskRunner implements DeferredTask
{
    String contact;
    String blobKey;
    String postURL;
    Long ownerId;
    String namespace;

    public TaskRunner(String contact, String postURL, String blobKey,
	    Long ownerId, String namespace)
    {
	this.contact = contact;
	this.postURL = postURL;
	this.blobKey = blobKey;
	this.ownerId = ownerId;
	this.namespace = namespace;
    }

    public void run()
    {

	// Access backends url, with blobkey, ownerid
	String URL = "http://" + postURL + "/backend/contactsbulk/?key="
		+ blobKey + "&ownerId=" + ownerId + "&namespace=" + namespace;

	System.out.println("backend url data : " + URL);

	try
	{

	    // Post contact to backends url
	    HTTPUtil.accessURLUsingPost(URL, contact);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
}
