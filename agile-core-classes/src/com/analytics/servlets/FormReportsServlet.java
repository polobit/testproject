package com.analytics.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.forms.Form;
import com.agilecrm.forms.util.FormUtil;
import com.formio.reports.FormReportsSQLUtil;

public class FormReportsServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException
    {
	String emailid = null;
	if (req.getParameter("email") != null)
	{
	    emailid = req.getParameter("email").toLowerCase();
	}
	String domainname = req.getParameter("domain");
	String formid = req.getParameter("formid");
	String formName = req.getParameter("form_name");
	if(formid.equalsIgnoreCase("null"))
	  {
	    Form frm=FormUtil.getFormByName(formName);
	    String frmid =(frm.id).toString();
	    System.out.println("the srvlet details"+" "+emailid + " " + domainname+" "+frmid);
	    FormReportsSQLUtil.insertData(emailid, domainname, frmid);
	
	     
	  }
	else
	   {
	    System.out.println("the srvlet details"+" "+emailid + " " + domainname+" "+formid);
	    FormReportsSQLUtil.insertData(emailid, domainname, formid);
	    
	    }


    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException
    {

	doGet(req, res);

    }

}
