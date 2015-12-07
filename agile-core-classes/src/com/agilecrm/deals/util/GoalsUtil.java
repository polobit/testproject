package com.agilecrm.deals.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.agilecrm.deals.Goals;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.reports.Reports;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

/**
 * <code>GoalsUtil</code> is the utility class to fetch and save Goals with
 * respect to id,time period and also with respect to related
 * user. 
 * 
 * @author Nidhi
 * 
 */
public class GoalsUtil
{

	
	 public static List<Goals> saveGoal(List<Goals> goals)
	    {
		 	Goals new_goal;
	    	for(Goals goal:goals){
	    		
	    		goal.save();
	    	}
		 	return goals;
	    }
	public static List<Goals> fetchAllGoals(Long start_time)
	    {
		  
		  Map<String, Object> conditionsMap = new HashMap<String, Object>();
		  conditionsMap.put("start_time",start_time);
		  //conditionsMap.put("end_time",end_time);
		  List<Goals> list = Goals.dao.listByProperty(conditionsMap);
		return list;
	    }
	
	public static List<Goals> getAllGoalsForUser(Long onwner_id,Long start_time,Long end_time){
		
		Map<String, Object> conditionsMap = new HashMap<String, Object>();
		conditionsMap.put("ownerKey", new Key<DomainUser>(DomainUser.class, onwner_id));
		if(start_time!=null)
			conditionsMap.put("start_time >=",start_time);
		if(end_time!=null)
			conditionsMap.put("start_time <",end_time);
		return Goals.dao.listByProperty(conditionsMap);
	}
	
}

