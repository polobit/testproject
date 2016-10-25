package com.agilecrm.core.api.customthemes;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.customtheme.util.CustomThemesUtil;
import com.agilecrm.customthemes.CustomTheme;

@Path("/api/themes")
public class CustomThemesAPI {
	
	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public CustomTheme createCustomTheme(String themeData) throws JSONException{
		
		System.out.println("COMING!!!!!!!!!!!"+themeData);
		JSONObject themeJson = new JSONObject(themeData);
	    String name = themeJson.getString("name");
	    String css = themeJson.getString("themecss");
	    CustomTheme ct=new CustomTheme(name,css);
	    ct.saveTheme();
	    return ct;
	    
	}
	
	@Path("/getCustomThemeByName")
	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public CustomTheme getCustomThemeByName(String themeName) throws JSONException{
		
		System.out.println("THEMENAME COMING::::"+themeName);
		CustomTheme ct1=CustomThemesUtil.fetchThmsByProperty("name",themeName);
		System.out.println("OUTPUT OF getCustomThemeByName::::::"+ct1);
		return ct1;
	    
	}
	
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<CustomTheme> fetchAllCustomThemes(){
		
		System.out.println("fetchAllCustomThemes():::"+CustomThemesUtil.fetchAllCustomThemes());
		return CustomThemesUtil.fetchAllCustomThemes();
	}
	
	@Path("/deleteTheme")
	@GET
	@Produces({ MediaType.APPLICATION_JSON})
	public boolean deleteCustomTheme(@QueryParam("themeName") String themeName) throws JSONException{
	
		return CustomThemesUtil.deleteCustomThemeByName("name",themeName);
	 }
	
	@Path("/updateTheme")
	@POST
	@Produces({ MediaType.APPLICATION_JSON})
	public CustomTheme updateCustomTheme(String themeData) throws JSONException{
		
		System.out.println("Start of updateCustomTheme()");
		JSONObject themeJson = new JSONObject(themeData);
		String id = themeJson.getString("id");
		String css = themeJson.getString("themecss");
		
		CustomTheme ct = CustomThemesUtil.fetchThmsByKey(id);
		if(ct!=null){
			ct.setThemeCss(css);
		    ct.saveTheme();
	    }
		System.out.println("End of updateCustomTheme()");
		return ct;
		
	}
	
	@Path("/saveThemeOnlyWithName")
	@POST
	@Produces({ MediaType.APPLICATION_JSON})
	public CustomTheme saveCustomTheme(String themeName) throws JSONException{
		
		CustomTheme ct=new CustomTheme();
		ct.setName(themeName);
	    ct.saveTheme();
	    return ct;
	    
	}
	
}
