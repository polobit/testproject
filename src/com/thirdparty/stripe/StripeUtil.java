/**
 * 
 */
package com.thirdparty.stripe;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.stripe.Stripe;
import com.stripe.exception.APIConnectionException;
import com.stripe.exception.APIException;
import com.stripe.exception.AuthenticationException;
import com.stripe.exception.CardException;
import com.stripe.exception.InvalidRequestException;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import com.stripe.model.CustomerCollection;
import com.thirdparty.google.ContactPrefs;

/**
 * @author jitendra
 *
 */
public class StripeUtil {
	
	public static final StripeAgileDataMapperService mapper = new StripeAgileDataMapperService();

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		//Stripe.apiKey = Globals.STRIPE_API_KEY;
		Stripe.apiKey ="sk_test_2RbCiX2Bf2QoEdRhGqY8nttc";
		Stripe.apiVersion ="2012-09-24";
        Map<String, Object> option = new HashMap<String, Object>();
         //option.put(key, value)
        try {
        	CustomerCollection list = Customer.all(option,"sk_test_2RbCiX2Bf2QoEdRhGqY8nttc");
        	List<Customer> customers = list.getData();
        	for(Customer c : customers){
        		Customer cust = Customer.retrieve(c.getId());
        	}
        } catch (Exception e) {
            e.printStackTrace();
        }
 
	}
	
	public static void importCustomer(ContactPrefs prefs ,Key<DomainUser> key){
		          Stripe.apiVersion ="2012-09-24";
			try {
				 CustomerCollection  collections = Customer.all(new HashMap<String,Object>(), prefs.apiKey);
				 List<Customer> customers = collections.getData();
				        for(Customer c : customers){
				        	Contact contact = mapper.createCustomerDataMap(c);
				        	contact.setContactOwner(key);
				        	contact.save();
				        }
				
			} catch (AuthenticationException | InvalidRequestException
					| APIConnectionException | CardException | APIException e) {
				e.printStackTrace();
			}
		       
	}

}
