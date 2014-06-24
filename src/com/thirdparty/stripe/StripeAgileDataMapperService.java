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
 * <code>It Maps Stripe customer fields into agile Contact fields</code>
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
		Widget widget = WidgetUtil.getWidget("Stripe");
		try {
		if(widget != null){
			JSONObject prefs = new JSONObject(widget.prefs);
			if(prefs.has("stripe_field_name"))
				fields.add(new ContactField(prefs.get("stripe_field_name").toString(),customer.getId(),null));
			
		}
        
		JSONObject address = new JSONObject();
	
			address.put("Street",
					card.getAddressLine1() + " " + card.getAddressLine2());
			address.put("City", card.getAddressCity());
			address.put("State", card.getAddressState());
			address.put("Country", card.getAddressCountry());
			address.put("Zip", card.getAddressZip());
			fields.add(new ContactField(Contact.ADDRESS, address.toString(),"Work"));
			ctx.properties = fields;
			List<ContactField> l = ctx.getProperties();
			for(ContactField  f:l){
			  if(f.type == FieldType.CUSTOM){
				  System.out.println(f.name);
			  }
			}
		} catch (Exception e) {
			e.printStackTrace();

		}
		return ctx;

	}

}
