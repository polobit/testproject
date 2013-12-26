package com.campaignio.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.util.FileStreamUtil;

/**
 * <code>WorkflowDefaultTemplatesServlet</code> is the servlet that handles
 * serving all workflow template jsons from misc/campaign-templates folder.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class WorkflowDefaultTemplatesServlet extends HttpServlet
{
    /**
     * Campaigns template path.
     */
    public static final String CAMPAIGN_TEMPLATES_PATH = "misc/campaign-templates/";

    /*
     * (non-Javadoc)
     * 
     * @see
     * javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest
     * , javax.servlet.http.HttpServletResponse)
     */
    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {
	doGet(req, res);
    }

    /**
     * Returns all workflow template jsons and return them in response as json
     * array.
     * 
     * @param req
     *            - HttpServletRequest object
     * @param res
     *            - HttpServletResponse object
     **/
    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {

	String[] GENERAL_CATEGORY = { "general/newsletter_template.js", "general/auto_responder_template.js" };
	String[] ECOMMERCE_CATEGORY = { "ecommerce/cart_abandonment_template.js", "ecommerce/targeted_promo_template.js" };
	String[] SAAS_CATEGORY = { "saas/signup_welcome_template.js", "saas/user_onboarding_template.js", "saas/trial_conversion_template.js" };
	String[] MARKETING_AUTOMATION_CATEGORY = { "marketing-automation/lead_scoring_template.js", "marketing-automation/social_campaign_template.js",
		"marketing-automation/ab_testing_template.js" };

	String[][] categories = { GENERAL_CATEGORY, ECOMMERCE_CATEGORY, SAAS_CATEGORY, MARKETING_AUTOMATION_CATEGORY };

	// all workflow jsons from campaign-templates folder.
	JSONArray workflowTemplates = getAllWorkflowTemplates(categories);

	try
	{
	    res.getWriter().print(workflowTemplates);
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	}

    }

    /**
     * Returns JSONArray of template jsons grouped by category.
     * 
     * @param categories
     *            - array of template jsons of each category.
     * @return JSONArray of all workflow jsons
     */
    public static JSONArray getAllWorkflowTemplates(String[][] categories)
    {
	JSONArray categoriesArray = new JSONArray();

	for (String[] category : categories)
	{
	    // Put each category templates
	    categoriesArray.put(getCategoryTemplatesJSON(category));
	}

	return categoriesArray;
    }

    /**
     * Returns array of templates json with category name as key
     * 
     * @param type
     *            - category or sub-folder of campaign-templates
     * @return JSONObject of category having array of templates
     */
    public static JSONObject getCategoryTemplatesJSON(String[] type)
    {
	String category = null;
	JSONArray templates = new JSONArray();
	try
	{
	    for (String path : type)
	    {
		// Gets category from path. E.g.,general from
		// general/newsletter_template.js
		category = path.split("/")[0];

		String templateString = FileStreamUtil.readResource(CAMPAIGN_TEMPLATES_PATH + path);

		try
		{
		    JSONObject json = new JSONObject(templateString);

		    // JSONObject with template and json(template json) as key
		    // value pairs. E.g., {template: newsletter, json:{}}
		    templates.put(new JSONObject().put("template", path.split("/")[1].split("_template.js")[0]).put("json", json));
		}
		catch (Exception e)
		{
		    System.err.println("Template string is not in correct json format " + e.getMessage());
		    continue;
		}

	    }

	    return new JSONObject().put("category", category).put("templates", templates);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
}
