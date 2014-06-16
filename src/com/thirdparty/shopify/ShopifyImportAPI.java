package com.thirdparty.shopify;

import java.util.ArrayList;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.Type;
import com.thirdparty.google.ContactsImportUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

@Path("/api/shopify")
public class ShopifyImportAPI {
	
	@Path("/save")
	@POST
	@Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public void saveContactPref(@FormParam("Shop")String shopname,@FormParam("ApiKey")String apiKey,@FormParam("ApiPass")String apiPass){
		
		ContactPrefs pref = new ContactPrefs();
		pref.apiKey = apiKey;
		pref.password = apiPass;
		pref.userName = shopname;
		pref.type = Type.SHOPIFY;
		pref.save();
		
	}

	@POST
	@Path("/importCustomer")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
	public ContactPrefs importCustomers(@FormParam("customer")boolean customer){
		ArrayList<String> list = new ArrayList<String>();
		ContactPrefs pref = ContactPrefsUtil.getPrefsByType(Type.SHOPIFY);
		try{
		if(customer)
			list.add("customer");
		pref.thirdPartyField = list;
		
		ContactsImportUtil.initilaizeImportBackend(pref);
		
		return pref;
		}catch(Exception e){
				throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
						.build());
		}
	}
	
	
}
