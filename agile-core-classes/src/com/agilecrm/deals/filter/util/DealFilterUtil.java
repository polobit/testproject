package com.agilecrm.deals.filter.util;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.filter.DealFilter;

public class DealFilterUtil {
	// Dao
	private static ObjectifyGenericDao<DealFilter> dao = new ObjectifyGenericDao<DealFilter>(DealFilter.class);
	
	public static List<DealFilter> getAllFilters(){
		try {
			return dao.fetchAllByOrder("name");
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
