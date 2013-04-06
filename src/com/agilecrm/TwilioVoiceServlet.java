package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TwilioVoiceServlet extends HttpServlet
{
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
    {

	String phoneNumber = request.getParameter("PhoneNumber");

	System.out.println("phone number : " + phoneNumber);

	/* Use this as the caller ID when making calls from a browser. */
	String callerId = "+14105551234";

    }
}