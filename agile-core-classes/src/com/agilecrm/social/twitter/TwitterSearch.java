package com.agilecrm.social.twitter;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import twitter4j.ResponseList;
import twitter4j.TwitterRuntimeException;
import twitter4j.User;

import com.agilecrm.contact.Contact;
import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.widgets.Widget;

public class TwitterSearch
{

	/**
	 * Searches Twitter profiles based on first name and last name specified,
	 * result fetched are represented by class {@link SocialSearchResult}
	 * including details id, name, image_url, url etc..
	 * 
	 * <p>
	 * Token and secret required to connect are retrieved from the widget
	 * </p>
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @param contact
	 *            {@link Contact}
	 * @return {@link List} of {@link SocialSearchResult}
	 * @throws Exception
	 *             If twitter throws an exception
	 */
	public static List<SocialSearchResult> searchTwitterProfiles(Widget widget, Contact contact)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Gets first name and last name of the contact to search profiles
			String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
			String lastName = contact.getContactFieldValue(Contact.LAST_NAME);

			// returns empty if first name and last name both are null
			if (StringUtils.isBlank(firstName) && StringUtils.isBlank(lastName)){
				return new ArrayList<SocialSearchResult>();
			}

			/*
			 * check first name and last name, if null put it as empty for
			 * search
			 */
			firstName = (firstName != null) ? firstName : "";
			lastName = (lastName != null) ? lastName : "";

			/*
			 * Creates a twitter object to connect with twitter and searches
			 * twitter profiles based on first name and last name
			 */
			return TwitterSearch.modifiedSearchForTwitterProfiles(widget, firstName + " " + lastName);
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In search twitter exception");
			throw TwitterUtil.getErrorMessage(e);
		}
	}

	/**
	 * Searches Twitter profiles based on search string, result fetched are
	 * represented by class {@link SocialSearchResult} including details id,
	 * name, image_url, url etc..
	 * 
	 * <p>
	 * Token and secret required to connect are retrieved from the widget
	 * </p>
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @param searchString
	 *            {@link String} to be searched
	 * @return {@link List} of {@link SocialSearchResult}
	 * @throws Exception
	 *             If twitter throws an exception
	 */
	public static List<SocialSearchResult> modifiedSearchForTwitterProfiles(Widget widget, String searchString)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{

			// returns empty list if String to be searched is null
			if (StringUtils.isBlank(searchString)){
				return new ArrayList<SocialSearchResult>();
			}
			
			/*
			 * Creates a twitter object to connect with twitter Searches twitter
			 * profiles based on the search string
			 */
			ResponseList<User> users = TwitterUtil.getTwitter(widget).searchUsers(searchString, 1);

			// Fill user details in list and return
			return TwitterUtil.fillUsersDetailsInList(users);
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In modified search twitter exception");
			throw TwitterUtil.getErrorMessage(e);
		}
	}

}
