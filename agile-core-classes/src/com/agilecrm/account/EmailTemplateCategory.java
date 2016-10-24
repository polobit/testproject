package com.agilecrm.account;

import javax.persistence.Id;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.account.util.EmailTemplateCategoryUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>EmailTemplateCategory</code> is the base class for all the emailTemplate categories created at
 * client-side. Each emailTemplateCategory object consists of emailTemplateCategory-id(generated),
 * emailTemplateCategory name, created time and owner.
 * <p>
 * emailTemplateCategory are useful categories the Email Templates.
 * </p>
 * <p>
 * The <code>EmailTemplateCategory</code> class provides methods to create 
 * and get the emailTemplateCategories.
 * </p>
 * 
 * @author Prakash Kumar
 * 
 */

@XmlRootElement
@Cached
public class EmailTemplateCategory {
	/**
	 * Id of a emailTemplateCategory. Each emailTemplateCategory has its own and unique id.
	 * Id is system generated.
	 */
	@Id
	public Long id;
	
	/**
	 * emailTemplateCategory name.
	 */
	@Indexed
	@NotSaved(IfDefault.class)
	public String name;
	
	@Indexed
	@JsonIgnore
	public String name_dummy;

	/**
	 * emailTemplateCategory created time (in epoch).
	 */
	@Indexed
	public Long created_time = 0L;
	
	/**
	 * Owner of emailTemplateCategory (to be specific which domain user created).
	 */
	@NotSaved(IfDefault.class)
	@Indexed
	private Key<DomainUser> owner = null;
	
	/***************************************************************/
	
	/**
	 * Initialize DataAccessObject.
	 */
	public static ObjectifyGenericDao<EmailTemplateCategory> dao = new ObjectifyGenericDao<EmailTemplateCategory>(
			EmailTemplateCategory.class);

	/**
	 * Default emailTemplateCategory.
	 */
	EmailTemplateCategory() {

	}

	/**
	 * Constructs new {@link EmailTemplateCategory} with name.
	 * 
	 * @param name
	 *            name of emailTemplateCategory.
	 */
	public EmailTemplateCategory(String name) {
		this.name = name;
	}
	
	
	/**
	 * Sets created time and CreatedBy(@owner). PrePersist is called each time before
	 * object gets saved.
	 */
	@javax.persistence.PrePersist
	private void PrePersist(){
		if (owner == null) {
			owner = new Key<DomainUser>(DomainUser.class, SessionManager
					.get().getDomainId());
		}
		if (created_time == 0L) {
			created_time = System.currentTimeMillis() / 1000;
		}
		
		// Save name to name_duplicate to avoid issue with order by & creating duplicate (A - a)
		if(this.name != null){
			this.name_dummy = this.name.trim().toLowerCase();
		}
	}
	
	/**
	 * Saves the emailTemplateCategory object.
	 */
	public void save(){
		try {
			dao.put(this);
		} catch (Exception e) {
			System.out.println("Exception while saving a EmailTemplateCategory"
					+ e.getMessage());
		}
	}
	
	
	public String toString() {
		return "emailTemplate-category[Id: " + this.id + ", Name: " + this.name + ", Created Time: " 
				+ this.created_time + ", Owner: " +this.owner+"]";
	}
	
	/***************************************************************/

}
