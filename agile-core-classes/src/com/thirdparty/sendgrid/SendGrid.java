package com.thirdparty.sendgrid;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.Globals;
import com.agilecrm.document.Document;
import com.agilecrm.document.util.DocumentUtil;
import com.agilecrm.file.readers.BlobFileInputStream;
import com.agilecrm.file.readers.DocumentFileInputStream;
import com.agilecrm.file.readers.IFileInputStream;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.thirdparty.mandrill.MandrillSendDeferredTask;
import com.thirdparty.sendgrid.deferred.SendGridAttachmentDeferredTask;
import com.thirdparty.sendgrid.lib.SendGridLib;
import com.thirdparty.sendgrid.lib.SendGridLib.Email;

/**
 * <code>SendGrid</code> is the core class that sends email using Send Grid API.
 * Required parameters to send email like from, to, subject and body are added
 * as query paramaters to Send Grid api URL.
 * <p>
 * SendGrid provides various options for sending email. Options can be viewed in
 * http://sendgrid.com/docs/API_Reference/Web_API/mail.html.
 * </p>
 * 
 */
public class SendGrid
{
    /**
     * Send grid REST API URL
     */
    public static final String SENDGRID_API_POST_URL = "https://sendgrid.com/api/mail.send.json";

    /**
     * Post param api_user
     */
    public static final String SENDGRID_API_PARAM_API_USER = "api_user";

    /**
     * Post param api_key
     */
    public static final String SENDGRID_API_PARAM_API_KEY = "api_key";

    /**
     * Post param to
     */
    public static final String SENDGRID_API_PARAM_TO = "to";

    /**
     * Post param cc
     */
    public static final String SENDGRID_API_PARAM_CC = "cc";

    /**
     * Post param bcc
     */
    public static final String SENDGRID_API_PARAM_BCC = "bcc";

    /**
     * Post param to[] - to add multiple to emails
     */
    public static final String SENDGRID_API_PARAM_MULTIPLE_TO = "to[]";
    public static final String SENDGRID_API_PARAM_MULTIPLE_TO_NAME = "toname[]";
    
    /**
     * Post param cc[] - to add multiple cc emails
     */
    public static final String SENDGRID_API_PARAM_MULTIPLE_CC = "cc[]";
    public static final String SENDGRID_API_PARAM_MULTIPLE_CC_NAME = "ccname[]";

    /**
     * Post param bcc[] - to add multiple bcc emails
     */
    public static final String SENDGRID_API_PARAM_MULTIPLE_BCC = "bcc[]";
    public static final String SENDGRID_API_PARAM_MULTIPLE_BCC_NAME = "bccname[]";

    /**
     * Post param replyto
     */
    public static final String SENDGRID_API_PARAM_REPLY_TO = "replyto";

    /**
     * Post param from email
     */
    public static final String SENDGRID_API_PARAM_FROM = "from";

    /**
     * Post param from name
     */
    public static final String SENDGRID_API_PARAM_FROM_NAME = "fromname";

    /**
     * Post param subject
     */
    public static final String SENDGRID_API_PARAM_SUBJECT = "subject";

    /**
     * Post param text body
     */
    public static final String SENDGRID_API_PARAM_TEXT_BODY = "text";

    /**
     * Post param html body
     */
    public static final String SENDGRID_API_PARAM_HTML_BODY = "html";

    /**
     * SMTP Header
     */
    public static final String SENDGRID_API_PARAM_X_SMTPAPI = "x-smtpapi";

    /**
     * Post Param file attachment
     */
    public static final String SENDGRID_API_PARAM_FILES = "files";

    /**
     * Sends email by adding required fields to Send Grid Api.
     * 
     * @param fromEmail
     *            - from email-id
     * @param fromName
     *            - from name.
     * @param to
     *            - to email-id.
     * @param subject
     *            - email subject.
     * @param replyTo
     *            - email-id to reply
     * @param html
     *            - html body.
     * @param text
     *            - text body.
     * @param subscriberJSON
     *            - Contact object in json.
     * @param campaignJSON
     *            - Workflow object in json.
     * @return String
     */
    public static String sendMail(String apiUser, String apiKey, String fromEmail, String fromName, String to,
	    String cc, String bcc, String subject, String replyTo, String html, String text, String SMTPHeaderJSON,
	    String... attachmentData)
    {

	// If both are null, use Agile SendGrid Keys
	if (apiUser == null && apiKey == null)
	{
	    apiUser = Globals.SENDGRID_API_USER_NAME;
	    apiKey = Globals.SENDGRID_API_KEY;
	}

	// Email response
	String response = "";

	try
	{
	    String queryString = getSendGridQueryString(apiUser, apiKey, fromEmail, fromName, to, cc, bcc, subject,
		    replyTo, html, text, SMTPHeaderJSON, attachmentData);

	    response = HTTPUtil.accessURLUsingPost(SENDGRID_API_POST_URL, queryString);

	    System.out.println("Response " + response);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while sending email from sendgrid..." + e.getMessage());
	    return e.getMessage();
	}

	return response;
    }

