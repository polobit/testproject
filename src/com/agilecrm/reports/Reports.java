package com.agilecrm.reports;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@SuppressWarnings("serial")
@XmlRootElement
public class Reports implements Serializable
{

    // Key
    @Id
    public Long id;

    // Name of report
    @NotSaved(IfDefault.class)
    public String name = null;

    public static enum ReportType
    {
	Contact, Opportunity
    }

    @Indexed
    @NotSaved(IfDefault.class)
    public ReportType report_type = null;

    // Category of report generation - daily, weekly, monthly.
    public static enum Duration
    {
	DAILY, WEEKLY, MONTHLY
    };

    @Indexed
    @NotSaved(IfDefault.class)
    public Duration duration;

    @NotSaved(IfDefault.class)
    @Embedded
    public List<SearchRule> rules = new ArrayList<SearchRule>();

    /** List of fields, LinkedHashSet to preserve the order of the fields */
    @NotSaved(IfDefault.class)
    public LinkedHashSet<String> fields_set = new LinkedHashSet<String>();

    @NotSaved(IfDefault.class)
    public String sendTo = null;

    public static ObjectifyGenericDao<Reports> dao = new ObjectifyGenericDao<Reports>(
	    Reports.class);

    public Reports()
    {

    }

    public Reports(Duration duration, String name, List<SearchRule> rules)
    {
	this.name = name;
	this.duration = duration;
	this.rules = rules;
    }

    /*
     * Generate contacts based on the rule element based on type of
     * report(contacts,deals..)
     */
    @SuppressWarnings("rawtypes")
    public Collection generateReports()
    {
	return AppengineSearch.getAdvacnedSearchResults(rules);
    }

    @SuppressWarnings("rawtypes")
    public Collection generateReports(int count, String cursor)
    {
	return AppengineSearch.getAdvacnedSearchResults(rules, count, cursor);
    }

    /* Get Contact Filter by id */
    public static Reports getReport(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (EntityNotFoundException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}

    }

    /* Get the list of Report entities related to current namespace */
    public static List<Reports> fetchAllReports()
    {
	return dao.fetchAll();
    }

    /* Saved in empty namespace */
    public void save()
    {
	dao.put(this);
    }

    /*
     * Fetch all the Report entities in App with particular report duration,
     * which are reports email enabled
     */
    public static List<Reports> getAllReportsByDuration(String duration)
    {

	System.out.println("fetching the reports");
	return dao.ofy().query(Reports.class).filter("duration", duration)
		.list();

    }
}