package com.agilecrm.util.language;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.CookieUtil;
import com.agilecrm.util.FileStreamUtil;
import com.google.appengine.api.NamespaceManager;

public class LanguageUtil {

	// Root folder path
	public static final String NON_APPLICATION_ROOT_PATH = "locales/locales/";
	
	public static final LinkedHashMap<String, String> SUPPORTED_LANGUAGES = new LinkedHashMap<String, String>() {
		{
			put("en", "English");
			put("es", "Español");
			put("it", "Italiano");
			put("ru", "русский");
			put("fr", "Français");
			
		}
	};
	public static JSONObject getLocaleJSON(UserPrefs prefs, ServletContext application, String serviceName) {

		String language = UserPrefs.DEFAULT_LANGUAGE;
		if (prefs != null)
			language = prefs.language;

		return getLocaleJSON(language, application, serviceName);
	}

	// Get Locale JSON from language
	public static JSONObject getLocaleJSON(String language, ServletContext application, String serviceName) {

		if (StringUtils.isBlank(language))
			language = UserPrefs.DEFAULT_LANGUAGE;

		System.out.println("language = " + language);

		try {
			JSONObject localesJSON = new JSONObject();
			String str = FileStreamUtil.readResource(NON_APPLICATION_ROOT_PATH
					+ language + "/" + serviceName + ".json");
			str = str.replace("var _Agile_Resources_Json =", "").trim();

			System.out.println(str);

			localesJSON = new JSONObject(str);

			System.out.println("localesJSON = " + localesJSON);

			return localesJSON;
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

	/**
	 * 
	 * @param localeJSON
	 * @param key
	 * @return
	 */
	public static String getLocaleJSONValue(JSONObject localeJSON, String key) {

		if (localeJSON == null || !localeJSON.has(key))
			return "";
		try {
			return localeJSON.getString(key);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "";
	}

	/**
	 * 
	 * @param language
	 * @return
	 */
	public static String getSupportedlanguageFromKey(String language) {

		if (StringUtils.isBlank(language) || !SUPPORTED_LANGUAGES.containsKey(language))
			return SUPPORTED_LANGUAGES.get(UserPrefs.DEFAULT_LANGUAGE);

		return SUPPORTED_LANGUAGES.get(language);
	}

	/**
	 * 
	 * @param language
	 * @return
	 */
	public static Map<String, String> getSupportedlanguages() {
		return SUPPORTED_LANGUAGES;
	}

	/**
	 * 
	 * @param language
	 * @return
	 */
	public static boolean isSupportedlanguageFromKey(String language) {

		if (StringUtils.isBlank(language) || !SUPPORTED_LANGUAGES.containsKey(language))
			return false;

		return true;
	}
	
	/**
	 * 
	 * @param request
	 * @return
	 */
	public static String getSupportedLocale(HttpServletRequest request) {
		Enumeration locales = request.getLocales();
		while (locales.hasMoreElements()) {
			Locale locale = (Locale) locales.nextElement();
			System.out.println("locale.getLanguage() = " + locale.getLanguage());
			if(SUPPORTED_LANGUAGES.containsKey(locale.getLanguage()))
				  return locale.getLanguage();
		}
		
		return UserPrefs.DEFAULT_LANGUAGE;
	}

	/**
	 * 
	 * @param request
	 * @return
	 */
	public static String getLanguageKeyFromCookie(HttpServletRequest request) {
		String _LANGUAGE = CookieUtil.readCookieValue(request, "user_lang");
		if(StringUtils.isBlank(_LANGUAGE))
			_LANGUAGE = UserPrefs.DEFAULT_LANGUAGE;
		
		return _LANGUAGE;
	}
	
	/**
	 * Gets the User's defined language from Session Scope
	 * @return
	 */
	public static String getUserLanguageFromSession() {
		UserInfo info = SessionManager.get();
		if(info == null)
			return UserPrefs.DEFAULT_LANGUAGE;
		
		AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(info.getDomainId());
		return getAgileUserLanguage(agileUser);
	}
	
	static String getAgileUserLanguage(AgileUser agileUser){
		if(agileUser == null)
			return UserPrefs.DEFAULT_LANGUAGE;
		
		UserPrefs prefs = UserPrefsUtil.getUserPrefs(agileUser);
		if(prefs == null)
			return UserPrefs.DEFAULT_LANGUAGE;
		
		return prefs.language;
	}
	
	/**
	 * Gets the User's defined language from Email
	 * @return
	 */
	public static String getUserLanguageFromEmail(String email) {
		if(StringUtils.isBlank(email))
			return UserPrefs.DEFAULT_LANGUAGE;
		
		DomainUser user = DomainUserUtil.getDomainUserFromEmail(email);
		if(user == null)
			return UserPrefs.DEFAULT_LANGUAGE;
		
		String oldNamespace = NamespaceManager.get();
		
		try {
			NamespaceManager.set(user.domain);
			
			AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(user.id);
			return getAgileUserLanguage(agileUser);
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		} finally {
			NamespaceManager.set(oldNamespace);
		}
		
		return UserPrefs.DEFAULT_LANGUAGE;
	}
	
	/**
	 * Gets the User's defined language from Email
	 * @return
	 */
	public static String getUserLanguageFromDomainUser(DomainUser user) {
		
		// Get user prefs language
	    String language = UserPrefs.DEFAULT_LANGUAGE;
	    if(user != null)
	    	language = LanguageUtil.getUserLanguageFromEmail(user.email);
	    
	    return language;
	}
}
