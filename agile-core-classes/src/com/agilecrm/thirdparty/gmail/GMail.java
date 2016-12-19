package com.agilecrm.thirdparty.gmail;

import static javax.mail.Message.RecipientType.BCC;
import static javax.mail.Message.RecipientType.CC;
import static javax.mail.Message.RecipientType.TO;
import static javax.mail.internet.InternetAddress.parse;
import static org.apache.commons.lang.StringEscapeUtils.escapeJava;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.activation.DataHandler;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.document.Document;
import com.agilecrm.document.util.DocumentUtil;
import com.agilecrm.scribe.api.GoogleApi;
import com.agilecrm.user.GmailSendPrefs;
import com.agilecrm.user.SMTPPrefs;
import com.agilecrm.user.util.GmailSendPrefsUtil;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.Base64;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.Gmail.Users;
import com.google.api.services.gmail.Gmail.Users.Messages;
import com.google.api.services.gmail.Gmail.Users.Messages.Send;
import com.google.api.services.gmail.model.Message;
import com.google.appengine.api.blobstore.BlobKey;
import com.thirdparty.sendgrid.SendGrid;


/**
 * GMail is the class for sending personal mails using SMTP initially via GMail
 * 
 * @author agileravi
 * 
 */
public class GMail {

	//private static final String SMTP_URL ="http://localhost:8081/agile-smtp/smtpMailSender";
	private static final String SMTP_URL ="http://54.234.153.217:80/agile-smtp/smtpMailSender";		// SMTP server

    private static String applicationName = "gmail_oauth2";
	
