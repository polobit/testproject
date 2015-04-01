package com.agilecrm.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.account.APIKey;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;

public class PHPAPIFilter implements Filter

{
    @Override
    public void destroy()
    {
	// TODO Auto-generated method stub

    }

    public void doFilter(final ServletRequest request, final ServletResponse response,
	    final javax.servlet.FilterChain chain) throws ServletException, IOException
    {
	System.out.println("hitting phpapi filter");
	final HttpServletRequest req = (HttpServletRequest) request;
	final HttpServletResponse res = (HttpServletResponse) response;

	String agileId = req.getParameter("id");
	if (agileId != null)
	{
	    if (APIKey.isPresent(agileId))
	    {
		UserInfo userInfo = (UserInfo) req.getSession().getAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);
		DomainUser domainUser = APIKey.getDomainUserRelatedToAPIKey(agileId);
		if (userInfo == null || !userInfo.getEmail().equalsIgnoreCase(domainUser.email))
		{
		    userInfo = new UserInfo("agilecrm.com/php", domainUser.email, domainUser.name);
		    req.getSession().setAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);
		}

		SessionManager.set(userInfo);
		chain.doFilter(req, res);
		return;

	    }
	}
	res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException
    {
	// TODO Auto-generated method stub

    }

}
