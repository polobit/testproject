package com.agilecrm.imap;

import java.io.IOException;
import java.security.Provider;
import java.security.Security;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

import javax.mail.BodyPart;
import javax.mail.Flags;
import javax.mail.Flags.Flag;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.Transport;
import javax.mail.URLName;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.imap.IMAPStoreWrapper;
import com.agilecrm.imap.OAuth2Authenticator;
import com.sun.mail.imap.IMAPFolder;
import com.sun.mail.imap.IMAPSSLStore;
import com.sun.mail.imap.IMAPStore;
import com.sun.xml.internal.messaging.saaj.packaging.mime.MessagingException;

@SuppressWarnings("serial")
public class IMAPSendReplyServlet extends HttpServlet{
	
	 public void service(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		 Properties props = new Properties();
		  props.put("mail.smtp.host", "smtp.gmail.com");
		  props.put("mail.smtp.socketFactory.port", "465");
		  props.put("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory");
		  props.put("mail.smtp.auth", "true");
		  props.put("mail.smtp.port", "465");
		  final String username="rajesh.agilecrm@gmail.com";
		  final String password="07851a@590";
		  Session session = Session.getDefaultInstance(props,
		   new javax.mail.Authenticator() {
		    protected PasswordAuthentication getPasswordAuthentication() {
		     return new PasswordAuthentication(username,password);
		    }
		   });
		  try {
			  String body =req.getParameter("body");
			  String cc =req.getParameter("cc");
			  String bcc =req.getParameter("bcc");
			  String msgid = req.getParameter("msgid");
			  int mssgid = Integer.parseInt(msgid);
			  
			  Store store = session.getStore("imaps");  
			  store.connect("imap.gmail.com",username, password);  
			  
			  //Create a Folder object and open the folder  
			  Folder folder = store.getFolder("inbox");  
			  folder.open(Folder.READ_ONLY);  
			     Message message = folder.getMessage(mssgid);  
			    // Get all the information from the message  
			    String from = InternetAddress.toString(message.getFrom());  
			    if (from != null) {  
			    	System.out.println("From: " + from);  
			    }  
			    String replyTo = InternetAddress.toString(message.getReplyTo());  
			    if (replyTo != null) {  
			    	System.out.println("Reply-to: " + replyTo);  
			    }  
			    String to = InternetAddress.toString(message.getRecipients(Message.RecipientType.TO));  
			    if (to != null) {  
			    	System.out.println("To: " + to);  
			    }  
			    
			    String subject = message.getSubject();  
			   if (subject != null) {  
				   System.out.println("Subject: " + subject);  
			   }  
			   Date sent = message.getSentDate();  
			   if (sent != null) {  
				   System.out.println("Sent: " + sent);  
			   }  
			   System.out.println(message.getContent());  
			   
			   // compose the message to forward  
			   Message message2 = new MimeMessage(session);  
			    message2= (MimeMessage) message.reply(false);
			   message2.setSubject("RE: " + message.getSubject());  
			   message2.setFrom(new InternetAddress(from));  
			   message2.setReplyTo(message.getReplyTo());
			   
			   message2.addRecipient(Message.RecipientType.TO, new InternetAddress(to));  
			   if(cc!= null)
				   message2.addRecipient(Message.RecipientType.CC, new InternetAddress(cc));
			   
			   if(bcc != null)
				   message2.addRecipient(Message.RecipientType.BCC, new InternetAddress(bcc));
			   // Create your new message part  
			   BodyPart messageBodyPart = new MimeBodyPart();  
			   messageBodyPart.setText(body);  
			   
			   // Create a multi-part to combine the parts  
			   Multipart multipart = new MimeMultipart();  
			   multipart.addBodyPart(messageBodyPart);  
			   
			   // Create and fill part for the forwarded content  
			   messageBodyPart = new MimeBodyPart();  
			   messageBodyPart.setDataHandler(message.getDataHandler());  
			   // Add part to multi part  
			   multipart.addBodyPart(messageBodyPart);  
			   // Associate multi-part with message  
			   message2.setContent(multipart);  
			   // Send message  
			   Transport.send(message2);  
			   System.out.println("message replied successfully ....");  
		   } catch (Exception e) {
			   throw new RuntimeException(e);
		  }
	 }
}