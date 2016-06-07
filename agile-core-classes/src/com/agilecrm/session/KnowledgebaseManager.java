package com.agilecrm.session;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

public class KnowledgebaseManager
{
	/**
	 * Represents name of the session attribute
	 */
	public static final String AUTH_SESSION_COOKIE_NAME = "knowledgebaseuserinfo";

	// It has to be static and final for ThreadLocal to work properly
	public static final ThreadLocal<KnowledgebaseUserInfo> threadLocal = new ThreadLocal<KnowledgebaseUserInfo>();

	/**
	 * Sets {@link UserInfo} to threadlocal object
	 * 
	 * @param user
	 *            {@link UserInfo}
	 */
	public static void set(KnowledgebaseUserInfo user)
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
	public static KnowledgebaseUserInfo get()
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
		KnowledgebaseUserInfo userInfo = (KnowledgebaseUserInfo) request.getSession().getAttribute(AUTH_SESSION_COOKIE_NAME);
		
		if (userInfo == null)
			throw new ServletException("Request null");

		// If UserInfo is not null, then UserInfo is set to ThreadLocal
		set(userInfo);
	}

}
