<script id="quickbooks-login-template" type="text/html">
<div class="m-t">
	See the contact's subscriptions history and payments from your quickbooks account.
	<div class="m-t-md"><a class="btn btn-primary btn-sm" href="{{url}}">Link Your Quickbooks</a>
</div>
</div>
</script>

<script id="quickbooks-error-template" type="text/html">
<div class="wrapper-sm">
{{#check_length message "140"}}
	<div class="ellipsis-multi-line collapse-25 word-break p-n overflow-hidden text-base" title="{{message}}" style="height:110px;line-height:160%;">
		{{{message}}}
	</div>
{{else}}
	<div class="word-break p-n text-base" style="line-height:160%;">
		{{{message}}}
	</div>
{{/check_length}}
</div>
</script>

<script id="quickbooks-profile-template" type="text/html"> 
<div class="wrapper-sm">
	<div>
		<div class="title_txt" >
			<a href="https://sg.qbo.intuit.com/app/customerdetail?nameId={{Customer.Id}}" target="_blank">
				<h4 class="h4 m-t-none text-cap">	
					 {{Customer.DisplayName}}
				</h4>
			</a>
		</div>
	</div>
	<div>
		{{#if Customer.BillAddr}}
			<p class="text-sm text-muted">	
				{{#if Customer.BillAddr.Line1}}
					{{Customer.BillAddr.Line1}}
				{{/if}}	
				{{#if Customer.BillAddr.CountrySubDivisionCode}}
					{{Customer.BillAddr.CountrySubDivisionCode}}
				{{/if}}
				{{#if Customer.BillAddr.City}}
					{{Customer.BillAddr.City}}
				{{/if}}
				{{#if Customer.BillAddr.Country}}
					{{Customer.BillAddr.Country}}
				{{/if}}	
				{{#if Customer.BillAddr.PostalCode}}
					{{Customer.BillAddr.PostalCode}}
				{{/if}}
			</p>				
		{{/if}}		
	</div>
	<div class="text-muted">
		{{#if Customer.Mobile}}
		
			{{#if Customer.Mobile.FreeFormNumber}}<i class="icon icon-phone text-md m-r-xs v-middle"></i> {{Customer.Mobile.FreeFormNumber}}<br> {{/if}}
		
		{{/if}}
		{{#if Customer.Fax}}
		
			{{#if Customer.Fax.FreeFormNumber}}<i class="icon icon-phone text-md m-r-xs v-middle"></i> {{Customer.Fax.FreeFormNumber}}<br> {{/if}}
		
		{{/if}}
		{{#if Customer.Mobile}}
		
			{{#if Customer.PrimaryPhone.FreeFormNumber}}<i class="icon icon-phone text-md m-r-xs v-middle"></i> {{Customer.PrimaryPhone.FreeFormNumber}}<br> {{/if}}
		
		{{/if}}
	</div>	
	<a id="quickbooks_add_invoice" class="m-t-xs c-p pull-left btn btn-xs btn-default" href="https://sg.qbo.intuit.com/app/invoice?nameId={{Customer.Id}}" target="_blank">Add Invoice</a>
	<div class="clearfix"></div>	
</div>
{{#if Invoices}}
	{{#isArray Invoices}}
	<div class="wrapper-sm b-t b-light">
		<a href="https://sg.qbo.intuit.com/app/customerdetail?nameId={{Customer.Id}}" target="_blank"><h4 class="m-n text-md">Invoices</h4></a>
	</div>
	<ul class="list-group m-n text-base">
		{{#each Invoices}}
			<li class="list-group-item r-none b-l-none b-r-none">
				<a class="pull-left" data-toggle="collapse" href="#collapse-{{Id}}" ><i class="icon icon-plus text-muted text-sm"></i></a>&nbsp;<a class="pull-left"  href="https://sg.qbo.intuit.com/app/invoice?txnId={{Id}}"  target="_blank">{{DocNumber}}</a>
				<div class="pull-right">
					{{#if CurrencyRef}}
					{{#if CurrencyRef.value}}
					{{CurrencyRef.value}}
					{{/if}}
					{{/if}}
					{{currencyFormat TotalAmt}}</div><br>
				
						<div id="collapse-{{Id}}" class="collapse text-muted" style="color: rgba(0, 0, 0, 0.5);">
						{{#isArray Line}}						
							{{#each Line}}	
								{{#if SalesItemLineDetail.ItemRef.name}}
									<div class="pull-left p-l-md">{{SalesItemLineDetail.ItemRef.name}}</div>					
									<div class="pull-right">{{currencyFormat Amount}}</div><br>
								{{/if}}	         
							{{/each}}					
						{{/isArray}}
					</div>
				<div class="pull-left"><small class="text-muted"><i class="fa fa-clock-o m-r-xs pull-left m-t-xs"></i><time class="time-ago pull-left" datetime="{{DueDate}}">{{DueDate}}</time></small></div>					
				<div class="pull-right text-muted"><span class="label dk bg-light">{{qbStatus  Balance}}</span></div><br>
					
			</li>
		{{/each}}
	</ul>	
	{{/isArray}}
	{{else}}
		<li class="sub_header_li text-light">
	    	No invoices	found		
		</li>
	{{/if}}
</script>

<script id="quickbooks-profile-addcontact-template" type="text/html">
<div class="wrapper-sm">
	<div>No customer found.</div>
	<a id="quickbooks_add_contact" class="btn btn-default btn-xs m-t-xs">Add Contact</a>
</div>
</script>
<script id="quickbook-items-template" type="text/html">
	{{#if_equals Line "0"}}
		<li class="list-group-item r-none b-l-none b-r-none text-light">
	    	No Items available. Add an item in your account to generate invoice.
		</li>		
	{{else}}
		<li class="list-group-item r-none b-l-none b-r-none p-b-none">
			<div class="col-md-6">Item name</div>
			<div class="col-md-6 text-right">Unit cost</div>
		</li>
		{{#isArray Line}}
			{{#each Line}}
				<li class="list-group-item r-none b-l-none b-r-none">
					<div class="pull-left" rel="tooltip" title="{{DetailType.ItemRef.name}}">{{DetailType.ItemRef.name}}</div>
					<div class="pull-right">{{Amount}}</div><br>
					<ul class="widget_tab_link m-n etxt-base" style="float:left;">
						<li><a href="#add" id="freshbooks_add_invoice" item_name={{name}} rel="tooltip" title="Generate invoice and send an email for this item">Add Invoice</a></li>
						<li><small class="text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago pull-left l_border" datetime="{{updated}}">{{updated}}</time></small></li>
					</ul>
				</li>
			{{/each}}
		{{else}}
			<li class="list-group-item r-none b-l-none b-r-none">
				<div class="pull-left" rel="tooltip" title="{{item.description}}">{{item.name}}</div>
				<div class="pull-right">{{item.unit_cost}}</div><br>
				<small class="text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago pull-left" datetime="{{item.updated}}">{{item.updated}}</time></small>
				<ul class="widget_tab_link m-n text-base" style="float:left;">
					<li><a href="#add" id="freshbooks_add_invoice" item_name={{item.name}} rel="tooltip" title="Generate invoice and send an email for this item">Add Invoice</a></li>
					<li><small class="text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago pull-left l_border" datetime="{{item.updated}}">{{item.updated}}</time></small></li>
				</ul>
			</li>
		{{/isArray}}
	{{/if_equals}}
</script>
<script id="quickbooks-revoke-access-template" type="text/html">

	<div>
<p class="title_txt"><a href="https://go.xero.com/Dashboard/" target="_blank" >{{fetchXeroUser prefs}}</a></p>
	</div>
	<div class="m-t-sm m-r-none m-b-xs m-l-none">
			<a class='btn revoke-widget ml_5 btn-sm btn-danger' widget-name="Xero">Revoke Access</a>
			<a href="#add-widget" class='btn btn-default btn-sm ml_5' widget-name="Xero">Cancel</a>
		
	</div>

</script>