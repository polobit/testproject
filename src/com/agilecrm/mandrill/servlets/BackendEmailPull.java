package com.agilecrm.mandrill.servlets;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.mandrill.util.MandrillUtil;

/**
 * <code>BackendEmailPull</code> is the backend servlet to process all tasks of
 * pull-queue in appengine backend service
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class BackendEmailPull extends HttpServlet
{

    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {
	doPost(req, res);
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {

	MandrillUtil.processAllTasks();
	return;
    }
}
