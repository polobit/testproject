/**
 * @auther jitendra
 * @since 2014
 */
package com.agilecrm.contact.sync.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.IContactWrapper;
import com.agilecrm.contact.sync.wrapper.impl.StripeContactWrapperImpl;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.stripe.exception.APIConnectionException;
import com.stripe.exception.APIException;
import com.stripe.exception.AuthenticationException;
import com.stripe.exception.CardException;
import com.stripe.exception.InvalidRequestException;
import com.stripe.model.Card;
import com.stripe.model.Charge;
import com.stripe.model.ChargeCollection;
import com.stripe.model.Customer;
import com.stripe.model.CustomerCollection;
import com.stripe.net.RequestOptions;
import com.stripe.net.RequestOptions.RequestOptionsBuilder;

/**
 * <code>StripeSync</code> implements {@link OneWaySyncService} provides Service
 * for Sync Contacts from Stripe to agile.
 * 
 * @author jitendra
 */
public class StripeSyncImpl extends OneWaySyncService
{

    /**
     * holds last sync date. in first time date is null by default client will
     * sync all contacts from stripe and set current date as sync date
     */
    public String lastSyncCheckPoint = null;

    /** initialize current page. */
    private int currentPage = 1;

    /** page size. of stripe */
    private int pageSize = 100;

    /** unix time stamp sync time. */
    private String syncTime = null;

    SimpleDateFormat sf = new SimpleDateFormat("dd / MM / yyyy");

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

	    /*Map<String, Object> option = new HashMap<String, Object>();
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
	    }*/

	    while (true)
	    {
		CustomerCollection customerCollections = Customer.all(Options(syncTime),requestOptions());
		List<Customer> customers = customerCollections.getData();
		if(customers !=null && customers.size()==0)
			break;
		for (Customer customer : customers)
		{
		    if (!isLimitExceeded())
		    {
		    	//If email or first name not existed, we didn't sync that contact
		    	String email = null;
			    String name = null;
			    if(customer!=null && customer.getEmail()!=null && !customer.getEmail().equalsIgnoreCase(""))
			    	email = customer.getEmail();
			    Card card = StripeUtil.getDefaultCard(customer);
			    if(card!=null && card.getName()!=null && !card.getName().equalsIgnoreCase(""))
			    	name = card.getName();
			    if (email == null && name == null)
				{
				syncStatus.put(ImportStatus.EMAIL_REQUIRED, syncStatus.get(ImportStatus.EMAIL_REQUIRED) + 1);
				syncStatus.put(ImportStatus.TOTAL_FAILED, syncStatus.get(ImportStatus.TOTAL_FAILED) + 1);
				++total_synced_contact;
				continue;
				}
			Contact contact = wrapContactToAgileSchemaAndSave(customer);

			printCustomerCharges(contact, customer);
		    }

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
	    sendNotification(prefs.type.getNotificationEmailSubject());

	}
	catch (AuthenticationException | InvalidRequestException | APIConnectionException | CardException
		| APIException e)
	{
		  
	    e.printStackTrace();
	}

    }

    /**
     * After sync all contact from stripe set cursor on top in stripe table it
     * will fetch newly added records from top using param ending_before.
     */
    private void moveCurrentCursorToTop()
    {
	Map<String, Object> option = new HashMap<String, Object>();
	option.put("limit", 1);
	try
	{
	    CustomerCollection collection = Customer.all(option, requestOptions());
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
     * Update Last SyncId which is user later for retrieve contacts from that
     * id.
     */
    protected void updateLastSyncedInPrefs()
    {
	prefs.lastSyncCheckPoint = lastSyncCheckPoint;
	prefs.save();
    }

    /**
     * Stripe data retrieve Options.
     * 
     * @param syncTime
     *            the sync time
     * @return the map
     */
    /*private Map<String, Object> Options(String syncTime)
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
    }*/
    
    
    private Map<String, Object> Options(String syncTime)
    {
	HashMap<String, Object> options = new HashMap<String, Object>();
	options.put("limit", pageSize);
	if (syncTime != null && lastSyncCheckPoint != null && syncTime.equalsIgnoreCase("first"))
	{
	    options.put("starting_after", lastSyncCheckPoint);
	}
	else if(lastSyncCheckPoint != null && syncTime.equalsIgnoreCase("second"))
	{
	    options.put("ending_before", lastSyncCheckPoint);
	}

	return options;
    }
    
    /*Creating RequestOptions for Stripe to send api-key and version*/
    private RequestOptions requestOptions()
    {
    	RequestOptionsBuilder builder = new RequestOptionsBuilder();
	    builder.setApiKey(prefs.apiKey);
	    builder.setStripeVersion("2012-09-24");
	    return builder.build();
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
	return StripeContactWrapperImpl.class;
    }

    /**
     * Prints the customer charges as log
     * 
     * @param contact
     *            the contact
     * @param customerId
     *            the customer id
     */
    private void printCustomerCharges(Contact contact, Customer customer)
    {
	HashMap<String, Object> chargeOption = new HashMap<String, Object>();
	chargeOption.put("customer", customer.getId());
	if (contact != null)
	{
	    try
	    {
		ChargeCollection chargeCollection = Charge.all(chargeOption, requestOptions());
		List<Charge> charges = chargeCollection.getData();
		if (charges.size() > 0)
		{
		    System.out.println("==================================================================");
		    System.out.println("==============    Customer Charge Details  =======================");
		    System.out.println("--------------------------------------------------------------------");
		    for (Charge charge : charges)
		    {
			System.out.println("Customer name    :  " + charge.getCard().getName());
			System.out.println("ContactId        :  " + contact.id);
			System.out.println("Charge           :  " + charge.getAmount() + " " + charge.getCurrency());
			System.out.println("Ammount Refunded :  " + charge.getAmountRefunded() + " "
				+ charge.getCurrency());
			if (charge.getFailureMessage() == null)
			{
			    System.out.println("Status           :  Successfull");
			}
			else
			{
			    System.out.println("Status         :  " + charge.getFailureMessage());
			}

			System.out.println("Date             :  " + sf.format(new Date(charge.getCreated() * 1000)));

		    }
		    System.out.println("--------------------------------------------------------------------");
		    System.out.println("==================================================================");
		}
	    }
	    catch (AuthenticationException | InvalidRequestException | APIConnectionException | CardException
		    | APIException e)
	    {
		e.printStackTrace();
	    }

	}
    }

    

}
