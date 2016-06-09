package com.agilecrm.user.access;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class JavaScriptUserAccess implements Serializable{

    public static final String FIRST_NAME = "first_name";
    public static final String LAST_NAME = "last_name";
    public static final String EMAIL = "email";
    public static final String COMPANY = "company";
    public static final String TITLE = "title";
    public static final String NAME = "name";
    public static final String URL = "url";
    public static final String WEBSITE = "website";
    public static final String ADDRESS = "address";
    public static final String PHONE = "phone";
    public static final String SKYPEPHONE = "skypePhone";
    public static final String IMAGE = "image";
    public static final String CUSTOM_FILED = "custom_field";
    public static final String TAGS = "tags";
    public static final String OWNER = "owner";

    public static final String CREATE_CONTACT = "create_contact";
    public static final String UPDATE_CONTACT = "update_contact";
    public static final String VIEW_CONTACT = "view_contact";
    
    public JavaScriptUserAccess(){
	
    }

    public Set<String> jsrestricted_propertiess = null;
    public Set<String> jsrestricted_scopes = null;

    public HashSet<String> defaultPropertiesLoad() {
	this.jsrestricted_propertiess = new HashSet<String>() {
	    private static final long serialVersionUID = 1L;

	    {
		add(FIRST_NAME);
		add(LAST_NAME);
		add(EMAIL);
		add(COMPANY);
		add(TITLE);
		add(NAME);
		add(URL);
		add(WEBSITE);
		add(ADDRESS);
		add(PHONE);
		add(SKYPEPHONE);
		add(CUSTOM_FILED);
		add(IMAGE);
		add(TAGS);
		add(OWNER);

	    }
	};


	return (HashSet<String>) jsrestricted_propertiess;
    }
    
    public HashSet<String> defaultJSScopeLoad() {

	this.jsrestricted_scopes = new HashSet<String>() {
	    private static final long serialVersionUID = 1L;

	    {
		add(CREATE_CONTACT);
		add(UPDATE_CONTACT);
		add(VIEW_CONTACT);

	    }
	};

	return (HashSet<String>) jsrestricted_scopes;
    }
}