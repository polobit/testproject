package com.agilecrm.scribe;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.scribe.builder.ServiceBuilder;
import org.scribe.oauth.OAuthService;

import com.agilecrm.Globals;
import com.agilecrm.scribe.api.Paypal2Api;
import com.agilecrm.scribe.util.ScribeUtil;

public class PaypalScribeServlet extends HttpServlet {

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String isForAll;
		String returnUrl;

		String code = req.getParameter("code");

		if (code != null) {
			isForAll = req.getSession().getAttribute("isForAll").toString();
			returnUrl = req.getSession().getAttribute("return_url").toString();

			Paypal2Api paypalApi = new Paypal2Api();
			String result = null;
			try {
				result = paypalApi.getAccessToken(code);
			} catch (Exception e) {
				result = paypalApi.getAccessToken(code);
			}

			if (result != null) {
				try {
					JSONObject obj = new JSONObject(result);

					Map<String, String> properties = new HashMap<String, String>();
					properties.put("token_type", obj.getString("token_type"));
					properties.put("expires_in", obj.getString("expires_in"));
					properties.put("refresh_token",
							obj.getString("refresh_token"));
					properties.put("id_token", obj.getString("id_token"));
					properties.put("access_token",
							obj.getString("access_token"));
					properties.put("time",
							String.valueOf(System.currentTimeMillis()));
					properties.put("isForAll", isForAll);

					long widget_id = 0;

					widget_id = ScribeUtil.saveWidgetPrefsByName("Paypal",
							properties);

					if (widget_id > 0) {
						returnUrl += "/" + widget_id;
					} else {
						returnUrl = "/#add-widget";
					}
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			resp.sendRedirect(returnUrl);
		} else {
			isForAll = req.getParameter("isForAll");
			String reqReturnUrl = req.getParameter("return_url");
			if (isForAll != null) {
				req.getSession().setAttribute("isForAll", isForAll);
			}

			if (reqReturnUrl != null) {
				OAuthService service = new ServiceBuilder()
						.provider(Paypal2Api.class)
						.apiKey(Globals.PAYPAL_CLIENT_ID)
						.apiSecret(Globals.PAYPAL_SECRET_ID)
						.scope(Paypal2Api.SCOPE)
						.callback(Paypal2Api.REDIRECT_URL).build();
				System.out.println(req.getRequestURL());
				returnUrl = service.getAuthorizationUrl(null) + "&state="+req.getRequestURL();

				req.getSession().setAttribute("return_url", reqReturnUrl);
			} else {
				returnUrl = "/#Paypal";
			}
			resp.sendRedirect(returnUrl);
		}
	}
}
