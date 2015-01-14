<script id="stripe-profile-template" type="text/html">
<div class="widget_content">
	{{#if customer.activeCard.name}}
		<a href="https://manage.stripe.com/customers/{{customer.id}}" target="_blank"><h4 style="text-transform: capitalize;"><b>{{customer.activeCard.name}}</b></h4></a>
		{{#if customer.activeCard.addressState}}
			<p style="font-size: 13px;margin-bottom:0px;">
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
<div class="sub_header">
	<div>Subscription Details</div>
</div>
<ul style="margin:0px;padding:10px 0px;border-bottom:1px solid #eee;">
	{{#if customer.subscription}}
		<li class="row-fluid">	
			<div class="span5">Start Date
				<div class="pull-right">:</div>
			</div>
			<div class="span6" style="margin-left: 10px;">
				<time class="time-ago" datetime="{{epochToHumanDate "" customer.subscription.start}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" customer.subscription.start}}</time>
			</div>
		</li>
		{{#if customer.subscription.currentPeriodEnd}}
		<li class="row-fluid">	
			<div class="span5">End Date
				<div class="pull-right">:</div>
			</div>
			<div class="span6" style="margin-left: 10px;">
				<time class="time-ago" datetime="{{epochToHumanDate "" customer.subscription.currentPeriodEnd}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" customer.subscription.currentPeriodEnd}}</time>
			</div>
		</li>
		{{/if}}
		<li class="row-fluid">	
			<div class="span5">Current Plan
				<div class="pull-right">:</div>
			</div>
							
			<div class="span6" style="margin-left: 10px;">
				{{customer.subscription.plan.id}}
			</div>
		</li>
		<li class="row-fluid">	
			<div class="span5">Interval
				<div class="pull-right">:</div>
			</div>
							
			<div class="span6" style="margin-left: 10px;">
				{{customer.subscription.plan.interval}}
			</div>
		</li>
		<li class="row-fluid">	
			<div class="span5">Amount
				<div class="pull-right">:</div>
			</div>
							
			<div class="span6" style="margin-left: 10px;">
				{{numeric_operation customer.subscription.plan.amount 100 "/"}} {{toUpperCase customer.subscription.plan.currency}}
			</div>
		</li>
	{{else}}
		<li style='color: #999;'>
	    	No active subscription
		</li>
	{{/if}}
</ul>

<div class="sub_header">
		<div>Invoices</div>
</div>
<ul style="margin:0px;">
{{#if invoice.length}}
	{{#each invoice}}
		<li class="row-fluid sub_header_li">
					<a class="pull-left" data-toggle="collapse" href="#collapse-{{id}}" >{{#if_equals paid true}}Paid{{else}}Pending{{/if_equals}}</a>
					<div class="pull-right">$ {{numeric_operation total 100 "/"}}</div><br>
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
									<div style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:100%"><small>
											{{epochToHumanDate "dd-mmm-yy" period.start}}&nbspto 
											{{epochToHumanDate "dd-mmm-yy" period.end}}
									</small></div>
								{{/if_equals}}	         
							{{/each}}
					</div>
					<small><time class="time-ago pull-left" datetime="{{epochToHumanDate "" date}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" date}}</time></small>
		</li>
	{{/each}}
{{else}}
	<li class="sub_header_li" style='color: #999;'>
	    No payments
	</li>
{{/if}}
</ul>
</script>

<script id="stripe-custom-field-template" type="text/html">
<div class="widget_content">
{{#if_equals this.custom_fields.length "0"}}
	<p>Stripe id for each contact is stored in a text custom field. You have no custom fields defined. Please <a href="#custom-fields">create one</a>.</p>
{{else}}
	<p>Stripe id for each contact is stored in a text custom field. Select the custom field to be used.</p>
	<select name="stripe_field" id="stripe_custom_field_name" class="required span10" style="width:100%" >
     		<option class="default-select" value="">-Select-</option>
		{{#each this.custom_fields}}
			<option value="{{field_label}}">{{field_label}} 
			</option>
		{{/each}}
	</select>
	<p>Or, you can <a href="#custom-fields">create </a> a new text custom field.</p>
	<a href="#" class="btn" id="save_stripe_name" style="text-decoration:none;">Save</a>
{{/if_equals}}
</div>
</script>

<script id="stripe-error-template" type="text/html">
{{#check_length message "140"}}
	<div class="ellipsis-multi-line collapse-25" title="{{message}}" style="height:auto;word-wrap: break-word;font-size:13px;">
		{{{message}}}
	</div>
{{else}}
	<div style="line-height:160%;word-wrap: break-word;padding:0px">
		{{{message}}}
	</div>
{{/check_length}}
</script>

<script id="stripe-login-template" type="text/html">
<div class="widget_content" style="border-bottom:none;line-height: 160%;">
	See the contact's subscriptions history and payments from your Stripe account.
	<p style="margin: 10px 0px 5px 0px;"></p><a class="btn" href="{{url}}">Link Your Stripe</a>
</div>
</script>


<script id="stripe-revoke-access-template" type="text/html">

<div class='widget_content' style='border-bottom:none;line-height: 160%;' >

{{#if_equals custom_data.length "0"}}
				<p>Stripe id for each contact is stored in a text custom field. You have no custom fields defined. Please <a href="#custom-fields">create one</a>.</p>
	{{else}}
				{{#stringToJSON this "prefs"}}{{/stringToJSON}}
<p>Stripe id for each contact is stored in a text custom field. Select the custom field to be used.</p><form id="reportsForm">
<fieldset style="margin-left: 20px">
		<div class="control-group" style="margin-left: -20px">
				<label class="control-label">Current custom field</label>
				<div class="controls" id="contactTypeAhead">
			
			<select name="stripe_field_name" id="stripe_custom_field" class="required span10" style="width:100%" >
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
				<p style='margin: 10px 0px 5px 0px;' >
					<a class='btn btn-primary' style='text-decoration: none;padding: 4px 5px;' widget-name="Stripe" id="widget-prefs-save">Save</a>
					<a class='btn revoke-widget ml_5' style='text-decoration: none;' widget-name="Stripe">Revoke Access</a>
					<a href="#add-widget" class='btn ml_5' style='text-decoration: none;' widget-name="Stripe">Cancel</a>
				</p> 
	</div>
</form>
{{/if_equals}}
</div>

</script>
