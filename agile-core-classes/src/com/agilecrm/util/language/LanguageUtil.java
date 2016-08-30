package com.agilecrm.util.language;

import java.util.ArrayList;

import javax.servlet.ServletContext;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.user.UserPrefs;
import com.agilecrm.util.FileStreamUtil;

public class LanguageUtil {

	// Root folder path
	public static final String NON_APPLICATION_ROOT_PATH = "locales/locales/";

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
			String str = FileStreamUtil.readResource(application.getRealPath("/") + "/" + NON_APPLICATION_ROOT_PATH
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
	public static boolean isLanguageSupportByAgile(String language) {

		ArrayList<String> supporttedLangauges = new ArrayList<String>();
		supporttedLangauges.add("en");
		supporttedLangauges.add("es");

		if (StringUtils.isBlank(language) || !supporttedLangauges.contains(language))
			return false;

		return true;
	}

}
