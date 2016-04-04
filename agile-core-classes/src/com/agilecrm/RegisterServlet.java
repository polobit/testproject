package com.agilecrm;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.account.AccountPrefs;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.activities.EventReminder;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.sendgrid.util.SendGridUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.RegisterVerificationServlet;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.ReferenceUtil;
import com.agilecrm.util.RegisterUtil;
import com.agilecrm.util.VersioningUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.googlecode.objectify.Key;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

/**
 * <code>RegisterServlet</code> class registers the user account in agile crm.
 * 
 * Register page have Open ID and Sign in options for registering users.
 * <p>
 * When user wants to register using open ID from register page, it navigates to
 * the Google account page after providing the credentials. It will navigate
 * back to the to the Dashboard (Same applicable for the Yahoo).
 * </p>
 * 
 * If user wants to register using the Email ID, it will check for the valid
 * credentials.
 * 
 * @author Manohar
 * 
 * @since October 2012
 */

@SuppressWarnings("serial")
public class RegisterServlet extends HttpServlet
{
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
	doGet(request, response);
    }

    /**
     * If the user registers under an existing domain, or empty domain, it is
     * redirected to choose domain page.
     * <p>
     * It checks whether user wants to register using existing google/yahoo
     * accounts(Oauth registration) or by giving his own credentials (Agile
     * registration).
     * </p>
     * 
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
	String type = request.getParameter("type");
	System.out.println("type   " + type);

	// Type the type of registration for the user - oauth or agile
	try
	{
	    if (type != null)
	    {
		if (type.equalsIgnoreCase("oauth"))
		{
		    registerOAuth(request, response);
		}
		else if (type.equalsIgnoreCase("agile"))
		{
		    registerAgile(request, response);
		}

		return;
	    }
	}
	catch (Exception e)
	{
	    // Send to Login Page
	    request.getRequestDispatcher("register-new1.jsp?error=" + URLEncoder.encode(e.getMessage())).forward(
		    request, response);
	    return;
	}

	request.getRequestDispatcher("register-new1.jsp").forward(request, response);
    }

    /**
     * If the user is registering using Oauth, it first checks if user
     * information already exists. Domain user is created and it is redirected
     * to home page, If not - it checks for the url, if it is present it deletes
     * the previous session and forwards to OpenId Servlet.
     * 
     * @param request
     * @param response
     * @throws Exception
     */
    public void registerOAuth(HttpServletRequest request, HttpServletResponse response) throws Exception
    {

	// Get User Info
	UserInfo userInfo = (UserInfo) request.getSession().getAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

	// If userInfo is present, it has been forwarded back from the OpenId.
	// We create a new user if the domain user is not found
	if (userInfo != null)
	{
	    System.out.println("user info : " + userInfo);
	    System.out.println("namespace :" + NamespaceManager.get());
	    if (DomainUserUtil.count() == 0)
	    {
		DomainUser domainUser = createUser(request, response, userInfo, "");

		response.sendRedirect(VersioningUtil.getLoginUrl(domainUser.domain, request));
		return;
	    }

	    String redirect = (String) request.getSession().getAttribute(LoginServlet.RETURN_PATH_SESSION_PARAM_NAME);
	    System.out.println("redirect :" + redirect);

	    if (redirect != null)
	    {
		request.getSession().removeAttribute(LoginServlet.RETURN_PATH_SESSION_PARAM_NAME);
		response.sendRedirect(redirect);
		return;
	    }

	    response.sendRedirect("/");
	    return;
	}

	// Get server type
	String server = request.getParameter("server");

	// Get OAuth URL
	String url = RegisterUtil.getOauthURL(server);
	if (url == null)
	    throw new Exception("OAuth Server not found for " + server + " - try again");

	// Delete Login Session
	request.getSession().removeAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

	System.out.println("Oauth start");
	// Send to OpenID for Authentication
	if (server.equals("google"))
	    response.sendRedirect("/oauth?hd=" + server);
	else
	    response.sendRedirect("/openid?hd=" + URLEncoder.encode(url));
	return;
    }

    /**
     * Register using form based data
     * 
     * @param request
     * @param response
     * @throws Exception
     */
    void registerAgile(HttpServletRequest request, HttpServletResponse response) throws Exception
    {

	// Get User Name
	String email = request.getParameter("email");

	// Get Password
	String password = request.getParameter("password");

	// Get Name
	String name = request.getParameter("name");
	
	System.out.println("email = " + email);
	System.out.println("name = " + name);
	System.out.println("password = " + password);

	String timezone = request.getParameter("account_timezone");

	if (name != null)
	    name = name.trim();
	
	// Redirect to first page if name and password is empty (This is added newly from website users)
	if(StringUtils.isBlank(name) && StringUtils.isBlank(password))
		throw new Exception("");

	// Get reference code

	if (email == null || password == null)
	    throw new Exception("Invalid Input. Email or password has been left blank.");

	email = email.toLowerCase();

	// Create User
	UserInfo userInfo = new UserInfo("agilecrm.com", email, name);

	DomainUser domainUser = createUser(request, response, userInfo, password);
	// when domain created we are storing timezone in domain level

	setAccountPrefsTimezone(request);

	EventReminder.getEventReminder(domainUser.domain, null);
	
	// Create subaccount in Mandrill after registration
	MandrillSubAccounts.createSubAccountInAgileMandrill(domainUser.domain);
	
	// Creates subUser in SendGrid after registration
	SendGridUtil.createSendGridSubUser(domainUser);
	
	request.getSession().setAttribute("account_timezone", timezone);
	try
	{
		String emailType = (email.split("@")[1]).split("\\.")[0];
		System.out.println("email:: "+email+" and emailType :: "+emailType);
	    // Creates contact in our domain if it is not yopmail
		if(!StringUtils.equalsIgnoreCase("yopmail", emailType))
	    	createUserInOurDomain(request, domainUser);
	}
	catch (Exception e)
	{
		System.out.println(ExceptionUtils.getFullStackTrace(e));
	    e.printStackTrace();
	}

	String redirectionURL = VersioningUtil.getURL(domainUser.domain, request);
	String planValue = request.getParameter(RegistrationGlobals.PLAN_TYPE);
	if(!planValue.equals("Free"))
		redirectionURL+= "#subscribe";
	// Redirect to home page
	response.sendRedirect(redirectionURL);
    }

    private void createUserInOurDomain(HttpServletRequest request, DomainUser user)
    {
	// Form 1
	String userDomain = NamespaceManager.get();
	String emailValue = request.getParameter(RegistrationGlobals.EMAIL);
	String name = request.getParameter(RegistrationGlobals.USER_NAME);
	String planValue = request.getParameter(RegistrationGlobals.PLAN_TYPE);
	String userCount = request.getParameter(RegistrationGlobals.USER_COUNT);

	// Form 2
	String companyName = request.getParameter(RegistrationGlobals.COMPANY_NAME);
	String companySize = request.getParameter(RegistrationGlobals.COMPANY_SIZE);
	String companyType = request.getParameter(RegistrationGlobals.COMPANY_TYPE);
	String role = request.getParameter(RegistrationGlobals.USER_ROLE);
	String phoneNumber = request.getParameter(RegistrationGlobals.PHONE_NUMBER);
	String country = request.getHeader("X-AppEngine-Country");
	String state = request.getHeader("X-AppEngine-Region");
	String city = request.getHeader("X-AppEngine-City");

	List<ContactField> properties = new ArrayList<ContactField>();

	try
	{

	    // Name
	    if (!StringUtils.isEmpty(name))
	    {
		name = name.trim();
		if (name.contains(" "))
		{
		    String[] names = name.split(" ");
		    properties.add(createField(Contact.FIRST_NAME, names[0]));

		    if (names.length > 1)
		    {
			properties.add(createField(Contact.LAST_NAME, names[1]));
		    }
		}
		else
		{
		    properties.add(createField(Contact.FIRST_NAME, name));
		}
	    }

	    // Email
	    if (!StringUtils.isEmpty(emailValue))
	    {
		properties.add(createField(Contact.EMAIL, emailValue));
	    }

	    // Plan
	    if (!StringUtils.isEmpty(planValue))
	    {
		properties.add(createField(RegistrationGlobals.PLAN_CHOSEN, planValue));
	    }

	    // Users count
	    if (!StringUtils.isEmpty(userCount))
	    {
		properties.add(createField(RegistrationGlobals.USERS_COUNT, userCount));
	    }

	    // Company
	    if (!StringUtils.isEmpty(companyName))
	    {
		properties.add(createField(Contact.COMPANY, companyName.trim()));
	    }

	    // Company type
	    if (!StringUtils.isEmpty(companyType))
	    {
		properties.add(createField(RegistrationGlobals.COMPANY_TYPE, companyType));
	    }

	    if (!StringUtils.isEmpty(phoneNumber))
	    {
		properties.add(createField(Contact.PHONE, phoneNumber));
	    }
	    if (!StringUtils.isEmpty(role))
	    {
		properties.add(createField(Contact.TITLE, role));
	    }

	    properties.add(createField(RegistrationGlobals.DOMAIN, userDomain));
	    properties.add(createField(RegistrationGlobals.IP, request.getRemoteAddr()));
	    
	    JSONObject json = new JSONObject();
	    json.put("city", city);
	    json.put("state", state);
	    json.put("country", country);
	    properties.add(createField(Contact.ADDRESS, json.toString()));

	    NamespaceManager.set(Globals.COMPANY_DOMAIN);

	    Contact contact = new Contact();
	    contact.properties = properties;

	    Contact oldContact = ContactUtil.searchContactByEmail(contact.getContactFieldValue(Contact.EMAIL));

	    if (oldContact != null)
	    {
		contact = ContactUtil.mergeContactFeilds(contact, oldContact);
	    }

	    Key<DomainUser> key = null;
	    String version = VersioningUtil.getAppVersion(request);
	    if (!StringUtils.isEmpty(version))
	    {
		key = APIKey.getDomainUserKeyRelatedToAPIKey("fdpa0sc7i1putehsp8ajh81efh");
	    }
	    else
	    {
		key = APIKey.getDomainUserKeyRelatedToAPIKey("ckjpag3g8k9lcakm9mu3ar4gc8");
	    }

	    Tag signupTag = new Tag(RegistrationGlobals.SIGN_UP_TAG);
	    contact.addTag(signupTag);

	    // Dummy check. If user goes through register servlet he is domain
	    // owner.
	    if (user.is_account_owner)
	    {
		Tag domainOwnerTag = new Tag(RegistrationGlobals.DOMAIN_OWNER_TAG);
		contact.addTag(domainOwnerTag);
	    }

	    contact.setContactOwner(key);
	    System.out.println("contact to be saved : " + contact);
	    contact.save();
	    System.out.println("contact after saving : " + contact);
	    String referrar_note_description = getReferrarParameters(request);
	    if (StringUtils.isNotEmpty(referrar_note_description))
	    {
		Note note = new Note("Referrer", referrar_note_description);
		note.addContactIds((contact.id).toString());
		note.save();
	    }
	}
	catch (Exception e)
	{
		System.out.println(ExceptionUtils.getFullStackTrace(e));
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(userDomain);
	}

    }

    private ContactField createField(String name, String value)
    {
	ContactField property = new ContactField();

	property.name = name;
	property.value = value;
	property.type = property.getFieldType();
	return property;
    }

    private String getReferrarParameters(HttpServletRequest request)
    {

	Cookie[] cookies = request.getCookies();

	String utmsource = null;
	String utmcampaign = null;
	String utmmedium = null;
	String utmreferencedomain = null;
	String referrar_note_description = null;

	if (cookies != null && cookies.length > 0)
	{
	    for (int i = 0; i < cookies.length; i++)
	    {
		Cookie cookie = cookies[i];
		System.out.println("cookie " + cookie);
		if (cookie.getName().equals("_agile_utm_source"))
		{
		    utmsource = cookie.getValue();
		}
		if (cookie.getName().equals("_agile_utm_campaign"))
		{
		    utmcampaign = cookie.getValue();
		}
		if (cookie.getName().equals("_agile_utm_medium"))
		{
		    utmmedium = cookie.getValue();
		}
		if (cookie.getName().equals("agile_reference_domain"))
		{
		    utmreferencedomain = cookie.getValue();
		}
		System.out.println("in cookies utm source " + utmsource + " utm medium " + utmmedium + " utm campaign "
			+ utmcampaign + " reference domain " + utmreferencedomain);
		if (cookie.getName().equals("agile_reference_domain"))
		    cookie.setMaxAge(0);

	    }
	    if (StringUtils.isNotEmpty(utmsource) && StringUtils.isNotEmpty(utmcampaign)
		    && StringUtils.isNotEmpty(utmmedium) && StringUtils.isNotEmpty(utmreferencedomain))
		referrar_note_description = " Source - " + utmsource + "\n Campaign -  " + utmcampaign + "\n Medium - "
			+ utmmedium + "\n Reference Domain -" + utmreferencedomain;

	}

	return referrar_note_description;
    }

    /**
     * For creating Domain user, it will check whether the user is present
     * already with that email. Otherwise, it will capture all information of
     * user such as IP address, Country, city, etc.
     * <p>
     * In this case, Domain user created is owner of that domain and he should
     * be admin and cannot be disabled.
     * </p>
     * 
     * @param request
     * @param response
     * @param userInfo
     * @param password
     * @return DomainUser
     * @throws Exception
     */
    DomainUser createUser(HttpServletRequest request, HttpServletResponse response, UserInfo userInfo, String password)
	    throws Exception
    {

	// Get Domain
	String domain = NamespaceManager.get();
	if (StringUtils.isEmpty(domain))
	    if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
		throw new Exception("Invalid Domain. Please go to choose domain.");

	// Get Domain User with this name, password - we do not check for domain
	// for validity as it is verified in AuthFilter
	DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(userInfo.getEmail());
	if (domainUser != null)
	{
	    // Delete Login Session
	    request.getSession().removeAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

	    throw new Exception("User with same email address already exists in our system for " + domainUser.domain
		    + " domain");
	}

	HttpSession session = request.getSession();
	session.setAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);

	try
	{ // Sets session Plan plan =
	    Plan plan = SubscriptionUtil.signUpPlanFromRequest(request);
	    if (plan != null)
		session.setAttribute(RegistrationGlobals.REGISTRATION_PLAN_IN_SESSION, plan);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	String reference_domain = getReferenceDomainFromCookie(request);

	System.out.println("reference domain in register servlet " + reference_domain);
	// Create Domain User, Agile User
	domainUser = new DomainUser(domain, userInfo.getEmail(), userInfo.getName(), password, true, true,
		reference_domain);

	// Set IP Address
	domainUser.setInfo(DomainUser.IP_ADDRESS, "");
	domainUser.setInfo(DomainUser.COUNTRY, request.getHeader("X-AppEngine-Country"));
	domainUser.setInfo(DomainUser.CITY, request.getHeader("X-AppEngine-City"));
	domainUser.setInfo(DomainUser.LAT_LONG, request.getHeader("X-AppEngine-CityLatLong"));
	domainUser.save();

	if (domainUser != null && reference_domain != null)
	{
	    ReferenceUtil.updateReferralCount(reference_domain);
	}

	try
	{
	    RegisterVerificationServlet.storeIpInMemcache(request, domainUser.domain);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	userInfo.setDomainId(domainUser.id);
	return domainUser;
    }

    /**
     * 
     * @param request
     * @return reads all cookies and check for reference_domain cookie and
     *         returns
     */
    public String getReferenceDomainFromCookie(HttpServletRequest request)
    {

	Cookie[] cookies = request.getCookies();

	System.out.println("reading cookies");
	if (cookies != null && cookies.length > 0)
	{
	    for (int i = 0; i < cookies.length; i++)
	    {
		Cookie c = cookies[i];
		if (c.getName().equals("agile_reference_domain"))
		{
		    String reference_domain = c.getValue();
		    if (reference_domain != null)
		    {
			if (ReferenceUtil.checkReferenceDomainExistance(reference_domain))
			    return reference_domain;

		    }

		}

	    }
	}
	return null;
    }

    /**
     * stores timezone in account prefs in domain level
     * 
     * @param req
     */
    private void setAccountPrefsTimezone(HttpServletRequest req)
    {
	try
	{
	    // Set timezone in account prefs.
	    AccountPrefs accPrefs = AccountPrefsUtil.getAccountPrefs();
	    if (StringUtils.isEmpty(accPrefs.timezone) || "UTC".equals(accPrefs.timezone)
		    || "GMT".equals(accPrefs.timezone))
	    {
		accPrefs.timezone = req.getParameter("account_timezone");
		accPrefs.save();
	    }
	}
	catch (Exception e)
	{
	    System.out.println("Exception in setting timezone in account prefs.");
	}
    }
    
    public static void main(String[] args) {
    	String email = "info@mpagenciadigital.com.br";
    	String emailType = (email.split("@")[1]).split("\\.")[0];
    	System.out.println(emailType);
	}
}
