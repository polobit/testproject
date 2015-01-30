<script id="twilio-profile-template" type="text/html">
{{#if_equals to.length "1"}}<div></div>
{{else}}
	<div class="widget_content">
		<div class="row-fluid">
			{{#if_equals to.length "1"}}<div><!-- <input type="hidden" id="contact_number" value="{{to.0.value}}"/>Call {{getCurrentContactProperty "first_name"}} {{getCurrentContactProperty "last_name"}} on {{to.0.value}} --></div>
			{{else}}
			<div class="span2" valign="middle" style="padding:4px"><h4>To&nbsp;:</h4></div>
			<div class="span10">
				<select name="number" id="contact_number" class="required span10" style="width:100%" >
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
			<a href="#call" class="btn pull-right" id="twilio_call" style="display:none;"><i class="icon-phone"></i>Call</a>
			<a href="#hangup" class="btn btn-danger pull-right" id="twilio_hangup" style="display:none;">Hang up</a>
            <a href="#dialpad" class="btn pull-right" id="twilio_dialpad" style="margin-right:5px;display:none;">Dialpad</a>
			<a href="#note" class="right contact-add-note" id="twilio_note" style="margin: 5px;display:none;">Add Note</a>
		</div>


 	</div>
	<!-- <div class="sub_header">
		<h4>Call History</h4>
	</div> -->
{{/if_equals}}
	<ul id="twilio-logs-panel" class="sub_header_ul">
		<li>
			<center><img id="logs_load" src="img/ajax-loader-cursor.gif" style="margin-top: 14px;"></img></center>
		</li>
	</ul>
</script>

<script id="twilio-logs-template" type="text/html">
	{{#if this.length}}
		{{#each this}}          
			<li class="row-fluid sub_header_li">
				<div class="span2 mr_5">
					{{#if_equals recording.total "0"}}
						<i class="icon-phone" style="color: white;background: rgba(130, 130, 130, 1);padding:1px;border-radius: 2px;"></i>
					{{else}}
						<i class="icon-play" id="record_sound_play" sound_url="{{recording.Recording.Uri}}" style="color: white;background: rgba(130, 130, 130, 1);padding:1px;border-radius: 2px;cursor:pointer;"></i>
					{{/if_equals}}						
				</div>
				<div class="span9">
					<div class="pull-left">{{#if_equals call.Status "no-answer"}}Call unaswered{{else}}Call connected{{/if_equals}}</div>
					<div class="pull-right">{{#is_string call.Duration}}{{toProperFormat call.Duration}}{{else}}0 s{{/is_string}}</div><br>
					<small><time class="time-ago pull-left" datetime="{{call.StartTime}}">{{toLocalTimezone call.StartTime}}</time></small>
				</div>               
			</li>
		{{/each}}
	{{else}}
		<li class="sub_header_li" style='color: #999;'>
	    	No Calls
		</li>
	{{/if}}
</script>

 

<script id="twilio-initial-template" type="text/html" >
	<div class="widget_content" style='border-bottom:none;line-height: 160%;' >
		<form style="border-bottom:none;" id="twilio_call_form" name="twilio_call_form" method="post">
	    	<fieldset>
				
				<div class="control-group" ><div class="controls"><input type="text" placeholder="Enter number" name="twilio_from" id="twilio_from" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }" class="required" style="width:90%" maxlength="15"/></div</div>	
				<p>You will receive a verification call asking for a code. Enter the code you see after clicking verify.</p>
				<a href="#verify" id="twilio_verify" class="btn"  style="text-decoration:none;" >Verify</a>	
			</fieldset>
	    </form>				
	</div>
</script>

<script id="twilio-verify-template" type="text/html" >
	<div class="widget_content" style='border-bottom:none;line-height: 160%;' >
		
		<p>Please enter this code <b>{{ValidationRequest.ValidationCode}}</b> to verify your number after you receive a call from Twilio.</p>
		{{#if settings}}
			<a href="#Twilio/twilio{{id}}" class="btn" id="twilio_proceed_settings" style="font-size:13px;">Proceed</a>			
		{{else}}
			<a href="#proceed" class="btn" id="twilio_proceed" style="font-size:13px;">Proceed</a>	
		{{/if}}	
	</div>
</script>

<script id="twilio-record-template" type="text/html">
<div id="twilio-record-modal" class="modal fade in" >
	<div class="modal-header" >
    	<a href="#" data-dismiss="modal" class="close">&times;</a>
		<h3>Call {{name}}?</h3></div>
        <div class="modal-body" >
		<p>Make a call to {{to}}?</p>
        <p>
			<input type="checkbox" name="add-image" id="enable-record" checked="checked"/>
			Record the call
		</p>
	</div>
	<div class="modal-footer" >
		<a href="#" class="btn btn-primary enable-call" make_call="yes">Yes</a>
		<a href="#" class="btn close enable-call" make_call="no">No</a>
	</div>
</div>
</script>


<script id="twilio-error-template" type="text/html">
{{#check_length message "140"}}
	<div style="padding:10px;">
		<div class="ellipsis-multiline" title="{{message}}" style="height: 100px !important;-webkit-line-clamp: 5;line-height:160%;word-wrap: break-word;word-break: normal;">
			{{message}}
		</div>
	</div>
{{else}}
	<div style="line-height:160%;word-wrap: break-word;padding:0px">
		{{{message}}}
	</div>
{{/check_length}}
</script>


<script id="twilio-login-template" type="text/html">
<div class='widget_content' style='border-bottom:none;line-height: 160%;' >
	<p style="border-bottom:none">Call your contacts directly using your Twilio account.</p>
	<a id="twilio-connect-button" class="btn" href="https://www.twilio.com/authorize/CNf63bca035414be121d517a116066a5f8?state={{url}}" style="margin-bottom: 10px;">Link Your Twilio</a>
</div>
</script>




<script id="twilio-revoke-access-template" type="text/html">

<div class='widget_content' style='border-bottom:none;line-height: 160%;' >
	{{#if_equals outgoing_numbers.length "0"}}
				<p>To start making calls, you need to verify your number.</p>
				<p style='margin: 10px 0px 5px 0px;' >
					<a href="#" id="twilio_verify_settings" class=""  style="">Verify an outgoing number</a>
				</p>
	{{else}}
				{{#stringToJSON this "prefs"}}{{/stringToJSON}}
<form id="reportsForm">
<fieldset style="margin-left: 20px">
		<div class="control-group" style="margin-left: -20px">
				<label class="control-label">Current outgoing Number</label>
				<div class="controls" id="contactTypeAhead">
			<select name="verified_number" id="twilio_from_number" class="required span10" style="width:100%" >
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
				<p style='margin: 10px 0px 5px 0px;' >
					<a href="#" id="twilio_verify_settings" class=""  style="">Verify a new outgoing number</a>
				</p>
	{{/if_equals}}
				<p style='margin: 10px 0px 5px 0px;' >
					<a class='btn btn-primary' style='text-decoration: none;padding: 4px 5px;' widget-name="Twilio" id="widget-prefs-save">Save</a>
					<a class='btn revoke-widget ml_5' style='text-decoration: none;' widget-name="Twilio">Revoke Access</a>
					<a href="#add-widget" class='btn ml_5' style='text-decoration: none;' widget-name="Twilio">Cancel</a>
				</p> 
	</div>
</form>
</div>

</script>


