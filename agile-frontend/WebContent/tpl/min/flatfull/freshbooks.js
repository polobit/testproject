<script id="freshbooks-login-template" type="text/html">
	<div>
		<form id="freshbooks_login_form" name="freshbooks_login_form" method="post">
	    	<fieldset>
				<p>Create and manage customer invoices and track payments with Freshbooks. </p>
				
				<label>Enter your Freshbooks details: </label>
				<div class="control-group form-group"><div class="controls"><input type="url" id="freshbooks_url" class="input-medium required form-control"  placeholder="https://company.freshbooks.com" value="" name="freshbooks_url"></input></div></div>
				<div class="control-group form-group"><div class="controls"><input type="text" id="freshbooks_apiKey" class="input-medium required form-control"  placeholder="API Token" value="" name="freshbooks_apiKey"></input></div></div>
				<a href="#add-widget" class="btn btn-default btn-sm">Cancel</a>
				<a href="#" id="freshbooks_save_token" class="btn btn-sm btn-primary ml_5">Save</a>
			 </fieldset>
	    </form>
	</div>
</script>
<script id="freshbooks-profile-template" type="text/html">
{{#if_equals total "0"}}
	<div class="wrapper-sm">
		<div>No clients matching this contact.</div>
		<a class="btn btn-xs btn-default m-t-sm c-p" id="freshbooks_add_client">Add client</a>
	</div>
{{else}}
	<div class="wrapper-sm">
		{{#isArray client}}
			{{#if client.0.username}}
				<div class="inline-block text-sm">
					<div class="title_txt inline-block">
						<a href="{{client.0.links.statement}}" target="_blank"><h4 class="text-u-c m-t-none text-sm text-info">
							{{#if_equals client.0.first_name ""}}{{#if_equals client.0.last_name ""}}
								{{getCurrentContactProperty "first_name"}} {{getCurrentContactProperty "last_name"}}{{/if_equals}}
							{{else}}
								{{client.0.first_name}} {{client.0.last_name}}
							{{/if_equals}}
						</h4></a>
					</div>
					{{#if_equals client.0.organization ""}}<div></div>{{else}}, <div class="inline-block"><a href="{{client.0.links.view}}" target="_blank"><h4 class="text-u-c m-t-none text-sm text-info">{{client.0.organization}}</h4></a></div>{{/if_equals}}
				</div>
			{{/if}}
			<p class="m-b-none text-sm">
				{{#if client.0.p_street1}}
					{{client.0.p_street1}}
				{{/if}}
				{{#if client.0.p_street2}}
					{{client.0.p_street2}}
				{{/if}}
				{{#if client.0.p_state}}			
					{{client.0.p_state}}, 
				{{/if}}
				{{#if client.0.p_country}}
					{{client.0.p_country}}
				{{/if}}
			</p>
			{{#if client.0.home_phone}}<i class="icon-phone text-muted text-sm"></i><a href="tel:{{client.0.home_phone}}" > {{client.0.home_phone}} (home)<br> </a>{{/if}}
			{{#if client.0.work_phone}}<i class="icon-phone text-muted text-sm"></i><a href="tel:{{client.0.work_phone}}" > {{client.0.work_phone}} (work)<br> </a>{{/if}}
			{{#if client.0.mobile}}<i class="icon-mobile-phone text-muted text-sm"></i><a href="tel:{{client.0.mobile}}"> {{client.0.mobile}} (mobile)</a>{{/if}}
		{{else}}
			{{#if client.username}}
				<div class="inline-block">
					<div class="title_txt inline-block">
						<a href="{{client.links.statement}}" target="_blank"><span class="m-n text-cap text-base">
							{{#if_equals client.first_name ""}}{{#if_equals client.last_name ""}}
								{{getCurrentContactProperty "first_name"}} {{getCurrentContactProperty "last_name"}}{{/if_equals}}
							{{else}}
								{{client.first_name}} {{client.last_name}}
							{{/if_equals}}
						</span></a>
					</div>
					{{#if_equals client.organization ""}}<div></div>{{else}}, <div class="inline-block text-base"><a href="{{client.links.view}}" target="_blank"><span class="text-u-c m-t-none">{{client.organization}}</span></a></div>{{/if_equals}}
				</div>
			{{/if}}
			<p class="text-muted m-b-xs text-sm">
				{{#if client.p_street1}}
					{{client.p_street1}},
				{{/if}}
				{{#if client.p_street2}}
					{{client.p_street2}},
				{{/if}}
				{{#if client.p_state}}			
					{{client.p_state}}, 
				{{/if}}
				{{#if client.p_country}}
					{{client.p_country}}
				{{/if}}
			</p>	
			{{#if client.home_phone}}<i class="icon icon-phone text-muted text-sm"></i><a class="text-muted" href="tel:{{client.home_phone}}" > {{client.home_phone}} (home)<br> </a>{{/if}}
			{{#if client.work_phone}}<i class="icon icon-phone text-muted text-sm"></i><a class="text-muted" href="tel:{{client.work_phone}}" > {{client.work_phone}} (work)<br> </a>{{/if}}
			{{#if client.mobile}}<i class="icon icon-phone text-muted"></i><a class="text-muted" href="tel:{{client.mobile}}"> {{client.mobile}} (mobile)</a>{{/if}}
		{{/isArray}}
	</div>
	<div class="wrapper-sm b-t b-light">
		{{#isArray client}}
			<a href="{{client.0.links.statement}}" target="_blank"><h4 class="h4 m-t-none m-b-none text-sm">Invoices</h4></a>
		{{else}}
			<a href="{{client.links.statement}}" target="_blank"><h4 class="h4 m-t-none m-b-none text-sm">Invoices</h4></a>
		{{/isArray}}
	</div>
	<ul class="list-group m-b-none text-base" id="freshbooks_invoice_panel">
		<li class="list-group-item r-none b-l-none b-r-none">
			<center><img id="freshbooks_invoice_load" src="img/ajax-loader-cursor.gif" class="m-t m-b-sm"></img></center>
		</li>
	</ul>
{{/if_equals}}
</script>

<script id="freshbooks-invoice-template" type="text/html">
	{{#if_equals total "0"}}
		<li class="list-group-item r-none b-l-none b-r-none text-light">
	    	No invoices			
		</li>		
	{{else}}
		<li class="list-group-item r-none b-l-none b-r-none">
			<div class="pull-left text-base">Status</div>
			<div class="pull-right text-base text-right">Amount</div>
			<div class="clearfix"></div>
		</li>
		{{#isArray invoice}}
			{{#each invoice}}
				<li class="row-fluid list-group-item r-none b-l-none b-r-none text-base">
					<a class="pull-left" data-toggle="collapse" href="#collapse-{{invoice_id}}" ><i class="icon icon-plus text-muted text-sm"></i> {{ucfirst status}}</a>
					<div class="pull-right">$ {{amount}}</div><br>
					<div id="collapse-{{invoice_id}}" class="collapse text-sm" style="color: rgba(0, 0, 0, 0.5);">
						{{#isArray lines.line}}						
							{{#each lines.line}}	
								{{#if name}}
									<div class="pull-left">{{name}}</div>					
									<div class="pull-right">$ {{amount}}</div><br>
									{{#if tax1_name}}				
										<div class="pull-left">{{tax1_name}}</div>
										<div class="pull-right">{{tax1_percent}}%</div><br>
									{{/if}}
									{{#if tax2_name}}				
										<div class="pull-left">{{tax2_name}}</div>
										<div class="pull-right">{{tax2_percent}}%</div><br>
									{{/if}}
								{{/if}}	         
							{{/each}}					
						{{else}}
							{{#if lines.line.name}}
								<div class="pull-left">{{lines.line.name}}</div>
								<div class="pull-right">$ {{lines.line.amount}}</div><br>
								{{#if lines.line.tax1_name}}				
									<div class="pull-left">{{lines.line.tax1_name}}</div>
									<div class="pull-right">{{lines.line.tax1_percent}}%</div><br>
								{{/if}}
								{{#if lines.line.tax2_name}}				
									<div class="pull-left">{{lines.line.tax2_name}}</div>
									<div class="pull-right">{{lines.line.tax2_percent}}%</div><br>
								{{/if}}
							{{/if}}
						{{/isArray}}
						{{#if discount}}
							<div class="pull-left">Discount</div>
							<div class="pull-right">{{discount}}%</div><br>
						{{/if}}
					</div>
					<small class="text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago pull-left" datetime="{{updated}}">{{updated}}</time></small>
				</li>
			{{/each}}
		{{else}}
			<li class="row-fluid list-group-item r-none b-l-none b-r-none text-base">
					<a class="pull-left" data-toggle="collapse" href="#collapse-{{invoice.invoice_id}}" ><i class="icon icon-plus text-muted text-sm"></i> {{ucfirst invoice.status}}</a>
					<div class="pull-right">{{invoice.amount}}</div><br>
					<div id="collapse-{{invoice.invoice_id}}" class="collapse" style="color: rgba(0, 0, 0, 0.5);">
						{{#isArray invoice.lines.line}}      
							{{#each invoice.lines.line}}	
								{{#if name}}
									<div class="pull-left">{{name}}</div>					
									<div class="pull-right">$ {{amount}}</div><br>
									{{#if tax1_name}}
										<div class="pull-left">{{tax1_name}}</div>
										<div class="pull-right">{{tax1_percent}}%</div><br>
									{{/if}}
									{{#if tax2_name}}<br>				
										<div class="pull-left">{{tax2_name}}</div>
										<div class="pull-right">{{tax2_percent}}%</div><br>
									{{/if}}
								{{/if}}
							{{/each}}
						{{else}}
							{{#if invoice.lines.line.name}}
								<div class="pull-left">{{invoice.lines.line.name}}</div>
								<div class="pull-right">$ {{invoice.lines.line.amount}}</div><br>
								{{#if invoice.lines.line.tax1_name}}				
									<div class="pull-left">{{invoice.lines.line.tax1_name}}</div>
									<div class="pull-right">{{invoice.lines.line.tax1_percent}}%</div><br>
								{{/if}}
								{{#if invoice.lines.line.tax2_name}}
									<div class="pull-left">{{invoice.lines.line.tax2_name}}</div>
									<div class="pull-right">{{invoice.lines.line.tax2_percent}}%</div><br>
								{{/if}}
							{{/if}}
						{{/isArray}}
						{{#if invoice.discount}}
							<div class="pull-left">Discount</div>
							<div class="pull-right">{{invoice.discount}}%</div><br>
						{{/if}}
					</div>
					<small class="text-muted"><i class="fa fa-clock-o m-r-xs pull-left m-t-xs"></i><time class="time-ago pull-left" datetime="{{invoice.updated}}">{{invoice.updated}}</time><div class="clearfix"></div></small>
			</li>
		{{/isArray}}
	{{/if_equals}}
</script>

<script id="freshbooks-items-template" type="text/html">
	{{#if_equals total "0"}}
		<li class="list-group-item r-none b-l-none b-r-none text-light">
	    	No Items available. Add an item in your account to generate invoice.
		</li>		
	{{else}}
		<li class="list-group-item r-none b-l-none b-r-none">
			<div class="pull-left">Item name</div>
			<div class="pull-right text-right">Unit cost</div>
			<div class="clearfix"></div>
		</li>
		{{#isArray item}}
			{{#each item}}
				<li class="list-group-item r-none b-l-none b-r-none">
					<div class="pull-left" rel="tooltip" title="{{description}}">{{name}}</div>
					<div class="pull-right">{{unit_cost}}</div><br>
					<ul class="widget_tab_link m-n text-base" style="float:left;">
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
					<li><small class="text-muted"><i class="fa fa-clock-o m-r-xs pull-left m-t-xs"></i><time class="time-ago pull-left l_border" datetime="{{item.updated}}">{{item.updated}}</time></small></li>
				</ul>
			</li>
		{{/isArray}}
	{{/if_equals}}
</script>

<script id="freshbooks-modal-template" type="text/html">
<div class="modal fade message-modal" id="freshbooks_addModal" aria-hidden="false" style="display: block; padding-left: 17px;">
<div class="modal-backdrop fade" style="height: auto;"></div> 
 <div class="modal-dialog"> 
  <div class="modal-content">
	    <div class="modal-header">
	        <button class="close" data-dismiss="modal">x</button>
			<h3><i class="icon-plus-sign"></i> {{headline}}</h3>
	    </div>
	    <div class="modal-body agile-modal-body">
	        <form id="freshbooks_addForm" name="freshbooks_addForm" method="post">
	            <fieldset>
					<div class="m-b-sm">{{info}}</div>
	                <input name="freshbooks_id" type="hidden" value="" />
	                <div class="control-group">	                    
	                    <div class="controls">
							<table id="invoice-table" class="table table-bordered w-auto" style="table-layout:fixed;">
								<thead style="background: rgba(240, 240, 240, .2);">
									<tr>
									<th >Item</th>
									<th >Description</th>
									<th >Unit Cost</th>
									<th >Quantity</th>
									<th >Tax1</th>
									<th >Tax2</th>
									<th >Line Total</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td id="item_names">
											<select name="items_name" id="item-select" class="w-auto form-control">
												<option value=""></option>
												{{#isArray items.item}}
													{{#each items.item}}
														<option value="{{name}}">{{name}}</option>
													{{/each}}
												{{else}}
													<option value="{{items.item.name}}">{{items.item.name}}</option>
												{{/isArray}}
											</select>
										</td>
										<td id="item_description" >
												<input  name="description" class="w-auto form-control"/>
												{{#isArray items.item}}
													{{#each items.item}}
														<input type="text" name="description" id="item_desc" class="w-auto {{name}} form-control" value="{{description}}"/>
													{{/each}}
												{{else}}
													<input type="text" name="description" id="item_desc" class="w-auto {{items.item.name}} form-control" value="{{items.item.description}}"/>
												{{/isArray}}
										</td>
										<td id="item_cost" >
												<input type="text" class="w-auto form-control"/>
												{{#isArray items.item}}
													{{#each items.item}}
														<input type="text" value="{{unit_cost}}" name="unit_cost" id="unit-cost" max="100" min="1" class="w-auto {{name}} number form-control"/>
													{{/each}}
												{{else}}
													<input type="text" value="{{items.item.unit_cost}}" name="unit_cost" max="100" min="1" id="unit-cost" class="w-auto{{items.item.name}} number form-control"/>
												{{/isArray}}
										</td>
										<td id="item_quantity" >
											<input type="text" class="w-auto form-control"/>
												{{#isArray items.item}}
													{{#each items.item}}
														<input type="number" value="1" name="quantity" id="quantity" max="100" min="1"  class="w-auto {{name}} digits form-control"/>
													{{/each}}
												{{else}}
													<input type="number" value="1" name="quantity" id="quantity" max="30" min="1" class="w-auto {{items.item.name}} digits form-control"/>
												{{/isArray}}
										</td>
										<td id="item_tax1" >
											<select name="tax_name" id="item-tax1" class="w-auto form-control" >
												<option value=""></option>
												{{#isArray taxes.tax}}
													{{#each taxes.tax}}
														<option value="{{name}}_tax1" rate="{{rate}}">{{name}}</option>
													{{/each}}
												{{else}}
													<option value="{{taxes.tax.name}}_tax1" rate="{{taxes.tax.rate}}">{{taxes.tax.name}}</option>
												{{/isArray}}
											</select>
										</td>
										<td id="item_tax2" >
											<select name="tax_name" id="item-tax2" class="w-auto form-control" >
												<option value=""></option>	
												{{#isArray taxes.tax}}
													{{#each taxes.tax}}
														<option value="{{name}}_tax2" rate="{{rate}}">{{name}}</option>
													{{/each}}
												{{else}}
													<option value="{{taxes.tax.name}}_tax2" rate="{{taxes.tax.rate}}">{{taxes.tax.name}}</option>
												{{/isArray}}
											</select>
										</td>
										<td id="item_total">
											<input type="text" placeholder="total" name="line_total" id="line-total" class="w-auto form-control"/>
										</td>
									</tr>
								</tbody>
							</table>
							<i class="add_lines icon-plus"></i>
						</div>
                	</div>
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer">
       <a href="#" class="btn btn-sm btn-primary" id="send_request">Send</a>
       <span class="save-status"></span>
    </div>
</div>
</div>
</script>

<script id="freshbooks-error-template" type="text/html">
<div class="wrapper-sm">
{{#check_length message "140"}}
	<div class="ellipsis-multi-line collapse-25 p-n word-break overflow-hidden text-base" title="{{message}}" style="height:110px;line-height:160%;">
		{{message}}
	</div>
{{else}}
	<div class="word-break p-n text-base" style="line-height:160%;">
		{{message}}
	</div>
{{/check_length}}
</div>
</script>