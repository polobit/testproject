package com.agilecrm.util;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.Task.PriorityType;
import com.agilecrm.activities.Task.Status;
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
    	
    	//Companies default.
	
	    List<ContactField> companyFields1 = new ArrayList<ContactField>();
		companyFields1.add(new ContactField(Contact.NAME, "Hollywood", null));
		Contact company1 = new Contact();
		company1.type = Contact.Type.COMPANY;
		company1.properties = companyFields1;
		company1.star_value = 0;
		company1.lead_score = 0;
		company1.save();
		
		LinkedHashSet<String> companiesTags4 = new LinkedHashSet<String>();
		companiesTags4.add("Sample Company");
	
		List<ContactField> companyFields4 = new ArrayList<ContactField>();
		companyFields4.add(new ContactField(Contact.NAME, "Springfield Nuclear Power Plant", null));	
		companyFields4
			.add(new ContactField("address",
				"{\"address\":\"100 Industrial Way\",\"city\":\"Springfield\", \"country\":\"US\"}",
				"office"));				
	
		Contact company4 = new Contact(Contact.Type.COMPANY, companiesTags4, companyFields4);	
		company4.star_value = 3;
		company4.lead_score = 43;
		company4.save();
	
		LinkedHashSet<String> companiesTags5 = new LinkedHashSet<String>();
		companiesTags5.add("Sample Company");
	
		List<ContactField> companyFields5 = new ArrayList<ContactField>();
		companyFields5.add(new ContactField(Contact.NAME, "NBA", null));
	
		companyFields5.add(new ContactField(Contact.URL, "http://www.nba.com/", null));
		companyFields5.add(new ContactField("phone", "(212) 407-8000", "primary"));	
		companyFields5.add(new ContactField("phone", "(212) 832-3861", "fax"));	
		companyFields5
			.add(new ContactField("address",
				"{\"address\":\"Olympic Tower, 645 5th Ave\",\"city\":\"New York\",\"state\":\"NY\",\"zip\":\"10022\", \"country\":\"US\"}",
				"office"));
		companyFields5.add(new ContactField("image",
			"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1462862094735?id=contact-container", null));
	
		Contact company5 = new Contact(Contact.Type.COMPANY, companiesTags5, companyFields5);	
		company5.star_value = 5;
		company5.lead_score = 749;
		company5.save();
	
		LinkedHashSet<String> companiesTags6 = new LinkedHashSet<String>();
		companiesTags5.add("Sample Company");
		List<ContactField> companyFields6 = new ArrayList<ContactField>();
		companyFields6.add(new ContactField(Contact.NAME, "Caltech", null));
		companyFields6.add(new ContactField(Contact.URL, "https://www.caltech.edu/", null));
		companyFields6.add(new ContactField(Contact.EMAIL, "mr@caltech.edu", "primary"));	
		companyFields6.add(new ContactField("phone", "(626) 395-6811", "primary"));	
		companyFields6.add(new ContactField("address",
				"{\"address\":\"1200 EAST CALIFORNIA BOULEVARD\",\"city\":\"PASADENA\",\"state\":\"CALIFORNIA\",\"zip\":\"91125\", \"country\":\"US\"}",
				"office"));
		companyFields5.add(new ContactField("image",
			"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1462862153566?id=contact-container", null));
	
		Contact company6 = new Contact(Contact.Type.COMPANY, companiesTags6, companyFields6);	
		company6.star_value = 4;
		company6.lead_score = 813;
		company6.save();
    	
	    //Contacts default.
		LinkedHashSet<String> tags = new LinkedHashSet<String>();
		tags.add("Sample Contact");
		tags.add("Comic");
		List<ContactField> contactFields = new ArrayList<ContactField>();
		contactFields.add(new ContactField(Contact.FIRST_NAME, "Charlie", null));
		contactFields.add(new ContactField(Contact.LAST_NAME, "Chaplin", null));
		contactFields.add(new ContactField(Contact.COMPANY, "Hollywood", null));		
		contactFields.add(new ContactField(Contact.TITLE, "Actor", null));
		contactFields.add(new ContactField("website", "http://www.charliechaplin.com/", "URL"));	
		contactFields.add(new ContactField("address",
			"{\"address\":\"\",\"city\":\"London\",\"country\":\"GB\"}", "home"));
		contactFields.add(new ContactField("image",
			"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1462861291650?id=contact-container", null));
	
		Contact contact = new Contact(Contact.Type.PERSON, tags, contactFields);
		contact.lead_score = 1357;
		contact.star_value = 5;
		contact.save();
	
		LinkedHashSet<String> tags1 = new LinkedHashSet<String>();
		tags1.add("Sample Contact");
		tags1.add("SixFeetSix");
		tags1.add("Chicago Bulls");
		List<ContactField> contactFields1 = new ArrayList<ContactField>();
		contactFields1.add(new ContactField(Contact.FIRST_NAME, "Michael", null));
		contactFields1.add(new ContactField(Contact.LAST_NAME, "Jordan", null));
		contactFields1.add(new ContactField(Contact.EMAIL, "mj@nba.com", "work"));
		contactFields1.add(new ContactField(Contact.COMPANY, "NBA", null));				
		contactFields1.add(new ContactField("website", "http://www.nba.com/history/legends/michael-jordan/", "URL"));
		contactFields1.add(new ContactField(Contact.TITLE, "Basketball Player", null));
		contactFields1.add(new ContactField("address",
				"{\"address\":\"676 North Michigan Avenue, Suite 293\",\"state\":\"IL\",\"city\":\"London\",\"zip\":\"60611\",\"country\":\"US\"}", "home"));
		contactFields1.add(new ContactField("image",
			"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1462861440616?id=contact-container", null));
	
		Contact contact1 = new Contact(Contact.Type.PERSON, tags1, contactFields1);
		contact1.star_value = 5;
		contact1.lead_score = 9851;
		contact1.save();
	
	    LinkedHashSet<String> tags2 = new LinkedHashSet<String>();
		tags2.add("Sample Contact");
		tags2.add("Bazinga");
		List<ContactField> contactFields2 = new ArrayList<ContactField>();
		contactFields2.add(new ContactField(Contact.FIRST_NAME, "Sheldon", null));
		contactFields2.add(new ContactField(Contact.LAST_NAME, "Cooper", null));
		contactFields2.add(new ContactField(Contact.EMAIL, "sheldon@caltech.com", "work"));
		contactFields2.add(new ContactField(Contact.EMAIL, "sheldon@gmail.com", "home"));			
		contactFields2.add(new ContactField(Contact.COMPANY, "Caltech", null));
		contactFields2.add(new ContactField("website", "http://the-big-bang-theory.com/characters.Sheldon/", "URL"));
		contactFields2.add(new ContactField("website", "https://twitter.com/therealsheldonc", "TWITTER"));
		contactFields2.add(new ContactField(Contact.TITLE, "Theoretical Physicist", null));
		contactFields2.add(new ContactField("address",
				"{\"address\":\"2311 North Los Robles Avenue\", \"city\":\"Pasadena\", \"state\":\"CA\", \"country\":\"US\", \"zip\":\"60611\"}", "home"));
		contactFields2.add(new ContactField("image",
			"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1462861529884?id=contact-container", null));
	
		Contact contact2 = new Contact(Contact.Type.PERSON, tags2, contactFields2);
		contact2.star_value = 5;
		contact2.lead_score = 8734;
		contact2.save();
		
		LinkedHashSet<String> tags3 = new LinkedHashSet<String>();
		tags3.add("Sample Contact");
		tags3.add("Donuts");
		List<ContactField> contactFields3 = new ArrayList<ContactField>();
		contactFields3.add(new ContactField(Contact.FIRST_NAME, "Homer", null));
		contactFields3.add(new ContactField(Contact.LAST_NAME, "Simpson", null));
		contactFields3.add(new ContactField(Contact.EMAIL, "homer@snpp.com", "work"));
		contactFields3.add(new ContactField(Contact.EMAIL, "homer.simpson@yahoo.com", "home"));
		companyFields6.add(new ContactField("phone", "1-888", "work"));	
		contactFields3.add(new ContactField(Contact.COMPANY, "Springfield Nuclear Power Plant", null));
		contactFields3.add(new ContactField("website", "http://the-big-bang-theory.com/characters.Sheldon/", "URL"));
		contactFields3.add(new ContactField("website", "https://twitter.com/therealsheldonc", "TWITTER"));
		contactFields3.add(new ContactField(Contact.TITLE, "Safety Inspector", null));
		contactFields3.add(new ContactField("address",
				"{\"address\":\"742 Evergreen Terrace\", \"city\":\"Springfield\", \"country\":\"US\"}", "home"));
		contactFields3.add(new ContactField("image",
			"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1462861601876?id=contact-container", null));
	
		Contact contact3 = new Contact(Contact.Type.PERSON, tags3, contactFields3);
		contact3.star_value = 5;
		contact3.lead_score = 8734;
		contact3.save();
	
    }

    /**
     * Creates default Tasks.
     */
    private void saveDefaultTasks()
    {
		Task task = new Task();
		task.subject = "Tweet about Agile";
		task.is_complete = false;
		task.type = Type.TWEET.toString();
		task.priority_type = PriorityType.HIGH;
		task.status = Status.YET_TO_START;
		DateUtil date = new DateUtil().addDays(-15).toMidnight().addMinutes(16 * 60);
		task.due = date.getTime().getTime() / 1000;
		task.owner_id = String.valueOf(SessionManager.get().getDomainId());
		if (ContactUtil.searchContactByPesonName("charlie") != null){			
			task.addContacts(String.valueOf(ContactUtil.searchContactByPesonName("charlie").id));
		}
		task.save();		
	
		Task task1 = new Task();
		task1.subject = "Like Agile on Facebook";
		task1.is_complete = false;
		task1.type = Type.SEND.toString();
		task1.priority_type = PriorityType.NORMAL;
		task1.status = Status.YET_TO_START;
		DateUtil date1 = new DateUtil().addDays(1).toMidnight().addMinutes(16 * 60);
		task1.due = date1.getTime().getTime() / 1000;
		task1.owner_id = String.valueOf(SessionManager.get().getDomainId());
		if (ContactUtil.searchContactByEmail("mj@nba.com") != null){			
			task1.addContacts(String.valueOf(ContactUtil.searchContactByEmail("mj@nba.com").id));
		}
		task1.save();
		
		Task task2 = new Task();
		task2.subject = "Give feedback about Agile";
		task2.is_complete = false;
		task2.type = Type.SEND.toString();
		task2.priority_type = PriorityType.LOW;
		task2.status = Status.YET_TO_START;
		DateUtil date2 = new DateUtil().addDays(2).toMidnight().addMinutes(16 * 60);
		task2.due = date2.getTime().getTime() / 1000;
		task2.owner_id = String.valueOf(SessionManager.get().getDomainId());
		if (ContactUtil.searchContactByEmail("homer@snpp.com") != null){
			task2.addContacts(String.valueOf(ContactUtil.searchContactByEmail("homer@snpp.com").id));
		}
		task2.save();
	
		Task task3 = new Task();
		task3.subject = "Recommend Agile";
		task3.is_complete = false;
		task3.type = Type.EMAIL.toString();
		task3.priority_type = PriorityType.NORMAL;
		task3.status = Status.YET_TO_START;
		DateUtil date3 = new DateUtil().addDays(15).toMidnight().addMinutes(16 * 60);
		task3.due = date3.getTime().getTime() / 1000;
		task3.owner_id = String.valueOf(SessionManager.get().getDomainId());		
		if (ContactUtil.searchContactByEmail("sheldon@caltech.com") != null){
			task3.addContacts(String.valueOf(ContactUtil.searchContactByEmail("sheldon@caltech.com").id));
		}					
		task3.save();
		
    }

    /**
     * Creates default Events.
     */
    private void saveDefaultEvents()
    {
		Event event = new Event();
		event.title = "Week ahead";
		event.color = "#36C";
		event.allDay = false;
		DateUtil date = new DateUtil().toMidnight().addDays(0).addMinutes(16 * 60);
		event.start = date.getTime().getTime() / 1000;
		event.end = date.getTime().getTime() / 1000 + 900;
		if (ContactUtil.searchContactByEmail("mj@nba.com") != null){		    
			event.addContacts(String.valueOf(ContactUtil.searchContactByEmail("mj@nba.com").id));
		}
		event.save();		
		
		Event event1 = new Event();
		event1.title = "Water cooler discussion";
		event1.color = "green";
		event1.allDay = false;
		DateUtil date1 = new DateUtil().toMidnight().addDays(1).addMinutes(18 * 60);
		event1.start = date1.getTime().getTime() / 1000;
		event1.end = date1.getTime().getTime() / 1000 + 1800;
		if (ContactUtil.searchContactByEmail("mj@nba.com") != null){
			event1.addContacts(String.valueOf(ContactUtil.searchContactByEmail("mj@nba.com").id));
		}		    		
		event1.save();
		
		Event event2 = new Event();
		event2.title = "Lunch meeting with Kripke";
		event2.color = "green";
		event2.allDay = false;
		DateUtil date2 = new DateUtil().toMidnight().addDays(2).addMinutes(18 * 60);
		event2.start = date2.getTime().getTime() / 1000;
		event2.end = date2.getTime().getTime() / 1000 + 1800;
		if (ContactUtil.searchContactByEmail("sheldon@caltech.com") != null){			
			event2.addContacts(String.valueOf(ContactUtil.searchContactByEmail("sheldon@caltech.com").id));
		}
		event2.save();
		
		Event event3 = new Event();
		event3.title = "Power Plant Inspection";
		event3.color = "red";
		event3.allDay = false;
		DateUtil date3 = new DateUtil().toMidnight().addDays(3).addMinutes(18 * 60);
		event3.start = date3.getTime().getTime() / 1000;
		event3.end = date3.getTime().getTime() / 1000 + 1800;
		if (ContactUtil.searchContactByEmail("homer@snpp.com") != null){			
			event3.addContacts(String.valueOf(ContactUtil.searchContactByEmail("homer@snpp.com").id));
		}
		event3.save();
		
		Event event4 = new Event();
		event4.title = "Review meeting blue";
		event4.color = "#36C";
		event4.allDay = false;
		DateUtil date4 = new DateUtil().toMidnight().addDays(4).addMinutes(18 * 60);
		event4.start = date4.getTime().getTime() / 1000;
		event4.end = date4.getTime().getTime() / 1000 + 1800;		
		event4.save();
		
    }

    /**
     * Creates default Deal.
     */
    private void saveDefaultDeals()
    {
		Milestone milestone = MilestoneUtil.getDefaultMilestones();
		
		Opportunity deal = new Opportunity();
		deal.name = "Donuts";
		deal.description = "Deal for donuts - bulk buy for discounts!!!";
		deal.expected_value = 55000d;
		deal.probability = 20;
		deal.pipeline_id = milestone.id;
		deal.milestone = "New";
		deal.colorName = Opportunity.Color.GREY;
		DateUtil date = new DateUtil().toMidnight().addDays(20);
		deal.close_date = date.getTime().getTime() / 1000;
		if (ContactUtil.searchContactByEmailID("homer@snpp.com") != null){
			deal.addContactIds(String.valueOf(ContactUtil.searchContactByEmailID("homer@snpp.com").id));
		}					
		deal.save();
	
		Opportunity deal1 = new Opportunity();
		deal1.name = "Comic Film Direction";		
		deal1.expected_value = 67000d;
		deal1.probability = 80;
		deal1.pipeline_id = milestone.id;
		deal1.milestone = "Prospect";
		deal1.colorName = Opportunity.Color.INDIGO;
		DateUtil date1 = new DateUtil().toMidnight().addDays(10);
		deal1.close_date = date1.getTime().getTime() / 1000;
		if (ContactUtil.searchContactByPesonName("charlie") != null){
			deal1.addContactIds(String.valueOf(ContactUtil.searchContactByPesonName("charlie").id));
		}					
		deal1.save();
		
		Opportunity deal2 = new Opportunity();
		deal2.name = "Nike Endorsement";	
		deal2.description = "USD 100K per year for Nike endorsement";
		deal2.expected_value = 100000d;
		deal2.probability = 90;
		deal2.pipeline_id = milestone.id;
		deal2.milestone = "Proposal";
		deal2.colorName = Opportunity.Color.ORANGE;
		DateUtil date2 = new DateUtil().toMidnight().addDays(10);
		deal2.close_date = date2.getTime().getTime() / 1000;
		if (ContactUtil.searchContactByEmailID("mj@nba.com") != null){
			deal2.addContactIds(String.valueOf(ContactUtil.searchContactByEmailID("mj@nba.com").id));
		}		    		
		deal2.save();
		
		Opportunity deal4 = new Opportunity();
		deal4.name = "Springfield Nuclear Power Plant Inspection";	
		deal4.description = "Lost inspection deal due to Homer's incompetence";		
		deal4.expected_value = 56000d;
		deal4.probability = 0;
		deal4.pipeline_id = milestone.id;
		deal4.milestone = "Lost";
		deal4.colorName = Opportunity.Color.RED;
		if (ContactUtil.searchContactByEmailID("homer@snpp.com") != null){
			deal4.addContactIds(String.valueOf(ContactUtil.searchContactByEmailID("homer@snpp.com").id));
		}		    
		DateUtil date4 = new DateUtil().toMidnight().addDays(10);
		deal4.close_date = date4.getTime().getTime() / 1000;		
		deal4.save();
		
		Opportunity deal5 = new Opportunity();
		deal5.name = "Research Grant";	
		deal5.description = "Research grant for particle physics research";		
		deal5.expected_value = 75000d;
		deal5.probability = 0;
		deal5.pipeline_id = milestone.id;
		deal5.milestone = "Lost";
		deal5.colorName = Opportunity.Color.BLUE;
		if (ContactUtil.searchContactByEmailID("sheldon@caltech.com") != null){
			deal5.addContactIds(String.valueOf(ContactUtil.searchContactByEmailID("sheldon@caltech.com").id));
		}		    		
		DateUtil date5 = new DateUtil().toMidnight().addDays(10);
		deal5.close_date = date5.getTime().getTime() / 1000;		
		deal5.save();
		
		Opportunity deal6 = new Opportunity();
		deal6.name = "Open Science Grid Computer";	
		deal6.description = "Kripke controls the open science grid computer at Caltech";		
		deal6.expected_value = 45500d;
		deal6.probability = 0;
		deal6.pipeline_id = milestone.id;
		deal6.milestone = "Won";
		deal6.colorName = Opportunity.Color.BLUE;
		if (ContactUtil.searchContactByEmailID("sheldon@caltech.com") != null){
			deal6.addContactIds(String.valueOf(ContactUtil.searchContactByEmailID("sheldon@caltech.com").id));
		}		    		
		DateUtil date6 = new DateUtil().toMidnight().addDays(10);
		deal6.close_date = date6.getTime().getTime() / 1000;		
		deal6.save();
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