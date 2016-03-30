package com.agilecrm.ticket.servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.Calendar;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
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
			System.out.println("request.getParameterMap()");
			System.out.println(request.getParameterMap());
			
			System.out.println("html: " + request.getParameter("body-html"));
			
			boolean isMultipart = ServletFileUpload.isMultipartContent(request);

			System.out.println("isMultipart: " + isMultipart);

			try
			{
				Long currentTime = Calendar.getInstance().getTimeInMillis();
				
				if (isMultipart)
				{
					ServletFileUpload upload = new ServletFileUpload();

					try
					{
						FileItemIterator iter = upload.getItemIterator(request);
						FileItemStream item = null;
						String name = "";

						while (iter.hasNext())
						{
							item = iter.next();
							name = item.getFieldName();

							if (item.isFormField())
							{
								System.out.println("Form field:  " + name);

								String theString = IOUtils.toString(item.openStream(), "UTF-8");

								System.out.println(theString);
							}
							else
							{
								name = item.getName();
								System.out.println("name==" + name);
								
								if (name != null && !"".equals(name))
								{
									String fileName = new File(item.getName()).getName();
									System.out.println("fileName: " + fileName);
									System.out.println("file content: ");

									String theString = IOUtils.toString(item.openStream(), "UTF-8");

									System.out.println(theString);
								}
							}
						}
					}
					catch (Exception e)
					{
						System.out.println(ExceptionUtils.getFullStackTrace(e));
					}
				}

			}
			catch (Exception e)
			{
				System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
				e.printStackTrace();
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}
}