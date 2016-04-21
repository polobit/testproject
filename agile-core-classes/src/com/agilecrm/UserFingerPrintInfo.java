package com.agilecrm;

import java.io.Serializable;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import com.agilecrm.ipaccess.IpAccess;
import com.agilecrm.ipaccess.IpAccessUtil;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.NamespaceManager;

public class UserFingerPrintInfo implements Serializable{
	
	 /**
     * Represents name of the session attribute
     */
    public static final String FINGER_PRINT_SESSION_NAME = "fingerprint";
	
	//Fingerprint
	public String fingerprint = null;
	
	//Fingerprint validation
	public boolean isValidFingerPrint = true;
	
	//IP validataion
	public boolean isValidIP = true;
	
	//Generated verification code
	public String verificationCode = null;
	
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
		//Get Fingerprint
		String userfingerprint = request.getParameter("finger_print");
		System.out.println(userfingerprint);
		// Check null and proceed check with existing ones
		// Get actual finger prints
    	Set<String> finger_prints = domainUser.finger_prints;
    	
		// Checks the wheather fingerprintlist is null or not  
		if(finger_prints == null || finger_prints.size() == 0||finger_prints.contains(userfingerprint))
			 isValidFingerPrint = true;
		
		// Gets the userfingerprint from request
		//String user_finger_print = (String) request.getSession().getAttribute(LoginServlet.SESSION_FINGERPRINT_VAL);
		
		// Checks the condition is userfingerprint present in the list or not
		/*if(finger_prints.contains(userfingerprint)){
			isValidFingerPrint = true;
		}*/
		else{
			isValidFingerPrint = false;
		}
		
		// IP Validation from request scope
		IpAccess ipAccess = IpAccessUtil.getIPListByDomainName(NamespaceManager.get());
		
		//Checks the wheather iplist is null or not  
		if(ipAccess == null || ipAccess.ipList == null || ipAccess.ipList.size() == 0)
			return;	
		
		else
		{
		
		// Gets the userIp from request
		String userIp = request.getRemoteAddr();
		// Checks the condition is userIp present in the list or not
		Set<String> iplist = ipAccess.ipList;
		for (String ip : iplist) {
			System.out.println("ip "+ip);
			if(IpAccessUtil.isValidIPWithRegex(ip, userIp))
				isValidIP= true;
		}
		isValidIP = false;
		}
		// Resave
		set(request);
	}
		

	public String getFingerprint() {
		return fingerprint;
	}

	public void setFingerprint(String fingerprint) {
		this.fingerprint = fingerprint;
	}
	
	public boolean isValidFingerPrint() {
		return isValidFingerPrint;
	}

	public void setValidFingerPrint(boolean isValidFingerPrint) {
		this.isValidFingerPrint = isValidFingerPrint;
	}

	public boolean isValidIP() {
		return isValidIP;
	}

	public void setValidIP(boolean isValidIP) {
		this.isValidIP = isValidIP;
	}
	

}
