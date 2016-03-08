package com.agilecrm.core.api.widgets;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class UservoiceAPI {

	private static final String USER_AGENT = "Mozilla/5.0";
	private String subDomain;
	private String accessToken;
	private HashMap<String, String> suggestions;

	// App Test Keys.
	private String API_KEY;
	private String API_SECRET;

	UservoiceAPI(String subDomain, String api_key, String api_secert) {
		this.subDomain = subDomain;
		this.API_KEY = api_key;
		this.API_SECRET = api_secert;
		loadAccessToken();
		loadSuggestions();
	}

	private void loadAccessToken() {
		String result = null;
		String url = "https://" + subDomain
				+ ".uservoice.com/api/v2/oauth/token";
		String parameters = "client_id=" + API_KEY + "&client_secret="
				+ API_SECRET + "&grant_type=client_credentials";
		JSONObject resultObj = postData(url, parameters);

		if (resultObj != null && !resultObj.has("error")) {
			try {
				result = resultObj.getString("access_token");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		accessToken = result;
	}

	private void loadSuggestions() {
		String url = "https://" + subDomain
				+ ".uservoice.com/api/v2/admin/suggestions";
		JSONObject resultObj = getData(url);
		if (resultObj != null && resultObj != null) {
			try {
				suggestions = new HashMap<String, String>();
				JSONArray suggestionsArray = resultObj
						.getJSONArray("suggestions");
				for (int i = 0; i < suggestionsArray.length(); i++) {
					JSONObject object = suggestionsArray.getJSONObject(i);
					suggestions.put(object.getString("id"),
							object.getString("title"));
				}
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	public JSONObject getUserInfo(String email) {
		String url = "https://" + subDomain
				+ ".uservoice.com/api/v2/admin/users?per_page=1&email_address="
				+ email;
		JSONObject resultObj = getData(url);
		if (resultObj != null) {
			try {
				JSONArray usersArray = resultObj.getJSONArray("users");
				resultObj = usersArray.getJSONObject(0);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return resultObj;
	}

	public JSONObject postData(String url, String parameters) {
		JSONObject resultObj = null;

		try {

			URL obj = new URL(url);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			con.setRequestMethod("POST");
			con.setRequestProperty("User-Agent", USER_AGENT);
			con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

			// Send post request
			con.setDoOutput(true);
			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(parameters);
			wr.flush();
			wr.close();

			int responseCode = con.getResponseCode();
			BufferedReader in = new BufferedReader(new InputStreamReader(
					con.getInputStream()));
			String inputLine;

			StringBuffer response = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}

			in.close();

			resultObj = new JSONObject(response.toString());

		} catch (java.io.FileNotFoundException e) {
			System.out.println("Error while getting Data");
		} catch (IOException | JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			System.out.println(e);
			System.out.println("Error in post");
		}

		return resultObj;
	}

	public JSONObject getData(String url) {
		JSONObject resultObj = null;
		try {
			URL obj = new URL(url);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();

			// optional default is GET
			con.setRequestMethod("GET");

			// add request header
			con.setRequestProperty("User-Agent", USER_AGENT);
			con.setRequestProperty("Authorization", "Bearer  " + accessToken);

			int responseCode = con.getResponseCode();
			BufferedReader in = new BufferedReader(new InputStreamReader(
					con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
			System.out.println(response.toString());
			resultObj = new JSONObject(response.toString());
		} catch (IOException | JSONException e) {
			System.out
					.println("IO / Json error occured while accessing the resource");
		} catch (Exception e) {
			System.out.println("Error occured while accessing the resource");
		}
		return resultObj;
	}

	public JSONObject getComments(String email) {
		String url = "https://"
				+ subDomain
				+ ".uservoice.com/api/v2/admin/comments?page=1&per_page=100&includes="
				+ email;
		JSONObject resultObj = new JSONObject(getData(url));
		if(resultObj != null)
		System.out.println(resultObj.toString());
		return resultObj;
	}

//	public static void main(String args[]) {
//		String email = "premtammina22@gmail.com";
//		String API_KEY = "Od0Vo5spH4BeFOwotefuw";
//		String API_SECRET = "Sv7Wib2alD1K2Ih4Ns9ytgFp33ERTmFedlr6k9pA";
//
//		UservoiceAPI uv = new UservoiceAPI("masala124", API_KEY, API_SECRET);
//		JSONObject userInfo = uv.getUserInfo(email);
//		System.out.println(userInfo);
//		System.out.println(uv.getComments(email));
//	}
}
