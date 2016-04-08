package com.agilecrm.activities;

import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.document.Document;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.workflows.Workflow;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * wrapper class used to get the respective object based on entity_id in
 * activities
 * 
 * @author jagadeesh
 *
 */
public class DaoActivity
{

    /**
     * Class information used to create instance according to name of the class
     * 
     */
    public enum ClassEntities
    {
	CONTACT(Contact.class),

	DEAL(Opportunity.class),

	EVENT(Event.class),

	DOCUMENT(Document.class),

	TASK(Task.class),

	CAMPAIGN(Workflow.class),
	
	TICKET(Tickets.class);

	Class clazz;

	private ClassEntities(Class clazz)
	{
	    this.clazz = clazz;
	}

	public Class getClazz()
	{
	    return clazz;
	}
    }

    public static Class getInstace(String className)
    {
	ClassEntities entity = ClassEntities.valueOf(className);
	if (entity == null)
	    return null;

	Class<?> clazz = entity.getClazz();

	return clazz;
    }

    /**
     * 
     * @param className
     *            entity_name as a string
     * @param entityid
     *            entity id which is stored in entity_id field
     * @return
     * @throws EntityNotFoundException
     */
    public static Object getInstace(String className, Long entityid) throws EntityNotFoundException
    {

	Class cls = getInstace(className);

	Objectify ofy = ObjectifyService.begin();

	Object ob = ofy.query(cls).filter("id", entityid).get();
	return ob;

    }
}
