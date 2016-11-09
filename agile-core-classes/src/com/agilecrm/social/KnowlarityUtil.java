package com.agilecrm.social;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONObject;

public class KnowlarityUtil {
	private String APP_ACCESS_KEY = "iHvMDdH3k68Ndtp8SflAE5X8EVWRjdxE3Gt0w6bI";
	private String APIKey;
	private String agentEmail;
	private String channel;
	private String API_URL = "https://kpi.knowlarity.com/";

	public KnowlarityUtil(String APIKey, String agentEmail, String channel) {
		this.APIKey = APIKey;
		this.agentEmail = agentEmail;
		this.channel = channel;
	}

	public boolean checkAgentIsValid() throws Exception {
		boolean valid = false;
		StringBuilder URL = new StringBuilder(API_URL);
		URL.append(channel + "/v1/account/agent?email=" + agentEmail);
		String result = knowlarityGetCall(URL.toString());

		if (result != null) {
			JSONObject resultObject = new JSONObject(result);
			JSONObject metaData = resultObject.getJSONObject("meta");
			int count = metaData.getInt("total_count");
			if (count > 0) {
				valid = true;
			}
		}

		if (!valid) {
			throw new Exception();
		}
		
		return valid;
	}

	public JSONArray getLogs(String phoneNumber) {
		JSONArray result = new JSONArray();
		return result;
	}

	public boolean makeCall(String phoneNumber) {
		boolean valid = false;
		return valid;
	}

	private String knowlarityGetCall(String url) throws Exception {
		String result = null;
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();

		// optional default is GET
		con.setRequestMethod("GET");

		// add request header
		con.setRequestProperty("Authorization", APIKey);
		con.setRequestProperty("x-api-key", APP_ACCESS_KEY);

		int responseCode = con.getResponseCode();

		BufferedReader in = new BufferedReader(new InputStreamReader(
				con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();

		// print result
		System.out.println(response.toString());
		return result;
	}

}
