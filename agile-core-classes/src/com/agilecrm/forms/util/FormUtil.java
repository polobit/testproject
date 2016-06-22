package com.agilecrm.forms.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.forms.Form;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.MD5Util;
import com.agilecrm.util.VersioningUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Query;
import com.thirdparty.sendgrid.SendGrid;

public class FormUtil
{
    private static ObjectifyGenericDao<Form> dao = new ObjectifyGenericDao<Form>(Form.class);

    public static List<Form> getAllForms()
    {
	return Form.dao.fetchAll();
    }

    public static Form getFormById(Long formId)
    {
	Query<Form> query = dao.ofy().query(Form.class);
	query.filter("id", formId);
	Form form = query.get();
	if (form == null)
	    return null;
	else
	    return form;
    }

    public static Form getFormByName(String formName)
    {
	Query<Form> query = dao.ofy().query(Form.class);
	query.filter("formName", formName);
	Form form = query.get();
	if (form == null)
	    return null;
	else
	    return form;
    }
    
    /**
     * creating an method for sending an email to owner with its ContactName,ContactEmail
     * and formName
     */
    public static void sendMailToContactOwner(Contact contact, String formName){
    	String ownerEmailId=contact.getOwner().email;
    		try {
  
			Map<String, String> map = new HashMap<String, String>();
			//map.put("contactName", contact.first_name);
			map.put("contactEmail", contact.getContactFieldValue(contact.EMAIL));
			map.put("formName", formName);
			SendMail.sendMail(ownerEmailId, SendMail.CONTACT_FORM_SUBMITTED_SUBJECT+formName,
					SendMail.CONTACT_FORM_SUBMITTED, map,
					"noreply@agilecrm.com", "AgileCRM");

		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("Exception occured in contactSubmittedForm..."
					+ e.getMessage());
		}
 }
   
}
