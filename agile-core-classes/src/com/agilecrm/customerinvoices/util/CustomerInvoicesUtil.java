package com.agilecrm.customerinvoices.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.agilecrm.customerinvoices.CustomerInvoice;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.products.Product;

/**
 * All the utility methods and the dao methods for saving, updating and
 * retrieving the products.
 * 
 * @author sri.
 *
 */
public class CustomerInvoicesUtil
{

    
    
    // Dao
    public final static ObjectifyGenericDao<CustomerInvoice> dao = new ObjectifyGenericDao<CustomerInvoice>(CustomerInvoice.class);

    /**
     * Default constructor.
     */
    /*public ProductsUtil()
    {
	dao = new ObjectifyGenericDao<Product>(Product.class);
	
    }*/

    /**
     * Save the customerinvoice in data store. 
     * 
     * @param customerinvoice
     *            to be saved.
     * @return saved customerinvoice.
     */
    public CustomerInvoice createCustomerInvoice(CustomerInvoice customerInvoice)
    {
	
	dao.put(customerInvoice);
	return customerInvoice;
    }

    /**
     * Retrieve the customerinvoice using the id.
     * 
     * @param id
     *            id of the customerinvoice.
     * @return customerinvoice.
     */
    public CustomerInvoice getCustomerInvoice(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return null;
    }

    /**
     * Update the customerinvoice. 
     * 
     * 
     * @param customerinvoice
     *            to be updated.
     * @return updated customerinvoice.
     */
    public CustomerInvoice updateCustomerInvoice(CustomerInvoice customerInvoice)
    {
	if ( customerInvoice.getId() == null)
	    return null;
	CustomerInvoice oldci = getCustomerInvoice(customerInvoice.getId());
	if (oldci == null)
	    return null;
	customerInvoice.setCreated_time(oldci.getCreated_time());
	dao.put(customerInvoice);
	return customerInvoice;
    }

    /**
     * Return list of customer invoices.
     * 
     * 
     */
    public List<CustomerInvoice> getAllCustomerInvoices()
    {
	List<CustomerInvoice> customerInvoices = dao.fetchAll();


	return customerInvoices;
    }

    /**
     * Return list of customer invoices.
     * 
     */
    public List<CustomerInvoice> getAllCustomerInvoicesByInvoiceNo(String invoiceno)
    {
	List<CustomerInvoice> customerinvoices = dao.ofy().query(CustomerInvoice.class).filter("invoiceno", invoiceno).list();

	return customerinvoices;
    }

    /**
     * Delete the customer invoices.
     * 
     * @param id
     *            id of the customer invoice which has to be deleted.
     */
    public void deleteCustomerInvoice(Long id)
    {
	CustomerInvoice ci = getCustomerInvoice(id);
	dao.delete(ci);
    }

    
   

    /**
     * @param isUpdate
     * @return
     */
    public boolean isDuplicate(boolean isUpdate)
    {
	return true;
    }

    /**
     * Get the customer invoice by invoice no.
     * 
     * @param name
     *            name of the customer invoice.
     * @return
     */
    public List<CustomerInvoice> getCustomerInvoiceByInvoiceNo(String invoiceno)
    {
    	return dao.ofy().query(CustomerInvoice.class).filter("invoiceno", invoiceno).list();
    }

    public List<CustomerInvoice> getCustomerInvoicesByContact(String contact)
    {
    	return dao.ofy().query(CustomerInvoice.class).filter("contact", contact).list();
    }
    
        
    
    
   
}
