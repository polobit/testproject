<script id="credit-card-form-template" type="text/html">
<div class="modal fade" id="credit-card-form-modal">
 <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
		{{#if billingData}}
        	<h3 class="modal-title"><i class="icon-plus-sign"></i>  Change Card</h3>
			{{else}}
			<h3 class="modal-title"><i class="icon-plus-sign"></i>  Attach Card</h3>			
		{{/if}}
    </div>
    <div class="modal-body">
		<form id="CCform" class="form-horizontal card_details"
			name="card_details">
			<fieldset>

				<div class="control-group form-group">
					<label class="control-label col-sm-4">Name<span class="field_req">*</span></label>
					<div class="controls col-sm-6">
						<input type="text" name="name" class="input required form-control"
							placeholder="Cardholder's name" />
					</div>
				</div>
				
					<div class="control-group form-group">
						<label class="control-label col-sm-4">Card Number <span
							class="field_req">*</span></label>
						<div class="controls col-sm-6">
							<input type="text" name="number" class="input required  digits form-control"
								placeholder="Enter Your Card Number" />
						</div>
					</div>
						<div class="control-group form-group">
						<label class="control-label col-sm-4">Expiry<span
							class="field_req">*</span></label>
						<div class="controls col-sm-6">
							<select name="exp_month" id="exp_month"
								class="input form-control exp_month inline-block" style="width:44%;" placeholder="Expiry Month"
								 onChange="$(&quot;#exp_year&quot;).valid();"></select>
							<span class="m-l-sm m-r-sm">/ </span> <select
								name="exp_year" id="exp_year"
								class="input required form-control  digits  exp_year atleastThreeMonths inline-block" style="width:44%;"
								placeholder="Expiry Year" ></select>
						</div>
					</div>
				
				<div class="control-group form-group">
					<label class="control-label col-sm-4">CVC<span class="field_req">*</span></label>
					<div class="controls col-sm-6">
						<input type="text" name="cvc" class="input required  digits form-control"
							placeholder="Card security code" />

					</div>

				</div>
					
				<!-- <div class="control-group form-group">	
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
		<form id="gateway" class="form-horizontal hide">
			<input type="text" name="gateway" class="hidden form-control" value="Stripe" />
		</form>
	</div>
  <div class="modal-footer form-actions">
							<span class="pull-left"><i class="icon-lock text-md pull-left"></i><span class="m-l-xs">Secure</span></span>
<a href="#" type="submit" id="updateCreditCard" class="save btn btn-primary btn-sm pull-right">Save</a>
<!--<a href="#"
				class="btn btn-sm btn-danger" data-dismiss="modal">Close</a>-->
			
    </div>
</div>
</div>
</div>
</script><script id="purchase-email-plan-template" type="text/html">
<div class="span6">
    <div class="well">
        <form id="planform" class="form-horizontal " name="emailPlan">
            <fieldset>
                <div class="control-group">
                    <legend>Update Plan</legend>
                    <label class="control-label">Plan<span class="field_req">*</span></label>
                    <div class="controls">
                        <select class="required form-control" name="plan_id">
                            <option value="EMAIL-10000">Emails 10000</option>
							<option value="EMAIL-25000">Emails 25000</option>
							<option value="EMAIL-50000">Emails 50000</option>-	
                        </select>
                    </div>
					 <div class="controls hide">
                       <input name="quantity" class="form-control" value=1></input>
                    </div>
                </div>
            </fieldset>
        </form>
        <form id="gateway" class="form-horizontal hide">
            <input type="text" name="gateway" class="hidden form-control" value="Stripe" />
        </form>
 			{{#unless billing_data_json_string}}
			<form id="CCform" class="form-horizontal card_details"
				name="card_details">
				<fieldset>
				<div class="control-group">
	                   <legend>Card Details</legend>
						<label class="control-label">Name<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="name" class="input required form-control"
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
							<input type="text" class="form-control" name="address_line2" id="address2"
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
							<select class="country form-control required" id="country"
								name="address_country"
								onchange="print_state('state',this.selectedIndex);"></select>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">State<span class="field_req">*</span></label>
						<div class="controls">
							<select class="required form-control" name="address_state" id="state"
								name="address_country">
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
			{{/unless}}
        <div class="form-actions" align="center">
			<a href="#subscribe" class="btn btn-sm btn-default">Close</a>
            <a href="#" type="submit" id="subscribe" class="save btn btn-sm btn-primary">Change Plan</a>
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
<div class="col-md-11">
<input class="print_btn m-b-md btn btn-sm btn-default pull-right" type="button" type="button" value="Print" onclick="window.print()">
<br><br>
<div style="border:2px solid #D4D4D4">
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
       <div class="col-md-11 p-l-none">
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
				
					<div class="pull-right">
					<strong>Total: </strong>${{numeric_operation invoice.total 100 "/"}}
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
<input class="print_btn m-t-md btn btn-sm btn-default pull-right"type="button" type="button" value="Print" onclick="window.print()">
</div>
</script><script id="purchase-email-plan-template" type="text/html">
<div class="modal fade in email-plan-modal"
	id="email-plan-upgrade-modal">
 <div class="modal-dialog">
    <div class="modal-content">
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
						<input type="text" name="count" class="input required form-control"/>
					</div>
				</div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn btn-sm btn-primary save">Purchase</a> <span class="update-plan"></span>
	</div>
</div>
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

					<div class="span8"
						style="background-color: rgb(221, 232, 248); border-radius: 10px; padding: 5px; overflow:auto;">

						<a style="float: right; padding: 1px 5px 1px; margin: 10px;"
							class="btn btn-sm btn-success" id="change_plan" href="#subscribe"><i
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
			{{#if_equals "free" current_plan}}
			<form id="CCform" class="form-horizontal card_details"
				name="card_details">
				<fieldset>
				<div class="control-group">
						<label class="control-label">Name<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="name" class="input required form-control"
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
							<input type="text" class="form-control" name="address_line2" id="address2"
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
							<select class="country form-control required" id="country"
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
			</form>
	<br/>
			<div class="form-actions" style="padding-left: 160px;">
				<a href="#subscribe" class="btn btn-sm">Close</a>
				<a href="#" type="submit" id="subscribe" class="save btn btn-sm btn-primary">Upgrade Plan</a> 
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
<div class="row">
	<div class="col-md-9">
		<div class="well">
			<legend>Upgrade Plan</legend>
			<div id="update-plan-details-info"></div>

			<form id="planform" class="form-horizontal update_plan" name="plan">
				<fieldset>
					<div class="alert alert-info hide"></div>
					<div style="display: none;">
						<div class="control-group form-group">
							<label class="control-label col-sm-2">Plan<span class="field_req">*</span></label>
							<div class="controls col-sm-8">
								<input type="text" name="plan_id" class="input form-control required"
									value="{{plan_id}}" />
							</div>
						</div>
						<div class="control-group form-group">
							<label class="control-label col-sm-2">Plan<span class="field_req">*</span></label>
							<div class="controls col-sm-8">
								<input type="text" name="plan_type" class="input required form-control"
									value="{{plan_type}}" />
							</div>
						</div>
						<div class="control-group form-group">
							<label class="control-label">Quantity<span
								class="field_req col-sm-2">*</span></label>
							<div class="controls col-sm-8">
								<input type="text" name="quantity"
									class="input required  digits form-control" value="{{quantity}}" />
							</div>
						</div>
						<div class="control-group form-group">
							<label class="control-label col-sm-2">Discount<span
								class="field_req">*</span></label>
							<div class="controls col-sm-8">
								<input type="text" name="discount" class="input required form-control"
									value="{{discount}}" />
							</div>
						</div>
					<div class="control-group form-group">
							<label class="control-label col-sm-2">coupon<span
								class="field_req">*</span></label>
							<div class="controls col-sm-8">
								<input type="text" name="coupon" class="input required form-control"
									value="{{coupon_code}}" />
							</div>
						</div>

					</div>

					<div class="col-md-12 r-5x p-md" style="background-color: rgb(221, 232, 248);">

						
                           <div class="row">
						<div class="col-md-6">
							<div class="control-group form-group">
								<label class="control-label col-sm-4 p-t-none">Selected
									Plan : </label>
								<div class="controls col-sm-8">{{plan}}</div>
							</div>
							<div class="control-group form-group">
								<label class="control-label col-sm-4 p-t-none">Quantity
									(Users) : </label>
								<div class="controls col-sm-8">{{quantity}}</div>
							</div>
							<div class="control-group form-group">
								<label class="control-label col-sm-4 p-t-none">Billing
									Cycle : </label>
								<div class="controls col-sm-8">{{cycle}}</div>
							</div>
							<div class="control-group form-group">
								<label class="control-label col-sm-4 p-t-none">Next
									Billing Date : </label>
								<div class="controls col-sm-8">
									{{epochToHumanDate "mm/dd/yy" date}}
									<p class="help-block">MM/DD/YY</p>
								</div>
							</div>
							<div class="control-group form-group">
								<label class="control-label col-sm-4 p-t-none">Total
									Cost : </label>
								<div class="controls col-sm-8">
									<span>$</span><b>{{cost}}</b>
									<p class="help-block">
										( {{quantity}} * {{months}} * <span>$</span>{{price}} )
									</p>
								</div>
							</div>

 					  {{#if coupon_code}}
							<div class="control-group form-group">
								<label class="control-label col-sm-4 p-t-none">Discount : </label>
								<div class="controls col-sm-8">
									<b class="coupon_code_discount_amount"><span id="coupon_code_discount_percent"><img src="img/1-0.gif" height="15px" width="15px" /></span></b>
								</div>
							</div>
  							<div class="control-group form-group">
								<label class="control-label col-sm-4 p-t-none">Total Payable Cost : </label>
								<div class="controls">
									$<b class="coupon_code_discount_amount"><span id="total_cost_with_discount"><img src="img/1-0.gif" height="15px" width="15px" /></span></b>
								</div>
							</div>
 						{{/if}}
</div>
						<div class="col-md-6">
                         <a class="btn btn-sm btn-success pull-right" id="change_plan" href="#subscribe"><i
							class="icon-edit"></i> Change Plan</a> 
<div class="clearfix"></div>
<br>
							{{#if_equals "Monthly" cycle}}
							<div class="info-block">
								<i class="icon-info-sign"></i><strong>UPGRADE</strong>
								<p>
									You can save $<b>{{yearly_discount}}</b> by upgrading to yearly
									or save $<b>{{bi_yearly_discount}}</b> by upgrading to 2 year
									plan.<br />Hurry! <b><a href="#subscribe">Change plan</a></b>
									and claim your savings!!
								</p>
							</div>
							{{/if_equals}} {{#if_equals "Yearly" cycle}}
							<div class="info-block">
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
					</div>

				</fieldset>
			</form>
			<form id="gateway" class="form-horizontal hide">
				<input type="text" name="gateway" class="hidden form-control" value="Stripe" />
			</form>
			{{#if new_signup}}
			<form id="CCform" class="form-horizontal card_details"
				name="card_details">
				<fieldset>
				<div class="control-group">
						<label class="control-label">Name<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="name" class="input required form-control"
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
				</fieldset>
			</form>
			{{/if}}
	<br/>
<hr>
			<div class="row">
            <div class="col-sm-offset-3 col-sm-6">
				<a href="#subscribe" class="btn btn-sm btn-danger">Close</a>
				<a href="#" type="submit" id="subscribe" class="save btn btn-sm btn-primary">Upgrade Plan</a>
             </div>
			</div>

		</div>
	</div>
	<div class="span3">

		<div class="testmonials_box" style=""></div>

	</div>
</div>
</script>
<script id="update-plan-details-info-template" type="text/html">

</script><script id="subscribe-template" type="text/html">
<div class="custom-animated custom-fadeInUp">
<div class="bg-light lter b-b wrapper-md">
<div class="row">
	<div class="col-md-12">
		
			<h3 class="pull-left m-t-none h3 font-thin">Plan and Upgrade</h3>
<a href="#" {{#check_plan "FREE"}} id="cancel-account" {{else}} id="cancel-account-request" {{/check_plan}} class="pull-right text-lg text-info">Cancel My Account</a>
<div class="clearfix"></div>		
 </div>
	
</div>
</div>
<div class="wrapper-md">
<div class="row">
	<div class="col-md-7">
<div class="row">
		<div class="col-md-5" id="plan-details-pane"></div>
		<div class="col-md-5" id="email-details-pane"></div>
		</div>
	</div>
	
	<div class="col-md-4 col-md-offset-0 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 agile-testimonial panel">
 <div id="myCarousel" class="carousel slide">
  <ol class="carousel-indicators">
    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
    <li data-target="#myCarousel" data-slide-to="1"></li>
    <li data-target="#myCarousel" data-slide-to="2"></li>
  </ol>
  
  <div class="carousel-inner">
  <div class="active item">
	<div class="pull-left tweet-img-pricing">
		<img src="../../img/testimonial-nicolas.png">
	</div>
	<div class="pull-left tweet-txt">
		<span class="tweet-arrow"></span>
	<div class="tweet-head">
		<span class="tweet-authname">Nicolas Woirhaye</span>
		<span class="tweet-authdesc">Co-founder - IKO System</span>
	</div>
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

<div class="row">
	<div class="col-md-12">
		<div class="panel panel-default">
			<div class="panel-heading">Your Credit Card Details
				{{#if billingData}}
					<a href="#update-card" id="change-card" class="pull-right m-r-sm text-info">Change Card</a>
				{{else}}
					<a href="#update-card" id="change-card" class="pull-right m-r-sm text-info" style="display:none">Change Card</a>
				{{/if}}
			</div>
		<div class="panel-body">
			<div id="customer-details-holder"></div>
		</div>
		</div>
	</div>
</div>
	{{#if billingData}}
	<div class="row m-t m-b-sm">
	<div class="col-md-12">
<div class="panel panel-default">
		<div class="panel-heading">
			<div class="text-lg">Recent Payments &nbsp;<small>Thank you</small></div>
		</div>

			<div id="invoice-details-holder"></div>
</div>
	{{/if}}
</div>
</div>
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
<div class="panel panel-default">
	<div class="panel-heading">
		<div><i class="icon-group m-r-xs"></i>Users</div>
	</div>
	<div class="panel-body">
		
		
		
		
		<div class="form-horizontal">
		{{#getSubscriptionBasedOnPlan billingData plan}}
			<div class="control-group form-group m-b-none">
				<label class="control-label  col-xs-4 p-t-none">Plan</label>
				<div class="control-label text-left col-xs-8 p-t-none">
					{{getAccountPlanName ../plan.plan_type}} ({{getAccountPlanInteval
					../plan.plan_type}})</div>
			</div>
			<div class="control-group form-group m-b-none">
				<label class="control-label col-xs-4">Users</label>
				<div class="control-label text-left col-xs-8">{{quantity}}</div>
			</div>
			<div class="control-group form-group m-b-none">
				<label class="control-label col-xs-4">Cost</label>
				<div class="control-label text-left  col-xs-8">${{total}} <small class="block">({{quantity}} * {{numeric_operation plan.amount "100" "/"}})</small>
				</div> 
			</div>
			<div class="control-group form-group m-b-none">
				<label class="control-label col-xs-4">Next Invoice</label>
				<div class="control-label text-left col-xs-8">
					{{epochToHumanDate "mmm dd, yyyy" currentPeriodEnd}}
				</div>
			</div>
		
		{{else}}
		<div class="control-group form-group m-b-none">
				<label class="control-label col-xs-4">Plan</label>
				<div class="control-label text-left col-xs-8">
					Free</div>
			</div>
			<div class="control-group form-group m-b-none">
				<label class="control-label col-xs-4">Users</label>
				<div class="control-label text-left col-xs-8">2</div>
			</div>


		{{/getSubscriptionBasedOnPlan}}
		</div> 
		{{#if billingData}} 
			{{#check_plan "FREE"}}
				<a class="btn btn-sm btn-primary" href="#subscribe-plan" id="account_plan_upgrade">
				Upgrade </a> 
				{{else}}
				<a class="btn btn-sm btn-primary" href="#subscribe-plan" id="account_plan_upgrade">
				Modify </a> 
			{{/check_plan}}
			{{else}} 
				<a class="btn btn-sm btn-primary" href="#" id="attach_card_notification"> Upgrade </a>
	 	{{/if}}

	<!--<a style="margin-top:6px;float:right;cursor:pointer;text-decoration:none" id="user-plan-details-popover"><i class="icon-user"></i> Plan Details</a> -->
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
	<div class="panel panel-default">
		<div class="panel-heading"><div><i class="icon-envelope m-r-xs"></i>Emails</div></div>
		<div class="panel-body">

			<form id="gateway" class="form-horizontal hide">
				<input type="text" name="gateway" class="hidden form-control" value="Stripe" />
			</form>

			{{#getSubscriptionBasedOnPlan billingData emailPlan}} 
			<div class="form-horizontal" name="emailPlan" id="email-plan-form">
				<div class="control-group form-group m-b-none">
					<label class="control-label col-xs-4 p-t-none">Emails</label>
					<div class="controls col-xs-8 p-t-none">
						{{numeric_operation ../emailPlan.quantity 1000 "*"}} <small>per month</small> <br/>
						<span>{{getRemaininaEmails}}  <small>Remaining</small></span>
				</div>
</div>
				<div class="control-group form-group m-b-none">
					<label class="control-label col-xs-4">Cost</label>
					<div class="control-label text-left col-xs-8">${{total}} <small>(Charged @ ${{numeric_operation plan.amount "100" "/"}} per thousand)</small></div>
				</div>	
				<div class="control-group form-group m-b-none">
					<label class="control-label col-xs-4">Next Invoice</label>
					<div class="control-label text-left col-xs-8">
						{{epochToHumanDate "mmm dd, yyyy" currentPeriodEnd}}
					</div>
				</div>
				</div>

				{{else}}
				<div class="text-center">
					5000 Emails <br />
				<div><small>(One time free emails powered by Agile CRM)
				
<span>
									<img border="0" src="/img/help.png" class="question-tag m-t-n-xs " rel="popover" data-placement="bottom" data-title="Lead Score" data-content="5000 one time free emails that will contain 'Powered by Agile CRM' at the bottom of the email. To remove this, you may purchase an email package." id="element" data-trigger="hover" data-original-title="">
								</span>
			</small></div>

				<div class="text-center m-b-lg m-t-md">
					{{getRemaininaEmails}} Emails remaining
				</div>
</div>
			{{/getSubscriptionBasedOnPlan}}

			<div class="clearfix"></div>
			{{#if billingData}}
			{{#if emailPlan}}
					<a class="btn btn-sm btn-primary pricing-btn m-t-md" href="#subscribe" id="account_email_plan_upgrade">Modify </a>
				{{else}}
					<a class="btn btn-sm btn-primary pricing-btn m-t-md" href="#subscribe" id="account_email_plan_upgrade">Upgrade </a>
			{{/if}}
			{{else}} 
				<a class="btn btn-sm btn-primary pricing-btn m-t-md" href="#" id="account_email_attach_card"> Upgrade </a> 
			{{/if}}
<!--	<a style="margin-top:6px;float:right;cursor:pointer;text-decoration:none" id="email-plan-details-popover"><i class="icon-info-sign"></i> Usage Details</span> -->
		
</div>
</div>
</script>

<script id="email-plan-form-template" type="text/html">
<div>
	<div class="panel p pos-rlt">
		<div>
			<div class="b-b  p-b-xs">
				<div class="text-lg">Email plan</div>
			</div>
			<div class="clearfix"></div>

			<form id="gateway" class="form-horizontal hide">
				<input type="text" name="gateway" class="hidden form-control" value="Stripe" />
			</form>
				<form class="form-horizontal" name="emailPlan"  id="email-plan-form">
						<div class="control-group form-group text-center">
                       		 <label class="control-label col-xs-12 text-left">Send Rate</label>
                        		<div class="controls m-t-xs col-xs-12">
									<span class="m-t-xs pull-right"> X 1000 </span><input type="text" class="input input-small number email_plan_minimum required form-control" style="width:71%;" id="email-quantity"  name="quantity" placeholder="Number of emails"></input>
                        		</div>
                    		</div>
							<div class="control-group form-group">
								<div class="controls text-center">
									<span class="m-l-none text-xlg">$<span id="emails_total_cost">0</span></span><span class="m-l-xs">/ month</span>
									<br/>
									<small>
										 charged @ <span id="email_rate">{{#mandrill_exist}}$2{{else}}$4{{/mandrill_exist}}</span> / 1000 emails
									</small>
								</div>
							</div>
				</form>
		</div>
<div class="clearfix"></div>
<div class="pricing-btn">
					<a class="btn btn-default btn-sm pricing-btn" href="#" id="close"> Cancel </a>
					<a class="btn btn-sm btn-primary save pricing-btn" href="#" style="left:108px;"> Purchase </a>

</div>
	</div>
</div>
</div>
</script>

   <script id="charge-collection-template" type="html/text">
	{{#if this.length}}
        <table class="table table-striped m-b-none" id="sort-table">
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
	<td class="data text-muted" data="{{invoice}}"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago" datetime="{{epochToHumanDate "" created}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created}}</time></td>	
	<td >
    	${{numeric_operation amount 100 "/"}} {{#if refunded}}  (Refunded) {{/if}}{{#unless refunded}}{{#if_not_equals amountRefunded 0}} (Refunded ${{numeric_operation amountRefunded 100 "/"}}){{/if_not_equals}}{{/unless}}
	</td>
{{/if}}
	
	
</script>
<script id="subscribe-new-template" type="text/html">
<div class="wrapper-md lter bg-light b-b">
		<div class="row">
  			<div class="col-md-12">
				<h3 class="pull-left h3 font-thin">Plan and Upgrade</h3>
			</div>
		</div>
</div>
<div class="wrapper-md">
<div class="row">
	<div class="col-md-9">	

		<h3>
			Choose Plan And Billing Cycle
		</h3>
		<div class=" ac plan-strip">
			<ul class="tagsli pagination">
				<li><a href="#" class="monthly">Monthly</a></li>

				<li><a href="#" class="yearly">Yearly (20% off)</a></li>
				<li><a href="#" class="biennial">2 Years
							(40% off)</a></li>
			</ul>
		</div> 
	</div>
</div>
<div class="row m-t-md">
	<div id="plans-panel" class="btn-group col-md-9">
		<div class="row no-gutter">
			<div id="starter_plan" class="col-lg-4 col-md-6 col-sm-12 plan-collection-bot clearfix">
				<div class="plan-collection-in panel b-a liteplan">
					<div class="panel-heading wrapper-xs bg-primary no-border"></div>
					<span class="plan-off-ribbon"></span>
					<div class="price-panel wrapper text-center b-b b-light"> 
						<h4 class="text-u-c m-b-none" title="Lite Plan" id="plan_name">Starter</h4>
						<h3 class="plan-collection-top">
							<!-- <span class="plan-collection-icon"></span><br> -->							
						</h3>
						<div class="plan-collection-content m-t-sm" id="litepricebox">
						<h2 class="m-none">
						<div id="starter_plan_price_content">
							<sup class="text-xlg class="pos-rlt" style="top:-22px" text-danger">$</sup>
							<span class="text-2x text-lt" id="starter_plan_price">14.99</span><br>
							<span class="text-xs">per user per month</span>
						</div>
						</h2>
						</div>
					</div>
					<div class="plan-collection-content m-t-sm" id="basic_plan_statement">
					<ul class="unstyled plan-features list-group text-center no-borders m-t-sm m-b-sm">
						<li class="list-group-item"><i class="icon-check text-success m-r-xs"></i><span class="value">10,000</span> Contacts</li>
						<li class="list-group-item"><i class="icon-check text-success m-r-xs"></i><span class="value">3</span> Campaigns</li>
						<li class="list-group-item"><i class="icon-check text-success m-r-xs"></i><span class="value">5000 </span>Pageviews</li>
						<li class="list-group-item"><i class="icon-check text-success m-r-xs"></i><span class="value">3 </span>Web Rules</li>
					</ul>
					</div>
					<div class="panel-footer plan-collection-buy">
						<div class="cat-addtocart-out l-h-lg">
							<div class="cat-addtocart m-b-sm" id="lite_buy_btn">
							     <div class="user-plan text-lg text-black m-b-xs"></div>
								<button type="button" name="pro_vs_lite" class="btn plan btn-primary djc_addtocart_link" value="starter">Select Plan</button>
								<label class="i-checks i-checks-sm hidden"><input type="radio" name="pro_vs_lite" value="starter"
									class="djc_addtocart_link" /><i></i></label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="regular_plan" class="col-lg-4 col-md-6 col-sm-12 plan-collection-bot clearfix">
				<div class="plan-collection-in panel b-a proplan">
				  <div class="panel-heading wrapper-xs bg-primary no-border"></div>
					<span class="plan-off-ribbon"></span>
					<div class="price-panel wrapper text-center b-b b-light"> 
						<h4 class="text-u-c m-b-none" title="Pro Plan" id="plan_name">Regular</h4>
						<h3 class="plan-collection-top">
							<!-- <span class="plan-collection-icon pro_selected"></span> --><br>							
						</h3>
						<div class="plan-collection-content m-t-sm" id="propricebox">
						<h2 class="m-none">
						<div id="regular_plan_price_content">
							<sup class="text-xlg class="pos-rlt" style="top:-22px" text-danger">$</sup>
							<span class="text-2x text-lt" id="regular_plan_price">49.99</span><br>
							<span class="text-xs">per user per month</span>
						</div>
						</h2>
						</div>
					</div>					
					<div class="plan-collection-content" id="pro_plan_statement">
					<ul class="unstyled plan-features list-group text-center no-borders m-t-sm m-b-sm">
						<li class="list-group-item"><i class="icon-check text-success m-r-xs"></i><span class="value">50,000</span> Contacts</li>
						<li class="list-group-item"><i class="icon-check text-success m-r-xs"></i><span class="value">10</span> Campaigns</li>
						<li class="list-group-item"><i class="icon-check text-success m-r-xs"></i><span class="value">10,000 </span>Pageviews</li>
						<li class="list-group-item"><i class="icon-check text-success m-r-xs"></i><span class="value">5 </span>Web Rules</li>
					</ul>	

					</div>
					<div class="panel-footer plan-collection-buy">
						<div class="cat-addtocart-out l-h-lg">
							<div class="cat-addtocart m-b-sm" id="pro_buy_btn">
								 <div class="user-plan text-lg text-black m-b-xs"></div>	
								<button type="button" name="pro_vs_lite" class="btn plan btn-primary djc_addtocart_link" value="regular">Select Plan</button>							 
								<label class="i-checks i-checks-sm hidden"><input type="radio" name="pro_vs_lite" value="regular"
									class="djc_addtocart_link" /><i></i></label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="pro_plan" class="col-lg-4 col-md-6 col-sm-12 plan-collection-bot clearfix">
				<div class="plan-collection-in panel b-a customplan">
					<div class="panel-heading wrapper-xs bg-primary no-border"></div>
					<span class="plan-off-ribbon"></span>
					<div class="price-panel wrapper text-center b-b b-light"> 
						<h4 class="text-u-c m-b-none" title="Enterprise" id="plan_name">Pro</h4>
						<h3 class="plan-collection-top">
							<!-- <span class="plan-collection-icon"></span> --><br>							
						</h3>
						<div class="plan-collection-content m-t-sm" id="propricebox">
						<h2 class="m-none">
						<div id="pro_plan_price_content">
							<sup class="text-xlg class="pos-rlt" style="top:-22px" text-danger">$</sup>
							<span class="text-2x text-lt" id="pro_plan_price">79.99</span><br>
							<span class="text-xs">per user per month</span>
						</div>
						</h2>
						</div>
					</div>						
					<div class="plan-collection-content">
						<ul class="unstyled plan-features list-group text-center no-borders m-t-sm m-b-sm">
					<li class="list-group-item"><i class="icon-check text-success m-r-xs"></i><span class="value">Unlimited</span> Contacts</li>
					<li class="list-group-item"><i class="icon-check text-success m-r-xs"></i><span class="value">Unlimited</span> Campaigns</li>
					<li class="list-group-item"><i class="icon-check text-success m-r-xs"></i><span class="value">20,000 </span>Pageviews</li>
					<li class="list-group-item"><i class="icon-check text-success m-r-xs"></i><span class="value">10 </span>Web Rules</li>
				</ul>
					</div>
					<div class="panel-footer plan-collection-buy">
						<div class="cat-addtocart-out l-h-lg">
							<div class="cat-addtocart m-b-sm" id="custom_buy_btn">
								 <div class="user-plan text-lg text-black m-b-xs"></div>
								 <button type="button" name="pro_vs_lite" class="btn plan btn-primary djc_addtocart_link" value="pro">Select Plan</button>
								 <label class="i-checks i-checks-sm hidden"><input type="radio" name="pro_vs_lite"
									value="pro" class="djc_addtocart_link" /><i></i></label>
							</div>
						</div>
					</div>
				</div>
			</div>
	</div>
		<div class="row">

			<div class="b r-5x m p panel" id="choose_users">
				<div class="row">
					<div class="col-md-4">
						   <h4>
								<b id="choose_users_popover" rel="popover" data-placement="right"
								data-content="Choose number of users using this slider."
								data-original-title="Add More Users">Choose Number Of Users </b>
							</h4>
						<div class="m-t-md m-l-xs w-full">
							<input id="users_select_slider" type="slider" name="price"
								value="1" />
						</div>
					</div>
				<div class="col-md-8 m-t-xl">
						<form class="form-horizontal">
							<div class="control-group form-group">
								<label class="control-label col-sm-3 col-xs-3"> <span class="text-md"><b>Monthly Cost: </b></span></label>
								<div class="controls col-sm-9 col-xs-9">
									<span class="text-danger text-xlg">$<span id="users_total_cost">21.24</span></span>
									<p class="help-block m-t-none">
										( for <span class="text-danger" id="users_quantity">1</span>
										users )
									</p>
								</div>
							</div>
						</form>
					</div>

				
			<div class="col-md-6" style="margin-left: 40px;display:none" id="coupon_code_container">
						<form class="">
								<label class="control-label"> <span
									style="font-size: 15px;"><b>Coupon Code: </b><span style="font-size: 10px;">(Only for Credit Card)</span></span></label>
									<input type="text" class="form-control" placeholder="Enter Promo Code" id="coupon_code" style="margin-bottom: 0px;" rel="tooltip" title="" />
									<input type="button" class="btn btn-sm btn-default form-control" value="Validate" id="check_valid_coupon" style="margin: 0px 3px;" />
 									<i class=""></i><br/> <span class="error" style="color: #df382c;"></span>
						</form>
					</div>
	
				</div>
				<div class="row text-center m-t-lg m-b">
					<a href="#purchase-plan" id="purchase-plan"
						class="btn btn-large btn-primary p-t p-b p-l-lg p-r-lg"><b>Proceed
							to Payment</b></a><br/><a href="#" class="text-info">Skip for now</a><br/>
					
				</div>

			</div>
		</div>
	</div>
	<div class="col-md-3">
		<div class="well">
			<p class="link-border inline" >
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
	
		<hr class="m-t-md">

	</div>
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
						<input type="text" name="name" class="input required form-control"
							placeholder="Cardholder's name" />
					</div>
				</div>
				<div style="display: inline-block">
					<div class="control-group">
						<label class="control-label">Card Number <span
							class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="number" class="input required form-control digits"
								placeholder="Enter Your Card Number" />
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
				</div>
				<div class="control-group">
					<label class="control-label">CVC<span class="field_req">*</span></label>
					<div class="controls">
						<input type="text" name="cvc" class="input required form-control digits"
							placeholder="Card security code" />
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Country<span class="field_req">*</span></label>
					<div class="controls">
						<select class="country form-control required" id="country"
							name="address_country"
							onchange="print_state('state',this.selectedIndex);"></select>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">State<span class="field_req">*</span></label>
					<div class="controls">
						<select class="required form-control" name="address_state" id="state"
							name="address_country">
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
		<form id="gateway" class="form-horizontal hide">
			<input type="text" name="gateway" class="hidden form-control" value="Stripe" />
		</form>
		<div class="form-actions" align="center">
			<a href="#"	class="btn btn-sm btn-default close" data-dismiss="modal">Close</a>
			<a href="#" type="submit" id="updateCreditCard"	class="save btn btn-sm btn-primary">Update</a> 
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
                        <select class="required form-control" name="plan_id">
                            <option value="plan10">Lite</option>
                            <option value="plan20">Pro</option>
                        </select>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">Quantity<span class="field_req">*</span></label>
                    <div class="controls">
                        <select class="required form-control" name="quantity">
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
            <input type="text" name="gateway" class="hidden form-control" value="Stripe" />
        </form>
        <div class="form-actions" align="center">
			<a href="#subscribe" class="btn btn-sm btn-default">Close</a>
            <a href="#" type="submit" id="subscribe" class="save btn btn-sm btn-primary">Change Plan</a>
        </div>
    </div>
</div>
</script>