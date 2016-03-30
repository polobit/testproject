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

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
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

			boolean isMultipart = ServletFileUpload.isMultipartContent(request);

			System.out.println("isMultipart: " + isMultipart);

			// System properties
			Properties props = new Properties();
			Session session = Session.getDefaultInstance(props, null);

			// Reading the input Mail
			MimeMessage message = new MimeMessage(session, request.getInputStream());

			System.out.println("message getFrom..." + message.getFrom());
			System.out.println("message getSubject()..." + message.getSubject());
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

		BufferedReader br = new BufferedReader(new InputStreamReader(fin));

		StringBuffer chaine = new StringBuffer();
		String ligne = "";

		while ((ligne = br.readLine()) != null)
			chaine.append(ligne);

		fin.close();

		System.out.println("chaine");

		String[] array = chaine.toString().split("--xYzZY");

		for (String string : array)
		{
			System.out.println(string);
		}

		// // System properties
		// Properties props = new Properties();
		// Session session = Session.getDefaultInstance(props, null);
		//
		// // Reading the input Mail
		// MimeMessage message = new MimeMessage(session, fin);
		//
		// System.out.println("message..." + message.getFrom());
		// System.out.println("message.getSubject()..." + message.getSubject());
	}
}
