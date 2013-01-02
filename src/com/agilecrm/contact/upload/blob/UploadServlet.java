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
 * Callback servlet called after file is uploaded in to blobstore. After file is
 * uploaded in the blobstore this servlet is called with the blobs uploaded, it
 * reads the blob and returns blob-key of currently uploaded file
 * 
 * @author Yaswanth
 * 
 */
public class UploadServlet extends HttpServlet
{
    // Initializes blobstore services
    private BlobstoreService blobstoreService = BlobstoreServiceFactory
	    .getBlobstoreService();

    public void service(HttpServletRequest req, HttpServletResponse res)
    {

	// Get blob keys from the request
	Map<String, BlobKey> blobs = blobstoreService.getUploadedBlobs(req);

	// Gets the key of currently uploaded file (name of the file is "file")
	BlobKey blobKey = blobs.get("file");

	// If blobkey is null return
	if (blobKey == null)
	{
	    return;
	}

	try
	{
	    // Sends request to upload-contact.jsp with blob key as query
	    // parameter
	    res.sendRedirect("/upload-contacts.jsp?blob-key="
		    + blobKey.getKeyString());
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
}
