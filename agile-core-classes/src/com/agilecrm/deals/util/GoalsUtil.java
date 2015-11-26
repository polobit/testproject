package com.agilecrm.deals.util;

import java.util.List;

import net.sf.json.JSONObject;

import com.agilecrm.deals.Goals;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.reports.Reports;

public class GoalsUtil
{

	
	 public JSONObject saveGoal(JSONObject jsonobject)
	    {
		 return null;
	    }
	  public static List<Goals> fetchAllReports()
	    {
		return Goals.dao.fetchAll();
	    }
}

