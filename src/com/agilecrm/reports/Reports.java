package com.agilecrm.reports;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.core.DomainUser;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.QueryDocument;
import com.agilecrm.search.SearchRule;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

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
    public List<SearchRule> rules = new ArrayList<SearchRule>();

    @NotSaved(IfDefault.class)
    public String domain = null;

    @NotSaved
    public Long domain_user_id = null;

    @NotSaved(IfDefault.class)
    @Indexed
    private Key<DomainUser> owner_key = null;

    public static ObjectifyGenericDao<Reports> dao = new ObjectifyGenericDao<Reports>(Reports.class);

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
    public Collection generateReports()
    {
	return QueryDocument.queryDocuments(rules);
    }

    /* Get Contact Filter by id */
    public static Reports getReport(Long id)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /* Fetch list of Report entities of all namespaces */
    public static List<Reports> getAllReports()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{
	    return dao.fetchAll();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /* Get the list of Report entities related to current namespace */
    public static List<Reports> getCurrentNamespaceReports()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{
	    return dao.ofy().query(Reports.class).filter("domain", oldNamespace).list();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    @PrePersist
    void prePersit()
    {
	owner_key = new Key<DomainUser>(DomainUser.class, domain_user_id);
    }

    /* Saved in empty namespace */
    public void save()
    {
	domain = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    dao.put(this);
	}
	finally
	{
	    NamespaceManager.set(domain);
	}
    }

    /*
     * Fetch all the Report entities in App with particular report duration
     * which are reports email enabled
     */
    public static List<Reports> getAllReportsByDuration(Duration duration)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    return dao.ofy().query(Reports.class).filter("is_reports_enabled", true)
		    .filter("duration", duration).list();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
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
		return DomainUser.getDomainUser(owner_key.getId());
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