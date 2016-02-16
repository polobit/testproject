package com.agilecrm.core.api.customerinvoices;

import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.json.JSONArray;
import org.json.JSONException;
import com.agilecrm.customerinvoices.CustomerInvoice;
import com.agilecrm.customerinvoices.util.CustomerInvoicesUtil;

/**
 * API call related to CustomerInvoices.
 * 
 * @author sri.
 *
 */
@Path("/api/customerinvoices")
public class CustomerInvoicesAPI
{
    /**
     * CustomerInvoicesUtil class reference.
     */
    private CustomerInvoicesUtil customerInvoicesUtil = null;

    /**
     * Default constructor.
     */
    public CustomerInvoicesAPI()
    {
	// Create ProductUtil object for performing the database related
	// operations.
	customerInvoicesUtil = new CustomerInvoicesUtil();
    }

    /**
     * Get the list of products.
     * 
     * @param price
     *            price on which the product is processed.
     * @return list of products.
     */
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<CustomerInvoice> getCustomerInvoices()
    {
	    return customerInvoicesUtil.getAllCustomerInvoices();

    }

   
    /**
     * Save the product, if it is a valid product.
     * 
     * @param product
     *            product to be saved.
     * @return saved product.
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public CustomerInvoice createCustomerInvoice(CustomerInvoice customerInvoice)
    {
	if (customerInvoice.getId() != null)
	    return updateCustomerInvoice(customerInvoice);

	
	
	return customerInvoicesUtil.createCustomerInvoice(customerInvoice);
    }

    /**
     * Update a customerinvoice if it is a valid customerinvoice.
     * 
     * @param customerinvoice
     *            customerinvoice to be updated.
     * @return updated customerinvoice.
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public CustomerInvoice updateCustomerInvoice(CustomerInvoice customerInvoice)
    {
	
	return customerInvoicesUtil.updateCustomerInvoice(customerInvoice);
    }

    
    /**
     * Delete customerinvoices based on the id.
     * 
     * @param id
     *            id of the customerinvoices.
     */
    @Path("delete")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteCustomerInvoice(@FormParam("id") String id)
    {
	try
	{
	    customerInvoicesUtil.deleteCustomerInvoice(Long.parseLong(id));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Unable to delete Customer Invoice. Please check the input.").build());
	}
    }
    
    /**
     * Delete product based on the id.
     * 
     * @param id
     *            id of the product.
     */
    @Path("{id}")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteCustomerInvoiceById(@PathParam("id") Long id)
    {
	try
	{
	    customerInvoicesUtil.deleteCustomerInvoice(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Unable to delete customerInvoice. Please check the input.").build());
	}
    }
    /**
     * Deletes List of customerinvoices, based on the ids sent
     * 
     * @param model_ids
     *            Stringified representation of list of ids
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteCustomerInvoices(@FormParam("ids") String model_ids) throws JSONException
    {

	JSONArray customerInvoicesFiltersJSONArray = new JSONArray(model_ids);

	// Deletes all contact filters with ids specified in the list
	customerInvoicesUtil.dao.deleteBulkByIds(customerInvoicesFiltersJSONArray);
    }
}
