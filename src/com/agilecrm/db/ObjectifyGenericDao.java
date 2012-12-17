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

import org.json.JSONArray;

import com.agilecrm.account.APIKey;
import com.agilecrm.account.AccountPrefs;
import com.agilecrm.account.EmailTemplates;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.company.Company;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactFilter;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.customview.CustomView;
import com.agilecrm.core.DomainUser;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.reports.Reports;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.NotificationPrefs;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.widgets.Widget;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.triggers.Trigger;
import com.campaignio.URLShortener;
import com.campaignio.cron.Cron;
import com.campaignio.logger.Log;
import com.campaignio.twitter.TwitterQueue;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.QueryResultIterator;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Query;
import com.googlecode.objectify.util.DAOBase;

public class ObjectifyGenericDao<T> extends DAOBase
{

    static final int BAD_MODIFIERS = Modifier.FINAL | Modifier.STATIC
	    | Modifier.TRANSIENT;

    static
    {
	ObjectifyService.register(Contact.class);
	ObjectifyService.register(CustomFieldDef.class);
	ObjectifyService.register(CustomView.class);
	ObjectifyService.register(ContactFilter.class);

	ObjectifyService.register(Company.class);

	ObjectifyService.register(Note.class);
	ObjectifyService.register(UserPrefs.class);
	ObjectifyService.register(AgileUser.class);
	ObjectifyService.register(DomainUser.class);
	ObjectifyService.register(Tag.class);
	ObjectifyService.register(SocialPrefs.class);
	ObjectifyService.register(AccountPrefs.class);
	ObjectifyService.register(NotificationPrefs.class);

	ObjectifyService.register(Task.class);
	ObjectifyService.register(Event.class);
	ObjectifyService.register(Workflow.class);
	ObjectifyService.register(IMAPEmailPrefs.class);
	ObjectifyService.register(EmailTemplates.class);
	ObjectifyService.register(APIKey.class);
	ObjectifyService.register(Opportunity.class);
	ObjectifyService.register(Milestone.class);

	// Campaign
	ObjectifyService.register(Cron.class);
	ObjectifyService.register(TwitterQueue.class);
	ObjectifyService.register(Log.class);
	ObjectifyService.register(URLShortener.class);
	ObjectifyService.register(Trigger.class);

	ObjectifyService.register(Widget.class);

	// Stripe
	ObjectifyService.register(Subscription.class);

	// Reports
	ObjectifyService.register(Reports.class);
    }

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

    public Key<T> put(T entity)

    {
	return ofy().put(entity);
    }

    public Map<Key<T>, T> putAll(Iterable<T> entities)
    {
	return ofy().put(entities);
    }

    public void delete(T entity)
    {
	ofy().delete(entity);
    }

    public void deleteKey(Key<T> entityKey)
    {
	ofy().delete(entityKey);
    }

    public void deleteAll(Iterable<T> entities)
    {
	ofy().delete(entities);
    }

    public void deleteKeys(Iterable<Key<T>> keys)
    {
	ofy().delete(keys);
    }

    // MC - Delete keys by Ids
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

		// Add to keys list
		keys.add(new Key<T>(clazz, key));
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}

	// Delete all
	deleteKeys(keys);
    }

    public T get(Long id) throws EntityNotFoundException
    {
	return ofy().get(this.clazz, id);
    }

    public T get(Key<T> key) throws EntityNotFoundException
    {
	return ofy().get(key);
    }

    /**
     * Convenience method to get all objects matching a single property
     * 
     * @param propName
     * @param propValue
     * @return T matching Object
     */
    public T getByProperty(String propName, Object propValue)
    {
	Query<T> q = ofy().query(clazz);
	q.filter(propName, propValue);
	return q.get();
    }

    public T getByProperty(Map<String, Object> map)
    {
	Query<T> q = ofy().query(clazz);
	for (String propName : map.keySet())
	{
	    q.filter(propName, map.get(propName));
	}
	return q.get();
    }

    public List<T> listByProperty(String propName, Object propValue)
    {
	Query<T> q = ofy().query(clazz);
	q.filter(propName, propValue);
	return asList(q.fetch());
    }

    public List<T> listByProperty(Map<String, Object> map)
    {
	Query<T> q = ofy().query(clazz);
	for (String propName : map.keySet())
	{
	    q.filter(propName, map.get(propName));
	}

	return asList(q.fetch());
    }

    public List<T> fetchAll()
    {

	Query<T> q = ofy().query(clazz);
	return asList(q.fetch());
    }

    public List<T> fetchAllByKeys(List<Key<T>> keysList)
    {

	return asList(ofy().get(keysList).values());
    }

    public int count()
    {

	Query<T> q = ofy().query(clazz);
	return q.count();
    }

    public List<T> fetchAll(int max, String cursor)
    {
	return fetchAll(max, cursor, null);
    }

    public List<T> fetchAll(int max, String cursor, Map<String, Object> map)
    {
	Query<T> query = ofy().query(clazz);
	if (map != null)
	    for (String propName : map.keySet())
	    {
		query.filter(propName, map.get(propName));
	    }

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
		    com.agilecrm.cursor.Cursor agileCursor = (com.agilecrm.cursor.Cursor) result;
		    agileCursor.count = query.count();
		}

	    }

	    // Check if we have reached the limit
	    if (++index == max)
	    {
		// Set cursor for client
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

    public List<Key<T>> listKeysByProperty(String propName, Object propValue)
    {
	Query<T> q = ofy().query(clazz);
	q.filter(propName, propValue);
	return asKeyList(q.fetchKeys());
    }

    public List<Key<T>> listKeysByProperty(Map<String, Object> map)
    {
	Query<T> q = ofy().query(clazz);
	for (String propName : map.keySet())
	{
	    q.filter(propName, map.get(propName));
	}
	return asKeyList(q.fetchKeys());
    }

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

    public List<T> listByExample(T exampleObj)
    {
	Query<T> queryByExample = buildQueryByExample(exampleObj);
	return asList(queryByExample.fetch());
    }

    private List<T> asList(Iterable<T> iterable)
    {
	ArrayList<T> list = new ArrayList<T>();
	for (T t : iterable)
	{
	    list.add(t);
	}
	return list;
    }

    private List<Key<T>> asKeyList(Iterable<Key<T>> iterableKeys)
    {
	ArrayList<Key<T>> keys = new ArrayList<Key<T>>();
	for (Key<T> key : iterableKeys)
	{
	    keys.add(key);
	}
	return keys;
    }

    private Query<T> buildQueryByExample(T exampleObj)
    {
	Query<T> q = ofy().query(clazz);

	// Add all non-null properties to query filter
	for (Field field : clazz.getDeclaredFields())
	{
	    // Ignore transient, embedded, array, and collection properties
	    if (field.isAnnotationPresent(Transient.class)
		    || (field.isAnnotationPresent(Embedded.class))
		    || (field.getType().isArray())
		    || (Collection.class.isAssignableFrom(field.getType()))
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
}
