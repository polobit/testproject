package com.agilecrm.search.document;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.json.JSONArray;

import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.deals.CustomFieldData;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.search.BuilderInterface;
import com.agilecrm.search.QueryInterface.Type;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;
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
    	try{
		Set<String> fields = new HashSet<String>();

		fields.add(opportunity.name);
		fields.add(opportunity.description);

		// Add custom fields
		fields.addAll(getCustomFieldValues(opportunity.custom_data));

		// Add custom fields to index
		//addCustomFieldsToIndex(opportunity.custom_data, SCOPE.DEAL, doc);
		Set<String> fieldLabelsSet = getOpportunityFieldsMap(opportunity.custom_data, SCOPE.DEAL, doc);
		
		String tokens = SearchUtil.normalizeSet(StringUtils2.getSearchTokens(fields));
		
		StringBuffer search_tokens = new StringBuffer(tokens);
		
		if(opportunity.name != null)
		{
			//We are adding deal name to search tokens without spaces to search deal with full name
			search_tokens.append(" ");
			search_tokens.append(opportunity.name.replaceAll(" ", ""));
			
			doc.addField(Field.newBuilder().setName("name").setText(SearchUtil.normalizeString(opportunity.name.toLowerCase())));
			fieldLabelsSet.add("name");
			
			doc.addField(Field.newBuilder().setName("name_start").setText(opportunity.name.substring(0, 1)));
		}

		doc.addField(Field.newBuilder().setName("search_tokens")
			.setText(search_tokens.toString()));

		doc.addField(Field.newBuilder().setName("type").setText(Type.OPPORTUNITY.toString()));

		DomainUserPartial opportunityOwner = null;
		
		Milestone milestone = null;

		try
		{
		    opportunityOwner = opportunity.getOwner();
		    
		    milestone = MilestoneUtil.getMilestone(opportunity.getPipeline_id());
		}
		catch (Exception e)
		{
		    // TODO Auto-generated catch block
		    e.printStackTrace();
		}

		// Sets owner of the opportunity
		if (opportunityOwner != null && StringUtils.isNotEmpty(opportunityOwner.id.toString()))
		{
			doc.addField(Field.newBuilder().setName("owner_id").setText(opportunityOwner.id.toString()));
			fieldLabelsSet.add("owner_id");
		}
		
		//schema version for ignoring stale data.
		doc.addField(Field.newBuilder().setName("schema_version").setNumber(1.0));
		
		// Sets created date to document with out time component(Search API
		// support date without time component)
		Date truncatedDate = DateUtils.truncate(new Date(opportunity.created_time * 1000), Calendar.DATE);

		/*
		 * Date date = DateUtil.deserializeDate(String.valueOf(truncatedDate
		 * .getTime()));
		 */
		System.out.println(truncatedDate);
		doc.addField(Field.newBuilder().setName("created_time").setDate(truncatedDate));

		doc.addField(Field.newBuilder().setName("created_time_epoch").setNumber(opportunity.created_time.doubleValue()));
		
		fieldLabelsSet.add("created_time");
		
		if(opportunity.milestone_changed_time == null || (opportunity.milestone_changed_time != null && opportunity.milestone_changed_time.equals(null)))
		{
			opportunity.milestone_changed_time = 0L;
		}
		
		// Describes milestone changed time document if milestone changed time is not 0.
		if (opportunity.milestone_changed_time != null)
		{
			if(opportunity.milestone_changed_time.toString().length() > 10){
				opportunity.milestone_changed_time = opportunity.milestone_changed_time / 1000 ;
			}
			Date milestoneChangedDate = DateUtils.truncate(new Date(opportunity.milestone_changed_time * 1000), Calendar.DATE);

			doc.addField(Field.newBuilder().setName("milestone_changed_time").setDate(milestoneChangedDate));

			doc.addField(Field.newBuilder().setName("milestone_changed_time_epoch").setNumber(opportunity.milestone_changed_time));
			
			fieldLabelsSet.add("milestone_changed_time");
		}
		
		if(opportunity.close_date == null || (opportunity.close_date != null && opportunity.close_date.equals(null)))
		{
			opportunity.close_date = 0L;
		}
		
		// Describes close time document if close time is not 0.
		if (opportunity.close_date != null)
		{
			if(opportunity.close_date.toString().length() > 10){
				opportunity.close_date = opportunity.close_date / 1000 ;
			}
			Date closeDate = DateUtils.truncate(new Date(opportunity.close_date * 1000), Calendar.DATE);

			doc.addField(Field.newBuilder().setName("closed_time").setDate(closeDate));

			doc.addField(Field.newBuilder().setName("closed_time_epoch").setNumber(opportunity.close_date));
			
			fieldLabelsSet.add("closed_time");
		}
		
		if(opportunity.won_date == null || (opportunity.won_date != null && (StringUtils.isBlank(opportunity.won_date.toString()) || opportunity.won_date.toString().equalsIgnoreCase("null"))))
		{
			opportunity.won_date = 0L;
		}
		
		// Describes won date document if won date is not 0.
		if (opportunity.won_date != null)
		{
			if(opportunity.won_date.toString().length() > 10){
				opportunity.won_date = opportunity.won_date / 1000 ;
			}
			Date wonDate = DateUtils.truncate(new Date(opportunity.won_date * 1000), Calendar.DATE);

			doc.addField(Field.newBuilder().setName("won_time").setDate(wonDate));

			doc.addField(Field.newBuilder().setName("won_time_epoch").setNumber(opportunity.won_date));
			
			fieldLabelsSet.add("won_time");
		}
		
		Long updatedTime = opportunity.updated_time;
		
		//For old deals updated time is not there so we are assigning created time
		if(updatedTime == null || updatedTime == 0)
		{
			updatedTime = opportunity.created_time;
		}
		
		// Describes updated time document if milestone changed time is not 0.
		Date updatedDate = DateUtils.truncate(new Date(updatedTime * 1000), Calendar.DATE);

		doc.addField(Field.newBuilder().setName("updated_time").setDate(updatedDate));

		doc.addField(Field.newBuilder().setName("updated_time_epoch").setNumber(updatedTime));
		
		fieldLabelsSet.add("updated_time");
		
		doc.addField(Field.newBuilder().setName("archived").setText(String.valueOf(opportunity.archived)));
		
		if (milestone != null)
		{
			doc.addField(Field.newBuilder().setName("pipeline").setText(milestone.id.toString()));
			
			fieldLabelsSet.add("pipeline");
		}
		
		if(opportunity.probability >= 0)
		{
			doc.addField(Field.newBuilder().setName("probability").setNumber(opportunity.probability));
			
			fieldLabelsSet.add("probability");
		}
		
		if (opportunity.getDeal_source_id() != 0)
		{
			doc.addField(Field.newBuilder().setName("deal_source").setText(opportunity.getDeal_source_id().toString()));
			
			fieldLabelsSet.add("deal_source");
		}
		
		if (opportunity.getLost_reason_id() != 0 )
		{
			doc.addField(Field.newBuilder().setName("lost_reason").setText(opportunity.getLost_reason_id().toString()));
			
			fieldLabelsSet.add("lost_reason");
		}
		
		if (opportunity.expected_value != null && opportunity.expected_value >= 0)
		{
			doc.addField(Field.newBuilder().setName("expected_value").setNumber(opportunity.expected_value.doubleValue()));
			
			fieldLabelsSet.add("expected_value");
		}
		
		doc.addField(Field.newBuilder().setName("milestone").setText(SearchUtil.normalizeTag(opportunity.milestone)));
		
		fieldLabelsSet.add("milestone");
		
		if(opportunity.colorName != null)
		{
			doc.addField(Field.newBuilder().setName("color_name").setText(opportunity.colorName.toString()));
			
			fieldLabelsSet.add("color_name");
		}
		
		/*
		 * Get all contact ids seperated by space and adds it in
		 * document "related_contact_ids" if related contacts exist
		 */
		List<String> contactIds = opportunity.getContact_ids();
		if (contactIds != null)
		{
			doc.addField(Field.newBuilder().setName("related_contacts").setText(StringUtils.join(contactIds, " ")));
			
			fieldLabelsSet.add("related_contacts");
		}
		
		addTagFields(opportunity.getTagsList(), doc);
		
		if(opportunity.getTagsList() != null)
		{
			LinkedHashSet<String> deals_tag = new LinkedHashSet<String>();

			for (Tag tag : opportunity.getTagsList())
			{
				deals_tag.add(tag.tag);
			}
			String tags = SearchUtil.normalizeTagsSet(deals_tag);
			if(tags != null)
			{
				doc.addField(Field.newBuilder().setName("tags").setText(SearchUtil.normalizeTagsSet(deals_tag)));
				fieldLabelsSet.add("tags");
			}
		}
		
		/*
		 * Get all field names in deal seperated by space and adds it in
		 * document "field_labels"
		 */
		doc.addField(Field.newBuilder().setName("field_labels").setText(StringUtils.join(fieldLabelsSet, " ")));
		
		doc.setId(opportunity.id.toString()).build();
		try{
			if(opportunity.currency_type != null && opportunity.currency_type != ""){
				doc.addField(Field.newBuilder().setName("currency_type").setText(opportunity.currency_type));
			}
			if(opportunity.currency_conversion_value != null && opportunity.currency_conversion_value > 0 ){
				doc.addField(Field.newBuilder().setName("currency_value").setText(opportunity.currency_conversion_value.toString()));
			}
		}catch(Exception e){
			System.out.println("exception in currency conversion"+e.getMessage());
		}
		
    	}
    	catch(Exception e)
    	{
    		System.out.println("Text search failed:"+e.getMessage());
    	}
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

	@Override
	public void addAsync(Object entity)
	{
		// TODO Auto-generated method stub
		
	}
	
	public Set<String> getOpportunityFieldsMap(List<CustomFieldData> customFields, CustomFieldDef.SCOPE scope, Builder doc)
	{
		Set<String> fieldsSet = new HashSet<String>();
		for (CustomFieldData data : customFields)
		{
		    Field.Builder builder = Field.newBuilder();

		    // Get the custom field based on field name
		    CustomFieldDef fieldDef = CustomFieldDefUtil.getFieldByName(data.name, scope);

		    if (fieldDef != null && fieldDef.searchable && fieldDef.field_type == CustomFieldDef.Type.DATE)
		    {
			try
			{
				if(StringUtils.isEmpty(data.name) || StringUtils.isEmpty(data.value))
				{
					continue;
				}
				
			    builder.setName(SearchUtil.normalizeTextSearchString(data.name) + "_time_epoch");
			    
			    UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();
			    
			    String defaultFormat = "MM/dd/yyyy";
			    
			    if(userPrefs != null && userPrefs.dateFormat != null)
			    {
			    	defaultFormat = userPrefs.dateFormat.replaceAll("m", "M");
			    }
			    
			    SimpleDateFormat sdf = new SimpleDateFormat(defaultFormat);
			    
			    Date cusDate = sdf.parse(data.value);

			    builder.setNumber(cusDate.getTime() / 1000);
			    doc.addField(Field.newBuilder().setNumber(cusDate.getTime() / 1000));
			    
			    fieldsSet.add(SearchUtil.normalizeTextSearchString(data.name) + "_time");
			}
			catch (NumberFormatException e)
			{
			    e.printStackTrace();
			}
			catch (ParseException e)
			{
			    e.printStackTrace();
			}
			catch (Exception e)
			{
			    e.printStackTrace();
			}
		    }
		    else if (fieldDef != null && fieldDef.field_type == CustomFieldDef.Type.NUMBER)
		    {
			try
			{
				if(StringUtils.isEmpty(data.name) || StringUtils.isEmpty(data.value))
				{
					continue;
				}
				
			    doc.addField(Field.newBuilder().setName(SearchUtil.normalizeTextSearchString(data.name) + "_number")
				    .setNumber(Double.valueOf(data.value)));
			    fieldsSet.add(SearchUtil.normalizeTextSearchString(data.name) + "_number");
			}
			catch (Exception e)
			{
			    e.printStackTrace();
			}
		    }
		    else if (fieldDef != null && fieldDef.searchable && (fieldDef.field_type == CustomFieldDef.Type.CONTACT || fieldDef.field_type == CustomFieldDef.Type.COMPANY))
		    {
			try
			{
				String contact_value = "";
				if (data.value != null)
			    {
			    JSONArray jsonArray = new JSONArray(data.value);
			    for (int i=0; i<jsonArray.length(); i++)
			    {
			    	contact_value += String.valueOf(jsonArray.getString(i)) + " ";
			    }
			    }
				
				if(StringUtils.isEmpty(contact_value) || StringUtils.isEmpty(data.name))
				{
					continue;
				}
				
				builder.setName(SearchUtil.normalizeTextSearchString(data.name) + "");

			    builder.setText(contact_value);
			    doc.addField(Field.newBuilder().setText(contact_value));
			    
			    fieldsSet.add(SearchUtil.normalizeTextSearchString(data.name) + "");
			}
			catch (NumberFormatException e)
			{
			    e.printStackTrace();
			}
			catch (Exception e1) {
				e1.printStackTrace();
			}
		    }
		    else if (fieldDef != null && fieldDef.searchable)
		    {
		    	try 
		    	{	
		    		if(StringUtils.isEmpty(data.name) || StringUtils.isEmpty(data.value))
					{
						continue;
					}
					
					builder.setName(SearchUtil.normalizeTextSearchString(data.name));
					builder.setText(SearchUtil.normalizeString(data.value));
					
					fieldsSet.add(SearchUtil.normalizeTextSearchString(data.name));
				} 
		    	catch (Exception e) 
		    	{
					e.printStackTrace();
				}
		    }
		    
		    try 
		    {
		    	doc.addField(builder);
			} 
		    catch (Exception e) {
				e.printStackTrace();
			}

		}
		return fieldsSet;
	}
	
	/**
	 * Add tag fields to document as <tagName>_time and it is saved as a date
	 * field.
	 * 
	 * @param tags_json_string
	 * @param doc
	 */
	private void addTagFields(ArrayList<Tag> tags, Document.Builder doc)
	{
		if (tags == null || tags.isEmpty())
			return;

		// Iterates through each tag and creates field for each tag i.e.,
		// <tagName>_time.
		for (Tag tag : tags)
		{

			System.out.println(tag);

			// Tag value
			String normalizedTag = SearchUtil.normalizeTextSearchString(tag.tag);

			// Created time
			Long TagCreationTimeInMills = tag.createdTime;

			/*
			 * Truncate date Document search date is without time component
			 */

			Date TagCreatedDate = DateUtils.truncate(new Date(TagCreationTimeInMills), Calendar.DATE);

			// If tag doesn't satisfies the regular expression of field name in
			// document search, field is not added to avoid exceptions while
			// searching.
			if (!normalizedTag.matches("^[A-Za-z][A-Za-z0-9_]*$"))
				continue;

			System.out.println(normalizedTag);

			try
			{
				doc.addField(Field.newBuilder().setName(normalizedTag + "_time_epoch")
						.setNumber(TagCreationTimeInMills.doubleValue() / 1000));
			}
			catch (IllegalArgumentException e)
			{
				// TODO: handle exception
				e.printStackTrace();

			}
		}

	}
	public void bulkDelete(String... id)
    {
		index.delete(id);
    }
}
