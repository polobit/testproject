package com.agilecrm.session;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

// We store Sessions in Session Manager
public class SessionManager
{
    public static final String AUTH_SESSION_COOKIE_NAME = "userinfo";

    // It has to be static and final for ThreadLocal to work properly
    public static final ThreadLocal<UserInfo> threadLocal = new ThreadLocal<UserInfo>();

    public static void set(UserInfo user)
    {
	threadLocal.set(user);
    }

    public static void unset()
    {
	threadLocal.remove();
    }

    public static UserInfo get()
    {
	return threadLocal.get();
    }

    public static void set(HttpServletRequest request) throws ServletException
    {

	UserInfo userInfo = (UserInfo) request.getSession().getAttribute(
		AUTH_SESSION_COOKIE_NAME);
	if (userInfo == null)
	    throw new ServletException("Request null");

	set(userInfo);
    }
}