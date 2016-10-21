package com.agilecrm.thirdparty.gmail;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.List;

import javax.ws.rs.core.MediaType;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;

import com.agilecrm.document.Document;
import com.agilecrm.document.util.DocumentUtil;
import com.agilecrm.file.readers.BlobFileInputStream;
import com.agilecrm.file.readers.DocumentFileInputStream;
import com.agilecrm.file.readers.IFileInputStream;
import com.agilecrm.user.SMTPPrefs;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.blobstore.BlobKey;
import com.sun.jersey.multipart.BodyPart;
import com.sun.jersey.multipart.file.StreamDataBodyPart;

/**
 * GMail is the class for sending personal mails using SMTP initially via GMail
 * 
 * @author agileravi
 * 
 */
public class GMail {

	/**
	 * Core method to be called from EmailGatewayUtil to invoke agile-smtp SMTPMailSender
	 * to send personal mails using SMTP 
	 * 
	 * @param smtpPrefs
	 * @param to
	 * @param cc
	 * @param bcc
	 * @param subject
	 * @param replyTo
	 * @param html
	 * @param text
	 * @param documentIds
	 * @param blobKeys
	 * @param attachments
	 */
    public static void sendMail(SMTPPrefs smtpPrefs, String to, String cc, String bcc, 
    		String subject, String replyTo, String html, String text, List<Long> documentIds, 
    		List<BlobKey> blobKeys, String[] attachments) {
        
    	// Prepare URL for SMTP (agile-smtp on EC2)
    	//String smtpURL = "http://localhost:8081/agile-smtp/smtpMailSender";
    	String smtpURL ="http://54.87.153.50:8080/agile-smtp/smtpMailSender";

    	try {
	    	String[] attachFile = getAttachment(documentIds, blobKeys, attachments);
	    	
	    	String data = "";
	    	
	    	// Prepare metadata for POST req with attachment
	    	if((documentIds != null && documentIds.size() == 0) 
	    			&& (blobKeys != null && blobKeys.size() == 0)
	    			&& (attachments != null && attachments.length == 0)) 
	    		data = getSMTPPostParams(smtpPrefs, to, cc, bcc, subject, replyTo, html, text,
	    				"", "", "");
	    		
	    	else
	    		data = getSMTPPostParams(smtpPrefs, to, cc, bcc, subject, replyTo, html, text,
	    				attachFile[0], attachFile[1], attachFile[2]);

	    	
    		// making servlet call through HttpURLConnection
    		String response = HTTPUtil.accessURLUsingPost(smtpURL, data);
			System.out.println("HTTPUtil.accessURLUsingPost ++ " + response);
		} 
    	catch(Exception e) {
			e.printStackTrace();
		}
    }
    
    /**
     * This method builds the attachment part to be available for sending to SMTP servlet.
     * 
     * @param documentIds
     * @param blobKeys
     * @param attachments
     * @return
     * @throws IOException
     */
    private static String[] getAttachment(List<Long> documentIds, List<BlobKey> blobKeys, 
    		String[] attachments) throws IOException {

    	String[] returnStr = new String[3];
    	
    	if(documentIds != null && documentIds.size() > 0) {
	    	Document document = DocumentUtil.getDocument(documentIds.get(0));
			String fileName = document.extension;
			String docUrl = document.url;
	
			if(StringUtils.isEmpty(document.url) || StringUtils.isEmpty(document.extension))
				return null;
	
			IFileInputStream documentStream = new DocumentFileInputStream(fileName, docUrl);
			InputStream is = documentStream.getInputStream();
			String fileNameWithExtension = documentStream.getFileName();

			returnStr[0] = "document";
			returnStr[1] = fileNameWithExtension;
			returnStr[2] = IOUtils.toString(is);
			
			return returnStr;
    	}
    	else if(blobKeys != null && blobKeys.size() > 0) {
    		IFileInputStream blobStream = new BlobFileInputStream(blobKeys.get(0));
    		InputStream is = blobStream.getInputStream();
			String fileNameWithExtension = blobStream.getFileName();
			
			StreamDataBodyPart streamDataBodyPart = new StreamDataBodyPart("attachment", is, fileNameWithExtension);
			streamDataBodyPart.setMediaType(MediaType.APPLICATION_OCTET_STREAM_TYPE);

			BodyPart bodyPart = (BodyPart) streamDataBodyPart;
    	}
    	else if (attachments.length == 3) {
			String fileName = attachments[1];
			String fileContent = attachments[2];

			InputStream is = new ByteArrayInputStream(fileContent.getBytes());

			StreamDataBodyPart streamDataBodyPart = new StreamDataBodyPart("attachment", is, fileName);
			streamDataBodyPart.setMediaType(MediaType.APPLICATION_OCTET_STREAM_TYPE);

			BodyPart bodyPart = (BodyPart) streamDataBodyPart;
    	}
    	return null;
	}

