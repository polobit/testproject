package com.agilecrm.search.ui.serialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * <code>SearchRule</code> includes details about the search condition built,
 * used in contact filters and reports. Variable lhs, rhs, condition represents
 * the field to be queried on, value of the field to be compared and comparing
 * condition respectively
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
public class SearchRule
{
    /**
     * Represents the field name
     */
    public String LHS = null;

    /**
     * Represents the field value, used to compare with condition specified on
     * lhs
     */
    public String RHS = null;

    /**
     * Represents a possible extra condition, used for conditions such as
     * "between" condition
     */
    public String RHS_NEW = null;

    /**
     * Condition to be applied on the lhs and rhs fields
     */
    public String CONDITION = null;

    /**
     * Enum to specify Types of search rule, can be contact, opportunity
     */
    public static enum RuleType
    {
	Contact, Opportunity
    }

    /**
     * Specifies the type of search rule i.e., query to be done on contact
     * entity or on opportunity entity
     */
    public RuleType ruleType = null;
}
