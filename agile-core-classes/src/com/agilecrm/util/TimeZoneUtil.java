package com.agilecrm.util;

import static com.agilecrm.session.SessionManager.AUTH_SESSION_COOKIE_NAME;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;


/**
 * This class will be used in JSPs to fetch the TimeZones from Java API.
 * 
 * @author ravitheja
 *
 */
public class TimeZoneUtil {

	public static final String ACCOUNT_PREFS = "AccountPref";
	
	public static final String D_QUOTE = "\"";
	public static final String ASTRISK = "*";
	public static final String COMMA = ",";
	public static final String COLON = ":";
	
	private static final String DEFAULT_UTC = "UTC";
	private static final String SELECT_TIMEZONE_STR = "Select time zone";
	private static final String EMPTY_TIMEZONE_KEY = "empty_timezone";
	
	public static String timeZone;
	
	
	/**
	 * This method replaces the static list of timezones in the JSPs.
	 * Customized to be compatible for all the nodes and templates in the campaigns,
	 * wherever timezone list is used.
	 * 
	 * @param request
	 * @param accountPrefTZ
	 * @param defaultTZ
	 * @return
	 */
	public static String getJavaTimeZones(HttpServletRequest request, String accountPrefTZ, boolean defaultTZ) {
		
        StringBuffer result = new StringBuffer();
        String javaTZ = null; 
        String fullTZ = null;

        /** for 'Addtask' node;  */ 
        if(request != null) {
	        
        	UserInfo userInfo = (UserInfo) request.getSession().getAttribute(AUTH_SESSION_COOKIE_NAME);
	        AgileUser user = AgileUser.getCurrentAgileUserFromDomainUser(userInfo.getDomainId());
	        UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(user);
	        if(userPrefs != null)
	        	timeZone = userPrefs.timezone;
	        
	        if(timeZone == null) 
	        	timeZone = DEFAULT_UTC;
        } 
        /** for 'Wait' node; and
         * cart_abandonment, auto_responder, user_onboarding, signup_welcome templates  */
        else if(ACCOUNT_PREFS.equalsIgnoreCase(accountPrefTZ)) {
        	
        	timeZone = AccountPrefsUtil.getAccountPrefs().timezone;
            
        	if(StringUtils.isEmpty(timeZone)) {
        		result.append(D_QUOTE + ASTRISK + SELECT_TIMEZONE_STR + D_QUOTE + COLON 
            			+ D_QUOTE + EMPTY_TIMEZONE_KEY + D_QUOTE + COMMA);
            	//result.append("\""+"*Select time zone"+"\":\""+"empty_timezone"+"\",")
            }
        }
        
        /** Collection of fullforms for timezones. */
        Map<String, String> zones = getFullTZMap();
        
        /** Timezones as defined in Java API */
        String[] allTimeZones = TimeZone.getAvailableIDs();    
        Arrays.sort(allTimeZones);  
        
        for(int i = 0; i < allTimeZones.length; i++) {
            javaTZ = allTimeZones[i];
            fullTZ = (null != zones.get(javaTZ)) ? zones.get(javaTZ) : javaTZ;

            if(defaultTZ && !StringUtils.isEmpty(timeZone) && timeZone.equals(javaTZ))
            	fullTZ = ASTRISK + fullTZ;
            
        	result.append(D_QUOTE + fullTZ + D_QUOTE + COLON + D_QUOTE + javaTZ + D_QUOTE);
        	//result.append("\""+option+"\":\""+option+"\"");
        	
            if(i != allTimeZones.length -1) result.append(COMMA);
        }
        
        return result.toString();
	}

