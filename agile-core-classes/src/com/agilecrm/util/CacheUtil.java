package com.agilecrm.util;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.memcache.Expiration;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

/**
 * Util class to maintain the MemCache in the entire application Contains the
 * basic methods to handle the MemCacahe
 * 
 * 
 * @author Ramesh
 * 
 */
public class CacheUtil
{

    /**
     * Adds the key and value pair to the Memcache.
     * 
     * @param key
     *            String to store as map key
     * @param value
     *            Object represents the value to map
     */
    public static void setCache(String key, Object value)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	    syncCache.put(key, value);
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while setting in cache..." + e.getMessage());
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Adds the key and value pair to the Memcache with expiry milliseconds.
     * 
     * @param key
     *            String to store as map key
     * @param value
     *            Object represents the value to map
     * @param timeInMilliSeconds
     *            Number of milliseconds to set expiry
     */
    public static void setCache(String key, Object value, int timeInMilliSeconds)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	    syncCache.put(key, value, Expiration.byDeltaMillis(timeInMilliSeconds));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while setting in cache with time..." + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Adds the key and value pair to the Memcache for number of days set.
     * 
     * @param key
     * @param value
     * @param numberOfDays
     */
    public static void setCacheForNumberOfDays(String key, Object value, int numberOfDays)
    {
	setCache(key, value, numberOfDays * 24 * 60 * 60 * 1000);
    }

    /**
     * Gets the value from Cache. The Object holding the value is returned
     * 
     * @param key
     *            Memcache key to search
     * @return Object with value
     */
    public static Object getCache(String key)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	Object value = null;

	try
	{
	    MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	    value = syncCache.get(key);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while getting from cache..." + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	return value;
    }

    /**
     * Removes the data from Cache. Returns void
     * 
     * @param key
     *            Memcache key to search
     */
    public static void deleteCache(String key)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	    if (syncCache.contains(key))
		syncCache.delete(key);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while deleting from cache..." + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}