package com.agilecrm.reports;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.search.util.SearchUtil;
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
     * @throws JSONException
     */
    public static void sendReportsToUsers(List<Reports> reportsList)
	    throws JSONException
    {

	for (Reports report : reportsList)
	{

	    // Get the owner of the report, to send email
	    DomainUser user = report.getDomainUser();

	    System.out.println("user : " + user);

	    // If user is not available, querying on search rule is not
	    // required, so return without further processing.
	    if (user == null)
		return;

	    // Call process filters to get reports for one domain, and add
	    // domain details
	    Map<String, Object> results = processReports(report, user);

	    // Report heading. It holds the field values chosen in the report
	    LinkedHashSet<String> reportHeadings = new LinkedHashSet<String>();

	    // Iterates through each filter and customizes (Replace underscore
	    // with space, and capitalize the first letter in the heading ) the
	    // field heading.
	    for (String field : report.fields_set)
	    {
		// Splits fields at properties.
		String fields[] = field.split("properties_");
		if (fields.length > 1)
		{
		    // Replaces underscore with space
		    field = fields[1].replace("_", " ");
		}

		// Split fields at "custom_", and replaces underscore with
		// space.
		String customFields[] = field.split("custom_");
		if (customFields.length > 1)
		{
		    field = customFields[1].replace("_", " ");
		}

		String heading = field.substring(0, 1).toUpperCase()
			+ field.substring(1);
		reportHeadings.add(heading);
	    }

	    Map<String, LinkedHashSet<String>> fieldsList = new LinkedHashMap<String, LinkedHashSet<String>>();
	    fieldsList.put("fields", reportHeadings);

	    // Mail should be sent even of reports are empty, verification for
	    // empty results are not performed.
	    SendMail.sendMail(user.email, SendMail.REPORTS_SUBJECT,
		    SendMail.REPORTS, new Object[] { results, fieldsList });

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

	Map<String, Object> domain_details = new HashMap<String, Object>();

	// Add additional detials to show in email template
	domain_details.put("domain", report.domain);
	domain_details.put("report", report);
	domain_details.put("user_name", user.name);

	// If report_type if of contacts customize object to show properties
	if (report.report_type.equals(Reports.ReportType.Contact))

	    domain_details.put("report_results",
		    customizeContactParameters1(reportList, report.fields_set));

	// Set the old namespace back
	NamespaceManager.set(oldNamespace);

	// Return results
	return domain_details;
    }

    /*
     * Organize all the filters based on domain names returns map(domain,
     * respective contact filters list)
     */
    public static Map<String, List<Reports>> organizeReportsByDomain(
	    List<Reports> reportsList)
    {

	Map<String, List<Reports>> reportsMap = new HashMap<String, List<Reports>>();

	// Iterate through reports and add reports to list its
	// put in a map with its respective domain name as key
	for (Reports report : reportsList)
	{

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

    public static Collection customizeContactParameters1(
	    Collection contactList, LinkedHashSet<String> fields_set)
    {

	List<Map<String, List<Map<String, Object>>>> newProperties = new ArrayList<Map<String, List<Map<String, Object>>>>();

	for (Object contactObject : contactList)
	{
	    List<Map<String, Object>> customProperties = new ArrayList<Map<String, Object>>();
	    List<Map<String, Object>> contactProperties = new ArrayList<Map<String, Object>>();
	    Contact contact = (Contact) contactObject;

	    Map<String, List<Map<String, Object>>> details = new HashMap<String, List<Map<String, Object>>>();

	    System.out.println(fields_set);
	    for (String field : fields_set)
	    {

		System.out.println("field : " + field);
		if (field.contains("properties_"))
		{
		    Map<String, Object> fieldsMap = new LinkedHashMap<String, Object>();
		    String field_name = field.split("properties_")[1];
		    ContactField contactField = contact
			    .getContactField(field_name);

		    if (contactField == null)
			contactField = new ContactField();

		    fieldsMap.put(field_name, contactField);

		    contactProperties.add(fieldsMap);
		    System.out.println("contact property : " + fieldsMap);
		}
		else if (field.contains("custom"))
		{

		    String field_name = field.split("custom_")[1];
		    ContactField contactField = contact
			    .getContactField(field_name);

		    String customFieldJSON = null;
		    try
		    {
			if (contactField == null)
			    contactField = new ContactField();

			customFieldJSON = new ObjectMapper()
				.writeValueAsString(contactField);

			Map<String, Object> customField = new ObjectMapper()
				.readValue(
					customFieldJSON,
					new TypeReference<HashMap<String, Object>>()
					{
					});

			customProperties.add(customField);
		    }

		    catch (IOException e)
		    {
			// TODO Auto-generated catch block
			e.printStackTrace();
		    }
		}
		else
		{

		    ObjectMapper mapper = new ObjectMapper();
		    JSONObject contactJSON = new JSONObject();
		    String fieldValue = null;

		    try
		    {
			contactJSON = new JSONObject(
				mapper.writeValueAsString(contact));
			fieldValue = contactJSON.get(field).toString();

			if (field.contains("time"))
			    fieldValue = SearchUtil
				    .getDateWithoutTimeComponent(Long
					    .parseLong(fieldValue) * 1000);
		    }
		    catch (Exception e)
		    {
			// TODO Auto-generated catch block
			e.printStackTrace();
		    }

		    LinkedHashMap<String, Object> fieldsMap = new LinkedHashMap<String, Object>();

		    System.out.println("field = " + field + "fieldValue = "
			    + fieldValue);

		    if (fieldValue == null)
			fieldsMap.put(field, new ContactField());
		    else
			fieldsMap.put(field, fieldValue);

		    System.out.println("non property : " + fieldsMap);
		    contactProperties.add(fieldsMap);
		}

	    }

	    details.put("details", contactProperties);
	    details.put("custom_fields", customProperties);

	    newProperties.add(details);
	}

	System.out.println(newProperties);
	return newProperties;
    }
}