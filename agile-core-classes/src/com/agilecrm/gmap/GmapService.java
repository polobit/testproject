package com.agilecrm.gmap;

import java.util.List;
/**
 * Common interface for all the page view methods
 * 
 * 
 * @author vinay
 */

public interface GmapService {
	public List<GmapLogs> getLatestVisitors(String userDomain, String startDate, String endDate, String timeZone);
	public List<GmapLogs> getPageViews(String userDomain, String startDate, String endDate, String timeZone,String queryOffset,String pageSize);

}
