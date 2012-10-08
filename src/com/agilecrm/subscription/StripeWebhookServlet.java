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
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.Sendmail;

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
		    Sendmail.sendMail("praveen@invox.com", "yaswanth",
			    AgileUser.getCurrentAgileUser().open_id_user
				    .getEmail(), "paymentfailed",
			    "test@invox.com", "", "your payment failed");
		}
		else if (number_of_attempts == 2)
		{
		    // Send email to all admins
		}
		else
		{
		    // Delete data
		}
	    }

	}

	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
    /*
     * public void doPost(HttpServletRequest req, HttpServletResponse resp)
     * throws ServletException, IOException { System.out.println(req); }
     */
}
