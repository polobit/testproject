package com.agilecrm.alldomainstats.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AllDomainStats;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>AllDomainStatsUtil</code> is a utility class to process the data of AllDomainStats
 * class, it processes when fetching the data and saving the data.
 * <p>
 * This utility class includes methods needs to return count of particular stats based
 * on created time and etc.. 
 *  * </p>
 * 
 * @author Prashannjeet
 * 
 */

public class AllDomainStatsUtil {
		
	/**
     * ObjctifyDAO for AllDomainStats
     */
    public static ObjectifyGenericDao<AllDomainStats> dao = new ObjectifyGenericDao<AllDomainStats>(AllDomainStats.class);
    
    /**
     * Get the all Domain Stats present in Database..
     * @param created_time
     * @return current created date
     */
    public static AllDomainStats getAllDomainStats(long created_time)
    {
    	String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");
      try{
    			AllDomainStats allDomainStats= dao.getByProperty("created_time", created_time);
    			return allDomainStats;
    	}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
      finally
        {
    	  NamespaceManager.set(oldNamespace);
       }
    }
    
    /**
     * save the all properties of AllDomainStats  in Database for all Domain
     * @param Object of AllDomainStats class
     * @return
     */
    
    public static void saveAllDomainStas(AllDomainStats allDomainStats)
    {
    	try{
			  allDomainStats.save();
	       }
	catch (Exception e)
	{
		e.printStackTrace();
	}
    	
    }
    
    /**
     * save the all properties of AllDomainStats  in Database for all Domain
     * @param Object of AllDomainStats class
     * @return
     */
    
    public static void updateAllDomainStats(String fieldName)
    {
    	try{
    		// Stats report for Agile admin
			 DateUtil dateUtil=new DateUtil();
			 
			 long created_time= dateUtil.toMidnight().getCalendar().getTimeInMillis();
			 created_time=created_time / 1000L;
			 
			  long campaign_count=0L;
			  long webrule_count=0L;
			  long triggers_count=0L;
			  long form_count=0L;
			  long landingPage_count=0L;
			  long emailTemplate_count=0L;
			  long notificationTemplate_count = 0L;
			 
			 // Getting current day stats count details
			 AllDomainStats allDomainStats=AllDomainStatsUtil.getAllDomainStats(created_time);
			 
			 switch(fieldName)
			 {
			 	case AllDomainStats.CAMPAIGN_COUNT:	
			 		 if(allDomainStats != null)
		 			 	allDomainStats.campaign_count ++;
			 		 
			 		 campaign_count=1L;
			 		 break;
			 		 
			 	case AllDomainStats.LANDINGPAGE_COUNT:	
			 		 if(allDomainStats != null)
			 			 	allDomainStats.landingPage_count ++;
			 		 landingPage_count=1L;
			 		 break;
			 		 
			 	case AllDomainStats.FORM_COUNT:	
			 		 if(allDomainStats != null)
		 			 	allDomainStats.form_count ++;
			 		 form_count=1L;
			 		 break;
			 			
			 	case AllDomainStats.WEBRULE_COUNT:	
			 		 if(allDomainStats != null)
		 			 	allDomainStats.webrule_count ++;
			 		 webrule_count=1L;
			 		 break;
			 		 
			 	case AllDomainStats.TRIGGER_COUNT:	
			 		 if(allDomainStats != null)
		 			 	 allDomainStats.triggers_count ++;
			 		 triggers_count=1L;
			 		 break;
			 		 
			 	case AllDomainStats.EMAIL_TEMPLATE_COUNT:	
			 		 if(allDomainStats != null)
		 			 	 allDomainStats.emailTemplate_count ++;
			 		 emailTemplate_count=1L;
			 		 break;
			 		 
			 	case AllDomainStats.NOTIFICATION_TEMPLATE_COUNT:	
			 		 if(allDomainStats != null)
		 			 	 allDomainStats.notificationTemplate_count ++;
			 		notificationTemplate_count=1L;
			 		 break;
			 
			 
			 }
			 
			 //If in datastore there is no entity then add new other wise update the entity
			 if(allDomainStats == null)
			 {
				 AllDomainStatsUtil.saveAllDomainStas(new AllDomainStats(created_time, campaign_count, webrule_count, form_count, landingPage_count, triggers_count, emailTemplate_count,notificationTemplate_count,null));
			 }
			 else
			 { 
				 AllDomainStatsUtil.saveAllDomainStas(allDomainStats);
				 System.out.println("Stats Report updated "+ allDomainStats.toString());
			 }
    	}
    	catch (Exception e)
    	{
    		e.printStackTrace();
    	}
    	
    	
    }
   
