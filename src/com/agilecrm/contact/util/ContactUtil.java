package com.agilecrm.contact.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.ContactDocument;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.UserAccessScopes;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.workflows.status.CampaignStatus;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.twitter.util.TwitterJobQueueUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.search.Document.Builder;
import com.google.appengine.api.search.Index;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

/**
 * <code>ContactUtil</code> is a utility class to process the data of contact
 * class, it processes when fetching the data and saving bulk amount of contacts
 * to contact database.
 * <p>
 * This utility class includes methods needs to return contacts based on id,
 * tags, email and etc..Also includes methods which perform bulk operations on
 * contacts.
 * </p>
 * 
 * @author
 * 
 */
public class ContactUtil
{
	// Dao
	private static ObjectifyGenericDao<Contact> dao = new ObjectifyGenericDao<Contact>(Contact.class);

	/**
	 * Gets the number of contacts (count) present in the database with given
	 * tag name
	 * 
	 * @param tag
	 *            name of the tag
	 * @return count of the contacts
	 */
	public static int getContactsCountForTag(String tag)
	{
		return dao.ofy().query(Contact.class).filter("tagsWithTime.tag = ", tag).count();
	}

	/**
	 * Gets all the contact objects, associated with the given tag
	 * 
	 * @param tag
	 *            name of the tag
	 * @return list of contacts
	 */
	public static List<Contact> getContactsForTag(String tag, Integer count, String cursor, String orderBy)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("tagsWithTime.tag", tag);
		if (count != null)
			return dao.fetchAllByOrder(count, cursor, searchMap, true, false, orderBy);

