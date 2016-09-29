package com.agilecrm.session;

import java.io.Serializable;

import com.fasterxml.jackson.databind.ObjectMapper;

public class KnowledgebaseUserInfo implements Serializable
{

	private static final long serialVersionUID = 1L;

	private String claimedId;

	/**
	 * Email address of the user logged in
	 */
	private String email;

	/**
	 * Name of the user logged in
	 */
	private String name;
	
	public static enum Role
	{
		ADMIN, DOMAIN_USER, CUSTOMER
	};
	
	//Default access
	public Role role = Role.CUSTOMER;
	
	/**
	 * Domain user id logged in
	 */
	private Long userId = 0L;

	public KnowledgebaseUserInfo()
	{
	}

	public KnowledgebaseUserInfo(String claimedId, String email, String name, Role role, Long userId)
	{
		this.userId = userId;
		this.claimedId = claimedId;
		this.email = email;
		this.name = name;
		this.role = role;

		// Lower case
		if (this.email != null)
			this.email.toLowerCase();

//		// Get Domain User for this email and store the id
//		DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);
//		
//		if (domainUser != null)
//		{
//			setDomainId(domainUser.id);
//
//			try
//			{
//				UserInfo userInfo = new UserInfo("agilecrm.com", email, domainUser.name);
//				
//				BillingRestrictionUtil.setPlan(userInfo, domainUser.domain);
//			}
//			catch (Exception e)
//			{
//				e.printStackTrace();
//			}
//		}
	}

	/**
	 * Returns claimedId
	 * 
	 * @return {@link String} claimedId
	 */
	public String getClaimedId()
	{
		return claimedId;
	}

	/**
	 * Returns email of user
	 * 
	 * @return {@link String} email
	 */
	public String getEmail()
	{
		return email;
	}

	/**
	 * Returns name of the user
	 * 
	 * @return {@link String} name
	 */
	public String getName()
	{
		return name;
	}

	public String toString()
	{
	  try
	  {
	   return new ObjectMapper().writeValueAsString(this);
	  }
	  catch (Exception e)
	  {
	   e.printStackTrace();
	  }

	  return "{}";
		
	}

	/**
	 * Sets domain id
	 * 
	 * @param domainId
	 */
	public void setUserId(Long userId)
	{
		this.userId = userId;
	}

	/**
	 * Returns the domain id of the user logged ins
	 * 
	 * @return {@link Long} domain user id
	 */
	public Long getUserId()
	{
		return userId;
	}
}
