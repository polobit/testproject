package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

/**
 * <code>DownloadBlobFileServlet</code> handles request after for downloading of
 * blob file which will be generated after importing contacts.
 */
@SuppressWarnings("serial")
public class DownloadBlobFileServlet extends HttpServlet
{
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		String blobKeyString = request.getParameter("key"); //
		BlobKey blobKey = null;
		BlobInfo blobInfo = null;
		if(StringUtils.isEmpty(blobKeyString)) {
			response.getWriter().print("Invalid URL.");
			return;
		} else {
			blobKey = new BlobKey(blobKeyString);
			blobInfo = new BlobInfoFactory().loadBlobInfo(blobKey);
			if(blobInfo == null || blobInfo.getFilename() == null) {
				response.getWriter().print("This download link has expired. Please try exporting again.");
				return;
			}
			BlobstoreService blobStoreService = BlobstoreServiceFactory.getBlobstoreService();
			blobStoreService.serve(blobKey, response);
		}
		
		response.setHeader("Content-disposition", "attachment; filename="+ blobInfo.getFilename());
	}
}