    /**
     * Returns query string required for send grid post data
     * 
     * @param apiUser
     *            - send grid api user
     * @param apiKey
     *            - send grid api key
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param cc
     *            - cc
     * @param bcc
     *            - bcc
     * @param subject
     *            - subject
     * @param replyTo
     *            - reply to
     * @param html
     *            - html body
     * @param text
     *            - text body
     * @param SMTPHeaderJSON
     *            - SMTP header json
     * @return
     * @throws UnsupportedEncodingException
     */
    public static String getSendGridQueryString(String apiUser, String apiKey, String fromEmail, String fromName,
	    String to, String cc, String bcc, String subject, String replyTo, String html, String text,
	    String SMTPHeaderJSON, String... attachmentData) throws UnsupportedEncodingException
    {
	// Query string
	String queryString = SENDGRID_API_PARAM_API_USER + "=" + apiUser + "&" + SENDGRID_API_PARAM_API_KEY + "="
	        + apiKey + "&" + SENDGRID_API_PARAM_SUBJECT + "=" + URLEncoder.encode(subject, "UTF-8") + "&"
	        + SENDGRID_API_PARAM_FROM + "=" + URLEncoder.encode(fromEmail, "UTF-8") + "&"
	        + SENDGRID_API_PARAM_FROM_NAME + "=" + URLEncoder.encode(fromName, "UTF-8");

	// Appends To emails
	queryString += "&" + addToEmailsToParams(EmailUtil.getStringTokenSet(to, ","), SENDGRID_API_PARAM_MULTIPLE_TO, SENDGRID_API_PARAM_MULTIPLE_TO_NAME);

	// Appends CC
	if (!StringUtils.isEmpty(cc))
	    queryString += "&"
		    + addToEmailsToParams(EmailUtil.getStringTokenSet(cc, ","), SENDGRID_API_PARAM_MULTIPLE_CC, SENDGRID_API_PARAM_MULTIPLE_CC_NAME);

	// Appends BCC
	if (!StringUtils.isEmpty(bcc))
	    queryString += "&"
		    + addToEmailsToParams(EmailUtil.getStringTokenSet(bcc, ","), SENDGRID_API_PARAM_MULTIPLE_BCC, SENDGRID_API_PARAM_MULTIPLE_BCC_NAME);

	// Reply To
	if (!StringUtils.isEmpty(replyTo) && !fromEmail.equals(replyTo))
	    queryString += "&" + SENDGRID_API_PARAM_REPLY_TO + "=" + URLEncoder.encode(replyTo, "UTF-8");

	// Text body
	if (text != null)
	    queryString += "&" + SENDGRID_API_PARAM_TEXT_BODY + "=" + URLEncoder.encode(text, "UTF-8");

	// HTML body
	if (html != null)
	    queryString += "&" + SENDGRID_API_PARAM_HTML_BODY + "=" + URLEncoder.encode(html, "UTF-8");

	// Add SMTP Header
	if (SMTPHeaderJSON != null)
	    queryString += "&" + SENDGRID_API_PARAM_X_SMTPAPI + "=" + URLEncoder.encode(SMTPHeaderJSON, "UTF-8");

	if (attachmentData != null && attachmentData.length != 0)
	    queryString += "&" + getAttachmentQueryString(attachmentData);

//	System.out.println("QueryString  \n" + queryString + "\n\n");

	return queryString;
    }

    /**
     * Adds emails of the set to the params of Send Grid Api. Send Grid provides
     * to[] option inorder to append multiple emails.
     * 
     * @param emails
     *            - Set consisting of emails.
     * @return String
     * @throws UnsupportedEncodingException
     */
    private static String addToEmailsToParams(Set<String> emails, String param, String paramName) throws UnsupportedEncodingException
    {
	String multipleTo = "";

	Iterator<String> itr = emails.iterator();

	// Adds multiple - to[]="email1" & to[]="email2"
	while (itr.hasNext())
	{
		String emailString = itr.next();
				
	    multipleTo += param + "=" + URLEncoder.encode(EmailUtil.getEmail(emailString), "UTF-8") + "&" + paramName + "=" + URLEncoder.encode(EmailUtil.getEmailName(emailString), "UTF-8");

	    // appends '&' except for last one.
	    if (itr.hasNext())
		multipleTo += "&";
	}

	return multipleTo;
    }

    public static String sendMail(String fromEmail, String fromName, String to, String cc, String bcc, String subject,
	    String replyTo, String html, String text)
    {
	return sendMail(null, null, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text, null);
    }

    private static String getAttachmentQueryString(String... attachmentData)
    {

	String queryString = "";

	try
	{

	    // Validate attachments
	    if ((attachmentData == null || attachmentData.length == 0))
		return null;

	    String fileName = getFileName(attachmentData);

	    // Get extension
	    String fileExt = attachmentData[1].contains(".") ? attachmentData[1].split("\\.")[1] : attachmentData[1];

	    String fileContent = attachmentData[2];

	    if (StringUtils.isBlank(fileName) || StringUtils.isBlank(fileExt) || StringUtils.isBlank(fileContent))
		return null;

	    System.out.println("FileName: " + fileName + " FileExtension: " + fileExt);

	    queryString += "&" + SENDGRID_API_PARAM_FILES + "[" + URLEncoder.encode(fileName, "UTF-8") + "." + fileExt
		    + "]=" + URLEncoder.encode(fileContent, "UTF-8");

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while getting attachment string..." + e.getMessage());
	}

	return queryString;
    }

