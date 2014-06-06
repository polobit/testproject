/**
 * 
 */
package com.thirdparty.zoho;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javassist.bytecode.stackmap.BasicBlock.Catch;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;

/**
 * @author jitendra
 * 
 */
public class ZohoAgileMappingImpl implements ZohoAgileMapping
{

	@Override
	public Contact saveContact(Map<String,String> contactDataMap, Key<DomainUser> key)
	{
		
		Contact contact = new Contact();

		List<ContactField> fields = new ArrayList<ContactField>();

		contact.type = Contact.Type.COMPANY;
		
		if(contactDataMap.containsKey("Account Name"))
			fields.add(new ContactField(Contact.NAME,contactDataMap.get("Account Name"),null));

         if(contactDataMap.containsKey("Website"))
        	 fields.add(new ContactField(Contact.WEBSITE,contactDataMap.get("Website"),null));
         
         if(contactDataMap.containsKey("Phone"))
        	 fields.add(new ContactField(Contact.PHONE,contactDataMap.get("Phone"),"main"));
         if(contactDataMap.containsKey("Mobile"))
        	 fields.add(new ContactField("Mobile",contactDataMap.get("Mobile"),"home"));
         
         if(contactDataMap.containsKey("Fax"))
        	 fields.add(new ContactField("Fax",contactDataMap.get("Fax"),"home fax"));
		

		JSONObject shippingAddress = new JSONObject();
		try{
		
		if(contactDataMap.containsKey("Shipping Street"))
			shippingAddress.put("Street",contactDataMap.get("Shipping Street"));
		
		if(contactDataMap.containsKey("Shipping State"))
			shippingAddress.put("State",contactDataMap.get("Shipping State"));
		
		
		if(contactDataMap.containsKey("Shipping Code"))
			shippingAddress.put("Code",contactDataMap.get("Shipping Code"));
		
		if(contactDataMap.containsKey("Shipping Country"))
			shippingAddress.put("Country",contactDataMap.get("Shipping Country"));
		fields.add(new ContactField(Contact.ADDRESS,shippingAddress.toString(),"Home"));
		
		JSONObject billingAddress = new JSONObject();
		
		if(contactDataMap.containsKey("Billing Street"))
			billingAddress.put("Street",contactDataMap.get("Billing Street"));
		
		if(contactDataMap.containsKey("Billing State"))
			billingAddress.put("State",contactDataMap.get("Billing State"));
		
		
		if(contactDataMap.containsKey("Billing Code"))
			billingAddress.put("Code",contactDataMap.get("Billing Code"));
		
		if(contactDataMap.containsKey("Billing Country"))
			billingAddress.put("Country",contactDataMap.get("Billing Country"));
		fields.add(new ContactField(Contact.ADDRESS,billingAddress.toString(),"Work"));
		}catch(Exception e){
			e.printStackTrace();
		}
			contact.properties =fields;
		contact.setContactOwner(key);
		contact.save();
		return contact;

	}

