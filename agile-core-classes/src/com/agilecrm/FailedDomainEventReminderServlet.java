package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.activities.EventReminder;

/**
 * <FatledDomainEventReminderServelt> is used to instantiate differedtask for
 * eventReminders if incase the deferred task was terminated due to exception
 * occures. if we know the domain name where exception occured we can hit this
 * servlet URL (backends/faileddomaineventreminder) by passing domain name and
 * request parameter
 * 
 * i.e https://jagadeesh.agilecrm.com/backend/faileddomaineventreminder?
 * domainname=<faileddomainname>
 * 
 * if we hit the above url automatically one thread will be instantiated in that
 * domain
 * 
 * mostly not required to instantiate becoz in catch block also it will
 * instantiate thread.
 * 
 * @author jagadeesh
 *
 */
public class FailedDomainEventReminderServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {
	String domain = req.getParameter("domainname");
	try
	{
	    if (domain != null)
		EventReminder.getEventReminder(domain, null);
	    res.setContentType("text/html");

	}
	catch (Exception e)
	{
		System.out.println(ExceptionUtils.getFullStackTrace(e));
	    e.printStackTrace();
	}
    }
}
