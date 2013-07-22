package com.agilecrm.cases;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import net.sf.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

public class CasesUtility
{
	private static ObjectifyGenericDao<CaseData> dao = new ObjectifyGenericDao<CaseData>(CaseData.class);
	
	public static CaseData getCaseData(Long id)
	{
		try{ return dao.get(id); }
		catch(Exception e){ e.printStackTrace();return null; }
	}
	
	public static List<CaseData> getAllCaseData(){ return dao.fetchAll(); }
	
	public static CaseData save(CaseData caseData)
	{
		dao.put(caseData);
		
		if(caseData.id==null)
		{		
			return null;
		}
		return caseData;
	}
	
	public static List<CaseData> getByContactId(Long id)
	{
		Objectify ofy = ObjectifyService.begin();
		return ofy.query(CaseData.class).filter("relatedContactsKey = ", new Key<Contact>(Contact.class, id)).list();
	}
	
	public static void delete(Long id)
	{
		dao.deleteKey(Key.create(CaseData.class, id));
	}
}
