package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.cases.Case;
import com.agilecrm.cases.util.CaseUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;

@XmlRootElement
public class ContactFullDetails
{
    // Takes contact id
    Long contact_id;

    public ContactFullDetails()
    {

    }

    public ContactFullDetails(Long id)
    {
	contact_id = id;
    }

    @XmlElement
    public List<Note> getNotes()
    {
	try
	{
	    return NoteUtil.getNotes(contact_id);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return new ArrayList<Note>();
	}
    }

    @XmlElement
    public List<Opportunity> getDeals()
    {
	return OpportunityUtil.getDeals(contact_id, null, null);
    }

    @XmlElement
    public List<Task> getTasks()
    {
	try
	{
	    return TaskUtil.getContactTasks(contact_id);
	}
	catch (Exception e)
	{ // TODO Auto-generated catch block
	    e.printStackTrace();
	    return new ArrayList<Task>();
	}
    }

    @XmlElement
    public List<Case> getCases()
    {
	return CaseUtil.getCases(contact_id, null, null);
    }
}
