/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;

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
