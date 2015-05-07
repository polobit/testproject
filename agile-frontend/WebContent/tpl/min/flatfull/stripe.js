<script id="stripe-profile-template" type="text/html">
<div class="wrapper-xs">
	{{#if customer.activeCard.name}}
		<a href="https://manage.stripe.com/customers/{{customer.id}}" target="_blank"><h4 class="text-u-c"><b>{{customer.activeCard.name}}</b></h4></a>
		{{#if customer.activeCard.addressState}}
			<p class="text-sm m-b-none">
				{{#if customer.activeCard.addressLine1}}{{customer.activeCard.addressLine1}},<br/>{{/if}}
				{{#if customer.activeCard.addressLine2}}{{customer.activeCard.addressLine2}},<br/>{{/if}}	
				{{#if customer.activeCard.addressCity}}{{customer.activeCard.addressCity}},<br/>{{/if}}
				{{customer.activeCard.addressState}}, 
				{{#if customer.activeCard.addressCountry}}
					{{customer.activeCard.addressCountry}}
				{{else}}
					{{customer.activeCard.country}}
				{{/if}}
			</p>
		{{/if}}
	{{else}}
		<a href="https://manage.stripe.com/customers/{{customer.id}}" target="_blank">{{getCurrentContactProperty "first_name"}} {{getCurrentContactProperty "last_name"}}</a>
	{{/if}}
</div>
<div class="wrapper-xs">
	<span>Subscription Details</span>
</div>
<ul class="list-group m-b-none text-base">
	{{#if customer.subscription}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">	
			<div class="col-md-5">Start Date
				<div class="pull-right">:</div>
			</div>
			<div class="col-md-6 m-l-sm text-muted">
				<i class="fa fa-clock-o m-r-xs"></i>
				<time class="time-ago" datetime="{{epochToHumanDate "" customer.subscription.start}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" customer.subscription.start}}</time>
			</div>
		</li>
		{{#if customer.subscription.currentPeriodEnd}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">	
			<div class="col-md-5">End Date
				<div class="pull-right">:</div>
			</div>
			<div class="col-md-6 m-l-sm text-muted">
				<i class="fa fa-clock-o m-r-xs"></i>
				<time class="time-ago" datetime="{{epochToHumanDate "" customer.subscription.currentPeriodEnd}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" customer.subscription.currentPeriodEnd}}</time>
			</div>
		</li>
		{{/if}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">	
			<div class="col-md-5">Current Plan
				<div class="pull-right">:</div>
			</div>
							
			<div class="col-md-6 m-l-sm">
				{{customer.subscription.plan.id}}
			</div>
		</li>
		<li class="list-group-item r-none b-l-none b-r-none text-base">	
			<div class="col-md-5">Interval
				<div class="pull-right">:</div>
			</div>
							
			<div class="col-md-6 m-l-sm">
				{{customer.subscription.plan.interval}}
			</div>
		</li>
		<li class="list-group-item r-none b-l-none b-r-none text-base">	
			<div class="col--md-5">Amount
				<div class="pull-right">:</div>
			</div>
							
			<div class="col-md-6 m-l-sm">
				{{numeric_operation customer.subscription.plan.amount 100 "/"}} {{toUpperCase customer.subscription.plan.currency}}
			</div>
		</li>
	{{else}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">
	    	No active subscription
		</li>
	{{/if}}
</ul>

<div class="wrapper-xs">
		<span>Invoices</span>
</div>
<ul class="list-group m-b-none text-base">
{{#if invoice.length}}
	{{#each invoice}}
		<li class="list-group-item r-none b-l-none b-r-none">
				<div class="clear">					
					<a class="pull-left" data-toggle="collapse" href="#collapse-{{id}}" >
						{{#if_equals paid true}}Paid{{else}}Pending{{/if_equals}}
					</a>
					<div class="pull-right">$ {{numeric_operation total 100 "/"}}</div>				
					<div class="clearfix"></div>					
					<div id="collapse-{{id}}" class="collapse" style="color: rgba(0, 0, 0, 0.5);">
							{{#each lines.data}}	
								{{#if_equals type "invoiceitem"}}
									<div class="pull-left">{{description}}</div>					
									<div class="pull-right">$ {{numeric_operation amount 100 "/"}}</div><br>
								{{/if_equals}}
								{{#if_equals type "subscription"}}
									<div class="pull-left">{{plan.name}}</div>					
									<div class="pull-right">$ {{numeric_operation plan.amount 100 "/"}}</div><br>
									<div class="pull-left">Quantity</div>					
									<div class="pull-right">{{quantity}}</div><br>
									<div class="text-ellipsis w-full"><small>
											{{epochToHumanDate "dd-mmm-yy" period.start}}&nbspto 
											{{epochToHumanDate "dd-mmm-yy" period.end}} 
									</small></div>
								{{/if_equals}}	         
							{{/each}}
					</div>
				</div>
					<small class="text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago" datetime="{{epochToHumanDate "" date}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" date}}</time></small>
		</li>
	{{/each}}
{{else}}
	<li class="list-group-item r-none b-l-none b-r-none">
	    No payments
	</li>
{{/if}}
</ul>
</script>

<script id="stripe-custom-field-template" type="text/html">
<div class="wrapper-sm">
{{#if_equals this.custom_fields.length "0"}}
	<p>Stripe id for each contact is stored in a text custom field. You have no custom fields defined. Please <a href="#custom-fields">create one</a>.</p>
{{else}}
	<p>Stripe id for each contact is stored in a text custom field. Select the custom field to be used.</p>
	<select name="stripe_field" id="stripe_custom_field_name" class="required form-control col-md-10 w-full">
     		<option class="default-select" value="">-Select-</option>
		{{#each this.custom_fields}}
			<option value="{{field_label}}">{{field_label}} 
			</option>
		{{/each}}
	</select>
	<p>Or, you can <a href="#custom-fields">create </a> a new text custom field.</p>
	<a href="#" class="btn btn-sm btn-default text-l-none" id="save_stripe_name">Save</a>
{{/if_equals}}
</div>
</script>

<script id="stripe-error-template" type="text/html">
<div class="wrapper-sm">
{{#check_length message "140"}}
	<div class="ellipsis-multi-line collapse-25 h-auto word-break text-base" title="{{message}}">
		{{{message}}}
	</div>
{{else}}
	<div class="word-break p-n text-base" style="line-height:160%;">
		{{{message}}}
	</div>
{{/check_length}}
</div>
</script>

<script id="stripe-login-template" type="text/html">
<div class="m-t">
	See the contact's subscriptions history and payments from your Stripe account.
<br>
	<a class="btn btn-sm btn-primary m-t-sm" href="{{url}}">Link Your Stripe</a>
</div>
</script>


<script id="stripe-revoke-access-template" type="text/html">

<div>

{{#if_equals custom_data.length "0"}}
				<p>Stripe id for each contact is stored in a text custom field. You have no custom fields defined. Please <a href="#custom-fields">create one</a>.</p>
	{{else}}
				{{#stringToJSON this "prefs"}}{{/stringToJSON}}
<p>Stripe id for each contact is stored in a text custom field. Select the custom field to be used.</p><form id="reportsForm">
<fieldset class="m-l-md">
		<div class="control-group m-l-n-md">
				<label class="control-label">Current custom field</label>
				<div class="controls" id="contactTypeAhead">
			
			<select name="stripe_field_name" id="stripe_custom_field" class="required col-md-10 form-control w-full">
     				<option class="default-select" value="">-Select-</option>
				{{#each custom_data}}
					{{#if_equals ../prefs.stripe_field_name field_label}}
						<option selected="selected" value="{{field_label}}">{{field_label}}</option>
						{{else}}	
							<option value="{{field_label}}">{{field_label}}</option>
					{{/if_equals}}
				{{/each}}
			</select>
			</div>
			</div>
		</fieldset>
				<div class="m-t-sm m-r-none m-b-xs m-l-none">
					<a class='btn btn-default btn-sm  p-t-xs p-b-xs p-l-xs p-r-xs m-l-xs' widget-name="Stripe" id="widget-prefs-save">Save</a>
					<a class='btn btn-danger btn-sm revoke-widget m-l-xs' widget-name="Stripe">Revoke Access</a>

					
					<a href="#add-widget" class='btn btn-default btn-sm' widget-name="Stripe">Cancel</a>
				</div> 
	</div>
</form>
{{/if_equals}}
</div>
</script>
