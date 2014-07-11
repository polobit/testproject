/**
 * 
 */
package com.agilecrm.contact.sync.config;

import java.io.Serializable;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * @author jitendra
 * 
 */
@XmlRootElement
@Cached
@Entity
public class SyncPrefs implements Serializable
{

    /**
     * 
     */
    // private static final long serialVersionUID = 1L;
    @Id
    public Long id;
    @NotSaved(IfDefault.class)
    public String apiKey = null;
    /** Access token for OAuth */
    @NotSaved(IfDefault.class)
    public String token = null;
    @NotSaved(IfDefault.class)
    @JsonIgnore
    public String secret;
    @NotSaved(IfDefault.class)
    public String refreshToken = null;
    @NotSaved(IfDefault.class)
    public Long last_synced_to_client = 0L;
    @NotSaved(IfDefault.class)
    public Long last_synced_from_client = 0L;

    public SyncPrefs()
    {

    }
}
