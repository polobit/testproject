package com.agilecrm.core.api.forms;

import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.forms.Form;
import com.agilecrm.forms.util.FormUtil;

@Path("/api/forms")
public class FormsAPI
{
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Form> getAllForms()
    {
	return FormUtil.getAllForms();
    }

    @Path("form")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Form getFormById(@QueryParam("formId") Long formId)
    {
	return FormUtil.getFormById(formId);
    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void saveForm(@Context HttpServletResponse response, String formString)
    {
	try
	{
	    System.out.println(formString);
	    JSONObject formJson = new JSONObject(formString);
	    Long formId = null;
	    if (formJson.has("id"))
		formId = formJson.getLong("id");
	    Form form = null;
	    if (formId != null)
	    {
		form = FormUtil.getFormById(formId);
	    }
	    if (form == null)
		form = new Form();
	    form.formName = formJson.getString("formName");
	    form.formJson = formJson.getString("formJson");
	    form.save();
	}
	catch (JSONException e)
	{
	    System.out.println(e.getMessage());
	    System.out.println("saving form failed");
	}
    }

    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteForms(@FormParam("ids") String model_ids) throws JSONException
    {
	try
	{
	    JSONArray formsJSONArray = new JSONArray(model_ids);
	    Form.dao.deleteBulkByIds(formsJSONArray);
	}
	catch (JSONException e)
	{
	}
    }
}