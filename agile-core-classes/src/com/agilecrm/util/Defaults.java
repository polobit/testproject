package com.agilecrm.util;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.Task.PriorityType;
import com.agilecrm.activities.Task.Type;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.Reports.Duration;
import com.agilecrm.reports.Reports.ReportType;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.search.ui.serialize.SearchRule.RuleType;
import com.agilecrm.session.SessionManager;
import com.agilecrm.ticket.utils.TicketFiltersUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.triggers.Trigger;

public class Defaults
{
    public Defaults()
    {
	saveDefaultContacts();
	saveDefaultTasks();
	saveDefaultEvents();
	saveDefaultDeals();
	saveDefaultReports();
	saveDefaultNotes();
	TicketFiltersUtil.saveDefaultFilters();
	//saveDefaultWorkflowsAndTriggers();
	//TicketsUtil.createDefaultTicket();
    }

	/**
     * Creates default Contacts.
     */
    private void saveDefaultContacts()
    {
	LinkedHashSet<String> tags = new LinkedHashSet<String>();
	tags.add("Business guy");
	tags.add("US");
	tags.add("Donuts");
	List<ContactField> contactFields = new ArrayList<ContactField>();
	contactFields.add(new ContactField(Contact.FIRST_NAME, "Homer", null));
	contactFields.add(new ContactField(Contact.LAST_NAME, "Simpson", null));
	contactFields.add(new ContactField(Contact.EMAIL, "homer@simpson.com", "work"));
	contactFields.add(new ContactField(Contact.COMPANY, "Springfield Nuclear Power Plant", null));
	contactFields.add(new ContactField(Contact.TITLE, "Nuclear Safety Inspector", null));
	contactFields.add(new ContactField("website", "http://www.thesimpsons.com/", "URL"));
	contactFields.add(new ContactField("phone", "+1-214-124-8756", ""));
	contactFields.add(new ContactField("address",
		"{\"address\":\"742 Evergreen Terrace\",\"city\":\"Springfield\",\"country\":\"US\"}", "home"));
	contactFields.add(new ContactField("image",
		"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1395904537756?id=contact-container", null));

	Contact contact = new Contact(Contact.Type.PERSON, tags, contactFields);
	contact.lead_score = 50;
	contact.star_value = 4;
	contact.save();

	LinkedHashSet<String> tags1 = new LinkedHashSet<String>();
	tags1.add("Sports");
	List<ContactField> contactFields1 = new ArrayList<ContactField>();
	contactFields1.add(new ContactField(Contact.FIRST_NAME, "Michael", null));
	contactFields1.add(new ContactField(Contact.LAST_NAME, "Jordan", null));
	contactFields1.add(new ContactField(Contact.EMAIL, "sixfeetsix@nba.com", "work"));
	contactFields1.add(new ContactField(Contact.COMPANY, "NBA", null));
	contactFields1.add(new ContactField(Contact.TITLE, "Sports Legend", null));
	contactFields1.add(new ContactField("image",
		"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1371205956656?id=contact-container", null));

	Contact contact1 = new Contact(Contact.Type.PERSON, tags1, contactFields1);
	contact1.star_value = 3;
	contact1.lead_score = 10;
	contact1.save();

	List<ContactField> contactFields3 = new ArrayList<ContactField>();
	contactFields3.add(new ContactField(Contact.NAME, "Apple", null));
	contactFields3.add(new ContactField(Contact.URL, "https://www.apple.com", null));
	contactFields3
		.add(new ContactField("address",
			"{\"address\":\"1 Infinite Loop\",\"city\":\"Cupertino\",\"state\":\"CA\",\"zip\":\"95014\"}",
			"office"));
	Contact contact3 = new Contact();
	contact3.type = Contact.Type.COMPANY;
	contact3.properties = contactFields3;
	contact3.save();
    }