	@Override
	public void saveAccounts(JSONArray zohoData, Key<DomainUser> key)
	{
			List<ContactField> contactFields = new ArrayList<ContactField>();
            List<Map> list= getList(zohoData);
            Iterator it = list.iterator();
              int counter =0;
               while(it.hasNext()){
            	   HashMap<String,String> dataMap = (HashMap<String, String>) it.next();


				Contact ctx = saveContact(dataMap, key);
            	   
				if(dataMap.containsKey("Industry")){
            		   Note note = new Note();
            		   note.subject = "Industry";
            		   note.description = dataMap.get("Industry");
            		   note.addRelatedContacts(String.valueOf(ctx.id));
            		   note.save();
            	   }
            	   
            	   if(dataMap.containsKey("Description")){
            		   Note note = new Note();
            		   note.subject = "Description";
            		   note.description = dataMap.get("Description");
            		   note.addRelatedContacts(String.valueOf(ctx.id));
            		   note.save();
            	   }
            	   
            	   if(dataMap.containsKey("Employees")){
            		   Note note = new Note();
            		   note.subject ="Number of Employees";
            		   note.description = dataMap.get("Employees");
            		   note.addRelatedContacts(String.valueOf(ctx.id));
            		   note.save();
            	   }
               }
               counter++;
               
               BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, String.valueOf(counter)
            		   + " Accounts imported from Salesforce");


	}

	



	@Override
	public void saveLeads(JSONArray arrayOfLeads, Key<DomainUser> ownerKey)
	{

		Contact ctx = new Contact();
		List<ContactField> contactFields = new ArrayList<ContactField>();
		int counter = 0;
                      List<Map> list = getList(arrayOfLeads);
                      Iterator it = list.iterator();
              
               while(it.hasNext()){
    	  
			    Map<String,String> objectField = (Map<String, String>) it.next();
			    
			    if (objectField.containsKey("First Name"))
					contactFields.add(new ContactField(Contact.FIRST_NAME, objectField.get("First Name"), null));

				if (objectField.containsKey("Last Name"))
					contactFields.add(new ContactField(Contact.LAST_NAME, objectField.get("Last Name"), null));

				if (objectField.containsKey("Email"))
					contactFields.add(new ContactField(Contact.EMAIL, objectField.get("Email"), null));

				if (objectField.containsKey("Company"))
					contactFields.add(new ContactField(Contact.COMPANY, objectField.get("Company"), null));

				if (objectField.containsKey("Website"))
					contactFields.add(new ContactField(Contact.WEBSITE, objectField.get("Website"), "URL"));

				if (objectField.containsKey("Phone"))
					contactFields.add(new ContactField(Contact.PHONE, objectField.get("Phone"), "Work"));

				if (objectField.containsKey("Title"))
					contactFields.add(new ContactField(Contact.TITLE, objectField.get("Title"), null));

				if (objectField.containsKey("Rating"))
					contactFields.add(new ContactField("star_value", objectField.get("Rating"), null));
				
				if (objectField.containsKey("Mobile"))
					contactFields.add(new ContactField("Mobile", objectField.get("Mobile"), "Home"));
				
				if (objectField.containsKey("Fax"))
					contactFields.add(new ContactField("Fax", objectField.get("Fax"), "Home Fax"));
				
				if (objectField.containsKey("Skype ID"))
					contactFields.add(new ContactField("Skype ID", objectField.get("Skype ID"), null));
				JSONObject address = new JSONObject();
			try{
				if (objectField.containsKey("Street"))
					address.put("Street", objectField.get("Street"));
				if (objectField.containsKey("City"))
					address.put("City", objectField.get("City"));
				if (objectField.containsKey("Zip Code"))
					address.put("Zip Code", objectField.get("Zip Code"));
				if (objectField.containsKey("Country"))
					address.put("Country", objectField.get("Country"));
				contactFields.add(new ContactField(Contact.ADDRESS, address.toString(), "Work"));
				ctx.setContactOwner(ownerKey);
				ctx.properties = contactFields;
				ctx.save();
			}catch(Exception e){
				e.printStackTrace();
			}
			}
				counter++;
		BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, String.valueOf(counter)
				+ " leads imported from Zoho crm");
	
	}

	private JSONArray getRecords(JSONArray zohoData)
	{
		JSONArray rows = null;
		try
		{
			JSONObject res = new JSONObject(zohoData.get(0).toString());
			JSONObject o = res.getJSONObject("response").getJSONObject("result").getJSONObject("Leads");
			rows = (JSONArray) o.getJSONArray("row");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return rows;
	}

	private List getList(JSONArray jsonData)
	{

		List<Map> list = new ArrayList<Map>();

		JSONArray rows = getRecords(jsonData);
		try
		{
			for (int i = 0; i < rows.length(); i++)
			{

				JSONObject object = rows.getJSONObject(i);
				JSONArray fields = object.getJSONArray("FL");

				Map<String, String> objectField = new HashMap<String, String>();

				for (int j = 0; j < fields.length(); j++)
				{
					Map<String, String> map = new HashMap<String, String>();
					ObjectMapper mapper = new ObjectMapper();
					map = mapper.readValue(fields.getString(j), new TypeReference<HashMap<String, String>>()
					{
					});
					String arr[] = new String[2];
					int index = 0;
					for (Map.Entry<String, String> m : map.entrySet())
					{
						arr[index] = m.getValue();
						index++;
					}
					objectField.put(arr[0], arr[1]);
				}
				list.add(objectField);

			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return list;

	}

	@Override
	public void saveCases(JSONArray zohoData, Key<DomainUser> key)
	{
		// TODO Auto-generated method stub
		
	}

	@Override
	public void saveContact(JSONArray zohoData, Key<DomainUser> key)
	{
		Contact ctx = new Contact();
		List<ContactField> contactFields = new ArrayList<ContactField>();
		int counter = 0;
                      List<Map> list = getList(zohoData);
                      Iterator it = list.iterator();
              
               while(it.hasNext()){
            	   HashMap<String,String> dataMap = (HashMap<String, String>) it.next();
            	   
    	  
               }
	}

	@Override
	public void saveEvents(JSONArray zohoData, Key<DomainUser> key)
	{
		// TODO Auto-generated method stub
		
	}

	@Override
	public void saveTask(JSONArray zohoData, Key<DomainUser> key)
	{
		// TODO Auto-generated method stub
		
	}
}
