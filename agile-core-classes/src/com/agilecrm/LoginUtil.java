/**
 *  This file contains the utility methods to be used by various login servlets
 */
package com.agilecrm;

import java.util.HashSet;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.account.AccountPrefs;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.OnlineCalendarPrefs;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.OnlineCalendarUtil;
import com.agilecrm.user.util.UserPrefsUtil;

public class LoginUtil {

	private boolean saveDomainUser = false;
	public static final String ADMIN_DOMAIN_MASTER_PWD = "Agile#$%CRM"; 

	/**
	 * This method will set misc values for a User at login. The user is saved,
	 * if required. Among the values being set are: Timezone for Account
	 * Preferences and User Preferences Online Calendar Preferences for User
	 * 
	 * @param request
	 * @param user
	 */
	public void setMiscValuesAtLogin(HttpServletRequest request, DomainUser user) {
		try {

			System.out.println("Setting Misc values for user: " + user.email + ", having id: " + user.id);

			// Set the UserInfo in the SessionManager. This is required because
			// some of the operations
			// in this method need UserInfo to be set in the SessionManager.
			// This is safe because, at this point, the user is already
			// authenticated
			SessionManager.set(request);

			saveDomainUser = false;

			setAccountTimezone(request);
			setUserInfoTimezone(request);
			user = createOnlineCalendarPrefs(user);
			saveFingerPrint(request, user);

			// Save only if required
			if (saveDomainUser)
				user.save();

			System.out.println("Values set for user: " + user.email + ", having id: " + user.id);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Set the Timezone for this Account in account preferences, if not present
	 * 
	 * @param req
	 */
	private static void setAccountTimezone(HttpServletRequest req) {
		try {
			// Set timezone in account prefs.
			AccountPrefs accPrefs = AccountPrefsUtil.getAccountPrefs();
			if (StringUtils.isEmpty(accPrefs.timezone) || "UTC".equals(accPrefs.timezone)
					|| "GMT".equals(accPrefs.timezone)) {
				accPrefs.timezone = (String) req.getSession().getAttribute("account_timezone");
				accPrefs.save();
			}
		} catch (Exception e) {
			System.out.println("Exception in setting timezone in account prefs.");
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	/**
	 * Set the Timezone in the User Preferences if not present
	 * 
	 * @param req
	 */
	private void setUserInfoTimezone(HttpServletRequest req) {
		try {
			UserPrefs user_prefs = UserPrefsUtil.getUserPrefs(AgileUser.getCurrentAgileUser());
			System.out.println("user_prefs in setUserInfoTimezone --------------- " + user_prefs);
			if (StringUtils.isEmpty(user_prefs.timezone) || "UTC".equals(user_prefs.timezone)) {
				user_prefs.timezone = (String) req.getSession().getAttribute("account_timezone");
				user_prefs.save();
			}
		} catch (Exception e) {
			System.out.println("Exception in setting timezone in user prefs.");
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	/**
	 * Create online Calendar Preferences if not present
	 * 
	 * @param user
	 * @return
	 */
	private DomainUser createOnlineCalendarPrefs(DomainUser user) {
		OnlineCalendarPrefs onlinePrefs = OnlineCalendarUtil.getCalendarPrefs(user.id);
		if (onlinePrefs == null) {
			if (StringUtils.isNotEmpty(user.schedule_id)) {
				onlinePrefs = new OnlineCalendarPrefs(user.schedule_id, user.meeting_types, user.business_hours,
						user.meeting_durations, user.id);
			} else {
				onlinePrefs = new OnlineCalendarPrefs(OnlineCalendarUtil.getScheduleid(user.name), user.id);
			}

			user.schedule_id = onlinePrefs.schedule_id;
			onlinePrefs.save();
		} else {
			if (StringUtils.isBlank(user.schedule_id)
					|| !(onlinePrefs.schedule_id.equalsIgnoreCase(user.schedule_id))) {
				try {
					user.schedule_id = onlinePrefs.schedule_id;
					saveDomainUser = true;
					return user;
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		return user;
	}

	/**
	 * Saves finger print in domain user before request is forwarded to
	 * dashboard (home.jsp)
	 */
	private void saveFingerPrint(HttpServletRequest req, DomainUser domainUser) {
		try {
			UserFingerPrintInfo info = UserFingerPrintInfo.getUserAuthCodeInfo(req);
			System.out.println("info.finger_print =  " + info.finger_print);
			if (StringUtils.isBlank(info.finger_print))
				return;

			if (domainUser.finger_prints == null)
				domainUser.finger_prints = new HashSet<String>();

			if (domainUser.finger_prints.contains(info.finger_print))
				return;

			domainUser.finger_prints.add(info.finger_print);
			saveDomainUser = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public boolean hasValidUserTimezone() {
		UserPrefs user_prefs = UserPrefsUtil.getUserPrefs(AgileUser.getCurrentAgileUser());
		System.out.println("user_prefs in setUserInfoTimezone --------------- " + user_prefs);
		if (user_prefs == null || StringUtils.isEmpty(user_prefs.timezone) || "UTC".equals(user_prefs.timezone))
			return false;

		return true;
	}

	public boolean hasValidAccountTimezone(){
    	 // Set timezone in account prefs.
	    AccountPrefs accPrefs = AccountPrefsUtil.getAccountPrefs();
	    if(accPrefs == null || (StringUtils.isEmpty(accPrefs.timezone) || "UTC".equals(accPrefs.timezone)
			    || "GMT".equals(accPrefs.timezone)))
	    		return false;
	    
	    return true;
    }
	
	public boolean hasValidCalendarPrefs(DomainUser domainUser){
		return (OnlineCalendarUtil.getCalendarPrefs(domainUser.id) != null);
   }
}
