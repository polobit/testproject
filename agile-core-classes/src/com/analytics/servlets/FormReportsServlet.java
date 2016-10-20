package com.analytics.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.forms.Form;
import com.agilecrm.forms.util.FormUtil;
import com.formio.reports.FormReportsSQLUtil;
import com.google.appengine.api.NamespaceManager;

@SuppressWarnings("serial")
public class FormReportsServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException
    {
	String emailid = null;
	if (req.getParameter("email") != null)
	{
	    emailid = req.getParameter("email").toLowerCase();
	}
	//String domainname =req.getParameter("domain");
	//System.out.println("the value from get parameter is"+domainname);
	String domain=NamespaceManager.get();
	System.out.println("the value from Namespacemanager is"+domain);
	String formid = req.getParameter("formid");
	String formName = req.getParameter("form_name");
	if(formid.equalsIgnoreCase("null"))
	  {
	    Form frm=FormUtil.getFormByName(formName);
	    String frmid =(frm.id).toString();
	    System.out.println("the srvlet details"+" "+emailid + " " + domain+" "+frmid);
	    FormReportsSQLUtil.insertData(emailid, domain, frmid);
	
	     
	  }
	else
	   {
	    System.out.println("the srvlet details"+" "+emailid + " " + domain+" "+formid);
	    FormReportsSQLUtil.insertData(emailid, domain, formid);
	    
	    }


    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException
    {

	doGet(req, res);

    }

}
