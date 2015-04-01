package com.thirdparty.mandrill;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

import org.json.JSONObject;

import com.agilecrm.document.Document;
import com.agilecrm.document.util.DocumentUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>MandrillSendDeferredTask</code> sends emails included with attachments
 * to Mandrill server. It uses streams for writing/reading data, it sends data
 * in Base64 encoded format.
 * 
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
    private List<Long> documentIds = null;

    public MandrillSendDeferredTask(String mailJSONString, String messageJSONString, List<Long> documentIds)
    {
	this.mailJSONString = mailJSONString;
	this.messageJSONString = messageJSONString;
	this.documentIds = documentIds;
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
		e.printStackTrace();
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

	    Long documentId = documentIds.get(0);
	    com.agilecrm.document.Document document = DocumentUtil.getDocument(documentId);

	    outStream.write(mailJSONString.getBytes("UTF-8"));
	    outStream.write(messageJSONString.getBytes("UTF-8"));
	    String attachmentStartString = getAttachmentStartString(document);
	    outStream.write(attachmentStartString.getBytes("UTF-8"));

	    URL inUrl = new URL(document.url);
	    inConn = (HttpURLConnection) inUrl.openConnection();
	    inConn.setDoInput(true);
	    inConn.setConnectTimeout(600000);
	    inConn.setReadTimeout(600000);
	    inStream = inConn.getInputStream();

	    EncodingStreamWriter streamWriter = new EncodingStreamWriter(inStream, outStream);
	    streamWriter.write();
	    String attachmentEndString = "\"}]";
	    String endString = "}}";
	    outStream.write(attachmentEndString.getBytes("UTF-8"));
	    outStream.write(endString.getBytes("UTF-8"));
	    response = streamWriter.getResponse(outConn);
	}
	catch (Exception e)
	{
	    throw e;
	}
	finally
	{
	    try
	    {
		if (inStream != null)
		    inStream.close();
		if (outStream != null)
		    outStream.close();
		if (inConn != null)
		    inConn.disconnect();
		if (outConn != null)
		    outConn.disconnect();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
    }

    /**
     * Prepares attachment string for mandrill email
     * 
     * @param document
     * @return
     */
    private String getAttachmentStartString(Document document) throws Exception
    {
	String attachmentJSONString = null;
	JSONObject attachmentJSON = new JSONObject();
	String fileName = document.extension;
	String[] extensions = fileName.split("\\.");
	String extension = extensions[extensions.length - 1];
	attachmentJSON.put("name", document.extension);
	String type = "application/".concat(extension);
	attachmentJSON.put("type", type);
	String attachmentJSONtempString = attachmentJSON.toString().replace("}", ",");
	attachmentJSONString = "\"attachments\":[".concat(attachmentJSONtempString).concat("\"content\":\"");
	return attachmentJSONString;
    }
}