	private static JsonFactory JSON_FACTORY = new JacksonFactory();
    private static HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    
    
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
    		String subject, String replyTo, String fromName, String html, String text, 
    		List<Long> documentIds, List<BlobKey> blobKeys, String[] attachments) {
        
    	try {
    		String[] attachFile = {"","",""}; 	//getAttachment(documentIds, blobKeys, attachments);
	    	
	    	String data = getSMTPPostParams(smtpPrefs, to, cc, bcc, subject, replyTo, fromName,
	    			html, text, attachFile[0], attachFile[1], attachFile[2]);
	    	
    		// making servlet call through HttpURLConnection
    		String response = HTTPUtil.accessURLUsingPost(SMTP_URL, data);
			System.out.println("SMTP response ++ " + response);
		} 
    	catch(Exception e) {
			e.printStackTrace();
		}
    }
    
    /**
	 * Core method to be called from EmailGatewayUtil to invoke sendByGmailAPI
	 * to send personal mails using Oauth for Gmail 
	 */
    public static void sendMail(GmailSendPrefs gmailPrefs, String to, String cc, String bcc, 
    		String subject, String replyTo, String fromName, String html, String text, 
    		List<Long> documentIds, List<BlobKey> blobKeys, String[] attachments) {
    	
    	System.out.println("sendMail +++GmailSendPrefs in Gmail.java");
    	
    	String from = gmailPrefs.email;
    	try {
    		String[] attachFile = {"","",""}; 	//getAttachment(documentIds, blobKeys, attachments);

			if(gmailPrefs.refresh_token == null || gmailPrefs.token == null) {
				throw new Exception();
			}

    		Credential gcredential = new GoogleCredential
    				.Builder()
    				.setTransport(HTTP_TRANSPORT)
    				.setJsonFactory(JSON_FACTORY)
    				.setClientSecrets(GoogleApi.SMTP_OAUTH_CLIENT_ID, GoogleApi.SMTP_OAUTH_CLIENT_SECRET)
    				.build()
    				.setAccessToken(gmailPrefs.token)
    				.setRefreshToken(gmailPrefs.refresh_token);
    		
    		if(gmailPrefs.expires_at == null || gmailPrefs.expires_at < System.currentTimeMillis()) {
				gcredential.refreshToken();
				gmailPrefs.refresh_token = gcredential.getRefreshToken();
				gmailPrefs.token = gcredential.getAccessToken();
				gmailPrefs.expires_at = gcredential.getExpirationTimeMilliseconds();
				GmailSendPrefsUtil.save(gmailPrefs);
    		}
    		
    		System.out.println("accessToken :: " + gmailPrefs.token);
			System.out.println("refreshToken :: " + gmailPrefs.refresh_token);
			System.out.println("expires at :: " + gmailPrefs.expires_at);
			System.out.println("Current time:: " + System.currentTimeMillis());
			
			sendByGmailAPI(to, cc, bcc, subject, fromName, html, from, gmailPrefs.name, attachFile, 
					gcredential);
    	}
    	catch(Exception e) {
			System.err.println(e.getMessage());
			String errorResp = ExceptionUtils.getFullStackTrace(e);
			if((errorResp.contains("invalid_grant") && errorResp.contains("Token has been revoked"))
					|| errorResp.contains("Invalid Credentials") 
					|| errorResp.contains("Problems while creating connection")){
				System.out.println("invalid_grant111");
				sendReconfigureMail(gmailPrefs, from);
			}
			else if(gmailPrefs.refresh_token == null || gmailPrefs.token == null) {
				System.out.println("invalid_grant222");
				System.out.println("accessToken :: " + gmailPrefs.token 
						+ " -- refreshToken :: " + gmailPrefs.refresh_token);
				sendReconfigureMail(gmailPrefs, from);
			}
		}
    }
    
    /**
     * We need to ask user to reconfigure oauth settings in case of authentication failure.
     * This would happen when user deletes AgileCRM app auth settings from Gmail Account.
     * 
     * @param gmailPrefs
     * @param from
     */
	private static void sendReconfigureMail(GmailSendPrefs gmailPrefs, String from) {
		//Delete the gmail account prefs so that outbound widget configuration is deleted.
		System.out.println("Deleting GmailSendPrefs...");
		gmailPrefs.delete();
		
		//Send email to the sender.
		System.out.println("Sending mail to sender to reconfigure Oauth...");
		String subj = "Reconfigure Gmail Account";
		String content = EmailUtil.emailTemplate("It seems you have revoked the access for "
				+ "Agile CRM from sending emails through Gmail SMTP. <br>"
				+ "Please reconfigure your Gmail SMTP account in Agile CRM again in <br>"
				+ "Preferences -> Email -> Outbound.<br><br>");

		SendGrid.sendMail("noreply@agilecrm.com", "Agile CRM", from, null, null, subj, null, content, null);
	}

	/**
	 * This method is used to send Oauth emails using Gmail API.
	 *
	 */
	private static void sendByGmailAPI(String to, String cc, String bcc, String subject,
			String fromName, String html, String from, String name, String[] attachFile, 
			Credential gcredential) 
					throws MessagingException, IOException, Exception {
		Gmail service = new Gmail
				.Builder(HTTP_TRANSPORT, JSON_FACTORY, gcredential)
				.setApplicationName(applicationName)
				.build();
		
		Message message = null;
		
		if(StringUtils.isBlank(attachFile[0])) {
			message = createMimeMessage(to, cc, bcc, from, subject, fromName, name, html, attachFile);	
		}
		else if("document".equalsIgnoreCase(attachFile[0])) {
			message = createEmailWithDocument(to, cc, bcc, from, subject, fromName, name, html, attachFile); 
		}
		/*else if("blobkey".equalsIgnoreCase(attachFile[0])) {
			message = createEmailWithBlobkey(to, cc, bcc, from, subject, fromName, html, attachFile); 
		}*/
		
		if(message == null) return;
		
		//Message message = createMessageWithEmail(email);
		System.out.println("+++Message created. Sending.....");
		
		Users users = service.users();
		Messages msgs = users.messages();
		Send send = msgs.send("me", message);
		message = send.execute();

		System.out.println("+++Message Id: " + message.getId());
		System.out.println("+++Message String: " + message.toPrettyString());
		System.out.println((message.getId() != null) ? "+++success+++" : "+++failed+++");
	}

    /**
     * create a mimemessage with plain text, if no attachment.
     *
     */
	private static Message createMimeMessage(String to, String cc, String bcc, 
			String from, String subject, String fromName, String name, String body, 
			String[] attachFile) {
		try {
			Properties props = new Properties();
			Session session = Session.getDefaultInstance(props, null);
			
			MimeMessage message = new MimeMessage(session);
			message.setFrom(new InternetAddress(from));
			//message.addFrom(parse(escapeJava(name) + " <" + from + ">"));
			message.addRecipients(TO, parse(escapeJava(to), false));
            message.addRecipients(CC, parse(escapeJava(cc), false));
            message.addRecipients(BCC, parse(escapeJava(bcc), false));
			message.setSubject(subject, "UTF-8");
			message.setContent(body, "text/html; charset=UTF-8");
			
			return createMessageWithEmail(message);
		} 
		catch(MessagingException ex) {
			Logger.getLogger(GMail.class.getName()).log(Level.SEVERE, null, ex);
			return null;
		} 
		catch(IOException e) {
			e.printStackTrace();
		}
		return null;
	}
    
	/**
	 * Builds Message object with Mime content to be delivered.
	 * @param emailContent
	 * @return
	 * @throws MessagingException
	 * @throws IOException
	 */
	private static Message createMessageWithEmail(MimeMessage emailContent) 
			throws MessagingException, IOException {
		ByteArrayOutputStream buffer = new ByteArrayOutputStream();
		emailContent.writeTo(buffer);
		byte[] bytes = buffer.toByteArray();
		
		Message message = new Message();
		message.setRaw(Base64.encodeBase64URLSafeString(bytes));
		return message;
	}
	
	/**
	 * create a mimemessage with text body and attachment.
	 *
	 */
	private static Message createEmailWithDocument(String to, String cc, String bcc, 
			String from, String subject, String fromName, String name, String bodyText, 
			String[] attachFile) throws MessagingException, IOException, Exception {
		
		String fileName = attachFile[1];
		
		MimeMessage emailMsg = new MimeMessage(Session.getDefaultInstance(new Properties(), null));

		emailMsg.setSender(new InternetAddress(from));
		emailMsg.addRecipients(TO, InternetAddress.parse(to, false));
		emailMsg.addRecipients(CC, InternetAddress.parse(cc, false));
		emailMsg.addRecipients(BCC, InternetAddress.parse(bcc, false));
		emailMsg.setSubject(subject);

		Multipart multipart = new MimeMultipart();
		
		MimeBodyPart bodyPart = new MimeBodyPart();
		bodyPart.setContent(bodyText, "text/html; charset=UTF-8");
		multipart.addBodyPart(bodyPart);

		MimeBodyPart attachPart = new MimeBodyPart();
		attachPart.setFileName(fileName);
		attachPart.setContent(fileName, "application/octet-stream");
		attachPart.setDataHandler(new DataHandler(new URL(attachFile[2])));
		multipart.addBodyPart(attachPart);
		
		emailMsg.setContent(multipart);

		return createMessageWithEmail(emailMsg);
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

			returnStr[0] = "document";
			returnStr[1] = fileName;
			returnStr[2] = docUrl;
    	}
    	else {
    		returnStr[0] = "";
			returnStr[1] = "";
			returnStr[2] = "";
    	}
    	return returnStr;
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
			String subject, String replyTo, String fromName, String html, String text, 
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
			url.append("&from_name=" + ((fromName != null) ? URLEncoder.encode(fromName, "UTF-8"):null));
			
			url.append("&subject=" + ((subject != null) ? URLEncoder.encode(escapeJava(subject), "UTF-8"):null));
			url.append("&html=" + ((html != null) ? URLEncoder.encode(escapeJava(html), "UTF-8"):null));
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
