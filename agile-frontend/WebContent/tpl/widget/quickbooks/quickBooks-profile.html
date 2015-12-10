<script id="quickbooks-login-template" type="text/html">
<div class="widget_content" style="border-bottom:none;line-height: 160%;">
	See the contact's subscriptions history and payments from your quickbooks account.
	<p style="margin: 10px 0px 5px 0px;"></p><a class="btn" href="{{url}}">Link Your Quickbooks</a>
</div>
</script>

<script id="quickbooks-error-template" type="text/html">
{{#check_length message "140"}}
	<div class="ellipsis-multi-line collapse-25" title="{{message}}" style="height:110px;overflow: hidden;line-height:160%;word-wrap: break-word;padding:0px">
		{{{message}}}
	</div>
{{else}}
	<div style="line-height:160%;word-wrap: break-word;padding:0px">
		{{{message}}}
	</div>
{{/check_length}}
</script>

<script id="quickbooks-profile-template" type="text/html"> 
<div class="widget_content">
	<div >
		<div  class="title_txt" >
			<a href="https://sg.qbo.intuit.com/app/customerdetail?nameId={{Customer.Id}}" target="_blank"><h4 style="text-transform: capitalize;font-size:13px;">	
				 {{Customer.DisplayName}}
			</h4></a>
		</div>
	</div>
	<div>
		{{#if Customer.BillAddr}}
			<p style="font-size: 13px;">	
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
	<div>
		{{#if Customer.Mobile}}
		
			{{#if Customer.Mobile.FreeFormNumber}}<i class="icon-phone"></i> {{Customer.Mobile.FreeFormNumber}}<br> {{/if}}
		
		{{/if}}
		{{#if Customer.Fax}}
		
			{{#if Customer.Fax.FreeFormNumber}}<i class="icon-phone"></i> {{Customer.Fax.FreeFormNumber}}<br> {{/if}}
		
		{{/if}}
		{{#if Customer.Mobile}}
		
			{{#if Customer.PrimaryPhone.FreeFormNumber}}<i class="icon-phone"></i> {{Customer.PrimaryPhone.FreeFormNumber}}<br> {{/if}}
		
		{{/if}}
	</div>
	<div>
		<a  id="quickbooks_add_invoice" style="margin-top:7px;cursor:pointer;display:block;" href="https://sg.qbo.intuit.com/app/invoice?nameId={{Customer.Id}}" target="_blank"><i class="icon-plus"></i>Add Invoice</a>
	</div>
</div>
{{#if Invoices}}
	{{#isArray Invoices}}
	<div class="sub_header">
		<a href="https://sg.qbo.intuit.com/app/customerdetail?nameId={{Customer.Id}}" target="_blank"><h4>Invoices</h4></a>
	</div>
	<ul style="margin:0px;">
		{{#each Invoices}}
			<li class="row-fluid sub_header_li">
				
				<a class="pull-left" data-toggle="collapse" href="#collapse-{{Id}}" ><i class="icon-plus"></i></a>&nbsp;<a class="pull-left"  href="https://sg.qbo.intuit.com/app/invoice?txnId={{Id}}"  target="_blank">{{DocNumber}}</a>
				<div class="pull-right">
					{{#if CurrencyRef}}
					{{#if CurrencyRef.value}}
					{{CurrencyRef.value}}
					{{/if}}
					{{/if}}
					{{currencyFormat TotalAmt}}</div><br>
				
						<div id="collapse-{{Id}}" class="collapse" style="color: rgba(0, 0, 0, 0.5);">
						{{#isArray Line}}						
							{{#each Line}}	
								{{#if SalesItemLineDetail.ItemRef.name}}
									<div class="pull-left" style="padding-left: 20px;">{{SalesItemLineDetail.ItemRef.name}}</div>					
									<div class="pull-right">{{currencyFormat Amount}}</div><br>
								{{/if}}	         
							{{/each}}					
						{{/isArray}}
					</div>
				<div class="pull-left"><small><time class="time-ago pull-left" datetime="{{DueDate}}">{{DueDate}}</time></small></div>					
				<div class="pull-right"><span class="badge">{{qbStatus  Balance}}</span></div><br>
					
			</li>
		{{/each}}
	</ul>	
	{{/isArray}}
	{{else}}
		<li class="sub_header_li" style='color: #999;'>
	    	No invoices	found		
		</li>
	{{/if}}
</script>

<script id="quickbooks-profile-addcontact-template" type="text/html">
<div class="widget_content">
		<div>No customer found.</div>
		<a  id="quickbooks_add_contact" style="margin-top:7px;display:block;"><i class="icon-plus"></i>Add Contact</a>
	</div>
</script>
<script id="quickbook-items-template" type="text/html">
	{{#if_equals Line "0"}}
		<li class="sub_header_li" style='color: #999;'>
	    	No Items available. Add an item in your account to generate invoice.
		</li>		
	{{else}}
		<li class="sub_header row-fluid" style="padding-bottom: 0px;">
			<div class="span6">Item name</div>
			<div class="span6" style="text-align: right;">Unit cost</div>
		</li>
		{{#isArray Line}}
			{{#each Line}}
				<li class="row-fluid">
					<div class="pull-left" rel="tooltip" title="{{DetailType.ItemRef.name}}">{{DetailType.ItemRef.name}}</div>
					<div class="pull-right">{{Amount}}</div><br>
					<ul class="widget_tab_link" style="float:left;margin:0px">
						<li><a href="#add" id="freshbooks_add_invoice" item_name={{name}} rel="tooltip" title="Generate invoice and send an email for this item">Add Invoice</a></li>
						<li><small><time class="time-ago pull-left l_border" datetime="{{updated}}">{{updated}}</time></small></li>
					</ul>
				</li>
			{{/each}}
		{{else}}
			<li class="row-fluid">
				<div class="pull-left" rel="tooltip" title="{{item.description}}">{{item.name}}</div>
				<div class="pull-right">{{item.unit_cost}}</div><br>
				<small><time class="time-ago pull-left" datetime="{{item.updated}}">{{item.updated}}</time></small>
				<ul class="widget_tab_link" style="float:left;margin:0px">
					<li><a href="#add" id="freshbooks_add_invoice" item_name={{item.name}} rel="tooltip" title="Generate invoice and send an email for this item">Add Invoice</a></li>
					<li><small><time class="time-ago pull-left l_border" datetime="{{item.updated}}">{{item.updated}}</time></small></li>
				</ul>
			</li>
		{{/isArray}}
	{{/if_equals}}
</script>
<script id="quickbooks-revoke-access-template" type="text/html">
<div class='widget_content' style='border-bottom:none;line-height: 160%;' >
	<div class="row-fluid">
		<div class="span4">
			<br><p class="title_txt"><a href="https://go.xero.com/Dashboard/" target="_blank" >{{fetchXeroUser prefs}}</a></p>
		</div>
	</div>
	<div>
		<p style='margin: 10px 0px 5px 0px;' >
			<a class='btn revoke-widget ml_5' style='text-decoration: none;' widget-name="Xero">Revoke Access</a>
			<a href="#add-widget" class='btn ml_5' style='text-decoration: none;' widget-name="Xero">Cancel</a>
		</p>
	</div>
</div>
</script>