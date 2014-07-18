/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.util.List;

import org.codehaus.jettison.json.JSONArray;

import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;
import com.thirdparty.zoho.ZohoUtils;

/**
 * <code>ZohoSync</code> will sync Contacts from Zoho crm and save in agile crm
 * 
 * @author jitendra
 * 
 */
public class ZohoSyncImpl extends OneWaySyncService
{
    private List<String> importOptions = null;

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
