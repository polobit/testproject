package com.agilecrm;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.Task.PriorityType;
import com.agilecrm.activities.Task.Type;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.Reports.Duration;
import com.agilecrm.reports.Reports.ReportType;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.search.ui.serialize.SearchRule.RuleType;
import com.agilecrm.session.SessionManager;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.Util;
import com.agilecrm.workflows.Workflow;

public class InitDefaults
{
    public InitDefaults()
    {
	getDefaultContacts();
	getDefaultTasks();
	getDefaultEvent();
	getDefaultWorkflow();
	getDefaultReport();

    }

    /**
     * Creates default Contacts.
     */
    private static void getDefaultContacts()
    {
	LinkedHashSet<String> tags = new LinkedHashSet<String>();
	tags.add("Business Owner");
	tags.add("Frequent Buyer");
	List<ContactField> contactFields = new ArrayList<ContactField>();
	contactFields.add(new ContactField(Contact.FIRST_NAME, null, "Steve"));
	contactFields.add(new ContactField(Contact.LAST_NAME, null, "Jobs"));
	contactFields.add(new ContactField(Contact.EMAIL, "work",
		"theboss@apple.com"));
	contactFields.add(new ContactField(Contact.COMPANY, null, "Apple"));
	contactFields.add(new ContactField(Contact.TITLE, null, "CEO"));
	contactFields.add(new ContactField("website", "TWITTER",
		"@stevejobsceo"));
	contactFields
		.add(new ContactField(
			"address",
			"office",
			"{\"address\":\"1 Infinite Loop\",\"city\":\"Cupertino\",\"state\":\"CA\",\"zip\":\"95014\"}"));
	contactFields
		.add(new ContactField(
			"image",
			null,
			"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1370348163437?id=contact-container"));

	Contact contact = new Contact(Contact.Type.PERSON, tags, contactFields);
	contact.lead_score = 50;
	contact.save();

	LinkedHashSet<String> tags1 = new LinkedHashSet<String>();
	tags1.add("Sports");
	List<ContactField> contactFields1 = new ArrayList<ContactField>();
	contactFields1
		.add(new ContactField(Contact.FIRST_NAME, null, "Michael"));
	contactFields1.add(new ContactField(Contact.LAST_NAME, null, "Jordan"));
	contactFields1.add(new ContactField(Contact.EMAIL, "work",
		"sixfeetsix@nba.com"));
	contactFields1.add(new ContactField(Contact.COMPANY, null, "NBA"));
	contactFields1.add(new ContactField(Contact.TITLE, null,
		"Sports Legend"));
	contactFields1
		.add(new ContactField(
			"image",
			null,
			"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1370348116218?id=contact-container"));

	Contact contact1 = new Contact(Contact.Type.PERSON, tags1,
		contactFields1);
	contact1.lead_score = 10;
	contact1.save();

	LinkedHashSet<String> tags2 = new LinkedHashSet<String>();
	tags2.add("Activist");
	List<ContactField> contactFields2 = new ArrayList<ContactField>();
	contactFields2.add(new ContactField(Contact.FIRST_NAME, null,
		"Mohandas"));
	contactFields2.add(new ContactField(Contact.LAST_NAME, null, "Gandhi"));
	contactFields2.add(new ContactField(Contact.EMAIL, "work",
		"passiveaggressivemonk@pietermaritzburg.org"));
	contactFields2.add(new ContactField(Contact.TITLE, null,
		"Philanthropist"));
	contactFields2
		.add(new ContactField(
			"image",
			null,
			"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1370348006468?id=contact-container"));
	Contact contact2 = new Contact(Contact.Type.PERSON, tags2,
		contactFields2);
	contact2.lead_score = 10;
	contact2.save();

	List<ContactField> contactFields3 = new ArrayList<ContactField>();
	contactFields3.add(new ContactField(Contact.NAME, null, "Apple"));
	contactFields3.add(new ContactField(Contact.URL, null,
		"https://www.apple.com"));
	contactFields3
		.add(new ContactField(
			"address",
			"office",
			"{\"address\":\"1 Infinite Loop\",\"city\":\"Cupertino\",\"state\":\"CA\",\"zip\":\"95014\"}"));
	Contact contact3 = new Contact();
	contact3.type = Contact.Type.COMPANY;
	contact3.properties = contactFields3;
	contact3.save();

    }

