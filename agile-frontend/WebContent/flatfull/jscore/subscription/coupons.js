
//Coupons array
var AGILE_COUPONS_JSON = {}, AGILE_COUPON_INVALID_MESSAGE = "Coupon is either expired or invalid for the selected plan.";
function showCouponCodeContainer(id) {

	/**
	 * Changes for coupon existence or not. In future if want, change this to
	 * hide coupon container
	 */
	if (id)
		$("#content").find("#coupon_code_container").show();

	id = (id) ? "payment_selection_container" : "payment_selection_container1";
	$("#" + id).remove();
}

/**
 * Get coupon code status and show to the user
 * 
 * @param selected_plan_json
 * @param el
 * @returns
 */
function showCouponDiscountAmount(selected_plan_json, el) {

	var element = $(".coupon_code_discount_amount", el);

	var original_cost = selected_plan_json.cost;
	if (!original_cost)
		return element.html("");

	// Rest call to get the amount to discount
	checkValidCoupon(selected_plan_json.coupon_code, function(status) {

		// Get coupon
		var data = (!status) ? {}
				: AGILE_COUPONS_JSON[selected_plan_json.coupon_code];

		// Load Element
		var element = $(".coupon_code_discount_amount", el);
		var discountPrice = "0%";

		// Check percent and amout to deduct from main amount
		if (!data || !(data.percentOff || data.amountOff)) {
			element.find("#total_cost_with_discount").html(original_cost);
			return element.find("#coupon_code_discount_percent").html(
					"$0 (" + discountPrice + ")");
		}

		// Check amount off param
		var amountOff = data.amountOff;
		if (amountOff) {
			original_cost = original_cost - (amountOff / 100);
			discountPrice = "$" + (amountOff / 100);
		}

		// Check percent Off param
		var percentOff = data.percentOff;
		if (!amountOff && percentOff) {

			// Discount amount
			var discountAmount = original_cost * (percentOff / 100);

			// Get original cost
			original_cost = original_cost - discountAmount;

			discountPrice = "$" + (discountAmount.toFixed(2)) + " ("
					+ percentOff + "%)";
		}

		element.find("#total_cost_with_discount")
				.html(original_cost.toFixed(2));
		element.find("#coupon_code_discount_percent").html(discountPrice);

	});

}

/** Get coupon json from stripe
* 
* @param couponId
* @param callback
* @returns {Boolean}
*/
function getCouponJSON(couponId, callback) {

	if (!couponId)
		return false;

	// Load image
	var $load_img = '<img src="'+updateImageS3Path("img/1-0.gif")+'" height="20px" width="20px" />';
	$("#coupon_code_container form i").before($load_img);

	// Rest call to get the amount to discount
	$.get("corea/subscription/coupon/" + couponId, {}, function(data) {
		// Remove loading
		$("#coupon_code_container form img").remove();

		// Set this coupon object
		if (!data.id)
			AGILE_COUPONS_JSON[couponId] = "null";
		else
			AGILE_COUPONS_JSON[data.id] = data;

		// Call callback
		if (callback)
			callback(couponId);
	});

}


/**
 * Validate coupon
 * 
 * @param couponId
 * @param callback
 * @returns
 */
function checkValidCoupon(couponId, callback) {

	if (!couponId)
		return callback(false);

	if (AGILE_COUPONS_JSON[couponId])
		return callback(AGILE_COUPONS_JSON[couponId] != "null")

	console.log(AGILE_COUPONS_JSON[couponId]);

	// Get coupon json from server
	getCouponJSON(couponId, function(id) {
		checkValidCoupon(id, callback);
	});
}

/*
 * Get coupon json from stripe
 * 
 * @param couponId
 * @param callback
 * @returns {Boolean}
 */
function getCouponJSON(couponId, callback) {

	if (!couponId)
		return false;

	// Load image
	var $load_img = '<img src="'+updateImageS3Path("img/1-0.gif")+'" height="20px" width="20px" />';
	$("#coupon_code_container form i").before($load_img);

	// Rest call to get the amount to discount
	$.getJSON("core/api/subscription/coupon/" + couponId, {}, function(data) {
		console.log(data);
		// Remove loading
		$("#coupon_code_container form img").remove();

		// Set this coupon object
		if (!data.id)
			AGILE_COUPONS_JSON[couponId] = "null";
		else
			AGILE_COUPONS_JSON[data.id] = data;

		// Call callback
		if (callback)
			callback(couponId);
	});

}


function showCouponStatus(couponId) {

	var $load_img = '<img src="'+updateImageS3Path("img/1-0.gif")+'" height="15px" width="15px" />';
	$("#check_valid_coupon").remove($load_img);

}