package com.agilecrm.customerinvoices;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * 
 * Customer Invoices master information.
 * 
 * @author sri.
 *
 */
@XmlRootElement
@Cached
public class CustomerInvoice
{

	public static ObjectifyGenericDao<CustomerInvoice> dao = new ObjectifyGenericDao<CustomerInvoice>(CustomerInvoice.class);
    /**
     * The display name of the customerinvoice in the list.
     */
	
	public static enum DiscountType {
		Value, Percent
	};
	
	
	public DiscountType discount_type = DiscountType.Value;
	
    @Id
    private Long id;

    /**
     * The value of the customerinvoice.
     */
    
    private String invoice_no = null;

    private String notes = null;

    private String contact = null;
    
    private String template=null;
    
    /**
     * Created time of product
     */
    private Long created_time = 0L;

    /**
     * Updated time of product
     */
    private Long updated_time = 0L;

    /**
     * total of this invoice.
     * 
     */
    private float final_total = 0;

    private float discount_amt = 0;
    
    private boolean apply_discount = false;

    
    public CustomerInvoice()
    {

    }

    public CustomerInvoice(String template,String invoice_no,String contact,String notes, float final_total,DiscountType discount_type,float discount_amt,boolean apply_discount)
    {
	this.template = template;
	this.notes=notes;
	this.final_total=final_total;
	this.discount_amt=discount_amt;
	this.discount_type=discount_type;
	this.apply_discount=apply_discount;
	this.contact=contact;
	this.invoice_no=invoice_no;
    }

    /**
     * @return the price
     */
    public float getFinal_total()
    {
	return final_total;
    }
    public float getDiscount_amt()
    {
	return discount_amt;
    }

    
    /**
     * @return the Notes
     */
    public String getNotes()
    {
	return this.notes;
    }
    
    /**
     * @return the name
     */
    public String getTemplate()
    {
	return this.template;
    }

    public String getInvoice_no()
    {
	return this.invoice_no;
    }
    
    public String getContact()
    {
	return this.contact;
    }
    
    /**
     * @return the created_time
     */
    public Long getCreated_time()
    {
	return created_time;
    }

    /**
     * @return the updated_time
     */
    public Long getUpdated_time()
    {
	return updated_time;
    }

    
    /**
     * @return the id
     */
    public Long getId()
    {
	return id;
    }

    /**
     * @param id
     *            the id to set
     */
    public void setId(Long id)
    {
	this.id = id;
    }


    /**
     * @param updated_time
     *            the updated_time to set
     */
    public void setUpdated_time(Long updated_time)
    {
	this.updated_time = updated_time;
    }

    /**
     * @param entity_type
     *            the entity_type to set
     */
    public void setFinal_total(float finaltotal)
    {
	this.final_total = finaltotal;
    }

    /**
     * @param name
     *            the name to set
     */
    public void setNotes(String notes)
    {
	this.notes = notes;
    }

    public void setInvoice_no(String invoice_no)
    {
	this.invoice_no = invoice_no;
    }
    
    public void setContact(String contact)
    {
	this.contact = contact;
    }
    public void setTemplate(String template)
    {
	this.template = template;
    }
    /**
     * @param created_time
     *            the created_time to set
     */
    public void setCreated_time(Long created_time)
    {
	this.created_time = created_time;
    }


    /**
     * Assigns created time for the new one, creates task related contact keys
     * list with their ids and owner key with current agile user id.
     */
    @PrePersist
    private void PrePersist()
    {
	// Store Created Time
	if (created_time == 0L)

	    created_time = System.currentTimeMillis() / 1000;
	updated_time = System.currentTimeMillis() / 1000;
	
	System.out.println("invoice data : " + invoice_no);
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString()
    {
	StringBuilder builder = new StringBuilder();
	builder.append("CustomerInvoice [notes=").append(notes).append(", template=").append(template).append(", final_total=")
		.append(final_total)
		.append(", created_time=").append(created_time)
		
		.append(", invoice_no=").append(invoice_no)
		//.append(", products=").append(products)
		.append(", discount_type=").append(discount_type)
		.append(", apply_discount=").append(apply_discount)
		.append(",discountamt=").append(discount_amt)
		.append(", contact=").append(contact)
		.append(", updated_time=").append(updated_time).append("]");
	return builder.toString();
    }

 //   @XmlElement(name = "products")
//	@Embedded
//	@Indexed
	//public List<CustomerInvoiceProducts> products = new ArrayList<CustomerInvoiceProducts>();
}

