package com.campaignio.tasklets.agile;

import org.json.JSONObject;
import com.agilecrm.deals.util.OpportunityUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>UpdateDeal</code> Update milestone and expected value of latest deal
 * 
 * @author Sonali
 * 
 */
public class UpdateDealNode extends TaskletAdapter
{
    /**
     * Selected milestone value
     */
    public static String MILESTONE = "milestone";
    public static String EXPECTEDVALUE = "expected_value";
   /**
     * Branch Yes
     */
    public static String BRANCH_YES = "yes";
    
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
        throws Exception
    {
    
    	String milestone = getStringValue(nodeJSON, subscriberJSON, data, MILESTONE);
    	String expectedValue = getStringValue(nodeJSON, subscriberJSON, data, EXPECTEDVALUE);
    	String msg=null;

    	
    	try
    {
        
         OpportunityUtil.updateDeal(Long.parseLong(AgileTaskletUtil.getId(subscriberJSON)),
                milestone,expectedValue);
      
        if(expectedValue.length()!=0 && milestone.length()!=0 )
            msg="Deal is updated."+"<br>Expected Value : " + expectedValue +"<br> MileStone : "+milestone.substring(milestone.indexOf("_")+1);
            		
        else if( milestone.length()!=0)
        	msg="Milestone of Deal is updated :" + milestone.substring(milestone.indexOf("_")+1);
            		
        else if(expectedValue.length()!=0)
            msg= "Expected Value of Deal is updated :" + expectedValue;            		
        
        LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), msg
        		,LogType.UPDATE_DEAL.toString());  
        
    }
    catch (Exception e)
    {
        e.printStackTrace();
        System.err.println("Exception occured while updating deals..." + e.getMessage());
    }
    
    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_YES);
    }
}
