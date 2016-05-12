package com.agilecrm.reports;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.SearchFilter;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>Reports</code> provides advanced report generation. It uses Document
 * search to get the matching results based on the {@link SearchRule}.</p>
 * 
 * @author Yaswanth
 */
@SuppressWarnings("serial")
@XmlRootElement
@Cached
public class Reports extends SearchFilter implements Serializable
{

    // Key
    @Id
    public Long id;

    // Name of report
    @NotSaved(IfDefault.class)
    public String name = null;

    public static enum ReportType
    {
	Contact, Opportunity,Campaign
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

    /** List of fields, LinkedHashSet to preserve the order of the fields */
    @NotSaved(IfDefault.class)
    public LinkedHashSet<String> fields_set = new LinkedHashSet<String>();

    @NotSaved(IfDefault.class)
    public String sendTo = null;

    @NotSaved(IfDefault.class)
    public String activity_time = "09:00";

    @NotSaved(IfDefault.class)
    public String activity_weekday = "2";

    @NotSaved(IfDefault.class)
    public String activity_day = "1";

    @NotSaved(IfDefault.class)
    public String report_timezone;
    
    @NotSaved(IfDefault.class)
    public String campaignId;

    public static ObjectifyGenericDao<Reports> dao = new ObjectifyGenericDao<Reports>(Reports.class);

    public Reports()
    {

    }

    public Reports(Duration duration, String name, List<SearchRule> rules)
    {
	this.name = name;
	this.duration = duration;
	this.rules = rules;
    }

    /**
     * Saves the report
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Generate contacts based on the rule element
     * 
     * @return
     */
    /*@SuppressWarnings("rawtypes")
    public Collection generateReports()
    {
	SearchRule rule = new SearchRule();
	rule.LHS = "type";
	rule.CONDITION = RuleCondition.EQUALS;
	rule.RHS = "PERSON";
	rules.add(rule);
	return new AppengineSearch<Contact>(Contact.class).getAdvacnedSearchResults(rules);
    }*/

    /**
     * Generates results with cursor and count. It is used to show report
     * results in report results page
     * 
     * @param count
     * @param cursor
     * @return
     */
    @SuppressWarnings("rawtypes")
    public Collection generateReports(int count, String cursor)
    {
	return new AppengineSearch<Contact>(Contact.class).getAdvacnedSearchResultsForFilter(this, count, cursor, null);
    }

    @JsonIgnore
    public Long getCount()
    {
	SearchRule rule = new SearchRule();
	rule.LHS = "type";
	rule.CONDITION = RuleCondition.EQUALS;
	rule.RHS = "PERSON";
	rules.add(rule);
	return new AppengineSearch<Contact>(Contact.class).query.getCount(rules);
    }
}