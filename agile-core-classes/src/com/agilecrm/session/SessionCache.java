/**
 * This file contains code for SessionCache. The cache is used to set values
 * which are constant for a given cache and don't need to be fetched from the datastore
 * for each request, for example: the logged-in user - DomainUser
 */

package com.agilecrm.session;

import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpSession;

public class SessionCache
{
	/**
	 * Session Attribute for this object
	 */
	public static final String SESSION_ATTRIBUTE_NAME = "__agile__session__cache__";
	
	/**
	 * Constants used for adding objects/retrieving objects to/from cache
	 */
	
	public static final String CURRENT_DOMAIN_USER = "__CurrentDomainUser";
	
	public static final String CURRENT_AGILE_USER = "__CurrentAgileUser";
	
	/**
	 * The Hashmap used for caching
	 */
	private static final ThreadLocal<HttpSession> threadLocal = new ThreadLocal<>();
	
	/**
	 * Put an object in the cache.
	 * CAUTION: Only put objects that are guaranteed to be same for an entire session
	 * @param key
	 * @param value
	 */
	public static void putObject(String key, Object value)
	{
		HttpSession session = threadLocal.get();
		
		if( session == null )	return;
		
		ConcurrentHashMap<String, Object> cache = (ConcurrentHashMap<String, Object>) session.getAttribute(SESSION_ATTRIBUTE_NAME);
		
		if( cache == null ) 
		{
			cache = new ConcurrentHashMap<String, Object>();
			session.setAttribute(SESSION_ATTRIBUTE_NAME, cache);
		}
		
		// Remove the object from cache if value is null
		if( value == null )		cache.remove(key);
		else cache.put(key, value);
		
		session.setAttribute(SESSION_ATTRIBUTE_NAME, cache);
	}
	
	/**
	 * Retrieve an object from the cache
	 * @param key
	 * @return
	 */
	public static Object getObject(String key)
	{
		HttpSession session = threadLocal.get();
		
		if( session == null )	return null;
		
		ConcurrentHashMap<String, Object> cache = (ConcurrentHashMap<String, Object>) session.getAttribute(SESSION_ATTRIBUTE_NAME);
		
		if( cache == null ) return null;
		
		return cache.get(key);
	}
	
	/**
	 * Remove an object from Session Cache
	 * @param key
	 */
	public static void removeObject(String key)
	{
		putObject(key, null);
	}
	
	/**
	 * Set the session for this cache
	 * @param session
	 */
	public static void setSession(HttpSession session)
	{
		threadLocal.set(session);
	}
	
	/**
	 * Unset the session for this cache
	 */
	public static void unsetSession()
	{
		threadLocal.remove();
	}
}
