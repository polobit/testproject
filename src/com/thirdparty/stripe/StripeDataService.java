/**
 * 
 */
package com.thirdparty.stripe;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONObject;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;

import com.agilecrm.Globals;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueService;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.Duration;
import com.thirdparty.google.ContactPrefs.Type;
import com.thirdparty.google.ContactsImportUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * <code>StripeDataService</code> This is REST API call provide service for
 * saving users string auth Preferences and form data
 * 
 * @author jitendra
 * 
 */
@Path("/api/stripe")
public class StripeDataService
{

    /**
     * Return User's Save stripe contactPref
     * 
     * @return
     */
    @GET
    @Path("/importSetting")
    public ContactPrefs getPref()
    {
	return ContactPrefsUtil.getPrefsByType(Type.STRIPE);
    }

    /**
     * update Users contactPrefs if token will be there in contactPref then it
     * will initialize import data from stripe
     * 
     * @param prefs
     */
    @PUT
    @Path("/importSetting")
    public void saveImportPref(ContactPrefs prefs)
    {

	ContactPrefs pref = ContactPrefsUtil.get(prefs.id);
	pref.save();

	if (!pref.token.isEmpty() && pref != null)
	    doImport(pref);

    }

    /**
     * delete ContactPref
     */
    @DELETE
    @Path("/importSetting")
    public void deletePref()
    {
	ContactPrefsUtil.delete(Type.STRIPE);

    }

    /**
     * initialize import data for given configuration preferences
     * 
     * @param pref
     */
    private void doImport(ContactPrefs pref)
    {
	ArrayList<String> options = new ArrayList<String>();
	options.add("customer");
	pref.thirdPartyField = options;
	ContactsImportUtil.initilaizeImportBackend(pref);

    }

}
