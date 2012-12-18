package com.agilecrm.util;

import net.sf.jsr107cache.Cache;

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
public class CacheUtil {

	/** The vlaue is used for the default Cache storage */
	public static Cache _cache = null;

	/**
	 * Retrieves the value and removes from the application memcache
	 * 
	 * @param key
	 *            String with the cache key value
	 * @return Object
	 */
	public static Object getAndRemove(String key) {
		Object cache = get(key);
		remove(key);

		return cache;
	}

	//
	/**
	 * Get the value from Cache The Object holding the value is returned
	 * 
	 * @param key
	 *            Memcache key to search
	 * @return Object with value
	 */
	public static Object get(String key) {
		MemcacheService cache = getCache();
		if (cache == null) {
			System.out.println("Memcache is null");
			return null;
		}
		return cache.get(key);
	}

	/**
	 * Removes the data from Cache Returns void
	 * 
	 * @param key
	 *            Memcache key to search
	 */
	public static void remove(String key) {
		MemcacheService cache = getCache();
		if (cache == null) {
			System.out.println("Memcache is null");
			return;
		}

		if (cache.contains(key))
			cache.delete(key);

		return;
	}

	// Get Cache
	/**
	 * Get the MemcacheService from the MemcacheServicefactory. Returns the
	 * MemcacheService object.
	 * 
	 * @return MemcacheService
	 */
	private static MemcacheService getCache() {
		try {
			return MemcacheServiceFactory.getMemcacheService();

		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Memcache is null");
		}

		return null;
	}

	// Check if key is present
	/**
	 * Check if key is present in the Memcache object. Returns a boolean value
	 * represents the existence.
	 * 
	 * @param key
	 * @return
	 */
	public static boolean isPresent(String key) {

		MemcacheService cache = getCache();
		if (cache == null) {
			System.out.println("Memcache is null");
			return false;
		}

		return cache.contains(key);
	}

	// Put key, value
	/**
	 * Add the key and value pair to the Memcache. Returns void.
	 * 
	 * @param key
	 *            String to store as map key
	 * @param value
	 *            Object represents the value to map
	 */
	public static void put(String key, Object value) {
		MemcacheService cache = getCache();
		if (cache == null) {
			System.out.println("Memcache is null");
			return;
		}

		cache.put(key, value);
	}
}
