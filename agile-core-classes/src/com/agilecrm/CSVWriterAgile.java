package com.agilecrm;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.nio.channels.Channel;
import java.util.ArrayList;
import java.util.List;

import au.com.bytecode.opencsv.CSVWriter;

import com.agilecrm.export.gcs.GCSServiceAgile;
import com.agilecrm.util.VersioningUtil;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.appengine.api.NamespaceManager;

public class CSVWriterAgile
{
    private CSVWriter csvWriter = null;
    private Channel channel;
    private File file;
    private String path;

    private int count = 0;

    private List<String[]> cachedRows = new ArrayList<String[]>();

    public CSVWriterAgile(Writer writer, String fileName)
    {
	csvWriter = new CSVWriter(writer);
    }

    public CSVWriterAgile(File file) throws IOException
    {
	this.file = file;

	if (!file.exists())
	    file.createNewFile();

	BufferedWriter writer = new BufferedWriter(new FileWriter(file));

	csvWriter = new CSVWriter(writer);
    }

    public CSVWriterAgile(String fileName) throws IOException
    {
	GcsFileOptions options = new GcsFileOptions.Builder().mimeType("text/csv").contentEncoding("UTF-8")
		.acl("public-read").addUserMetadata("domain", NamespaceManager.get()).build();

	String buckName = "agile-exports";
	if (!VersioningUtil.isProductionAPP())
	    buckName = "agile-export";

	GCSServiceAgile service = new GCSServiceAgile(fileName, buckName, options);

	Writer writer = service.getOutputWriter();

	channel = service.getOutputchannel();
	path = service.getFilePathToDownload();

	csvWriter = new CSVWriter(writer);
    }

    public void writeNext(String[] row)
    {
	cachedRows.add(row);

	if (cachedRows.size() >= 100)
	{
	    writePendingFiles();
	}
    }

    public void WriteList(List<String[]> rows)
    {

    }

    public int getNumberOfRows()
    {
	return count;
    }

    private void writePendingFiles()
    {
	if (cachedRows.size() == 0)
	{
	    return;
	}

	count += cachedRows.size();

	csvWriter.writeAll(cachedRows);
	cachedRows.clear();
    }

    /**
     * Flush will write all pending lines into output stream and closes the
     * connection
     */
    public void flush()
    {
	writePendingFiles();
	try
	{
	    csvWriter.close();

	    if (channel != null)
	    {
		channel.close();
	    }
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    // Returns path only if file stored in server
    public String getPath()
    {
	if (path != null)
	    return path;
	if (file == null)
	    return null;

	return file.getPath();
	// Blob file Path
    }
}