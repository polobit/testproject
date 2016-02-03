package com.agilecrm.db;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.persistence.Embedded;
import javax.persistence.Transient;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.ContactSchemaUpdateStats;
import com.agilecrm.account.APIKey;
import com.agilecrm.account.AccountEmailStats;
import com.agilecrm.account.AccountPrefs;
import com.agilecrm.account.EmailTemplates;
import com.agilecrm.account.MenuSetting;
import com.agilecrm.account.VerifiedEmails;
import com.agilecrm.activities.Activity;
import com.agilecrm.activities.BulkActionLog;
import com.agilecrm.activities.Category;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.WebCalendarEvent;
import com.agilecrm.cases.Case;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.customview.CustomView;
import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.deals.Goals;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.filter.DealFilter;
import com.agilecrm.document.Document;
import com.agilecrm.facebookpage.FacebookPage;
import com.agilecrm.forms.Form;
import com.agilecrm.landingpages.LandingPage;
import com.agilecrm.landingpages.LandingPageCNames;
import com.agilecrm.portlets.Portlet;
import com.agilecrm.reports.ActivityReports;
import com.agilecrm.reports.Reports;
import com.agilecrm.shopify.ShopifyApp;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.ticket.entitys.TicketCannedMessages;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketFilters;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.ContactViewPrefs;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.OfficeEmailPrefs;
import com.agilecrm.user.OnlineCalendarPrefs;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.access.util.UserAccessControlUtil.CRUDOperation;
import com.agilecrm.user.notification.NotificationPrefs;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.voicemail.VoiceMail;
import com.agilecrm.webrules.WebRule;
import com.agilecrm.widgets.CustomWidget;
import com.agilecrm.widgets.Widget;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.templates.WorkflowTemplate;
import com.agilecrm.workflows.triggers.Trigger;
import com.campaignio.cron.Cron;
import com.campaignio.logger.Log;
import com.campaignio.twitter.TwitterJobQueue;
import com.campaignio.urlshortener.URLShortener;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.QueryResultIterator;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Query;
import com.googlecode.objectify.util.DAOBase;
import com.socialsuite.Stream;
import com.socialsuite.cron.ScheduledUpdate;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.calendar.GoogleCalenderPrefs;
import com.thirdparty.office365.calendar.Office365CalendarPrefs;

import edu.emory.mathcs.backport.java.util.Arrays;

/**
 * <code>ObjectifyGenericDao</code> is a generic class for all the entities,
 * which provides the facility to interact with the database (appengine) using
 * Objectify.
 * <p>
 * This class extends <code>DAOBase</code> to access services of Objectify
 * </p>
 * <p>
 * The classes which are registered with ObjectifyService using this class are
 * able to query on database.
 * </p>
 * 
 * @author
 * 
 * @param <T>
 *            class name to get objectify services
 */
public class ObjectifyGenericDao<T> extends DAOBase
{

	static final String[] countRestrictedClassNames = new String[]{"contact", "activity"};
	
    static final int BAD_MODIFIERS = Modifier.FINAL | Modifier.STATIC | Modifier.TRANSIENT;

