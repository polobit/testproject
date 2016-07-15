package com.agilecrm.util.language;

import javax.servlet.ServletContext;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.user.UserPrefs;
import com.agilecrm.util.FileStreamUtil;

public class LanguageUtil {

	public static JSONObject getLocaleJSON(UserPrefs prefs,
			ServletContext application) {
		String language = prefs.language;
		if(StringUtils.isBlank(language))
			language = UserPrefs.DEFAULT_LANGUAGE;
		
		System.out.println("language = " + language);

		try {
			JSONObject localesJSON = new JSONObject();
			String str = FileStreamUtil.readResource(application
					.getRealPath("/")
					+ "/"
					+ "locales/" + language + "/"
					+ language
					+ ".json");
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
	
	public static String getLocaleJSONValue(JSONObject localeJSON, String key){
		
		if(localeJSON == null || !localeJSON.has(key))
			  return "";
		try {
			return localeJSON.getString(key);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return "";
	}
	
}
