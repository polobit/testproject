package com.agilecrm.reports;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.WordUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Call;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.reports.deferred.ReportsInstantEmailDeferredTask;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil.ErrorMessages;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction.ClassEntities;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;

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
    public static void sendReportsToUsers(List<Reports> reportsList) throws JSONException
    {
	for (Reports report : reportsList)
	{
	    // Each report is sent to email address which is saved in report. If
	    // email in sendTo in empty, report is not processed further
	    if (StringUtils.isEmpty(report.sendTo))
		return;

	    // Call process filters to get reports for one domain, and add
	    // domain details
	    Map<String, Object> results = processReports(report, null);

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

		String heading = field.substring(0, 1).toUpperCase() + field.substring(1);
		reportHeadings.add(heading);
	    }

	    Map<String, LinkedHashSet<String>> fieldsList = new LinkedHashMap<String, LinkedHashSet<String>>();
	    fieldsList.put("fields", reportHeadings);

	    if (results == null)
		results = new HashMap<String, Object>();

	    // Set number of results in count variable
	    if (results.get("report_results") != null)
	    {
		Collection resultsCollection = (Collection) results.get("report_results");
		System.out.println("available = " + resultsCollection.size());
		if (resultsCollection.size() == 0)
		    continue;
	    }

	    results.put("duration", WordUtils.capitalizeFully((report.duration.toString())));

	    // Send reports email
	    SendMail.sendMail(report.sendTo, report.name + " - " + SendMail.REPORTS_SUBJECT, SendMail.REPORTS,
		    new Object[] { results, fieldsList });
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
    public static Map<String, Object> processReports(Reports report, DomainUser user)
    {
	SearchRule.addContactTypeRule(report.rules, Type.PERSON);

	UserAccessControlUtil
		.checkReadAccessAndModifyTextSearchQuery(Contact.class.getSimpleName(), report.rules, user);

	// Iterate through each filter and add results collection
	// To store reports in collection
	Collection reportList = report.generateReports(100, null);

	Map<String, Object> domain_details = new HashMap<String, Object>();

	domain_details.put("report", report);
	domain_details.put("domain", NamespaceManager.get());
	try
	{
	    Contact con = (Contact) reportList.toArray()[0];
	    domain_details.put("count", con.count);
	    if (con.count > 10000)
		domain_details.put("count", "10000+");
	    if (con.count > 100)
		domain_details.put("limit_message", "We are showing only 100 contacts in this email.");
	}
	catch (Exception e)
	{
	    System.out.println("Error in getting contacts count in reports.");
	}

	// If report_type if of contacts customize object to show properties
	if (report.report_type.equals(Reports.ReportType.Contact))
	    domain_details.put("report_results", customizeContactParameters(reportList, report.fields_set));

	// Return results
	return domain_details;
    }

    /**
     * In reports users has an option of choosing fields to be showin in reports
     * and their order. In order to maintain those fields, we customize the
     * object which is sent to mustache email template.
     * 
     * @param contactList
     * @param fields_set
     * @return
     */
    public static Collection customizeContactParameters(Collection contactList, LinkedHashSet<String> fields_set)
    {

	List<CustomFieldDef> fields = CustomFieldDefUtil.getCustomFieldsByScopeAndType(SCOPE.CONTACT,
		com.agilecrm.contact.CustomFieldDef.Type.DATE.toString());

	// Store date fields for easy verification. It is used to convert epoch
	// times into date values
	List<String> dateFields = new ArrayList<String>();

	for (CustomFieldDef def : fields)
	{
	    for (String field : fields_set)
	    {
		if (!field.contains("custom"))
		    continue;

		String field_name = field.split("custom_")[1];
		if (def.field_label.equals(field_name))
		    dateFields.add(field_name);
	    }
	}

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
		    ContactField contactField = contact.getContactField(field_name);

		    if (contactField == null)
			contactField = new ContactField();

		    fieldsMap.put(field_name, contactField);

		    contactProperties.add(fieldsMap);
		    System.out.println("contact property : " + fieldsMap);
		}
		else if (field.contains("custom"))
		{

		    String field_name = field.split("custom_")[1];
		    ContactField contactField = contact.getContactField(field_name);

		    String customFieldJSON = null;
		    try
		    {
			if (contactField == null)
			    contactField = new ContactField();

			if (dateFields.contains(field_name))
			{
			    try
			    {
				contactField.value = SearchUtil.getDateWithoutTimeComponent(Long
					.parseLong(contactField.value) * 1000);
			    }
			    catch (NumberFormatException e)
			    {
				e.printStackTrace();
			    }
			}

			customFieldJSON = new ObjectMapper().writeValueAsString(contactField);

			Map<String, Object> customField = new ObjectMapper().readValue(customFieldJSON,
				new TypeReference<HashMap<String, Object>>()
				{
				});

			customField.put("custom", true);

			contactProperties.add(customField);
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
			contactJSON = new JSONObject(mapper.writeValueAsString(contact));

			if ("lead_owner".equals(field))
			{
			    JSONObject owner = contactJSON.getJSONObject("owner");
			    fieldValue = owner.getString("name");
			}
			else
			{
			    fieldValue = contactJSON.get(field).toString();
			    
			    if (fieldValue.equals("0") && (field.equalsIgnoreCase("last_contacted") || field.equalsIgnoreCase("last_emailed") || field.equalsIgnoreCase("last_called")))
			    	fieldValue = " ";

			    if ((field.contains("time") || field.equalsIgnoreCase("last_contacted") || field.equalsIgnoreCase("last_emailed") || field.equalsIgnoreCase("last_called")) 
			    		&& !fieldValue.equals(" "))
				fieldValue = SearchUtil.getDateWithoutTimeComponent(Long.parseLong(fieldValue) * 1000);
			}

		    }
		    catch (Exception e)
		    {
			// TODO Auto-generated catch block
			e.printStackTrace();
		    }

		    LinkedHashMap<String, Object> fieldsMap = new LinkedHashMap<String, Object>();

		    System.out.println("field = " + field + "fieldValue = " + fieldValue);

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

    /**
     * Creates a deferred task to send report based on the report id sent
     * 
     * @param report_id
     */
    public static void sendReport(Long report_id)
    {
	ReportsInstantEmailDeferredTask reportsDeferredTask = new ReportsInstantEmailDeferredTask(report_id);

	Queue queue = QueueFactory.getDefaultQueue();

	// Add to queue
	queue.addAsync(TaskOptions.Builder.withPayload(reportsDeferredTask));
    }

    /**
     * Fetch all the Report entities which are reports email enabled and with
     * given duration.
     * 
     * @param duration
     * @return @l{@link List} of {@link Reports}
     * 
     */
    public static List<Reports> getAllReportsByDuration(String duration)
    {

	System.out.println("fetching the reports");
	return Reports.dao.ofy().query(Reports.class).filter("duration", duration).list();

    }

    public static List<Key<Reports>> getAllReportsKeysByDuration(String duration)
    {
	return Reports.dao.listKeysByProperty("duration", duration);
    }

    /**
     * Fetches all the available reports
     * 
     * @return {@link List} of {@link Reports}
     */
    public static List<Reports> fetchAllReports()
    {
	return Reports.dao.fetchAll();
    }

    public static List<Key<Reports>> fetchAllReportKeys()
    {
	return Reports.dao.listAllKeys();
    }

    /**
     * Get report based on given Id
     * 
     * @param id
     * @return {@link Reports}
     */
    public static Reports getReport(Long id)
    {
	try
	{
	    return Reports.dao.get(id);
	}
	catch (EntityNotFoundException e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static Long getAvailableEntitiesCountInReport(Long id)
    {
	Reports report = getReport(id);

	if (report == null)
	    return 0l;

	return report.getCount();
    }

    public static void check(Long startTime, Long endTime) throws PlanRestrictedException
    {
	JSONObject object = new JSONObject();
	try
	{
	    object.put("startTime", startTime);
	    object.put("endTime", endTime);
	}
	catch (JSONException e)
	{
	    return;
	}

	DaoBillingRestriction restriction = DaoBillingRestriction.getInstace(ClassEntities.Report.toString(), object);
	if (restriction.check())
	    return;

	BillingRestrictionUtil.throwLimitExceededException(ErrorMessages.REPORT, false);
    }

    public static Integer count()
    {
	return Reports.dao.count();
    }
    
    /**
     * 
     * @param json
     * @return
     * 
     * 	JsonObject containing calls separated by timerange
     * 
     * @throws Exception
     */
    public static net.sf.json.JSONObject getCallByTime(net.sf.json.JSONObject json)throws Exception{
    	
    	long minTime=0L;
		long maxTime=0L;
		String frequency=null;
		Long user=null;
		 String timeZone = "UTC";
		 UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();
	        if (userPrefs != null && userPrefs.timezone != null)
	        {
	            timeZone = userPrefs.timezone;
	        }
		net.sf.json.JSONObject callsPerPersonJSON=new net.sf.json.JSONObject();
		net.sf.json.JSONObject callsObject=new net.sf.json.JSONObject();
		List<Activity> activitieslist=null;
		List<DomainUser> domainUsersList=null;
		DomainUser dUser=DomainUserUtil.getCurrentDomainUser();
		if(dUser!=null)
			domainUsersList=DomainUserUtil.getUsers(dUser.domain);
		if(json!=null){
			if(json.getString("startDate")!=null)
				minTime = Long.valueOf(json.getString("startDate"));
			if(json.getString("endDate")!=null)
				maxTime = Long.valueOf(json.getString("endDate"))-1;
			if(json.getString("frequency")!=null)
				frequency=json.getString("frequency");
			if(json.containsKey("user")){
				if(json.getJSONArray("user")!=null){
			
				user=json.getJSONArray("user").getLong(0);

				domainUsersList=java.util.Arrays.asList(DomainUserUtil.getDomainUser(user)) ;
			
			}
			}
		}
		try{
				for(DomainUser domainUser : domainUsersList){
					List<Activity> callActivitiesList = ActivityUtil.getActivitiesByActivityType("CALL",domainUser.id,minTime,maxTime);
					if(callActivitiesList!=null && callActivitiesList.size() > 0)
					{
						if(activitieslist==null)
							activitieslist=callActivitiesList;
						else
						activitieslist.addAll(callActivitiesList);
					}
					
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}
			String type="";
				callsObject.put("answered", 0);
				callsObject.put("busy",0);
				callsObject.put("failed",0);
				callsObject.put("voicemails",0);
				callsObject.put("missed",0);
				callsObject.put("inquiry",0);
				callsObject.put("interest",0);
				callsObject.put("no interest",0);
				callsObject.put("interest referral",0);
				callsObject.put("meeting scheduled",0);
				callsObject.put("new oppurtunity",0);

				callsPerPersonJSON=initializeFrequencyForReports(minTime,maxTime,frequency,timeZone,callsObject);
			        try{
				for(Activity activity : activitieslist){
					String last="";
					
					   Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
			            calendar.setTimeInMillis(activity.time * 1000);
			            if(StringUtils.equalsIgnoreCase(frequency, "monthly")) 
			    			calendar.set(Calendar.DAY_OF_MONTH, 1);
			    		if(StringUtils.equalsIgnoreCase(frequency,"weekly"))
			    			{
			    			
			    			Iterator iter = callsPerPersonJSON.keys();
			    			while (iter.hasNext()) {
			    			    String key = (String) iter.next();
			    			    if((calendar.getTimeInMillis()/1000+"").compareToIgnoreCase(key.toString())>-1)
			    			     {
			    			    	last=key;
			    			    	continue;	
			    			     }
			    			    break;
			    			}
			    			
			    			}
			            calendar.set(Calendar.HOUR_OF_DAY, 0);
			            calendar.set(Calendar.MINUTE, 0);
			            calendar.set(Calendar.SECOND, 0);
			            calendar.set(Calendar.MILLISECOND, 0);
			            
			            String createdTime ;
			            if(StringUtils.equalsIgnoreCase(frequency,"weekly"))
			            	createdTime=last;
			            else
			            	createdTime= (calendar.getTimeInMillis() / 1000) + "";
			            if (callsPerPersonJSON.containsKey(createdTime))
			            {
			            	net.sf.json.JSONObject count = callsPerPersonJSON.getJSONObject(createdTime);
		                    if(activity.custom3!=null && (activity.custom3.equalsIgnoreCase(Call.ANSWERED) || activity.custom3.equalsIgnoreCase("completed")))
		                    	{	
		                    		type=Call.ANSWERED;
		                    	}
							else if(activity.custom3!=null && (activity.custom3.equalsIgnoreCase(Call.BUSY) || activity.custom3.equalsIgnoreCase(Call.NO_ANSWER)))
							{
								type=Call.BUSY;
	                    		
	                    	}
							else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.FAILED))
							{
		                    	type=Call.FAILED;
	                    	}
							else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.VOICEMAIL))
							{
		                    	type=Call.VOICEMAIL;
	                    	}
							else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.Missed))
							{
		                    	type=Call.Missed;
	                    	}
							else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.NewOppurtunity))
							{
		                    	type=Call.NewOppurtunity;
	                    	}
							else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.MeetingScheduled))
							{
		                    	type=Call.MeetingScheduled;
	                    	}
							else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.Inquiry))
							{
		                    	type=Call.Inquiry;
	                    	}
							else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.IncorrectReferral))
							{
		                    	type=Call.IncorrectReferral;
	                    	}
							else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.Interest))
							{
		                    	type=Call.Interest;
	                    	}
							else if(activity.custom3!=null && activity.custom3.equalsIgnoreCase(Call.NoInterest))
							{
		                    	type=Call.NoInterest;
	                    	}
		                    int count1=count.getInt(type);
                    		count1++;
                    		count.put(type,count1);
		                    callsPerPersonJSON.put(createdTime, count);
			            }
				}
			        }
			        catch(Exception e){
			    		e.printStackTrace();
			    	}
    	return callsPerPersonJSON;
 
    }
    
    /*
     * param minTime,maxTime,frequency,timeZone,json
     * Initializes jsonobject with date range based on frequency filter for graphs
     * 
     * return JsonObject
     */
    
    public static net.sf.json.JSONObject initializeFrequencyForReports(long minTime,long maxTime,String frequency,String timeZone,net.sf.json.JSONObject json){
    	net.sf.json.JSONObject final_json=new net.sf.json.JSONObject();
    	 Calendar startCalendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
	        startCalendar.setTimeInMillis(minTime * 1000);
	        

	        // Sets calendar with end time.
	        Calendar endCalendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
	        endCalendar.setTimeInMillis(maxTime * 1000);
	        if (StringUtils.equalsIgnoreCase(frequency, "monthly"))
			 {
	        	startCalendar.set(Calendar.DAY_OF_MONTH, 1);
	        	endCalendar.set(Calendar.DAY_OF_MONTH, 1);
			 }
	        long startTimeMilli = startCalendar.getTimeInMillis();
	        long endTimeMilli = endCalendar.getTimeInMillis();
	        while (startTimeMilli <= endTimeMilli)
	        {
	        	 String createdTime = (startCalendar.getTimeInMillis() / 1000) + "";
	        	 final_json.put(createdTime, json);
	        	 if (StringUtils.equalsIgnoreCase(frequency, "daily"))
	 			{
	 			startCalendar.add(Calendar.DAY_OF_MONTH, 1);
	 			}
	             if (StringUtils.equalsIgnoreCase(frequency, "monthly"))
	             {
	 			startCalendar.add(Calendar.MONTH, 1);
	 			startCalendar.set(Calendar.DAY_OF_MONTH, 1);
	             }
	             if (StringUtils.equalsIgnoreCase(frequency, "weekly"))
	             {
	             startCalendar.add(Calendar.WEEK_OF_YEAR, 1);
	             }
	             startCalendar.set(Calendar.HOUR_OF_DAY, 0);
	             startCalendar.set(Calendar.MINUTE, 0);
	             startCalendar.set(Calendar.SECOND, 0);
	             startCalendar.set(Calendar.MILLISECOND, 0);
	             startTimeMilli = startCalendar.getTimeInMillis();
	        }
	        return final_json;
    }
}