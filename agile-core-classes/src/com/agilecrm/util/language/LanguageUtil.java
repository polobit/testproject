package com.agilecrm.util.language;

import java.util.ArrayList;

import javax.servlet.ServletContext;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.user.UserPrefs;
import com.agilecrm.util.FileStreamUtil;

public class LanguageUtil {

	/**
	 * 
	 * @param prefs
	 * @param application
	 * @return
	 */
	public static JSONObject getLocaleJSON(UserPrefs prefs, ServletContext application) {
		String language = prefs.language;
		if (StringUtils.isBlank(language))
			language = UserPrefs.DEFAULT_LANGUAGE;

		System.out.println("language = " + language);

		try {
			JSONObject localesJSON = new JSONObject();
			String str = FileStreamUtil
					.readResource(application.getRealPath("/") + "/" + "locales/menu/" + language + ".json");
			str = str.replace("var _Agile_Resources_Json =", "").trim();

			System.out.println(str);

			JSONObject json = new JSONObject(str);
			localesJSON = json.getJSONObject("menu");

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
