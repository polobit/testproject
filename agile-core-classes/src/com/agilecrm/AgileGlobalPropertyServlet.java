package com.agilecrm;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.util.AgileGlobalPropertiesUtil;

public class AgileGlobalPropertyServlet extends HttpServlet
{

	private static final long serialVersionUID = 7855519707608529361L;
	
	private static final List<String> authorizedEmails = new ArrayList<String>();
	
	static
	{
		authorizedEmails.add("rahul@agilecrm.com");
		authorizedEmails.add("naresh@agilecrm.com");
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		String pwdParam = req.getParameter("pwd");
		String email = req.getParameter("e");
		
		// If password is empty
		if(StringUtils.isBlank(pwdParam))
		{	
			res.getWriter().print("<h1>You are not authorized to perform this operation.</h1>");
			return;
		}
		
		// If password is not alphanumeric or below 8 characters
		if(!isValid(pwdParam) || StringUtils.length(pwdParam) <= 8)
		{
			
			res.getWriter().print("<b>The given password '" + pwdParam + "' did not meet minimum requirements. "
					+ "Please visit <a href='https://sendgrid.com/docs/Classroom/Basics/Security/password.html' target='_blank'>Sendgrid</a> for more details.</b>");
			return;
		}
		
		// If email is null or not proper
		if(email == null || !authorizedEmails.contains(email))
		{
			res.getWriter().print("<h1>You are not authorized to perform this operation.</h1>");
			return;
		}
		
		AgileGlobalProperties props = AgileGlobalPropertiesUtil.getAgileGlobalProperties();
		
		if(props == null)
			props = new AgileGlobalProperties();
		
		props.setSendgridSubUserPwd(pwdParam);
		props.save();
		
		res.getWriter().print("<b>Sendgrid subuser password is updated in datastore successfully.</b>");
	}
	
	/**
	 * Verifies that both letter and number exists in password
	 * 
	 * @param str
	 * @return
	 */
	private static boolean isValid(String str)
	{
		return (str.matches("(.*[0-9].*)") && str.matches(".*[A-Za-z].*"));
	}
}
