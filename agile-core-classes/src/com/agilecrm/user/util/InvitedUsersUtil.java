package com.agilecrm.user.util;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.InvitedUser;
import com.google.appengine.api.datastore.EntityNotFoundException;

public class InvitedUsersUtil {
	// Dao
	public static ObjectifyGenericDao<InvitedUser> dao = new ObjectifyGenericDao<InvitedUser>(InvitedUser.class);

	public static InvitedUser getUserById(String id) {
		try {
			return dao.get(Long.parseLong(id));
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			return null;
		}
	}
}