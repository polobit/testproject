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
import org.json.simple.parser.ParseException;

import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.Type;
import com.thirdparty.google.utl.ContactPrefsUtil;

public class ZohoUtils {
	public static ZohoAgileMapping zohoAgileMapper = new ZohoAgileMappingImpl();
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
	private static int MAX_INDEX = 10000;

	public static void main(String args[]) {
		String token = "fde7ef1e59431f837d73788056f18329".trim();
		String uri = "https://crm.zoho.com/crm/private/json/Contacts/getMyRecords?authtoken="
				+ token + "&scope=crmapi&selectColumns=Contacts(Email)";
		try {
			URL url = new URL(uri);
			URLConnection con = url.openConnection();
			con.connect();
			con.getContentType();
			BufferedReader br = new BufferedReader(new InputStreamReader(
					con.getInputStream()));
			JSONArray data = new JSONArray();

			String inputLine;
			while ((inputLine = br.readLine()) != null)
				data.put(inputLine);
			br.close();
			JSONObject jsonGeneralData = new JSONObject(data.get(0).toString());
			JSONObject res = jsonGeneralData.getJSONObject("response")
					.getJSONObject("result").getJSONObject("Contacts")
					.getJSONObject("row");
			System.out.println(res.toString());

			JSONArray arr = new JSONArray();
			arr.put(new JSONObject(new JSONObject(new JSONObject(res.get(
					"result").toString()).get("Contacts").toString())
					.get("row").toString()));
			JSONObject obj = arr.getJSONObject(0);
			JSONArray a = obj.getJSONArray("FL");
			System.out.println(new JSONObject(a.get(1).toString()).get(
					"content").toString());

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public static URLConnection getConnection(String url) {
		URLConnection con = null;
		try {
			URL uri = new URL(url);
			con = uri.openConnection();
			con.connect();

		} catch (Exception e) {
			e.printStackTrace();
		}
		return con;
	}




	public static boolean isValidContactPrefs(ContactPrefs prefs)
			throws Exception {
		boolean flag = false;
		String token = prefs.token;
		StringBuilder sb = new StringBuilder(SERVER_URL)
				.append("Users/getUsers?").append("authtoken=")
				.append(token).append("&type=AdminUsers")
				.append("&scope=crmapi&selectColumns=Contacts(Email)");
		URLConnection con = getConnection(sb.toString());
		try {
			JSONArray data = new JSONArray();
			String inputLine;
			BufferedReader br = new BufferedReader(new InputStreamReader(
					con.getInputStream()));
			while ((inputLine = br.readLine()) != null)
				data.put(inputLine);
			try {

				JSONObject jsonGeneralData = new JSONObject(data.get(0)
						.toString());

				JSONObject res = new JSONObject(jsonGeneralData.getString("users").toString());
				JSONArray arr = new JSONArray(res.get("user").toString());
				JSONObject obj = arr.getJSONObject(0);
				if(obj.has("email"))
				if (obj.getString("email").equalsIgnoreCase(prefs.userName))
					flag = true;
			} catch (JSONException e) {
				e.printStackTrace();
			}

		} catch (IOException e) {
			e.printStackTrace();
		}
		return flag;
	}

	public static String getZohoLeads(ContactPrefs ctx,int i,String time) {

		JSONArray data = new JSONArray();
			try {
				String url = buildUrl("Leads", ctx, i, i+200,time);
				System.out.println(url);
					URLConnection con = getConnection(url);
					BufferedReader result = new BufferedReader(
							new InputStreamReader(con.getInputStream()));
					String line;
					while ((line = result.readLine()) != null) {
						data.put(new JSONParser().parse(line));
					}

			} catch (Exception e) {
				e.printStackTrace();
		}
		return data.toString();
	}

	public static String getAccounts(ContactPrefs ctx,int index,String time) {
		JSONArray data = new JSONArray();

			String url = buildUrl("Accounts", ctx, index, index+200,time);
			System.out.println(url);
			try {
					URLConnection con = getConnection(url);
					BufferedReader br = new BufferedReader(
							new InputStreamReader(con.getInputStream()));
					String line;
					while ((line = br.readLine()) != null) {
						data.put(new JSONParser().parse(line));
					}
			} catch (Exception e) {
				e.printStackTrace();
			}
		return data.toString();
	}

	public static String getCases(ContactPrefs ctx) {
		JSONArray data = new JSONArray();
		/*
		 * String url = buildUrl("Cases", ctx); System.out.println(url);
		 * URLConnection con = getConnection(url); try{ BufferedReader br = new
		 * BufferedReader(new InputStreamReader(con.getInputStream())); String
		 * line; while((line = br.readLine())!= null){ data.put(new
		 * JSONParser().parse(line)); } }catch(Exception e){
		 * e.printStackTrace(); } System.out.println(data);
		 */
		return data.toString();
	}

	public static String getEvents(ContactPrefs ctx,String time) {

		JSONArray data = new JSONArray();
		for (int index = 1; index < MAX_INDEX;) {

			String url = buildUrl("Events", ctx, index, index+200,time);
			System.out.println(url);
			URLConnection con = getConnection(url);
			try {
				BufferedReader br = new BufferedReader(new InputStreamReader(
						con.getInputStream()));
				String line;
				while ((line = br.readLine()) != null) {
					data.put(new JSONParser().parse(line));
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			index = index + 200;
		}
		return data.toString();
	}

	public static String getTask(ContactPrefs ctx) {

		/*
		 * JSONArray data = new JSONArray(); for(int fromIndex=1;fromIndex <
		 * MAX_INDEX;) String url = buildUrl("Task", ctx,fromIndex,200);
		 * URLConnection con = getConnection(url); try{ BufferedReader br = new
		 * BufferedReader(new InputStreamReader(con.getInputStream())); String
		 * line; while((line = br.readLine())!= null){ data.put(new
		 * JSONParser().parse(line)); } }catch(Exception e){
		 * e.printStackTrace(); } fromIndex = fromIndex+200; } return
		 * data.toString();
		 */
		return null;
	}

	public static String getContacts(ContactPrefs ctx,int index,String time) {

		JSONArray data = new JSONArray();
		
			String url = buildUrl("Contacts", ctx, index, index+200,time);
			try {
					URLConnection con = getConnection(url);
					BufferedReader br = new BufferedReader(
							new InputStreamReader(con.getInputStream()));
					String line;
					while ((line = br.readLine()) != null) {
						data.put(new JSONParser().parse(line));
					}
			} catch (Exception e) {
				e.printStackTrace();
		}
		return data.toString();
	}

	public static String buildUrl(String module, ContactPrefs ctx,
			int fromIndex, int toIndex,String time) {
		StringBuilder url = new StringBuilder(SERVER_URL)
				.append(module + "/getRecords?")
				.append("authtoken=" + ctx.token)
				.append("&fromIndex=" + fromIndex + "&toIndex=" + toIndex)
				.append("&scope=crmapi")
		         .append("&lastModifiedTime="+time);

		return url.toString();
	}

	public static boolean hasMore(String url) throws JSONException {

		String record;
		JSONArray response = new JSONArray();
		try {
			URLConnection con = getConnection(url);
			BufferedReader reader = new BufferedReader(new InputStreamReader(
					con.getInputStream()));
			while ((record = reader.readLine()) != null) {
				try {
					response.put(new JSONParser().parse(record));
					String res = response.get(0).toString();
					JSONObject result = new JSONObject(new JSONObject(res).get(
							"response").toString());
					if (result.has("result"))
						return true;
					if (result.has("error") || result.has("nodata"))
						return false;

				} catch (ParseException e) {
					e.printStackTrace();
				}

			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;

	}
	


}
