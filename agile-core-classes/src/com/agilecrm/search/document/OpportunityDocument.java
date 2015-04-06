package com.agilecrm.search.document;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.search.BuilderInterface;
import com.agilecrm.search.QueryInterface.Type;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.StringUtils2;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Document.Builder;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.Index;
import com.googlecode.objectify.Key;

public class OpportunityDocument extends com.agilecrm.search.document.Document implements BuilderInterface
{

    @Override
    public void add(Object entity)
    {
	Opportunity opportunity = (Opportunity) entity;

	Builder doc = buildOpportunityDoc(opportunity);

	// Adds document to Index
	addToIndex(doc.setId(opportunity.id.toString()).build());

    }

    public Builder buildOpportunityDoc(Opportunity opportunity)
    {
	Document.Builder doc = Document.newBuilder();

	Set<String> fields = new HashSet<String>();

	fields.add(opportunity.name);
	fields.add(opportunity.description);

	// Add custom fields
	fields.addAll(getCustomFieldValues(opportunity.custom_data));

	// Add custom fields to index
	addCustomFieldsToIndex(opportunity.custom_data, SCOPE.DEAL, doc);

	doc.addField(Field.newBuilder().setName("search_tokens")
		.setText(SearchUtil.normalizeSet(StringUtils2.getSearchTokens(fields))));

	doc.addField(Field.newBuilder().setName("type").setText(Type.OPPORTUNITY.toString()));

	DomainUser opportunityOwner = null;

	try
	{
	    opportunityOwner = opportunity.getOwner();
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	// Sets owner of the opportunity
	if (opportunityOwner != null)
	    doc.addField(Field.newBuilder().setName("owner_id").setText(opportunity.id.toString()));
	return doc;
    }

    @Override
    public void edit(Object entity)
    {
	// TODO Auto-generated method stub
	add(entity);
    }

    @Override
    public void delete(String id)
    {
	// TODO Auto-generated method stub
	index.delete(id);
    }

    @Override
    public Index getIndex()
    {
	// TODO Auto-generated method stub
	return index;
    }

    /**
     * Adds Document to index
     * 
     * @param doc
     *            {@link Document}
     */
    private void addToIndex(Document doc)
    {
	// Adds document to index
	index.put(doc);
	System.out.println(index.getName());
	// System.out.println(index.getConsistency());
	System.out.println(index.getSchema());

    }

    @Override
    public List getResults(List<Long> ids)
    {
	// TODO Auto-generated method stub
	List<Key<Opportunity>> opportunity_keys = new ArrayList<Key<Opportunity>>();
	for (Long id : ids)
	{
	    opportunity_keys.add(new Key<Opportunity>(Opportunity.class, id));
	}

	return Opportunity.dao.fetchAllByKeys(opportunity_keys);
    }
}
