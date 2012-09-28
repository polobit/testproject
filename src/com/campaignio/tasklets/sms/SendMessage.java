package com.campaignio.tasklets.sms;

import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;

public class SendMessage extends TaskletAdapter
{
    // Fields
    public static String FROM = "from";
    public static String TO = "to";

    public static String MESSAGE = "message";

    // Number, Caller Id
    // public static String NUMBER = "4084930784";
    // public static String CALLERID = "4157660786";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get From, To, Message
	String from = getStringValue(nodeJSON, subscriberJSON, data, FROM);
	String to = getStringValue(nodeJSON, subscriberJSON, data, TO);
	String message = getStringValue(nodeJSON, subscriberJSON, data, MESSAGE);

	System.out.println("From " + from + " To: " + to + " Messsage: "
		+ message);

	// Send Message
	if (to != null && from != null)
	{
	    if (to.startsWith("+92"))
	    {
		// Util.sendMessageUsingBulkSMS(Util.changeNumber(to), message,
		// Util.changeNumber(from));
		// Util.sendMessageUsingNowSMS(Util.changeNumber(to), message,
		// Util.changeNumber(from));
	    }
	    else
	    {

		log(campaignJSON, subscriberJSON, "Sending using Tropo");

		// Util.sendMessageUsingTwilio(Util.changeNumber(to), message,
		// Util.changeNumber(from));
		// Util.sendMessageUsingTropo(Util.changeNumber(to),
		// message,Util.changeNumber(from));
	    }

	    log(campaignJSON, subscriberJSON, "Send SMS -> From " + from
		    + " To: " + to + " Messsage: " + message);

	}
	else
	{
	    System.out.println("Cannot send a message");
	}

	// Execute Next One in Loop
	TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }

}
