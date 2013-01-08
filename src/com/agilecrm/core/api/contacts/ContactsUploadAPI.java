package com.agilecrm.core.api.contacts;

import java.util.Hashtable;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreInputStream;
import com.google.appengine.api.taskqueue.DeferredTask;

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
