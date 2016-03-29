package com.agilecrm.ticket.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.Iterator;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

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
			String input = null;
			BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream(), "UTF-8"), 8);
			StringBuilder sb = new StringBuilder();

			String line = null;
			while ((line = reader.readLine()) != null)
			{
				sb.append(line + "\n");
			}
			input = sb.toString();

			System.out.println("Result: " + sb);

			ServletFileUpload upload = new ServletFileUpload();
			FileItemIterator fileIterator = upload.getItemIterator(request);
			while (fileIterator.hasNext())
			{
				FileItemStream item = fileIterator.next();

				if ("file".equals(item.getFieldName()))
				{
					byte[] content = IOUtils.toByteArray(item.openStream());
					// Save content into datastore
					// ...
				}
				else if ("name".equals(item.getFieldName()))
				{
					String name = IOUtils.toString(item.openStream());
					System.out.println("name.." + name);

					// Do something with the name string
					// ...
				}
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}
}
