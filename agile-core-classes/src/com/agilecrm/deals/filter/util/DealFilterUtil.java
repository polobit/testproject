package com.agilecrm.deals.filter.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.filter.DealFilter;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.OpportunityDocument;
import com.agilecrm.search.query.QueryDocument;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.search.ScoredDocument;
import com.google.gson.Gson;
import com.itextpdf.text.pdf.PdfStructTreeController.returnType;

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
	
	public static DealFilter getDealFilter(Long id){
		try {
			return dao.get(id);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	@SuppressWarnings("unchecked")
	public static List<Opportunity> getDeals(String id, Integer count, String cursor, String orderBy, String pipeline_id, String milstone)
    {
	DealFilter filter = null;
	try
	{
	    System.out.println("cursor : " + cursor + ", count : " + count);
	    
	    if(id != null && !id.equalsIgnoreCase("my-deals") && !id.equalsIgnoreCase("null") && StringUtils.isNotEmpty(id))
	    {
	    	filter = getDealFilter(Long.valueOf(id));
	    	if(filter != null && filter.archived != null)
	    	{
	    		setOldFiltersData(filter);
	    	}
	    	if(filter == null)
	    	{
	    		filter = new DealFilter();
	    		id = "";
	    	}
	    	changeStateFilter(filter);
	    }
	    else if(id != null && id.equalsIgnoreCase("my-deals"))
	    {
	    	filter = new DealFilter();
	    	setDefaultOwner(filter);
	    }
	    else
	    {
	    	filter = new DealFilter();
	    }
	    
	    setTrackAndMilestoneFilters(filter, pipeline_id, milstone);
	    
	    if(id != null && (id.equalsIgnoreCase("my-deals") || id.equalsIgnoreCase("null") || StringUtils.isEmpty(id)))
	    {
	    	setDefaultState(filter);
	    }
	    
	    SearchRule rule = new SearchRule();
	    rule.LHS = "type";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = "Opportunity";
	    filter.rules.add(rule);
	    rule = new SearchRule();
	    rule.LHS = "schema_version";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = "1.0";	    
	    filter.rules.add(rule);

	    // Sets ACL condition
	    UserAccessControlUtil.checkReadAccessAndModifyTextSearchQuery(UserAccessControl.AccessControlClasses.Opportunity.toString(), filter.rules, null);

	    return new ArrayList<Opportunity>(filter.queryDeals(count, cursor, orderBy));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
	
	public static void setDefaultOwner(DealFilter filter)
	{
		try 
		{
			DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
			SearchRule rule = new SearchRule();
		    rule.LHS = "owner_id";
		    rule.CONDITION = RuleCondition.EQUALS;
		    rule.RHS = String.valueOf(domainUser.id);
		    filter.rules.add(rule);
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
	}
	
	public static void setDefaultState(DealFilter filter)
	{
		SearchRule rule = new SearchRule();
	    rule.LHS = "archived";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = "false";
	    filter.rules.add(rule);
	}
	
	public static void setTrackAndMilestoneFilters(DealFilter filter, String pipeline, String milestone)
	{
		List<SearchRule> andRules = filter.rules;
		List<SearchRule> orRules = filter.or_rules;
		filter.rules = modifyTrackAndMilestoneRules(andRules, pipeline, milestone, true);
		filter.or_rules = modifyTrackAndMilestoneRules(orRules, pipeline, milestone, false);
	}
	
	public static List<SearchRule> modifyTrackAndMilestoneRules(List<SearchRule> rules, String pipeline, String milestone, boolean isAndRules)
	{
		List<SearchRule> modifiedRules = new ArrayList<SearchRule>();
		for(SearchRule rule : rules)
		{
			if(rule.LHS != null && rule.LHS.equalsIgnoreCase("track_milestone") && pipeline == null && milestone == null)
			{
				String rhsVal = rule.RHS;
				String pipeline_id = rhsVal.substring(0, rhsVal.indexOf("_"));
				String milestoneName = rhsVal.substring(rhsVal.indexOf('_') + 1, rhsVal.length());
				SearchRule newRule = new SearchRule();
				newRule.LHS = "pipeline";
				newRule.CONDITION = rule.CONDITION;
				if(rule.CONDITION.equals(RuleCondition.NOTEQUALS) && milestoneName != null && !milestoneName.equalsIgnoreCase("ALL@MILESTONES"))
					newRule.CONDITION =RuleCondition.EQUALS;
				newRule.RHS = pipeline_id;
				modifiedRules.add(newRule);
				if(milestoneName != null && !milestoneName.equalsIgnoreCase("ALL@MILESTONES"))
				{
					newRule = new SearchRule();
					newRule.LHS = "milestone";
					newRule.CONDITION = rule.CONDITION;
					newRule.RHS = milestoneName;
					modifiedRules.add(newRule);
				}
			}
			else if(rule.LHS != null && rule.LHS.equalsIgnoreCase("track_milestone") && pipeline != null && milestone != null)
			{
				continue;
			}
			else
			{
				modifiedRules.add(rule);
			}
		}
		if(pipeline != null && milestone != null && isAndRules)
		{
			setDeafultTrackMilestoneFilter(modifiedRules, pipeline, milestone);
		}
		return modifiedRules;
	}
	
	public static void setDeafultTrackMilestoneFilter(List<SearchRule> rules, String pipeline, String milestone)
	{
		SearchRule newRule = new SearchRule();
		newRule.LHS = "pipeline";
		newRule.CONDITION = SearchRule.RuleCondition.EQUALS;
		newRule.RHS = pipeline;
		rules.add(newRule);
		
		newRule = new SearchRule();
		newRule.LHS = "milestone";
		newRule.CONDITION = SearchRule.RuleCondition.EQUALS;
		newRule.RHS = milestone;
		rules.add(newRule);
	}
	
	public static void setOldFiltersData(DealFilter dealFilter)
	{
		if(dealFilter != null && dealFilter.archived == null)
		{
			return;
		}
		List<SearchRule> andRules = new ArrayList<SearchRule>();
    	
    	if(dealFilter.owner_id != null)
    	{
    		SearchRule rule = new SearchRule();
    		rule.LHS = "owner_id";
    		rule.CONDITION = SearchRule.RuleCondition.EQUALS;
    		rule.RHS = String.valueOf(dealFilter.owner_id);
    		andRules.add(rule);
    	}
    	if(dealFilter.pipeline_id != null)
    	{
    		SearchRule rule = new SearchRule();
    		rule.LHS = "track_milestone";
    		rule.CONDITION = SearchRule.RuleCondition.EQUALS;
    		if(StringUtils.isNotEmpty(dealFilter.milestone))
    		{
    			rule.RHS = String.valueOf(dealFilter.pipeline_id)+ "_" +String.valueOf(dealFilter.milestone);
    		}
    		else
    		{
    			rule.RHS = String.valueOf(dealFilter.pipeline_id)+ "_ALL@MILESTONES";
    		}
    		andRules.add(rule);
    	}
    	if(dealFilter.value_filter != null && (StringUtils.isNotEmpty(dealFilter.value) || StringUtils.isNotEmpty(dealFilter.value_start) || StringUtils.isNotEmpty(dealFilter.value_end)))
    	{
    		SearchRule rule = new SearchRule();
    		rule.LHS = "expected_value";
    		if(StringUtils.isNotEmpty(dealFilter.value))
    		{
    			rule.CONDITION = SearchRule.RuleCondition.EQUALS;
    			rule.RHS = String.valueOf(dealFilter.value);
    		}
    		else
    		{
    			rule.CONDITION = SearchRule.RuleCondition.BETWEEN_NUMBER;
    			rule.RHS = String.valueOf(dealFilter.value_start);
    			rule.RHS_NEW = String.valueOf(dealFilter.value_end);
    		}
    		andRules.add(rule);
    	}
    	if(dealFilter.close_date_filter != null && (dealFilter.close_date_value != null || dealFilter.close_date_start != null || dealFilter.close_date_end != null))
    	{
    		SearchRule rule = new SearchRule();
    		rule.LHS = "closed_time";
    		String closeDateFilter = dealFilter.close_date_filter;
    		switch (closeDateFilter) {
			case "ON":
				rule.CONDITION = SearchRule.RuleCondition.ON;
				if(dealFilter.close_date_start != null)
				{
					rule.RHS = String.valueOf(dealFilter.close_date_start * 1000);
				}
				break;
			case "AFTER":
				rule.CONDITION = SearchRule.RuleCondition.AFTER;
				if(dealFilter.close_date_start != null)
				{
					rule.RHS = String.valueOf(dealFilter.close_date_start  * 1000);
				}
				break;
			case "BEFORE":
				rule.CONDITION = SearchRule.RuleCondition.BEFORE;
				if(dealFilter.close_date_start != null)
				{
					rule.RHS = String.valueOf(dealFilter.close_date_start  * 1000);
				}
				break;
			case "LAST":
				rule.CONDITION = SearchRule.RuleCondition.LAST;
				rule.RHS = String.valueOf(dealFilter.close_date_value);
				break;
			case "NEXT":
				rule.CONDITION = SearchRule.RuleCondition.NEXT;
				rule.RHS = String.valueOf(dealFilter.close_date_value);
				break;
			default:
				rule.CONDITION = SearchRule.RuleCondition.BETWEEN;
				if(dealFilter.close_date_start != null)
				{
					rule.RHS = String.valueOf(dealFilter.close_date_start  * 1000);
				}
				if(dealFilter.close_date_end != null)
				{
					rule.RHS_NEW = String.valueOf(dealFilter.close_date_end  * 1000);
				}
				break;
			}
    		if(rule.RHS != null)
    		{
    			andRules.add(rule);
    		}
    	}
    	if(dealFilter.archived != null)
    	{
    		SearchRule rule = new SearchRule();
    		rule.LHS = "archived";
    		rule.CONDITION = SearchRule.RuleCondition.EQUALS;
    		rule.RHS = dealFilter.archived;
    		andRules.add(rule);
    	}
    	dealFilter.rules = andRules;
	}
	
	@SuppressWarnings("unchecked")
	public static List<Opportunity> getDealsWithTag(String tagName, Integer count, String cursor, String orderBy)
	{
		DealFilter filter = new DealFilter();
		SearchRule rule = new SearchRule();
	    rule.LHS = "type";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = "Opportunity";
	    filter.rules.add(rule);
	    
	    rule = new SearchRule();
	    rule.LHS = "tags";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = tagName;
	    filter.rules.add(rule);

	    // Sets ACL condition
	    UserAccessControlUtil.checkReadAccessAndModifyTextSearchQuery(UserAccessControl.AccessControlClasses.Opportunity.toString(), filter.rules, null);
	    
	    try
	    {
	    	return new ArrayList<Opportunity>(filter.queryDeals(count, cursor, orderBy));
	    }
	    catch(Exception e)
	    {
	    	e.printStackTrace();
	    	return null;
	    }
	}
	
	public static JSONObject getDealsCountBasedOnList(List<Opportunity> oppList, String milestone)
	{
		double total = 0d;
		JSONObject countObj = new JSONObject();
		countObj.put("milestone", milestone);
		if(oppList != null && oppList.size() > 0)
		{
			for(Opportunity opp : oppList)
			{
				if(opp.expected_value != null)
				{
					total += opp.expected_value;
				}
			}
		}
		countObj.put("total", total);
		
		return countObj;
	}
	
	public static void changeStateFilter(DealFilter filter)
	{
		List<SearchRule> andRules = new ArrayList<SearchRule>();
		List<SearchRule> orRules = new ArrayList<SearchRule>();
		
		setStateFilterRules(filter.rules, andRules, orRules, true);
		setStateFilterRules(filter.or_rules, andRules, orRules, false);
		
		filter.rules = andRules;
		filter.or_rules = orRules;
		
	}
	
	public static void setStateFilterRules(List<SearchRule> rules, List<SearchRule> andRules, List<SearchRule> orRules, boolean isAndRules)
	{
		for(SearchRule rule : rules)
		{
			if(rule.LHS != null && rule.LHS.equalsIgnoreCase("archived") && rule.RHS.equalsIgnoreCase("all"))
			{
				SearchRule newRule = new SearchRule();
				newRule.LHS = rule.LHS;
				newRule.CONDITION = rule.CONDITION;
				newRule.RHS = "true";
				orRules.add(newRule);
				
				newRule = new SearchRule();
				newRule.LHS = rule.LHS;
				newRule.CONDITION = rule.CONDITION;
				newRule.RHS = "false";
				orRules.add(newRule);
			}
			else
			{
				if(isAndRules)
				{
					andRules.add(rule);
					continue;
				}

				orRules.add(rule);
				
			}
		}
	}
	
	@SuppressWarnings("unchecked")
	public static List<ScoredDocument> getDealSearchDocs(String id, Integer count, String cursor, String orderBy, String pipeline_id, String milstone, QueryDocument<Opportunity> queryInstace)
    {
	DealFilter filter = null;
	try
	{	
	    System.out.println("cursor : " + cursor + ", count : " + count);
	    
	    if(id != null && !id.equalsIgnoreCase("my-deals") && !id.equalsIgnoreCase("null") && StringUtils.isNotEmpty(id))
	    {
	    	filter = getDealFilter(Long.valueOf(id));
	    	if(filter != null && filter.archived != null)
	    	{
	    		setOldFiltersData(filter);
	    	}
	    	if(filter == null)
	    	{
	    		filter = new DealFilter();
	    		id = "";
	    	}
	    	changeStateFilter(filter);
	    }
	    else if(id != null && id.equalsIgnoreCase("my-deals"))
	    {
	    	filter = new DealFilter();
	    	setDefaultOwner(filter);
	    }
	    else
	    {
	    	filter = new DealFilter();
	    }
	    
	    setTrackAndMilestoneFilters(filter, pipeline_id, milstone);
	    
	    if(id != null && (id.equalsIgnoreCase("my-deals") || id.equalsIgnoreCase("null") || StringUtils.isEmpty(id)))
	    {
	    	setDefaultState(filter);
	    }
	    
	    SearchRule rule = new SearchRule();
	    rule.LHS = "type";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = "Opportunity";
	    filter.rules.add(rule);
	    rule = new SearchRule();
	    rule.LHS = "schema_version";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = "1.0";	    
	    filter.rules.add(rule);

	    // Sets ACL condition
	    UserAccessControlUtil.checkReadAccessAndModifyTextSearchQuery(UserAccessControl.AccessControlClasses.Opportunity.toString(), filter.rules, null);
	    
	    // Fetches 200 deals for every iteration
	 	return queryInstace.advancedSearchOnlyIds(filter, count, cursor, null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
	
	 public static DealFilter getFilterFromJSONString(String filter)
	    {
		Gson gson = new Gson();
		DealFilter deal_filter = gson.fromJson(filter, DealFilter.class);
		SearchRule rule = new SearchRule();
		rule.LHS = "type";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = "Opportunity";
	    deal_filter.rules.add(rule);
	    rule = new SearchRule();
	    rule.LHS = "schema_version";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = "1.0";	
	    deal_filter.rules.add(rule);
		return deal_filter;
	    }

	public static void lostDeals(DealFilter deal_filter)
	{
		List<SearchRule> andRules=deal_filter.rules;
		List<SearchRule> modifiedRules = new ArrayList<SearchRule>();
		List<SearchRule> modifiedRules_or = new ArrayList<SearchRule>();
		for(SearchRule rule : andRules)
		{
			if(rule.LHS != null && rule.LHS.equalsIgnoreCase("loss_reason_time"))
			{
				modifiedRules_or.add(rule);
			}
			else
			{
				modifiedRules.add(rule);
			}
		}
		deal_filter.rules=modifiedRules;
		deal_filter.or_rules.addAll(modifiedRules_or);
	}
}
