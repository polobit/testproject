package com.agilecrm.social;

import java.util.Calendar;

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
		gateway = new BraintreeGateway(PRODUCTION, merchantId, publicKey,
				privateKey);
	}

	public JSONArray getTransactions(String email) throws Exception {
		JSONArray jArray = null;

		TransactionSearchRequest request = new TransactionSearchRequest()
				.customerEmail().is(email);

		ResourceCollection<Transaction> collection = gateway.transaction()
				.search(request);
		jArray = new JSONArray();
		for (Transaction transaction : collection) {
			JSONObject jObj = null;

			jObj = new JSONObject();
			jObj.put("id", transaction.getId());
			jObj.put("purchaseId", transaction.getPurchaseOrderNumber());
			jObj.put("amount", transaction.getAmount());
			jObj.put("orderId", transaction.getOrderId());
			jObj.put("status", transaction.getStatus());
			jObj.put("taxAmount", transaction.getTaxAmount());

			Calendar calendar = transaction.getCreatedAt();
			jObj.put("createdDate", calendar.getTimeInMillis());

			jArray.put(jObj);
		}
		return jArray;
	}
}
