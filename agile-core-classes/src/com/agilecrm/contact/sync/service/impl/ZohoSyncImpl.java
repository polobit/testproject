
package com.agilecrm.contact.sync.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jettison.json.JSONArray;

import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.IContactWrapper;
import com.agilecrm.contact.sync.wrapper.impl.ZohoContactWrapperImpl;
import com.thirdparty.zoho.ZohoUtils;

/**
 * <code>ZohoSync</code> will sync Contacts from Zoho crm and save in agile crm
 * 
 * @author jitendra
 * 
 */
public class ZohoSyncImpl extends OneWaySyncService
{

    /**
     * import options holds third party module whose data needs to be imported
     * in case of zoho option can be Leads,Accounts,Contacts.. etc
     */
    private List<String> importOptions = new ArrayList<String>(0);

    /**
     * Initializing import
     */
    @Override
    public void initSync()
    {
	importOptions = prefs.importOptions;

	for (String module : importOptions)
	{
	    doImport(module);
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
	return ZohoContactWrapperImpl.class;
    }

    @Override
    protected void updateLastSyncedInPrefs()
    {
	// TODO Auto-generated method stub

    }

    private void doImport(String module)
    {
	for (int i = 0; i < MAX_SYNC_LIMIT; i = i + 100)
	{
	    String url = new ZohoURLBuilder(module).apiMethod("getRecords").authToken(prefs.token).fromIndex(i)
		    .toIndex(100).build();
	    System.out.println(url);
	    JSONArray array = ZohoUtils.getData(url);

	    if (array != null && array.length() > 0)
	    {
		for (int j = 0; j < array.length(); j++)
		{
		    try
		    {
			wrapContactToAgileSchemaAndSave(array.get(i));
		    }
		    catch (Exception e)
		    {
			e.printStackTrace();
		    }
		}
	    }

	}

    }
}
