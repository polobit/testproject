package com.agilecrm.alldomainstats.util;

import java.util.List;

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
			 		 triggers_count=1L;
			 		 break;
			 
			 }
			 
			 //If in datastore there is no entity then add new other wise update the entity
			 if(allDomainStats == null)
			 {
				 AllDomainStatsUtil.saveAllDomainStas(new AllDomainStats(created_time, campaign_count, webrule_count, form_count, landingPage_count, triggers_count, emailTemplate_count));
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
    
    
}
