package com.agilecrm.search.document;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.deals.CustomFieldData;
import com.agilecrm.search.util.SearchUtil;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.SearchService;
import com.google.appengine.api.search.SearchServiceFactory;

public class Document
{
    public Document()
    {
	// TODO Auto-generated constructor stub
    }

    /**
     * Initializes/get search service for the app
     */
    public SearchService searchService = SearchServiceFactory.getSearchService();

    /**
     * Index for the contact Document, Required to search on contacts document
     */
    public Index index = searchService.getIndex(IndexSpec.newBuilder().setName("contacts"));

    public void addCustomFieldsToIndex(List<CustomFieldData> customFields, CustomFieldDef.SCOPE scope,
	    com.google.appengine.api.search.Document.Builder doc)
    {
	for (CustomFieldData data : customFields)
	{
	    Field.Builder builder = Field.newBuilder();

	    // Get the custom field based on field name
	    CustomFieldDef fieldDef = CustomFieldDefUtil.getFieldByName(data.name, scope);

	    if (fieldDef != null && fieldDef.field_type == CustomFieldDef.Type.DATE)
	    {
		try
		{
		    builder.setName(SearchUtil.normalizeTextSearchString(data.name) + "_time_epoch");

		    builder.setNumber(Double.valueOf(data.value));
		    doc.addField(Field.newBuilder().setNumber(Double.valueOf(data.value)));
		}
		catch (NumberFormatException e)
		{
		    e.printStackTrace();
		}
	    }
	    else
	    {
		if(StringUtils.isEmpty(data.name))
		    continue;
		
		builder.setName(SearchUtil.normalizeTextSearchString(data.name));
		builder.setText(SearchUtil.normalizeString(data.value));
	    }

	    doc.addField(builder);

	}
    }

    public Set<String> getCustomFieldValues(List<CustomFieldData> customDataSet)
    {
	Set<String> fields = new HashSet<String>();
	for (CustomFieldData data : customDataSet)
	{
	    fields.add(data.value);
	}
	return fields;
    }

}
