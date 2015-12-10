package com.agilecrm.contact.upload.blob;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

/**
 * 
 * @author Ramesh
 *
 */

public class UploadAttachmentServlet extends HttpServlet
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse res)
        throws ServletException, IOException {

	BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
        Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
        List<BlobKey> blobKeys = blobs.get("attachmentfile");
        if(blobKeys!=null && blobKeys.size()>0)
        {
            BlobKey blobKey = blobKeys.get(0);
            BlobInfoFactory factory = new BlobInfoFactory();
            BlobInfo blobInfo = factory.loadBlobInfo(blobKey);
            res.sendRedirect("/upload-attachment.jsp?key=" + blobKey.getKeyString()+"&fileName="+blobInfo.getFilename());
            CacheUtil.setCache(blobKey.getKeyString(),true,16400000);
        }
    }
}
