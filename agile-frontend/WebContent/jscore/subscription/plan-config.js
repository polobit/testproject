
var PLANS_COSTS_JSON = {};
var PLANS_DISCOUNTS_JSON_NEW = {};
// Plans intervals JSON
var PLANS_DISCOUNTS_JSON = {};

function config_version_2_plans()
{
	PLANS_COSTS_JSON.starter = "24.99";
	PLANS_COSTS_JSON.regular = "49.99";
	PLANS_COSTS_JSON.pro = "119.99";
	
	

	PLANS_DISCOUNTS_JSON.monthly = "0";
	PLANS_DISCOUNTS_JSON.yearly = "20";
	PLANS_DISCOUNTS_JSON.biennial = "40";

	PLANS_DISCOUNTS_JSON_NEW.starter = {};
	PLANS_DISCOUNTS_JSON_NEW.starter.monthly = "0";
	PLANS_DISCOUNTS_JSON_NEW.starter.yearly = PLANS_DISCOUNTS_JSON.yearly;
	PLANS_DISCOUNTS_JSON_NEW.starter.biennial = PLANS_DISCOUNTS_JSON.biennial;

	PLANS_DISCOUNTS_JSON_NEW.regular = {};
	PLANS_DISCOUNTS_JSON_NEW.regular.monthly = "0";
	PLANS_DISCOUNTS_JSON_NEW.regular.yearly = PLANS_DISCOUNTS_JSON.yearly;
	PLANS_DISCOUNTS_JSON_NEW.regular.biennial = PLANS_DISCOUNTS_JSON.biennial;

	PLANS_DISCOUNTS_JSON_NEW.pro = {};
	PLANS_DISCOUNTS_JSON_NEW.pro.monthly = "0";
	PLANS_DISCOUNTS_JSON_NEW.pro.yearly = "16.66";
	PLANS_DISCOUNTS_JSON_NEW.pro.biennial = "33.336";
	
	if(_billing_restriction && _billing_restriction.currentLimits && _billing_restriction.currentLimits.plan)
	{
		if(_billing_restriction.currentLimits.plan.version == "v1")
		{
			getLegacyPlanDetails(_billing_restriction.currentLimits.plan.plan_type);
		}
	}
}

var LEGACY_PLAN_COSTS_JSON = {};

LEGACY_PLAN_COSTS_JSON.starter = "14.99";
LEGACY_PLAN_COSTS_JSON.regular = "49.99";
LEGACY_PLAN_COSTS_JSON.pro = "79.99";


//Plans intervals JSON
var LEGACY_PLANS_DISCOUNTS_JSON = {};
LEGACY_PLANS_DISCOUNTS_JSON.monthly = "0";
LEGACY_PLANS_DISCOUNTS_JSON.yearly = "20";
LEGACY_PLANS_DISCOUNTS_JSON.biennial = "40";

var LEGACY_PLANS_DISCOUNTS_JSON_NEW = {};

LEGACY_PLANS_DISCOUNTS_JSON_NEW.starter = {};
LEGACY_PLANS_DISCOUNTS_JSON_NEW.starter.monthly = "0";
LEGACY_PLANS_DISCOUNTS_JSON_NEW.starter.yearly = "33.355";
LEGACY_PLANS_DISCOUNTS_JSON_NEW.starter.biennial = "40";

LEGACY_PLANS_DISCOUNTS_JSON_NEW.regular = {};
LEGACY_PLANS_DISCOUNTS_JSON_NEW.regular.monthly = "0";
LEGACY_PLANS_DISCOUNTS_JSON_NEW.regular.yearly = "20";
LEGACY_PLANS_DISCOUNTS_JSON_NEW.regular.biennial = "40";

LEGACY_PLANS_DISCOUNTS_JSON_NEW.pro = {};
LEGACY_PLANS_DISCOUNTS_JSON_NEW.pro.monthly = "0";
LEGACY_PLANS_DISCOUNTS_JSON_NEW.pro.yearly = "18.75";
LEGACY_PLANS_DISCOUNTS_JSON_NEW.pro.biennial = "40";


function getLegacyPlanDetails(plan_name)
{
	var plan = plan_name.split("_")[0].toLowerCase();
	PLANS_COSTS_JSON [plan] = LEGACY_PLAN_COSTS_JSON[plan];
	PLANS_DISCOUNTS_JSON_NEW[plan] = LEGACY_PLANS_DISCOUNTS_JSON_NEW[plan];
}
function is_new_signup_payment()
{
	return IS_NEW_USER && _plan_on_signup;
}