    /**
     * Creats default Tasks.
     */
    private static void getDefaultTasks()
    {
	Task task = new Task();
	task.subject = "Give feedback on Agile";
	task.is_complete = false;
	task.type = Type.SEND;
	task.priority_type = PriorityType.HIGH;
	DateUtil date = new DateUtil().addDays(15).toMidnight()
		.addMinutes(16 * 60);
	task.due = date.getTime().getTime() / 1000;
	task.contacts = new ArrayList<String>();
	task.owner_id = String.valueOf(SessionManager.get().getDomainId());
	task.save();

	Task task1 = new Task();
	task1.subject = "Like Agile on Facebook";
	task1.is_complete = false;
	task1.type = Type.SEND;
	task1.priority_type = PriorityType.LOW;
	DateUtil date1 = new DateUtil().addDays(1).toMidnight()
		.addMinutes(16 * 60);
	task1.due = date1.getTime().getTime() / 1000;
	task1.owner_id = String.valueOf(SessionManager.get().getDomainId());
	task1.save();

	Task task2 = new Task();
	task2.subject = "Call Grandmother";
	task2.is_complete = false;
	task2.type = Type.CALL;
	task2.priority_type = PriorityType.NORMAL;
	DateUtil date2 = new DateUtil().addDays(2).toMidnight()
		.addMinutes(16 * 60);
	task2.due = date2.getTime().getTime() / 1000;
	task2.owner_id = String.valueOf(SessionManager.get().getDomainId());
	task2.save();
    }

    /**
     * Creates default Event.
     */
    private static void getDefaultEvent()
    {
	Event event = new Event();
	event.title = "Gossip at water cooler";
	event.color = "green";
	event.allDay = false;
	DateUtil date = new DateUtil().toMidnight().addDays(1)
		.addMinutes(16 * 60);

	event.start = date.getTime().getTime() / 1000;
	event.end = date.getTime().getTime() / 1000 + 1800;
	event.save();
    }

    /**
     * Creates default Workflows.
     */
    private static void getDefaultWorkflow()
    {
	Workflow workflow = new Workflow(
		"Sample Auto Responder",
		Util.readResource("misc/campaign-strings/sample_auto_responder.txt"));
	workflow.save();

	Workflow workflow1 = new Workflow(
		"Sample Cart Abandonment",
		Util.readResource("misc/campaign-strings/sample_cart_abandonment.txt"));
	workflow1.save();

	Workflow workflow2 = new Workflow(
		"Sample Email & Social Campaign",
		Util.readResource("misc/campaign-strings/sample_email_n_social_campaign.txt"));
	workflow2.save();

    }

    /**
     * Creates default Report.
     */
    private static void getDefaultReport()
    {
	Reports report = new Reports();
	report.duration = Duration.DAILY;
	report.name = "New Contacts";
	report.sendTo = SessionManager.get().getEmail();
	report.report_type = ReportType.Contact;

	LinkedHashSet<String> fields = new LinkedHashSet<String>();
	fields.add("properties_image");
	fields.add("properties_first_name");
	fields.add("properties_last_name");
	fields.add("properties_email");
	report.fields_set = fields;

	SearchRule rule = new SearchRule();
	rule.LHS = "created_time";
	rule.CONDITION = RuleCondition.LAST;
	rule.RHS = "1";
	rule.ruleType = RuleType.Contact;
	ArrayList<SearchRule> rulelist = new ArrayList<SearchRule>();
	rulelist.add(rule);
	report.rules = rulelist;

	report.save();

    }

    public static void setFirstTimerCookie(HttpServletResponse response)
    {
	JSONObject tourJson = new JSONObject();
	try
	{
	    tourJson.put("contacts", true);
	    tourJson.put("contact-details", true);
	    tourJson.put("workflows", true);
	    tourJson.put("calendar", true);
	    tourJson.put("workflows-add", true);

	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	System.out.println(tourJson.toString());
	Cookie tourCookie = new Cookie("agile_tour", tourJson.toString());
	tourCookie.setPath("/");
	response.addCookie(tourCookie);
    }

}