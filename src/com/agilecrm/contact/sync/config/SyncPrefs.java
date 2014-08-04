/**
 * 
 */
package com.agilecrm.contact.sync.config;

import java.io.Serializable;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

/**
 * The Class SyncPrefs.
 * 
 * @author jitendra
 */
@XmlRootElement
public class SyncPrefs implements Serializable
{

    /** The id. */
    @Id
    public Long id;

    /** The api key. */
    @NotSaved(IfDefault.class)
    public String apiKey = null;

    /** Access token for OAuth. */
    @NotSaved(IfDefault.class)
    public String token = null;

    /** The secret. */
    @NotSaved(IfDefault.class)
    @JsonIgnore
    public String secret;

    /** The last_synced_to_client. */
    @NotSaved(IfDefault.class)
    public Long last_synced_to_client = 0L;

    /** The last_synced_from_client. */
    @NotSaved(IfDefault.class)
    public Long last_synced_from_client = 0L;
    
    /** The last_synced_updated_contacts_to_client. */
    @NotSaved(IfDefault.class)
    public Long last_synced_updated_contacts_to_client = 0L;
    
    /** The last sync check point. */
    @NotSaved(IfDefault.class)
    public String lastSyncCheckPoint = null;
    
    /** The my_contacts. */
    @NotSaved(IfDefault.class)
    @Unindexed
    public Boolean my_contacts = true;



    /** The is completed. */
    @NotSaved(IfDefault.class)
    public boolean inProgress = false;
    
    /** The sync_to_group. */
    @NotSaved(IfDefault.class)
    public String sync_to_group = null;

    /** The sync_from_group. */
    @NotSaved(IfDefault.class)
    public String sync_from_group = null;

    /** The conflict. */
    @NotSaved(IfDefault.class)
    public String conflict = null;

    /** The others params. */
    @NotSaved(IfDefault.class)
    public String othersParams = null;


    /**
     * Instantiates a new sync prefs.
     */
    public SyncPrefs()
    {

    }
}
