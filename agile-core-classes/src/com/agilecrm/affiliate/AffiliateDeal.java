/**
 * 
 */
package com.agilecrm.affiliate;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.cursor.Cursor;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * Affiliate Deal Register info 
 * @author Santhosh
 *
 */
@XmlRootElement
@Cached
public class AffiliateDeal extends Cursor {

	/**
	 * Id
	 */
	@Id
	private Long id;
	
	/**
	 * Related user id
	 */
	@NotSaved(IfDefault.class)
	private Long relatedUserId;
	
	/**
	 * Name
	 */
	@NotSaved(IfDefault.class)
	private String name;
	
	/**
	 * Personal email
	 */
	@NotSaved(IfDefault.class)
	private String personalEmail;
	
	/**
	 * Office email
	 */
	@NotSaved(IfDefault.class)
	private String officeEmail;
	
	/**
	 * Phone
	 */
	@NotSaved(IfDefault.class)
	private String phone;
	
	/**
	 * Website URL
	 */
	@NotSaved(IfDefault.class)
	private String websiteURL;
	
	/**
	 * Deal Created time 
	 */
	@NotSaved(IfDefault.class)
	private Long createdTime;
	
	/**
	 * Deal updated time 
	 */
	@NotSaved(IfDefault.class)
	private Long updatedTime;
	
	
	
	public AffiliateDeal() {
		
	}
	
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the phone
	 */
	public String getPhone() {
		return phone;
	}

	/**
	 * @param phone the phone to set
	 */
	public void setPhone(String phone) {
		this.phone = phone;
	}

	/**
	 * @return the websiteURL
	 */
	public String getWebsiteURL() {
		return websiteURL;
	}

	/**
	 * @param websiteURL the websiteURL to set
	 */
	public void setWebsiteURL(String websiteURL) {
		this.websiteURL = websiteURL;
	}

	/**
	 * @return the personalEmail
	 */
	public String getPersonalEmail() {
		return personalEmail;
	}

	/**
	 * @param personalEmail the personalEmail to set
	 */
	public void setPersonalEmail(String personalEmail) {
		this.personalEmail = personalEmail;
	}

	/**
	 * @return the officeEmail
	 */
	public String getOfficeEmail() {
		return officeEmail;
	}

	/**
	 * @param officeEmail the officeEmail to set
	 */
	public void setOfficeEmail(String officeEmail) {
		this.officeEmail = officeEmail;
	}

	/**
	 * @return the updatedTime
	 */
	public Long getUpdatedTime() {
		return updatedTime;
	}

	/**
	 * @param updatedTime the updatedTime to set
	 */
	public void setUpdatedTime(Long updatedTime) {
		this.updatedTime = updatedTime;
	}

	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}

	/**
	 * @return the relatedUserId
	 */
	public Long getRelatedUserId() {
		return relatedUserId;
	}

	/**
	 * @return the createdTime
	 */
	public Long getCreatedTime() {
		return createdTime;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * @param relatedUserId the relatedUserId to set
	 */
	public void setRelatedUserId(Long relatedUserId) {
		this.relatedUserId = relatedUserId;
	}


	/**
	 * @param createdTime the createdTime to set
	 */
	public void setCreatedTime(Long createdTime) {
		this.createdTime = createdTime;
	}
	
}
