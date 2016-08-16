/**
 * 
 */
package com.agilecrm.affiliate;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.ui.serialize.Plan.PlanType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * Affiliate users 
 * @author Santhosh
 *
 */
@XmlRootElement
@Cached
public class Affiliate {

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
	 * Affiliate Domain
	 */
	@NotSaved(IfDefault.class)
	private String domain;
	
	/**
	 * Affiliate email
	 */
	@NotSaved(IfDefault.class)
	private String email;
	
	/**
	 * Affiliate Created time 
	 */
	@NotSaved(IfDefault.class)
	private Long createdTime;
	
	/**
	 * Total first time amount affiliate paid in cents
	 */
	@JsonIgnore
	@NotSaved(IfDefault.class)
	private int amount;
	
	/**
	 * plan details
	 */
	@NotSaved(IfDefault.class)
	private PlanType plan;
	
	@NotSaved(IfDefault.class)
	private int usersCount;
	
	/**
	 * commission in %
	 */
	@JsonIgnore
	@NotSaved(IfDefault.class)
	private int commission;

	/**
	 * @return the amount
	 */
	public int getAmount() {
		return amount;
	}

	/**
	 * @param amount the amount to set
	 */
	public void setAmount(int amount) {
		this.amount = amount;
	}
	
	public Affiliate() {
		
	}
	
	/**
	 * Dao
	 */
	static ObjectifyGenericDao<Affiliate> dao = new ObjectifyGenericDao<Affiliate>(Affiliate.class);
	
	@PrePersist
	private void prePersist() {
		this.createdTime = System.currentTimeMillis()/1000;
	}
	
	public void save(){
		dao.put(this);
	}

	/**
	 * @return the plan
	 */
	public PlanType getPlan() {
		return plan;
	}

	/**
	 * @return the usersCount
	 */
	public int getUsersCount() {
		return usersCount;
	}

	/**
	 * @param plan the plan to set
	 */
	public void setPlan(PlanType plan) {
		this.plan = plan;
	}

	/**
	 * @param usersCount the usersCount to set
	 */
	public void setUsersCount(int usersCount) {
		this.usersCount = usersCount;
	}

	/**
	 * @return the commission
	 */
	public int getCommission() {
		return commission;
	}

	/**
	 * @param commision the commision to set
	 */
	public void setCommission(int commission) {
		this.commission = commission;
	}

	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param name the name to set
	 */
	public void setEmail(String email) {
		this.email = email;
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
	 * @return the domain
	 */
	public String getDomain() {
		return domain;
	}

	/**
	 * @return the createdTime
	 */
	public Long getCreatedTime() {
		return createdTime;
	}

	/**
	 * @return the dao
	 */
	public static ObjectifyGenericDao<Affiliate> getDao() {
		return dao;
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
	 * @param domain the domain to set
	 */
	public void setDomain(String domain) {
		this.domain = domain;
	}

	/**
	 * @param createdTime the createdTime to set
	 */
	public void setCreatedTime(Long createdTime) {
		this.createdTime = createdTime;
	}

	/**
	 * @param dao the dao to set
	 */
	public static void setDao(ObjectifyGenericDao<Affiliate> dao) {
		Affiliate.dao = dao;
	}
	
}
