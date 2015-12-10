package com.agilecrm.file.readers;

import java.io.InputStream;
import java.io.Serializable;
import java.net.HttpURLConnection;
/***
 * 
 * @author Ramesh
 *
 */
public abstract class IFileInputStream extends IFileStream implements Serializable
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public abstract InputStream getInputStream();

    public void setInputConnectionAttributes()
    {
	try
	{
	    urlConn = (HttpURLConnection) url.openConnection();
	    urlConn.setDoInput(true);
	    urlConn.setConnectTimeout(600000);
	    urlConn.setReadTimeout(600000);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
}
