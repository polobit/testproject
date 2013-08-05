package com.agilecrm.contact.upload.blob;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreInputStream;
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

	public void service(HttpServletRequest req, HttpServletResponse res)
	{

		System.out.println("blob services");

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

			InputStream stream = new BlobstoreInputStream(blobKey);

			LineNumberReader reader = new LineNumberReader(new InputStreamReader(stream));

			String contactString = IOUtils.toString(stream);

			int numberOfContacts = contactString.trim().split(System.getProperty("line.separator")).length;

			if (numberOfContacts > 1000)
			{
				BlobstoreServiceFactory.getBlobstoreService().delete(blobKey);
				// Forward request back to JSP with blobkey as parameter
				res.sendRedirect("/upload-contacts.jsp?f=1");
				return;
			}
			// Forward request back to JSP with blobkey as parameter
			res.sendRedirect("/upload-contacts.jsp?key=" + blobKey.getKeyString());
		}
		catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
