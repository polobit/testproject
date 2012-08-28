package com.agilecrm;

import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class Log
{

	// Key
	@Id
	public Long id;

	public enum Type
	{
		CALL, NOTE, TAG, USER, CAMPAIGN, CONTACT
	};

	// Log Type
	private Type log_type;

	// Object Id
	private String log_type_id;

	// Second Log Type is stored in case of Note (where both note id an contact
	// id are required)
	@NotSaved(IfDefault.class)
	private String log_type_id_2 = null;

	private Long log_time = 0L;

	private String text = null;
	
	// Create ObjectifyGenericDao
	private static ObjectifyGenericDao<Log> DAO = new ObjectifyGenericDao<Log>(Log.class);
	
	Log()
	{

	}

	Log(Type logType, String logTypeId, String text)
	{
		this.log_type = logType;
		this.log_type_id = logTypeId;
		this.text = text;
	}

	Log(Type logType, String logTypeId, String logTypeId2, String text)
	{
		this.log_type = logType;
		this.log_type_id = logTypeId;
		this.log_type_id_2 = logTypeId2;
		this.text = text;
	}

	public String toString()
	{
		String objectString = "";

		// Note Log
		if (log_type.equals(Type.NOTE))
		{
			// Print Note..
			objectString = Note.getNote(Long.parseLong(log_type_id), Long.parseLong(log_type_id_2)).toString();
		}

		// User Log
		if (log_type.equals(Type.USER))
		{
			objectString = AgileUser.getUser(log_type_id).toString();
		}

		// Contact Log
		if (log_type.equals(Type.CALL))
		{
			objectString = Contact.getContact(Long.parseLong(log_type_id)).toString();
		}

		return "Text: " + text + " Object: " + objectString;

	}

	public static void addNoteLog(Long contactId, Long noteId, String text)
	{

		// Create Log
		Log log = new Log(Log.Type.NOTE, contactId +"", noteId + "", text);

		// Save
		saveNote(log);
	}
	
	public static void addContactLog(Long contactId, String text)
	{
		// Create Log
		Log log = new Log(Log.Type.CONTACT, contactId + "", text);

		// Save
		saveNote(log);
	}

	public static Log saveNote(Log log)
	{
		// save it		
		DAO.put(log);
		return log;
	}

	

	public static List<Log> getContactLogs(Long contactId)
	{
		Objectify ofy = ObjectifyService.begin();
		return ofy.query(Log.class).filter("type", Log.Type.CONTACT).filter("log_type_id", contactId).list();
	}

	// Get Note Log
	public static void getNoteLogs(Long contactId, Long noteId)
	{
		Objectify ofy = ObjectifyService.begin();
		ofy.query(Log.class).filter("type", Log.Type.NOTE).filter("log_type_id", contactId).filter("log_type_id_2", noteId).get();
	}

	// Get User Log

	@PrePersist
	private void PrePersist()
	{
		// Store Created Time
		log_time = System.currentTimeMillis();

	}

}
