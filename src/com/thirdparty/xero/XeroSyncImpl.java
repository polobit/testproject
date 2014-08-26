package com.thirdparty.xero;

import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;

public class XeroSyncImpl extends OneWaySyncService
{

    @Override
    public Class<? extends WrapperService> getWrapperService()
    {
	return XeroContactWrapperImpl.class;
    }

    @Override
    public void initSync()
    {
	
	
    }

    @Override
    protected void updateLastSyncedInPrefs()
    {
	
    }

}
