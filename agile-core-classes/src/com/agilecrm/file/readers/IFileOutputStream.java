package com.agilecrm.file.readers;

/**
 * author:Ramesh
 */
import java.io.OutputStream;
import java.io.Serializable;
import java.net.HttpURLConnection;
import java.net.URL;

import com.thirdparty.mandrill.Mandrill;

public abstract class IFileOutputStream extends IFileStream implements Serializable
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public abstract OutputStream getOutputStream();

    public void setOutputConnectionAttributes()
    {
	try
	{
	    url = new URL(Mandrill.MANDRILL_API_POST_URL + Mandrill.MANDRILL_API_MESSAGE_CALL);
	    urlConn = (HttpURLConnection) url.openConnection();
	    urlConn.setDoOutput(true);
	    urlConn.setRequestMethod("POST");
	    urlConn.setConnectTimeout(600000);
	    urlConn.setReadTimeout(600000);
	    urlConn.setRequestProperty("Content-Type", "application/json");
	    urlConn.setRequestProperty("charset", "utf-8");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
}