    // Registers the classes with ObjectifyService
    static
    {
	ObjectifyService.register(Contact.class);
	ObjectifyService.register(CustomFieldDef.class);
	ObjectifyService.register(CustomView.class);
	ObjectifyService.register(ContactFilter.class);
	ObjectifyService.register(WebRule.class);

	ObjectifyService.register(Note.class);
	ObjectifyService.register(UserPrefs.class);
	ObjectifyService.register(ContactViewPrefs.class);
	ObjectifyService.register(AgileUser.class);
	ObjectifyService.register(DomainUser.class);
	ObjectifyService.register(Tag.class);
	ObjectifyService.register(SocialPrefs.class);
	ObjectifyService.register(AccountPrefs.class);
	ObjectifyService.register(NotificationPrefs.class);
	ObjectifyService.register(ContactEmail.class);

	ObjectifyService.register(Task.class);
	ObjectifyService.register(Event.class);
	ObjectifyService.register(Workflow.class);
	ObjectifyService.register(WorkflowTemplate.class);
	ObjectifyService.register(IMAPEmailPrefs.class);
	ObjectifyService.register(OfficeEmailPrefs.class);
	ObjectifyService.register(EmailTemplates.class);
	ObjectifyService.register(APIKey.class);
	ObjectifyService.register(Opportunity.class);
	ObjectifyService.register(Milestone.class);

	ObjectifyService.register(WebCalendarEvent.class);

	// Campaign
	ObjectifyService.register(Cron.class);
	ObjectifyService.register(TwitterJobQueue.class);
	ObjectifyService.register(Log.class);
	ObjectifyService.register(URLShortener.class);
	ObjectifyService.register(Trigger.class);

	// widgets
	ObjectifyService.register(Widget.class);
	ObjectifyService.register(CustomWidget.class);
	ObjectifyService.register(ShopifyApp.class);

	// Stripe
	ObjectifyService.register(Subscription.class);

	// Reports
	ObjectifyService.register(Reports.class);
	ObjectifyService.register(ActivityReports.class);

	ObjectifyService.register(Case.class);
	ObjectifyService.register(MenuSetting.class);

	// Contacts import
	ObjectifyService.register(ContactPrefs.class);

	// Social suite's Stream
	ObjectifyService.register(Stream.class);

	// Social suite's ScheduledUpdate
	ObjectifyService.register(ScheduledUpdate.class);

	// Upload Document
	ObjectifyService.register(Document.class);

	// Calendar prefs
	ObjectifyService.register(GoogleCalenderPrefs.class);

	// Account Email Stats
	ObjectifyService.register(AccountEmailStats.class);

	ObjectifyService.register(BillingRestriction.class);

	// For all Activities
	ObjectifyService.register(Activity.class);

	// Voice Mail
	ObjectifyService.register(VoiceMail.class);

	// For all Activities
	ObjectifyService.register(Portlet.class);

	ObjectifyService.register(Form.class);

	ObjectifyService.register(BulkActionLog.class);

	ObjectifyService.register(ContactSchemaUpdateStats.class);

	ObjectifyService.register(Category.class);

	ObjectifyService.register(OnlineCalendarPrefs.class);

	// For facebook page intergration
	ObjectifyService.register(FacebookPage.class);

	ObjectifyService.register(VerifiedEmails.class);
	
	ObjectifyService.register(Office365CalendarPrefs.class);
	
	//Ticket related entitys
	ObjectifyService.register(Tickets.class);
	ObjectifyService.register(TicketNotes.class);
	ObjectifyService.register(TicketGroups.class);
	ObjectifyService.register(TicketCannedMessages.class);
	ObjectifyService.register(TicketFilters.class);
	ObjectifyService.register(TicketDocuments.class);
	//ObjectifyService.register(TicketActivity.class);
	ObjectifyService.register(TicketLabels.class);
	
	
	ObjectifyService.register(DealFilter.class);

    ObjectifyService.register(LandingPage.class);
    ObjectifyService.register(LandingPageCNames.class);
	ObjectifyService.register(Goals.class);

    }

    /**
     * Stores class name with ".class" extension
     */
    protected Class<T> clazz;

    /**
     * We've got to get the associated domain class somehow
     * 
     * @param clazz
     */
    public ObjectifyGenericDao(Class<T> clazz)
    {
	this.clazz = clazz;
    }

    public Class<T> getClazz()
    {
	return clazz;
    }

    /**
     * Stores an entity in database
     * 
     * @param entity
     * @return Key of the saved entity
     */
    public Key<T> put(T entity)
    {
	// Checks if entities are exceeding current plan limits
	DaoBillingRestriction daoRestriction = DaoBillingRestriction.getInstace(clazz.getSimpleName(), entity);
	if (daoRestriction != null && !daoRestriction.check())
	    BillingRestrictionUtil.throwLimitExceededException(clazz.getSimpleName());

	// Checks User access control over current entity to be saved.
	UserAccessControlUtil.check(clazz.getSimpleName(), entity, CRUDOperation.CREATE, true);

	return ofy().put(entity);
    }

    /**
     * Stores multiple entities of same type
     * 
     * @param entities
     * @return map of keys of saved entites
     */
    public Map<Key<T>, T> putAll(Iterable<T> entities)
    {
	return ofy().put(entities);
    }

    /**
     * Deletes an entity from database
     * 
     * @param entity
     */
    public void delete(T entity)
    {
	if (canDelete(entity))
	    ofy().delete(entity);
    }

    /**
     * Deletes an entity from database Asynchronously
     * 
     * @param entity
     */
    public void deleteAsync(T entity)
    {
	ofy().async().delete(entity);
    }

