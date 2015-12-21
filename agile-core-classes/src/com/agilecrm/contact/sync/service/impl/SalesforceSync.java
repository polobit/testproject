/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.util.List;

import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.IContactWrapper;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.utl.ContactPrefsUtil;
import com.thirdparty.salesforce.SalesforceImportUtil;

/**
 * @author jitendra
 * 
 */
public class SalesforceSync extends OneWaySyncService
{

    @Override
    public void initSync()
    {
    	
	// TODO Auto-generated method stub
    System.out.println("SalesforceSync started" + prefs);
    
    if(prefs == null)
    	 return;
    
    // Get Contacts and Tasks
    List<String> importOptions = prefs.importOptions;
    if(importOptions == null)
    	  return;
    
    try {
    	if(importOptions.contains("contacts")){
        	System.out.println("Importing contacts");
        	SalesforceImportUtil.importSalesforceContacts(prefs);
        }
        
        if(importOptions.contains("tasks")){
        	System.out.println("Importing tasks");
        	SalesforceImportUtil.importSalesforceTasks(prefs);
        }
	} catch (Exception e) {
		e.printStackTrace();
	}
    
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.service.SyncService#getWrapperService()
     */
    @Override
    public Class<? extends IContactWrapper> getWrapperService()
    {
	// TODO Auto-generated method stub
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.service.ContactSyncService#updateLastSyncedInPrefs
     * ()
     */
    @Override
    protected void updateLastSyncedInPrefs()
    {
	// TODO Auto-generated method stub

    }

}

