package com.agilecrm.smtp;

import static javax.mail.internet.InternetAddress.parse;
import static org.apache.commons.lang.StringEscapeUtils.unescapeJava;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URL;
import java.net.URLDecoder;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.SendFailedException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.sun.mail.smtp.SMTPTransport;

/**
 * Handles the request from GMail.java, to make use of GMail to send mails via SMTP.
 * 
 * @author ravitheja
 */
@SuppressWarnings("serial")
@WebServlet("/smtpMailSenderServlet")
public class SMTPMailSenderServlet extends HttpServlet {

	final String TRUE = "true";
	final String FALSE = "false";
    
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
			throws ServletException, IOException {
		doPost(req, resp);
		resp.getWriter().print("SMTP Servlet hit ayyindi....");
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		
		/** Fetching Post Request parameters */
        String userMailId = request.getParameter("user_name");
        String password = request.getParameter("password");
        String fromName = request.getParameter("from_name");

        String host = request.getParameter("host");
        String ssl = request.getParameter("ssl");
        
        String subject = request.getParameter("subject");
        String html = request.getParameter("html");
        String text = request.getParameter("text");
        
        String to = request.getParameter("to");
        String cc = request.getParameter("cc");
        String bcc = request.getParameter("bcc");
        
        String file_source = request.getParameter("file_source");
        String file_stream = request.getParameter("file_stream");
        String file_name = request.getParameter("file_name");
        
        String validate = request.getParameter("validate");
        
        
        if(userMailId == null || password == null || host == null) return;
        
        System.out.println("*****SSL*** " + ssl);
        // These host doesn't support SSL.
        if(host.equals("smtp.live.com") || host.equals("smtp.office365.com"))
        	ssl = FALSE;
       
        String port = (Boolean.valueOf(ssl)) ? "465" : "587";
        Properties properties = setSMTPProperties(host, ssl, port);
        
		Session session = Session.getInstance(properties);
		//session.setDebug(true);

		String serverResponse = "1111";
		File file = null;
		
		try {
    		/** Creating MimeMessage that has to be added as Message of the mail. */
    		MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(userMailId, fromName));
        	message.addRecipients(Message.RecipientType.TO, parse(to, false));
            message.addRecipients(Message.RecipientType.CC, parse(cc, false));
            message.addRecipients(Message.RecipientType.BCC, parse(bcc, false));
            message.setSubject(unescapeJava(subject), "UTF-8");
            
        	Multipart multipart = new MimeMultipart();
            
        	BodyPart messageBodyPart = new MimeBodyPart();
        	
        	if(StringUtils.isBlank(html) && StringUtils.isNotBlank(text))
        		html = text;

        	// Email templates consists of % and other HTML/JS stuff, that has to be replaced 
        	// before decoding, as mail content has been encoded from the GMail.java.
        	html = html.replaceAll("%(?![0-9a-fA-F]{2})", "%25");
        	html = html.replaceAll("\\+", "%2B");
        	html = unescapeJava(URLDecoder.decode(html, "UTF-8")); 

        	System.out.println("htmlhtml " + html);
        	messageBodyPart.setContent(html, "text/html; charset=UTF-8");
            multipart.addBodyPart(messageBodyPart);

            //Attachments related code
            System.out.println("file_source == " + file_source);
            System.out.println("file_name == " + file_name);
            System.out.println("file_stream == " + file_stream);
            
            if(StringUtils.isNotBlank(file_stream)) {
            	if("document".equalsIgnoreCase(file_source) 
            			|| "mail_attach".equalsIgnoreCase(file_source)) {
            		System.out.println("---Attaching Document---");
		    	
            		BodyPart attachPart = new MimeBodyPart();
		    		attachPart.setFileName(file_name);
		    		attachPart.setContent(file_name, "application/octet-stream");
		   			attachPart.setDataHandler(new DataHandler(new URL(file_stream)));
		   			multipart.addBodyPart(attachPart);
            	}
            	else if("attachment".equalsIgnoreCase(file_source)) {
					System.out.println("SMTP " + file_source + " :: " + file_name + "  -@-  " + file_stream);
					
					file = new File(file_name);
					FileWriter writer = new FileWriter(file);
					writer.write(file_stream);
					writer.close();
					
					MimeBodyPart attachPart = new MimeBodyPart();
					attachPart.setFileName(file_name);
					attachPart.attachFile(file);
					
					multipart.addBodyPart(attachPart);
				}
            }
            
            message.setContent(multipart);
            
            serverResponse = connectAndSendMail(userMailId, password, host, validate, port, 
            		session, message);
        }
        catch (MessagingException me) {
        	String errormsg = me.getLocalizedMessage();
        	
        	System.err.println("errormsg -> " + errormsg);
        	me.printStackTrace();
            
            StringWriter sw = new StringWriter();
            me.printStackTrace(new PrintWriter(sw));

            serverResponse = errormsg + " FAILEDCONN " + serverResponse + " " + sw.toString();
        } 
        finally {
        	if(file != null) file.delete();
        }
		
