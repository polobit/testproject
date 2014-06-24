/**
 * 
 */
package com.thirdparty.stripe;

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

/**
 * @author jitendra
 *
 */
@Path("/api/stripe")
public class StripeDataService {
	
		
		
		@Path("/savePrefs")
		@POST
		@Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
		@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
		public ContactPrefs saveCredential(@FormParam("username") String username,
				@FormParam("password") String password, @FormParam("apiKey") String apiKey){
			   ContactPrefs ctx = new ContactPrefs();
		       ctx.userName = username;
		       ctx.password = password;
		       ctx.apiKey   = apiKey;
		       ctx.type     = Type.STRIPE;
		       try{
		        	   ctx.save();
		           
		       }catch (Exception e)
				{
					throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
							.build());
				}

			return ctx;
		}
		
		@Path("/importData")
		@POST
		@Consumes({MediaType.APPLICATION_FORM_URLENCODED})
		@Produces({MediaType.APPLICATION_JSON})
		public void fetchDataFromStripe(@FormParam("customer")boolean customer) throws Exception{
			ContactPrefs ctxPrefs = ContactPrefsUtil.getPrefsByType(Type.STRIPE);
			if(customer){
                 ArrayList<String> options =  new ArrayList<String>();
                 options.add("customer");
				 ctxPrefs.thirdPartyField = options;
				 ContactsImportUtil.initilaizeImportBackend(ctxPrefs);
				
			}else{
				throw new Exception("Invalid Option. Please try again");
			}
				
			
		}

}
