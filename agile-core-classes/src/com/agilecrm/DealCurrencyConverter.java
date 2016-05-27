package com.agilecrm;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.CurrencyConversionRates;
import com.agilecrm.deals.Opportunity;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.googlecode.objectify.Query;

public class DealCurrencyConverter extends HttpServlet {
	private static ObjectifyGenericDao<CurrencyConversionRates> dao = new ObjectifyGenericDao<CurrencyConversionRates>(CurrencyConversionRates.class);
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		try {
			String s = "https://openexchangerates.org/api/latest.json?app_id=0713eecad3e9481dabea356a7f91ca60";
			URL url = new URL(s);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			Scanner scan = new Scanner(con.getInputStream());
			String string = new String();
			while (scan.hasNext()) {
				string += scan.nextLine();
			}			
			JSONObject jsonObject = new JSONObject(string);
			JSONObject listOfRates =  jsonObject.getJSONObject("rates");
			String rateString = listOfRates.toString();
			System.out.println("currency rates for cron = "+rateString);
			CurrencyConversionRates q = dao.ofy().query(CurrencyConversionRates.class).get();
			q.currencyRates = rateString ;
			q.save();
			scan.close();
			
		} catch (Exception e) {
			System.out.println("currency converter catch block");
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
	}
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		doGet(request,response);
		
	}
	

}
