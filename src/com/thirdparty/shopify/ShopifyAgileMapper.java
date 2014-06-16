package com.thirdparty.shopify;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.Tag;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

public class ShopifyAgileMapper {
	
	public void saveCustomer(JSONObject customer ,Key<DomainUser> key){
		
		Contact ctx = new Contact();
		List<ContactField> contactField = new ArrayList<ContactField>();
		try{
		
		  if(customer.has("email"))
			  contactField.add(new ContactField(Contact.EMAIL,customer.getString("email"),null));
		  
		  if(customer.has("first_name"))
			  contactField.add(new ContactField(Contact.FIRST_NAME,customer.getString("first_name"),null));
		  
		  if(customer.has("last_name"))
			  contactField.add(new ContactField(Contact.LAST_NAME,customer.getString("last_name"),null));
		  
		  
		  if(customer.has("default_address")){
			  JSONObject address = new JSONObject(customer.get("default_address").toString());
			 
			 /*
			  * formating address according to agile address format 
			  */
			  JSONObject addrs = new JSONObject();
			  addrs.put("address", address.get("address1") +" "+address.get("address2"));
			  addrs.put("city", address.get("city"));
			  addrs.put("state", address.get("province"));
			  addrs.put("country", address.get("country"));
			  addrs.put("mobile", address.get("phone"));
			  addrs.put("zip", address.get("zip"));
			  addrs.put("name", address.get("name"));
			  contactField.add(new ContactField(Contact.ADDRESS,addrs.toString(),"home"));
			  if(address.has("company"))
			  contactField.add(new ContactField(Contact.COMPANY,address.getString("company"),"Work"));
			  contactField.add(new ContactField(Contact.PHONE,address.getString("phone"),"work"));
			  
		  }
		   ctx.properties = contactField;
		   ctx.type = Type.PERSON;
		   ctx.setContactOwner(key);
		   ctx.save();
		  
		 
		if(customer.has("note")){
			  Note note = new Note();
		       note.description = customer.getString("note");
		       note.addContactIds(ctx.id.toString());
		       note.save();
		}
		
		if(customer.has("tags")){
		/*	Tag t  = new Tag();
			t.tag = customer.getString("tags");
			t.addTag(tagName)
			ctx.addTags(t);*/
		}
			
		
		}catch(Exception e){
			e.printStackTrace();
		}
		
		
		
	}

}
