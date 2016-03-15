package com.agilecrm.core.api.widgets;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class UservoiceAPI {

	private static final String USER_AGENT = "Mozilla/5.0";
	private String subDomain;
	private String accessToken;
	JSONObject suggestionsObject;

	// App Test Keys.
	private String API_KEY;
	private String API_SECRET;

	UservoiceAPI(String subDomain, String api_key, String api_secert)
			throws Exception {
		this.subDomain = subDomain;
		this.API_KEY = api_key;
		this.API_SECRET = api_secert;
		loadAccessToken();
		loadSuggestions();
	}

	private void loadAccessToken() throws Exception {
		String result = null;
		String url = "https://" + subDomain
				+ ".uservoice.com/api/v2/oauth/token";
		String parameters = "client_id=" + API_KEY + "&client_secret="
				+ API_SECRET + "&grant_type=client_credentials";
		JSONObject resultObj = postData(url, parameters);

		if (resultObj != null && !resultObj.has("error")) {
			result = resultObj.getString("access_token");
		}
		accessToken = result;
	}

	private void loadSuggestions() throws Exception {
		String url = "https://" + subDomain
				+ ".uservoice.com/api/v2/admin/suggestions";
		JSONObject resultObj = getData(url, null);
		if (resultObj != null && resultObj != null) {
			suggestionsObject = new JSONObject();
			JSONArray suggestionsArray = resultObj.getJSONArray("suggestions");
			for (int i = 0; i < suggestionsArray.length(); i++) {
				JSONObject object = suggestionsArray.getJSONObject(i);
				suggestionsObject.put(object.getString("id"),
						object.getString("title"));
			}
		}
	}

	public JSONObject getUserInfo(String email) throws Exception {
		String url = "https://" + subDomain
				+ ".uservoice.com/api/v2/admin/users";
		String parameters = "per_page=1&email_address=" + email;
		JSONObject resultObj = getData(url, parameters);
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

	public JSONObject getuserComments(String userId) throws Exception {
		String url = "https://" + subDomain + ".uservoice.com/api/v1/users/"
				+ userId + "/comments.json";
		String parameters = "client=" + API_KEY;
		JSONObject resultObj = getData(url, parameters);
		return resultObj;
	}

	public JSONObject postData(String url, String parameters) throws Exception {
		JSONObject resultObj = null;

		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("POST");
		con.setRequestProperty("User-Agent", USER_AGENT);
		con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

		// Send post request
		con.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		if (parameters != null) {
			wr.writeBytes(parameters);
		}
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

		return resultObj;
	}

	public JSONObject getData(String url, String parameters) throws Exception {
		JSONObject resultObj = null;
		if (parameters != null) {
			url += "?" + parameters;
		}

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
		return resultObj;
	}

	public static void main(String args[]) {
		 String email = "premtammina22@gmail.com";
		 String domain = "masala124";
		 String API_KEY = "Od0Vo5spH4BeFOwotefuw";
		 String API_SECRET = "Sv7Wib2alD1K2Ih4Ns9ytgFp33ERTmFedlr6k9pA";

		// String email = "Alekhyaoffice365@gmail.com";
		// String domain = "alekhyak89";
		// String API_KEY = "UYn4H2qDfFLpNN8FO12A";
		// String API_SECRET = "TpF10Hvfm96C78eRxrVmPy4RK0nmMiz2B7xokoHUS4";
		try {
			UservoiceAPI uv = new UservoiceAPI(domain, API_KEY, API_SECRET);
			JSONObject userInfo = uv.getUserInfo(email);
			// uv.getuserComments("148025571");
		} catch (Exception e) {
			System.out.println(e.getMessage() + " Error in point ");
		}
	}
}
