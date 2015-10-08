package com.agilecrm.export.gcs;

import java.io.IOException;
import java.io.Writer;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;

import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsFilename;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsInputChannel;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsService;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsServiceFactory;
import com.google.agile.repackaged.appengine.tools.cloudstorage.RetryParams;
import com.google.api.services.storage.Storage;
import com.google.common.base.Stopwatch;

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
    private GcsFileOptions options;

    GCSServiceAgile()
    {
    }

    {
	Class klass = Storage.class;
	URL location = klass.getResource('/' + klass.getName().replace('.', '/') + ".class");

	Class test = Stopwatch.class;
	URL location1 = test.getResource('/' + test.getName().replace('.', '/') + ".class");
	System.out.println(location1);
	// System.out.println(location1);
    }

    public GCSServiceAgile(String fileName, String bucketName, GcsFileOptions options)
    {
	this.fileName = fileName;
	this.bucketName = bucketName;
	this.options = options;
	if (options == null)
	{
	    options = GcsFileOptions.getDefaultInstance();
	}
    }

    private GcsFilename getFileName()
    {
	return new GcsFilename(bucketName, fileName);
    }

    public GcsOutputChannel getOutputchannel() throws IOException
    {
	if (outPutChannel != null)
	    return outPutChannel;

	return outPutChannel = gcsService.createOrReplace(getFileName(), options);

    }

    public Writer getOutputWriter() throws IOException
    {

	return Channels.newWriter(getOutputchannel(), "UTF8");
    }

    public byte[] getDataFromFile() throws IOException
    {
	int fileSize = (int) gcsService.getMetadata(getFileName()).getLength();
	System.out.println("file size : " + fileSize);
	ByteBuffer result = ByteBuffer.allocate(fileSize);
	System.out.println("result : " + result);
	System.out.println("file name : " + getFileName());
	System.out.println("file size : " + fileSize);
	GcsInputChannel readChannel = gcsService.openReadChannel(getFileName(), 0);

	System.out.println("read channel : " + readChannel);
	readChannel.read(result);
	System.out.println("result " + result);
	return result.array();
    }

    public String getFilePathToDownload()
    {
	return "https://storage.googleapis.com/" + bucketName + "/" + fileName;
    }

    public void deleteFile() throws IOException
    {
	gcsService.delete(getFileName());
    }

    public static void main(String[] args)
    {
	int i = (1 << 20) - (1 << 15);
	System.out.println(i);
    }
}
