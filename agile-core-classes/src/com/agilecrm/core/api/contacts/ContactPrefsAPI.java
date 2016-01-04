package com.agilecrm.core.api.contacts;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.sync.Type;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactsImportUtil;
import com.thirdparty.google.calendar.GoogleCalenderPrefs;
import com.thirdparty.google.calendar.GoogleCalenderPrefs.CALENDAR_TYPE;
import com.thirdparty.google.utl.ContactPrefsUtil;
import com.thirdparty.salesforce.SalesforceUtil;

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
public class ContactPrefsAPI {

	/**
	 * Fetches import contact preferences based on type and current user.
	 * 
	 * 
	 * @return {@link ContactPrefs}
	 */
	@Path("/{type}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public ContactPrefs getContactPrefs(@PathParam("type") String type) {

		System.out.println("in contact prefs api");
		return ContactPrefsUtil.getPrefsByType(Type.GOOGLE);
	}

	@Path("/allPrefs")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<ContactPrefs> getAllContactPrefs() {

		return ContactPrefsUtil.getAllprefs();
	}

	@Path("/{type}")
	@PUT
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void updateContactPrefs(@PathParam("type") String type,
			ContactPrefs prefs, @QueryParam("sync") String sync) {

		System.out.println("in contact prefs api");

		if (prefs.id == null)
			return;

		try {
		
			ContactPrefs currentPrefs = ContactPrefsUtil.get(prefs.id);
	
			ContactPrefs updatedPrefs = ContactPrefsUtil.mergePrefs(currentPrefs,
					prefs);
	
			System.out.println("Sync" + sync + " prefs id is not null ");
	
			if (updatedPrefs.id == prefs.id) {
				System.out
						.println("in update prefs and prefs id are same before saving ");
				
				if (prefs.type.toString().equals("SALESFORCE")) {
					
					// Validate the prefs
					SalesforceUtil.checkSalesforcePrefs(updatedPrefs);
	
				}
				
				updatedPrefs.save();
			}
	
			if (updatedPrefs.type.toString().equals("SALESFORCE")) {
				ContactsImportUtil.initilaizeImportBackend(updatedPrefs, true);
			}
	
			if (!StringUtils.isEmpty(sync) && !updatedPrefs.inProgress) {
				updatedPrefs.inProgress = true;
				System.out.println("syncing before updated prefs and ");
				if (updatedPrefs.id == prefs.id) {
					System.out
							.println("updated prefs and prefs are same while syncing");
					updatedPrefs.save();
				}
	
				ContactsImportUtil.initilaizeImportBackend(updatedPrefs, true);
				return;
			}
		
		} catch (Exception e) {
			
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

	}

	/**
	 * Returns calendar prefs with out access token. It is used for showing
	 * settings in prefs page.
	 * 
	 * @return
	 */
	@Path("/{type}")
	@POST
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void saveCalendarPrefsBasedOnType(ContactPrefs prefs) {

		try {

			if (prefs.type.toString().equals("SALESFORCE")) {
				// Validate the prefs
				SalesforceUtil.checkSalesforcePrefs(prefs);

				prefs.save();
				ContactsImportUtil.initilaizeImportBackend(prefs, true);

			}

		} catch (Exception e) {

			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

	}

	/**
	 * Fetches import contact preferences.
	 * 
	 * If count is null fetches all the contacts at once
	 * 
	 * 
	 * deletes datasync prefs
	 * 
	 * @return {@link ContactPrefs}
	 */
	@Path("{type}")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteContactPrefs(@PathParam("type") Type type) {

		System.out.println("executing delete request Type" + type);

		if (type == Type.GOOGLE)
			ContactPrefsUtil.delete(Type.GOOGLE);
		if (type == Type.STRIPE)
			ContactPrefsUtil.delete(Type.STRIPE);
		if (type == Type.SHOPIFY)
			ContactPrefsUtil.delete(Type.SHOPIFY);
		if (type == Type.QUICKBOOK)
			ContactPrefsUtil.delete(Type.QUICKBOOK);
		if (type == Type.FRESHBOOKS)
			ContactPrefsUtil.delete(Type.FRESHBOOKS);

	}

	@Path("delete/{type}/{sync_widget_id}")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteContactPrefs(@PathParam("type") Type type,
			@PathParam("sync_widget_id") Long id) {

		System.out.println("executing delete request Type" + type);

		if (type == Type.GOOGLE)
			ContactPrefsUtil.deleteSyncwidgetById(Type.GOOGLE, id);
		if (type == Type.STRIPE)
			ContactPrefsUtil.deleteSyncwidgetById(Type.STRIPE, id);
		if (type == Type.SHOPIFY)
			ContactPrefsUtil.deleteSyncwidgetById(Type.SHOPIFY, id);
		if (type == Type.QUICKBOOK)
			ContactPrefsUtil.deleteSyncwidgetById(Type.QUICKBOOK, id);
		if (type == Type.FRESHBOOKS)
			ContactPrefsUtil.deleteSyncwidgetById(Type.FRESHBOOKS, id);
		if (type == Type.SALESFORCE)
			ContactPrefsUtil.deleteSyncwidgetById(Type.SALESFORCE, id);

	}

}