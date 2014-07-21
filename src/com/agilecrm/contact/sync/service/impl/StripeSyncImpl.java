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

    private String lastSyncCheckPoint = null;

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
	     * check last sync check point
	     */
	    lastSyncCheckPoint = prefs.lastSyncCheckPoint;

	    while (true)
	    {

		CustomerCollection collections = Customer.all(options(), prefs.apiKey);

		List<Customer> customers = collections.getData();
		for (Customer customer : customers)
		{
		    wrapContactToAgileSchemaAndSave(customer);
		}
		if (customers.size() == 0)
		{
		    sendNotification(prefs.client.getNotificationEmailSubject());
		    break;
		}
		else
		{
		    Customer customer = customers.get(customers.size() - 1);

		    lastSyncCheckPoint = customer.getId();
		}

		if (isLimitExceeded())
		    break;
	    }
	    updateLastSyncedInPrefs();

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
    private Map<String, Object> options()
    {
	HashMap<String, Object> options = new HashMap<String, Object>();
	options.put("limit", 100);
	options.put("starting_after", lastSyncCheckPoint);
	return options;
    }

    @Override
    public Class<? extends WrapperService> getWrapperService()
    {
	// TODO Auto-generated method stub
	return StripeContactWrapperImpl.class;
    }

}
