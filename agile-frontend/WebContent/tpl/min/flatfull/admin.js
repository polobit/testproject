   <script id="admin-charge-collection-template" type="html/text">
        <div class="page-header">
            <h2>Past Transactions</h2> 
        </div>
    <div >
        <table class="table table-striped" id="sort-table">
            <thead>
                <tr>
                    <th>Amount(USD)</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="admin-charge-model-list" class="model-list-cursor">
            </tbody>
        </table>
    </div>

</script>
<script id="admin-charge-model-template" type="text/html">	


	
	<td >
    	${{numeric_operation amount 100 "/"}}&nbsp;&nbsp;&nbsp;--{{id}} {{#if_not_equals amountRefunded 0}}<strong>(${{numeric_operation amountRefunded 100 "/"}}-Refunded)</strong>{{/if_not_equals}}
	</td>
	<td class="text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago" datetime="{{epochToHumanDate "" created}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created}}</time></td>
	<td>
			{{#if paid}}
				{{#if refunded}}
      				refunded ({{numeric_operation amount 100 "/"}} {{toUpperCase currency}})
				{{else}}
					paid
				{{/if}}
			{{else}}
				failed
{{/if}}</td>
	<td>{{#unless refunded}}
		{{#if paid}}
		<a href="#" id="refundpopup" totalamount={{numeric_operation amount 100 "/"}} refundedAmount={{numeric_operation amountRefunded 100 "/"}} chargeid={{id}} role="button" class="btn btn-default btn-sm refundpopup" data-toggle="modal">Refund</a>{{/if}}{{/unless}}</td>



</script>   <script id="admin-invoice-collection-template" type="html/text">
        <div class="page-header">

        </div>
    <div >
        <table class="table table-striped" id="sort-table">
            <thead>
                <tr>
                    <th>Plan Type</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Amount(USD)</th>
                </tr>
            </thead>
            <tbody id="admin-invoice-model-list" class="model-list-cursor">
            </tbody>
        </table>
    </div>

</script>
<script id="admin-invoice-model-template" type="text/html">	


{{#each lines.data}}	
{{#if this.plan}}
	<td class="data" data="{{this.id}}">
    	{{this.plan.name}}
	</td>
	<td>{{epochToHumanDate "mm/dd/yyyy" period.start}}</td>
	<td>{{epochToHumanDate "mm/dd/yyyy" period.end}}</td>
	<td>{{numeric_operation plan.amount 100 "/"}}</td>

{{/if}}
{{/each}}	
</script><script id="admin-purchase-plan-template" type="text/html">
<div class="row">
	<div class="span9">
		<div class="well">
			<legend>Upgrade Plan</legend>
			<div id="update-plan-details-info"></div>

			<form id="planform" class="form-horizontal update_plan" name="plan">
				<fieldset>
					<div class="alert alert-info hide"></div>
					<div style="display: none;">
						<div class="control-group">
							<label class="control-label">Plan<span class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="plan_id" class="input required form-control"
									value="{{plan_id}}" />
							</div>
						</div>
						<div class="control-group">
							<label class="control-label">Plan<span class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="plan_type" class="input required form-control"
									value="{{plan_type}}" />
							</div>
						</div>
						<div class="control-group">
							<label class="control-label">Quantity<span
								class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="quantity"
									class="input required form-control digits" value="{{quantity}}" />
							</div>
						</div>
						<div class="control-group">
							<label class="control-label">Discount<span
								class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="discount" class="input form-control required"
									value="{{discount}}" />
							</div>
						</div>
					<div class="control-group">
							<label class="control-label">coupon<span
								class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="coupon" class="input form-control required"
									value="{{coupon_code}}" />
							</div>
						</div>

					</div>

					<div class="span8"
						style="background-color: rgb(221, 232, 248); border-radius: 10px; padding: 5px; overflow:auto;">

						<a style="float: right; padding: 1px 5px 1px; margin: 10px;"
							class="btn btn-sm btn-success" id="change_plan" href="#domainSubscribe"><i
							class="icon-edit"></i> Change Plan</a> 

						<div class="span3" style="min-width:25em; float:left;">
							<div class="control-group" style="margin: 15px 0px 0px;">
								<label class="control-label" style="padding-top: 0px;">Selected
									Plan : </label>
								<div class="controls">{{plan}}</div>
							</div>
                                
							<div class="control-group" style="margin: 5px 0px;">
								<label class="control-label" style="padding-top: 0px;">Quantity
									(Users) : </label>
								<div class="controls">{{quantity}}</div>
							</div>
							<div class="control-group" style="margin: 5px 0px;">
								<label class="control-label" style="padding-top: 0px;">Billing
									Cycle : </label>
								<div class="controls">{{cycle}}</div>
							</div>
							<div class="control-group" style="margin: 5px 0px;">
								<label class="control-label" style="padding-top: 0px;">Next
									Billing Date : </label>
								<div class="controls">
									{{epochToHumanDate "mm/dd/yy" date}}
									<p class="help-block"
										style="color: #999; margin-left: 0px; margin-top: 2px;">MM/DD/YY</p>
								</div>
							</div>
							<div class="control-group" style="">
								<label class="control-label" style="padding-top: 0px;">Total
									Cost : </label>
								<div class="controls">
									<span>$</span><b>{{cost}}</b>
									<p class="help-block"
										style="color: #999; margin-left: 0px; margin-top: 2px;">
										( {{quantity}} * {{months}} * <span>$</span>{{price}} )
									</p>
								</div>
							</div>

 					  {{#if coupon_code}}
							<div class="control-group" style="margin: 7px 0px;">
								<label class="control-label" style="padding-top: 0px;">Discount : </label>
								<div class="controls">
									<b class="coupon_code_discount_amount"><span id="coupon_code_discount_percent"><img src="img/1-0.gif" height="15px" width="15px" /></span></b>
								</div>
							</div>
  							<div class="control-group">
								<label class="control-label" style="padding-top: 0px;">Total Payable Cost : </label>
								<div class="controls">
									$<b class="coupon_code_discount_amount"><span id="total_cost_with_discount"><img src="img/1-0.gif" height="15px" width="15px" /></span></b>
								</div>
							</div>
 						{{/if}}
</div>
						<div class="span4" style="float:right; ">
							{{#if_equals "Monthly" cycle}}
							<div class="info-block" style="margin: 10px;">
								<i class="icon-info-sign"></i><strong>UPGRADE</strong>
								<p>
									You can save $<b>{{yearly_discount}}</b> by upgrading to yearly
									or save $<b>{{bi_yearly_discount}}</b> by upgrading to 2 year
									plan.<br />Hurry! <b><a href="#subscribe">Change plan</a></b>
									and claim your savings!!
								</p>
							</div>
							{{/if_equals}} {{#if_equals "Yearly" cycle}}
							<div class="info-block" style="margin: 10px;">
								<i class="icon-info-sign"></i><strong>UPGRADE</strong>
								<p>
									You can save $<b>{{bi_yearly_discount}}</b> by upgrading to 2
									year plan.<br />Hurry! <b><a href="#subscribe">Change
											plan</a></b> and claim your savings!!
								</p>
							</div>
							{{/if_equals}}
						</div>
					</div>

				</fieldset>
			</form>
			{{#if_equals "free" current_plan}}
			<form id="CCform" class="form-horizontal card_details"
				name="card_details">
				<fieldset>
				<div class="control-group">
						<label class="control-label">Name<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="name" class="input form-control required "
								placeholder="Cardholder's name" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">Card Number <span
							class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="number" class="input required form-control digits"
								placeholder="Enter Card Number" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">Expiry<span
							class="field_req">*</span></label>
						<div class="controls">
							<select name="exp_month" id="exp_month"
								class="input span2 form-control exp_month" placeholder="Expiry Month"
								style="width: 94px" onChange="$(&quot;#exp_year&quot;).valid();"></select>
							<span style="margin-left: 10px; margin-right: 10px">/ </span> <select
								name="exp_year" id="exp_year"
								class="input required form-control digits span2 exp_year atleastThreeMonths"
								placeholder="Expiry Year" style="width: 94px"></select>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">CVC<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="cvc" class="input required form-control digits"
								placeholder="CVC" />
						</div>
					</div>
			
					<div class="control-group">
						<label class="control-label">Address<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="address_line1" class="required form-control"
								id="address1" placeholder="address" />
						</div>
					</div>
					<div class="control-group">
						<div class="controls">
							<input type="text" name="address_line2" class="form-control" id="address2"
								placeholder="address" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">ZIP Code<span class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="address_zip" class="required form-control" id="address_zip" placeholder="zip" /><br /> <br />						
							</div>
					</div>
					<div class="control-group">
						<label class="control-label">Country<span
							class="field_req">*</span></label>
						<div class="controls">
							<select class="country required form-control" id="country"
								name="address_country"
								onchange="print_state('state',this.selectedIndex);"></select>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">State<span class="field_req">*</span></label>
						<div class="controls">
							<select class="required form-control" name="address_state" id="state"
								class="required" name="address_country">
							</select>
						</div>
					</div>
					<!-- <div class="control-group">	
                    <label class="control-label">Gateway<span class="field_req">*</span></label>
                    <div class="controls">
                    			<select class="required form-control" name="gateway">
                    		<option value="">select</option>
                    		<option value="Stripe">Stripe</option>
                    		<option value="Paypal">Paypal</option>
                    	</select>
                    </div>
                    </div> -->
				</fieldset>
			</form>
			{{/if_equals}}
			<form id="gateway" class="form-horizontal hide">
				<input type="text" name="gateway" class="hidden form-control" value="Stripe" />
               <input type="text" name="domain_name" class="hidden form-control" value="{{domain_name}}" />
			</form>

<!--			 {{#if_equals "free" current_plan}} {{else}}

			<legend>Existing Card Details</legend>
			<div class="span8"
				style="background-color: rgb(221, 232, 248); border-radius: 10px; padding: 5px; margin-bottom: 10px;">
				<form id="change_card" name="change_card"
					class="form-horizontal change_card">
					<div class="span6">
						<div class="control-group" style="margin: 15px 0px 0px;">
							<label class="control-label" style="padding-top: 0px;">
								Name : </label> <label id="card-holder-name" class="controls">{{customer.activeCard.name}}</label>
						</div>
						<div class="control-group" style="margin: 5px 0px 0px;">
							<label class="control-label" style="padding-top: 0px;">Card
								Number : </label> <label id="card-number" class="controls">************{{customer.activeCard.last4}}</label>
						</div>
							<div class="control-group" style="margin: 5px 0px 15px;">
							<label class="control-label" style="padding-top: 0px;">
								Type  : </label> <label id="expiry-date" class="controls">{{customer.activeCard.type}} </label>
						</div>
						<div class="control-group" style="margin: 5px 0px 15px;">
							<label class="control-label" style="padding-top: 0px;">Expiry
								Date (Mon / Yr) : </label> <label id="expiry-date" class="controls">{{customer.activeCard.expMonth}}
								/ {{customer.activeCard.expYear}} </label>
						</div>
					</div>
				</form>
			</div>
			{{/if_equals}}
-->
			<div class="form-actions" style="padding-left: 160px;">
				<a href="#domainSubscribe" class="btn btn-default btn-sm">Close</a>
				<a href="#" type="submit" id="subscribe" class="save btn btn-primary">Upgrade Plan</a>
			</div>

		</div>
	</div>
	<div class="span3">

		<div class="testmonials_box" style=""></div>

	</div>
</div>
</script>
<script id="update-plan-details-info-template" type="text/html">

</script><script id="all-domain-admin-subscribe-new-template" type="text/html">
<div class="row">
	<div class="span12">
		<div class="page-header">
			<h1>Plan and Upgrade</h1>
		</div>
	</div>
</div>
<div class="row">
	<div class="span9">	

		<h3>
			<b>Choose Plan And Billing Cycle</b>
		</h3>
		<div class="pagination ac plan-strip"
			style="margin-top: 15px; margin-bottom: 15px;">
			<ul
				style="float: none !important; text-align: center; display: inline-block;"
				class="tagsli">
				<li><a href="#" class="monthly"><strong>&nbsp;&nbsp;&nbsp;&nbsp;Monthly&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong></a></li>

				<li><a href="#" class="yearly"><strong>Yearly (20% off)</strong></a></li>
				<li><a href="#" class="biennial"><strong>2 Years
							(40% off)</strong></a></li>
			</ul>
		</div> 
	</div>
</div>
<div class="row-fluid">
	<div class="span9">

		<div class="row-fluid">

			<div class="span4 plan-collection-bot clearfix"
				style="margin-left: 0px;">
				<div class="plan-collection-in liteplan">
					<span class="plan-off-ribbon"></span>
					<h3 class="plan-collection-top">
						<span class="plan-collection-icon"></span><br> <span
							title="Lite Plan" id="plan_name">Starter</span>
					</h3>
					<div class="plan-collection-content m-t-sm" id="litepricebox">
						<div id="starter_plan_price_content">
							<span style="color: #FA782D; font-size: 30px;">$<span
								id="starter_plan_price">14.99</span></span> <br> <span
								style="color: #999">per user per month</span>
						</div>
					</div>
					<div class="plan-collection-content" id="basic_plan_statement">
						<ul class="unstyled plan-features">
					<li><span class="value">10,000</span> Contacts</li>
					<li><span class="value">1500</span> Emails / User</li>
					<li><span class="value">3</span> Campaigns</li>
					<li><span class="value">5000 </span>Pageviews</li>
					<li><span class="value">3 </span>Web Rules</li>
					</ul>
					</div>
					<div class="plan-collection-buy">
						<div class="cat-addtocart-out">
							<div class="cat-addtocart" id="lite_buy_btn">
								 <label class="i-checks i-checks-sm"><input type="radio" name="pro_vs_lite" value="starter"
									class="djc_addtocart_link form-control" /><i></i></label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="span4 plan-collection-bot clearfix">
				<div class="plan-collection-in proplan">
					<span class="plan-off-ribbon"></span>
					<h3 class="plan-collection-top">
						<span class="plan-collection-icon pro_selected"></span><br> <span
							title="Pro Plan" id="plan_name">Regular</span>
					</h3>
					<div class="plan-collection-content" id="propricebox">
						<div id="regular_plan_price_content">
							<span style="color: #FA782D; font-size: 30px;">$<span
								id="regular_plan_price">49.99</span></span> <br> <span
								style="color: #999">per user per month</span>
						</div>
					</div>
					<div class="plan-collection-content" id="pro_plan_statement">
					<ul class="unstyled plan-features">
					<li><span class="value">50,000</span> Contacts</li>
					<li><span class="value">2500</span> Emails / User</li>
					<li><span class="value">10</span> Campaigns</li>
					<li><span class="value">10,000 </span>Pageviews</li>
					<li><span class="value">5 </span>Web Rules</li>
				</ul>	

					</div>

					<div class="plan-collection-buy">
						<div class="cat-addtocart-out">
							<div class="cat-addtocart" id="pro_buy_btn">
								 <label class="i-checks i-checks-sm"><input type="radio" name="pro_vs_lite" value="regular"
									class="djc_addtocart_link form-control" /><i></i></label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="span4 plan-collection-bot clearfix">
				<div class="plan-collection-in customplan">
					<span class="plan-off-ribbon"></span>
					<h3 class="plan-collection-top">
						<span class="plan-collection-icon"></span><br> <span
							title="Enterprise" id="plan_name">Pro</span>
					</h3>
					<div class="plan-collection-content">
						<div id="pro_plan_price_content">
							<span style="color: #FA782D; font-size: 30px;">$<span
								id="pro_plan_price">79.99</span></span> <br> <span
								style="color: #999">per user per month</span>
						</div>
					</div>
					<div class="plan-collection-content">
						<ul class="unstyled plan-features">
					<li><span class="value">Unlimited</span> Contacts</li>
					<li><span class="value">5000</span> Emails / User</li>
					<li><span class="value">Unlimited</span> Campaigns</li>
					<li><span class="value">20,000 </span>Pageviews</li>
					<li><span class="value">10 </span>Web Rules</li>

				</ul>
					</div>
					<div class="plan-collection-buy">
						<div class="cat-addtocart-out">
							<div class="cat-addtocart" id="custom_buy_btn">
								 <label class="i-checks i-checks-sm"><input type="radio" name="pro_vs_lite"
									value="pro" class="djc_addtocart_link form-control" /><i></i></label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row-fluid">

			<div class="" id="choose_users"
				style="border: 1px solid whiteSmoke; padding-top: 10px; border-radius: 5px; margin-top: 15px;">
				<div class="row">
					<div class="span4"  style="margin-left: 40px;">
						<label><h3>
								<b id="choose_users_popover" rel="popover" data-placement="right"
								data-content="Choose number of users using this slider."
								data-original-title="Add More Users">Choose Number Of Users </b>
							</h3></label>
						<div class="span9"
							style="margin-left: 0px; margin-top: 20px; margin-left: 6px;">
							<input id="users_select_slider" type="slider" class="form-control" name="price"
								value="1" />
						</div>
					</div>
				<div class="span4" style="margin-top: 45px; margin-left: 0px;">
						<form class="form-horizontal">
							<div class="control-group">
								<label class="control-label"> <span style="font-size: 15px;"><b>Monthly Cost: </b></span></label>
								<div class="controls">
									<span style="color: #FA782D; font-size: 30px;">$<span id="users_total_cost">21.24</span></span>
									<p class="help-block" style="margin-top: 0px">
										( for <span style="color: #FA782D;" id="users_quantity">1</span>
										users )
									</p>
								</div>
							</div>
						</form>
					</div>

				
			<div class="span6" style="margin-left: 40px;display:none" id="coupon_code_container">
						<form class="">
								<label class="control-label"> <span
									style="font-size: 15px;"><b>Coupon Code: </b><span style="font-size: 10px;">(Only for Credit Card)</span></span></label>
									<input type="text" placeholder="Enter Promo Code" class="form-control" id="coupon_code" style="margin-bottom: 0px;" rel="tooltip" title="" />
									<input type="button" class="btn btn-sm btn-default form-control" value="Validate" id="check_valid_coupon" style="margin: 0px 3px;" />
 									<i class=""></i><br/> <span class="error" style="color: #df382c;"></span>
						</form>
					</div>
	
				</div>
				<div class="row-fluid"
					style="text-align: center; margin-top: 25px; margin-bottom: 15px;">
					<a href="#purchase-plan-formAdminPanel" id="purchase-plan"
						class="btn btn-sm btn-primary" style="padding: 15px 30px;"><b>Proceed
							to Payment</b></a><br/><br/>
						<p style="color:#999;" id="subscribe_plan_tooltext">You will be asked to provide your card details</p>
				</div>

			</div>
		</div>
	</div>
	<div class="span3">
		<div class="well">
			<p>
				<strong><u>Your Current Plan</u>:</strong>
			</p>
			<p>
                 Plan: {{titleFromEnums this.plan.plan_type}}     
            </p>
            {{#if plan.quantity}}
            <p>
                 Quantity: {{this.plan.quantity}}     
            </p>
            {{/if}}
			<p>
				<a href="#choose_users" id="add_more_users">Add more users</a>
			</p>
			
		</div>
		

		</div>
	
		<hr style="margin: 18px 0px">

	</div>
</div>

</script><script id="settings-change-password-adminpanel-template" type="text/html">
<div class="row">
	<div class="span8 well">
    	<form id="changePasswordForm" class="form-horizontal">
        	<fieldset>
            	<legend>Reset Password</legend>
            	<div class="row">
                    <div class="control-group">
                        <label class="control-label">New Password <span class="field_req">*</span></label> 
                        <div class="controls">
                            <input name="new_pswd" id="new_pswd" type="password" class="required form-control" autocapitalize="off" maxlength="20" minlength="4" placeholder="Enter New Password" />
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label">Confirm Password <span class="field_req">*</span></label> 
                        <div class="controls">
                            <input name="confirm_pswd" type="password" class="required form-control" autocapitalize="off" maxlength="20" minlength="4" equalto="#new_pswd" placeholder="Confirm New Password" />
                        </div>
                    </div>
                </div>
            	<div class="form-actions">
					<a href="" class="btn btn-sm btn-default">Cancel</a>
                	<a href="#" type="submit" id="saveNewPasswordFromAdmin" class="save btn btn-primary btn-sm">Save Changes</a>
               		<span class="save-status"></span>
            	</div>
        	</fieldset>
    	</form>
	</div>
</div>
</script><script id="all-domain-users-model-template" type="text/html">
<td></td>
 <td class='data' data='{{domain}}'>{{domain}}</td>
<td>{{name}}</td>
<td>{{email}}</td>
<td>{{is_account_owner}}</td>

</script>

<script id="all-domain-users-collection-template" type="text/html">
<div class="row">
<div class="span12">
    <div class="page-header">
        <h1>List of All Domain Users <small>{{count}}</small></h1>
    </div>
</div>
</div>
<div class="row">
<div class="span12">
    {{#unless this.length}}
    <div class="alert-info alert">
        <div class="slate-content">
            <div class="box-left pull-left m-r-md">
                <img alt="Clipboard" src="/img/clipboard.png" />
            </div>
            <div class="box-right pull-left">
                <h4 class="m-t-none">You don't have Domain Users.</h4>
                <div class="text">
                    No user is registered yet.
                </div>
                <br />
                <a href="#" class="btn btn-default btn-sm blue btn-slate-action m-t-xs"><i class="icon-plus-sign"></i> Domain Users </a>
            </div>
			<div class="clearfix">
			</div>
        </div>
    </div>
    {{/unless}}
    {{#if this.length}}
    <div class="">
        <div class="">
            <table class="table table-striped onlySorting">
                <thead>
                    <tr>
                        <th></th>
						<th>Domain</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Account Owner</th>
						
                    </tr>
                </thead>
                <tbody id="all-domain-users-model-list"  style="cursor:pointer"></tbody>
            </table>
        </div>
    </div>
    {{/if}}
</div>
</div>
</script><script id="all-domain-model-template" type="text/html">

<td></td>
<td>{{name}}</td>
<td>{{email}}</td>
<td class="text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="last-login-time" datetime="{{epochToDate info_json_string "logged_in_time"}}" style="border-bottom:dotted 1px #999">{{epochToDate info_json_string "logged_in_time"}}</time></td>
<td ><a href="/#change-password-admin/{{id}}"  >Reset password</a></td>
<td><a href="#" data="{{id}}" class="delete_user btn-mini btn-danger">Delete</a></td>
<td>{{#if is_account_owner}}<i class="agilecrm-profile-dropdown"></i>{{/if}}</td>
 

</script>

<script id="all-domain-collection-template" type="text/html">
 <div class="page-header">
        <h2 >DomainDetails </h2><br/>
<h3 >Domain Name:&nbsp;&nbsp;&nbsp;{{this.0.domain}}</h3>
    </div>

<div class="row">
<div class="span9">
   

    {{#unless this.length}}
    <div class="slate m-t-sm">
        <div class="slate-content">
                <h3>Domain Not Found.</h3>
                <br />
                <a href="#" class="btn btn-default btn-sm blue btn-slate-action"><i class="icon-plus-sign"></i> Domain Users </a>
            
        </div>
    </div>
    {{/unless}}
    {{#if this.length}}
<div ><h3  style="color:#069">Users <small>{{count}}</small></h3> 

    <div class="">
        <div class="">
            <table class="table table-striped onlySorting">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Last Logged In</th>
                        <th>Reset Password</th>
						<th>Delete User</th>
                    </tr>
                </thead>
                <tbody id="all-domain-model-list" ></tbody>
            </table>
        </div>
    </div>
    {{/if}}
</div>
<div  class=" past-invoicecollection"></div>
<div  class=" past-chargecollection"></div>
</div>
<div class="span3">
<div  id="planinfo"></div>
<div id="account" class="pull-left" style="float:left" > </div>
</div>
</div>

<div class="row">

</script>

<script id="plan-info-template" type="text/html">
<div class="header"><a id="login_id"   href='https://{{description}}.agilecrm.com/login'  target='_blank'><strong><u>Login To Domain</u></strong></a></div>
{{#if this.subscription}}
<div class="well">
<p>
	<strong><u>Your Current Plans</u>:</strong>
</p>
{{#each subscriptions.data}}

{{#is_userPlan plan.id}}
<div id="user_sub">
<p><strong><u>User Plan</u></strong></p>
<p>
     Start Date: <i class="text-muted fa fa-clock-o m-r-xs"></i><time class="time-ago text-muted" datetime="{{epochToHumanDate "" start}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" start}}</time>     
</p>
{{#if this.currentPeriodEnd}}
<p>
    End Date:<i class="text-muted fa fa-clock-o m-r-xs"></i> <time class="text-muted time-ago" datetime="{{epochToHumanDate "" currentPeriodEnd}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" currentPeriodEnd}}</time>     
</p>
{{/if}}

<p>
Current Plan: &nbsp;&nbsp;{{plan.id}}
</p>

<p>
Interval: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{plan.interval}}
</p>
<p>
Amount: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{get_total_amount plan.amount quantity}} {{toUpperCase plan.currency}}
</p>
<p>
Plan Type: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{plan.name}}
</p>
<p>
	Users: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{quantity}}
</p><br/><p>
	<span style="width: auto;max-width: 40%;display: inline-block;"><a href="/#domainSubscribe/{{../../description}}"><strong><u> Change Plan</strong></u> </a> </span>
	<span class="pull-right" style="text-overflow: ellipsis;overflow: hidden;height: auto;white-space: nowrap;max-width: 55%;display: inline-block;">
	<a href="#" id="delete_userplan" sub_id={{id}} cus_id={{../../id}}> <strong><u>Cancel Subscription</u></strong> </a></span>
</p><br/><br/>
</div>
{{/is_userPlan}}
{{/each}}



{{#each subscriptions.data}}
{{#is_emailPlan plan.id}}

<div id="email_sub">
<p><strong><u>Email Plan</u></strong></p>


<p>
     Start Date: <i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago text-muted" datetime="{{epochToHumanDate "" start}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" start}}</time>     
</p>

{{#if this.currentPeriodEnd}}
<p>
    End Date: <i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago text-muted" datetime="{{epochToHumanDate "" currentPeriodEnd}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" currentPeriodEnd}}</time>     
</p>
<p>
	Email Limit: &nbsp;&nbsp;&nbsp;&nbsp;{{numeric_operation quantity 1000 "*"}}
</p>
{{/if}}
<p>
Current Plan: &nbsp;&nbsp;{{plan.id}}
</p>
<p>
Interval: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{plan.interval}}
</p>
<p>
Amount: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{get_total_amount plan.amount quantity}} {{toUpperCase plan.currency}}
</p>
<p>
Plan Type: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{plan.name}}
</p>
<p>
	<span class="pull-right">
	<a href="#" id="delete_emailplan" sub_id={{id}} cus_id={{../../id}}> <strong><u>Cancel Subscription</u></strong> </a></span>
</p>
<br/><br/>
</div>
{{/is_emailPlan}}
{{/each}}

  {{else}}
        <div ><strong>No active subscription</strong></div>
</div>
{{/if}}


</script>

<script id="email-stats-template" type="text/html">
<div>
					This Hour:{{numberWithCommas sent_hourly}}<br/>
				This Week:{{numberWithCommas sent_weekly}}<br/>
					This Month:{{numberWithCommas sent_monthly}}<br/>
					Overall :{{numberWithCommas sent_total}}<br/>
	</div>		

</script>

<script id="domain-info-template" type="text/html">
<div style=" float:right;" >
<legend>Account Stats</legend>
<div class="stats-content" style="width:280px">
<table class="table table-bordered">    
    <thead>
        <tr>
            <th>Name</th>
            <th>Details</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>campaigns_count</td>
            <td >{{compaign_count}}</td>
        </tr>
      
 <tr>
            <td>webrules_count</td>
            <td>{{webrule_count}}</td>
        </tr>
        <tr>
            <td>emails_count</td>
            <td id="emailcount" ></td>
        </tr>

        <tr>
            <td>Web-stats_count</td>
            <td >{{webstats_count}}</td>
        </tr>
 <tr>
            <td>Contacts_count</td>
            <td >{{contact_count}}</td>
        </tr>

 <tr>
            <td>deals_count</td>
            <td >{{deals_count}}</td>
        </tr>
 <tr>
            <td>documents_count</td>
            <td >{{docs_count}}</td>
        </tr>
 <tr>
            <td>events_count</td>
            <td >{{events_count}}</td>
        </tr>
 <tr>
            <td>triggers_count</td>
            <td >{{triggers_count}}</td>
        </tr>

    </tbody>
</table>
</div>
<<<<<<< HEAD
<a  align="center" data="" class="delete-namespace data btn  btn-danger">Delete  Account</a>
=======
{{#if emailcount}}
	{{#if_equals emailcount.status "paused"}}<div class="text-danger">Email sending on this domain is paused.<a href="#" class="btn" id="unpause_mandrill" domain={{emailcount.name}}>Resume</a></div><br/>{{/if_equals}}
{{/if}}
<a  align="center" data="" class="delete-namespace data btn btn-danger">Delete  Account</a>
>>>>>>> a8176390dcabb88fb9bb488b1aef5d1a8ce57509
</div>
</div>
</script>
