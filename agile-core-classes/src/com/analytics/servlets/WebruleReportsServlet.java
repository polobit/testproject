package com.analytics.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.webruleio.reports.WebruleLogUtil;



/*@author Poulami */

@SuppressWarnings("serial")
public class WebruleReportsServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException
    {
	String emailid = null;
	if (req.getParameter("email") != null)
	    emailid = req.getParameter("email").toLowerCase();
	String domainname = req.getParameter("domain");
	String webruleid = req.getParameter("webruleid");
	String webruleAction = req.getParameter("webruletype");
	System.out.println(emailid + " " + domainname + "" + webruleid + "" + webruleAction);

	WebruleLogUtil.addLogToSQL(webruleid, emailid, webruleAction);

	System.out.println("the push queue functionality");

    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException
    {

	doGet(req, res);

    }
}