    private static String getFileName(String[] attachmentData)
    {
	// For Mandrill attachment, 0 index value is mime-type like text/html
	if (attachmentData[0].contains("/"))
	{
	    // If file name contains extension like 'file.txt', then return
	    // 'file'
	    if (attachmentData[1].contains("."))
		return attachmentData[1].split("\\.")[0];

	    return attachmentData[1];
	}

	return attachmentData[0];
    }
    
    public static String sendMail(String apiUser, String apiKey, String fromEmail, String fromName, String to,
    	    String cc, String bcc, String subject, String replyTo, String html, String text, String SMTPHeaderJSON, List<Long> documentIds, List<BlobKey> blobKeys,
    	    String... attachmentData)
    {
    	if(apiUser == null && apiKey == null)
    	{
    		apiUser = Globals.SENDGRID_API_USER_NAME;
    		apiKey = Globals.SENDGRID_API_KEY;
    	}
    	
    	SendGridLib sendGrid = new SendGridLib(apiUser, apiKey);
    	SendGridLib.Email email = new SendGridLib.Email();

    	email.setFrom(fromEmail).setFromName(fromName);
    	
    	for(String emailString: EmailUtil.getStringTokenArray(to, ","))
    		email.addTo(EmailUtil.getEmail(emailString), EmailUtil.getEmailName(emailString));
    	
    	if (!StringUtils.isEmpty(cc))
    		email.addCc(EmailUtil.getStringTokenArray(cc, ","));
    	
    	if (!StringUtils.isEmpty(bcc))
    		email.addBcc(EmailUtil.getStringTokenArray(bcc, ","));
    	
    	email.setSubject(subject);
    	
    	// If replyTo empty, set From
    	if(StringUtils.isEmpty(replyTo))
    		replyTo = fromEmail;
    	
    	email.setReplyTo(replyTo);
    	
    	email.setHtml(html);
    	email.setText(text);
    	
    	// SMTP Header json
    	if(StringUtils.isNotBlank(SMTPHeaderJSON))
    		email.setSmtpJsonString(SMTPHeaderJSON);
    	
    	if (documentIds != null && documentIds.size() > 0)
    		sendDocumentAsMailAttachment(apiUser, apiKey, email, documentIds.get(0));
	    else if (blobKeys != null && blobKeys.size() > 0)
	    	sendBlobAsMailAttachment(apiUser, apiKey, email, blobKeys.get(0));
	    else if (attachmentData != null && attachmentData.length > 0)
	    {
	    	String fileName = getFileName(attachmentData);

		    // Get extension
		    String fileExt = attachmentData[1].contains(".") ? attachmentData[1].split("\\.")[1] : attachmentData[1];

		    String fileContent = attachmentData[2];
		    
			try
			{
				System.out.println("FileName: " + fileName + " FileExtension: " + fileExt);
				
				email.addAttachment(fileName + "." + fileExt, fileContent);
			}
			catch (IOException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    }
    	
    	return sendGrid.send(email);
    }
    
    /**
     * Creates a task for sending email and agile document as a email attachment
     * 
     * @param documentId
     * @param mailJSONString
     * @param messageJSONString
     */
    private static void sendDocumentAsMailAttachment(String username, String password, Email email, Long documentId)
    {
		// Task for sending mail and document as mail attachment
		Document document = DocumentUtil.getDocument(documentId);
		String fileName = document.extension;
		String Url = document.url;
		IFileInputStream documentStream = new DocumentFileInputStream(fileName, Url);
		
		try
		{
//			email.addAttachment(fileName, documentStream.getInputStream());
			
			SendGridAttachmentDeferredTask task = new SendGridAttachmentDeferredTask(username, password, email, documentStream);

			Queue queue = QueueFactory.getQueue("email-attachment-queue");
			queue.add(TaskOptions.Builder.withPayload(task));
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

    /**
     * Creates a task for sending email and uploaded blob as a email attachment
     * 
     * @param blobKey
     * @param mailJSONString
     * @param messageJSONString
     */
    private static void sendBlobAsMailAttachment(String username, String password, Email email, BlobKey blobKey)
    {
		// Task for sending mail and blob as mail attachment
		IFileInputStream blobStream = new BlobFileInputStream(blobKey);
		try
		{
//			email.addAttachment(blobStream.getFileName(), blobStream.getInputStream());
			
			SendGridAttachmentDeferredTask task = new SendGridAttachmentDeferredTask(username, password, email, blobStream);
			
			Queue queue = QueueFactory.getQueue("email-attachment-queue");
			queue.add(TaskOptions.Builder.withPayload(task));
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	
    }
}
