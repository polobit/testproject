package com.agilecrm.dashboards.util;

import java.util.List;

import com.agilecrm.dashboards.Dashboard;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.googlecode.objectify.Key;

public class DashboardUtil {
	// Dao
	private static ObjectifyGenericDao<Dashboard> dao = new ObjectifyGenericDao<Dashboard>(Dashboard.class);
	
	/**
	 * Fetches all {@link Dashboard}s for current {@link AgileUser}
	 *  
	 * @return {@link List} of {@link Dashboard}s
	 */
	public static List<Dashboard> getAddedDashboardsForCurrentUser()throws Exception{
		
		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);
		
		return dao.ofy().query(Dashboard.class).filter("agileUser", userKey).list();
	}
	
	/**
	 * Checks whether dashboard existed or not with the new dashboard name
	 *  
	 * @return {@link Boolean}
	 */
	public static boolean isDuplicateDashboard(Dashboard dashboard){
		boolean isDuplicate = false;
		int dashboardsCount = 0;
		try {
			// Creates Current AgileUser key
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);
			
			if(dashboard.name != null) {
				dashboardsCount = dao.ofy().query(Dashboard.class).filter("agileUser", userKey).filter("name", dashboard.name.trim()).count();
			}
			
			if(dashboardsCount > 0) {
				isDuplicate = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isDuplicate;
	}

}
