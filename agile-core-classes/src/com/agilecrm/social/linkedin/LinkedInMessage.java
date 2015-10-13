package com.agilecrm.social.linkedin;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;

import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.LinkedInApiClient;

public class LinkedInMessage
{

	/**
	 * Creates a client based on token and secret token and sends a message to a
	 * person in LinkedIn based on his LinkedInId.
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve token and secret of LinkedIn
	 *            account of agile user
	 * @param recipientId
	 *            LinkedIn id of the recipient to whom message is sent
	 * @param subject
	 *            Subject to be sent to recipient while sending a message
	 * @param message
	 *            Description to be sent while sending a message
	 * @return {@link String} with the success message
	 * @throws Exception
	 *             If the recipientId does not exists or recipient provides
	 *             restricted access to his profile
	 */
	public static String sendLinkedInMessageById(Widget widget, String recipientId, String subject, String message)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Creates a client with token and secret retrieved from widget
			final LinkedInApiClient client = LinkedInUtil.factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));
	
			ArrayList<String> list = new ArrayList<String>();
			list.add(recipientId);
	
			System.out.println("In message LinkedInId : " + recipientId);
	
			/*
			 * Message is added while sending message to specify it is sent from
			 * Agile
			 */
			String agile = " - Sent from Agile CRM (www.agilecrm.com)";
	
			/*
			 * check if message length exceeds 7000, if so agile message is
			 * skipped
			 */
			if (message.length() < (7000 - agile.length())){
				message = message + agile;
			}
	
			// sends message to a person in LinkedIn based on LinkedInId in list
			client.sendMessage(list, subject, message);
			return "Message sent successfully";
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw LinkedInUtil.handleExceptionInLinkedIn(e);
		}
	}

}
