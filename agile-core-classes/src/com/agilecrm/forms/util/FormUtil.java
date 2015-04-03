package com.agilecrm.forms.util;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.forms.Form;
import com.googlecode.objectify.Query;

public class FormUtil
{
    private static ObjectifyGenericDao<Form> dao = new ObjectifyGenericDao<Form>(Form.class);

    public static List<Form> getAllForms()
    {
	return Form.dao.fetchAll();
    }

    public static Form getFormById(Long formId)
    {
	Query<Form> query = dao.ofy().query(Form.class);
	query.filter("id", formId);
	Form form = query.get();
	if (form == null)
	    return null;
	else
	    return form;
    }

    public static Form getFormByName(String formName)
    {
	Query<Form> query = dao.ofy().query(Form.class);
	query.filter("formName", formName);
	Form form = query.get();
	if (form == null)
	    return null;
	else
	    return form;
    }
}
