package com.agilecrm.email.wrappers;

import java.util.List;

import com.agilecrm.cursor.Cursor;
import com.googlecode.objectify.annotation.NotSaved;

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
    private long email_link_clicked_at;
    private String user_id_from_email;
    private List<String> attachment_ids;
    
    private String document_key;
    private String blob_key;
    private String attachment_name;
    private String attachment_url;
    private String signature;
    
    private boolean track_clicks;

    public enum PushParams
    {
    	NO, YES, YES_AND_PUSH, YES_AND_PUSH_EMAIL_ONLY
    };
    
    private PushParams push_param = PushParams.YES;
    	
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

	public String getDocument_key()
	{
		return document_key;
	}

	public void setDocument_key(String document_key)
	{
		this.document_key = document_key;
	}

	public String getBlob_key()
	{
		return blob_key;
	}

	public void setBlob_key(String blob_key)
	{
		this.blob_key = blob_key;
	}

	public String getAttachment_name()
	{
		return attachment_name;
	}

	public void setAttachment_name(String attachment_name)
	{
		this.attachment_name = attachment_name;
	}

	public String getAttachment_url()
	{
		return attachment_url;
	}

	public void setAttachment_url(String attachment_url)
	{
		this.attachment_url = attachment_url;
	}

	public String getSignature()
	{
		return signature;
	}

	public void setSignature(String signature)
	{
		this.signature = signature;
	}

	public boolean isTrack_clicks()
	{
		return track_clicks;
	}

	public void setTrack_clicks(boolean track_clicks)
	{
		this.track_clicks = track_clicks;
	}

	public PushParams getPush_param()
	{
		return push_param;
	}

	public void setPush_param(PushParams pushParam)
	{
		this.push_param = pushParam;
	}

	public long getEmail_link_clicked_at()
	{
		return email_link_clicked_at;
	}

	public void setEmail_link_clicked_at(long email_link_clicked_at)
	{
		this.email_link_clicked_at = email_link_clicked_at;
	}

}
