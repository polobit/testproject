package com.agilecrm.deals.util;

import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.agilecrm.deals.Goals;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.reports.Reports;

public class GoalsUtil
{

	
	 public static List<Goals> saveGoal(List<Goals> goals)
	    {
	    	for(Goals goal:goals){
	    		goal.save();
	    	}
		 	return goals;
	    }
	  public static List<Goals> fetchAllGoals()
	    {
		return Goals.dao.fetchAll();
	    }
}

