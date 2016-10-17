package com.analytics.servlets;

import java.io.IOException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.webruleio.reports.WebruleReportsSQLUtil;

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

	WebruleReportsSQLUtil.insertData(emailid, domainname, webruleid, webruleAction);

    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException
    {

	doGet(req, res);

    }
}
