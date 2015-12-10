package com.thirdparty.mandrill;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONObject;

import com.agilecrm.file.readers.IFileInputStream;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>MandrillSendDeferredTask</code> sends emails included with attachments
 * to Mandrill server. It uses streams for writing/reading data, it sends data
 * in Base64 encoded format.
 * 
 * @author Ramesh
 * 
 */

public class MandrillSendDeferredTask implements DeferredTask
{
    /**
      * 
      */
    private static final long serialVersionUID = -4648054298508104500L;
    private String mailJSONString = null;
    private String messageJSONString = null;
    private IFileInputStream inputStream = null;

    public MandrillSendDeferredTask(String mailJSONString, String messageJSONString, IFileInputStream inputStream)
    {
	this.mailJSONString = mailJSONString;
	this.messageJSONString = messageJSONString;
	this.inputStream = inputStream;
    }

    @Override
    public void run()
    {
	int maxTries = 3;
	for (int count = 0; count < maxTries; count++)
	{
	    try
	    {
		sendMail2Mandrill();
		break;
	    }
	    catch (Exception e)
	    {
		System.out.println("Error occured while sending email with attachment "+e.getMessage());
	    }
	}
    }

    /**
     * Reads the input from url and converts it into Base64 format then sends it
     * to Mandrill server
     */
    private void sendMail2Mandrill() throws Exception
    {
	String response = "";
	HttpURLConnection inConn = null;
	InputStream inStream = null;
	HttpURLConnection outConn = null;
	OutputStream outStream = null;

	try
	{
	    // String mailJSONString = mailJSON.toString().replaceAll("}", ",");
	    String messageJSONtempString = "\"message\":" + messageJSONString + "}";
	    String messageJSONString = messageJSONtempString.replaceAll("}}", ",");

	    URL outUrl = new URL(Mandrill.MANDRILL_API_POST_URL + Mandrill.MANDRILL_API_MESSAGE_CALL);
	    outConn = (HttpURLConnection) outUrl.openConnection();
	    outConn.setDoOutput(true);
	    outConn.setRequestMethod("POST");
	    outConn.setConnectTimeout(600000);
	    outConn.setReadTimeout(600000);
	    outConn.setRequestProperty("Content-Type", "application/json");
	    outConn.setRequestProperty("charset", "utf-8");

	    outStream = outConn.getOutputStream();

	    outStream.write(mailJSONString.getBytes("UTF-8"));
	    outStream.write(messageJSONString.getBytes("UTF-8"));
	    String attachmentStartString = getAttachmentStartString(inputStream.getFileName());
	    outStream.write(attachmentStartString.getBytes("UTF-8"));

	    inStream = inputStream.getInputStream();

	    EncodingStreamWriter streamWriter = new EncodingStreamWriter(inStream, outStream);
	    streamWriter.write();
	    String attachmentEndString = "\"}]";
	    String endString = "}}";
	    outStream.write(attachmentEndString.getBytes("UTF-8"));
	    outStream.write(endString.getBytes("UTF-8"));
	    response = streamWriter.getResponse(outConn);
	    System.out.println("Mandrill Response " + response);
	}
	catch (Exception e)
	{
	    throw e;
	}
	finally
	{
	    try
	    {
		inputStream.closeResources();
		if (outStream != null)
		    outStream.close();
		if (outConn != null)
		    outConn.disconnect();
	    }
	    catch (Exception e)
	    {
		System.out.println(e.getMessage());
	    }
	}
    }

    /**
     * Prepares attachment string for mandrill email
     * 
     * @param document
     * @return
     */
    private String getAttachmentStartString(String fileNameWithExtension) throws Exception
    {
	String attachmentJSONString = null;
	JSONObject attachmentJSON = new JSONObject();
	String[] extensions = fileNameWithExtension.split("\\.");
	String extension = extensions[extensions.length - 1];
	attachmentJSON.put("name", fileNameWithExtension);
	String type = "application/".concat(extension);
	attachmentJSON.put("type", type);
	String attachmentJSONtempString = attachmentJSON.toString().replace("}", ",");
	attachmentJSONString = "\"attachments\":[".concat(attachmentJSONtempString).concat("\"content\":\"");
	return attachmentJSONString;
    }
}