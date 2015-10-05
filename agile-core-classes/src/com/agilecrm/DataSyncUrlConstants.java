package com.agilecrm;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.contact.sync.Type;
import com.thirdparty.google.ContactPrefs;

public class DataSyncUrlConstants
{
	//Constants
	
	public static String GOOGLE_IMAGE_URL="/img/icons/google-contacts-sync.png";
	public static String GOOGLE_CONTENT="Agile can periodically sync your contacts in your CRM with your Google Contacts.";
	
	public static String SHOPIFY_IMAGE_URL="img/crm-plugins/shopify.png";
	public static String SHOPIFY_CONTENT="Sync customer data and Agile CRM as contacts along with purchase history.";
	
	public static String FRESHBOOKS_IMAGE_URL="img/plugins/freshbooks-logo.png";
	public static String FRESHBOOKS_CONTENT="Sync Clients from Freshbooks as Contacts in Agile CRM along with purchase history.";
	
	public static String QUICKBOOKS_IMAGE_URL="/widgets/QuickBooks210x70.png";
	public static String QUICKBOOKS_CONTENT="Sync customers in Quickbooks as Contacts in Agile CRM along with invoice and payment data.";
	
	public static String STRIPE_IMAGE_URL="/img/plugins/Stripe.png";
	public static String STRIPE_CONTENT="Sync customers in Stripe as Contacts in Agile CRM with their subscription &amp; payment data.";
			
	
	
	private static DataSyncUrlConstants dataSyncUrlConstants;
	
	public static List<String> dataSyncTypes=getdataSyncTypes();
	
	
	
	private DataSyncUrlConstants(){
	}
	
	public static List<String> getdataSyncTypes(){
		List<String> dataSyncTypes=new ArrayList<String>();
		dataSyncTypes.add("GOOGLE");
		dataSyncTypes.add("STRIPE");
		dataSyncTypes.add("SHOPIFY");
		dataSyncTypes.add("QUICKBOOK");
		dataSyncTypes.add("FRESHBOOKS");
		return dataSyncTypes;
	}
	
	
	public static synchronized DataSyncUrlConstants getDataSyncUrlInstance(){
		
		if(dataSyncUrlConstants==null)
			dataSyncUrlConstants=new DataSyncUrlConstants();
		return dataSyncUrlConstants;
	}
	
	
	public  ContactPrefs getDataSyncWidget(String type){
		 ContactPrefs contactPrefs=new ContactPrefs();
		 
		  switch (type) {
          case "GOOGLE":   
        	  contactPrefs.type=Type.GOOGLE;
        	  contactPrefs.imageUrl=GOOGLE_IMAGE_URL;
        	  contactPrefs.content=GOOGLE_CONTENT;
                break;
          case "SHOPIFY": 
        	  contactPrefs.type=Type.SHOPIFY;
        	  contactPrefs.imageUrl=SHOPIFY_IMAGE_URL;
        	  contactPrefs.content=SHOPIFY_CONTENT;
                   break;
          case "STRIPE": 
        	  contactPrefs.type=Type.STRIPE;
        	  contactPrefs.imageUrl=STRIPE_IMAGE_URL;
        	  contactPrefs.content=STRIPE_CONTENT;
                   break;
          case "QUICKBOOK": 
        	  contactPrefs.type=Type.QUICKBOOK;
        	  contactPrefs.imageUrl=QUICKBOOKS_IMAGE_URL;
        	  contactPrefs.content=QUICKBOOKS_CONTENT;
                   break;
          case "FRESHBOOKS": 
        	  contactPrefs.type=Type.FRESHBOOKS;
        	  contactPrefs.imageUrl=FRESHBOOKS_IMAGE_URL;
        	  contactPrefs.content=FRESHBOOKS_CONTENT;
                   break;
      }
		 return contactPrefs;
		
	}
}
