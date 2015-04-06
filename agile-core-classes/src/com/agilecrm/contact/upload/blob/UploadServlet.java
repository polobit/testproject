package com.agilecrm.contact.upload.blob;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

/**
 * Callback servlet called after upload blob in to blobsore. It receives blob
 * key in request which is sent as parameter process blob file
 * 
 * @author bobby
 * 
 */
public class UploadServlet extends HttpServlet
{
    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

    @Override
    public void service(HttpServletRequest req, HttpServletResponse res)
    {

	System.out.println("blob services");
	String fileType = req.getParameter("type");
	/*
	 * Reads blobs in the request.
	 */
	Map<String, BlobKey> blobs = blobstoreService.getUploadedBlobs(req);

	System.out.println(blobs);

	System.out.println(req.getParameterNames());

	// Read blobkey of the file uploaded (file is the field name in the
	// form)
	BlobKey blobKey = blobs.get("file");

	System.out.println("blobkey : " + blobKey);

	if (blobKey == null)
	    return;

	try
	{
	    // Forward request back to JSP with blobkey as parameter

	    if (fileType != null)
	    {

		res.sendRedirect("/upload-contacts.jsp?key=" + blobKey.getKeyString() + "&type=" + fileType);

	    }

	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
}
