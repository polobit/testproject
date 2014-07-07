/**
 * 
 */
package com.thirdparty.stripe;

import java.util.ArrayList;
import java.util.List;

import javassist.bytecode.stackmap.BasicBlock.Catch;

import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.stripe.model.Card;
import com.stripe.model.Customer;

/**
 * <code>StripeAgileDataMapperService</code> This code will provide mapping all
 * Stripe's customers field data into agile contact
 * 
 * @author jitendra
 * 
 */
public class StripeAgileDataMapperService
{

    /**
     * This code will create Maps Stripe's customer field value to agile contact
     * field value
     * 
     * @param customer
     * @return Contact
     */
    public Contact createCustomerDataMap(Customer customer, String stripeFieldValue)
    {
	Contact ctx = new Contact();
	List<ContactField> fields = new ArrayList<ContactField>();
	ctx.type = Type.PERSON;
	fields.add(new ContactField(Contact.EMAIL, customer.getEmail(), "work"));
	Card card = customer.getActiveCard();
	fields.add(new ContactField(Contact.FIRST_NAME, card.getName(), null));

	try
	{
	    if (stripeFieldValue != null && !stripeFieldValue.isEmpty())
	    {

		fields.add(new ContactField(stripeFieldValue, customer.getId(), null));

	    }

	    JSONObject address = new JSONObject();

	    String addressLine2 ="";
	    if(card.getAddressLine2() != null){
		addressLine2  = card.getAddressLine2();
	    }
	    System.out.println(card.getAddressLine1());
	    address.put("address", card.getAddressLine1() + " " + addressLine2);
	    System.out.println(card.getAddressCity());
	    address.put("city", card.getAddressCity());
	    address.put("state", card.getAddressState());
	    address.put("country", card.getAddressCountry());
	    address.put("zip", card.getAddressZip());
	    fields.add(new ContactField(Contact.ADDRESS, address.toString(), "office"));
	    ctx.properties = fields;

	}
	catch (Exception e)
	{
	    e.printStackTrace();

	}
	return ctx;

    }
}
