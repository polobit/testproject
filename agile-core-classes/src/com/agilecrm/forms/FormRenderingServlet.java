package com.agilecrm.forms;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.agilecrm.forms.util.FormUtil;
import org.apache.commons.lang.StringUtils;

/**
 * Servlet implementation class FormRenderingServlet
 */
public class FormRenderingServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	doPost(request, response);
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
	    IOException
    {
	response.setContentType("text/html; charset=UTF-8");
	PrintWriter out = response.getWriter();
	
	try
	{
	    Form form = null;
	    
	    String formIdPath = request.getPathInfo();
	    if (StringUtils.isEmpty(formIdPath))
		return;
	    String formId = formIdPath.substring(1);
	    if (formId.matches("[0-9]+"))
		form = FormUtil.getFormById(Long.parseLong(formId));
	    if (form == null)
		throw new Exception("No form found.");
	    String htmlBody = form.formHtml;
	    htmlBody = updateMethodType(htmlBody);
	    String htmlHeading = "<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>\n<title>Form</title>\n</head>\n<body>\n<div id=\"agileFormHolder\" style=\"margin:0 auto;width:450px\">\n";
	    String htmlButtom = "\n</div>\n</body>\n</html>";
	    String fullHtml = htmlHeading + htmlBody + htmlButtom;
	    
	    out.write(fullHtml);
	}
	catch (Exception e)
	{
	    out.print("<h1>" + e.getMessage() + "</h1>");
	}
    }
    
    private String updateMethodType(String inputHtml)
    {
    	try 
    	{
    		String methodGetWithDoubleQuotes = "method=\"GET\"";
    		String methodPostWithDoubleQuotes = "method=\"POST\"";
    		
    		String methodGetWithSingleQuotes = "method='GET'";
    		String methodPostWithSingleQuotes = "method='POST'";
    		
    		if(inputHtml.indexOf(methodGetWithDoubleQuotes) != -1)
    		{
    			inputHtml = inputHtml.replaceFirst(methodGetWithDoubleQuotes, methodPostWithDoubleQuotes);
    		}
    		else if (inputHtml.indexOf(methodGetWithSingleQuotes) != -1) 
    		{
    			inputHtml = inputHtml.replaceFirst(methodGetWithSingleQuotes, methodPostWithSingleQuotes);
    		}
		} 
    	catch (Exception e) 
    	{
			e.printStackTrace();
		}
    	return inputHtml;
    }
}
