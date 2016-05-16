package com.agilecrm.contact.js;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.email.bounce.EmailBounceStatus;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
@XmlRootElement
@Cached
public class JSContact extends Cursor
{
	// Key
    public Long id;

    /**
     * Specifies type of the contact. indicates, this field will get
     * saved into the database
     */
    public Type type = Type.PERSON;

    @JsonIgnore
    public String first_name = "";

    @JsonIgnore
    public String last_name = "";

    @JsonIgnore
    public String name = "";
    
    @JsonIgnore
    public DomainUser owner = null;

    /**
     * Created time of the contact
     */
    @JsonIgnore
    public Long created_time = 0L;

    /**
     * Updated time of the contact
     */
    @JsonIgnore
    public Long updated_time = 0L;

    @JsonIgnore
    public Long last_contacted = 0L;

    @JsonIgnore
    public Long last_emailed = 0L;

    @JsonIgnore
    public Long last_campaign_emaild = 0L;

    @JsonIgnore
    public Long last_called = 0L;

    /**
     * Viewed time of the contact, in milliseconds
     */
    @JsonIgnore
    public Long viewed_time = 0L;
    
    @JsonIgnore
    public ViewedDetails viewed = new ViewedDetails();

    /**
     * Stores current domain user key as owner, if it is null should not save in
     * database
     */
    @JsonIgnore
    private Key<DomainUser> owner_key = null;

    /**
     * Stores the star value of a contact
     */
    public Short star_value = 0;

    /**
     * Lead score of the contact
     */
    public Integer lead_score = 0;

    /**
     * Schema version of the contact used for updating schema
     */
   
    @JsonIgnore
    public Integer schema_version = 1;

    /**
     * Set of tags. Not saved in it, it is used to map tags from client
     * requests, which are further processed in pre persist to save in
     * tagsWithTime variable
     */
    @JsonIgnore
    public LinkedHashSet<String> tags = new LinkedHashSet<String>();

    @JsonIgnore
    public ArrayList<Tag> tagsWithTime = new ArrayList<Tag>();

    /**
     * Stores properties, by embedding the class <code>ContactField</code>. Also
     * includes in the response.
     */
    @XmlElement(name = "properties")
    public List<ContactField> properties = new ArrayList<ContactField>();
   
    @JsonIgnore
    public List<CampaignStatus> campaignStatus = new ArrayList<CampaignStatus>();

    /**
     * Widget properties (twitter, linkedIn etc..) of a contact
     */
    @JsonIgnore
    public String widget_properties = null;

    @JsonIgnore
    private DomainUser Owner = null;

    @JsonIgnore
    public String entity_type = "contact_entity";

    /**
     * related company key of this person, ignored for company entity, this is
     * stored in db
     */
    @JsonIgnore
    public Key<Contact> contact_company_key = null;

    /**
     * related company key, for network communication
     */
    @JsonIgnore
    public String contact_company_id;


    @JsonIgnore
    public List<UnsubscribeStatus> unsubscribeStatus = new ArrayList<UnsubscribeStatus>();// Dao

    @JsonIgnore
    public List<EmailBounceStatus> emailBounceStatus = new ArrayList<EmailBounceStatus>();

   
    @JsonIgnore
    public Long formId = 0L;

}


@XmlRootElement
class ViewedDetails
{
    // Viewed time in milli seconds
    public Long viewed_time = 0L;

    // Viewer id
    public Long viewer_id = null;

    public ViewedDetails()
    {

    }
}
