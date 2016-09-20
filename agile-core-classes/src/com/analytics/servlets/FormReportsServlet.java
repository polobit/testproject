package com.analytics.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.formio.reports.FormReportsSQLUtil;
import com.webruleio.reports.WebruleReportsSQLUtil;

@SuppressWarnings("serial")
public class FormReportsServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException
    {
	String emailid=null;
	if (req.getParameter("email") != null)
	    emailid = req.getParameter("email").toLowerCase();
	String domainname = req.getParameter("domain");
	String formid = req.getParameter("formid");
	
	System.out.println(emailid + " " + domainname + "" + formid);

	FormReportsSQLUtil.insertData(emailid, domainname, formid);

    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException
    {

	doGet(req, res);

    }
}
