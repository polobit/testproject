/**
 * 
 */
package com.thirdparty.quickbook;

import java.util.List;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;

/**
 * @author jitendra
 *
 */
public class QuickBookContactWrapperImpl extends ContactWrapper
{
    JSONObject customer;
    @Override
    public void wrapContact()
    {
	   customer =   (JSONObject) object;

    }

    /* (non-Javadoc)
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getFirstName()
     */
    @Override
    public ContactField getFirstName()
    {
	ContactField field = null;
	try
	{
	    field = new ContactField(Contact.FIRST_NAME , customer.getString("GivenName"),null);
	}
	catch (JSONException e)
	{
	  
	    e.printStackTrace();
	}
	return field;
    }

    /* (non-Javadoc)
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getLastName()
     */
    @Override
    public ContactField getLastName()
    {
	ContactField field = null;
	try
	{
	    field = new ContactField(Contact.LAST_NAME , customer.getString("FamilyName"),null);
	}
	catch (JSONException e)
	{
	  
	    e.printStackTrace();
	}
	return field;
    }

    /* (non-Javadoc)
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getEmail()
     */
    @Override
    public ContactField getEmail()
    {
	ContactField field = null;
	try
	{
	    JSONObject email = (JSONObject) customer.get("PrimaryEmailAddr");
	    if(email !=null){
	    field = new ContactField(Contact.EMAIL , email.getString("Address"),"work");
	    }
	}
	catch (JSONException e)
	{
	  
	    e.printStackTrace();
	}
	return field;
    }

    /* (non-Javadoc)
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getPhoneNumber()
     */
    @Override
    public ContactField getPhoneNumber()
    {
	ContactField field = null;
	try
	{
	    JSONObject mobile = new JSONObject(customer.get("Mobile").toString());
	    if(mobile != null){
		
		field = new ContactField(Contact.PHONE , mobile.getString("FreeFormNumber"),"work");
	    }
	}
	catch (JSONException e)
	{
	  
	    e.printStackTrace();
	}
	return field;
    }

    /* (non-Javadoc)
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getOrganization()
     */
    @Override
    public ContactField getOrganization()
    {
	ContactField field = null;
	try
	{
	    Object company = customer.get("CompanyName");
	    String name = company.toString();
	    if(company != null && !name.isEmpty()){
		
		field = new ContactField(Contact.COMPANY , name,null);
	    }
	}
	catch (JSONException e)
	{
	  
	    e.printStackTrace();
	}
	return field;
    }

    /* (non-Javadoc)
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getDescription()
     */
    @Override
    public String getDescription()
    {
	// TODO Auto-generated method stub
	return null;
    }

    /* (non-Javadoc)
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getTags()
     */
    @Override
    public List<String> getTags()
    {
	return null;
    }

    /* (non-Javadoc)
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getAddress()
     */
    @Override
    public ContactField getAddress()
    {
	ContactField field = null;
	try
	{
	    JSONObject billingAddrss = (JSONObject) customer.get("BillAddr");
	    JSONObject address = new JSONObject();
	    if(billingAddrss != null){
		address.put("city", billingAddrss.getString("City"));
		address.put("country",  billingAddrss.getString("Country"));
		address.put("state", billingAddrss.getString("CountrySubDivisionCode"));
		address.put("zip",  billingAddrss.getString("PostalCode"));
		
	    }
	    field = new ContactField(Contact.ADDRESS, address.toString(), "home");
	}
	catch (JSONException e)
	{
	  
	    e.printStackTrace();
	}
	return field;
    }

    /* (non-Javadoc)
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getNotes()
     */
    @Override
    public List<Note> getNotes()
    {
	return null;
    }

}
