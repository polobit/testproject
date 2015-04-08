package com.agilecrm.email.wrappers;

import java.util.List;

import com.agilecrm.cursor.Cursor;

public class ContactEmailWrapper extends Cursor
{

    public String getId()
    {
	return id;
    }

    public void setId(String id)
    {
	this.id = id;
    }

    public String getContact_id()
    {
	return contact_id;
    }

    public void setContact_id(String contact_id)
    {
	this.contact_id = contact_id;
    }

    public String getFrom()
    {
	return from;
    }

    public void setFrom(String from)
    {
	this.from = from;
    }

    public String getFrom_name()
    {
	return from_name;
    }

    public void setFrom_name(String from_name)
    {
	this.from_name = from_name;
    }

    public String getTo()
    {
	return to;
    }

    public void setTo(String to)
    {
	this.to = to;
    }

    public String getCc()
    {
	return cc;
    }

    public void setCc(String cc)
    {
	this.cc = cc;
    }

    public String getBcc()
    {
	return bcc;
    }

    public void setBcc(String bcc)
    {
	this.bcc = bcc;
    }

    public String getSubject()
    {
	return subject;
    }

    public void setSubject(String subject)
    {
	this.subject = subject;
    }

    public String getMessage()
    {
	return message;
    }

    public void setMessage(String message)
    {
	this.message = message;
    }

    public String getDate_secs()
    {
	return date_secs;
    }

    public void setDate_secs(String date_secs)
    {
	this.date_secs = date_secs;
    }

    public String getDate()
    {
	return date;
    }

    public void setDate(String date)
    {
	this.date = date;
    }

    public String getOwner_email()
    {
	return owner_email;
    }

    public void setOwner_email(String owner_email)
    {
	this.owner_email = owner_email;
    }

    public String getTrackerId()
    {
	return trackerId;
    }

    public void setTrackerId(String trackerId)
    {
	this.trackerId = trackerId;
    }

    public String getIs_email_opened()
    {
	return is_email_opened;
    }

    public void setIs_email_opened(String is_email_opened)
    {
	this.is_email_opened = is_email_opened;
    }

    public String getEmail_opened_at()
    {
	return email_opened_at;
    }

    public void setEmail_opened_at(String email_opened_at)
    {
	this.email_opened_at = email_opened_at;
    }

    private String id;
    private String contact_id;
    private String from;
    private String from_name;
    private String to;
    private String cc;
    private String bcc;
    private String subject;
    private String message;
    private String date_secs;
    private String date;
    private String owner_email;
    private String trackerId;
    private String is_email_opened;
    private String email_opened_at;
    private String user_id_from_email;
    private List<String> attachment_ids;

    public List<String> getAttachment_ids()
    {
	return attachment_ids;
    }

    public void setAttachment_ids(List<String> attachment_ids)
    {
	this.attachment_ids = attachment_ids;
    }

    public String getUser_id_from_email()
    {
	return user_id_from_email;
    }

    public void setUser_id_from_email(String user_id_from_email)
    {
	this.user_id_from_email = user_id_from_email;
    }

}