	/**
	 * This method adds fullforms to the abbreviations for the timezones defined by Java API
	 * @return
	 */
	private static Map<String, String> getFullTZMap() {
		Map<String, String> zones = new HashMap<String, String>();
        
        zones.put("ACT", "ACT (Australian Central Standard Time)");
        zones.put("AET", "AET (Australian Eastern Standard Time)");
        zones.put("AGT", "AGT (Argentina Standard Time)");
        zones.put("ART", "ART (Arabia (Egypt) Standard Time)");
        zones.put("AST", "AST (Alaska Standard Time)");

        zones.put("BET", "BET (Brazil Eastern Time)");
        zones.put("BST", "BST (Bangladesh Standard Time)");
        
        zones.put("CAT", "CAT (Central Africa Standard Time)");
        zones.put("CET", "CET (Central European Summer Time)");
        zones.put("CNT", "CNT (Canada Newfoundland Time)");
        zones.put("CST", "CST (Central Daylight Time (US))");
        zones.put("CST6CDT", "CST6CDT (Canada(Central)/USA(Central)/Mexico)");
        
        zones.put("CTT", "CTT");
        
        zones.put("EAT", "EAT (East Africa Time)");
        zones.put("ECT", "ECT (Central European Summer Time)");
        zones.put("EET", "EET (Eastern European Time)");
        zones.put("EST", "EST (Eastern Standard Time)");
        zones.put("EST5EDT", "EST5EDT (Canada (Eastern))");
        
        zones.put("GB", "GB");

        zones.put("GMT", "GMT (Greenwich Mean Time)");
        zones.put("GMT0", "GMT0");

        zones.put("HST", "HST (Hawaii Standard Time)");

        zones.put("IET", "IET (Indiana Eastern Standard Time)");
        zones.put("IST", "IST (India Standard Time)");
        
        zones.put("JST", "JST");
        zones.put("MET", "MET");
        zones.put("MIT", "MIT");
        zones.put("MST", "MST");
        zones.put("MST7MDT", "MST7MDT (Canada(Mountain)/USA(Mountain)/Mexico(Baja S.))");
        
        zones.put("NET", "NET");
        zones.put("NST", "NST (Canada (Newfoundland Standard Time))");
        zones.put("NZ", "NZ");
        zones.put("NZ-CHAT", "NZ-CHAT");

        zones.put("PLT", "PLT");
        zones.put("PNT", "PNT");
        zones.put("PRC", "PRC");
        zones.put("PRT", "PRT");
        zones.put("PST", "PST");
        zones.put("PST8PDT", "PST8PDT (USA(Pacific)/Canada(Pacific and Yukon))");
        
        zones.put("ROK", "ROK");
        zones.put("SST", "SST");

        zones.put("SystemV/AST4", "SystemV/AST4");
        zones.put("SystemV/AST4ADT", "SystemV/AST4ADT (Canada (Atlantic))");
        zones.put("SystemV/CST6", "SystemV/CST6");
        zones.put("SystemV/CST6CDT", "SystemV/CST6CDT (Canada(Central)/USA(Central)/Mexico)");
        zones.put("SystemV/EST5", "SystemV/EST5");
        zones.put("SystemV/EST5EDT", "SystemV/EST5EDT (Canada (Eastern))");
        zones.put("SystemV/HST10", "SystemV/HST10");
        zones.put("SystemV/MST7", "SystemV/MST7");
        zones.put("SystemV/MST7MDT", "SystemV/MST7MDT (Canada(Mountain)/USA(Mountain)/Mexico(Baja S.))");
        zones.put("SystemV/PST8", "SystemV/PST8");
        zones.put("SystemV/PST8PDT", "SystemV/PST8PDT (USA(Pacific)/Canada(Pacific and Yukon))");
        zones.put("SystemV/YST9", "SystemV/YST9");
        zones.put("SystemV/YST9YDT", "SystemV/YST9YDT");
        
        zones.put("UCT", "UCT (Universal Coordinated Time)");
        zones.put("UTC", "UTC (Universal Coordinated Time)");
        zones.put("VST", "VST (Vietnam Standard Time)");
        zones.put("W-SU", "W-SU (Moscow Standard Time)");
        zones.put("WET", "WET (Western European Time)");
		
        return zones;
	}

}