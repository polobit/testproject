package com.agilecrm.gadget;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;

/**
 * Read the template file and return template in the form of string.
 * @module GadgetTemplate
 * 
 * @author Dheeraj
 * 
 */

/**
 * @class GadgetTemplate
 * */
public class GadgetTemplate
{
    /**
     * @method getGadgetTemplate
     * @static
     * @param {String} templateName requires template name.
     * @return {String} template is returned as string.
     * */
    public static String getGadgetTemplate(String templateName)
    {

	// Get the template
	String emailTemplate = readResource("misc/gmail/" + templateName
		+ ".html");

	// Convert to single line
	return emailTemplate.replaceAll("\\r\\n|\\r|\\n", "");

    }

    // Read Resource from File (war)
    /**
     * @method readResource
     * @static
     * @param {String} path provide path to read template source file.
     * @return returning template file's object.
     * */
    public static String readResource(String path)
    {
	try
	{
	    // System.out.println(path);
	    File f = new File(path);
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

    public static String[] getFilesNames(String path)
    {
	// System.out.println(path);
	File f = new File("misc/" + (StringUtils.isEmpty(path) ? "" : path));
	String[] fileNames;
	if (f.isDirectory())
	    return f.list();

	return null;
    }
    
    public static String getTemplate(String path)
    {
	return readResource("misc/" + path);
    }

}
