package com.agilecrm.social;

import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.widgets.Widget;

public class PaypalUtil {

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
	public static String getPaypalAccess(Widget widget) throws Exception {

		String refreshURL = "https://api.paypal.com/v1/identity/openidconnect/tokenservice";
		String prefs = widget.prefs;
		JSONObject obj = new JSONObject(prefs);

		long epoch = System.currentTimeMillis() / 1000;
		long exprieTime = (Long.parseLong(obj.getString("time")) / 1000)
				+ Long.parseLong(obj.getString("expires_in"));

		String accessToken = obj.getString("access_token");
		String refreshToken = obj.getString("refresh_token");

		if (epoch > exprieTime) {
			RefreshToken rt = new RefreshToken(Globals.PAYPAL_CLIENT_ID,
					Globals.PAYPAL_SECRET_ID, refreshURL, refreshToken);
			accessToken = rt.getAccessToken();
			obj.put("access_token", accessToken);
			obj.put("time", (epoch) * 1000);
			widget.prefs = obj.toString();
			widget.save();
		}
		return accessToken;
	}
}