    /**
     * Get the list of all stats report 
     * 
     * @param max
     * @param cursor
     * @return List of AllDomainStats
     */
    public static List<AllDomainStats> getAllDomainStats(int max, String cursor)
    {
    	try
		{
		    return dao.fetchAll(max, cursor);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}	
    }
    
    
    /**
     * This method will update AllDomainStats entity with number of node in campaign for all domain
     * @param nodeCount
     */
    public static void updateWorkflowNodecount( HashMap<String, Integer> workflowNodeCount){
    	 DateUtil dateUtil=new DateUtil();
		 
		 long created_time= dateUtil.toMidnight().getCalendar().getTimeInMillis();
		 created_time=created_time / 1000L;
		 
		 // Getting current day stats count details
		 AllDomainStats allDomainStats=AllDomainStatsUtil.getAllDomainStats(created_time);
		 
		 if(allDomainStats != null){
			  if(allDomainStats.node_count ==null)
				  allDomainStats.saveNodeCount(workflowNodeCount);
			  else
			    allDomainStats.saveNodeCount(updateNodeCout(workflowNodeCount, allDomainStats.getNodeCount()));
		 }
		 else{
			 
			 allDomainStats = new AllDomainStats();
			 allDomainStats.created_time = created_time;
			 allDomainStats.saveNodeCount(workflowNodeCount);
		 }
		 
		 System.out.println("Stats Report updated for nodes "+ allDomainStats.toString());
		 
	    	
    }
   
    /**
     * This method will merge campaign node count and datastore campaigns node count
     * @param workflowNodeCount
     * @param dataStoreNodeCount
     * @return
     *   HasMap
     */
    public static  Map<String, Integer> updateNodeCout( HashMap<String, Integer> workflowNodeCount,  Map<String, Integer> dataStoreNodeCount){
   	  
   	 Iterator<String> workflowNodeKey = workflowNodeCount.keySet().iterator();
   	 
   	while( workflowNodeKey.hasNext())
   	{
   		 String key = workflowNodeKey.next();
   		if(dataStoreNodeCount.containsKey(key))
   			dataStoreNodeCount.put(key, dataStoreNodeCount.get(key) + workflowNodeCount.get(key));
   		else
   			
   			dataStoreNodeCount.put(key, workflowNodeCount.get(key));
   	}
   	 return dataStoreNodeCount; 
    }
    
    
    /**
     * This method take node JSON as a parameter and it will 
     * count all nodes in Workflow and return in HashMap object.
     * 
     * @param nodeString
     *                -- String
     * @return nodesCountHashMap
     * 				-- HashMap
     */
    public static HashMap<String, Integer> getNodeCountFromWorkflow(String nodeString){
   	 
   	 HashMap<String,Integer> nodesCountHashMap=new HashMap<String,Integer>(); 
   	 
   	 JSONObject nodeJSON;
   	 try {
   		    nodeJSON = new JSONObject(nodeString);
   	 
   			  JSONArray jsonArray = nodeJSON.getJSONArray("nodes");
   			  
   			  for(int index=0; index<jsonArray.length(); index++)
   			  {
   			      String nodeName = jsonArray.getJSONObject(index).getJSONObject("NodeDefinition").getString("name");
   			      
   			      if(!nodeName.equals("Start"))
   			    	  addNodeStats(nodeName, nodesCountHashMap);
   			      }
   			 return nodesCountHashMap;
   	    } 
   	   catch (JSONException e) {
   			System.out.println("Error occured while counting the node of campaign : " + e.getMessage());
   		  return null;
   		  }
    }
    
    /**
     * This method will add count of node of the campaign
     * 
     * @param nodeName
     * 				-String
     * @param nodeValue
     * 				-Integer
     * @param hashMapData
     * 				-HashMap
     * @return hashMapData
     * 				-HashMap
     */
    public static HashMap<String, Integer> addNodeStats(String nodeName, HashMap<String, Integer> hashMapData){
   	 
   	 if(hashMapData.get(nodeName)==null)
   		 hashMapData.put(nodeName, 1);
   	 else{
   		 hashMapData.put(nodeName,hashMapData.get(nodeName) + 1);
   	 }
   	 return hashMapData;
   	 
    }
    
    /**
     * This method will take HashMap Collection and sort in descending order
     * @param passedMap
     * 				HashMap<String, Integer>
     * @return
     *      HashMap<String, Integer>
     */
    public static  Map<String, Integer> sortHashMapByValues( Map<String, Integer> passedMap) 
    {
   	    List<String> mapKeys = new ArrayList<>(passedMap.keySet());
   	    List<Integer> mapValues = new ArrayList<>(passedMap.values());
   	    
   	    Collections.sort(mapValues);
   	    Collections.sort(mapKeys);
   	    Collections.reverse(mapValues);

   	    Map<String, Integer> sortedMap =  new LinkedHashMap<>();

   	    Iterator<Integer> valueIt = mapValues.iterator();
   	    
   	    while (valueIt.hasNext()) {
   	    	Integer val = valueIt.next();
   	        Iterator<String> keyIt = mapKeys.iterator();

   	        while (keyIt.hasNext()) {
   	        	String key = keyIt.next();
   	            Integer comp1 = passedMap.get(key);
   	            Integer comp2 = val;

   	            if (comp1.equals(comp2)) {
   	                keyIt.remove();
   	                sortedMap.put(key, val);
   	                break;
   	            }
   	        }
   	    }
   	    return sortedMap;
   	}
  
}
