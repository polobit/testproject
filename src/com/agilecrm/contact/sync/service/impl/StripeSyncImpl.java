/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;
import com.agilecrm.contact.sync.wrapper.impl.StripeContactWrapperImpl;
import com.stripe.exception.APIConnectionException;
import com.stripe.exception.APIException;
import com.stripe.exception.AuthenticationException;
import com.stripe.exception.CardException;
import com.stripe.exception.InvalidRequestException;
import com.stripe.model.Customer;
import com.stripe.model.CustomerCollection;

/**
 * <code>StripeSync</code> implements {@link OneWaySyncService}
 * 
 * @author jitendra
 * 
 */
public class StripeSyncImpl extends OneWaySyncService
{

    public String lastSyncCheckPoint = null;
    private int currentPage = 1;
    private int pageSize = 100;
    private String syncTime = null;
    int count=0;

    /**
     * Implementation of initSync for Stripe.
     * 
     * @see com.agilecrm.contact.sync.service.OneWaySyncService#initSync()
     */
    @Override
    public void initSync()
    {

	try
	{

	    /**
	     * check last sync check point and sync time syncTime is String
	     * variable to check this sync is first time or second onwards
	     */

	    lastSyncCheckPoint = prefs.lastSyncCheckPoint;
	    syncTime = prefs.othersParams;

	    Map<String, Object> option = new HashMap<String, Object>();
            option.put("limit", 1);
	    option.put("include[]", "total_count");
	    if (syncTime.equalsIgnoreCase("second"))
	    {
		option.put("ending_before", lastSyncCheckPoint);
	    }

	    CustomerCollection collections = Customer.all(option, prefs.apiKey);

	    int pages = (int) Math.ceil(collections.getCount() / pageSize);

	    if (collections.getCount() <= pageSize)
	    {
		pages = currentPage;
	    }

	    int remain = collections.getCount() % pageSize;
	    if (remain < pageSize)
	    {
		pages = pages + 1;
	    }

	    while (currentPage <= pages)
	    {
		CustomerCollection customerCollections = Customer.all(Options(syncTime), prefs.apiKey);
		List<Customer> customers = customerCollections.getData();
		for (Customer customer : customers)
		{
		    if (!isLimitExceeded())
			wrapContactToAgileSchemaAndSave(customer);
		   
		    count++;
		    
		}

		if (customers.size() != 0)
		{
		    Customer customer = customers.get(customers.size() - 1);
		    lastSyncCheckPoint = customer.getId();
		    updateLastSyncedInPrefs();
		}
		currentPage += 1;
	    }
	    moveCurrentCursorToTop();
	    prefs.othersParams = "second";
	    prefs.save();

	}
	catch (AuthenticationException | InvalidRequestException | APIConnectionException | CardException
		| APIException e)
	{
	    e.printStackTrace();
	}

    }

    /**
     * After sync all contact from stripe set cursor on top in stripe table it
     * will fetch newly added records from top using param ending_before
     */
    private void moveCurrentCursorToTop()
    {
	Map<String, Object> option = new HashMap<String, Object>();
	option.put("limit", 1);
	try
	{
	    CustomerCollection collection = Customer.all(option, prefs.apiKey);
	    Customer customers = collection.getData().get(0);
	    prefs.lastSyncCheckPoint = customers.getId();
	    prefs.save();
	}
	catch (AuthenticationException | InvalidRequestException | APIConnectionException | CardException
		| APIException e)
	{
	    e.printStackTrace();
	}

    }

    /**
     * Update Last SyncId which is user later for retrieve contacts from that id
     * 
     * @param prefs
     * @param customerId
     */
    protected void updateLastSyncedInPrefs()
    {
	prefs.lastSyncCheckPoint = lastSyncCheckPoint;
	prefs.save();
    }

    /**
     * Stripe data retrieve Options
     * 
     * @return
     */
    private Map<String, Object> Options(String syncTime)
    {
	HashMap<String, Object> options = new HashMap<String, Object>();
	options.put("limit", pageSize);
	if (syncTime != null && syncTime.equalsIgnoreCase("first"))
	{
	    options.put("starting_after", lastSyncCheckPoint);
	}
	else
	{
	    options.put("ending_before", lastSyncCheckPoint);
	}

	return options;
    }

    @Override
    public Class<? extends WrapperService> getWrapperService()
    {
	// TODO Auto-generated method stub
	return StripeContactWrapperImpl.class;
    }

}
