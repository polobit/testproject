package com.agilecrm.social.linkedin;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.EnumSet;

import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.LinkedInApiClient;
import com.google.code.linkedinapi.client.enumeration.ProfileField;
import com.google.code.linkedinapi.schema.Person;

public class LinkedInExperience
{

	/**
	 * Retrieves work positions of a given person in LinkedIn based on tokens in
	 * widget and LinkedIn Id and wraps the result into
	 * {@link SocialSearchResult}
	 * 
	 * @param widget
	 *            {@link Widget}, for accessing token and secret key
	 * @param linkedInId
	 *            {@link String} LinkedIn Id of the person whose work positions
	 *            are required
	 * @return {@link SocialSearchResult}
	 * @throws SocketTimeoutException
	 * @throws IOException
	 * @throws Exception
	 */
	public static SocialSearchResult getExperience(Widget widget, String linkedInId) throws SocketTimeoutException,
			IOException, Exception
	{
		try
		{
			// Creates a client with token and secret retrieved from widget
			final LinkedInApiClient client = LinkedInUtil.factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));
	
			// Retrieve person details from client based on LinkedIn Id
			Person person = client.getProfileById(linkedInId, EnumSet.of(ProfileField.POSITIONS,
					ProfileField.POSITIONS_ID, ProfileField.POSITIONS_TITLE, ProfileField.POSITIONS_SUMMARY,
					ProfileField.POSITIONS_START_DATE, ProfileField.POSITIONS_END_DATE,
					ProfileField.POSITIONS_IS_CURRENT, ProfileField.POSITIONS_TITLE, ProfileField.POSITIONS_COMPANY_ID,
					ProfileField.POSITIONS_COMPANY_INDUSTRY, ProfileField.POSITIONS_COMPANY_TICKER,
					ProfileField.POSITIONS_COMPANY_NAME, ProfileField.POSITIONS_COMPANY_SIZE,
					ProfileField.POSITIONS_COMPANY, ProfileField.THREE_CURRENT_POSITIONS,
					ProfileField.THREE_PAST_POSITIONS, ProfileField.POSITIONS_COMPANY_INDUSTRY,
					ProfileField.POSITIONS_COMPANY_TICKER));
	
			// retrieve company details of positions and return
			return LinkedInExperience.fetchExperienceOfPerson(person, linkedInId, client);
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw LinkedInUtil.handleExceptionInLinkedIn(e);
		}
	
	}

	/**
	 * Retrieves work positions of a given person in LinkedIn and wraps the
	 * result into {@link SocialSearchResult}
	 * 
	 * @param person
	 *            {@link Person}
	 * @param linkedInId
	 *            {@link String} LinkedIn Id of the person whose experience is
	 *            required
	 * @param client
	 *            {@link LinkedInApiClient}
	 * @return {@link SocialSearchResult} with work details
	 * @throws SocketTimeoutException
	 * @throws IOException
	 * @throws Exception
	 */
	public static SocialSearchResult fetchExperienceOfPerson(Person person, String linkedInId, LinkedInApiClient client)
			throws SocketTimeoutException, IOException, Exception
	{
		SocialSearchResult experience = new SocialSearchResult();
		experience.id = linkedInId;
	
		// If no work positions, return empty result
		if (person.getPositions() == null && person.getPositions().getPositionList() == null){
			return experience;
		}
	
		// For each position, fill company details
		LinkedInCompany.fillPositionsWithCompanyDetails(person, client);
	
		// set positions in a wrapper
		experience.three_current_positions = person.getPositions().getPositionList();
	
		return experience;
	}
}