    /**
     * Deletes an entity based on its Key
     * 
     * @param entityKey
     */
    public void deleteKey(Key<T> entityKey)
    {
	ofy().delete(entityKey);
    }

    /**
     * Deletes all the given entities of a type
     * 
     * @param entities
     */
    public void deleteAll(Iterable<T> entities)
    {
	ofy().delete(entities);
    }

    /**
     * Deletes the entities of a type based on their Keys
     * 
     * @param keys
     */
    public void deleteKeys(Iterable<Key<T>> keys)
    {
	ofy().delete(keys);
    }

    /**
     * Deletes keys by Ids
     * 
     * @param ids
     */
    public void deleteBulkByIds(JSONArray ids)
    {
	List<Key<T>> keys = new ArrayList<Key<T>>();

	// Add keys
	for (int i = 0; i < ids.length(); i++)
	{
	    try
	    {
		String keyString = ids.getString(i);
		Long key = Long.parseLong(keyString);

		// Adds to keys list
		keys.add(new Key<T>(clazz, key));
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}

	// Deletes all
	deleteKeys(keys);
    }

    /**
     * Fetches an entity based on its id
     * 
     * @param id
     * @return an entity of specified type (T)
     * @throws EntityNotFoundException
     */
    public T get(Long id) throws EntityNotFoundException
    {
	Key<T> key = new Key<T>(this.clazz, id);
	return get(key);
    }

    /**
     * Fetches an entity based on its Key
     * 
     * @param key
     * @return
     * @throws EntityNotFoundException
     */
    public T get(Key<T> key) throws EntityNotFoundException
    {
	return ofy().get(key);
    }

    /**
     * Convenience method to get an object matching a single property
     * 
     * @param propName
     * @param propValue
     * @return T matching Object
     */
    public T getByProperty(String propName, Object propValue)
    {
	Query<T> q = ofy().query(clazz);
	q.filter(propName, propValue);

	return fetch(q);
    }

    /**
     * Convenience method to get an object matching to multiple properties
     * 
     * @param map
     * @return T matching object
     */
    public T getByProperty(Map<String, Object> map)
    {
	Query<T> q = ofy().query(clazz);
	for (String propName : map.keySet())
	{
	    q.filter(propName, map.get(propName));
	}

	return fetch(q);
    }

    /**
     * Convenience method to get number of entities based on a property
     * 
     * @param map
     * @return T matching object
     */
    public int getCountByProperty(String propName, Object propValue)
    {
	Query<T> q = ofy().query(clazz);
	q.filter(propName, propValue);

	return getCount(q);
    }

    /**
     * Convenience method to get number of entities based on properties map
     * 
     * @param map
     * @return T matching object
     */
    public int getCountByProperty(Map<String, Object> map)
    {
	Query<T> q = ofy().query(clazz);
	for (String propName : map.keySet())
	{
	    q.filter(propName, map.get(propName));
	}

	return getCount(q);
    }

    /**
     * Convenience method to get all objects matching a single property
     * 
     * @param propName
     * @param propValue
     * @return list of T matching objects
     */
    public List<T> listByProperty(String propName, Object propValue)
    {
	Query<T> q = ofy().query(clazz);
	q.filter(propName, propValue);

	return fetchAll(q);
    }

    /**
     * Convenience method to get all objects matching to multiple properties
     * 
     * @param map
     * @return list of T matching objects
     */
    public List<T> listByProperty(Map<String, Object> map)
    {
	Query<T> q = ofy().query(clazz);
	for (String propName : map.keySet())
	{
	    q.filter(propName, map.get(propName));
	}

	return fetchAll(q);
    }

    public List<T> listByPropertyAndOrder(Map<String, Object> map, String orderBy)
    {
	Query<T> q = ofy().query(clazz);
	for (String propName : map.keySet())
	{
	    q.filter(propName, map.get(propName));
	}
	if (!StringUtils.isEmpty(orderBy))
	    q.order(orderBy);

	return fetchAll(q);
    }

    /**
     * Fetches all the entities of type T
     * 
     * @return list of all T objects
     */
    public List<T> fetchAll()
    {
	Query<T> q = ofy().query(clazz);

	return fetchAll(q);
    }

    /**
     * Fetches all the entities of type T
     * 
     * @return list of all T objects
     */
    public List<T> fetchAllByOrder(String orderBy)
    {
	Query<T> q = ofy().query(clazz);
	if (!StringUtils.isEmpty(orderBy))
	    q.order(orderBy);
	return fetchAll(q);
    }

    /**
     * Fetches all the entities of type T
     * 
     * @return list of all T objects
     */
    public List<T> fetchAllByOrder(String orderBy, Map<String, Object> map)
    {
	Query<T> query = ofy().query(clazz);
	if (map != null)
	    for (String propName : map.keySet())
	    {
		System.out.println(propName);
		query.filter(propName, map.get(propName));
	    }

	if (!StringUtils.isEmpty(orderBy))
	    query.order(orderBy);

	return fetchAll(query);
    }

    /**
     * Fetches entities based on keysList
     * 
     * @param keysList
     * @return List of T entities
     */
    public List<T> fetchAllByKeys(List<Key<T>> keysList)
    {
	return asList(ofy().get(keysList).values());
    }

    /**
     * Gets count of entities of a particular type T
     * 
     * @return number of entities
     */
    public int count()
    {
	Query<T> q = ofy().query(clazz);

	return getCount(q);
    }

    /**
     * Fetches the entities by activating the infiniScroll
     * 
     * @param max
     * @param cursor
     * @return list of entities
     */
    public List<T> fetchAll(int max, String cursor)
    {
	return fetchAll(max, cursor, null);
    }

    public List<T> fetchAll(int max, String cursor, Map<String, Object> map, boolean forceLoad)
    {
	if (!forceLoad)
	    return fetchAll(max, cursor, map);

	CacheUtil.deleteCache(this.clazz.getSimpleName() + "_" + NamespaceManager.get() + "_count");
	return fetchAll(max, cursor, map);
    }

    /**
     * Fetches "max" no.of entities (if total entities count is more than "max")
     * and returns by appending the cursor value to the last entity to activates
     * infiniScroll (i.e if the cursor is scrolled down (from client side)
     * fetches the next "max" no.of entities and so on).
     * 
     * @param max
     *            no.of entities to fetch at a time
     * @param cursor
     *            value indicates the starting entity of the next list of
     *            entities
     * @param map
     *            to filter the entities based on a property
     * @return list of entities
     */
    public List<T> fetchAll(int max, String cursor, Map<String, Object> map)
    {
	System.out.println(":::::::::::::::::::::::::::::::::::::::::");
	return fetchAll(max, cursor, map, false, true);
    }

    public List<T> fetchAll(int max, String cursor, Map<String, Object> map, boolean forceLoad, boolean cache)
    {
	Query<T> query = ofy().query(clazz);
	if (map != null)
	    for (String propName : map.keySet())
	    {
		query.filter(propName, map.get(propName));
	    }

	return fetchAllWithCursor(max, cursor, query, forceLoad, cache);
    }

    public List<T> fetchAllByOrder(int max, String cursor, Map<String, Object> map, boolean forceLoad, boolean cache,
	    String orderBy)
    {
	Query<T> query = ofy().query(clazz);
	if (map != null)
	    for (String propName : map.keySet())
	    {
		System.out.println(propName);
		query.filter(propName, map.get(propName));
	    }

	if (!StringUtils.isEmpty(orderBy))
	    query.order(orderBy);

	return fetchAllWithCursor(max, cursor, query, forceLoad, cache);
    }

    public List<T> fetchAllWithCursor(int max, String cursor, Query<T> query, boolean forceLoad, boolean cache)
    {
	// Checks if read access is allowed to current user. If read access is
	// not provided then query is modified such that user can access only
	// entities he had created
	System.out.println("check read query");
	UserAccessControlUtil.checkReadAccessAndModifyQuery(clazz.getSimpleName(), query);

	if (cursor != null)
	    query.startCursor(Cursor.fromWebSafeString(cursor));

	int index = 0;
	String newCursor = null;
	List<T> results = new ArrayList<T>();

	QueryResultIterator<T> iterator = query.iterator();
	while (iterator.hasNext())
	{
	    T result = iterator.next();

	    // Add to list
	    results.add(result);

	    // Send totalCount if first time
	    if (cursor == null && index == 0)
	    {
		// First time query - let's get the count
		if (result instanceof com.agilecrm.cursor.Cursor)
		{

			String className = this.clazz.getSimpleName().toLowerCase();
			
		    com.agilecrm.cursor.Cursor agileCursor = (com.agilecrm.cursor.Cursor) result;
		    Object object = forceLoad ? null : CacheUtil.getCache(this.clazz.getSimpleName() + "_"
			    + NamespaceManager.get() + "_count");

		    
		    if (object != null){
		    	if(!Arrays.asList(countRestrictedClassNames).contains(className))
		    		agileCursor.count = (Integer) object;	
		    }
			
		    else
		    {
			long startTime = System.currentTimeMillis();
			if(!Arrays.asList(countRestrictedClassNames).contains(className))
					agileCursor.count = query.count();
			
			long endTime = System.currentTimeMillis();
			if ((endTime - startTime) > 15 * 1000 && cache)
			    CacheUtil.setCache(this.clazz.getSimpleName() + "_" + NamespaceManager.get() + "_count",
				    agileCursor.count, 1 * 60 * 60 * 1000);
		    }

		}
	    }

	    // Check if we have reached the limit
	    if (++index == max)
	    {
		// Sets cursor for client
		if (iterator.hasNext())
		{
		    Cursor cursorDb = iterator.getCursor();
		    newCursor = cursorDb.toWebSafeString();

		    // Store the cursor in the last element
		    if (result instanceof com.agilecrm.cursor.Cursor)
		    {
			com.agilecrm.cursor.Cursor agileCursor = (com.agilecrm.cursor.Cursor) result;
			agileCursor.cursor = newCursor;
		    }
		}
		break;
	    }
	}
	return results;
    }

    /**
     * Convenience method to get list of keys matching a single property
     * 
     * @param propName
     * @param propValue
     * @return list of keys of type T
     */
    public List<Key<T>> listKeysByProperty(String propName, Object propValue)
    {
	Query<T> q = ofy().query(clazz);
	q.filter(propName, propValue);

	return fetchAllKeys(q);
    }

    public List<Key<T>> listAllKeys()
    {
	Query<T> q = ofy().query(clazz);

	return fetchAllKeys(q);
    }

    /**
     * Convenience method to get list of keys matching to multiple properties
     * 
     * @param map
     * @return list of keys of type T
     */
    public List<Key<T>> listKeysByProperty(Map<String, Object> map)
    {
	Query<T> q = ofy().query(clazz);
	for (String propName : map.keySet())
	{
	    q.filter(propName, map.get(propName));
	}

	return fetchAllKeys(q);
    }

    /**
     * List keys by property with order specified
     * 
     * @param map
     * @return
     */
    public List<Key<T>> listKeyByProperty(Map<String, Object> map, String orderBy, Integer limit)
    {
	Query<T> q = ofy().query(clazz);
	for (String propName : map.keySet())
	{
	    q.filter(propName, map.get(propName));
	}
	if (limit != null)
	    q.limit(limit);
	q.order(orderBy);

	return fetchAllKeys(q);
    }

    /**
     * Gets an entity matched to given example object, if more than one matched
     * are exists throws an exception.
     * 
     * @param exampleObj
     * @return T matching object
     */
    public T getByExample(T exampleObj)
    {
	Query<T> queryByExample = buildQueryByExample(exampleObj);
	Iterable<T> iterableResults = queryByExample.fetch();
	Iterator<T> i = iterableResults.iterator();
	T obj = i.next();
	if (i.hasNext())
	    throw new RuntimeException("Too many results");
	return obj;
    }

    /**
     * Gets list of all matched entities to the give example object
     * 
     * @param exampleObj
     * @return list of T matching entities
     */
    public List<T> listByExample(T exampleObj)
    {
	Query<T> queryByExample = buildQueryByExample(exampleObj);

	return fetchAll(queryByExample);
    }

    /**
     * Makes the given entities as a list
     * 
     * @param iterable
     * @return list of entities
     */
    private List<T> asList(Iterable<T> iterable)
    {
	ArrayList<T> list = new ArrayList<T>();
	for (T t : iterable)
	{
	    list.add(t);
	}
	return list;
    }

    /**
     * Makes the given keys as a list
     * 
     * @param iterableKeys
     * @return list of keys
     */
    private List<Key<T>> asKeyList(Iterable<Key<T>> iterableKeys)
    {
	ArrayList<Key<T>> keys = new ArrayList<Key<T>>();
	for (Key<T> key : iterableKeys)
	{
	    keys.add(key);
	}
	return keys;
    }

    /**
     * Builds a query based on given example object
     * 
     * @param exampleObj
     * @return Query object
     */
    private Query<T> buildQueryByExample(T exampleObj)
    {
	Query<T> q = ofy().query(clazz);

	// Add all non-null properties to query filter
	for (Field field : clazz.getDeclaredFields())
	{
	    // Ignore transient, embedded, array, and collection properties
	    if (field.isAnnotationPresent(Transient.class) || (field.isAnnotationPresent(Embedded.class))
		    || (field.getType().isArray()) || (Collection.class.isAssignableFrom(field.getType()))
		    || ((field.getModifiers() & BAD_MODIFIERS) != 0))
		continue;

	    field.setAccessible(true);

	    Object value;
	    try
	    {
		value = field.get(exampleObj);
	    }
	    catch (IllegalArgumentException e)
	    {
		throw new RuntimeException(e);
	    }
	    catch (IllegalAccessException e)
	    {
		throw new RuntimeException(e);
	    }
	    if (value != null)
	    {
		q.filter(field.getName(), value);
	    }
	}

	return q;
    }

    public T fetch(Query<T> q)
    {
	// Checks if read access is allowed to current user. If read access is
	// not provided then query is modified such that user can access only
	// entities he had created
	UserAccessControlUtil.checkReadAccessAndModifyQuery(clazz.getSimpleName(), q);

	return q.get();
    }

    public List<T> fetchAll(Query<T> q)
    {
	// Checks if read access is allowed to current user. If read access is
	// not provided then query is modified such that user can access only
	// entities he had created
	UserAccessControlUtil.checkReadAccessAndModifyQuery(clazz.getSimpleName(), q);

	return asList(q.fetch());
    }

    public List<Key<T>> fetchAllKeys(Query<T> q)
    {
	// Checks if read access is allowed to current user. If read access is
	// not provided then query is modified such that user can access only
	// entities he had created
	UserAccessControlUtil.checkReadAccessAndModifyQuery(clazz.getSimpleName(), q);

	return asKeyList(q.fetchKeys());
    }

    public int getCount(Query<T> q)
    {
	// Checks if read access is allowed to current user. If read access is
	// not provided then query is modified such that user can access only
	// entities he had created
	UserAccessControlUtil.checkReadAccessAndModifyQuery(clazz.getSimpleName(), q);

	return q.count();
    }

    public boolean canDelete(T entity)
    {
	return UserAccessControlUtil.check(clazz.getSimpleName(), entity, CRUDOperation.DELETE, false);
    }

    public List<T> fetchAllByOrderWithoutCount(int max, String cursor, Map<String, Object> map, boolean forceLoad,
	    boolean cache, String orderBy)
    {
	Query<T> query = ofy().query(clazz);
	if (map != null)
	    for (String propName : map.keySet())
	    {
		System.out.println(propName);
		query.filter(propName, map.get(propName));
	    }

	if (!StringUtils.isEmpty(orderBy))
	    query.order(orderBy);

	return fetchAllWithCursorWithoutCount(max, cursor, query, forceLoad, cache);
    }

    public List<T> fetchAllWithCursorWithoutCount(int max, String cursor, Query<T> query, boolean forceLoad,
	    boolean cache)
    {
	// Checks if read access is allowed to current user. If read access is
	// not provided then query is modified such that user can access only
	// entities he had created
	System.out.println("check read query");
	UserAccessControlUtil.checkReadAccessAndModifyQuery(clazz.getSimpleName(), query);

	if (cursor != null)
	    query.startCursor(Cursor.fromWebSafeString(cursor));

	int index = 0;
	String newCursor = null;
	List<T> results = new ArrayList<T>();

	QueryResultIterator<T> iterator = query.iterator();
	while (iterator.hasNext())
	{
	    T result = iterator.next();

	    // Add to list
	    results.add(result);

	    // Check if we have reached the limit
	    if (++index == max)
	    {
		// Sets cursor for client
		if (iterator.hasNext())
		{
		    Cursor cursorDb = iterator.getCursor();
		    newCursor = cursorDb.toWebSafeString();

		    // Store the cursor in the last element
		    if (result instanceof com.agilecrm.cursor.Cursor)
		    {
			com.agilecrm.cursor.Cursor agileCursor = (com.agilecrm.cursor.Cursor) result;
			agileCursor.cursor = newCursor;
		    }
		}
		break;
	    }
	}
	return results;
    }

}