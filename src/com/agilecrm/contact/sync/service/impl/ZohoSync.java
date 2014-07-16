/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;

/**
 * <code>ZohoSync</code> will sync Contacts from Zoho crm and save in agile crm
 * 
 * @author jitendra
 * 
 */
public class ZohoSync extends OneWaySyncService
{

    @Override
    public void initSync()
    {
	// TODO Auto-generated method stub

    }

    @Override
    public Class<? extends WrapperService> getWrapperService()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    protected void updateLastSyncedInPrefs()
    {
	// TODO Auto-generated method stub

    }

}
