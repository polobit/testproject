package com.agilecrm.contact.filter;

import java.util.HashSet;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.UserAccessScopes;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.gson.JsonSyntaxException;

public class ContactFilterIdsResultFetcher
{
	private String cursor = null;
	private int fetched_count = 0;
	private int current_index = 0;
	private int max_fetch_set_size = 200;

	private int max_fetch_size;

	private ContactFilter filter;

	private Long domainUserId;

	HashSet<UserAccessScopes> scopes;

	DomainUser user;

	private private ContactFilterIdsResultFetcher()
	{
		super();
	}

	public ContactFilterIdsResultFetcher(String filter_id, String dynamic_filter, int max_fetch_set_size,
			Long currentDomainUserId)
	{
		max_fetch_size = Integer.MAX_VALUE;

		this.max_fetch_set_size = max_fetch_set_size;

		domainUserId = currentDomainUserId;

		try
		{
			Long filterId = Long.parseLong(filter_id);
			this.filter = ContactFilter.getContactFilter(filterId);
			if (this.filter != null)
				modifyFilterCondition();
		}
		catch (NumberFormatException e)
		{
			if (filter_id != null)
				this.systemFilter = getSystemFilter(filter_id);
		}
		try
		{
			if (StringUtils.isNotEmpty(dynamic_filter))
			{
				ContactFilter contact_filter = ContactFilterUtil.getFilterFromJSONString(dynamic_filter);
				this.filter = contact_filter;
				if (this.filter != null)
					modifyFilterCondition();
			}
		}
		catch (JsonSyntaxException e)
		{
			System.out.println("Exception while parsing dynamic filters for bulk operations : " + e);
		}

		BulkActionUtil.setSessionManager(domainUserId);

		setAvailableCount();

	}

	private DomainUser getDomainUser()
	{
		DomainUserUtil.getDomainUser(domainUserId);
	}

	private HashSet<UserAccessScopes> getScopes()
	{
		if (scopes != null)
			return scopes;

		getDomainUser();

		if (user == null)
		{
			scopes = new HashSet<UserAccessScopes>(UserAccessScopes.customValues());
			return scopes;
		}

		scopes = user.scopes;

		return scopes;
	}

	private void modifyFilterCondition()
	{
		UserAccessControlUtil.checkReadAccessAndModifyTextSearchQuery(
				UserAccessControl.AccessControlClasses.Contact.toString(), filter.rules);

		if (hasScope(UserAccessScopes.VIEW_CONTACTS)
				&& !(hasScope(UserAccessScopes.UPDATE_CONTACT) || hasScope(UserAccessScopes.DELETE_CONTACTS)))
		{
			if (domainUserId == null)
				return;

			SearchRule rule = new SearchRule();
			rule.RHS = String.valueOf(domainUserId);
			rule.CONDITION = RuleCondition.EQUALS;
			rule.LHS = "owner_id";

			filter.rules.add(rule);
		}
	}

}
