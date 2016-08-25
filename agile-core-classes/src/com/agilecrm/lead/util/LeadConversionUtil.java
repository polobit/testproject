package com.agilecrm.lead.util;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.lead.LeadConversion;

/**
 * All the utility methods and the dao methods for saving, updating and
 * retrieving the lead conversion status.
 * 
 * @author Subrahmanyam.
 *
 */
public class LeadConversionUtil 
{
	// Dao
    public ObjectifyGenericDao<LeadConversion> dao = new ObjectifyGenericDao<LeadConversion>(LeadConversion.class);

    /**
     * Save the conversion status in data store. 
     * 
     * @param leadConversion
     *            {link LeadConversion} to be saved.
     * @return saved LeadConversion.
     */
    public LeadConversion createConversionStatus(LeadConversion leadConversion)
    {
    	dao.put(leadConversion);
    	return leadConversion;
    }

    /**
     * Retrieve the conversion status.
     * 
     * @return LeadConversion.
     */
    public LeadConversion getConversionStatus()
    {
	try
	{
	    return dao.get();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return null;
    }

    /**
     * Update the conversion status.
     * 
     * @param leadConversion
     *            {link LeadConversion} to be updated.
     * @return updated LeadConversion.
     */
    public LeadConversion updateConversionStatus(LeadConversion leadConversion)
    {
    	dao.put(leadConversion);
    	return leadConversion;
    }

    /**
     * Delete the conversion status.
     * 
     * @param id
     *            id of the conversion status which has to be deleted.
     */
    public void deleteConversionStatus(Long id)
    {
    	LeadConversion leadConversion = getConversionStatus();
    	dao.delete(leadConversion);
    }
}
