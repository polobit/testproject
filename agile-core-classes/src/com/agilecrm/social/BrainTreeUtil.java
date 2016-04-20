package com.agilecrm.social;

import java.math.BigDecimal;
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

	public void getTransactionByID(String id) {
		TransactionSearchRequest searchRequest = new TransactionSearchRequest()
				.amount().greaterThanOrEqualTo(new BigDecimal("15.00"));
		ResourceCollection<Transaction> collection = gateway.transaction()
				.search(searchRequest);

		JSONArray jArray = new JSONArray();
		System.out.println("size : " + collection.getMaximumSize());
		for (Transaction transaction : collection) {
			System.out.println("----------------------------");
			System.out.println(transaction.getCustomer().getEmail());
			System.out.println(transaction.getCustomer().getId());
			System.out.println(transaction.getAmount());

		}
	}

	public static void main(String args[]) {
		String merchantId = "wd9pbyzvswvbdc8j";
		String publicKey = "57cc7rydfqkfjvny";
		String privateKey = "88febbbe7ccec03d5856b36647de0098";
		BrainTreeUtil bUtil = new BrainTreeUtil(merchantId, publicKey,
				privateKey);
		bUtil.getTransactionByID("abc");
	}
}
