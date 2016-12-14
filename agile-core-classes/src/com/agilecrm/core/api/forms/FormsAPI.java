package com.agilecrm.core.api.forms;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AllDomainStats;
import com.agilecrm.account.RecaptchaGateway;
import com.agilecrm.account.util.RecaptchaGatewayUtil;
import com.agilecrm.alldomainstats.util.AllDomainStatsUtil;
import com.agilecrm.cms.CMSPlugin;
import com.agilecrm.forms.Form;
import com.agilecrm.forms.util.FormUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.NamespaceManager;

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
    public Form saveForm(@Context HttpServletResponse response, String formString) throws IOException
    {
	try
	{
	    JSONObject formJson = new JSONObject(formString);
	    String name = formJson.getString("formName");
	    String json = formJson.getString("formJson");
	    boolean emailNotification=false;
		boolean agileformcaptcha=false;
		/*checking the condition for the whn emailNotification is true
		 * and user clicks on the submit button of the form  */
		try{
			JSONArray jsn=new JSONArray(json);
			emailNotification=jsn.getJSONObject(0).getJSONObject("fields").getJSONObject("formemailnotification").getJSONArray("value").getJSONObject(0).getBoolean("selected");
			emailNotification=emailNotification?false:true;
			
		}
		catch (Exception e)
		{
			System.out.println("Error occured while geeting email notification value... :"+e.getMessage());
		}
		/**@Priyanka
		 * checking the condition for the when agileformcaptcha is true(enable captcha)
		 * and user clicks on the submit button of the form then dynamically 
		 * the recaptcha key and site key will be append on the souce code(render time)
		 * */
		
		try{
			JSONArray jsn1=new JSONArray(json);
			agileformcaptcha=jsn1.getJSONObject(0).getJSONObject("fields").getJSONObject("agileformcaptcha").getJSONArray("value").getJSONObject(0).getBoolean("selected");
			agileformcaptcha=agileformcaptcha?false:true;
		}
		catch(Exception e){
			System.out.println("Error occured while getting captcha value..."+e.getMessage());
			
		}
		 String html = null;
	    
	    if(formJson.has("formHtml"))
	    {
	    html = formJson.getString("formHtml");
	    }
	    /**
	     * checking the condition when recaptcha will be selected as true by user  
	     * */
	    if(agileformcaptcha==true){	
	       RecaptchaGateway recaptchaGateway = RecaptchaGatewayUtil.getRecaptchaGateway();
	       
	       if(recaptchaGateway != null)
	       {
		    	
		    	html=html.replaceFirst("</form>","</form><script id=\"gRecaptchaSrc\" src='https://www.google.com/recaptcha/api.js'></script>"); 	
		    	html = html.replaceFirst("<!--recaptcha aglignment-->", " <!--recaptcha aglignment--><div class=\"agile-group\">"
			 + "<label class=\"agile-label\"></label>"
			 + "<div class=\"agile-field-xlarge agile-field\">"
			 + "<div class='g-recaptcha' style=\"transform:scale(0.91);-webkit-transform:scale(0.91);transform-origin:0 0;-webkit-transform-origin:0 0; width='304px';\" data-sitekey='" + recaptchaGateway.site_key + "' data-callback='agileGCaptchaOnSuccess'></div></div></div>");
		   }
	    }

	    if (StringUtils.isBlank(name) || !Character.isLetter(name.charAt(0)))
	    {
		response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		return null;
	    }

	    Form savedForm = FormUtil.getFormByName(name);
	    Form form = null;
	    Boolean saveForm = false;

	    if (formJson.has("id"))
	    {
		form = FormUtil.getFormById(formJson.getLong("id"));
		if (StringUtils.equals(form.formName, name) || savedForm == null)
		    saveForm = true;
	    }
	    else if (savedForm == null)
	    {
			form = new Form();
			saveForm = true;
			
			//Increase count of Campaign for AllDomainstats report in database
			AllDomainStatsUtil.updateAllDomainStats(AllDomainStats.FORM_COUNT);
	    }

	    if (saveForm)
	    {
		form.formName = name;
		form.formJson = json;
		form.formHtml = html;
		//adding another for emailNotification
		form.emailNotification=emailNotification;
		form.agileformcaptcha=agileformcaptcha;
		//if(form.emailNotification)

		form.save();
		
		// Inform to CMS plugins
		CMSPlugin.updateToCmsPlugins(CMSPlugin.EventName.Forms, true);
		
		response.setStatus(HttpServletResponse.SC_OK);
		return form;
	    }
	    else
	    {
		response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		return null;
	    }
	}
	catch (JSONException e)
	{
	    System.out.println(e.getMessage());
	    response.sendError(HttpServletResponse.SC_BAD_REQUEST);
	    return null;
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
	    
	    // Inform to CMS plugins
	    CMSPlugin.updateToCmsPlugins(CMSPlugin.EventName.Forms, true);
	}
	catch (JSONException e)
	{
	}
    }
    
    /**
     * 
     * @param formId
     * @return
     */
 	@Path("form/js/{formId}")
    @GET
    @Produces("application/x-javascript;charset=UTF-8;")
    public String getForm(@PathParam("formId") Long formId,@QueryParam("callback") String callback)
    {	
	try 
	{
		ObjectMapper mapper = new ObjectMapper();
		Form form = FormUtil.getFormById(formId);
		String formStr = mapper.writeValueAsString(form);
		if(callback != null && !callback.isEmpty()){
			return callback+"("+formStr+",'"+NamespaceManager.get()+"_"+form.id+"');";
		} else {
			return "showAgileCRMForm("+formStr+",'"+NamespaceManager.get()+"_"+form.id+"');";
		}
	} 
	catch(Exception e){
		e.printStackTrace();
		return null;
	}
	
    }
 	/**
 	 * 
 	 * @param captchaResponse
 	 * @return
 	 */
 	/*@Path("/verify/recaptcha")
    @GET
    @Produces("application/x-javascript;charset=UTF-8;")
    public boolean verifyRecaptcha(@PathParam("captchaResponse") String captchaResponse)
    {	
	try 
	{
		
		 String captchaURL = RECAPTCHA_VERIFY_URL + "?secret=" +RECAPTCHA_SITE_KEY ;
		 captchaURL = captchaURL + "&response="+captchaResponse;
		 
		String response =  HTTPUtil.accessURL(captchaURL);
		
		JSONObject data = new JSONObject(response);
		return data.getBoolean("success");
		
	} 
	catch(Exception e){
		e.printStackTrace();
		return false;
	}
	
    }*/
}