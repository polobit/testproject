package com.agilecrm;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.List;

import au.com.bytecode.opencsv.CSVWriter;

import com.agilecrm.contact.export.util.ContactExportCSVUtil;
import com.agilecrm.file.readers.IFileInputStream;
import com.google.appengine.api.files.AppEngineFile;
import com.google.appengine.api.files.FileService;
import com.google.appengine.api.files.FileServiceFactory;
import com.google.appengine.api.files.FileWriteChannel;

public class CSVWriterAgile
{
    private CSVWriter csvWriter = null;
    FileWriteChannel writeChannel = null;
    private IFileInputStream inputStream = null;
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

    /**
     * Writes using appengine file service
     */
    public CSVWriterAgile()
    {
	// Get a file service
	FileService fileService = FileServiceFactory.getFileService();

	// Create a new Blob file with mime-type "text/csv"
	AppEngineFile file;
	try
	{
	    file = fileService.createNewBlobFile("text/csv", ContactExportCSVUtil.getExportFileName("Contacts_"));

	    path = file.getFullPath();

	    // Open a channel to write to it
	    boolean lock = false;
	    FileWriteChannel writeChannel = fileService.openWriteChannel(file, lock);

	    csvWriter = new CSVWriter(Channels.newWriter(writeChannel, "UTF8"));
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

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
	if (file == null)
	    return null;

	return file.getPath();
	// Blob file Path
    }
}