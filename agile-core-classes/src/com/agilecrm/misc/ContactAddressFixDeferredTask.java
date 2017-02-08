package com.agilecrm.misc;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.JSONUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>ContactAddressFixDeferredTask</code> is the deferred task that handles
 * campaign email Replied tasklet cron jobs.
 *
 * @author Govind
 * 
 */
@SuppressWarnings("serial")
public class ContactAddressFixDeferredTask implements DeferredTask {

	public String domain;
	public Long contactId;

	public ContactAddressFixDeferredTask(String domain, Long contactId) {
		this.domain = domain;
		this.contactId = contactId;
	}

	public void run() {
		String oldNamespace = NamespaceManager.get();
		try {
			if (StringUtils.isBlank(domain))
				return;

			NamespaceManager.set(domain);

			// Set Session
			Contact contact = Contact.dao.get(contactId);
			DomainUserPartial partial = contact.getOwner();

			UserInfo userInfo = new UserInfo("agilecrm.com", partial.email, partial.name);
			SessionManager.set(userInfo);

			ContactField ipField = contact.getContactFieldByNameAndSubType("IP",
					ContactField.FieldType.CUSTOM.toString());
			if (ipField == null || StringUtils.isBlank(ipField.value))
				return;

			ContactField addressField = contact.getContactFieldByNameAndSubType("address",
					ContactField.FieldType.CUSTOM.toString());

			String value = "";
			if (addressField != null) {
				value = addressField.value;
				try {
					if (new JSONObject(value).length() > 0)
						return;
				} catch (Exception e) {
				}
			}

			String addressValue = getAddressFromIp(ipField.value);
			System.out.println("addressValue = " + addressValue);

			if (addressField != null) {
				addressField.value = addressValue;
			} else {
				addressField = new ContactField("address", value, ContactField.FieldType.SYSTEM.toString());
			}

			contact.addProperty(addressField);

		} catch (EntityNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			NamespaceManager.set(oldNamespace);
		}

	}

	private static String getAddressFromIp(String ip) {
		String url = "http://freegeoip.net/json/" + ip;

		String response = HTTPUtil.accessURL(url);

		JSONObject addressJSON = new JSONObject();
		try {
			addressJSON = new JSONObject(response);

			String country = JSONUtil.getJSONValue(addressJSON, "country_code");
			String countryName = JSONUtil.getJSONValue(addressJSON, "country_name");
			String city = JSONUtil.getJSONValue(addressJSON, "city");
			String state = JSONUtil.getJSONValue(addressJSON, "region_code");
			if (country != null && country.equalsIgnoreCase("USA"))
				country = "US";

			addressJSON = new JSONObject();
			if (StringUtils.isNotBlank(country))
				addressJSON.put("country", country);
			if (StringUtils.isNotBlank(countryName))
				addressJSON.put("countryname", countryName);
			if (StringUtils.isNotBlank(city))
				addressJSON.put("city", city);
			if (StringUtils.isNotBlank(state))
				addressJSON.put("state", state);
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		return addressJSON.toString();
	}
	
	public static void main(String[] args) {
		System.out.println(getAddressFromIp("209.58.132.3"));
	}
}
