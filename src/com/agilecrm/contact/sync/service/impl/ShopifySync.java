/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.util.HashMap;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;

import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;

// TODO: Auto-generated Javadoc
/**
 * The Class ShopifySync.
 * 
 * @author jitendra
 */
public class ShopifySync extends OneWaySyncService
{
    private String shopURL;
    private static final int MAX_FETCH_RESULT = 250;
    private int currentPage = 1;

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.service.OneWaySyncService#initSync()
     */
    @Override
    public void initSync()
    {
	shopURL = prefs.othersParams;
	if (shopURL != null && !shopURL.isEmpty())
	{
	    int count = getTotalCustomers(shopURL);
	}
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.service.SyncService#getWrapperService()
     */
    @Override
    public Class<? extends WrapperService> getWrapperService()
    {
	// TODO Auto-generated method stub
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.service.ContactSyncService#updateLastSyncedInPrefs
     * ()
     */
    @Override
    protected void updateLastSyncedInPrefs()
    {
	// TODO Auto-generated method stub

    }

    private String materializeURL(String shop, String entityName, int page)
    {

	StringBuilder uri = new StringBuilder();

	uri.append("https://").append(shop).append("/admin/").append(entityName + ".json?");
	if (page != 0)
	    uri.append("limit=" + MAX_FETCH_RESULT).append("&page=" + currentPage);

	System.out.println(uri.toString());

	return uri.toString();

    }

    private int getTotalCustomers(String shopName)
    {
	Integer count = 0;
	String uri = materializeURL(shopName, "count", 0);
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.POST, uri);
	Response response = oAuthRequest.send();
	try
	{
	    HashMap<String, String> properties = new ObjectMapper().readValue(response.getBody(),
		    new TypeReference<HashMap<String, String>>()
		    {

		    });
	    if (properties.containsKey("count"))
		count = Integer.parseInt(properties.get("count"));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return count.intValue();
    }
}
