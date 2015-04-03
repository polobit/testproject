package com.agilecrm.core.api.contacts.customview;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.customview.CustomView;

/**
 * <code>CustomViewAPI</code> class includes REST calls to interact with
 * CustomView class to process views.
 * <p>
 * It is called from client side for creating view, fetching by id, fetching all
 * views, delete views
 * 
 * @author Yaswanth
 * 
 */
@Path("api/contact-view")
public class CustomViewAPI
{

    /**
     * Gets List of {@link CustomView}, Fetches all the views saved in domain
     * 
     * @return {@link List} of {@link CustomView}
     */
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<CustomView> getContactViews()
    {

	// Calls getContactViewList() in customview to fetch all views
	return CustomView.getContactViewList();

    }

    /**
     * Saves CustomView object in current domain
     * 
     * @param contact_view
     *            {@link CustomView} object
     * @return {@link CustomView}
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public CustomView createContactView(CustomView contact_view)
    {

	// Sends save request, to save the view
	contact_view.save();
	return contact_view;

    }

    /**
     * PUT request, updates the {@link CustomView} object
     * 
     * @param contact_view
     *            {@link CustomView} object
     * @return {@link CustomView}
     * 
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public CustomView updateContactView(CustomView contact_view)
    {
	contact_view.save();
	return contact_view;

    }

    // Get Contact View by id Author: Yaswanth 09-02-2012
    /**
     * Returns {@link CustomView} object, fetched based on the id sent as
     * pathparam
     * 
     * @param id
     *            Id of view object
     * @return
     */
    @Path("{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public CustomView getContactView(@PathParam("id") Long id)
    {

	// Returns Customview based on the id parameter
	return CustomView.getContactView(id);

    }

    /**
     * Deletes bulk {@link CustomView} objects
     * 
     * @param model_ids
     *            Array of CustomView ids to delete
     * @throws JSONException
     */
    @Path("delete/bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteBulkContactViews(@FormParam("ids") String model_ids)
	    throws JSONException
    {

	// Converts String of ids to JSONArray
	JSONArray ContactViewsJSONArray = new JSONArray(model_ids);
	CustomView.dao.deleteBulkByIds(ContactViewsJSONArray);
    }
}
