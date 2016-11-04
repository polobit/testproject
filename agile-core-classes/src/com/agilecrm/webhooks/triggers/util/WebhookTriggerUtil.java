package com.agilecrm.webhooks.triggers.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.AgileQueues;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.queues.util.PullQueueUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.ThreadManager;
import com.google.appengine.api.datastore.EntityNotFoundException;

import edu.emory.mathcs.backport.java.util.Arrays;

/**
 * 
 * @author Ghanshyam
 *
 */
public class WebhookTriggerUtil
{
    // Dao
    private static ObjectifyGenericDao<Webhook> hooksdao = new ObjectifyGenericDao<Webhook>(Webhook.class);

    public static String[] supportedModules = new String[] { "contact", "opportunity" };

    public static void triggerWebhook(Object entityObj, String simpleName, Boolean updated)
	    throws EntityNotFoundException
    {
	Webhook hook = WebhookTriggerUtil.getWebhook();
	System.out.println("hook received = " + hook);
	
	if (hook == null || hook.modules.size() == 0)
	    return;

	if (hook.modules.size() == 1)
	{
	    if (hook.modules.get(0).equals("Contact") && simpleName.equals("Contact"))
	    {
		System.out.println("Contact only");
		createWebhookTrigger(entityObj, hook, updated, simpleName);
	    }
	    if (hook.modules.get(0).equals("Opportunity") && simpleName.equals("Opportunity"))
	    {
		System.out.println("Deal only");
		createWebhookTrigger(entityObj, hook, updated, simpleName);
	    }
	}
	else
	{
	    boolean sendTrigger = false;
	    for (String module : hook.modules)
	    {
		if (Arrays.asList(supportedModules).contains(module.toLowerCase()))
		    sendTrigger = true;
	    }
	    if (!sendTrigger)
		return;

	    createWebhookTrigger(entityObj, hook, updated, simpleName);
	}

    }

    private static String getEventName(String className, Boolean updated)
    {
	return className + " is " + (updated ? "Updated" : "Created");

    }

    private static void createWebhookTrigger(Object obj, Webhook hook, Boolean updated, String simpleName)
    {
	String oldNameSpace = NamespaceManager.get();
	
	String eventName = getEventName(simpleName, updated);

	final WebhookEvent evnt = new WebhookEvent(eventName, obj);
	final String uRL = hook.url;

	try
	{
	    //ThreadManager.createBackgroundThread(createHookThread(evnt, uRL)).start();
	    createHookThread(evnt, uRL);
	}
	catch (Exception e)
	{
	    System.out.println("In Catch " + e.getMessage());
	}
	finally{
	    try {
		NamespaceManager.set(oldNameSpace);
	    } catch (Exception e2) {
		System.out.println("In Catch e3 " + e2.getMessage());
	    }
	}

    }

    static void createHookThread(final WebhookEvent event, final String uRL)
    {

	System.out.println("Calling run method from thread...");
	ObjectMapper mapper = new ObjectMapper();
	try
	{
	    String json = mapper.writeValueAsString(event);

	    TaskletWebhooksDeferredTask task = new TaskletWebhooksDeferredTask(json, uRL.toString());
	    PullQueueUtil.addToPullQueue(AgileQueues.WEBHOOKS_REGISTER_ADD_QUEUE, task, "_personal");

	}
	catch (Exception e)
	{ // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }

    public static Webhook getWebhook(Long id)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    return hooksdao.get(id);
	}
	catch (Exception e)
	{
	    return null;
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    public static void deleteWebhook(Long id)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    hooksdao.delete(hooksdao.get(id));
	}
	catch (Exception e)
	{
	    System.out.println("Delete failed");
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }

    public static List<Webhook> getWebhooksList()
    {

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	List<Webhook> hooks = new ArrayList<Webhook>();
	
	try
	{
	    Map map = new HashMap();
	    if (StringUtils.isNotBlank(oldNamespace))
		map.put("domain", oldNamespace);

	    hooks = hooksdao.listByProperty(map);
	    System.out.println("hoooooooooooooooks" + hooks);
	}
	catch (Exception e)
	{
	    hooks = null;
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
	
	return hooks;

    }

    public static Webhook getWebhook()
    {

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	Webhook hook = null;
	
	try
	{
	    Map map = new HashMap();
	    if (StringUtils.isNotBlank(oldNamespace))
		map.put("domain", oldNamespace);

	    List<Webhook> hooks = hooksdao.listByProperty(map);
	    System.out.println("hoooooooooooooooks" + hooks);
	    hook = hooks.get(0);
	}
	catch (Exception e)
	{
	    hook = null;
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
	
	return hook;
    }

}