package com.agilecrm.reports;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>ReportsUtil</code> is utility class, it provides functionalities to
 * organize reports according to the namespace, customize contact parameters, to
 * access property fields in contact. After processing and customizing data as
 * required by template, report results are sent to respecitive domain users
 * specified.
 * 
 * @author Yaswanth
 */
public class ReportsUtil
{

    /**
     * Processes the reports and sends results to respective domain users. It
     * iterates through search report in reports list, fetches the results based
     * on the criteria specified in the report object.
     * 
     * @param reportsList
     */
    public static void sendReportsToUsers(List<Reports> reportsList)
    {

	for (Reports report : reportsList)
	{
	    System.out.println("reports list in reports util : " + reportsList);

	    // Get the owner of the report, to send email
	    DomainUser user = report.getDomainUser();

	    System.out.println("user : " + user);

	    // If user is not available, querying on search rule is not
	    // required.
	    if (user == null)
		return;

	    // Call process filters to get reports for one domain and add domain
	    // details
	    Map<String, Object> results = processReports(report, user);

	    System.out.println("Results : " + results);

	    // Mail should be send even of reports are empty.
	    SendMail.sendMail(user.email, SendMail.REPORTS_SUBJECT,
		    SendMail.REPORTS, results);
	}
    }

    /**
     * Process each report and return contact results based on filters, which
     * are customized i.e., user name, report, domain, custom_fields are added
     * 
     * @param report
     * @param user
     * @return
     */
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

	// Iterate through each filter and add results collection
	// To store reports in collection
	System.out.println("new namespace to run query: "
		+ NamespaceManager.get());

	// Iterate through each filter and add results collection
	// To store reports in collection
	Collection reportList = report.generateReports();
	List<CustomFieldDef> fieldsCustomFieldDefs = new ArrayList<CustomFieldDef>();
	try
	{
	    fieldsCustomFieldDefs = CustomFieldDefUtil.getAllCustomFields();
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	Map<String, Object> domain_details = new HashMap<String, Object>();

	// Add additional detials to show in email template
	domain_details.put("report_results", reportList);
	domain_details.put("domain", report.domain);
	domain_details.put("report", report);
	domain_details.put("user_name", user.name);
	domain_details.put("custom_fields", fieldsCustomFieldDefs);

	// If report_type if of contacts customize object to show properties
	if (report.report_type.equals(Reports.ReportType.Contact))
	    customizeContactParameters(reportList, fieldsCustomFieldDefs);

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
	    List<Reports> reportsList)
    {

	Map<String, List<Reports>> reportsMap = new HashMap<String, List<Reports>>();

	// Iterate through reports and add reports to list its
	// put in a map with its respective domain name as key
	for (Reports report : reportsList)
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
    public static Collection customizeContactParameters(Collection contactList,
	    List<CustomFieldDef> customFields)
    {
	for (Object contactObject : contactList)
	{
	    Contact contact = (Contact) contactObject;

	    // Not saved field in contacts add all properties as name value pair
	    contact.contact_properties = new HashMap<String, Object>();

	    for (ContactField contactField : contact.properties)
	    {

		if (!contactField.type.equals(ContactField.FieldType.CUSTOM))
		    contact.contact_properties.put(contactField.name,
			    contactField.value);
	    }

	    List<ContactField> customFieldValuesList = new LinkedList<ContactField>();
	    for (CustomFieldDef field : customFields)
	    {
		ContactField contactField = contact
			.getContactFieldByName(field.field_label);

		customFieldValuesList.add(contactField);
	    }
	    contact.contact_properties.put("custom", customFieldValuesList);
	    contact.contact_properties.put("image",
		    contact.getContactFieldValue("image"));
	    System.out.println(contact.contact_properties);
	}

	return contactList;
    }
}