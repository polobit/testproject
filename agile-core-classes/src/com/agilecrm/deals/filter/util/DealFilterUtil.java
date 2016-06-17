package com.agilecrm.deals.filter.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.filter.DealFilter;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.util.DomainUserUtil;
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
	    
	    if(id != null && !id.equalsIgnoreCase("my-deals") && !id.equalsIgnoreCase("null"))
	    {
	    	filter = getDealFilter(Long.valueOf(id));
	    	if(filter != null && filter.archived != null)
	    	{
	    		setOldFiltersData(filter);
	    	}
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
	    
	    if(id != null && (id.equalsIgnoreCase("my-deals") || id.equalsIgnoreCase("null")))
	    {
	    	setDefaultState(filter);
	    }
	    
	    SearchRule rule = new SearchRule();
	    rule.LHS = "type";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = "Opportunity";
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
		filter.rules = modifyTrackAndMilestoneRules(andRules, pipeline, milestone);
		filter.or_rules = modifyTrackAndMilestoneRules(orRules, pipeline, milestone);
	}
	
	public static List<SearchRule> modifyTrackAndMilestoneRules(List<SearchRule> rules, String pipeline, String milestone)
	{
		boolean track_condition_exists = false;
		List<SearchRule> modifiedRules = new ArrayList<SearchRule>();
		for(SearchRule rule : rules)
		{
			if(rule.LHS != null && rule.LHS.equalsIgnoreCase("track_milestone") && pipeline == null && milestone == null)
			{
				String rhsVal = rule.RHS;
				String pipeline_id = rhsVal.substring(0, rhsVal.indexOf("_"));
				String milestoneName = rhsVal.substring(rhsVal.indexOf('_') + 1, rhsVal.length() + 1);
				SearchRule newRule = new SearchRule();
				newRule.LHS = "pipeline";
				newRule.CONDITION = rule.CONDITION;
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
			else if(rule.LHS != null && rule.LHS.equalsIgnoreCase("track_milestone") && pipeline != null && milestone != null && !track_condition_exists)
			{
				setDeafultTrackMilestoneFilter(modifiedRules, pipeline, milestone);
			}
			else
			{
				modifiedRules.add(rule);
			}
		}
		if(!track_condition_exists)
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
    		if(dealFilter.value != null)
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
				rule.RHS = String.valueOf(dealFilter.close_date_start * 1000);
				break;
			case "AFTER":
				rule.CONDITION = SearchRule.RuleCondition.AFTER;
				rule.RHS = String.valueOf(dealFilter.close_date_start  * 1000);
				break;
			case "BEFORE":
				rule.CONDITION = SearchRule.RuleCondition.BEFORE;
				rule.RHS = String.valueOf(dealFilter.close_date_start  * 1000);
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
				rule.RHS = String.valueOf(dealFilter.close_date_start  * 1000);
				rule.RHS_NEW = String.valueOf(dealFilter.close_date_end  * 1000);
				break;
			}
    		andRules.add(rule);
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

}
