package com.agilecrm.contact.sync.wrapper.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.StringTokenizer;

import javax.persistence.Embedded;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.JSONUtil;
import com.google.gdata.data.TextContent;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.GroupMembershipInfo;
import com.google.gdata.data.contacts.Occupation;
import com.google.gdata.data.contacts.Website;
import com.google.gdata.data.extensions.Email;
import com.google.gdata.data.extensions.Im;
import com.google.gdata.data.extensions.Name;
import com.google.gdata.data.extensions.PhoneNumber;
import com.google.gdata.data.extensions.StructuredPostalAddress;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.thirdparty.google.contacts.ContactSyncUtil;
import com.thirdparty.google.groups.GoogleGroupDetails;
import com.thirdparty.salesforce.SalesforceUtil;

/**
 * <code> GoogleContactWrapperImpl</code> implemented ContactWrapper wraps the
 * Google contacts in agile schema format
 */
public class SalesForceContactWrapperImpl extends ContactWrapper
{
    /** The entry. */
    JSONObject entry;
    
    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#wrapContact()
     */
    @Override
    public void wrapContact()
    {
	if (!(object instanceof JSONObject))
	    return;
	entry = (JSONObject) object;
	return;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.ContactWrapper#getMoreCustomInfo()
     */
    @Override
    public List<ContactField> getMoreCustomInfo()
    {
	List<ContactField> fields = new ArrayList<ContactField>();

	return fields;

    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getEmail()
     */
    @Override
    public ContactField getEmail()
    {
    	
    	List<String> emailList = getEmails();
    	if(emailList == null || emailList.size() == 0)
    		   return null;
    	
    	for (String email : emailList) {
    		ContactField field = new ContactField(Contact.EMAIL, email, "email");
			contact.properties.add(field);
		}
		
    	return null;
    	
    }
    
    public List<String> getEmails(){
    	
    	List<String> emailList = new ArrayList<String>();
    	
    	String email = "";
    	if(entry.has("Email")){
    		email = JSONUtil.getJSONValue(entry, "Email");
    	}
    	
    	if(email == null)
    		 return emailList;
    	
    	StringTokenizer tokens = new StringTokenizer(email, ",");
    	while (tokens.hasMoreElements()) {
			String object = (String) tokens.nextElement();
			emailList.add(object);
		}
    	
    	return emailList;
    }
    
    
    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getPhoneNumber()
     */
    @Override
    public ContactField getPhoneNumber()
    {

    	if (entry.has("Phone"))
			contact.properties.add(new ContactField("phone", JSONUtil.getJSONValue(entry, "Phone"), "main"));

		if (entry.has("MobilePhone"))
			contact.properties.add(new ContactField("phone", JSONUtil.getJSONValue(entry, "MobilePhone"), "mobile"));

		if (entry.has("HomePhone"))
			contact.properties.add(new ContactField("phone", JSONUtil.getJSONValue(entry, "HomePhone"), "home"));

		if (entry.has("OtherPhone"))
			contact.properties.add(new ContactField("phone", JSONUtil.getJSONValue(entry, "OtherPhone"), "other"));

		if (entry.has("Fax"))
			contact.properties.add(new ContactField("phone", JSONUtil.getJSONValue(entry, "Fax"), "home fax"));
		
		return null;
	
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getOrganization()
     */
    @Override
    public ContactField getOrganization()
    {
    	
	if (!entry.has("AccountId"))
		  return null;
	
	ContactField field = null;
	try {
	
		JSONObject accountJSON = new JSONObject(SalesforceUtil.getAccountByAccountIdFromSalesForce(prefs,
				entry.getString("AccountId")));
		
		if (accountJSON.has("Name"))
		{
			return new ContactField(Contact.COMPANY, accountJSON.getString("Name"), null);
		}
		
	} catch (Exception e) {
	}
	
	return field;
	
    }

    @Override
    public ContactField getJobTitle()
    {
    	ContactField field = null;
    	
    	if (entry.has("Title"))
    		field = new ContactField(Contact.TITLE, JSONUtil.getJSONValue(entry, "Title"), null);
    	
    	return field;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getDescription()
     */
    @Override
    public String getDescription()
    {
	// TODO Auto-generated method stub
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getAddress()
     */
    @Override
    public ContactField getAddress()
    {
    	ContactField field = null;
    	
    	try {
			
    		
    		JSONObject json = new JSONObject();
    		
    		if (entry.has("MailingStreet"))
    			json.put("address", entry.getString("MailingStreet"));

    		if (entry.has("MailingCity"))
    			json.put("city", entry.getString("MailingCity"));

    		if (entry.has("MailingState"))
    			json.put("state", entry.getString("MailingState"));

    		if (entry.has("MailingCountry"))
    			json.put("country", entry.getString("MailingCountry"));

    		if (entry.has("MailingPostalCode"))
    			json.put("zip", entry.getString("MailingPostalCode"));
    		
    		// default subtype is postal
    		field = new ContactField("address", json.toString(), "postal");
    		
		} catch (Exception e) {
		}
	
				
		return field;		
				
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getNotes()
     */
    @Override
    public List<Note> getNotes()
    {
	// TODO Auto-generated method stub
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getFirstName()
     */
    @Override
    public ContactField getFirstName()
    {
    	ContactField field = null;
    	
    	if (entry.has("FirstName"))
    		field = new ContactField(Contact.FIRST_NAME, JSONUtil.getJSONValue(entry, "FirstName"), null);
    		
    	return field;
    		
    }
   
	
    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getLastName()
     */
    @Override
    public ContactField getLastName()
    {
	ContactField field = null;
	
	if (entry.has("LastName"))
		field = new ContactField(Contact.LAST_NAME, JSONUtil.getJSONValue(entry, "LastName"), null);
		
	return field;
	
    }

    @Override
    public void saveCallback()
    {
    	// Note
		if (entry.has("Description"))
		{
			Note note = new Note("Salesforce Contact Notes",JSONUtil.getJSONValue(entry, "Description"));
			note.addRelatedContacts(String.valueOf(contact.id));
			note.save();
			System.out.println(note.id);
		}

		if (entry.has("Department"))
		{
			Note note = new Note("Salesforce Contact Notes",JSONUtil.getJSONValue(entry, "Department"));
			note.addRelatedContacts(String.valueOf(contact.id));
			note.save();
			System.out.println("In note " + note.id);
		}

    }

	@Override
	public List<String> getTags() {
		// TODO Auto-generated method stub
		return null;
	}

}
