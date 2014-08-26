/**
 * 
 */
package com.thirdparty.xero;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;

/**
 * @author jitendra
 *
 */
public class XeroContactWrapperImpl extends ContactWrapper
{

    JSONObject customer;

    @Override
    public void wrapContact()
    {
	customer = (JSONObject) object;

    }

    @Override
    public ContactField getFirstName()
    {
	ContactField field = null;

	try
	{
	    Object name = "";
	    if (customer.has("FirstName"))
	    {

		name = customer.get("FirstName");

		field = new ContactField(Contact.FIRST_NAME, name.toString(), null);
	    }
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	return field;
    }

    @Override
    public ContactField getLastName()
    {
	ContactField field = null;

	try
	{
	    Object name = "";
	    if (customer.has("LastName"))
	    {

		name = customer.get("LastName");

		field = new ContactField(Contact.LAST_NAME, name.toString(), null);
	    }
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	return field;
    }

    @Override
    public ContactField getEmail()
    {
	ContactField field = null;

	try
	{
	    Object name = "";
	    if (customer.has("EmailAddress"))
	    {

		name = customer.get("EmailAddress");

		field = new ContactField(Contact.EMAIL, name.toString(), "work");
	    }
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	return field;
    }

    @Override
    public ContactField getPhoneNumber()
    {
	ContactField field = null;

	String phoneNumber = null;
	try
	{
	    JSONArray phones ;
	    if (customer.has("Phones"))
	    {

		phones = (JSONArray) customer.get("Phones");
                 JSONObject primaryPhone = phones.getJSONObject(0);
                 if(primaryPhone != null){
                     Object phone = primaryPhone.get("PhoneNumber");
                     if(primaryPhone.get("PhoneAreaCode") != null ){
                	Object areaCode = primaryPhone.get("PhoneAreaCode");
                	
                	if(!areaCode.toString().isEmpty()){
                	    phoneNumber = areaCode.toString();
                	    
                	}
                	if(!phone.toString().isEmpty()){
                	            phoneNumber += phone.toString();
                	}
                	if(phoneNumber != null && !phoneNumber.isEmpty()){
                              field = new ContactField(Contact.EMAIL, phoneNumber, "work");
                	}
                	}
                     }
                 }
	    
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	return field;
    }

    @Override
    public ContactField getOrganization()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public String getDescription()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public List<String> getTags()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public ContactField getAddress()
    {
	ContactField field = null;
	
	JSONObject addressObject=  new JSONObject();
	try{
	    if(customer.has("Addresses")){
		JSONArray address =  (JSONArray) customer.get("Addresses");
		
		if(address.length() > 0){
		    JSONObject primaryAddress = (JSONObject) address.get(0);
		    if(primaryAddress != null && primaryAddress.length() > 0){
			Object zipcode = primaryAddress.get("PostalCode");
			Object state = primaryAddress.get("Region");
			Object city = primaryAddress.get("City");
			Object country = primaryAddress.get("Country");
			
			if(!zipcode.toString().isEmpty()){
			    addressObject.put("zip", zipcode.toString());
			}
			
			if(!state.toString().isEmpty()){
			    addressObject.put("state", state.toString());
			}
			
			if(!city.toString().isEmpty()){
			    addressObject.put("city", city.toString());
			}
			
			if(!country.toString().isEmpty()){
			    addressObject.put("country", country.toString());
			}
		    }
		}
	    }
	    
	    if(addressObject.length()>0){
	    
	    field = new ContactField(Contact.ADDRESS,addressObject.toString(),"work");
	    }
	    
	}catch(JSONException e){
	    e.printStackTrace();
	}
	return field;
	
	
    }

    @Override
    public List<Note> getNotes()
    {
	// TODO Auto-generated method stub
	return null;
    }

}
