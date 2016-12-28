package com.agilecrm.deals.deferred;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

public class DeleteDuplicateCompanies implements DeferredTask {
	
	public String domain;
	public String cursor;
	
    public DeleteDuplicateCompanies(String domain,String cursor)
    {
    	this.domain = domain;
    	this.cursor = cursor;
    }

	@Override
	public void run() {
		if(!domain.isEmpty() && !domain.equalsIgnoreCase(null) && !domain.equalsIgnoreCase("null"))
		{
			String oldName = NamespaceManager.get();
			NamespaceManager.set(domain);
			try
			{
				do{
					List<Contact> contact_list = null;
					contact_list = Contact.dao.fetchAll(100, cursor, null);
					for(Contact contact : contact_list){						
						boolean isComp = false;
						List<ContactField> newProp = new ArrayList<ContactField>();
						List<ContactField> oldProp = contact.properties ;
						for(ContactField contField : oldProp){							
							if(contField.name.equals("company") && contField.type.equals(FieldType.SYSTEM))
							{
								if(!isComp)
									newProp.add(contField);
								isComp = true;
							}
							else
								newProp.add(contField);							
						}
						contact.properties = newProp ; 
					}
					Contact.dao.putAll(contact_list);
					cursor = contact_list.get(contact_list.size() - 1).cursor;
				}while(cursor != null);	
							
			}catch(Exception e)
			{
				
			}
			finally{
				NamespaceManager.set(oldName);
			}
		}
		
	}
}