		return dao.listByPropertyAndOrder(searchMap, orderBy);
	}

	/**
	 * Fetches a contact based on its id
	 * 
	 * @param id
	 *            unique id of a contact
	 * @return {@link Contact} related to the id
	 */
	public static Contact getContact(Long id)
	{
		try
		{
			return dao.get(id);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Fetch contacts with ACL condition
	 */
	public static Contact getContactWithACL(long id)
	{
		if (UserAccessControlUtil.hasScope(UserAccessScopes.VIEW_CONTACTS))
			return getContact(id);

		// User property query because
		return dao.getByProperty("id", id);
	}

	/**
	 * Fetches all the contacts at once irrespective of their type
	 * (person/company)
	 * 
	 * @return List of contacts
	 */
	public static List<Contact> getAllContacts()
	{
		return dao.fetchAll();
	}

	/**
	 * Fetches all the contacts at once irrespective of their type
	 * (person/company)
	 * 
	 * @return List of contacts
	 */
	public static List<Contact> getAllContactsByOrder(String orderBy)
	{
		return dao.fetchAllByOrder(orderBy);
	}

	// returns all contacts count
	public static int getCount()
	{

		return Contact.dao.count();

	}

	/*
	 * 
	 * /** Fetches all the contacts but not all at once, step by step based on
	 * max parameter value (When scroll bar is scrolled down from client side,
	 * "max" no of contacts will be fetched, when only cursor is not null)
	 * 
	 * @param max number of contacts to be fetched at once
	 * 
	 * @param cursor Activates infiniScroll in client side
	 * 
	 * @return list of contacts
	 */
	public static List<Contact> getAll(int max, String cursor)
	{
		return dao.fetchAll(max, cursor);
	}

	/**
	 * Fetches all the contacts of type company only (step by step)
	 * 
	 * @param max
	 *            number of contacts (of type company) to be fetched at once
	 * @param cursor
	 *            Activates infiniScroll at client side
	 * @return list of contacts (company)
	 */
	public static List<Contact> getAllCompanies(int max, String cursor)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("type", Type.COMPANY);
		return dao.fetchAll(max, cursor, searchMap);
	}

	/**
	 * Fetches all the contacts of type company only (step by step)
	 * 
	 * @param max
	 *            number of contacts (of type company) to be fetched at once
	 * @param cursor
	 *            Activates infiniScroll at client side
	 * @return list of contacts (company)
	 */
	public static List<Contact> getAllCompaniesByOrder(int max, String cursor, String sortKey)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("type", Type.COMPANY);
		return dao.fetchAllByOrder(max, cursor, searchMap, false, false, sortKey);
	}

	/**
	 * Fetches all the contacts of type person only (step by step)
	 * 
	 * @param max
	 *            number of contacts (of type person) to be fetched at once
	 * @param cursor
	 *            Activates infiniScroll at client side
	 * @return list of contacts (person)
	 */
	public static List<Contact> getAllContacts(int max, String cursor)
	{
		return getAllContacts(max, cursor, false);
	}

	/**
	 * Fetches all the contacts of type person only (step by step)
	 * 
	 * @param max
	 *            number of contacts (of type person) to be fetched at once
	 * @param cursor
	 *            Activates infiniScroll at client side
	 * @return list of contacts (person)
	 */
	public static List<Contact> getAllContactsByOrder(int max, String cursor, String sortKey)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("type", Type.PERSON);
		if (max != 0)
			return dao.fetchAllByOrder(max, cursor, searchMap, false, false, sortKey);

		return dao.listByPropertyAndOrder(searchMap, sortKey);
	}

	public static List<Contact> getAllContacts(int max, String cursor, boolean forceReload)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("type", Type.PERSON);
		if (max != 0)
			return dao.fetchAll(max, cursor, searchMap, forceReload);

		return dao.listByProperty(searchMap);
	}

	/**
	 * Fetch all contacts, which are related to Company-companyId,i.e.
	 * 
	 * @param companyId
	 *            - id of company whose related contacts we wanna fetch
	 * @param max
	 *            - max number of results
	 * @param cursor
	 *            - objectify cursor to continue where we left off last time
	 * @return List of Contacts(PERSON) which have this company in
	 *         Company/Organization Field
	 */
	public static List<Contact> getAllContactsOfCompany(String companyId, int max, String cursor)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("type", Type.PERSON);
		searchMap.put("contact_company_key", new Key<Contact>(Contact.class, Long.valueOf(companyId)));
		if (max != 0)
			return dao.fetchAll(max, cursor, searchMap);

		return dao.listByProperty(searchMap);
	}

	public static List<Key<Contact>> getAllContactKey()
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("type", Type.PERSON);
		return dao.listKeysByProperty(searchMap);
	}

	/**
	 * Gets a contact based on its email
	 * 
	 * @param email
	 *            email value to get a contact
	 * @return {@Contact} related to an email
	 */
	public static Contact searchContactByEmail(String email)
	{
		if (StringUtils.isBlank(email))
			return null;

		Map<String, Object> searchMap = new HashMap<String, Object>();

		Query<Contact> q = dao.ofy().query(Contact.class);
		q.filter("properties.name", Contact.EMAIL);
		q.filter("type", Type.PERSON);
		q.filter("properties.value", email.toLowerCase());

		return q.get();
	}

	public static Contact searchContactByCompanyName(String companyName)
	{
		if (StringUtils.isBlank(companyName))
			return null;

		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("properties.name", "name");
		searchMap.put("properties.value", companyName);
		searchMap.put("type", Type.COMPANY);
		return dao.getByProperty(searchMap);

	}

	public static Contact searchContactByPhoneNumber(String phoneNumber)
	{
		if (StringUtils.isBlank(phoneNumber))
			return null;
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("properties.name", Contact.PHONE);
		searchMap.put("properties.value", phoneNumber);

		return dao.getByProperty(searchMap);
	}

	public static boolean isExists(String email)
	{

		if (StringUtils.isBlank(email))
			return false;

		return searchContactCountByEmail(email) != 0 ? true : false;
	}

	/**
	 * Checks if contact have any duplicate email addresses. It iterates though
	 * all the email property fields if any of that email exists already. If
	 * contact is old, then it fetches old contact check whether duplicate email
	 * is newly added in to current contact
	 * 
	 * @param contact
	 * @return
	 */
	public static boolean isDuplicateContact(Contact contact)
	{
		// Hold old contact if contact is not new.
		Contact oldContact = null;

		// Iterates though all email fields
		for (ContactField emailField : contact.getContactPropertiesList(Contact.EMAIL))
		{
			// In case email field value is empty it removes property from
			// contact and continue

			if (StringUtils.isBlank(emailField.value) || !ContactUtil.isValidEmail(emailField.value))
			{
				System.out.println(contact.properties.contains(emailField));
				contact.properties.remove(emailField);
				continue;
			}

			// If email is not available, then it iterates though other emails
			if (!isExists(emailField.value.toLowerCase()))
				continue;

			// If count is not 0 and contact is new, then contact is contact is
			// duplicate and true is returned
			if (contact.id == null)
				return true;

			// If contact is not new, then it checks if email exists in current
			// contact sent.
			if (contact.isEmailExists(emailField.value))
			{
				if (oldContact == null)
					oldContact = ContactUtil.getContact(contact.id);

				// If email exists in old contact, then it is not considered
				// duplicate contact
				if (oldContact.isEmailExists(emailField.value))
					continue;
			}

			return true;
		}

		return false;
	}

	/**
	 * Get Count of Contacts by Email - should be used in most of the cases
	 * unless the real entity is required
	 * 
	 * @param email
	 *            email value to get contact count with this email
	 * @return number of contacts with the given email
	 */
	public static int searchContactCountByEmail(String email)
	{
		return dao.ofy().query(Contact.class).filter("properties.name = ", Contact.EMAIL)
				.filter("type", Contact.Type.PERSON).filter("properties.value = ", email).count();

	}

	/**
	 * Get Count of contact by Email and Type i.e PERSON or COMPANY
	 */

	public static int searchContactCountByEmailAndType(String email, Type type)
	{
		return dao.ofy().query(Contact.class).filter("properties.name = ", Contact.EMAIL)
				.filter("properties.value = ", email.toLowerCase()).filter("type", type).count();

	}

	/**
	 * Get Count of company by Name and Type i.e PERSON or COMPANY
	 */

	public static int searchCompanyCountByNameAndType(String companyName, Type type)
	{
		int count = dao.ofy().query(Contact.class).filter("type", type).filter("properties.value", companyName).count();
		System.out.println(count);
		return count;

	}

	/**
	 * Search company
	 */

	public static boolean isCompanyExist(String companyName)
	{

		boolean flag = false;
		/*
		 * Collection<Contact> c = createSearchRule(companyName);
		 * Iterator<Contact> contactIterator = c.iterator(); for (Contact
		 * contact : c) { ContactField field =
		 * contact.getContactFieldByName(Contact.NAME); if
		 * (field.value.equalsIgnoreCase(companyName)) { flag = true; break; } }
		 */

		try
		{
			int count = dao.ofy().query(Contact.class).filter("properties.name", "name").filter("type", Type.COMPANY)
					.filter("properties.value", companyName.trim().toLowerCase()).count();
			if (count == 0)
			{
				count = dao.ofy().query(Contact.class).filter("properties.name", "name").filter("type", Type.PERSON)
						.filter("properties.value", companyName.trim().toLowerCase()).count();
				if (count > 0)
				{
					flag = true;
				}
			}
			else
			{
				flag = true;
			}

		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		return flag;

	}

	/**
	 * Company Search rule.
	 * 
	 * Handle exception to avoid search exception if value has special
	 * characters in it
	 * 
	 * @param companyName
	 * @return
	 */
	private static Collection<Contact> createSearchRule(String companyName)
	{
		SearchRule rule = new SearchRule();
		rule.LHS = "type";
		rule.CONDITION = RuleCondition.EQUALS;
		rule.RHS = Contact.COMPANY;

		SearchRule rule1 = new SearchRule();
		rule1.LHS = "name";
		rule1.CONDITION = RuleCondition.EQUALS;
		rule1.RHS = companyName;

		List<SearchRule> rules = new ArrayList<SearchRule>();
		rules.add(rule);
		rules.add(rule1);

		try
		{
			@SuppressWarnings("unchecked")
			Collection<Contact> c = (Collection<Contact>) new AppengineSearch<Contact>(Contact.class)
					.getAdvacnedSearchResults(rules);
			return c;
		}
		catch (ClassCastException e)
		{
			e.printStackTrace();
			return new ArrayList<Contact>();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return new ArrayList<Contact>();
		}

	}

	/**
	 * search company by name
	 */
	public static Contact searchCompany(String companyName)
	{
		Contact oldContact = null;
		Collection<Contact> search = createSearchRule(companyName);
		for (Contact contact : search)
		{
			ContactField company = contact.getContactFieldByName(Contact.NAME);
			if (company.value.equalsIgnoreCase(companyName))
			{
				oldContact = contact;
				break;
			}
		}
		return oldContact;

	}

	/**
	 * Gets list of contacts based on array of ids
	 * 
	 * @param contactsJSONArray
	 *            JSONArray object of contact ids
	 * @return List of contacts
	 */
	public static List<Contact> getContactsBulk(JSONArray contactsJSONArray)
	{
		List<Key<Contact>> contactKeys = new ArrayList<Key<Contact>>();

		for (int i = 0; i < contactsJSONArray.length(); i++)
		{
			try
			{
				contactKeys.add(new Key<Contact>(Contact.class, Long.parseLong(contactsJSONArray.getString(i))));
			}
			catch (JSONException e)
			{
				e.printStackTrace();
			}
		}

		List<Contact> contacts_list = new ArrayList<Contact>();
		contacts_list.addAll(dao.ofy().get(contactKeys).values());
		return contacts_list;
	}

	public static List<Contact> getContactsBulk(List<Long> contactsArray)
	{
		List<Key<Contact>> contactKeys = new ArrayList<Key<Contact>>();

		for (Long id : contactsArray)
		{
			contactKeys.add(new Key<Contact>(Contact.class, id));
		}
		System.out.println(dao.fetchAllByKeys(contactKeys));

		return dao.fetchAllByKeys(contactKeys);
	}

	/**
	 * Adds each tag in tags_array to each contact in contacts bulk and saves
	 * each contact
	 * 
	 * @param contactsJSONArray
	 *            JSONArray object containing contact ids
	 * @param tags_array
	 *            array of tags
	 */
	public static void addTagsToContactsBulk(JSONArray contactsJSONArray, String[] tags_array)
	{
		List<Contact> contacts_list = ContactUtil.getContactsBulk(contactsJSONArray);

		if (contacts_list.size() == 0)
		{
			System.out.println("Null contact");
			return;
		}

		for (Contact contact : contacts_list)
		{

			contact.addTags(tags_array);
		}

		dao.putAll(contacts_list);
	}

	public static void addTagsToContactsBulk(List<Contact> contacts_list, String[] tags_array)
	{
		if (contacts_list.size() == 0)
		{
			System.out.println("Null contact");
			return;
		}

		for (Contact contact : contacts_list)
		{

			contact.addTags(tags_array);
		}

		dao.putAll(contacts_list);
	}

	public static void removeTagsToContactsBulk(List<Contact> contacts_list, String[] tags_array)
	{
		if (contacts_list.size() == 0)
		{
			System.out.println("Null contact");
			return;
		}

		for (Contact contact : contacts_list)
		{

			contact.removeTags(tags_array);
		}

		dao.putAll(contacts_list);
	}

	/**
	 * Returns contact firstname and lastname from contact-id.
	 * 
	 * @param contactId
	 *            - Contact Id.
	 * @return Contact Name.
	 */
	public static String getContactNameFromId(Long contactId)
	{
		Contact contact = getContact(contactId);

		if (contact == null)
			return "?";

		String contactName = contact.getContactFieldValue(Contact.FIRST_NAME) + " "
				+ contact.getContactFieldValue(Contact.LAST_NAME);

		return contactName;
	}

	public static Map<String, Object> getMapFromContact(Contact contact)
	{
		try
		{
			Map<String, Object> mp = new HashMap<String, Object>();
			mp = new ObjectMapper().readValue(new ObjectMapper().writeValueAsString(contact),
					new TypeReference<HashMap<String, Object>>()
					{
					});
			return mp;
		}
		catch (Exception e)
		{
			return new HashMap<String, Object>();
		}
	}

	public static List<Contact> getRecentContacts(String page_size)
	{
		return dao.ofy().query(Contact.class).filter("viewed.viewer_id", SessionManager.get().getDomainId())
				.order("-viewed.viewed_time").limit(Integer.parseInt(page_size)).list();
	}

	public static void deleteContactsbyList(List<Contact> contacts)
	{
		for (Contact contact : contacts)
			contact.delete();
	}

	public static void deleteContactsbyListSupressNotification(List<Contact> contacts)
	{
		for (Contact contact : contacts)
			contact.delete(false);
	}

	public static void deleteContacts(List<Contact> contacts)
	{
		Set<String> tags = new HashSet<String>();
		List<Long> contactIds = new ArrayList<Long>();
		List<Contact> contactsSubList = new ArrayList<Contact>();
		for (int i = 0; i < contacts.size(); i++)
		{
			Contact contact = contacts.get(i);
			contactIds.add(contact.id);
			tags.addAll(contact.tags);
			contactsSubList.add(contact);
			if (contactsSubList.size() >= 100 || i == contacts.size() - 1)
			{
				Contact.dao.deleteAll(contactsSubList);
				postDeleteOperation(contactIds, tags);

				contactsSubList.clear();
			}
		}
	}

	public static void postDeleteOperation(List<Long> ids, Set<String> tags)
	{
		String[] docIds = new String[ids.size()];
		for (int i = 0; i < ids.size(); i++)
		{
			Long id = ids.get(i);
			// Delete Notes
			NoteUtil.deleteAllNotes(id);

			// Delete Crons.
			CronUtil.removeTask(null, id.toString());

			// Deletes logs of contact.
			LogUtil.deleteSQLLogs(null, id.toString());

			// Deletes TwitterCron
			TwitterJobQueueUtil.removeTwitterJobs(null, id.toString(), NamespaceManager.get());

			docIds[i] = String.valueOf(id);
		}

		Index index = new AppengineSearch<Contact>(Contact.class).index;

		if (index != null)
			index.delete(docIds);

		// Delete Tags
		TagUtil.deleteTags(tags);
	}

	public static void postDeleteOperation(Long id, Set<String> tags)
	{
		new AppengineSearch<Contact>(Contact.class).delete(id.toString());

		// Delete Notes
		NoteUtil.deleteAllNotes(id);

		// Delete Tags
		TagUtil.deleteTags(tags);

		// Delete Crons.
		CronUtil.removeTask(null, id.toString());

		// Deletes logs of contact.
		LogUtil.deleteSQLLogs(null, id.toString());

		// Deletes TwitterCron
		TwitterJobQueueUtil.removeTwitterJobs(null, id.toString(), NamespaceManager.get());

	}

	/**
	 * Returns Key of a company by its name.
	 * 
	 * @param name
	 *            - Company Name , show match exactly.
	 * @return Key<Contact> - Corresponding DataStore key
	 */
	public static Key<Contact> getCompanyByName(String companyName)
	{
		Contact contact = searchCompany(companyName);
		if (contact != null)
		{

			return new Key(Contact.class, contact.id);
		}
		return null;

	}

	/**
	 * Checks if company with given name exists.
	 * 
	 * @param companyName
	 * @return
	 */
	public static boolean companyExists(String companyName)
	{

		Map<String, Object> searchFields = new HashMap<String, Object>();
		searchFields.put("properties.name", Contact.NAME);
		searchFields.put("properties.value", companyName);
		searchFields.put("type", Type.COMPANY);
		int countProps = dao.getCountByProperty(searchFields);
		System.out.println("contact count" + countProps);

		if (countProps != 0)
			return true;

		return false;
	}

	/**
	 * Creates owner key with the new owner id and changes owner key of the each
	 * contact in the bulk and saves the contact.
	 * 
	 * @param contactsJSONArray
	 *            JSONArray object containing contact ids
	 * @param new_owner
	 *            new owner (DomainUser) id
	 */
	public static void changeOwnerToContactsBulk(JSONArray contactsJSONArray, String new_owner)
	{
		List<Contact> contacts_list = getContactsBulk(contactsJSONArray);
		if (contacts_list.size() == 0)
		{
			return;
		}

		Key<DomainUser> newOwnerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(new_owner));

		// Enables to build "Document" search on current entity
		AppengineSearch<Contact> search = new AppengineSearch<Contact>(Contact.class);

		for (Contact contact : contacts_list)
		{
			contact.setContactOwner(newOwnerKey);
			Key<DomainUser> userKey = contact.getContactOwnerKey();

			if (!new_owner.equals(userKey))
				search.edit(contact);
		}

		Contact.dao.putAll(contacts_list);

	}

	public static void changeOwnerToContactsBulk(List<Contact> contacts_list, String new_owner)
	{
		if (contacts_list.size() == 0)
		{
			return;
		}

		Key<DomainUser> newOwnerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(new_owner));

		// Enables to build "Document" search on current entity
		AppengineSearch<Contact> search = new AppengineSearch<Contact>(Contact.class);

		ContactDocument contactDocuments = new ContactDocument();
		Builder[] docs = new Builder[contacts_list.size()];
		List<Builder> builderObjects = new ArrayList<Builder>();
		int i = 0;
		for (Contact contact : contacts_list)
		{
			contact.setContactOwner(newOwnerKey);
			Key<DomainUser> userKey = contact.getContactOwnerKey();

			if (!new_owner.equals(userKey))
			{
				builderObjects.add(contactDocuments.buildDocument(contact));
				// docs[i] = contactDocuments.buildDocument(contact);
				++i;
			}

			if (i >= 50)
			{
				search.index.put(builderObjects.toArray(new Builder[builderObjects.size() - 1]));
				builderObjects.clear();
				i = 0;
			}
		}

		if (builderObjects.size() >= 1)
			search.index.put(builderObjects.toArray(new Builder[builderObjects.size() - 1]));

		Contact.dao.putAll(contacts_list);
	}

	/**
	 * Merge new contact data to oldcontact. If fields are email, website, phone
	 * or url, new field is added if not duplicate value.
	 * 
	 * @param newContact
	 * @param oldContact
	 * @return
	 */
	public static Contact mergeContactFeilds(Contact newContact, Contact oldContact)
	{

		/**
		 * Iterates through new properties in new contacts
		 */
		for (ContactField field : newContact.properties)
		{
			// If field name of value is null, continues with remaining fields.
			if (field.name == null || field.value == null)
				continue;

			// If email, website, phone, url, if value is not duplicate then new
			// field is added.
			if (Contact.EMAIL.equals(field.name) || Contact.WEBSITE.equals(field.name)
					|| Contact.PHONE.equals(field.name) || Contact.URL.equals(field.name))
			{

				// Fetches all contact fields by property name
				List<ContactField> contactFields = oldContact.getContactPropertiesList(field.name);

				boolean newField = true;
				for (ContactField contactField : contactFields)
				{
					// If field value is equal to existing property, set
					// subtype, there could be change in subtype
					if (field.value.equalsIgnoreCase(contactField.value))
					{
						// Sets new subtype if there is any subtype availe
						if (field.subtype != null)
							contactField.subtype = field.subtype;

						// Sets it to false so property wont be added again.
						newField = false;
						continue;
					}
				}
				if (newField)
				{
					oldContact.properties.add(field);
				}
				continue;
			}

			// Read property by name
			ContactField existingField = oldContact.getContactField(field.name);

			if (existingField == null)
			{
				oldContact.properties.add(field);
				continue;
			}

			// If company is different then remove the exiting company from
			// contact
			if (existingField.name.equals(Contact.COMPANY))
			{
				if (!StringUtils.equalsIgnoreCase(existingField.value, field.value))
				{
					oldContact.contact_company_id = null;
					oldContact.contact_company_key = null;
				}
			}

			existingField.value = field.value;
			if (!StringUtils.isEmpty(field.subtype))
				existingField.subtype = field.subtype;
		}

		oldContact.tags.addAll(newContact.tags);

		return oldContact;
	}

	public static Contact mergeCompanyFields(Contact newContact, Contact oldContact)
	{

		/**
		 * Iterates through new properties in new contacts
		 */
		for (ContactField field : newContact.properties)
		{
			// If field name of value is null, continues with remaining fields.
			if (field.name == null || field.value == null)
				continue;

			// If email, website, phone, url, if value is not duplicate then new
			// field is added.
			if (Contact.EMAIL.equals(field.name) || Contact.WEBSITE.equals(field.name)
					|| Contact.PHONE.equals(field.name))
			{

				// Fetches all contact fields by property name
				List<ContactField> contactFields = oldContact.getContactPropertiesList(field.name);

				boolean newField = true;
				for (ContactField contactField : contactFields)
				{
					// If field value is equal to existing property, set
					// subtype, there could be change in subtype
					if (field.value.equalsIgnoreCase(contactField.value))
					{
						contactField.value = field.value;
						if (!StringUtils.isEmpty(field.subtype))
							contactField.subtype = field.subtype;

						// Sets it to false so property wont be added again.
						newField = false;
						continue;
					}
				}
				if (newField)
				{
					oldContact.properties.add(field);
				}
				continue;
			}

			// Read property by name
			ContactField existingField = oldContact.getContactField(field.name);

			if (existingField == null)
			{
				oldContact.properties.add(field);
				continue;
			}

			existingField.value = field.value;
			if (!StringUtils.isEmpty(field.subtype))
				existingField.subtype = field.subtype;
		}

		oldContact.tags.addAll(newContact.tags);

		return oldContact;
	}

	public static Contact mergeContactFields(Contact contact)
	{
		List<ContactField> emails = contact.getContactPropertiesList(Contact.EMAIL);

		if (emails.size() == 0)
			return contact;

		Contact oldContact = null;
		for (ContactField field : emails)
		{
			oldContact = searchContactByEmail(field.value);
			if (oldContact != null)
				break;
		}

		if (oldContact != null)
			return mergeContactFeilds(contact, oldContact);

		return oldContact;

	}

	public static Contact mergeCompanyFields(Contact contact)
	{

		Contact oldContact = null;
		ContactField field = contact.getContactFieldByName(Contact.NAME);
		if (field == null)
			field = contact.getContactFieldByName(Contact.COMPANY);

		oldContact = ContactUtil.searchCompany(field.value.toLowerCase());
		if (oldContact != null)
			return mergeCompanyFields(contact, oldContact);

		return oldContact;

	}

	public static boolean isValidFields(Contact contact)
	{
		if (StringUtils.isBlank(contact.getContactFieldValue(contact.FIRST_NAME))
				&& StringUtils.isBlank(contact.getContactFieldValue(contact.LAST_NAME)))
		{
			return false;
		}

		if (isDuplicateContact(contact))
			return false;

		if (StringUtils.isBlank(contact.getContactFieldValue(Contact.EMAIL)))
			return false;

		Iterator<ContactField> iterator = contact.properties.iterator();
		while (iterator.hasNext())
		{
			ContactField field = iterator.next();
			if (Contact.WEBSITE.equals(field.name) && !isValidURL(field.value))
				iterator.remove();
		}

		return true;
	}

	/**
	 * Validate hex with regular expression
	 * 
	 * @param hex
	 *            hex for validation
	 * @return true valid hex, false invalid hex
	 */
	public static boolean isValidEmail(final String hex)
	{

		String EMAIL_PATTERN = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
				+ "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

		Pattern pattern = Pattern.compile(EMAIL_PATTERN);

		Matcher matcher = pattern.matcher(hex);
		return matcher.matches();

	}

	/**
	 * Validates url
	 * 
	 * @param hex
	 * @return
	 */
	public static boolean isValidURL(final String hex)
	{
		String URL_PATTERN = "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";
		Pattern pattern = Pattern.compile(URL_PATTERN);

		Matcher matcher = pattern.matcher(hex);
		return matcher.matches();

	}

	/**
	 * Returns contact owner id.
	 * 
	 * @param contactId
	 *            - Contact id
	 * @return Long
	 */
	public static Long getContactOwnerId(Long contactId)
	{
		Contact contact = getContact(contactId);

		if (contact == null)
			return null;

		DomainUser contactOwner = contact.getOwner();

		// if contactOwner is null, return
		if (contactOwner == null)
			return null;

		return contactOwner.id;
	}

	/**
	 * Returns contacts count based on bounce type
	 * 
	 * @param emailBounceType
	 *            - Hard or Soft
	 * @param startTime
	 *            - start time
	 * @param endTime
	 *            - end time
	 * @return int value
	 */
	public static int getEmailBouncedContactsCount(String campaignId, EmailBounceType emailBounceType, Long startTime,
			Long endTime)
	{
		HashMap<String, Object> properties = new HashMap<String, Object>();
		properties.put("emailBounceStatus.campaign_id", campaignId);
		properties.put("emailBounceStatus.emailBounceType", emailBounceType);
		properties.put("emailBounceStatus.time >=", startTime);
		properties.put("emailBounceStatus.time <", endTime);

		return dao.getCountByProperty(properties);
	}

	/**
	 * Checks whether the given contact updated after the given time.
	 * 
	 * @param contactId
	 *            the id of contact to check.
	 * @param updatedTime
	 *            previously updated time.
	 * @return true if the contact is updated after the given time or else
	 *         false.
	 */
	public static boolean isContactUpdated(Long contactId, Long updatedTime)
	{
		Query<Contact> query = dao.ofy().query(Contact.class);

		query.filter("id = ", contactId);
		query.filter("updated_time > ", updatedTime);

		int count = query.count();
		System.out.println("Is updated count - " + count);
		return count > 0 ? true : false;
	}

	/**
	 * Removes contacts those if user dont have update privileges
	 * 
	 * @param contacts
	 */
	public static void processContacts(List<Contact> contacts)
	{

		if (contacts.size() > 0)
			return;

		UserAccessControl control = UserAccessControl.getAccessControl(
				UserAccessControl.AccessControlClasses.Contact.toString(), null);

		if (control.hasScope(UserAccessScopes.DELETE_CONTACTS) || control.hasScope(UserAccessScopes.UPDATE_CONTACT))
			return;

		Iterator<Contact> i = contacts.iterator();
		while (i.hasNext())
		{
			Contact c = i.next();
			control.setObject(c);
			if (control.canDelete())
				continue;

			i.remove();
		}
	}

	public static List<String> workflowListOfAContact(Long id)
	{

		List<String> activeWorkflows = null;
		try
		{
			List<CampaignStatus> campaignStatusList = dao.get(id).campaignStatus;
			Iterator<CampaignStatus> statusIterator = campaignStatusList.iterator();
			activeWorkflows = new ArrayList<String>();
			while (statusIterator.hasNext())
			{
				CampaignStatus campaignStatus = statusIterator.next();
				try
				{
					if (campaignStatus.status.contains("ACTIVE"))
						activeWorkflows.add(campaignStatus.campaign_id);
				}
				catch (EnumConstantNotPresentException e)
				{
					System.err.println("Inside workflowListOfAContact");
					e.printStackTrace();
				}

			}

		}
		catch (EntityNotFoundException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("the active workflows are " + activeWorkflows.toString());
		return activeWorkflows;

	}

}