package com.agilecrm.ticket.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.Properties;

import javax.mail.Header;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.exception.ExceptionUtils;


public class SendgridInboundParser extends HttpServlet
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		PrintWriter pw = response.getWriter();
		pw.write("Get");
		System.out.println("Get method called..");
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			// System properties
			Properties props = new Properties();
			Session session = Session.getDefaultInstance(props, null);

			// Reading the input Mail
			MimeMessage message = new MimeMessage(session, request.getInputStream());
			MimeMessageParser mmp = new MimeMessageParser(message).parse();
			
			System.out.println("mmp.getFrom()..." + mmp.getFrom());
			System.out.println("mmp.getSubject()..." + mmp.getSubject());
			System.out.println("mmp.getTo()..." + mmp.getTo());
			System.out.println("mmp.getPlainContent()..." + mmp.getPlainContent());

			Enumeration headers = message.getAllHeaders();
			System.out.println("Message Headers: \r\n");
			
			while (headers.hasMoreElements())
			{
				Header h = (Header) headers.nextElement();
				System.out.println(h.getName() + ": " + h.getValue());
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}
}
