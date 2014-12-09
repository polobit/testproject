package com.agilecrm.email.wrappers;

import com.agilecrm.cursor.Cursor;

public class EmailWrapper extends Cursor
{
    private String subject;
    private String id;
    private String date_secs;
    private String status;

    public String getStatus()
    {
	return status;
    }

    public void setStatus(String status)
    {
	this.status = status;
    }

    public String getErrormssg()
    {
	return errormssg;
    }

    public void setErrormssg(String errormssg)
    {
	this.errormssg = errormssg;
    }

    private String errormssg;

    public String getDate_secs()
    {
	return date_secs;
    }

    public void setDate_secs(String date_secs)
    {
	this.date_secs = date_secs;
    }

    private String date;
    private String owner_email;

    public String getOwner_email()
    {
	return owner_email;
    }

    public void setOwner_email(String owner_email)
    {
	this.owner_email = owner_email;
    }

    public String getSubject()
    {
	return subject;
    }

    public void setSubject(String subject)
    {
	this.subject = subject;
    }

    public String getId()
    {
	return id;
    }

    public void setId(String id)
    {
	this.id = id;
    }

    public String getDate()
    {
	return date;
    }

    public void setDate(String date)
    {
	this.date = date;
    }

    public String getMime_type()
    {
	return mime_type;
    }

    public void setMime_type(String mime_type)
    {
	this.mime_type = mime_type;
    }

    public String getFrom()
    {
	return from;
    }

    public void setFrom(String from)
    {
	this.from = from;
    }

    public String getTo()
    {
	return to;
    }

    public void setTo(String to)
    {
	this.to = to;
    }

    public String getMessage()
    {
	return message;
    }

    public void setMessage(String message)
    {
	this.message = message;
    }

    private String mime_type;
    private String from;
    private String to;
    private String message;
}
