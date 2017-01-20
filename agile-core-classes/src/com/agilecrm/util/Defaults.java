package com.agilecrm.util;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedHashSet;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.account.APIKey;
import com.agilecrm.account.DocumentTemplates;
import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.Task.PriorityType;
import com.agilecrm.activities.Task.Status;
import com.agilecrm.activities.Task.Type;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.projectedpojos.ContactPartial;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.Reports.Duration;
import com.agilecrm.reports.Reports.ReportType;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.search.ui.serialize.SearchRule.RuleType;
import com.agilecrm.session.SessionManager;
import com.agilecrm.ticket.utils.TicketFiltersUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.InvitedUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.InvitedUsersUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.triggers.Trigger;
import com.google.appengine.api.NamespaceManager;

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
		saveInvitedUsers();
		saveDocumentTemplate();
    }

	/**
     * Creates default Contacts.
     */
    private void saveDefaultContacts()
    {    	
    	//Companies default.
	
    	LinkedHashSet<String> companiesTags = new LinkedHashSet<String>();
		companiesTags.add("Sample");
		List<ContactField> companyFields = new ArrayList<ContactField>();
		companyFields.add(new ContactField(Contact.NAME, "Agile CRM", null));
		companyFields.add(new ContactField(Contact.URL, "https://www.agilecrm.com", null));
		companyFields.add(new ContactField(Contact.EMAIL, "sales@agilecrm.com", null));	
		companyFields.add(new ContactField("phone", "+1-800-980-0729", "work"));
		companyFields.add(new ContactField("phone", "+44 14428 00729", "work"));
		companyFields.add(new ContactField("phone", "+61 285990729", "work"));
		companyFields.add(new ContactField("phone", "+91 9492227799", "work"));
		companyFields.add(new ContactField("address","{\"state\":\"Texas\",\"city\":\"Dallas\",\"country\":\"US\"}","work"));
		
		
		companyFields.add(new ContactField("image",
			"http://doxhze3l6s7v9.cloudfront.net/beta/static/img/agile-logo-50-50.png", null));
	
		Contact company = new Contact(Contact.Type.COMPANY, companiesTags, companyFields);	
		company.star_value = 5;
		company.lead_score = 150;
		company.save();
		try
	    {
			DomainUserPartial contactOwner = company.getOwner();
			String owner_name = contactOwner != null ? contactOwner.name : null;
			ActivityUtil.createContactActivity(ActivityType.COMPANY_CREATE, company, owner_name, "", "Company Created");
	    }
	    catch (Exception e)
	    {
			// TODO Auto-generated catch block
			e.printStackTrace();
	    }
    	
	    //Contacts default.
		LinkedHashSet<String> tags = new LinkedHashSet<String>();
		tags.add("Sample");
		List<ContactField> contactFields = new ArrayList<ContactField>();
		contactFields.add(new ContactField(Contact.FIRST_NAME, "Customer Success", null));
		contactFields.add(new ContactField(Contact.LAST_NAME, "Team", null));
		contactFields.add(new ContactField(Contact.COMPANY, "Agile CRM", null));		
		contactFields.add(new ContactField(Contact.TITLE, "Support", null));
		contactFields.add(new ContactField(Contact.EMAIL, "care@agilecrm.com", null));
		companyFields.add(new ContactField("phone", "+1-800-980-0729", "work"));
		contactFields.add(new ContactField("website", "http://www.agilecrm.com", "URL"));	
		contactFields.add(new ContactField("address",
			"{\"city\":\"Dallas\",\"state\":\"Texas\",\"country\":\"US\"}", "work"));
		contactFields.add(new ContactField("image",
			"https://www.agilecrm.com/icons/service.svg", null));
	
		Contact contact = new Contact(Contact.Type.PERSON, tags, contactFields);
		contact.lead_score = 125;
		contact.star_value = 5;
		contact.save();
		try
	    {
			DomainUserPartial contactOwner = contact.getOwner();
			String owner_name = contactOwner != null ? contactOwner.name : null;
			ActivityUtil.createContactActivity(ActivityType.CONTACT_CREATE, contact, owner_name, "", "Contact Created");
	    }
	    catch (Exception e)
	    {
			// TODO Auto-generated catch block
			e.printStackTrace();
	    }
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
		DateUtil date = new DateUtil().toMidnight().addMinutes(11 * 60);
		task.due = date.getTime().getTime() / 1000;
		task.owner_id = String.valueOf(SessionManager.get().getDomainId());
		task.save();		
	
		Task task1 = new Task();
		task1.subject = "Like Agile on Facebook";
		task1.is_complete = false;
		task1.type = Type.OTHER.toString();
		task1.priority_type = PriorityType.NORMAL;
		task1.status = Status.YET_TO_START;
		DateUtil date1 = new DateUtil().toMidnight().addMinutes(11 * 60);
		task1.due = date1.getTime().getTime() / 1000;
		task1.owner_id = String.valueOf(SessionManager.get().getDomainId());
		task1.save();
		
		Task task2 = new Task();
		task2.subject = "Import Contacts";
		task2.is_complete = false;
		task2.type = Type.OTHER.toString();
		task2.priority_type = PriorityType.HIGH;
		task2.status = Status.YET_TO_START;
		DateUtil date2 = new DateUtil().addDays(1).toMidnight().addMinutes(11 * 60);
		task2.due = date2.getTime().getTime() / 1000;
		task2.owner_id = String.valueOf(SessionManager.get().getDomainId());
		task2.save();
	
		Task task3 = new Task();
		task3.subject = "Download Mobile App";
		task3.is_complete = false;
		task3.type = Type.OTHER.toString();
		task3.priority_type = PriorityType.NORMAL;
		task3.status = Status.YET_TO_START;
		DateUtil date3 = new DateUtil().addDays(1).toMidnight().addMinutes(11 * 60);
		task3.due = date3.getTime().getTime() / 1000;
		task3.owner_id = String.valueOf(SessionManager.get().getDomainId());		
		task3.save();
		
    }

    /**
     * Creates default Events.
     */
    private void saveDefaultEvents()
    {
    	Event event = new Event();
		event.title = "Team Meeting";
		event.color = "#36C";
		event.allDay = false;
		DateUtil date = new DateUtil().toMidnight().addDays(0).addMinutes(16 * 60);
		event.start = date.getTime().getTime() / 1000;
		event.end = date.getTime().getTime() / 1000 + 900;
		event.save();
		
    }

    /**
     * Creates default Deal.
     */
    private void saveDefaultDeals()
    {
    	Milestone milestone = MilestoneUtil.getDefaultMilestones();
    	
		Opportunity deal = new Opportunity();
		deal.name = "Tesla - Model S - P100D";
		deal.description = "Model S is designed from the ground up to be the safest, most exhilarating sedan on the road";
		deal.expected_value = 10000d;
		deal.probability = 80;
		deal.pipeline_id = milestone.id;
		deal.milestone = "Won";
		deal.colorName = Opportunity.Color.WHITE;
		DateUtil date = new DateUtil().toMidnight().addDays(3);
		deal.close_date = date.getTime().getTime() / 1000;
		Opportunity.updateDealTagsEntity(deal ,"Sample");						
		deal.save();
		try
		{
			List<ContactPartial> contacts = deal.getContacts();
			JSONArray jsn = null;
			if (contacts != null && contacts.size() > 0)
			{
			    jsn = ActivityUtil.getContactIdsJson(contacts);
			}

			String owner_name = "" ; 
			try {
				if(deal.owner_id != null)
					owner_name = DomainUserUtil.getDomainUser(Long.parseLong(deal.owner_id)).name;
				else if(deal.getOwner().name != null)
					owner_name = deal.getOwner().name ;
			}catch (Exception e) {
				e.printStackTrace();
			}
			ActivityUtil.createDealActivity(ActivityType.DEAL_ADD, deal, owner_name,
			        deal.expected_value.toString(), String.valueOf(deal.probability), jsn);
		}
		catch (Exception e)
		{
		    // TODO Auto-generated catch block
		    e.printStackTrace();
		}
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
    	note.subject = "Sales Note";
    	note.description = "This is a sample note. Write to us at sales@agilecrm.com for any sales enquiry or to learn about how Agile CRM can help your organisation and we will contact you shortly.";
    	note.entity_type = "note";
    	if (ContactUtil.searchCompanyByEmail("sales@agilecrm.com") == null)
    	    return;
    	note.addContactIds(String.valueOf(ContactUtil.searchCompanyByEmail("sales@agilecrm.com").id));
    	note.save();

    	Note note1 = new Note();
    	note1.subject = "Support Note";
    	note1.description = "This is a sample note. Write to us at care@agilecrm.com for any feedback, suggestion, query or problem and we will contact you shortly.";
    	note1.entity_type = "note";
    	if (ContactUtil.searchContactByEmail("care@agilecrm.com") == null)
    	    return;
    	note1.addContactIds(String.valueOf(ContactUtil.searchContactByEmail("care@agilecrm.com").id));
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
    private void saveInvitedUsers(){
    	List<InvitedUser> list = InvitedUsersUtil.dao.fetchAll();

		for (InvitedUser invitedUser : list) {
			if (invitedUser == null || StringUtils.isBlank(invitedUser.email))
				continue;

			String emailName = invitedUser.email;
			String name = emailName.split("@")[0];

			DomainUser domainUser = new DomainUser(NamespaceManager.get(), emailName, name, APIKey.generateRandom(),
					false, false, name);
			try {
				Long user_id = invitedUser.id;
				domainUser.invitedUser_id = user_id;
				domainUser.save();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
    }
    
    private static void saveDocumentTemplate(){
    	//System.out.println("------------------------------------------------Creating Default Template...");
    	DocumentTemplates dt1 = new DocumentTemplates("Business Proposal", "Use our pre built proposal template to customise and send business proposals to prospective clients", FileStreamUtil.readResource("proposal_template.txt"));
    	dt1.save();
    	
    	DocumentTemplates dt2 = new DocumentTemplates("Sample Quote", "Use our sample quote template to quickly personalise and send quotations to prospective clients", FileStreamUtil.readResource("quotation_template.txt"));
    	dt2.save();    	
    }
    
    public static void createTemplateForExistingUser(DomainUser domainUser){
    	Calendar c = Calendar.getInstance();
    	c.set(2017,1,20,12,00,00);
    	
    	Long timeNow = c.getTimeInMillis()/1000;
    	Long l =  Long.parseLong(((String)domainUser.getInfo(DomainUser.LOGGED_IN_TIME)).trim());
    	if(l<timeNow){
    		saveDocumentTemplate();
    	}
    }
}