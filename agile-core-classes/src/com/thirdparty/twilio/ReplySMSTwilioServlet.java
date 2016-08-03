package com.thirdparty.twilio;

import java.io.IOException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class ReplySMSTwilioServlet extends HttpServlet
{
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	
    try
	{
	  System.out.println("this is smsurl for only replying to twilio number");  
	   
	}
    catch (Exception e)
	{
	    e.printStackTrace();
	    return;
	}
    }
}
