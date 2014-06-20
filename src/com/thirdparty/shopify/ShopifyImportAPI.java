package com.thirdparty.shopify;

import java.io.IOException;
import java.net.SocketTimeoutException;
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
	public ContactPrefs saveContactPref(@FormParam("Shop")String shopname,@FormParam("ApiKey")String apiKey,@FormParam("ApiPass")String apiPass) throws Exception{
		
		ContactPrefs pref = new ContactPrefs();
		pref.apiKey = apiKey;
		pref.password = apiPass;
		pref.userName = shopname;
		pref.type = Type.SHOPIFY;
		try{
		if(ShopifyUtil.isValid(pref))
			pref.save();
		return pref;
		}	catch (SocketTimeoutException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("Request timed out. Refresh and Please try again.").build());
		}
		catch (IOException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("An error occurred. Refresh and Please try again.").build());
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
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
			ContactsImportUtil.initilaizeImportBackend(pref);
				throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
						.build());
		}
	}
	
	
}