        response.getWriter().print(serverResponse);
	}

	/**
	 * Connects to the host using SMTP settings and sends mail
	 */
	private String connectAndSendMail(String userMailId, String password, String host,
			String validate, String port, Session session, MimeMessage message) 
					throws MessagingException, SendFailedException {
		String serverResponse;
		/** Establishing Transport protocol for SMTP */
		serverResponse = "2222";
		SMTPTransport transport = new SMTPTransport(session, null);
		System.out.println("+++++++++++CONNECTING+++++++++++");
		System.out.println(host + " + " + port + " + " + userMailId);
		transport.connect(host, Integer.valueOf(port), userMailId, password);
		
		serverResponse = "CONNECTED";
		System.out.println("***********CONNECTED***********");
		
		// Skipping the send mail code for the initial validation of SMTP configuration.
		if(!Boolean.valueOf(validate)) {
			System.out.println("++++++++++++++++sending message++++++++++++++++++++");
			transport.sendMessage(message, message.getAllRecipients());
		    serverResponse = transport.getLastServerResponse();

		    System.out.println("+++++++++++ServerResponse ++ "+serverResponse);
		    System.out.println("Message ID :: " + message.getMessageID());
		}
		transport.close();
		return serverResponse;
	}

	/**
	 * Separately configure SMTP Properties for SSL enabled/SSL disabled (TLS)
	 * 
	 * @param host
	 * @param ssl
	 * @param port
	 * @return
	 */
	private Properties setSMTPProperties(String host, String ssl, String port) {
		Properties properties = System.getProperties();
        if(Boolean.valueOf(ssl)) {
        	System.out.println("+++++++++++++++++465 message++++++++++++++++++++");
        	properties.put("mail.smtps.host", host);
        	properties.put("mail.smtps.port", port);
        	properties.put("mail.smtps.auth", "true");
        	properties.setProperty("mail.smtp.ssl.enable", TRUE);
        	properties.setProperty("mail.transport.protocol", "smtps");
        	//properties.put("mail.smtp.socketFactory.fallback", "true");
        } 
        else {
        	System.out.println("+++++++++++++++++587 message++++++++++++++++++++");
        	properties.put("mail.smtp.host", host);
            properties.put("mail.smtp.port", port);
            properties.setProperty("mail.smtp.starttls.enable", TRUE);
            properties.setProperty("mail.smtp.starttls.required", TRUE);
            properties.setProperty("mail.smtp.ssl.enable", "false");
        	properties.setProperty("mail.transport.protocol", "smtp");
        }
		return properties;
	}

	public static void main(String[] args) {
		try{
			File file = new File("abc.txt");
			FileWriter writer = new FileWriter(file);
			writer.write("welcome guys");
			writer.close();
			System.out.println(file.getAbsolutePath());
			file.delete();
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}