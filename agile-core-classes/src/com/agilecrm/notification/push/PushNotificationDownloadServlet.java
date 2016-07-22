package com.agilecrm.notification.push;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.util.FileStreamUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;

public class PushNotificationDownloadServlet extends HttpServlet {
	
	/**
	 * Push notification service workers and manifest json file path
	 */
	private static final String PUSH_NOTIFICATION_FILEPATH = "misc/notification/";
	
	/**
	 * Manifest file name
	 */
	private static final String PUSH_NOTIFICATION_MANIFEST = "manifest.json";
	
	/**
	 * Agile service workers file name
	 */
	private static final String PUSH_NOTIFICATION_SERVICE_WORKERS = "agile-service-workers.js";
  
public void doGet(HttpServletRequest request, HttpServletResponse response)  
            throws ServletException, IOException
    {  

        response.setHeader("Access-Control-Allow-Origin", "*");
		response.setContentType("text/html");  
		PrintWriter out = response.getWriter();   
			
		response.setContentType("APPLICATION/OCTET-STREAM");   
		
		String fileType = request.getParameter("q");
		
		String fileContent = "";
		
		if(fileType.equals("json"))
		{
			response.setHeader("Content-Disposition","attachment; filename=\"" + PUSH_NOTIFICATION_MANIFEST + "\"");  
			
			fileContent = FileStreamUtil.readResource(PUSH_NOTIFICATION_FILEPATH + PUSH_NOTIFICATION_MANIFEST);
		}
		else if(fileType.equals("js"))
		{
			fileContent = "var domain = \""+NamespaceManager.get()+"\";\n";
			response.setHeader("Content-Disposition","attachment; filename=\"" + PUSH_NOTIFICATION_SERVICE_WORKERS + "\"");  
			
			fileContent += FileStreamUtil.readResource(PUSH_NOTIFICATION_FILEPATH + PUSH_NOTIFICATION_SERVICE_WORKERS);
		}
			
			out.write(fileContent);
			out.close();   
}  
  
}  