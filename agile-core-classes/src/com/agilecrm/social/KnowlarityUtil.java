package com.agilecrm.social;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class KnowlarityUtil {
	public static String APP_ACCESS_KEY = "iHvMDdH3k68Ndtp8SflAE5X8EVWRjdxE3Gt0w6bI";
	private String APIKey;
	private String agentEmail;
	private String channel;
	private String API_URL = "https://kpi.knowlarity.com/";

	public KnowlarityUtil(String prefs) {
		JSONObject prefsObj;
		try {
			prefsObj = new JSONObject(prefs);
			this.APIKey = prefsObj.getString("apiKEY");
			this.agentEmail = prefsObj.getString("email");
			this.channel = prefsObj.getString("knowlarity_channel");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public JSONObject checkAgentIsValid() throws Exception {
		JSONObject resultObject = null;
		StringBuilder URL = new StringBuilder(API_URL);
		URL.append(channel + "/v1/account/agent?email=" + agentEmail);
		String result = knowlarityGetRequest(URL.toString());

		if (result != null) {
			JSONObject resultData = new JSONObject(result);
			JSONArray agentsArray = resultData.getJSONArray("objects");
			if (agentsArray.length() > 0) {
				JSONObject obj = new JSONObject(agentsArray.get(0));
				if (obj != null) {
					resultObject = new JSONObject();
					resultObject.put("agentNumber", obj.get("customer_number"));
					resultObject.put("knowlarityNumber",
							obj.get("knowlarity_number"));
					resultObject.put("apiKEY", this.APIKey);
					resultObject.put("email", this.agentEmail);
					resultObject.put("knowlarity_channel", this.channel);

				}
			}
		}

		if (resultObject == null) {
			throw new Exception();
		}

		return resultObject;
	}

	public JSONArray getLogs(String phoneNumber) {
		JSONArray result = new JSONArray();
		return result;
	}

	private String knowlarityGetRequest(String url) throws Exception {
		String result = null;
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();

		// optional default is GET
		con.setRequestMethod("GET");

		// add request header
		con.setRequestProperty("Authorization", APIKey);
		con.setRequestProperty("x-api-key", APP_ACCESS_KEY);

		int responseCode = con.getResponseCode();
		System.out.println("Knowlarity repsonse code : " + responseCode);

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
