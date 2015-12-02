package com.agilecrm.deals.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.agilecrm.deals.Goals;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.reports.Reports;

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
	public static List<Goals> fetchAllGoals(Long start_time, Long end_time)
	    {
		  
		  Map<String, Object> conditionsMap = new HashMap<String, Object>();
		  conditionsMap.put("start_time",start_time);
		  conditionsMap.put("end_time",end_time);
		  List<Goals> list = Goals.dao.listByProperty(conditionsMap);
		return list;
	    }
}

