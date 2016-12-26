package com.agilecrm.util;

import javax.servlet.http.HttpServletRequest;

import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;

public class HomeUtil {

	public static String getNewThemeClasses(HttpServletRequest request, DomainUser domainUser,
			UserPrefs currentUserPrefs) {

		if (MobileUADetector.isMobile(request) || !currentUserPrefs.theme.equalsIgnoreCase("15"))
			return "";

		return "agile-theme-15 agile-theme-" + domainUser.role.toString();
	}

	public static boolean isDisabeld(HttpServletRequest request, UserPrefs currentUserPrefs) {

		if (MobileUADetector.isMobile(request) || !currentUserPrefs.theme.equalsIgnoreCase("15"))
			return true;

		return false;
	}

}
