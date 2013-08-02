package com.agilecrm.contact.upload.blob;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreInputStream;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

public class ContactsProcessServlet extends HttpServlet
{
	public void doPost(HttpServletRequest request, HttpServletResponse response)
	{
		// Gets the blob key and domain user id from the request parameters
		String key = (String) request.getParameter("key");

		// Delete blob data after contacts are created
		BlobstoreService service = BlobstoreServiceFactory.getBlobstoreService();

		try
		{

			System.out.println("backend running");

			String ownerId = (String) request.getParameter("owner_id");
			System.out.println("key = " + key + ", owner_id = " + ownerId);

			Contact contact = (Contact) CacheUtil.getCache("contact_" + key);

			// Creates a blobkey object from blobkey string
			BlobKey blobKey = new BlobKey(key);

			// Reads the stream from blobstore
			InputStream blobStream = new BlobstoreInputStream(blobKey);

			// Converts stream data into valid string data
			String csv = IOUtils.toString(blobStream);

			System.out.println("namespace " + NamespaceManager.get());

			// Calls utility method to save contacts in csv with owner id,
			// according to contact prototype sent
			ContactUtil.createContactsFromCSV(csv, contact, ownerId);

		}
		catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally
		{
			CacheUtil.deleteCache(key);
			CacheUtil.deleteCache("contact_" + key);
			BlobKey blobKey = new BlobKey(key);
			service.delete(blobKey);
		}
	}
}
