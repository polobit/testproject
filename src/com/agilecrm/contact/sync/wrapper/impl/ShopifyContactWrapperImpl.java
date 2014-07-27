/**
 * 
 */
package com.agilecrm.contact.sync.wrapper.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.service.impl.ShopifySync;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;
import com.stripe.model.Customer;

/**
 * @author Jitendra
 *
 */
public class ShopifyContactWrapperImpl extends ContactWrapper {

	LinkedHashMap<String, Object>contactProperties;
	LinkedHashMap<String, String>defaultAddress ;
	ArrayList<LinkedHashMap<String, Object>> orders;
	/* (non-Javadoc)
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#wrapContact()
	 */
	@Override
	public void wrapContact() {
		contactProperties = (LinkedHashMap<String, Object>) object;
		if(contactProperties != null){
			defaultAddress = (LinkedHashMap<String, String>) contactProperties.get("default_address");
			orders = new ShopifySync().getOrder(contactProperties.get("id").toString());
		}
	}

	/* (non-Javadoc)
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getFirstName()
	 */
	@Override
	public ContactField getFirstName() {
		String firstName= null ;
		if(contactProperties.containsKey("first_name")){
			firstName = contactProperties.get("first_name").toString();
		}
		return new ContactField(Contact.FIRST_NAME,firstName,null);
	}

	/* (non-Javadoc)
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getLastName()
	 */
	@Override
	public ContactField getLastName() {
		String lastName= null ;
		if(contactProperties.containsKey("last_name")){
			lastName = contactProperties.get("last_name").toString();
		}
		return new ContactField(Contact.LAST_NAME,lastName,null);
	}

	/* (non-Javadoc)
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getEmail()
	 */
	@Override
	public ContactField getEmail() {
		String email= null ;
		if(contactProperties.containsKey("email")){
			email = contactProperties.get("email").toString();
		}
		return new ContactField(Contact.EMAIL,email,null);
	}

	/* (non-Javadoc)
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getPhoneNumber()
	 */
	@Override
	public ContactField getPhoneNumber() {
		String phoneNumber= null ;
		if(contactProperties.containsKey("phone")){
			phoneNumber = defaultAddress.get("phone");
		}
		return new ContactField(Contact.PHONE,phoneNumber,null);
	}

	/* (non-Javadoc)
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getOrganization()
	 */
	@Override
	public ContactField getOrganization() {
		String company= null ;
		if(contactProperties.containsKey("company")){
			company = defaultAddress.get("phone");
		}
		return new ContactField(Contact.COMPANY,company,"office");
	}

	/* (non-Javadoc)
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getDescription()
	 */
	@Override
	public String getDescription() {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getTags()
	 */
	@Override
	public List<String> getTags() {
		List<String> tags = new ArrayList<String>();
				if(contactProperties.containsKey("tags")){
					String[] tag = contactProperties.get("tags").toString().split(",");
					for(String s : tag){
						tags.add(s);
					}
					 
				}
				
				Iterator<LinkedHashMap<String, Object>> it = orders.listIterator();
				while(it.hasNext()){
					LinkedHashMap<String, Object> order = it.next();
					ArrayList<LinkedHashMap<String,String>> itemDetails =  (ArrayList<LinkedHashMap<String, String>>) order.get("line_items");
					Iterator<LinkedHashMap<String, String>> iterator = itemDetails.listIterator();
					while(iterator.hasNext()){
						String productName = iterator.next().get("title");
						tags.add(productName);
					}
					
				}
				
				return tags;
	}

	/* (non-Javadoc)
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getAddress()
	 */
	@Override
	public ContactField getAddress() {
		JSONObject address = new JSONObject();
		String strete = defaultAddress.get("address1");
		if(defaultAddress.containsKey("address2")){
			String address2 = defaultAddress.get("address2");
			if(address2.isEmpty() && address2 != null)
				strete = strete+ address2;
		}
		try {
		if(defaultAddress.containsKey("city"))
			address.put("city", defaultAddress.get("city"));
		
		if(defaultAddress.containsKey("province"))
			address.put("state", defaultAddress.get("province"));
		
		if(defaultAddress.containsKey("country"))
			address.put("country", defaultAddress.get("country"));
		
		if(defaultAddress.containsKey("zip"))
		   address.put("zip", defaultAddress.get("zip"));
		
			address.put("address", strete);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return new ContactField(Contact.ADDRESS,address.toString(),"Home");
	}

	/* (non-Javadoc)
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getNotes()
	 */
	@Override
	public List<Note> getNotes() {
		List<Note> notes = new ArrayList<Note>();
		if(contactProperties.containsKey("note")){
			String note = contactProperties.get("note").toString();
			Note n = new Note("Customer's Note",note);
		
			notes.add(n);
			 
		}
		Iterator<LinkedHashMap<String, Object>> it = orders.listIterator();
		while(it.hasNext()){
			LinkedHashMap<String, Object> order = it.next();
			Note n = new Note();
			n.subject = "Orders";
			ArrayList<LinkedHashMap<String,String>> itemDetails =  (ArrayList<LinkedHashMap<String, String>>) order.get("line_items");
			Iterator<LinkedHashMap<String, String>> iterator = itemDetails.listIterator();
			while(iterator.hasNext()){
				LinkedHashMap<String,String> details =iterator.next();
				n.description = details.get("name") +"-"+ details.get("price");
			}
			notes.add(n);
		}
		
		return notes;
	}

}
