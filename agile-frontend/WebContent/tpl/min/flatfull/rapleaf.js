<script id="rapleaf-profile-template" type="text/html">
<ul class="list-group m-none text-base">
	{{#if_equals this.result "success"}}
	{{#if gender}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">	
		<div class="row">
			<div class="col-md-5">
				<div class="pull-right">:</div> Gender
			</div>
			<div class="col-md-6">
				{{gender}}
			</div>
		</div>
		</li>
	{{/if}}
	{{#if age}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">	
		<div class="row">
			<div class="col-md-5">
				<div class="pull-right">:</div> Age
			</div>
			<div class="col-md-6">
				{{age}}
			</div>
		</div>
		</li>
	{{/if}}
	{{#if occupation}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">
		<div class="row">	
			<div class="col-md-5">
				<div class="pull-right">:</div> Occupation
			</div>
							
			<div class="col-md-6">
				{{occupation}}
			</div>
		</div>
		</li>
	{{/if}}
	{{#if education}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">	
		<div class="row">
			<div class="col-md-5">
				<div class="pull-right">:</div> Education
			</div>
			<div class="col-md-6">
				{{education}}
			</div>
		</div>
		</li>
	{{/if}}
	{{#if marital_status}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">		
		<div class="row">
			<div class="col-md-5">
				<div class="pull-right">:</div> Marital status
			</div>
			<div class="col-md-6">
				{{marital_status}}
			</div>
		</div>
		</li>
	{{/if}}
	{{#if household_income}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">		
		<div class="row">
			<div class="col-md-5">
				<div class="pull-right">:</div> Household Income
			</div>
			<div class="col-md-6">
				{{household_income}}
			</div>
		</div>
		</li>
	{{/if}}	
	{{#if home_owner_status}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">		
		<div class="row">
			<div class="col-md-5">
				<div class="pull-right">:</div> Home Owner Status
			</div>
			<div class="col-md-6" style="text-align:bottom;">
				{{home_owner_status}}
			</div>
		</div>
		</li>
	{{/if}}	
	{{#if this.interests}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">		
		<div class="row">
			<div class="col-md-5">
				<div class="pull-right">:</div> Interests
			</div>
			<div class="col-md-6">
				{{#iterate_json this.interests}}
						{{#if value}}{{property}}{{#unless last}}, {{/unless}}{{/if}}
				{{/iterate_json}}
			</div>
		</div>
		</li>
	{{/if}}
	{{else}}
		<li class="list-group-item r-none b-l-none b-r-none text-base">
	    	No Details available
		</li>
	{{/if_equals}}
</ul>
</script>

<script id="rapleaf-login-template" type="text/html">
	<div>
		<form  id="rapleaf_login_form" name="rapleaf_login_form">
	    	<fieldset>
				<p >Rapleaf helps you learn more about your customers, provides data (age, gender, marital status, income, etc.,) on US consumer email addresses.To access, </p>
				
				<label>Enter your API key</label>
				<div class="control-group form-group" ><div class="controls"><input type="text" id="rapleaf_api_key" class="input-medium required form-control" placeholder="API Key" value="" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }"></input></div></div>
				<a href="#add-widget" class="btn btn-default btn-sm">Cancel</a>
				<a href="#" id="save_api_key" class="btn btn-sm btn-primary ml_5">Save</a>
				<p class="m-t-md">Don't have an API key? <a href="https://www.rapleaf.com" class="text-info" target="_blank"> SignUp </a></p></div>
			</fieldset>
	    </form>
	</div>
</script>

<script id="rapleaf-error-template" type="text/html">
<div class="wrapper-sm">
{{#check_length message "140"}}
	<div class="ellipsis-multi-line collapse-25 word-break text-base overflow-hidden" title="{{message}}" style="height:110px;line-height:160%;">
		{{message}}
	</div>
{{else}}
	<div class="word-break text-base" style="line-height:160%;">
		{{message}}
	</div>
{{/check_length}}
</div>
</script>

