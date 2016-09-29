package com.campaignio.tasklets.agile;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

public class Territory extends TaskletAdapter
{
	private String TERRITORIES = "territories";
	private String LOCATION_TYPE = "location_type";
	private String LOCATION_VALUE = "location_value";
	
	private String DYNAMIC_GRID = "dynamicgrid";
	private String NO_MATCH = "Nomatch";
	
	private String IN_ZONE_COMPARE ="in_zone_compare";
	
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
    {
    	String zones = getStringValue(nodeJSON, subscriberJSON, data, TERRITORIES);
    	
    	try
    	{
//    		JSONArray states = nodeJSON.getJSONArray("States");
//    		int totalBranches = states.length();
    		
    		JSONArray zonesArray = new JSONArray(zones);
    		
    		Map<String, Boolean> zonesMap = new LinkedHashMap<String, Boolean>(); // Map with branches as Keys and comparison result like true/false as Value
    		Map<String, String> zonesComparators = new HashMap<String, String>();
    		
    		String inZoneComparator = null;
    		
    		 // Iterate through json array having key-value pairs
		    for (int i = 0, len = zonesArray.length(); i < len; i++)
		    {
				JSONObject zone = zonesArray.getJSONObject(i); // Each condition within a zone
				
				String branch = zone.getString(DYNAMIC_GRID);
				
				// If 'NoMatch' continue
				if(NO_MATCH.equalsIgnoreCase(branch))
				{
//					totalBranches = totalBranches - 1;
					continue;
				}
				
				// For every new branch, update zonesComparators. Note: Initial Territory nodes consists of AND/OR conditions
				if(!zonesMap.containsKey(branch))
				{
					// For New Territory nodes, IN_ZONE_COMPARE is removed, so by default OR
					if(!zone.has(IN_ZONE_COMPARE))
						zone.put(IN_ZONE_COMPARE, "or");
					
					zonesComparators.put(branch, zone.getString(IN_ZONE_COMPARE));
				}
				
				String comparator = zone.getString(NewCondition.COMPARATOR); // equals, not equals, contains and in
				String locationType = zone.getString(LOCATION_TYPE); 
				String locationValue =  zone.getString(LOCATION_VALUE);
				
				System.out.println("Zone " + branch + " " + "locationType: " + locationType + " locationValue: " + locationValue + " Comparator: " + comparator);
				
				boolean expr = NewCondition.evaluateExpression(locationType, locationValue, NewCondition.IF_TYPE_VALUE, comparator, null); 
				
				Boolean flag = zonesMap.get(branch);
				
				// For first time
				if(flag == null)
				{
					zonesMap.put(branch, expr);
					flag = expr;
				}
					
				inZoneComparator = (zonesComparators.get(branch) == null) ? zone.getString(IN_ZONE_COMPARE) : zonesComparators.get(branch);
				
				if(flag != null && inZoneComparator != null)
				{
					if(inZoneComparator.equalsIgnoreCase("and")){
						flag = flag && expr;
						zonesMap.put(branch, flag);
					}
					
					if(inZoneComparator.equalsIgnoreCase("or")){
						flag = flag || expr;
						zonesMap.put(branch, flag);
					}
				}
		    }
		    
		    Set<String> keys = zonesMap.keySet();
		    
		    for(String key : keys)
		    {
		    	if(zonesMap.get(key))
		    	{
		    		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, key);
		    		return;
		    	}
		    }
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    		System.err.println("Exception occured while executing Territory..." + e.getMessage());
    	}
    	
    	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, NO_MATCH);
    	
    }
    
}



