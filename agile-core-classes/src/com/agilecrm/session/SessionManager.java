package com.agilecrm.session;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

/**
 * <code>SessionManager</code> stores the session, Sets the informations of user
 * as {@link UserInfo} representations in to a ThreadLocal variable, which is
 * retrieved to get the informations of the current user.
 * <p>
 * This class includes the methods to get {@link UserInfo}, set {@link UserInfo}
 * from {@link HttpServletRequest}
 * </p>
 * 
 * 
 */
public class SessionManager
{
    /**
     * Represents name of the session attribute
     */
    public static final String AUTH_SESSION_COOKIE_NAME = "userinfo";

    // It has to be static and final for ThreadLocal to work properly
    public static final ThreadLocal<UserInfo> threadLocal = new ThreadLocal<UserInfo>();

    /**
     * Sets {@link UserInfo} to threadloacl object
     * 
     * @param user
     *            {@link UserInfo}
     */
    public static void set(UserInfo user)
    {
	threadLocal.set(user);
    }

    /**
     * Removes value from the {@link ThreadLocal} variable
     */
    public static void unset()
    {
	threadLocal.remove();
    }

    /**
     * Gets the {@link UserInfo} from the current {@link ThreadLocal} object
     * 
     * @return
     */
    public static UserInfo get()
    {
	return threadLocal.get();
    }

    /**
     * Sets UserInfo from request in to {@link SessionManager}'s
     * {@link ThreadLocal}. {@link UserInfo} is fetched from session cookie
     * which is set during login, registration
     * 
     * @param request
     * @throws ServletException
     */
    public static void set(HttpServletRequest request) throws ServletException
    {
	// Fetch UserInfo from the session attribute
	UserInfo userInfo = (UserInfo) request.getSession().getAttribute(
		AUTH_SESSION_COOKIE_NAME);
	if (userInfo == null)
	    throw new ServletException("Request null");

	// If UserInfo is not null, then UserInfo is set to ThreadLocal
	set(userInfo);
    }
}