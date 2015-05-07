
<script id="xero-profile-template" type="text/html"> 
<div class="wrapper-sm">
	<div style="display:inline-block;">
		<div  class="title_txt" style="display:inline-block;">
			<a href="https://go.xero.com{{#unless xeroOrganisationShortCode}}/organisationlogin/default.aspx?shortcode={{xeroOrganisationShortCode}}&redirecturl={{/unless}}/Contacts/View.aspx?contactID={{Contact.ContactID}}" target="_blank"><h4 class="h4 m-t-none text-cap text-base">
			{{Contact.Name}}	
			</h4></a>
		</div>
	</div>
	<div>
		{{#if Contact.Addresses}}
		<p class="m-b-none text-muted text-sm">	
				{{#if Contact.Addresses.Address.1.AddressLine1}}
					{{Contact.Addresses.Address.1.AddressLine1}}
				{{/if}}	
				{{#if Contact.Addresses.Address.1.AddressLine2}}
					{{Contact.Addresses.Address.1.AddressLine2}}
				{{/if}}
				{{#if Contact.Addresses.Address.1.AddressLine3}}
					{{Contact.Addresses.Address.1.AddressLine3}}
				{{/if}}
				{{#if Contact.Addresses.Address.1.AddressLine4}}
					{{Contact.Addresses.Address.1.AddressLine4}}
				{{/if}}	
				{{#if Contact.Addresses.Address.1.City}}
					{{Contact.Addresses.Address.1.City}}
				{{/if}}
				{{#if Contact.Addresses.Address.1.Region}}
					{{Contact.Addresses.Address.1.Region}}
				{{/if}}
				{{#if Contact.Addresses.Address.1.Country}}
					{{Contact.Addresses.Address.1.Country}}
				{{/if}}
				
		</p>				
		{{/if}}
	</div>
	<div class="text-muted text-muted text-sm">
		{{#if Contact.Phones}}
		{{#each Contact.Phones.Phone}}
			{{#if PhoneNumber}}<i class="icon icon-phone text-md m-r-xs v-middle"></i> {{#if PhoneCountryCode}}{{PhoneCountryCode}}-{{/if}}{{#if PhoneAreaCode}}{{PhoneAreaCode}}-{{/if}}{{PhoneNumber}}    {{capFirstLetter PhoneType}}<br> {{/if}}
		{{/each}}
		{{/if}}
	</div>
	<div>
		<a id="xero_add_invoice" class="btn btn-default btn-xs" href="https://go.xero.com{{#unless xeroOrganisationShortCode}}/organisationlogin/default.aspx?shortcode={{xeroOrganisationShortCode}}&redirecturl={{/unless}}/AccountsReceivable/Edit.aspx?fromContactID={{Contact.ContactID}}" target="_blank">Add Invoice</a>
	</div>
</div>
<div class="wrapper-sm b-t b-light">
	{{#if invoice.Invoice}}	
	<a href="https://go.xero.com{{#unless xeroOrganisationShortCode}}/organisationlogin/default.aspx?shortcode={{xeroOrganisationShortCode}}&redirecturl={{/unless}}/AccountsReceivable/Search.aspx?graphSearch=False" target="_blank"><h4 class="h4 text-md text-sm">Invoices</h4></a>
</div>	
	{{#isArray invoice.Invoice}}
	
	<ul class="list-group m-b-none text-base">
		{{#each invoice.Invoice}}
			<li class="list-group-item r-none b-l-none b-r-none">
				<div class="pull-left">
				<a class="invoices c-p" data-toggle="collapse"  id="getInvoice-lineitems-{{InvoiceID}}"  value="{{InvoiceID}}"><i class="icon icon-plus text-muted text-sm"></i></a>
				<a data-toggle="tooltip" data-placement="top" title= "{{xeroTypeToolTip Type}}" class="c-p" href="https://go.xero.com{{#unless xeroOrganisationShortCode}}/organisationlogin/default.aspx?shortcode={{xeroOrganisationShortCode}}&redirecturl={{/unless}}/AccountsReceivable/View.aspx?InvoiceID={{InvoiceID}}" target="_blank">{{InvoiceNumber}} {{xeroType Type}}</a>
				</div>				
				<div class="pull-right">{{CurrencyCode}} {{Total}}</div><br>
				<div id="collapse-{{InvoiceID}}" class="collapse text-sm" style="color: rgba(0, 0, 0, 0.5);">
				</div>		
				<div>
					<div class="pull-left"><small><i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago text-muted" datetime="{{DueDate}}">{{DueDate}}</time></small></div>					
					<div class="pull-right"><span class="label bg-light dk text-tiny">{{capFirstLetter Status}}</span></div>
					<div class="clearfix"></div>
				</div>			
			</li>
		{{/each}}
	</ul>
{{else}}
		<ul class="list-group m-b-none text-base">
			<li class="list-group-item r-none b-l-none b-r-none">
				<div class="pull-left">
					<a class="invoices c-p" data-toggle="collapse"  id="getInvoice-lineitems-{{invoice.Invoice.InvoiceID}}"  value="{{invoice.Invoice.InvoiceID}}"  ><i class="icon-plus"></i></a>
					<a class="c-p" id="xeroinvoicelink" data-toggle="tooltip" data-placement="top" title= "{{xeroTypeToolTip invoice.Invoice.Type}}" href="https://go.xero.com{{#unless xeroOrganisationShortCode}}/organisationlogin/default.aspx?shortcode={{xeroOrganisationShortCode}}&redirecturl={{/unless}}/AccountsReceivable/View.aspx?InvoiceID={{invoice.Invoice.InvoiceID}}" target="_blank">{{invoice.Invoice.InvoiceNumber}} {{xeroType invoice.Invoice.Type}}</a>
				</div>
				<div class="pull-right">{{invoice.Invoice.CurrencyCode}} {{invoice.Invoice.Total}}</div><br>
				
				<div id="collapse-{{invoice.Invoice.InvoiceID}}" class="collapse text-sm" style="color: rgba(0, 0, 0, 0.5);">
				</div>		
				<div>
					<div class="pull-left"><small>Due <i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago text-muted" datetime="{{invoice.Invoice.DueDate}}">{{invoice.Invoice.DueDate}}</time></small></div>					
					<div class="pull-right"><span class="label bg-light dk text-tiny">{{capFirstLetter invoice.Invoice.Status}}</span></div><br>
					<div class="clearfix"></div>
				</div>			
			</li>
		</ul>	
	{{/isArray}}
	{{else}}
		<li class="list-group-item r-none b-l-none b-r-none">
	    	No invoices	found		
		</li>
	{{/if}}
</script>


<script id="xero-error-template" type="text/html">
<div class="wrapper-sm">
{{#check_length message "140"}}
		<div class="ellipsis-multi-line collapse-25 word-break p-n overflow-hidden text-base" title="{{message}} " style="height:110px;line-height:160%;">
			{{{message}}}
		</div>
{{else}}	
		<div class="word-break p-n text-base" style="line-height:160%;">
			{{{message}}}
		</div>	
{{/check_length}}
</div>
</script>

<script id="xero-login-template" type="text/html">
<div class="m-t">
	Xero is an online accounting software for small business - Explore invoicing, reconciliation anytime, anywhere.
<div class="m-t">	
<a class="btn btn-sm btn-primary m-t-sm" href="{{url}}">Link Your Xero</a>
</div>
</div>
</script>


<script id="xero-profile-addcontact-template" type="text/html">
<div class="wrapper-sm">
		<div>{{{message}}}</div>
		<a  id="xero_add_contact" class="block m-t-sm btn btn-sm btn-default">Add Contact</a>
	</div>
</script>

<script id="xero-profile-addinvoice-template" type="text/html">
<div class="wrapper-sm">
		<div>No invoices exist for this contact </div>
		<a class="btn btn-sm btn-default m-t-sm c-p" id="xero_add_invoice" href="https://go.xero.com{{#unless xeroOrganisationShortCode}}/organisationlogin/default.aspx?shortcode={{xeroOrganisationShortCode}}&redirecturl={{/unless}}/AccountsReceivable/Edit.aspx?fromContactID={{ContactID}}" target="_blank">Add Invoice</a>
	</div>
</script>
<script id="xero-revoke-access-template" type="text/html">

	<div>
	
{{#if custom_data.prefsObj.xero_company_name}}
			<p class="title_txt p-l-sm"><a href="https://go.xero.com/organisationlogin/default.aspx?shortcode={{custom_data.prefsObj.xero_org_shortcode}}&redirecturl=/Dashboard/" target="_blank" >{{custom_data.prefsObj.xero_company_name}}</a></p>
{{/if}}
		
	</div>
	
		<div class="m-t-md  m-b-xs">
			<a class='btn btn-sm btn-danger revoke-widget ml_5' widget-name="Xero">Revoke Access</a>
			<a href="#add-widget" class='btn btn-default btn-sm ml_5' widget-name="Xero">Cancel</a>
		</div>
	

</script>

<script id="xero-invoice-lineitems-template" type="text/html">	
{{#isArray LineItems.LineItem}}						
		{{#each LineItems.LineItem}}	
			<div class="pull-left p-l-md">{{Description}}</div>					
			<div class="pull-right">{{currencyFormat LineAmount}}</div><br>
		{{/each}}
{{else}}
		<div class="pull-left p-l-md">{{LineItems.LineItem.Description}}</div>					
		<div class="pull-right">{{currencyFormat LineItems.LineItem.LineAmount}}</div><br>					
	{{/isArray}}

</script>