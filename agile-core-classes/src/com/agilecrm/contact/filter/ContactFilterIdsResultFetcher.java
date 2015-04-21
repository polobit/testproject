package com.agilecrm.contact.filter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.search.document.ContactDocument;
import com.agilecrm.search.query.QueryDocument;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.UserAccessScopes;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.search.ScoredDocument;
import com.google.gson.JsonSyntaxException;

public class ContactFilterIdsResultFetcher
{
	private String cursor = null;
	private int fetched_count = 0;
	private int current_index = 0;
	private int max_fetch_set_size = 200;
	boolean init_fetch = false;

	private int max_fetch_size;

	private ContactFilter filter;

	private Long domainUserId;

	HashSet<UserAccessScopes> scopes;

	DomainUser user;

	private ContactFilterIdsResultFetcher()
	{
		super();
	}

	public ContactFilterIdsResultFetcher(Long filter_id, String dynamic_filter, int max_fetch_set_size,
			Long currentDomainUserId)
	{
		max_fetch_size = Integer.MAX_VALUE;

		this.max_fetch_set_size = max_fetch_set_size;

		domainUserId = currentDomainUserId;

		this.filter = ContactFilter.getContactFilter(filter_id);
		if (this.filter != null)
			modifyFilterCondition();
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

	}

	private DomainUser getDomainUser()
	{
		if (user == null)
			user = DomainUserUtil.getDomainUser(domainUserId);

		return user;
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

	private boolean hasScope(UserAccessScopes scope)
	{
		return getScopes().contains(scope);
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

	/**
	 * Fetches next set of result based on cursor from previous set of results
	 * 
	 * @return
	 */
	private List<Contact> fetchNextSet()
	{
		System.out.println("**fetching next set***");
		// Flag to set that fetch is done atleast once
		init_fetch = true;

		QueryDocument<Contact> queryInstace = new QueryDocument<Contact>(new ContactDocument().getIndex(),
				Contact.class);
		queryInstace.isBackendOperations = true;

		// Fetches first 200 contacts
		List<ScoredDocument> scoredDocuments = queryInstace.advancedSearchOnlyIds(filter, max_fetch_set_size, cursor,
				null);

		if (scoredDocuments == null || scoredDocuments.size() == 0)
		{
			cursor = null;
			return new ArrayList<Contact>();
		}

	}

	private void setCursor(List<ScoredDocument> scoredDocuments)
	{
		if (size() > 0)
			cursor = contacts.get(contacts.size() - 1).cursor;
	}

}
