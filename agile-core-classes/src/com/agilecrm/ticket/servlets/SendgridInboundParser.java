package com.agilecrm.ticket.servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.Properties;

import javax.mail.Header;
import javax.mail.MessagingException;
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
			Enumeration<String> headerNames = request.getHeaderNames();

			while (headerNames.hasMoreElements())
			{
				String headerName = headerNames.nextElement();
				System.out.println("headerName: " + headerName);

				Enumeration<String> headers = request.getHeaders(headerName);
				while (headers.hasMoreElements())
				{
					String headerValue = headers.nextElement();
					System.out.println("headerValue: " + headerValue);
				}
			}

			InputStream client = request.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(client));

			StringBuffer chaine = new StringBuffer();
			String ligne = "";

			while ((ligne = br.readLine()) != null)
				chaine.append(ligne);

			client.close();

			System.out.println("chaine");
			System.out.println(chaine);
			
			System.out.println("request.getParameterMap();");
			System.out.println(request.getParameterMap());

			// System properties
			Properties props = new Properties();
			Session session = Session.getDefaultInstance(props, null);

			// Reading the input Mail
			MimeMessage message = new MimeMessage(session, client);

			System.out.println("message..." + message.getFrom());
			System.out.println("message.getSubject()..." + message.getSubject());

			// //MimeMessageParser mmp = new MimeMessageParser(message).parse();
			//
			// System.out.println("mmp.getFrom()..." + mmp.getFrom());
			// System.out.println("mmp.getSubject()..." + mmp.getSubject());
			// System.out.println("mmp.getTo()..." + mmp.getTo());
			// System.out.println("mmp.getPlainContent()..." +
			// mmp.getPlainContent());

			Enumeration headers = message.getAllHeaders();
			System.out.println("Message Headers: \r\n");

			while (headers.hasMoreElements())
			{
				Header h = (Header) headers.nextElement();
				System.out.println(h.getName() + ": " + h.getValue());
			}
			
			headers = message.getAllHeaderLines();
			System.out.println("Message Headers lines : \r\n");

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

	public static void main(String[] args) throws FileNotFoundException, Exception
	{
		File f = new File("D:\\email.txt");

		FileInputStream fin = new FileInputStream(f);

		// System properties
		Properties props = new Properties();
		Session session = Session.getDefaultInstance(props, null);

		// Reading the input Mail
		MimeMessage message = new MimeMessage(session, fin);

		System.out.println("message..." + message.getFrom());
		System.out.println("message.getSubject()..." + message.getSubject());
	}
}
