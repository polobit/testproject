package com.agilecrm.videorecords;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Cached
public class VideoRecord {

  @Id
  public Long id;

  @NotSaved(IfDefault.class)
  public String name = null;

  public Long uploaded_time = 0L;

  @NotSaved(IfDefault.class)
  public String url = null;

  @NotSaved(IfDefault.class)
  public String thumb_url = null;

  @NotSaved
  public String owner_id = null;

  /**
   * Key object of DomainUser.
   */
  @NotSaved(IfDefault.class)
  private Key<DomainUser> ownerKey = null;

  /**
   * ObjectifyDao of Document.
   */
  public static ObjectifyGenericDao<VideoRecord> dao = new ObjectifyGenericDao<VideoRecord>(
      VideoRecord.class);

  /**
   * Default Constructor.
   */
  public VideoRecord() {}

  public VideoRecord(String name, String url) {
    this.name = name;
    this.url = url;
  }

  /**
   * Gets domain user with respect to owner id if exists, otherwise null.
   * 
   * @return Domain user object.
   * @throws Exception when Domain User not exists with respect to id.
   */
  @XmlElement(name = "owner")
  public DomainUser getOwner() throws Exception {
    if (ownerKey != null) {
      try {
        // Gets Domain User Object
        return DomainUserUtil.getDomainUser(ownerKey.getId());
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
    return null;
  }

  /**
   * Saves in dao.
   */
  public void save() {
    dao.put(this);
  }

  /**
   * Deletes Uploaded Document from dao.
   */
  public void delete() {
    dao.delete(this);
  }

  /**
   * Sets uploaded time, owner key, related to contacts, deals, cases. PrePersist is called each
   * time before object gets saved.
   */
  @PrePersist
  private void PrePersist() {
    // Initializes created Time
    if (uploaded_time == 0L)
      uploaded_time = System.currentTimeMillis() / 1000;

    // If owner_id is null
    if (owner_id == null) {
      UserInfo userInfo = SessionManager.get();
      if (userInfo == null)
        return;

      owner_id = SessionManager.get().getDomainId().toString();
    }

    // Saves domain user key
    ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(owner_id));

  }

  @Override
  public String toString() {
    return "VideoRecord [id=" + id + ", name=" + name + ", uploaded_time=" + uploaded_time
        + ", url=" + url + ", owner_id=" + owner_id + ", ownerKey=" + ownerKey + "]";
  }

}
