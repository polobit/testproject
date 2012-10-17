package com.agilecrm.subscription;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.core.DomainUser;
import com.agilecrm.util.Util;

public class StripeWebhookServlet extends HttpServlet
{

    public void service(HttpServletRequest req, HttpServletResponse res)
	    throws IOException
    {
	res.setContentType("text/plain;charset=UTF-8");

	ServletInputStream in = req.getInputStream();

	BufferedReader reader = new BufferedReader(new InputStreamReader(in));

	String stripe_event_message = "";
	String line = "";
	while ((line = reader.readLine()) != null)
	{
	    stripe_event_message += (line);
	}

	try
	{
	    JSONObject eventJSON = new JSONObject(stripe_event_message);

	    String id = eventJSON.getString("id");

	    if (eventJSON.getString("type").equals(
		    Globals.STRIPE_INVOICE_PAYMENT_FAILED))
	    {
		String attemp_count = eventJSON.getJSONObject("data")
			.getJSONObject("object").getString("attempt_count");

		Integer number_of_attempts = Integer.parseInt(attemp_count);

		if (number_of_attempts == 1)
		{
		    Util.sendMail("praveen@invox.com", "yaswanth",
			    DomainUser.getDomainCurrentUser().email,
			    "paymentfailed", "praveen@invox.com",
			    "your payment failed", null);
		}
		else if (number_of_attempts == 2)
		{
		    // Send email to all admins
		}
	    }
	    else if (eventJSON.getString("type").equals(
		    Globals.STRIPE_SUBSCRIPTION_DELETED))
	    {
		Util.sendMail("praveen@invox.com", "yaswanth",
			DomainUser.getDomainCurrentUser().email,
			"Account Deleted", "praveen@invox.com",
			"your account deleted", null);
	    }

	}

	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
}
