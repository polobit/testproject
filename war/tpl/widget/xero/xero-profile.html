
<script id="xero-profile-template" type="text/html"> 
<div class="widget_content">
	<div  style="display:inline-block;">
		<div  class="title_txt" style="display:inline-block;">
			<a href="https://go.xero.com{{#unless xeroOrganisationShortCode}}/organisationlogin/default.aspx?shortcode={{xeroOrganisationShortCode}}&redirecturl={{/unless}}/Contacts/View.aspx?contactID={{Contact.ContactID}}" target="_blank"><h4 style="text-transform: capitalize;">
			{{Contact.Name}}<br>	
			</h4></a>
		</div>
	</div>
	<div>
		{{#if Contact.Addresses}}
		<p style="font-size: 13px;">	
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
	<div>
		{{#if Contact.Phones}}
		{{#each Contact.Phones.Phone}}
			{{#if PhoneNumber}}<i class="icon-phone"></i> {{#if PhoneCountryCode}}{{PhoneCountryCode}}-{{/if}}{{#if PhoneAreaCode}}{{PhoneAreaCode}}-{{/if}}{{PhoneNumber}}    {{capFirstLetter PhoneType}}<br> {{/if}}
		{{/each}}
		{{/if}}
	</div>
	<div>
		<a id="xero_add_invoice"  href="https://go.xero.com{{#unless xeroOrganisationShortCode}}/organisationlogin/default.aspx?shortcode={{xeroOrganisationShortCode}}&redirecturl={{/unless}}/AccountsReceivable/Edit.aspx?fromContactID={{Contact.ContactID}}" target="_blank"><i class="icon-plus"></i>Add Invoice</a>
	</div>
</div>
	{{#if invoice.Invoice}}
	<div class="sub_header">
		<a href="https://go.xero.com{{#unless xeroOrganisationShortCode}}/organisationlogin/default.aspx?shortcode={{xeroOrganisationShortCode}}&redirecturl={{/unless}}/AccountsReceivable/Search.aspx?graphSearch=False" target="_blank"><h4>Invoices</h4></a>
	</div>
	{{#isArray invoice.Invoice}}
	
	<ul style="margin:0px;" class="last-li-nopadding">
		{{#each invoice.Invoice}}
			<li class="row-fluid sub_header_li">
				<div class="pull-left">
				<a class="invoices" data-toggle="collapse"  id="getInvoice-lineitems-{{InvoiceID}}"  value="{{InvoiceID}}"   style="cursor:pointer;"><i class="icon-plus"></i></a>
				<a data-toggle="tooltip" data-placement="top" title= "{{xeroTypeToolTip Type}}" style="cursor:pointer;" href="https://go.xero.com{{#unless xeroOrganisationShortCode}}/organisationlogin/default.aspx?shortcode={{xeroOrganisationShortCode}}&redirecturl={{/unless}}/AccountsReceivable/View.aspx?InvoiceID={{InvoiceID}}" target="_blank">{{InvoiceNumber}} {{xeroType Type}}</a>
				</div>				
				<div class="pull-right">{{CurrencyCode}} {{Total}}</div><br>
				
				<div id="collapse-{{InvoiceID}}" class="collapse" style="color: rgba(0, 0, 0, 0.5);">
				</div>		
				<div class="span12">
				<div class="span8"><small>Due <time class="time-ago" datetime="{{DueDate}}">{{DueDate}}</time></small></div>					
				<div class="span4"><span class="badge">{{capFirstLetter Status}}</span></div><br>
				</div>			
			</li>
		{{/each}}
	</ul>
{{else}}
		<ul style="margin:0px;" class="last-li-nopadding">
			<li class="row-fluid sub_header_li">
				<div class="pull-left">
					<a class="invoices" data-toggle="collapse"  id="getInvoice-lineitems-{{invoice.Invoice.InvoiceID}}"  value="{{invoice.Invoice.InvoiceID}}"   style="cursor:pointer;"><i class="icon-plus"></i></a>
					<a id="xeroinvoicelink" data-toggle="tooltip" data-placement="top" title= "{{xeroTypeToolTip invoice.Invoice.Type}}" style="cursor:pointer;" href="https://go.xero.com{{#unless xeroOrganisationShortCode}}/organisationlogin/default.aspx?shortcode={{xeroOrganisationShortCode}}&redirecturl={{/unless}}/AccountsReceivable/View.aspx?InvoiceID={{invoice.Invoice.InvoiceID}}" target="_blank">{{invoice.Invoice.InvoiceNumber}} {{xeroType invoice.Invoice.Type}}</a>
				</div>
				<div class="pull-right">{{invoice.Invoice.CurrencyCode}} {{invoice.Invoice.Total}}</div><br>
				
				<div id="collapse-{{invoice.Invoice.InvoiceID}}" class="collapse" style="color: rgba(0, 0, 0, 0.5);">
				</div>		
				<div class="span12">
				<div class="span8"><small>Due <time class="time-ago" datetime="{{invoice.Invoice.DueDate}}">{{invoice.Invoice.DueDate}}</time></small></div>					
				<div class="span4"><span class="badge">{{capFirstLetter invoice.Invoice.Status}}</span></div><br>
				</div>			
			</li>
	</ul>
	
	{{/isArray}}
	{{else}}
		<li class="sub_header_li" style='color: #999;'>
	    	No invoices	found		
		</li>
	{{/if}}
</script>


<script id="xero-error-template" type="text/html">
{{#check_length message "140"}}
	<div class="ellipsis-multi-line collapse-25" title="{{message}}" style="height:110px;overflow: hidden;line-height:160%;word-wrap: break-word;padding:0px">
		{{{message}}}
	</div>
{{else}}
	<div style="line-height:160%;word-wrap: break-word;padding:0px;font-size:13px;">
		{{{message}}}
	</div>
{{/check_length}}
</script>

<script id="xero-login-template" type="text/html">
<div class="widget_content" style="border-bottom:none;line-height: 160%;">
	Xero is an online accounting software for small business - Explore invoicing, reconciliation anytime, anywhere.
	<p style="margin: 10px 0px 5px 0px;"></p><a class="btn" href="{{url}}">Link Your Xero</a>
</div>
</script>


<script id="xero-profile-addcontact-template" type="text/html">
<div class="widget_content">
		<div>{{{message}}}</div>
		<a  id="xero_add_contact" style="margin-top:10px;display:block;"><i class="icon-plus"></i>Add Contact</a>
	</div>
</script>

<script id="xero-profile-addinvoice-template" type="text/html">
<div class="widget_content">
		<div>No invoices exist for this contact </div>
		<a class="btn" id="xero_add_invoice" style="margin-top:10px;cursor:pointer;" href="https://go.xero.com{{#unless xeroOrganisationShortCode}}/organisationlogin/default.aspx?shortcode={{xeroOrganisationShortCode}}&redirecturl={{/unless}}/AccountsReceivable/Edit.aspx?fromContactID={{ContactID}}" target="_blank"><i class="icon-plus"></i>Add Invoice</a>
	</div>
</script>
<script id="xero-revoke-access-template" type="text/html">
<div class='widget_content' style='border-bottom:none;line-height: 160%;' >
	<div class="row-fluid">
		<div class="span12">
{{#if custom_data.prefsObj.xero_company_name}}
			<p class="title_txt" style="padding-left:10px;"><a href="https://go.xero.com/organisationlogin/default.aspx?shortcode={{custom_data.prefsObj.xero_org_shortcode}}&redirecturl=/Dashboard/" target="_blank" >{{custom_data.prefsObj.xero_company_name}}</a></p>
{{/if}}
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

<script id="xero-invoice-lineitems-template" type="text/html">	
{{#isArray LineItems.LineItem}}						
		{{#each LineItems.LineItem}}	
			<div class="pull-left" style="padding-left: 20px;">{{Description}}</div>					
			<div class="pull-right">{{currencyFormat LineAmount}}</div><br>
		{{/each}}
{{else}}
		<div class="pull-left" style="padding-left: 20px;">{{LineItems.LineItem.Description}}</div>					
		<div class="pull-right">{{currencyFormat LineItems.LineItem.LineAmount}}</div><br>					
	{{/isArray}}

</script>