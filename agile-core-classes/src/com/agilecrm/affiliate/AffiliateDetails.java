/**
 * 
 */
package com.agilecrm.affiliate;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * Entity to store affiliate details of the user who is referring
 * User specific
 * @author Santhosh
 *
 */
@XmlRootElement
@Cached
public class AffiliateDetails {

	/**
	 * ID
	 */
	@Id
	private Long id;
	
	/**
	 * DomainUser id
	 */
	@NotSaved(IfDefault.class)
	private Long userId;
	
	/**
	 * paypal  Id of user
	 */
	@NotSaved(IfDefault.class)
	private String paypalId;

	/**
	 * Business type
	 */
	@NotSaved(IfDefault.class)
	private String business_type;
	
	/**
	 * Badge type
	 */
	@NotSaved(IfDefault.class)
	private String badgeType;
	
	/**
	 * Address of user
	 */
	@NotSaved(IfDefault.class)
	private String address;
	
	/**
	 * Phone
	 */
	@NotSaved(IfDefault.class)
	private String phone;
	
	/**
	 * Total amount added to the user
	 */
	@NotSaved(IfDefault.class)
	private int amount;
	
	/**
	 * created time
	 */
	@NotSaved(IfDefault.class)
	private Long createdTime;
	
	/**
	 * Last updated time
	 */
	@NotSaved(IfDefault.class)
	private Long updatedTime;
	
	/**
	 * Last affiliate added time. If no affiliates then stores affiliateDetail created time 
	 */
	@NotSaved(IfDefault.class)
	private Long lastAffiliateAddedTime;
	
	/**
	 * @return the amountAdded
	 */
	public int getAmountAdded() {
		return amount;
	}

	/**
	 * @param amountAdded the amountAdded to set
	 */
	public void setAmountAdded(int amount) {
		this.amount = amount;
	}

	/**
	 * @return the paypalId
	 */
	public String getPaypalId() {
		return paypalId;
	}

	/**
	 * @param paypalId the paypalId to set
	 */
	public void setPaypalId(String paypalId) {
		this.paypalId = paypalId;
	}
	
	public AffiliateDetails() {
		
	}
	
	

	/**
	 * @return the lastAffiliateAddedTime
	 */
	public Long getLastAffiliateAddedTime() {
		return lastAffiliateAddedTime;
	}

	/**
	 * @param lastAffiliateAddedTime the lastAffiliateAddedTime to set
	 */
	public void setLastAffiliateAddedTime(Long lastAffiliateAddedTime) {
		this.lastAffiliateAddedTime = lastAffiliateAddedTime;
	}

	/**
	 * @return the createdTime
	 */
	public Long getCreatedTime() {
		return createdTime;
	}

	/**
	 * @param createdTime the createdTime to set
	 */
	public void setCreatedTime(Long createdTime) {
		this.createdTime = createdTime;
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
	 * @return the userId
	 */
	public Long getUserId() {
		return userId;
	}

	/**
	 * @return the business_type
	 */
	public String getBusiness_type() {
		return business_type;
	}

	/**
	 * @return the badgeType
	 */
	public String getBadgeType() {
		return badgeType;
	}

	/**
	 * @return the address
	 */
	public String getAddress() {
		return address;
	}

	/**
	 * @return the phone
	 */
	public String getPhone() {
		return phone;
	}

	/**
	 * @return the amount
	 */
	public int getAmount() {
		return amount;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * @param userId the userId to set
	 */
	public void setUserId(Long userId) {
		this.userId = userId;
	}

	/**
	 * @param business_type the business_type to set
	 */
	public void setBusiness_type(String business_type) {
		this.business_type = business_type;
	}

	/**
	 * @param badgeType the badgeType to set
	 */
	public void setBadgeType(String badgeType) {
		this.badgeType = badgeType;
	}

	/**
	 * @param address the address to set
	 */
	public void setAddress(String address) {
		this.address = address;
	}

	/**
	 * @param phone the phone to set
	 */
	public void setPhone(String phone) {
		this.phone = phone;
	}

	/**
	 * @param amount the amount to set
	 */
	public void setAmount(int amount) {
		this.amount = amount;
	}
}
