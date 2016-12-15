package com.agilecrm.core.api.products;

import java.util.ArrayList;
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
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.products.Product;
import com.agilecrm.products.util.ProductsUtil;

/**
 * API call related to products.
 * 
 * @author sri.
 *
 */
@Path("/api/products")
public class ProductsAPI
{
    /**
     * ProductUtil class reference.
     */
    private ProductsUtil productsUtil = null;

    /**
     * Default constructor.
     */
    public ProductsAPI()
    {
	// Create ProductUtil object for performing the database related
	// operations.
	productsUtil = new ProductsUtil();
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
    public List<Product> getProducts(@QueryParam("price") String price)
    {
	if (StringUtils.isEmpty(price))
	    return productsUtil.getAllProducts();
	Float fVal=null;
		try{
			fVal=new Float(price);
		
		}catch(Exception igre){}
		if (fVal==null)
		    return productsUtil.getAllProducts();	
	return productsUtil.getProductsByPrice(fVal);
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
    public Product createProduct(Product product)
    {
	if (product.getId() != null)
	    return updateProduct(product);

	
	if (productsUtil.getProductByName(product.getName()).size()>0)
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Product with this name already exists.").build());
	
	return productsUtil.createProduct(product);
    }

    /**
     * Update a product if it is a valid product.
     * 
     * @param product
     *            product to be updated.
     * @return updated product.
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Product updateProduct(Product product)
    {
	
    	List<Product> products=productsUtil.getProductByName(product.getName());
    	if(products!=null && products.size()>0)
    	{
    		for(Product s_product:products)
    		{
    			if(!String.valueOf( s_product.getId()).equals(String.valueOf(product.getId())))
        		{
        			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
        				    .entity("Product with this name already exists.").build());
        		}
    		}
    		
    	}
    	return productsUtil.updateProduct(product);
    }

    
    /**
     * Delete product based on the id.
     * 
     * @param id
     *            id of the product.
     */
    @Path("delete")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteProduct(@FormParam("id") String id)
    {
	try
	{
	    productsUtil.deleteProduct(Long.parseLong(id));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Unable to delete Product. Please check the input.").build());
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
    public void deleteProductById(@PathParam("id") Long id)
    {
	try
	{
	    productsUtil.deleteProduct(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Unable to delete Product. Please check the input.").build());
	}
    }
    /**
     * Deletes List of products, based on the ids sent
     * 
     * @param model_ids
     *            Stringified representation of list of ids
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteContacts(@FormParam("ids") String model_ids) throws JSONException
    {

	JSONArray productsFiltersJSONArray = new JSONArray(model_ids);

	// Deletes all contact filters with ids specified in the list
	ProductsUtil.dao.deleteBulkByIds(productsFiltersJSONArray);
    }
}
