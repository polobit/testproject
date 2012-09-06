package com.agilecrm;

import java.io.IOException;
import java.util.Calendar;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.activities.Task;

@SuppressWarnings("serial")
public class AgileCRMServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException
    {
	resp.setContentType("text/plain");

	/*
	 * List<ContactField> properties = new ArrayList<ContactField>();
	 * properties.add(new ContactField("company", "work", "Giga Om"));
	 * properties.add(new ContactField("email", "work", "jagan@invox.com"));
	 * 
	 * List<String> tags = new ArrayList<String>(); tags.add("tag1");
	 * tags.add("tag2");
	 * 
	 * Contact contact = new Contact(Contact.Type.PERSON, "", "Chirag",
	 * "Patel", tags, properties); contact.save();
	 */

	/*
	 * Calendar start = Calendar.getInstance(); Calendar end =
	 * Calendar.getInstance(); end.add(Calendar.HOUR, 1);
	 * 
	 * Event e = new Event("Test 1", start.getTimeInMillis()/1000,
	 * end.getTimeInMillis()/1000, false, null, null); e.save();
	 * 
	 * start.add(Calendar.DATE, 1); end.add(Calendar.DATE, 1);
	 * 
	 * e = new Event("Test 1", start.getTimeInMillis()/1000,
	 * end.getTimeInMillis()/1000, false, null, null); e.save();
	 */

	Calendar end = Calendar.getInstance();
	end.add(Calendar.HOUR, 1);
	Task task = new Task(Task.Type.CALL, end.getTimeInMillis() / 1000, 0L,
		0L);
	task.save();

	end.add(Calendar.DATE, 1);
	task = new Task(Task.Type.CALL, end.getTimeInMillis() / 1000, 0L, 0L);
	task.save();

	// EmailTemplates emailTemplate = new EmailTemplates("test subject",
	// "test uasdfasdf");
	// emailTemplate.save();

	/*
	 * try { // getLinkedInProfile(contact);
	 * TwitterUtil.getTwitterProfile(contact); } catch (Exception e) {
	 * 
	 * }
	 */

	/*
	 * List<ContactField> properties = new ArrayList<ContactField>();
	 * properties.add(new ContactField(ContactField.FieldType.SYSTEM,
	 * "email", "work", "jagan@invox.com")); properties.add(new
	 * ContactField(ContactField.FieldType.SYSTEM, "phone", "work",
	 * "4084642061")); properties.add(new
	 * ContactField(ContactField.FieldType.SYSTEM, "url", "home",
	 * "http://www.invox.com"));
	 * 
	 * //Set<String> tags = Sets.newHashSet();
	 * 
	 * List<String> tags = new ArrayList<String>(); tags.add("tag1");
	 * tags.add("tag2");
	 * 
	 * Contact contact = new Contact(Contact.Type.COMPANY, "creator",
	 * "first", "last", tags, properties ); contact.save();
	 * 
	 * try { contact = Contact.getContact(contact.id);
	 * System.out.println(contact); } catch(Exception e) {
	 * e.printStackTrace(); }
	 * 
	 * 
	 * // Add notes try { Note note = new Note(contact.id, "test note",
	 * null); Note note2 = new Note(contact.id, "test note 2", null);
	 * 
	 * note.save(); note2.save();
	 * 
	 * System.out.println("Saved note " + note);
	 * System.out.println("Retrieved " + Note.getNote(contact.id, note.id));
	 * System.out.println("Get Notes " + Note.getNotes(contact.id)); }
	 * catch(Exception e) { e.printStackTrace(); }
	 */

	/*
	 * Long contactId = 222L; try { Note note = new Note(contactId, null,
	 * "test note"); Note note2 = new Note(contactId, null, "test note 2");
	 * note.save(); note2.save(); } catch (Exception e) { }
	 */

    }
}
