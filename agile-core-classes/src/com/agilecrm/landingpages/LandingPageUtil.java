package com.agilecrm.landingpages;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;

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
	
	
}
