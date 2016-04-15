package com.agilecrm.subscription.ui.serialize;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.subscription.limits.PlanLimits;

/**
 * <code>Plan</code> is used for serializing subscription form data. It include
 * plan information according to which request is sent to Stripe/Paypal
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
public class Plan implements Serializable {
	/**
     * 
     */
	private static final long serialVersionUID = 7190361539170990536L;

	// New plans
	private static final String VERSION_1 = "v1";
	private static final String VERSION_2 = "v2";

	public static enum PlanType {
		FREE,

		// Legacy plans (beta plans)
		LITE_MONTHLY, LITE_YEARLY,

		BASIC_MONTHLY, BASIC_YEARLY,

		PROFESSIONAL_MONTHLY, PROFESSIONAL_YEARLY,

		ENTERPRISE_MONTHLY, ENTERPRISE_YEARLY, ENTERPRISE_BIENNIAL,

		// Plans till 2015 feb
		STARTER_MONTHLY, STARTER_YEARLY, STARTER_BIENNIAL,

		PRO_MONTHLY, PRO_YEARLY, PRO_BIENNIAL,

		REGULAR_MONTHLY, REGULAR_YEARLY, REGULAR_BIENNIAL,

		STARTER, REGULAR, PRO;

	}

	public String subscription_id = null;
	public PlanType plan_type = null;
	public String plan_id = null;
	public Integer quantity = null;
	public String coupon = null;
	public Integer count = 0;
	public String version = VERSION_2;
	public String trialStatus = null;

	public Plan(String plan_type, Integer quantity) {
		this.plan_type = PlanType.valueOf(plan_type);
		this.quantity = quantity;
	}

	public Plan() {

	}

	@JsonIgnore
	public PlanLimits getPlanDetails() {

		try {
			return PlanLimits.getPlanDetails(this);
		} catch (Exception e) {
			return PlanLimits.getPlanDetails(this);
		}
	}

	@JsonIgnore
	public String getPlanName() {
		String planName = plan_type == null ? PlanType.FREE.toString()
				: plan_type.toString();

		return planName.split("_")[0];

	}

	@JsonIgnore
	public String getPlanInterval() {
		String planName = plan_type.toString();
		return planName.split("_")[1];
	}

	@Override
	public String toString() {
		return "Plan: {plan_id: " + plan_id + ", quantity: " + quantity + "}";
	}

	@Override
	public boolean equals(Object object) {
		Plan plan = (Plan) object;

		if (this.plan_id.equals(plan.plan_id) && plan.quantity == this.quantity)
			return true;

		return false;
	}
}
