package com.thirdparty.zoho;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;

import javax.ws.rs.core.UriBuilder;

import org.apache.commons.httpclient.HttpURL;
import org.apache.commons.httpclient.util.URIUtil;
import org.codehaus.jettison.json.JSONArray;

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
		String uri ="https://crm.zoho.com/crm/private/json/Contacts/getFields?authtoken="+token+"&scope=crmapi";
		try{
		URL url = new URL(uri);
		URLConnection con = url.openConnection();
		con.connect();
		con.getContentType();
		BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
		 String inputLine;
	        while ((inputLine = br.readLine()) != null) 
	            System.out.println(inputLine);
	        br.close();
		
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
		String token	= prefs.token;
		StringBuilder sb = new StringBuilder(SERVER_URL).append("Contacts/getMyRecords?")
							.append("authtoken=")
							 .append(token)
							 .append("&scope=crmapi");
		URLConnection con = getConnection(sb.toString());
		try
		{
			JSONArray data = new JSONArray();
			String inputLine ;
			BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
			while((inputLine = br.readLine())!=null){
				data.put(inputLine);
			}
			System.out.println(data);
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}		
		return true;
	}
	
	
	

}
