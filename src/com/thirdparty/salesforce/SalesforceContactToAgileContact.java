package com.thirdparty.salesforce;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.cases.Case;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;

public class SalesforceContactToAgileContact
{

	public static void saveSalesforceAccountsInAgile(JSONArray arrayOfLeads, Key<DomainUser> ownerKey) throws Exception
	{
		System.out.println("In save accounts of salesforce");
		int counter = 0;

		for (int i = 0; i < arrayOfLeads.length(); i++)
		{

			try
			{
				System.out.println(arrayOfLeads.getJSONObject(i));
				JSONObject jsonObject = arrayOfLeads.getJSONObject(i);

				Contact agileContact = saveCompanyInAgile(jsonObject, ownerKey);

				if (agileContact == null)
					continue;

				counter += 1;

				System.out.println("notes----------- ");
				// as note
				if (jsonObject.has("Industry"))
				{
					Note note = new Note();

					note.subject = "Industry";
					note.description = jsonObject.getString("Industry");

					note.addRelatedContacts(String.valueOf(agileContact.id));
					note.save();
					System.out.println(note.id);
				}

				// as note
				if (jsonObject.has("Description"))
				{
					Note note = new Note();

					note.subject = "Description";
					note.description = jsonObject.getString("Description");

					note.addRelatedContacts(String.valueOf(agileContact.id));
					note.save();
					System.out.println(note.id);
				}

				// as note
				if (jsonObject.has("NumberOfEmployees"))
				{
					Note note = new Note();

					note.subject = "Number Of Employees";
					note.description = jsonObject.getString("NumberOfEmployees");

					note.addRelatedContacts(String.valueOf(agileContact.id));
					note.save();
					System.out.println(note.id);
				}

			}
			catch (Exception e)
			{
				e.printStackTrace();
				System.out.println(e.getMessage());
			}
		}

		BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, String.valueOf(counter)
				+ " Accounts imported from Salesforce");
	}

	public static void saveSalesforceContactsInAgile(ContactPrefs contactPrefs, JSONArray arrayOfContacts,
			Key<DomainUser> ownerKey)
	{
		System.out.println("In save contacts of salesforce");
		System.out.println(arrayOfContacts.length());
		int counter = 0;

		for (int i = 0; i < arrayOfContacts.length(); i++)
		{
			try
			{
				System.out.println(arrayOfContacts.getJSONObject(i));
				JSONObject jsonObject = arrayOfContacts.getJSONObject(i);

				Contact agileContact = saveContactInAgile(contactPrefs, jsonObject, ownerKey);

				if (agileContact.id != 0l)
					counter += 1;
			}
			catch (Exception e)
			{
				e.printStackTrace();
				System.out.println(e.getMessage());
			}
		}

		BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, String.valueOf(counter)
				+ " contacts imported from Salesforce");
	}

	public static void saveSalesforceLeadsInAgile(JSONArray arrayOfLeads, Key<DomainUser> ownerKey) throws Exception
	{
		System.out.println("In save leads of salesforce");

		int counter = 0;

		for (int i = 0; i < arrayOfLeads.length(); i++)
		{
			Contact agileContact = new Contact();

			List<ContactField> fields = new ArrayList<ContactField>();

			try
			{
				System.out.println(arrayOfLeads.getJSONObject(i));
				JSONObject jsonObject = arrayOfLeads.getJSONObject(i);

				if (jsonObject.has("Email"))
				{
					// checks for duplicate emails and skips contact
					if (ContactUtil.isExists(arrayOfLeads.getJSONObject(i).getString("Email")))
						continue;

					fields.add(new ContactField(Contact.EMAIL, jsonObject.getString("Email"), null));
				}

				if (jsonObject.has("FirstName"))
					fields.add(new ContactField(Contact.FIRST_NAME, jsonObject.getString("FirstName"), null));

				if (jsonObject.has("LastName"))
					fields.add(new ContactField(Contact.LAST_NAME, jsonObject.getString("LastName"), null));

				if (jsonObject.has("Company"))
					fields.add(new ContactField(Contact.COMPANY, jsonObject.getString("Company"), null));

				if (jsonObject.has("Rating"))
					fields.add(new ContactField("lead_score", jsonObject.getString("Rating"), null));

				if (jsonObject.has("Title"))
					fields.add(new ContactField(Contact.TITLE, jsonObject.getString("Title"), null));

				if (jsonObject.has("Phone"))
					fields.add(new ContactField("phone", jsonObject.getString("Phone"), "work"));

				if (jsonObject.has("MobilePhone"))
					fields.add(new ContactField("phone", jsonObject.getString("MobilePhone"), "mobile"));

				if (jsonObject.has("Fax"))
					fields.add(new ContactField("phone", jsonObject.getString("Fax"), "home fax"));

				if (jsonObject.has("Website"))
					fields.add(new ContactField("website", jsonObject.getString("Website"), "URL"));

				JSONObject addressJSON = new JSONObject();

				if (jsonObject.has("MailingStreet"))
					addressJSON.put("address", jsonObject.getString("MailingStreet"));

				if (jsonObject.has("City"))
					addressJSON.put("city", jsonObject.getString("City"));

				if (jsonObject.has("State"))
					addressJSON.put("state", jsonObject.getString("State"));

				if (jsonObject.has("Country"))
					addressJSON.put("country", jsonObject.getString("Country"));

				if (jsonObject.has("PostalCode"))
					addressJSON.put("zip", jsonObject.getString("PostalCode"));

				if (addressJSON.length() == 0)
					addressJSON = null;
				else
				{
					System.out.println(addressJSON);
					fields.add(new ContactField(Contact.ADDRESS, addressJSON.toString(), "home"));
				}

				agileContact.properties = fields;

				agileContact.setContactOwner(ownerKey);
				System.out.println(agileContact);
				agileContact.save();

				counter++;

			}
			catch (Exception e)
			{
				e.printStackTrace();
				System.out.println(e.getMessage());
			}
		}

		BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, String.valueOf(counter)
				+ " leads imported from Salesforce");
	}

	public static void saveSalesforceOpportunitiesInAgile(ContactPrefs contactPrefs, JSONArray arrayOfDeals,
			Key<DomainUser> ownerKey)
	{
		System.out.println("In save accounts of salesforce");
		Milestone mileStone = MilestoneUtil.getMilestones();
		String mileStonesString = mileStone.milestones;
		int initialMileStoneLength = mileStonesString.length();
		System.out.println("initialMileStoneLength " + initialMileStoneLength);
		int counter = 0;

		for (int i = 0; i < arrayOfDeals.length(); i++)
		{
			System.out.println("count " + i);
			Opportunity agileDeal = new Opportunity();

			try
			{
				System.out.println(arrayOfDeals.getJSONObject(i));
				JSONObject jsonObject = arrayOfDeals.getJSONObject(i);

				if (jsonObject.has("Name"))
					agileDeal.name = jsonObject.getString("Name");

				if (jsonObject.has("Description"))
					agileDeal.description = jsonObject.getString("Description");

				if (jsonObject.has("ExpectedRevenue"))
					agileDeal.expected_value = Double.parseDouble(jsonObject.getString("ExpectedRevenue"));

				if (jsonObject.has("Probability"))
					agileDeal.probability = Double.valueOf(jsonObject.getString("Probability")).intValue();

				if (jsonObject.has("StageName"))
				{
					System.out.println("StageName " + jsonObject.getString("StageName"));
					mileStonesString = checkAndAddMileStone(mileStonesString, jsonObject.getString("StageName"));
					System.out.println(i + " " + mileStonesString);
					agileDeal.milestone = jsonObject.getString("StageName");
				}

				if (jsonObject.has("CloseDate"))
					try
					{
						SimpleDateFormat formatter = new SimpleDateFormat("yyyy-mm-dd");
						Date date = formatter.parse(jsonObject.getString("CloseDate"));
						System.out.println(date.getTime());
						agileDeal.close_date = date.getTime() / 1000;

					}
					catch (ParseException e)
					{
						e.printStackTrace();
					}

				if (jsonObject.has("AccountId"))
				{
					JSONObject accountJSON = new JSONObject(SalesforceUtil.getAccountByAccountIdFromSalesForce(
							contactPrefs, jsonObject.getString("AccountId")));
					if (accountJSON.has("Name"))
					{
						Key<Contact> company = ContactUtil.getCompanyByName(accountJSON.getString("Name"));
						if (company != null)
							agileDeal.addContactIds(String.valueOf(company.getId()));
						else
						{
							Contact comp = saveCompanyInAgile(accountJSON, ownerKey);
							if (comp != null)
								agileDeal.addContactIds(String.valueOf(comp.id));
						}
					}
				}

				agileDeal.setOpportunityOwner(ownerKey);
				System.out.println(agileDeal);
				agileDeal.save();
				counter++;
			}
			catch (Exception e)
			{
				e.printStackTrace();
				System.out.println(e.getMessage());
			}
		}

		BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, String.valueOf(counter)
				+ " opportunities imported from Salesforce");

		System.out.println("MileStoneLength " + initialMileStoneLength);
		if (initialMileStoneLength < mileStonesString.length())
		{
			System.out.println(mileStonesString);
			mileStone.milestones = mileStonesString;
			mileStone.save();

		}
	}

	public static void saveSalesforceCasesInAgile(ContactPrefs contactPrefs, JSONArray arrayOfCases,
			Key<DomainUser> ownerKey)
	{
		System.out.println("In save cases of salesforce");
		int counter = 0;

		for (int i = 0; i < arrayOfCases.length(); i++)
		{
			Case agileCase = new Case();

			try
			{
				System.out.println(arrayOfCases.getJSONObject(i));
				JSONObject jsonObject = arrayOfCases.getJSONObject(i);

				if (jsonObject.has("Subject"))
					agileCase.title = jsonObject.getString("Subject");

				if (jsonObject.has("Status"))
				{

					if (jsonObject.getString("Status").equalsIgnoreCase("Closed"))
						agileCase.status = Case.Status.CLOSE;

					if (jsonObject.getString("Status").equalsIgnoreCase("New")
							|| jsonObject.getString("Status").equalsIgnoreCase("Working")
							|| jsonObject.getString("Status").equalsIgnoreCase("Escalated"))
						agileCase.status = Case.Status.OPEN;
				}

				if (jsonObject.has("Description"))
					agileCase.description = jsonObject.getString("Description");

				// relate getting contact
				if (jsonObject.has("ContactId"))
				{
					JSONObject contactJSON = new JSONObject(SalesforceUtil.getContactByContactIdFromSalesForce(
							contactPrefs, jsonObject.getString("ContactId")));

					System.out.println("contact from agile");
					System.out.println(contactJSON);
					if (contactJSON.length() != 0)
					{
						Contact contact = saveContactInAgile(contactPrefs, contactJSON, ownerKey);
						System.out.println("saved contact");
						System.out.println(contact);

						if (contact != null)
							agileCase.addContactToCase(String.valueOf(contact.id));
					}
				}

				System.out.println(agileCase);
				agileCase.setCaseOwner(ownerKey);
				agileCase.save();

				counter++;

			}
			catch (Exception e)
			{
				e.printStackTrace();
				System.out.println(e.getMessage());
			}
		}

		BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, String.valueOf(counter)
				+ " cases imported from Salesforce");
	}

	public static Contact saveContactInAgile(ContactPrefs contactPrefs, JSONObject jsonObject, Key<DomainUser> ownerKey)
			throws Exception
	{
		System.out.println("In save contact of agile");
		Contact agileContact = new Contact();
		List<ContactField> fields = new ArrayList<ContactField>();

		if (jsonObject.has("Email"))
		{
			// checks for duplicate emails and skips contact
			if (ContactUtil.isExists(jsonObject.getString("Email")))
				agileContact = ContactUtil.searchContactByEmail(jsonObject.getString("Email"));

			System.out.println("In save contact - agile contact ");
			System.out.println(agileContact);

			fields.add(new ContactField(Contact.EMAIL, jsonObject.getString("Email"), null));
		}

		if (jsonObject.has("FirstName"))
			fields.add(new ContactField(Contact.FIRST_NAME, jsonObject.getString("FirstName"), null));

		if (jsonObject.has("LastName"))
			fields.add(new ContactField(Contact.LAST_NAME, jsonObject.getString("LastName"), null));

		if (jsonObject.has("Title"))
			fields.add(new ContactField(Contact.TITLE, jsonObject.getString("Title"), null));

		if (jsonObject.has("AccountId"))
		{
			JSONObject accountJSON = new JSONObject(SalesforceUtil.getAccountByAccountIdFromSalesForce(contactPrefs,
					jsonObject.getString("AccountId")));
			if (accountJSON.has("Name"))
			{
				fields.add(new ContactField(Contact.COMPANY, accountJSON.getString("Name"), null));
			}
		}

		if (jsonObject.has("Phone"))
			fields.add(new ContactField("phone", jsonObject.getString("Phone"), "main"));

		if (jsonObject.has("MobilePhone"))
			fields.add(new ContactField("phone", jsonObject.getString("MobilePhone"), "mobile"));

		if (jsonObject.has("HomePhone"))
			fields.add(new ContactField("phone", jsonObject.getString("HomePhone"), "home"));

		if (jsonObject.has("OtherPhone"))
			fields.add(new ContactField("phone", jsonObject.getString("OtherPhone"), "other"));

		if (jsonObject.has("Fax"))
			fields.add(new ContactField("phone", jsonObject.getString("Fax"), "home fax"));

		JSONObject addressJSON = new JSONObject();

		if (jsonObject.has("MailingStreet"))
			addressJSON.put("address", jsonObject.getString("MailingStreet"));

		if (jsonObject.has("MailingCity"))
			addressJSON.put("city", jsonObject.getString("MailingCity"));

		if (jsonObject.has("MailingState"))
			addressJSON.put("state", jsonObject.getString("MailingState"));

		if (jsonObject.has("MailingCountry"))
			addressJSON.put("country", jsonObject.getString("MailingCountry"));

		if (jsonObject.has("MailingPostalCode"))
			addressJSON.put("zip", jsonObject.getString("MailingPostalCode"));

		if (addressJSON.length() == 0)
			addressJSON = null;
		else
		{
			System.out.println(addressJSON);
			fields.add(new ContactField(Contact.ADDRESS, addressJSON.toString(), "address"));
		}

		agileContact.properties = fields;

		System.out.println(agileContact);
		agileContact.setContactOwner(ownerKey);
		agileContact.save();

		// as note
		if (jsonObject.has("Description"))
		{
			Note note = new Note();

			note.subject = "Description";
			note.description = jsonObject.getString("Description");

			note.addRelatedContacts(String.valueOf(agileContact.id));
			note.save();
			System.out.println(note.id);
		}

		if (jsonObject.has("Department"))
		{
			Note note = new Note();

			note.subject = "Department";
			note.description = jsonObject.getString("Department");

			note.addRelatedContacts(String.valueOf(agileContact.id));
			System.out.println("In note ");
			System.out.println(new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id));
			note.setOwner(new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id));
			note.save();
			System.out.println(note.id);
		}

		return agileContact;
	}

	public static Contact saveCompanyInAgile(JSONObject jsonObject, Key<DomainUser> ownerKey) throws Exception
	{
		System.out.println("In save company ");
		Contact agileContact = new Contact();

		List<ContactField> fields = new ArrayList<ContactField>();

		agileContact.type = Contact.Type.COMPANY;

		if (jsonObject.has("Name"))
			fields.add(new ContactField(Contact.NAME, jsonObject.getString("Name"), null));

		if (jsonObject.has("Website"))
			fields.add(new ContactField(Contact.WEBSITE, jsonObject.getString("Website"), null));

		if (jsonObject.has("Phone"))
			fields.add(new ContactField("phone", jsonObject.getString("Phone"), "main"));

		if (jsonObject.has("Fax"))
			fields.add(new ContactField("phone", jsonObject.getString("Fax"), "home fax"));

		JSONObject addressJSON = new JSONObject();

		if (jsonObject.has("BillingStreet"))
			addressJSON.put("address", jsonObject.getString("BillingStreet"));

		if (jsonObject.has("BillingCity"))
			addressJSON.put("city", jsonObject.getString("BillingCity"));

		if (jsonObject.has("BillingState"))
			addressJSON.put("state", jsonObject.getString("BillingState"));

		if (jsonObject.has("BillingCountry"))
			addressJSON.put("country", jsonObject.getString("BillingCountry"));

		if (jsonObject.has("BillingPostalCode"))
			addressJSON.put("zip", jsonObject.getString("BillingPostalCode"));

		if (addressJSON.length() == 0)
			addressJSON = null;
		else
		{
			System.out.println(addressJSON);
			fields.add(new ContactField(Contact.ADDRESS, addressJSON.toString(), "home"));
		}

		agileContact.properties = fields;

		System.out.println(agileContact);
		agileContact.setContactOwner(ownerKey);
		agileContact.save();

		return agileContact;

	}

	public static String checkAndAddMileStone(String milestones, String milestone)
	{
		String[] availableMileStones = milestones.split(",");

		boolean flag = false;

		for (String mile : availableMileStones)
		{
			if (milestone.equalsIgnoreCase(mile.trim()))
			{
				flag = true;
				break;
			}
		}

		if (!flag)
			return milestones + "," + milestone;

		return milestones;
	}
}
