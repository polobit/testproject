package com.agilecrm.search.document;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.agilecrm.document.Document;
import com.agilecrm.search.BuilderInterface;
import com.agilecrm.search.QueryInterface.Type;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.StringUtils2;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.Index;
import com.googlecode.objectify.Key;

public class DocumentDocument extends com.agilecrm.search.document.Document implements BuilderInterface
{

    @Override
    public void add(Object entity)
    {
	Document document = (Document) entity;

	com.google.appengine.api.search.Document.Builder doc = com.google.appengine.api.search.Document.newBuilder();

	Set<String> fields = new HashSet<String>();

	fields.add(document.name);

	doc.addField(Field.newBuilder().setName("search_tokens")
		.setText(SearchUtil.normalizeSet(StringUtils2.getSearchTokens(fields))));

	doc.addField(Field.newBuilder().setName("type").setText(Type.DOCUMENT.toString()));

	DomainUser documentOwner = null;

	try
	{
	    documentOwner = document.getOwner();
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	// Sets owner of the opportunity
	if (documentOwner != null)
	    doc.addField(Field.newBuilder().setName("owner_id").setText(document.id.toString()));

	// Adds document to Index
	addToIndex(doc.setId(document.id.toString()).build());

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
     *            {@link com.google.appengine.api.search.Document}
     */
    private void addToIndex(com.google.appengine.api.search.Document doc)
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
	List<Key<Document>> document_keys = new ArrayList<Key<Document>>();
	for (Long id : ids)
	{
	    document_keys.add(new Key<Document>(Document.class, id));
	}

	return Document.dao.fetchAllByKeys(document_keys);
    }
}