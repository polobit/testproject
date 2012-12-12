package com.agilecrm.reports;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.core.DomainUser;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;

public class ReportsUtil
{
    /*
     * Send the Report results and mail to domain users in respective domain
     */
    public static void sendReportsToUsers(List<Reports> reportsList)
    {

	for (Reports report : reportsList)
	{
	    // Get the owner of the report to send email
	    DomainUser user = report.getDomainUser();

	    // If user is not available query not required
	    if (user == null)
		return;

	    // Call process filters to get reports for one domain and add domain
	    // details
	    Map<String, Object> results = processReports(report, user);

	    System.out.println("Results : " + results);

	    if (results == null)
		return;

	    // Check whether results are not empty
	    if (!((Collection) results.get("report_results")).isEmpty())
		SendMail.sendMail(user.email, SendMail.REPORTS_SUBJECT,
			SendMail.REPORTS, results);
	}
    }

    /* Process each filter and return contact results based on filters */
    public static Map<String, Object> processReports(Reports report,
	    DomainUser user)
    {

	// Get current namespace and store it
	String oldNamespace = NamespaceManager.get();

	System.out.println("old namespace : " + oldNamespace);

	// Get the domain(namespace) in which queries need to be run
	String newNamespace = report.domain;

	// If newNamespace is empty return empty list
	if (StringUtils.isEmpty(newNamespace))
	    return null;

	// Set new namespace and run the queries
	NamespaceManager.set(newNamespace);

	System.out.println("new namespace to run query: "
		+ NamespaceManager.get());

	// Iterate through each filter and add results collection
	// To store reports in collection
	Collection reportList = report.generateReports();

	Map<String, Object> domain_details = new HashMap<String, Object>();

	// Add additional detials to show in email template
	domain_details.put("report_results", reportList);
	domain_details.put("domain", report.domain);
	domain_details.put("report_name", report.name);
	domain_details.put("user_name", user.name);

	// If report_type if of contacts customize object to show properties
	if (report.report_type.equals(Reports.ReportType.Contact))
	    customizeContactParameters(reportList);

	System.out.println("search results : " + reportList);

	// Set the old namespace back
	NamespaceManager.set(oldNamespace);

	// Return results
	return domain_details;
    }

    /*
     * Organize all the filters based on domain names returns map(domain,
     * respective contact filters list)
     */
    public static Map<String, List<Reports>> organizeFiltersByDomain(
	    List<Reports> reports_list)
    {
	System.out.println(reports_list);

	Map<String, List<Reports>> reportsMap = new HashMap<String, List<Reports>>();

	// Iterate through reports and add reports to list its
	// put in a map with its respective domain name as key
	for (Reports report : reports_list)
	{
	    // Make sure domain is not null or empty
	    if (StringUtils.isEmpty(report.domain))
		continue;

	    // If domain name is already a key then add contact filter to
	    // existing list
	    if (reportsMap.containsKey(report.domain))
	    {
		reportsMap.get(report.domain).add(report);
		continue;
	    }

	    // If reports respective to particular domain is not available
	    // create a new list and add to map
	    List<Reports> reportList = new ArrayList<Reports>();
	    reportList.add(report);
	    reportsMap.put(report.domain, reportList);
	}

	return reportsMap;
    }

    /*
     * Customize the contact parameter to enable email templates to use
     * properties(ContactField)
     */
    public static Collection customizeContactParameters(Collection contactList)
    {
	for (Object contactObject : contactList)
	{
	    Contact contact = (Contact) contactObject;

	    // Not saved field in contacts add all properties as name value pair
	    contact.contact_properties = new HashMap<String, Object>();

	    for (ContactField contactField : contact.properties)
	    {
		if (contactField.name != null)
		    contact.contact_properties.put(contactField.name,
			    contactField.value);
	    }
	}

	return contactList;
    }
}
