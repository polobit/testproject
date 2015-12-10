package com.agilecrm.file.readers;

/**
 * author:Ramesh
 */
import java.io.Serializable;
import java.net.HttpURLConnection;
import java.net.URL;

public abstract class IFileStream implements Serializable
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public URL url;

    protected HttpURLConnection urlConn;

    public abstract void closeResources();

    public abstract String getFileName();

}