    /**
     * Creates default Tasks.
     */
    private void saveDefaultTasks()
    {
	Task task = new Task();
	task.subject = "Give feedback about Agile";
	task.is_complete = false;
	task.type = Type.SEND.toString();
	task.priority_type = PriorityType.HIGH;
	DateUtil date = new DateUtil().addDays(15).toMidnight().addMinutes(16 * 60);
	task.due = date.getTime().getTime() / 1000;
	task.owner_id = String.valueOf(SessionManager.get().getDomainId());
	task.save();

	Task task1 = new Task();
	task1.subject = "<a href=\"https://www.facebook.com/crmagile\" target=\"_blank\" rel=\"nofollow\" title=\"Link: https://www.facebook.com/crmagile\">Like Agile on Facebook</a>";
	task1.is_complete = false;
	task1.type = Type.SEND.toString();
	task1.priority_type = PriorityType.LOW;
	DateUtil date1 = new DateUtil().addDays(1).toMidnight().addMinutes(16 * 60);
	task1.due = date1.getTime().getTime() / 1000;
	task1.owner_id = String.valueOf(SessionManager.get().getDomainId());
	task1.save();

	Task task2 = new Task();
	task2.subject = "Call Grandmother";
	task2.is_complete = false;
	task2.type = Type.CALL.toString();
	task2.priority_type = PriorityType.NORMAL;
	DateUtil date2 = new DateUtil().addDays(2).toMidnight().addMinutes(16 * 60);
	task2.due = date2.getTime().getTime() / 1000;
	task2.owner_id = String.valueOf(SessionManager.get().getDomainId());
	task2.save();

	Task task3 = new Task();
	task3.subject = "<a href=\"https://twitter.com/share?url=https%3A%2F%2Fwww.agilecrm.com&amp;text=Sell%20like%20Fortune%20500%20with%20%23AgileCRM%20-%20\" target=\"_blank\"rel=\"nofollow\" title=\"Link: https://twitter.com/share?url=https%3A%2F%2Fwww.agilecrm.com&amp;text=Sell%20like%20Fortune%20500%20with%20%23AgileCRM%20-%20\">Tweet about Agile</a>";
	task3.is_complete = false;
	task3.type = Type.TWEET.toString();
	task3.priority_type = PriorityType.NORMAL;
	DateUtil date3 = new DateUtil().addMinutes(60);
	task3.due = date3.getTime().getTime() / 1000;
	task3.owner_id = String.valueOf(SessionManager.get().getDomainId());
	task3.save();

	Task task4 = new Task();
	task4.subject = "Meet Homer to finalize the Deal (Bring Donuts!)";
	task4.is_complete = false;
	task4.type = Type.MEETING.toString();
	task4.priority_type = PriorityType.HIGH;
	DateUtil date4 = new DateUtil().addDays(5).toMidnight().addMinutes(16 * 60);
	task4.due = date4.getTime().getTime() / 1000;
	task4.owner_id = String.valueOf(SessionManager.get().getDomainId());
	if (ContactUtil.searchContactByEmail("homer@simpson.com") == null)
	    return;
	task4.addContacts(String.valueOf(ContactUtil.searchContactByEmail("homer@simpson.com").id));
	task4.save();
    }

    /**
     * Creates default Events.
     */
    private void saveDefaultEvents()
    {
	Event event = new Event();
	event.title = "Gossip at water cooler";
	event.color = "green";
	event.allDay = false;
	DateUtil date = new DateUtil().toMidnight().addDays(0).addMinutes(16 * 60);
	event.start = date.getTime().getTime() / 1000;
	event.end = date.getTime().getTime() / 1000 + 900;
	if (ContactUtil.searchContactByEmail("homer@simpson.com") == null)
	    return;
	event.addContacts(String.valueOf(ContactUtil.searchContactByEmail("homer@simpson.com").id));
	event.save();

	Event event1 = new Event();
	event1.title = "Discuss today's Dilbert strip";
	event1.color = "blue";
	event1.allDay = false;
	DateUtil date1 = new DateUtil().toMidnight().addDays(1).addMinutes(18 * 60);
	event1.start = date1.getTime().getTime() / 1000;
	event1.end = date1.getTime().getTime() / 1000 + 1800;
	event1.save();
    }

