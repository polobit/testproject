<script id="credit-card-form-template" type="text/html">
<div class="modal hide" id="credit-card-form-modal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
		{{#if billingData}}
        	<h3><i class="icon-plus-sign"></i>  Change Card</h3>
			{{else}}
			<h3><i class="icon-plus-sign"></i>  Attach Card</h3>			
		{{/if}}
    </div>
    <div class="modal-body">
		<form id="CCform" class="form-horizontal card_details"
			name="card_details">
			<fieldset>

				<div class="control-group">
					<label class="control-label">Name<span class="field_req">*</span></label>
					<div class="controls">
						<input type="text" name="name" class="input required "
							placeholder="Cardholder's name" />
					</div>
				</div>
				<div style="display: inline-block">
					<div class="control-group">
						<label class="control-label">Card Number <span
							class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="number" class="input required  digits"
								placeholder="Enter Your Card Number" />
						</div>
					</div>
						<div class="control-group">
						<label class="control-label">Expiry<span
							class="field_req">*</span></label>
						<div class="controls">
							<select name="exp_month" id="exp_month"
								class="input span2  exp_month" placeholder="Expiry Month"
								style="width: 94px;display:inline" onChange="$(&quot;#exp_year&quot;).valid();"></select>
							<span style="margin-left: 10px; margin-right: 10px">/ </span> <select
								name="exp_year" id="exp_year"
								class="input required  digits span2 exp_year atleastThreeMonths"
								placeholder="Expiry Year" style="width: 94px;display:inline"></select>
						</div>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">CVC<span class="field_req">*</span></label>
					<div class="controls">
						<input type="text" name="cvc" class="input required  digits"
							placeholder="Card security code" />

					</div>

				</div>
					
				<!-- <div class="control-group">	
                    <label class="control-label">Gateway<span class="field_req">*</span></label>
                    <div class="controls">
                    			<select class="required" name="gateway">
                    		<option value="">select</option>
                    		<option value="Stripe">Stripe</option>
                    		<option value="Paypal">Paypal</option>
                    	</select>
                    </div>
                    </div> -->
			</fieldset>
		</form>
		<form id="gateway" class="form-horizontal hide">
			<input type="text" name="gateway" class="hidden" value="Stripe" />
		</form>
	</div>
  <div class="modal-footer form-actions" style="margin-top:0px">
							<span style="float:left"><i class="icon-lock" style="font-size: 17px;float: left;"></i><span style="margin-left:5px">Secure</span></span>
       		<a href="#"
				class="btn" data-dismiss="modal" style="float:right">Close</a>
			<a href="#" type="submit" id="updateCreditCard"
				class="save btn btn-primary" style="float:right;margin-right:10px">Save</a> 
    </div>
</div>
</script><script id="subscribe-downgrade-template" type="text/html">

{{#eachkeys this}}
{{#if value.allowed}}
This plan allows upto {{value.allowed}} {{key}} while you have 2 at the moment. You need to delete {{key}} before downgrading.
{{/if}}	

{{/eachkeys}}
</script><script id="purchase-email-plan-template" type="text/html">
<div class="span6">
    <div class="well">
        <form id="planform" class="form-horizontal " name="emailPlan">
            <fieldset>
                <div class="control-group">
                    <legend>Update Plan</legend>
                    <label class="control-label">Plan<span class="field_req">*</span></label>
                    <div class="controls">
                        <select class="required" name="plan_id">
                            <option value="EMAIL-10000">Emails 10000</option>
							<option value="EMAIL-25000">Emails 25000</option>
							<option value="EMAIL-50000">Emails 50000</option>-	
                        </select>
                    </div>
					 <div class="controls hide">
                       <input name="quantity" value=1></input>
                    </div>
                </div>
            </fieldset>
        </form>
        <form id="gateway" class="form-horizontal hide">
            <input type="text" name="gateway" class="hidden" value="Stripe" />
        </form>
 			{{#unless billing_data_json_string}}
			<form id="CCform" class="form-horizontal card_details"
				name="card_details">
				<fieldset>
				<div class="control-group">
	                   <legend>Card Details</legend>
						<label class="control-label">Name<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="name" class="input required "
								placeholder="Cardholder's name" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">Card Number <span
							class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="number" class="input required  digits"
								placeholder="Enter Card Number" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">Expiry<span
							class="field_req">*</span></label>
						<div class="controls">
							<select name="exp_month" id="exp_month"
								class="input span2  exp_month" placeholder="Expiry Month"
								style="width: 94px" onChange="$(&quot;#exp_year&quot;).valid();"></select>
							<span style="margin-left: 10px; margin-right: 10px">/ </span> <select
								name="exp_year" id="exp_year"
								class="input required  digits span2 exp_year atleastThreeMonths"
								placeholder="Expiry Year" style="width: 94px"></select>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">CVC<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="cvc" class="input required digits"
								placeholder="CVC" />
						</div>
					</div>
			
					<div class="control-group">
						<label class="control-label">Address<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="address_line1" class="required"
								id="address1" placeholder="address" />
						</div>
					</div>
					<div class="control-group">
						<div class="controls">
							<input type="text" name="address_line2" id="address2"
								placeholder="address" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">ZIP Code<span class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="address_zip" class="required" id="address_zip" placeholder="zip" /><br /> <br />						
							</div>
					</div>
					<div class="control-group">
						<label class="control-label">Country<span
							class="field_req">*</span></label>
						<div class="controls">
							<select class="country required" id="country"
								name="address_country"
								onchange="print_state('state',this.selectedIndex);"></select>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">State<span class="field_req">*</span></label>
						<div class="controls">
							<select class="required" name="address_state" id="state"
								class="required" name="address_country">
							</select>
						</div>
					</div>
					<!-- <div class="control-group">	
                    <label class="control-label">Gateway<span class="field_req">*</span></label>
                    <div class="controls">
                    			<select class="required" name="gateway">
                    		<option value="">select</option>
                    		<option value="Stripe">Stripe</option>
                    		<option value="Paypal">Paypal</option>
                    	</select>
                    </div>
                    </div> -->
				</fieldset>
			</form>
			{{/unless}}
        <div class="form-actions" align="center">
            <a href="#" type="submit" id="subscribe" class="save btn btn-primary">Change Plan</a>
            <a href="#subscribe" class="btn ">Close</a>
        </div>
		
    </div>
</div>
</script><script id="invoice-collection-template" type="html/text">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Invoice <small>AgileCrm</small></h1>
        </div>
    </div>
</div>
<div class="row">
    <div class="span9">
        <table class="table table-striped" id="sort-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody id="invoice-model-list" class="model-list-cursor">
            </tbody>
        </table>
    </div>
</div>
</script>
<script id="invoice-model-template" type="text/html">
	{{#each lines.data}}	
{{#if this.plan}}
	<td class="data" data="{{this.id}}">
    	{{this.plan.name}}
	</td>
	<td>{{epochToHumanDate "mm/dd/yyyy" period.start}}</td>
	<td>{{epochToHumanDate "mm/dd/yyyy" period.end}}</td>
	<td>{{this.plan.amount}}</td>

{{/if}}
{{/each}}		
</script>

<script id="invoice-partial-collection-template" type="html/text">
        <table class="table table-striped" id="sort-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody id="invoice-partial-model-list" class="model-list-cursor">
            </tbody>
        </table>
</script>
<script id="invoice-partial-model-template" type="text/html">
	{{#each lines.data}}	
{{#if this.plan}}
	<td class="data" data="{{this.id}}">
    	{{this.plan.name}}
	</td>
	<td>{{epochToHumanDate "mm/dd/yyyy" period.start}}</td>
	<td>{{epochToHumanDate "mm/dd/yyyy" period.end}}</td>
	<td>{{this.plan.amount}}</td>

{{/if}}
{{/each}}		
</script><script id="invoice-detail-template" type="html/text">
<div>
<input style="margin-left: 760px;margin-bottom:20px;" class="print_btn"type="button" type="button" value="Print" onclick="window.print()">
<br>
<div class="span8" style="border:2px solid #D4D4D4">
     <div class="row" style="margin: 1% 0% 7% 4%;">
	<table width="100%"><colgroup><col width="60%"><col width="40%"></colgroup><tbody><tr><td> <img src="img/crm-plugins/formbuilder.png" height="35" width="135"></td><td><h1>Invoice</h1></td></tr></tbody></table>
	<br>
		<table width="90%">
			<tbody>
				<tr>
				 <td>
                <address>
					<strong>Agile CRM,</strong><br />
                    440 N Wolfe Road,<br />
                    Sunnyvale, CA, 94085<br />
                </address>
				</td>
				<td align="right">
				
                <table class="invoice-head" style="background-color:transparent;">
                    <tbody>
						<tr>
                            <td class="pull-right"><strong>Invoice#</strong></td>
                            <td>{{invoice.id}}</td>
                        </tr>
						<tr>
                            <td class="pull-right"><strong>Date</strong></td>
                            <td>{{epochToHumanDate "dd-mmm-yyyy" invoice.date}}</td>
                        </tr>
						<tr>
                            <td class="pull-right"><strong>Customer#</strong></td>
                            <td>{{invoice.customer}}</td>
                        </tr>
						{{#if_not_equals company.company_name "My company"}}<tr>
                            <td class="pull-right"><strong>Company</strong></td>
                            <td>{{company.company_name}}</td></tr>
                        {{/if_not_equals}}
                        
                      </tbody>
                </table>
				</td></tr></tbody>
			</table>
       <div class="row">
            <div class="span7">
                <table class="table table-bordered">
                    <thead>
                        <tr>
							<th>S No</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#each invoice.lines.data}}
                        <tr><td>{{numeric_operation @index 1 "+"}}</td>
                           {{#if_equals type "subscription"}} 
								<td>{{plan.name}} (${{numeric_operation plan.amount 100 "/"}}/{{plan.interval}}) <br/> for the period {{epochToHumanDate "mm/dd/yyyy" period.start}} - {{epochToHumanDate "mm/dd/yyyy" period.end}}</td>
                            {{/if_equals}}
							{{#if_equals type "invoiceitem"}} 
								<td>{{description}}</td>
                            {{/if_equals}}
							<td>{{quantity}}</td>
                            <td>{{#if_less_than amount 0}}-{{/if_less_than}}${{get_amount_with_possitive amount}}</td>
                        </tr>
                        {{/each}}
                    </tbody>
                </table>
				
					<div class="pull-right" style="margin-right:30px;">
					<strong>Total: </strong>${{numeric_operation invoice.total 100 "/"}}
					</div>
            </div>
        </div>
        <br/><br/><br/>
		<table width="100%">
          <tbody>
			<tr><td>
                <i class="icon-phone"></i> +1.800.980.0729
				</td>
				<td>
                <i class="icon-envelope"></i> billing@agilecrm.com
				</td>
				<td>
                <i class="icon-globe"></i> https://www.agilecrm.com
				</td>
			</tr>
		</tbody>
    </table>
	</div>


</div>
<br>
<input style="margin-left: 760px;margin-top:20px;" class="print_btn"type="button" type="button" value="Print" onclick="window.print()">
</div>
</script><script id="pro-plan-block-legacy-template" type="text/html">
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
					<li><span class="value">Unlimited</span> Campaigns</li>
					<li><span class="value">20,000 </span>Pageviews</li>
					<li><span class="value">10 </span>Web Rules</li>

				</ul>
					</div>
					<div class="plan-collection-buy">
						<div class="cat-addtocart-out">
							<div class="cat-addtocart" id="custom_buy_btn">
								<input type="radio" name="pro_vs_lite"
									value="pro" version = "v1" class="djc_addtocart_link" />
							</div>
						</div>
					</div>
				</div>
			</div>
			</script>
			
			<script id="pro-plan-block-template" type="text/html">
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
								id="pro_plan_price">99.99</span></span> <br> <span
								style="color: #999">per user per month</span>
						</div>
					</div>
					<div class="plan-collection-content">
						<ul class="unstyled plan-features">
					<li><span class="value">Unlimited</span> Contacts</li>
					<li><span class="value">Unlimited</span> Campaigns</li>
					<li><span class="value">20,000 </span>Pageviews</li>
					<li><span class="value">10 </span>Web Rules</li>

				</ul>
					</div>
					<div class="plan-collection-buy">
						<div class="cat-addtocart-out">
							<div class="cat-addtocart" id="custom_buy_btn">
								<input type="radio" name="pro_vs_lite"
									value="pro" version = "v2" class="djc_addtocart_link" />
							</div>
						</div>
					</div>
				</div>
			</div>
			</script><script id="purchase-email-plan-template" type="text/html">
<div class="modal hide fade email-plan-modal"
	id="email-plan-upgrade-modal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>
			<i class="icon-edit"></i> Purchase
		</h3>
	</div>
	<div class="modal-body">
		<form id="planform" class="form-horizontal update_plan"
			name="emailPlan">
			<fieldset>
				<div class="control-group">
					<label class="control-label">Emails<span class="field_req">*</span></label>
					<div class="controls">
						<input type="text" name="count" class="input required"/>
					</div>
				</div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn btn-primary save">Purchase</a> <span class="update-plan"></span>
	</div>
</div>
</script><script id="purchase-plan-new-template" type="text/html">
<div>
	<div class="span9">
		<div class="well">
			<legend>Upgrade Plan</legend>
			<div id="update-plan-details-info"></div>

			<form id="planform" class="form-horizontal update_plan" name="plan">
				<fieldset>
					<div class="alert alert-info hide"></div>
						<div class="control-group">
							<label class="control-label">Plan<span class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="plan_type" class="input required"
									value="{{plan_type}}" />
							</div>
						</div>
						<div class="control-group">
							<label class="control-label">Quantity<span
								class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="quantity"
									class="input required  digits" value="{{quantity}}" />
							</div>
						</div>

					<div class="span8"
						style="background-color: rgb(221, 232, 248); border-radius: 10px; padding: 5px; overflow:auto;">

						<a style="float: right; padding: 1px 5px 1px; margin: 10px;"
							class="btn btn-success" id="change_plan" href="#subscribe"><i
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

				</fieldset>
			</form>
			{{#if billing_data_json_string}}
			<form id="CCform" class="form-horizontal card_details"
				name="card_details">
				<fieldset>
				<div class="control-group">
						<label class="control-label">Name<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="name" class="input required "
								placeholder="Cardholder's name" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">Card Number <span
							class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="number" class="input required  digits"
								placeholder="Enter Card Number" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">Expiry<span
							class="field_req">*</span></label>
						<div class="controls">
							<select name="exp_month" id="exp_month"
								class="input span2  exp_month" placeholder="Expiry Month"
								style="width: 94px" onChange="$(&quot;#exp_year&quot;).valid();"></select>
							<span style="margin-left: 10px; margin-right: 10px">/ </span> <select
								name="exp_year" id="exp_year"
								class="input required  digits span2 exp_year atleastThreeMonths"
								placeholder="Expiry Year" style="width: 94px"></select>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">CVC<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="cvc" class="input required digits"
								placeholder="CVC" />
						</div>
					</div>
			
					<div class="control-group">
						<label class="control-label">Address<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="address_line1" class="required"
								id="address1" placeholder="address" />
						</div>
					</div>
					<div class="control-group">
						<div class="controls">
							<input type="text" name="address_line2" id="address2"
								placeholder="address" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">ZIP Code<span class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="address_zip" class="required" id="address_zip" placeholder="zip" /><br /> <br />						
							</div>
					</div>
					<div class="control-group">
						<label class="control-label">Country<span
							class="field_req">*</span></label>
						<div class="controls">
							<select class="country required" id="country"
								name="address_country"
								onchange="print_state('state',this.selectedIndex);"></select>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">State<span class="field_req">*</span></label>
						<div class="controls">
							<select class="required" name="address_state" id="state"
								class="required" name="address_country">
							</select>
						</div>
					</div>
					<!-- <div class="control-group">	
                    <label class="control-label">Gateway<span class="field_req">*</span></label>
                    <div class="controls">
                    			<select class="required" name="gateway">
                    		<option value="">select</option>
                    		<option value="Stripe">Stripe</option>
                    		<option value="Paypal">Paypal</option>
                    	</select>
                    </div>
                    </div> -->
				</fieldset>
			</form>
			{{/if}}
			<form id="gateway" class="form-horizontal hide">
				<input type="text" name="gateway" class="hidden" value="Stripe" />
			</form>
	<br/>
			<div class="form-actions" style="padding-left: 160px;">
				<a href="#" type="submit" id="subscribe"
					class="save btn btn-primary">Upgrade Plan</a> <a href="#subscribe"
					class="btn ">Close</a>
			</div>

		</div>
	</div>
	<div class="span3">

		<div class="testmonials_box" style=""></div>

	</div>
</div>
</script>
<script id="update-plan-details-info-template" type="text/html">

</script><script id="purchase-plan-template" type="text/html">
<div>
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
								<input type="text" name="plan_id" class="input required"
									value="{{plan_id}}" />
							</div>
						</div>

					<div class="control-group">
							<label class="control-label">Version<span class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="version" class="input required"
									value="{{version}}" />
							</div>
						</div>

						<div class="control-group">
							<label class="control-label">Plan<span class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="plan_type" class="input required"
									value="{{plan_type}}" />
							</div>
						</div>
						<div class="control-group">
							<label class="control-label">Quantity<span
								class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="quantity"
									class="input required  digits" value="{{quantity}}" />
							</div>
						</div>
						<div class="control-group">
							<label class="control-label">Discount<span
								class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="discount" class="input required"
									value="{{discount}}" />
							</div>
						</div>
					<div class="control-group">
							<label class="control-label">coupon<span
								class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="coupon" class="input required"
									value="{{coupon_code}}" />
							</div>
						</div>

					</div>

					<div class="span8"
						style="background-color: rgb(221, 232, 248); border-radius: 10px; padding: 5px; overflow:auto;">

						<a style="float: right; padding: 1px 5px 1px; margin: 10px;"
							class="btn btn-success" id="change_plan" href="#subscribe"><i
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
			<form id="gateway" class="form-horizontal hide">
				<input type="text" name="gateway" class="hidden" value="Stripe" />
			</form>
			{{#if new_signup}}
			<form id="CCform" class="form-horizontal card_details"
				name="card_details">
				<fieldset>
				<div class="control-group">
						<label class="control-label">Name<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="name" class="input required "
								placeholder="Cardholder's name" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">Card Number <span
							class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="number" class="input required  digits"
								placeholder="Enter Card Number" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">Expiry<span
							class="field_req">*</span></label>
						<div class="controls">
							<select name="exp_month" id="exp_month"
								class="input span2  exp_month" placeholder="Expiry Month"
								style="width: 94px" onChange="$(&quot;#exp_year&quot;).valid();"></select>
							<span style="margin-left: 10px; margin-right: 10px">/ </span> <select
								name="exp_year" id="exp_year"
								class="input required  digits span2 exp_year atleastThreeMonths"
								placeholder="Expiry Year" style="width: 94px"></select>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">CVC<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="cvc" class="input required digits"
								placeholder="CVC" />
						</div>
					</div>
				</fieldset>
			</form>
			{{/if}}
	<br/>
			<div class="form-actions" style="padding-left: 160px;">
				<a href="#" type="submit" id="subscribe"
					class="save btn btn-primary">Upgrade Plan</a> <a href="#subscribe"
					class="btn ">Close</a>
			</div>

		</div>
	</div>
	<div class="span3">

		<div class="testmonials_box" style=""></div>

	</div>
</div>
</script>
<script id="update-plan-details-info-template" type="text/html">

</script><script id="regular-plan-block-legacy-template" type="text/html">
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
				<li><span class="value">10</span> Campaigns</li>
				<li><span class="value">10,000 </span>Pageviews</li>
				<li><span class="value">5 </span>Web Rules</li>
			</ul>

		</div>

		<div class="plan-collection-buy">
			<div class="cat-addtocart-out">
				<div class="cat-addtocart" id="pro_buy_btn">
					<input type="radio" name="pro_vs_lite" version = "v1" value="regular"
						class="djc_addtocart_link" />
				</div>
			</div>
		</div>
	</div>
</div>
</script>

<script id="regular-plan-block-template" type="text/html">
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
				<li><span class="value">10</span> Campaigns</li>
				<li><span class="value">10,000 </span>Pageviews</li>
				<li><span class="value">5 </span>Web Rules</li>
			</ul>

		</div>

		<div class="plan-collection-buy">
			<div class="cat-addtocart-out">
				<div class="cat-addtocart" id="pro_buy_btn">
					<input type="radio" name="pro_vs_lite" version = "v2" value="regular"
						class="djc_addtocart_link" />
				</div>
			</div>
		</div>
	</div>
</div>
</script><script id="starter-plan-block-legacy-template" type="text/html">
<div class="span4 plan-collection-bot clearfix"
	style="margin-left: 0px;">
	<div class="plan-collection-in liteplan">
		<span class="plan-off-ribbon"></span>
		<h3 class="plan-collection-top">
			<span class="plan-collection-icon"></span><br> <span
				title="Lite Plan" id="plan_name">Starter</span>
		</h3>
		<div class="plan-collection-content" id="litepricebox">
			<div id="starter_plan_price_content">
				<span style="color: #FA782D; font-size: 30px;">$<span
					id="starter_plan_price">14.99</span></span> <br> <span
					style="color: #999">per user per month</span>
			</div>
		</div>
		<div class="plan-collection-content" id="basic_plan_statement">
			<ul class="unstyled plan-features">
				<li><span class="value">10,000</span> Contacts</li>
				<li><span class="value">3</span> Campaigns</li>
				<li><span class="value">5000 </span>Pageviews</li>
				<li><span class="value">3 </span>Web Rules</li>
			</ul>
		</div>
		<div class="plan-collection-buy">
			<div class="cat-addtocart-out">
				<div class="cat-addtocart" id="lite_buy_btn">
					<input type="radio" name="pro_vs_lite" version = "v1" value="starter"
						class="djc_addtocart_link" />
				</div>
			</div>
		</div>
	</div>
</div>
</script>

<script id="starter-plan-block-template" type="text/html">
<div class="span4 plan-collection-bot clearfix"
	style="margin-left: 0px;">
	<div class="plan-collection-in liteplan">
		<span class="plan-off-ribbon"></span>
		<h3 class="plan-collection-top">
			<span class="plan-collection-icon"></span><br> <span
				title="Lite Plan" id="plan_name">Starter new</span>
		</h3>
		<div class="plan-collection-content" id="litepricebox">
			<div id="starter_plan_price_content">
				<span style="color: #FA782D; font-size: 30px;">$<span
					id="starter_plan_price">24.99</span></span> <br> <span
					style="color: #999">per user per month</span>
			</div>
		</div>
		<div class="plan-collection-content" id="basic_plan_statement">
			<ul class="unstyled plan-features">
				<li><span class="value">10,000</span> Contacts</li>
				<li><span class="value">3</span> Campaigns</li>
				<li><span class="value">5000 </span>Pageviews</li>
				<li><span class="value">3 </span>Web Rules</li>
			</ul>
		</div>
		<div class="plan-collection-buy">
			<div class="cat-addtocart-out">
				<div class="cat-addtocart" id="lite_buy_btn">
					<input type="radio" name="pro_vs_lite" version = "v2" value="starter"
						class="djc_addtocart_link" />
					
				</div>
			</div>
		</div>
	</div>
</div>
</script><script id="subscribe-template" type="text/html">
<div class="row-fluid">
	<div class="span12">
		<div class="page-header">
			<h1>Plan and Upgrade
				<a href="#" {{#check_plan "FREE"}} id="cancel-account" {{else}} id="cancel-account-request" {{/check_plan}} class="pull-right" align="center" style="font-size:17px;margin-top:10px;">Cancel My Account</a>
			</h1>
		</div>
	</div>
</div>
<div class="row-fluid">
	<div class="span7">
		<div class="span4" id="plan-details-pane" style="margin-right:65px;"></div>
		<div class="span4" id="email-details-pane"></div>
		
	</div>
	
	<div class="span4 agile-testimonial">
 <div id="myCarousel" class="carousel slide">
  <ol class="carousel-indicators">
    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
    <li data-target="#myCarousel" data-slide-to="1"></li>
    <li data-target="#myCarousel" data-slide-to="2"></li>
  </ol>
  
  <div class="carousel-inner">
    <div class="active item"><div class="pull-left tweet-img-pricing"><img src="../../img/testimonial-nicolas.png"></div>
<div class="pull-left tweet-txt"><span class="tweet-arrow"></span>
<div class="tweet-head">
<span class="tweet-authname">Nicolas Woirhaye</span><span class="tweet-authdesc">Co-founder - IKO System</span></div>
</div>
<div class="clearfix"></div>
<div class="tweet-info">
 I've seen and used dozens of CRMs. This one may change the market upside down. Absolutely great, easy-to-use and powerful. </div>


</div>
 <div class="item">
 <div class="pull-left tweet-img-pricing"><img src="../../img/testimonial-ron.png"></div>
<div class="pull-left tweet-txt"><span class="tweet-arrow"></span>
<div class="tweet-head">
<span class="tweet-authname">Ron Kaplan</span><span class="tweet-authdesc">Sales and Business Development - Espresso Logic</span></div>
</div>
<div class="clearfix"></div>
<div class="tweet-info">
 Agile CRM is an exciting and powerful system. The capability to create complex workflows is immensely useful and easy - simply a matter of drag and drop.  </div>
</div>

 
 
 
  <div class="item">
  <div class="pull-left tweet-img-pricing"><img src="../../img/testimonial-gary.png"></div>
<div class="pull-left tweet-txt"><span class="tweet-arrow"></span>
<div class="tweet-head">
<span class="tweet-authname">Gary Tramer</span><span class="tweet-authdesc">Head of Strategy - WebReception</span></div>
</div>
<div class="clearfix"></div>
<div class="tweet-info">
 Agile CRM is the coolest, easiest and by far the most productive CRM I've ever used. Within 20 minutes we had customized the CRM and sent out a complex outbound email campaign. We're already converting our leads. Insane!   </div>

    </div>
    
   <div class="item"> 
 <div class="pull-left tweet-img-pricing"><img src="../../img/testimonial-mark.png"></div>
<div class="pull-left tweet-txt"><span class="tweet-arrow"></span>
<div class="tweet-head">
<span class="tweet-authname">Mark Valles
</span><span class="tweet-authdesc">Sales Acceleration Expert - Infusion-4</span></div>

</div>
<div class="clearfix"></div>
<div class="tweet-info">
Brilliant! I literally made 3 clicks and I was able to connect and immediately place calls, get actionable social media information, and view my emails in a stunningly nice way.  
</div>
</div>
   <div class="item"> 
   <div class="pull-left tweet-img-pricing"><img src="../../img/testimonial-paulsingh.png"></div>
<div class="pull-left tweet-txt"><span class="tweet-arrow"></span>
<div class="tweet-head">
<span class="tweet-authname">Paul Singh
</span><span class="tweet-authdesc">CEO, Espresso Logic (Venture Backed)
</span></div>

</div>
<div class="clearfix"></div>
<div class="tweet-info">
For a startup that relies a lot on on-line business, Agile CRM has been an invaluable team to our sales team as it integrates many capabilities out-of-the-box. 
</div>
</div>
  </div>
  
  <a class="carousel-control left" href="#myCarousel" data-slide="prev">&lsaquo;</a>
  <a class="carousel-control right" href="#myCarousel" data-slide="next">&rsaquo;</a>
</div>

 
<!-- <li>

</li> -->
<!-- <li>
<div class="pull-left tweet-img-pricing"><img src="../../img/testimonial-ron.png"></div>
<div class="pull-left tweet-txt"><span class="tweet-arrow"></span>
<div class="tweet-head">
<span class="tweet-authname">Ron Kaplan</span><span class="tweet-authdesc">Sales and Business Development - Espresso Logic</span></div>
<div class="tweet-info">
 Agile CRM is an exciting and powerful system. The capability to create complex workflows is immensely useful and easy - simply a matter of drag and drop.  </div>
</div>
<div class="clearfix"></div>
</li>
<li>
<div class="pull-left tweet-img-pricing"><img src="../../img/testimonial-gary.png"></div>
<div class="pull-left tweet-txt"><span class="tweet-arrow"></span>
<div class="tweet-head">
<span class="tweet-authname">Gary Tramer</span><span class="tweet-authdesc">Head of Strategy - WebReception</span></div>
<div class="tweet-info">
 Agile CRM is the coolest, easiest and by far the most productive CRM I've ever used. Within 20 minutes we had customized the CRM and sent out a complex outbound email campaign. We're already converting our leads. Insane!   </div>
</div>
<div class="clearfix"></div>
</li> -->



<!-- <li>

</li>
<li>

</li> -->

</div>
	
</div>

<div class="row-fluid" style="margin-top:50px">
	<div>
		<div style="border-bottom:1px solid #f5f5f5;margin-bottom:20px">
			<h3>Your Credit Card Details
				{{#if billingData}}
					<a href="#update-card" id="change-card" class="pull-right" align="center" style="margin-top:-5px;margin-right:10px">Change Card</a>
				{{else}}
					<a href="#update-card" id="change-card" class="pull-right" align="center" style="margin-top:-5px;margin-right:10px;display:none">Change Card</a>
				{{/if}}
			</h3>
		</div>
		<div id="customer-details-holder">		
	</div>
	</div>
</div>
	{{#if billingData}}
	<div class="row-fluid" style="margin-top:50px">
	<div class="span6" style="margin-top:20px">
		<div style="border-bottom:1px solid #f5f5f5;margin-bottom:20px">
			<h3>Recent Payments<small style="font-size:11px;margin-left:5px">Thank you</small></h3>
		</div>
			<div id="invoice-details-holder"></div>
	</div>
	</div>
	{{/if}}
<div id="credit-card-form-modal-holder"></div>

</script>

<script id="customer-details-block-template" type="text/html">
{{#stringToJSON this "billingData"}}{{/stringToJSON}}
{{#if billingData}}
	<div class="card-details">
		Name: {{billingData.cards.data.0.name}} </br>
		Credit card: **** **** **** {{billingData.cards.data.0.last4}} <br/>
		Expiration: {{getMonthFromIndex billingData.cards.data.0.expMonth}}, {{billingData.cards.data.0.expYear}}  ({{#if_less_than billingData.cards.data.0.expMonth 9}}0{{billingData.cards.data.0.expMonth}}{{else}}{{billingData.cards.data.0.expMonth}}{{/if_less_than}} / {{billingData.cards.data.0.expYear}})
	</div>
	{{else}}
		No Credit Cards attached. <a href="#attach-card" id="change-card">Attach card</a>
{{/if}}
</script>

<script id="account-plan-details-template" type="text/html">
<div class="well" style="width: 220px; height: 200px;">
	<div style="width: 220px; height: 180px;">
		<div style="border-bottom: 1px solid #e5e5e5">
		<h3><i class="icon-group" style="margin-right:5px"></i>Users</h3>
		</div>
		<div class="clearfix"></div>
<div class="form-horizontal"
			style="margin-left: -33%; margin-top: 10px">
		{{#getSubscriptionBasedOnPlan billingData plan}}
			<div class="control-group">
				<label class="control-label">Plan</label>
				<div class="controls" style="margin-top: 5px;">
					{{getAccountPlanName ../plan.plan_type}} ({{getAccountPlanInteval
					../plan.plan_type}})</div>
			</div>
			<div class="control-group" style="margin-top: -5%">
				<label class="control-label" style="margin-top: -2%">Users</label>
				<div class="controls">{{quantity}}</div>
			</div>
			<div class="control-group" style="margin-top: -5%">
				<label class="control-label" style="margin-top: -2%">Cost</label>
				<div class="controls">${{total}} <small>({{quantity}} * {{numeric_operation plan.amount "100" "/"}})</small>
				</div> 
			</div>
			<div class="control-group" style="margin-top: -5%">
				<label class="control-label" style="margin-top: -2%">Next Invoice</label>
				<div class="controls">
					{{epochToHumanDate "mmm dd, yyyy" currentPeriodEnd}}
				</div>
			</div>
		</div>
		{{else}}
		<div class="control-group">
				<label class="control-label">Plan</label>
				<div class="controls" style="margin-top: 5px;">
					Free</div>
			</div>
			<div class="control-group" style="margin-top: -5%">
				<label class="control-label" style="margin-top: -2%">Users</label>
				<div class="controls">2</div>
			</div>
</div>
</div>
		{{/getSubscriptionBasedOnPlan}} 
		{{#if billingData}} 
			{{#check_plan "FREE"}}
				<a class="btn btn-primary" href="#subscribe-plan" id="account_plan_upgrade">
				Upgrade </a> 
				{{else}}
				<a class="btn btn-primary" href="#subscribe-plan" id="account_plan_upgrade">
				Modify </a> 
			{{/check_plan}}
			{{else}} 
				<a class="btn btn-primary" href="#" id="attach_card_notification"> Upgrade </a>
	 	{{/if}}

	<!--<a style="margin-top:6px;float:right;cursor:pointer;text-decoration:none" id="user-plan-details-popover"><i class="icon-info-sign"></i> Plan Details</a> -->
</div>
</script>
<script id="account-plan-details-popover-template" type="text/html">
{{#if_greater contactLimit 2100000000}}
 	Contacts   : Unlimited Contacts <br/>
{{else}}
	Contacts   : {{contactLimit}} <br/>
{{/if_greater}}
 Webrules   : {{webRuleLimit}} <br/>
{{#if_greater contactLimit 2100000000}}
 	Contacts   : Unlimited Workflows <br/>
{{else}}
	Workflows   : {{workflowLimit}} <br/>
{{/if_greater}}
White Label : {{#if whiteLabelEnabled}} Yes {{else}} No{{/if}} 
</script>

<script id="email-plan-subscription-details-popover-template" type="text/html">
{{#if emailPlan}}
		 Plan Limit   : {{numeric_operation emailPlan.quantity "1000" "*"}} <br/>
	{{else}}
		Plan Limit   : 5000 <small>Powered by Agile CRM</small> <br/>
{{/if}}
{{#if cachedData.one_time_emails_count}}
 	Emails in account    : {{cachedData.one_time_emails_count}} <br/>
{{/if}}

</script>

<script id="email-plan-details-template" type="text/html">
<div class="span4">
	<div class="well" style="width: 220px; height: 200px;">
		<div style="width: 220px; height: 180px;">
			<div style="border-bottom: 1px solid #e5e5e5;">
				<h3><i class="icon-envelope" style="margin-right:5px"></i>Emails</h3>
			</div>
			<div class="clearfix"></div>

			<form id="gateway" class="form-horizontal hide">
				<input type="text" name="gateway" class="hidden" value="Stripe" />
			</form>

			{{#getSubscriptionBasedOnPlan billingData emailPlan}} 
			<div class="form-horizontal" name="emailPlan"
				style="margin-left: -33%; margin-top: 10px" id="email-plan-form">
				<div class="control-group">
					<label class="control-label">Emails</label>
					<div class="controls" style="margin-top: 5px;">
						{{numeric_operation ../emailPlan.quantity 1000 "*"}} <small>per month</small> <br/>
						<span>{{getRemaininaEmails}}  <small>Remaining</small></span>
				</div>
</div>
				<div class="control-group" style="margin-top: -5%">
					<label class="control-label" style="margin-top: -2%">Cost</label>
					<div class="controls">${{total}} <small>(Charged @ ${{numeric_operation plan.amount "100" "/"}} per thousand)</small></div>
				</div>	
				<div class="control-group" style="margin-top: -5%">
					<label class="control-label" style="margin-top: -2%">Next Invoice</label>
					<div class="controls">
						{{epochToHumanDate "mmm dd, yyyy" currentPeriodEnd}}
					</div>
				</div>
				</div>
</div>
				{{else}}
				<div style="margin-top: 10%; text-align: center;">
					5000 Emails <br />
				<div><small>(One time free emails powered by Agile CRM)
				
<span>
									<img border="0" src="/img/help.png" style="height: 8px; margin-top:-7px;" rel="popover" data-placement="bottom" data-title="Lead Score" data-content="5000 one time free emails that will contain 'Powered by Agile CRM' at the bottom of the email. To remove this, you may purchase an email package." id="element" data-trigger="hover" data-original-title="">
								</span>
			</small></div>

				<div style="margin-top:25px;margin-bottom:30px; text-align: center;">
					{{getRemaininaEmails}} Emails remaining
				</div>
</div>
			{{/getSubscriptionBasedOnPlan}}

			<div class="clearfix"></div>
			{{#if billingData}}
			{{#if emailPlan}}
					<a class="btn btn-primary" href="#subscribe" id="account_email_plan_upgrade">Modify </a>
				{{else}}
					<a class="btn btn-primary" href="#subscribe" id="account_email_plan_upgrade">Upgrade </a>
			{{/if}}
			{{else}} 
				<a class="btn btn-primary" href="#" id="account_email_attach_card"> Upgrade </a> 
			{{/if}}
<!--	<a style="margin-top:6px;float:right;cursor:pointer;text-decoration:none" id="email-plan-details-popover"><i class="icon-info-sign"></i> Usage Details</span> -->
		
</div>
</div>
</script>

<script id="email-plan-form-template" type="text/html">
<div class="span4">
	<div class="well" style="width: 220px; height: 200px;">
		<div style="width: 220px; height: 180px;">
			<div style="border-bottom: 1px solid #e5e5e5;">
				<h3>Email plan</h3>
			</div>
			<div class="clearfix"></div>

			<form id="gateway" class="form-horizontal hide">
				<input type="text" name="gateway" class="hidden" value="Stripe" />
			</form>
				<form class="form-horizontal" name="emailPlan" style="margin-left:-40%;margin-top:10px" id="email-plan-form">
						<div class="control-group">
                       		 <label class="control-label" style="margin-top:5px">Send Rate</label>
                        		<div class="controls" style="margin-top: 5px;margin-left:150px">
									<span style="margin-top:5px;float:right"> X 1000 </span><input type="text" class="input input-small number email_plan_minimum required" id="email-quantity" style="width:105px" name="quantity" placeholder="Number of emails"></input>
                        		</div>
                    		</div>
							<div class="control-group">
								<div class="controls">
									<span style="font-size: 30px;margin-left:0px">$<span id="emails_total_cost">0</span></span><span style="margin-left:3px">/ month</span>
									<br/>
									<small style="margin-top: 0px;margin-left:-30px">
										 charged @ <span id="email_rate">{{#mandrill_exist}}$2{{else}}$4{{/mandrill_exist}}</span> / 1000 emails
									</small>
								</div>
							</div>
				</form>
		</div>
<div class="clearfix"></div>
					<a class="btn btn-primary save" href="#"> Purchase </a>

					<a class="btn" href="#" id="close"> Cancel </a>
	</div>
</div>
</script>

   <script id="charge-collection-template" type="html/text">
	{{#if this.length}}
        <table class="table table-striped" id="sort-table">
            <thead>
                <tr>
				 	<th>Date</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody id="charge-model-list" class="model-list-cursor">
            </tbody>
        </table>
	{{else}}
		No recent payments.
	{{/if}}
</script>
<script id="charge-model-template" type="text/html">
{{#if paid}}
	<td class="data" data="{{invoice}}"><time class="time-ago" datetime="{{epochToHumanDate "" created}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created}}</time></td>	
	<td >
    	${{numeric_operation amount 100 "/"}} {{#if refunded}}  (Refunded) {{/if}}{{#unless refunded}}{{#if_not_equals amountRefunded 0}} (Refunded ${{numeric_operation amountRefunded 100 "/"}}){{/if_not_equals}}{{/unless}}
	</td>
{{/if}}
	
	
</script>
<script id="subscribe-new-template" type="text/html">
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
		{{#if plan}}
			{{#if_equals plan.version "v1"}}
				{{#if_equals planLimits.planName "FREE"}}
						{{getTemplate "starter-plan-block"}}
						{{getTemplate "regular-plan-block"}}
						{{getTemplate "pro-plan-block"}}
					{{else}}
						{{#if_equals planLimits.planName "STARTER"}}
							{{plan.version}}
							{{getTemplate "starter-plan-block-legacy"}}
								{{else}}
									{{getTemplate "starter-plan-block"}}
						{{/if_equals}}
						{{#if_equals planLimits.planName "REGULAR"}}
									{{getTemplate "regular-plan-block-legacy"}}
							{{else}}
									{{getTemplate "regular-plan-block"}}
						{{/if_equals}}
						{{#if_equals planLimits.planName "PRO"}}
									{{getTemplate "pro-plan-block-legacy"}}
								{{else}}
									{{getTemplate "pro-plan-block"}}
						{{/if_equals}}
				{{/if_equals}}
				{{else}}
					{{getTemplate "starter-plan-block"}}
						{{getTemplate "regular-plan-block"}}
						{{getTemplate "pro-plan-block"}}
			{{/if_equals}}
		{{/if}}
			
			
			
			
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
							<input id="users_select_slider" type="slider" name="price"
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
									<input type="text" placeholder="Enter Promo Code" id="coupon_code" style="margin-bottom: 0px;" rel="tooltip" title="" />
									<input type="button" class="btn" value="Validate" id="check_valid_coupon" style="margin: 0px 3px;" />
 									<i class=""></i><br/> <span class="error" style="color: #df382c;"></span>
						</form>
					</div>
	
				</div>
			<div class="row-fluid"
					style="text-align: center; margin-top: 25px; margin-bottom: 15px;">
						<div class="inline-block m-l-xxxl">
							<a href="#purchase-plan" id="purchase-plan"
								class="btn btn-large btn-primary" style="padding: 15px 30px;"><b>Proceed
									to Payment</b></a>
						</div>
						<div class="inline-block m-t-lg m-r-sm right" style="margin-top:37px">
							<a href="#" >Skip for now</a><br/>
						</div>
						<br/>
							<span id="proceed-error" style="color:red;"></span>
				</div>

			</div>
		</div>
	</div>
	<div class="span3">
		<div class="well">
			<p class="link-border" style="display:inline;">
				<strong>Your Current Plan:</strong>
			</p>
<br>
<br>
			<p>
                 Plan: {{titleFromEnums this.plan.plan_type}}     
            </p>
            {{#if plan.quantity}}
            <p>
                 Quantity: {{this.plan.quantity}}     
            </p>
            {{/if}}
			<p>
				<a href="#choose_users" id="add_more_users" class="anchor-link">Add more users</a>
			</p>
			
		</div>
		


		<div id="account-stats" class="well"></div>
	
		<hr style="margin: 18px 0px">

	</div>
</div>
</script><script id="subscription-card-detail-template" type="text/html">
<div class="span6">
	<div class="well">
		<form id="CCform" class="form-horizontal card_details"
			name="card_details">
			<fieldset>

				<div class="control-group">
					<legend>Update Card</legend>
					<label class="control-label">Name<span class="field_req">*</span></label>
					<div class="controls">
						<input type="text" name="name" class="input required "
							placeholder="Cardholder's name" />
					</div>
				</div>
				<div style="display: inline-block">
					<div class="control-group">
						<label class="control-label">Card Number <span
							class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="number" class="input required  digits"
								placeholder="Enter Your Card Number" />
						</div>
					</div>
						<div class="control-group">
						<label class="control-label">Expiry<span
							class="field_req">*</span></label>
						<div class="controls">
							<select name="exp_month" id="exp_month"
								class="input span2  exp_month" placeholder="Expiry Month"
								style="width: 94px" onChange="$(&quot;#exp_year&quot;).valid();"></select>
							<span style="margin-left: 10px; margin-right: 10px">/ </span> <select
								name="exp_year" id="exp_year"
								class="input required  digits span2 exp_year atleastThreeMonths"
								placeholder="Expiry Year" style="width: 94px"></select>
						</div>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">CVC<span class="field_req">*</span></label>
					<div class="controls">
						<input type="text" name="cvc" class="input required  digits"
							placeholder="Card security code" />
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Country<span class="field_req">*</span></label>
					<div class="controls">
						<select class="country required" id="country"
							name="address_country"
							onchange="print_state('state',this.selectedIndex);"></select>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">State<span class="field_req">*</span></label>
					<div class="controls">
						<select class="required" name="address_state" id="state"
							class="required" name="address_country">
						</select>
					</div>
				</div>
				<!-- <div class="control-group">	
                    <label class="control-label">Gateway<span class="field_req">*</span></label>
                    <div class="controls">
                    			<select class="required" name="gateway">
                    		<option value="">select</option>
                    		<option value="Stripe">Stripe</option>
                    		<option value="Paypal">Paypal</option>
                    	</select>
                    </div>
                    </div> -->
			</fieldset>
		</form>
		<form id="gateway" class="form-horizontal hide">
			<input type="text" name="gateway" class="hidden" value="Stripe" />
		</form>
		<div class="form-actions" align="center">
			<a href="#" type="submit" id="updateCreditCard"
				class="save btn btn-primary">Update</a> <a href="#"
				class="btn close" data-dismiss="modal">Close</a>
		</div>
	</div>
</div>
</script><script id="update-plan-template" type="text/html">
<div class="span6">
    <div class="well">
        <form id="planform" class="form-horizontal " name="plan">
            <fieldset>
                <div class="control-group">
                    <legend>Update Plan</legend>
                    <label class="control-label">Plan<span class="field_req">*</span></label>
                    <div class="controls">
                        <select class="required" name="plan_id">
                            <option value="plan10">Lite</option>
                            <option value="plan20">Pro</option>
                        </select>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">Quantity<span class="field_req">*</span></label>
                    <div class="controls">
                        <select class="required" name="quantity">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                </div>
            </fieldset>
        </form>
        <form id="gateway" class="form-horizontal hide">
            <input type="text" name="gateway" class="hidden" value="Stripe" />
        </form>
        <div class="form-actions" align="center">
            <a href="#" type="submit" id="subscribe" class="save btn btn-primary">Change Plan</a>
            <a href="#subscribe" class="btn ">Close</a>
        </div>
    </div>
</div>
</script>