<script id="twilio-profile-template" type="text/html">
{{#if_equals to.length "1"}}<div></div>
{{else}}
	<div class="wrapper-sm">
		<div class="row">
			{{#if_equals to.length "1"}}<div><!-- <input type="hidden" id="contact_number" value="{{to.0.value}}"/>Call {{getCurrentContactProperty "first_name"}} {{getCurrentContactProperty "last_name"}} on {{to.0.value}} --></div>
			{{else}}
			<div class="col-md-2 p-xs" valign="middle"><h4 class="h4 m-t-xs">To&nbsp;:</h4></div>
			<div class="col-md-10">
				<select name="number" id="contact_number" class="required form-control col-md-10 w-full">
					{{#each to}}
						<option value="{{value}}">{{value}} 
							{{#if subtype}}({{subtype}}){{/if}}
						</option>
					{{/each}}
				</select>
			</div>
			{{/if_equals}}
		</div>
		<div class="row-fluid">
			<a href="#call" class="btn btn-sm btn-default pull-right" id="twilio_call" style="display:none;"><i class="icon-phone"></i>Call</a>
			<a href="#hangup" class="btn btn-sm btn-danger pull-right" id="twilio_hangup" style="display:none;">Hang up</a>
            <a href="#dialpad" class="btn btn-sm btn-default pull-right m-r-xs" id="twilio_dialpad" style="display:none;">Dialpad</a>
			<a href="#note" class="right contact-add-note m-xs" id="twilio_note" style="display:none;">Add Note</a>
		</div>


 	</div>
	<!-- <div class="sub_header">
		<h4>Call History</h4>
	</div> -->
{{/if_equals}}
	<ul id="twilio-logs-panel" class="sub_header_ul text-base">
		<li>
			<center><img id="logs_load" src="img/ajax-loader-cursor.gif" class="m-t"></img></center>
		</li>
	</ul>
</script>

<script id="twilio-logs-template" type="text/html">
	{{#if this.length}}
		{{#each this}}          
			<li class="list-group-item r-none b-l-none b-r-none">
				{{#if_equals recording.total "0"}}
					<i class="icon pull-left icon-phone text-muted text-md m-r-xs m-t-xxs v-middle"></i>
				{{else}}
					<i class="icon pull-left icon-play m-r-xs m-t-xxs c-p r" id="record_sound_play" sound_url="{{recording.Recording.Uri}}" style="color: white;background: rgba(130, 130, 130, 1);padding:1px;"></i>
				{{/if_equals}}			
				<div class="pull-left">{{#if_equals call.Status "no-answer"}}Call unaswered{{else}}Call connected{{/if_equals}}</div>
				<div class="pull-right">{{#is_string call.Duration}}{{toProperFormat call.Duration}}{{else}}0 s{{/is_string}}</div>
				<div class="clearfix"></div>
				<small class="text-muted"><i class="fa fa-clock-o m-r-xs pull-left m-t-xs"></i><time class="time-ago pull-left" datetime="{{call.StartTime}}">{{toLocalTimezone call.StartTime}}</time></small>
				<div class="clearfix"></div>
			</li>
		{{/each}}
	{{else}}
		<li class="p-sm r-none b-l-none b-r-none">
	    	No Calls
		</li>
	{{/if}}
</script>

 

<script id="twilio-initial-template" type="text/html" >
	<div class="widget_content b-b-none" style='line-height: 160%;' >
		<form class="b-b-none" id="twilio_call_form" name="twilio_call_form" method="post">
	    	<fieldset>
				
				<div class="control-group" ><div class="controls"><input type="text" placeholder="Enter number" name="twilio_from" id="twilio_from" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }" class="required form-control" style="width:90%" maxlength="15"/></div</div>	
				<p>You will receive a verification call asking for a code. Enter the code you see after clicking verify.</p>
				<a href="#verify" id="twilio_verify" class="btn btn-sm btn-default text-l-none">Verify</a>	
			</fieldset>
	    </form>				
	</div>
</script>

<script id="twilio-verify-template" type="text/html" >
	<div class="widget_content b-b-none" style='line-height: 160%;' >
		
		<p>Please enter this code <b>{{ValidationRequest.ValidationCode}}</b> to verify your number after you receive a call from Twilio.</p>
		{{#if settings}}
			<a href="#Twilio/twilio{{id}}" class="btn btn-sm btn-default text-sm" id="twilio_proceed_settings">Proceed</a>			
		{{else}}
			<a href="#proceed" class="btn btn-sm btn-default text-sm" id="twilio_proceed">Proceed</a>	
		{{/if}}	
	</div>
</script>

<script id="twilio-record-template" type="text/html">
<div id="twilio-record-modal" class="modal fade in" aria-hidden="false" style="display: block; padding-left: 17px;">
<div class="modal-backdrop fade" style="height: auto;"></div> 
 <div class="modal-dialog"> 
  <div class="modal-content"> 
	<div class="modal-header" >
    	<a href="#" data-dismiss="modal" class="close">&times;</a>
		<h3>Call {{name}}?</h3></div>
    <div class="modal-body" >
		<p>Make a call to {{to}}?</p>
        <p>
		<label class="i-checks i-checks-sm">
			<input type="checkbox" name="add-image" id="enable-record" checked="checked"/><i></i></label>
			Record the call
		</p>
	</div>
	<div class="modal-footer" >
		<a href="#" class="btn btn-sm btn-default close enable-call" make_call="no">No</a>
		<a href="#" class="btn btn-sm btn-primary enable-call" make_call="yes">Yes</a>
	</div>
</div>
</div>
</div>
</script>


<script id="twilio-error-template" type="text/html">
<div class="wrapper-sm">
{{#check_length message "140"}}
	<div class="p-sm">
		<div class="ellipsis-multiline word-break text-base" title="{{message}}" style="height: 100px !important;-webkit-line-clamp: 5;line-height:160%;word-break: normal;">
			{{message}}
		</div>
	</div>
{{else}}
	<div class="word-break p-n text-base" style="line-height:160%;">
		{{{message}}}
	</div>
{{/check_length}}
</div>
</script>


<script id="twilio-login-template" type="text/html">
<div class="m-t">
	<p>Call your contacts directly using your Twilio account.</p>
	<a id="twilio-connect-button" class="btn btn-sm btn-default m-b-sm m-t-sm" href="https://www.twilio.com/authorize/CNf63bca035414be121d517a116066a5f8?state={{url}}" >Link Your Twilio</a>
</div>
</script>




<script id="twilio-revoke-access-template" type="text/html">

<div class='widget_content b-b-none' style='line-height: 160%;' >
	{{#if_equals outgoing_numbers.length "0"}}
				<p>To start making calls, you need to verify your number.</p>
				<p class="m-t-sm m-r-none m-b-xs m-l-none">
					<a href="#" id="twilio_verify_settings">Verify an outgoing number</a>
				</p>
	{{else}}
				{{#stringToJSON this "prefs"}}{{/stringToJSON}}
<form id="reportsForm">
<fieldset class="m-l-md">
		<div class="control-group m-l-n-md">
				<label class="control-label">Current outgoing Number</label>
				<div class="controls" id="contactTypeAhead">
			<select name="verified_number" id="twilio_from_number" class="required form-control col-md-12 w-full">
				{{#each outgoing_numbers}}
						{{#if_equals ../../prefs.verification_status "success"}}
								{{#if_equals PhoneNumber ../../prefs.verified_number}}
									<option selected="selected" value="{{PhoneNumber}}">{{PhoneNumber}}</option>
								{{else}}
									<option value="{{PhoneNumber}}">{{PhoneNumber}}</option>
								{{/if_equals}}
						{{else}}
							<option value="{{PhoneNumber}}">{{PhoneNumber}}</option>
						{{/if_equals}}
				{{/each}}
			</select>
			</div>
			</div>
<input value="success" name="verification_status" class="hidden"/> 
		</fieldset>
				<p class="m-t-sm m-r-none m-b-sm m-l-none">
					<a href="#" id="twilio_verify_settings">Verify a new outgoing number</a>
				</p>
	{{/if_equals}}
				<p class="m-t-sm m-r-none m-b-xs m-l-none">
					<a class='btn btn-sm btn-primary p-xs' widget-name="Twilio" id="widget-prefs-save">Save</a>
					<a class='btn btn-sm btn-danger revoke-widget ml_5' widget-name="Twilio">Revoke Access</a>
					<a href="#add-widget" class='btn btn-default btn-sm ml_5' widget-name="Twilio">Cancel</a>
				</p> 
	</div>
</form>
</div>

</script>


