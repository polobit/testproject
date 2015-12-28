package com.agilecrm.social;

import org.json.JSONArray;
import org.json.JSONObject;

import com.braintreegateway.BraintreeGateway;
import com.braintreegateway.Environment;
import com.braintreegateway.ResourceCollection;
import com.braintreegateway.Transaction;
import com.braintreegateway.TransactionSearchRequest;

public class BrainTreeUtil {
	BraintreeGateway gateway = null;
	Environment PRODUCTION = Environment.PRODUCTION;
	Environment SANDBOX = Environment.SANDBOX;

	public BrainTreeUtil(String merchantId, String publicKey, String privateKey) {
		gateway = new BraintreeGateway(SANDBOX, merchantId, publicKey,
				privateKey);
	}

	public JSONArray getTransactions(String email) {
		JSONArray jArray = null;
		try {

			TransactionSearchRequest request = new TransactionSearchRequest()
					.customerEmail().is(email);

			ResourceCollection<Transaction> collection = gateway.transaction()
					.search(request);
			jArray = new JSONArray();
			for (Transaction transaction : collection) {
				JSONObject jObj = null;
				jObj = new JSONObject();
				jObj.put("amount", transaction.getAmount());
				jObj.put("orderId", transaction.getOrderId());
				jArray.put(jObj);
			}
		} catch (Exception e) {
			System.out.println("Gateway not found");
		}

		return jArray;
	}

}
