/**
 * 
 */
package com.thirdparty.quickbook;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import oauth.signpost.OAuthConsumer;
import oauth.signpost.basic.DefaultOAuthConsumer;

import com.agilecrm.Globals;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;
import com.intuit.ipp.core.Context;
import com.intuit.ipp.core.ServiceType;
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
	List customers = getCustomers();

	if (customers != null)
	{
	   /* for (Customer customer : customers)
	    {
		Contact contact = wrapContactToAgileSchemaAndSave(customer);
	    }*/
	}

    }

    @Override
    protected void updateLastSyncedInPrefs()
    {

    }

    public List getCustomers()
    {
	List list = new ArrayList();
	try
	{
	    /*
	     * OAuthAuthorizer oauth = new
	     * OAuthAuthorizer(Globals.QUICKBOOKS_CONSUMER_KEY,
	     * Globals.QUICKBOOKS_CONSUMER_SECRET, prefs.apiKey, prefs.secret);
	     *  DataService service = new
	     * DataService(context); QueryResult q =
	     * service.executeQuery("SELECT * FROM Customer");
	     */
	    // list.add((Customer) q.getEntities());
	
	    OAuthAuthorizer oauth = new OAuthAuthorizer(Globals.QUICKBOOKS_CONSUMER_KEY,Globals.QUICKBOOKS_CONSUMER_SECRET, prefs.token, prefs.secret);
	    Context context = new Context(oauth, Globals.QUICKBOOKS_APP_KEY, ServiceType.QBO, prefs.othersParams);
	    DataService service = new DataService(context);
	    QueryResult  result = service.executeQuery("SELECT * FROM Customer");
	    
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return list;
    }

}
