package com.agilecrm.contact.deferred;


import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.service.impl.SalesforceSync;
import com.agilecrm.util.JSONUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * @author kakarlal
 *
 */
@SuppressWarnings("serial")
public class SalesforceImportNoteDeferredTask implements DeferredTask
{


	public enum ACTION_TYPE {
		ADD_NOTES
	}
	
	public ACTION_TYPE actionType;
	public String domainName;
	public String contactEntry;
	
	public Long contactId;
	
	public SalesforceImportNoteDeferredTask(String domainName, String contactEntry, ACTION_TYPE actionType, Long contactId){
		this.domainName = domainName;
		this.actionType = actionType;
		this.contactEntry = contactEntry;
		this.contactId = contactId;
	}
	
	@Override
	public void run() {
		
		System.out.println("SalesforceImportDeferred = " + domainName + " : " + actionType + " : " + contactEntry);
		
		if(StringUtils.isBlank(contactEntry))
			  return;
		
		System.out.println("contactId = " + contactId);
		
		try {
			
			JSONObject contactJSON = new JSONObject(contactEntry);
			
			JSONArray notesArray = new JSONArray(contactJSON.getString(SalesforceSync.CONTACTS_NOTES_KEY));
			
			NamespaceManager.set(domainName);
			
			for (int i = 0; i < notesArray.length(); i++) {
				JSONObject noteEntry = notesArray.getJSONObject(i);
				
				try {
					addNote(JSONUtil.getJSONValue(noteEntry, "Title") ,JSONUtil.getJSONValue(noteEntry, "Body"));	
				} catch (Exception e) {
				} finally{
				}
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	public void addNote(String title, String subject) {
    	
		try {
			
	    	Note note = new Note(title,subject);
			note.addRelatedContacts(String.valueOf(contactId));
			note.save();
			System.out.println("In note " + note.id);
			
		} catch (Exception e) {
		}
		
	}
	
}