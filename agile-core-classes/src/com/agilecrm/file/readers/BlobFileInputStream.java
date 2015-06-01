package com.agilecrm.file.readers;

import java.io.InputStream;

import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreInputStream;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
/**
 * 
 * @author Ramesh
 *
 */
public class BlobFileInputStream extends IFileInputStream
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private BlobKey blobKey;
    private BlobstoreInputStream inputStream = null;

    public BlobFileInputStream(BlobKey blobKey)
    {
	this.blobKey = blobKey;
    }

    @Override
    public InputStream getInputStream()
    {
	try
	{
	    inputStream = new BlobstoreInputStream(blobKey);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return inputStream;
    }

    @Override
    public void closeResources()
    {
	try
	{
	    if (inputStream != null)
		inputStream.close();
	    if(blobKey!=null)
	    {
		BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
		blobstoreService.delete(blobKey);
		if(CacheUtil.getCache(blobKey.getKeyString())!=null)
		{
		    CacheUtil.deleteCache(blobKey.getKeyString());
		}
	    }
	}
	catch (Exception e)
	{
	    CacheUtil.deleteCache(blobKey.getKeyString());
	    e.printStackTrace();
	}
    }

    @Override
    public String getFileName()
    {
	BlobInfoFactory blobInfoFactory = new BlobInfoFactory();
	BlobInfo blobInfo = blobInfoFactory.loadBlobInfo(blobKey);
	String fileName = blobInfo.getFilename();
	return fileName;
    }

}
