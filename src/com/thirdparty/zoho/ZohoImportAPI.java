/**
 * 
 */
package com.thirdparty.zoho;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.Type;

/**
 * @author jitendra
 *
 */
@Path("/api/zoho")
public class ZohoImportAPI
{
	
	
	@Path("/save")
	@POST
	@Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ContactPrefs saveCredential(@FormParam("username") String username,
			@FormParam("password") String password, @FormParam("authtoken") String authtoken){
		   ContactPrefs ctx = new ContactPrefs();
	       ctx.userName = username;
	       ctx.password = password;
	       ctx.token    = authtoken;
	       ctx.type     = Type.ZOHO;
	       
	       if(ZohoUtils.isValidContactPrefs(ctx))
	    	   ctx.save();
	       
		return ctx;
	}
	


}
