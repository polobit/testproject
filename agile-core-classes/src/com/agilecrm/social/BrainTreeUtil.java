package com.agilecrm.social;

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

	public JSONObject getTransactions(String email) {
		JSONObject jObj = null;
		try {

			TransactionSearchRequest request = new TransactionSearchRequest()
					.customerEmail().is(email);

			ResourceCollection<Transaction> collection = gateway.transaction()
					.search(request);

			for (Transaction transaction : collection) {
				System.out.println(transaction.getAmount());
				System.out.println(transaction.getOrderId());
			}
		} catch (Exception e) {
			System.out.println("Gateway not found");
		}

		return jObj;
	}

}
