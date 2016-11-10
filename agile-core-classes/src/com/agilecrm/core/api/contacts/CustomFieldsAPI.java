package com.agilecrm.core.api.contacts;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.AgileQueues;
import com.agilecrm.ContactSchemaUpdateStats;
import com.agilecrm.OpportunitySchemaUpdateStats;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.contact.deferred.UpdateContactsDeferredTask;
import com.agilecrm.contact.exception.DuplicateCustomFieldException;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.deals.deferred.UpdateDealsDeferredTask;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>CustomFieldsAPI</code> includes REST calls to interact with
 * {@link CustomFieldDef} class to initiate Task CRUD operations
 * <p>
 * It is called from client side to create, update, fetch and delete the custom
 * fieds.It also interacts with {@link CustomFieldUtil} class to fetch the data
 * of <code>CustomFieldDef</code> class from database.
 * </p>
 * 
 * @author Yaswanth
 * 
 */
@Path("/api/custom-fields")
public class CustomFieldsAPI
{

    /**
     * Gets all custom fields
     * 
     * @return List of custom fields
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getCustomFields()
    {
    List<CustomFieldDef> customFieldsList = new ArrayList<CustomFieldDef>();
	try
	{
	    //List<CustomFieldDef> cusList = CustomFieldDefUtil.getAllCustomFields();
		List<CustomFieldDef> cusList = CustomFieldDefUtil.getCustomFieldsByPosition();
	    if (cusList != null)
	    {
	    	for (CustomFieldDef customFieldDef : cusList)
	    	{
	    		if (!customFieldDef.field_type.equals(CustomFieldDef.Type.FORMULA))
	    		{
	    			customFieldsList.add(customFieldDef);
	    		}
	    	}
	    }
	    return customFieldsList;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all custom fields
     * 
     * @return List of custom fields
     */
    @Path("/scope")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getCustomFieldsByScopeType(@QueryParam("scope") String scope)
    {
    List<CustomFieldDef> customFieldsList = new ArrayList<CustomFieldDef>();
	try
	{
	    if (scope == null)
		CustomFieldDefUtil.getAllCustomFields();
	    
	    //Sorting order is added for custom fields so getting them in 
	    //order this line is commented and below added new line
	    //return CustomFieldDefUtil.getAllCustomFields(SCOPE.valueOf(scope));
	    List<CustomFieldDef> cusList = CustomFieldDefUtil.getCustomFieldsByScopeAndPosition(SCOPE.valueOf(scope));
	    if (cusList != null)
	    {
	    	for (CustomFieldDef customFieldDef : cusList)
	    	{
	    		if (!customFieldDef.field_type.equals(CustomFieldDef.Type.FORMULA))
	    		{
	    			customFieldsList.add(customFieldDef);
	    		}
	    	}
	    }
	    return customFieldsList;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all custom fields matching the Scope and the Type.
     * 
     * @param scope
     *            scope of the custom field like CONTACT.
     * @param type
     *            type of the custom field like TEXT.
     * 
     * @return List of custom fields
     */
    @Path("/type/scope")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getCustomFieldsByScopeAndType(@QueryParam("scope") String scope,
	    @QueryParam("type") String type)
    {
	try
	{
	    if (scope == null)
		return CustomFieldDefUtil.getFieldByType(type);

	    if (type == null)
		return CustomFieldDefUtil.getAllCustomFields(SCOPE.valueOf(scope));

	    return CustomFieldDefUtil.getCustomFieldsByScopeAndType(SCOPE.valueOf(scope), type);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all custom fields
     * 
     * @return List of custom fields
     */
    @Path("/searchable/scope")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getSearchableCustomFieldsByScope(@QueryParam("scope") String scope)
    {
    try
	{
	    if (scope == null)
		CustomFieldDefUtil.getSearchableCustomFields();

	    return CustomFieldDefUtil.getSearchableCustomFieldsByScope(SCOPE.valueOf(scope));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
    
    /**
     * Gets all custom fields which are required
     * 
     * @return List of custom fields
     */
    @Path("/required/scope")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getRequiredCustomFieldsByScope(@QueryParam("scope") String scope)
    {
		try
		{
		    if (scope == null)
		    	CustomFieldDefUtil.getRequiredCustomFields();
	
		    return CustomFieldDefUtil.getRequiredCustomFieldsByScope(SCOPE.valueOf(scope));
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		    return null;
		}
    }
    
    /**
     * Retrieves Custom fields according to scope SCOPE can be like PERSION,COMPANY,CONTACT etc
     */
    @Path("/byscope")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getCustomFieldsByScope(@QueryParam("scope") SCOPE scope)
    {
    List<CustomFieldDef> customFieldsList = new ArrayList<CustomFieldDef>();
	try
	{
	    if (scope == null)
		CustomFieldDefUtil.getSearchableCustomFields();

	    //List<CustomFieldDef> cusList = CustomFieldDefUtil.getCustomFieldsByScope(scope);
	    List<CustomFieldDef> cusList = CustomFieldDefUtil.getCustomFieldsByScopeAndPosition(scope);
	    if (cusList != null)
	    {
	    	for (CustomFieldDef customFieldDef : cusList)
	    	{
	    		if (!customFieldDef.field_type.equals(CustomFieldDef.Type.FORMULA))
	    		{
	    			customFieldsList.add(customFieldDef);
	    		}
	    	}
	    }
	    return customFieldsList;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all custom fields
     * 
     * @return List of custom fields
     */
    @Path("/searchable")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getSearchableCustomFields()
    {
	try
	{
	    return CustomFieldDefUtil.getSearchableCustomFields();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all custom fields by type
     * 
     * @return List of custom fields
     */
    @Path("/type/{field_type}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getCustomFieldsByType(@PathParam("field_type") String type)
    {
	try
	{
	    return CustomFieldDefUtil.getFieldByType(type);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Deletes the custom field based on 'id' from the database
     * 
     * @param id
     *            unique id of the custom field
     */
    @Path("/{id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteCustomField(@PathParam("id") Long id)
    {
	try
	{
	    CustomFieldDef customFieldDef = CustomFieldDefUtil.getCustomField(id);
	    if (customFieldDef != null)
		customFieldDef.delete();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Saves new custom field by validating its label name. Exception will be
     * thrown if a duplicate field with same label exists
     * 
     * @param customField
     * @return
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List< CustomFieldDef> createCustomField(CustomFieldDef customField)throws Exception
    {
    	List< CustomFieldDef> CustomFieldDefs = new ArrayList<CustomFieldDef>();
    	String warningMsg = "A custom field with this Label is already present in ";
    	String msg="";
    	boolean duplicateCF=false;
    	
	try
	{
			String scopecf[]=new String[3];
			String position[]=new String[3];
			if(customField.scopeExtension != null){
				scopecf=customField.scopeExtension.split(",");
			}
			 if(customField.positionsList != null){
		        position=customField.positionsList.split(",");
		    }
			

			List<CustomFieldDef> customFields = CustomFieldDefUtil.getCustomFieldswithFieldLabel(customField.field_label);
			if(customFields.size() > 0){				
				for(CustomFieldDef cu : customFields){
					if(cu != null && cu.scope != null ){
						if(cu.scope.equals(CustomFieldDef.SCOPE.CONTACT) && customField.scopeExtension.contains("contacts")){
							msg = msg + " contacts" ;
							duplicateCF = true;
						}
						else if(cu.scope.equals(CustomFieldDef.SCOPE.COMPANY)&& customField.scopeExtension.contains("companies")){
							msg = msg + " , " ;
							msg = msg + " companies" ;
							duplicateCF = true;
						}
						else if(cu.scope.equals(CustomFieldDef.SCOPE.DEAL)&& customField.scopeExtension.contains("deals")){
							msg = msg + " , " ;
							msg = msg + " deals" ;
							duplicateCF = true;
						}
						else if(cu.scope.equals(CustomFieldDef.SCOPE.LEAD)&& customField.scopeExtension.contains("leads")){
							msg = msg + " , " ;
							msg = msg + " leads" ;
							duplicateCF = true;
						}
					}
				}
				msg = msg + "." ;
			}
			if(!duplicateCF){
				for(int i=0;i<scopecf.length ; i++){
					CustomFieldDef custom_Field = new CustomFieldDef(customField.field_type,customField.field_label,customField.field_description, customField.field_data,
						     customField.is_required, customField.searchable);
					custom_Field.id = null ;String p = "0";
					if(scopecf[i].equalsIgnoreCase("contacts"))
					{
						custom_Field.scope=CustomFieldDef.SCOPE.valueOf("CONTACT");
						for(int j= 0;j<position.length;j++){
							if(position[j].startsWith("contacts")){
								p = position[i].split("-")[1];
								break;
							}
						}
						custom_Field.position = Integer.parseInt(p) + 1;
					}
					else if(scopecf[i].equalsIgnoreCase("companies"))
					{
						custom_Field.scope=CustomFieldDef.SCOPE.valueOf("COMPANY");
						for(int j= 0;j<position.length;j++){
							if(position[j].startsWith("companies")){
								p = position[i].split("-")[1];
								break;
							}
						}
						custom_Field.position = Integer.parseInt(p) + 1;
					}
					else if(scopecf[i].equalsIgnoreCase("deals"))
					{
						custom_Field.scope=CustomFieldDef.SCOPE.valueOf("DEAL");
						for(int j= 0;j<position.length;j++){
							if(position[j].startsWith("deals")){
								p = position[i].split("-")[1];
								break;
							}
						}
						custom_Field.position = Integer.parseInt(p) + 1;
					}
					else if(scopecf[i].equalsIgnoreCase("leads"))
					{
						custom_Field.scope=CustomFieldDef.SCOPE.valueOf("LEAD");
						for(int j= 0;j<position.length;j++){
							if(position[j].startsWith("leads")){
								p = position[i].split("-")[1];
								break;
							}
						}
						custom_Field.position = Integer.parseInt(p) + 1;
					}
					custom_Field.save();
					CustomFieldDefs.add(custom_Field);
				}
			}
			else{
				throw new DuplicateCustomFieldException(warningMsg+msg.toLowerCase());
			}	
	}
	catch (DuplicateCustomFieldException e)
	{
	    throw e;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return CustomFieldDefs;
    }

    /**
     * Updates the existing field by validating its label name
     * 
     * @param customField
     *            custom field which is going to be updated
     * @return updated custom field data
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public CustomFieldDef updateCustomField(CustomFieldDef customField)throws Exception
    {
	try
	{
	    customField.save();
	}
	catch (DuplicateCustomFieldException e)
	{
	    throw e;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return customField;
    }

    /**
     * Deletes all selected custom fields using array of corresponding ids
     * 
     * @param model_ids
     *            array of custom field ids as String
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteCustomFields(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray CustomFieldsJSONArray = new JSONArray(model_ids);
	CustomFieldDef.dao.deleteBulkByIds(CustomFieldsJSONArray);
    }
    /**
     * Gets all scopes of custom fields
     * 
     * @return List of custom fields
     */
    @Path("/allScopes")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getAllScopesOfCustomFields(){
    	try{
    		return CustomFieldDefUtil.getAllScopesOfCustomFields();
    	} catch (Exception e){
    		e.printStackTrace();
    		return null;
    	}
    }
    /**
     * Gets all custom fields by scope type and order by position
     * 
     * @return List of custom fields
     */
    @Path("/scope/position")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getCustomFieldsByScopeAndPosition(@QueryParam("scope") String scope){
    	try{
    		if(scope!=null)
    			return CustomFieldDefUtil.getCustomFieldsByScopeAndPosition(SCOPE.valueOf(scope));
    		else
    			return null;
    	}
    	catch (Exception e){
    		e.printStackTrace();
    		return null;
    	}
    }
    /**
	 * Saves position of custom fields, used to show custom fields in ascending order 
	 * according to position
	 * 
	 * @param customfields
	 *             {@link List} of {@link CustomFieldDef}
	 */
	@Path("positions")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public void savePortletPositions(List<CustomFieldDef> customfields){
		try {
			if (customfields == null)
				return;

			// UI sends only ID and Position
			for (CustomFieldDef cfd : customfields){
				CustomFieldDef customFieldDef = CustomFieldDefUtil.getCustomField(cfd.id);
				customFieldDef.position = cfd.position;
				customFieldDef.save();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/**
     * Gets all custom fields order by position
     * 
     * @return List of custom fields
     */
    @Path("/position")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getCustomFieldsByPosition(){
    	try{
    		return CustomFieldDefUtil.getCustomFieldsByPosition();
    	}
    	catch (Exception e){
    		e.printStackTrace();
    		return null;
    	}
    }
    /**
     * Gets all custom fields order by position
     * 
     * @return List of custom fields
     */
    @Path("/syncappdata")
    @GET
    @Produces({ MediaType.TEXT_PLAIN, MediaType.APPLICATION_JSON })
    public String syncAppData(@QueryParam("domain") String domain,@QueryParam("domainusermail") String domainusermail){
    	String domainUser = domain;
    	System.out.println("domain ="+domainUser);
    	System.out.println("domainusermail ="+domainusermail);
    	if( domainUser != null){
    		try {
				Long updated_time = null;
				Date update_date = null;
				ContactSchemaUpdateStats schema = ContactSchemaUpdateStats.get(domainUser);
				System.out.println(schema);    				
				if(schema != null && schema.updated_time != null){
					updated_time = schema.updated_time * 1000 ;
					update_date = new Date(updated_time);
				}
				Date current_date = new Date(); 
				String oldNamespace = NamespaceManager.get();
				NamespaceManager.set("");
				if(schema == null || (update_date.getMonth() < current_date.getMonth() && update_date.getYear() <= current_date.getYear())){
				if(schema == null){					
						ContactSchemaUpdateStats newSchema = new ContactSchemaUpdateStats();					
						newSchema.updated_time = System.currentTimeMillis() / 1000 ;
						newSchema.domain = domainUser;
						newSchema.domainusermail=domainusermail;   
						System.out.println("domain ="+domainUser);
						System.out.println("domainusermail ="+domainusermail);
						newSchema.save();
					}
				else {
					schema.domainusermail = domainusermail ; 
					
					System.out.println("domainusermail ="+domainusermail); 
					schema.save();				
				}
				NamespaceManager.set(oldNamespace);
					UpdateContactsDeferredTask updateContactDeferredTask = new UpdateContactsDeferredTask(domainUser);					
					// Add to queue
					Queue queue = QueueFactory.getQueue(AgileQueues.CONTACTS_SCHEMA_CHANGE_QUEUE);
					queue.add(TaskOptions.Builder.withPayload(updateContactDeferredTask));
					return "success";
				
    	}
			return "limitReached" ;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    	}
    	return "fail";    	
    }
    @Path("/syncappdataforDeals")
    @GET
    @Produces({ MediaType.TEXT_PLAIN, MediaType.APPLICATION_JSON })
    public String syncAppDataForDeals(@QueryParam("domain") String domain){
    	String domainUser = domain;
    	System.out.println("domain user for deals merge is"+domainUser);
    	if( domainUser != null){
    		try {
				Long updated_time = null;
				Date update_date = null;
				OpportunitySchemaUpdateStats schema = OpportunitySchemaUpdateStats.get(domainUser);
				System.out.println("schema is"+schema);    				
				if(schema != null && schema.updated_time != null){
					updated_time = schema.updated_time * 1000 ;
					update_date = new Date(updated_time);
				}
				System.out.println("updated time "+update_date);
				Date current_date = new Date(); 
				if(schema == null || updated_time == null || (update_date.getMonth() < current_date.getMonth() && update_date.getYear() <= current_date.getYear())){
					if(schema == null){
						String oldNamespace = NamespaceManager.get();
						NamespaceManager.set("");
						OpportunitySchemaUpdateStats newSchema = new OpportunitySchemaUpdateStats();					
						newSchema.updated_time = System.currentTimeMillis() / 1000 ;
						newSchema.domain = domainUser;
						newSchema.save();
						NamespaceManager.set(oldNamespace);
					}
					UpdateDealsDeferredTask updateDealDeferredTask = new UpdateDealsDeferredTask(domainUser);					
					// Add to queue
					Queue queue = QueueFactory.getQueue(AgileQueues.DEALS_SCHEMA_CHANGE_QUEUE);
					queue.add(TaskOptions.Builder.withPayload(updateDealDeferredTask));
					return "success";
				}
				return "limitReached" ;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				System.out.println("error to update deals is "+e.getMessage());
			}
    	}
    	return "fail";    	
    }
    
}