package com.agilecrm.ticket.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

public class SendgridInboundParser extends HttpServlet
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		PrintWriter pw = response.getWriter();
		pw.write("Get");
		System.out.println("Get method called..");
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException
	{
		try
		{

			Enumeration<String> parameterNames = request.getParameterNames();

			while (parameterNames.hasMoreElements())
			{

				String paramName = parameterNames.nextElement();
				System.out.println(paramName);

				String[] paramValues = request.getParameterValues(paramName);
				for (int i = 0; i < paramValues.length; i++)
				{
					String paramValue = paramValues[i];
					System.out.println(paramValue);
				}
			}
			
			System.out.println("Form fields...");
			
			List<FileItem> multiparts = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);

			for (FileItem item : multiparts)
			{
				String name = item.getFieldName();
				String value = item.getString();
				
				if (!item.isFormField())
				{
					System.out.println("!item.isFormField()");
					System.out.println(name);
					System.out.println(value);
					// your operations on file
				}
				else
				{
					System.out.println(name);
					System.out.println(value);
				}
			}
		}
		catch (FileUploadException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
