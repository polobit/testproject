package com.agilecrm.util;

import com.google.appengine.api.NamespaceManager;
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
    
        MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
        syncCache.put(key, value);
    
        NamespaceManager.set(oldNamespace);
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
    
        MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
        Object value = syncCache.get(key);
    
        NamespaceManager.set(oldNamespace);
    
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
    
        MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
        if (syncCache.contains(key))
            syncCache.delete(key);
    
        NamespaceManager.set(oldNamespace);
    }

}
