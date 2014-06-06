package com.thirdparty.zoho;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.json.simple.parser.JSONParser;

import com.thirdparty.google.ContactPrefs;


public class ZohoUtils
{
	
	/**
	 * Holds authentication token of agent's zoho account
	 */
	public String authToken = null;

	/**
	 * Holds URL of the Zoho server
	 */
	public static final String SERVER_URL = "https://crm.zoho.com/crm/private/json/";

	/**
	 * Holds data to be posted through URL
	 */
	public static final String zoho_data = "?newFormat=1&authtoken=$authenticationToken&scope=crmapi";

	/**
	 * Initializes {@link ZohoAPI} with the given authentication token which
	 * thereby creates a connection to the Zoho CRM.
	 * 
	 * @param authToken
	 * @throws Exception
	 *             if authentication token is null
	 */
	
	public static void main(String args[]){
		String token ="fde7ef1e59431f837d73788056f18329".trim();
		String uri ="https://crm.zoho.com/crm/private/json/Contacts/getMyRecords?authtoken="+token+"&scope=crmapi&selectColumns=Contacts(Email)";
		try{
		URL url = new URL(uri);
		URLConnection con = url.openConnection();
		con.connect();
		con.getContentType();
		BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
		JSONArray data = new JSONArray();

		
		 String inputLine;
	        while ((inputLine = br.readLine()) != null) 
	        	data.put(inputLine);
	        br.close();
	        JSONObject jsonGeneralData = new JSONObject(data.get(0).toString());
	        JSONObject res = jsonGeneralData.getJSONObject("response").getJSONObject("result").getJSONObject("Contacts")
	        		         .getJSONObject("row");
	        System.out.println(res.toString());
	        
	        
	        JSONArray arr = new JSONArray();
	        arr.put(new JSONObject(new JSONObject(
	        		           new JSONObject(res.get("result").toString())
	          		           .get("Contacts").toString()).get("row").toString()));
		 JSONObject obj = arr.getJSONObject(0);
		 JSONArray a = obj.getJSONArray("FL");
		 System.out.println(new JSONObject(a.get(1).toString()).get("content").toString());
	        
		}catch(Exception e){
			e.printStackTrace();
		}
		
	}
	
	public static URLConnection getConnection(String url){
		URLConnection con = null;
		try
		{
			URL uri = new URL(url);
			 con = uri.openConnection();
			con.connect();
			
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
         return con;
	}
	
	public boolean isAuthenticated(String username,String password){
		return false;
	}
	
/*	public JSONArray getContacts(String token){
		JSONArray data = new JSONArray();
		String inputLine ;
		try
		{
			BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
			while((inputLine = br.readLine())!=null){
				data.put(inputLine);
			}
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		return data;
	}*/
	
	public static boolean isValidContactPrefs(ContactPrefs prefs){
		boolean flag = false;
		String token	= prefs.token;
		StringBuilder sb = new StringBuilder(SERVER_URL).append("Contacts/getMyRecords?")
							.append("authtoken=")
							.append(token)
							.append("&scope=crmapi&selectColumns=Contacts(Email)");
		URLConnection con = getConnection(sb.toString());
		try
		{
			JSONArray data = new JSONArray();
			String inputLine ;
			BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
			while((inputLine = br.readLine())!=null)
				 data.put(inputLine);
			try
			{
			
	        JSONObject jsonGeneralData = new JSONObject(data.get(0).toString());
	        
	        JSONObject res = new JSONObject(jsonGeneralData.getString("response"));
	        JSONArray arr = new JSONArray();
	        arr.put(new JSONObject(new JSONObject(
	        		           new JSONObject(res.get("result").toString())
	          		           .get("Contacts").toString()).get("row").toString()));
		     JSONObject obj = arr.getJSONObject(0);
		     JSONArray a = obj.getJSONArray("FL");
		 	String email = new JSONObject(a.get(1).toString()).get("content").toString();
		 	if(email.equalsIgnoreCase(prefs.userName))
		 		flag = true;
		}
		catch (JSONException e)
		{
			e.printStackTrace();
		}
			  
		}catch (IOException e)
		{
			e.printStackTrace();
		}	
		return flag;
	}
	
	public static String getZohoLeads(ContactPrefs ctx){
		String url = buildUrl("Leads", ctx);
		System.out.println(url);
		URLConnection con = getConnection(url);
		JSONArray data = new JSONArray();
		try{
		BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String line;
		while((line = br.readLine())!= null){
			data.put(new JSONParser().parse(line));
		}
		}catch(Exception  e){
			e.printStackTrace();
		}
		System.out.println(data);
		return data.toString();
	}
	
	public static String getAccounts(ContactPrefs ctx){
		String url = buildUrl("Accounts", ctx);
		System.out.println(url);
		URLConnection con = getConnection(url);
		JSONArray data = new JSONArray();
		try{
		BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String line;
		while((line = br.readLine())!= null){
			data.put(new JSONParser().parse(line));
		}
		}catch(Exception  e){
			e.printStackTrace();
		}
		System.out.println(data);
		return data.toString();
	}
	
	
	public static String getCases(ContactPrefs ctx){
		String url = buildUrl("Cases", ctx);
		System.out.println(url);
		URLConnection con = getConnection(url);
		JSONArray data = new JSONArray();
		try{
		BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String line;
		while((line = br.readLine())!= null){
			data.put(new JSONParser().parse(line));
		}
		}catch(Exception  e){
			e.printStackTrace();
		}
		System.out.println(data);
		return data.toString();
	}
	
	public static String getEvents(ContactPrefs ctx){
		String url = buildUrl("Events", ctx);
		System.out.println(url);
		URLConnection con = getConnection(url);
		JSONArray data = new JSONArray();
		try{
		BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String line;
		while((line = br.readLine())!= null){
			data.put(new JSONParser().parse(line));
		}
		}catch(Exception  e){
			e.printStackTrace();
		}
		System.out.println(data);
		return data.toString();
	}
	
	public static String getTask(ContactPrefs ctx){
		String url = buildUrl("Task", ctx);
		System.out.println(url);
		URLConnection con = getConnection(url);
		JSONArray data = new JSONArray();
		try{
		BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String line;
		while((line = br.readLine())!= null){
			data.put(new JSONParser().parse(line));
		}
		}catch(Exception  e){
			e.printStackTrace();
		}
		System.out.println(data);
		return data.toString();
	}
	
	public static String getContacts(ContactPrefs ctx){
		String url = buildUrl("Contacts", ctx);
		System.out.println(url);
		URLConnection con = getConnection(url);
		JSONArray data = new JSONArray();
		try{
		BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String line;
		while((line = br.readLine())!= null){
			data.put(new JSONParser().parse(line));
		}
		}catch(Exception  e){
			e.printStackTrace();
		}
		System.out.println(data);
		return data.toString();
	}
	
	
	
	
	
	private static String buildUrl(String module,ContactPrefs ctx){
		StringBuilder url = new StringBuilder(SERVER_URL)
		                    .append(module+"/getRecords?")
		                    .append("authtoken="+ctx.token)
		                    .append("&scope=crmapi");
		return url.toString();
	}
	
	
	

}
