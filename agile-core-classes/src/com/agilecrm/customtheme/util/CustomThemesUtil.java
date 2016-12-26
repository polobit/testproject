package com.agilecrm.customtheme.util;

import java.util.List;

import org.mortbay.util.ajax.JSON;

import com.agilecrm.customthemes.CustomTheme;
import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.appengine.labs.repackaged.org.json.JSONArray;
import com.google.appengine.repackaged.com.google.gson.Gson;
import com.googlecode.objectify.Key;


public class CustomThemesUtil {

	private static ObjectifyGenericDao<CustomTheme> dao = new ObjectifyGenericDao<CustomTheme>(CustomTheme.class);
	
	public static boolean fetchCustomThemesByProperty(String themename){
		
		 if(dao.getByProperty("name",themename)!=null){
			 return true;
		}
		return false;
		
	}
	public static CustomTheme fetchThmsByProperty(String propertyName,String propertyVal){
		CustomTheme ct=dao.getByProperty(propertyName,propertyVal);
		return ct;
	}
	public static CustomTheme fetchThmsByKey(String key){
		CustomTheme ct = null;;
		try {
			ct = dao.get(Long.parseLong(key));
		} catch (EntityNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ct;
	}
	public static List<CustomTheme> fetchAllCustomThemes(){
		
		List<CustomTheme> custThemelist=dao.fetchAll();
		return custThemelist;
		
	}
	
	public static boolean deleteCustomThemeByName(String propertyName,String propertyVal){
		CustomTheme ct1=fetchThmsByProperty(propertyName,propertyVal);
		   System.out.println("OUTPUT OF deleteCustomTheme before deletion::::::"+ct1);
		   if(ct1!=null){
			   ct1.deleteTheme();   
			   CustomTheme ct2=fetchThmsByProperty(propertyName,propertyVal);
			   System.out.println("OUTPUT OF deleteCustomTheme after deletion::::::"+ct2);
			   if(ct2==null){
				   return true;
			   }
		   }
		   
		   return false;
	}
	
	
}
