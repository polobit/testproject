package com.agilecrm.facebookpage;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.appengine.api.NamespaceManager;

/**
 * 
 */
public class FacebookPageServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    private static enum ACTIONS
    {
	GET_DETAILS, SAVE_DETAILS, DELETE_TAB, UNLINK_ACCOUNT
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	doPost(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	String action = request.getParameter("action");
	PrintWriter out = response.getWriter();
	if (action != null && action.trim() != "")
	{
	    ACTIONS routeAction = ACTIONS.valueOf(action);
	    switch (routeAction)
	    {
	    case GET_DETAILS:
		try
		{
		    response.setContentType("application/json; charset=UTF-8");
		    out.write(getAuthAndPages(request));
		}
		catch (JSONException e)
		{
		    e.printStackTrace();
		}
		break;
	    case UNLINK_ACCOUNT:
	    	HttpSession currentSession = request.getSession();
	    	currentSession.setAttribute("fbpage_logged_in", false);
	    	response.sendRedirect("/#facebook-integration");
	    break;
	    case DELETE_TAB:
		response.setContentType("text/plain");
		String fbPageID = request.getParameter("facebookPageID");
		String fbPageToken = request.getParameter("facebookPageToken");
		FacebookPage facebookPage1 = FacebookPageUtil.getFacebookPageDetails(fbPageID);
		if (facebookPage1 != null && facebookPage1.id != null)
		{
		    facebookPage1.delete();
		}
		try
		{
		    out.print("" + FacebookPageUtil.deleteOurFacebookTab(fbPageID, fbPageToken));
		}
		catch (JSONException e)
		{
		    e.printStackTrace();
		}
		break;
	    case SAVE_DETAILS:
		String facebookPageID = request.getParameter("facebookPageID");
		String facebookPageToken = request.getParameter("facebookPageToken");
		String facebookPageName = request.getParameter("facebookPageName");
		String formID = request.getParameter("formID");
		String formName = request.getParameter("formName");

		try
		{
		    response.setContentType("text/plain");
		    if (FacebookPageUtil.linkOurFacebookTab(facebookPageID, facebookPageToken, formName))
		    {
			FacebookPage facebookPage = FacebookPageUtil.getFacebookPageDetails(facebookPageID);
			if (facebookPage != null && facebookPage.id != null)
			{
			    facebookPage.form_id = formID;
			    facebookPage.form_name = formName;
			    facebookPage.domain = NamespaceManager.get();
			    facebookPage.save();
			    out.print("true");
			}
			else
			{
			    FacebookPage fbpage = new FacebookPage(NamespaceManager.get(), facebookPageID, facebookPageName, formID, formName);
			    fbpage.save();
			    out.print("true");
			}
		    }
		    else
		    {
			out.print("false");
		    }
		}
		catch (JSONException e)
		{
		    e.printStackTrace();
		}
		break;
	    default:
		break;
	    }
	}
    }

    public String getAuthAndPages(HttpServletRequest request) throws JSONException
    {
	HttpSession currentSession = request.getSession();
	Boolean isLoggedinWithFB = (Boolean) currentSession.getAttribute("fbpage_logged_in");

	JSONObject data = new JSONObject();
	data.put("app_id", FacebookPageUtil.getAPPID());
	data.put("oauth_url", FacebookPageUtil.getLoginRedirectURL());
	data.put("pages", "[]");
	data.put("linked_pages", FacebookPageUtil.getLinkedFacebookPages(NamespaceManager.get()));

	if (isLoggedinWithFB != null && isLoggedinWithFB)
	{
	    data.put("is_authenticated", "true");
	    String accessToken = (String) currentSession.getAttribute("fbpage_user_accesstoken");
	    if (accessToken != null)
	    {
		data.put("pages", FacebookPageUtil.getUserPages(accessToken));
		data.put("userInfo", FacebookPageUtil.getUserInfo(accessToken));
	    }
	}
	else
	{
	    // return oauth link
	    data.put("is_authenticated", "false");
	}

	return data.toString();

    }

}