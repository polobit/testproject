package com.agilecrm.contact;

import java.util.List;

public class ContactManager
{

	public static String EXPORT_FILE_TYPE_XLS = "xls";
	public static String EXPORT_FILE_TYPE_CSV = "CSV";

	public static void exportContacts(List<Contact> contacts, String fileType)
	{

		// Export this as a csv, xls, etc.

	}

	public static void importContacts(List<Contact> contacts)
	{

		// Import this list into the database

		// Interate through Array and call put for each contact

		/*
		 * ObjectifyGenericDao<Contact> contactDAO = new
		 * ObjectifyGenericDao<Contact>(Contact.class);
		 * 
		 * try { return contactDAO.get(contactDAO.put(contact).getId()); }
		 * catch(Exception e) { return null; }
		 */

	}

}
