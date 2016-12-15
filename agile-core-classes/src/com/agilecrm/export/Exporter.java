package com.agilecrm.export;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.util.email.SendMail;

public interface Exporter<T>
{
    static enum EXPORT_TYPE
    {
	DEAL(SendMail.EXPORT_DEALS_CSV_SUBJECT, SendMail.EXPORT_DEALS_CSV, "Deal(s)"),

	CONTACT("Agile CRM Contacts CSV", SendMail.EXPORT_CONTACTS_CSV, "Contact(s)"),

	COMPANY("Agile CRM Companies CSV", SendMail.EXPORT_CONTACTS_CSV, "Companies"),
	
	LEAD("Agile CRM Leads CSV", SendMail.EXPORT_CONTACTS_CSV, "Lead(s)");

	String templateSubject;
	String templaceTemplate;
	String label;

	private EXPORT_TYPE(String subject, String template, String label)
	{
	    this.templaceTemplate = template;
	    this.templateSubject = subject;
	    this.label = label;
	}

    }

    public void writeEntitesToCSV(List<T> entities);
    
    public void writeEntitesToCSV(List<T> entities, Map<Long, String> source_map, Map<Long, String> status_map);

    public void finalize();

    public void sendEmail(String email);
    public void sendEmail(String email,HashMap<String, String> stats,String domain);
    public void addToActivity(ActivityType activityType,EntityType entityType);

}
