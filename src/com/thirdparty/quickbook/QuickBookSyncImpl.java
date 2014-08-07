/**
 * 
 */
package com.thirdparty.quickbook;

import java.util.Map;

import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;

/**
 * @author jitendra
 *
 */
public class QuickBookSyncImpl extends OneWaySyncService
{
	private static String BASE_URL = "https://quickbooks.api.intuit.com/v3/company/%s/query?query=%s";

	@Override
	public Class<? extends WrapperService> getWrapperService()
	{
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void initSync()
	{
		
		
	}

	@Override
	protected void updateLastSyncedInPrefs()
	{
		
	}
	private String materializeUrl(Map<String,String> params){
		
	}

}
