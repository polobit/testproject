package com.agilecrm;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.Task.PriorityType;
import com.agilecrm.activities.Task.Type;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.Util;
import com.agilecrm.workflows.Workflow;

public class InitDefaults
{

    /**
     * Creates default Contacts.
     */
    public static void getDefaultContacts()
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
		.add(new ContactField(Contact.FIRST_NAME, null, "Michel"));
	contactFields1.add(new ContactField(Contact.LAST_NAME, null, "Jordan"));
	contactFields1.add(new ContactField(Contact.EMAIL, "work",
		"sixfeetsix@nba.com"));
	contactFields1.add(new ContactField(Contact.COMPANY, null, "NBA"));
	contactFields1
		.add(new ContactField(Contact.TITLE, null, "Sportsperson"));
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

    }

    /**
     * Creats default Tasks.
     */
    public static void getDefaultTasks()
    {
	Task task = new Task();
	task.subject = "Give feedback on Agile";
	task.is_complete = false;

	task.type = Type.SEND;
	task.priority_type = PriorityType.NORMAL;

	DateUtil date = new DateUtil().toMidnight().addDays(15);
	task.due = date.getTime().getTime() / 1000;

	task.contacts = new ArrayList<String>();

	List<Contact> contacts = ContactUtil.getAllContacts();
	for (Contact contact : contacts)
	{
	    task.contacts.add(String.valueOf(contact.id));
	}
	task.owner_id = String.valueOf(SessionManager.get().getDomainId());

	task.save();
    }

    /**
     * Creates default Workflow.
     */
    public static void getDefaultEvent()
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
     * Creates default Workflow.
     */
    public static void getDefaultWorkflow()
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
		"Sample Multi Channel Campaign",
		Util.readResource("misc/campaign-strings/sample_multi_channel_campaign.txt"));
	workflow2.save();

    }

}