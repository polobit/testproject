package com.agilecrm.social;

import org.json.JSONObject;

import com.agilecrm.widgets.Widget;
import com.paypal.api.payments.Invoices;
import com.paypal.api.payments.Search;
import com.paypal.base.rest.PayPalRESTException;

public class PaypalUtil {

	/**
	 * Retrieves info of Paypal user and retrieves contacts based on the email
	 * of contact
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @param email
	 *            {@link String} email, for which tickets are retrieved
	 * @return {@link String} form of JSON
	 * @throws Exception
	 */
	public static String getPaypalAccess(Widget widget) throws Exception {

		String prefs = widget.prefs;
		JSONObject obj = new JSONObject(prefs);
		String accessToken = obj.getString("access_token");
		return accessToken;
	}

	public Invoices search() throws PayPalRESTException {
		Search search = new Search();
		search.setStartInvoiceDate("2010-05-10 PST");
		search.setEndInvoiceDate("2014-04-10 PST");
		search.setPage(1);
		search.setPageSize(20);
		search.setTotalCountRequired(true);
		//return invoice.search(accessToken, search);
		return null;
	}
}
