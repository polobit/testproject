package com.agilecrm.contact.upload.blob;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreInputStream;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

/**
 * <BulkContactProcess> is called with backends, which retrieves data from
 * blobstore and saves all the contacts in the csv
 * 
 * @author Yaswanth
 * 
 */
public class BulkContactProcess extends HttpServlet
{
    public void doPost(HttpServletRequest request, HttpServletResponse response)
    {
	try
	{

	    System.out.println("backend running");

	    // Gets the input stream, to read contact String from the request
	    InputStream stream = request.getInputStream();
	    String contactString = IOUtils.toString(stream);

	    // Creates contact object from contact string, using ObjectMapper
	    ObjectMapper mapper = new ObjectMapper();
	    Contact contact = mapper.readValue(contactString, Contact.class);

	    // Gets the blob key and domain user id from the request parameters
	    String key = request.getParameter("key");
	    String ownerId = request.getParameter("ownerId");
	    String namespace = request.getParameter("namespace");

	    System.out.println("namespace = " + namespace);

	    // Creates a blobkey object from blobkey string
	    BlobKey blobKey = new BlobKey(key);

	    if (StringUtils.isEmpty(namespace) || namespace.equals("null"))
	    {
		BlobstoreServiceFactory.getBlobstoreService().delete(blobKey);

		CacheUtil.remove(key);

		return;
	    }

	    // Reads the stream from blobstore
	    InputStream blobStream = new BlobstoreInputStream(blobKey);

	    // Converts stream data into valid string data
	    String csv = IOUtils.toString(blobStream);

	    NamespaceManager.set(namespace);

	    // Calls utility method to save contacts in csv with owner id,
	    // according to contact prototype sent
	    ContactUtil.createContactsFromCSV(csv, contact, ownerId);

	    // Delete blob data after contacts are created
	    BlobstoreServiceFactory.getBlobstoreService().delete(blobKey);

	    CacheUtil.remove(key);
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
}
