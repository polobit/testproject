package com.agilecrm.reports;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
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

    @Indexed
    @NotSaved(IfDefault.class)
    public boolean is_reports_enabled = false;

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

    @NotSaved
    public Long domain_user_id = null;

    @NotSaved(IfDefault.class)
    @Indexed
    private Key<DomainUser> owner_key = null;

    public static ObjectifyGenericDao<Reports> dao = new ObjectifyGenericDao<Reports>(
	    Reports.class);

    public Reports()
    {

    }

    public Reports(Duration duration, String name, boolean is_reports_enabled,
	    List<SearchRule> rules)
    {
	this.name = name;
	this.is_reports_enabled = is_reports_enabled;
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

    @PrePersist
    void prePersit()
    {
	owner_key = new Key<DomainUser>(DomainUser.class, domain_user_id);
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
	return dao.ofy().query(Reports.class)
		.filter("is_reports_enabled", true)
		.filter("duration", duration).list();

    }

    /**/
    @XmlElement(name = "domainUser")
    public DomainUser getDomainUser()
    {
	if (owner_key != null)
	{
	    // If user is deleted no user is found with key so set user to null
	    // and return null
	    try
	    {
		return DomainUserUtil.getDomainUser(owner_key.getId());
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
		return null;
	    }
	}
	return null;

    }
}