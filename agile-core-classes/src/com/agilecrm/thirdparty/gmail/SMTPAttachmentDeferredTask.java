package com.agilecrm.thirdparty.gmail;

import com.agilecrm.user.GmailSendPrefs;
import com.agilecrm.user.SMTPPrefs;
import com.agilecrm.util.HTTPUtil;
import com.google.api.client.auth.oauth2.Credential;
import com.google.appengine.api.taskqueue.DeferredTask;

@SuppressWarnings("serial")
public class SMTPAttachmentDeferredTask implements DeferredTask
{

	public String to = null;
	public String cc = null;
	public String bcc = null;
	
	public String subject = null;
	public String html = null;
	public String text = null;

	public String fromEmail = null;
	public String userName = null;
	public String[] attachFile = null;
	
	public GmailSendPrefs gmailSendPrefs = null;
	public SMTPPrefs smtpPrefs = null;
	
	public String smtpURL = null;
	
	
	/**
	 * 
	 * @param to
	 * @param cc
	 * @param bcc
	 * @param subject
	 * @param html
	 * @param fromEmail
	 * @param userName
	 * @param attachFile
	 * @param token
	 * @param refresh_token
	 */
	public SMTPAttachmentDeferredTask(String to, String cc, String bcc, String subject,
			String html, String text, String fromEmail, String userName, String[] attachFile, 
			GmailSendPrefs gmailSendPrefs, SMTPPrefs smtpPrefs, String smtpURL) {
		this.to = to;
		this.cc = cc;
		this.bcc = bcc;
		
		this.subject = subject;
		this.html = html;
		this.text = text;
		
		this.fromEmail = fromEmail;
		this.userName = userName;
		this.attachFile = attachFile;
		
		this.gmailSendPrefs = gmailSendPrefs;
		this.smtpPrefs = smtpPrefs;
		
		this.smtpURL = smtpURL;
	}
	
	@Override
	public void run()
	{
		System.out.println("SMTP Queue started");
		
		if(gmailSendPrefs != null)
			try {
				Credential gcredential = GMail.getGoogleCredential(gmailSendPrefs);
				GMail.sendByGmailAPI(to, cc, bcc, subject, html, fromEmail, userName, 
						attachFile, gcredential);
			} 
			catch(Exception e) {
				e.printStackTrace();
			}
		else if(smtpPrefs != null){
			try {
				String data = GMail.getSMTPPostParams(smtpPrefs, to, cc, bcc, subject, userName,
						html, text, attachFile[0], attachFile[1], attachFile[2]);
				
				// making servlet call through HttpURLConnection
				String response = HTTPUtil.accessURLUsingPost(smtpURL, data);
				System.out.println("SMTP response ++ " + response);
			} 
			catch(Exception e) {
				e.printStackTrace();
			}
		}
	}

}
