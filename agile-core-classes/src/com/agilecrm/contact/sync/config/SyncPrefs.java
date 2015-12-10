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
 * Class SyncPrefs contains required properties that found in most of third
 * party client for import contacts and save prefs
 * 
 * @author jitendra
 */
@XmlRootElement
public class SyncPrefs implements Serializable
{

    /** Id */
    @Id
    public Long id;

    /** api key */
    @NotSaved(IfDefault.class)
    public String apiKey = null;

    /** Access token for OAuth. */
    @NotSaved(IfDefault.class)
    public String token = null;

    /** secret key */
    @NotSaved(IfDefault.class)
    @JsonIgnore
    public String secret;

    /** refresh token */
    @NotSaved(IfDefault.class)
    @JsonIgnore
    public String refreshToken = null;

    /** holds date time(unix timestamp) of last sync to client. */
    @NotSaved(IfDefault.class)
    public Long last_synced_to_client = 0L;

    /** last_synced_from_client date time (timestamp). */
    @NotSaved(IfDefault.class)
    public Long last_synced_from_client = 0L;
    // store cursor of updated contact while uploading contact to client ie google
    @NotSaved(IfDefault.class)
    public Long last_synced_updated_contacts_to_client = 0L;

    



    /**
     * hold boolean value set true if sync is in progress state other wise set
     * false basically this is for button enable and disable sync button from UI
     */
    @NotSaved(IfDefault.class)
    public boolean inProgress = false;



    /**
     * Instantiates a new sync prefs.
     */
    public SyncPrefs()
    {

    }
}
