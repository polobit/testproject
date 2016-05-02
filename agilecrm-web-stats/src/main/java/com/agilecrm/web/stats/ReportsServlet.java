package com.agilecrm.web.stats;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

@SuppressWarnings("serial")
public class ReportsServlet extends HttpServlet
{
	public static enum ACTIONS{
		VISITS_COUNT
	}

	public void doGet(HttpServletRequest request,HttpServletResponse response)throws IOException
	{
		doPost(request,response);
	}
	public void doPost(HttpServletRequest req, HttpServletResponse res)throws IOException
	{
		String domain = req.getParameter("domain");
		String action = req.getParameter("action");
		
		if(StringUtils.isNotBlank(domain)&&StringUtils.isNotBlank(action))
		{
			ACTIONS routeAction = ACTIONS.valueOf(action);
			switch(routeAction)
			{
			case VISITS_COUNT:
			if(StatsUtil.isValidRequest(req.getParameter("psd")))
				StatsSQLUtil.getVisitsCount(req, res, domain);
			break;
			default:
			break;			
			}
		}
	}
}
