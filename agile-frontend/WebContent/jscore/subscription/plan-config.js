var plan_json = [];
var INTERVALS = ["monthly", "yearly", "biennial"];
//Plans with costs
var PLANS_COSTS_JSON = {};
PLANS_COSTS_JSON.starter = "14.99";
PLANS_COSTS_JSON.regular = "49.99";
PLANS_COSTS_JSON.pro = "79.99";

// Plans intervals JSON
var PLANS_DISCOUNTS_JSON = {};
PLANS_DISCOUNTS_JSON.monthly = "0";
PLANS_DISCOUNTS_JSON.yearly = "20";
PLANS_DISCOUNTS_JSON.biennial = "40";

var PLANS_DISCOUNTS_JSON_NEW = {};

PLANS_DISCOUNTS_JSON_NEW.starter = {};
PLANS_DISCOUNTS_JSON_NEW.starter.monthly = "0";
PLANS_DISCOUNTS_JSON_NEW.starter.yearly = "33.355";
PLANS_DISCOUNTS_JSON_NEW.starter.biennial = "40";

PLANS_DISCOUNTS_JSON_NEW.regular = {};
PLANS_DISCOUNTS_JSON_NEW.regular.monthly = "0";
PLANS_DISCOUNTS_JSON_NEW.regular.yearly = "20";
PLANS_DISCOUNTS_JSON_NEW.regular.biennial = "40";

PLANS_DISCOUNTS_JSON_NEW.pro = {};
PLANS_DISCOUNTS_JSON_NEW.pro.monthly = "0";
PLANS_DISCOUNTS_JSON_NEW.pro.yearly = "18.75";
PLANS_DISCOUNTS_JSON_NEW.pro.biennial = "40";

function is_new_signup_payment()
{
	return IS_NEW_USER && _plan_on_signup;
}