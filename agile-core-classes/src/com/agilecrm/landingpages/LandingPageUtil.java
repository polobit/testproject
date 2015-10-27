package com.agilecrm.landingpages;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Query;

public class LandingPageUtil
{
	/**
	 * ObjectifyDao of LandingPage.
	 */
	public static ObjectifyGenericDao<LandingPage> dao = new ObjectifyGenericDao<LandingPage>(LandingPage.class);

	public static LandingPage getLandingPage(Long id)
	{
		try
		{
			return dao.get(id);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	public static List<LandingPage> getLandingPages()
	{
		try
		{
//			return dao.fetchAll();
			return dao.ofy().query(LandingPage.class).list();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	public static List<LandingPage> getLandingPages(int max, String cursor)
	{
//		if (max != 0)
//			return dao.fetchAll(max, cursor);
		return getLandingPages();
	}

	public static int getCount()
	{
		return LandingPage.dao.count();
	}
	
	
	public static LandingPageCNames getLandingPageCNames(Long id)
	{
		String oldNameSpace = NamespaceManager.get();
		NamespaceManager.set("");		
		try
		{
			ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);
			return dao.get(id);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
		finally
		{
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	public static LandingPageCNames getLandingPageCNamesForPage(Long pageId)
	{
		String oldNameSpace = NamespaceManager.get();
		NamespaceManager.set("");		
		try
		{
			Query<LandingPageCNames> q = null;
			ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);
			q = dao.ofy().query(LandingPageCNames.class);
			q.filter("landing_page_id", pageId);
			return q.get();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
		finally
		{
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	public boolean isCNameExists(String cname) {
		String oldNameSpace = NamespaceManager.get();
		NamespaceManager.set("");
		
		try
		{
			Query<LandingPageCNames> q = null;
			ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);
			q = dao.ofy().query(LandingPageCNames.class);
			q.filter("cname", cname);
			LandingPageCNames lpCNames =  q.get();
			if(lpCNames != null && lpCNames.id != null)
			{
				return true;			
			}
			else
			{
				return false;
			}
		}
		finally
		{
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	public boolean isCNameExists(String cname, Long cNameId) {
		String oldNameSpace = NamespaceManager.get();
		NamespaceManager.set("");
		
		try
		{
			Query<LandingPageCNames> q = null;
			ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);
			q = dao.ofy().query(LandingPageCNames.class);
			q.filter("cname", cname);
			q.filter("id != ", cNameId);
			LandingPageCNames lpCNames =  q.get();
			if(lpCNames != null && lpCNames.id != null)
			{
				return true;			
			}
			else
			{
				return false;
			}
		}
		finally
		{
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	
}
