package com.agilecrm.subscription;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.core.DomainUser;
import com.agilecrm.util.Util;
import com.google.appengine.api.NamespaceManager;

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

	// If event message is empty return
	if (stripe_event_message.isEmpty())
	    return;

	// Get namespace and store in temp variable
	String oldNamespace = NamespaceManager.get();

	try
	{
	    JSONObject eventJSON = new JSONObject(stripe_event_message);

	    String id = eventJSON.getString("id");

	    // Get email from the Stripe response to find domain user email
	    String domainUserEmail = eventJSON.getJSONObject("data")
		    .getJSONObject("object").getString("email");

	    // Get name space from domain user email
	    String nameSpace = DomainUser
		    .getDomainUserFromEmail(domainUserEmail).domain;

	    if (StringUtils.isEmpty(nameSpace))
		return;

	    NamespaceManager.set(nameSpace);

	    if (eventJSON.getString("type").equals(
		    Globals.STRIPE_INVOICE_PAYMENT_FAILED))
	    {
		String attemp_count = eventJSON.getJSONObject("data")
			.getJSONObject("object").getString("attempt_count");

		Integer number_of_attempts = Integer.parseInt(attemp_count);

		if (number_of_attempts == 1)
		{
		    Util.sendMail("praveen@invox.com", "yaswanth",
			    DomainUser.getDomainOwner().email, "paymentfailed",
			    "praveen@invox.com", "your payment failed", null);
		}
		else if (number_of_attempts == 2)
		{
		    List<DomainUser> domainUsers = DomainUser
			    .getUsers(NamespaceManager.get());
		    for (DomainUser domainUser : domainUsers)
		    {
			Util.sendMail("praveen@invox.com", "yaswanth",
				domainUser.email, "paymentfailed 2nd time",
				"praveen@invox.com", "your payment failed",
				null);
		    }
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

	    else if (eventJSON.getString("type").equals(
		    Globals.STRIPE_CUSTOMER_DELETED))
	    {
		Util.sendMail("praveen@invox.com", "yaswanth",
			DomainUser.getDomainCurrentUser().email,
			"Account Deleted", "praveen@invox.com",
			"customer deleted", null);

	    }

	}

	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	finally
	{
	    // set the old namespace back
	    NamespaceManager.set(oldNamespace);
	}
    }
}
