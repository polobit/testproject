package com.agilecrm.webhooks.triggers.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.CustomFieldData;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.NamespaceManager;

public class ZapierRestHook {
    // Constant for Cached Limit Key
    public static final String ZAPIER_DATA_CACHED_KEY = "_zapier_data_cached_key";
    // Dao
    private static ObjectifyGenericDao<RestHookZap> hooksdao = new ObjectifyGenericDao<RestHookZap>(
	    RestHookZap.class);

    public static RestHookZap subscribeHook(String target_url, String event) {
	System.out.println("Zapier input url = " + target_url + " event = "
		+ event);
	RestHookZap resthook = new RestHookZap();
	String domain = NamespaceManager.get();
	resthook.domain = domain;
	resthook.target_url = target_url;
	resthook.event = event;

	resthook.save();

	System.out.println("Zapier hook saved successfully!....." + resthook);

	return resthook;
    }

    public static boolean unsubscribeHook(String id) {
	System.out.println("ID received = " + id);
	Long id1 = Long.parseLong(id);
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try {
	    hooksdao.delete(hooksdao.get(id1));
	} catch (Exception e) {
	    System.out.println("Delete failed");
	} finally {
	    NamespaceManager.set(oldNamespace);
	}
	return true;
    }

    public static List<RestHookZap> getRestHook() {

	String oldNamespace = NamespaceManager.get();

	try {
	    List<RestHookZap> zapierHooks = (List<RestHookZap>) CacheUtil
		    .getCache(oldNamespace + ZAPIER_DATA_CACHED_KEY);
	    System.out.println("cache data = " + zapierHooks);
	    if (zapierHooks != null)
		return zapierHooks;
	} catch (Exception e) {
	    // TODO: handle exception
	}

	NamespaceManager.set("");

	try {
	    Map map = new HashMap();
	    if (StringUtils.isNotBlank(oldNamespace))
		map.put("domain", oldNamespace);

	    List<RestHookZap> hooks = hooksdao.listByProperty(map);
	    System.out.println("hooks from db" + hooks);
	    return hooks;
	} catch (Exception e) {
	    return null;
	} finally {
	    NamespaceManager.set(oldNamespace);
	}

    }

    public static RestHookZap gethook(Long id) {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try {
	    return hooksdao.get(id);
	} catch (Exception e) {
	    return null;
	} finally {
	    NamespaceManager.set(oldNamespace);
	}
    }

    public static void deletehook(Long id) {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try {
	    hooksdao.delete(hooksdao.get(id));
	} catch (Exception e) {
	    System.out.println("Delete failed");
	} finally {
	    NamespaceManager.set(oldNamespace);
	}

    }

    public static void sendDealDataToRegisterdZapier(Opportunity opportunity,
	    JSONArray jsn) {

	List<RestHookZap> restHookList = getRestHook();
	System.out.println("All rest hook returns = " + restHookList);

	if (restHookList == null)
	    return;

	if (restHookList.size() == 0)
	    return;

	JSONObject json = new JSONObject();
	Long milestone_update = System.currentTimeMillis();
	try {
	    for (CustomFieldData key : opportunity.custom_data) {
		json.put(key.name, key.value);
	    }
	    if (jsn != null && jsn.length() > 0) {
		List<String> contactids = ActivitySave.getContactids(jsn);
		List<String> contactnames = ActivitySave.getContactNames(jsn);

		if (contactids != null && contactnames != null
			&& contactids.size() == contactnames.size()) {
		    for (int i = 0; i < contactids.size(); i++) {

			json.put("contactid", contactids.get(i));
			json.put("contactname", contactnames.get(i));

		    }
		}
	    }
	    json.put("colorName", opportunity.colorName);
	    json.put("id", opportunity.id);
	    json.put("apply_discount", opportunity.apply_discount);
	    json.put("discount_value", opportunity.discount_value);
	    json.put("discount_amt", opportunity.discount_amt);
	    json.put("discount_type", opportunity.discount_type);
	    json.put("name", opportunity.name);
	    json.put("products", opportunity.products);
	    json.put("description", opportunity.description);
	    json.put("expected_value", opportunity.expected_value);
	    json.put("milestone", opportunity.milestone);
	    json.put("probability", opportunity.probability);
	    json.put("close_date", opportunity.close_date);
	    json.put("created_time", opportunity.created_time);
	    json.put("milestone_changed_time",milestone_update);
	    json.put("pipeline_id", opportunity.getPipeline_id());
	    json.put("deal_source_id", opportunity.getDeal_source_id());
	    json.put("lost_reason_id", opportunity.lost_reason_id);
	    json.put("total_deal_value", opportunity.total_deal_value);
	    json.put("updated_time", milestone_update);
	    json.put("tagsWithTime", opportunity.getDealTags());
	    System.out.println(json.toString());
	} catch (Exception e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	try {
	    if (restHookList != null && restHookList.size() > 0) {
		for (RestHookZap restHook : restHookList) {
		    // String event = restHook.event;
		    try {
			String target_url = restHook.target_url;
			createZapierHookThread(json.toString(), target_url);

		    } catch (Exception e) { // TODO Auto-generated catch block
			e.printStackTrace();
		    }
		}

	    }

	} catch (Exception e) {
	    System.out.println("In Catch " + e.getMessage());
	}

    }

    public static void sendContactDataToRegisterdZapier(Contact contact) {
	List<RestHookZap> restHookList = getRestHook();
	System.out.println("All rest hook returns = " + restHookList);

	if (restHookList == null)
	    return;

	if (restHookList.size() == 0)
	    return;
	
	JSONObject json = new JSONObject();
	try {
	    json.put("id", contact.id);
	    json.put("type", contact.type);
	    json.put("created_time", contact.created_time);
	    json.put("updated_time", contact.updated_time);
	    json.put("star_value", contact.star_value);
	    json.put("lead_score", contact.lead_score);
	    json.put("tags", contact.tags);
	    for (ContactField key : contact.properties) {
		json.put(key.name, key.value);
	    }
	    System.out.println(json.toString());
	} catch (Exception e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	try {
	    if (restHookList != null && restHookList.size() > 0) {
		for (RestHookZap restHook : restHookList) {
		    // String event = restHook.event;
		    try {
			String target_url = restHook.target_url;
			createZapierHookThread(json.toString(), target_url);

		    } catch (Exception e) { // TODO Auto-generated catch block
			e.printStackTrace();
		    }
		}

	    }

	} catch (Exception e) {
	    System.out.println("In Catch " + e.getMessage());
	} 

    }

    static void createZapierHookThread(final String stringData, final String uRL) {

	System.out.println("Calling zapier hook");
	try {
	    String json = stringData;

	    TaskletWebhooksDeferredTask task = new TaskletWebhooksDeferredTask(
		    json, uRL.toString());
	    PullQueueUtil.addToPullQueue(
		    AgileQueues.WEBHOOKS_REGISTER_ADD_QUEUE, task, "_personal");

	} catch (Exception e) { // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }

}
