package com.agilecrm.core.api.contacts;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.sync.Type;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactsImportUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * <code>ContactPrefsAPI</code> includes REST calls to interact with
 * {@link ContactPrefs} class
 * <p>
 * It is called from client side to create, update, fetch and delete the import
 * contacts preferences.
 * </p>
 * 
 * @author
 * 
 */
@Path("/api/contactprefs")
public class ContactPrefsAPI
{

    /**
     * Fetches import contact preferences based on type and current user.
     * 
     * 
     * @return {@link ContactPrefs}
     */
    @Path("/{type}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public ContactPrefs getContactPrefs(@PathParam("type") String type)
    {

	System.out.println("in contact prefs api");
	return ContactPrefsUtil.getPrefsByType(Type.GOOGLE);
    }
    
    
    @Path("/allPrefs")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<ContactPrefs> getAllContactPrefs()
    {
    	
    	return ContactPrefsUtil.getAllprefs();
    }


    @Path("/{type}")
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void updateContactPrefs(@PathParam("type") String type, ContactPrefs prefs, @QueryParam("sync") String sync)
    {

	System.out.println("in contact prefs api");

	if (prefs.id == null)
	    return;

	ContactPrefs currentPrefs = ContactPrefsUtil.get(prefs.id);

	ContactPrefs updatedPrefs = ContactPrefsUtil.mergePrefs(currentPrefs, prefs);

	System.out.println("Sync" + sync);
	   updatedPrefs.save();

	if (!StringUtils.isEmpty(sync) && !updatedPrefs.inProgress)
	{
	    updatedPrefs.inProgress = true;
	    updatedPrefs.save();
	    ContactsImportUtil.initilaizeImportBackend(updatedPrefs, true);
	    return;
	}

    }

    /**
     * Fetches import contact preferences.
     * 
     * If count is null fetches all the contacts at once
     * 
     * 
     * deletes datasync prefs
     * @return {@link ContactPrefs}
     */
    @Path("{type}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteContactPrefs(@PathParam("type") Type type)
    {

    	System.out.println("executing delete request Type"+type);
    	
    		if(type==Type.GOOGLE)
        	ContactPrefsUtil.delete(Type.GOOGLE);
        	if(type==Type.STRIPE)
        	ContactPrefsUtil.delete(Type.STRIPE);
        	if(type==Type.SHOPIFY)
            	ContactPrefsUtil.delete(Type.SHOPIFY);
        	if(type==Type.QUICKBOOK)
            	ContactPrefsUtil.delete(Type.QUICKBOOK);
        	if(type==Type.FRESHBOOKS)
            ContactPrefsUtil.delete(Type.FRESHBOOKS);

    }
    
   
}
