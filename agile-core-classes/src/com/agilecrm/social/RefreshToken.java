package com.agilecrm.social;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONObject;

public class RefreshToken {

	private String client_id;
	private String secret_id;
	private String refreshURL;
	private String access_token = null;
	private String refresh_token = null;
	final String USER_AGENT = "Mozilla/5.0";

	RefreshToken(String client_id, String secret_id, String refreshURL,
			String refresh_token) {
		this.client_id = client_id;
		this.secret_id = secret_id;
		this.refresh_token = refresh_token;
		this.refreshURL = refreshURL;

	}

	public String getAccessToken() {

		try {
			URL url = new URL(refreshURL);
			// String encoding = Base64Encoder.encode(client_id + ":" +
			// secret_id);
			// String authCode = "Bearer " + encoding;

			HttpURLConnection connection = (HttpURLConnection) url
					.openConnection();
			connection.setRequestMethod("POST");
			// connection.setRequestProperty("Authorization", authCode);
			connection.setRequestProperty("User-Agent", USER_AGENT);

			String urlParams = "client_id=" + client_id + "&client_secret="
					+ secret_id + "&refresh_token=" + refresh_token
					+ "&grant_type=refresh_token";

			// Send post request
			connection.setDoOutput(true);
			DataOutputStream wr = new DataOutputStream(
					connection.getOutputStream());
			wr.writeBytes(urlParams);
			wr.flush();
			wr.close();

			InputStream content = (InputStream) connection.getInputStream();
			BufferedReader in = new BufferedReader(new InputStreamReader(
					content));
			StringBuffer response = new StringBuffer();
			String line;
			while ((line = in.readLine()) != null) {
				response.append(line);
				System.out.println(line);
			}

			System.out.println(response.toString());
			JSONObject newObj = new JSONObject(response.toString());

			System.out.println(newObj.names().toString());
			access_token = newObj.getString("access_token");

		} catch (Exception e) {
			e.printStackTrace();
		}
		return access_token;
	}
}
