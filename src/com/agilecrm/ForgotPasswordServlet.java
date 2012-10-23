package com.agilecrm;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.core.DomainUser;

@SuppressWarnings("serial")
public class ForgotPasswordServlet extends HttpServlet
{
    public void doPost(HttpServletRequest request, HttpServletResponse response)
	    throws IOException, ServletException
    {
	doGet(request, response);
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
	    throws IOException, ServletException
    {
	// Get User Name
	String email = request.getParameter("email");
	String password = "";
	System.out.println(email);
	DomainUser domainuser = DomainUser.generatePassword(email);
	if (domainuser != null)
	{
	    password = domainuser.password;
	}
	System.out.println(password);
    }
}
