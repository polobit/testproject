package com.agilecrm.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;

public class FileStreamUtil
{
    /**
     * Reads resource from file (war), if it is found at given path
     * 
     * @param path
     * @return resource in UTF-8
     */
    public static String readResource(String path)
    {
	try
	{
	    // System.out.println(path);
		if(VersioningUtil.isDevelopmentEnv())
		{
			path = "agile-frontend.war/" + path;
			System.out.println("path = " + path);
		}
		
	    File f = new File(path);
	    System.out.println(f.getAbsolutePath());
	    if (!f.exists())
	    {
		System.out.println("File does not exist");
		return null;
	    }
	    	 
	    InputStream is = new FileInputStream(f);

	    return IOUtils.toString(is, "UTF-8");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
}