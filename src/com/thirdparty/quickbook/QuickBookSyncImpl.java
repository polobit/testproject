/**
 * 
 */
package com.thirdparty.quickbook;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;
import com.intuit.ipp.core.Context;
import com.intuit.ipp.core.ServiceType;
import com.intuit.ipp.data.Customer;
import com.intuit.ipp.security.OAuthAuthorizer;
import com.intuit.ipp.services.DataService;
import com.intuit.ipp.services.QueryResult;

/**
 * @author jitendra
 *
 */
public class QuickBookSyncImpl extends OneWaySyncService
{

	@Override
	public Class<? extends WrapperService> getWrapperService()
	{
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void initSync()
	{
		List<Customer> customers = getCustomers();
		
		if(customers != null){
			for(Customer customer : customers){
				Contact contact = wrapContactToAgileSchemaAndSave(customer);
			}
		}
		
	}

	@Override
	protected void updateLastSyncedInPrefs()
	{

	}

	public List<Customer> getCustomers()
	{
		List<Customer> list = new ArrayList<Customer>();
		try
		{
			OAuthAuthorizer oauth = new OAuthAuthorizer(Globals.QUICKBOOKS_CONSUMER_KEY,
					Globals.QUICKBOOKS_CONSUMER_SECRET, prefs.apiKey, prefs.secret);
			Context context = new Context(oauth, Globals.QUICKBOOKS_APP_KEY, ServiceType.QBO, prefs.othersParams);
			DataService service = new DataService(context);
			QueryResult q = service.executeQuery("SELECT * FROM Customer");
			list.add((Customer) q.getEntities());
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return list;
	}

	
}
