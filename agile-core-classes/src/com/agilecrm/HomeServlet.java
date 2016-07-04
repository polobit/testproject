package com.agilecrm;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.ipaccess.IpAccess;
import com.agilecrm.ipaccess.IpAccessUtil;
import com.agilecrm.session.SessionCache;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.Defaults;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>HomeServlet</code> handles request after login/new registration and
 * checks for associated agile user, if user is not there then new user is
 * created and defaults are initialized on it.
 */
@SuppressWarnings("serial")
public class HomeServlet extends HttpServlet
{
    public static final String FIRST_TIME_USER_ATTRIBUTE = "nuser";

    /**
     * Checks whether there is Agile user associated with current Domain user.
     * If there is no Agile user for current user, it creates new AgileUser and
     * sets new user cookie.
     * 
     * @param req
     * @param resp
     * @throws ServletException
     * @throws IOException
     */
    private void setUpAgileUser(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {

	/**
	 * Due to HRD eventual consistency, user entity cannot be retrieved
	 * immediately after saving it. To avoid creating multiple users, after
	 * creating new AgileUser, request is dispatched back to HomeServlelt
	 * with extra parameter 'w', which indicates user is just saved in to
	 * datastore.
	 */
	String isFirstTimerUser = req.getParameter("w");

	// If parameter 'w' is not empty, the user is created and it reached
	// here due to eventual consistency. Request is forwared back to
	// homeservlet again with out creating multiple users
	if (!StringUtils.isEmpty(isFirstTimerUser))
	{
	    redirectBack(req, resp);
	    return;
	}

	// Create new user only if this user is not newly registered user
	if( req.getAttribute(RegisterServlet.IS_NEWLY_REGISTERED_USER_ATTR) == null )
	{
		// Create New User - AgileUser (for this namespace)
		new AgileUser(SessionManager.get().getDomainId()).save();
	}

	req.setAttribute(FIRST_TIME_USER_ATTRIBUTE, true);

	// It load defaults. If request is for the first user in the domain then
	// default are created or else only tour cookie is set
	loadDefaults(resp);

	// Redirect back to home servlet.
	redirectBack(req, resp);
    }

    /**
     * It loads defaults in account. If user logged in is just registered and
     * first user in domain then default contacts, deals, tasks are created
     * along with first time cookie, which is used to show page tour.
     * 
     * @param resp
     */
    private void loadDefaults(HttpServletResponse resp)
    {

	// Sets cookie to show page tour
	setTourCookie(resp);

	// Check if user registered is the first user in the domain, if user is
	// first user then default contact, deals, tasks, etc are created
	if (DomainUserUtil.count() == 1)
	    new Defaults();
    }

    /**
     * Initiates Tour for first time user. sets true on the routes of the pages
     * where tour needs to be initialized.
     */
    private static void setTourCookie(HttpServletResponse response)
    {

	JSONObject tourJson = new JSONObject();
	try
	{
	    tourJson.put("contacts", true);
	    tourJson.put("contact-details", true);
	    tourJson.put("workflows", true);
	    tourJson.put("calendar", true);
	    tourJson.put("workflows-add", true);
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	// Creates and saves a cookies
	Cookie tourCookie = new Cookie("agile_tour", tourJson.toString());
	tourCookie.setPath("/");
	response.addCookie(tourCookie);
    }

    /**
     * This redirect is back to the save servlet to read Agileuser after
     * creating a new one. It is required to overcome the eventual consistency
     * of HRD datasore. Parameter 'w' in URL indicated new agile is already
     * created
     * 
     * @param req
     * @param resp
     * @throws ServletException
     * @throws IOException
     */
    private void redirectBack(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
	req.getRequestDispatcher("/home?w=1").forward(req, resp);
    }

    /**
     * Checks if any agile user associated with the current domain user
     * 
     * @return
     */
    public boolean isNewUser(HttpServletRequest request)
    {
    Boolean isNewUserAttr = (Boolean) request.getAttribute(RegisterServlet.IS_NEWLY_REGISTERED_USER_ATTR);
    
    if( isNewUserAttr != null && isNewUserAttr.booleanValue() == true )
    {
    	return true;
    }
    
	// Gets current AgileUser
	return AgileUser.getCurrentAgileUser() == null;
    }

    /**
     * Saves logged in time in domain user before request is forwarded to
     * dashboard (home.jsp)
     */
    private void setLoggedInTime(HttpServletRequest req, DomainUser domainUser)
    {
	try
	{
	    // saves current time as logged in
	    // time for Domain user
	    setLastLoggedInTime(domainUser);

	    domainUser.setInfo(DomainUser.LOGGED_IN_TIME, new Long(System.currentTimeMillis() / 1000));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Set last logged in time.<br/>
     * Set time from LOGGED_IN_TIME in json. Call before updating current logged
     * in time.
     * 
     * @param domainUser
     *            - the user to whom info is to be added
     */
    private void setLastLoggedInTime(DomainUser domainUser)
    {
	if (domainUser.hasInfo(DomainUser.LOGGED_IN_TIME))
	{
	    domainUser.setInfo(DomainUser.LAST_LOGGED_IN_TIME, domainUser.getInfo(DomainUser.LOGGED_IN_TIME));
	}
    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException
    {

    	// If user is not new, it calls method to set logged in time in current
    	// domain user and forwards request to home.jsp
    	if (!isNewUser(req))
    	{
    		UserFingerPrintInfo browser_auth = UserFingerPrintInfo.getUserAuthCodeInfo(req);
    		if(!browser_auth.valid_finger_print || !browser_auth.valid_ip){
    			req.getRequestDispatcher("fingerprintAuthentication.jsp").forward(req, resp);
    			return;
    		}
    		
    		SessionCache.removeObject(SessionCache.CURRENT_AGILE_USER);
    		SessionCache.removeObject(SessionCache.CURRENT_DOMAIN_USER);

    		// Avoid saving the DomainUser twice.
    		DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
    		
    	    // Saves logged in time in domain user.
    	    setLoggedInTime(req, domainUser);
    	    
    	    try {
    	    	domainUser.save();
    	    } catch(Exception e) {
    	    	e.printStackTrace();
    	    }

    	    String old_ui = req.getParameter("old");
    	     
    		req.getRequestDispatcher(old_ui != null ? "home.jsp" : "home-flatfull.jsp").forward(req, resp);
    	    return;
    	}

    	// If user is new user it will create new AgileUser and set cookie for
    	// initial page tour. It also calls to initialize defaults, if user is
    	// first user in the domain.
    	setUpAgileUser(req, resp);
    }
   public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
    	try 
    	{
    		// Get code from user
	    	String otp = request.getParameter("finger_print_otp");
	    	System.out.println("user otp "+otp);
	    	// Validate exiting one
	    	UserFingerPrintInfo info = UserFingerPrintInfo.getUserAuthCodeInfo(request);
	    	System.out.println("genearated otp = "+info.verification_code);
	    	if(StringUtils.isBlank(otp) || !info.verification_code.equalsIgnoreCase(otp)){
	    		throw new Exception(" Please enter valid verification code.");
	    	} 
	    	
	    	if(!info.valid_ip)
	    	{
	    		IpAccess ipList =  IpAccessUtil.getIPListByDomainName(NamespaceManager.get());
	    		if(ipList != null && ipList.ipList != null){
	    			ipList.ipList.add(request.getRemoteAddr());
	    			ipList.save();
	    			System.out.println(ipList);
	    		}
	    		
	    		
	    	}
	    	// Add to info
    		info.valid_ip = true;
    		info.valid_finger_print = true;
    		info.set(request);
	    	
	    	doGet(request, response);
    	}
    	catch(NumberFormatException e){
    		request.getRequestDispatcher("fingerprintAuthentication.jsp?error=" + "Please enter valid verification code").forward(request, response);
    	}
    	catch(Exception e){
    		e.printStackTrace();
    		System.out.println(ExceptionUtils.getFullStackTrace(e));
    		request.getRequestDispatcher("fingerprintAuthentication.jsp?error=" + e.getMessage()).forward(request, response);
    	}
    	
    }
  
    public static boolean isFirstTimeUser(HttpServletRequest req)
    {
	Object object = req.getAttribute(FIRST_TIME_USER_ATTRIBUTE);

	if (object == null)
	    return false;

	return true;

    }

}