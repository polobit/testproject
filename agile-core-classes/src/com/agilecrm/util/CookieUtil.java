package com.agilecrm.util;

import java.net.URLDecoder;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class CookieUtil {

	// Read Cookie from request
	public static String readCookieValue(HttpServletRequest request, String cookieName) {

		// Get Cookies
		Cookie cookies[] = request.getCookies();
		if (cookies == null)
			return null;

		// Iterate all through cookies
		for (int i = 0; i < cookies.length; i++) {
			String name = cookies[i].getName();
			try {
				name = URLDecoder.decode(name, "UTF-8");
			} catch (Exception e) {
				// TODO: handle exception
			}

			if (name.equalsIgnoreCase(cookieName)) {
				return cookies[i].getValue();
			}
		}

		return null;

	}

	/**
	 * 
	 * @param domain
	 * @param cookieName
	 * @param cookieValue
	 * @param response
	 * @return
	 */
	public static String createCookieWithDomain(String domain, String cookieName, String cookieValue,
			HttpServletResponse response) {

		Cookie cookie = new Cookie(cookieName, cookieValue);
		cookie.setPath("/");
		if (StringUtils.isNotBlank(domain))
			cookie.setDomain(domain);

		response.addCookie(cookie);
		return cookieName;
	}
}
