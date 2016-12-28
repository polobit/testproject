package com.agilecrm.visitor.segmentation;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.web.stats.StatsSQLUtil;

/**
 * <code>SegmentationQueryGenerator</code> Responsible for generating
 * segmentation sql query from LHS and RHS filters.
 * 
 * @author Ramesh
 * 
 */
public class SegmentationQueryGenerator
{
    private static final Logger log = Logger.getLogger(SegmentationQueryGenerator.class.getName());
    private String domain = null;
    private String filterJsonString = null;
    private String startTime = null;
    private String endTime = null;
    private String cursor = null;
    private String pageSize = null;
    
    public SegmentationQueryGenerator(String domain, String filterJsonString, String startTime, String endTime,
	    String cursor, String pageSize)
    {
	this.domain = domain;
	this.filterJsonString = filterJsonString;
	this.startTime = startTime;
	this.endTime = endTime;
	this.cursor = cursor;
	this.pageSize = pageSize;
	
    }
    
    /**
     * This method is responsible for generating segmentation sql query from LHS
     * and RHS filters JSON.
     * 
     * @param domain
     * @param filterJsonString
     * @param startTime
     * @param endTime
     * @param cursor
     * @param page_size
     * @return
     */
    public String generateSegmentationQuery()
    {
	String segmentationQuery = "";
	try
	{
	    segmentationQuery = "select email,stats_time from page_visits where domain = '" + domain
		    + "' and email!='' and email!='null' and stats_time between '" + startTime + "' and  '" + endTime
		    + "' ";
	    String groupByEmail = " group by email ";
	    String orderByTime = " order by stats_time desc ";
	    if (StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime))
	    {
		if (StringUtils.isNotBlank(filterJsonString) && !filterJsonString.equals("null"))
		{
		    List<SegmentationRule> rules = new ArrayList<SegmentationRule>();
		    
		    JSONObject filterJsonObject = new JSONObject(filterJsonString);
		    JSONArray filters = filterJsonObject.getJSONArray("rules");
		    SegmentationRule sessionsQuery = null;
		    for (int i = 0; i < filters.length(); i++)
		    {
			SegmentationRule segmentationRule = new SegmentationRule();
			String inputType = (String) filters.getJSONObject(i).get("LHS");
			segmentationRule.LHS = getColumnName(inputType);
			segmentationRule.CONDITION = (String) filters.getJSONObject(i).get("CONDITION");
			segmentationRule.RHS = (String) filters.getJSONObject(i).get("RHS");
			if (segmentationRule.CONDITION.equals("IN_BETWEEN"))
			    segmentationRule.RHS_NEW = (String) filters.getJSONObject(i).get("RHS_NEW");
			if (inputType.equalsIgnoreCase("webstats"))
			    sessionsQuery = segmentationRule;
			else
			    rules.add(segmentationRule);
		    }
		    if (rules.size() > 0 || sessionsQuery!=null)
		    {
			String conditionsQuery = constructQuery(rules);
			segmentationQuery = segmentationQuery + conditionsQuery;
			segmentationQuery = segmentationQuery + groupByEmail;
			if (sessionsQuery != null)
			{
			    List<SegmentationRule> sessionsQueryList = new ArrayList<SegmentationRule>();
			    sessionsQueryList.add(sessionsQuery);
			    segmentationQuery = segmentationQuery + constructQuery(sessionsQueryList);
			}
			segmentationQuery = segmentationQuery + orderByTime;
			segmentationQuery = segmentationQuery + StatsSQLUtil.appendLimitToQuery(cursor, pageSize);
		    }
		    log.info(segmentationQuery);
		}
		else
		{
		    segmentationQuery = segmentationQuery + groupByEmail;
		    segmentationQuery = segmentationQuery + orderByTime;
		    segmentationQuery = segmentationQuery + StatsSQLUtil.appendLimitToQuery(cursor, pageSize);
		    log.info(segmentationQuery);
		}
	    }
	    else
	    {
		// start time and end time range is mandatory.
		return null;
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println();
	    return null;
	}
	return segmentationQuery;
    }
    
    /**
     * Maps the sql operator value with respect to filter condition
     * 
     * @param rules
     * @return
     */
    public String constructQuery(List<SegmentationRule> rules)
    {
	String buildQuery = " ";
	for (SegmentationRule rule : rules)
	{
	    switch (rule.CONDITION)
	    {
	    case "IS_EQUAL_TO":
	    {
		buildQuery = buildQuery + rule.LHS + " = '" + rule.RHS + "'";
		break;
	    }
	    case "IS_NOT_EQUAL_TO":
	    {
		buildQuery = buildQuery + rule.LHS + " != '" + rule.RHS + "'";
		break;
	    }
	    case "CONTAINS":
	    {
		buildQuery = buildQuery + rule.LHS + " LIKE '%" + rule.RHS + "%'";
		break;
	    }
	    case "DOES_NOT_CONTAIN":
	    {
		buildQuery = buildQuery + rule.LHS + " NOT LIKE '%" + rule.RHS + "%'";
		break;
	    }
	    case "IS_GREATER_THAN":
	    {
		buildQuery = buildQuery + rule.LHS + " > " + rule.RHS;
		break;
	    }
	    case "IS_LESS_THAN":
	    {
		buildQuery = buildQuery + rule.LHS + " < " + rule.RHS;
		break;
	    }
	    case "IS_GREATER_THAN_OR_EQUAL_TO":
	    {
		buildQuery = buildQuery + rule.LHS + " >= " + rule.RHS;
		break;
	    }
	    case "IS_LESS_THAN_OR_EQUAL_TO":
	    {
		buildQuery = buildQuery + rule.LHS + " <= " + rule.RHS;
		break;
	    }
	    case "IN_BETWEEN":
	    {
		buildQuery = buildQuery + rule.LHS + " between  " + rule.RHS + " and " + rule.RHS_NEW + "";
		break;
	    }
	    case "STARTS_WITH":
	    {
		buildQuery = buildQuery + rule.LHS + " LIKE '" + rule.RHS + "%'";
		break;
	    }
	    case "ENDS_WITH":
	    {
		buildQuery = buildQuery + rule.LHS + " LIKE '%" + rule.RHS + "'";
		break;
	    }
	    default:
	    {
	    }
	    }
	}
	
	return buildQuery;
	
    }
    
    /**
     * Maps the page visits table column name with respect to LHS value
     * 
     * @param inputName
     * @return
     */
    public String getColumnName(String inputName)
    {
	String colName = null;
	
	switch (inputName)
	{
	
	case "page_viewed":
	    colName = " and url";
	    break;
	
	case "referred_from":
	    colName = " and ref_url";
	    break;
	
	case "webstats":
	    colName = " having count(distinct sid)";
	    break;
	
	case "ip_country":
	    colName = " and country";
	    break;
	
	case "ip_states":
	    colName = " and region";
	    break;
	
	case "ip_city":
	    colName = " and city";
	    break;
	
	case "browser":
	    colName = " and user_agent";
	    break;
	
	case "browser_language":
	    colName = " and user_agent";
	    break;
	
	case "os":
	    colName = " and user_agent";
	    break;
	
	case "device":
	    colName = " and user_agent";
	    break;
	
	default:
	{
	    
	}
	}
	
	return colName;
	
    }
}