	/**
     * Prepares the URL for SMTP server with desired parameters
     * 
     * @param smtpPrefs
     * @param to
     * @param cc
     * @param bcc
     * @param subject
     * @param replyTo
     * @param html
     * @param text
	 * @param attachFile2 
	 * @param attachFile 
     * @return
     */
	private static String getSMTPPostParams(SMTPPrefs smtpPrefs, String to, String cc, String bcc, 
			String subject, String replyTo, String html, String text, //InputStream instr) { 
			String fileSource, String fileName, String fileStream) {

		StringBuffer url = new StringBuffer();
		
		String userName = smtpPrefs.user_name;
		String host = smtpPrefs.server_url;
		String password = smtpPrefs.password;

		String ssl = Boolean.toString(smtpPrefs.is_secure);

		try {
		
			url.append("user_name=" + URLEncoder.encode(userName, "UTF-8")); 
			url.append("&password=" + URLEncoder.encode(password, "UTF-8"));
			url.append("&host=" + URLEncoder.encode(host, "UTF-8"));
			url.append("&ssl=" + ssl);
			
			url.append("&to=" + URLEncoder.encode(to, "UTF-8"));
			url.append("&cc=" + ((cc != null) ? URLEncoder.encode(cc, "UTF-8"):null));
			url.append("&bcc=" + ((bcc != null) ? URLEncoder.encode(bcc, "UTF-8"):null));
			
			url.append("&subject=" + ((subject != null) ? URLEncoder.encode(subject, "UTF-8"):null));
			url.append("&html=" + ((html != null) ? URLEncoder.encode(html, "UTF-8"):null));
			url.append("&text=" + ((text != null) ? URLEncoder.encode(text, "UTF-8"):null));
			
			url.append("&file_source=" + ((fileSource != null) ? URLEncoder.encode(fileSource, "UTF-8"):null));
			url.append("&file_stream=" + ((fileStream != null) ? URLEncoder.encode(fileStream, "UTF-8"):null));
			url.append("&file_name=" + ((fileName != null) ? URLEncoder.encode(fileName, "UTF-8"):null));
			url.append("&validate=false");
		} 
		catch(Exception e) {
			System.err.println("Exception occured in getsmtpURLForPrefs " + e.getMessage());
			e.printStackTrace();
		}

		return url.toString();
	}

	/**
	 * for local unit testing
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			//System.out.println(HTTPUtil.accessURLUsingPost("http://localhost:8080/agile-smtp/smtpMailSender", "data"));
			System.out.println("qwert");
			System.out.println(HTTPUtil.accessURLUsingPost("http://requestb.in/127v7v11?user_name=agileravi.crm%40gmail.com&password=thejabman&host=smtp.gmail.com&ssl=true&subject=fill&html=%3C%21DOCTYPE+html%3E%0A%3Chtml%3E%0A+%3Chead%3E+%0A+%3C%2Fhead%3E+%0A+%3Cbody%3E++%0A++%3Cdiv+class%3D%22ag-img%22%3E%0A+++%3Cimg+src%3D%22https%3A%2F%2Fnull-dot-sandbox-dot-agilecrmbeta.appspot.com%2Fopen%3Fs%3D1475130268590%22+nosend%3D%221%22+style%3D%22display%3Anone%21important%3B%22+width%3D%221%22+height%3D%221%22+%2F%3E%0A++%3C%2Fdiv%3E%0A+%3Cdiv%3E%3Cbr%2F%3ESent+using+%3Ca+href%3D%22https%3A%2F%2Fwww.agilecrm.com%3Futm_source%3Dpowered-by%26utm_medium%3Demail-signature%26utm_campaign%3Dnull%22+target%3D%22_blank%22+style%3D%22text-decoration%3Anone%3B%22+rel%3D%22nofollow%22%3E+Agile%3C%2Fa%3E%3C%2Fdiv%3E%3C%2Fbody%3E%0A%3C%2Fhtml%3E&to=Ravi+theja++++%3Cravithejab%40gmail.com%3E&cc=&bcc=","DATAAAA"));
			
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
}