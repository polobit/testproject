package com.thirdparty.ses.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONSerializer;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.bounce.EmailBounceStatus;
import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.EmailBounceTriggerUtil;
import com.campaignio.cron.Cron;
import com.campaignio.cron.deferred.CronDeferredTask;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.thirdparty.mandrill.MandrillSetBounceStatusDeferredTask;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

/**
 * <code>MandrillWebhook</code> is the webhook servlet to handle hard bounce and
 * soft bounces
 * 
 * @author naresh
 * 
 */
@SuppressWarnings("serial")
public class AmazonSESWebhook extends HttpServlet
{

    public static final String MANDRILL_EVENTS = "mandrill_events";

    public static final String EVENT = "event";
    public static final String HARD_BOUNCE = "hard_bounce";
    public static final String SOFT_BOUNCE = "soft_bounce";
    public static final String SPAM = "spam";

    public static final String MSG = "msg";
    public static final String EMAIL = "email";
    public static final String SUBACCOUNT = "subaccount";
    public static final String SUBJECT = "subject";

    public static final String METADATA = "metadata";
    public static final String METADATA_CAMPAIGN_ID = "campaign_id";

    public void service(HttpServletRequest req, HttpServletResponse res)
    {System.out.println("Entered Amazon Httpendpoint:"+ req);
	System.out.println("Request attribute names:"+req.getAttributeNames());
	
	Enumeration enumeration =req.getAttributeNames();
	while(enumeration.hasMoreElements()){
		System.out.println(enumeration.nextElement().toString());
	}
	
	StringBuilder buffer = new StringBuilder();
	BufferedReader reader;
	try {
		reader = req.getReader();
		String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        String data = buffer.toString();
        System.out.println("Data is :"+data);
	} catch (IOException e1) {
		// TODO Auto-generated catch block
		e1.printStackTrace();
	}
    }
}
