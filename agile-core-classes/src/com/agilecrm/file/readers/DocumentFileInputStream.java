package com.agilecrm.file.readers;

import java.io.InputStream;
import java.net.URL;
/**
 * 
 * @author Ramesh
 *
 */
public class DocumentFileInputStream extends IFileInputStream
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private InputStream inputStream;
    private String fileName;

    public DocumentFileInputStream(String fileName, String Url)
    {
	try
	{
	    URL documentUrl = new URL(Url);
	    this.url = documentUrl;
	    this.fileName = fileName;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    @Override
    public InputStream getInputStream()
    {
	try
	{
	    super.setInputConnectionAttributes();
	    inputStream = urlConn.getInputStream();
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
	    if (urlConn != null)
		urlConn.disconnect();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    @Override
    public String getFileName()
    {
	return fileName;
    }

}
