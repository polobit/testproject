package com.agilecrm.social.linkedin;

import java.util.EnumSet;

import com.google.code.linkedinapi.client.LinkedInApiClient;
import com.google.code.linkedinapi.client.LinkedInApiClientException;
import com.google.code.linkedinapi.client.enumeration.CompanyField;
import com.google.code.linkedinapi.schema.Company;
import com.google.code.linkedinapi.schema.Person;
import com.google.code.linkedinapi.schema.Position;

public class LinkedInCompany
{

	/**
	 * Retrieves company details of a work position based on position id
	 * 
	 * @param person
	 *            {@link Person}
	 * @param client
	 *            {@link LinkedInApiClient}
	 * @return {@link Company}
	 * @throws Exception
	 */
	public static Company fetchCompanyDetails(String positionId, LinkedInApiClient client) throws Exception
	{
	
		Company company = client.getCompanyById(positionId, EnumSet.of(CompanyField.LOCATIONS_ADDRESS,
				CompanyField.LOGO_URL, CompanyField.NAME, CompanyField.NUM_FOLLOWERS, CompanyField.BLOG_RSS_URL,
				CompanyField.DESCRIPTION, CompanyField.ID, CompanyField.INDUSTRY, CompanyField.TICKER));
	
		if (company.getLogoUrl() != null){
			company.setLogoUrl(LinkedInUtil.changeImageUrl(company.getLogoUrl()));
		}
	
		return company;
	
	}

	/**
	 * Retrieves company details for each position and fills each position with
	 * company details
	 * 
	 * @param person
	 *            {@link Person}
	 * @param client
	 *            {@link LinkedInApiClient}
	 * @throws Exception
	 */
	public static void fillPositionsWithCompanyDetails(Person person, LinkedInApiClient client) throws Exception
	{
	
		// Iterate each position and fill company details
		for (Position position : person.getPositions().getPositionList())
		{
			// If company details available
			if (position.getCompany().getId() != null)
			{
				try
				{
					// fetch company details based on its id
					position.setCompany(fetchCompanyDetails(position.getCompany().getId(), client));
				}
				catch (LinkedInApiClientException e)
				{
					System.out.println("In fill positions exception " + e.getMessage());
	
					/*
					 * If company's id is some irrelevant and not related to
					 * company, company details are skipped
					 */
					if (e.getMessage().contains("Company with ID {"))
						continue;
					else
						throw new Exception(e.getMessage());
				}
			}
		}
	}
}