    /**
     * Creates default Deal.
     */
    private void saveDefaultDeals()
    {
	Milestone milestone = MilestoneUtil.getDefaultMilestones();
	Opportunity deal = new Opportunity();
	deal.name = "Nike Endorsement";
	deal.description = "Advertisements and apparel for Nike";
	deal.expected_value = 2000000d;
	deal.probability = 98;
	deal.pipeline_id = milestone.id;
	deal.milestone = "Proposal";
	DateUtil date = new DateUtil().toMidnight().addDays(20);
	deal.close_date = date.getTime().getTime() / 1000;
	/*
	 * List<Contact> contacts = ContactUtil.getAllContacts(); for (Contact
	 * contact : contacts) {
	 * deal.contact_ids.add(String.valueOf(contact.id)); }
	 */
	if (ContactUtil.searchContactByEmail("sixfeetsix@nba.com") == null)
	    return;
	deal.addContactIds(String.valueOf(ContactUtil.searchContactByEmail("sixfeetsix@nba.com").id));
	deal.save();

	Opportunity deal1 = new Opportunity();
	deal1.name = "Donuts!";
	deal1.description = "Donut ingrediants for Homer's new shop he wants to setup. He is offering contracts for the raw products.";
	deal1.expected_value = 10000d;
	deal1.probability = 75;
	deal1.pipeline_id = milestone.id;
	deal1.milestone = "Won";
	DateUtil date1 = new DateUtil().toMidnight().addDays(10);
	deal1.close_date = date1.getTime().getTime() / 1000;
	if (ContactUtil.searchContactByEmail("homer@simpson.com") == null)
	    return;
	deal1.addContactIds(String.valueOf(ContactUtil.searchContactByEmail("homer@simpson.com").id));
	deal1.save();
    }

    /**
     * Creates default Report.
     */
    private void saveDefaultReports()
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

    /**
     * Creates default Notes.
     */
    private void saveDefaultNotes()
    {
	Note note = new Note();
	note.subject = "New Business Deal with Homer";
	note.description = "Interested in offering a contract for atleast 200kg of imported chocolated from Ghana and 100kg of Kopi Luwak coffee seeds from Indonesia every month. If satisfied with products will offer a contract for all his raw product needs.";
	note.entity_type = "note";
	if (ContactUtil.searchContactByEmail("homer@simpson.com") == null)
	    return;
	note.addContactIds(String.valueOf(ContactUtil.searchContactByEmail("homer@simpson.com").id));
	note.save();

	Note note1 = new Note();
	note1.subject = "Quotes on Raw Materials";
	note1.description = "Sent three different quotes to Homer regarding the raw products. Each quote differ on the consignment sizes depending on the frequency of delivery.";
	note1.entity_type = "note";
	if (ContactUtil.searchContactByEmail("homer@simpson.com") == null)
	    return;
	note1.addContactIds(String.valueOf(ContactUtil.searchContactByEmail("homer@simpson.com").id));
	note1.save();
    }
    
    /**
     * 
     */
    private void saveDefaultWorkflowsAndTriggers()
   	{
    	Workflow setSLAWorkflow = new Workflow("New ticket set SLA", FileStreamUtil.readResource("misc/campaign-templates/tickets/ticket_set_sla.js"));
    	setSLAWorkflow.is_disabled = true;
    	setSLAWorkflow.save();
    	
    	Trigger setSLATrigger = new Trigger("New ticket set SLA", Trigger.Type.NEW_TICKET_IS_ADDED, setSLAWorkflow.id);
    	setSLATrigger.is_disabled = true;
    	setSLATrigger.save();
    	
    	Workflow newTicketWorkflow = new Workflow("New ticket notification", FileStreamUtil.readResource("misc/campaign-templates/tickets/new_ticket_acknowledgement.js"));
    	newTicketWorkflow.is_disabled = true;
    	newTicketWorkflow.save();
    	
    	Trigger newTicketTrigger = new Trigger("New ticket added", Trigger.Type.NEW_TICKET_IS_ADDED, newTicketWorkflow.id);
    	newTicketTrigger.is_disabled = true;
    	newTicketTrigger.save();
   	}
}