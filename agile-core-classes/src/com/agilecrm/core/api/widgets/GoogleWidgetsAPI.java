package com.agilecrm.core.api.widgets;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.util.Base64Encoder;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;

@Path("/api/widgets/googlewidgetsapi")
public class GoogleWidgetsAPI {

	@Path("{widget-id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getGoogleToken(@PathParam("widget-id") Long widgetId) {
		String access_token = "";
		final String USER_AGENT = "Mozilla/5.0";

		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			String prefs = widget.prefs;

			JSONObject jObject = new JSONObject(prefs);
			long epoch = System.currentTimeMillis() / 1000;
			long exprieTime = (Long.parseLong(jObject.getString("time")) / 1000) + 3600;
			String refreshToken = jObject.getString("refresh_token");

			if (epoch > exprieTime) {

				String urlPath = "https://www.googleapis.com/oauth2/v4/token";

				try {
					URL url = new URL(urlPath);
					String encoding = Base64Encoder
							.encode(Globals.GOOGLE_CLIENT_ID + ":"
									+ Globals.GOOGLE_SECRET_KEY);

					HttpURLConnection connection = (HttpURLConnection) url
							.openConnection();
					connection.setRequestMethod("POST");

					connection.setRequestProperty("User-Agent", USER_AGENT);

					String urlParams = "client_id=" + Globals.GOOGLE_CLIENT_ID
							+ "&client_secret=" + Globals.GOOGLE_SECRET_KEY
							+ "&refresh_token=" + refreshToken
							+ "&grant_type=refresh_token";

					// Send post request
					connection.setDoOutput(true);
					DataOutputStream wr = new DataOutputStream(
							connection.getOutputStream());
					wr.writeBytes(urlParams);
					wr.flush();
					wr.close();

					InputStream content = (InputStream) connection
							.getInputStream();
					BufferedReader in = new BufferedReader(
							new InputStreamReader(content));
					StringBuffer response = new StringBuffer();
					String line;
					while ((line = in.readLine()) != null) {
						response.append(line);
					}

					System.out.println(response.toString());
					JSONObject newObj = new JSONObject(response.toString());
					newObj.put("time", epoch);
					widget.prefs = newObj.toString();
					widget.save();
					System.out.println(newObj.names().toString());
					access_token = newObj.getString("access_token");

				} catch (Exception e) {
					e.printStackTrace();
				}

			} else {
				access_token = jObject.getString("access_token");
			}

			System.out.println("Epoch :-- " + epoch);
			System.out.println("Expire time  :-- " + exprieTime);
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}

		return access_token;
	}
}
