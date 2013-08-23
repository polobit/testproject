package com.agilecrm.social.linkedin;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.EnumSet;

import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.LinkedInApiClient;
import com.google.code.linkedinapi.client.enumeration.ProfileField;
import com.google.code.linkedinapi.schema.Person;

public class LinkedInConnect
{

	/**
	 * Creates a client based on token and secret token and sends connect
	 * request to a person in LinkedIn based on his LinkedInId.
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve token and secret of LinkedIn
	 *            account of agile user
	 * @param recipientId
	 *            LinkedIn id of the recipient to whom add request is sent
	 * @param subject
	 *            Subject to be sent to recipient while sending a request
	 * @param message
	 *            Description to be sent while sending a request
	 * @return {@link String} with the success message
	 * @throws Exception
	 *             If the recipientId does not exists or recipient provides
	 *             restricted access to his profile
	 */
	public static String connectInLinkedIn(Widget widget, String recipientId, String subject, String message)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Creates a client with token and secret retrieved from widget
			final LinkedInApiClient client = LinkedInUtil.factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));
	
			System.out.println("In connect LinkedInId : " + recipientId);
	
			/*
			 * Fetches person details based on id since Header info present in
			 * API_STANDARD_PROFILE_REQUEST field is required to connect with
			 * another profile
			 */
			Person person = client.getProfileById(recipientId,
					EnumSet.of(ProfileField.ID, ProfileField.API_STANDARD_PROFILE_REQUEST));
	
			/*
			 * Message is added while sending connect request to specify request
			 * is sent from Agile
			 */
			String agile = " - Sent from Agile CRM";
	
			// send request to connect from client
			client.sendInviteToPerson(person, subject, message + agile);
			return "Add request sent successfully";
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw LinkedInUtil.handleExceptionInLinkedIn(e);
		}
	}

}
