package com.agilecrm;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ipaccess.IpAccessUtil;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.NamespaceManager;

public class UserFingerPrintInfo implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
     * Represents name of the session attribute
     */
    public static final String FINGER_PRINT_SESSION_NAME = "fingerprint";
	
	// Fingerprint
	public String finger_print = null;
	
	// Fingerprint validation
	public boolean valid_finger_print = true;
	
	// IP validataion
	public boolean valid_ip = true;
	
	// Generated verification code
	public String verification_code = null;
	
	// Browser info
	Map<String, String> info = new HashMap<String, String>();
	
	public UserFingerPrintInfo(){}
	
	/**
	 * Resave Finger Print Session
	 * @param request
	 */
	public void set(HttpServletRequest request)
	{
	    request.getSession().setAttribute(FINGER_PRINT_SESSION_NAME, this);
	}
	
	public void validateUserFingerPrint(DomainUser domainUser, HttpServletRequest request){
		
		this.set(request);
		
		// Get Fingerprint
		String browserFingerPrint = request.getParameter("finger_print");
		if(StringUtils.isNotBlank(browserFingerPrint))
			browserFingerPrint = browserFingerPrint.trim();
		System.out.println("Browser FP = " + browserFingerPrint);
		
		// Get actual finger prints
    	Set<String> finger_prints = domainUser.finger_prints;
    	
    	System.out.println("finger_prints = " + finger_prints);
    	
    	// Check null and proceed check with existing ones 
		if(StringUtils.isNotBlank(browserFingerPrint) && domainUser.is_secure && finger_prints != null && finger_prints.size() > 0 && !finger_prints.contains(browserFingerPrint))
			 valid_finger_print = false;
		
		finger_print = browserFingerPrint;
		
		// IP Validation from request scope
		valid_ip = IpAccessUtil.isValidIpOpenPanel(request);
		
		if(!"admin".equalsIgnoreCase(NamespaceManager.get()))
		{
			valid_ip = true;
			valid_finger_print = true;
		}
		
		// Resave
		set(request);
		
	}
	
	private void generateOAuthToken(HttpServletRequest request, DomainUser domainUser){
		/*int randomNumber = (int)( Math.random() * 10000 );
		if(randomNumber < 1000)
			randomNumber = randomNumber*10;*/
		Random r = new Random();
		int Low = 1000;
		int High = 9999;
		this.verification_code = (r.nextInt(High-Low) + Low) + "";
			
		System.out.println(domainUser.email + " verification_code = " + verification_code);
		// Resave
		set(request);
	}
	
	private void addUserBrowserInfo(HttpServletRequest request, DomainUser domainUser) {
		
		try {
			
			// Create info
			Map<String, String> data = new HashMap<String, String>();
			if(StringUtils.isBlank(this.verification_code)){
				generateOAuthToken(request, domainUser);
			}
			
			data.put("generatedOTP", this.verification_code);
			data.put("browser_os", request.getParameter("browser_os"));
			data.put("browser_name", request.getParameter("browser_Name"));
			data.put("browser_version",request.getParameter("browser_version"));
			data.put("email", domainUser.email);
			data.put("domain", domainUser.domain);
			data.put("IP_Address", request.getRemoteAddr());
			data.put("name",domainUser.name );
			data.put("city",request.getHeader("X-AppEngine-City"));	
			System.out.println("data "+data);
			
			// Add to this ref
			this.info = data;
			
			// Resave
			set(request);
		} catch (Exception e) {
			ExceptionUtils.getFullStackTrace(e);
		}
		
	}

	public static UserFingerPrintInfo getUserAuthCodeInfo(HttpServletRequest request){
		UserFingerPrintInfo info =  (UserFingerPrintInfo) request.getSession().getAttribute(FINGER_PRINT_SESSION_NAME);
		if(info == null){
			info = new UserFingerPrintInfo();
			info.set(request);
		}
		
		return info;
	}
	
	public void generateOTP(HttpServletRequest request, DomainUser domainUser){
		
		// Generate token
		generateOAuthToken(request, domainUser);

		// Set info in session for future usage 
		addUserBrowserInfo(request, domainUser);
	}
	

}
