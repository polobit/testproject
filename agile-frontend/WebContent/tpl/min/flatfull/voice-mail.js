<script id="voice-mail-collection-template" type="text/html">
<div class="col">
    <div class="hbox h-auto m-b-lg">
	  <div class="panel panel-default">
		<div class="panel-heading">
            <div class="pull-left m-t-xs">Voicemail List</div>
			<div class="pull-right">
            	<a href="#voice-mail-add" class="voice-mail-add btn btn-default btn-sm btn-addon" id="addEmailTemplate">
           		 <span><i class="icon-plus-sign"></i></span> Add Voicemail</a>
			</div>
			<div class="clearfix"></div>
        </div>
		<div>
			{{#unless this.length}}
		<div class="alert-info alert">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">There are no voicemails </h4>
                    <div class="text">
						You can add voicemail by clicking the button below or the one on the right side of the page.
                    </div>
                    <a href="#" class="m-t-xs voice-mail-add btn btn-default btn-sm"><i class="icon-plus-sign"></i>  Add Voicemail</a>
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
		{{/unless}}
        {{#if this.length}}
        <div class="data-block">
            <div class="data-container">
				<div class="panel panel-default">
                <table class="table table-striped showCheckboxes agile-table" url="core/api/voicemails/bulk" id="voicemail-list">
				 <col width="30px"><col width="35%"><col width="35%"><col width="20%"><col width="10%">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>File name</th>
                            <th>Uploaded</th>
							<th></th>
                        </tr>
                    </thead>
                    <tbody id="voice-mail-model-list" style="cursor:pointer;">
                    </tbody>
                </table>
				</div>
            </div>
        </div>
        {{/if}}
		</div>
	   </div>	   
    </div>
</div>
<div class="col w-md">
	<div class="data-block">
        <div class="p-l p-r">
            <h4 class="m-t-none">How to use Voicemails?</h4>
			<p>When you call customers from Agile's telephony widgets, you have the option to leave a pre-recorded voicemail. You can manage your pre-recorded voicemail messages (WAV files) here and choose one of them when leaving a voicemails.</p>
		</div>
	</div>	
</div>
</script>

<script id="voice-mail-model-template" type="text/html">
<td data="{{id}}" class="data">
<div style="height:30px;">{{name}}</div>
</td>
<td>{{extension}}</td>
<td class="text-muted"><div style="width:10em;"><i class="fa fa-clock-o m-r-xs"></i><time class="document-created-time" value="{{uploaded_time}}" datetime="{{epochToHumanDate "" uploaded_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" uploaded_time}}</time></div></td>
<td><div class="tdVoiceMailOver" style="display:none;"><span class="audioPlay">&nbsp;&nbsp;
<i class="icon-play"></i>
<audio><source src="{{url}}" type="audio/wav"></audio>
</span></div></td>

</script>