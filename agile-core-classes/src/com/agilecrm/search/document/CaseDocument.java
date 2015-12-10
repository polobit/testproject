package com.agilecrm.search.document;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.agilecrm.cases.Case;
import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.search.BuilderInterface;
import com.agilecrm.search.QueryInterface.Type;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.StringUtils2;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.Index;
import com.googlecode.objectify.Key;

public class CaseDocument extends com.agilecrm.search.document.Document implements BuilderInterface
{

    @Override
    public void add(Object entity)
    {
	Case caseEntity = (Case) entity;

	Document.Builder doc = Document.newBuilder();

	Set<String> fields = new HashSet<String>();

	fields.add(caseEntity.title);
	fields.add(caseEntity.description);

	// Add custom fields
	fields.addAll(getCustomFieldValues(caseEntity.custom_data));

	// Add custom fields to index
	addCustomFieldsToIndex(caseEntity.custom_data, SCOPE.CASE, doc);

	doc.addField(Field.newBuilder().setName("search_tokens").setText(SearchUtil.normalizeSet(StringUtils2.getSearchTokens(fields))));

	doc.addField(Field.newBuilder().setName("type").setText(Type.CASES.toString()));

	// Get owner of the case
	DomainUser caseOwner = caseEntity.getOwner();

	// Sets owner of the task
	if (caseOwner != null)
	    doc.addField(Field.newBuilder().setName("owner_id").setText(caseOwner.id.toString()));
	// Adds document to Index
	addToIndex(doc.setId(caseEntity.id.toString()).build());

    }

    @Override
    public void edit(Object entity)
    {
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

    @Override
    public List getResults(List<Long> ids)
    {
	// TODO Auto-generated method stub
	List<Key<Case>> case_keys = new ArrayList<Key<Case>>();
	for (Long id : ids)
	{
	    case_keys.add(new Key<Case>(Case.class, id));
	}

	return Case.dao.fetchAllByKeys(case_keys);
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

}
