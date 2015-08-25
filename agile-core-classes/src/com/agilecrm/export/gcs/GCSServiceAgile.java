package com.agilecrm.export.gcs;

import java.io.IOException;
import java.io.Writer;
import java.nio.channels.Channels;

import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsFilename;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsService;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsServiceFactory;
import com.google.agile.repackaged.appengine.tools.cloudstorage.RetryParams;
import com.google.appengine.api.NamespaceManager;

/**
 * 
 * @author yaswanth
 *
 */
public class GCSServiceAgile
{
    private final GcsService gcsService = GcsServiceFactory.createGcsService(new RetryParams.Builder()
	    .initialRetryDelayMillis(10).retryMaxAttempts(10).totalRetryPeriodMillis(15000).build());

    private String fileName;
    private String bucketName;
    private GcsOutputChannel outPutChannel;

    GCSServiceAgile()
    {

    }

    public GCSServiceAgile(String fileName, String bucketName)
    {
	this.fileName = fileName;
	this.bucketName = bucketName;
    }

    public GcsFilename getFileName()
    {
	return new GcsFilename(bucketName, fileName);
    }

    public GcsOutputChannel getOutputchannel() throws IOException
    {
	if (outPutChannel != null)
	    return outPutChannel;

	GcsFileOptions options = new GcsFileOptions.Builder().mimeType("ext/csv").acl("public-read")
		.addUserMetadata("domain", NamespaceManager.get()).build();

	return outPutChannel = gcsService.createOrReplace(getFileName(), options);
    }

    public Writer getOutputWriter() throws IOException
    {
	return Channels.newWriter(getOutputchannel(), "UTF8");
    }

}
