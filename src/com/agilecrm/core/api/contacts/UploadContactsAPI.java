package com.agilecrm.core.api.contacts;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.util.Hashtable;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
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
	 * Handle request sent using file uploader, reads the details from the
	 * uploaded file are returns the data which is processed and stored in to
	 * map, so fields can be shown at the client side using the map
	 * 
	 * @param request
	 *            {@link HttpServletRequest}
	 * @return {@link String}
	 */
	@Path("/process")
	@GET
	public String post(@QueryParam("blob-key") String key)
	{
		System.out.println("===========================================================================");
		try
		{

			InputStream stream = new BlobstoreInputStream(new BlobKey(key));

			LineNumberReader reader = new LineNumberReader(new InputStreamReader(stream));

			String contactString = IOUtils.toString(stream);

			int numberOfContacts = contactString.trim().split(System.getProperty("line.separator")).length;

			System.out.println(numberOfContacts);

			System.out.println(new BlobstoreInputStream(new BlobKey(key)).read());

			Hashtable result = ContactUtil.convertCSVToJSONArrayPartially(contactString, "");

			System.out.println(result);

			JSONObject success = new JSONObject();
			success.put("success", true);
			success.put("blob_key", key);
			success.put("available_contacts", numberOfContacts);

			// Stores results in to a map
			JSONArray csvArray = (JSONArray) result.get("result");

			// returns CSV file as a json object with key "data"
			success.put("data", csvArray);
			System.out.println(success);

			return success.toString();

			/*
			 * System.out.println(request.getContentType()); // Reads data from
			 * the request object InputStream file = request.getInputStream();
			 * 
			 * String csv = IOUtils.toString(file);
			 * 
			 * System.out.println(csv);
			 * 
			 * JSONObject success = new JSONObject(); success.put("success",
			 * true); // success.put("blob_key", blob_key); // Stores results in
			 * to a map
			 * 
			 * Hashtable result =
			 * ContactUtil.convertCSVToJSONArrayPartially(csv, "email");
			 * JSONArray csvArray = (JSONArray) result.get("result");
			 * 
			 * // returns CSV file as a json object with key "data"
			 * success.put("data", csvArray); System.out.println(success);
			 * 
			 * return success.toString();
			 */
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		return null;
	}

	@Path("/save")
	@POST
	public void saveContacts(Contact contact, @QueryParam("key") String key)
	{

		String postURL = BackendServiceFactory.getBackendService().getBackendAddress("b1");
		/*
		 * // If Localhost - just return if (SystemProperty.environment.value()
		 * == SystemProperty.Environment.Value.Development) { postURL =
		 * BackendServiceFactory.getBackendService().getBackendAddress("b1"); }
		 */

		Queue queue = QueueFactory.getQueue("bulk-actions-queue");
		TaskOptions taskOptions;

		if (StringUtils.isEmpty(key))
			return;

		CacheUtil.setCache(key, true);

		CacheUtil.setCache("contact_" + key, contact);
		taskOptions = TaskOptions.Builder.withUrl("/backend/contacts-process").param("key", key)
				.param("owner_id", String.valueOf(SessionManager.get().getDomainId())).header("Host", postURL)
				.method(Method.POST);

		queue.add(taskOptions);

		System.out.println("completed");

	}
}

// /**
// * Returns whether the key of contacts list still exists in the memcache
// * i.e., task is not completed. This method will be called repeatedly with
// * specified time interval from client to check whether the uploaded
// * contacts are saved. If contacts are save then key is removed from the
// * memcache then this method will return true if key is moved from the
// * memcache.
// *
// * @param key
// * {@link String}, key of the contact list saved in memcache
// * @return {@link Boolean} returns true if key is removed from memcache and
// * vice-versa
// */
// @Path("save/status")
// @POST
// @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
// public boolean contactsUploadStatus(String memcache_key)
// {
//
// if (CacheUtil.isPresent(memcache_key))
// return false;
//
// return true;
// }
//
// @Path("contacts/save")
// @POST
// @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
// @Produces(MediaType.TEXT_HTML)
// public String saveBulkContacts(String contact, @QueryParam("key") String
// blobKey) throws Exception
// {
//
// String postURL =
// BackendServiceFactory.getBackendService().getBackendAddress("contactsbulk").trim();
//
// CacheUtil.put(blobKey, blobKey);
//
// Queue queue = QueueFactory.getDefaultQueue();
// // Add to queue
// queue.add(TaskOptions.Builder.withPayload(new TaskRunner(contact, postURL,
// blobKey)));
//
// return blobKey;
//
// }
// }
//
// class TaskRunner implements DeferredTask
// {
// String contact;
// String blobKey;
// String postURL;
//
// public TaskRunner(String contact, String postURL, String blobKey)
// {
// this.contact = contact;
// this.postURL = postURL;
// this.blobKey = blobKey;
// }
//
// public void run()
// {
// String URL = "http://" + postURL + "/backend/contactsbulk/?key=" + blobKey;
// try
// {
// Util.accessURLUsingPost(URL, contact);
// }
// catch (Exception e)
// {
// // TODO Auto-generated catch block
// e.printStackTrace();
// }
// }
// }
