package com.agilecrm.contact;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.user.util.ContactViewPrefsUtil;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>CustomFieldDef<code> stores the fields of type text, date, list, textarea and check-box.
 * Custom fields are the fields used to store custom information, i.e user desired information.
 * <p>`
 * Custom fields could be added to the user desired scope also, and the scope could be a 
 * person or company or deal. User can also make these fields as required. 
 * While adding a custom field, the user can enable the 'searchable' checkbox to enable search on these fields. 
 * 
 * </p>
 * <p>
 * <code>CustomFieldDef</code> class accepts the fields with unique field labels
 * only. </p>
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
@Cached
public class CustomFieldDef
{
    // Key
    @Id
    public Long id;

    /**
     * Type of the custom field
     */
    public enum Type
    {
	TEXT, DATE, LIST, CHECKBOX, TEXTAREA, NUMBER, FORMULA
    };

    /**
     * Stores the type of the field
     */
    public Type field_type;

    /**
     * Field label of the custom field, and it should not be a duplicate entry.
     */
    @Indexed
    public String field_label;

    /**
     * Description of the custom field
     */
    public String field_description;

    /**
     * Custom field data - useful for list and other custom types
     */
    public String field_data;

    /**
     * Decides if the custom field is required or not
     */
    public boolean is_required = false;

    /**
     * Searches the respective entity, if the field is searchable
     */
    public boolean searchable = false;

    /**
     * Search key. To keep track of what is saved in text search
     */
    @NotSaved
    public String search_key;

    /**
     * Specifies the scope of the custom field should be added
     */
    public static enum SCOPE
    {
	PERSON_COMPANY, PERSON, COMPANY, CONTACT, DEAL, CASE
    };

    public SCOPE scope = SCOPE.CONTACT;

    /**
     * Since custom fields are sortable at the client position of the custom
     * field is stored in position variable
     */
    @NotSaved(IfDefault.class)
    public int position = 0;

    // Dao
    public static ObjectifyGenericDao<CustomFieldDef> dao = new ObjectifyGenericDao<CustomFieldDef>(
	    CustomFieldDef.class);

    /**
     * Default constructor
     */
    public CustomFieldDef()
    {

    }

    /**
     * Creates a custom field with its field type, label and description etc.
     * values
     * 
     * @param fieldType
     *            type of the custom field (test, list, date and check-box)
     * @param fieldLabel
     *            label of the custom field (should be unique)
     * @param fieldDescription
     *            description about the field
     * @param fieldData
     *            semicolon separated data of the field (useful for list type)
     * @param is_required
     *            required status of the custom field
     */
    public CustomFieldDef(Type fieldType, String fieldLabel, String fieldDescription, String fieldData,
	    boolean is_required)
    {
	this.field_data = fieldData;
	this.field_description = fieldDescription;
	this.field_type = fieldType;
	this.field_label = fieldLabel;
	this.is_required = is_required;
    }

    /**
     * Saves the custom field by validating its field_label value. Throws an
     * exception if any duplicate is found. Id of the custom field is also
     * compared to avoid the problems while updating it.
     * 
     * @throws Exception
     */
    public void save() throws Exception
    {
	this.field_label = this.field_label.trim();

	if (id == null)
	    // Fetches all custom fields to check label duplicates
	    for (CustomFieldDef customField : dao.fetchAll())
	    {

		if (customField.field_label.equalsIgnoreCase(this.field_label) && customField.id != id
			&& customField.scope == this.scope)
		{
		    throw new Exception();
		}
	    }

	dao.put(this);
    }

    @PostLoad
    public void postLoad()
    {
	if (searchable)
	{
	    search_key = SearchUtil.normalizeTextSearchString(field_label);
	    if (field_type == Type.DATE)
		search_key += "_time_epoch";
	    else if (field_type == Type.NUMBER)
		search_key += "_number";
	}
    }

    /**
     * Deletes a custom field from the database
     */
    public void delete()
    {
	dao.delete(this);
	ContactViewPrefsUtil.handleCustomFieldDelete(this);
    }

    @Override
    public String toString()
    {
	return "CustomFieldDef: {id: " + id + ", field_type: " + field_type + ", field_label: " + field_label
		+ ", field_description: " + field_description + ", field_data: " + field_data + "is_required :"
		+ is_required + "searchable" + searchable + "}";
    }
}
