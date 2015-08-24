package com.agilecrm.export.gcs;

import java.io.IOException;
import java.io.Writer;
import java.nio.channels.Channels;

import com.google.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.appengine.tools.cloudstorage.GcsService;
import com.google.appengine.tools.cloudstorage.GcsServiceFactory;
import com.google.appengine.tools.cloudstorage.RetryParams;

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
	return outPutChannel = gcsService.createOrReplace(getFileName(), GcsFileOptions.getDefaultInstance());
    }

    public Writer getOutputWriter() throws IOException
    {
	return Channels.newWriter(getOutputchannel(), "UTF8");
    }

}
