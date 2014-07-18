/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.util.List;

import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;

/**
 * <code>ZohoSync</code> will sync Contacts from Zoho crm and save in agile crm
 * 
 * @author jitendra
 * 
 */
public class ZohoSyncImpl extends OneWaySyncService
{
    private List<String> importOptions = prefs.importOptions;

    @Override
    public void initSync()
    {
	for (String module : importOptions)
	{
	    doImport(module);
	}

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

    private void doImport(String module)
    {

    }

}
