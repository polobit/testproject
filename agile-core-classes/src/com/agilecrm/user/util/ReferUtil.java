package com.agilecrm.user.util;

import com.agilecrm.user.Referer;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

public class ReferUtil {
	
	public static Referer getReferrer(){
	Objectify ofy = ObjectifyService.begin();
	Referer referer = ofy.query(Referer.class).get();
	if(referer == null)
		referer = new Referer();
	return referer;
	}
    

}
