/**
 * 
 */
package com.thirdparty.quickbook;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	private static String BASE_URL = "https://quickbooks.api.intuit.com/v3/company/1248774125/query?query=SELECT%20FROM%20Customer";

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

	public static void main(String[] args)
	{
		String id = "1248774125";
		String apToken = "qyprdx6AjL6Mf4ExWADoW1qCr9PP5ewOzK0imq8sVnWr91Bn";
		String query = "SELECT * FROM Customer";
		Map<String, String> param = new HashMap<String, String>();
		param.put("companyID", id);
		// param.put("query", query);
		try
		{

			OAuthAuthorizer oauth = new OAuthAuthorizer(Globals.QUICKBOOKS_CONSUMER_KEY,
					Globals.QUICKBOOKS_CONSUMER_SECRET, "qyprdPTMnT9LFQgJkB47FmiHROl7njYXtOKhL12I7rpauzco",
					"ZbJssQY1qRlSKu9HTSyncRW6utNq7gTnehE0Zfo1");
			Context context = new Context(oauth, Globals.QUICKBOOKS_APP_KEY, ServiceType.QBO, id);
			DataService service = new DataService(context);
			QueryResult q = service.executeQuery("SELECT * FROM Customer");
			List<Customer> customers = (List<Customer>) q.getEntities();
			for (Customer c : customers)
			{
				System.out.println(c.getDisplayName());
			}

			// Response response = req.send();
			// System.out.println(response.getCode());
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

}
