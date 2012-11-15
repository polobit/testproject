package com.agilecrm.reports;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactFilter;
import com.agilecrm.core.DomainUser;
import com.agilecrm.util.Util;
import com.google.appengine.api.NamespaceManager;

public class ReportsUtil
{
    // Get the contactFilter results and mail to domain users in respective
    // domain
    public static void sendReportsToUsers(List<DomainUser> domainUsers,
	    List<ContactFilter> contactFilters)
    {

	// Call process filters to get reports for one domain
	Collection<Contact> results = processBulkFilters(contactFilters);

	// send results to list of domainuser (domainuser.email)

	String reportTemplate = generateTemplate(results);

	// Test email
	if (!results.isEmpty())
	{
	    for (DomainUser domainUser : domainUsers)
	    {
		Util.sendMail("praveen@invox.com", "yaswanth",
			domainUser.email, "list of contacts",
			"praveen@example.com", reportTemplate, null);
	    }
	}
    }

    // Process each filter and return contact results based on filters
    public static Collection<Contact> processBulkFilters(
	    List<ContactFilter> contactFilters)
    {

	Collection<Contact> contactList = new ArrayList<Contact>();

	String oldNamespace = NamespaceManager.get();

	System.out.println("old namespace : " + oldNamespace);

	// Get the domain(namespace) in which queries need to be run
	String newNamespace = contactFilters.get(0).domain;

	// If newNamespace is empty return empty list
	if (StringUtils.isEmpty(newNamespace))
	    return contactList;

	// Set new namespace and run the queries
	NamespaceManager.set(newNamespace);

	System.out.println("new namespace to run query: "
		+ NamespaceManager.get());

	// Iterate through each filter and add results collection
	for (ContactFilter contactFilter : contactFilters)
	{
	    contactList.addAll(contactFilter.queryContacts());

	    System.out.println("search results : " + contactList);
	}

	// Set the old namespace back
	NamespaceManager.set(oldNamespace);

	// Return results
	return contactList;
    }

    // Organize all the filters based on domain names returns map(domain,
    // respective contact filters list)
    public static Map<String, List<ContactFilter>> organizeFiltersByDomain(
	    List<ContactFilter> contactFilters)
    {
	Map<String, List<ContactFilter>> filtersMap = new HashMap<String, List<ContactFilter>>();

	// Iterate through contact filters and add filters to list its
	// put in a map with its respective domain name as key
	for (ContactFilter contactFilter : contactFilters)
	{
	    // Make sure domain is not null or empty
	    if (contactFilter.domain == null || contactFilter.domain.isEmpty())
		continue;

	    // If domain name is already a key then add contact filter to
	    // existing list
	    if (filtersMap.containsKey(contactFilter.domain))
	    {
		filtersMap.get(contactFilter.domain).add(contactFilter);
		continue;
	    }

	    List<ContactFilter> filters = new ArrayList<ContactFilter>();

	    filters.add(contactFilter);

	    filtersMap.put(contactFilter.domain, filters);
	}

	return filtersMap;
    }

    public static String generateTemplate(Collection<Contact> contacts)
    {
	String template = "";
	for (Contact contact : contacts)
	{
	    template = template + contact.toString() + "<br>";
	}

	return template;
    }
}
