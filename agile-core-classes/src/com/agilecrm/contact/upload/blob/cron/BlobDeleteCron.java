package com.agilecrm.contact.upload.blob.cron;

import java.util.Iterator;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

/**
 * <code>BlobstoreCron</code> manages the blobs, It deletes blob data which
 * resides more than 2 hours in blobstore.
 * <p>
 * All Blobkeys are fetched from blobstore. Blobinfo is fetched based on
 * blobkeys, which provides information about created time filename etc..,
 * created time of the blob is checked with current time of the blob, deletes
 * the blob which is residing for more than 2 hours.
 * </p>
 * 
 * @author Yaswanth
 * 
 */
public class BlobDeleteCron extends HttpServlet
{
	/**
	 * Blob store service required to delete blobs
	 */
	private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

	public void doGet(HttpServletRequest req, HttpServletResponse res)
	{
		/*
		 * Initializes blob info factory and fetches all the blobs in the store
		 */
		BlobInfoFactory factory = new BlobInfoFactory();
		Iterator<BlobInfo> blobInfoList = factory.queryBlobInfos();

		/*
		 * Iterates through each blob, deletes the blob which is residing for
		 * more than 2hours from the current time
		 */
		while (blobInfoList.hasNext())
		{
			BlobInfo info = blobInfoList.next();

			if ((System.currentTimeMillis() - info.getCreation().getTime()) >= (60 * 60 * 1000)
					&& CacheUtil.getCache(info.getBlobKey().getKeyString()) == null)
			{
				blobstoreService.delete(info.getBlobKey());
			}
		}
	}
}
