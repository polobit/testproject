package com.agilecrm.search.ui.serialize;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class SearchRule
{
    public String LHS = null;
    public String RHS = null;

    public String RHS_NEW = null;

    public String CONDITION = null;

    public static enum RuleType
    {
	Contact, Opportunity
    }

    public RuleType ruleType = null;
}
