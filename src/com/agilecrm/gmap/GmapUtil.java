package com.agilecrm.gmap;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;

import com.campaignio.logger.Log;
import com.campaignio.logger.util.CampaignLogsSQLUtil;
import com.google.appengine.api.NamespaceManager;




public class GmapUtil{
	
	/**
     * Returns recent visitor's details (stats_time, lat_long, email, browser_details)
     * with contact name.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @param subscriberId
     *            - Subscriber Id.
     * @param limit
     *            - limit to get number of logs.
     * @return logs array string.
     */
    public static List<Log> getSQLLogs(String campaignId, String subscriberId, String limit)
    {
	String domain = NamespaceManager.get();
	
	domain="dheerajtest";

	if (StringUtils.isEmpty(domain))
	    return null;

	// get SQL logs
	JSONArray logs = CampaignLogsSQLUtil.getLogs(campaignId, subscriberId, domain, limit);

	if (logs == null)
	    return null;

	try
	{
	    // to attach contact and campaign-name to each log.
	    return new ObjectMapper().readValue(logs.toString(), new TypeReference<List<Log>>()
	    {
	    });
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

} 