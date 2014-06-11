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
import com.stripe.model.Card;
import com.stripe.model.Customer;

/**
 * @author jitendra
 * 
 */
public class StripeAgileDataMapperService {

	public Contact createCustomerDataMap(Customer customer) {
		Contact ctx = new Contact();
		List<ContactField> fields = new ArrayList<ContactField>();
		ctx.type = Type.PERSON;
		fields.add(new ContactField(Contact.EMAIL, customer.getEmail(), "work"));
		Card card = customer.getActiveCard();
		fields.add(new ContactField(Contact.FIRST_NAME, card.getName(), null));

		JSONObject address = new JSONObject();
		try {
			address.put("Street",
					card.getAddressLine1() + " " + card.getAddressLine2());
			address.put("City", card.getAddressCity());
			address.put("State", card.getAddressState());
			address.put("Country", card.getAddressCountry());
			address.put("Zip", card.getAddressZip());
			fields.add(new ContactField(Contact.ADDRESS, address.toString(),"Work"));
			ctx.properties = fields;
		} catch (Exception e) {
			e.printStackTrace();

		}
		return ctx;

	}

}
