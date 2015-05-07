<script id="twilioio-profile-template" type="text/html">
{{#if_equals to.length "1"}}<div></div>
{{else}}
	<div class="wrapper-sm">
			{{#if_equals to.length "1"}}<div><!-- <input type="hidden" id="contact_number" value="{{to.0.value}}"/>Call {{getCurrentContactProperty "first_name"}} {{getCurrentContactProperty "last_name"}} on {{to.0.value}} --></div>
			{{else}}
			<div class="pull-left" valign="middle"><h4 class="h4 m-t-xs">To&nbsp;:</h4></div>
			<div class="pull-right">
				<select name="number" id="contact_number" class="required form-control">
					{{#each to}}
						<option value="{{value}}">{{value}} 
							{{#if subtype}}({{subtype}}){{/if}}
						</option>
					{{/each}}
				</select>
			</div>
			<div class="clearfix"></div>
			{{/if_equals}}
	{{/if_equals}}
	</div>
	<ul id="twilio-logs-panel" class="list-group m-b-none text-base">
		<li class="list-group-item r-none b-l-none b-r-none">
			<center><img id="logs_load" src="img/ajax-loader-cursor.gif" class="m-t"></img></center>
		</li>
	</ul>
</script>

<script id="twilioio-login-template" type="text/html">
<div>
	<form  id="twilioio_login_form" name="twilioio_login_form" method="post">
    	<fieldset>
              <input type="hidden" id="twilio_number_sid" value="" name="twilio_number_sid"></input>
		      <p class="m-t-sm">
                   Make and receive calls from your contacts using your Twilio account.
              </p>
			  
				<label><b>Enter your Twilio details </b>
                       <span>         
       				      <img border="0" src="/img/help.png" class="v-top question-tag" rel="popover" data-trigger="hover" data-placement="right" data-content="Log into your Twilio Account. On the Dashboard, there you will find your Account SID and Auth Token. Copy those values and paste them into the Account SID and Auth Token fields." id="element-title" data-trigger="hover" data-original-title="How to get this?">
        			   </span>
                </label>                
				<div class="control-group form-group">
                     <div class="controls">
                         <input type="text" id="twilio_acc_sid" class="input-medium required widget_input_box form-control"  title="Account SID starts with AC and length should be 34." value="" name="twilio_acc_sid" placeholder="Account SID"  minlength= "34" maxlength= "34" required></input>
                     </div>
                </div>
                <div class="control-group form-group">
                     <div class="controls">
                          <input type="text" id="twilio_auth_token" class="input-medium required widget_input_box form-control"  title="Auth Token length should be 32." value="" name="twilio_auth_token" placeholder="Auth Token"  minlength= "32" maxlength= "32" required></input>
                     </div>
                </div>            

                <div class="control-group form-group" id="twilio_numbers" style="display:none;">
				    <label class="control-label">Twilio Numbers
                          <span class="v-top">         
       				        <img border="0" src="/img/help.png" class="v-top question-tag"  rel="popover" data-trigger="hover" data-placement="right" data-content="To receive incoming calls in Agile, you need to select a Twilio number. A Twilio number is one that you have purchased through Twilio. This number will also be the caller ID for outgoing calls  (unless you select a different caller ID from the option below)." id="element-title" data-trigger="hover" data-original-title="What is this?">
        			      </span>
                    </label>
				    <div class="controls" id="contactTypeAhead">
			          <select name="twilio_number" id="twilio_number" class="form-control">	</select>
  			        </div> 
			    </div>     

                <div class="control-group form-group" id="twilio_from_numbers" style="display:none;">
				    <label class="control-label">Verified Caller IDs
                         <span class="v-top">         
       				        <img border="0" src="/img/help.png" class="v-top question-tag" rel="popover" data-trigger="hover" data-placement="right" data-content="A verified phone number is one that you can use as your Caller ID when making outbound calls with Twilio. Agile will use this number as the Caller ID. Incoming calls on this number will NOT come to Agile." id="element-title" data-trigger="hover" data-original-title="What is this?">
        			     </span>
                    </label>
				    <div class="controls" id="contactTypeAhead">
			          <select name="twilio_from_number" id="twilio_from_number" class="form-control">	</select>
  			        </div> 
			    </div>  
                
                <a href="#" class="twilioio-advance-settings"><i class="icon-minus-sign twilioio-advance-settings-hide" style="display:none;"></i><i class="icon-plus-sign twilioio-advance-settings-show"></i> Advanced Settings</a>

                <div class="control-group form-group m-t-sm" id="twilio_twimlet_url_controls" style="display:none;">
				    <label class="control-label">Redirect Twimlet Url
                        <span class="v-top m-l-n-xs">         
       				        <img border="0" src="/img/help.png" class="v-top" style="height: 8px;margin: 2px;" rel="popover" data-placement="right" data-content="This Twimlet URL will be called when you are not available. Twimlets allow you to setup Forwarding, Voicemail etc." id="element-title" data-trigger="hover" data-original-title="What is this?">
        			      </span>
                    </label>
				    <div class="controls">
                      <input type="text" id="twilio_twimlet_url" class="input-medium widget_input_box form-control"  title="Twimlet Url" value="" name="twilio_twimlet_url" placeholder="Twimlet Url"></input>
                    </div> 
			    </div>    

                <span id="twilio_recording" style="display:none;">
<div class="checkbox">
<label class="i-checks i-checks-sm">
<input type="checkbox" id="twilio_record" name="twilio_record" title="Record Calls"></input><i></i> Record Calls
</label>
</div>
</span>                         
              
                 
              <span id="error-number-not-selected" class="help-inline text-danger" style="display:none;">Please select either Twilio number or Verified Caller ID.</span>
              <span id="note-number-not-available" class="help-inline text-danger" style="display:none;"></span>
<div class="m-t">
              <a href="#" id="validate_account" class="btn btn-sm btn-primary">Validate</a>
			  <a href="#" id="save_prefs" class="btn btn-sm btn-primary" style="display:none;">Save</a>
			  <a href="#add-widget" class="btn btn-default btn-sm ml_5">Cancel</a>
</div>              
		 </fieldset>
<br><a href="#voicemail" class="text-info">Manage voicemails</a>
    </form>
</div>
</script>



<script id="twilioio-dialpad-template" type="text/html">
<div id="dialpad_in_twilio" class="m-t-sm m-b-sm pull-right" style="display:none;"> 

  <div class="w-full bg-transparent" style="border-collapse: collapse;border-spacing: 0;display: table;">
   <div style="display: table-row-group;vertical-align: middle;border-color: inherit;"> 
    <div style="display: table-row;vertical-align: inherit;border-color: inherit;">
    <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="1" class="button1" id="button1" onclick="twilioSendDTMF('1');"></div>
    <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="2" class="button2" id="button2" onclick="twilioSendDTMF('2');"></div>
    <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="3" class="button3" id="button3" onclick="twilioSendDTMF('3');"></div>
    </div>
    <div style="display: table-row;vertical-align: inherit;border-color: inherit;">
    <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="4" class="button4" id="button4" onclick="twilioSendDTMF('4');"></div>
    <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="5" class="button5" id="button5" onclick="twilioSendDTMF('5');"></div>
    <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="6" class="button6" id="button6" onclick="twilioSendDTMF('6');"></div>
    </div>
    <div style="display: table-row;vertical-align: inherit;border-color: inherit;">
    <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="7" class="button7" id="button7" onclick="twilioSendDTMF('7');"></div>
    <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="8" class="button8" id="button8" onclick="twilioSendDTMF('8');"></div>
    <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="9" class="button9" id="button9" onclick="twilioSendDTMF('9');"></div>
    </div>
    <div style="display: table-row;vertical-align: inherit;border-color: inherit;">
    <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="*" class="buttonstar" id="buttonstar" style="width:94%;" onclick="twilioSendDTMF('*');"></div>
    <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="0" class="button0" id="button0" onclick="twilioSendDTMF('0');"></div>
    <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="#" class="buttonpound" id="buttonpound" onclick="twilioSendDTMF('#');"></div>
    </div>
    </div>
</div>
</div>
<div style="clear:both"></div>
</script>

<script id="twilioio-voicemail-template" type="text/html">
{{#if this}}
<div class="btn-group dropup pull-left">
<button class="btn btn-sm btn-default" id="noty_twilio_voicemail" data-length="{{length}}" data-src="{{this.0.extension}}">Leave Voicemail</button>
{{#ifCond length "greaterthan" 1}}
<button class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" onclick="voiceMailDropAction()" id="splitButtonVoicemail" ><span class="caret"></span></button>
<ul class="dropdown-menu text-left text-base">
{{#each this}}
<li><a href="#" data-src="{{extension}}" class="voiceMailItem">{{name}}</a></li>
{{/each}}
</ul>
{{/ifCond}}
</div>
{{/if}}
</script>
