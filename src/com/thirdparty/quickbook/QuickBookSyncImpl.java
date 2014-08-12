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
import com.agilecrm.scribe.util.SignpostUtil;
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
	    /*
	     * for (Customer customer : customers) { Contact contact =
	     * wrapContactToAgileSchemaAndSave(customer); }
	     */
	}

    }

    @Override
    protected void updateLastSyncedInPrefs()
    {

    }

    public List getCustomers()
    {
	List list = new ArrayList();
	OAuthAuthorizer oauth = new OAuthAuthorizer(Globals.QUICKBOOKS_CONSUMER_KEY, Globals.QUICKBOOKS_CONSUMER_SECRET, prefs.token, prefs.secret);
	try
	{
	   Context ctx = new Context(oauth, ServiceType.QBO, prefs.othersParams);   
	   DataService service = new  DataService(ctx);
	   QueryResult rs = service.executeQuery("SELECT * FROM Customer");
	   System.out.println(rs.getEntities().size());
	   
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return list;
    }
    
    public static void main(String[] args)
    {
	String id = "1248774125";
		String secret = "MFp3qgsf7d3GTkXRk5jUKagNClEd3jKOu0muBgK7";
		String token = "qyprdnnTLziE6b347OjQxMShP3bvp0PzycZEG864RkAgkVsz";
		OAuthAuthorizer oauth = new OAuthAuthorizer(Globals.QUICKBOOKS_CONSUMER_KEY, Globals.QUICKBOOKS_CONSUMER_SECRET, token, secret);
		try
		{
		   Context ctx = new Context(oauth, ServiceType.QBO, id);   
		   DataService service = new  DataService(ctx);
		   QueryResult rs = service.executeQuery("SELECT * FROM Customer");
		   System.out.println(rs.getEntities().size());
		   
		}
		catch (Exception e)
		{
		    // TODO Auto-generated catch block
		    e.printStackTrace();
		}
		
    }

}
