<script id="documents-collection-template" type="text/html">
<div class="custom-animated custom-fadeInUp">
<div class="wrapper-md lter bg-light b-b">
<div class="row">
    <div class="col-md-12">
            <h3 class="pull-left font-thin h3">Documents</h3>
            <a href="#documents-add" class="documents-add btn btn-default btn-addon pull-right btn-sm"><i class="fa fa-plus-circle" /> Add Document</a>
			<div class="clearfix"></div>
    </div>
</div>
</div>
<div class="wrapper-md">
<div class="row">
		{{#unless this.length}}
		<div class="col-md-9">
		<div class="alert-info alert">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">There are no documents </h3>
                    <div class="text">
						You can add document by clicking the button below or the one on the right side of the page.
                    </div>
                    <a href="#" class="documents-add btn btn-default btn-sm m-t-xs"><i class="fa fa-plus-circle"></i>  Add Document</a>
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
		</div>
		{{/unless}}
        {{#if this.length}}
          <div class="col-sm-9 col-md-9 table-responsive">
			<div class="panel panel-default">
			    <div class="panel-heading">Documents List</div>
                <table class="table table-striped showCheckboxes m-b-none panel agile-table" url="core/api/documents/bulk" id="document-list">
                    <thead>
                        <tr>
                            <th style="width:30%">Title</th>
                            <th style="width:30%">Related Contacts</th>
                            <th style="width:20%">Uploaded Date</th>
							<th style="width:20%">Owner</th>
                        </tr>
                    </thead>
                    <tbody id="documents-model-list" class="c-p">
                    </tbody>
                </table>
			</div>
		</div>
        {{/if}}
    <div class="col-md-3">
        <div class="data-block">
            
                <h4 class="m-t-none m-b-sm h4">
                    How to use Documents?
                </h4>                
                <p>You can attach Documents to Contacts or Deals to add more context. Upload documents from your computer or attach them from cloud storage like Google Drive.</p>
            
        </div>
    </div>
</div>
</div>
</div>
</script>

<script id="documents-model-template" type="text/html">
<td data="{{id}}" class="data">
<div class="pull-left inline-block table-resp" style="max-width:90%;width:auto;"><a class="text-cap">{{name}}</a></div>
<div class="pull-left m-l-xs">
<b class="activate-link" style="display:none;"><a href="{{url}}" target="_blank"><i class="icon-external-link" title="Open Document"></i></a></b>
</div>
<div class="clearfix"></div>
</div>
	<div>
		<small class="text-muted">{{network network_type}}&nbsp;&nbsp;</small>
	</div>
</td>
<td class="overflow-hidden no-wrap">
	<div class="text-ellipsis inline-block" style="width:128px">
<div  style="width:128px">
		{{#each contacts}}
        	{{#if_contact_type "PERSON"}}
        		<a href="#contact/{{id}}" class="activate-link thumb-sm"><img class="img-inital r r-2x" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" /></a>
        	{{/if_contact_type}}
			{{#if_contact_type "COMPANY"}}
        		<a href="#contact/{{id}}" class="activate-link thumb-sm"><img class="r r-2x" {{getCompanyImage "40" "display:inline;"}} title="{{getPropertyValue properties "name"}}"/></a>
        	{{/if_contact_type}}
        {{/each}}
	</div>
</div>
{{#if_greater this.contacts.length "4"}}<span>...</span>{{/if_greater}}
</td>
<td class="text-muted">
	<div class="table-resp">
		<i class="fa fa-clock-o m-r-xs"></i>
		<time class="document-created-time b-b-dotted" value="{{uploaded_time}}" datetime="{{epochToHumanDate "" uploaded_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" uploaded_time}}</time>
	</div>
</td><td>
    <div class="thumb-sm avatar">
       {{#if ownerPic}}
        <img class="r r-2x" src="{{ownerPic}}"  title="{{owner.name}}" />
	   {{else}}
       {{/if}}
    </div>
</td>
</script>