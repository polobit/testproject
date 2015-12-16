package com.agilecrm.social;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONObject;

import com.agilecrm.widgets.Widget;

public class PaypalUtil {

	private static String pluginURL = "https://api.sandbox.paypal.com/v1/invoicing/search";

	private static final String USER_AGENT = "Mozilla/5.0";

	/**
	 * Retrieves info of Paypal user and retrieves contacts based on the email
	 * of contact
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @param email
	 *            {@link String} email, for which tickets are retrieved
	 * @return {@link String} form of JSON
	 * @throws Exception
	 */
	public static String getPaypalProfile(Widget widget, String email)
			throws Exception {

		String prefs = widget.prefs;
		JSONObject obj = new JSONObject(prefs);
		String accessToken = obj.getString("access_token");

		URL url = new URL(pluginURL);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();

		// optional default is GET
		con.setRequestMethod("POST");

		// add request header
		con.setRequestProperty("User-Agent", USER_AGENT);
		con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

		con.setRequestProperty("Content-Type", "application/json");
		con.setRequestProperty("Authorization", "Bearer " + accessToken);

		String urlParameters = "email=premtammina@gmail.com";

		// Send post request
		con.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		wr.writeBytes(urlParameters);
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

		// print result
		System.out.println(response.toString());

		return "";
	}
}
