package com.agilecrm.export;

import java.util.List;

import com.agilecrm.util.email.SendMail;

public interface Exporter<T>
{
    static enum EXPORT_TYPE
    {
	DEAL(SendMail.EXPORT_DEALS_CSV_SUBJECT, SendMail.EXPORT_DEALS_CSV, "Deal(s)"),

	CONTACT("Agile CRM Contacts CSV", SendMail.EXPORT_CONTACTS_CSV, "Contact(s)"),

	COMPANY("Agile CRM Companies CSV", SendMail.EXPORT_CONTACTS_CSV, "Companies");

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

    public void finalize();

    public void sendEmail(String email);

}
