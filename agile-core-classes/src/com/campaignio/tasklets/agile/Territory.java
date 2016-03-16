package com.campaignio.tasklets.agile;

import java.util.HashSet;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

public class Territory extends TaskletAdapter
{
	private String ZONES = "zones";
	private String LOCATION_TYPE = "location_type";
	private String LOCATION_VALUE = "location_value";
	
	private String DYNAMIC_GRID = "dynamicgrid";
	private String NO_MATCH = "Nomatch";
	
	private String IN_ZONE_COMPARE ="in_zone_compare";
	
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
    {
    	String zones = getStringValue(nodeJSON, subscriberJSON, data, ZONES);
    	
    	try
    	{
    		JSONArray states = nodeJSON.getJSONArray("States");
    		int totalBranches = states.length();
    		
    		JSONArray zonesArray = new JSONArray(zones);
    		
    		String branchTo = NO_MATCH;
    		
    		Set<String> skipZones = new HashSet<String>();
    		String zonesObserver = null;
    		String inZoneComparator = null;
    		
    		 // Iterate through json array having key-value pairs
		    for (int i = 0, len = zonesArray.length(); i < len; i++)
		    {
				JSONObject zone = zonesArray.getJSONObject(i); 
				
				String branch = zone.getString(DYNAMIC_GRID);
				
				// If 'NoMatch' continue
				if(NO_MATCH.equalsIgnoreCase(branch))
				{
					totalBranches = totalBranches - 1;
					continue;
				}
				
				// Skips already iterated branch
				if(skipZones.contains(branch)) 
					continue;
				
				if(zonesObserver == null)
				{
					inZoneComparator = zone.getString(IN_ZONE_COMPARE);
					zonesObserver = branch;
				} 
				
				if(!zonesObserver.equalsIgnoreCase(branch))  
					continue;
				
				String comparator = zone.getString(NewCondition.COMPARATOR); 
				String locationType = zone.getString(LOCATION_TYPE); 
				String locationValue =  zone.getString(LOCATION_VALUE);
				
				System.out.println("Zone " + branch + " " + "locationType: " + locationType + " locationValue: " + locationValue + " Comparator: " + comparator);
				
				boolean expr = NewCondition.evaluateExpression(locationType, locationValue, NewCondition.IF_TYPE_VALUE, comparator); 
				
				System.out.println("Evaluation expr: " + expr);
				if((inZoneComparator.equalsIgnoreCase("and") && expr) || (inZoneComparator.equalsIgnoreCase("or") && expr))
					branchTo = branch; 
				else
				{
					skipZones.add(branch);
					zonesObserver = null;
					branchTo = NO_MATCH;
					i = 0;
					
					totalBranches--;
					
					if(totalBranches <= 0)
						break;
				}
		    }
				
			TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, branchTo);
			return;
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    		System.err.println("Exception occured while executing CheckLocation..." + e.getMessage());
    	}
    	
    	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, NO_MATCH);
    	
    }
    
public static void main(String[] args)
{
	String zones = "[{\"dynamicgrid\":\"Nomatch\",\"location_type\":\"-\",\"comparator\":\"-\",\"location_value\":\"-\",\"in_zone_compare\":\"-\"},{\"dynamicgrid\":\"A\",\"location_type\":\"IN\",\"comparator\":\"equal_to\",\"location_value\":\"IN\",\"in_zone_compare\":\"and\"},{\"dynamicgrid\":\"A\",\"location_type\":\"AP\",\"comparator\":\"equal_to\",\"location_value\":\"AP1\",\"in_zone_compare\":\"\"},{\"dynamicgrid\":\"A\",\"location_type\":\"AP\",\"comparator\":\"equal_to\",\"location_value\":\"AP\",\"in_zone_compare\":\"\"},{\"dynamicgrid\":\"B\",\"location_type\":\"sss\",\"comparator\":\"equal_to\",\"location_value\":\"sss\",\"in_zone_compare\":\"and\"},{\"dynamicgrid\":\"B\",\"location_type\":\"tn\",\"comparator\":\"equal_to\",\"location_value\":\"tn1\",\"in_zone_compare\":\"and\"},{\"dynamicgrid\":\"C\",\"location_type\":\"APP\",\"comparator\":\"equal_to\",\"location_value\":\"APPs\",\"in_zone_compare\":\"\"}]";
	
	try
	{
		int count = 3;
		JSONArray zonesArray = new JSONArray(zones);
		
		Territory cl = new Territory();
		
		String branchTo = cl.NO_MATCH;
		
		Set<String> skipZones = new HashSet<String>();
		String zonesObserver = null;
		
		 // Iterate through json array having key-value pairs
	    for (int i = 0, len = zonesArray.length(); i < len; i++)
	    {
			JSONObject zone = zonesArray.getJSONObject(i); // A json
			
			String branch = zone.getString(cl.DYNAMIC_GRID);// A
			
			// If 'NoMatch' continue
			if(cl.NO_MATCH.equalsIgnoreCase(branch))
			{
				count = count -1;
				continue;
			}
			
			// Skips already iterated branch
			if(skipZones.contains(branch)) 
				continue;
			
			if(zonesObserver == null)
				zonesObserver = branch; //zO = A
			
			if(!zonesObserver.equalsIgnoreCase(branch))  
				continue;
			
			String comparator = zone.getString(NewCondition.COMPARATOR); // equal_to
			String locationType = zone.getString(cl.LOCATION_TYPE); // in
			String locationValue = zone.getString(cl.LOCATION_VALUE);// in
			
			String inZoneComparator =  zone.getString("in_zone_compare"); //and
			
			boolean expr = NewCondition.evaluateExpression(locationType, locationValue, NewCondition.IF_TYPE_VALUE, comparator); 
			
			if((inZoneComparator.equalsIgnoreCase("and") && expr) || (inZoneComparator.equalsIgnoreCase("or") || expr))
				branchTo = branch;
			else
			{
				skipZones.add(branch);
				zonesObserver = null;
				branchTo = "No Match";
				i = 0;
				count--;
				
				if(count < 0)
					break;
			}
	    }
	    
	    System.out.println("branchTo is " + branchTo);
	}catch(Exception e)
	{
		e.printStackTrace();
		
	}
}
    
}



